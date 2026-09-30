// File generated from our OpenAPI spec by Scalar. See README.md for details.

import { APIResource } from '../resource';
import { APIPromise } from '../api-promise';
import type { RequestOptions } from '../internal/request-options';
import { path as __scalarPath } from '../internal/utils/path';
import type * as PricingAPI from './pricing';

export class ListItems extends APIResource {
  /**
   * Adds cards to a list, or updates cards already in it, in a single call. Returns the list with its new contents.
   *
   * Each entry names a catalogue product plus its finish and language. Set `quantity` to `0` to remove that card. To change an existing line, pass its `itemId` from a list response.
   *
   * Every card must belong to the list's game, in a finish and language that product exists in. A single list can hold at most 2000 cards.
   *
   * Send an `Idempotency-Key` header to make retries safe.
   *
   * Requires the `lists:write` scope.
   *
   * @param {string} listID - The list's id. Path parameter.
   * @param {ListItemCreateParams} body - The request body to send.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<ListItemCreateResponse>} List updated.
   *
   * @example
   * ```ts
   * const listItem = await client.listItems.create('listId', {
   *   items: [
   *     {
   *       productId: 50212,
   *       finish: 'Standard',
   *       language: 'en',
   *       quantity: 0,
   *     },
   *   ],
   * });
   * ```
   */
  create(
    listID: string,
    body: ListItemCreateParams,
    options?: RequestOptions,
  ): APIPromise<ListItemCreateResponse> {
    return this._client.post(__scalarPath`/lists/${listID}/items`, { body, ...options });
  }

  /**
   * Removes a single card from a list, addressed by its line id. The list itself is kept.
   *
   * To remove several cards at once, or to clear a card by setting its quantity to `0`, use `POST /v1/lists/{listId}/items`.
   *
   * Requires the `lists:write` scope.
   *
   * @param {string} itemID - The id of the line to remove, from a list response. Path parameter.
   * @param {ListItemDeleteParams} params - The parameters to send with the request.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<ListItemDeleteResponse>} Card removed.
   *
   * @example
   * ```ts
   * const listItem = await client.listItems.delete('itemId', {
   *   listId: 'listId',
   * });
   * ```
   */
  delete(
    itemID: string,
    params: ListItemDeleteParams,
    options?: RequestOptions,
  ): APIPromise<ListItemDeleteResponse> {
    const { listId } = params;
    return this._client.delete(__scalarPath`/lists/${listId}/items/${itemID}`, options);
  }
}

export interface ListItemCreateParams {
  /**
   * The cards to add or update, up to 1000 per request. A card already in the list — same product, finish, and language — has its quantity replaced, not added to.
   * @minItems 1
   * @maxItems 1000
   */
  items: Array<ListItemCreateParams.Item>;
}

export namespace ListItemCreateParams {
  export interface Item {
    /**
     * The catalogue product to add, from `POST /v1/products/search`.
     */
    productId: number | string;
    /**
     * The card's finish, e.g. `Standard`, `Foil`, `Reverse Holo`.
     */
    finish:
      | 'Standard'
      | 'Foil'
      | 'Rainbow'
      | 'Gold'
      | 'Rainbow Foil'
      | 'Cold Foil'
      | 'Gold Foil'
      | 'Etched'
      | 'Signed'
      | 'Reverse Holo'
      | 'Blast Foil Rainbow'
      | 'Bubbles Foil'
      | 'Cracked Ice Foil'
      | 'Galaxy Foil'
      | 'Glitter Foil'
      | 'Multi Sideline Foil'
      | 'Rainbow Solid Texture Stamp'
      | 'Star Foil'
      | 'Surge Foil'
      | 'Full Art Gold Sign'
      | 'Depth Lenticular'
      | 'Flip Lenticular'
      | 'Lenticular'
      | 'Zarimoth'
      | 'Serialized'
      | 'Serialized Rose Gold'
      | 'Serialized Gold'
      | 'Holographic'
      | 'Embossed'
      | 'Holofoil';
    /**
     * The card's language as a short code, e.g. `en`, `fr`.
     */
    language:
      | 'en'
      | 'fr'
      | 'de'
      | 'it'
      | 'es'
      | 'nl'
      | 'pl'
      | 'grc'
      | 'ar'
      | 'zh-Hans'
      | 'zh-Hant'
      | 'zh-cn'
      | 'he'
      | 'ja'
      | 'ko'
      | 'th'
      | 'id'
      | 'la'
      | 'art-x-phyrexian'
      | 'pt-BR'
      | 'pt-PT'
      | 'ru'
      | 'sa';
    /**
     * How many copies this line calls for. Send `0` to remove the line.
     * @minimum 0
     * @maximum 9007199254740991
     */
    quantity: number;
    /**
     * The id of an existing line to update, from a list response. Omit to add a new line.
     * @minLength 1
     */
    itemId?: string;
    /**
     * The minimum condition you'll accept for this card. Omit to leave it unset.
     */
    minCondition?: PricingAPI.CardCondition;
    /**
     * Your target price per copy, in the list's currency. Send `null` to clear it.
     * @minimum 0
     */
    wantPrice?: number | null;
    /**
     * Your sale price per copy, in the list's currency. Send `null` to clear it.
     * @minimum 0
     */
    sellPrice?: number | null;
  }
}

export interface ListItemCreateResponse {
  /**
   * Stable opaque identifier for this list. Do not parse.
   */
  id: string;
  /**
   * The list's name.
   */
  name: string;
  /**
   * The game the list belongs to, as a slug, e.g. `pokemon`.
   */
  game: string;
  /**
   * What the list is for.
   */
  status: 'forSale' | 'toComplete' | 'hold';
  /**
   * Your free-text note on the list. `null` when there is none.
   */
  description: string | null;
  /**
   * The list's banner image. Set from the artwork of the first card you add, and changeable on the web app. `null` when the list has none.
   */
  bannerUrl: string | null;
  /**
   * How complete the list is, from 0 to 100, based on how many wanted copies you already hold.
   */
  completionPercentage: number;
  /**
   * How many distinct lines the list holds.
   * @minimum -9007199254740991
   * @maximum 9007199254740991
   */
  itemCount: number;
  /**
   * The sum of every line's quantity.
   * @minimum -9007199254740991
   * @maximum 9007199254740991
   */
  totalQuantity: number;
  /**
   * `true` when anyone with the link can view the list; `false` when only you can.
   */
  isPublic: boolean;
  /**
   * The currency your `wantPrice` and `sellPrice` values are in.
   */
  currency:
    | 'USD'
    | 'EUR'
    | 'CAD'
    | 'AED'
    | 'AUD'
    | 'BRL'
    | 'CHF'
    | 'CNY'
    | 'DKK'
    | 'GBP'
    | 'HKD'
    | 'HUF'
    | 'JPY'
    | 'KRW'
    | 'MXN'
    | 'MYR'
    | 'NOK'
    | 'NZD'
    | 'PHP'
    | 'PLN'
    | 'RUB'
    | 'SEK'
    | 'SGD'
    | 'TTD'
    | 'TWD';
  /**
   * The minimum condition applied to new cards when you don't set one. `null` when unset.
   */
  defaultMinCondition: PricingAPI.CardCondition | null;
  /**
   * The language applied to new cards when you don't set one, as a short code. `null` when unset.
   */
  defaultLanguage: string | null;
  /**
   * When the list was created.
   * @format date-time
   */
  createdAt: string;
  /**
   * When the list was last modified.
   * @format date-time
   */
  updatedAt: string;
  /**
   * Every card in the list.
   */
  items: Array<ListItemCreateResponse.Item>;
}

export namespace ListItemCreateResponse {
  export interface Item {
    /**
     * Stable opaque identifier for this line in the list. Do not parse.
     */
    id: string;
    /**
     * The catalogue product this line refers to. Returned by `POST /v1/products/search`.
     * @minimum -9007199254740991
     * @maximum 9007199254740991
     */
    productId: number;
    /**
     * The product's name, e.g. `Charizard ex`.
     */
    name: string;
    /**
     * URL-friendly slug of the product name. Cards that share a name across printings and expansions share this slug. Accepted as the `nameSlug` filter on `POST /v1/products/search` to list every printing of the card.
     */
    nameSlug: string;
    /**
     * The name of the expansion the product belongs to. `null` when it has none.
     */
    expansion: string | null;
    /**
     * The card's finish, e.g. `Standard`, `Foil`, `Reverse Holo`.
     */
    finish: string;
    /**
     * The card's language as a short code, e.g. `en`, `fr`. `null` when unset.
     */
    language: string | null;
    /**
     * The minimum condition you'll accept for this card: `NM`, `LP`, `MP`, `HP`, or `DMG`. `null` when unset.
     */
    minCondition: PricingAPI.CardCondition | null;
    /**
     * How many copies this line calls for.
     * @minimum -9007199254740991
     * @maximum 9007199254740991
     */
    quantity: number;
    /**
     * How many of the wanted copies you already hold, worked out from your inventory. Read-only; never more than `quantity`.
     * @minimum -9007199254740991
     * @maximum 9007199254740991
     */
    quantityFulfilled: number;
    /**
     * Your target price per copy, in the list's currency. `null` when unset.
     */
    wantPrice: number | null;
    /**
     * Your sale price per copy, in the list's currency. `null` when unset.
     */
    sellPrice: number | null;
  }
}

export interface ListItemDeleteParams {
  /**
   * The list's id. Path parameter.
   * @minLength 1
   */
  listId: string;
}

export interface ListItemDeleteResponse {
  /**
   * Always `true` — the card has been removed from the list.
   */
  deleted: true;
}
export declare namespace ListItems {
  export {
    type ListItemCreateResponse as ListItemCreateResponse,
    type ListItemDeleteResponse as ListItemDeleteResponse,
    type ListItemCreateParams as ListItemCreateParams,
    type ListItemDeleteParams as ListItemDeleteParams,
  };
}
