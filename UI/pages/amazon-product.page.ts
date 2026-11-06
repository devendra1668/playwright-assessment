import type { Locator, Page } from '@playwright/test';

export class AmazonProductPage {
  constructor(private readonly page: Page) {}

  private get title(): Locator {
    return this.page.locator('#productTitle:visible').first();
  }

  private get mainImage(): Locator {
    return this.page.locator('#landingImage:visible').first();
  }

  async open(url: string): Promise<void> {
    await this.page.goto(url);
    await this.title.waitFor();
  }

  async returnToSearchResults(): Promise<void> {
    await this.page.goBack();
    await this.page.locator('[data-component-type="s-search-result"][data-asin]').first().waitFor();
  }

  async titleMatches(expectedTitle: string): Promise<boolean> {
    const actualTitle = await this.title.innerText();
    return actualTitle.toLowerCase().includes(expectedTitle.slice(0, 30).toLowerCase());
  }

  async hasMainImage(): Promise<boolean> {
    return this.mainImage.isVisible();
  }
}