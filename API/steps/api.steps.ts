import { expect } from '@playwright/test';
import { Given, Then, When } from '@cucumber/cucumber';
import type { TestOrder } from '../../support/order-api';
import type { TestWorld } from '../../support/world';

Given('the isolated order API is ready', function (this: TestWorld) {
  expect(this.api).toBeDefined();
  expect(this.orderApi).toBeDefined();
});

When('I create an order and save its ID', async function (this: TestWorld) {
  const startedAt = Date.now();
  this.apiResponse = await this.api!.post('/orders', {
    data: { customerName: 'Parallel Test', item: 'wireless mouse', quantity: 1 },
  });
  this.recordLog(`[api] POST /orders -> ${this.apiResponse.status()} (${Date.now() - startedAt}ms)`);
  expect(this.apiResponse.status()).toBe(201);
  this.order = await this.apiResponse.json() as TestOrder;
  this.orderId = this.order.id;
});

Then('the order ID should be saved from the create response', function (this: TestWorld) {
  expect(Number.isInteger(this.orderId)).toBe(true);
  expect(this.order?.id).toBe(this.orderId);
});

When('I fetch the order by its saved ID', async function (this: TestWorld) {
  const startedAt = Date.now();
  this.apiResponse = await this.api!.get(`/orders/${this.orderId}`);
  this.recordLog(`[api] GET /orders/${this.orderId} -> ${this.apiResponse.status()} (${Date.now() - startedAt}ms)`);
  expect(this.apiResponse.status()).toBe(200);
  this.retrievedOrder = await this.apiResponse.json() as TestOrder;
});

Then('the fetched order should match the created order', function (this: TestWorld) {
  expect(this.retrievedOrder?.id).toBe(this.orderId);
  expect(this.retrievedOrder?.customerName).toBe(this.order?.customerName);
  expect(this.retrievedOrder?.item).toBe(this.order?.item);
  expect(this.retrievedOrder?.status).toBe('created');
});

When('I confirm the order using its saved ID', async function (this: TestWorld) {
  const startedAt = Date.now();
  this.apiResponse = await this.api!.patch(`/orders/${this.orderId}`, { data: { status: 'confirmed' } });
  this.recordLog(`[api] PATCH /orders/${this.orderId} -> ${this.apiResponse.status()} (${Date.now() - startedAt}ms)`);
  expect(this.apiResponse.status()).toBe(200);
});

Then('the fetched order should be confirmed', function (this: TestWorld) {
  expect(this.retrievedOrder?.id).toBe(this.orderId);
  expect(this.retrievedOrder?.status).toBe('confirmed');
});

When('I submit an order with invalid details', async function (this: TestWorld) {
  const startedAt = Date.now();
  this.apiResponse = await this.api!.post('/orders', {
    data: { customerName: 'Invalid Test', item: 'wireless mouse', quantity: 0 },
  });
  this.recordLog(`[api] POST /orders invalid payload -> ${this.apiResponse.status()} (${Date.now() - startedAt}ms)`);
});

Then('the API should reject the order details', async function (this: TestWorld) {
  expect(this.apiResponse?.status()).toBe(400);
  const body = await this.apiResponse!.json() as { error: string };
  expect(body.error).toBe('Invalid order details');
});

When('I fetch an order ID that does not exist', async function (this: TestWorld) {
  const startedAt = Date.now();
  this.apiResponse = await this.api!.get('/orders/999999');
  this.recordLog(`[api] GET /orders/999999 -> ${this.apiResponse.status()} (${Date.now() - startedAt}ms)`);
});

Then('the API should return an order not found response', async function (this: TestWorld) {
  expect(this.apiResponse?.status()).toBe(404);
  const body = await this.apiResponse!.json() as { error: string };
  expect(body.error).toBe('Order not found');
});

When('I attempt an unsupported status for the saved order', async function (this: TestWorld) {
  const startedAt = Date.now();
  this.apiResponse = await this.api!.patch(`/orders/${this.orderId}`, { data: { status: 'shipped' } });
  this.recordLog(`[api] PATCH /orders/${this.orderId} unsupported status -> ${this.apiResponse.status()} (${Date.now() - startedAt}ms)`);
});

Then('the API should reject the status update', async function (this: TestWorld) {
  expect(this.apiResponse?.status()).toBe(400);
  const body = await this.apiResponse!.json() as { error: string };
  expect(body.error).toBe('Unsupported order status');
});

Then('the order status should remain created', function (this: TestWorld) {
  expect(this.retrievedOrder?.id).toBe(this.orderId);
  expect(this.retrievedOrder?.status).toBe('created');
});