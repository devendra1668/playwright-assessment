import type { Locator, Page } from '@playwright/test';
import { AMAZON_BASE_URL } from './amazon.constants';

export class AmazonSearchPage {
  constructor(private readonly page: Page) {}

  private get resultCards(): Locator {
    return this.page.locator('[data-component-type="s-search-result"][data-asin]');
  }

  private get searchBox(): Locator {
    return this.page.locator('#twotabsearchtextbox');
  }

  private get priceSort(): Locator {
    return this.page.locator('#s-result-sort-select');
  }

  async open(query: string): Promise<void> {
    await this.page.goto(`${AMAZON_BASE_URL}/s?k=${encodeURIComponent(query)}`);
    await this.resultCards.first().waitFor();
  }

  async firstProduct(): Promise<{ title: string; url: string }> {
    const firstResult = this.resultCards.first();
    const title = (await firstResult.locator('h2').innerText()).trim();
    const asin = await firstResult.getAttribute('data-asin');
    if (!asin) throw new Error('The first Amazon search result did not have an ASIN');
    return { title, url: `${AMAZON_BASE_URL}/dp/${asin}` };
  }

  async sortPriceLowToHigh(): Promise<void> {
    await this.priceSort.selectOption('price-asc-rank');
    await this.resultCards.first().waitFor();
  }

  async resultCount(): Promise<number> {
    return this.resultCards.count();
  }

  async showsQuery(query: string): Promise<boolean> {
    return (await this.searchBox.inputValue()) === query;
  }

  async hasResults(): Promise<boolean> {
    return (await this.resultCount()) > 0;
  }

  async hasLowToHighPriceSort(): Promise<boolean> {
    return (await this.priceSort.inputValue()) === 'price-asc-rank';
  }
}