// File generated from our OpenAPI spec by Scalar. See README.md for details.

// Smoke tests for one resource; see smoke-support.ts for how to run them.
import { describe } from 'vitest';

import { client, smokeCase } from '../../smoke-support';

describe.concurrent('resource account', () => {
  smokeCase('account.me:single', { operation: 'me', path: '/account/me' }, 'me', async () => {
    const account = await client.account.me();
  });
  smokeCase(
    'account.balance:single',
    { operation: 'balance', path: '/account/balance' },
    'balance',
    async () => {
      const account = await client.account.balance();
    },
  );
});
