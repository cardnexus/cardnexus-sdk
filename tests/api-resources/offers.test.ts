// File generated from our OpenAPI spec by Scalar. See README.md for details.

// Smoke tests for one resource; see smoke-support.ts for how to run them.
import { describe } from 'vitest';

import { client, smokeCase } from '../smoke-support';

describe.concurrent('resource offers', () => {
  smokeCase(
    'offers.list:required',
    { operation: 'list', path: '/offers' },
    'list: only required params',
    async () => {
      const offer = await client.offers.list({
        limit: 50,
      });
    },
  );
  smokeCase(
    'offers.list:all',
    { operation: 'list', path: '/offers' },
    'list: required and optional params',
    async () => {
      const offer = await client.offers.list({
        cursor: 'cursor',
        limit: 50,
        role: 'buyer',
        status: 'pending',
        createdFrom: '2024-08-14T10:23:11.000Z',
        createdTo: '2024-08-14T10:23:11.000Z',
      });
    },
  );
  smokeCase('offers.create:single', { operation: 'create', path: '/offers' }, 'create', async () => {
    const offer = await client.offers.create({
      items: [{ listingId: '665f3a2b1c8d4e9f7a6b5c52', quantity: 2 }],
      total: { amount: 25, currency: 'EUR' },
    });
  });
  smokeCase(
    'offers.retrieve:single',
    { operation: 'retrieve', path: '/offers/{offerId}' },
    'retrieve',
    async () => {
      const offer = await client.offers.retrieve('665f3a2b1c8d4e9f7a6b5c59');
    },
  );
  smokeCase(
    'offers.counter:single',
    { operation: 'counter', path: '/offers/{offerId}/counter' },
    'counter',
    async () => {
      const offer = await client.offers.counter('665f3a2b1c8d4e9f7a6b5c59', {
        proposalId: '665f3a2b1c8d4e9f7a6b5c60',
        total: { amount: 26, currency: 'EUR' },
      });
    },
  );
  smokeCase(
    'offers.accept:single',
    { operation: 'accept', path: '/offers/{offerId}/accept' },
    'accept',
    async () => {
      const offer = await client.offers.accept('665f3a2b1c8d4e9f7a6b5c59', {
        proposalId: '665f3a2b1c8d4e9f7a6b5c60',
      });
    },
  );
  smokeCase(
    'offers.decline:single',
    { operation: 'decline', path: '/offers/{offerId}/decline' },
    'decline',
    async () => {
      const offer = await client.offers.decline('665f3a2b1c8d4e9f7a6b5c59', {
        proposalId: '665f3a2b1c8d4e9f7a6b5c60',
      });
    },
  );
  smokeCase(
    'offers.cancel:required',
    { operation: 'cancel', path: '/offers/{offerId}/cancel' },
    'cancel: only required params',
    async () => {
      const offer = await client.offers.cancel('665f3a2b1c8d4e9f7a6b5c59');
    },
  );
  smokeCase(
    'offers.cancel:all',
    { operation: 'cancel', path: '/offers/{offerId}/cancel' },
    'cancel: required and optional params',
    async () => {
      const offer = await client.offers.cancel('665f3a2b1c8d4e9f7a6b5c59', {});
    },
  );
  smokeCase(
    'offers.createToCart:required',
    { operation: 'createToCart', path: '/offers/{offerId}/add-to-cart' },
    'createToCart: only required params',
    async () => {
      const offer = await client.offers.createToCart('665f3a2b1c8d4e9f7a6b5c59');
    },
  );
  smokeCase(
    'offers.createToCart:all',
    { operation: 'createToCart', path: '/offers/{offerId}/add-to-cart' },
    'createToCart: required and optional params',
    async () => {
      const offer = await client.offers.createToCart('665f3a2b1c8d4e9f7a6b5c59', {});
    },
  );
});
