// File generated from our OpenAPI spec by Scalar. See README.md for details.

import { APIResource } from '../../resource';
import { APIPromise } from '../../api-promise';
import type { RequestOptions } from '../../internal/request-options';
import { path as __scalarPath } from '../../internal/utils/path';
import type * as RunsAPI from '../optimizer/runs';
import type * as ProductsAPI from '../products';
import type * as AccountAPI from '../account/account';
import type * as PricingAPI from '../pricing';
import type * as LinesAPI from '../lines';

export class Items extends APIResource {
  /**
   * Adds one or more listings to your cart. Each item names a listing (from `GET /v1/products/{productId}/listings` or an optimizer run's `lines`) and how many units to buy.
   *
   * Items are processed in order, and each succeeds or fails on its own: the response carries your updated cart plus an `errors` array naming the rejected items and why. Adding a listing already in your cart adds to its quantity, subject to any per-listing limit the seller sets — going past it rejects the item with `QUANTITY_LIMIT_EXCEEDED`.
   *
   * `deliveryCountry` sets where your order will ship, on every call. When it differs from your cart's current delivery country, the cart switches to it — items already in your cart from sellers who don't ship to the new country are removed. A cart holds items from one marketplace region (`eu` or `na`) at a time — listings from the other region are rejected with `REGION_MISMATCH`.
   *
   * To buy an optimizer result, pass each line's `listingId` and `quantity` from the option you chose.
   *
   * Send an `Idempotency-Key` header to make retries safe: the same key returns the same response for 24 hours.
   *
   * Requires the `cart:write` scope.
   *
   * @param {ItemCreateParams} body - The request body to send.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<ItemCreateResponse>} Items added.
   *
   * @example
   * ```ts
   * const item = await client.cart.items.create({
   *   deliveryCountry: 'xx',
   *   items: [
   *     {
   *       listingId: 'x',
   *       quantity: 1,
   *     },
   *   ],
   * });
   * ```
   */
  create(body: ItemCreateParams, options?: RequestOptions): APIPromise<ItemCreateResponse> {
    return this._client.post('/cart/items', { body, ...options });
  }

  /**
   * Sets how many units of a listing your cart holds. Unlike `POST /v1/cart/items`, which adds to the existing quantity, this replaces it. A quantity past a per-listing limit the seller sets is rejected with `400 Bad Request`.
   *
   * `quantity: 0` removes the item from your cart. A listing that is not in your cart returns `404 Not Found`.
   *
   * Send an `Idempotency-Key` header to make retries safe: the same key returns the same response for 24 hours.
   *
   * Requires the `cart:write` scope.
   *
   * @param {string} listingID - The listing to update, as it appears in your cart. Path parameter.
   * @param {ItemUpdateParams} body - The request body to send.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<RunsAPI.Cart>} Cart item updated.
   *
   * @example
   * ```ts
   * const cart = await client.cart.items.update('listingId', {
   *   quantity: 0,
   * });
   * ```
   */
  update(listingID: string, body: ItemUpdateParams, options?: RequestOptions): APIPromise<RunsAPI.Cart> {
    return this._client.patch(__scalarPath`/cart/items/${listingID}`, { body, ...options });
  }

  /**
   * Removes a listing from your cart and returns the updated cart.
   *
   * Removing a listing that is not in your cart changes nothing and still succeeds, so retries are safe.
   *
   * Requires the `cart:write` scope.
   *
   * @param {string} listingID - The listing to remove, as it appears in your cart. Path parameter.
   * @param {ItemDeleteParams} [body] - The request body to send.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<RunsAPI.Cart>} Item removed.
   *
   * @example
   * ```ts
   * const cart = await client.cart.items.delete('listingId');
   * ```
   */
  delete(
    listingID: string,
    body: ItemDeleteParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<RunsAPI.Cart> {
    return this._client.delete(__scalarPath`/cart/items/${listingID}`, { body, ...options });
  }
}

export interface ItemCreateParams {
  /**
   * Where your order will ship, as a two-letter ISO 3166-1 alpha-2 code, e.g. `FR`. Must be a country CardNexus delivers to. When it differs from your cart's current delivery country, the cart switches to it, and items from sellers who don't ship there are removed.
   * @minLength 2
   * @maxLength 2
   */
  deliveryCountry: string;
  /**
   * The items to add — between 1 and 1000 per call.
   * @minItems 1
   * @maxItems 1000
   */
  items: Array<ItemCreateParams.Item>;
}

export namespace ItemCreateParams {
  export interface Item {
    /**
     * The listing to add. Listing ids come from `GET /v1/products/{productId}/listings` and from the optimizer's run results (`items[].listingId`).
     * @minLength 1
     */
    listingId: string;
    /**
     * How many units to add. Adding a listing already in your cart adds to its quantity, subject to any per-listing limit the seller sets.
     * @minimum 1
     * @maximum 9007199254740991
     */
    quantity: number;
  }
}

export interface ItemCreateResponse {
  /**
   * Your shopping cart, grouped by seller. Adding items does not put them on hold — availability is checked at checkout.
   */
  cart: RunsAPI.Cart;
  /**
   * The items that could not be added, each with its position in your request. Empty when every item was added.
   */
  errors: Array<ItemCreateResponse.Error>;
}

export namespace ItemCreateResponse {
  export interface Error {
    /**
     * The position of the rejected item in the `items` array you sent, starting at 0.
     * @minimum -9007199254740991
     * @maximum 9007199254740991
     */
    index: number;
    /**
     * The listing that was rejected.
     */
    listingId: string;
    /**
     * Why the item was rejected. `LISTING_NOT_FOUND`: no such listing, or it is no longer for sale. `OWN_LISTING`: the listing is yours — you cannot buy from yourself. `INSUFFICIENT_QUANTITY`: the listing has fewer units for sale than you asked for. `QUANTITY_LIMIT_EXCEEDED`: the seller limits how many units of one listing a buyer can order, and the add would go past that limit — `data.max` carries the seller's limit. `REGION_MISMATCH`: the seller is in a different marketplace region than your cart — a cart holds items from one region (`eu` or `na`) at a time. `SELLER_DOES_NOT_SHIP_TO_COUNTRY`: the seller does not ship to your delivery country. `SELLER_UNAVAILABLE`: the seller cannot take orders right now. `BUYER_EXCLUDED`: the seller does not sell to you.
     */
    code:
      | 'LISTING_NOT_FOUND'
      | 'OWN_LISTING'
      | 'INSUFFICIENT_QUANTITY'
      | 'QUANTITY_LIMIT_EXCEEDED'
      | 'REGION_MISMATCH'
      | 'SELLER_DOES_NOT_SHIP_TO_COUNTRY'
      | 'SELLER_UNAVAILABLE'
      | 'BUYER_EXCLUDED';
    /**
     * The values behind the rejection, e.g. how many units were available.
     */
    data: Record<string, string | number>;
  }
}

export interface ItemUpdateParams {
  /**
   * The new quantity. `0` removes the item from your cart.
   * @minimum 0
   * @maximum 9007199254740991
   */
  quantity: number;
}

export type ItemDeleteParams = Record<string, unknown>;
export declare namespace Items {
  export {
    type ItemCreateResponse as ItemCreateResponse,
    type ItemCreateParams as ItemCreateParams,
    type ItemUpdateParams as ItemUpdateParams,
    type ItemDeleteParams as ItemDeleteParams,
  };
}
