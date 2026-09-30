// File generated from our OpenAPI spec by Scalar. See README.md for details.

import { APIResource } from '../../resource';
import { APIPromise } from '../../api-promise';
import type { RequestOptions } from '../../internal/request-options';
import type * as RunsAPI from '../optimizer/runs';
import type * as ProductsAPI from '../products';
import type * as AccountAPI from '../account/account';
import type * as PricingAPI from '../pricing';
import type * as LinesAPI from '../lines';
import * as ItemsAPI from './items';
import {
  Items,
  type ItemCreateResponse,
  type ItemCreateParams,
  type ItemUpdateParams,
  type ItemDeleteParams,
} from './items';

export class Cart extends APIResource {
  items: ItemsAPI.Items = new ItemsAPI.Items(this._client);

  /**
   * Returns your shopping cart, grouped by seller. Each group carries the seller's profile, their shipping charge to your delivery country, and the items you are buying from them.
   *
   * An empty cart returns `deliveryCountry: null` and no seller groups.
   *
   * Each item's `unitPrice` is the price when you added it. If the seller lowers their price, your cart price follows; if they raise it, the item is removed from your cart. When a listing no longer has enough units, your cart quantity is reduced to what is available.
   *
   * Adding items to your cart does not put them on hold — availability is checked at checkout.
   *
   * Requires the `cart:read` scope.
   *
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<RunsAPI.Cart>} Cart returned.
   *
   * @example
   * ```ts
   * const cart = await client.cart.list();
   * ```
   */
  list(options?: RequestOptions): APIPromise<RunsAPI.Cart> {
    return this._client.get('/cart', options);
  }

  /**
   * Removes every item from your cart and returns the now-empty cart.
   *
   * Clearing an empty cart changes nothing and still succeeds, so retries are safe.
   *
   * Requires the `cart:write` scope.
   *
   * @param {CartClearParams} body - The request body to send.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<RunsAPI.Cart>} Cart cleared.
   *
   * @example
   * ```ts
   * const cart = await client.cart.clear({});
   * ```
   */
  clear(body: CartClearParams, options?: RequestOptions): APIPromise<RunsAPI.Cart> {
    return this._client.delete('/cart', { body, ...options });
  }
}

export type CartClearParams = Record<string, unknown>;
Cart.Items = Items;

export declare namespace Cart {
  export { type CartClearParams as CartClearParams };

  export {
    Items as Items,
    type ItemCreateResponse as ItemCreateResponse,
    type ItemCreateParams as ItemCreateParams,
    type ItemUpdateParams as ItemUpdateParams,
    type ItemDeleteParams as ItemDeleteParams,
  };
}
