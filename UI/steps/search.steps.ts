import { expect } from '@playwright/test';
import { Given, Then, When } from '@cucumber/cucumber';
import type { TestWorld } from '../../support/world';

Given('I am on Amazon India', async function (this: TestWorld) {
  await this.amazonHome!.open();
});

Given('I search Amazon for {string}', async function (this: TestWorld, query: string) {
  await this.amazonSearch!.open(query);
});

When('I search for {string}', async function (this: TestWorld, query: string) {
  await this.amazonHome!.searchFor(query);
});

Then('Amazon results should show {string}', async function (this: TestWorld, query: string) {
  expect(await this.amazonSearch!.showsQuery(query)).toBe(true);
  expect(await this.amazonSearch!.hasResults()).toBe(true);
});

When('I sort results by price from low to high', async function (this: TestWorld) {
  await this.amazonSearch!.sortPriceLowToHigh();
});

Then('the low-to-high price option should be selected', async function (this: TestWorld) {
  expect(await this.amazonSearch!.hasLowToHighPriceSort()).toBe(true);
});

Then('search results should remain available', async function (this: TestWorld) {
  expect(await this.amazonSearch!.hasResults()).toBe(true);
});