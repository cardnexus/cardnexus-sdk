// File generated from our OpenAPI spec by Scalar. See README.md for details.

// Smoke tests for one resource; see smoke-support.ts for how to run them.
import { describe } from 'vitest';

import { client, smokeCase } from '../../smoke-support';

describe.concurrent('resource runs', () => {
  smokeCase(
    'optimizer.runs.create:required',
    { operation: 'create', path: '/optimizer/runs' },
    'create: only required params',
    async () => {
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
  );
  smokeCase(
    'optimizer.runs.create:all',
    { operation: 'create', path: '/optimizer/runs' },
    'create: required and optional params',
    async () => {
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
  );
  smokeCase(
    'optimizer.runs.retrieve:single',
    { operation: 'retrieve', path: '/optimizer/runs/{id}' },
    'retrieve',
    async () => {
      const run = await client.optimizer.runs.retrieve('id');
    },
  );
  smokeCase(
    'optimizer.runs.apply:single',
    { operation: 'apply', path: '/optimizer/runs/{id}/apply' },
    'apply',
    async () => {
      const cart = await client.optimizer.runs.apply('id', {
        mode: 'lowest_price',
      });
    },
  );
});
