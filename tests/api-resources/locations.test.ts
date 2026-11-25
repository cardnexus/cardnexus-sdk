// File generated from our OpenAPI spec by Scalar. See README.md for details.

// Smoke tests for one resource; see smoke-support.ts for how to run them.
import { describe } from 'vitest';

import { client, smokeCase } from '../smoke-support';

describe.concurrent('resource locations', () => {
  smokeCase(
    'locations.list:single',
    { operation: 'list', path: '/inventory/locations' },
    'list',
    async () => {
      const location = await client.locations.list();
    },
  );
  smokeCase(
    'locations.create:required',
    { operation: 'create', path: '/inventory/locations' },
    'create: only required params',
    async () => {
      const location = await client.locations.create({
        name: 'Trade binder',
      });
    },
  );
  smokeCase(
    'locations.create:all',
    { operation: 'create', path: '/inventory/locations' },
    'create: required and optional params',
    async () => {
      const location = await client.locations.create({
        name: 'Trade binder',
        color: 'x',
        icon: 'x',
        upsert: false,
      });
    },
  );
  smokeCase(
    'locations.update:required',
    { operation: 'update', path: '/inventory/locations/{locationName}' },
    'update: only required params',
    async () => {
      const location = await client.locations.update('locationName');
    },
  );
  smokeCase(
    'locations.update:all',
    { operation: 'update', path: '/inventory/locations/{locationName}' },
    'update: required and optional params',
    async () => {
      const location = await client.locations.update('locationName', {
        name: 'x',
        color: '#22c55e',
        icon: 'star',
      });
    },
  );
  smokeCase(
    'locations.delete:required',
    { operation: 'delete', path: '/inventory/locations/{locationName}' },
    'delete: only required params',
    async () => {
      const response = await client.locations.delete('locationName');
    },
  );
  smokeCase(
    'locations.delete:all',
    { operation: 'delete', path: '/inventory/locations/{locationName}' },
    'delete: required and optional params',
    async () => {
      const response = await client.locations.delete('locationName', {});
    },
  );
});
