import { World, setWorldConstructor } from '@cucumber/cucumber';
import type { APIRequestContext, APIResponse, Browser, BrowserContext, Page } from '@playwright/test';
import type { AmazonCartPage } from '../UI/pages/amazon-cart.page';
import type { AmazonHomePage } from '../UI/pages/amazon-home.page';
import type { AmazonProductPage } from '../UI/pages/amazon-product.page';
import type { AmazonSearchPage } from '../UI/pages/amazon-search.page';
import type { OrderApiHandle, TestOrder } from './order-api';

class TestWorld extends World {
  logs: string[] = [];
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  amazonHome?: AmazonHomePage;
  amazonSearch?: AmazonSearchPage;
  amazonProduct?: AmazonProductPage;
  amazonCart?: AmazonCartPage;
  selectedProductTitle?: string;
  api?: APIRequestContext;
  apiResponse?: APIResponse;
  orderApi?: OrderApiHandle;
  orderId?: number;
  order?: TestOrder;
  retrievedOrder?: TestOrder;

  recordLog(message: string, echo = true): void {
    this.logs.push(message);
    if (echo) console.info(message);
  }
}

setWorldConstructor(TestWorld);

export type { TestWorld };