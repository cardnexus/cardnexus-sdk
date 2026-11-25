// File generated from our OpenAPI spec by Scalar. See README.md for details.

// Smoke tests for one resource; see smoke-support.ts for how to run them.
import { describe } from 'vitest';

import { client, smokeCase } from '../smoke-support';

describe.concurrent('resource tags', () => {
  smokeCase('tags.list:single', { operation: 'list', path: '/inventory/tags' }, 'list', async () => {
    const tag = await client.tags.list();
  });
  smokeCase(
    'tags.create:required',
    { operation: 'create', path: '/inventory/tags' },
    'create: only required params',
    async () => {
      const tag = await client.tags.create({
        name: 'Trade binder',
      });
    },
  );
  smokeCase(
    'tags.create:all',
    { operation: 'create', path: '/inventory/tags' },
    'create: required and optional params',
    async () => {
      const tag = await client.tags.create({
        name: 'Trade binder',
        color: 'x',
        icon: 'x',
        upsert: false,
      });
    },
  );
  smokeCase(
    'tags.update:required',
    { operation: 'update', path: '/inventory/tags/{tagName}' },
    'update: only required params',
    async () => {
      const tag = await client.tags.update('tagName');
    },
  );
  smokeCase(
    'tags.update:all',
    { operation: 'update', path: '/inventory/tags/{tagName}' },
    'update: required and optional params',
    async () => {
      const tag = await client.tags.update('tagName', {
        name: 'x',
        color: '#22c55e',
        icon: 'star',
      });
    },
  );
  smokeCase(
    'tags.delete:required',
    { operation: 'delete', path: '/inventory/tags/{tagName}' },
    'delete: only required params',
    async () => {
      const response = await client.tags.delete('tagName');
    },
  );
  smokeCase(
    'tags.delete:all',
    { operation: 'delete', path: '/inventory/tags/{tagName}' },
    'delete: required and optional params',
    async () => {
      const response = await client.tags.delete('tagName', {});
    },
  );
});
