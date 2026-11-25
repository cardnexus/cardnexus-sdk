// File generated from our OpenAPI spec by Scalar. See README.md for details.

// Smoke tests for one resource; see smoke-support.ts for how to run them.
import { describe } from 'vitest';

import { client, smokeCase } from '../../smoke-support';

describe.concurrent('resource items', () => {
  smokeCase('cart.items.create:single', { operation: 'create', path: '/cart/items' }, 'create', async () => {
    const item = await client.cart.items.create({
      deliveryCountry: 'xx',
      items: [
        {
          listingId: 'x',
          quantity: 1,
        },
      ],
    });
  });
  smokeCase(
    'cart.items.update:single',
    { operation: 'update', path: '/cart/items/{listingId}' },
    'update',
    async () => {
      const cart = await client.cart.items.update('listingId', {
        quantity: 0,
      });
    },
  );
  smokeCase(
    'cart.items.delete:required',
    { operation: 'delete', path: '/cart/items/{listingId}' },
    'delete: only required params',
    async () => {
      const cart = await client.cart.items.delete('listingId');
    },
  );
  smokeCase(
    'cart.items.delete:all',
    { operation: 'delete', path: '/cart/items/{listingId}' },
    'delete: required and optional params',
    async () => {
      const cart = await client.cart.items.delete('listingId', {});
    },
  );
});
