import { mkdir } from 'node:fs/promises';
import { readFile, unlink } from 'node:fs/promises';
import { join } from 'node:path';
import { After, Before, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, firefox, request, webkit } from '@playwright/test';
import type { BrowserType } from '@playwright/test';
import { AmazonCartPage } from '../UI/pages/amazon-cart.page';
import { AmazonHomePage } from '../UI/pages/amazon-home.page';
import { AmazonProductPage } from '../UI/pages/amazon-product.page';
import { AmazonSearchPage } from '../UI/pages/amazon-search.page';
import { startOrderApi } from './order-api';
import type { TestWorld } from './world';

setDefaultTimeout(60_000);

const browsers: Record<string, BrowserType> = { chromium, firefox, webkit };

Before({ tags: '@ui' }, async function (this: TestWorld) {
  this.logs = [];
  const browserName = process.env.BROWSER ?? 'chromium';
  const browserType = browsers[browserName];
  if (!browserType) throw new Error(`Unsupported browser: ${browserName}`);

  await mkdir(join('artifacts', 'videos'), { recursive: true });
  this.browser = await browserType.launch({ headless: false, timeout: 30_000 });
  this.context = await this.browser.newContext({
    recordVideo: { dir: join('artifacts', 'videos'), size: { width: 1280, height: 720 } },
  });
  await this.context.tracing.start({ screenshots: true, snapshots: true, sources: true });
  this.page = await this.context.newPage();
  this.page.setDefaultTimeout(20_000);
  this.page.setDefaultNavigationTimeout(30_000);
  this.page.on('console', (message) => {
    if (message.type() === 'error') this.recordLog(`[browser:console] ${message.text()}`, false);
  });
  this.page.on('pageerror', (error) => this.recordLog(`[browser:error] ${error.message}`, false));
  this.page.on('requestfailed', (request) => {
    this.recordLog(`[browser:requestfailed] ${request.method()} ${request.url()} ${request.failure()?.errorText ?? ''}`, false);
  });
  this.amazonHome = new AmazonHomePage(this.page);
  this.amazonSearch = new AmazonSearchPage(this.page);
  this.amazonProduct = new AmazonProductPage(this.page);
  this.amazonCart = new AmazonCartPage(this.page);
  this.recordLog(`[ui] Started headed ${browserName} for scenario`);
});

Before({ tags: '@api' }, async function (this: TestWorld) {
  this.logs = [];
  this.orderApi = await startOrderApi();
  this.api = await request.newContext({
    baseURL: this.orderApi.baseURL,
    extraHTTPHeaders: { Accept: 'application/json' },
    timeout: 30_000,
  });
  this.recordLog('[api] Started isolated order API for scenario');
});

After(async function (this: TestWorld, { pickle, result }) {
  const failed = result?.status === Status.FAILED;
  const scenarioName = pickle.name.replace(/[^a-z0-9]+/gi, '-');
  const tracePath = join('artifacts', 'traces', `${scenarioName}-${Date.now()}.zip`);
  const video = this.page?.video();

  try {
    if (failed && this.page) await this.attach(await this.page.screenshot(), 'image/png');

    if (this.context) {
      if (failed) await mkdir(join('artifacts', 'traces'), { recursive: true });
      await this.context.tracing.stop(failed ? { path: tracePath } : undefined);
      await this.context.close();
    }

    if (video) {
      const videoPath = await video.path();
      if (failed) {
        await this.attach(await readFile(videoPath), 'video/webm');
      } else {
        await unlink(videoPath).catch(() => undefined);
      }
    }

    if (failed && this.context) {
      await this.attach(await readFile(tracePath), 'application/zip');
    }
    if (failed && this.logs.length > 0) {
      await this.attach(this.logs.join('\n'), 'text/plain');
    }
  } finally {
    await this.api?.dispose();
    await this.orderApi?.close();
    await this.browser?.close();
  }
});