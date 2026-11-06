import type { Locator, Page } from '@playwright/test';
import { AMAZON_BASE_URL } from './amazon.constants';

export class AmazonCartPage {
  constructor(private readonly page: Page) { }

  private get heading(): Locator {
    return this.page.getByText('Your Amazon Cart', { exact: true });
  }

  private get emptyMessage(): Locator {
    return this.page.getByText(/your amazon cart is empty/i);
  }

  async open(): Promise<void> {
    await this.page.goto(`${AMAZON_BASE_URL}/gp/cart/view.html`);
    await this.heading.first().waitFor();
  }

  async openFromHeader(): Promise<void> {
    await this.page.locator('#nav-cart').click();
    await this.heading.first().waitFor();
  }

  async isOpen(): Promise<boolean> {
    return this.heading.first().isVisible();
  }

  async isEmpty(): Promise<boolean> {
    return this.emptyMessage.isVisible();
  }
}