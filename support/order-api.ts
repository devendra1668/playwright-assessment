import { createServer } from 'node:http';
import type { IncomingMessage, Server, ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';

export type TestOrder = {
  id: number;
  customerName: string;
  item: string;
  quantity: number;
  status: 'created' | 'confirmed';
};

export type OrderApiHandle = {
  baseURL: string;
  close: () => Promise<void>;
};

function sendJson(response: ServerResponse, status: number, body?: unknown): void {
  response.statusCode = status;
  if (body === undefined) {
    response.end();
    return;
  }
  response.setHeader('content-type', 'application/json');
  response.end(JSON.stringify(body));
}

async function readJsonBody(request: IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const body = Buffer.concat(chunks).toString('utf8');
  return body ? JSON.parse(body) as Record<string, unknown> : {};
}

async function handleRequest(
  request: IncomingMessage,
  response: ServerResponse,
  orders: Map<number, TestOrder>,
  nextId: { value: number },
): Promise<void> {
  const pathname = new URL(request.url ?? '/', 'http://127.0.0.1').pathname;

  if (request.method === 'POST' && pathname === '/orders') {
    const body = await readJsonBody(request);
    if (
      typeof body.customerName !== 'string'
      || typeof body.item !== 'string'
      || typeof body.quantity !== 'number'
      || !Number.isInteger(body.quantity)
      || body.quantity < 1
    ) {
      sendJson(response, 400, { error: 'Invalid order details' });
      return;
    }

    const order: TestOrder = {
      id: nextId.value++,
      customerName: body.customerName,
      item: body.item,
      quantity: body.quantity,
      status: 'created',
    };
    orders.set(order.id, order);
    sendJson(response, 201, order);
    return;
  }

  const orderPath = /^\/orders\/(\d+)$/.exec(pathname);
  if (!orderPath) {
    sendJson(response, 404, { error: 'Route not found' });
    return;
  }

  const orderId = Number(orderPath[1]);
  const order = orders.get(orderId);
  if (!order) {
    sendJson(response, 404, { error: 'Order not found' });
    return;
  }

  if (request.method === 'GET') {
    sendJson(response, 200, order);
    return;
  }

  if (request.method === 'PATCH') {
    const body = await readJsonBody(request);
    if (body.status !== 'confirmed') {
      sendJson(response, 400, { error: 'Unsupported order status' });
      return;
    }
    const updatedOrder: TestOrder = { ...order, status: 'confirmed' };
    orders.set(orderId, updatedOrder);
    sendJson(response, 200, updatedOrder);
    return;
  }

  sendJson(response, 405, { error: 'Method not allowed' });
}

export async function startOrderApi(): Promise<OrderApiHandle> {
  const orders = new Map<number, TestOrder>();
  const nextId = { value: 1 };
  const server: Server = createServer((request, response) => {
    void handleRequest(request, response, orders, nextId).catch((error: unknown) => {
      console.error('[order-api] Request failed', error);
      sendJson(response, 400, { error: 'Invalid request' });
    });
  });

  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => resolve());
  });

  const address = server.address() as AddressInfo;
  return {
    baseURL: `http://127.0.0.1:${address.port}`,
    close: () => new Promise<void>((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    }),
  };
}