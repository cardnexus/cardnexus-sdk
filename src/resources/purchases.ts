// File generated from our OpenAPI spec by Scalar. See README.md for details.

import { APIResource } from '../resource';
import { APIPromise } from '../api-promise';
import type { RequestOptions } from '../internal/request-options';
import { path as __scalarPath } from '../internal/utils/path';
import type * as SalesAPI from './sales';
import type * as OffersAPI from './offers';
import type * as PricingAPI from './pricing';
import type * as LinesAPI from './lines';
import type * as AccountAPI from './account/account';
import type * as RunsAPI from './optimizer/runs';

export class Purchases extends APIResource {
  /**
   * Returns your purchases — orders where you are the buyer — as a cursor-paginated list, newest first.
   *
   * Each item carries the order, its items and totals, and the **seller** you bought from: their handle, country, review score, and recent order-handling stats.
   *
   * Filter with `status` (repeatable) and the `placedFrom` / `placedTo` date range. Walk the full set by following `pagination.nextCursor`: pass it back as `cursor` until it comes back `null`. `limit` defaults to 50, maximum 100.
   *
   * Requires the `purchases:read` scope.
   *
   * @param {PurchaseListParams} [query] - The parameters to send with the request.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<PurchaseListResponse>} Purchases returned.
   *
   * @example
   * ```ts
   * const purchase = await client.purchases.list({
   *   limit: 50,
   * });
   * ```
   */
  list(
    query: PurchaseListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<PurchaseListResponse> {
    return this._client.get('/purchases', { query, ...options });
  }

  /**
   * Returns one of your purchases in full — the buyer view of the order.
   *
   * On top of the items and totals, you get what you paid (buyer fee and tax), the shipping address, tracking and delivery, any refund, and the seller's profile (country, review score, recent order-handling stats).
   *
   * Only the buyer on the order can read it; any other order number returns `404 Not Found`.
   *
   * Requires the `purchases:read` scope.
   *
   * @param {string} orderNumber - The order reference, e.g. `OR-ASNBC-1`. Path parameter — not a query string.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<PurchaseDetail>} Purchase returned.
   *
   * @example
   * ```ts
   * const purchaseDetail = await client.purchases.retrieve('orderNumber');
   * ```
   */
  retrieve(orderNumber: string, options?: RequestOptions): APIPromise<PurchaseDetail> {
    return this._client.get(__scalarPath`/purchases/${orderNumber}`, options);
  }
}

/**
 * A purchase — an order where you are the buyer — with the seller and what you paid. `total` is the full amount you were charged, including shipping, `tax`, and the `buyerFee`.
 */
export interface Purchase {
  /**
   * Human-readable order reference, shared across the sale and the purchase, e.g. `OR-ASNBC-1`.
   */
  orderNumber: string;
  /**
   * Where the order is in its lifecycle. `pending_shipment` is awaiting dispatch; `shipped` and `delivered` track the parcel; `completed` is closed and paid out; `cancelled_*` and `resolved_*` are the terminal cancellation and dispute outcomes.
   */
  status: SalesAPI.OrderStatus;
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
   * The items in the order.
   */
  items: Array<OrderLineItem>;
  /**
   * A monetary amount as a decimal in the currency's major unit paired with its currency code — `{ amount: 14.99, currency: "USD" }` means $14.99.
   */
  subtotal: AccountAPI.Money;
  /**
   * A monetary amount as a decimal in the currency's major unit paired with its currency code — `{ amount: 14.99, currency: "USD" }` means $14.99.
   */
  shippingAmount: AccountAPI.Money;
  /**
   * A monetary amount as a decimal in the currency's major unit paired with its currency code — `{ amount: 14.99, currency: "USD" }` means $14.99.
   */
  buyerFee: AccountAPI.Money;
  /**
   * A monetary amount as a decimal in the currency's major unit paired with its currency code — `{ amount: 14.99, currency: "USD" }` means $14.99.
   */
  tax: AccountAPI.Money;
  /**
   * A monetary amount as a decimal in the currency's major unit paired with its currency code — `{ amount: 14.99, currency: "USD" }` means $14.99.
   */
  total: AccountAPI.Money;
  /**
   * The other party on an order — the buyer on a sale, the seller on a purchase — with their public profile and reputation.
   */
  seller: SalesAPI.OrderParty;
}

/**
 * The full buyer view of a purchase: everything on the purchase plus the shipping address, tracking, and any refund or cancellation.
 */
export interface PurchaseDetail {
  /**
   * Human-readable order reference, shared across the sale and the purchase, e.g. `OR-ASNBC-1`.
   */
  orderNumber: string;
  /**
   * Where the order is in its lifecycle. `pending_shipment` is awaiting dispatch; `shipped` and `delivered` track the parcel; `completed` is closed and paid out; `cancelled_*` and `resolved_*` are the terminal cancellation and dispute outcomes.
   */
  status: SalesAPI.OrderStatus;
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
   * The items in the order.
   */
  items: Array<OrderLineItem>;
  /**
   * A monetary amount as a decimal in the currency's major unit paired with its currency code — `{ amount: 14.99, currency: "USD" }` means $14.99.
   */
  subtotal: AccountAPI.Money;
  /**
   * A monetary amount as a decimal in the currency's major unit paired with its currency code — `{ amount: 14.99, currency: "USD" }` means $14.99.
   */
  shippingAmount: AccountAPI.Money;
  /**
   * A monetary amount as a decimal in the currency's major unit paired with its currency code — `{ amount: 14.99, currency: "USD" }` means $14.99.
   */
  buyerFee: AccountAPI.Money;
  /**
   * A monetary amount as a decimal in the currency's major unit paired with its currency code — `{ amount: 14.99, currency: "USD" }` means $14.99.
   */
  tax: AccountAPI.Money;
  /**
   * A monetary amount as a decimal in the currency's major unit paired with its currency code — `{ amount: 14.99, currency: "USD" }` means $14.99.
   */
  total: AccountAPI.Money;
  /**
   * The other party on an order — the buyer on a sale, the seller on a purchase — with their public profile and reputation.
   */
  seller: SalesAPI.OrderParty;
  /**
   * A postal address an order ships to.
   */
  shippingAddress: SalesAPI.OrderShippingAddress;
  /**
   * Tracking and delivery details once the seller ships. `null` before then.
   */
  shipping: SalesAPI.OrderShipping | null;
  /**
   * Refund details when any money was returned to you. `null` otherwise.
   */
  refund: PurchaseRefund | null;
  /**
   * Cancellation details when the order was cancelled. `null` otherwise.
   */
  cancellation: SalesAPI.OrderCancellation | null;
}

/**
 * A single line of an order: the product sold, its condition or grade, quantity, and price.
 */
export interface OrderLineItem {
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
}

/**
 * A refund returned to you on a purchase.
 */
export interface PurchaseRefund {
  /**
   * A monetary amount as a decimal in the currency's major unit paired with its currency code — `{ amount: 14.99, currency: "USD" }` means $14.99.
   */
  amount: AccountAPI.Money;
  /**
   * When the refund was issued. `null` when it is still pending.
   * @format date-time
   */
  refundedAt: OffersAPI.DateString | null;
}

export interface PurchaseListParams {
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
  status?: Array<SalesAPI.OrderStatus>;
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
}

export interface PurchaseListResponse {
  data: Array<Purchase>;
  pagination: PurchaseListResponse.Pagination;
}

export namespace PurchaseListResponse {
  export interface Pagination {
    nextCursor: string | null;
  }
}
export declare namespace Purchases {
  export {
    type Purchase as Purchase,
    type PurchaseDetail as PurchaseDetail,
    type OrderLineItem as OrderLineItem,
    type PurchaseRefund as PurchaseRefund,
    type PurchaseListResponse as PurchaseListResponse,
    type PurchaseListParams as PurchaseListParams,
  };
}
