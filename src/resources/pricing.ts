// File generated from our OpenAPI spec by Scalar. See README.md for details.

import { APIResource } from '../resource';
import { APIPromise } from '../api-promise';
import type { RequestOptions } from '../internal/request-options';
import { path as __scalarPath } from '../internal/utils/path';

export class Pricing extends APIResource {
  /**
   * Returns the product's current prices from three sources, keyed by finish:
   *
   * - `cardmarket` — Cardmarket's daily price snapshot, in EUR: `low`/`mid`/`high`/`marketValue` tiers plus 24h/7d/30d trend percentages.
   * - `tcgplayer` — TCGplayer's daily price snapshot, in USD, with the same fields.
   * - `cardnexus` — the listings live on the CardNexus marketplace right now. `low` is the cheapest listing anywhere on the marketplace, converted to EUR at the current exchange rate; `listingCount` and `availableQuantity` count every region's listings. `regions` breaks the same numbers down per market region — `eu` in EUR and `na` in USD, each with its own cheapest listing, counts, and per-condition / per-language breakdowns. A region's prices are in that region's currency and never mixed with the other region's. A region with no live listings has no key. Graded listings count toward the totals but have no condition bucket.
   *
   * A source block is absent when it has no data — a finish with no live listings has no `cardnexus` block, and a product with no prices at all returns an empty `pricesByFinish` object.
   *
   * For day-by-day price history, see `GET /v1/products/{productId}/prices/history`. To download prices for a whole game in one file, see `GET /v1/feeds/{gameId}/prices`.
   *
   * Requests count against the `pricing-snapshot` rate limit: 600 requests per hour.
   *
   * Authentication is required (any valid API key); no scope.
   *
   * @param {string} productID - The product to get prices for. Returned by `GET /v1/products` and `POST /v1/products/search`.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<PricingListProductPricesResponse>} Current prices returned.
   *
   * @example
   * ```ts
   * const pricing = await client.pricing.listProductPrices('productId');
   * ```
   */
  listProductPrices(
    productID: string,
    options?: RequestOptions,
  ): APIPromise<PricingListProductPricesResponse> {
    return this._client.get(__scalarPath`/products/${productID}/prices`, options);
  }

  /**
   * Returns the product's daily price snapshots from Cardmarket (EUR) and TCGplayer (USD), one entry per day, marketplace, and finish, ordered by date ascending.
   *
   * Each entry carries the day's `low`/`mid`/`high`/`marketValue` tiers. Days without a snapshot are absent from the result.
   *
   * Narrow the result with `marketplace` and `finish`. `from` and `to` bound the range (both inclusive): `to` defaults to today, `from` to 30 days before `to`, and a single request can span at most 365 days.
   *
   * For the current price including live CardNexus listings, see `GET /v1/products/{productId}/prices`.
   *
   * Requests count against the `pricing-history` rate limit: 120 requests per hour.
   *
   * Authentication is required (any valid API key); no scope.
   *
   * @param {string} productID - The product to get price history for. Returned by `GET /v1/products` and `POST /v1/products/search`.
   * @param {PricingListHistoryParams} [query] - The parameters to send with the request.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<PricingListHistoryResponse>} Price history returned.
   *
   * @example
   * ```ts
   * const pricing = await client.pricing.listHistory('productId');
   * ```
   */
  listHistory(
    productID: string,
    query: PricingListHistoryParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<PricingListHistoryResponse> {
    return this._client.get(__scalarPath`/products/${productID}/prices/history`, { query, ...options });
  }

  /**
   * Returns the product's sales on the CardNexus marketplace from the last 30 days, as a cursor-paginated list. There are no date parameters — the 30-day window is fixed.
   *
   * A sale appears as soon as its order is placed, including orders still being shipped or delivered. If the order is later cancelled or refunded in full, the sale no longer appears.
   *
   * Each sale carries the card's finish, condition (or grading), language, the quantity sold, the seller's market region (`eu` or `na`), and two prices: `price`, the per-card price the card was listed at in the listing's own currency, and `priceEur`, the same price converted to EUR at the exchange rate of the sale date. Sales carry no buyer or seller identifiers.
   *
   * The list is ordered by `soldAt`, newest first. Narrow the result with `finish`, `condition`, and `language`. A page can hold slightly more entries than `limit` when one order contained several matching cards.
   *
   * Walk the list by following `pagination.nextCursor`: pass it back as `cursor` until it comes back `null`. `limit` defaults to 50, maximum 100.
   *
   * Requests count against the `product-sales` rate limit: 60 requests per hour.
   *
   * Authentication is required (any valid API key); no scope.
   *
   * @param {string} productID - The product to list sales for. Returned by `GET /v1/products` and `POST /v1/products/search`.
   * @param {PricingListSalesParams} [query] - The parameters to send with the request.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<PricingListSalesResponse>} Recent sales returned.
   *
   * @example
   * ```ts
   * const pricing = await client.pricing.listSales('productId', {
   *   limit: 50,
   * });
   * ```
   */
  listSales(
    productID: string,
    query: PricingListSalesParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<PricingListSalesResponse> {
    return this._client.get(__scalarPath`/products/${productID}/sales`, { query, ...options });
  }
}

/**
 * Up to three price blocks, keyed by source.
 */
export interface FinishPriceBlocks {
  /**
   * Cardmarket's daily price snapshot, in EUR. Absent when Cardmarket has no price.
   */
  cardmarket?: FinishPriceBlocks.Cardmarket;
  /**
   * TCGplayer's daily price snapshot, in USD. Absent when TCGplayer has no price.
   */
  tcgplayer?: FinishPriceBlocks.Tcgplayer;
  /**
   * Live CardNexus marketplace listings — the EUR-converted floor across every region, plus per-region prices (`eu` in EUR, `na` in USD). Absent when there's no live listing in stock.
   */
  cardnexus?: FinishPriceBlocks.Cardnexus;
}

export namespace FinishPriceBlocks {
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

/**
 * Card condition: NM (Near Mint), LP (Lightly Played), MP (Moderately Played), HP (Heavily Played), DMG (Damaged).
 */
export type CardCondition = 'NM' | 'LP' | 'MP' | 'HP' | 'DMG';

export interface PricingListProductPricesResponse {
  /**
   * The product these prices belong to.
   * @minimum -9007199254740991
   * @maximum 9007199254740991
   */
  productId: number;
  /**
   * Prices keyed by finish (e.g. `Standard`, `Foil`) — the same values as the product's `finishes` array. Empty when the product has no prices and no live listings.
   */
  pricesByFinish: Record<string, FinishPriceBlocks>;
}

export interface PricingListHistoryParams {
  /**
   * Return only this marketplace's prices: `cardmarket` (EUR) or `tcgplayer` (USD). Omit for both.
   */
  marketplace?: 'cardmarket' | 'tcgplayer';
  /**
   * Return only this finish's prices, e.g. `Standard` or `Foil`. Omit for all finishes.
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
   * First day of the range, `YYYY-MM-DD`, inclusive. Defaults to 30 days before `to`.
   * @format date
   */
  from?: string;
  /**
   * Last day of the range, `YYYY-MM-DD`, inclusive. Defaults to today.
   * @format date
   */
  to?: string;
}

export interface PricingListHistoryResponse {
  /**
   * The product these prices belong to.
   * @minimum -9007199254740991
   * @maximum 9007199254740991
   */
  productId: number;
  /**
   * First day of the returned range, `YYYY-MM-DD`, inclusive.
   * @format date
   */
  from: string;
  /**
   * Last day of the returned range, `YYYY-MM-DD`, inclusive.
   * @format date
   */
  to: string;
  /**
   * One entry per day, marketplace, and finish that has a price, ordered by date ascending. Days without a snapshot are absent.
   */
  data: Array<PricingListHistoryResponse.Data>;
}

export namespace PricingListHistoryResponse {
  export interface Data {
    /**
     * The calendar date this price is for, `YYYY-MM-DD`.
     * @format date
     */
    date: string;
    /**
     * The marketplace this price comes from. `cardmarket` prices are in EUR, `tcgplayer` prices in USD.
     */
    marketplace: 'cardmarket' | 'tcgplayer';
    /**
     * The finish this price is for, e.g. `Standard` or `Foil`.
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
     * Lowest observed price that day, decimal major units.
     */
    low?: number;
    /**
     * Median observed price that day, decimal major units.
     */
    mid?: number;
    /**
     * Highest observed price that day, decimal major units.
     */
    high?: number;
    /**
     * Aggregate market price that day, decimal major units.
     */
    marketValue?: number;
  }
}

export interface PricingListSalesParams {
  cursor?: string;
  /**
   * @default 50
   * @minimum 1
   * @maximum 100
   */
  limit?: number;
  /**
   * Return only sales of this finish, e.g. `Standard` or `Foil`.
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
   * Return only sales of this condition: `NM`, `LP`, `MP`, `HP`, or `DMG`.
   */
  condition?: CardCondition;
  /**
   * Return only sales of this card language, as a two-letter code, e.g. `en`, `de`.
   * @minLength 1
   */
  language?: string;
}

export interface PricingListSalesResponse {
  data: Array<PricingListSalesResponse.Data>;
  pagination: PricingListSalesResponse.Pagination;
}

export namespace PricingListSalesResponse {
  export interface Data {
    /**
     * When the order was placed.
     * @format date-time
     */
    soldAt: string;
    /**
     * The seller's market region: `eu` or `na`.
     */
    region: 'eu' | 'na';
    /**
     * The per-card price the card was listed at, in the listing's own currency — the price as the seller quoted it.
     */
    price: Data.Price;
    /**
     * The same per-card price converted to EUR at the exchange rate of the sale date. Equal to `price` for EUR listings.
     */
    priceEur: Data.PriceEur;
    /**
     * How many copies the sale included.
     * @minimum -9007199254740991
     * @maximum 9007199254740991
     */
    quantity: number;
    /**
     * The card's finish, e.g. `Standard`, `Foil`, `Reverse Holo`.
     */
    finish: string;
    /**
     * The card's condition: `NM`, `LP`, `MP`, `HP`, or `DMG`. `null` when the card is graded.
     */
    condition: CardCondition | null;
    /**
     * The card's language as a two-letter code, e.g. `en`, `fr`.
     */
    language: string;
    /**
     * Grading details when the card is graded. `null` for raw cards.
     */
    graded: Data.Graded | null;
  }

  export namespace Data {
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

    export interface Graded {
      /**
       * The grade assigned by the grading company, as printed on the slab.
       */
      grade: string;
      /**
       * The grading company that graded the card, e.g. `PSA`, `BGS`, `CGC`. `null` when not recorded.
       */
      gradingService: string | null;
      /**
       * The certification number printed on the slab. `null` when the card does not carry one.
       */
      certification: string | null;
    }
  }

  export interface Pagination {
    nextCursor: string | null;
  }
}
export declare namespace Pricing {
  export {
    type FinishPriceBlocks as FinishPriceBlocks,
    type CardCondition as CardCondition,
    type PricingListProductPricesResponse as PricingListProductPricesResponse,
    type PricingListHistoryResponse as PricingListHistoryResponse,
    type PricingListSalesResponse as PricingListSalesResponse,
    type PricingListHistoryParams as PricingListHistoryParams,
    type PricingListSalesParams as PricingListSalesParams,
  };
}
