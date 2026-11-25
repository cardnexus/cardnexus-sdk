// File generated from our OpenAPI spec by Scalar. See README.md for details.

// Smoke tests for one resource; see smoke-support.ts for how to run them.
import { describe } from 'vitest';

import { client, smokeCase } from '../smoke-support';

describe.concurrent('resource bulkOperations', () => {
  smokeCase(
    'bulkOperations.import:required',
    { operation: 'import', path: '/inventory/bulk/import' },
    'import: only required params',
    async () => {
      const bulkOperation = await client.bulkOperations.import({
        file: '',
        mode: 'upsert',
      });
    },
  );
  smokeCase(
    'bulkOperations.import:all',
    { operation: 'import', path: '/inventory/bulk/import' },
    'import: required and optional params',
    async () => {
      const bulkOperation = await client.bulkOperations.import({
        file: '',
        mode: 'upsert',
        format: 'json',
      });
    },
  );
  smokeCase(
    'bulkOperations.importCardmarket:single',
    { operation: 'importCardmarket', path: '/inventory/bulk/import/cardmarket' },
    'importCardmarket',
    async () => {
      const bulkOperation = await client.bulkOperations.importCardmarket({
        file: '',
        mode: 'upsert',
      });
    },
  );
  smokeCase(
    'bulkOperations.importTcgplayer:single',
    { operation: 'importTcgplayer', path: '/inventory/bulk/import/tcgplayer' },
    'importTcgplayer',
    async () => {
      const bulkOperation = await client.bulkOperations.importTcgplayer({
        file: '',
        mode: 'upsert',
      });
    },
  );
  smokeCase(
    'bulkOperations.importTcgPowerTools:single',
    { operation: 'importTcgPowerTools', path: '/inventory/bulk/import/tcgpowertools' },
    'importTcgPowerTools',
    async () => {
      const bulkOperation = await client.bulkOperations.importTcgPowerTools({
        file: '',
        mode: 'upsert',
      });
    },
  );
  smokeCase(
    'bulkOperations.export:required',
    { operation: 'export', path: '/inventory/bulk/export' },
    'export: only required params',
    async () => {
      const bulkOperation = await client.bulkOperations.export({
        format: 'json',
      });
    },
  );
  smokeCase(
    'bulkOperations.export:all',
    { operation: 'export', path: '/inventory/bulk/export' },
    'export: required and optional params',
    async () => {
      const bulkOperation = await client.bulkOperations.export({
        'Accept-Language': 'fr',
        format: 'json',
        filters: {
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
          expansionId: [42, 118],
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
          quantity: {},
          listingPrice: {},
          gameFilters: {
            game: 'sorcery',
            filters: {},
          },
        },
      });
    },
  );
  smokeCase(
    'bulkOperations.update:single',
    { operation: 'update', path: '/inventory/bulk/update' },
    'update',
    async () => {
      const bulkOperation = await client.bulkOperations.update({
        items: [{}],
      });
    },
  );
  smokeCase(
    'bulkOperations.retrieveJob:single',
    { operation: 'retrieveJob', path: '/inventory/bulk/jobs/{jobId}' },
    'retrieveJob',
    async () => {
      const bulkOperation = await client.bulkOperations.retrieveJob('jobId');
    },
  );
});
