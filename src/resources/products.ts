// File generated from our OpenAPI spec by Scalar. See README.md for details.

import { APIResource } from '../resource';
import { APIPromise } from '../api-promise';
import type { RequestOptions } from '../internal/request-options';
import { buildHeaders } from '../internal/headers';
import { path as __scalarPath } from '../internal/utils/path';
import type * as OffersAPI from './offers';
import type * as PricingAPI from './pricing';
import type * as AccountAPI from './account/account';
import type * as LinesAPI from './lines';
import type * as RunsAPI from './optimizer/runs';

export class Products extends APIResource {
  /**
   * Returns every game CardNexus tracks. Use the `id` of each entry to address the game in other catalogue endpoints.
   *
   * Authentication is required (any valid API key); no scope.
   *
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<ProductListGamesResponse>} Games returned.
   *
   * @example
   * ```ts
   * const product = await client.products.listGames();
   * ```
   */
  listGames(options?: RequestOptions): APIPromise<ProductListGamesResponse> {
    return this._client.get('/games', options);
  }

  /**
   * Returns a single game by its identifier.
   *
   * Authentication is required (any valid API key); no scope.
   *
   * @param {string} gameID - The game's identifier (e.g. `mtg`, `pokemon`). Returned by `GET /v1/games`.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<GameSummary>} Game returned.
   *
   * @example
   * ```ts
   * const gameSummary = await client.products.retrieveGame('gameId');
   * ```
   */
  retrieveGame(gameID: string, options?: RequestOptions): APIPromise<GameSummary> {
    return this._client.get(__scalarPath`/games/${gameID}`, options);
  }

  /**
   * Returns every expansion (set) of a game, paginated. Newest expansions first by release date.
   *
   * Authentication is required (any valid API key); no scope.
   *
   * @param {string} gameID - The game whose expansions to list (e.g. `mtg`, `pokemon`). Path parameter.
   * @param {ProductListGameExpansionsParams} [query] - The parameters to send with the request.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<ProductListGameExpansionsResponse>} Expansions returned.
   *
   * @example
   * ```ts
   * const product = await client.products.listGameExpansions('gameId', {
   *   offset: 0,
   *   limit: 50,
   * });
   * ```
   */
  listGameExpansions(
    gameID: string,
    query: ProductListGameExpansionsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<ProductListGameExpansionsResponse> {
    return this._client.get(__scalarPath`/games/${gameID}/expansions`, { query, ...options });
  }

  /**
   * Returns a single expansion (set) by its identifier — name, code, release date, card and sealed-product counts, supported languages, logo and symbol URLs.
   *
   * Authentication is required (any valid API key); no scope.
   *
   * @param {string} expansionID - The expansion's identifier. Returned by `GET /v1/games/{gameId}/expansions`.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<ExpansionSummary>} Expansion returned.
   *
   * @example
   * ```ts
   * const expansionSummary = await client.products.retrieveExpansion('expansionId');
   * ```
   */
  retrieveExpansion(expansionID: string, options?: RequestOptions): APIPromise<ExpansionSummary> {
    return this._client.get(__scalarPath`/expansions/${expansionID}`, options);
  }

  /**
   * Searches the catalogue. Returns a paginated list of products matching the body.
   *
   * Use this to find a card by name, browse an expansion, or filter on game-specific attributes like rarity or color. To replicate the full catalogue, use `GET /v1/feeds/products` instead — the feed is regenerated whenever a game's catalogue updates (typically minutes after a change).
   *
   * Filter fields:
   *
   * - `name` — free-text search against the product name, ranked by relevance. A print number before or after the name (`sephiroth 44`) pins that print; an expansion code plus print number (`msh-54`, `msh 54`, `msh54`) pins a single card; an expansion code on its own (`msh`) surfaces that expansion's products.
   * - `printNumber` — exact print-number match, ignoring case.
   * - `productIds`, `expansionId`, `nameSlug` — direct lookups when you already know the identifier. `productIds`, `expansionId`, `cardmarketId`, and `tcgplayerId` take up to 200 ids per call — split larger sets across several calls.
   * - `expansionId` — one or more expansions, matched as "any of". Pair it with `nameSlug` to follow a card across a set of expansions.
   * - `productType`, `productCategory` — restrict to cards or sealed (and a sealed category like `booster_box`).
   * - `gameFilters` — pick a game (e.g. `{ "game": "mtg" }`), and optionally that game's own attribute filters in the same object.
   *
   * Marketplace listings:
   *
   * Send a `listings` object — even an empty one — and every result gains an `availability` block: how many listings match, and the cheapest one you can buy, with its `listingId` ready for `POST /v1/cart/items`. Filter those listings with `deliveryCountry`, `condition`, `language`, and `finish`, and set `inStock: true` to drop products with no match.
   *
   * `deliveryCountry` applies the same rule as checkout, so a listing returned here can be added to your cart. Sellers ship within their own country and across Europe and North America; a country outside that set matches nothing.
   *
   * `availability.cheapest.price` is what you pay. It sits alongside `pricesByFinish`, where `cardnexus.low` is the marketplace floor across every country and every seller — so the two differ whenever the cheapest copy in the world can't reach you.
   *
   * Two combinations are rejected with `400`: `listings` together with `cardmarketId` or `tcgplayerId`, and `listings` together with `sortBy: releaseDate`. With `listings`, results are ordered by relevance and `offset` + `limit` cannot exceed 300,000.
   *
   * Language: send an `Accept-Language` header (`en`, `fr`, `it`, `es`, `de`) to work in another language — your `name` text is matched in that language where a translation exists (falling back to English), and product and expansion names in the results come back in it where a translation exists. Searching `Blizzaroi` with `Accept-Language: fr` finds Abomasnow.
   *
   * Pagination + sort:
   *
   * - `limit` defaults to 50, max 200. `offset` defaults to 0.
   * - `sortBy`, `sortDirection` — sort the results.
   *
   * Each result has `productType` set to either `card` or `sealed`. Card products carry per-finish prices and per-game attributes; sealed products carry a single price plus EAN/SKU.
   *
   * This endpoint has its own rate-limit bucket (`catalogue-search`); paginating through tens of thousands of results will hit it before your account-level limit. The daily feeds are the right tool for bulk catalogue replication.
   *
   * Authentication is required (any valid API key); no scope.
   *
   * @param {ProductSearchParams} params - The parameters to send with the request.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<ProductSearchResponse>} Products returned.
   *
   * @example
   * ```ts
   * const product = await client.products.search({
   *   offset: 0,
   *   limit: 50,
   * });
   * ```
   */
  search(params: ProductSearchParams, options?: RequestOptions): APIPromise<ProductSearchResponse> {
    const { 'Accept-Language': acceptLanguage, ...body } = params;
    return this._client.post('/products/search', {
      body,
      ...options,
      headers: buildHeaders([
        { ...(acceptLanguage !== undefined ? { 'Accept-Language': acceptLanguage } : {}) },
        options?.headers,
      ]),
    });
  }

  /**
   * Returns a single product by its identifier, including cross-platform IDs that map this product to its Cardmarket and TCGplayer equivalents.
   *
   * The response is a discriminated union by `productType` (`card` or `sealed`).
   *
   * Authentication is required (any valid API key); no scope.
   *
   * @param {string} productID - The product's identifier. Returned by `GET /v1/products` and `GET /v1/products/{productId}`.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<ProductRetrieveResponse>} Product returned.
   *
   * @example
   * ```ts
   * const product = await client.products.retrieve('productId');
   * ```
   */
  retrieve(productID: string, options?: RequestOptions): APIPromise<ProductRetrieveResponse> {
    return this._client.get(__scalarPath`/products/${productID}`, options);
  }

  /**
   * Returns the Marketplace listings for a catalogue product — every listing's price, quantity for sale, the card's condition and language, the seller's photos of the card, and the seller behind it.
   *
   * Listings are sorted by price, cheapest first; when sellers list in different currencies, prices are compared in a common currency for the sort. Each listing's `price` stays in the currency the seller lists in.
   *
   * Filter with any combination of `condition`, `language`, `finish`, and `region`. `condition`, `language`, and `finish` can each be repeated to match any of several values, e.g. `?condition=NM&condition=LP`. Pass `deliveryCountry` to keep only listings from sellers who ship to you — each listing then carries the seller's shipping charge under `seller.shipping`. Without `deliveryCountry`, every listing is returned and `seller.shipping` is `null`.
   *
   * Results are paginated: follow `pagination.nextCursor` by passing it back as `cursor` until it comes back `null`. `limit` defaults to 50, maximum 100.
   *
   * To buy from a listing, pass its `listingId` to `POST /v1/cart/items`.
   *
   * Requests count against the `product-listings` rate limit: 120 requests per hour. If your integration needs more, contact support with your username and what you're building — limits can be raised per account.
   *
   * Authentication is required (any valid API key); no scope.
   *
   * @param {string} productID - The catalogue product. Product ids come from `GET /v1/products`. Path parameter.
   * @param {ProductListListingsParams} [query] - The parameters to send with the request.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<ProductListListingsResponse>} Listings returned.
   *
   * @example
   * ```ts
   * const product = await client.products.listListings('productId', {
   *   limit: 50,
   * });
   * ```
   */
  listListings(
    productID: string,
    query: ProductListListingsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<ProductListListingsResponse> {
    return this._client.get(__scalarPath`/products/${productID}/listings`, { query, ...options });
  }

  /**
   * Maps Cardmarket or TCGplayer product ids to CardNexus products, up to 200 ids per call.
   *
   * Each id resolves to at most one product, including the finish the id maps to — a marketplace product id is finish-specific, so a card's Foil and Standard printings carry different ids. Ids with no match come back with `product: null`, so a single call gives you a complete mapping table, misses included.
   *
   * Pair this with the bulk import: resolve your Cardmarket `idProduct` (or TCGplayer product id) column to CardNexus product ids, then send those as the `productId` on each `POST /v1/inventory/bulk/import` row.
   *
   * Authentication is required (any valid API key); no scope.
   *
   * @param {ProductResolveParams} body - The request body to send.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<ProductResolveResponse>} Resolution results returned, one per requested id.
   *
   * @example
   * ```ts
   * const product = await client.products.resolve({
   *   marketplace: 'cardmarket',
   *   ids: [0],
   * });
   * ```
   */
  resolve(body: ProductResolveParams, options?: RequestOptions): APIPromise<ProductResolveResponse> {
    return this._client.post('/products/resolve', { body, ...options });
  }
}

export interface GameSummary {
  /**
   * The game's identifier. Stable string — pass it back to address this game elsewhere. Example values: `mtg`, `pokemon`, `ygo`, `lorcana`, `onepiece`.
   */
  id: string;
  /**
   * The game's display name.
   */
  name: string;
  /**
   * When the game was released (ISO 8601, UTC).
   * @format date-time
   */
  releaseDate?: OffersAPI.DateString;
  /**
   * Total number of unique cards across every expansion of this game.
   * @minimum 0
   * @maximum 9007199254740991
   */
  cardCount?: number;
  /**
   * Total number of sealed products (booster boxes, bundles, …) across every expansion of this game.
   * @minimum 0
   * @maximum 9007199254740991
   */
  sealedProductCount?: number;
  /**
   * URL of the game's logo image.
   * @format uri
   */
  logoUrl?: string;
}

export interface ExpansionSummary {
  /**
   * The expansion's identifier. Stable number — pass it back to address this expansion elsewhere.
   * @minimum -9007199254740991
   * @maximum 9007199254740991
   */
  id: number;
  /**
   * The game this expansion belongs to (e.g. `mtg`, `pokemon`).
   */
  gameId: string;
  /**
   * URL-friendly identifier, unique within its game. Useful as a stable lookup key alongside `id` (e.g. `bloomburrow`).
   */
  slug: string;
  /**
   * The expansion's display name.
   */
  name: string;
  /**
   * Short expansion code (e.g. `BLB` for Bloomburrow, `SV4` for Stellar Crown). Unique within a game.
   */
  code: string;
  /**
   * Languages the expansion was printed in, as ISO 639 codes (e.g. `en`, `fr`, `ja`, `zh-Hans`).
   */
  languages: Array<string>;
  /**
   * When the expansion was released (ISO 8601, UTC).
   * @format date-time
   */
  releaseDate?: OffersAPI.DateString;
  /**
   * Number of unique cards in this expansion.
   * @minimum 0
   * @maximum 9007199254740991
   */
  cardCount?: number;
  /**
   * Number of sealed products (booster boxes, bundles, …) for this expansion.
   * @minimum 0
   * @maximum 9007199254740991
   */
  sealedProductCount?: number;
  /**
   * URL of the expansion's logo image.
   * @format uri
   */
  logoUrl?: string;
  /**
   * URL of the expansion's set symbol image.
   * @format uri
   */
  symbolUrl?: string;
}

export interface CardProduct {
  /**
   * The product's identifier. Stable number — pass it back to address this product elsewhere.
   * @minimum -9007199254740991
   * @maximum 9007199254740991
   */
  id: number;
  /**
   * The game this product belongs to (e.g. `mtg`, `pokemon`).
   */
  gameId: string;
  /**
   * A compact game reference — enough to show the game alongside a product without a separate call to `GET /v1/games/{gameId}`.
   */
  game: EmbeddedGame;
  /**
   * The product's display name.
   */
  name: string;
  /**
   * URL-friendly slug derived from the product name, unique within its game. Useful as a stable lookup key.
   */
  nameSlug: string;
  /**
   * Languages this product was printed in, as ISO 639 codes (e.g. `en`, `fr`, `ja`).
   */
  languages: Array<string>;
  productType: 'card';
  /**
   * The finishes this card was printed in (e.g. `Standard`, `Foil`, `Reverse Holo`).
   */
  finishes: Array<
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
  /**
   * Current market prices keyed by finish — up to three blocks per finish: `cardmarket` (EUR), `tcgplayer` (USD), and `cardnexus` (listings live on the CardNexus marketplace). Only finishes with pricing data are present — missing keys mean there's no price for that finish yet. An empty object means the card has no pricing data at all.
   */
  pricesByFinish: Record<string, PricingAPI.FinishPriceBlocks>;
  /**
   * Game-specific attributes (e.g. MTG mana cost and colors, Pokémon HP and types). Schema varies by game; the values reflect what's stored on the catalogue entry.
   */
  attributes: Record<string, unknown>;
  /**
   * The expansion this product belongs to. Absent for products that aren't tied to a single set.
   * @minimum -9007199254740991
   * @maximum 9007199254740991
   */
  expansionId?: OffersAPI.CatalogID;
  /**
   * Compact expansion reference. Absent for products not tied to a single set.
   */
  expansion?: EmbeddedExpansion;
  /**
   * URL of the product's primary image (front face for cards).
   * @format uri
   */
  imageUrl?: string;
  /**
   * This product's ids on Cardmarket and TCGplayer (one per finish) and in the game's card database (e.g. `scryfallId` for Magic: The Gathering). Absent when the product carries no external mapping at all. Use them to bridge with your existing integrations.
   */
  externalIds?: ExternalIDs;
  /**
   * What you can buy on the CardNexus marketplace for this product under the `listings` filters you sent. Present only when the request carried a `listings` object.
   */
  availability?: CardProduct.Availability;
  /**
   * The card's print number within its expansion (e.g. `001/271`, `38/91`). String, not numeric — formats vary by game.
   */
  printNumber?: string;
  /**
   * Variant identifier when a card has multiple printings within the same expansion (e.g. `borderless`, `extended-art`, `showcase`, `promo`).
   */
  variant?: string;
  /**
   * The card's rarity. Values are game-specific (e.g. `common`, `uncommon`, `rare`, `mythic` for MTG; `common`, `uncommon`, `rare`, `holo-rare`, `secret-rare` for Pokémon).
   */
  rarity?: string | null;
  /**
   * URL of the card's back image. Present for double-faced cards (MTG) and similar.
   * @format uri
   */
  imageBackUrl?: string;
}

export namespace CardProduct {
  export interface Availability {
    /**
     * True when at least one listing matches your filters.
     */
    inStock: boolean;
    /**
     * How many listings match your filters.
     * @minimum 0
     * @maximum 9007199254740991
     */
    listingCount: number;
    /**
     * The cheapest matching listing, compared on `priceEur`. `null` when nothing matches.
     */
    cheapest: Availability.Cheapest | null;
  }

  export namespace Availability {
    export interface Cheapest {
      /**
       * The listing's identifier. Pass it to `POST /v1/cart/items` to buy this copy, or to `GET /v1/products/{productId}/listings` to see it alongside the rest.
       */
      listingId: string;
      /**
       * Price per unit, in the seller's own currency.
       */
      price: Cheapest.Price;
      /**
       * The same price converted to euros. Listings are compared on this value, so it is the one to sort or compare across sellers trading in different currencies.
       */
      priceEur: Cheapest.PriceEur;
      /**
       * Units available on this listing.
       * @minimum -9007199254740991
       * @maximum 9007199254740991
       * @exclusiveMinimum 0
       */
      quantity: number;
      /**
       * The card's finish.
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
       * The card's condition. `null` for a graded card, whose grade replaces the condition scale.
       */
      condition: PricingAPI.CardCondition | null;
      /**
       * The card's language, as an ISO 639 code.
       */
      language: string | null;
      /**
       * The seller behind this listing.
       */
      seller: Cheapest.Seller;
    }

    export namespace Cheapest {
      export interface Price {
        /**
         * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
         */
        amount: number;
        currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
      }

      export interface PriceEur {
        /**
         * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
         */
        amount: number;
        currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
      }

      export interface Seller {
        /**
         * The seller's identifier.
         */
        id: string;
        /**
         * The seller's public username.
         */
        username: string;
        /**
         * The seller's country, as an ISO 3166-1 alpha-2 code.
         */
        country: string;
        /**
         * `pro` if the seller trades as a registered company, `individual` if as a private person.
         */
        type: 'pro' | 'individual';
      }
    }
  }
}

export interface SealedProduct {
  /**
   * The product's identifier. Stable number — pass it back to address this product elsewhere.
   * @minimum -9007199254740991
   * @maximum 9007199254740991
   */
  id: number;
  /**
   * The game this product belongs to (e.g. `mtg`, `pokemon`).
   */
  gameId: string;
  /**
   * A compact game reference — enough to show the game alongside a product without a separate call to `GET /v1/games/{gameId}`.
   */
  game: EmbeddedGame;
  /**
   * The product's display name.
   */
  name: string;
  /**
   * URL-friendly slug derived from the product name, unique within its game. Useful as a stable lookup key.
   */
  nameSlug: string;
  /**
   * Languages this product was printed in, as ISO 639 codes (e.g. `en`, `fr`, `ja`).
   */
  languages: Array<string>;
  productType: 'sealed';
  /**
   * What kind of sealed product this is (e.g. `booster_box`, `booster_pack`, `bundle`, `prerelease_kit`, `commander_deck`, `starter_deck`).
   */
  productCategory: string;
  /**
   * Current market prices — `cardmarket` (EUR), `tcgplayer` (USD), and `cardnexus` (live marketplace listings) blocks. A sealed product has a single price (no per-finish split).
   */
  prices: SealedProduct.Prices;
  /**
   * The expansion this product belongs to. Absent for products that aren't tied to a single set.
   * @minimum -9007199254740991
   * @maximum 9007199254740991
   */
  expansionId?: OffersAPI.CatalogID;
  /**
   * Compact expansion reference. Absent for products not tied to a single set.
   */
  expansion?: EmbeddedExpansion;
  /**
   * URL of the product's primary image (front face for cards).
   * @format uri
   */
  imageUrl?: string;
  /**
   * This product's ids on Cardmarket and TCGplayer (one per finish) and in the game's card database (e.g. `scryfallId` for Magic: The Gathering). Absent when the product carries no external mapping at all. Use them to bridge with your existing integrations.
   */
  externalIds?: ExternalIDs;
  /**
   * What you can buy on the CardNexus marketplace for this product under the `listings` filters you sent. Present only when the request carried a `listings` object.
   */
  availability?: SealedProduct.Availability;
  /**
   * When the sealed product was released (ISO 8601, UTC).
   * @format date-time
   */
  releaseDate?: OffersAPI.DateString;
}

export namespace SealedProduct {
  export interface Prices {
    /**
     * Cardmarket's daily price snapshot, in EUR. Absent when Cardmarket has no price.
     */
    cardmarket?: Prices.Cardmarket;
    /**
     * TCGplayer's daily price snapshot, in USD. Absent when TCGplayer has no price.
     */
    tcgplayer?: Prices.Tcgplayer;
    /**
     * Live CardNexus marketplace listings — the EUR-converted floor across every region, plus per-region prices (`eu` in EUR, `na` in USD). Absent when there's no live listing in stock.
     */
    cardnexus?: Prices.Cardnexus;
  }

  export namespace Prices {
    export interface Cardmarket {
      /**
       * The currency every price in this block is in: `EUR` for `cardmarket`, `USD` for `tcgplayer`.
       */
      currency: 'EUR' | 'USD';
      /**
       * Lowest observed price, decimal major units.
       */
      low?: number;
      /**
       * Median observed price, decimal major units.
       */
      mid?: number;
      /**
       * Highest observed price, decimal major units.
       */
      high?: number;
      /**
       * Aggregate market price — the value shown as the canonical price on cardnexus.com. Decimal major units.
       */
      marketValue?: number;
      /**
       * Percent change of `marketValue` vs. 24 hours ago. `null` when there's not enough history.
       */
      change24h?: number | null;
      /**
       * Percent change of `marketValue` vs. 7 days ago.
       */
      change7d?: number | null;
      /**
       * Percent change of `marketValue` vs. 30 days ago.
       */
      change30d?: number | null;
      /**
       * Per-condition price detail (`NM`, `LP`, `MP`, `HP`, `DMG`), present when condition-level data is available for this marketplace.
       */
      byCondition?: Record<string, Cardmarket.ByCondition>;
    }

    export namespace Cardmarket {
      export interface ByCondition {
        /**
         * Lowest observed price for this group, decimal major units.
         */
        low?: number;
        /**
         * How many listings are in this group.
         * @minimum -9007199254740991
         * @maximum 9007199254740991
         */
        listingCount?: number;
        /**
         * Total quantity across those listings.
         * @minimum -9007199254740991
         * @maximum 9007199254740991
         */
        availableQuantity?: number;
        /**
         * The same numbers per card language (two-letter code, e.g. `en`, `de`).
         */
        byLanguage?: Record<string, ByCondition.ByLanguage>;
      }

      export namespace ByCondition {
        export interface ByLanguage {
          /**
           * Lowest observed price for this group, decimal major units.
           */
          low?: number;
          /**
           * How many listings are in this group.
           * @minimum -9007199254740991
           * @maximum 9007199254740991
           */
          listingCount?: number;
          /**
           * Total quantity across those listings.
           * @minimum -9007199254740991
           * @maximum 9007199254740991
           */
          availableQuantity?: number;
        }
      }
    }

    export interface Tcgplayer {
      /**
       * The currency every price in this block is in: `EUR` for `cardmarket`, `USD` for `tcgplayer`.
       */
      currency: 'EUR' | 'USD';
      /**
       * Lowest observed price, decimal major units.
       */
      low?: number;
      /**
       * Median observed price, decimal major units.
       */
      mid?: number;
      /**
       * Highest observed price, decimal major units.
       */
      high?: number;
      /**
       * Aggregate market price — the value shown as the canonical price on cardnexus.com. Decimal major units.
       */
      marketValue?: number;
      /**
       * Percent change of `marketValue` vs. 24 hours ago. `null` when there's not enough history.
       */
      change24h?: number | null;
      /**
       * Percent change of `marketValue` vs. 7 days ago.
       */
      change7d?: number | null;
      /**
       * Percent change of `marketValue` vs. 30 days ago.
       */
      change30d?: number | null;
      /**
       * Per-condition price detail (`NM`, `LP`, `MP`, `HP`, `DMG`), present when condition-level data is available for this marketplace.
       */
      byCondition?: Record<string, Tcgplayer.ByCondition>;
    }

    export namespace Tcgplayer {
      export interface ByCondition {
        /**
         * Lowest observed price for this group, decimal major units.
         */
        low?: number;
        /**
         * How many listings are in this group.
         * @minimum -9007199254740991
         * @maximum 9007199254740991
         */
        listingCount?: number;
        /**
         * Total quantity across those listings.
         * @minimum -9007199254740991
         * @maximum 9007199254740991
         */
        availableQuantity?: number;
        /**
         * The same numbers per card language (two-letter code, e.g. `en`, `de`).
         */
        byLanguage?: Record<string, ByCondition.ByLanguage>;
      }

      export namespace ByCondition {
        export interface ByLanguage {
          /**
           * Lowest observed price for this group, decimal major units.
           */
          low?: number;
          /**
           * How many listings are in this group.
           * @minimum -9007199254740991
           * @maximum 9007199254740991
           */
          listingCount?: number;
          /**
           * Total quantity across those listings.
           * @minimum -9007199254740991
           * @maximum 9007199254740991
           */
          availableQuantity?: number;
        }
      }
    }

    export interface Cardnexus {
      /**
       * The cheapest live listing for this finish anywhere on the marketplace, converted to EUR at the current exchange rate. For prices as sellers quote them, use `regions`.
       */
      low: Cardnexus.Low;
      /**
       * How many live listings the finish has, across every region.
       * @minimum -9007199254740991
       * @maximum 9007199254740991
       */
      listingCount: number;
      /**
       * Total quantity for sale across those listings.
       * @minimum -9007199254740991
       * @maximum 9007199254740991
       */
      availableQuantity: number;
      /**
       * The same numbers per market region, keyed `eu` and `na`, each in its region's currency — `eu` prices are never mixed with `na` prices. A region with no live listings has no key.
       */
      regions: Record<string, Cardnexus.Regions>;
    }

    export namespace Cardnexus {
      export interface Low {
        /**
         * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
         */
        amount: number;
        currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
      }

      export interface Regions {
        /**
         * The currency every one of this region's prices is in: `EUR` for `eu`, `USD` for `na`. Listings from sellers in the region priced in another currency are converted into it at the current exchange rate.
         */
        currency: 'EUR' | 'USD';
        /**
         * The cheapest live listing from sellers in this region, as a decimal amount in the region's currency.
         */
        low: number;
        /**
         * How many live listings sellers in this region have.
         * @minimum -9007199254740991
         * @maximum 9007199254740991
         */
        listingCount: number;
        /**
         * Total quantity for sale across those listings.
         * @minimum -9007199254740991
         * @maximum 9007199254740991
         */
        availableQuantity: number;
        /**
         * The same three numbers per card condition (`NM`, `LP`, `MP`, `HP`, `DMG`). Graded listings count toward the region's totals but have no condition bucket, so the condition buckets can add up to less than the region totals.
         */
        byCondition: Record<string, Regions.ByCondition>;
      }

      export namespace Regions {
        export interface ByCondition {
          /**
           * The cheapest live listing, as a decimal amount in the region's currency (e.g. `42.50` is €42.50 in `eu`).
           */
          low: number;
          /**
           * How many live listings are in this group.
           * @minimum -9007199254740991
           * @maximum 9007199254740991
           */
          listingCount: number;
          /**
           * Total quantity for sale across those listings.
           * @minimum -9007199254740991
           * @maximum 9007199254740991
           */
          availableQuantity: number;
          /**
           * The same three numbers per card language (two-letter code, e.g. `en`, `de`). A listing without a stored language counts toward the condition's totals but has no language bucket, so the language buckets can add up to less than the condition totals.
           */
          byLanguage: Record<string, ByCondition.ByLanguage>;
        }

        export namespace ByCondition {
          export interface ByLanguage {
            /**
             * The cheapest live listing, as a decimal amount in the region's currency (e.g. `42.50` is €42.50 in `eu`).
             */
            low: number;
            /**
             * How many live listings are in this group.
             * @minimum -9007199254740991
             * @maximum 9007199254740991
             */
            listingCount: number;
            /**
             * Total quantity for sale across those listings.
             * @minimum -9007199254740991
             * @maximum 9007199254740991
             */
            availableQuantity: number;
          }
        }
      }
    }
  }

  export interface Availability {
    /**
     * True when at least one listing matches your filters.
     */
    inStock: boolean;
    /**
     * How many listings match your filters.
     * @minimum 0
     * @maximum 9007199254740991
     */
    listingCount: number;
    /**
     * The cheapest matching listing, compared on `priceEur`. `null` when nothing matches.
     */
    cheapest: Availability.Cheapest | null;
  }

  export namespace Availability {
    export interface Cheapest {
      /**
       * The listing's identifier. Pass it to `POST /v1/cart/items` to buy this copy, or to `GET /v1/products/{productId}/listings` to see it alongside the rest.
       */
      listingId: string;
      /**
       * Price per unit, in the seller's own currency.
       */
      price: Cheapest.Price;
      /**
       * The same price converted to euros. Listings are compared on this value, so it is the one to sort or compare across sellers trading in different currencies.
       */
      priceEur: Cheapest.PriceEur;
      /**
       * Units available on this listing.
       * @minimum -9007199254740991
       * @maximum 9007199254740991
       * @exclusiveMinimum 0
       */
      quantity: number;
      /**
       * The card's finish.
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
       * The card's condition. `null` for a graded card, whose grade replaces the condition scale.
       */
      condition: PricingAPI.CardCondition | null;
      /**
       * The card's language, as an ISO 639 code.
       */
      language: string | null;
      /**
       * The seller behind this listing.
       */
      seller: Cheapest.Seller;
    }

    export namespace Cheapest {
      export interface Price {
        /**
         * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
         */
        amount: number;
        currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
      }

      export interface PriceEur {
        /**
         * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
         */
        amount: number;
        currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
      }

      export interface Seller {
        /**
         * The seller's identifier.
         */
        id: string;
        /**
         * The seller's public username.
         */
        username: string;
        /**
         * The seller's country, as an ISO 3166-1 alpha-2 code.
         */
        country: string;
        /**
         * `pro` if the seller trades as a registered company, `individual` if as a private person.
         */
        type: 'pro' | 'individual';
      }
    }
  }
}

export interface CardProductDetail {
  /**
   * The product's identifier. Stable number — pass it back to address this product elsewhere.
   * @minimum -9007199254740991
   * @maximum 9007199254740991
   */
  id: number;
  /**
   * The game this product belongs to (e.g. `mtg`, `pokemon`).
   */
  gameId: string;
  /**
   * A compact game reference — enough to show the game alongside a product without a separate call to `GET /v1/games/{gameId}`.
   */
  game: EmbeddedGame;
  /**
   * The product's display name.
   */
  name: string;
  /**
   * URL-friendly slug derived from the product name, unique within its game. Useful as a stable lookup key.
   */
  nameSlug: string;
  /**
   * Languages this product was printed in, as ISO 639 codes (e.g. `en`, `fr`, `ja`).
   */
  languages: Array<string>;
  /**
   * IDs this product carries on other marketplaces and card databases. Use these to bridge with existing Cardmarket / TCGplayer integrations or external card data sources.
   */
  externalIds: ExternalIDs;
  productType: 'card';
  /**
   * The finishes this card was printed in (e.g. `Standard`, `Foil`, `Reverse Holo`).
   */
  finishes: Array<
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
  /**
   * Current market prices keyed by finish — up to three blocks per finish: `cardmarket` (EUR), `tcgplayer` (USD), and `cardnexus` (listings live on the CardNexus marketplace). Only finishes with pricing data are present — missing keys mean there's no price for that finish yet. An empty object means the card has no pricing data at all.
   */
  pricesByFinish: Record<string, PricingAPI.FinishPriceBlocks>;
  /**
   * Game-specific attributes (e.g. MTG mana cost and colors, Pokémon HP and types). Schema varies by game; the values reflect what's stored on the catalogue entry.
   */
  attributes: Record<string, unknown>;
  /**
   * The expansion this product belongs to. Absent for products that aren't tied to a single set.
   * @minimum -9007199254740991
   * @maximum 9007199254740991
   */
  expansionId?: OffersAPI.CatalogID;
  /**
   * Compact expansion reference. Absent for products not tied to a single set.
   */
  expansion?: EmbeddedExpansion;
  /**
   * URL of the product's primary image (front face for cards).
   * @format uri
   */
  imageUrl?: string;
  /**
   * What you can buy on the CardNexus marketplace for this product under the `listings` filters you sent. Present only when the request carried a `listings` object.
   */
  availability?: CardProductDetail.Availability;
  /**
   * The card's print number within its expansion (e.g. `001/271`, `38/91`). String, not numeric — formats vary by game.
   */
  printNumber?: string;
  /**
   * Variant identifier when a card has multiple printings within the same expansion (e.g. `borderless`, `extended-art`, `showcase`, `promo`).
   */
  variant?: string;
  /**
   * The card's rarity. Values are game-specific (e.g. `common`, `uncommon`, `rare`, `mythic` for MTG; `common`, `uncommon`, `rare`, `holo-rare`, `secret-rare` for Pokémon).
   */
  rarity?: string | null;
  /**
   * URL of the card's back image. Present for double-faced cards (MTG) and similar.
   * @format uri
   */
  imageBackUrl?: string;
}

export namespace CardProductDetail {
  export interface Availability {
    /**
     * True when at least one listing matches your filters.
     */
    inStock: boolean;
    /**
     * How many listings match your filters.
     * @minimum 0
     * @maximum 9007199254740991
     */
    listingCount: number;
    /**
     * The cheapest matching listing, compared on `priceEur`. `null` when nothing matches.
     */
    cheapest: Availability.Cheapest | null;
  }

  export namespace Availability {
    export interface Cheapest {
      /**
       * The listing's identifier. Pass it to `POST /v1/cart/items` to buy this copy, or to `GET /v1/products/{productId}/listings` to see it alongside the rest.
       */
      listingId: string;
      /**
       * Price per unit, in the seller's own currency.
       */
      price: Cheapest.Price;
      /**
       * The same price converted to euros. Listings are compared on this value, so it is the one to sort or compare across sellers trading in different currencies.
       */
      priceEur: Cheapest.PriceEur;
      /**
       * Units available on this listing.
       * @minimum -9007199254740991
       * @maximum 9007199254740991
       * @exclusiveMinimum 0
       */
      quantity: number;
      /**
       * The card's finish.
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
       * The card's condition. `null` for a graded card, whose grade replaces the condition scale.
       */
      condition: PricingAPI.CardCondition | null;
      /**
       * The card's language, as an ISO 639 code.
       */
      language: string | null;
      /**
       * The seller behind this listing.
       */
      seller: Cheapest.Seller;
    }

    export namespace Cheapest {
      export interface Price {
        /**
         * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
         */
        amount: number;
        currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
      }

      export interface PriceEur {
        /**
         * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
         */
        amount: number;
        currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
      }

      export interface Seller {
        /**
         * The seller's identifier.
         */
        id: string;
        /**
         * The seller's public username.
         */
        username: string;
        /**
         * The seller's country, as an ISO 3166-1 alpha-2 code.
         */
        country: string;
        /**
         * `pro` if the seller trades as a registered company, `individual` if as a private person.
         */
        type: 'pro' | 'individual';
      }
    }
  }
}

export interface SealedProductDetail {
  /**
   * The product's identifier. Stable number — pass it back to address this product elsewhere.
   * @minimum -9007199254740991
   * @maximum 9007199254740991
   */
  id: number;
  /**
   * The game this product belongs to (e.g. `mtg`, `pokemon`).
   */
  gameId: string;
  /**
   * A compact game reference — enough to show the game alongside a product without a separate call to `GET /v1/games/{gameId}`.
   */
  game: EmbeddedGame;
  /**
   * The product's display name.
   */
  name: string;
  /**
   * URL-friendly slug derived from the product name, unique within its game. Useful as a stable lookup key.
   */
  nameSlug: string;
  /**
   * Languages this product was printed in, as ISO 639 codes (e.g. `en`, `fr`, `ja`).
   */
  languages: Array<string>;
  /**
   * IDs this product carries on other marketplaces and card databases. Use these to bridge with existing Cardmarket / TCGplayer integrations or external card data sources.
   */
  externalIds: ExternalIDs;
  productType: 'sealed';
  /**
   * What kind of sealed product this is (e.g. `booster_box`, `booster_pack`, `bundle`, `prerelease_kit`, `commander_deck`, `starter_deck`).
   */
  productCategory: string;
  /**
   * Current market prices — `cardmarket` (EUR), `tcgplayer` (USD), and `cardnexus` (live marketplace listings) blocks. A sealed product has a single price (no per-finish split).
   */
  prices: SealedProductDetail.Prices;
  /**
   * The expansion this product belongs to. Absent for products that aren't tied to a single set.
   * @minimum -9007199254740991
   * @maximum 9007199254740991
   */
  expansionId?: OffersAPI.CatalogID;
  /**
   * Compact expansion reference. Absent for products not tied to a single set.
   */
  expansion?: EmbeddedExpansion;
  /**
   * URL of the product's primary image (front face for cards).
   * @format uri
   */
  imageUrl?: string;
  /**
   * What you can buy on the CardNexus marketplace for this product under the `listings` filters you sent. Present only when the request carried a `listings` object.
   */
  availability?: SealedProductDetail.Availability;
  /**
   * When the sealed product was released (ISO 8601, UTC).
   * @format date-time
   */
  releaseDate?: OffersAPI.DateString;
}

export namespace SealedProductDetail {
  export interface Prices {
    /**
     * Cardmarket's daily price snapshot, in EUR. Absent when Cardmarket has no price.
     */
    cardmarket?: Prices.Cardmarket;
    /**
     * TCGplayer's daily price snapshot, in USD. Absent when TCGplayer has no price.
     */
    tcgplayer?: Prices.Tcgplayer;
    /**
     * Live CardNexus marketplace listings — the EUR-converted floor across every region, plus per-region prices (`eu` in EUR, `na` in USD). Absent when there's no live listing in stock.
     */
    cardnexus?: Prices.Cardnexus;
  }

  export namespace Prices {
    export interface Cardmarket {
      /**
       * The currency every price in this block is in: `EUR` for `cardmarket`, `USD` for `tcgplayer`.
       */
      currency: 'EUR' | 'USD';
      /**
       * Lowest observed price, decimal major units.
       */
      low?: number;
      /**
       * Median observed price, decimal major units.
       */
      mid?: number;
      /**
       * Highest observed price, decimal major units.
       */
      high?: number;
      /**
       * Aggregate market price — the value shown as the canonical price on cardnexus.com. Decimal major units.
       */
      marketValue?: number;
      /**
       * Percent change of `marketValue` vs. 24 hours ago. `null` when there's not enough history.
       */
      change24h?: number | null;
      /**
       * Percent change of `marketValue` vs. 7 days ago.
       */
      change7d?: number | null;
      /**
       * Percent change of `marketValue` vs. 30 days ago.
       */
      change30d?: number | null;
      /**
       * Per-condition price detail (`NM`, `LP`, `MP`, `HP`, `DMG`), present when condition-level data is available for this marketplace.
       */
      byCondition?: Record<string, Cardmarket.ByCondition>;
    }

    export namespace Cardmarket {
      export interface ByCondition {
        /**
         * Lowest observed price for this group, decimal major units.
         */
        low?: number;
        /**
         * How many listings are in this group.
         * @minimum -9007199254740991
         * @maximum 9007199254740991
         */
        listingCount?: number;
        /**
         * Total quantity across those listings.
         * @minimum -9007199254740991
         * @maximum 9007199254740991
         */
        availableQuantity?: number;
        /**
         * The same numbers per card language (two-letter code, e.g. `en`, `de`).
         */
        byLanguage?: Record<string, ByCondition.ByLanguage>;
      }

      export namespace ByCondition {
        export interface ByLanguage {
          /**
           * Lowest observed price for this group, decimal major units.
           */
          low?: number;
          /**
           * How many listings are in this group.
           * @minimum -9007199254740991
           * @maximum 9007199254740991
           */
          listingCount?: number;
          /**
           * Total quantity across those listings.
           * @minimum -9007199254740991
           * @maximum 9007199254740991
           */
          availableQuantity?: number;
        }
      }
    }

    export interface Tcgplayer {
      /**
       * The currency every price in this block is in: `EUR` for `cardmarket`, `USD` for `tcgplayer`.
       */
      currency: 'EUR' | 'USD';
      /**
       * Lowest observed price, decimal major units.
       */
      low?: number;
      /**
       * Median observed price, decimal major units.
       */
      mid?: number;
      /**
       * Highest observed price, decimal major units.
       */
      high?: number;
      /**
       * Aggregate market price — the value shown as the canonical price on cardnexus.com. Decimal major units.
       */
      marketValue?: number;
      /**
       * Percent change of `marketValue` vs. 24 hours ago. `null` when there's not enough history.
       */
      change24h?: number | null;
      /**
       * Percent change of `marketValue` vs. 7 days ago.
       */
      change7d?: number | null;
      /**
       * Percent change of `marketValue` vs. 30 days ago.
       */
      change30d?: number | null;
      /**
       * Per-condition price detail (`NM`, `LP`, `MP`, `HP`, `DMG`), present when condition-level data is available for this marketplace.
       */
      byCondition?: Record<string, Tcgplayer.ByCondition>;
    }

    export namespace Tcgplayer {
      export interface ByCondition {
        /**
         * Lowest observed price for this group, decimal major units.
         */
        low?: number;
        /**
         * How many listings are in this group.
         * @minimum -9007199254740991
         * @maximum 9007199254740991
         */
        listingCount?: number;
        /**
         * Total quantity across those listings.
         * @minimum -9007199254740991
         * @maximum 9007199254740991
         */
        availableQuantity?: number;
        /**
         * The same numbers per card language (two-letter code, e.g. `en`, `de`).
         */
        byLanguage?: Record<string, ByCondition.ByLanguage>;
      }

      export namespace ByCondition {
        export interface ByLanguage {
          /**
           * Lowest observed price for this group, decimal major units.
           */
          low?: number;
          /**
           * How many listings are in this group.
           * @minimum -9007199254740991
           * @maximum 9007199254740991
           */
          listingCount?: number;
          /**
           * Total quantity across those listings.
           * @minimum -9007199254740991
           * @maximum 9007199254740991
           */
          availableQuantity?: number;
        }
      }
    }

    export interface Cardnexus {
      /**
       * The cheapest live listing for this finish anywhere on the marketplace, converted to EUR at the current exchange rate. For prices as sellers quote them, use `regions`.
       */
      low: Cardnexus.Low;
      /**
       * How many live listings the finish has, across every region.
       * @minimum -9007199254740991
       * @maximum 9007199254740991
       */
      listingCount: number;
      /**
       * Total quantity for sale across those listings.
       * @minimum -9007199254740991
       * @maximum 9007199254740991
       */
      availableQuantity: number;
      /**
       * The same numbers per market region, keyed `eu` and `na`, each in its region's currency — `eu` prices are never mixed with `na` prices. A region with no live listings has no key.
       */
      regions: Record<string, Cardnexus.Regions>;
    }

    export namespace Cardnexus {
      export interface Low {
        /**
         * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
         */
        amount: number;
        currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
      }

      export interface Regions {
        /**
         * The currency every one of this region's prices is in: `EUR` for `eu`, `USD` for `na`. Listings from sellers in the region priced in another currency are converted into it at the current exchange rate.
         */
        currency: 'EUR' | 'USD';
        /**
         * The cheapest live listing from sellers in this region, as a decimal amount in the region's currency.
         */
        low: number;
        /**
         * How many live listings sellers in this region have.
         * @minimum -9007199254740991
         * @maximum 9007199254740991
         */
        listingCount: number;
        /**
         * Total quantity for sale across those listings.
         * @minimum -9007199254740991
         * @maximum 9007199254740991
         */
        availableQuantity: number;
        /**
         * The same three numbers per card condition (`NM`, `LP`, `MP`, `HP`, `DMG`). Graded listings count toward the region's totals but have no condition bucket, so the condition buckets can add up to less than the region totals.
         */
        byCondition: Record<string, Regions.ByCondition>;
      }

      export namespace Regions {
        export interface ByCondition {
          /**
           * The cheapest live listing, as a decimal amount in the region's currency (e.g. `42.50` is €42.50 in `eu`).
           */
          low: number;
          /**
           * How many live listings are in this group.
           * @minimum -9007199254740991
           * @maximum 9007199254740991
           */
          listingCount: number;
          /**
           * Total quantity for sale across those listings.
           * @minimum -9007199254740991
           * @maximum 9007199254740991
           */
          availableQuantity: number;
          /**
           * The same three numbers per card language (two-letter code, e.g. `en`, `de`). A listing without a stored language counts toward the condition's totals but has no language bucket, so the language buckets can add up to less than the condition totals.
           */
          byLanguage: Record<string, ByCondition.ByLanguage>;
        }

        export namespace ByCondition {
          export interface ByLanguage {
            /**
             * The cheapest live listing, as a decimal amount in the region's currency (e.g. `42.50` is €42.50 in `eu`).
             */
            low: number;
            /**
             * How many live listings are in this group.
             * @minimum -9007199254740991
             * @maximum 9007199254740991
             */
            listingCount: number;
            /**
             * Total quantity for sale across those listings.
             * @minimum -9007199254740991
             * @maximum 9007199254740991
             */
            availableQuantity: number;
          }
        }
      }
    }
  }

  export interface Availability {
    /**
     * True when at least one listing matches your filters.
     */
    inStock: boolean;
    /**
     * How many listings match your filters.
     * @minimum 0
     * @maximum 9007199254740991
     */
    listingCount: number;
    /**
     * The cheapest matching listing, compared on `priceEur`. `null` when nothing matches.
     */
    cheapest: Availability.Cheapest | null;
  }

  export namespace Availability {
    export interface Cheapest {
      /**
       * The listing's identifier. Pass it to `POST /v1/cart/items` to buy this copy, or to `GET /v1/products/{productId}/listings` to see it alongside the rest.
       */
      listingId: string;
      /**
       * Price per unit, in the seller's own currency.
       */
      price: Cheapest.Price;
      /**
       * The same price converted to euros. Listings are compared on this value, so it is the one to sort or compare across sellers trading in different currencies.
       */
      priceEur: Cheapest.PriceEur;
      /**
       * Units available on this listing.
       * @minimum -9007199254740991
       * @maximum 9007199254740991
       * @exclusiveMinimum 0
       */
      quantity: number;
      /**
       * The card's finish.
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
       * The card's condition. `null` for a graded card, whose grade replaces the condition scale.
       */
      condition: PricingAPI.CardCondition | null;
      /**
       * The card's language, as an ISO 639 code.
       */
      language: string | null;
      /**
       * The seller behind this listing.
       */
      seller: Cheapest.Seller;
    }

    export namespace Cheapest {
      export interface Price {
        /**
         * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
         */
        amount: number;
        currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
      }

      export interface PriceEur {
        /**
         * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
         */
        amount: number;
        currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
      }

      export interface Seller {
        /**
         * The seller's identifier.
         */
        id: string;
        /**
         * The seller's public username.
         */
        username: string;
        /**
         * The seller's country, as an ISO 3166-1 alpha-2 code.
         */
        country: string;
        /**
         * `pro` if the seller trades as a registered company, `individual` if as a private person.
         */
        type: 'pro' | 'individual';
      }
    }
  }
}

/**
 * One seller's Marketplace listing for a product: price, quantity for sale, the card's condition and language, the seller's photos of the card, and the seller behind it.
 */
export interface ProductListing {
  /**
   * Stable opaque identifier for this listing. Pass it to `POST /v1/cart/items` to buy from it. Do not parse.
   */
  listingId: string;
  /**
   * A monetary amount as a decimal in the currency's major unit paired with its currency code — `{ amount: 14.99, currency: "USD" }` means $14.99.
   */
  price: AccountAPI.Money;
  /**
   * How many units this listing has for sale.
   * @minimum -9007199254740991
   * @maximum 9007199254740991
   */
  quantity: number;
  /**
   * The card's condition: `NM`, `LP`, `MP`, `HP`, or `DMG`. `null` when the card is graded or the product is sealed.
   */
  condition: PricingAPI.CardCondition | null;
  /**
   * The card's language as a two-letter code, e.g. `en`, `fr`. `null` when the listing has no language.
   */
  language: string | null;
  /**
   * The card's finish, e.g. `Standard`, `Foil`, `Reverse Holo`.
   */
  finish: string;
  /**
   * Grading details when the card is graded. `null` for raw cards and sealed products.
   */
  graded: LinesAPI.Graded | null;
  /**
   * The seller's note about this listing. `null` when there is none.
   */
  comment: string | null;
  /**
   * Photos the seller attached to this listing, in the order they set. Empty when there are none.
   */
  photos: Array<ProductListing.Photo>;
  /**
   * The seller behind a Marketplace listing.
   */
  seller: ListingSeller;
}

export namespace ProductListing {
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

/**
 * A compact game reference — enough to show the game alongside a product without a separate call to `GET /v1/games/{gameId}`.
 */
export interface EmbeddedGame {
  /**
   * The game's identifier (e.g. `mtg`).
   */
  id: string;
  /**
   * The game's display name.
   */
  name: string;
}

export interface EmbeddedExpansion {
  /**
   * The expansion's identifier.
   * @minimum -9007199254740991
   * @maximum 9007199254740991
   */
  id: number;
  /**
   * The expansion's display name.
   */
  name: string;
  /**
   * Short expansion code (e.g. `BLB`, `SV4`, `LOB`).
   */
  code: string;
  /**
   * URL of the expansion's set symbol image.
   * @format uri
   */
  symbolUrl?: string;
}

/**
 * IDs this product carries on other marketplaces and card databases. Use these to bridge with existing Cardmarket / TCGplayer integrations or external card data sources.
 */
export interface ExternalIDs {
  /**
   * Cardmarket product IDs, one per finish. Empty / absent if no Cardmarket mapping exists for this product.
   */
  cardmarket?: Array<ExternalIDs.Cardmarket>;
  /**
   * TCGplayer product IDs, one per finish. Empty / absent if no TCGplayer mapping exists for this product.
   */
  tcgplayer?: Array<ExternalIDs.Tcgplayer>;
  /**
   * This printing's Scryfall id. Magic: The Gathering cards only.
   */
  scryfallId?: string;
  /**
   * The card's Scryfall oracle id, shared by every printing of the card. Magic: The Gathering cards only.
   */
  scryfallOracleId?: string;
  /**
   * The card's Konami id. Yu-Gi-Oh! cards only.
   */
  konamiId?: string;
  /**
   * The card's FAB id. Flesh and Blood cards only.
   */
  fabId?: string;
  /**
   * The card's Dreamborn id. Disney Lorcana cards only.
   */
  dreambornId?: string;
  /**
   * The card's Riot id. Riftbound cards only.
   */
  riotId?: string;
}

export namespace ExternalIDs {
  export interface Cardmarket {
    /**
     * Which finish this id maps to (e.g. `Standard`, `Foil`).
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
     * The Cardmarket or TCGplayer product id for this finish.
     * @minimum 0
     * @maximum 9007199254740991
     */
    id: number;
  }

  export interface Tcgplayer {
    /**
     * Which finish this id maps to (e.g. `Standard`, `Foil`).
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
     * The Cardmarket or TCGplayer product id for this finish.
     * @minimum 0
     * @maximum 9007199254740991
     */
    id: number;
  }
}

/**
 * The seller behind a Marketplace listing.
 */
export interface ListingSeller {
  /**
   * Stable opaque identifier for the seller. Do not parse.
   */
  id: string;
  /**
   * The seller's public handle.
   */
  username: string;
  /**
   * The seller's country as a two-letter ISO 3166-1 alpha-2 code.
   */
  country: string;
  /**
   * `pro` if they sell as a registered company, `individual` if they sell as a private person.
   */
  type: 'pro' | 'individual';
  /**
   * A party's average review score and the number of reviews behind it.
   */
  rating: RunsAPI.OrderPartyRating;
  /**
   * What this seller charges to ship your order to the `deliveryCountry` you passed. `null` when the request had no `deliveryCountry`.
   */
  shipping: AccountAPI.Money | null;
}

export interface ProductListGamesResponse {
  /**
   * All games CardNexus tracks.
   */
  data: Array<GameSummary>;
}

export interface ProductListGameExpansionsParams {
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
}

export interface ProductListGameExpansionsResponse {
  data: Array<ExpansionSummary>;
  pagination: ProductListGameExpansionsResponse.Pagination;
}

export namespace ProductListGameExpansionsResponse {
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

export interface ProductSearchParams {
  /**
   * Header param: The language to work in — `en`, `fr`, `it`, `es`, or `de`, with or without a region. Name searches match in that language where a translation exists, falling back to English. Defaults to English.
   */
  'Accept-Language'?: string;
  /**
   * Body param
   * @default 0
   * @minimum 0
   * @maximum 9007199254740991
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
   * Body param: Restrict results to a specific set of product ids (1–200). Useful for batch lookups when you already know which products you want.
   * @minItems 1
   * @maxItems 200
   */
  productIds?: Array<number | string>;
  /**
   * Body param: Restrict results to these expansions (1–200). Ids are returned by `GET /v1/games/{gameId}/expansions`.
   * @minItems 1
   * @maxItems 200
   */
  expansionId?: Array<number | string>;
  /**
   * Body param: Free-text search. Matches against the product name with relevance ranking — the closer the match, the higher the result. A print number before or after the name pins that print: `sephiroth 44` returns the Sephiroth numbered 44 first. An expansion code plus print number pins a single card: `msh-54`, `msh 54`, and `msh54` all return card 54 of the expansion coded MSH. Send an `Accept-Language` header to search names in another language.
   * @minLength 1
   */
  name?: string;
  /**
   * Body param: Return only products with this print number, matched exactly ignoring case — `232`, `038`, `ST02-44`. Combine with `expansionId` to pin a single printing.
   * @minLength 1
   */
  printNumber?: string;
  /**
   * Body param: Exact match against the product's `nameSlug`, ignoring case — every printing of that card, across expansions. Slugs come back on every product in `nameSlug`.
   * @minLength 1
   */
  nameSlug?: string;
  /**
   * Body param: Restrict results to products carrying any of these Cardmarket product ids (1–200), returned with full details. Use this to fetch details for ids you already know; to turn a list of ids into products and learn which ones don't match, use `POST /v1/products/resolve`.
   * @minItems 1
   * @maxItems 200
   */
  cardmarketId?: Array<number>;
  /**
   * Body param: Restrict results to products carrying any of these TCGplayer product ids (1–200), returned with full details. To turn a list of ids into products and learn which ones don't match, use `POST /v1/products/resolve`.
   * @minItems 1
   * @maxItems 200
   */
  tcgplayerId?: Array<number>;
  /**
   * Body param: Restrict to one or more product types — `{ op: "or", values: ["card"] }` for cards only.
   */
  productType?: ProductSearchParams.ProductType;
  /**
   * Body param: Restrict to a single sealed-product category (e.g. `booster_box`, `bundle`). Only meaningful when filtering on `sealed`.
   */
  productCategory?: string;
  /**
   * Body param: Restrict to a single game, and optionally filter on that game's own attributes (rarity, color, …). Pass `{ "game": "mtg" }` for any MTG product, or add `filters: { rarity: { op: "or", values: ["mythic"] } }` to narrow further. To narrow to expansions, use `expansionId`.
   */
  gameFilters?:
    | ProductSearchParams.Sorcery
    | ProductSearchParams.Lorcana
    | ProductSearchParams.MagicTheGathering
    | ProductSearchParams.FleshAndBlood
    | ProductSearchParams.PokMon
    | ProductSearchParams.Wankul
    | ProductSearchParams.OnePiece
    | ProductSearchParams.YuGiOh
    | ProductSearchParams.Rise
    | ProductSearchParams.Riftbound
    | ProductSearchParams.Drakerion
    | ProductSearchParams.Cyberpunk
    | ProductSearchParams.PokMonJapan
    | ProductSearchParams.StarWarsUnlimited
    | ProductSearchParams.ExampleGame
    | ProductSearchParams.NarutoMythos
    | ProductSearchParams.GrandArchive
    | ProductSearchParams.EchoesOfAstra
    | ProductSearchParams.DragonBallSuperFusionWorld
    | ProductSearchParams.DragonBallSuperMasters
    | ProductSearchParams.GundamCardGame
    | ProductSearchParams.ChronoCore
    | ProductSearchParams.PalworldTcg
    | ProductSearchParams.AzukiTcg;
  /**
   * Body param: Search against live marketplace listings. Sending this object — even empty — adds an `availability` block to every result carrying the cheapest listing you can buy under these filters. Not accepted together with `cardmarketId`, `tcgplayerId`, or `sortBy: releaseDate`.
   */
  listings?: ProductSearchParams.Listings;
  /**
   * Body param: Field to sort by. Defaults to `printNumber` within an expansion, otherwise `name`.
   */
  sortBy?: 'printNumber' | 'name' | 'releaseDate';
  /**
   * Body param: Sort direction. Defaults to `asc`.
   */
  sortDirection?: 'asc' | 'desc';
}

export namespace ProductSearchParams {
  export interface ProductType {
    op: 'and' | 'or';
    values: Array<'card' | 'sealed'>;
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

  export interface Listings {
    /**
     * Keep only listings from sellers who ship to this country, as an ISO 3166-1 alpha-2 code. This is the same rule checkout applies, so a listing that comes back here can be added to your cart.
     * @minLength 2
     * @maxLength 2
     */
    deliveryCountry?: string;
    /**
     * When true, return only products with at least one matching listing. Defaults to false, which returns every product matching your catalogue filters and reports `availability.inStock` for each.
     */
    inStock?: boolean;
    /**
     * Keep only listings in any of these conditions.
     * @minItems 1
     */
    condition?: Array<PricingAPI.CardCondition>;
    /**
     * Keep only listings in any of these languages, as ISO 639 codes.
     * @minItems 1
     */
    language?: Array<string>;
    /**
     * Keep only listings in any of these finishes.
     * @minItems 1
     */
    finish?: Array<
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
}

export interface ProductSearchResponse {
  data: Array<CardProduct | SealedProduct>;
  pagination: ProductSearchResponse.Pagination;
}

export namespace ProductSearchResponse {
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

export type ProductRetrieveResponse =
  | ProductRetrieveResponse.CardProductDetail
  | ProductRetrieveResponse.SealedProductDetail;

export namespace ProductRetrieveResponse {
  export interface CardProductDetail {
    /**
     * The product's identifier. Stable number — pass it back to address this product elsewhere.
     * @minimum -9007199254740991
     * @maximum 9007199254740991
     */
    id: number;
    /**
     * The game this product belongs to (e.g. `mtg`, `pokemon`).
     */
    gameId: string;
    /**
     * A compact game reference — enough to show the game alongside a product without a separate call to `GET /v1/games/{gameId}`.
     */
    game: EmbeddedGame;
    /**
     * The product's display name.
     */
    name: string;
    /**
     * URL-friendly slug derived from the product name, unique within its game. Useful as a stable lookup key.
     */
    nameSlug: string;
    /**
     * Languages this product was printed in, as ISO 639 codes (e.g. `en`, `fr`, `ja`).
     */
    languages: Array<string>;
    /**
     * IDs this product carries on other marketplaces and card databases. Use these to bridge with existing Cardmarket / TCGplayer integrations or external card data sources.
     */
    externalIds: ExternalIDs;
    productType: 'card';
    /**
     * The finishes this card was printed in (e.g. `Standard`, `Foil`, `Reverse Holo`).
     */
    finishes: Array<
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
    /**
     * Current market prices keyed by finish — up to three blocks per finish: `cardmarket` (EUR), `tcgplayer` (USD), and `cardnexus` (listings live on the CardNexus marketplace). Only finishes with pricing data are present — missing keys mean there's no price for that finish yet. An empty object means the card has no pricing data at all.
     */
    pricesByFinish: Record<string, PricingAPI.FinishPriceBlocks>;
    /**
     * Game-specific attributes (e.g. MTG mana cost and colors, Pokémon HP and types). Schema varies by game; the values reflect what's stored on the catalogue entry.
     */
    attributes: Record<string, unknown>;
    /**
     * The expansion this product belongs to. Absent for products that aren't tied to a single set.
     * @minimum -9007199254740991
     * @maximum 9007199254740991
     */
    expansionId?: OffersAPI.CatalogID;
    /**
     * Compact expansion reference. Absent for products not tied to a single set.
     */
    expansion?: EmbeddedExpansion;
    /**
     * URL of the product's primary image (front face for cards).
     * @format uri
     */
    imageUrl?: string;
    /**
     * What you can buy on the CardNexus marketplace for this product under the `listings` filters you sent. Present only when the request carried a `listings` object.
     */
    availability?: CardProductDetail.Availability;
    /**
     * The card's print number within its expansion (e.g. `001/271`, `38/91`). String, not numeric — formats vary by game.
     */
    printNumber?: string;
    /**
     * Variant identifier when a card has multiple printings within the same expansion (e.g. `borderless`, `extended-art`, `showcase`, `promo`).
     */
    variant?: string;
    /**
     * The card's rarity. Values are game-specific (e.g. `common`, `uncommon`, `rare`, `mythic` for MTG; `common`, `uncommon`, `rare`, `holo-rare`, `secret-rare` for Pokémon).
     */
    rarity?: string | null;
    /**
     * URL of the card's back image. Present for double-faced cards (MTG) and similar.
     * @format uri
     */
    imageBackUrl?: string;
  }

  export namespace CardProductDetail {
    export interface Availability {
      /**
       * True when at least one listing matches your filters.
       */
      inStock: boolean;
      /**
       * How many listings match your filters.
       * @minimum 0
       * @maximum 9007199254740991
       */
      listingCount: number;
      /**
       * The cheapest matching listing, compared on `priceEur`. `null` when nothing matches.
       */
      cheapest: Availability.Cheapest | null;
    }

    export namespace Availability {
      export interface Cheapest {
        /**
         * The listing's identifier. Pass it to `POST /v1/cart/items` to buy this copy, or to `GET /v1/products/{productId}/listings` to see it alongside the rest.
         */
        listingId: string;
        /**
         * Price per unit, in the seller's own currency.
         */
        price: Cheapest.Price;
        /**
         * The same price converted to euros. Listings are compared on this value, so it is the one to sort or compare across sellers trading in different currencies.
         */
        priceEur: Cheapest.PriceEur;
        /**
         * Units available on this listing.
         * @minimum -9007199254740991
         * @maximum 9007199254740991
         * @exclusiveMinimum 0
         */
        quantity: number;
        /**
         * The card's finish.
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
         * The card's condition. `null` for a graded card, whose grade replaces the condition scale.
         */
        condition: PricingAPI.CardCondition | null;
        /**
         * The card's language, as an ISO 639 code.
         */
        language: string | null;
        /**
         * The seller behind this listing.
         */
        seller: Cheapest.Seller;
      }

      export namespace Cheapest {
        export interface Price {
          /**
           * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
           */
          amount: number;
          currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
        }

        export interface PriceEur {
          /**
           * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
           */
          amount: number;
          currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
        }

        export interface Seller {
          /**
           * The seller's identifier.
           */
          id: string;
          /**
           * The seller's public username.
           */
          username: string;
          /**
           * The seller's country, as an ISO 3166-1 alpha-2 code.
           */
          country: string;
          /**
           * `pro` if the seller trades as a registered company, `individual` if as a private person.
           */
          type: 'pro' | 'individual';
        }
      }
    }
  }

  export interface SealedProductDetail {
    /**
     * The product's identifier. Stable number — pass it back to address this product elsewhere.
     * @minimum -9007199254740991
     * @maximum 9007199254740991
     */
    id: number;
    /**
     * The game this product belongs to (e.g. `mtg`, `pokemon`).
     */
    gameId: string;
    /**
     * A compact game reference — enough to show the game alongside a product without a separate call to `GET /v1/games/{gameId}`.
     */
    game: EmbeddedGame;
    /**
     * The product's display name.
     */
    name: string;
    /**
     * URL-friendly slug derived from the product name, unique within its game. Useful as a stable lookup key.
     */
    nameSlug: string;
    /**
     * Languages this product was printed in, as ISO 639 codes (e.g. `en`, `fr`, `ja`).
     */
    languages: Array<string>;
    /**
     * IDs this product carries on other marketplaces and card databases. Use these to bridge with existing Cardmarket / TCGplayer integrations or external card data sources.
     */
    externalIds: ExternalIDs;
    productType: 'sealed';
    /**
     * What kind of sealed product this is (e.g. `booster_box`, `booster_pack`, `bundle`, `prerelease_kit`, `commander_deck`, `starter_deck`).
     */
    productCategory: string;
    /**
     * Current market prices — `cardmarket` (EUR), `tcgplayer` (USD), and `cardnexus` (live marketplace listings) blocks. A sealed product has a single price (no per-finish split).
     */
    prices: SealedProductDetail.Prices;
    /**
     * The expansion this product belongs to. Absent for products that aren't tied to a single set.
     * @minimum -9007199254740991
     * @maximum 9007199254740991
     */
    expansionId?: OffersAPI.CatalogID;
    /**
     * Compact expansion reference. Absent for products not tied to a single set.
     */
    expansion?: EmbeddedExpansion;
    /**
     * URL of the product's primary image (front face for cards).
     * @format uri
     */
    imageUrl?: string;
    /**
     * What you can buy on the CardNexus marketplace for this product under the `listings` filters you sent. Present only when the request carried a `listings` object.
     */
    availability?: SealedProductDetail.Availability;
    /**
     * When the sealed product was released (ISO 8601, UTC).
     * @format date-time
     */
    releaseDate?: OffersAPI.DateString;
  }

  export namespace SealedProductDetail {
    export interface Prices {
      /**
       * Cardmarket's daily price snapshot, in EUR. Absent when Cardmarket has no price.
       */
      cardmarket?: Prices.Cardmarket;
      /**
       * TCGplayer's daily price snapshot, in USD. Absent when TCGplayer has no price.
       */
      tcgplayer?: Prices.Tcgplayer;
      /**
       * Live CardNexus marketplace listings — the EUR-converted floor across every region, plus per-region prices (`eu` in EUR, `na` in USD). Absent when there's no live listing in stock.
       */
      cardnexus?: Prices.Cardnexus;
    }

    export namespace Prices {
      export interface Cardmarket {
        /**
         * The currency every price in this block is in: `EUR` for `cardmarket`, `USD` for `tcgplayer`.
         */
        currency: 'EUR' | 'USD';
        /**
         * Lowest observed price, decimal major units.
         */
        low?: number;
        /**
         * Median observed price, decimal major units.
         */
        mid?: number;
        /**
         * Highest observed price, decimal major units.
         */
        high?: number;
        /**
         * Aggregate market price — the value shown as the canonical price on cardnexus.com. Decimal major units.
         */
        marketValue?: number;
        /**
         * Percent change of `marketValue` vs. 24 hours ago. `null` when there's not enough history.
         */
        change24h?: number | null;
        /**
         * Percent change of `marketValue` vs. 7 days ago.
         */
        change7d?: number | null;
        /**
         * Percent change of `marketValue` vs. 30 days ago.
         */
        change30d?: number | null;
        /**
         * Per-condition price detail (`NM`, `LP`, `MP`, `HP`, `DMG`), present when condition-level data is available for this marketplace.
         */
        byCondition?: Record<string, Cardmarket.ByCondition>;
      }

      export namespace Cardmarket {
        export interface ByCondition {
          /**
           * Lowest observed price for this group, decimal major units.
           */
          low?: number;
          /**
           * How many listings are in this group.
           * @minimum -9007199254740991
           * @maximum 9007199254740991
           */
          listingCount?: number;
          /**
           * Total quantity across those listings.
           * @minimum -9007199254740991
           * @maximum 9007199254740991
           */
          availableQuantity?: number;
          /**
           * The same numbers per card language (two-letter code, e.g. `en`, `de`).
           */
          byLanguage?: Record<string, ByCondition.ByLanguage>;
        }

        export namespace ByCondition {
          export interface ByLanguage {
            /**
             * Lowest observed price for this group, decimal major units.
             */
            low?: number;
            /**
             * How many listings are in this group.
             * @minimum -9007199254740991
             * @maximum 9007199254740991
             */
            listingCount?: number;
            /**
             * Total quantity across those listings.
             * @minimum -9007199254740991
             * @maximum 9007199254740991
             */
            availableQuantity?: number;
          }
        }
      }

      export interface Tcgplayer {
        /**
         * The currency every price in this block is in: `EUR` for `cardmarket`, `USD` for `tcgplayer`.
         */
        currency: 'EUR' | 'USD';
        /**
         * Lowest observed price, decimal major units.
         */
        low?: number;
        /**
         * Median observed price, decimal major units.
         */
        mid?: number;
        /**
         * Highest observed price, decimal major units.
         */
        high?: number;
        /**
         * Aggregate market price — the value shown as the canonical price on cardnexus.com. Decimal major units.
         */
        marketValue?: number;
        /**
         * Percent change of `marketValue` vs. 24 hours ago. `null` when there's not enough history.
         */
        change24h?: number | null;
        /**
         * Percent change of `marketValue` vs. 7 days ago.
         */
        change7d?: number | null;
        /**
         * Percent change of `marketValue` vs. 30 days ago.
         */
        change30d?: number | null;
        /**
         * Per-condition price detail (`NM`, `LP`, `MP`, `HP`, `DMG`), present when condition-level data is available for this marketplace.
         */
        byCondition?: Record<string, Tcgplayer.ByCondition>;
      }

      export namespace Tcgplayer {
        export interface ByCondition {
          /**
           * Lowest observed price for this group, decimal major units.
           */
          low?: number;
          /**
           * How many listings are in this group.
           * @minimum -9007199254740991
           * @maximum 9007199254740991
           */
          listingCount?: number;
          /**
           * Total quantity across those listings.
           * @minimum -9007199254740991
           * @maximum 9007199254740991
           */
          availableQuantity?: number;
          /**
           * The same numbers per card language (two-letter code, e.g. `en`, `de`).
           */
          byLanguage?: Record<string, ByCondition.ByLanguage>;
        }

        export namespace ByCondition {
          export interface ByLanguage {
            /**
             * Lowest observed price for this group, decimal major units.
             */
            low?: number;
            /**
             * How many listings are in this group.
             * @minimum -9007199254740991
             * @maximum 9007199254740991
             */
            listingCount?: number;
            /**
             * Total quantity across those listings.
             * @minimum -9007199254740991
             * @maximum 9007199254740991
             */
            availableQuantity?: number;
          }
        }
      }

      export interface Cardnexus {
        /**
         * The cheapest live listing for this finish anywhere on the marketplace, converted to EUR at the current exchange rate. For prices as sellers quote them, use `regions`.
         */
        low: Cardnexus.Low;
        /**
         * How many live listings the finish has, across every region.
         * @minimum -9007199254740991
         * @maximum 9007199254740991
         */
        listingCount: number;
        /**
         * Total quantity for sale across those listings.
         * @minimum -9007199254740991
         * @maximum 9007199254740991
         */
        availableQuantity: number;
        /**
         * The same numbers per market region, keyed `eu` and `na`, each in its region's currency — `eu` prices are never mixed with `na` prices. A region with no live listings has no key.
         */
        regions: Record<string, Cardnexus.Regions>;
      }

      export namespace Cardnexus {
        export interface Low {
          /**
           * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
           */
          amount: number;
          currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
        }

        export interface Regions {
          /**
           * The currency every one of this region's prices is in: `EUR` for `eu`, `USD` for `na`. Listings from sellers in the region priced in another currency are converted into it at the current exchange rate.
           */
          currency: 'EUR' | 'USD';
          /**
           * The cheapest live listing from sellers in this region, as a decimal amount in the region's currency.
           */
          low: number;
          /**
           * How many live listings sellers in this region have.
           * @minimum -9007199254740991
           * @maximum 9007199254740991
           */
          listingCount: number;
          /**
           * Total quantity for sale across those listings.
           * @minimum -9007199254740991
           * @maximum 9007199254740991
           */
          availableQuantity: number;
          /**
           * The same three numbers per card condition (`NM`, `LP`, `MP`, `HP`, `DMG`). Graded listings count toward the region's totals but have no condition bucket, so the condition buckets can add up to less than the region totals.
           */
          byCondition: Record<string, Regions.ByCondition>;
        }

        export namespace Regions {
          export interface ByCondition {
            /**
             * The cheapest live listing, as a decimal amount in the region's currency (e.g. `42.50` is €42.50 in `eu`).
             */
            low: number;
            /**
             * How many live listings are in this group.
             * @minimum -9007199254740991
             * @maximum 9007199254740991
             */
            listingCount: number;
            /**
             * Total quantity for sale across those listings.
             * @minimum -9007199254740991
             * @maximum 9007199254740991
             */
            availableQuantity: number;
            /**
             * The same three numbers per card language (two-letter code, e.g. `en`, `de`). A listing without a stored language counts toward the condition's totals but has no language bucket, so the language buckets can add up to less than the condition totals.
             */
            byLanguage: Record<string, ByCondition.ByLanguage>;
          }

          export namespace ByCondition {
            export interface ByLanguage {
              /**
               * The cheapest live listing, as a decimal amount in the region's currency (e.g. `42.50` is €42.50 in `eu`).
               */
              low: number;
              /**
               * How many live listings are in this group.
               * @minimum -9007199254740991
               * @maximum 9007199254740991
               */
              listingCount: number;
              /**
               * Total quantity for sale across those listings.
               * @minimum -9007199254740991
               * @maximum 9007199254740991
               */
              availableQuantity: number;
            }
          }
        }
      }
    }

    export interface Availability {
      /**
       * True when at least one listing matches your filters.
       */
      inStock: boolean;
      /**
       * How many listings match your filters.
       * @minimum 0
       * @maximum 9007199254740991
       */
      listingCount: number;
      /**
       * The cheapest matching listing, compared on `priceEur`. `null` when nothing matches.
       */
      cheapest: Availability.Cheapest | null;
    }

    export namespace Availability {
      export interface Cheapest {
        /**
         * The listing's identifier. Pass it to `POST /v1/cart/items` to buy this copy, or to `GET /v1/products/{productId}/listings` to see it alongside the rest.
         */
        listingId: string;
        /**
         * Price per unit, in the seller's own currency.
         */
        price: Cheapest.Price;
        /**
         * The same price converted to euros. Listings are compared on this value, so it is the one to sort or compare across sellers trading in different currencies.
         */
        priceEur: Cheapest.PriceEur;
        /**
         * Units available on this listing.
         * @minimum -9007199254740991
         * @maximum 9007199254740991
         * @exclusiveMinimum 0
         */
        quantity: number;
        /**
         * The card's finish.
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
         * The card's condition. `null` for a graded card, whose grade replaces the condition scale.
         */
        condition: PricingAPI.CardCondition | null;
        /**
         * The card's language, as an ISO 639 code.
         */
        language: string | null;
        /**
         * The seller behind this listing.
         */
        seller: Cheapest.Seller;
      }

      export namespace Cheapest {
        export interface Price {
          /**
           * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
           */
          amount: number;
          currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
        }

        export interface PriceEur {
          /**
           * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
           */
          amount: number;
          currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
        }

        export interface Seller {
          /**
           * The seller's identifier.
           */
          id: string;
          /**
           * The seller's public username.
           */
          username: string;
          /**
           * The seller's country, as an ISO 3166-1 alpha-2 code.
           */
          country: string;
          /**
           * `pro` if the seller trades as a registered company, `individual` if as a private person.
           */
          type: 'pro' | 'individual';
        }
      }
    }
  }
}

export interface ProductListListingsParams {
  cursor?: string;
  /**
   * @default 50
   * @minimum 1
   * @maximum 100
   */
  limit?: number;
  /**
   * Return only listings in any of these conditions: `NM`, `LP`, `MP`, `HP`, or `DMG`. Repeat the parameter to pass several, e.g. `?condition=NM&condition=LP`.
   */
  condition?: Array<PricingAPI.CardCondition>;
  /**
   * Return only listings in any of these languages, as two-letter codes, e.g. `en`. Repeat the parameter to pass several, e.g. `?language=en&language=fr`.
   */
  language?: Array<string>;
  /**
   * Return only listings with any of these finishes, e.g. `Standard`, `Foil`, `Reverse Holo`. Repeat the parameter to pass several, e.g. `?finish=Foil&finish=Etched`.
   */
  finish?: Array<
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
  /**
   * Return only listings from sellers in this region: `eu` or `na`.
   */
  region?: 'eu' | 'na';
  /**
   * Your delivery country as a two-letter ISO 3166-1 alpha-2 code, e.g. `FR`. When set, only listings from sellers who ship there are returned, and each listing carries the seller's shipping charge.
   * @minLength 2
   * @maxLength 2
   */
  deliveryCountry?: string;
}

export interface ProductListListingsResponse {
  data: Array<ProductListing>;
  pagination: ProductListListingsResponse.Pagination;
}

export namespace ProductListListingsResponse {
  export interface Pagination {
    nextCursor: string | null;
  }
}

export interface ProductResolveParams {
  /**
   * Which marketplace your ids come from. `cardmarket` matches a Cardmarket product id (the `idProduct` in a Cardmarket stock file); `tcgplayer` matches a TCGplayer product id.
   */
  marketplace: 'cardmarket' | 'tcgplayer';
  /**
   * The marketplace product ids to look up. 1–200 per call.
   * @minItems 1
   * @maxItems 200
   */
  ids: Array<number>;
}

export interface ProductResolveResponse {
  /**
   * One entry per requested id, in the order you sent them. Ids with no match come back with `product: null` so you can build a complete mapping in one call.
   */
  results: Array<ProductResolveResponse.Result>;
}

export namespace ProductResolveResponse {
  export interface Result {
    /**
     * The marketplace id you asked about.
     * @minimum -9007199254740991
     * @maximum 9007199254740991
     */
    externalId: number;
    /**
     * The matching product, or `null` when no catalogue product carries this marketplace id.
     */
    product: Result.Product | null;
  }

  export namespace Result {
    export interface Product {
      /**
       * The matching CardNexus product's identifier. Stable number — pass it back to address the product elsewhere, e.g. as the `productId` in a bulk import row.
       * @minimum -9007199254740991
       * @maximum 9007199254740991
       */
      id: number;
      /**
       * The product's display name.
       */
      name: string;
      /**
       * The game this product belongs to (e.g. `mtg`, `pokemon`).
       */
      gameId: string;
      /**
       * The expansion this product belongs to, or `null` when it isn't tied to a single set.
       * @minimum -9007199254740991
       * @maximum 9007199254740991
       */
      expansionId: OffersAPI.CatalogID | null;
      /**
       * The finish this marketplace id maps to (e.g. `Standard`, `Foil`). A marketplace id is finish-specific, so the same card's Foil and Standard printings carry different ids.
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
    }
  }
}
export declare namespace Products {
  export {
    type GameSummary as GameSummary,
    type ExpansionSummary as ExpansionSummary,
    type CardProduct as CardProduct,
    type SealedProduct as SealedProduct,
    type CardProductDetail as CardProductDetail,
    type SealedProductDetail as SealedProductDetail,
    type ProductListing as ProductListing,
    type EmbeddedGame as EmbeddedGame,
    type EmbeddedExpansion as EmbeddedExpansion,
    type ExternalIDs as ExternalIDs,
    type ListingSeller as ListingSeller,
    type ProductListGamesResponse as ProductListGamesResponse,
    type ProductListGameExpansionsResponse as ProductListGameExpansionsResponse,
    type ProductSearchResponse as ProductSearchResponse,
    type ProductRetrieveResponse as ProductRetrieveResponse,
    type ProductListListingsResponse as ProductListListingsResponse,
    type ProductResolveResponse as ProductResolveResponse,
    type ProductListGameExpansionsParams as ProductListGameExpansionsParams,
    type ProductSearchParams as ProductSearchParams,
    type ProductListListingsParams as ProductListListingsParams,
    type ProductResolveParams as ProductResolveParams,
  };
}
