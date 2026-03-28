const test = require('node:test');
const assert = require('node:assert/strict');
const { createApp } = require('../app');

let server;
let baseUrl;

test.before(async () => {
  const app = createApp({ connectToDatabase: false });

  server = await new Promise((resolve) => {
    const instance = app.listen(0, () => resolve(instance));
  });

  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
});

test.after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test('GET /api/health returns deployment-safe health metadata', async () => {
  const response = await fetch(`${baseUrl}/api/health`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.status, 'ok');
  assert.ok(typeof body.database === 'string');
  assert.ok(typeof body.aiConfigured === 'boolean');
  assert.ok(typeof body.emailConfigured === 'boolean');
});

test('unknown API routes return JSON 404 payloads', async () => {
  const response = await fetch(`${baseUrl}/api/does-not-exist`);
  const body = await response.json();

  assert.equal(response.status, 404);
  assert.match(body.message, /route not found/i);
});
