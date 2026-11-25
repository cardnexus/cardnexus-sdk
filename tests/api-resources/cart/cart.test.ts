// File generated from our OpenAPI spec by Scalar. See README.md for details.

// Smoke tests for one resource; see smoke-support.ts for how to run them.
import { describe } from 'vitest';

import { client, smokeCase } from '../../smoke-support';

describe.concurrent('resource cart', () => {
  smokeCase('cart.list:single', { operation: 'list', path: '/cart' }, 'list', async () => {
    const cart = await client.cart.list();
  });
  smokeCase('cart.clear:single', { operation: 'clear', path: '/cart' }, 'clear', async () => {
    const cart = await client.cart.clear({});
  });
});
