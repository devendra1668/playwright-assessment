import { expect } from '@playwright/test';
import { Given, Then, When } from '@cucumber/cucumber';
import type { TestWorld } from '../../support/world';

Given('I open the Amazon cart page', async function (this: TestWorld) {
  await this.amazonCart!.open();
});

When('I open the cart from the header', async function (this: TestWorld) {
  await this.amazonCart!.openFromHeader();
});

Then('the Amazon cart page should be visible', async function (this: TestWorld) {
  expect(await this.amazonCart!.isOpen()).toBe(true);
});

Then('the anonymous cart should be empty', async function (this: TestWorld) {
  expect(await this.amazonCart!.isEmpty()).toBe(true);
});