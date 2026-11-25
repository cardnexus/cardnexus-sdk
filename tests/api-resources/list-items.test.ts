// File generated from our OpenAPI spec by Scalar. See README.md for details.

// Smoke tests for one resource; see smoke-support.ts for how to run them.
import { describe } from 'vitest';

import { client, smokeCase } from '../smoke-support';

describe.concurrent('resource listItems', () => {
  smokeCase(
    'listItems.create:single',
    { operation: 'create', path: '/lists/{listId}/items' },
    'create',
    async () => {
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
  );
  smokeCase(
    'listItems.delete:single',
    { operation: 'delete', path: '/lists/{listId}/items/{itemId}' },
    'delete',
    async () => {
      const listItem = await client.listItems.delete('itemId', {
        listId: 'listId',
      });
    },
  );
});
