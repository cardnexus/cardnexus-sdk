// File generated from our OpenAPI spec by Scalar. See README.md for details.

import { APIResource } from '../resource';
import { APIPromise } from '../api-promise';
import type { RequestOptions } from '../internal/request-options';

export class Connect extends APIResource {
  /**
   * Completes the account-connection handshake. After a user approves your application, CardNexus redirects them back to you with a one-time `code`. Exchange that code here — authenticated with your application credential — to learn which account was connected and what it granted you.
   *
   * The code is single-use and expires 5 minutes after it is issued. The account id you receive is what you send in the `CardNexus-Account` header on every subsequent request for that account.
   *
   * @param {ConnectExchangeParams} body - The request body to send.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<ConnectExchangeResponse>} The connected account and its granted permissions.
   *
   * @example
   * ```ts
   * const connect = await client.connect.exchange({
   *   code: 'x',
   * });
   * ```
   */
  exchange(body: ConnectExchangeParams, options?: RequestOptions): APIPromise<ConnectExchangeResponse> {
    return this._client.post('/connect/exchange', { body, ...options });
  }
}

export interface ConnectExchangeParams {
  /**
   * The one-time code you received on the connect redirect, as the `code` query parameter. Valid for 5 minutes and usable once.
   * @minLength 1
   */
  code: string;
}

export interface ConnectExchangeResponse {
  /**
   * The connected account's id. Send it in the CardNexus-Account header on every request you make for this account.
   */
  accountId: string;
  /**
   * The permissions this account granted your application.
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
  /**
   * When the account authorized your application (ISO 8601, UTC).
   * @format date-time
   */
  grantedAt: string;
}
export declare namespace Connect {
  export {
    type ConnectExchangeResponse as ConnectExchangeResponse,
    type ConnectExchangeParams as ConnectExchangeParams,
  };
}
