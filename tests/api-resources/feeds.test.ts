// File generated from our OpenAPI spec by Scalar. See README.md for details.

// Smoke tests for one resource; see smoke-support.ts for how to run them.
import { describe } from 'vitest';

import { client, smokeCase } from '../smoke-support';

describe.concurrent('resource feeds', () => {
  smokeCase(
    'feeds.retrieve:single',
    { operation: 'retrieve', path: '/feeds/{gameId}' },
    'retrieve',
    async () => {
      const feed = await client.feeds.retrieve('gameId');
    },
  );
  smokeCase(
    'feeds.listCatalog:single',
    { operation: 'listCatalog', path: '/feeds/{gameId}/catalog' },
    'listCatalog',
    async () => {
      const feed = await client.feeds.listCatalog('gameId');
    },
  );
  smokeCase(
    'feeds.listExpansions:single',
    { operation: 'listExpansions', path: '/feeds/{gameId}/expansions' },
    'listExpansions',
    async () => {
      const feed = await client.feeds.listExpansions('gameId');
    },
  );
  smokeCase(
    'feeds.listPrices:single',
    { operation: 'listPrices', path: '/feeds/{gameId}/prices' },
    'listPrices',
    async () => {
      const feed = await client.feeds.listPrices('gameId');
    },
  );
  smokeCase(
    'feeds.listChangelog:required',
    { operation: 'listChangelog', path: '/feeds/{gameId}/changelog' },
    'listChangelog: only required params',
    async () => {
      const feed = await client.feeds.listChangelog('gameId', {
        limit: 50,
        includeChanges: false,
      });
    },
  );
  smokeCase(
    'feeds.listChangelog:all',
    { operation: 'listChangelog', path: '/feeds/{gameId}/changelog' },
    'listChangelog: required and optional params',
    async () => {
      const feed = await client.feeds.listChangelog('gameId', {
        cursor: 'cursor',
        limit: 50,
        includeChanges: false,
      });
    },
  );
});
