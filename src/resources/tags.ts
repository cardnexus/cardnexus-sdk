// File generated from our OpenAPI spec by Scalar. See README.md for details.

import { APIResource } from '../resource';
import { APIPromise } from '../api-promise';
import type { RequestOptions } from '../internal/request-options';
import { path as __scalarPath } from '../internal/utils/path';

export class Tags extends APIResource {
  /**
   * Returns every tag in your account, each with its name and optional display colour and icon.
   *
   * Tags are labels you attach to inventory lines to group them however you like. Attach and detach them on a line through the inventory write endpoints (`POST /v1/inventory`, `PATCH /v1/inventory/{inventoryId}`, and the bulk endpoints).
   *
   * Requires the `inventory:read` scope.
   *
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<TagListResponse>} Your tags.
   *
   * @example
   * ```ts
   * const tag = await client.tags.list();
   * ```
   */
  list(options?: RequestOptions): APIPromise<TagListResponse> {
    return this._client.get('/inventory/tags', options);
  }

  /**
   * Creates a new tag in your account.
   *
   * The name must be one you don't already use — names are compared case-insensitively, so `Trade` and `trade` count as the same and the second request returns `CONFLICT`.
   *
   * Send `"upsert": true` to make the call safe to repeat: when the tag already exists it is returned — updated with any `color` or `icon` you sent — instead of failing with `CONFLICT`. One call then guarantees the tag exists before you reference it on inventory lines.
   *
   * Requires the `inventory:write` scope.
   *
   * @param {TagCreateParams} body - The request body to send.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<TagCreateResponse>} Tag created — or returned, when `upsert` matched an existing tag.
   *
   * @example
   * ```ts
   * const tag = await client.tags.create({
   *   name: 'Trade binder',
   * });
   * ```
   */
  create(body: TagCreateParams, options?: RequestOptions): APIPromise<TagCreateResponse> {
    return this._client.post('/inventory/tags', { body, ...options });
  }

  /**
   * Renames a tag or changes its display colour or icon. Send only the fields you want to change.
   *
   * Renaming keeps the tag attached to every line that already carries it — the lines follow the new name. A new name that clashes with another of your tags returns `CONFLICT`.
   *
   * Requires the `inventory:write` scope.
   *
   * @param {string} tagName - The tag's current name. URL-encode it in the path — e.g. `Trade%20binder`. Matched case-insensitively.
   * @param {TagUpdateParams} [body] - The request body to send.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<TagUpdateResponse>} Tag updated.
   *
   * @example
   * ```ts
   * const tag = await client.tags.update('tagName');
   * ```
   */
  update(
    tagName: string,
    body: TagUpdateParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<TagUpdateResponse> {
    return this._client.patch(__scalarPath`/inventory/tags/${tagName}`, { body, ...options });
  }

  /**
   * Deletes a tag from your account and detaches it from every line that carries it. The lines themselves are kept — only the tag is removed.
   *
   * Requires the `inventory:write` scope.
   *
   * @param {string} tagName - The tag's current name. URL-encode it in the path — e.g. `Trade%20binder`. Matched case-insensitively.
   * @param {TagDeleteParams} [body] - The request body to send.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<unknown>} Tag deleted.
   *
   * @example
   * ```ts
   * const response = await client.tags.delete('tagName');
   * ```
   */
  delete(
    tagName: string,
    body: TagDeleteParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<unknown> {
    return this._client.delete(__scalarPath`/inventory/tags/${tagName}`, { body, ...options });
  }
}

export type TagListResponse = Array<TagListResponse.TagListResponseItem>;

export namespace TagListResponse {
  export interface TagListResponseItem {
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

export interface TagCreateParams {
  /**
   * The tag's name, unique within your account.
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
   * When `true` and you already have a tag with this name, the request returns that tag — updated with any `color` or `icon` you sent — instead of failing with `CONFLICT`. The existing tag keeps its stored name spelling.
   */
  upsert?: boolean;
}

export interface TagCreateResponse {
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

export interface TagUpdateParams {
  /**
   * A new name for the tag. Omit to leave the name unchanged.
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

export interface TagUpdateResponse {
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

export type TagDeleteParams = Record<string, unknown>;
export declare namespace Tags {
  export {
    type TagListResponse as TagListResponse,
    type TagCreateResponse as TagCreateResponse,
    type TagUpdateResponse as TagUpdateResponse,
    type TagCreateParams as TagCreateParams,
    type TagUpdateParams as TagUpdateParams,
    type TagDeleteParams as TagDeleteParams,
  };
}
