// File generated from our OpenAPI spec by Scalar. See README.md for details.

import { APIResource } from '../resource';
import { APIPromise } from '../api-promise';
import type { RequestOptions } from '../internal/request-options';
import { path as __scalarPath } from '../internal/utils/path';
import type * as OffersAPI from './offers';
import type * as PricingAPI from './pricing';
import type * as LinesAPI from './lines';
import type * as AccountAPI from './account/account';
import type * as RunsAPI from './optimizer/runs';

export class Sales extends APIResource {
  /**
   * Returns your sales — orders where you are the seller — as a cursor-paginated list, newest first.
   *
   * Each item carries the order, its items and totals, the **buyer** you sold to — their handle, country, review score, and recent order-handling stats — and the address to ship to, so a batch of parcels can be prepared from one call.
   *
   * Filter with `status` (repeatable), the `placedFrom` / `placedTo` date range, and your own `metadata` — `?metadata[fulfillment_stage]=packed` returns the sales carrying exactly that pair, and repeating the parameter with another key requires all of them. Walk the full set by following `pagination.nextCursor`: pass it back as `cursor` until it comes back `null`. `limit` defaults to 50, maximum 100.
   *
   * Requires the `sales:read` scope.
   *
   * @param {SaleListParams} [query] - The parameters to send with the request.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<SaleListResponse>} Sales returned.
   *
   * @example
   * ```ts
   * const sale = await client.sales.list({
   *   limit: 50,
   * });
   * ```
   */
  list(
    query: SaleListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<SaleListResponse> {
    return this._client.get('/sales', { query, ...options });
  }

  /**
   * Returns one of your sales in full — the seller view of the order.
   *
   * On top of the items and totals, you get the fee breakdown, your payout and when it's eligible, the buyer's shipping address, tracking, and the buyer's profile (country, review score, recent order-handling stats).
   *
   * Only the seller on the order can read it; any other order number returns `404 Not Found`.
   *
   * Requires the `sales:read` scope.
   *
   * @param {string} orderNumber - The order reference, e.g. `OR-ASNBC-1`. Path parameter — not a query string.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<SaleDetail>} Sale returned.
   *
   * @example
   * ```ts
   * const saleDetail = await client.sales.retrieve('orderNumber');
   * ```
   */
  retrieve(orderNumber: string, options?: RequestOptions): APIPromise<SaleDetail> {
    return this._client.get(__scalarPath`/sales/${orderNumber}`, options);
  }

  /**
   * Marks one of your sales shipped and registers its tracking number. The order moves to `shipped`, and the buyer is notified.
   *
   * The order must be awaiting dispatch (`pending_shipment`) or have an open cancellation request (`cancellation_requested`) — you can still ship within the cancellation-request window. Any other status returns `409 INVALID_STATUS`.
   *
   * The response carries a tracking link under `shipping`. The carrier is detected automatically from the tracking number and appears on the sale once detection completes. A tracking number that is rejected as invalid returns `422 TRACKING_REGISTRATION_FAILED`. Pass `trackingUrl` to show the buyer your own tracking page instead.
   *
   * A USPS Intelligent Mail barcode (IMb) number ships the sale as a letter: `shipping.type` is `letter` and the carrier is `usps`. CardNexus cannot follow IMb scans itself; the application that printed the label sends them with `POST /v1/tracking/events`.
   *
   * Pass `metadata` to stamp your own key/value pairs in the same call, merged the same way `PATCH /v1/sales/{orderNumber}/metadata` merges them. The two either both apply or neither does: a tracking number rejected as invalid leaves the sale's metadata unchanged, and metadata that would take the sale past its key limit returns `422 METADATA_LIMIT_EXCEEDED` without shipping the order.
   *
   * CardNexus Shield shipping insurance cannot be opted into through the API — sales shipped here are uninsured. Use the web or mobile app to insure a shipment.
   *
   * Sales on CardNexus-managed shipping cannot be self-shipped: the buyer already paid CardNexus for the label, so shipping them here would cost you the postage twice. Those sales return `409 SHIPPING_MANAGED_BY_CARDNEXUS`. Generate the shipping label from the web app instead.
   *
   * Returns the updated sale, in the same shape as `GET /v1/sales/{orderNumber}`.
   *
   * Send an `Idempotency-Key` header to make retries safe: the same key returns the same response for 24 hours.
   *
   * Requires the `sales:write` scope.
   *
   * @param {string} orderNumber - The order reference, e.g. `OR-ASNBC-1`. Path parameter — not a query string.
   * @param {SaleMarkShippedParams} body - The request body to send.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<SaleDetail>} Sale marked shipped.
   *
   * @example
   * ```ts
   * const saleDetail = await client.sales.markShipped('orderNumber', {
   *   trackingNumber: 'xxxxx',
   * });
   * ```
   */
  markShipped(
    orderNumber: string,
    body: SaleMarkShippedParams,
    options?: RequestOptions,
  ): APIPromise<SaleDetail> {
    return this._client.post(__scalarPath`/sales/${orderNumber}/mark-shipped`, { body, ...options });
  }

  /**
   * Cancels one of your sales. The order moves to `cancelled_seller`, the buyer is refunded in full, and the cards return to your inventory.
   *
   * The order must be awaiting dispatch (`pending_shipment`). Any other status returns `409 INVALID_STATUS`.
   *
   * `reasonText` is shown to the buyer along with the reason code, and both appear on the sale's `cancellation` afterwards.
   *
   * Returns the updated sale, in the same shape as `GET /v1/sales/{orderNumber}`.
   *
   * Send an `Idempotency-Key` header to make retries safe: the same key returns the same response for 24 hours.
   *
   * Requires the `sales:write` scope.
   *
   * @param {string} orderNumber - The order reference, e.g. `OR-ASNBC-1`. Path parameter — not a query string.
   * @param {SaleCancelParams} body - The request body to send.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<SaleDetail>} Sale cancelled.
   *
   * @example
   * ```ts
   * const saleDetail = await client.sales.cancel('orderNumber', {
   *   reason: 'item_unavailable',
   *   reasonText: 'xxxxxxxxxx',
   * });
   * ```
   */
  cancel(orderNumber: string, body: SaleCancelParams, options?: RequestOptions): APIPromise<SaleDetail> {
    return this._client.post(__scalarPath`/sales/${orderNumber}/cancel`, { body, ...options });
  }

  /**
   * Refunds part of one of your sales to the buyer. The refund is issued immediately and cannot be undone. The buyer is notified of the refund.
   *
   * The refund is taken from the order payment CardNexus holds, so it lowers your payout for this sale. Nothing is debited from your account.
   *
   * If the buyer used a CardNexus coupon on the order, the refund is split in the same proportion as their payment: part goes back to their payment method and the rest comes off their coupon. The buyer is told how much of each.
   *
   * `amount` is in your selling currency — the sale's `currency`. You can refund a sale more than once, but all refunds on a sale together must stay below the sale's total (items plus the shipping you charged). An amount above what you can still refund returns `409 AMOUNT_TOO_HIGH`, with the most you can still refund in `maxAllowed`. To refund the buyer in full, cancel the sale with `POST /v1/sales/{orderNumber}/cancel` while it is awaiting dispatch (`pending_shipment`).
   *
   * The order must be `pending_shipment`, `cancellation_requested`, `shipped`, or `delivered`. Any other status returns `409 INVALID_STATUS`.
   *
   * While another refund or payout on the sale is being processed, the request returns `409 REFUND_IN_PROGRESS`. Read the sale with `GET /v1/sales/{orderNumber}` before you retry: `refunded` is the total refunded so far.
   *
   * Returns the updated sale, in the same shape as `GET /v1/sales/{orderNumber}`. Its `refunded` includes this refund.
   *
   * Send an `Idempotency-Key` header to make retries safe: the same key returns the same response for 24 hours.
   *
   * Requires the `sales:write` scope.
   *
   * @param {string} orderNumber - The order reference, e.g. `OR-ASNBC-1`. Path parameter — not a query string.
   * @param {SaleRefundParams} body - The request body to send.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<SaleDetail>} Refund issued.
   *
   * @example
   * ```ts
   * const saleDetail = await client.sales.refund('orderNumber', {
   *   amount: 2.5,
   * });
   * ```
   */
  refund(orderNumber: string, body: SaleRefundParams, options?: RequestOptions): APIPromise<SaleDetail> {
    return this._client.post(__scalarPath`/sales/${orderNumber}/refunds`, { body, ...options });
  }

  /**
   * Writes your own key/value pairs onto one of your sales. Use it to carry a reference from your own system, or a fulfillment state finer than the order statuses CardNexus tracks.
   *
   * The write merges rather than replaces. Keys you send are set, keys you send as `null` are removed, and keys you leave out keep their value — so two systems can each own their keys on the same sale without overwriting each other. An empty string is a value, not a removal; sending `{}` changes nothing.
   *
   * Keys start with a letter and may contain letters, digits, `_`, `.` and `-`, up to 64 characters. Values are strings of up to 500 characters. A sale holds at most 50 keys once the write is applied; a write that would go past that stores nothing and returns `422 METADATA_LIMIT_EXCEEDED`.
   *
   * Metadata can be written in any status, including on completed and cancelled sales. It is yours alone — the buyer never sees it, and it never appears on their purchase.
   *
   * Filter on it with `GET /v1/sales?metadata[key]=value`, and read it back under `metadata` on every sales response.
   *
   * Returns the updated sale, in the same shape as `GET /v1/sales/{orderNumber}`.
   *
   * Send an `Idempotency-Key` header to make retries safe: the same key returns the same response for 24 hours.
   *
   * Requires the `sales:write` scope.
   *
   * @param {string} orderNumber - The order reference, e.g. `OR-ASNBC-1`. Path parameter — not a query string.
   * @param {SaleSetMetadataParams} body - The request body to send.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<SaleDetail>} Metadata updated.
   *
   * @example
   * ```ts
   * const saleDetail = await client.sales.setMetadata('orderNumber', {
   *   metadata: { fulfillment_stage: 'packed', picked_by: null },
   * });
   * ```
   */
  setMetadata(
    orderNumber: string,
    body: SaleSetMetadataParams,
    options?: RequestOptions,
  ): APIPromise<SaleDetail> {
    return this._client.patch(__scalarPath`/sales/${orderNumber}/metadata`, { body, ...options });
  }
}

/**
 * A sale — an order where you are the seller — with the buyer, the address to ship to, your seller fee, and your payout. `refunded` is the total you refunded on this sale so far, in your selling currency; `0` when nothing was refunded.
 */
export interface Sale {
  /**
   * Human-readable order reference, shared across the sale and the purchase, e.g. `OR-ASNBC-1`.
   */
  orderNumber: string;
  /**
   * Where the order is in its lifecycle. `pending_shipment` is awaiting dispatch; `shipped` and `delivered` track the parcel; `completed` is closed and paid out; `cancelled_*` and `resolved_*` are the terminal cancellation and dispute outcomes.
   */
  status: OrderStatus;
  /**
   * When the order was placed.
   * @format date-time
   */
  placedAt: string;
  /**
   * When the order last changed.
   * @format date-time
   */
  updatedAt: string;
  /**
   * When the order was marked shipped. `null` if not yet.
   * @format date-time
   */
  shippedAt: OffersAPI.DateString | null;
  /**
   * When the parcel was delivered. `null` if not yet.
   * @format date-time
   */
  deliveredAt: OffersAPI.DateString | null;
  /**
   * When the order closed. `null` if still open.
   * @format date-time
   */
  completedAt: OffersAPI.DateString | null;
  /**
   * The currency every amount in this response is expressed in. Sales are in your selling currency; purchases are in the currency you paid.
   */
  currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
  /**
   * The items in the order, each tied to the inventory line it sold from.
   */
  items: Array<Sale.Item>;
  /**
   * A monetary amount as a decimal in the currency's major unit paired with its currency code — `{ amount: 14.99, currency: "USD" }` means $14.99.
   */
  subtotal: AccountAPI.Money;
  /**
   * A monetary amount as a decimal in the currency's major unit paired with its currency code — `{ amount: 14.99, currency: "USD" }` means $14.99.
   */
  shippingAmount: AccountAPI.Money;
  /**
   * The seller fee CardNexus charged on a sale.
   */
  sellerFee: SellerFee;
  /**
   * Your payout for a sale and its transfer timeline.
   */
  payout: SalePayout;
  /**
   * A monetary amount as a decimal in the currency's major unit paired with its currency code — `{ amount: 14.99, currency: "USD" }` means $14.99.
   */
  refunded: AccountAPI.Money;
  /**
   * The other party on an order — the buyer on a sale, the seller on a purchase — with their public profile and reputation.
   */
  buyer: OrderParty;
  /**
   * A postal address an order ships to.
   */
  shippingAddress: OrderShippingAddress;
  /**
   * Your own key/value pairs on this sale. Empty when you haven't set any. Keys start with a letter and may contain letters, digits, `_`, `.` and `-`, up to 64 characters; values are strings of up to 500 characters. A sale holds at most 50 keys. The buyer never sees them.
   */
  metadata: OrderMetadata;
}

export namespace Sale {
  export interface Item {
    /**
     * The catalogue product that was sold. Returned by `GET /v1/products`. `null` when the product is no longer in the catalogue.
     * @minimum -9007199254740991
     * @maximum 9007199254740991
     */
    productId: OffersAPI.CatalogID | null;
    /**
     * The product name captured at the time of sale.
     */
    productName: string;
    /**
     * The product image captured at the time of sale. `null` when there is none.
     */
    imageUrl: string | null;
    /**
     * The card's condition: `NM`, `LP`, `MP`, `HP`, or `DMG`. `null` when the item is graded or sealed.
     */
    condition: PricingAPI.CardCondition | null;
    /**
     * The card's language as a two-letter code, e.g. `en`, `fr`.
     */
    language: string;
    /**
     * The card's finish, e.g. `Standard`, `Foil`, `Reverse Holo`.
     */
    finish: string;
    /**
     * Grading details when the item is graded. `null` for raw cards and sealed products.
     */
    graded: LinesAPI.Graded | null;
    /**
     * How many units of this item were sold.
     * @minimum -9007199254740991
     * @maximum 9007199254740991
     */
    quantity: number;
    /**
     * A monetary amount as a decimal in the currency's major unit paired with its currency code — `{ amount: 14.99, currency: "USD" }` means $14.99.
     */
    unitPrice: AccountAPI.Money;
    /**
     * A monetary amount as a decimal in the currency's major unit paired with its currency code — `{ amount: 14.99, currency: "USD" }` means $14.99.
     */
    lineTotal: AccountAPI.Money;
    /**
     * The inventory line this item was sold from. Look it up with `GET /v1/inventory/{inventoryId}`.
     */
    inventoryId: string;
    /**
     * Your own identifier for the inventory line this item was sold from, captured at the time of sale. `null` when the line had none.
     * @minLength 1
     * @maxLength 255
     */
    customId: LinesAPI.CustomID | null;
  }
}

/**
 * The full seller view of a sale: everything on the sale plus tracking and any cancellation. `refunded` is the total you refunded on this sale so far, in your selling currency; `0` when nothing was refunded.
 */
export interface SaleDetail {
  /**
   * Human-readable order reference, shared across the sale and the purchase, e.g. `OR-ASNBC-1`.
   */
  orderNumber: string;
  /**
   * Where the order is in its lifecycle. `pending_shipment` is awaiting dispatch; `shipped` and `delivered` track the parcel; `completed` is closed and paid out; `cancelled_*` and `resolved_*` are the terminal cancellation and dispute outcomes.
   */
  status: OrderStatus;
  /**
   * When the order was placed.
   * @format date-time
   */
  placedAt: string;
  /**
   * When the order last changed.
   * @format date-time
   */
  updatedAt: string;
  /**
   * When the order was marked shipped. `null` if not yet.
   * @format date-time
   */
  shippedAt: OffersAPI.DateString | null;
  /**
   * When the parcel was delivered. `null` if not yet.
   * @format date-time
   */
  deliveredAt: OffersAPI.DateString | null;
  /**
   * When the order closed. `null` if still open.
   * @format date-time
   */
  completedAt: OffersAPI.DateString | null;
  /**
   * The currency every amount in this response is expressed in. Sales are in your selling currency; purchases are in the currency you paid.
   */
  currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
  /**
   * The items in the order, each tied to the inventory line it sold from.
   */
  items: Array<SaleDetail.Item>;
  /**
   * A monetary amount as a decimal in the currency's major unit paired with its currency code — `{ amount: 14.99, currency: "USD" }` means $14.99.
   */
  subtotal: AccountAPI.Money;
  /**
   * A monetary amount as a decimal in the currency's major unit paired with its currency code — `{ amount: 14.99, currency: "USD" }` means $14.99.
   */
  shippingAmount: AccountAPI.Money;
  /**
   * The seller fee CardNexus charged on a sale.
   */
  sellerFee: SellerFee;
  /**
   * Your payout for a sale and its transfer timeline.
   */
  payout: SalePayout;
  /**
   * A monetary amount as a decimal in the currency's major unit paired with its currency code — `{ amount: 14.99, currency: "USD" }` means $14.99.
   */
  refunded: AccountAPI.Money;
  /**
   * The other party on an order — the buyer on a sale, the seller on a purchase — with their public profile and reputation.
   */
  buyer: OrderParty;
  /**
   * A postal address an order ships to.
   */
  shippingAddress: OrderShippingAddress;
  /**
   * Your own key/value pairs on this sale. Empty when you haven't set any. Keys start with a letter and may contain letters, digits, `_`, `.` and `-`, up to 64 characters; values are strings of up to 500 characters. A sale holds at most 50 keys. The buyer never sees them.
   */
  metadata: OrderMetadata;
  /**
   * Tracking details once you mark the order shipped. `null` before then.
   */
  shipping: OrderShipping | null;
  /**
   * Cancellation details when the order was cancelled. `null` otherwise.
   */
  cancellation: OrderCancellation | null;
}

export namespace SaleDetail {
  export interface Item {
    /**
     * The catalogue product that was sold. Returned by `GET /v1/products`. `null` when the product is no longer in the catalogue.
     * @minimum -9007199254740991
     * @maximum 9007199254740991
     */
    productId: OffersAPI.CatalogID | null;
    /**
     * The product name captured at the time of sale.
     */
    productName: string;
    /**
     * The product image captured at the time of sale. `null` when there is none.
     */
    imageUrl: string | null;
    /**
     * The card's condition: `NM`, `LP`, `MP`, `HP`, or `DMG`. `null` when the item is graded or sealed.
     */
    condition: PricingAPI.CardCondition | null;
    /**
     * The card's language as a two-letter code, e.g. `en`, `fr`.
     */
    language: string;
    /**
     * The card's finish, e.g. `Standard`, `Foil`, `Reverse Holo`.
     */
    finish: string;
    /**
     * Grading details when the item is graded. `null` for raw cards and sealed products.
     */
    graded: LinesAPI.Graded | null;
    /**
     * How many units of this item were sold.
     * @minimum -9007199254740991
     * @maximum 9007199254740991
     */
    quantity: number;
    /**
     * A monetary amount as a decimal in the currency's major unit paired with its currency code — `{ amount: 14.99, currency: "USD" }` means $14.99.
     */
    unitPrice: AccountAPI.Money;
    /**
     * A monetary amount as a decimal in the currency's major unit paired with its currency code — `{ amount: 14.99, currency: "USD" }` means $14.99.
     */
    lineTotal: AccountAPI.Money;
    /**
     * The inventory line this item was sold from. Look it up with `GET /v1/inventory/{inventoryId}`.
     */
    inventoryId: string;
    /**
     * Your own identifier for the inventory line this item was sold from, captured at the time of sale. `null` when the line had none.
     * @minLength 1
     * @maxLength 255
     */
    customId: LinesAPI.CustomID | null;
  }
}

/**
 * Where the order is in its lifecycle. `pending_shipment` is awaiting dispatch; `shipped` and `delivered` track the parcel; `completed` is closed and paid out; `cancelled_*` and `resolved_*` are the terminal cancellation and dispute outcomes.
 */
export type OrderStatus =
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
 * The seller fee CardNexus charged on a sale.
 */
export interface SellerFee {
  /**
   * Your seller-fee rate, as a percentage (e.g. `5` for 5%).
   */
  percentage: number;
  /**
   * A monetary amount as a decimal in the currency's major unit paired with its currency code — `{ amount: 14.99, currency: "USD" }` means $14.99.
   */
  amount: AccountAPI.Money;
}

/**
 * Your payout for a sale and its transfer timeline.
 */
export interface SalePayout {
  /**
   * What you receive for this order, after the seller fee and any CardNexus Shield shipping-insurance premium. `null` until it is calculated.
   */
  amount: AccountAPI.Money | null;
  /**
   * When the payout becomes eligible for transfer. `null` when not yet set.
   * @format date-time
   */
  eligibleAt: OffersAPI.DateString | null;
  /**
   * When the payout was transferred to you. `null` until paid out.
   * @format date-time
   */
  paidOutAt: OffersAPI.DateString | null;
}

/**
 * The other party on an order — the buyer on a sale, the seller on a purchase — with their public profile and reputation.
 */
export interface OrderParty {
  /**
   * Stable opaque identifier for the other party. Do not parse.
   */
  id: string;
  /**
   * Their public handle.
   */
  username: string;
  /**
   * Their avatar URL. `null` when they haven't uploaded one.
   */
  avatarUrl: string | null;
  /**
   * Their country as a two-letter ISO 3166-1 alpha-2 code (e.g. `FR`, `US`). `null` when unknown.
   */
  country: string | null;
  /**
   * `pro` if they sell as a registered company, `individual` if they sell as a private person. `null` when they aren't a seller.
   */
  type: 'pro' | 'individual' | null;
  /**
   * A party's average review score and the number of reviews behind it.
   */
  rating: RunsAPI.OrderPartyRating;
  /**
   * A seller's recent order-handling stats. `null` for a buyer, or when there aren't enough recent orders to report.
   */
  reliability: OrderPartyReliability | null;
}

/**
 * A postal address an order ships to.
 */
export interface OrderShippingAddress {
  /**
   * Name the parcel is addressed to.
   */
  recipientName: string;
  /**
   * Street address, first line.
   */
  line1: string;
  /**
   * Street address, second line. `null` when unused.
   */
  line2: string | null;
  /**
   * City.
   */
  city: string;
  /**
   * State or province. `null` when unused.
   */
  state: string | null;
  /**
   * Postal or ZIP code.
   */
  postalCode: string;
  /**
   * Destination country as a two-letter ISO 3166-1 alpha-2 code.
   */
  countryCode: string;
  /**
   * Contact phone. `null` when not provided.
   */
  phone: string | null;
}

/**
 * Your own key/value pairs on this sale. Empty when you haven't set any. Keys start with a letter and may contain letters, digits, `_`, `.` and `-`, up to 64 characters; values are strings of up to 500 characters. A sale holds at most 50 keys. The buyer never sees them.
 */
export type OrderMetadata = Record<string, string>;

/**
 * Tracking and delivery details for a shipped order.
 */
export interface OrderShipping {
  /**
   * The carrier tracking number.
   */
  trackingNumber: string;
  /**
   * How the order travels: `parcel`, tracked by the carrier, or `letter`, an envelope tracked by the mail scans of its USPS Intelligent Mail barcode.
   */
  type: 'parcel' | 'letter';
  /**
   * The carrier, e.g. `Colissimo`. `null` when unknown.
   */
  carrier: string | null;
  /**
   * A link to track the parcel. `null` when unavailable.
   */
  trackingUrl: string | null;
  /**
   * The latest carrier status. `null` before the first scan.
   */
  status: string | null;
  /**
   * When the parcel shipped (first carrier scan). `null` before it ships.
   * @format date-time
   */
  shippedAt: OffersAPI.DateString | null;
  /**
   * When the parcel was delivered. `null` until it arrives.
   * @format date-time
   */
  deliveredAt: OffersAPI.DateString | null;
  /**
   * The carrier scan history, oldest first. `null` when none is available.
   */
  history: Array<OrderTrackingEvent> | null;
}

/**
 * Details of a cancelled order.
 */
export interface OrderCancellation {
  /**
   * Who cancelled the order.
   */
  cancelledBy: 'buyer' | 'seller' | 'system';
  /**
   * The cancellation reason code.
   */
  reason: string;
  /**
   * A free-text note about the cancellation. `null` when none was given.
   */
  reasonText: string | null;
  /**
   * When the order was cancelled.
   * @format date-time
   */
  cancelledAt: string;
}

/**
 * A seller's recent order-handling stats over a rolling window.
 */
export interface OrderPartyReliability {
  /**
   * Orders received in the recent window that the rates are computed over.
   * @minimum 0
   * @maximum 9007199254740991
   */
  orderCount: number;
  /**
   * Of those, how many completed successfully.
   * @minimum 0
   * @maximum 9007199254740991
   */
  completedCount: number;
  /**
   * Share of orders completed, from 0 to 1. `null` when there aren't enough orders to compute it.
   * @minimum 0
   * @maximum 1
   */
  completionRate: number | null;
  /**
   * Average hours between an order being placed and marked shipped. `null` when nothing shipped in the window.
   * @minimum 0
   */
  avgShipTimeHours: number | null;
}

/**
 * A single carrier or mail scan in a shipment's tracking history.
 */
export interface OrderTrackingEvent {
  /**
   * Carrier status for this scan.
   */
  status: string;
  /**
   * When the scan happened.
   * @format date-time
   */
  occurredAt: string;
  /**
   * Where the scan happened. `null` when unknown.
   */
  location: string | null;
  /**
   * Carrier description. `null` when none.
   */
  description: string | null;
  /**
   * Where the scan came from: `cardnexus` when CardNexus received it from the carrier, `application` when an application connected to the seller sent it.
   */
  source: 'cardnexus' | 'application';
}

export interface SaleListParams {
  cursor?: string;
  /**
   * @default 50
   * @minimum 1
   * @maximum 100
   */
  limit?: number;
  /**
   * Filter to orders in any of these statuses. Repeat the parameter for multiple values, e.g. `?status=shipped&status=delivered`.
   */
  status?: Array<OrderStatus>;
  /**
   * Only orders placed at or after this ISO 8601 timestamp.
   * @format date-time
   */
  placedFrom?: OffersAPI.DateString;
  /**
   * Only orders placed at or before this ISO 8601 timestamp.
   * @format date-time
   */
  placedTo?: OffersAPI.DateString;
  /**
   * Return only sales whose metadata matches every one of these key/value pairs exactly, e.g. `?metadata[fulfillment_stage]=packed`. Repeat the parameter with a different key to require several, up to 10 per call. Matching is case-sensitive and exact — there is no partial or prefix match.
   */
  metadata?: Record<string, string>;
}

export interface SaleListResponse {
  data: Array<Sale>;
  pagination: SaleListResponse.Pagination;
}

export namespace SaleListResponse {
  export interface Pagination {
    nextCursor: string | null;
  }
}

export interface SaleMarkShippedParams {
  /**
   * The tracking number — 5 to 50 characters: letters, digits, `-`, `_`. The carrier is detected automatically from the number. A USPS Intelligent Mail barcode (IMb) number ships the sale as a letter.
   * @minLength 5
   * @maxLength 50
   * @pattern ^[a-zA-Z0-9_-]+$
   */
  trackingNumber: string;
  /**
   * A link to your own tracking page for this shipment, shown to the buyer. For a letter, this is the only tracking page the buyer sees. Must be an `https` URL.
   * @format uri
   * @maxLength 2048
   */
  trackingUrl?: string;
  /**
   * Metadata to write. Keys you send are set, keys you send as `null` are removed, and keys you leave out keep their current value. An empty string is a value, not a removal. Send `{}` to change nothing. Keys start with a letter and may contain letters, digits, `_`, `.` and `-`, up to 64 characters; values are strings of up to 500 characters. A sale holds at most 50 keys once the write is applied.
   */
  metadata?: Record<string, string | null>;
}

export interface SaleCancelParams {
  /**
   * Why you are cancelling: the item is no longer available (`item_unavailable`), the item was damaged (`item_damaged`), the listing price was wrong (`pricing_error`), or another reason (`seller_other`).
   */
  reason: 'item_unavailable' | 'item_damaged' | 'pricing_error' | 'seller_other';
  /**
   * A note to the buyer explaining the cancellation — 10 to 500 characters.
   * @minLength 10
   * @maxLength 500
   */
  reasonText: string;
}

export interface SaleRefundParams {
  /**
   * How much to refund, as a decimal in your selling currency — the sale's `currency` (e.g. `2.50` for €2.50). At most 2 decimal places.
   * @exclusiveMinimum 0
   */
  amount: number;
}

export interface SaleSetMetadataParams {
  /**
   * Metadata to write. Keys you send are set, keys you send as `null` are removed, and keys you leave out keep their current value. An empty string is a value, not a removal. Send `{}` to change nothing. Keys start with a letter and may contain letters, digits, `_`, `.` and `-`, up to 64 characters; values are strings of up to 500 characters. A sale holds at most 50 keys once the write is applied.
   */
  metadata: Record<string, string | null>;
}
export declare namespace Sales {
  export {
    type Sale as Sale,
    type SaleDetail as SaleDetail,
    type OrderStatus as OrderStatus,
    type SellerFee as SellerFee,
    type SalePayout as SalePayout,
    type OrderParty as OrderParty,
    type OrderShippingAddress as OrderShippingAddress,
    type OrderMetadata as OrderMetadata,
    type OrderShipping as OrderShipping,
    type OrderCancellation as OrderCancellation,
    type OrderPartyReliability as OrderPartyReliability,
    type OrderTrackingEvent as OrderTrackingEvent,
    type SaleListResponse as SaleListResponse,
    type SaleListParams as SaleListParams,
    type SaleMarkShippedParams as SaleMarkShippedParams,
    type SaleCancelParams as SaleCancelParams,
    type SaleRefundParams as SaleRefundParams,
    type SaleSetMetadataParams as SaleSetMetadataParams,
  };
}
