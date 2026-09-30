// File generated from our OpenAPI spec by Scalar. See README.md for details.

import { APIResource } from '../resource';
import { APIPromise } from '../api-promise';
import type { RequestOptions } from '../internal/request-options';

export class Accounts extends APIResource {
  /**
   * Creates a CardNexus account for a seller who isn't on CardNexus yet, and connects it to your application in one step. Only available to applications CardNexus has granted the managed-account privilege.
   *
   * The account is created **staged**: you can sync inventory and create listings into it immediately, but the listings stay hidden from the marketplace until the seller completes onboarding. Request a hosted-onboarding link with `POST /v1/account/onboarding-link` and send it to the seller. Once they accept the CardNexus terms and Stripe's terms in that flow (individual sellers also give Stripe their name and date of birth), the account goes **live** and its listings are shown. Read the current state from `seller.status` on `GET /v1/account/me`.
   *
   * We email the address a link to claim the account. Anyone who did not ask for the account can reply to that email to have it deleted.
   *
   * Pass `sellerType: "pro"` for a registered company and, optionally, its `business` identity; whatever you leave out, the seller fills in during onboarding.
   *
   * If the email already belongs to an account, this fails with `ACCOUNT_EXISTS` — send that seller through the normal connect flow instead.
   *
   * The privilege comes with a daily allowance of managed accounts. Once your application has used it up, this fails with `QUOTA_EXCEEDED` until the allowance resets at midnight UTC.
   *
   * @param {AccountCreateParams} body - The request body to send.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<AccountCreateResponse>} The account was created.
   *
   * @example
   * ```ts
   * const account = await client.accounts.create({
   *   email: 'shop@northarena.example',
   *   country: 'FR',
   *   sellerType: 'pro',
   *   username: 'north_arena_tcg',
   *   firstName: 'Léa',
   *   lastName: 'Martin',
   *   language: 'fr',
   *   business: {
   *     companyName: 'North Arena TCG',
   *     registrationNumber: '912345678',
   *     vatNumber: 'FR12345678901',
   *     address: { line1: '12 rue des Cartes', city: 'Lyon', postalCode: '69001', country: 'FR' },
   *   },
   * });
   * ```
   */
  create(body: AccountCreateParams, options?: RequestOptions): APIPromise<AccountCreateResponse> {
    return this._client.post('/accounts', { body, ...options });
  }

  /**
   * Issues a link into the CardNexus-hosted onboarding flow for an account your application created. Send it in the `CardNexus-Account` header naming that account.
   *
   * Send the seller to the returned URL. There they accept the CardNexus terms and complete the payment-onboarding steps in their own browser — which is what takes their listings live. When they finish, CardNexus returns them to your `returnUrl`.
   *
   * While the account is unclaimed the link signs the seller straight in; once they've claimed it, the link takes them through normal sign-in.
   *
   * @param {AccountCreateOnboardingLinkParams} body - The request body to send.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<AccountCreateOnboardingLinkResponse>} The onboarding link was issued.
   *
   * @example
   * ```ts
   * const account = await client.accounts.createOnboardingLink({
   *   returnUrl: 'x',
   * });
   * ```
   */
  createOnboardingLink(
    body: AccountCreateOnboardingLinkParams,
    options?: RequestOptions,
  ): APIPromise<AccountCreateOnboardingLinkResponse> {
    return this._client.post('/account/onboarding-link', { body, ...options });
  }
}

export interface AccountCreateParams {
  /**
   * The seller's email address. They'll use it to sign in and claim the account. Must not already belong to a CardNexus account.
   * @format email
   */
  email: string;
  /**
   * The seller's country, as a two-letter ISO 3166-1 alpha-2 code (e.g. `FR`, `US`). Must be a country CardNexus supports for selling.
   * @minLength 2
   * @maxLength 2
   */
  country: string;
  /**
   * `pro` when the seller sells as a registered company, `individual` when they sell as a private person.
   */
  sellerType: 'pro' | 'individual';
  /**
   * The seller's public handle: 2 to 32 lowercase letters, digits or underscores. If you omit it, we derive one from the email address.
   * @minLength 2
   * @maxLength 32
   * @pattern ^[a-z0-9_]+$
   */
  username?: string;
  /**
   * The seller's first name. Prefilled into Stripe onboarding.
   * @minLength 1
   * @maxLength 100
   */
  firstName?: string;
  /**
   * The seller's last name. Prefilled into Stripe onboarding.
   * @minLength 1
   * @maxLength 100
   */
  lastName?: string;
  /**
   * The language CardNexus uses for the seller's interface and emails. Defaults to `en`.
   */
  language?: 'en' | 'fr';
  /**
   * The seller's phone number, in international format.
   * @minLength 5
   * @maxLength 32
   */
  phone?: string;
  /**
   * The seller's business identity. Only accepted when `sellerType` is `pro`. Anything you leave out, the seller fills in during onboarding.
   */
  business?: AccountCreateParams.Business;
}

export namespace AccountCreateParams {
  export interface Business {
    /**
     * The registered company name, shown on the seller's profile. Use the seller's full name when the company has no other name.
     * @minLength 1
     * @maxLength 200
     */
    companyName: string;
    /**
     * The company's primary business identifier for its country (SIREN for FR, HRB for DE, Company Number for GB).
     * @minLength 1
     * @maxLength 64
     */
    registrationNumber?: string;
    /**
     * A secondary tax identifier, when the country uses one. Its kind follows from `country`.
     * @minLength 1
     * @maxLength 64
     */
    taxId?: string;
    /**
     * The company's VAT number. Its kind follows from `country`.
     * @minLength 1
     * @maxLength 64
     */
    vatNumber?: string;
    /**
     * `true` when the company declares it is not VAT-registered.
     */
    notVatRegistered?: boolean;
    /**
     * The registered business address.
     */
    address?: Business.Address;
  }

  export namespace Business {
    export interface Address {
      /**
       * Street address.
       * @minLength 1
       * @maxLength 200
       */
      line1: string;
      /**
       * City.
       * @minLength 1
       * @maxLength 100
       */
      city: string;
      /**
       * Postal code.
       * @minLength 1
       * @maxLength 20
       */
      postalCode: string;
      /**
       * Country of the address, as a two-letter ISO 3166-1 alpha-2 code.
       * @minLength 2
       * @maxLength 2
       */
      country: string;
      /**
       * Additional address line (suite, building).
       * @minLength 1
       * @maxLength 200
       */
      line2?: string;
      /**
       * State, province or region, where applicable.
       * @minLength 1
       * @maxLength 100
       */
      state?: string;
    }
  }
}

export interface AccountCreateResponse {
  /**
   * The new account's id. Send it in the CardNexus-Account header to sync into the account.
   */
  accountId: string;
  /**
   * The account's handle.
   */
  username: string;
  /**
   * `staged` until the seller completes onboarding: you can already create listings, but they stay hidden from the marketplace. `live` once the seller has accepted the terms and their listings are shown. Use `POST /v1/account/onboarding-link` to send them there.
   */
  status: 'staged' | 'live';
}

export interface AccountCreateOnboardingLinkParams {
  /**
   * Where CardNexus returns the seller after they finish onboarding. Must be one of your application's registered redirect URIs.
   * @minLength 1
   */
  returnUrl: string;
}

export interface AccountCreateOnboardingLinkResponse {
  /**
   * A single-use link into the CardNexus-hosted onboarding flow. Send the seller here to accept the terms and complete onboarding. Expires shortly — request a fresh one if it lapses.
   */
  url: string;
  /**
   * When the link stops working.
   * @format date-time
   */
  expiresAt: string;
}
export declare namespace Accounts {
  export {
    type AccountCreateResponse as AccountCreateResponse,
    type AccountCreateOnboardingLinkResponse as AccountCreateOnboardingLinkResponse,
    type AccountCreateParams as AccountCreateParams,
    type AccountCreateOnboardingLinkParams as AccountCreateOnboardingLinkParams,
  };
}
