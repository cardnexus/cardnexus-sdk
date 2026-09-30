// File generated from our OpenAPI spec by Scalar. See README.md for details.

import { APIResource } from '../../resource';
import { APIPromise } from '../../api-promise';
import type { RequestOptions } from '../../internal/request-options';
import { path as __scalarPath } from '../../internal/utils/path';
import type * as PricingAPI from '../pricing';
import type * as AccountAPI from '../account/account';
import type * as ProductsAPI from '../products';
import type * as LinesAPI from '../lines';

export class Runs extends APIResource {
  /**
   * Optimizes a basket of cards into the cheapest / fewest-seller / balanced ways to buy them, accounting for each seller's shipping, fees and VAT.
   *
   * The run executes in the background: this call returns right away with a run id and `status: "queued"`. Poll `GET /v1/optimizer/runs/{id}` — the options' totals fill in as it solves, and the full per-seller breakdown is ready once `status` is `done`. Subscribe to the `optimizer.run.completed` webhook to avoid polling. When two modes yield the same solution, the result contains a single option whose `modes` lists both.
   *
   * Each target is either a specific printing (`productId`) or any printing of a card (`card` by slug). A basket holds up to 400 targets, in any mix of the two forms. Set per-target condition / finish / language, or `defaults` for the whole basket. Narrow the sellers by country, rating or an explicit include/exclude list.
   *
   * Rate limited to 10 runs per hour. Send an `Idempotency-Key` header to make retries safe.
   *
   * @param {RunCreateParams} body - The request body to send.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<RunCreateResponse>} Run accepted and queued.
   *
   * @example
   * ```ts
   * const run = await client.optimizer.runs.create({
   *   targets: [
   *     {
   *       quantity: 1,
   *     },
   *   ],
   *   destination: {
   *     country: 'xx',
   *   },
   * });
   * ```
   */
  create(body: RunCreateParams, options?: RequestOptions): APIPromise<RunCreateResponse> {
    return this._client.post('/optimizer/runs', { body, ...options });
  }

  /**
   * Returns the current state of a run — `status`, best-so-far option totals while `solving`, and the full per-seller breakdown once `done`.
   *
   * @param {string} id - The run id returned by `POST /v1/optimizer/runs`. Path parameter.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<RunRetrieveResponse>} Run returned.
   *
   * @example
   * ```ts
   * const run = await client.optimizer.runs.retrieve('id');
   * ```
   */
  retrieve(id: string, options?: RequestOptions): APIPromise<RunRetrieveResponse> {
    return this._client.get(__scalarPath`/optimizer/runs/${id}`, options);
  }

  /**
   * Replaces your cart with one of the run's options. Every line of the option goes into your cart exactly as proposed — listing and quantity — and anything already in your cart is removed. Cart prices are shown in each seller's listing currency, which can differ from the currency the run reports totals in. Unlike `POST /v1/cart/items`, which adds to what is already there, this replaces the whole cart in one step.
   *
   * The run must be `done` — a run that is still `queued` or `solving`, or that `failed`, returns `409 RUN_NOT_READY`. Pick the option by `mode` — `lowest_price`, `fewest_sellers`, or `balanced` — matching the `modes` of the run's `result.options`; a mode no option satisfies returns `404 OPTION_NOT_FOUND`.
   *
   * Your cart's delivery country becomes the run's destination country.
   *
   * Returns your updated cart, in the same shape as `GET /v1/cart`.
   *
   * Send an `Idempotency-Key` header to make retries safe: the same key returns the same response for 24 hours.
   *
   * Requires the `cart:write` scope.
   *
   * @param {string} id - The run id returned by `POST /v1/optimizer/runs`. Path parameter.
   * @param {RunApplyParams} body - The request body to send.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<Cart>} Cart replaced with the option.
   *
   * @example
   * ```ts
   * const cart = await client.optimizer.runs.apply('id', {
   *   mode: 'lowest_price',
   * });
   * ```
   */
  apply(id: string, body: RunApplyParams, options?: RequestOptions): APIPromise<Cart> {
    return this._client.post(__scalarPath`/optimizer/runs/${id}/apply`, { body, ...options });
  }
}

/**
 * A party's average review score and the number of reviews behind it.
 */
export interface OrderPartyRating {
  /**
   * Average review score from 1 to 5. `null` when there are no reviews yet.
   * @minimum 1
   * @maximum 5
   */
  average: number | null;
  /**
   * Number of reviews behind the average.
   * @minimum 0
   * @maximum 9007199254740991
   */
  count: number;
}

/**
 * Your shopping cart, grouped by seller. Adding items does not put them on hold — availability is checked at checkout.
 */
export interface Cart {
  /**
   * Where your order will ship, as a two-letter ISO 3166-1 alpha-2 code, set by `POST /v1/cart/items`. `null` while your cart is empty.
   */
  deliveryCountry: string | null;
  /**
   * Total units across every item in your cart.
   * @minimum -9007199254740991
   * @maximum 9007199254740991
   */
  itemCount: number;
  /**
   * Your cart's items, grouped by seller. Each group ships as its own parcel.
   */
  sellers: Array<CartSellerGroup>;
}

/**
 * Your cart's items from one seller. Each seller's items ship together as one parcel; the seller's shipping charge is under `seller.shipping`.
 */
export interface CartSellerGroup {
  /**
   * The seller behind a Marketplace listing.
   */
  seller: ProductsAPI.ListingSeller;
  /**
   * A monetary amount as a decimal in the currency's major unit paired with its currency code — `{ amount: 14.99, currency: "USD" }` means $14.99.
   */
  itemsSubtotal: AccountAPI.Money;
  /**
   * The items you are buying from this seller.
   */
  items: Array<CartItem>;
}

/**
 * One listing in your cart: the product it sells, the card's condition and language, how many units you are buying, and the price per unit. `unitPrice` is the price when you added the item — if the seller lowers their price your cart follows, and if they raise it the item is removed from your cart.
 */
export interface CartItem {
  /**
   * The listing this item comes from. Listing ids come from `GET /v1/products/{productId}/listings` and from the optimizer's run results.
   */
  listingId: string;
  /**
   * The catalogue product the listing sells.
   * @minimum -9007199254740991
   * @maximum 9007199254740991
   */
  productId: number;
  /**
   * The product's name.
   */
  productName: string;
  /**
   * The product's image. `null` when there is none.
   */
  imageUrl: string | null;
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
   * How many units of the listing are in your cart.
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
   * When you added the item to your cart.
   * @format date-time
   */
  addedAt: string;
}

export interface RunCreateParams {
  /**
   * The cards to optimize.
   * @minItems 1
   * @maxItems 400
   */
  targets: Array<RunCreateParams.Target>;
  destination: RunCreateParams.Destination;
  /**
   * Defaults applied to every target that doesn't set its own value.
   */
  defaults?: RunCreateParams.Defaults;
  sellers?: RunCreateParams.Sellers;
  options?: RunCreateParams.Options;
}

export namespace RunCreateParams {
  export interface Target {
    /**
     * Units wanted.
     * @minimum -9007199254740991
     * @maximum 9007199254740991
     * @exclusiveMinimum 0
     */
    quantity: number;
    /**
     * A specific printing to buy (catalogue id from `GET /v1/products`).
     */
    productId?: number | string;
    /**
     * Buy any printing of this card (by game + name slug); the optimizer picks the cheapest matching printing.
     */
    card?: Target.Card;
    /**
     * Minimum acceptable condition for this line (overrides `defaults`).
     */
    minCondition?: PricingAPI.CardCondition;
    /**
     * `standard` = base finish only, `foil` = any non-standard finish, `any` = no filter, or a specific finish.
     */
    finish?:
      | 'standard'
      | 'foil'
      | 'any'
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
     * Acceptable languages.
     */
    languages?: Array<
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
    /**
     * Ceiling on the unit price for this line.
     */
    maxUnitPrice?: AccountAPI.Money;
  }

  export namespace Target {
    export interface Card {
      gameSlug: string;
      nameSlug: string;
    }
  }

  export interface Destination {
    /**
     * Where the cards ship to — drives shipping and region.
     * @minLength 2
     * @maxLength 2
     */
    country: string;
    /**
     * Currency to report totals in; defaults to the region currency.
     */
    currency?: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
  }

  export interface Defaults {
    /**
     * Card condition: NM (Near Mint), LP (Lightly Played), MP (Moderately Played), HP (Heavily Played), DMG (Damaged).
     */
    minCondition?: PricingAPI.CardCondition;
    /**
     * `standard` = base finish only, `foil` = any non-standard finish, `any` = no filter, or a specific finish.
     */
    finish?:
      | 'standard'
      | 'foil'
      | 'any'
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
    languages?: Array<
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

  export interface Sellers {
    /**
     * Only sellers shipping from these countries.
     * @maxItems 250
     */
    countries?: Array<string>;
    /**
     * Restrict to only these sellers — up to 200.
     * @maxItems 200
     */
    include?: Array<string>;
    /**
     * Exclude these sellers — up to 200.
     * @maxItems 200
     */
    exclude?: Array<string>;
    proOnly?: boolean;
    /**
     * @minimum 0
     * @maximum 5
     */
    minRating?: number;
  }

  export interface Options {
    /**
     * Which options to compute. Defaults to all three.
     */
    modes?: Array<'lowest_price' | 'fewest_sellers' | 'balanced'>;
    /**
     * Fail the run if any target can't be fully sourced.
     */
    strictFullCoverage?: boolean;
  }
}

export interface RunCreateResponse {
  /**
   * The run's identifier; poll `GET /v1/optimizer/runs/{id}`.
   */
  id: string;
  /**
   * Lifecycle of a run: `queued` (accepted, not started) → `solving` (in progress) → `done` or `failed`.
   */
  status: 'queued' | 'solving' | 'done' | 'failed';
}

export interface RunRetrieveResponse {
  /**
   * The run's identifier.
   */
  id: string;
  /**
   * Lifecycle of a run: `queued` (accepted, not started) → `solving` (in progress) → `done` or `failed`.
   */
  status: 'queued' | 'solving' | 'done' | 'failed';
  /**
   * Best-so-far numbers while `solving`; absent once terminal.
   */
  progress?: RunRetrieveResponse.Progress;
  /**
   * The full result once `status` is `done`.
   */
  result?: RunRetrieveResponse.Result;
}

export namespace RunRetrieveResponse {
  export interface Progress {
    /**
     * 0..1 fraction of the sweep completed.
     * @minimum 0
     * @maximum 1
     */
    fraction: number;
    options: Array<Progress.Option>;
  }

  export namespace Progress {
    export interface Option {
      /**
       * The objectives this in-progress option satisfies.
       * @minItems 1
       */
      modes: Array<'lowest_price' | 'fewest_sellers' | 'balanced'>;
      /**
       * @minimum -9007199254740991
       * @maximum 9007199254740991
       */
      sellerCount: number;
      /**
       * A monetary amount as a decimal in the currency's major unit paired with its currency code — `{ amount: 14.99, currency: "USD" }` means $14.99.
       */
      total: AccountAPI.Money;
      /**
       * A monetary amount as a decimal in the currency's major unit paired with its currency code — `{ amount: 14.99, currency: "USD" }` means $14.99.
       */
      subtotal: AccountAPI.Money;
      /**
       * A monetary amount as a decimal in the currency's major unit paired with its currency code — `{ amount: 14.99, currency: "USD" }` means $14.99.
       */
      shipping: AccountAPI.Money;
    }
  }

  export interface Result {
    region: 'NA' | 'EU';
    /**
     * Currency all amounts are reported in.
     */
    currency: string;
    options: Array<Result.Option>;
    /**
     * Targets that could not be fully sourced.
     */
    unmet: Array<Result.Unmet>;
  }

  export namespace Result {
    export interface Option {
      /**
       * The objectives this option satisfies. When two modes produce the same solution, the run returns one option listing both.
       * @minItems 1
       */
      modes: Array<'lowest_price' | 'fewest_sellers' | 'balanced'>;
      /**
       * Number of distinct sellers (packages).
       * @minimum -9007199254740991
       * @maximum 9007199254740991
       */
      sellerCount: number;
      /**
       * Grand total the buyer pays.
       */
      total: Option.Total;
      /**
       * Cards subtotal across all sellers.
       */
      subtotal: Option.Subtotal;
      /**
       * Total shipping across all sellers.
       */
      shipping: Option.Shipping;
      /**
       * Once-per-order buyer fee.
       */
      buyerFee: Option.BuyerFee;
      /**
       * VAT collected at checkout.
       */
      vatCollected: Option.VatCollected;
      /**
       * Per-seller breakdown.
       */
      sellers: Array<Option.Seller>;
      /**
       * Estimated import VAT paid on delivery, present only when a seller's parcel exceeds the customs band.
       */
      vatAtDelivery?: AccountAPI.Money;
    }

    export namespace Option {
      export interface Total {
        /**
         * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
         */
        amount: number;
        currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
      }

      export interface Subtotal {
        /**
         * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
         */
        amount: number;
        currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
      }

      export interface Shipping {
        /**
         * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
         */
        amount: number;
        currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
      }

      export interface BuyerFee {
        /**
         * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
         */
        amount: number;
        currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
      }

      export interface VatCollected {
        /**
         * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
         */
        amount: number;
        currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
      }

      export interface Seller {
        /**
         * The seller for this package.
         */
        seller: Seller.Seller;
        /**
         * Cards subtotal from this seller.
         */
        itemsSubtotal: Seller.ItemsSubtotal;
        /**
         * Shipping charged by this seller.
         */
        shipping: Seller.Shipping;
        /**
         * VAT collected at checkout for this seller.
         */
        vat: Seller.Vat;
        /**
         * Shipping package size tier.
         */
        packageSize: string;
        items: Array<Seller.Item>;
      }

      export namespace Seller {
        export interface Seller {
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
          rating: OrderPartyRating;
        }

        export interface ItemsSubtotal {
          /**
           * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
           */
          amount: number;
          currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
        }

        export interface Shipping {
          /**
           * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
           */
          amount: number;
          currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
        }

        export interface Vat {
          /**
           * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
           */
          amount: number;
          currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
        }

        export interface Item {
          /**
           * Catalogue id of the printing to buy.
           * @minimum -9007199254740991
           * @maximum 9007199254740991
           */
          productId: number;
          /**
           * The seller listing fulfilling this item.
           */
          listingId: string;
          /**
           * Units bought from this listing.
           * @minimum -9007199254740991
           * @maximum 9007199254740991
           */
          quantity: number;
          /**
           * Price per unit.
           */
          unitPrice: Item.UnitPrice;
          /**
           * Card finish.
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
           * Card condition grade. `null` when the card is graded or the product is sealed.
           */
          condition: PricingAPI.CardCondition | null;
          /**
           * Card language.
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
        }

        export namespace Item {
          export interface UnitPrice {
            /**
             * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
             */
            amount: number;
            currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
          }
        }
      }
    }

    export interface Unmet {
      /**
       * 0-based index into the request's `targets`.
       * @minimum -9007199254740991
       * @maximum 9007199254740991
       */
      targetIndex: number;
      /**
       * @minimum -9007199254740991
       * @maximum 9007199254740991
       */
      requested: number;
      /**
       * @minimum -9007199254740991
       * @maximum 9007199254740991
       */
      sourced: number;
      reason:
        | 'no_listing'
        | 'none_ship_to_buyer'
        | 'none_meet_constraints'
        | 'insufficient_quantity'
        | 'below_seller_minimum'
        | 'available_in_other_region';
    }
  }
}

export interface RunApplyParams {
  /**
   * The run option to put in your cart: `lowest_price`, `fewest_sellers`, or `balanced`. Must appear in the `modes` of one of the run's `result.options`.
   */
  mode: 'lowest_price' | 'fewest_sellers' | 'balanced';
}
export declare namespace Runs {
  export {
    type OrderPartyRating as OrderPartyRating,
    type Cart as Cart,
    type CartSellerGroup as CartSellerGroup,
    type CartItem as CartItem,
    type RunCreateResponse as RunCreateResponse,
    type RunRetrieveResponse as RunRetrieveResponse,
    type RunCreateParams as RunCreateParams,
    type RunApplyParams as RunApplyParams,
  };
}
