// File generated from our OpenAPI spec by Scalar. See README.md for details.

// Smoke tests for one resource; see smoke-support.ts for how to run them.
import { describe } from 'vitest';

import { client, smokeCase } from '../smoke-support';

describe.concurrent('resource lines', () => {
  smokeCase(
    'lines.list:required',
    { operation: 'list', path: '/inventory' },
    'list: only required params',
    async () => {
      const line = await client.lines.list({
        limit: 50,
      });
    },
  );
  smokeCase(
    'lines.list:all',
    { operation: 'list', path: '/inventory' },
    'list: required and optional params',
    async () => {
      const line = await client.lines.list({
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
        forSale: true,
      });
    },
  );
  smokeCase('lines.create:single', { operation: 'create', path: '/inventory' }, 'create', async () => {
    const line = await client.lines.create({
      lines: [
        {
          productId: 50212,
          finish: 'Standard',
          language: 'x',
          quantity: 1,
        },
      ],
    });
  });
  smokeCase(
    'lines.search:required',
    { operation: 'search', path: '/inventory/search' },
    'search: only required params',
    async () => {
      const line = await client.lines.search({
        offset: 0,
        limit: 50,
        includeTotal: false,
        includeMarket: false,
        changePeriod: 'week',
        weightByQuantity: false,
      });
    },
  );
  smokeCase(
    'lines.search:all',
    { operation: 'search', path: '/inventory/search' },
    'search: required and optional params',
    async () => {
      const line = await client.lines.search({
        'Accept-Language': 'fr',
        offset: 0,
        limit: 50,
        name: 'x',
        printNumber: 'ST02-44',
        nameSlug: 'x',
        customId: 'x',
        customIdPrefix: 'x',
        customIdContains: 'x',
        commentContains: 'x',
        inventoryIds: ['x'],
        customIds: ['x'],
        productIds: [0],
        expansionId: [0],
        tags: {
          op: 'and',
          values: ['Trade binder'],
        },
        location: {
          op: 'and',
          values: ['Trade binder'],
        },
        condition: {
          op: 'and',
          values: ['NM'],
        },
        language: {
          op: 'and',
          values: ['x'],
        },
        finish: {
          op: 'and',
          values: ['Standard'],
        },
        productType: {
          op: 'and',
          values: ['card'],
        },
        productCategory: 'x',
        graded: false,
        forSale: false,
        quantity: {
          min: 0,
          max: 0,
        },
        listingPrice: {
          min: 0,
          max: 0,
        },
        gameFilters: {
          game: 'sorcery',
          filters: {},
        },
        updatedSince: '2024-01-01T00:00:00.000Z',
        marketPrice: {
          min: 0,
          max: 0,
        },
        hasMarketPrice: false,
        priceVsMarket: {
          minPercent: 0,
          maxPercent: 0,
        },
        priceCheckGroup: 'way-above',
        marketChange: {
          period: 'week',
          minPercent: 0,
          maxPercent: 0,
        },
        cursor: 'x',
        includeTotal: false,
        includeMarket: false,
        sortBy: 'name',
        sortDirection: 'asc',
        changePeriod: 'week',
        weightByQuantity: false,
      });
    },
  );
  smokeCase(
    'lines.retrieve:single',
    { operation: 'retrieve', path: '/inventory/{inventoryId}' },
    'retrieve',
    async () => {
      const line = await client.lines.retrieve('inventoryId');
    },
  );
  smokeCase(
    'lines.update:required',
    { operation: 'update', path: '/inventory/{inventoryId}' },
    'update: only required params',
    async () => {
      const line = await client.lines.update('inventoryId');
    },
  );
  smokeCase(
    'lines.update:all',
    { operation: 'update', path: '/inventory/{inventoryId}' },
    'update: required and optional params',
    async () => {
      const line = await client.lines.update('inventoryId', {
        quantity: {
          set: 1,
        },
        condition: 'NM',
        language: 'x',
        finish: 'Standard',
        graded: { grade: '9.5', certification: '0084712663', gradingService: 'PSA' },
        customId: 'YRG|5555-5DS1-2EX-006-f-2-2008-08-01',
        comment: 'Slight edge wear on the back corner',
        notes: 'Bought at the March show, restock from supplier A',
        location: 'Trade binder',
        tags: {
          set: ['Trade binder'],
        },
        photos: ['https://example.com'],
        count: 1,
      });
    },
  );
  smokeCase(
    'lines.delete:required',
    { operation: 'delete', path: '/inventory/{inventoryId}' },
    'delete: only required params',
    async () => {
      const line = await client.lines.delete('inventoryId');
    },
  );
  smokeCase(
    'lines.delete:all',
    { operation: 'delete', path: '/inventory/{inventoryId}' },
    'delete: required and optional params',
    async () => {
      const line = await client.lines.delete('inventoryId', {});
    },
  );
  smokeCase(
    'lines.setMedia:single',
    { operation: 'setMedia', path: '/inventory/{inventoryId}/media' },
    'setMedia',
    async () => {
      const line = await client.lines.setMedia('inventoryId', {
        files: [''],
      });
    },
  );
});
