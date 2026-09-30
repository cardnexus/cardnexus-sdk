// File generated from our OpenAPI spec by Scalar. See README.md for details.

import { APIResource } from '../resource';
import { APIPromise } from '../api-promise';
import type { RequestOptions } from '../internal/request-options';
import { path as __scalarPath } from '../internal/utils/path';
import type * as PricingAPI from './pricing';

export class Lists extends APIResource {
  /**
   * Returns your lists — decks, want lists, and for-sale lists — each with its name, status, and a summary of how many cards it holds and how complete it is.
   *
   * The cards themselves are not included here. Fetch a single list with `GET /v1/lists/{listId}` to get its cards.
   *
   * Filter by game, status, visibility, or name. Results are paginated with `offset` and `limit`.
   *
   * Requires the `lists:read` scope.
   *
   * @param {ListListParams} [query] - The parameters to send with the request.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<ListListResponse>} Your lists.
   *
   * @example
   * ```ts
   * const list = await client.lists.list({
   *   offset: 0,
   *   limit: 50,
   * });
   * ```
   */
  list(
    query: ListListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<ListListResponse> {
    return this._client.get('/lists', { query, ...options });
  }

  /**
   * Creates a new, empty list for the given game.
   *
   * The new list takes its currency from your account settings. Add cards to it with `POST /v1/lists/{listId}/items`.
   *
   * You can have up to 200 lists. Once you have 200, this endpoint returns `LIST_LIMIT_REACHED` until you delete one with `DELETE /v1/lists/{listId}`.
   *
   * Send an `Idempotency-Key` header to make retries safe — a repeated key returns the first response instead of creating a second list.
   *
   * Requires the `lists:write` scope.
   *
   * @param {ListCreateParams} body - The request body to send.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<ListCreateResponse>} List created.
   *
   * @example
   * ```ts
   * const list = await client.lists.create({
   *   name: 'x',
   *   game: 'x',
   *   status: 'toComplete',
   * });
   * ```
   */
  create(body: ListCreateParams, options?: RequestOptions): APIPromise<ListCreateResponse> {
    return this._client.post('/lists', { body, ...options });
  }

  /**
   * Returns a single list of yours in full — its metadata and every card in it.
   *
   * To enumerate your lists without their cards, see `GET /v1/lists`.
   *
   * Requires the `lists:read` scope.
   *
   * @param {string} listID - The list's id, from `GET /v1/lists` or `POST /v1/lists`. Path parameter.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<ListRetrieveResponse>} List returned.
   *
   * @example
   * ```ts
   * const list = await client.lists.retrieve('listId');
   * ```
   */
  retrieve(listID: string, options?: RequestOptions): APIPromise<ListRetrieveResponse> {
    return this._client.get(__scalarPath`/lists/${listID}`, options);
  }

  /**
   * Changes a list's settings. Send only the fields you want to change; the rest are left as they are.
   *
   * This updates the list itself, not its cards. Add or remove cards with `POST /v1/lists/{listId}/items` and `DELETE /v1/lists/{listId}/items/{itemId}`.
   *
   * Requires the `lists:write` scope.
   *
   * @param {string} listID - The list's id. Path parameter.
   * @param {ListUpdateParams} [body] - The request body to send.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<ListUpdateResponse>} List updated.
   *
   * @example
   * ```ts
   * const list = await client.lists.update('listId');
   * ```
   */
  update(
    listID: string,
    body: ListUpdateParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<ListUpdateResponse> {
    return this._client.patch(__scalarPath`/lists/${listID}`, { body, ...options });
  }

  /**
   * Deletes a list and every card in it. Your inventory is not affected.
   *
   * Requires the `lists:write` scope.
   *
   * @param {string} listID - The list's id. Path parameter.
   * @param {ListDeleteParams} [body] - The request body to send.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<ListDeleteResponse>} List deleted.
   *
   * @example
   * ```ts
   * const list = await client.lists.delete('listId');
   * ```
   */
  delete(
    listID: string,
    body: ListDeleteParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<ListDeleteResponse> {
    return this._client.delete(__scalarPath`/lists/${listID}`, { body, ...options });
  }
}

export interface ListListParams {
  /**
   * @default 0
   * @minimum 0
   * @maximum 9007199254740991
   */
  offset?: number;
  /**
   * @default 50
   * @minimum 1
   * @maximum 200
   */
  limit?: number;
  /**
   * Return only lists for this game, given as a slug, e.g. `pokemon`.
   * @minLength 1
   */
  game?: string;
  /**
   * Return only lists with this status: `forSale`, `toComplete`, or `hold`.
   */
  status?: 'forSale' | 'toComplete' | 'hold';
  /**
   * `true` returns only public lists; `false` returns only private ones. Omit to return both.
   */
  isPublic?: boolean;
  /**
   * Return only lists whose name contains this value, case-insensitively.
   * @minLength 1
   */
  name?: string;
}

export interface ListListResponse {
  data: Array<ListListResponse.Data>;
  pagination: ListListResponse.Pagination;
}

export namespace ListListResponse {
  export interface Data {
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
  }

  export interface Pagination {
    /**
     * @minimum 0
     * @maximum 9007199254740991
     */
    offset: number;
    /**
     * @minimum 1
     * @maximum 9007199254740991
     */
    limit: number;
    /**
     * @minimum 0
     * @maximum 9007199254740991
     */
    total: number;
    hasMore: boolean;
  }
}

export interface ListCreateParams {
  /**
   * The list's name.
   * @minLength 1
   */
  name: string;
  /**
   * The game the list is for, given as a slug, e.g. `pokemon`. Every card in the list must belong to this game.
   * @minLength 1
   */
  game: string;
  /**
   * What the list is for: `forSale`, `toComplete`, or `hold`.
   */
  status: 'forSale' | 'toComplete' | 'hold';
  /**
   * A free-text note on the list.
   */
  description?: string;
  /**
   * `true` to let anyone with the link view the list, `false` to keep it private. Defaults to `true`.
   */
  isPublic?: boolean;
}

export interface ListCreateResponse {
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
  items: Array<ListCreateResponse.Item>;
}

export namespace ListCreateResponse {
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

export interface ListRetrieveResponse {
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
  items: Array<ListRetrieveResponse.Item>;
}

export namespace ListRetrieveResponse {
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

export interface ListUpdateParams {
  /**
   * A new name for the list. Omit to leave it unchanged.
   * @minLength 1
   */
  name?: string;
  /**
   * A new note for the list. Omit to leave it unchanged.
   */
  description?: string;
  /**
   * A new status for the list. Omit to leave it unchanged.
   */
  status?: 'forSale' | 'toComplete' | 'hold';
  /**
   * `true` makes the list public, `false` makes it private. Omit to leave it unchanged.
   */
  isPublic?: boolean;
  /**
   * The minimum condition applied to new cards when you don't set one. Omit to leave it unchanged.
   */
  defaultMinCondition?: PricingAPI.CardCondition;
  /**
   * The language applied to new cards when you don't set one. Omit to leave it unchanged.
   */
  defaultLanguage?:
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
   * The currency your `wantPrice` and `sellPrice` values are in. Omit to leave it unchanged.
   */
  currency?:
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
}

export interface ListUpdateResponse {
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
  items: Array<ListUpdateResponse.Item>;
}

export namespace ListUpdateResponse {
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

export type ListDeleteParams = Record<string, unknown>;

export interface ListDeleteResponse {
  /**
   * Always `true` — the list has been removed.
   */
  deleted: true;
}
export declare namespace Lists {
  export {
    type ListListResponse as ListListResponse,
    type ListCreateResponse as ListCreateResponse,
    type ListRetrieveResponse as ListRetrieveResponse,
    type ListUpdateResponse as ListUpdateResponse,
    type ListDeleteResponse as ListDeleteResponse,
    type ListListParams as ListListParams,
    type ListCreateParams as ListCreateParams,
    type ListUpdateParams as ListUpdateParams,
    type ListDeleteParams as ListDeleteParams,
  };
}
