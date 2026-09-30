// File generated from our OpenAPI spec by Scalar. See README.md for details.

import { APIResource } from '../resource';
import { APIPromise } from '../api-promise';
import type { RequestOptions } from '../internal/request-options';

export class Tracking extends APIResource {
  /**
   * Records the mail and carrier scans of shipments whose labels your application printed. Only available to applications CardNexus has granted the tracking privilege; any other application gets `403 FORBIDDEN`.
   *
   * Call it with your application credential and no `CardNexus-Account` header. Each shipment is matched by tracking number to the sales of sellers who connected your application with the `sales:write` scope. A tracking number that matches no sale yet returns `matchedSales: 0`; send the shipment again with its next scan and the earlier ones are recorded then.
   *
   * Send every scan you have for a shipment each time. Scans are matched by `eventId`, so a scan you already sent is counted in `duplicates` and recorded only once.
   *
   * A `delivered` scan marks the sale delivered, for parcels and letters alike.
   *
   * Scans appear in `shipping.history` with `source: "application"`.
   *
   * @param {TrackingPushEventsParams} body - The request body to send.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<TrackingPushEventsResponse>} Scans processed.
   *
   * @example
   * ```ts
   * const tracking = await client.tracking.pushEvents({
   *   shipments: [
   *     {
   *       trackingNumber: '00310110084032371774',
   *       trackingUrl: 'https://track.sortswift.example/l/00310110084032371774',
   *       events: [
   *         {
   *           eventId: 'evt_8811',
   *           status: 'label_created',
   *           occurredAt: '2026-09-21T10:21:00.000Z',
   *           location: { city: 'Laurel', state: 'MD' },
   *           description: 'Label created',
   *         },
   *         {
   *           eventId: 'evt_8812',
   *           status: 'in_mailstream',
   *           occurredAt: '2026-09-22T23:35:00.000Z',
   *           location: { city: 'Gaithersburg', state: 'MD', postalCode: '20898' },
   *           description: 'Origin processing',
   *         },
   *       ],
   *     },
   *   ],
   * });
   * ```
   */
  pushEvents(
    body: TrackingPushEventsParams,
    options?: RequestOptions,
  ): APIPromise<TrackingPushEventsResponse> {
    return this._client.post('/tracking/events', { body, ...options });
  }
}

export interface TrackingPushEventsParams {
  /**
   * Up to 100 shipments per request.
   * @minItems 1
   * @maxItems 100
   */
  shipments: Array<TrackingPushEventsParams.Shipment>;
}

export namespace TrackingPushEventsParams {
  export interface Shipment {
    /**
     * The tracking number the sale was marked shipped with — the same value sent to `POST /v1/sales/{orderNumber}/mark-shipped` or typed by the seller.
     * @minLength 5
     * @maxLength 50
     * @pattern ^[a-zA-Z0-9_-]+$
     */
    trackingNumber: string;
    /**
     * The shipment's scans, in any order. Send every scan you have each time; scans already recorded are skipped.
     * @minItems 1
     * @maxItems 100
     */
    events: Array<Shipment.Event>;
    /**
     * A link to your own tracking page for this shipment. Shown to the buyer when the sale has no tracking link yet; an existing link is kept.
     * @format uri
     * @maxLength 2048
     */
    trackingUrl?: string;
  }

  export namespace Shipment {
    export interface Event {
      /**
       * Your identifier for this scan. Sending the same `eventId` again for the same tracking number records nothing new.
       * @minLength 1
       * @maxLength 128
       */
      eventId: string;
      /**
       * What the scan says about the shipment.
       */
      status:
        | 'label_created'
        | 'in_mailstream'
        | 'at_destination'
        | 'out_for_delivery'
        | 'delivered'
        | 'returned'
        | 'exception';
      /**
       * When the scan happened.
       * @format date-time
       */
      occurredAt: string;
      /**
       * Where a scan happened. Every field is optional.
       */
      location?: Event.Location;
      /**
       * The carrier's own text for the scan, shown to the buyer as is.
       * @minLength 1
       * @maxLength 500
       */
      description?: string;
    }

    export namespace Event {
      export interface Location {
        /**
         * City of the scan.
         * @minLength 1
         * @maxLength 100
         */
        city?: string;
        /**
         * State, province or region of the scan, e.g. `MD`.
         * @minLength 1
         * @maxLength 100
         */
        state?: string;
        /**
         * Postal code of the scan, e.g. `20898`.
         * @minLength 1
         * @maxLength 20
         */
        postalCode?: string;
      }
    }
  }
}

export interface TrackingPushEventsResponse {
  /**
   * One result per shipment, in the order you sent them.
   */
  shipments: Array<TrackingPushEventsResponse.Shipment>;
}

export namespace TrackingPushEventsResponse {
  export interface Shipment {
    /**
     * The tracking number you sent.
     */
    trackingNumber: string;
    /**
     * How many sales the scans were recorded on. `0` when no sale of a seller connected to your application carries this tracking number yet.
     * @minimum -9007199254740991
     * @maximum 9007199254740991
     */
    matchedSales: number;
    /**
     * How many of the scans were new and recorded.
     * @minimum -9007199254740991
     * @maximum 9007199254740991
     */
    accepted: number;
    /**
     * How many of the scans were already recorded.
     * @minimum -9007199254740991
     * @maximum 9007199254740991
     */
    duplicates: number;
  }
}
export declare namespace Tracking {
  export {
    type TrackingPushEventsResponse as TrackingPushEventsResponse,
    type TrackingPushEventsParams as TrackingPushEventsParams,
  };
}
