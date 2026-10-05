// File generated from our OpenAPI spec by Scalar. See README.md for details.

import { APIResource } from '../resource';
import { APIPromise } from '../api-promise';
import type { RequestOptions } from '../internal/request-options';
import { path as __scalarPath } from '../internal/utils/path';
import type * as LinesAPI from './lines';
import type * as PricingAPI from './pricing';
import type * as AccountAPI from './account/account';

export class Listings extends APIResource {
  /**
   * Returns the inventory lines you have published to the Marketplace, as a cursor-paginated list ordered by line id.
   *
   * This is `GET /v1/inventory` restricted to lines that are for sale — every line in the response has `forSale` set to `true` and carries a `listing` price. Lines in your Collection are not included.
   *
   * Filter with any combination of `game`, `productId` (repeatable), `condition`, `language`, `finish`, `graded`, `customId`, `customIdPrefix`, `customIdContains`, `commentContains`, `location`, and `tags` (repeatable — matches lines carrying any of the named tags). Filters are combined with AND.
   *
   * Walk the full set by following `pagination.nextCursor` until it comes back `null`. `limit` defaults to 50, maximum 100.
   *
   * Requires the `listings:read` scope.
   *
   * @param {ListingListParams} [query] - The parameters to send with the request.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<ListingListResponse>} Listings returned.
   *
   * @example
   * ```ts
   * const listing = await client.listings.list({
   *   limit: 50,
   * });
   * ```
   */
  list(
    query: ListingListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<ListingListResponse> {
    return this._client.get('/listings', { query, ...options });
  }

  /**
   * Publishes an inventory line to the Marketplace at the given per-card price. The price currency must match your seller currency, and your seller account must be active.
   *
   * By default the whole line is listed. Pass `quantity` to list only part of it: the listed cards move to their own line (returned as `line`), the rest stays in your Collection on the original line (returned as `remainder`). The split-off listed line inherits the original's `comment` but never its `customId`.
   *
   * If listing the whole line makes it identical to one of your existing listed lines (same product, finish, condition, language, grading, and price, neither line carrying a `customId`), the two merge; `line` is the surviving line.
   *
   * Send an `Idempotency-Key` header to make retries safe: the same key returns the same response for 24 hours.
   *
   * Requires the `listings:write` scope.
   *
   * @param {string} inventoryID - The inventory line to list. Returned by `GET /v1/inventory`. Path parameter.
   * @param {ListingCreateParams} body - The request body to send.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<ListingCreateResponse>} Line listed for sale.
   *
   * @example
   * ```ts
   * const listing = await client.listings.create('inventoryId', {
   *   price: { amount: 14.99, currency: 'USD' },
   * });
   * ```
   */
  create(
    inventoryID: string,
    body: ListingCreateParams,
    options?: RequestOptions,
  ): APIPromise<ListingCreateResponse> {
    return this._client.post(__scalarPath`/inventory/${inventoryID}/listing`, { body, ...options });
  }

  /**
   * Changes the per-card price of a listed inventory line. The price is the only thing this endpoint changes — how many cards are for sale is a property of the line itself: list more via `POST /v1/inventory/{inventoryId}/listing` or take some off sale via `DELETE /v1/inventory/{inventoryId}/listing`.
   *
   * If the new price makes this line identical to another of your listed lines (same product, finish, condition, language, grading, and price, neither line carrying a `customId`), the two merge; the response is the surviving line.
   *
   * Send an `Idempotency-Key` header to make retries safe: the same key returns the same response for 24 hours.
   *
   * Requires the `listings:write` scope.
   *
   * @param {string} inventoryID - The listed inventory line. Returned by `GET /v1/listings`. Path parameter.
   * @param {ListingUpdateParams} body - The request body to send.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<ListingUpdateResponse>} Listing price changed; the updated line is returned.
   *
   * @example
   * ```ts
   * const listing = await client.listings.update('inventoryId', {
   *   price: { amount: 14.99, currency: 'USD' },
   * });
   * ```
   */
  update(
    inventoryID: string,
    body: ListingUpdateParams,
    options?: RequestOptions,
  ): APIPromise<ListingUpdateResponse> {
    return this._client.patch(__scalarPath`/inventory/${inventoryID}/listing`, { body, ...options });
  }

  /**
   * Takes a listed inventory line off the Marketplace. The cards stay in your inventory — they move back to your Collection.
   *
   * By default the whole listing is cancelled and the response is the line's new state in your Collection. Pass `quantity` to take only part of it off sale: the delisted cards move back to your Collection, the rest stays for sale on this line, and the response is this line's new, reduced state.
   *
   * Delisted cards merge into an identical unlisted line of yours when one exists (same product, finish, condition, language, and grading, neither line carrying a `customId`). After a full delist that merges, the response is the surviving line.
   *
   * Requires the `listings:write` scope.
   *
   * @param {string} inventoryID - The listed inventory line. Returned by `GET /v1/listings`. Path parameter.
   * @param {ListingDeleteParams} [body] - The request body to send.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<ListingDeleteResponse>} Listing cancelled; the line's new state is returned.
   *
   * @example
   * ```ts
   * const listing = await client.listings.delete('inventoryId');
   * ```
   */
  delete(
    inventoryID: string,
    body: ListingDeleteParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<ListingDeleteResponse> {
    return this._client.delete(__scalarPath`/inventory/${inventoryID}/listing`, { body, ...options });
  }
}

export interface ListingListParams {
  cursor?: string;
  /**
   * @default 50
   * @minimum 1
   * @maximum 100
   */
  limit?: number;
  /**
   * Return only lines for this game, given as a slug, e.g. `ygo`.
   * @minLength 1
   */
  game?: string;
  /**
   * Return only lines for these products. Repeat the parameter to pass several, up to 200 per call. Product ids come from `GET /v1/products`.
   * @maxItems 200
   */
  productId?: Array<number | string>;
  /**
   * Return only lines in this condition: `NM`, `LP`, `MP`, `HP`, or `DMG`.
   */
  condition?: PricingAPI.CardCondition;
  /**
   * Return only lines in this language, as a two-letter code, e.g. `en`.
   * @minLength 1
   */
  language?: string;
  /**
   * Return only lines with this finish, e.g. `Standard`, `Foil`, `Reverse Holo`.
   */
  finish?:
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
   * `true` returns only graded cards; `false` returns only raw cards. Omit to return both.
   */
  graded?: boolean;
  /**
   * Return the line whose `customId` exactly equals this value.
   * @minLength 1
   */
  customId?: string;
  /**
   * Return lines whose `customId` starts with this value.
   * @minLength 1
   */
  customIdPrefix?: string;
  /**
   * Return lines whose `customId` contains this value, case-insensitively.
   * @minLength 1
   */
  customIdContains?: string;
  /**
   * Return lines whose `comment` contains this value, case-insensitively.
   * @minLength 1
   */
  commentContains?: string;
  /**
   * Return only lines stored at this location, by name. Matched case-insensitively.
   * @minLength 1
   * @maxLength 100
   */
  location?: string;
  /**
   * Return only lines carrying any of these tags, by name. Repeat the parameter to pass several, up to 50 per call. To require all tags on a line, use `POST /v1/inventory/search`.
   * @maxItems 50
   */
  tags?: Array<string>;
}

export interface ListingListResponse {
  data: Array<ListingListResponse.Data>;
  pagination: ListingListResponse.Pagination;
}

export namespace ListingListResponse {
  export interface Data {
    /**
     * Stable opaque identifier for this inventory line. Do not parse.
     */
    id: string;
    /**
     * Your own stable identifier for this line, unique across your live lines. `null` when you have not set one.
     * @minLength 1
     * @maxLength 255
     */
    customId: LinesAPI.CustomID | null;
    /**
     * Free-text note attached to this line, shown to buyers on your Marketplace listing. `null` when there is none.
     */
    comment: string | null;
    /**
     * Your private note on this line, visible only to you and never shown to buyers. `null` when there is none.
     */
    notes: string | null;
    /**
     * The name of the location this line sits in. `null` when it has none.
     */
    location: string | null;
    /**
     * The names of the tags attached to this line. Empty when the line has no tags.
     */
    tags: Array<string>;
    /**
     * The catalogue product this line stocks. Returned by `GET /v1/products`.
     * @minimum -9007199254740991
     * @maximum 9007199254740991
     */
    productId: number;
    /**
     * The game the product belongs to, as a slug, e.g. `ygo`.
     */
    game: string;
    /**
     * The card's finish, e.g. `Standard`, `Foil`, `Reverse Holo`.
     */
    finish: string;
    /**
     * The card's condition: `NM`, `LP`, `MP`, `HP`, or `DMG`. `null` when the card is graded.
     */
    condition: PricingAPI.CardCondition | null;
    /**
     * The card's language as a two-letter code, e.g. `en`, `fr`, `de`.
     */
    language: string | null;
    /**
     * How many cards this line holds.
     * @minimum -9007199254740991
     * @maximum 9007199254740991
     */
    quantity: number;
    /**
     * Grading details when the card is graded. `null` for raw cards.
     */
    graded: LinesAPI.Graded | null;
    /**
     * `true` when this line is published to the Marketplace with a price. `false` when it sits in your Collection.
     */
    forSale: boolean;
    /**
     * The listing details when `forSale` is `true`. `null` when the line is not for sale.
     */
    listing: Data.Listing | null;
    /**
     * Photos attached to this line, in the order you set them. Buyers see them on your Marketplace listing. Empty when there are none.
     */
    photos: Array<Data.Photo>;
    /**
     * When this line was last modified.
     * @format date-time
     */
    updatedAt: string;
  }

  export namespace Data {
    export interface Listing {
      /**
       * A monetary amount as a decimal in the currency's major unit paired with its currency code — `{ amount: 14.99, currency: "USD" }` means $14.99.
       */
      price: AccountAPI.Money;
    }

    export interface Photo {
      /**
       * The photo's URL.
       * @format uri
       */
      url: string;
      /**
       * The photo's width, in pixels.
       * @minimum -9007199254740991
       * @maximum 9007199254740991
       */
      width: number;
      /**
       * The photo's height, in pixels.
       * @minimum -9007199254740991
       * @maximum 9007199254740991
       */
      height: number;
    }
  }

  export interface Pagination {
    nextCursor: string | null;
  }
}

export interface ListingCreateParams {
  /**
   * The per-card price. The currency must match your seller currency.
   */
  price: ListingCreateParams.Price;
  /**
   * How many cards to list. Defaults to the line's full quantity. Listing fewer splits the line: the listed cards move to their own line.
   * @minimum 1
   * @maximum 9007199254740991
   */
  quantity?: number;
}

export namespace ListingCreateParams {
  export interface Price {
    /**
     * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
     */
    amount: number;
    currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
  }
}

export interface ListingCreateResponse {
  /**
   * The listed line.
   */
  line: ListingCreateResponse.Line;
  /**
   * When you list fewer cards than the line holds, the rest stays in your Collection on the original line, returned here. `null` when the whole line was listed.
   */
  remainder: ListingCreateResponse.Remainder | null;
}

export namespace ListingCreateResponse {
  export interface Line {
    /**
     * Stable opaque identifier for this inventory line. Do not parse.
     */
    id: string;
    /**
     * Your own stable identifier for this line, unique across your live lines. `null` when you have not set one.
     * @minLength 1
     * @maxLength 255
     */
    customId: LinesAPI.CustomID | null;
    /**
     * Free-text note attached to this line, shown to buyers on your Marketplace listing. `null` when there is none.
     */
    comment: string | null;
    /**
     * Your private note on this line, visible only to you and never shown to buyers. `null` when there is none.
     */
    notes: string | null;
    /**
     * The name of the location this line sits in. `null` when it has none.
     */
    location: string | null;
    /**
     * The names of the tags attached to this line. Empty when the line has no tags.
     */
    tags: Array<string>;
    /**
     * The catalogue product this line stocks. Returned by `GET /v1/products`.
     * @minimum -9007199254740991
     * @maximum 9007199254740991
     */
    productId: number;
    /**
     * The game the product belongs to, as a slug, e.g. `ygo`.
     */
    game: string;
    /**
     * The card's finish, e.g. `Standard`, `Foil`, `Reverse Holo`.
     */
    finish: string;
    /**
     * The card's condition: `NM`, `LP`, `MP`, `HP`, or `DMG`. `null` when the card is graded.
     */
    condition: PricingAPI.CardCondition | null;
    /**
     * The card's language as a two-letter code, e.g. `en`, `fr`, `de`.
     */
    language: string | null;
    /**
     * How many cards this line holds.
     * @minimum -9007199254740991
     * @maximum 9007199254740991
     */
    quantity: number;
    /**
     * Grading details when the card is graded. `null` for raw cards.
     */
    graded: LinesAPI.Graded | null;
    /**
     * `true` when this line is published to the Marketplace with a price. `false` when it sits in your Collection.
     */
    forSale: boolean;
    /**
     * The listing details when `forSale` is `true`. `null` when the line is not for sale.
     */
    listing: Line.Listing | null;
    /**
     * Photos attached to this line, in the order you set them. Buyers see them on your Marketplace listing. Empty when there are none.
     */
    photos: Array<Line.Photo>;
    /**
     * When this line was last modified.
     * @format date-time
     */
    updatedAt: string;
  }

  export namespace Line {
    export interface Listing {
      /**
       * A monetary amount as a decimal in the currency's major unit paired with its currency code — `{ amount: 14.99, currency: "USD" }` means $14.99.
       */
      price: AccountAPI.Money;
    }

    export interface Photo {
      /**
       * The photo's URL.
       * @format uri
       */
      url: string;
      /**
       * The photo's width, in pixels.
       * @minimum -9007199254740991
       * @maximum 9007199254740991
       */
      width: number;
      /**
       * The photo's height, in pixels.
       * @minimum -9007199254740991
       * @maximum 9007199254740991
       */
      height: number;
    }
  }

  export interface Remainder {
    /**
     * Stable opaque identifier for this inventory line. Do not parse.
     */
    id: string;
    /**
     * Your own stable identifier for this line, unique across your live lines. `null` when you have not set one.
     * @minLength 1
     * @maxLength 255
     */
    customId: LinesAPI.CustomID | null;
    /**
     * Free-text note attached to this line, shown to buyers on your Marketplace listing. `null` when there is none.
     */
    comment: string | null;
    /**
     * Your private note on this line, visible only to you and never shown to buyers. `null` when there is none.
     */
    notes: string | null;
    /**
     * The name of the location this line sits in. `null` when it has none.
     */
    location: string | null;
    /**
     * The names of the tags attached to this line. Empty when the line has no tags.
     */
    tags: Array<string>;
    /**
     * The catalogue product this line stocks. Returned by `GET /v1/products`.
     * @minimum -9007199254740991
     * @maximum 9007199254740991
     */
    productId: number;
    /**
     * The game the product belongs to, as a slug, e.g. `ygo`.
     */
    game: string;
    /**
     * The card's finish, e.g. `Standard`, `Foil`, `Reverse Holo`.
     */
    finish: string;
    /**
     * The card's condition: `NM`, `LP`, `MP`, `HP`, or `DMG`. `null` when the card is graded.
     */
    condition: PricingAPI.CardCondition | null;
    /**
     * The card's language as a two-letter code, e.g. `en`, `fr`, `de`.
     */
    language: string | null;
    /**
     * How many cards this line holds.
     * @minimum -9007199254740991
     * @maximum 9007199254740991
     */
    quantity: number;
    /**
     * Grading details when the card is graded. `null` for raw cards.
     */
    graded: LinesAPI.Graded | null;
    /**
     * `true` when this line is published to the Marketplace with a price. `false` when it sits in your Collection.
     */
    forSale: boolean;
    /**
     * The listing details when `forSale` is `true`. `null` when the line is not for sale.
     */
    listing: Remainder.Listing | null;
    /**
     * Photos attached to this line, in the order you set them. Buyers see them on your Marketplace listing. Empty when there are none.
     */
    photos: Array<Remainder.Photo>;
    /**
     * When this line was last modified.
     * @format date-time
     */
    updatedAt: string;
  }

  export namespace Remainder {
    export interface Listing {
      /**
       * A monetary amount as a decimal in the currency's major unit paired with its currency code — `{ amount: 14.99, currency: "USD" }` means $14.99.
       */
      price: AccountAPI.Money;
    }

    export interface Photo {
      /**
       * The photo's URL.
       * @format uri
       */
      url: string;
      /**
       * The photo's width, in pixels.
       * @minimum -9007199254740991
       * @maximum 9007199254740991
       */
      width: number;
      /**
       * The photo's height, in pixels.
       * @minimum -9007199254740991
       * @maximum 9007199254740991
       */
      height: number;
    }
  }
}

export interface ListingUpdateParams {
  /**
   * The new per-card price. The currency must match the listing's currency.
   */
  price: ListingUpdateParams.Price;
}

export namespace ListingUpdateParams {
  export interface Price {
    /**
     * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
     */
    amount: number;
    currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
  }
}

export interface ListingUpdateResponse {
  /**
   * Stable opaque identifier for this inventory line. Do not parse.
   */
  id: string;
  /**
   * Your own stable identifier for this line, unique across your live lines. `null` when you have not set one.
   * @minLength 1
   * @maxLength 255
   */
  customId: LinesAPI.CustomID | null;
  /**
   * Free-text note attached to this line, shown to buyers on your Marketplace listing. `null` when there is none.
   */
  comment: string | null;
  /**
   * Your private note on this line, visible only to you and never shown to buyers. `null` when there is none.
   */
  notes: string | null;
  /**
   * The name of the location this line sits in. `null` when it has none.
   */
  location: string | null;
  /**
   * The names of the tags attached to this line. Empty when the line has no tags.
   */
  tags: Array<string>;
  /**
   * The catalogue product this line stocks. Returned by `GET /v1/products`.
   * @minimum -9007199254740991
   * @maximum 9007199254740991
   */
  productId: number;
  /**
   * The game the product belongs to, as a slug, e.g. `ygo`.
   */
  game: string;
  /**
   * The card's finish, e.g. `Standard`, `Foil`, `Reverse Holo`.
   */
  finish: string;
  /**
   * The card's condition: `NM`, `LP`, `MP`, `HP`, or `DMG`. `null` when the card is graded.
   */
  condition: PricingAPI.CardCondition | null;
  /**
   * The card's language as a two-letter code, e.g. `en`, `fr`, `de`.
   */
  language: string | null;
  /**
   * How many cards this line holds.
   * @minimum -9007199254740991
   * @maximum 9007199254740991
   */
  quantity: number;
  /**
   * Grading details when the card is graded. `null` for raw cards.
   */
  graded: LinesAPI.Graded | null;
  /**
   * `true` when this line is published to the Marketplace with a price. `false` when it sits in your Collection.
   */
  forSale: boolean;
  /**
   * The listing details when `forSale` is `true`. `null` when the line is not for sale.
   */
  listing: ListingUpdateResponse.Listing | null;
  /**
   * Photos attached to this line, in the order you set them. Buyers see them on your Marketplace listing. Empty when there are none.
   */
  photos: Array<ListingUpdateResponse.Photo>;
  /**
   * When this line was last modified.
   * @format date-time
   */
  updatedAt: string;
}

export namespace ListingUpdateResponse {
  export interface Listing {
    /**
     * A monetary amount as a decimal in the currency's major unit paired with its currency code — `{ amount: 14.99, currency: "USD" }` means $14.99.
     */
    price: AccountAPI.Money;
  }

  export interface Photo {
    /**
     * The photo's URL.
     * @format uri
     */
    url: string;
    /**
     * The photo's width, in pixels.
     * @minimum -9007199254740991
     * @maximum 9007199254740991
     */
    width: number;
    /**
     * The photo's height, in pixels.
     * @minimum -9007199254740991
     * @maximum 9007199254740991
     */
    height: number;
  }
}

export interface ListingDeleteParams {
  /**
   * How many cards to take off sale. Defaults to all of them. Query parameter.
   * @minimum 1
   * @maximum 9007199254740991
   */
  quantity?: number;
}

export interface ListingDeleteResponse {
  /**
   * Stable opaque identifier for this inventory line. Do not parse.
   */
  id: string;
  /**
   * Your own stable identifier for this line, unique across your live lines. `null` when you have not set one.
   * @minLength 1
   * @maxLength 255
   */
  customId: LinesAPI.CustomID | null;
  /**
   * Free-text note attached to this line, shown to buyers on your Marketplace listing. `null` when there is none.
   */
  comment: string | null;
  /**
   * Your private note on this line, visible only to you and never shown to buyers. `null` when there is none.
   */
  notes: string | null;
  /**
   * The name of the location this line sits in. `null` when it has none.
   */
  location: string | null;
  /**
   * The names of the tags attached to this line. Empty when the line has no tags.
   */
  tags: Array<string>;
  /**
   * The catalogue product this line stocks. Returned by `GET /v1/products`.
   * @minimum -9007199254740991
   * @maximum 9007199254740991
   */
  productId: number;
  /**
   * The game the product belongs to, as a slug, e.g. `ygo`.
   */
  game: string;
  /**
   * The card's finish, e.g. `Standard`, `Foil`, `Reverse Holo`.
   */
  finish: string;
  /**
   * The card's condition: `NM`, `LP`, `MP`, `HP`, or `DMG`. `null` when the card is graded.
   */
  condition: PricingAPI.CardCondition | null;
  /**
   * The card's language as a two-letter code, e.g. `en`, `fr`, `de`.
   */
  language: string | null;
  /**
   * How many cards this line holds.
   * @minimum -9007199254740991
   * @maximum 9007199254740991
   */
  quantity: number;
  /**
   * Grading details when the card is graded. `null` for raw cards.
   */
  graded: LinesAPI.Graded | null;
  /**
   * `true` when this line is published to the Marketplace with a price. `false` when it sits in your Collection.
   */
  forSale: boolean;
  /**
   * The listing details when `forSale` is `true`. `null` when the line is not for sale.
   */
  listing: ListingDeleteResponse.Listing | null;
  /**
   * Photos attached to this line, in the order you set them. Buyers see them on your Marketplace listing. Empty when there are none.
   */
  photos: Array<ListingDeleteResponse.Photo>;
  /**
   * When this line was last modified.
   * @format date-time
   */
  updatedAt: string;
}

export namespace ListingDeleteResponse {
  export interface Listing {
    /**
     * A monetary amount as a decimal in the currency's major unit paired with its currency code — `{ amount: 14.99, currency: "USD" }` means $14.99.
     */
    price: AccountAPI.Money;
  }

  export interface Photo {
    /**
     * The photo's URL.
     * @format uri
     */
    url: string;
    /**
     * The photo's width, in pixels.
     * @minimum -9007199254740991
     * @maximum 9007199254740991
     */
    width: number;
    /**
     * The photo's height, in pixels.
     * @minimum -9007199254740991
     * @maximum 9007199254740991
     */
    height: number;
  }
}
export declare namespace Listings {
  export {
    type ListingListResponse as ListingListResponse,
    type ListingCreateResponse as ListingCreateResponse,
    type ListingUpdateResponse as ListingUpdateResponse,
    type ListingDeleteResponse as ListingDeleteResponse,
    type ListingListParams as ListingListParams,
    type ListingCreateParams as ListingCreateParams,
    type ListingUpdateParams as ListingUpdateParams,
    type ListingDeleteParams as ListingDeleteParams,
  };
}
