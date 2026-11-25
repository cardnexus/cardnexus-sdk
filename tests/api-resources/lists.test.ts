// File generated from our OpenAPI spec by Scalar. See README.md for details.

// Smoke tests for one resource; see smoke-support.ts for how to run them.
import { describe } from 'vitest';

import { client, smokeCase } from '../smoke-support';

describe.concurrent('resource lists', () => {
  smokeCase(
    'lists.list:required',
    { operation: 'list', path: '/lists' },
    'list: only required params',
    async () => {
      const list = await client.lists.list({
        offset: 0,
        limit: 50,
      });
    },
  );
  smokeCase(
    'lists.list:all',
    { operation: 'list', path: '/lists' },
    'list: required and optional params',
    async () => {
      const list = await client.lists.list({
        offset: 0,
        limit: 50,
        game: 'game',
        status: 'forSale',
        isPublic: true,
        name: 'name',
      });
    },
  );
  smokeCase(
    'lists.create:required',
    { operation: 'create', path: '/lists' },
    'create: only required params',
    async () => {
      const list = await client.lists.create({
        name: 'x',
        game: 'x',
        status: 'toComplete',
      });
    },
  );
  smokeCase(
    'lists.create:all',
    { operation: 'create', path: '/lists' },
    'create: required and optional params',
    async () => {
      const list = await client.lists.create({
        name: 'x',
        game: 'x',
        status: 'toComplete',
        description: '',
        isPublic: false,
      });
    },
  );
  smokeCase(
    'lists.retrieve:single',
    { operation: 'retrieve', path: '/lists/{listId}' },
    'retrieve',
    async () => {
      const list = await client.lists.retrieve('listId', {
        includeItems: true,
      });
    },
  );
  smokeCase(
    'lists.update:required',
    { operation: 'update', path: '/lists/{listId}' },
    'update: only required params',
    async () => {
      const list = await client.lists.update('listId');
    },
  );
  smokeCase(
    'lists.update:all',
    { operation: 'update', path: '/lists/{listId}' },
    'update: required and optional params',
    async () => {
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
  );
  smokeCase(
    'lists.delete:required',
    { operation: 'delete', path: '/lists/{listId}' },
    'delete: only required params',
    async () => {
      const list = await client.lists.delete('listId');
    },
  );
  smokeCase(
    'lists.delete:all',
    { operation: 'delete', path: '/lists/{listId}' },
    'delete: required and optional params',
    async () => {
      const list = await client.lists.delete('listId', {});
    },
  );
});
