// File generated from our OpenAPI spec by Scalar. See README.md for details.

import { APIResource } from '../../resource';
import { APIPromise } from '../../api-promise';
import type { RequestOptions } from '../../internal/request-options';
import * as VacationAPI from './vacation';
import {
  Vacation,
  type VacationListResponse,
  type VacationSetResponse,
  type VacationSetParams,
} from './vacation';

export class Account extends APIResource {
  vacation: VacationAPI.Vacation = new VacationAPI.Vacation(this._client);

  /**
   * Returns your account: your account id, identity (username, email, avatar, signup date), your seller profile if you've onboarded as a seller, and the list of scopes your API key holds.
   *
   * Requires the `account:read` scope.
   *
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<AccountMeResponse>} Account returned.
   *
   * @example
   * ```ts
   * const account = await client.account.me();
   * ```
   */
  me(options?: RequestOptions): APIPromise<AccountMeResponse> {
    return this._client.get('/account/me', options);
  }

  /**
   * Returns your wallet balance: the funds `available` to pay out and the funds still `pending` from recent sales, each as a money amount, plus when the balance was last refreshed.
   *
   * Requires the `financial:read` scope.
   *
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<AccountBalanceResponse>} Balance returned.
   *
   * @example
   * ```ts
   * const account = await client.account.balance();
   * ```
   */
  balance(options?: RequestOptions): APIPromise<AccountBalanceResponse> {
    return this._client.get('/account/balance', options);
  }
}

/**
 * A monetary amount as a decimal in the currency's major unit paired with its currency code — `{ amount: 14.99, currency: "USD" }` means $14.99.
 */
export interface Money {
  /**
   * Decimal amount in the currency's major unit (e.g. `5.23` for €5.23). 2 decimal places for EUR/USD/GBP/CHF/CAD/AUD.
   */
  amount: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
}

export interface AccountMeResponse {
  /**
   * Your account id. This is the value applications send in the `CardNexus-Account` header when calling on your behalf, and the same id returned by `POST /connect/exchange`.
   */
  id: string;
  /**
   * Your public handle. Empty string if you haven't picked one yet.
   */
  username: string;
  /**
   * Your primary email address.
   * @format email
   */
  email: string;
  /**
   * Your avatar URL. Empty string if you haven't uploaded one.
   */
  imageUrl: string;
  /**
   * When you signed up (ISO 8601, UTC).
   * @format date-time
   */
  createdAt: string;
  /**
   * Your seller profile. Present once you have a seller profile (managed accounts have one from creation); `null` if you only buy.
   */
  seller: AccountMeResponse.Seller | null;
  /**
   * The scopes your API key was minted with. Calls that need scopes you don't hold return `403 Forbidden`. The `*` wildcard grants every scope.
   */
  scopes: Array<
    | '*'
    | 'inventory:read'
    | 'inventory:write'
    | 'listings:read'
    | 'listings:write'
    | 'lists:read'
    | 'lists:write'
    | 'cart:read'
    | 'cart:write'
    | 'offers:read'
    | 'offers:write'
    | 'sales:read'
    | 'sales:write'
    | 'purchases:read'
    | 'purchases:write'
    | 'disputes:read'
    | 'disputes:write'
    | 'messaging:read'
    | 'messaging:write'
    | 'account:read'
    | 'account:write'
    | 'financial:read'
  >;
}

export namespace AccountMeResponse {
  export interface Seller {
    /**
     * What kind of seller you are. `pro` if you sell as a registered company; `individual` if you sell as a private person.
     */
    type: 'pro' | 'individual';
    /**
     * Your country, as a two-letter ISO 3166-1 alpha-2 code (e.g. `FR`, `US`, `GB`).
     * @minLength 2
     * @maxLength 2
     */
    country: string;
    /**
     * Your selling currency.
     */
    currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'SEK' | 'DKK' | 'NOK' | 'PLN' | 'HUF';
    /**
     * `true` when you can list cards for sale. `false` when listing isn't currently available.
     */
    available: boolean;
    /**
     * `live` when your listings are shown on the marketplace. `staged` while they are hidden: a managed account whose seller hasn't completed onboarding yet, or a pro seller whose setup is incomplete.
     */
    status: 'staged' | 'live';
  }
}

export interface AccountBalanceResponse {
  /**
   * A monetary amount as a decimal in the currency's major unit paired with its currency code — `{ amount: 14.99, currency: "USD" }` means $14.99.
   */
  available: Money;
  /**
   * A monetary amount as a decimal in the currency's major unit paired with its currency code — `{ amount: 14.99, currency: "USD" }` means $14.99.
   */
  pending: Money;
  /**
   * When this balance was last refreshed from the payment processor.
   * @format date-time
   */
  updatedAt: string;
}
Account.Vacation = Vacation;

export declare namespace Account {
  export {
    type Money as Money,
    type AccountMeResponse as AccountMeResponse,
    type AccountBalanceResponse as AccountBalanceResponse,
  };

  export {
    Vacation as Vacation,
    type VacationListResponse as VacationListResponse,
    type VacationSetResponse as VacationSetResponse,
    type VacationSetParams as VacationSetParams,
  };
}
