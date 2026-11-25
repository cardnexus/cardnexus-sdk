// File generated from our OpenAPI spec by Scalar. See README.md for details.

// Smoke tests for one resource; see smoke-support.ts for how to run them.
import { describe } from 'vitest';

import { client, smokeCase } from '../smoke-support';

describe.concurrent('resource sales', () => {
  smokeCase(
    'sales.list:required',
    { operation: 'list', path: '/sales' },
    'list: only required params',
    async () => {
      const sale = await client.sales.list({
        limit: 50,
        includeTotal: false,
      });
    },
  );
  smokeCase(
    'sales.list:all',
    { operation: 'list', path: '/sales' },
    'list: required and optional params',
    async () => {
      const sale = await client.sales.list({
        cursor: 'cursor',
        limit: 50,
        status: ['shipped'],
        placedFrom: '2024-08-14T10:23:11.000Z',
        placedTo: '2024-08-14T10:23:11.000Z',
        includeTotal: false,
        needsAction: true,
        dispute: 'any',
        shipByBefore: '2024-08-14T10:23:11.000Z',
        orderNumberPrefix: 'orderNumberPrefix',
        metadata: {},
        shipByAfter: '2024-01-01T00:00:00.000Z',
        buyer: 'buyer',
        sort: 'newest',
      });
    },
  );
  smokeCase(
    'sales.retrieve:single',
    { operation: 'retrieve', path: '/sales/{orderNumber}' },
    'retrieve',
    async () => {
      const saleDetail = await client.sales.retrieve('orderNumber');
    },
  );
  smokeCase(
    'sales.markShipped:required',
    { operation: 'markShipped', path: '/sales/{orderNumber}/mark-shipped' },
    'markShipped: only required params',
    async () => {
      const saleDetail = await client.sales.markShipped('orderNumber');
    },
  );
  smokeCase(
    'sales.markShipped:all',
    { operation: 'markShipped', path: '/sales/{orderNumber}/mark-shipped' },
    'markShipped: required and optional params',
    async () => {
      const saleDetail = await client.sales.markShipped('orderNumber', {
        trackingNumber: 'xxxxx',
        trackingUrl: 'https://track.sortswift.example/l/00310110084032371774',
        signatureConfirmed: false,
        metadata: { fulfillment_stage: 'packed', picked_by: null },
      });
    },
  );
  smokeCase(
    'sales.cancel:single',
    { operation: 'cancel', path: '/sales/{orderNumber}/cancel' },
    'cancel',
    async () => {
      const saleDetail = await client.sales.cancel('orderNumber', {
        reason: 'item_unavailable',
        reasonText: 'xxxxxxxxxx',
      });
    },
  );
  smokeCase(
    'sales.refund:single',
    { operation: 'refund', path: '/sales/{orderNumber}/refunds' },
    'refund',
    async () => {
      const saleDetail = await client.sales.refund('orderNumber', {
        amount: 2.5,
      });
    },
  );
  smokeCase(
    'sales.setMetadata:single',
    { operation: 'setMetadata', path: '/sales/{orderNumber}/metadata' },
    'setMetadata',
    async () => {
      const saleDetail = await client.sales.setMetadata('orderNumber', {
        metadata: { fulfillment_stage: 'packed', picked_by: null },
      });
    },
  );
});
