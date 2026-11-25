// File generated from our OpenAPI spec by Scalar. See README.md for details.

// Smoke tests for one resource; see smoke-support.ts for how to run them.
import { describe } from 'vitest';

import { client, smokeCase } from '../smoke-support';

describe.concurrent('resource listings', () => {
  smokeCase(
    'listings.list:required',
    { operation: 'list', path: '/listings' },
    'list: only required params',
    async () => {
      const listing = await client.listings.list({
        limit: 50,
      });
    },
  );
  smokeCase(
    'listings.list:all',
    { operation: 'list', path: '/listings' },
    'list: required and optional params',
    async () => {
      const listing = await client.listings.list({
        cursor: 'cursor',
        limit: 50,
        game: 'game',
        productId: [1],
        condition: 'NM',
        language: 'language',
        finish: 'Standard',
        graded: true,
        customId: 'customId',
        customIdPrefix: 'customIdPrefix',
        customIdContains: 'customIdContains',
        commentContains: 'commentContains',
        location: 'location',
        tags: ['Trade binder'],
      });
    },
  );
  smokeCase(
    'listings.create:required',
    { operation: 'create', path: '/inventory/{inventoryId}/listing' },
    'create: only required params',
    async () => {
      const listing = await client.listings.create('inventoryId', {
        price: { amount: 14.99, currency: 'USD' },
      });
    },
  );
  smokeCase(
    'listings.create:all',
    { operation: 'create', path: '/inventory/{inventoryId}/listing' },
    'create: required and optional params',
    async () => {
      const listing = await client.listings.create('inventoryId', {
        price: { amount: 14.99, currency: 'USD' },
        quantity: 1,
      });
    },
  );
  smokeCase(
    'listings.update:single',
    { operation: 'update', path: '/inventory/{inventoryId}/listing' },
    'update',
    async () => {
      const listing = await client.listings.update('inventoryId', {
        price: { amount: 14.99, currency: 'USD' },
      });
    },
  );
  smokeCase(
    'listings.delete:required',
    { operation: 'delete', path: '/inventory/{inventoryId}/listing' },
    'delete: only required params',
    async () => {
      const listing = await client.listings.delete('inventoryId');
    },
  );
  smokeCase(
    'listings.delete:all',
    { operation: 'delete', path: '/inventory/{inventoryId}/listing' },
    'delete: required and optional params',
    async () => {
      const listing = await client.listings.delete('inventoryId', {
        quantity: 1,
      });
    },
  );
});
