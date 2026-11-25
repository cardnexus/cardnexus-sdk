// File generated from our OpenAPI spec by Scalar. See README.md for details.

// Smoke tests for one resource; see smoke-support.ts for how to run them.
import { describe } from 'vitest';

import { client, smokeCase } from '../smoke-support';

describe.concurrent('resource connect', () => {
  smokeCase(
    'connect.exchange:single',
    { operation: 'exchange', path: '/connect/exchange' },
    'exchange',
    async () => {
      const connect = await client.connect.exchange({
        code: 'x',
      });
    },
  );
});
