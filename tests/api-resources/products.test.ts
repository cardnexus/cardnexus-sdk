// File generated from our OpenAPI spec by Scalar. See README.md for details.

// Smoke tests for one resource; see smoke-support.ts for how to run them.
import { describe } from 'vitest';

import { client, smokeCase } from '../smoke-support';

describe.concurrent('resource products', () => {
  smokeCase(
    'products.listGames:single',
    { operation: 'listGames', path: '/games' },
    'listGames',
    async () => {
      const product = await client.products.listGames();
    },
  );
  smokeCase(
    'products.retrieveGame:single',
    { operation: 'retrieveGame', path: '/games/{gameId}' },
    'retrieveGame',
    async () => {
      const gameSummary = await client.products.retrieveGame('gameId');
    },
  );
  smokeCase(
    'products.listGameExpansions:single',
    { operation: 'listGameExpansions', path: '/games/{gameId}/expansions' },
    'listGameExpansions',
    async () => {
      const product = await client.products.listGameExpansions('gameId', {
        offset: 0,
        limit: 50,
      });
    },
  );
  smokeCase(
    'products.retrieveExpansion:single',
    { operation: 'retrieveExpansion', path: '/expansions/{expansionId}' },
    'retrieveExpansion',
    async () => {
      const expansionSummary = await client.products.retrieveExpansion('expansionId');
    },
  );
  smokeCase(
    'products.search:required',
    { operation: 'search', path: '/products/search' },
    'search: only required params',
    async () => {
      const product = await client.products.search({
        offset: 0,
        limit: 50,
      });
    },
  );
  smokeCase(
    'products.search:all',
    { operation: 'search', path: '/products/search' },
    'search: required and optional params',
    async () => {
      const product = await client.products.search({
        'Accept-Language': 'fr',
        offset: 0,
        limit: 50,
        productIds: [0],
        expansionId: [0],
        name: 'x',
        printNumber: 'ST02-44',
        nameSlug: 'x',
        nameSlugs: ['charizard-ex'],
        cardmarketId: [0],
        tcgplayerId: [0],
        productType: {
          op: 'and',
          values: ['card'],
        },
        productCategory: '',
        gameFilters: {
          game: 'sorcery',
          filters: {},
        },
        listings: {
          deliveryCountry: 'GB',
          inStock: false,
          condition: ['NM'],
          language: ['en', 'fr'],
          finish: ['Standard'],
        },
        sortBy: 'printNumber',
        sortDirection: 'asc',
        cursor: '',
        includeTotal: false,
      });
    },
  );
  smokeCase(
    'products.retrieve:single',
    { operation: 'retrieve', path: '/products/{productId}' },
    'retrieve',
    async () => {
      const product = await client.products.retrieve('productId');
    },
  );
  smokeCase(
    'products.listListings:required',
    { operation: 'listListings', path: '/products/{productId}/listings' },
    'listListings: only required params',
    async () => {
      const product = await client.products.listListings('productId', {
        limit: 50,
      });
    },
  );
  smokeCase(
    'products.listListings:all',
    { operation: 'listListings', path: '/products/{productId}/listings' },
    'listListings: required and optional params',
    async () => {
      const product = await client.products.listListings('productId', {
        cursor: 'cursor',
        limit: 50,
        condition: ['NM'],
        language: ['language'],
        finish: ['Standard'],
        region: 'eu',
        deliveryCountry: 'deliveryCountry',
        graded: true,
        sortBy: 'price',
        sortDirection: 'asc',
      });
    },
  );
  smokeCase(
    'products.resolve:single',
    { operation: 'resolve', path: '/products/resolve' },
    'resolve',
    async () => {
      const product = await client.products.resolve({
        marketplace: 'cardmarket',
        ids: [0],
      });
    },
  );
});
