// File generated from our OpenAPI spec by Scalar. See README.md for details.

// Smoke tests for one resource; see smoke-support.ts for how to run them.
import { describe } from 'vitest';

import { client, smokeCase } from '../smoke-support';

describe.concurrent('resource accounts', () => {
  smokeCase('accounts.create:single', { operation: 'create', path: '/accounts' }, 'create', async () => {
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
  });
  smokeCase(
    'accounts.createOnboardingLink:single',
    { operation: 'createOnboardingLink', path: '/account/onboarding-link' },
    'createOnboardingLink',
    async () => {
      const account = await client.accounts.createOnboardingLink({
        returnUrl: 'x',
      });
    },
  );
});
