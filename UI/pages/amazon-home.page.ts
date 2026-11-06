import type { Locator, Page } from '@playwright/test';
import { AMAZON_BASE_URL } from './amazon.constants';

export class AmazonHomePage {
  constructor(private readonly page: Page) {}

  private get searchBox(): Locator {
    return this.page.locator('#twotabsearchtextbox');
  }

  async open(): Promise<void> {
    await this.page.goto(AMAZON_BASE_URL);
    await this.searchBox.waitFor();
  }

  async searchFor(query: string): Promise<void> {
    await this.searchBox.fill(query);
    await Promise.all([
      this.page.waitForURL((url) => url.searchParams.get('k') === query),
      this.page.locator('#nav-search-submit-button').click(),
    ]);
    await this.page.locator('[data-component-type="s-search-result"][data-asin]').first().waitFor();
  }
}