// File generated from our OpenAPI spec by Scalar. See README.md for details.

import { APIResource } from '../resource';
import { Webhook } from 'standardwebhooks';

export class Webhooks extends APIResource {
  unwrap(
    body: string,
    { headers, key }: { headers: Record<string, string>; key?: string },
  ): ParsedWebhookEvent {
    if (headers !== undefined) {
      const keyStr: string | null = key === undefined ? this._client.webhookSecret : key;
      if (keyStr === null) throw new Error('Webhook key must not be null in order to unwrap');
      const wh = new Webhook(keyStr);
      wh.verify(body, headers);
    }
    return JSON.parse(body) as ParsedWebhookEvent;
  }
}

export interface OfferCreatedWebhookEvent {
  /**
   * A stable event ID, identical on retries for this recipient.
   */
  eventId: string;
  /**
   * When the offer changed.
   * @format date-time
   */
  timestamp: string;
  /**
   * Your account's stable, opaque ID.
   */
  account: string;
  /**
   * Your role in this offer.
   */
  recipientRole: 'buyer' | 'seller';
  /**
   * The event type.
   */
  type: 'offer.created';
  /**
   * The opening proposal and offer facts.
   */
  data: OfferCreatedWebhookEvent.Data;
}

export namespace OfferCreatedWebhookEvent {
  export interface Data {
    /**
     * A stable, opaque offer ID.
     * @minLength 1
     * @maxLength 200
     */
    offerId: string;
    /**
     * The current proposal at the time of this event.
     * @minLength 1
     * @maxLength 200
     */
    proposalId: string;
    /**
     * The offer's initial state.
     */
    status: 'pending';
    /**
     * Who caused the change.
     */
    actorRole: 'buyer' | 'seller' | 'system';
    /**
     * The current proposal subtotal at the time of the change.
     */
    total: Data.Total;
    /**
     * The redemption deadline, when accepted.
     * @format date-time
     */
    expiresAt: string | null;
    /**
     * Why the offer was voided, when applicable.
     */
    voidReason:
      | 'basket_changed'
      | 'listing_changed'
      | 'seller_unavailable'
      | 'seller_paused'
      | 'offers_disabled'
      | 'expired'
      | null;
    /**
     * When this change occurred.
     * @format date-time
     */
    changedAt: string;
  }

  export namespace Data {
    export interface Total {
      /**
       * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
       */
      amount: number;
      currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
    }
  }
}

export interface OfferUpdatedWebhookEvent {
  /**
   * A stable event ID, identical on retries for this recipient.
   */
  eventId: string;
  /**
   * When the offer changed.
   * @format date-time
   */
  timestamp: string;
  /**
   * Your account's stable, opaque ID.
   */
  account: string;
  /**
   * Your role in this offer.
   */
  recipientRole: 'buyer' | 'seller';
  /**
   * The event type.
   */
  type: 'offer.updated';
  /**
   * The offer facts captured for this change.
   */
  data: OfferUpdatedWebhookEvent.Data;
}

export namespace OfferUpdatedWebhookEvent {
  export interface Data {
    /**
     * A stable, opaque offer ID.
     * @minLength 1
     * @maxLength 200
     */
    offerId: string;
    /**
     * The current proposal at the time of this event.
     * @minLength 1
     * @maxLength 200
     */
    proposalId: string;
    /**
     * The state of your negotiation.
     */
    status: 'pending' | 'countered' | 'accepted' | 'declined' | 'cancelled' | 'voided';
    /**
     * Who caused the change.
     */
    actorRole: 'buyer' | 'seller' | 'system';
    /**
     * The current proposal subtotal at the time of the change.
     */
    total: Data.Total;
    /**
     * The redemption deadline, when accepted.
     * @format date-time
     */
    expiresAt: string | null;
    /**
     * Why the offer was voided, when applicable.
     */
    voidReason:
      | 'basket_changed'
      | 'listing_changed'
      | 'seller_unavailable'
      | 'seller_paused'
      | 'offers_disabled'
      | 'expired'
      | null;
    /**
     * When this change occurred.
     * @format date-time
     */
    changedAt: string;
    /**
     * The operation that changed the offer.
     */
    reason: 'countered' | 'accepted' | 'declined' | 'cancelled' | 'voided';
    /**
     * The offer's state immediately before this change.
     */
    previousStatus: 'pending' | 'countered' | 'accepted' | 'declined' | 'cancelled' | 'voided';
  }

  export namespace Data {
    export interface Total {
      /**
       * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
       */
      amount: number;
      currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
    }
  }
}

export interface OrderCreatedWebhookEvent {
  type: 'order.created';
  /**
   * Idempotency key. Stable across retries of the same delivery; safe to dedupe on.
   */
  eventId: string;
  /**
   * When this webhook was emitted (ISO 8601, UTC).
   * @format date-time
   */
  timestamp: string;
  /**
   * Whether this delivery is for the seller or the buyer side of the order. The same order produces two deliveries — one to each role.
   */
  recipientRole: 'seller' | 'buyer';
  /**
   * Order details, shaped for the recipient role.
   */
  data: OrderCreatedWebhookEvent.Data;
}

export namespace OrderCreatedWebhookEvent {
  export interface Data {
    /**
     * Stable order identifier (e.g. `OR-ASNBC-1`).
     */
    orderNumber: string;
    /**
     * Current status of the order at the time of the event.
     */
    status: 'pending_payment' | 'pending_shipment' | 'shipped' | 'delivered' | 'completed' | 'cancelled';
    currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
    /**
     * Order total including any shipping and fees.
     */
    totalAmount: Data.TotalAmount;
    /**
     * Total number of items across all line items.
     * @minimum 1
     * @maximum 9007199254740991
     */
    itemCount: number;
    /**
     * Per-line-item breakdown.
     */
    items: Array<Data.Item>;
    counterparty: Data.Counterparty;
    /**
     * When the order was placed.
     * @format date-time
     */
    createdAt: string;
  }

  export namespace Data {
    export interface TotalAmount {
      /**
       * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
       */
      amount: number;
      currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
    }

    export interface Item {
      /**
       * The catalogue product that was purchased. Returned by `GET /v1/products`.
       * @minimum -9007199254740991
       * @maximum 9007199254740991
       */
      productId: number;
      /**
       * Product name at time of purchase.
       */
      name: string;
      /**
       * How many of this product.
       * @minimum 1
       * @maximum 9007199254740991
       */
      quantity: number;
      /**
       * Price per unit at time of purchase.
       */
      unitPrice: Item.UnitPrice;
      /**
       * The inventory line this item sold from. Included when you receive this as the seller. Look it up with `GET /v1/inventory/{inventoryId}`.
       */
      inventoryId?: string;
      /**
       * Your own identifier for the inventory line this item sold from, captured at the time of sale. Included when you receive this as the seller; `null` when the line had none.
       * @minLength 1
       * @maxLength 255
       */
      customId?: string | null;
    }

    export namespace Item {
      export interface UnitPrice {
        /**
         * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
         */
        amount: number;
        currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
      }
    }

    export interface Counterparty {
      /**
       * The other side of the order — buyer's username when you receive this as a seller, seller's username when you receive it as a buyer.
       */
      username: string;
      /**
       * ISO 3166-1 alpha-2 country code of the counterparty's account.
       * @minLength 2
       * @maxLength 2
       */
      country?: string;
    }
  }
}

export interface OrderStatusChangedWebhookEvent {
  type: 'order.status.changed';
  /**
   * Idempotency key. Stable across retries of the same delivery; safe to dedupe on.
   */
  eventId: string;
  /**
   * When this webhook was emitted (ISO 8601, UTC).
   * @format date-time
   */
  timestamp: string;
  /**
   * Whether this delivery is for the seller or the buyer side of the order. The same transition produces two deliveries — one to each role.
   */
  recipientRole: 'seller' | 'buyer';
  /**
   * The order's new status and where it moved from.
   */
  data: OrderStatusChangedWebhookEvent.Data;
}

export namespace OrderStatusChangedWebhookEvent {
  export interface Data {
    /**
     * Stable order identifier (e.g. `OR-ASNBC-1`).
     */
    orderNumber: string;
    /**
     * The order's new status.
     */
    status:
      | 'pending_shipment'
      | 'cancellation_requested'
      | 'cancelled_buyer'
      | 'cancelled_seller'
      | 'cancelled_auto'
      | 'shipped'
      | 'delivered'
      | 'completed'
      | 'dispute_open'
      | 'dispute_escalated'
      | 'resolved_full_refund'
      | 'resolved_partial_refund'
      | 'resolved_no_refund'
      | 'resolved_return'
      | 'resolved_goodwill_refund';
    /**
     * The status the order moved from. `null` for the order's very first status.
     */
    previousStatus:
      | 'pending_shipment'
      | 'cancellation_requested'
      | 'cancelled_buyer'
      | 'cancelled_seller'
      | 'cancelled_auto'
      | 'shipped'
      | 'delivered'
      | 'completed'
      | 'dispute_open'
      | 'dispute_escalated'
      | 'resolved_full_refund'
      | 'resolved_partial_refund'
      | 'resolved_no_refund'
      | 'resolved_return'
      | 'resolved_goodwill_refund'
      | null;
    /**
     * When the status changed.
     * @format date-time
     */
    changedAt: string;
    /**
     * Why the status changed, when one applies (e.g. a cancellation or dispute reason). `null` otherwise.
     */
    reason: string | null;
    /**
     * Your own metadata on the sale, as it stands after the change — so you can match the order to your own records without a follow-up call. `null` on the buyer's copy: metadata belongs to the seller alone.
     */
    metadata: Record<string, string> | null;
  }
}

export interface MessageReceivedWebhookEvent {
  type: 'message.received';
  /**
   * Idempotency key. Stable across retries of the same delivery; safe to dedupe on.
   */
  eventId: string;
  /**
   * When this webhook was emitted (ISO 8601, UTC).
   * @format date-time
   */
  timestamp: string;
  /**
   * Who sent the message and which conversation it belongs to.
   */
  data: MessageReceivedWebhookEvent.Data;
}

export namespace MessageReceivedWebhookEvent {
  export interface Data {
    /**
     * Opaque identifier for the conversation the message belongs to. Treat it as a stable token — don't parse it.
     */
    threadId: string;
    /**
     * Opaque identifier for the message.
     */
    messageId: string;
    /**
     * What the conversation is about. Always `type: "order"` today; switch on `context.type` so new conversation types added later don't break your integration.
     */
    context: Data.Context;
    sender: Data.Sender;
    /**
     * When the message was sent.
     * @format date-time
     */
    sentAt: string;
    /**
     * Whether the message carries one or more attachments.
     */
    hasAttachments: boolean;
  }

  export namespace Data {
    export interface Context {
      type: 'order';
      /**
       * The order the conversation is attached to.
       */
      orderNumber: string;
      /**
       * `main` is your conversation with the other party; `support` is your conversation with CardNexus support.
       */
      scope: 'main' | 'support';
      /**
       * Your side of the order.
       */
      yourRole: 'buyer' | 'seller';
    }

    export interface Sender {
      /**
       * The handle of whoever sent the message. CardNexus support appears as `cardnexus_support`.
       */
      username: string;
    }
  }
}

export interface BalanceUpdatedWebhookEvent {
  type: 'balance.updated';
  /**
   * Idempotency key. Stable across retries of the same delivery; safe to dedupe on.
   */
  eventId: string;
  /**
   * When this webhook was emitted (ISO 8601, UTC).
   * @format date-time
   */
  timestamp: string;
  /**
   * Your wallet balance after the change.
   */
  data: BalanceUpdatedWebhookEvent.Data;
}

export namespace BalanceUpdatedWebhookEvent {
  export interface Data {
    /**
     * Funds available to be paid out to your bank account.
     */
    available: Data.Available;
    /**
     * Funds from recent sales still clearing, not yet available to pay out.
     */
    pending: Data.Pending;
    /**
     * When this balance was last refreshed from the payment processor.
     * @format date-time
     */
    updatedAt: string;
  }

  export namespace Data {
    export interface Available {
      /**
       * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
       */
      amount: number;
      currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
    }

    export interface Pending {
      /**
       * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
       */
      amount: number;
      currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
    }
  }
}

export interface InventoryQuantityChangedWebhookEvent {
  type: 'inventory.quantity.changed';
  /**
   * Idempotency key. Stable across retries of the same delivery; safe to dedupe on. When a change set is split across several deliveries, each delivery has its own eventId.
   */
  eventId: string;
  /**
   * When this webhook was emitted (ISO 8601, UTC).
   * @format date-time
   */
  timestamp: string;
  /**
   * The quantity changes and what caused them.
   */
  data: InventoryQuantityChangedWebhookEvent.Data;
}

export namespace InventoryQuantityChangedWebhookEvent {
  export interface Data {
    /**
     * What caused the change. `order` — a sale reduced your stock. `order_cancelled` — a cancelled order put stock back. `import` — a bulk import ran. `edit` — your inventory was edited directly. `listing` — a listing operation changed quantities.
     */
    reason: 'order' | 'order_cancelled' | 'import' | 'edit' | 'listing';
    /**
     * One entry per inventory line whose quantity changed. Lines whose quantity stayed the same are not included. Each delivery carries up to 500 entries; larger change sets arrive as several deliveries.
     */
    changes: Array<Data.Change>;
  }

  export namespace Data {
    export interface Change {
      /**
       * The inventory line's unique identifier.
       */
      inventoryId: string;
      /**
       * Your own identifier for this line, if you've set one. `null` otherwise.
       */
      customId: string | null;
      /**
       * The catalogue product this line stocks.
       * @minimum -9007199254740991
       * @maximum 9007199254740991
       */
      productId: number;
      /**
       * Quantity on the line before the change.
       * @minimum 0
       * @maximum 9007199254740991
       */
      before: number;
      /**
       * Quantity on the line after the change.
       * @minimum 0
       * @maximum 9007199254740991
       */
      after: number;
    }
  }
}

export interface InventoryImportCompletedWebhookEvent {
  type: 'inventory.import.completed';
  /**
   * Idempotency key. Stable across retries of the same delivery; safe to dedupe on.
   */
  eventId: string;
  /**
   * When this webhook was emitted (ISO 8601, UTC).
   * @format date-time
   */
  timestamp: string;
  /**
   * The finished import job. `status` tells the two shapes apart: a `completed` job carries per-row counts and, when rows failed, an error-report link; a `failed` job carries a `null` report link.
   */
  data: InventoryImportCompletedWebhookEvent.Data | InventoryImportCompletedWebhookEvent.Data2;
}

export namespace InventoryImportCompletedWebhookEvent {
  export interface Data {
    /**
     * The import job's unique identifier, as returned when you started the import.
     */
    jobId: string;
    /**
     * The import job completed.
     */
    status: 'completed';
    /**
     * Per-row outcome of the import.
     */
    counts: Data.Counts;
    /**
     * A time-limited link to a report describing the rows that could not be imported. `null` when every row succeeded.
     */
    errorReportUrl: string | null;
  }

  export namespace Data {
    export interface Counts {
      /**
       * Total number of rows in the file you submitted.
       * @minimum 0
       * @maximum 9007199254740991
       */
      total: number;
      /**
       * Rows that were imported.
       * @minimum 0
       * @maximum 9007199254740991
       */
      succeeded: number;
      /**
       * Rows that could not be imported.
       * @minimum 0
       * @maximum 9007199254740991
       */
      failed: number;
    }
  }

  export interface Data2 {
    /**
     * The import job's unique identifier, as returned when you started the import.
     */
    jobId: string;
    /**
     * The import job failed — the file could not be processed.
     */
    status: 'failed';
    /**
     * Per-row outcome of the import.
     */
    counts: Data2.Counts;
    /**
     * Always `null`: a failed import produces no row report.
     */
    errorReportUrl: null;
  }

  export namespace Data2 {
    export interface Counts {
      /**
       * Total number of rows in the file you submitted.
       * @minimum 0
       * @maximum 9007199254740991
       */
      total: number;
      /**
       * Rows that were imported.
       * @minimum 0
       * @maximum 9007199254740991
       */
      succeeded: number;
      /**
       * Rows that could not be imported.
       * @minimum 0
       * @maximum 9007199254740991
       */
      failed: number;
    }
  }
}

export interface InventoryExportCompletedWebhookEvent {
  type: 'inventory.export.completed';
  /**
   * Idempotency key. Stable across retries of the same delivery; safe to dedupe on.
   */
  eventId: string;
  /**
   * When this webhook was emitted (ISO 8601, UTC).
   * @format date-time
   */
  timestamp: string;
  /**
   * The finished export job. `status` tells the two shapes apart: a `completed` job carries a download link, a `failed` job carries `null` link fields.
   */
  data: InventoryExportCompletedWebhookEvent.Data | InventoryExportCompletedWebhookEvent.Data2;
}

export namespace InventoryExportCompletedWebhookEvent {
  export interface Data {
    /**
     * The export job's unique identifier, as returned when you started the export.
     */
    jobId: string;
    /**
     * The export job completed.
     */
    status: 'completed';
    /**
     * A time-limited link to download the exported file. It stops working at `expiresAt`.
     */
    downloadUrl: string;
    /**
     * When `downloadUrl` stops working.
     * @format date-time
     */
    expiresAt: string;
  }

  export interface Data2 {
    /**
     * The export job's unique identifier, as returned when you started the export.
     */
    jobId: string;
    /**
     * The export job failed.
     */
    status: 'failed';
    /**
     * Always `null`: a failed export produces no file.
     */
    downloadUrl: null;
    /**
     * Always `null`: there is no download link to expire.
     */
    expiresAt: null;
  }
}

export interface OptimizerRunCompletedWebhookEvent {
  type: 'optimizer.run.completed';
  /**
   * Idempotency key — stable across delivery retries.
   */
  eventId: string;
  /**
   * An ISO 8601 date-time in UTC, e.g. `2024-08-14T10:23:11.000Z`.
   * @format date-time
   */
  timestamp: string;
  data: OptimizerRunCompletedWebhookEvent.Data;
}

export namespace OptimizerRunCompletedWebhookEvent {
  export interface Data {
    /**
     * The run's identifier.
     */
    runId: string;
    /**
     * Summary of each computed option. Fetch `GET /v1/optimizer/runs/{id}` for the full per-seller breakdown.
     */
    options: Array<Data.Option>;
    /**
     * How many targets could not be fully sourced.
     * @minimum -9007199254740991
     * @maximum 9007199254740991
     */
    unmetCount: number;
  }

  export namespace Data {
    export interface Option {
      /**
       * The objectives this option satisfies. When two modes produce the same solution, the run returns one option listing both.
       */
      modes: Array<'lowest_price' | 'fewest_sellers' | 'balanced'>;
      /**
       * Number of distinct sellers (packages).
       * @minimum -9007199254740991
       * @maximum 9007199254740991
       */
      sellerCount: number;
      /**
       * Grand total the buyer pays.
       */
      total: Option.Total;
      /**
       * Cards subtotal across all sellers.
       */
      subtotal: Option.Subtotal;
      /**
       * Total shipping across all sellers.
       */
      shipping: Option.Shipping;
    }

    export namespace Option {
      export interface Total {
        /**
         * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
         */
        amount: number;
        currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
      }

      export interface Subtotal {
        /**
         * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
         */
        amount: number;
        currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
      }

      export interface Shipping {
        /**
         * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
         */
        amount: number;
        currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
      }
    }
  }
}

export interface OptimizerRunFailedWebhookEvent {
  type: 'optimizer.run.failed';
  /**
   * Idempotency key — stable across delivery retries.
   */
  eventId: string;
  /**
   * An ISO 8601 date-time in UTC, e.g. `2024-08-14T10:23:11.000Z`.
   * @format date-time
   */
  timestamp: string;
  data: OptimizerRunFailedWebhookEvent.Data;
}

export namespace OptimizerRunFailedWebhookEvent {
  export interface Data {
    /**
     * The run's identifier.
     */
    runId: string;
    /**
     * Why the run failed, when known.
     */
    reason: string | null;
  }
}

export type ParsedWebhookEvent =
  | OfferCreatedWebhookEvent
  | OfferUpdatedWebhookEvent
  | OrderCreatedWebhookEvent
  | OrderStatusChangedWebhookEvent
  | MessageReceivedWebhookEvent
  | BalanceUpdatedWebhookEvent
  | InventoryQuantityChangedWebhookEvent
  | InventoryImportCompletedWebhookEvent
  | InventoryExportCompletedWebhookEvent
  | OptimizerRunCompletedWebhookEvent
  | OptimizerRunFailedWebhookEvent;

export declare namespace Webhooks {
  export {
    type OfferCreatedWebhookEvent as OfferCreatedWebhookEvent,
    type OfferUpdatedWebhookEvent as OfferUpdatedWebhookEvent,
    type OrderCreatedWebhookEvent as OrderCreatedWebhookEvent,
    type OrderStatusChangedWebhookEvent as OrderStatusChangedWebhookEvent,
    type MessageReceivedWebhookEvent as MessageReceivedWebhookEvent,
    type BalanceUpdatedWebhookEvent as BalanceUpdatedWebhookEvent,
    type InventoryQuantityChangedWebhookEvent as InventoryQuantityChangedWebhookEvent,
    type InventoryImportCompletedWebhookEvent as InventoryImportCompletedWebhookEvent,
    type InventoryExportCompletedWebhookEvent as InventoryExportCompletedWebhookEvent,
    type OptimizerRunCompletedWebhookEvent as OptimizerRunCompletedWebhookEvent,
    type OptimizerRunFailedWebhookEvent as OptimizerRunFailedWebhookEvent,
    type ParsedWebhookEvent as ParsedWebhookEvent,
  };
}
