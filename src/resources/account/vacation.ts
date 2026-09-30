// File generated from our OpenAPI spec by Scalar. See README.md for details.

import { APIResource } from '../../resource';
import { APIPromise } from '../../api-promise';
import type { RequestOptions } from '../../internal/request-options';
import type * as OffersAPI from '../offers';

export class Vacation extends APIResource {
  /**
   * Returns whether vacation mode is on. While it's on, your listings are hidden from the Marketplace and buyers can't order from you; your inventory is kept and comes back when you turn it off.
   *
   * Requires the `account:read` scope.
   *
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<VacationListResponse>} Vacation state returned.
   *
   * @example
   * ```ts
   * const vacation = await client.account.vacation.list();
   * ```
   */
  list(options?: RequestOptions): APIPromise<VacationListResponse> {
    return this._client.get('/account/vacation', options);
  }

  /**
   * Turns vacation mode on or off. Turning it on hides your listings from the Marketplace and stops new orders while keeping your inventory; turning it off restores them.
   *
   * The change takes effect immediately and returns the resulting state.
   *
   * Requires the `account:write` scope.
   *
   * @param {VacationSetParams} body - The request body to send.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<VacationSetResponse>} Vacation state updated.
   *
   * @example
   * ```ts
   * const vacation = await client.account.vacation.set({
   *   enabled: false,
   * });
   * ```
   */
  set(body: VacationSetParams, options?: RequestOptions): APIPromise<VacationSetResponse> {
    return this._client.post('/account/vacation', { body, ...options });
  }
}

export interface VacationListResponse {
  /**
   * `true` when vacation mode is on and your listings are hidden.
   */
  enabled: boolean;
  /**
   * Your seller account state. `active` means you're selling normally; `paused` means vacation mode is on and your listings are hidden; `suspended` and `banned` are set by CardNexus and can't be changed here.
   */
  status: 'active' | 'paused' | 'suspended' | 'banned';
  /**
   * When your seller account last changed state. `null` when it has never changed.
   * @format date-time
   */
  since: OffersAPI.DateString | null;
}

export interface VacationSetParams {
  /**
   * `true` turns vacation mode on and hides your listings; `false` turns it off and restores them.
   */
  enabled: boolean;
  /**
   * An optional note stored with the change.
   * @maxLength 500
   */
  reason?: string;
}

export interface VacationSetResponse {
  /**
   * `true` when vacation mode is on and your listings are hidden.
   */
  enabled: boolean;
  /**
   * Your seller account state. `active` means you're selling normally; `paused` means vacation mode is on and your listings are hidden; `suspended` and `banned` are set by CardNexus and can't be changed here.
   */
  status: 'active' | 'paused' | 'suspended' | 'banned';
  /**
   * When your seller account last changed state. `null` when it has never changed.
   * @format date-time
   */
  since: OffersAPI.DateString | null;
}
export declare namespace Vacation {
  export {
    type VacationListResponse as VacationListResponse,
    type VacationSetResponse as VacationSetResponse,
    type VacationSetParams as VacationSetParams,
  };
}
