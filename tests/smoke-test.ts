// File generated from our OpenAPI spec by Scalar. See README.md for details.

// Smoke test: calls every generated operation once to confirm the SDK can reach each endpoint.
// Run it from this repo with `bun tests/smoke-test.ts`. Each case below calls one SDK method
// exactly the way the SDK exposes it (positional params, request body, pagination, streaming).
//
// Two environment variables tune a run:
//   - SCALAR_SMOKE_FILTER: comma-separated needles; only operations whose name or path contains
//     one of them run, so you can smoke-test a subset without editing this file.
//   - SCALAR_SMOKE_REPORT: a file path; when set, the run writes a JSON report there instead of
//     printing a table. The generator uses this to collect per-operation results.
import { writeFileSync } from 'node:fs';

// The package exports the client class. The client reads auth and the base URL from the
// environment, so it needs no constructor options to point at a server.
import CardNexusPublicAPI from '@cardnexus/cardnexus-public';

// One shared client runs every case.
const client = new CardNexusPublicAPI({ maxRetries: 2, timeout: 10_000 });

// The result of running one case, collected for the JSON report or the printed table.
type SmokeResult = {
  operation: string;
  method: string;
  path: string;
  label?: string;
  status: 'passed' | 'failed';
  durationMs: number;
  error?: string;
};

// One or two entries per generated operation: the first passes only the arguments the method
// requires, the second also fills every optional parameter and body property. `label` says which
// is which, and is absent when the operation has no optional argument and so has only one case.
// `run` performs the real SDK call; the other fields are metadata used for filtering and
// reporting. This list is generated, so it stays in sync with the SDK surface.
const cases: {
  operation: string;
  method: string;
  path: string;
  label?: string;
  run: () => Promise<unknown>;
}[] = [
  {
    operation: 'list',
    method: 'GET',
    path: '/offers',
    label: 'required params',
    run: async () => {
      const offer = await client.offers.list({
        limit: 50,
      });
    },
  },

  {
    operation: 'list',
    method: 'GET',
    path: '/offers',
    label: 'all params',
    run: async () => {
      const offer = await client.offers.list({
        cursor: 'cursor',
        limit: 50,
        role: 'buyer',
        status: 'pending',
        createdFrom: '2024-08-14T10:23:11.000Z',
        createdTo: '2024-08-14T10:23:11.000Z',
      });
    },
  },

  {
    operation: 'create',
    method: 'POST',
    path: '/offers',
    run: async () => {
      const offer = await client.offers.create({
        items: [{ listingId: '665f3a2b1c8d4e9f7a6b5c52', quantity: 2 }],
        total: { amount: 25, currency: 'EUR' },
      });
    },
  },

  {
    operation: 'retrieve',
    method: 'GET',
    path: '/offers/{offerId}',
    run: async () => {
      const offer = await client.offers.retrieve('665f3a2b1c8d4e9f7a6b5c59');
    },
  },

  {
    operation: 'counter',
    method: 'POST',
    path: '/offers/{offerId}/counter',
    run: async () => {
      const offer = await client.offers.counter('665f3a2b1c8d4e9f7a6b5c59', {
        proposalId: '665f3a2b1c8d4e9f7a6b5c60',
        total: { amount: 26, currency: 'EUR' },
      });
    },
  },

  {
    operation: 'accept',
    method: 'POST',
    path: '/offers/{offerId}/accept',
    run: async () => {
      const offer = await client.offers.accept('665f3a2b1c8d4e9f7a6b5c59', {
        proposalId: '665f3a2b1c8d4e9f7a6b5c60',
      });
    },
  },

  {
    operation: 'decline',
    method: 'POST',
    path: '/offers/{offerId}/decline',
    run: async () => {
      const offer = await client.offers.decline('665f3a2b1c8d4e9f7a6b5c59', {
        proposalId: '665f3a2b1c8d4e9f7a6b5c60',
      });
    },
  },

  {
    operation: 'cancel',
    method: 'POST',
    path: '/offers/{offerId}/cancel',
    label: 'required params',
    run: async () => {
      const offer = await client.offers.cancel('665f3a2b1c8d4e9f7a6b5c59');
    },
  },

  {
    operation: 'cancel',
    method: 'POST',
    path: '/offers/{offerId}/cancel',
    label: 'all params',
    run: async () => {
      const offer = await client.offers.cancel('665f3a2b1c8d4e9f7a6b5c59', {});
    },
  },

  {
    operation: 'createToCart',
    method: 'POST',
    path: '/offers/{offerId}/add-to-cart',
    label: 'required params',
    run: async () => {
      const offer = await client.offers.createToCart('665f3a2b1c8d4e9f7a6b5c59');
    },
  },

  {
    operation: 'createToCart',
    method: 'POST',
    path: '/offers/{offerId}/add-to-cart',
    label: 'all params',
    run: async () => {
      const offer = await client.offers.createToCart('665f3a2b1c8d4e9f7a6b5c59', {});
    },
  },

  {
    operation: 'me',
    method: 'GET',
    path: '/account/me',
    run: async () => {
      const account = await client.account.me();
    },
  },

  {
    operation: 'balance',
    method: 'GET',
    path: '/account/balance',
    run: async () => {
      const account = await client.account.balance();
    },
  },

  {
    operation: 'list',
    method: 'GET',
    path: '/account/vacation',
    run: async () => {
      const vacation = await client.account.vacation.list();
    },
  },

  {
    operation: 'set',
    method: 'POST',
    path: '/account/vacation',
    label: 'required params',
    run: async () => {
      const vacation = await client.account.vacation.set({
        enabled: false,
      });
    },
  },

  {
    operation: 'set',
    method: 'POST',
    path: '/account/vacation',
    label: 'all params',
    run: async () => {
      const vacation = await client.account.vacation.set({
        enabled: false,
        reason: '',
      });
    },
  },

  {
    operation: 'listGames',
    method: 'GET',
    path: '/games',
    run: async () => {
      const product = await client.products.listGames();
    },
  },

  {
    operation: 'retrieveGame',
    method: 'GET',
    path: '/games/{gameId}',
    run: async () => {
      const gameSummary = await client.products.retrieveGame('gameId');
    },
  },

  {
    operation: 'listGameExpansions',
    method: 'GET',
    path: '/games/{gameId}/expansions',
    run: async () => {
      const product = await client.products.listGameExpansions('gameId', {
        offset: 0,
        limit: 50,
      });
    },
  },

  {
    operation: 'retrieveExpansion',
    method: 'GET',
    path: '/expansions/{expansionId}',
    run: async () => {
      const expansionSummary = await client.products.retrieveExpansion('expansionId');
    },
  },

  {
    operation: 'search',
    method: 'POST',
    path: '/products/search',
    label: 'required params',
    run: async () => {
      const product = await client.products.search({
        offset: 0,
        limit: 50,
      });
    },
  },

  {
    operation: 'search',
    method: 'POST',
    path: '/products/search',
    label: 'all params',
    run: async () => {
      const product = await client.products.search({
        'Accept-Language': 'fr',
        offset: 0,
        limit: 50,
        productIds: [0],
        expansionId: [0],
        name: 'x',
        printNumber: 'ST02-44',
        nameSlug: 'x',
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
      });
    },
  },

  {
    operation: 'retrieve',
    method: 'GET',
    path: '/products/{productId}',
    run: async () => {
      const product = await client.products.retrieve('productId');
    },
  },

  {
    operation: 'listListings',
    method: 'GET',
    path: '/products/{productId}/listings',
    label: 'required params',
    run: async () => {
      const product = await client.products.listListings('productId', {
        limit: 50,
      });
    },
  },

  {
    operation: 'listListings',
    method: 'GET',
    path: '/products/{productId}/listings',
    label: 'all params',
    run: async () => {
      const product = await client.products.listListings('productId', {
        cursor: 'cursor',
        limit: 50,
        condition: ['NM'],
        language: ['language'],
        finish: ['Standard'],
        region: 'eu',
        deliveryCountry: 'deliveryCountry',
      });
    },
  },

  {
    operation: 'resolve',
    method: 'POST',
    path: '/products/resolve',
    run: async () => {
      const product = await client.products.resolve({
        marketplace: 'cardmarket',
        ids: [0],
      });
    },
  },

  {
    operation: 'retrieve',
    method: 'GET',
    path: '/feeds/{gameId}',
    run: async () => {
      const feed = await client.feeds.retrieve('gameId');
    },
  },

  {
    operation: 'listCatalog',
    method: 'GET',
    path: '/feeds/{gameId}/catalog',
    run: async () => {
      const feed = await client.feeds.listCatalog('gameId');
    },
  },

  {
    operation: 'listExpansions',
    method: 'GET',
    path: '/feeds/{gameId}/expansions',
    run: async () => {
      const feed = await client.feeds.listExpansions('gameId');
    },
  },

  {
    operation: 'listPrices',
    method: 'GET',
    path: '/feeds/{gameId}/prices',
    run: async () => {
      const feed = await client.feeds.listPrices('gameId');
    },
  },

  {
    operation: 'listChangelog',
    method: 'GET',
    path: '/feeds/{gameId}/changelog',
    label: 'required params',
    run: async () => {
      const feed = await client.feeds.listChangelog('gameId', {
        limit: 50,
        includeChanges: false,
      });
    },
  },

  {
    operation: 'listChangelog',
    method: 'GET',
    path: '/feeds/{gameId}/changelog',
    label: 'all params',
    run: async () => {
      const feed = await client.feeds.listChangelog('gameId', {
        cursor: 'cursor',
        limit: 50,
        includeChanges: false,
      });
    },
  },

  {
    operation: 'listProductPrices',
    method: 'GET',
    path: '/products/{productId}/prices',
    run: async () => {
      const pricing = await client.pricing.listProductPrices('productId');
    },
  },

  {
    operation: 'listHistory',
    method: 'GET',
    path: '/products/{productId}/prices/history',
    label: 'required params',
    run: async () => {
      const pricing = await client.pricing.listHistory('productId');
    },
  },

  {
    operation: 'listHistory',
    method: 'GET',
    path: '/products/{productId}/prices/history',
    label: 'all params',
    run: async () => {
      const pricing = await client.pricing.listHistory('productId', {
        marketplace: 'cardmarket',
        finish: 'Standard',
        from: '2026-05-11',
        to: '2026-06-10',
      });
    },
  },

  {
    operation: 'listSales',
    method: 'GET',
    path: '/products/{productId}/sales',
    label: 'required params',
    run: async () => {
      const pricing = await client.pricing.listSales('productId', {
        limit: 50,
      });
    },
  },

  {
    operation: 'listSales',
    method: 'GET',
    path: '/products/{productId}/sales',
    label: 'all params',
    run: async () => {
      const pricing = await client.pricing.listSales('productId', {
        cursor: 'cursor',
        limit: 50,
        finish: 'Standard',
        condition: 'NM',
        language: 'language',
      });
    },
  },

  {
    operation: 'create',
    method: 'POST',
    path: '/optimizer/runs',
    label: 'required params',
    run: async () => {
      const run = await client.optimizer.runs.create({
        targets: [
          {
            quantity: 1,
          },
        ],
        destination: {
          country: 'xx',
        },
      });
    },
  },

  {
    operation: 'create',
    method: 'POST',
    path: '/optimizer/runs',
    label: 'all params',
    run: async () => {
      const run = await client.optimizer.runs.create({
        targets: [
          {
            quantity: 1,
          },
        ],
        destination: {
          country: 'xx',
        },
        defaults: {},
        sellers: {},
        options: {},
      });
    },
  },

  {
    operation: 'retrieve',
    method: 'GET',
    path: '/optimizer/runs/{id}',
    run: async () => {
      const run = await client.optimizer.runs.retrieve('id');
    },
  },

  {
    operation: 'apply',
    method: 'POST',
    path: '/optimizer/runs/{id}/apply',
    run: async () => {
      const cart = await client.optimizer.runs.apply('id', {
        mode: 'lowest_price',
      });
    },
  },

  {
    operation: 'list',
    method: 'GET',
    path: '/cart',
    run: async () => {
      const cart = await client.cart.list();
    },
  },

  {
    operation: 'clear',
    method: 'DELETE',
    path: '/cart',
    run: async () => {
      const cart = await client.cart.clear({});
    },
  },

  {
    operation: 'create',
    method: 'POST',
    path: '/cart/items',
    run: async () => {
      const item = await client.cart.items.create({
        deliveryCountry: 'xx',
        items: [
          {
            listingId: 'x',
            quantity: 1,
          },
        ],
      });
    },
  },

  {
    operation: 'update',
    method: 'PATCH',
    path: '/cart/items/{listingId}',
    run: async () => {
      const cart = await client.cart.items.update('listingId', {
        quantity: 0,
      });
    },
  },

  {
    operation: 'delete',
    method: 'DELETE',
    path: '/cart/items/{listingId}',
    label: 'required params',
    run: async () => {
      const cart = await client.cart.items.delete('listingId');
    },
  },

  {
    operation: 'delete',
    method: 'DELETE',
    path: '/cart/items/{listingId}',
    label: 'all params',
    run: async () => {
      const cart = await client.cart.items.delete('listingId', {});
    },
  },

  {
    operation: 'list',
    method: 'GET',
    path: '/inventory',
    label: 'required params',
    run: async () => {
      const line = await client.lines.list({
        limit: 50,
      });
    },
  },

  {
    operation: 'list',
    method: 'GET',
    path: '/inventory',
    label: 'all params',
    run: async () => {
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
  },

  {
    operation: 'create',
    method: 'POST',
    path: '/inventory',
    run: async () => {
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
    },
  },

  {
    operation: 'search',
    method: 'POST',
    path: '/inventory/search',
    label: 'required params',
    run: async () => {
      const line = await client.lines.search({
        offset: 0,
        limit: 50,
      });
    },
  },

  {
    operation: 'search',
    method: 'POST',
    path: '/inventory/search',
    label: 'all params',
    run: async () => {
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
        sortBy: 'name',
        sortDirection: 'asc',
      });
    },
  },

  {
    operation: 'retrieve',
    method: 'GET',
    path: '/inventory/{inventoryId}',
    run: async () => {
      const line = await client.lines.retrieve('inventoryId');
    },
  },

  {
    operation: 'update',
    method: 'PATCH',
    path: '/inventory/{inventoryId}',
    label: 'required params',
    run: async () => {
      const line = await client.lines.update('inventoryId');
    },
  },

  {
    operation: 'update',
    method: 'PATCH',
    path: '/inventory/{inventoryId}',
    label: 'all params',
    run: async () => {
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
  },

  {
    operation: 'delete',
    method: 'DELETE',
    path: '/inventory/{inventoryId}',
    label: 'required params',
    run: async () => {
      const line = await client.lines.delete('inventoryId');
    },
  },

  {
    operation: 'delete',
    method: 'DELETE',
    path: '/inventory/{inventoryId}',
    label: 'all params',
    run: async () => {
      const line = await client.lines.delete('inventoryId', {});
    },
  },

  {
    operation: 'setMedia',
    method: 'PUT',
    path: '/inventory/{inventoryId}/media',
    run: async () => {
      const line = await client.lines.setMedia('inventoryId', {
        files: [''],
      });
    },
  },

  {
    operation: 'import',
    method: 'POST',
    path: '/inventory/bulk/import',
    label: 'required params',
    run: async () => {
      const bulkOperation = await client.bulkOperations.import({
        file: '',
        mode: 'upsert',
      });
    },
  },

  {
    operation: 'import',
    method: 'POST',
    path: '/inventory/bulk/import',
    label: 'all params',
    run: async () => {
      const bulkOperation = await client.bulkOperations.import({
        file: '',
        mode: 'upsert',
        format: 'json',
      });
    },
  },

  {
    operation: 'importCardmarket',
    method: 'POST',
    path: '/inventory/bulk/import/cardmarket',
    run: async () => {
      const bulkOperation = await client.bulkOperations.importCardmarket({
        file: '',
        mode: 'upsert',
      });
    },
  },

  {
    operation: 'importTcgplayer',
    method: 'POST',
    path: '/inventory/bulk/import/tcgplayer',
    run: async () => {
      const bulkOperation = await client.bulkOperations.importTcgplayer({
        file: '',
        mode: 'upsert',
      });
    },
  },

  {
    operation: 'importTcgPowerTools',
    method: 'POST',
    path: '/inventory/bulk/import/tcgpowertools',
    run: async () => {
      const bulkOperation = await client.bulkOperations.importTcgPowerTools({
        file: '',
        mode: 'upsert',
      });
    },
  },

  {
    operation: 'export',
    method: 'POST',
    path: '/inventory/bulk/export',
    label: 'required params',
    run: async () => {
      const bulkOperation = await client.bulkOperations.export({
        format: 'json',
      });
    },
  },

  {
    operation: 'export',
    method: 'POST',
    path: '/inventory/bulk/export',
    label: 'all params',
    run: async () => {
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
  },

  {
    operation: 'update',
    method: 'POST',
    path: '/inventory/bulk/update',
    run: async () => {
      const bulkOperation = await client.bulkOperations.update({
        items: [{}],
      });
    },
  },

  {
    operation: 'retrieveJob',
    method: 'GET',
    path: '/inventory/bulk/jobs/{jobId}',
    run: async () => {
      const bulkOperation = await client.bulkOperations.retrieveJob('jobId');
    },
  },

  {
    operation: 'list',
    method: 'GET',
    path: '/inventory/tags',
    run: async () => {
      const tag = await client.tags.list();
    },
  },

  {
    operation: 'create',
    method: 'POST',
    path: '/inventory/tags',
    label: 'required params',
    run: async () => {
      const tag = await client.tags.create({
        name: 'Trade binder',
      });
    },
  },

  {
    operation: 'create',
    method: 'POST',
    path: '/inventory/tags',
    label: 'all params',
    run: async () => {
      const tag = await client.tags.create({
        name: 'Trade binder',
        color: 'x',
        icon: 'x',
        upsert: false,
      });
    },
  },

  {
    operation: 'update',
    method: 'PATCH',
    path: '/inventory/tags/{tagName}',
    label: 'required params',
    run: async () => {
      const tag = await client.tags.update('tagName');
    },
  },

  {
    operation: 'update',
    method: 'PATCH',
    path: '/inventory/tags/{tagName}',
    label: 'all params',
    run: async () => {
      const tag = await client.tags.update('tagName', {
        name: 'x',
        color: '#22c55e',
        icon: 'star',
      });
    },
  },

  {
    operation: 'delete',
    method: 'DELETE',
    path: '/inventory/tags/{tagName}',
    label: 'required params',
    run: async () => {
      const response = await client.tags.delete('tagName');
    },
  },

  {
    operation: 'delete',
    method: 'DELETE',
    path: '/inventory/tags/{tagName}',
    label: 'all params',
    run: async () => {
      const response = await client.tags.delete('tagName', {});
    },
  },

  {
    operation: 'list',
    method: 'GET',
    path: '/inventory/locations',
    run: async () => {
      const location = await client.locations.list();
    },
  },

  {
    operation: 'create',
    method: 'POST',
    path: '/inventory/locations',
    label: 'required params',
    run: async () => {
      const location = await client.locations.create({
        name: 'Trade binder',
      });
    },
  },

  {
    operation: 'create',
    method: 'POST',
    path: '/inventory/locations',
    label: 'all params',
    run: async () => {
      const location = await client.locations.create({
        name: 'Trade binder',
        color: 'x',
        icon: 'x',
        upsert: false,
      });
    },
  },

  {
    operation: 'update',
    method: 'PATCH',
    path: '/inventory/locations/{locationName}',
    label: 'required params',
    run: async () => {
      const location = await client.locations.update('locationName');
    },
  },

  {
    operation: 'update',
    method: 'PATCH',
    path: '/inventory/locations/{locationName}',
    label: 'all params',
    run: async () => {
      const location = await client.locations.update('locationName', {
        name: 'x',
        color: '#22c55e',
        icon: 'star',
      });
    },
  },

  {
    operation: 'delete',
    method: 'DELETE',
    path: '/inventory/locations/{locationName}',
    label: 'required params',
    run: async () => {
      const response = await client.locations.delete('locationName');
    },
  },

  {
    operation: 'delete',
    method: 'DELETE',
    path: '/inventory/locations/{locationName}',
    label: 'all params',
    run: async () => {
      const response = await client.locations.delete('locationName', {});
    },
  },

  {
    operation: 'list',
    method: 'GET',
    path: '/listings',
    label: 'required params',
    run: async () => {
      const listing = await client.listings.list({
        limit: 50,
      });
    },
  },

  {
    operation: 'list',
    method: 'GET',
    path: '/listings',
    label: 'all params',
    run: async () => {
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
  },

  {
    operation: 'create',
    method: 'POST',
    path: '/inventory/{inventoryId}/listing',
    label: 'required params',
    run: async () => {
      const listing = await client.listings.create('inventoryId', {
        price: { amount: 14.99, currency: 'USD' },
      });
    },
  },

  {
    operation: 'create',
    method: 'POST',
    path: '/inventory/{inventoryId}/listing',
    label: 'all params',
    run: async () => {
      const listing = await client.listings.create('inventoryId', {
        price: { amount: 14.99, currency: 'USD' },
        quantity: 1,
      });
    },
  },

  {
    operation: 'update',
    method: 'PATCH',
    path: '/inventory/{inventoryId}/listing',
    run: async () => {
      const listing = await client.listings.update('inventoryId', {
        price: { amount: 14.99, currency: 'USD' },
      });
    },
  },

  {
    operation: 'delete',
    method: 'DELETE',
    path: '/inventory/{inventoryId}/listing',
    label: 'required params',
    run: async () => {
      const listing = await client.listings.delete('inventoryId');
    },
  },

  {
    operation: 'delete',
    method: 'DELETE',
    path: '/inventory/{inventoryId}/listing',
    label: 'all params',
    run: async () => {
      const listing = await client.listings.delete('inventoryId', {
        quantity: 1,
      });
    },
  },

  {
    operation: 'list',
    method: 'GET',
    path: '/lists',
    label: 'required params',
    run: async () => {
      const list = await client.lists.list({
        offset: 0,
        limit: 50,
      });
    },
  },

  {
    operation: 'list',
    method: 'GET',
    path: '/lists',
    label: 'all params',
    run: async () => {
      const list = await client.lists.list({
        offset: 0,
        limit: 50,
        game: 'game',
        status: 'forSale',
        isPublic: true,
        name: 'name',
      });
    },
  },

  {
    operation: 'create',
    method: 'POST',
    path: '/lists',
    label: 'required params',
    run: async () => {
      const list = await client.lists.create({
        name: 'x',
        game: 'x',
        status: 'toComplete',
      });
    },
  },

  {
    operation: 'create',
    method: 'POST',
    path: '/lists',
    label: 'all params',
    run: async () => {
      const list = await client.lists.create({
        name: 'x',
        game: 'x',
        status: 'toComplete',
        description: '',
        isPublic: false,
      });
    },
  },

  {
    operation: 'retrieve',
    method: 'GET',
    path: '/lists/{listId}',
    run: async () => {
      const list = await client.lists.retrieve('listId');
    },
  },

  {
    operation: 'update',
    method: 'PATCH',
    path: '/lists/{listId}',
    label: 'required params',
    run: async () => {
      const list = await client.lists.update('listId');
    },
  },

  {
    operation: 'update',
    method: 'PATCH',
    path: '/lists/{listId}',
    label: 'all params',
    run: async () => {
      const list = await client.lists.update('listId', {
        name: 'x',
        description: '',
        status: 'forSale',
        isPublic: false,
        defaultMinCondition: 'NM',
        defaultLanguage: 'en',
        currency: 'USD',
      });
    },
  },

  {
    operation: 'delete',
    method: 'DELETE',
    path: '/lists/{listId}',
    label: 'required params',
    run: async () => {
      const list = await client.lists.delete('listId');
    },
  },

  {
    operation: 'delete',
    method: 'DELETE',
    path: '/lists/{listId}',
    label: 'all params',
    run: async () => {
      const list = await client.lists.delete('listId', {});
    },
  },

  {
    operation: 'create',
    method: 'POST',
    path: '/lists/{listId}/items',
    run: async () => {
      const listItem = await client.listItems.create('listId', {
        items: [
          {
            productId: 50212,
            finish: 'Standard',
            language: 'en',
            quantity: 0,
          },
        ],
      });
    },
  },

  {
    operation: 'delete',
    method: 'DELETE',
    path: '/lists/{listId}/items/{itemId}',
    run: async () => {
      const listItem = await client.listItems.delete('itemId', {
        listId: 'listId',
      });
    },
  },

  {
    operation: 'list',
    method: 'GET',
    path: '/sales',
    label: 'required params',
    run: async () => {
      const sale = await client.sales.list({
        limit: 50,
      });
    },
  },

  {
    operation: 'list',
    method: 'GET',
    path: '/sales',
    label: 'all params',
    run: async () => {
      const sale = await client.sales.list({
        cursor: 'cursor',
        limit: 50,
        status: ['shipped'],
        placedFrom: '2024-08-14T10:23:11.000Z',
        placedTo: '2024-08-14T10:23:11.000Z',
        metadata: {},
      });
    },
  },

  {
    operation: 'retrieve',
    method: 'GET',
    path: '/sales/{orderNumber}',
    run: async () => {
      const saleDetail = await client.sales.retrieve('orderNumber');
    },
  },

  {
    operation: 'markShipped',
    method: 'POST',
    path: '/sales/{orderNumber}/mark-shipped',
    label: 'required params',
    run: async () => {
      const saleDetail = await client.sales.markShipped('orderNumber');
    },
  },

  {
    operation: 'markShipped',
    method: 'POST',
    path: '/sales/{orderNumber}/mark-shipped',
    label: 'all params',
    run: async () => {
      const saleDetail = await client.sales.markShipped('orderNumber', {
        trackingNumber: 'xxxxx',
        trackingUrl: 'https://track.sortswift.example/l/00310110084032371774',
        metadata: { fulfillment_stage: 'packed', picked_by: null },
      });
    },
  },

  {
    operation: 'cancel',
    method: 'POST',
    path: '/sales/{orderNumber}/cancel',
    run: async () => {
      const saleDetail = await client.sales.cancel('orderNumber', {
        reason: 'item_unavailable',
        reasonText: 'xxxxxxxxxx',
      });
    },
  },

  {
    operation: 'refund',
    method: 'POST',
    path: '/sales/{orderNumber}/refunds',
    run: async () => {
      const saleDetail = await client.sales.refund('orderNumber', {
        amount: 2.5,
      });
    },
  },

  {
    operation: 'setMetadata',
    method: 'PATCH',
    path: '/sales/{orderNumber}/metadata',
    run: async () => {
      const saleDetail = await client.sales.setMetadata('orderNumber', {
        metadata: { fulfillment_stage: 'packed', picked_by: null },
      });
    },
  },

  {
    operation: 'list',
    method: 'GET',
    path: '/purchases',
    label: 'required params',
    run: async () => {
      const purchase = await client.purchases.list({
        limit: 50,
      });
    },
  },

  {
    operation: 'list',
    method: 'GET',
    path: '/purchases',
    label: 'all params',
    run: async () => {
      const purchase = await client.purchases.list({
        cursor: 'cursor',
        limit: 50,
        status: ['shipped'],
        placedFrom: '2024-08-14T10:23:11.000Z',
        placedTo: '2024-08-14T10:23:11.000Z',
      });
    },
  },

  {
    operation: 'retrieve',
    method: 'GET',
    path: '/purchases/{orderNumber}',
    run: async () => {
      const purchaseDetail = await client.purchases.retrieve('orderNumber');
    },
  },

  {
    operation: 'pushEvents',
    method: 'POST',
    path: '/tracking/events',
    run: async () => {
      const tracking = await client.tracking.pushEvents({
        shipments: [
          {
            trackingNumber: '00310110084032371774',
            trackingUrl: 'https://track.sortswift.example/l/00310110084032371774',
            events: [
              {
                eventId: 'evt_8811',
                status: 'label_created',
                occurredAt: '2026-09-21T10:21:00.000Z',
                location: { city: 'Laurel', state: 'MD' },
                description: 'Label created',
              },
              {
                eventId: 'evt_8812',
                status: 'in_mailstream',
                occurredAt: '2026-09-22T23:35:00.000Z',
                location: { city: 'Gaithersburg', state: 'MD', postalCode: '20898' },
                description: 'Origin processing',
              },
            ],
          },
        ],
      });
    },
  },

  {
    operation: 'exchange',
    method: 'POST',
    path: '/connect/exchange',
    run: async () => {
      const connect = await client.connect.exchange({
        code: 'x',
      });
    },
  },

  {
    operation: 'create',
    method: 'POST',
    path: '/accounts',
    run: async () => {
      const account = await client.accounts.create({
        email: 'shop@northarena.example',
        country: 'FR',
        sellerType: 'pro',
        username: 'north_arena_tcg',
        firstName: 'Léa',
        lastName: 'Martin',
        language: 'fr',
        business: {
          companyName: 'North Arena TCG',
          registrationNumber: '912345678',
          vatNumber: 'FR12345678901',
          address: { line1: '12 rue des Cartes', city: 'Lyon', postalCode: '69001', country: 'FR' },
        },
      });
    },
  },

  {
    operation: 'createOnboardingLink',
    method: 'POST',
    path: '/account/onboarding-link',
    run: async () => {
      const account = await client.accounts.createOnboardingLink({
        returnUrl: 'x',
      });
    },
  },
];

/**
 * How many cases run at once, capped at the number of cases there are.
 *
 * SCALAR_SMOKE_CONCURRENCY overrides the default; anything unparseable falls back to it.
 */
const smokeConcurrency = (caseCount: number): number => {
  const override = Number.parseInt(process.env['SCALAR_SMOKE_CONCURRENCY'] ?? '', 10);
  const limit = Number.isInteger(override) && override > 0 ? override : 32;
  return Math.min(limit, caseCount);
};

const main = async (): Promise<void> => {
  // SCALAR_SMOKE_FILTER (comma-separated) keeps only cases whose operation name or path matches
  // one of the needles, so a caller can smoke-test a subset. With no filter, every case runs.
  const filter = process.env['SCALAR_SMOKE_FILTER'];
  const needles = filter
    ? filter
        .split(',')
        .map((needle) => needle.trim())
        .filter(Boolean)
    : [];
  const selected =
    needles.length > 0
      ? cases.filter((testCase) =>
          needles.some((needle) => testCase.operation.includes(needle) || testCase.path.includes(needle)),
        )
      : cases;

  // Run the selected cases under a bounded worker pool rather than all at once. A large SDK has
  // hundreds of operations, and firing every request together exceeds what the client's transport
  // keeps connections for while the runner is already busy with other targets. Each worker pulls
  // the next index off a shared cursor and writes into a pre-sized array, so results stay in case
  // order however the workers interleave. The per-case body catches everything and never rejects,
  // so one failing operation still cannot block the others.
  const results: SmokeResult[] = new Array<SmokeResult>(selected.length);
  let cursor = 0;
  const runNext = async (): Promise<void> => {
    for (let index = cursor++; index < selected.length; index = cursor++) {
      const testCase = selected[index];
      if (!testCase) continue;
      const startedAt = Date.now();
      // `label` distinguishes the required-params run from the all-params run of the same
      // operation; it is omitted entirely when the operation contributed only one case.
      const identity = {
        operation: testCase.operation,
        method: testCase.method,
        path: testCase.path,
        ...(testCase.label ? { label: testCase.label } : {}),
      };
      try {
        await testCase.run();
        results[index] = { ...identity, status: 'passed', durationMs: Date.now() - startedAt };
      } catch (error) {
        // Prefer the stack so a failure points at the failing SDK call; fall back to the message.
        const message = error instanceof Error ? (error.stack ?? error.message) : String(error);
        results[index] = {
          ...identity,
          status: 'failed',
          durationMs: Date.now() - startedAt,
          error: message,
        };
      }
    }
  };
  await Promise.all(Array.from({ length: smokeConcurrency(selected.length) }, runNext));
  const failed = results.filter((result) => result.status === 'failed');

  // With SCALAR_SMOKE_REPORT set, write a machine-readable report; otherwise print a table.
  const reportPath = process.env['SCALAR_SMOKE_REPORT'];
  if (reportPath) {
    writeFileSync(reportPath, JSON.stringify({ total: results.length, failed: failed.length, results }));
  } else {
    for (const result of results) {
      const suffix = result.label ? ` [${result.label}]` : '';
      if (result.status === 'passed')
        console.log(
          `\u2714 ${result.operation}${suffix} (${result.method} ${result.path}) ${result.durationMs}ms`,
        );
      else
        console.error(
          `\u2718 ${result.operation}${suffix} (${result.method} ${result.path})\n${result.error ?? ''}`,
        );
    }
    if (results.length === 0) {
      console.error('No code samples ran (empty SDK or a SCALAR_SMOKE_FILTER that matched nothing).');
    } else {
      console.log(`\n${results.length - failed.length}/${results.length} samples passed`);
    }
  }

  // An empty run (no operations, or a filter that matched nothing) is a failure, not a vacuous pass.
  if (failed.length > 0 || results.length === 0) process.exitCode = 1;
};

void main();
