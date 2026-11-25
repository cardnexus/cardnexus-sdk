// File generated from our OpenAPI spec by Scalar. See README.md for details.

// Smoke tests for one resource; see smoke-support.ts for how to run them.
import { describe } from 'vitest';

import { client, smokeCase } from '../smoke-support';

describe.concurrent('resource pricing', () => {
  smokeCase(
    'pricing.listProductPrices:single',
    { operation: 'listProductPrices', path: '/products/{productId}/prices' },
    'listProductPrices',
    async () => {
      const pricing = await client.pricing.listProductPrices('productId');
    },
  );
  smokeCase(
    'pricing.listHistory:required',
    { operation: 'listHistory', path: '/products/{productId}/prices/history' },
    'listHistory: only required params',
    async () => {
      const pricing = await client.pricing.listHistory('productId');
    },
  );
  smokeCase(
    'pricing.listHistory:all',
    { operation: 'listHistory', path: '/products/{productId}/prices/history' },
    'listHistory: required and optional params',
    async () => {
      const pricing = await client.pricing.listHistory('productId', {
        marketplace: 'cardmarket',
        finish: 'Standard',
        from: '2026-05-11',
        to: '2026-06-10',
      });
    },
  );
  smokeCase(
    'pricing.listSales:required',
    { operation: 'listSales', path: '/products/{productId}/sales' },
    'listSales: only required params',
    async () => {
      const pricing = await client.pricing.listSales('productId', {
        limit: 50,
      });
    },
  );
  smokeCase(
    'pricing.listSales:all',
    { operation: 'listSales', path: '/products/{productId}/sales' },
    'listSales: required and optional params',
    async () => {
      const pricing = await client.pricing.listSales('productId', {
        cursor: 'cursor',
        limit: 50,
        finish: 'Standard',
        condition: 'NM',
        language: 'language',
      });
    },
  );
});
