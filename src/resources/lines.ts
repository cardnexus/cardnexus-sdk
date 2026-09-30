// File generated from our OpenAPI spec by Scalar. See README.md for details.

import { APIResource } from '../resource';
import { APIPromise } from '../api-promise';
import type { RequestOptions } from '../internal/request-options';
import { buildHeaders } from '../internal/headers';
import { multipartFormRequestOptions } from '../internal/uploads';
import { path as __scalarPath } from '../internal/utils/path';
import type * as PricingAPI from './pricing';
import type * as AccountAPI from './account/account';
import type * as BulkOperationsAPI from './bulk-operations';

export class Lines extends APIResource {
  /**
   * Returns your inventory lines, newest writes included, as a cursor-paginated list ordered by line id.
   *
   * Each line carries its product, finish, condition (or grading), language, quantity, and — when it is for sale — its listing price. `forSale` is `true` for lines published to the Marketplace and `false` for lines kept in your Collection.
   *
   * Filter with any combination of `game`, `productId` (repeatable), `forSale`, `condition`, `language`, `finish`, `graded`, `customId`, `customIdPrefix`, `customIdContains`, `commentContains`, `location`, and `tags` (repeatable — matches lines carrying any of the named tags). Filters are combined with AND.
   *
   * Walk the full set by following `pagination.nextCursor`: pass it back as `cursor` until it comes back `null`. The id order is stable, so a sweep stays consistent while you write to your inventory. `limit` defaults to 50, maximum 100.
   *
   * This endpoint is for **reading and syncing** your inventory: it always reflects your latest changes and walks every line to the end. To find lines instead — free-text product-name search, all-of tag matching, relevance ranking — use `POST /v1/inventory/search`; both return the same line shape.
   *
   * Requires the `inventory:read` scope.
   *
   * @param {LineListParams} [query] - The parameters to send with the request.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<LineListResponse>} Inventory lines returned.
   *
   * @example
   * ```ts
   * const line = await client.lines.list({
   *   limit: 50,
   * });
   * ```
   */
  list(
    query: LineListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<LineListResponse> {
    return this._client.get('/inventory', { query, ...options });
  }

  /**
   * Adds new lines to your inventory — between 1 and 1000 per call.
   *
   * Each line names a catalogue product (see `GET /v1/products`), a finish, a language, and a quantity, plus either a `condition` (raw cards) or `graded` details (graded cards). Optionally attach a `customId` (your own identifier, unique across your live lines), a `comment` (shown to buyers), private `notes`, a `location`, `tags`, or a `listing` to publish the line to the Marketplace right away.
   *
   * `location` and `tags` are referenced by name and must already exist — create them first with `POST /v1/inventory/locations` and `POST /v1/inventory/tags`. A name that matches none of your labels rejects that line with `LOCATION_NOT_FOUND` or `TAG_NOT_FOUND`.
   *
   * Lines are processed one by one: valid lines land in `created`, rejected lines are reported in `errors` with the position they had in your request. The response status is 200 even when some — or all — lines were rejected, so check both fields.
   *
   * A new line without a `customId` that matches an existing line of yours exactly (same product, finish, condition, language, grading, and listing state) merges into it: the quantity is added to the existing line, and that line is returned in `created`.
   *
   * When any line carries a `listing`, your seller account must be active and every listing price must use your seller currency.
   *
   * Send an `Idempotency-Key` header to make retries safe: the same key returns the same response for 24 hours.
   *
   * Requires the `inventory:write` scope.
   *
   * @param {LineCreateParams} body - The request body to send.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<LineCreateResponse>} Lines processed. `created` holds the new lines, `errors` the rejected ones.
   *
   * @example
   * ```ts
   * const line = await client.lines.create({
   *   lines: [
   *     {
   *       productId: 50212,
   *       finish: 'Standard',
   *       language: 'x',
   *       quantity: 1,
   *     },
   *   ],
   * });
   * ```
   */
  create(body: LineCreateParams, options?: RequestOptions): APIPromise<LineCreateResponse> {
    return this._client.post('/inventory', { body, ...options });
  }

  /**
   * Searches your inventory lines. Returns a paginated list of lines matching the body, with `total` for the filtered set.
   *
   * Filter fields (all combined with AND):
   *
   * - `name` — free-text search against the product name, ranked by relevance. A print number before or after the name (`sephiroth 44`) pins that print; an expansion code plus print number (`msh-54`, `msh 54`, `msh54`) pins a single card. Send an `Accept-Language` header (`en`, `fr`, `it`, `es`, `de`) to match names in that language — not the same as the `language` filter, which matches the printed language of the cards themselves.
   * - `printNumber` — exact print-number match, ignoring case.
   * - `nameSlug` — exact slug match, ignoring case: every line you hold of that card, across printings and expansions.
   * - `tags`, `location` — match by label name. `{ "op": "or", "values": ["to-verify", "reserved"] }` returns lines carrying either tag; `"op": "and"` requires both. Pass `null` as a value to match lines with no tag (or no location) — `{ "op": "or", "values": [null] }` returns untagged lines.
   * - `customId`, `customIdPrefix`, `customIdContains` — match your own line identifiers, case-insensitively. `commentContains` matches your buyer-facing comments word by word.
   * - `productIds`, `expansionId`, `nameSlug` — direct catalogue lookups. `productIds` and `expansionId` take up to 200 ids per call — split larger sets across several calls.
   * - `condition`, `language`, `finish`, `graded`, `forSale`, `quantity`, `listingPrice` — line attributes.
   * - `productType`, `productCategory` — restrict to cards or sealed.
   * - `gameFilters` — pick a game (e.g. `{ "game": "mtg" }`), and optionally that game's own attribute filters in the same object.
   *
   * Pagination + sort:
   *
   * - `limit` defaults to 50, max 200. `offset` defaults to 0 and pages up to the first 10,000 matches — for a complete walk of your inventory use `GET /v1/inventory` or `POST /v1/inventory/bulk/export`.
   * - `sortBy`, `sortDirection` — sort the results. When `name` is set, results are ranked by relevance unless you sort explicitly.
   *
   * This endpoint is for **finding** lines: relevance ranking, label and text matching, jump-to-page pagination. Results can lag your latest changes by a few seconds. To walk your whole inventory — always up to date, in a stable order, with no depth limit — use `GET /v1/inventory`; both return the same line shape.
   *
   * `POST /v1/inventory/bulk/export` accepts the same `filters`, so a search can be turned into an export unchanged.
   *
   * This endpoint has its own rate-limit bucket (`inventory-search`).
   *
   * Requires the `inventory:read` scope.
   *
   * @param {LineSearchParams} params - The parameters to send with the request.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<LineSearchResponse>} Matching lines returned.
   *
   * @example
   * ```ts
   * const line = await client.lines.search({
   *   offset: 0,
   *   limit: 50,
   * });
   * ```
   */
  search(params: LineSearchParams, options?: RequestOptions): APIPromise<LineSearchResponse> {
    const { 'Accept-Language': acceptLanguage, ...body } = params;
    return this._client.post('/inventory/search', {
      body,
      ...options,
      headers: buildHeaders([
        { ...(acceptLanguage !== undefined ? { 'Accept-Language': acceptLanguage } : {}) },
        options?.headers,
      ]),
    });
  }

  /**
   * Returns a single inventory line of yours by its id.
   *
   * The response carries the line's product, finish, condition (or grading), language, quantity, publication state, and listing price when it is for sale.
   *
   * Requires the `inventory:read` scope.
   *
   * @param {string} inventoryID - The inventory line's identifier. Returned by `GET /v1/inventory`. Path parameter.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<LineRetrieveResponse>} Inventory line returned.
   *
   * @example
   * ```ts
   * const line = await client.lines.retrieve('inventoryId');
   * ```
   */
  retrieve(inventoryID: string, options?: RequestOptions): APIPromise<LineRetrieveResponse> {
    return this._client.get(__scalarPath`/inventory/${inventoryID}`, options);
  }

  /**
   * Changes a single inventory line — its quantity, condition, language, finish, grading, `customId`, `comment`, `notes`, `location`, or `tags`. Send only the fields you want to change.
   *
   * `finish` and `language` must be ones the product exists in — see the product's `finishes` and `languages` on `GET /v1/products/{productId}`. A finish the product doesn't come in is rejected with `INVALID_FINISH`; a language it doesn't come in with `INVALID_LANGUAGE`.
   *
   * Quantity takes either `{"set": n}` (new total) or `{"adjust": n}` (signed change). A change that would leave zero or fewer cards is rejected with `INSUFFICIENT_QUANTITY` — use `DELETE /v1/inventory/{inventoryId}` to remove a line.
   *
   * `location` takes a location name, or `null` to move the line to no location. `tags` takes `{"set": [...]}` (replace the whole set, `[]` clears), `{"add": [...]}` (add, keep the rest), or `{"remove": [...]}` (remove only those). `location` and `tags` names must already exist — a name that matches none of your labels returns `LOCATION_NOT_FOUND` or `TAG_NOT_FOUND`. `notes` is your private note; pass `null` to remove it.
   *
   * `count` applies the attribute changes to only part of the line. When `count` is lower than the line's quantity, the line splits: `count` cards take the changes and come back as `line`, the rest stays unchanged and comes back as `remainder`. The split-off part inherits the original line's `comment` unless you send a new one, and never inherits its `customId` — send `customId` to give the new part its own. `count` needs at least one attribute change and cannot be combined with `quantity`.
   *
   * If the changes make this line identical to another of your lines (same product, finish, condition, language, grading, and listing state, neither line carrying a `customId`), the two merge; `line` is the surviving line.
   *
   * Send an `Idempotency-Key` header to make retries safe: the same key returns the same response for 24 hours.
   *
   * Requires the `inventory:write` scope.
   *
   * @param {string} inventoryID - The inventory line's identifier. Returned by `GET /v1/inventory`. Path parameter.
   * @param {LineUpdateParams} [body] - The request body to send.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<LineUpdateResponse>} Inventory line updated.
   *
   * @example
   * ```ts
   * const line = await client.lines.update('inventoryId');
   * ```
   */
  update(
    inventoryID: string,
    body: LineUpdateParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<LineUpdateResponse> {
    return this._client.patch(__scalarPath`/inventory/${inventoryID}`, { body, ...options });
  }

  /**
   * Removes an inventory line entirely, whatever its quantity. If the line is published to the Marketplace, its listing is cancelled with it.
   *
   * The line's `customId`, if it had one, becomes available for reuse on another line.
   *
   * Requires the `inventory:write` scope.
   *
   * @param {string} inventoryID - The inventory line's identifier. Returned by `GET /v1/inventory`. Path parameter.
   * @param {LineDeleteParams} [body] - The request body to send.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<LineDeleteResponse>} Inventory line deleted.
   *
   * @example
   * ```ts
   * const line = await client.lines.delete('inventoryId');
   * ```
   */
  delete(
    inventoryID: string,
    body: LineDeleteParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<LineDeleteResponse> {
    return this._client.delete(__scalarPath`/inventory/${inventoryID}`, { body, ...options });
  }

  /**
   * Replaces the photos attached to an inventory line. Buyers see these photos on your Marketplace listing for the line.
   *
   * Send the request as `multipart/form-data` with each photo in the `files` field — between 1 and 10 images, any `image/*` content type, up to 10 MB each. The whole set is replaced in one call: include every photo the line should keep. A file that cannot be read as an image is rejected with `BAD_REQUEST`.
   *
   * Requires the `inventory:write` scope.
   *
   * @param {string} inventoryID - The inventory line's identifier. Returned by `GET /v1/inventory`. Path parameter.
   * @param {LineSetMediaParams} body - The request body to send.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<LineSetMediaResponse>} Photos replaced; the updated line is returned.
   *
   * @example
   * ```ts
   * const line = await client.lines.setMedia('inventoryId', {
   *   files: [''],
   * });
   * ```
   */
  setMedia(
    inventoryID: string,
    body: LineSetMediaParams,
    options?: RequestOptions,
  ): APIPromise<LineSetMediaResponse> {
    return this._client.put(
      __scalarPath`/inventory/${inventoryID}/media`,
      multipartFormRequestOptions({ body, ...options }, this._client),
    );
  }
}

/**
 * Your own stable identifier for this inventory line, unique across your live lines. CardNexus never modifies it.
 */
export type CustomID = string;

/**
 * Grading details for a slabbed card.
 */
export interface Graded {
  /**
   * The grade assigned by the grading company, as printed on the slab.
   */
  grade: string;
  /**
   * The certification number printed on the slab. `null` when the card does not carry one.
   */
  certification: string | null;
  /**
   * The grading company that graded the card, e.g. `PSA`, `BGS`, `CGC`.
   */
  gradingService: string;
}

export interface LineListParams {
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
  /**
   * `true` returns only lines published to the Marketplace; `false` returns only lines in your Collection. Omit to return both.
   */
  forSale?: boolean;
}

export interface LineListResponse {
  data: Array<LineListResponse.Data>;
  pagination: LineListResponse.Pagination;
}

export namespace LineListResponse {
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
    customId: CustomID | null;
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
    graded: Graded | null;
    /**
     * `true` when this line is published to the Marketplace with a price. `false` when it sits in your Collection.
     */
    forSale: boolean;
    /**
     * The listing details when `forSale` is `true`. `null` when the line is not for sale.
     */
    listing: Data.Listing | null;
    /**
     * Photos attached to this line, in the order you set them with `PUT /v1/inventory/{inventoryId}/media`. Buyers see them on your Marketplace listing. Empty when there are none.
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

export interface LineCreateParams {
  /**
   * The lines to add — between 1 and 1000 per call.
   * @minItems 1
   * @maxItems 1000
   */
  lines: Array<LineCreateParams.Line>;
}

export namespace LineCreateParams {
  export interface Line {
    /**
     * The catalogue product to stock. Product ids come from `GET /v1/products`.
     */
    productId: number | string;
    /**
     * The card's finish, e.g. `Standard`, `Foil`, `Reverse Holo`. Must be a finish the product exists in.
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
     * The card's language as a two-letter code, e.g. `en`, `fr`, `de`. Must be a language the product exists in.
     * @minLength 1
     */
    language: string;
    /**
     * How many cards to add. A whole number of 1 or more.
     * @minimum 1
     * @maximum 9007199254740991
     */
    quantity: number;
    /**
     * The card's condition: `NM`, `LP`, `MP`, `HP`, or `DMG`. Required for raw cards; omit for graded cards.
     */
    condition?: PricingAPI.CardCondition;
    /**
     * Grading details when the card is graded. Omit for raw cards.
     */
    graded?: Line.Graded;
    /**
     * Your own stable identifier for this line, unique across your live lines.
     * @minLength 1
     * @maxLength 255
     */
    customId?: CustomID;
    /**
     * Free-text note to attach to the line. Buyers see it when they view your listing.
     * @maxLength 2000
     */
    comment?: BulkOperationsAPI.InventoryComment;
    /**
     * Private note to attach to the line, visible only to you and never shown to buyers.
     * @maxLength 2000
     */
    notes?: string;
    /**
     * The location to put this line in, by name. Must match one of your existing locations (see `GET /v1/inventory/locations`).
     * @minLength 1
     * @maxLength 100
     */
    location?: string;
    /**
     * The tags to attach to this line, by name. Each must match one of your existing tags (see `GET /v1/inventory/tags`).
     * @maxItems 50
     */
    tags?: Array<string>;
    /**
     * Publish the new line to the Marketplace right away at this price. Omit to keep it in your Collection.
     */
    listing?: Line.Listing;
  }

  export namespace Line {
    export interface Graded {
      /**
       * The grade printed on the slab, e.g. `9.5`.
       * @minLength 1
       */
      grade: string;
      /**
       * The grading company that graded the card, e.g. `PSA`, `Beckett`, `CGC`.
       */
      gradingService:
        | 'PSA'
        | 'Beckett'
        | 'CGC'
        | 'TAG'
        | 'PCG'
        | 'CCC'
        | 'PCA'
        | 'CollectAura'
        | 'MTGGrade'
        | 'PureGrading'
        | 'SGS';
      /**
       * The certification number printed on the slab. Omit it when you do not have it.
       * @minLength 1
       */
      certification?: string;
    }

    export interface Listing {
      /**
       * The per-card price. The currency must match your seller currency.
       */
      price: Listing.Price;
    }

    export namespace Listing {
      export interface Price {
        /**
         * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
         */
        amount: number;
        currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
      }
    }
  }
}

export interface LineCreateResponse {
  /**
   * The lines as they now stand in your inventory, including existing lines your new cards merged into. Empty when every line was rejected.
   */
  created: Array<LineCreateResponse.Created>;
  /**
   * The lines that were rejected, each with its position in your request. Empty when every line succeeded.
   */
  errors: Array<LineCreateResponse.Error>;
}

export namespace LineCreateResponse {
  export interface Created {
    /**
     * Stable opaque identifier for this inventory line. Do not parse.
     */
    id: string;
    /**
     * Your own stable identifier for this line, unique across your live lines. `null` when you have not set one.
     * @minLength 1
     * @maxLength 255
     */
    customId: CustomID | null;
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
    graded: Graded | null;
    /**
     * `true` when this line is published to the Marketplace with a price. `false` when it sits in your Collection.
     */
    forSale: boolean;
    /**
     * The listing details when `forSale` is `true`. `null` when the line is not for sale.
     */
    listing: Created.Listing | null;
    /**
     * Photos attached to this line, in the order you set them with `PUT /v1/inventory/{inventoryId}/media`. Buyers see them on your Marketplace listing. Empty when there are none.
     */
    photos: Array<Created.Photo>;
    /**
     * When this line was last modified.
     * @format date-time
     */
    updatedAt: string;
  }

  export namespace Created {
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

  export interface Error {
    /**
     * The position of the rejected line in the `lines` array you sent, starting at 0.
     * @minimum -9007199254740991
     * @maximum 9007199254740991
     */
    index: number;
    /**
     * Why the line was rejected. `PRODUCT_NOT_FOUND`: no catalogue product with this id. `INVALID_LANGUAGE`: the product does not exist in this language. `INVALID_FINISH`: the product does not exist in this finish. `INVALID_QUANTITY`: quantity must be a whole number of 1 or more. `CONDITION_REQUIRED`: raw cards need a `condition`. `INVALID_IDENTITY`: a line takes either `condition` (raw cards) or `graded` (graded cards), not both. `CUSTOM_ID_CONFLICT`: another of your live lines (or another line in this request) already uses this `customId`. `LOCATION_NOT_FOUND`: the `location` name matches none of your locations. `TAG_NOT_FOUND`: a `tags` name matches none of your tags.
     */
    code:
      | 'PRODUCT_NOT_FOUND'
      | 'INVALID_LANGUAGE'
      | 'INVALID_FINISH'
      | 'INVALID_QUANTITY'
      | 'CONDITION_REQUIRED'
      | 'INVALID_IDENTITY'
      | 'CUSTOM_ID_CONFLICT'
      | 'LOCATION_NOT_FOUND'
      | 'TAG_NOT_FOUND';
    /**
     * The values that caused the rejection, e.g. the product id that was not found.
     */
    data: Record<string, string | number>;
  }
}

export interface LineSearchParams {
  /**
   * Header param: The language to work in — `en`, `fr`, `it`, `es`, or `de`, with or without a region. Name searches match in that language where a translation exists, falling back to English. Defaults to English.
   */
  'Accept-Language'?: string;
  /**
   * Body param: How many results to skip. Pages up to the first 10,000 matching lines — to go deeper, narrow the filters, walk `GET /v1/inventory`, or start a bulk export.
   * @default 0
   * @minimum 0
   * @maximum 10000
   */
  offset?: number;
  /**
   * Body param
   * @default 50
   * @minimum 1
   * @maximum 200
   */
  limit?: number;
  /**
   * Body param: Free-text search against the product name, ranked by relevance. Also matches print numbers and expansion codes — `sephiroth 44` returns your Sephiroth numbered 44 first, and `msh-54`, `msh 54`, or `msh54` returns your copies of card 54 from the expansion coded MSH. Send an `Accept-Language` header to search names in another language.
   * @minLength 1
   */
  name?: string;
  /**
   * Body param: Return only lines of products with this print number, matched exactly ignoring case — `232`, `038`, `ST02-44`.
   * @minLength 1
   */
  printNumber?: string;
  /**
   * Body param: Exact match against the product's `nameSlug`, ignoring case — your lines of that card across every printing and expansion. Slugs come back on every product from `POST /v1/products/search`.
   * @minLength 1
   */
  nameSlug?: string;
  /**
   * Body param: Return the line whose `customId` equals this value, matched case-insensitively.
   * @minLength 1
   */
  customId?: string;
  /**
   * Body param: Return lines whose `customId` starts with this value, matched case-insensitively.
   * @minLength 1
   */
  customIdPrefix?: string;
  /**
   * Body param: Return lines whose `customId` contains this value, case-insensitively.
   * @minLength 1
   */
  customIdContains?: string;
  /**
   * Body param: Return lines whose `comment` contains this text, matched word by word — `binder 2` matches a comment containing those words in that order, not arbitrary substrings inside a word.
   * @minLength 1
   */
  commentContains?: string;
  /**
   * Body param: Return only lines for these products (1–200). Product ids come from `GET /v1/products`.
   * @minItems 1
   * @maxItems 200
   */
  productIds?: Array<number | string>;
  /**
   * Body param: Return only lines from these expansions (1–200). Ids are returned by `GET /v1/games/{gameId}/expansions`.
   * @minItems 1
   * @maxItems 200
   */
  expansionId?: Array<number | string>;
  /**
   * Body param: Match lines by their tags — `{ "op": "or", "values": ["to-verify", "reserved"] }` returns lines carrying either tag; `"op": "and"` requires both. A `null` value matches lines with no tags at all.
   */
  tags?: BulkOperationsAPI.InventoryLabelFilter;
  /**
   * Body param: Match lines by their location name — `{ "op": "or", "values": ["Store A"] }`. A `null` value matches lines with no location.
   */
  location?: BulkOperationsAPI.InventoryLabelFilter;
  /**
   * Body param: Return only lines in these conditions — `{ "op": "or", "values": ["NM", "LP"] }`.
   */
  condition?: LineSearchParams.Condition;
  /**
   * Body param: Return only lines in these languages, as two-letter codes — `{ "op": "or", "values": ["en", "de"] }`.
   */
  language?: LineSearchParams.Language;
  /**
   * Body param: Return only lines with these finishes — `{ "op": "or", "values": ["Foil"] }`.
   */
  finish?: LineSearchParams.Finish;
  /**
   * Body param: Restrict to one or more product types — `{ "op": "or", "values": ["card"] }` for cards only.
   */
  productType?: LineSearchParams.ProductType;
  /**
   * Body param: Restrict to a single sealed-product category (e.g. `booster_box`, `bundle`). Only meaningful when filtering on `sealed`.
   * @minLength 1
   */
  productCategory?: string;
  /**
   * Body param: `true` returns only graded cards; `false` returns only raw cards. Omit to return both.
   */
  graded?: boolean;
  /**
   * Body param: `true` returns only lines published to the Marketplace; `false` returns only lines in your Collection. Omit to return both.
   */
  forSale?: boolean;
  /**
   * Body param: Return only lines whose quantity falls in this range, bounds inclusive.
   */
  quantity?: LineSearchParams.Quantity;
  /**
   * Body param: Return only for-sale lines whose listing price falls in this range. Compares the amount only, across currencies.
   */
  listingPrice?: LineSearchParams.ListingPrice;
  /**
   * Body param: Restrict to a single game, and optionally filter on that game's own attributes (rarity, color, …). Pass `{ "game": "mtg" }` for any MTG line, or add `filters: { rarity: { op: "or", values: ["mythic"] } }` to narrow further. To narrow to expansions, use `expansionId`.
   */
  gameFilters?:
    | LineSearchParams.Sorcery
    | LineSearchParams.Lorcana
    | LineSearchParams.MagicTheGathering
    | LineSearchParams.FleshAndBlood
    | LineSearchParams.PokMon
    | LineSearchParams.Wankul
    | LineSearchParams.OnePiece
    | LineSearchParams.YuGiOh
    | LineSearchParams.Rise
    | LineSearchParams.Riftbound
    | LineSearchParams.Drakerion
    | LineSearchParams.Cyberpunk
    | LineSearchParams.PokMonJapan
    | LineSearchParams.StarWarsUnlimited
    | LineSearchParams.ExampleGame
    | LineSearchParams.NarutoMythos
    | LineSearchParams.GrandArchive
    | LineSearchParams.EchoesOfAstra
    | LineSearchParams.DragonBallSuperFusionWorld
    | LineSearchParams.DragonBallSuperMasters
    | LineSearchParams.GundamCardGame
    | LineSearchParams.ChronoCore
    | LineSearchParams.PalworldTcg
    | LineSearchParams.AzukiTcg;
  /**
   * Body param: Field to sort by. Defaults to relevance when `name` is set, otherwise `lastModified`.
   */
  sortBy?: 'name' | 'quantity' | 'listingPrice' | 'lastModified';
  /**
   * Body param: Sort direction. Defaults to `asc`, except the default `lastModified` sort which is newest first.
   */
  sortDirection?: 'asc' | 'desc';
}

export namespace LineSearchParams {
  export interface Condition {
    /**
     * `or` matches lines carrying any of the values; `and` requires all of them.
     */
    op: 'and' | 'or';
    /**
     * @minItems 1
     */
    values: Array<PricingAPI.CardCondition>;
  }

  export interface Language {
    /**
     * `or` matches lines carrying any of the values; `and` requires all of them.
     */
    op: 'and' | 'or';
    /**
     * @minItems 1
     * @maxItems 50
     */
    values: Array<string>;
  }

  export interface Finish {
    op: 'and' | 'or';
    values: Array<
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
      | 'Holofoil'
    >;
  }

  export interface ProductType {
    op: 'and' | 'or';
    values: Array<'card' | 'sealed'>;
  }

  export interface Quantity {
    /**
     * Lowest quantity to include, inclusive.
     * @minimum 0
     * @maximum 9007199254740991
     */
    min?: number;
    /**
     * Highest quantity to include, inclusive.
     * @minimum 0
     * @maximum 9007199254740991
     */
    max?: number;
  }

  export interface ListingPrice {
    /**
     * Lowest price to include, inclusive, as a decimal in the currency's major unit (`5` = 5.00).
     * @minimum 0
     */
    min?: number;
    /**
     * Highest price to include, inclusive, as a decimal in the currency's major unit.
     * @minimum 0
     */
    max?: number;
  }

  export interface Sorcery {
    game: 'sorcery';
    /**
     * @default {}
     */
    filters?: Sorcery.Filters;
  }

  export namespace Sorcery {
    export interface Filters {
      name?: Filters.Name;
      finish?: Filters.Finish;
      finishes?: Filters.Finishes;
      variant?: Filters.Variant;
      rarity?: Filters.Rarity;
      type?: Filters.Type;
      subType?: Filters.SubType;
      cost?: Filters.Cost | Filters.Cost2;
      elements?: Filters.Elements;
      airThreshold?: Filters.AirThreshold | Filters.AirThreshold2;
      fireThreshold?: Filters.FireThreshold | Filters.FireThreshold2;
      earthThreshold?: Filters.EarthThreshold | Filters.EarthThreshold2;
      waterThreshold?: Filters.WaterThreshold | Filters.WaterThreshold2;
      languages?: Filters.Languages;
      attack?: Filters.Attack;
      defense?: Filters.Defense;
      life?: Filters.Life;
    }

    export namespace Filters {
      export interface Name {
        value: string;
      }

      export interface Finish {
        op: 'and' | 'or';
        values: Array<'Standard' | 'Foil' | 'Rainbow'>;
      }

      export interface Finishes {
        op: 'and' | 'or';
        values: Array<'Standard' | 'Foil' | 'Rainbow'>;
      }

      export interface Variant {
        op: 'and' | 'or';
        values: Array<
          | 'Booster'
          | 'Promo'
          | 'Preconstructed Deck'
          | 'Store Kit'
          | 'Draft Kit'
          | 'Dust'
          | 'Pledge Pack'
          | 'Box Topper'
          | 'Welcome Kit'
          | 'Organized Play'
          | 'Alpha Investments'
          | 'Team Covenant'
          | 'Kickstarter'
          | 'Star City Games'
        >;
      }

      export interface Rarity {
        op: 'and' | 'or';
        values: Array<'Unique' | 'Elite' | 'Exceptional' | 'Ordinary' | 'Curio'>;
      }

      export interface Type {
        op: 'and' | 'or';
        values: Array<'Avatar' | 'Minion' | 'Magic' | 'Aura' | 'Artifact' | 'Site'>;
      }

      export interface SubType {
        op: 'and' | 'or';
        values: Array<
          | 'Mortal'
          | 'Beast'
          | 'Spirit'
          | 'Undead'
          | 'Demon'
          | 'Dragon'
          | 'Monster'
          | 'Sphinx'
          | 'Faerie'
          | 'Angel'
          | 'Giant'
          | 'Troll'
          | 'Dwarf'
          | 'Gnome'
          | 'Ogre'
          | 'Goblin'
          | 'Merfolk'
          | 'Armor'
          | 'Relic'
          | 'Device'
          | 'Monument'
          | 'Automaton'
          | 'Instruments'
          | 'Weapon'
          | 'Document'
          | 'Potion'
          | 'Tower'
          | 'Village'
          | 'Desert'
          | 'River'
        >;
      }

      export interface Cost {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface Cost2 {
        min: number;
        max: number;
      }

      export interface Elements {
        op: 'and' | 'or';
        values: Array<'water' | 'earth' | 'fire' | 'air'>;
      }

      export interface AirThreshold {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface AirThreshold2 {
        min: number;
        max: number;
      }

      export interface FireThreshold {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface FireThreshold2 {
        min: number;
        max: number;
      }

      export interface EarthThreshold {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface EarthThreshold2 {
        min: number;
        max: number;
      }

      export interface WaterThreshold {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface WaterThreshold2 {
        min: number;
        max: number;
      }

      export interface Languages {
        op: 'and' | 'or';
        values: Array<
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
          | 'sa'
        >;
      }

      export interface Attack {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface Defense {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface Life {
        op: '=' | '>' | '<';
        value: number;
      }
    }
  }

  export interface Lorcana {
    game: 'lorcana';
    /**
     * @default {}
     */
    filters?: Lorcana.Filters;
  }

  export namespace Lorcana {
    export interface Filters {
      name?: Filters.Name;
      rarity?: Filters.Rarity;
      color?: Filters.Color;
      finish?: Filters.Finish;
      finishes?: Filters.Finishes;
      cost?: Filters.Cost;
      ink?: Filters.Ink;
      traits?: Filters.Traits;
      type?: Filters.Type;
      languages?: Filters.Languages;
    }

    export namespace Filters {
      export interface Name {
        value: string;
      }

      export interface Rarity {
        op: 'and' | 'or';
        values: Array<
          | 'Common'
          | 'Uncommon'
          | 'Rare'
          | 'Super Rare'
          | 'Legendary'
          | 'Enchanted'
          | 'Epic'
          | 'Iconic'
          | 'Promo'
        >;
      }

      export interface Color {
        op: 'and' | 'or';
        values: Array<'Amber' | 'Amethyst' | 'Emerald' | 'Ruby' | 'Sapphire' | 'Steel'>;
      }

      export interface Finish {
        op: 'and' | 'or';
        values: Array<'Standard' | 'Foil'>;
      }

      export interface Finishes {
        op: 'and' | 'or';
        values: Array<'Standard' | 'Foil'>;
      }

      export interface Cost {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface Ink {
        op: 'and' | 'or';
        values: Array<'Inkable' | 'NonInkable'>;
      }

      export interface Traits {
        op: 'and' | 'or';
        values: Array<
          | 'Action'
          | 'Alien'
          | 'Ally'
          | 'Broom'
          | 'Captain'
          | 'Colossus'
          | 'Deity'
          | 'Detective'
          | 'Dinosaur'
          | 'Dragon'
          | 'Dreamborn'
          | 'Entangled'
          | 'Fairy'
          | 'Floodborn'
          | 'Gargoyle'
          | 'Ghost'
          | 'Giant'
          | 'Hero'
          | 'Hunny'
          | 'Hyena'
          | 'Illusion'
          | 'Inventor'
          | 'Item'
          | 'King'
          | 'Knight'
          | 'Madrigal'
          | 'Mentor'
          | 'Monster'
          | 'Musketeer'
          | 'Obstacle'
          | 'Pirate'
          | 'Prince'
          | 'Princess'
          | 'Puppy'
          | 'Queen'
          | 'Racer'
          | 'Red Panda'
          | 'Robot'
          | 'Seven Dwarfs'
          | 'Song'
          | 'Sorcerer'
          | 'Storyborn'
          | 'Super'
          | 'Team'
          | 'Tigger'
          | 'Titan'
          | 'Toy'
          | 'Villain'
          | 'Vineling'
          | 'Whisper'
        >;
      }

      export interface Type {
        op: 'and' | 'or';
        values: Array<'Action' | 'Character' | 'Item' | 'Location'>;
      }

      export interface Languages {
        op: 'and' | 'or';
        values: Array<
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
          | 'sa'
        >;
      }
    }
  }

  export interface MagicTheGathering {
    game: 'mtg';
    /**
     * @default {}
     */
    filters?: MagicTheGathering.Filters;
  }

  export namespace MagicTheGathering {
    export interface Filters {
      name?: Filters.Name;
      finish?: Filters.Finish;
      finishes?: Filters.Finishes;
      color?: Filters.Color;
      colorIdentity?: Filters.ColorIdentity;
      rarity?: Filters.Rarity;
      languages?: Filters.Languages;
    }

    export namespace Filters {
      export interface Name {
        value: string;
      }

      export interface Finish {
        op: 'and' | 'or';
        values: Array<'Standard' | 'Foil' | 'Etched' | 'Signed'>;
      }

      export interface Finishes {
        op: 'and' | 'or';
        values: Array<'Standard' | 'Foil' | 'Etched' | 'Signed'>;
      }

      export interface Color {
        op: 'and' | 'or';
        values: Array<'B' | 'G' | 'R' | 'W' | 'U' | 'C'>;
      }

      export interface ColorIdentity {
        op: 'and' | 'or';
        values: Array<'B' | 'G' | 'R' | 'W' | 'U' | 'C'>;
      }

      export interface Rarity {
        op: 'and' | 'or';
        values: Array<'bonus' | 'common' | 'uncommon' | 'rare' | 'mythic' | 'special'>;
      }

      export interface Languages {
        op: 'and' | 'or';
        values: Array<
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
          | 'sa'
        >;
      }
    }
  }

  export interface FleshAndBlood {
    game: 'fab';
    /**
     * @default {}
     */
    filters?: FleshAndBlood.Filters;
  }

  export namespace FleshAndBlood {
    export interface Filters {
      name?: Filters.Name;
      rarity?: Filters.Rarity;
      classes?: Filters.Classes;
      talents?: Filters.Talents;
      finish?: Filters.Finish;
      finishes?: Filters.Finishes;
      types?: Filters.Types;
      subTypes?: Filters.SubTypes;
      color?: Filters.Color;
      cost?: Filters.Cost;
      languages?: Filters.Languages;
      variant?: Filters.Variant;
    }

    export namespace Filters {
      export interface Name {
        value: string;
      }

      export interface Rarity {
        op: 'and' | 'or';
        values: Array<
          | 'Common'
          | 'Rare'
          | 'Super Rare'
          | 'Majestic'
          | 'Legendary'
          | 'Fabled'
          | 'Token'
          | 'Marvel'
          | 'Promo'
        >;
      }

      export interface Classes {
        op: 'and' | 'or';
        values: Array<
          | 'Adjudicator'
          | 'Assassin'
          | 'Bard'
          | 'Brute'
          | 'Generic'
          | 'Guardian'
          | 'Illusionist'
          | 'Mechanologist'
          | 'Merchant'
          | 'Ninja'
          | 'Ranger'
          | 'Runeblade'
          | 'Shapeshifter'
          | 'Warrior'
          | 'Wizard'
        >;
      }

      export interface Talents {
        op: 'and' | 'or';
        values: Array<
          | 'Chaos'
          | 'Draconic'
          | 'Earth'
          | 'Elemental'
          | 'Ice'
          | 'Light'
          | 'Lightning'
          | 'Mystic'
          | 'Rosetta'
          | 'Royal'
          | 'Shadow'
        >;
      }

      export interface Finish {
        op: 'and' | 'or';
        values: Array<'Standard' | 'Rainbow Foil' | 'Cold Foil' | 'Gold Foil'>;
      }

      export interface Finishes {
        op: 'and' | 'or';
        values: Array<'Standard' | 'Rainbow Foil' | 'Cold Foil' | 'Gold Foil'>;
      }

      export interface Types {
        op: 'and' | 'or';
        values: Array<
          | 'Action'
          | 'Attack Reaction'
          | 'Block'
          | 'Defense Reaction'
          | 'Demi-Hero'
          | 'Equipment'
          | 'Hero'
          | 'Instant'
          | 'Macro'
          | 'Mentor'
          | 'Resource'
          | 'Token'
          | 'Weapon'
        >;
      }

      export interface SubTypes {
        op: 'and' | 'or';
        values: Array<
          | '(1H)'
          | '(2H)'
          | 'Affliction'
          | 'Ally'
          | 'Angel'
          | 'Arms'
          | 'Arrow'
          | 'Ash'
          | 'Attack'
          | 'Aura'
          | 'Axe'
          | 'Base'
          | 'Book'
          | 'Bow'
          | 'Brush'
          | 'Chest'
          | 'Chi'
          | 'Claw'
          | 'Club'
          | 'Construct'
          | 'Dagger'
          | 'Demon'
          | 'Dragon'
          | 'Evo'
          | 'Fiddle'
          | 'Figment'
          | 'Flail'
          | 'Gem'
          | 'Gun'
          | 'Hammer'
          | 'Head'
          | 'Invocation'
          | 'Item'
          | 'Landmark'
          | 'Legs'
          | 'Lute'
          | 'Mercenary'
          | 'Off-Hand'
          | 'Orb'
          | 'Pistol'
          | 'Polearm'
          | 'Quiver'
          | 'Rock'
          | 'Scepter'
          | 'Scroll'
          | 'Scythe'
          | 'Shuriken'
          | 'Song'
          | 'Staff'
          | 'Sword'
          | 'Trap'
          | 'Wrench'
          | 'Young'
        >;
      }

      export interface Color {
        op: 'and' | 'or';
        values: Array<'Red' | 'Yellow' | 'Blue'>;
      }

      export interface Cost {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface Languages {
        op: 'and' | 'or';
        values: Array<
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
          | 'sa'
        >;
      }

      export interface Variant {
        op: 'and' | 'or';
        values: Array<
          | 'Unlimited'
          | 'Marvel'
          | 'Marvel Alternate Art'
          | 'Extended Art'
          | 'Alternate Art'
          | 'Alternate Art #A'
          | 'Alternate Art #B'
          | 'Alternate Art #C'
          | 'CC'
        >;
      }
    }
  }

  export interface PokMon {
    game: 'pokemon';
    /**
     * @default {}
     */
    filters?: PokMon.Filters;
  }

  export namespace PokMon {
    export interface Filters {
      cardType?: Filters.CardType;
      name?: Filters.Name;
      rarity?: Filters.Rarity;
      finish?: Filters.Finish;
      finishes?: Filters.Finishes;
      variant?: Filters.Variant;
      pokemonTypes?: Filters.PokemonTypes;
      languages?: Filters.Languages;
      hp?: Filters.Hp;
      stage?: Filters.Stage;
      retreatCost?: Filters.RetreatCost;
    }

    export namespace Filters {
      export interface CardType {
        op: 'and' | 'or';
        values: Array<'Pokemon' | 'Trainer' | 'Energy'>;
      }

      export interface Name {
        value: string;
      }

      export interface Rarity {
        op: 'and' | 'or';
        values: Array<
          | 'ACE_SPEC_RARE'
          | 'AMAZING_RARE'
          | 'BLACK_WHITE_RARE'
          | 'CLASSIC'
          | 'CLASSIC_COLLECTION'
          | 'COMMON'
          | 'CROWN'
          | 'DOUBLE_RARE'
          | 'FOUR_DIAMOND'
          | 'FULL_ART_TRAINER'
          | 'FUTURISTIC_RARE'
          | 'HOLO_RARE_V'
          | 'HOLO_RARE_VMAX'
          | 'HOLO_RARE_VSTAR'
          | 'HOLO_RARE'
          | 'HYPER_RARE'
          | 'ILLUSTRATION_RARE'
          | 'LEGEND'
          | 'MEGA_ATTACK_RARE'
          | 'NONE'
          | 'ONE_DIAMOND'
          | 'ONE_SHINY'
          | 'ONE_STAR'
          | 'PIKACHU_RARE'
          | 'PROMO'
          | 'RADIANT_RARE'
          | 'RARE_BREAK'
          | 'RARE_HOLO_EX'
          | 'RARE_HOLO_GX'
          | 'RARE_HOLO_LV_X'
          | 'RARE_HOLO_STAR'
          | 'RARE_HOLO'
          | 'RARE_PRIME'
          | 'RARE_PRISM_STAR'
          | 'RARE_RAINBOW'
          | 'RARE_SHINING'
          | 'RARE_SHINY_GX'
          | 'RARE'
          | 'RGB_RARE'
          | 'SECRET_RARE'
          | 'SHINY_RARE_V'
          | 'SHINY_RARE_VMAX'
          | 'SHINY_RARE'
          | 'SHINY_ULTRA_RARE'
          | 'SPECIAL_ILLUSTRATION_RARE'
          | 'THREE_DIAMOND'
          | 'THREE_STAR'
          | 'TRAINER_GALLERY_RARE_HOLO'
          | 'TWO_DIAMOND'
          | 'TWO_SHINY'
          | 'TWO_STAR'
          | 'ULTRA_RARE'
          | 'UNCOMMON'
        >;
      }

      export interface Finish {
        op: 'and' | 'or';
        values: Array<'Reverse Holo' | 'Standard' | 'Foil'>;
      }

      export interface Finishes {
        op: 'and' | 'or';
        values: Array<'Reverse Holo' | 'Standard' | 'Foil'>;
      }

      export interface Variant {
        op: 'and' | 'or';
        values: Array<
          | '1st Edition'
          | 'Unlimited'
          | 'Poke Ball Pattern'
          | 'Master Ball Pattern'
          | 'Friend Ball Pattern'
          | 'Love Ball Pattern'
          | 'Dusk Ball Pattern'
          | 'Quick Ball Pattern'
          | 'Team Rocket'
          | 'Energy Symbol Pattern'
          | 'Holiday Calendar'
        >;
      }

      export interface PokemonTypes {
        op: 'and' | 'or';
        values: Array<
          | 'Colorless'
          | 'Dark'
          | 'Dragon'
          | 'Fairy'
          | 'Fighting'
          | 'Fire'
          | 'Grass'
          | 'Electric'
          | 'Steel'
          | 'Psychic'
          | 'Water'
        >;
      }

      export interface Languages {
        op: 'and' | 'or';
        values: Array<
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
          | 'sa'
        >;
      }

      export interface Hp {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface Stage {
        op: 'and' | 'or';
        values: Array<
          | 'Baby'
          | 'Basic'
          | 'BREAK'
          | 'GX'
          | 'LEVEL-UP'
          | 'MEGA'
          | 'RESTORED'
          | 'Stage1'
          | 'Stage2'
          | 'V'
          | 'V-UNION'
          | 'VMAX'
          | 'VSTAR'
        >;
      }

      export interface RetreatCost {
        op: '=' | '>' | '<';
        value: number;
      }
    }
  }

  export interface Wankul {
    game: 'wankul';
    /**
     * @default {}
     */
    filters?: Wankul.Filters;
  }

  export namespace Wankul {
    export interface Filters {
      name?: Filters.Name;
      rarity?: Filters.Rarity;
      finish?: Filters.Finish;
      finishes?: Filters.Finishes;
      cost?: Filters.Cost;
      force?: Filters.Force;
      effigyName?: Filters.EffigyName;
      languages?: Filters.Languages;
    }

    export namespace Filters {
      export interface Name {
        value: string;
      }

      export interface Rarity {
        op: 'and' | 'or';
        values: Array<
          | 'T'
          | 'C'
          | 'UC'
          | 'R'
          | 'UR1'
          | 'UR2'
          | 'L-B'
          | 'L-A'
          | 'L-O'
          | 'T-OR'
          | 'PGW-23'
          | 'PGW-24'
          | 'NOEL-23'
          | 'SP-CIV'
          | 'SP-LEG'
          | 'SP-CAR'
          | 'SP-POP'
          | 'SP-TV'
          | 'SP-JV'
          | 'G-P'
          | 'E-D'
          | 'E-G'
        >;
      }

      export interface Finish {
        op: 'and' | 'or';
        values: Array<'Standard' | 'Foil'>;
      }

      export interface Finishes {
        op: 'and' | 'or';
        values: Array<'Standard' | 'Foil'>;
      }

      export interface Cost {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface Force {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface EffigyName {
        op: 'and' | 'or';
        values: Array<'Terrain' | 'Laink' | 'Terracid' | 'Guest' | 'Random' | 'Gagnant Ticket Or'>;
      }

      export interface Languages {
        op: 'and' | 'or';
        values: Array<
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
          | 'sa'
        >;
      }
    }
  }

  export interface OnePiece {
    game: 'onepiece';
    /**
     * @default {}
     */
    filters?: OnePiece.Filters;
  }

  export namespace OnePiece {
    export interface Filters {
      name?: Filters.Name;
      finish?: Filters.Finish;
      finishes?: Filters.Finishes;
      color?: Filters.Color;
      rarity?: Filters.Rarity;
      variant?: Filters.Variant;
      attribute?: Filters.Attribute;
      languages?: Filters.Languages;
      type?: Filters.Type;
      life?: Filters.Life;
      power?: Filters.Power;
      cost?: Filters.Cost;
      counter?: Filters.Counter;
    }

    export namespace Filters {
      export interface Name {
        value: string;
      }

      export interface Finish {
        op: 'and' | 'or';
        values: Array<'Standard' | 'Foil'>;
      }

      export interface Finishes {
        op: 'and' | 'or';
        values: Array<'Standard' | 'Foil'>;
      }

      export interface Color {
        op: 'and' | 'or';
        values: Array<'R' | 'G' | 'U' | 'P' | 'B' | 'Y'>;
      }

      export interface Rarity {
        op: 'and' | 'or';
        values: Array<
          | 'common'
          | 'uncommon'
          | 'rare'
          | 'super_rare'
          | 'secret_rare'
          | 'promo'
          | 'leader'
          | 'special'
          | 'treasure_rare'
        >;
      }

      export interface Variant {
        op: 'and' | 'or';
        values: Array<
          | 'Alternate Art'
          | 'Manga'
          | 'Promo'
          | 'Super Pre-Release'
          | 'Jolly Roger Foil'
          | 'Textured Foil'
          | 'Alternate Manga Art'
          | 'Full Art'
          | 'Wanted Poster'
          | 'SP'
          | 'Pirate Foil'
          | 'Gold'
          | 'Silver'
          | 'Box Topper'
          | 'Reprint'
          | 'Super Alternate Art'
          | 'Treasure Rare'
          | 'Gem'
          | 'Serial Numbered'
        >;
      }

      export interface Attribute {
        op: 'and' | 'or';
        values: Array<'Strike' | 'Slash' | 'Special' | 'Ranged' | 'Wisdom'>;
      }

      export interface Languages {
        op: 'and' | 'or';
        values: Array<
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
          | 'sa'
        >;
      }

      export interface Type {
        op: 'and' | 'or';
        values: Array<'Leader' | 'DON!!' | 'Character' | 'Event' | 'Stage'>;
      }

      export interface Life {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface Power {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface Cost {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface Counter {
        op: '=' | '>' | '<';
        value: number;
      }
    }
  }

  export interface YuGiOh {
    game: 'ygo';
    /**
     * @default {}
     */
    filters?: YuGiOh.Filters;
  }

  export namespace YuGiOh {
    export interface Filters {
      name?: Filters.Name;
      rarity?: Filters.Rarity;
      variant?: Filters.Variant;
      finish?: Filters.Finish;
      finishes?: Filters.Finishes;
      formats?: Filters.Formats;
      type?: Filters.Type;
      attribute?: Filters.Attribute;
      race?: Filters.Race;
      linkMarkers?: Filters.LinkMarkers;
      languages?: Filters.Languages;
      atk?: Filters.Atk;
      def?: Filters.Def;
      level?: Filters.Level;
      rank?: Filters.Rank;
      scale?: Filters.Scale;
      linkRating?: Filters.LinkRating;
    }

    export namespace Filters {
      export interface Name {
        value: string;
      }

      export interface Rarity {
        op: 'and' | 'or';
        values: Array<
          | 'Common'
          | 'Rare'
          | 'Super Rare'
          | 'Ultra Rare'
          | 'Secret Rare'
          | 'Ultimate Rare'
          | 'Ghost Rare'
          | 'Ghost/Gold Rare'
          | 'Gold Rare'
          | 'Gold Secret Rare'
          | 'Premium Gold Rare'
          | 'Platinum Rare'
          | 'Platinum Secret Rare'
          | 'Prismatic Secret Rare'
          | 'Prismatic Ultimate Rare'
          | "Prismatic Collector's Rare"
          | 'Quarter Century Secret Rare'
          | '10000 Secret Rare'
          | 'Starlight Rare'
          | "Collector's Rare"
          | 'Extra Secret Rare'
          | 'Ultra Secret Rare'
          | 'Starfoil Rare'
          | 'Shatterfoil Rare'
          | 'Mosaic Rare'
          | 'Holographic Rare'
          | 'Parallel Rare'
          | 'Normal Parallel Rare'
          | 'Super Parallel Rare'
          | 'Ultra Parallel Rare'
          | 'Secret Parallel Rare'
          | 'Duel Terminal Normal Parallel Rare'
          | 'Duel Terminal Rare Parallel Rare'
          | 'Duel Terminal Super Parallel Rare'
          | 'Duel Terminal Ultra Parallel Rare'
          | 'Duel Terminal Secret Parallel Rare'
          | 'Duel Terminal Technology Common'
          | 'Duel Terminal Technology Ultra Rare'
          | 'Emblazoned Rare'
          | 'Emblazoned Ultra Rare'
          | 'Emblazoned Secret Rare'
          | "Ultra Pharaoh's Rare"
          | "Secret Pharaoh's Rare"
          | 'Millennium Rare'
          | 'Millennium Super Rare'
          | 'Millennium Ultra Rare'
          | 'Millennium Secret Rare'
          | 'Millennium Gold Rare'
          | 'Grand Master Rare'
          | 'Short Print'
          | 'Super Short Print'
          | 'Speed Duel Skill'
          | 'Token'
          | 'Promo'
        >;
      }

      export interface Variant {
        op: 'and' | 'or';
        values: Array<
          | 'Alternate Art'
          | 'New Art'
          | 'Art 7'
          | 'Art 8'
          | 'HERO Art'
          | 'Extended Art'
          | 'Japanese Artwork'
          | 'Blue'
          | 'Green'
          | 'Purple'
          | 'Red'
          | 'Silver'
          | 'Bronze'
          | 'Yellow'
          | 'Orange'
          | 'Black'
          | 'OTS Stamp'
          | 'Judge Stamp'
          | 'Regional Stamp'
          | 'Stamp'
          | 'Misprint'
          | 'Oversized'
          | 'Limited Edition'
        >;
      }

      export interface Finish {
        op: 'and' | 'or';
        values: Array<'Standard'>;
      }

      export interface Finishes {
        op: 'and' | 'or';
        values: Array<'Standard'>;
      }

      export interface Formats {
        op: 'and' | 'or';
        values: Array<
          | 'Common Charity'
          | 'Duel Links'
          | 'Edison'
          | 'GOAT'
          | 'Master Duel'
          | 'OCG'
          | 'OCG GOAT'
          | 'Speed Duel'
          | 'TCG'
        >;
      }

      export interface Type {
        op: 'and' | 'or';
        values: Array<
          | 'Effect Monster'
          | 'Flip Effect Monster'
          | 'Flip Tuner Effect Monster'
          | 'Fusion Monster'
          | 'Gemini Monster'
          | 'Link Monster'
          | 'Normal Monster'
          | 'Normal Tuner Monster'
          | 'Pendulum Effect Fusion Monster'
          | 'Pendulum Effect Monster'
          | 'Pendulum Effect Ritual Monster'
          | 'Pendulum Flip Effect Monster'
          | 'Pendulum Normal Monster'
          | 'Pendulum Tuner Effect Monster'
          | 'Ritual Effect Monster'
          | 'Ritual Monster'
          | 'Skill Card'
          | 'Spell Card'
          | 'Spirit Monster'
          | 'Synchro Monster'
          | 'Synchro Pendulum Effect Monster'
          | 'Synchro Tuner Monster'
          | 'Token'
          | 'Toon Monster'
          | 'Trap Card'
          | 'Tuner Monster'
          | 'Union Effect Monster'
          | 'XYZ Monster'
          | 'XYZ Pendulum Effect Monster'
        >;
      }

      export interface Attribute {
        op: 'and' | 'or';
        values: Array<'DARK' | 'DIVINE' | 'EARTH' | 'FIRE' | 'LIGHT' | 'WATER' | 'WIND'>;
      }

      export interface Race {
        op: 'and' | 'or';
        values: Array<
          | 'Abidos the Th'
          | 'Adrian Gecko'
          | 'Alexis Rhodes'
          | 'Amnael'
          | 'Andrew'
          | 'Aqua'
          | 'Arkana'
          | 'Aster Phoenix'
          | 'Axel Brodie'
          | 'Bastion Misaw'
          | 'Beast'
          | 'Beast-Warrior'
          | 'Bonz'
          | 'Camula'
          | 'Chazz Princet'
          | 'Christine'
          | 'Chumley Huffi'
          | 'Continuous'
          | 'Counter'
          | 'Creator God'
          | 'Cyberse'
          | 'David'
          | 'Dinosaur'
          | 'Divine-Beast'
          | 'Don Zaloog'
          | 'Dr. Vellian C'
          | 'Dragon'
          | 'Emma'
          | 'Equip'
          | 'Espa Roba'
          | 'Fairy'
          | 'Field'
          | 'Fiend'
          | 'Fish'
          | 'Illusion'
          | 'Insect'
          | 'Ishizu'
          | 'Ishizu Ishtar'
          | 'Jaden Yuki'
          | 'Jesse Anderso'
          | 'Joey'
          | 'Joey Wheeler'
          | 'Kagemaru'
          | 'Kaiba'
          | 'Keith'
          | 'Lumis Umbra'
          | 'Lumis and Umb'
          | 'Machine'
          | 'Mai'
          | 'Mai Valentine'
          | 'Mako'
          | 'Nightshroud'
          | 'Normal'
          | 'Odion'
          | 'Paradox Broth'
          | 'Pegasus'
          | 'Plant'
          | 'Psychic'
          | 'Pyro'
          | 'Quick-Play'
          | 'Reptile'
          | 'Rex'
          | 'Ritual'
          | 'Rock'
          | 'Sea Serpent'
          | 'Seto Kaiba'
          | 'Spellcaster'
          | 'Syrus Truesda'
          | 'Tania'
          | 'Tea Gardner'
          | 'The Supreme K'
          | 'Thelonious Vi'
          | 'Thunder'
          | 'Titan'
          | 'Tyranno Hassl'
          | 'Warrior'
          | 'Weevil'
          | 'Winged Beast'
          | 'Wyrm'
          | 'Yami Bakura'
          | 'Yami Marik'
          | 'Yami Yugi'
          | 'Yubel'
          | 'Yugi'
          | 'Zane Truesdal'
          | 'Zombie'
        >;
      }

      export interface LinkMarkers {
        op: 'and' | 'or';
        values: Array<
          'Top-Left' | 'Top' | 'Top-Right' | 'Left' | 'Right' | 'Bottom-Left' | 'Bottom' | 'Bottom-Right'
        >;
      }

      export interface Languages {
        op: 'and' | 'or';
        values: Array<
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
          | 'sa'
        >;
      }

      export interface Atk {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface Def {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface Level {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface Rank {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface Scale {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface LinkRating {
        op: '=' | '>' | '<';
        value: number;
      }
    }
  }

  export interface Rise {
    game: 'rise';
    /**
     * @default {}
     */
    filters?: Rise.Filters;
  }

  export namespace Rise {
    export interface Filters {
      name?: Filters.Name;
      rarity?: Filters.Rarity;
      variant?: Filters.Variant;
      finish?: Filters.Finish;
      finishes?: Filters.Finishes;
      languages?: Filters.Languages;
      types?: Filters.Types;
      rank?: Filters.Rank;
      plane?: Filters.Plane;
      subtypes?: Filters.Subtypes;
      abilities?: Filters.Abilities;
      attack?: Filters.Attack | Filters.Attack2;
      defense?: Filters.Defense | Filters.Defense2;
      life?: Filters.Life | Filters.Life2;
      maxLevel?: Filters.MaxLevel | Filters.MaxLevel2;
    }

    export namespace Filters {
      export interface Name {
        value: string;
      }

      export interface Rarity {
        op: 'and' | 'or';
        values: Array<'Common' | 'Uncommon' | 'Rare' | 'Legendary'>;
      }

      export interface Variant {
        op: 'and' | 'or';
        values: Array<
          | 'Standard'
          | 'Black Border'
          | 'Box Topper'
          | 'Collector'
          | 'Collector Gold'
          | 'Collector Pink'
          | 'Collector Silver'
          | 'Collector Serialized'
          | 'Full Art'
          | 'Gamma'
          | 'GoldenTicket'
          | 'Oil Card'
          | 'POSCA Hand Drawn Card'
          | 'Poker Card'
          | 'Sketch stamp'
          | 'Test Lenticular Card'
        >;
      }

      export interface Finish {
        op: 'and' | 'or';
        values: Array<
          | 'Standard'
          | 'Foil'
          | 'Blast Foil Rainbow'
          | 'Bubbles Foil'
          | 'Cracked Ice Foil'
          | 'Galaxy Foil'
          | 'Glitter Foil'
          | 'Gold Foil'
          | 'Multi Sideline Foil'
          | 'Rainbow Solid Texture Stamp'
          | 'Star Foil'
          | 'Surge Foil'
          | 'Full Art Gold Sign'
          | 'Depth Lenticular'
          | 'Flip Lenticular'
          | 'Lenticular'
        >;
      }

      export interface Finishes {
        op: 'and' | 'or';
        values: Array<
          | 'Standard'
          | 'Foil'
          | 'Blast Foil Rainbow'
          | 'Bubbles Foil'
          | 'Cracked Ice Foil'
          | 'Galaxy Foil'
          | 'Glitter Foil'
          | 'Gold Foil'
          | 'Multi Sideline Foil'
          | 'Rainbow Solid Texture Stamp'
          | 'Star Foil'
          | 'Surge Foil'
          | 'Full Art Gold Sign'
          | 'Depth Lenticular'
          | 'Flip Lenticular'
          | 'Lenticular'
        >;
      }

      export interface Languages {
        op: 'and' | 'or';
        values: Array<
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
          | 'sa'
        >;
      }

      export interface Types {
        op: 'and' | 'or';
        values: Array<'Creature' | 'Incantation' | 'Imminent' | 'Summoner' | 'Door' | 'Level Up' | 'Dungeon'>;
      }

      export interface Rank {
        op: 'and' | 'or';
        values: Array<'None' | 'Rank 1' | 'Rank 2' | 'Rank 3' | 'Rank 4' | 'Rank Infinite'>;
      }

      export interface Plane {
        op: 'and' | 'or';
        values: Array<'Ground' | 'Aerial'>;
      }

      export interface Subtypes {
        op: 'and' | 'or';
        values: Array<
          | 'Angel'
          | 'Assassin'
          | 'Demon'
          | 'Dragon'
          | 'Fairy'
          | 'Spirit'
          | 'Zombie'
          | 'Skeleton'
          | 'Cat'
          | 'Bat'
          | 'Chief'
          | 'Dog'
          | 'Dwarf'
          | 'Golem'
          | 'Knight'
          | 'Lich'
          | 'Clone'
          | 'Divinity'
          | 'Monster'
          | 'Food'
          | 'Octopus'
          | 'Slime'
          | 'Spider'
          | 'Undead'
          | 'Vampyr'
          | 'Witch'
          | 'Worm'
          | 'Insect'
          | 'Keyper'
          | 'Plant'
          | 'Unicorn'
          | 'Robot'
          | '???'
        >;
      }

      export interface Abilities {
        op: 'and' | 'or';
        values: Array<
          | 'Flying'
          | 'Reach'
          | 'Pierce'
          | 'Fightback'
          | 'Immunity'
          | 'Persistence'
          | 'Wall-pass'
          | 'Reanimate'
          | 'Root'
          | 'Horde'
          | 'Symbiosis'
          | 'Morpher'
          | 'Together'
          | 'Equipment'
          | 'Disease'
          | 'Candy'
          | 'Fixed Price'
          | 'Multi-target'
          | 'Range'
          | 'Water'
          | 'Fire'
          | 'Electric'
          | 'Ice'
          | 'Poison'
          | 'Assimilation'
          | 'Explosion'
          | 'Advantage'
          | 'Cloning'
          | 'Iron Skin'
          | 'Drain'
          | 'Dodge'
          | 'Possession'
          | 'Bleeding'
          | 'Haste'
          | 'Riposte'
          | 'Set'
          | 'Amok'
          | 'Diversion'
          | 'Exhumation'
          | 'Chained'
          | 'Bomb'
          | 'Adept'
          | 'Parasite'
          | 'Allergy'
          | 'Imitator'
          | 'Lock'
          | 'Madness'
          | 'Paranoia'
          | 'Paralysis'
          | 'Schizophrenia'
          | 'Cooling'
          | 'Cold'
          | 'Constancy'
          | 'Copycat'
          | 'Distance'
          | 'Earth'
          | 'Fixed Time'
          | 'Food'
          | 'Shadow'
          | 'Splash'
          | 'Trauma'
          | 'Velocity'
          | 'Web'
        >;
      }

      export interface Attack {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface Attack2 {
        min: number;
        max: number;
      }

      export interface Defense {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface Defense2 {
        min: number;
        max: number;
      }

      export interface Life {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface Life2 {
        min: number;
        max: number;
      }

      export interface MaxLevel {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface MaxLevel2 {
        min: number;
        max: number;
      }
    }
  }

  export interface Riftbound {
    game: 'riftbound';
    /**
     * @default {}
     */
    filters?: Riftbound.Filters;
  }

  export namespace Riftbound {
    export interface Filters {
      name?: Filters.Name;
      rarity?: Filters.Rarity;
      finish?: Filters.Finish;
      finishes?: Filters.Finishes;
      languages?: Filters.Languages;
      cardType?: Filters.CardType;
      superType?: Filters.SuperType;
      domains?: Filters.Domains;
      cardTags?: Filters.CardTags;
      energyCost?: Filters.EnergyCost | Filters.EnergyCost2;
      mightCost?: Filters.MightCost | Filters.MightCost2;
    }

    export namespace Filters {
      export interface Name {
        value: string;
      }

      export interface Rarity {
        op: 'and' | 'or';
        values: Array<'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Showcase'>;
      }

      export interface Finish {
        op: 'and' | 'or';
        values: Array<'Standard' | 'Foil'>;
      }

      export interface Finishes {
        op: 'and' | 'or';
        values: Array<'Standard' | 'Foil'>;
      }

      export interface Languages {
        op: 'and' | 'or';
        values: Array<
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
          | 'sa'
        >;
      }

      export interface CardType {
        op: 'and' | 'or';
        values: Array<'Unit' | 'Spell' | 'Gear' | 'Rune' | 'Battlefield' | 'Legend' | 'Card'>;
      }

      export interface SuperType {
        op: 'and' | 'or';
        values: Array<'Basic' | 'Champion' | 'Signature' | 'Token' | 'Unit'>;
      }

      export interface Domains {
        op: 'and' | 'or';
        values: Array<'Fury' | 'Calm' | 'Chaos' | 'Mind' | 'Body' | 'Order' | 'Neutral'>;
      }

      export interface CardTags {
        op: 'and' | 'or';
        values: Array<
          | 'Ahri'
          | 'Akali'
          | 'Akshan'
          | 'Ambessa'
          | 'Anivia'
          | 'Annie'
          | 'Aphelios'
          | 'Azir'
          | 'Bard'
          | 'Blitzcrank'
          | 'Caitlyn'
          | 'Darius'
          | 'Diana'
          | 'Dr. Mundo'
          | 'Draven'
          | 'Ekko'
          | 'Ezreal'
          | 'Fiora'
          | 'Fizz'
          | 'Gangplank'
          | 'Garen'
          | 'Heimerdinger'
          | 'Illaoi'
          | 'Irelia'
          | 'Janna'
          | 'Jax'
          | 'Jayce'
          | 'Jinx'
          | "Kai'Sa"
          | 'Karma'
          | 'Karthus'
          | 'Kayle'
          | 'Kayn'
          | 'Kennen'
          | "Kha'Zix"
          | "Kog'Maw"
          | 'Lee Sin'
          | 'Leona'
          | 'Lucian'
          | 'Lux'
          | 'Malzahar'
          | 'Master Yi'
          | 'Mel'
          | 'Miss Fortune'
          | 'Morgana'
          | 'Nasus'
          | 'Nocturne'
          | 'Ornn'
          | 'Qiyana'
          | "Rek'Sai"
          | 'Renata Glasc'
          | 'Renekton'
          | 'Rengar'
          | 'Riven'
          | 'Rumble'
          | 'Sett'
          | 'Shen'
          | 'Sivir'
          | 'Sona'
          | 'Soraka'
          | 'Swain'
          | 'Taric'
          | 'Teemo'
          | 'Tryndamere'
          | 'Twisted Fate'
          | 'Udyr'
          | 'Vayne'
          | 'Vex'
          | 'Vi'
          | 'Viktor'
          | 'Volibear'
          | 'Warwick'
          | 'Xin Zhao'
          | 'Yasuo'
          | 'Yone'
          | 'Zed'
          | 'Bandle City'
          | 'Bilgewater'
          | 'Demacia'
          | 'Freljord'
          | 'Icathia'
          | 'Ionia'
          | 'Ixtal'
          | 'Mount Targon'
          | 'Noxus'
          | 'Piltover'
          | 'Shadow Isles'
          | 'Shurima'
          | 'The Void'
          | 'Zaun'
          | 'Bird'
          | 'Cat'
          | 'Demon'
          | 'Dog'
          | 'Dragon'
          | 'Elite'
          | 'Equipment'
          | 'Fae'
          | 'Mech'
          | 'Mystic'
          | 'Ninja'
          | 'Pirate'
          | 'Poro'
          | 'Recruit'
          | 'Sentinel'
          | 'Soldier'
          | 'Spider'
          | 'Spirit'
          | 'Trifarian'
          | 'Vastaya'
          | 'Warrior'
          | 'Wizard'
          | 'Yordle'
        >;
      }

      export interface EnergyCost {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface EnergyCost2 {
        min: number;
        max: number;
      }

      export interface MightCost {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface MightCost2 {
        min: number;
        max: number;
      }
    }
  }

  export interface Drakerion {
    game: 'drakerion';
    /**
     * @default {}
     */
    filters?: Drakerion.Filters;
  }

  export namespace Drakerion {
    export interface Filters {
      name?: Filters.Name;
      rarity?: Filters.Rarity;
      finish?: Filters.Finish;
      finishes?: Filters.Finishes;
      languages?: Filters.Languages;
      type?: Filters.Type;
      kingdom?: Filters.Kingdom;
      cost?: Filters.Cost | Filters.Cost2;
      attack?: Filters.Attack | Filters.Attack2;
      riposte?: Filters.Riposte | Filters.Riposte2;
      health?: Filters.Health | Filters.Health2;
      rangedAttack?: Filters.RangedAttack | Filters.RangedAttack2;
      prestige?: Filters.Prestige | Filters.Prestige2;
      nbTactic?: Filters.NbTactic | Filters.NbTactic2;
      nbSupply?: Filters.NbSupply | Filters.NbSupply2;
      goldGain?: Filters.GoldGain | Filters.GoldGain2;
      drawCount?: Filters.DrawCount | Filters.DrawCount2;
    }

    export namespace Filters {
      export interface Name {
        value: string;
      }

      export interface Rarity {
        op: 'and' | 'or';
        values: Array<'Common' | 'Rare' | 'Starter' | 'Unique' | 'Promo'>;
      }

      export interface Finish {
        op: 'and' | 'or';
        values: Array<'Standard' | 'Foil' | 'Gold' | 'Zarimoth'>;
      }

      export interface Finishes {
        op: 'and' | 'or';
        values: Array<'Standard' | 'Foil' | 'Gold' | 'Zarimoth'>;
      }

      export interface Languages {
        op: 'and' | 'or';
        values: Array<
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
          | 'sa'
        >;
      }

      export interface Type {
        op: 'and' | 'or';
        values: Array<'Character' | 'Attachment' | 'Event' | 'City' | 'Banner' | 'Maneuver'>;
      }

      export interface Kingdom {
        op: 'and' | 'or';
        values: Array<'Lokmar' | 'Gil Estel' | 'Wasteland' | 'Tyraslin' | 'Kartej' | 'Neutral'>;
      }

      export interface Cost {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface Cost2 {
        min: number;
        max: number;
      }

      export interface Attack {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface Attack2 {
        min: number;
        max: number;
      }

      export interface Riposte {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface Riposte2 {
        min: number;
        max: number;
      }

      export interface Health {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface Health2 {
        min: number;
        max: number;
      }

      export interface RangedAttack {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface RangedAttack2 {
        min: number;
        max: number;
      }

      export interface Prestige {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface Prestige2 {
        min: number;
        max: number;
      }

      export interface NbTactic {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface NbTactic2 {
        min: number;
        max: number;
      }

      export interface NbSupply {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface NbSupply2 {
        min: number;
        max: number;
      }

      export interface GoldGain {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface GoldGain2 {
        min: number;
        max: number;
      }

      export interface DrawCount {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface DrawCount2 {
        min: number;
        max: number;
      }
    }
  }

  export interface Cyberpunk {
    game: 'cyberpunk';
    /**
     * @default {}
     */
    filters?: Cyberpunk.Filters;
  }

  export namespace Cyberpunk {
    export interface Filters {
      name?: Filters.Name;
      rarity?: Filters.Rarity;
      finish?: Filters.Finish;
      finishes?: Filters.Finishes;
      languages?: Filters.Languages;
      color?: Filters.Color;
      cardType?: Filters.CardType;
      classification?: Filters.Classification;
      keywords?: Filters.Keywords;
      cost?: Filters.Cost | Filters.Cost2;
      power?: Filters.Power | Filters.Power2;
      ram?: Filters.RAM | Filters.RAM2;
    }

    export namespace Filters {
      export interface Name {
        value: string;
      }

      export interface Rarity {
        op: 'and' | 'or';
        values: Array<'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Secret' | 'Iconic' | 'Nova'>;
      }

      export interface Finish {
        op: 'and' | 'or';
        values: Array<'Standard' | 'Foil'>;
      }

      export interface Finishes {
        op: 'and' | 'or';
        values: Array<'Standard' | 'Foil'>;
      }

      export interface Languages {
        op: 'and' | 'or';
        values: Array<
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
          | 'sa'
        >;
      }

      export interface Color {
        op: 'and' | 'or';
        values: Array<'Red' | 'Blue' | 'Green' | 'Yellow'>;
      }

      export interface CardType {
        op: 'and' | 'or';
        values: Array<'Legend' | 'Unit' | 'Gear' | 'Program'>;
      }

      export interface Classification {
        op: 'and' | 'or';
        values: Array<
          | 'Arasaka'
          | 'Corpo'
          | 'Merc'
          | 'Doll'
          | 'Netrunner'
          | 'Ripperdoc'
          | 'Vehicle'
          | 'Drone'
          | 'Militech'
          | 'Zetatech'
          | 'Cyberware'
          | 'Weapon'
          | 'Plan'
          | 'Implant'
          | 'Tech'
          | 'Overclocking'
          | '6th Street'
          | 'Aldecado'
          | 'Animal'
          | 'Braindance'
          | 'Extreme'
          | 'Fixer'
          | 'Ganger'
          | 'Maelstrom'
          | "Maine's Crew"
          | 'Medtech'
          | 'Mox'
          | 'Mystic'
          | 'NCPD'
          | 'Nomad'
          | 'Quickhack'
          | 'Raffen Shiv'
          | 'Rocker'
          | 'Samurai'
          | 'Scavenger'
          | 'Techie'
          | 'Trauma Team'
          | 'Tyger Claws'
          | 'Valentino'
          | 'Voodoo Boys'
        >;
      }

      export interface Keywords {
        op: 'and' | 'or';
        values: Array<'Go Solo' | 'Blocker' | 'Play' | 'Attack' | 'Flip'>;
      }

      export interface Cost {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface Cost2 {
        min: number;
        max: number;
      }

      export interface Power {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface Power2 {
        min: number;
        max: number;
      }

      export interface RAM {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface RAM2 {
        min: number;
        max: number;
      }
    }
  }

  export interface PokMonJapan {
    game: 'pokemon-japan';
    /**
     * @default {}
     */
    filters?: PokMonJapan.Filters;
  }

  export namespace PokMonJapan {
    export interface Filters {
      cardType?: Filters.CardType;
      name?: Filters.Name;
      rarity?: Filters.Rarity;
      finish?: Filters.Finish;
      finishes?: Filters.Finishes;
      variant?: Filters.Variant;
      pokemonTypes?: Filters.PokemonTypes;
      hp?: Filters.Hp;
      stage?: Filters.Stage;
      retreatCost?: Filters.RetreatCost;
    }

    export namespace Filters {
      export interface CardType {
        op: 'and' | 'or';
        values: Array<'Pokemon' | 'Trainer' | 'Energy'>;
      }

      export interface Name {
        value: string;
      }

      export interface Rarity {
        op: 'and' | 'or';
        values: Array<
          | 'ACE_RARE'
          | 'AMAZING_RARE'
          | 'ART_RARE'
          | 'BLACK_WHITE_RARE'
          | 'CHARACTER_RARE'
          | 'CHARACTER_SUPER_RARE'
          | 'COMMON'
          | 'COMMON_HOLO'
          | 'DOUBLE_RARE'
          | 'HOLO_RARE'
          | 'HOLOFOIL'
          | 'HYPER_RARE'
          | 'KAGAYAKU'
          | 'MEGA_ATTACK_RARE'
          | 'MEGA_ULTRA_RARE'
          | 'NONE'
          | 'NORMAL'
          | 'PRISM_RARE'
          | 'PROMO'
          | 'RARE'
          | 'RARE_HOLO_LEGEND'
          | 'RARE_HOLO_LV_X'
          | 'SHINING'
          | 'SHINY_RARE'
          | 'SHINY_SECRET_RARE'
          | 'SPECIAL_ART_RARE'
          | 'SUPER_RARE'
          | 'SUPER_RARE_HOLO'
          | 'TRAINER_RARE'
          | 'TRIPLE_RARE'
          | 'ULTRA_RARE'
          | 'ULTRA_RARE_COMMON'
          | 'ULTRA_RARE_UNCOMMON'
          | 'UNCOMMON'
        >;
      }

      export interface Finish {
        op: 'and' | 'or';
        values: Array<'Standard' | 'Foil'>;
      }

      export interface Finishes {
        op: 'and' | 'or';
        values: Array<'Standard' | 'Foil'>;
      }

      export interface Variant {
        op: 'and' | 'or';
        values: Array<'1st Edition' | 'Unlimited'>;
      }

      export interface PokemonTypes {
        op: 'and' | 'or';
        values: Array<
          | 'Colorless'
          | 'Darkness'
          | 'Dragon'
          | 'Fairy'
          | 'Fighting'
          | 'Fire'
          | 'Grass'
          | 'Lightning'
          | 'Metal'
          | 'Psychic'
          | 'Water'
        >;
      }

      export interface Hp {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface Stage {
        op: 'and' | 'or';
        values: Array<
          | 'Baby'
          | 'Basic'
          | 'BREAK'
          | 'Fossil'
          | 'Legend'
          | 'LV_X'
          | 'MegaEX'
          | 'PrimalEX'
          | 'Restored'
          | 'Stage1'
          | 'Stage2'
          | 'V-UNION'
          | 'VMAX'
          | 'VMAXG'
          | 'VSTAR'
        >;
      }

      export interface RetreatCost {
        op: '=' | '>' | '<';
        value: number;
      }
    }
  }

  export interface StarWarsUnlimited {
    game: 'swu';
    /**
     * @default {}
     */
    filters?: StarWarsUnlimited.Filters;
  }

  export namespace StarWarsUnlimited {
    export interface Filters {
      name?: Filters.Name;
      rarity?: Filters.Rarity;
      finish?: Filters.Finish;
      finishes?: Filters.Finishes;
      languages?: Filters.Languages;
      cardType?: Filters.CardType;
      variant?: Filters.Variant;
      aspects?: Filters.Aspects;
      arenaType?: Filters.ArenaType;
      cost?: Filters.Cost | Filters.Cost2;
      power?: Filters.Power | Filters.Power2;
      hp?: Filters.Hp | Filters.Hp2;
    }

    export namespace Filters {
      export interface Name {
        value: string;
      }

      export interface Rarity {
        op: 'and' | 'or';
        values: Array<'Common' | 'Uncommon' | 'Rare' | 'Legendary' | 'Special'>;
      }

      export interface Finish {
        op: 'and' | 'or';
        values: Array<'Standard' | 'Foil' | 'Serialized' | 'Serialized Rose Gold' | 'Serialized Gold'>;
      }

      export interface Finishes {
        op: 'and' | 'or';
        values: Array<'Standard' | 'Foil' | 'Serialized' | 'Serialized Rose Gold' | 'Serialized Gold'>;
      }

      export interface Languages {
        op: 'and' | 'or';
        values: Array<
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
          | 'sa'
        >;
      }

      export interface CardType {
        op: 'and' | 'or';
        values: Array<
          | 'Base'
          | 'Credit Token'
          | 'Event'
          | 'Force Token'
          | 'Leader'
          | 'Leader Unit'
          | 'Token'
          | 'Token Unit'
          | 'Token Upgrade'
          | 'Unit'
          | 'Upgrade'
        >;
      }

      export interface Variant {
        op: 'and' | 'or';
        values: Array<'Standard' | 'Hyperspace' | 'Showcase' | 'Prestige'>;
      }

      export interface Aspects {
        op: 'and' | 'or';
        values: Array<'Aggression' | 'Command' | 'Cunning' | 'Heroism' | 'Vigilance' | 'Villainy'>;
      }

      export interface ArenaType {
        op: 'and' | 'or';
        values: Array<'Ground' | 'Space'>;
      }

      export interface Cost {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface Cost2 {
        min: number;
        max: number;
      }

      export interface Power {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface Power2 {
        min: number;
        max: number;
      }

      export interface Hp {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface Hp2 {
        min: number;
        max: number;
      }
    }
  }

  export interface ExampleGame {
    game: 'example-game';
    /**
     * @default {}
     */
    filters?: ExampleGame.Filters;
  }

  export namespace ExampleGame {
    export interface Filters {
      name?: Filters.Name;
      rarity?: Filters.Rarity;
      color?: Filters.Color;
      finish?: Filters.Finish;
      finishes?: Filters.Finishes;
      cost?: Filters.Cost;
      power?: Filters.Power;
      toughness?: Filters.Toughness;
    }

    export namespace Filters {
      export interface Name {
        value: string;
      }

      export interface Rarity {
        op: 'and' | 'or';
        values: Array<'common' | 'uncommon' | 'rare' | 'legendary'>;
      }

      export interface Color {
        op: 'and' | 'or';
        values: Array<'red' | 'blue' | 'green' | 'yellow' | 'purple'>;
      }

      export interface Finish {
        op: 'and' | 'or';
        values: Array<'standard' | 'foil'>;
      }

      export interface Finishes {
        op: 'and' | 'or';
        values: Array<'standard' | 'foil'>;
      }

      export interface Cost {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface Power {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface Toughness {
        op: '=' | '>' | '<';
        value: number;
      }
    }
  }

  export interface NarutoMythos {
    game: 'naruto-mythos';
    /**
     * @default {}
     */
    filters?: NarutoMythos.Filters;
  }

  export namespace NarutoMythos {
    export interface Filters {
      name?: Filters.Name;
      rarity?: Filters.Rarity;
      finish?: Filters.Finish;
      finishes?: Filters.Finishes;
      variant?: Filters.Variant;
      cardType?: Filters.CardType;
      group?: Filters.Group;
      keywords?: Filters.Keywords;
      chakra?: Filters.Chakra | Filters.Chakra2;
      power?: Filters.Power | Filters.Power2;
      points?: Filters.Points | Filters.Points2;
    }

    export namespace Filters {
      export interface Name {
        value: string;
      }

      export interface Rarity {
        op: 'and' | 'or';
        values: Array<
          | 'Common'
          | 'Uncommon'
          | 'Rare'
          | 'Rare Art'
          | 'Secret'
          | 'Secret Variant'
          | 'Mythos'
          | 'Mythos Variant'
          | 'Legendary'
          | 'Chibi'
          | 'POP'
          | 'Shinobi'
          | 'Special'
        >;
      }

      export interface Finish {
        op: 'and' | 'or';
        values: Array<'Standard' | 'Foil' | 'Holographic' | 'Gold Foil' | 'Embossed'>;
      }

      export interface Finishes {
        op: 'and' | 'or';
        values: Array<'Standard' | 'Foil' | 'Holographic' | 'Gold Foil' | 'Embossed'>;
      }

      export interface Variant {
        op: 'and' | 'or';
        values: Array<'Full Art' | 'Alternate Art'>;
      }

      export interface CardType {
        op: 'and' | 'or';
        values: Array<'Character' | 'Attachment' | 'Mission'>;
      }

      export interface Group {
        op: 'and' | 'or';
        values: Array<'Leaf Village' | 'Akatsuki' | 'Independent' | 'Sand Village' | 'Sound Village'>;
      }

      export interface Keywords {
        op: 'and' | 'or';
        values: Array<
          | 'Academy'
          | 'Academy Student'
          | 'Armor'
          | 'Bomb'
          | 'Book'
          | 'Civilian'
          | 'Demon Brother'
          | 'Food'
          | 'Head of Clan'
          | 'Hokage'
          | 'Jutsu'
          | 'Kekkei Genkai'
          | 'Lair'
          | 'Landmark'
          | 'Location'
          | 'Medical Ninja'
          | 'Ninja Hound'
          | 'Ninja Pig'
          | 'Puppet'
          | 'Reanimation'
          | 'Rogue Ninja'
          | 'Sannin'
          | 'Scroll'
          | 'Situation'
          | 'Sound Four'
          | 'Sound Ninja'
          | 'Special Jonin'
          | 'Summon'
          | 'Taijutsu'
          | 'Tailed Beast'
          | 'Team 10'
          | 'Team 7'
          | 'Team 8'
          | 'Team Baki'
          | 'Team Dosu'
          | 'Team Guy'
          | 'Tool'
          | 'Village'
          | 'Village of Artisans'
          | 'Weapon'
        >;
      }

      export interface Chakra {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface Chakra2 {
        min: number;
        max: number;
      }

      export interface Power {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface Power2 {
        min: number;
        max: number;
      }

      export interface Points {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface Points2 {
        min: number;
        max: number;
      }
    }
  }

  export interface GrandArchive {
    game: 'grand-archive';
    /**
     * @default {}
     */
    filters?: GrandArchive.Filters;
  }

  export namespace GrandArchive {
    export interface Filters {
      name?: Filters.Name;
      rarity?: Filters.Rarity;
      finish?: Filters.Finish;
      finishes?: Filters.Finishes;
      variant?: Filters.Variant;
      languages?: Filters.Languages;
      element?: Filters.Element;
      cardType?: Filters.CardType;
      cardClass?: Filters.CardClass;
      costType?: Filters.CostType;
      costValue?: Filters.CostValue | Filters.CostValue2;
      power?: Filters.Power | Filters.Power2;
      life?: Filters.Life | Filters.Life2;
      durability?: Filters.Durability | Filters.Durability2;
      level?: Filters.Level | Filters.Level2;
      speed?: Filters.Speed;
    }

    export namespace Filters {
      export interface Name {
        value: string;
      }

      export interface Rarity {
        op: 'and' | 'or';
        values: Array<
          | 'Common'
          | 'Uncommon'
          | 'Rare'
          | 'Super Rare'
          | 'Ultra Rare'
          | 'Promotional Rare'
          | 'Collector Super Rare'
          | 'Collector Ultra Rare'
          | 'Collector Promo Rare'
        >;
      }

      export interface Finish {
        op: 'and' | 'or';
        values: Array<'Standard' | 'Foil'>;
      }

      export interface Finishes {
        op: 'and' | 'or';
        values: Array<'Standard' | 'Foil'>;
      }

      export interface Variant {
        op: 'and' | 'or';
        values: Array<'Curio Foil' | 'Quicksilver Foil'>;
      }

      export interface Languages {
        op: 'and' | 'or';
        values: Array<
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
          | 'sa'
        >;
      }

      export interface Element {
        op: 'and' | 'or';
        values: Array<
          | 'Arcane'
          | 'Astra'
          | 'Crux'
          | 'Exalted'
          | 'Exia'
          | 'Fire'
          | 'Luxem'
          | 'Neos'
          | 'Norm'
          | 'Tera'
          | 'Umbra'
          | 'Water'
          | 'Wind'
        >;
      }

      export interface CardType {
        op: 'and' | 'or';
        values: Array<
          | 'Action'
          | 'Ally'
          | 'Attack'
          | 'Champion'
          | 'Domain'
          | 'Greater Boon'
          | 'Item'
          | 'Lesser Boon'
          | 'Mastery'
          | 'Phantasia'
          | 'Regalia'
          | 'Status'
          | 'Token'
          | 'Unique'
          | 'Weapon'
        >;
      }

      export interface CardClass {
        op: 'and' | 'or';
        values: Array<
          'Anomaly' | 'Assassin' | 'Cleric' | 'Guardian' | 'Mage' | 'Ranger' | 'Spirit' | 'Tamer' | 'Warrior'
        >;
      }

      export interface CostType {
        op: 'and' | 'or';
        values: Array<'Memory' | 'Reserve' | 'None'>;
      }

      export interface CostValue {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface CostValue2 {
        min: number;
        max: number;
      }

      export interface Power {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface Power2 {
        min: number;
        max: number;
      }

      export interface Life {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface Life2 {
        min: number;
        max: number;
      }

      export interface Durability {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface Durability2 {
        min: number;
        max: number;
      }

      export interface Level {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface Level2 {
        min: number;
        max: number;
      }

      export interface Speed {
        op: 'and' | 'or';
        values: Array<'Fast' | 'Slow'>;
      }
    }
  }

  export interface EchoesOfAstra {
    game: 'eoa';
    /**
     * @default {}
     */
    filters?: EchoesOfAstra.Filters;
  }

  export namespace EchoesOfAstra {
    export interface Filters {
      name?: Filters.Name;
      rarity?: Filters.Rarity;
      finish?: Filters.Finish;
      finishes?: Filters.Finishes;
      languages?: Filters.Languages;
      affinity?: Filters.Affinity;
      cardType?: Filters.CardType;
      subtypes?: Filters.Subtypes;
      variant?: Filters.Variant;
      supplyCost?: Filters.SupplyCost | Filters.SupplyCost2;
      influence?: Filters.Influence | Filters.Influence2;
      attack?: Filters.Attack | Filters.Attack2;
      health?: Filters.Health | Filters.Health2;
    }

    export namespace Filters {
      export interface Name {
        value: string;
      }

      export interface Rarity {
        op: 'and' | 'or';
        values: Array<'Common' | 'Uncommon' | 'Rare' | 'Legendary'>;
      }

      export interface Finish {
        op: 'and' | 'or';
        values: Array<'Standard' | 'Foil'>;
      }

      export interface Finishes {
        op: 'and' | 'or';
        values: Array<'Standard' | 'Foil'>;
      }

      export interface Languages {
        op: 'and' | 'or';
        values: Array<
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
          | 'sa'
        >;
      }

      export interface Affinity {
        op: 'and' | 'or';
        values: Array<'Solara' | 'Lux' | 'Terra' | 'Caelum' | 'Nox' | 'Neutral'>;
      }

      export interface CardType {
        op: 'and' | 'or';
        values: Array<'Unit' | 'Tactic' | 'Territory' | 'Item'>;
      }

      export interface Subtypes {
        op: 'and' | 'or';
        values: Array<
          | 'Renowned'
          | 'Human'
          | 'Equipment'
          | 'Vampire'
          | 'Counter'
          | 'Sylvan'
          | 'Fenrir'
          | 'Vehicle'
          | 'Beast'
          | 'Demon'
          | 'Dragon'
          | 'Dragonkin'
          | 'Leporin'
          | 'Kitsune'
          | 'Automaton'
          | 'Undead'
          | 'Avian'
          | 'Nekora'
          | 'Angel'
          | 'Drone'
          | 'Primal'
          | 'Monster'
          | 'Plant'
          | 'Territory'
        >;
      }

      export interface Variant {
        op: 'and' | 'or';
        values: Array<'Normal' | 'Serialized' | 'Framebreak' | 'Signature'>;
      }

      export interface SupplyCost {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface SupplyCost2 {
        min: number;
        max: number;
      }

      export interface Influence {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface Influence2 {
        min: number;
        max: number;
      }

      export interface Attack {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface Attack2 {
        min: number;
        max: number;
      }

      export interface Health {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface Health2 {
        min: number;
        max: number;
      }
    }
  }

  export interface DragonBallSuperFusionWorld {
    game: 'dbs-fusion';
    /**
     * @default {}
     */
    filters?: DragonBallSuperFusionWorld.Filters;
  }

  export namespace DragonBallSuperFusionWorld {
    export interface Filters {
      name?: Filters.Name;
      finish?: Filters.Finish;
      finishes?: Filters.Finishes;
      rarity?: Filters.Rarity;
      color?: Filters.Color;
      type?: Filters.Type;
      power?: Filters.Power | Filters.Power2;
      comboPower?: Filters.ComboPower | Filters.ComboPower2;
      energyCost?: Filters.EnergyCost | Filters.EnergyCost2;
    }

    export namespace Filters {
      export interface Name {
        value: string;
      }

      export interface Finish {
        op: 'and' | 'or';
        values: Array<'Standard' | 'Holofoil'>;
      }

      export interface Finishes {
        op: 'and' | 'or';
        values: Array<'Standard' | 'Holofoil'>;
      }

      export interface Rarity {
        op: 'and' | 'or';
        values: Array<
          'leader' | 'common' | 'uncommon' | 'rare' | 'super_rare' | 'secret_rare' | 'promo' | 'none'
        >;
      }

      export interface Color {
        op: 'and' | 'or';
        values: Array<'Red' | 'Blue' | 'Green' | 'Yellow' | 'Black'>;
      }

      export interface Type {
        op: 'and' | 'or';
        values: Array<'Leader' | 'Battle' | 'Extra' | 'Energy Marker' | 'Code Card'>;
      }

      export interface Power {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface Power2 {
        min: number;
        max: number;
      }

      export interface ComboPower {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface ComboPower2 {
        min: number;
        max: number;
      }

      export interface EnergyCost {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface EnergyCost2 {
        min: number;
        max: number;
      }
    }
  }

  export interface DragonBallSuperMasters {
    game: 'dbs-masters';
    /**
     * @default {}
     */
    filters?: DragonBallSuperMasters.Filters;
  }

  export namespace DragonBallSuperMasters {
    export interface Filters {
      name?: Filters.Name;
      finish?: Filters.Finish;
      finishes?: Filters.Finishes;
      rarity?: Filters.Rarity;
      color?: Filters.Color;
      type?: Filters.Type;
      era?: Filters.Era;
      power?: Filters.Power | Filters.Power2;
      comboPower?: Filters.ComboPower | Filters.ComboPower2;
    }

    export namespace Filters {
      export interface Name {
        value: string;
      }

      export interface Finish {
        op: 'and' | 'or';
        values: Array<'Standard' | 'Foil'>;
      }

      export interface Finishes {
        op: 'and' | 'or';
        values: Array<'Standard' | 'Foil'>;
      }

      export interface Rarity {
        op: 'and' | 'or';
        values: Array<
          | 'common'
          | 'uncommon'
          | 'rare'
          | 'super_rare'
          | 'special_rare'
          | 'special_leader_rare'
          | 'concept_rare'
          | 'god_rare'
          | 'secret_rare'
          | 'starter_rare'
          | 'campaign_rare'
          | 'expansion_rare'
          | 'promo'
          | 'giant_force_rare'
          | 'dragon_ball_rare'
          | 'duo_power_rare'
          | 'iconic_attack_rare'
          | 'destroyer_and_angel_rare'
          | 'infinite_saiyan_rare'
          | 'son_gohan_rare'
          | 'reboot_leader_rare'
          | 'noble_hero_rare'
          | 'ignoble_villain_rare'
          | 'destruction_rare'
          | 'special_rare_signature'
          | 'feature_rare'
          | 'token'
          | 'merit'
          | 'none'
        >;
      }

      export interface Color {
        op: 'and' | 'or';
        values: Array<'Red' | 'Blue' | 'Green' | 'Yellow' | 'Black' | 'White'>;
      }

      export interface Type {
        op: 'and' | 'or';
        values: Array<
          | 'Leader'
          | 'Battle'
          | 'Extra'
          | 'Z-Battle'
          | 'Z-Unison'
          | 'Z-Extra'
          | 'Z-Leader'
          | 'Unison'
          | 'Token'
          | 'Energy Marker'
        >;
      }

      export interface Era {
        op: 'and' | 'or';
        values: Array<
          | 'young_son_goku_saga'
          | 'pilaf_saga'
          | 'fortuneteller_baba_saga'
          | 'king_piccolo_saga'
          | 'saiyan_saga'
          | 'frieza_saga'
          | 'garlic_jr_saga'
          | 'android_13_saga'
          | 'android_cell_saga'
          | 'world_martial_arts_tournament_saga'
          | 'majin_buu_saga'
          | 'evil_wizard_babidi_saga'
          | 'battle_of_gods_saga'
          | 'resurrection_f_saga'
          | 'universe_survival_saga'
          | 'future_trunks_saga'
          | 'dbs_broly_saga'
          | 'dbs_super_hero_saga'
          | 'daima_saga'
          | 'dark_empire_saga'
          | 'dark_demon_realm_saga'
          | 'prison_planet_saga'
          | 'shadow_dragon_saga'
          | 'black_star_dragon_ball_saga'
          | 'baby_saga'
          | 'super_17_saga'
          | 'broly_saga'
          | 'cooler_saga'
          | 'meta_cooler_saga'
          | 'bardock_saga'
          | 'turles_saga'
          | 'lord_slug_saga'
          | 'boujack_saga'
          | 'janemba_saga'
          | 'hirudegarn_saga'
          | 'champa_saga'
          | 'another_world_budokai_saga'
          | 'dr_uiro_saga'
          | 'the_path_to_power_saga'
          | 'chilled_saga'
          | 'hatchiyack_saga'
          | 'mystical_adventure_saga'
          | 'galactic_patrolman_saga'
          | 'curse_of_the_blood_rubies_saga'
          | 'sleeping_princess_in_devils_castle_saga'
          | 'dragon_ball_minus_saga'
          | 'special'
        >;
      }

      export interface Power {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface Power2 {
        min: number;
        max: number;
      }

      export interface ComboPower {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface ComboPower2 {
        min: number;
        max: number;
      }
    }
  }

  export interface GundamCardGame {
    game: 'gundam';
    /**
     * @default {}
     */
    filters?: GundamCardGame.Filters;
  }

  export namespace GundamCardGame {
    export interface Filters {
      name?: Filters.Name;
      finish?: Filters.Finish;
      finishes?: Filters.Finishes;
      rarity?: Filters.Rarity;
      color?: Filters.Color;
      type?: Filters.Type;
      level?: Filters.Level | Filters.Level2;
      cost?: Filters.Cost | Filters.Cost2;
      attackPoints?: Filters.AttackPoints | Filters.AttackPoints2;
      hitPoints?: Filters.HitPoints | Filters.HitPoints2;
    }

    export namespace Filters {
      export interface Name {
        value: string;
      }

      export interface Finish {
        op: 'and' | 'or';
        values: Array<'Standard' | 'Holofoil'>;
      }

      export interface Finishes {
        op: 'and' | 'or';
        values: Array<'Standard' | 'Holofoil'>;
      }

      export interface Rarity {
        op: 'and' | 'or';
        values: Array<
          | 'common'
          | 'common_plus'
          | 'common_double_plus'
          | 'uncommon'
          | 'uncommon_plus'
          | 'rare'
          | 'rare_plus'
          | 'legend_rare'
          | 'legend_rare_plus'
          | 'legend_rare_double_plus'
          | 'promo'
        >;
      }

      export interface Color {
        op: 'and' | 'or';
        values: Array<'Blue' | 'Green' | 'Red' | 'White' | 'Purple'>;
      }

      export interface Type {
        op: 'and' | 'or';
        values: Array<'Unit' | 'Pilot' | 'Command' | 'Base' | 'Resource' | 'EX Base' | 'EX Resource'>;
      }

      export interface Level {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface Level2 {
        min: number;
        max: number;
      }

      export interface Cost {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface Cost2 {
        min: number;
        max: number;
      }

      export interface AttackPoints {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface AttackPoints2 {
        min: number;
        max: number;
      }

      export interface HitPoints {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface HitPoints2 {
        min: number;
        max: number;
      }
    }
  }

  export interface ChronoCore {
    game: 'chrono-core';
    /**
     * @default {}
     */
    filters?: ChronoCore.Filters;
  }

  export namespace ChronoCore {
    export interface Filters {
      name?: Filters.Name;
      rarity?: Filters.Rarity;
      variant?: Filters.Variant;
      finish?: Filters.Finish;
      finishes?: Filters.Finishes;
      languages?: Filters.Languages;
      cardType?: Filters.CardType;
      subtype?: Filters.Subtype;
      chassisType?: Filters.ChassisType;
      traits?: Filters.Traits;
      damageType?: Filters.DamageType;
      realm?: Filters.Realm;
      equipRequirements?: Filters.EquipRequirements;
      mkValue?: Filters.MkValue;
      timingRestrictions?: Filters.TimingRestrictions;
      keywords?: Filters.Keywords;
      origins?: Filters.Origins;
      maxShieldValue?: Filters.MaxShieldValue | Filters.MaxShieldValue2;
      maxLifeValue?: Filters.MaxLifeValue | Filters.MaxLifeValue2;
      coreCost?: Filters.CoreCost | Filters.CoreCost2;
      damageValue?: Filters.DamageValue | Filters.DamageValue2;
      chargeValue?: Filters.ChargeValue | Filters.ChargeValue2;
    }

    export namespace Filters {
      export interface Name {
        value: string;
      }

      export interface Rarity {
        op: 'and' | 'or';
        values: Array<'Common' | 'Uncommon' | 'Rare' | 'Super Rare' | 'Secret' | 'Promo'>;
      }

      export interface Variant {
        op: 'and' | 'or';
        values: Array<
          | 'Normal'
          | 'Immersive Art'
          | 'Serialized'
          | 'Artist Signature'
          | 'Circuitry'
          | 'Early Adopter'
          | 'Participant'
          | 'Rilynn Art'
          | 'Top 4'
          | 'Top 8'
          | 'Winner'
        >;
      }

      export interface Finish {
        op: 'and' | 'or';
        values: Array<'Standard' | 'Holographic'>;
      }

      export interface Finishes {
        op: 'and' | 'or';
        values: Array<'Standard' | 'Holographic'>;
      }

      export interface Languages {
        op: 'and' | 'or';
        values: Array<
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
          | 'sa'
        >;
      }

      export interface CardType {
        op: 'and' | 'or';
        values: Array<'Configuration' | 'Core' | 'Equipment' | 'Gem' | 'Pilot' | 'Support' | 'Weapon'>;
      }

      export interface Subtype {
        op: 'and' | 'or';
        values: Array<
          | 'Auxiliary'
          | 'Gauntlets'
          | 'Greaves'
          | 'One-Handed Melee'
          | 'One-Handed Ranged'
          | 'One-Handed Shield'
          | 'Two-Handed Melee'
          | 'Two-Handed Ranged'
          | 'Visor'
        >;
      }

      export interface ChassisType {
        op: 'and' | 'or';
        values: Array<'Lightweight' | 'Midweight' | 'Heavyweight'>;
      }

      export interface Traits {
        op: 'and' | 'or';
        values: Array<'Gadget' | 'Wildcard'>;
      }

      export interface DamageType {
        op: 'and' | 'or';
        values: Array<'Ballistic' | 'Beam' | 'Plasma' | 'Strike'>;
      }

      export interface Realm {
        op: 'and' | 'or';
        values: Array<'Artifice' | 'Castra' | 'Nekris' | 'Umbra'>;
      }

      export interface EquipRequirements {
        op: 'and' | 'or';
        values: Array<
          | 'All Slots'
          | 'Auxiliary'
          | 'Equipment'
          | 'Gauntlets'
          | 'Greaves'
          | 'One-Handed Melee'
          | 'One-Handed Ranged'
          | 'One-Handed Shield'
          | 'Two-Handed Melee'
          | 'Two-Handed Ranged'
          | 'Visor'
          | 'Weapons'
        >;
      }

      export interface MkValue {
        op: 'and' | 'or';
        values: Array<'MKI' | 'MKII' | 'MKIII' | 'MKIV'>;
      }

      export interface TimingRestrictions {
        op: 'and' | 'or';
        values: Array<
          | 'Active Main'
          | 'Beginning of Turn'
          | 'Counter Attack'
          | 'Counter Play'
          | 'On Attack'
          | 'On Overclock'
          | 'On Play'
          | 'On Reveal'
          | 'On Scrap'
          | 'Overclock'
        >;
      }

      export interface Keywords {
        op: 'and' | 'or';
        values: Array<
          | 'Cloaking'
          | 'Data Storm'
          | 'Datamine'
          | 'Decoding'
          | 'Feedback Loop'
          | 'Firewall'
          | 'Lockout'
          | 'Optimization Protocol'
          | 'Overshield'
          | 'Power Burst'
          | 'Quantum Blow'
          | 'Reconfigure'
          | 'Regenerate'
          | 'Reinforce'
          | 'Renew'
          | 'Rootkit'
          | 'Scrapheap'
          | 'Shockwave'
          | 'Short Circuit'
          | 'Siphon'
          | 'System Override'
          | 'System Reboot'
          | 'Virus'
          | 'Worm'
        >;
      }

      export interface Origins {
        op: 'and' | 'or';
        values: Array<
          | 'Boxtopper'
          | 'Chrono Core Crew'
          | 'Gen Con'
          | 'Houston Premier Event'
          | 'Kickstarter Exclusive'
          | 'Release Event Kit'
        >;
      }

      export interface MaxShieldValue {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface MaxShieldValue2 {
        min: number;
        max: number;
      }

      export interface MaxLifeValue {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface MaxLifeValue2 {
        min: number;
        max: number;
      }

      export interface CoreCost {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface CoreCost2 {
        min: number;
        max: number;
      }

      export interface DamageValue {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface DamageValue2 {
        min: number;
        max: number;
      }

      export interface ChargeValue {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface ChargeValue2 {
        min: number;
        max: number;
      }
    }
  }

  export interface PalworldTcg {
    game: 'palworld';
    /**
     * @default {}
     */
    filters?: PalworldTcg.Filters;
  }

  export namespace PalworldTcg {
    export interface Filters {
      name?: Filters.Name;
      rarity?: Filters.Rarity;
      finish?: Filters.Finish;
      finishes?: Filters.Finishes;
      languages?: Filters.Languages;
      cardKind?: Filters.CardKind;
      cardKindSub?: Filters.CardKindSub;
      color?: Filters.Color;
      types?: Filters.Types;
      aptitudes?: Filters.Aptitudes;
      cost?: Filters.Cost | Filters.Cost2;
      power?: Filters.Power | Filters.Power2;
      attack?: Filters.Attack | Filters.Attack2;
    }

    export namespace Filters {
      export interface Name {
        value: string;
      }

      export interface Rarity {
        op: 'and' | 'or';
        values: Array<
          | 'Common'
          | 'Uncommon'
          | 'Rare'
          | 'Double Rare'
          | 'Super Rare'
          | 'Special'
          | 'Super Special'
          | 'Over Super Rare'
          | 'Trial Deck'
          | 'Trial Deck Special'
          | 'Trial Deck Super Rare'
          | 'Promo'
        >;
      }

      export interface Finish {
        op: 'and' | 'or';
        values: Array<'Standard'>;
      }

      export interface Finishes {
        op: 'and' | 'or';
        values: Array<'Standard'>;
      }

      export interface Languages {
        op: 'and' | 'or';
        values: Array<
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
          | 'sa'
        >;
      }

      export interface CardKind {
        op: 'and' | 'or';
        values: Array<'Pal' | 'Event' | 'Gear' | 'Soul' | 'Structure'>;
      }

      export interface CardKindSub {
        op: 'and' | 'or';
        values: Array<'Normal Pal' | 'Lucky Pal'>;
      }

      export interface Color {
        op: 'and' | 'or';
        values: Array<'Red' | 'Blue' | 'Green' | 'Purple' | 'Colorless'>;
      }

      export interface Types {
        op: 'and' | 'or';
        values: Array<
          'Neutral' | 'Fire' | 'Water' | 'Electric' | 'Grass' | 'Dark' | 'Dragon' | 'Ground' | 'Ice'
        >;
      }

      export interface Aptitudes {
        op: 'and' | 'or';
        values: Array<
          | 'Harvesting'
          | 'Crafting'
          | 'Collecting'
          | 'Transporting'
          | 'Kindling'
          | 'Cooling'
          | 'Electricity'
          | 'Farming'
        >;
      }

      export interface Cost {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface Cost2 {
        min: number;
        max: number;
      }

      export interface Power {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface Power2 {
        min: number;
        max: number;
      }

      export interface Attack {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface Attack2 {
        min: number;
        max: number;
      }
    }
  }

  export interface AzukiTcg {
    game: 'azuki';
    /**
     * @default {}
     */
    filters?: AzukiTcg.Filters;
  }

  export namespace AzukiTcg {
    export interface Filters {
      name?: Filters.Name;
      rarity?: Filters.Rarity;
      finish?: Filters.Finish;
      finishes?: Filters.Finishes;
      languages?: Filters.Languages;
      element?: Filters.Element;
      category?: Filters.Category;
      ikzCost?: Filters.IkzCost | Filters.IkzCost2;
      attack?: Filters.Attack | Filters.Attack2;
      health?: Filters.Health | Filters.Health2;
      gatePower?: Filters.GatePower | Filters.GatePower2;
    }

    export namespace Filters {
      export interface Name {
        value: string;
      }

      export interface Rarity {
        op: 'and' | 'or';
        values: Array<
          | 'Common'
          | 'Uncommon'
          | 'Rare'
          | 'Super Rare'
          | 'Super Rare ★'
          | 'Super Rare ★★'
          | 'Leader'
          | 'Leader ★'
          | 'Leader ★★'
          | 'Gate'
          | 'Gate ★'
          | 'IKZ'
          | 'IKZ ★'
        >;
      }

      export interface Finish {
        op: 'and' | 'or';
        values: Array<'Standard'>;
      }

      export interface Finishes {
        op: 'and' | 'or';
        values: Array<'Standard'>;
      }

      export interface Languages {
        op: 'and' | 'or';
        values: Array<
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
          | 'sa'
        >;
      }

      export interface Element {
        op: 'and' | 'or';
        values: Array<'Neutral' | 'Water' | 'Lightning' | 'Earth' | 'Fire'>;
      }

      export interface Category {
        op: 'and' | 'or';
        values: Array<'Entity' | 'Spell' | 'Weapon' | 'Leader' | 'Gate' | 'IKZ'>;
      }

      export interface IkzCost {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface IkzCost2 {
        min: number;
        max: number;
      }

      export interface Attack {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface Attack2 {
        min: number;
        max: number;
      }

      export interface Health {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface Health2 {
        min: number;
        max: number;
      }

      export interface GatePower {
        op: '=' | '>' | '<';
        value: number;
      }

      export interface GatePower2 {
        min: number;
        max: number;
      }
    }
  }
}

export interface LineSearchResponse {
  data: Array<LineSearchResponse.Data>;
  pagination: LineSearchResponse.Pagination;
}

export namespace LineSearchResponse {
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
    customId: CustomID | null;
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
    graded: Graded | null;
    /**
     * `true` when this line is published to the Marketplace with a price. `false` when it sits in your Collection.
     */
    forSale: boolean;
    /**
     * The listing details when `forSale` is `true`. `null` when the line is not for sale.
     */
    listing: Data.Listing | null;
    /**
     * Photos attached to this line, in the order you set them with `PUT /v1/inventory/{inventoryId}/media`. Buyers see them on your Marketplace listing. Empty when there are none.
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

export interface LineRetrieveResponse {
  /**
   * Stable opaque identifier for this inventory line. Do not parse.
   */
  id: string;
  /**
   * Your own stable identifier for this line, unique across your live lines. `null` when you have not set one.
   * @minLength 1
   * @maxLength 255
   */
  customId: CustomID | null;
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
  graded: Graded | null;
  /**
   * `true` when this line is published to the Marketplace with a price. `false` when it sits in your Collection.
   */
  forSale: boolean;
  /**
   * The listing details when `forSale` is `true`. `null` when the line is not for sale.
   */
  listing: LineRetrieveResponse.Listing | null;
  /**
   * Photos attached to this line, in the order you set them with `PUT /v1/inventory/{inventoryId}/media`. Buyers see them on your Marketplace listing. Empty when there are none.
   */
  photos: Array<LineRetrieveResponse.Photo>;
  /**
   * When this line was last modified.
   * @format date-time
   */
  updatedAt: string;
}

export namespace LineRetrieveResponse {
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

export interface LineUpdateParams {
  /**
   * Quantity change: `{"set": n}` replaces the quantity, `{"adjust": n}` adds or removes cards — one or the other, never both. A change that would leave zero or fewer cards is rejected — use `DELETE /v1/inventory/{inventoryId}` to remove a line.
   */
  quantity?: LineUpdateParams.Quantity | LineUpdateParams.Quantity2;
  /**
   * New condition: `NM`, `LP`, `MP`, `HP`, or `DMG`.
   */
  condition?: PricingAPI.CardCondition;
  /**
   * New language, as a two-letter code, e.g. `en`.
   * @minLength 1
   */
  language?: string;
  /**
   * New finish, e.g. `Standard`, `Foil`, `Reverse Holo`.
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
   * New grading details, or `null` to turn the line back into a raw card (set `condition` in the same call).
   */
  graded?: LineUpdateParams.Graded | null;
  /**
   * Your own stable identifier for this line, unique across your live lines. Pass `null` to remove it.
   * @minLength 1
   * @maxLength 255
   */
  customId?: CustomID | null;
  /**
   * Free-text note for the line, shown to buyers on your Marketplace listing. Pass `null` to remove it.
   * @maxLength 2000
   */
  comment?: BulkOperationsAPI.InventoryComment | null;
  /**
   * Private note for the line, visible only to you. Pass `null` to remove it.
   * @maxLength 2000
   */
  notes?: string | null;
  /**
   * The location for this line, by name. Must match one of your existing locations. Pass `null` to move the line to no location.
   * @minLength 1
   * @maxLength 100
   */
  location?: string | null;
  /**
   * How to change the line's tags: `{"set": [...]}` replaces the whole set (`{"set": []}` clears them), `{"add": [...]}` adds without removing others, `{"remove": [...]}` removes only the ones you name. Choose exactly one. Every name must match one of your existing tags.
   */
  tags?: LineUpdateParams.Tags | LineUpdateParams.Tags2 | LineUpdateParams.Tags3;
  /**
   * Apply the attribute changes to only this many cards. When `count` is lower than the line's quantity, the line splits: `count` cards take the changes and come back as `line`, the rest stays unchanged and comes back as `remainder`. Cannot be combined with `quantity`.
   * @minimum 1
   * @maximum 9007199254740991
   */
  count?: number;
}

export namespace LineUpdateParams {
  export interface Quantity {
    /**
     * The line's new total quantity.
     * @minimum 1
     * @maximum 9007199254740991
     */
    set: number;
  }

  export interface Quantity2 {
    /**
     * Cards to add (positive) or remove (negative).
     * @minimum -9007199254740991
     * @maximum 9007199254740991
     */
    adjust: number;
  }

  export interface Graded {
    /**
     * The grade printed on the slab, e.g. `9.5`.
     * @minLength 1
     */
    grade: string;
    /**
     * The grading company that graded the card, e.g. `PSA`, `Beckett`, `CGC`.
     */
    gradingService:
      | 'PSA'
      | 'Beckett'
      | 'CGC'
      | 'TAG'
      | 'PCG'
      | 'CCC'
      | 'PCA'
      | 'CollectAura'
      | 'MTGGrade'
      | 'PureGrading'
      | 'SGS';
    /**
     * The certification number printed on the slab. Omit it when you do not have it.
     * @minLength 1
     */
    certification?: string;
  }

  export interface Tags {
    /**
     * Replace the line's tags with exactly these. Send `[]` to remove all tags.
     * @maxItems 50
     */
    set: Array<string>;
  }

  export interface Tags2 {
    /**
     * Add these tags to the line, keeping the ones it already has.
     * @minItems 1
     * @maxItems 50
     */
    add: Array<string>;
  }

  export interface Tags3 {
    /**
     * Remove these tags from the line, leaving the ones you don't list.
     * @minItems 1
     * @maxItems 50
     */
    remove: Array<string>;
  }
}

export interface LineUpdateResponse {
  /**
   * The line carrying your changes. If the changes made it identical to another of your lines, the two merged and this is the surviving line.
   */
  line: LineUpdateResponse.Line;
  /**
   * After a `count` split, the unchanged rest of the original line. `null` when no split happened.
   */
  remainder: LineUpdateResponse.Remainder | null;
}

export namespace LineUpdateResponse {
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
    customId: CustomID | null;
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
    graded: Graded | null;
    /**
     * `true` when this line is published to the Marketplace with a price. `false` when it sits in your Collection.
     */
    forSale: boolean;
    /**
     * The listing details when `forSale` is `true`. `null` when the line is not for sale.
     */
    listing: Line.Listing | null;
    /**
     * Photos attached to this line, in the order you set them with `PUT /v1/inventory/{inventoryId}/media`. Buyers see them on your Marketplace listing. Empty when there are none.
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
    customId: CustomID | null;
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
    graded: Graded | null;
    /**
     * `true` when this line is published to the Marketplace with a price. `false` when it sits in your Collection.
     */
    forSale: boolean;
    /**
     * The listing details when `forSale` is `true`. `null` when the line is not for sale.
     */
    listing: Remainder.Listing | null;
    /**
     * Photos attached to this line, in the order you set them with `PUT /v1/inventory/{inventoryId}/media`. Buyers see them on your Marketplace listing. Empty when there are none.
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

export type LineDeleteParams = Record<string, unknown>;

export interface LineDeleteResponse {
  /**
   * Always `true` — the line has been removed.
   */
  deleted: true;
}

export interface LineSetMediaParams {
  /**
   * The photos the line should carry — between 1 and 10 image files, any `image/*` content type, each up to 10 MB.
   * @minItems 1
   * @maxItems 10
   */
  files: Array<string>;
}

export interface LineSetMediaResponse {
  /**
   * Stable opaque identifier for this inventory line. Do not parse.
   */
  id: string;
  /**
   * Your own stable identifier for this line, unique across your live lines. `null` when you have not set one.
   * @minLength 1
   * @maxLength 255
   */
  customId: CustomID | null;
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
  graded: Graded | null;
  /**
   * `true` when this line is published to the Marketplace with a price. `false` when it sits in your Collection.
   */
  forSale: boolean;
  /**
   * The listing details when `forSale` is `true`. `null` when the line is not for sale.
   */
  listing: LineSetMediaResponse.Listing | null;
  /**
   * Photos attached to this line, in the order you set them with `PUT /v1/inventory/{inventoryId}/media`. Buyers see them on your Marketplace listing. Empty when there are none.
   */
  photos: Array<LineSetMediaResponse.Photo>;
  /**
   * When this line was last modified.
   * @format date-time
   */
  updatedAt: string;
}

export namespace LineSetMediaResponse {
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
export declare namespace Lines {
  export {
    type CustomID as CustomID,
    type Graded as Graded,
    type LineListResponse as LineListResponse,
    type LineCreateResponse as LineCreateResponse,
    type LineSearchResponse as LineSearchResponse,
    type LineRetrieveResponse as LineRetrieveResponse,
    type LineUpdateResponse as LineUpdateResponse,
    type LineDeleteResponse as LineDeleteResponse,
    type LineSetMediaResponse as LineSetMediaResponse,
    type LineListParams as LineListParams,
    type LineCreateParams as LineCreateParams,
    type LineSearchParams as LineSearchParams,
    type LineUpdateParams as LineUpdateParams,
    type LineDeleteParams as LineDeleteParams,
    type LineSetMediaParams as LineSetMediaParams,
  };
}
