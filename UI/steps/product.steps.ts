import { expect } from '@playwright/test';
import { Then, When } from '@cucumber/cucumber';
import type { TestWorld } from '../../support/world';

When('I open the first search result', async function (this: TestWorld) {
  const product = await this.amazonSearch!.firstProduct();
  this.selectedProductTitle = product.title;
  await this.amazonProduct!.open(product.url);
});

Then('the selected product title should be visible', async function (this: TestWorld) {
  expect(await this.amazonProduct!.titleMatches(this.selectedProductTitle!)).toBe(true);
});

Then('the main product image should be visible', async function (this: TestWorld) {
  expect(await this.amazonProduct!.hasMainImage()).toBe(true);
});

When('I return to the search results', async function (this: TestWorld) {
  await this.amazonProduct!.returnToSearchResults();
});

Then('the search query should still be {string}', async function (this: TestWorld, query: string) {
  expect(await this.amazonSearch!.showsQuery(query)).toBe(true);
  expect(await this.amazonSearch!.hasResults()).toBe(true);
});