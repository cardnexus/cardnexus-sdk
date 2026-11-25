// File generated from our OpenAPI spec by Scalar. See README.md for details.

// Smoke tests for one resource; see smoke-support.ts for how to run them.
import { describe } from 'vitest';

import { client, smokeCase } from '../smoke-support';

describe.concurrent('resource tracking', () => {
  smokeCase(
    'tracking.pushEvents:single',
    { operation: 'pushEvents', path: '/tracking/events' },
    'pushEvents',
    async () => {
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
  );
});
