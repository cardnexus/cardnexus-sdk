// File generated from our OpenAPI spec by Scalar. See README.md for details.

// Smoke tests for one resource; see smoke-support.ts for how to run them.
import { describe } from 'vitest';

import { client, smokeCase } from '../../smoke-support';

describe.concurrent('resource vacation', () => {
  smokeCase(
    'account.vacation.list:single',
    { operation: 'list', path: '/account/vacation' },
    'list',
    async () => {
      const vacation = await client.account.vacation.list();
    },
  );
  smokeCase(
    'account.vacation.set:required',
    { operation: 'set', path: '/account/vacation' },
    'set: only required params',
    async () => {
      const vacation = await client.account.vacation.set({
        enabled: false,
      });
    },
  );
  smokeCase(
    'account.vacation.set:all',
    { operation: 'set', path: '/account/vacation' },
    'set: required and optional params',
    async () => {
      const vacation = await client.account.vacation.set({
        enabled: false,
        reason: '',
      });
    },
  );
});
