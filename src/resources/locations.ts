// File generated from our OpenAPI spec by Scalar. See README.md for details.

import { APIResource } from '../resource';
import { APIPromise } from '../api-promise';
import type { RequestOptions } from '../internal/request-options';
import { path as __scalarPath } from '../internal/utils/path';

export class Locations extends APIResource {
  /**
   * Returns every location in your account, each with its name and optional display colour and icon.
   *
   * Locations are labels for where you keep your stock. A line has at most one location. Set and clear a line's location through the inventory write endpoints (`POST /v1/inventory`, `PATCH /v1/inventory/{inventoryId}`, and the bulk endpoints).
   *
   * Requires the `inventory:read` scope.
   *
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<LocationListResponse>} Your locations.
   *
   * @example
   * ```ts
   * const location = await client.locations.list();
   * ```
   */
  list(options?: RequestOptions): APIPromise<LocationListResponse> {
    return this._client.get('/inventory/locations', options);
  }

  /**
   * Creates a new location in your account.
   *
   * The name must be one you don't already use — names are compared case-insensitively, so `Shelf A` and `shelf a` count as the same and the second request returns `CONFLICT`.
   *
   * Send `"upsert": true` to make the call safe to repeat: when the location already exists it is returned — updated with any `color` or `icon` you sent — instead of failing with `CONFLICT`. One call then guarantees the location exists before you reference it on inventory lines.
   *
   * Requires the `inventory:write` scope.
   *
   * @param {LocationCreateParams} body - The request body to send.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<LocationCreateResponse>} Location created — or returned, when `upsert` matched an existing location.
   *
   * @example
   * ```ts
   * const location = await client.locations.create({
   *   name: 'Trade binder',
   * });
   * ```
   */
  create(body: LocationCreateParams, options?: RequestOptions): APIPromise<LocationCreateResponse> {
    return this._client.post('/inventory/locations', { body, ...options });
  }

  /**
   * Renames a location or changes its display colour or icon. Send only the fields you want to change.
   *
   * Renaming keeps the location on every line that already sits there — the lines follow the new name. A new name that clashes with another of your locations returns `CONFLICT`.
   *
   * Requires the `inventory:write` scope.
   *
   * @param {string} locationName - The location's current name. URL-encode it in the path — e.g. `Shelf%20A`. Matched case-insensitively.
   * @param {LocationUpdateParams} [body] - The request body to send.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<LocationUpdateResponse>} Location updated.
   *
   * @example
   * ```ts
   * const location = await client.locations.update('locationName');
   * ```
   */
  update(
    locationName: string,
    body: LocationUpdateParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<LocationUpdateResponse> {
    return this._client.patch(__scalarPath`/inventory/locations/${locationName}`, { body, ...options });
  }

  /**
   * Deletes a location from your account. Every line that sits there is moved back to having no location — the lines themselves are kept.
   *
   * Requires the `inventory:write` scope.
   *
   * @param {string} locationName - The location's current name. URL-encode it in the path — e.g. `Shelf%20A`. Matched case-insensitively.
   * @param {LocationDeleteParams} [body] - The request body to send.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<unknown>} Location deleted.
   *
   * @example
   * ```ts
   * const response = await client.locations.delete('locationName');
   * ```
   */
  delete(
    locationName: string,
    body: LocationDeleteParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<unknown> {
    return this._client.delete(__scalarPath`/inventory/locations/${locationName}`, { body, ...options });
  }
}

export type LocationListResponse = Array<LocationListResponse.LocationListResponseItem>;

export namespace LocationListResponse {
  export interface LocationListResponseItem {
    /**
     * The label's name, unique within your account.
     */
    name: string;
    /**
     * The label's display colour, free-form text. `null` when you haven't set one.
     */
    color: string | null;
    /**
     * The label's display icon, free-form text. `null` when you haven't set one.
     */
    icon: string | null;
  }
}

export interface LocationCreateParams {
  /**
   * The location's name, unique within your account.
   * @minLength 1
   * @maxLength 100
   */
  name: string;
  /**
   * An optional display colour, free-form text.
   * @minLength 1
   * @maxLength 50
   */
  color?: string;
  /**
   * An optional display icon, free-form text.
   * @minLength 1
   * @maxLength 50
   */
  icon?: string;
  /**
   * When `true` and you already have a location with this name, the request returns that location — updated with any `color` or `icon` you sent — instead of failing with `CONFLICT`. The existing location keeps its stored name spelling.
   */
  upsert?: boolean;
}

export interface LocationCreateResponse {
  /**
   * The label's name, unique within your account.
   */
  name: string;
  /**
   * The label's display colour, free-form text. `null` when you haven't set one.
   */
  color: string | null;
  /**
   * The label's display icon, free-form text. `null` when you haven't set one.
   */
  icon: string | null;
}

export interface LocationUpdateParams {
  /**
   * A new name for the location. Omit to leave the name unchanged.
   * @minLength 1
   * @maxLength 100
   */
  name?: string;
  /**
   * A new display colour. Send `null` to remove the colour, omit to leave it unchanged.
   * @minLength 1
   * @maxLength 50
   */
  color?: string | null;
  /**
   * A new display icon. Send `null` to remove the icon, omit to leave it unchanged.
   * @minLength 1
   * @maxLength 50
   */
  icon?: string | null;
}

export interface LocationUpdateResponse {
  /**
   * The label's name, unique within your account.
   */
  name: string;
  /**
   * The label's display colour, free-form text. `null` when you haven't set one.
   */
  color: string | null;
  /**
   * The label's display icon, free-form text. `null` when you haven't set one.
   */
  icon: string | null;
}

export type LocationDeleteParams = Record<string, unknown>;
export declare namespace Locations {
  export {
    type LocationListResponse as LocationListResponse,
    type LocationCreateResponse as LocationCreateResponse,
    type LocationUpdateResponse as LocationUpdateResponse,
    type LocationCreateParams as LocationCreateParams,
    type LocationUpdateParams as LocationUpdateParams,
    type LocationDeleteParams as LocationDeleteParams,
  };
}
