// File generated from our OpenAPI spec by Scalar. See README.md for details.

import { APIResource } from '../resource';
import { APIPromise } from '../api-promise';
import type { RequestOptions } from '../internal/request-options';
import { path as __scalarPath } from '../internal/utils/path';

export class Offers extends APIResource {
  /**
   * Returns your sent and received offers, newest first by creation time.
   *
   * Filter by role, repeatable status, or creation timestamps. All roles and statuses are included by default.
   *
   * Follow pagination.nextCursor until it is null. The default limit is 50 and the maximum is 100.
   *
   * Each result is a summary; fetch an offer for its items and proposal history. Requires offers:read.
   *
   * @param {OfferListParams} [query] - The parameters to send with the request.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<OfferListResponse>} Offers returned.
   *
   * @example
   * ```ts
   * const offer = await client.offers.list({
   *   limit: 50,
   * });
   * ```
   */
  list(
    query: OfferListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<OfferListResponse> {
    return this._client.get('/offers', { query, ...options });
  }

  /**
   * Creates one offer for 1–1,000 distinct listings from one seller. Each item supplies only its listing ID and quantity. Supply either total in the listing currency or discountPercentage for the complete item subtotal. Per-item prices are not accepted.
   *
   * The whole request is validated before creation. Your cart is unchanged, and stock is reserved only on acceptance. An existing live offer with this seller returns 409 with its offerId; cancel an open offer explicitly before replacing it.
   *
   * The original subtotal must be at least 20 in the listing currency. Discounts may not exceed 40%; totals below 60% of the original subtotal or above the original subtotal return 422. The server allocates prices with the same rounding rules as the website; currentProposal.total is the resulting subtotal. You may make five creation requests per hour across your API credentials. Retries count toward this limit.
   *
   * Returns the offer summary. Send an optional Idempotency-Key to repeat the same response for 24 hours. Requires offers:write.
   *
   * @param {OfferCreateParams} body - The request body to send.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<OfferCreateResponse>} Offer returned.
   *
   * @example
   * ```ts
   * const offer = await client.offers.create({
   *   items: [{ listingId: '665f3a2b1c8d4e9f7a6b5c52', quantity: 2 }],
   *   total: { amount: 25, currency: 'EUR' },
   * });
   * ```
   */
  create(body: OfferCreateParams, options?: RequestOptions): APIPromise<OfferCreateResponse> {
    return this._client.post('/offers', { body, ...options });
  }

  /**
   * Returns your offer with every negotiated item and its proposal history.
   *
   * Proposals are ordered chronologically. Quantities and original listing prices remain fixed throughout the negotiation.
   *
   * Only the buyer and seller can access an offer; other accounts receive 404.
   *
   * The actions array lists operations currently available to you. Requires offers:read.
   *
   * @param {string} offerID - A stable, opaque offer ID.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<OfferRetrieveResponse>} Offer returned.
   *
   * @example
   * ```ts
   * const offer = await client.offers.retrieve('665f3a2b1c8d4e9f7a6b5c59');
   * ```
   */
  retrieve(offerID: string, options?: RequestOptions): APIPromise<OfferRetrieveResponse> {
    return this._client.get(__scalarPath`/offers/${offerID}`, options);
  }

  /**
   * Proposes a different total price for an open offer. You can counter only a proposal sent by the other participant.
   *
   * Supply either total in the offer currency or discountPercentage for the complete original item subtotal. Discounts may not exceed 40%. Item membership and quantities remain fixed; per-item prices are not accepted. The returned total includes the same rounding as the website.
   *
   * Set `proposalId` to `currentProposal.id` from GET /v1/offers/{offerId}. If a new price has arrived since you fetched the offer, the request returns `409 Conflict` without sending your counterproposal. Fetch the offer again and review the new price before responding.
   *
   * Buyer proposals count toward the marketplace limit. A buyer counter beyond the limit declines the offer and returns a proposal-limit error.
   *
   * Returns the updated summary. Supports an optional Idempotency-Key. Requires offers:write.
   *
   * @param {string} offerID - A stable, opaque offer ID.
   * @param {OfferCounterParams} body - The request body to send.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<OfferCounterResponse>} Offer returned.
   *
   * @example
   * ```ts
   * const offer = await client.offers.counter('665f3a2b1c8d4e9f7a6b5c59', {
   *   proposalId: '665f3a2b1c8d4e9f7a6b5c60',
   *   total: { amount: 26, currency: 'EUR' },
   * });
   * ```
   */
  counter(
    offerID: string,
    body: OfferCounterParams,
    options?: RequestOptions,
  ): APIPromise<OfferCounterResponse> {
    return this._client.post(__scalarPath`/offers/${offerID}/counter`, { body, ...options });
  }

  /**
   * Accepts the current price proposal and reserves its stock. You can accept only a proposal sent by the other participant.
   *
   * Set `proposalId` to `currentProposal.id` from GET /v1/offers/{offerId}. If the other participant has sent a new price since you fetched the offer, the request returns `409 Conflict` without accepting it. Fetch the offer again and review the new price before accepting.
   *
   * If stock cannot be reserved, acceptance fails and the offer remains open. Acceptance starts a 48-hour redemption window. It leaves your cart unchanged and does not create a paid order. The buyer adds the accepted offer to the cart separately.
   *
   * Returns the updated summary. Supports an optional Idempotency-Key. Requires offers:write.
   *
   * @param {string} offerID - A stable, opaque offer ID.
   * @param {OfferAcceptParams} body - The request body to send.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<OfferAcceptResponse>} Offer returned.
   *
   * @example
   * ```ts
   * const offer = await client.offers.accept('665f3a2b1c8d4e9f7a6b5c59', {
   *   proposalId: '665f3a2b1c8d4e9f7a6b5c60',
   * });
   * ```
   */
  accept(
    offerID: string,
    body: OfferAcceptParams,
    options?: RequestOptions,
  ): APIPromise<OfferAcceptResponse> {
    return this._client.post(__scalarPath`/offers/${offerID}/accept`, { body, ...options });
  }

  /**
   * Declines the current price proposal and closes the offer. You can decline only a proposal sent by the other participant.
   *
   * Set `proposalId` to `currentProposal.id` from GET /v1/offers/{offerId}. If a new price has arrived since you fetched the offer, the request returns `409 Conflict` without declining it. Fetch the offer again and review the new price before responding.
   *
   * The offer's proposal history remains available through GET /v1/offers/{offerId}.
   *
   * Returns the updated summary. Supports an optional Idempotency-Key. Requires offers:write.
   *
   * @param {string} offerID - A stable, opaque offer ID.
   * @param {OfferDeclineParams} body - The request body to send.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<OfferDeclineResponse>} Offer returned.
   *
   * @example
   * ```ts
   * const offer = await client.offers.decline('665f3a2b1c8d4e9f7a6b5c59', {
   *   proposalId: '665f3a2b1c8d4e9f7a6b5c60',
   * });
   * ```
   */
  decline(
    offerID: string,
    body: OfferDeclineParams,
    options?: RequestOptions,
  ): APIPromise<OfferDeclineResponse> {
    return this._client.post(__scalarPath`/offers/${offerID}/decline`, { body, ...options });
  }

  /**
   * Withdraws from a pending or countered negotiation.
   *
   * Either participant may cancel an open offer, including the participant who submitted its latest proposal.
   *
   * Closed offers cannot be cancelled through this operation. The proposal history remains available.
   *
   * Returns the updated summary. Supports an optional Idempotency-Key. Requires offers:write.
   *
   * @param {string} offerID - A stable, opaque offer ID.
   * @param {OfferCancelParams} [body] - The request body to send.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<OfferCancelResponse>} Offer returned.
   *
   * @example
   * ```ts
   * const offer = await client.offers.cancel('665f3a2b1c8d4e9f7a6b5c59');
   * ```
   */
  cancel(
    offerID: string,
    body: OfferCancelParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<OfferCancelResponse> {
    return this._client.post(__scalarPath`/offers/${offerID}/cancel`, { body, ...options });
  }

  /**
   * Restores an accepted offer's items into the buyer's cart at their agreed quantities. Only the buyer may call this operation.
   *
   * The offer must be accepted, unexpired, and unspent. Repeating the operation does not add the quantities again. Other cart items are preserved.
   *
   * After restoration, removing negotiated items or reducing their quantities below the agreement voids the offer. Failed restoration voids this offer and releases its reservation.
   *
   * Returns the offer summary; GET /v1/cart returns cart contents. Supports an optional Idempotency-Key. Requires offers:write and cart:write.
   *
   * @param {string} offerID - A stable, opaque offer ID.
   * @param {OfferCreateToCartParams} [body] - The request body to send.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<OfferCreateToCartResponse>} Offer returned.
   *
   * @example
   * ```ts
   * const offer = await client.offers.createToCart('665f3a2b1c8d4e9f7a6b5c59');
   * ```
   */
  createToCart(
    offerID: string,
    body: OfferCreateToCartParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<OfferCreateToCartResponse> {
    return this._client.post(__scalarPath`/offers/${offerID}/add-to-cart`, { body, ...options });
  }
}

/**
 * An ISO 8601 date-time in UTC, e.g. `2024-08-14T10:23:11.000Z`.
 */
export type DateString = string;

/**
 * A catalogue product or expansion id — a stable integer. Games are addressed by their slug instead.
 */
export type CatalogID = number;

export interface OfferListParams {
  cursor?: string;
  /**
   * @default 50
   * @minimum 1
   * @maximum 100
   */
  limit?: number;
  /**
   * Filter by your role; omitted includes both roles.
   */
  role?: 'buyer' | 'seller';
  /**
   * Filter by status. Repeat the parameter to include multiple statuses; omitted includes all statuses.
   */
  status?:
    | 'pending'
    | 'countered'
    | 'accepted'
    | 'declined'
    | 'cancelled'
    | 'voided'
    | Array<'pending' | 'countered' | 'accepted' | 'declined' | 'cancelled' | 'voided'>;
  /**
   * Include offers created at or after this timestamp.
   * @format date-time
   */
  createdFrom?: DateString;
  /**
   * Include offers created at or before this timestamp.
   * @format date-time
   */
  createdTo?: DateString;
}

export interface OfferListResponse {
  data: Array<OfferListResponse.Data>;
  pagination: OfferListResponse.Pagination;
}

export namespace OfferListResponse {
  export interface Data {
    /**
     * A stable, opaque offer ID.
     * @minLength 1
     * @maxLength 200
     */
    id: string;
    /**
     * The state of your negotiation.
     */
    status: 'pending' | 'countered' | 'accepted' | 'declined' | 'cancelled' | 'voided';
    /**
     * Your role in this offer.
     */
    viewerRole: 'buyer' | 'seller';
    /**
     * The buyer.
     */
    buyer: Data.Buyer;
    /**
     * The seller.
     */
    seller: Data.Seller;
    /**
     * The number of distinct negotiated listings.
     * @minimum -9007199254740991
     * @maximum 9007199254740991
     */
    itemCount: number;
    /**
     * The total number of negotiated units.
     * @minimum -9007199254740991
     * @maximum 9007199254740991
     */
    totalQuantity: number;
    /**
     * The subtotal at the original listing prices, excluding shipping.
     */
    originalTotal: Data.OriginalTotal;
    /**
     * The latest proposal, including after the offer closes.
     */
    currentProposal: Data.CurrentProposal;
    /**
     * Who may respond next; null when the offer is closed.
     */
    awaitingResponseFrom: 'buyer' | 'seller' | null;
    /**
     * The number of proposals submitted by the buyer, including the opening proposal.
     * @minimum -9007199254740991
     * @maximum 9007199254740991
     */
    buyerProposalCount: number;
    /**
     * Why the offer was voided; null otherwise.
     */
    voidReason:
      | 'basket_changed'
      | 'listing_changed'
      | 'seller_unavailable'
      | 'seller_paused'
      | 'offers_disabled'
      | 'expired'
      | null;
    /**
     * When the offer was opened.
     * @format date-time
     */
    createdAt: string;
    /**
     * When the offer last changed.
     * @format date-time
     */
    updatedAt: string;
    /**
     * The accepted offer's redemption deadline; null before acceptance.
     * @format date-time
     */
    expiresAt: DateString | null;
    /**
     * Operations currently permitted for your role, account, and granted scopes.
     */
    actions: Array<Data.Action>;
  }

  export namespace Data {
    export interface Buyer {
      /**
       * The participant's stable, opaque account ID.
       */
      id: string;
      /**
       * The participant's public username.
       */
      username: string;
    }

    export interface Seller {
      /**
       * The participant's stable, opaque account ID.
       */
      id: string;
      /**
       * The participant's public username.
       */
      username: string;
    }

    export interface OriginalTotal {
      /**
       * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
       */
      amount: number;
      currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
    }

    export interface CurrentProposal {
      /**
       * A stable, opaque proposal ID.
       * @minLength 1
       * @maxLength 200
       */
      id: string;
      /**
       * A participant's role in the offer.
       */
      authorRole: 'buyer' | 'seller';
      /**
       * The proposed subtotal for all negotiated units.
       */
      total: CurrentProposal.Total;
      /**
       * When the proposal was submitted.
       * @format date-time
       */
      createdAt: string;
    }

    export namespace CurrentProposal {
      export interface Total {
        /**
         * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
         */
        amount: number;
        currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
      }
    }

    export interface Action {
      /**
       * An operation currently available to you.
       */
      id: 'counter' | 'accept' | 'decline' | 'cancel' | 'add-to-cart';
      /**
       * The HTTP method.
       */
      method: 'POST';
      /**
       * The operation's API path, including /v1.
       */
      path: string;
    }
  }

  export interface Pagination {
    nextCursor: string | null;
  }
}

export interface OfferCreateParams {
  /**
   * The listings and quantities you are offering to buy.
   * @minItems 1
   * @maxItems 1000
   */
  items: Array<OfferCreateParams.Item>;
  /**
   * Your proposed subtotal for all selected units, excluding shipping, in the listing currency. Exactly one of total or discountPercentage is required.
   */
  total?: OfferCreateParams.Total;
  /**
   * The percentage discount from the original item subtotal: 20 means 20% off. Discounts above 40% return 422. Exactly one of total or discountPercentage is required.
   * @minimum 0
   * @maximum 100
   */
  discountPercentage?: number;
}

export namespace OfferCreateParams {
  export interface Item {
    /**
     * The stable, opaque listing ID.
     * @minLength 1
     * @maxLength 200
     */
    listingId: string;
    /**
     * The fixed number of units to negotiate.
     * @minimum 1
     * @maximum 2147483647
     */
    quantity: number;
  }

  export interface Total {
    /**
     * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
     */
    amount: number;
    currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
  }
}

export interface OfferCreateResponse {
  /**
   * A stable, opaque offer ID.
   * @minLength 1
   * @maxLength 200
   */
  id: string;
  /**
   * The state of your negotiation.
   */
  status: 'pending' | 'countered' | 'accepted' | 'declined' | 'cancelled' | 'voided';
  /**
   * Your role in this offer.
   */
  viewerRole: 'buyer' | 'seller';
  /**
   * The buyer.
   */
  buyer: OfferCreateResponse.Buyer;
  /**
   * The seller.
   */
  seller: OfferCreateResponse.Seller;
  /**
   * The number of distinct negotiated listings.
   * @minimum -9007199254740991
   * @maximum 9007199254740991
   */
  itemCount: number;
  /**
   * The total number of negotiated units.
   * @minimum -9007199254740991
   * @maximum 9007199254740991
   */
  totalQuantity: number;
  /**
   * The subtotal at the original listing prices, excluding shipping.
   */
  originalTotal: OfferCreateResponse.OriginalTotal;
  /**
   * The latest proposal, including after the offer closes.
   */
  currentProposal: OfferCreateResponse.CurrentProposal;
  /**
   * Who may respond next; null when the offer is closed.
   */
  awaitingResponseFrom: 'buyer' | 'seller' | null;
  /**
   * The number of proposals submitted by the buyer, including the opening proposal.
   * @minimum -9007199254740991
   * @maximum 9007199254740991
   */
  buyerProposalCount: number;
  /**
   * Why the offer was voided; null otherwise.
   */
  voidReason:
    | 'basket_changed'
    | 'listing_changed'
    | 'seller_unavailable'
    | 'seller_paused'
    | 'offers_disabled'
    | 'expired'
    | null;
  /**
   * When the offer was opened.
   * @format date-time
   */
  createdAt: string;
  /**
   * When the offer last changed.
   * @format date-time
   */
  updatedAt: string;
  /**
   * The accepted offer's redemption deadline; null before acceptance.
   * @format date-time
   */
  expiresAt: DateString | null;
  /**
   * Operations currently permitted for your role, account, and granted scopes.
   */
  actions: Array<OfferCreateResponse.Action>;
}

export namespace OfferCreateResponse {
  export interface Buyer {
    /**
     * The participant's stable, opaque account ID.
     */
    id: string;
    /**
     * The participant's public username.
     */
    username: string;
  }

  export interface Seller {
    /**
     * The participant's stable, opaque account ID.
     */
    id: string;
    /**
     * The participant's public username.
     */
    username: string;
  }

  export interface OriginalTotal {
    /**
     * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
     */
    amount: number;
    currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
  }

  export interface CurrentProposal {
    /**
     * A stable, opaque proposal ID.
     * @minLength 1
     * @maxLength 200
     */
    id: string;
    /**
     * A participant's role in the offer.
     */
    authorRole: 'buyer' | 'seller';
    /**
     * The proposed subtotal for all negotiated units.
     */
    total: CurrentProposal.Total;
    /**
     * When the proposal was submitted.
     * @format date-time
     */
    createdAt: string;
  }

  export namespace CurrentProposal {
    export interface Total {
      /**
       * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
       */
      amount: number;
      currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
    }
  }

  export interface Action {
    /**
     * An operation currently available to you.
     */
    id: 'counter' | 'accept' | 'decline' | 'cancel' | 'add-to-cart';
    /**
     * The HTTP method.
     */
    method: 'POST';
    /**
     * The operation's API path, including /v1.
     */
    path: string;
  }
}

export interface OfferRetrieveResponse {
  /**
   * A stable, opaque offer ID.
   * @minLength 1
   * @maxLength 200
   */
  id: string;
  /**
   * The state of your negotiation.
   */
  status: 'pending' | 'countered' | 'accepted' | 'declined' | 'cancelled' | 'voided';
  /**
   * Your role in this offer.
   */
  viewerRole: 'buyer' | 'seller';
  /**
   * The buyer.
   */
  buyer: OfferRetrieveResponse.Buyer;
  /**
   * The seller.
   */
  seller: OfferRetrieveResponse.Seller;
  /**
   * The number of distinct negotiated listings.
   * @minimum -9007199254740991
   * @maximum 9007199254740991
   */
  itemCount: number;
  /**
   * The total number of negotiated units.
   * @minimum -9007199254740991
   * @maximum 9007199254740991
   */
  totalQuantity: number;
  /**
   * The subtotal at the original listing prices, excluding shipping.
   */
  originalTotal: OfferRetrieveResponse.OriginalTotal;
  /**
   * The latest proposal, including after the offer closes.
   */
  currentProposal: OfferRetrieveResponse.CurrentProposal;
  /**
   * Who may respond next; null when the offer is closed.
   */
  awaitingResponseFrom: 'buyer' | 'seller' | null;
  /**
   * The number of proposals submitted by the buyer, including the opening proposal.
   * @minimum -9007199254740991
   * @maximum 9007199254740991
   */
  buyerProposalCount: number;
  /**
   * Why the offer was voided; null otherwise.
   */
  voidReason:
    | 'basket_changed'
    | 'listing_changed'
    | 'seller_unavailable'
    | 'seller_paused'
    | 'offers_disabled'
    | 'expired'
    | null;
  /**
   * When the offer was opened.
   * @format date-time
   */
  createdAt: string;
  /**
   * When the offer last changed.
   * @format date-time
   */
  updatedAt: string;
  /**
   * The accepted offer's redemption deadline; null before acceptance.
   * @format date-time
   */
  expiresAt: DateString | null;
  /**
   * Operations currently permitted for your role, account, and granted scopes.
   */
  actions: Array<OfferRetrieveResponse.Action>;
  /**
   * The fixed set of negotiated listings and quantities.
   */
  items: Array<OfferRetrieveResponse.Item>;
  /**
   * Every proposal in chronological order, oldest first.
   */
  proposals: Array<OfferRetrieveResponse.Proposal>;
}

export namespace OfferRetrieveResponse {
  export interface Buyer {
    /**
     * The participant's stable, opaque account ID.
     */
    id: string;
    /**
     * The participant's public username.
     */
    username: string;
  }

  export interface Seller {
    /**
     * The participant's stable, opaque account ID.
     */
    id: string;
    /**
     * The participant's public username.
     */
    username: string;
  }

  export interface OriginalTotal {
    /**
     * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
     */
    amount: number;
    currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
  }

  export interface CurrentProposal {
    /**
     * A stable, opaque proposal ID.
     * @minLength 1
     * @maxLength 200
     */
    id: string;
    /**
     * A participant's role in the offer.
     */
    authorRole: 'buyer' | 'seller';
    /**
     * The proposed subtotal for all negotiated units.
     */
    total: CurrentProposal.Total;
    /**
     * When the proposal was submitted.
     * @format date-time
     */
    createdAt: string;
  }

  export namespace CurrentProposal {
    export interface Total {
      /**
       * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
       */
      amount: number;
      currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
    }
  }

  export interface Action {
    /**
     * An operation currently available to you.
     */
    id: 'counter' | 'accept' | 'decline' | 'cancel' | 'add-to-cart';
    /**
     * The HTTP method.
     */
    method: 'POST';
    /**
     * The operation's API path, including /v1.
     */
    path: string;
  }

  export interface Item {
    /**
     * The original listing's stable, opaque ID.
     */
    listingId: string;
    /**
     * The product's numeric catalogue ID, or null when its catalogue reference is unavailable.
     * @minimum -9007199254740991
     * @maximum 9007199254740991
     */
    productId: CatalogID | null;
    /**
     * The product's display name.
     */
    productName: string;
    /**
     * The product image URL, when available.
     */
    imageUrl: string | null;
    /**
     * The fixed quantity negotiated for this listing.
     * @minimum -9007199254740991
     * @maximum 9007199254740991
     */
    quantity: number;
    /**
     * The listing's unit price when the offer opened.
     */
    originalUnitPrice: Item.OriginalUnitPrice;
  }

  export namespace Item {
    export interface OriginalUnitPrice {
      /**
       * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
       */
      amount: number;
      currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
    }
  }

  export interface Proposal {
    /**
     * A stable, opaque proposal ID.
     * @minLength 1
     * @maxLength 200
     */
    id: string;
    /**
     * A participant's role in the offer.
     */
    authorRole: 'buyer' | 'seller';
    /**
     * The proposed subtotal for all negotiated units.
     */
    total: Proposal.Total;
    /**
     * When the proposal was submitted.
     * @format date-time
     */
    createdAt: string;
    /**
     * The outcome of this proposal.
     */
    status: 'pending' | 'accepted' | 'declined' | 'superseded' | 'cancelled';
    /**
     * The proposed unit price for every negotiated listing.
     */
    items: Array<Proposal.Item>;
  }

  export namespace Proposal {
    export interface Total {
      /**
       * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
       */
      amount: number;
      currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
    }

    export interface Item {
      /**
       * The stable, opaque listing ID.
       * @minLength 1
       * @maxLength 200
       */
      listingId: string;
      /**
       * The server-allocated price for one unit, in the listing currency. This field is read-only.
       */
      offeredUnitPrice: Item.OfferedUnitPrice;
    }

    export namespace Item {
      export interface OfferedUnitPrice {
        /**
         * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
         */
        amount: number;
        currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
      }
    }
  }
}

export interface OfferCounterParams {
  /**
   * The ID of the price proposal you are accepting, declining, or countering, returned as `currentProposal.id` when you fetch the offer. If a newer proposal has arrived, your request returns `409 Conflict` without applying your response.
   * @minLength 1
   * @maxLength 200
   */
  proposalId: string;
  /**
   * Your proposed subtotal for all selected units, excluding shipping, in the listing currency. Exactly one of total or discountPercentage is required.
   */
  total?: OfferCounterParams.Total;
  /**
   * The percentage discount from the original item subtotal: 20 means 20% off. Discounts above 40% return 422. Exactly one of total or discountPercentage is required.
   * @minimum 0
   * @maximum 100
   */
  discountPercentage?: number;
}

export namespace OfferCounterParams {
  export interface Total {
    /**
     * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
     */
    amount: number;
    currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
  }
}

export interface OfferCounterResponse {
  /**
   * A stable, opaque offer ID.
   * @minLength 1
   * @maxLength 200
   */
  id: string;
  /**
   * The state of your negotiation.
   */
  status: 'pending' | 'countered' | 'accepted' | 'declined' | 'cancelled' | 'voided';
  /**
   * Your role in this offer.
   */
  viewerRole: 'buyer' | 'seller';
  /**
   * The buyer.
   */
  buyer: OfferCounterResponse.Buyer;
  /**
   * The seller.
   */
  seller: OfferCounterResponse.Seller;
  /**
   * The number of distinct negotiated listings.
   * @minimum -9007199254740991
   * @maximum 9007199254740991
   */
  itemCount: number;
  /**
   * The total number of negotiated units.
   * @minimum -9007199254740991
   * @maximum 9007199254740991
   */
  totalQuantity: number;
  /**
   * The subtotal at the original listing prices, excluding shipping.
   */
  originalTotal: OfferCounterResponse.OriginalTotal;
  /**
   * The latest proposal, including after the offer closes.
   */
  currentProposal: OfferCounterResponse.CurrentProposal;
  /**
   * Who may respond next; null when the offer is closed.
   */
  awaitingResponseFrom: 'buyer' | 'seller' | null;
  /**
   * The number of proposals submitted by the buyer, including the opening proposal.
   * @minimum -9007199254740991
   * @maximum 9007199254740991
   */
  buyerProposalCount: number;
  /**
   * Why the offer was voided; null otherwise.
   */
  voidReason:
    | 'basket_changed'
    | 'listing_changed'
    | 'seller_unavailable'
    | 'seller_paused'
    | 'offers_disabled'
    | 'expired'
    | null;
  /**
   * When the offer was opened.
   * @format date-time
   */
  createdAt: string;
  /**
   * When the offer last changed.
   * @format date-time
   */
  updatedAt: string;
  /**
   * The accepted offer's redemption deadline; null before acceptance.
   * @format date-time
   */
  expiresAt: DateString | null;
  /**
   * Operations currently permitted for your role, account, and granted scopes.
   */
  actions: Array<OfferCounterResponse.Action>;
}

export namespace OfferCounterResponse {
  export interface Buyer {
    /**
     * The participant's stable, opaque account ID.
     */
    id: string;
    /**
     * The participant's public username.
     */
    username: string;
  }

  export interface Seller {
    /**
     * The participant's stable, opaque account ID.
     */
    id: string;
    /**
     * The participant's public username.
     */
    username: string;
  }

  export interface OriginalTotal {
    /**
     * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
     */
    amount: number;
    currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
  }

  export interface CurrentProposal {
    /**
     * A stable, opaque proposal ID.
     * @minLength 1
     * @maxLength 200
     */
    id: string;
    /**
     * A participant's role in the offer.
     */
    authorRole: 'buyer' | 'seller';
    /**
     * The proposed subtotal for all negotiated units.
     */
    total: CurrentProposal.Total;
    /**
     * When the proposal was submitted.
     * @format date-time
     */
    createdAt: string;
  }

  export namespace CurrentProposal {
    export interface Total {
      /**
       * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
       */
      amount: number;
      currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
    }
  }

  export interface Action {
    /**
     * An operation currently available to you.
     */
    id: 'counter' | 'accept' | 'decline' | 'cancel' | 'add-to-cart';
    /**
     * The HTTP method.
     */
    method: 'POST';
    /**
     * The operation's API path, including /v1.
     */
    path: string;
  }
}

export interface OfferAcceptParams {
  /**
   * The ID of the price proposal you are accepting, declining, or countering, returned as `currentProposal.id` when you fetch the offer. If a newer proposal has arrived, your request returns `409 Conflict` without applying your response.
   * @minLength 1
   * @maxLength 200
   */
  proposalId: string;
}

export interface OfferAcceptResponse {
  /**
   * A stable, opaque offer ID.
   * @minLength 1
   * @maxLength 200
   */
  id: string;
  /**
   * The state of your negotiation.
   */
  status: 'pending' | 'countered' | 'accepted' | 'declined' | 'cancelled' | 'voided';
  /**
   * Your role in this offer.
   */
  viewerRole: 'buyer' | 'seller';
  /**
   * The buyer.
   */
  buyer: OfferAcceptResponse.Buyer;
  /**
   * The seller.
   */
  seller: OfferAcceptResponse.Seller;
  /**
   * The number of distinct negotiated listings.
   * @minimum -9007199254740991
   * @maximum 9007199254740991
   */
  itemCount: number;
  /**
   * The total number of negotiated units.
   * @minimum -9007199254740991
   * @maximum 9007199254740991
   */
  totalQuantity: number;
  /**
   * The subtotal at the original listing prices, excluding shipping.
   */
  originalTotal: OfferAcceptResponse.OriginalTotal;
  /**
   * The latest proposal, including after the offer closes.
   */
  currentProposal: OfferAcceptResponse.CurrentProposal;
  /**
   * Who may respond next; null when the offer is closed.
   */
  awaitingResponseFrom: 'buyer' | 'seller' | null;
  /**
   * The number of proposals submitted by the buyer, including the opening proposal.
   * @minimum -9007199254740991
   * @maximum 9007199254740991
   */
  buyerProposalCount: number;
  /**
   * Why the offer was voided; null otherwise.
   */
  voidReason:
    | 'basket_changed'
    | 'listing_changed'
    | 'seller_unavailable'
    | 'seller_paused'
    | 'offers_disabled'
    | 'expired'
    | null;
  /**
   * When the offer was opened.
   * @format date-time
   */
  createdAt: string;
  /**
   * When the offer last changed.
   * @format date-time
   */
  updatedAt: string;
  /**
   * The accepted offer's redemption deadline; null before acceptance.
   * @format date-time
   */
  expiresAt: DateString | null;
  /**
   * Operations currently permitted for your role, account, and granted scopes.
   */
  actions: Array<OfferAcceptResponse.Action>;
}

export namespace OfferAcceptResponse {
  export interface Buyer {
    /**
     * The participant's stable, opaque account ID.
     */
    id: string;
    /**
     * The participant's public username.
     */
    username: string;
  }

  export interface Seller {
    /**
     * The participant's stable, opaque account ID.
     */
    id: string;
    /**
     * The participant's public username.
     */
    username: string;
  }

  export interface OriginalTotal {
    /**
     * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
     */
    amount: number;
    currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
  }

  export interface CurrentProposal {
    /**
     * A stable, opaque proposal ID.
     * @minLength 1
     * @maxLength 200
     */
    id: string;
    /**
     * A participant's role in the offer.
     */
    authorRole: 'buyer' | 'seller';
    /**
     * The proposed subtotal for all negotiated units.
     */
    total: CurrentProposal.Total;
    /**
     * When the proposal was submitted.
     * @format date-time
     */
    createdAt: string;
  }

  export namespace CurrentProposal {
    export interface Total {
      /**
       * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
       */
      amount: number;
      currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
    }
  }

  export interface Action {
    /**
     * An operation currently available to you.
     */
    id: 'counter' | 'accept' | 'decline' | 'cancel' | 'add-to-cart';
    /**
     * The HTTP method.
     */
    method: 'POST';
    /**
     * The operation's API path, including /v1.
     */
    path: string;
  }
}

export interface OfferDeclineParams {
  /**
   * The ID of the price proposal you are accepting, declining, or countering, returned as `currentProposal.id` when you fetch the offer. If a newer proposal has arrived, your request returns `409 Conflict` without applying your response.
   * @minLength 1
   * @maxLength 200
   */
  proposalId: string;
}

export interface OfferDeclineResponse {
  /**
   * A stable, opaque offer ID.
   * @minLength 1
   * @maxLength 200
   */
  id: string;
  /**
   * The state of your negotiation.
   */
  status: 'pending' | 'countered' | 'accepted' | 'declined' | 'cancelled' | 'voided';
  /**
   * Your role in this offer.
   */
  viewerRole: 'buyer' | 'seller';
  /**
   * The buyer.
   */
  buyer: OfferDeclineResponse.Buyer;
  /**
   * The seller.
   */
  seller: OfferDeclineResponse.Seller;
  /**
   * The number of distinct negotiated listings.
   * @minimum -9007199254740991
   * @maximum 9007199254740991
   */
  itemCount: number;
  /**
   * The total number of negotiated units.
   * @minimum -9007199254740991
   * @maximum 9007199254740991
   */
  totalQuantity: number;
  /**
   * The subtotal at the original listing prices, excluding shipping.
   */
  originalTotal: OfferDeclineResponse.OriginalTotal;
  /**
   * The latest proposal, including after the offer closes.
   */
  currentProposal: OfferDeclineResponse.CurrentProposal;
  /**
   * Who may respond next; null when the offer is closed.
   */
  awaitingResponseFrom: 'buyer' | 'seller' | null;
  /**
   * The number of proposals submitted by the buyer, including the opening proposal.
   * @minimum -9007199254740991
   * @maximum 9007199254740991
   */
  buyerProposalCount: number;
  /**
   * Why the offer was voided; null otherwise.
   */
  voidReason:
    | 'basket_changed'
    | 'listing_changed'
    | 'seller_unavailable'
    | 'seller_paused'
    | 'offers_disabled'
    | 'expired'
    | null;
  /**
   * When the offer was opened.
   * @format date-time
   */
  createdAt: string;
  /**
   * When the offer last changed.
   * @format date-time
   */
  updatedAt: string;
  /**
   * The accepted offer's redemption deadline; null before acceptance.
   * @format date-time
   */
  expiresAt: DateString | null;
  /**
   * Operations currently permitted for your role, account, and granted scopes.
   */
  actions: Array<OfferDeclineResponse.Action>;
}

export namespace OfferDeclineResponse {
  export interface Buyer {
    /**
     * The participant's stable, opaque account ID.
     */
    id: string;
    /**
     * The participant's public username.
     */
    username: string;
  }

  export interface Seller {
    /**
     * The participant's stable, opaque account ID.
     */
    id: string;
    /**
     * The participant's public username.
     */
    username: string;
  }

  export interface OriginalTotal {
    /**
     * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
     */
    amount: number;
    currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
  }

  export interface CurrentProposal {
    /**
     * A stable, opaque proposal ID.
     * @minLength 1
     * @maxLength 200
     */
    id: string;
    /**
     * A participant's role in the offer.
     */
    authorRole: 'buyer' | 'seller';
    /**
     * The proposed subtotal for all negotiated units.
     */
    total: CurrentProposal.Total;
    /**
     * When the proposal was submitted.
     * @format date-time
     */
    createdAt: string;
  }

  export namespace CurrentProposal {
    export interface Total {
      /**
       * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
       */
      amount: number;
      currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
    }
  }

  export interface Action {
    /**
     * An operation currently available to you.
     */
    id: 'counter' | 'accept' | 'decline' | 'cancel' | 'add-to-cart';
    /**
     * The HTTP method.
     */
    method: 'POST';
    /**
     * The operation's API path, including /v1.
     */
    path: string;
  }
}

export type OfferCancelParams = Record<string, unknown>;

export interface OfferCancelResponse {
  /**
   * A stable, opaque offer ID.
   * @minLength 1
   * @maxLength 200
   */
  id: string;
  /**
   * The state of your negotiation.
   */
  status: 'pending' | 'countered' | 'accepted' | 'declined' | 'cancelled' | 'voided';
  /**
   * Your role in this offer.
   */
  viewerRole: 'buyer' | 'seller';
  /**
   * The buyer.
   */
  buyer: OfferCancelResponse.Buyer;
  /**
   * The seller.
   */
  seller: OfferCancelResponse.Seller;
  /**
   * The number of distinct negotiated listings.
   * @minimum -9007199254740991
   * @maximum 9007199254740991
   */
  itemCount: number;
  /**
   * The total number of negotiated units.
   * @minimum -9007199254740991
   * @maximum 9007199254740991
   */
  totalQuantity: number;
  /**
   * The subtotal at the original listing prices, excluding shipping.
   */
  originalTotal: OfferCancelResponse.OriginalTotal;
  /**
   * The latest proposal, including after the offer closes.
   */
  currentProposal: OfferCancelResponse.CurrentProposal;
  /**
   * Who may respond next; null when the offer is closed.
   */
  awaitingResponseFrom: 'buyer' | 'seller' | null;
  /**
   * The number of proposals submitted by the buyer, including the opening proposal.
   * @minimum -9007199254740991
   * @maximum 9007199254740991
   */
  buyerProposalCount: number;
  /**
   * Why the offer was voided; null otherwise.
   */
  voidReason:
    | 'basket_changed'
    | 'listing_changed'
    | 'seller_unavailable'
    | 'seller_paused'
    | 'offers_disabled'
    | 'expired'
    | null;
  /**
   * When the offer was opened.
   * @format date-time
   */
  createdAt: string;
  /**
   * When the offer last changed.
   * @format date-time
   */
  updatedAt: string;
  /**
   * The accepted offer's redemption deadline; null before acceptance.
   * @format date-time
   */
  expiresAt: DateString | null;
  /**
   * Operations currently permitted for your role, account, and granted scopes.
   */
  actions: Array<OfferCancelResponse.Action>;
}

export namespace OfferCancelResponse {
  export interface Buyer {
    /**
     * The participant's stable, opaque account ID.
     */
    id: string;
    /**
     * The participant's public username.
     */
    username: string;
  }

  export interface Seller {
    /**
     * The participant's stable, opaque account ID.
     */
    id: string;
    /**
     * The participant's public username.
     */
    username: string;
  }

  export interface OriginalTotal {
    /**
     * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
     */
    amount: number;
    currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
  }

  export interface CurrentProposal {
    /**
     * A stable, opaque proposal ID.
     * @minLength 1
     * @maxLength 200
     */
    id: string;
    /**
     * A participant's role in the offer.
     */
    authorRole: 'buyer' | 'seller';
    /**
     * The proposed subtotal for all negotiated units.
     */
    total: CurrentProposal.Total;
    /**
     * When the proposal was submitted.
     * @format date-time
     */
    createdAt: string;
  }

  export namespace CurrentProposal {
    export interface Total {
      /**
       * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
       */
      amount: number;
      currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
    }
  }

  export interface Action {
    /**
     * An operation currently available to you.
     */
    id: 'counter' | 'accept' | 'decline' | 'cancel' | 'add-to-cart';
    /**
     * The HTTP method.
     */
    method: 'POST';
    /**
     * The operation's API path, including /v1.
     */
    path: string;
  }
}

export type OfferCreateToCartParams = Record<string, unknown>;

export interface OfferCreateToCartResponse {
  /**
   * A stable, opaque offer ID.
   * @minLength 1
   * @maxLength 200
   */
  id: string;
  /**
   * The state of your negotiation.
   */
  status: 'pending' | 'countered' | 'accepted' | 'declined' | 'cancelled' | 'voided';
  /**
   * Your role in this offer.
   */
  viewerRole: 'buyer' | 'seller';
  /**
   * The buyer.
   */
  buyer: OfferCreateToCartResponse.Buyer;
  /**
   * The seller.
   */
  seller: OfferCreateToCartResponse.Seller;
  /**
   * The number of distinct negotiated listings.
   * @minimum -9007199254740991
   * @maximum 9007199254740991
   */
  itemCount: number;
  /**
   * The total number of negotiated units.
   * @minimum -9007199254740991
   * @maximum 9007199254740991
   */
  totalQuantity: number;
  /**
   * The subtotal at the original listing prices, excluding shipping.
   */
  originalTotal: OfferCreateToCartResponse.OriginalTotal;
  /**
   * The latest proposal, including after the offer closes.
   */
  currentProposal: OfferCreateToCartResponse.CurrentProposal;
  /**
   * Who may respond next; null when the offer is closed.
   */
  awaitingResponseFrom: 'buyer' | 'seller' | null;
  /**
   * The number of proposals submitted by the buyer, including the opening proposal.
   * @minimum -9007199254740991
   * @maximum 9007199254740991
   */
  buyerProposalCount: number;
  /**
   * Why the offer was voided; null otherwise.
   */
  voidReason:
    | 'basket_changed'
    | 'listing_changed'
    | 'seller_unavailable'
    | 'seller_paused'
    | 'offers_disabled'
    | 'expired'
    | null;
  /**
   * When the offer was opened.
   * @format date-time
   */
  createdAt: string;
  /**
   * When the offer last changed.
   * @format date-time
   */
  updatedAt: string;
  /**
   * The accepted offer's redemption deadline; null before acceptance.
   * @format date-time
   */
  expiresAt: DateString | null;
  /**
   * Operations currently permitted for your role, account, and granted scopes.
   */
  actions: Array<OfferCreateToCartResponse.Action>;
}

export namespace OfferCreateToCartResponse {
  export interface Buyer {
    /**
     * The participant's stable, opaque account ID.
     */
    id: string;
    /**
     * The participant's public username.
     */
    username: string;
  }

  export interface Seller {
    /**
     * The participant's stable, opaque account ID.
     */
    id: string;
    /**
     * The participant's public username.
     */
    username: string;
  }

  export interface OriginalTotal {
    /**
     * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
     */
    amount: number;
    currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
  }

  export interface CurrentProposal {
    /**
     * A stable, opaque proposal ID.
     * @minLength 1
     * @maxLength 200
     */
    id: string;
    /**
     * A participant's role in the offer.
     */
    authorRole: 'buyer' | 'seller';
    /**
     * The proposed subtotal for all negotiated units.
     */
    total: CurrentProposal.Total;
    /**
     * When the proposal was submitted.
     * @format date-time
     */
    createdAt: string;
  }

  export namespace CurrentProposal {
    export interface Total {
      /**
       * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
       */
      amount: number;
      currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
    }
  }

  export interface Action {
    /**
     * An operation currently available to you.
     */
    id: 'counter' | 'accept' | 'decline' | 'cancel' | 'add-to-cart';
    /**
     * The HTTP method.
     */
    method: 'POST';
    /**
     * The operation's API path, including /v1.
     */
    path: string;
  }
}
export declare namespace Offers {
  export {
    type DateString as DateString,
    type CatalogID as CatalogID,
    type OfferListResponse as OfferListResponse,
    type OfferCreateResponse as OfferCreateResponse,
    type OfferRetrieveResponse as OfferRetrieveResponse,
    type OfferCounterResponse as OfferCounterResponse,
    type OfferAcceptResponse as OfferAcceptResponse,
    type OfferDeclineResponse as OfferDeclineResponse,
    type OfferCancelResponse as OfferCancelResponse,
    type OfferCreateToCartResponse as OfferCreateToCartResponse,
    type OfferListParams as OfferListParams,
    type OfferCreateParams as OfferCreateParams,
    type OfferCounterParams as OfferCounterParams,
    type OfferAcceptParams as OfferAcceptParams,
    type OfferDeclineParams as OfferDeclineParams,
    type OfferCancelParams as OfferCancelParams,
    type OfferCreateToCartParams as OfferCreateToCartParams,
  };
}
