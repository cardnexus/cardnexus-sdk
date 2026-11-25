// File generated from our OpenAPI spec by Scalar. See README.md for details.

// Smoke tests for one resource; see smoke-support.ts for how to run them.
import { describe } from 'vitest';

import { client, smokeCase } from '../smoke-support';

describe.concurrent('resource purchases', () => {
  smokeCase(
    'purchases.list:required',
    { operation: 'list', path: '/purchases' },
    'list: only required params',
    async () => {
      const purchase = await client.purchases.list({
        limit: 50,
        includeTotal: false,
      });
    },
  );
  smokeCase(
    'purchases.list:all',
    { operation: 'list', path: '/purchases' },
    'list: required and optional params',
    async () => {
      const purchase = await client.purchases.list({
        cursor: 'cursor',
        limit: 50,
        status: ['shipped'],
        placedFrom: '2024-08-14T10:23:11.000Z',
        placedTo: '2024-08-14T10:23:11.000Z',
        includeTotal: false,
        needsAction: true,
        dispute: 'any',
        shipByBefore: '2024-08-14T10:23:11.000Z',
        orderNumberPrefix: 'orderNumberPrefix',
        seller: 'seller',
      });
    },
  );
  smokeCase(
    'purchases.retrieve:single',
    { operation: 'retrieve', path: '/purchases/{orderNumber}' },
    'retrieve',
    async () => {
      const purchaseDetail = await client.purchases.retrieve('orderNumber');
    },
  );
});
