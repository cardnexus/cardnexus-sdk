// File generated from our OpenAPI spec by Scalar. See README.md for details.

import { APIResource } from '../resource';
import { APIPromise } from '../api-promise';
import type { RequestOptions } from '../internal/request-options';
import { path as __scalarPath } from '../internal/utils/path';
import type * as OffersAPI from './offers';

export class Feeds extends APIResource {
  /**
   * Returns download links and metadata for all three of a game's feeds: the products catalog, the expansions list, and current prices.
   *
   * Each feed is a gzip-compressed, newline-delimited JSON file (one record per line). A feed is `null` until it has been generated for the first time.
   *
   * Each `url` is a time-limited download link. Request this endpoint again to get fresh links once they expire.
   *
   * The feed file formats and record shapes are documented at https://docs.cardnexus.com/feeds.
   *
   * Authentication is required (any valid API key); no scope.
   *
   * @param {string} gameID - The game's identifier (e.g. `mtg`, `pokemon`). Returned by `GET /v1/games`.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<FeedRetrieveResponse>} Feed metadata returned.
   *
   * @example
   * ```ts
   * const feed = await client.feeds.retrieve('gameId');
   * ```
   */
  retrieve(gameID: string, options?: RequestOptions): APIPromise<FeedRetrieveResponse> {
    return this._client.get(__scalarPath`/feeds/${gameID}`, options);
  }

  /**
   * Returns a download link and metadata for a game's products catalog feed.
   *
   * The file is gzip-compressed, newline-delimited JSON. Each line is one product: its identifier, product type, name, expansion, finishes, languages, images, Cardmarket / TCGplayer ids, and game-specific attributes — the same field names as the Products endpoints. It does not contain prices — see the prices feed for those. The download is the literal gzip bytes — your HTTP client will not decompress it automatically. Gunzip the file before reading it; see https://docs.cardnexus.com/feeds for download examples in Node and Python.
   *
   * The catalog feed is rebuilt when a game's catalog is updated. `checksum` changes only when the catalog changes. The `url` is a time-limited download link; request this endpoint again for a fresh link once it expires.
   *
   * The file's record shape (one product per line) is documented at https://docs.cardnexus.com/feeds/catalog.
   *
   * Authentication is required (any valid API key); no scope.
   *
   * @param {string} gameID - The game's identifier (e.g. `mtg`, `pokemon`). Returned by `GET /v1/games`.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<FeedListCatalogResponse>} Catalog feed metadata returned.
   *
   * @example
   * ```ts
   * const feed = await client.feeds.listCatalog('gameId');
   * ```
   */
  listCatalog(gameID: string, options?: RequestOptions): APIPromise<FeedListCatalogResponse> {
    return this._client.get(__scalarPath`/feeds/${gameID}/catalog`, options);
  }

  /**
   * Returns a download link and metadata for a game's expansions feed.
   *
   * The file is gzip-compressed, newline-delimited JSON. Each line is one expansion (set): its identifier, name, code, release date, card and sealed-product counts, and game-specific attributes. The download is the literal gzip bytes — your HTTP client will not decompress it automatically. Gunzip the file before reading it; see https://docs.cardnexus.com/feeds for download examples in Node and Python.
   *
   * The expansions feed is rebuilt when a game's catalog is updated. `checksum` changes only when the expansions change. The `url` is a time-limited download link; request this endpoint again for a fresh link once it expires.
   *
   * The file's record shape (one expansion per line) is documented at https://docs.cardnexus.com/feeds/expansions.
   *
   * Authentication is required (any valid API key); no scope.
   *
   * @param {string} gameID - The game's identifier (e.g. `mtg`, `pokemon`). Returned by `GET /v1/games`.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<FeedListExpansionsResponse>} Expansions feed metadata returned.
   *
   * @example
   * ```ts
   * const feed = await client.feeds.listExpansions('gameId');
   * ```
   */
  listExpansions(gameID: string, options?: RequestOptions): APIPromise<FeedListExpansionsResponse> {
    return this._client.get(__scalarPath`/feeds/${gameID}/expansions`, options);
  }

  /**
   * Returns a download link and metadata for a game's prices feed.
   *
   * The file is gzip-compressed, newline-delimited JSON. Each line is one product: its current Cardmarket, TCGplayer, and CardNexus marketplace prices, broken down by finish — the same price blocks as `GET /v1/products/{productId}/prices`. Products link back to the catalog feed by `productId`. The download is the literal gzip bytes — your HTTP client will not decompress it automatically. Gunzip the file before reading it; see https://docs.cardnexus.com/feeds for download examples in Node and Python.
   *
   * The prices feed is rebuilt when a game's prices are refreshed. The `url` is a time-limited download link; request this endpoint again for a fresh link once it expires.
   *
   * The file's record shape (one product per line) is documented at https://docs.cardnexus.com/feeds/prices.
   *
   * Authentication is required (any valid API key); no scope.
   *
   * @param {string} gameID - The game's identifier (e.g. `mtg`, `pokemon`). Returned by `GET /v1/games`.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<FeedListPricesResponse>} Prices feed metadata returned.
   *
   * @example
   * ```ts
   * const feed = await client.feeds.listPrices('gameId');
   * ```
   */
  listPrices(gameID: string, options?: RequestOptions): APIPromise<FeedListPricesResponse> {
    return this._client.get(__scalarPath`/feeds/${gameID}/prices`, options);
  }

  /**
   * Returns the history of a game's catalog updates, newest first.
   *
   * Each entry covers one catalog update: when it went live and how many products and expansions were added, modified, or removed. Pass `includeChanges=true` to also get the slug and id of everything that changed.
   *
   * Results are paginated. Pass the `nextCursor` from one response as `cursor` on the next request to walk the full history; `nextCursor` is `null` on the last page.
   *
   * For the feeds these updates apply to, see https://docs.cardnexus.com/feeds.
   *
   * Authentication is required (any valid API key); no scope.
   *
   * @param {string} gameID - The game's identifier (e.g. `mtg`, `pokemon`). Returned by `GET /v1/games`.
   * @param {FeedListChangelogParams} [query] - The parameters to send with the request.
   * @param {RequestOptions} [options] - Options to apply to the request, such as headers and an abort signal.
   * @returns {APIPromise<FeedListChangelogResponse>} Changelog page returned.
   *
   * @example
   * ```ts
   * const feed = await client.feeds.listChangelog('gameId', {
   *   limit: 50,
   *   includeChanges: false,
   * });
   * ```
   */
  listChangelog(
    gameID: string,
    query: FeedListChangelogParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<FeedListChangelogResponse> {
    return this._client.get(__scalarPath`/feeds/${gameID}/changelog`, { query, ...options });
  }
}

export interface FeedRetrieveResponse {
  /**
   * The products feed, or null if it has not been generated yet.
   */
  catalog: FeedRetrieveResponse.Catalog | null;
  /**
   * The expansions feed, or null if it has not been generated yet.
   */
  expansions: FeedRetrieveResponse.Expansions | null;
  /**
   * The prices feed, or null if it has not been generated yet.
   */
  prices: FeedRetrieveResponse.Prices | null;
}

export namespace FeedRetrieveResponse {
  export interface Catalog {
    /**
     * Which feed this is.
     */
    feedType: 'catalog';
    /**
     * A time-limited link to download the feed file. It stops working at `urlExpiresAt`; request this endpoint again for a fresh link.
     */
    url: string;
    /**
     * When `url` stops working.
     * @format date-time
     */
    urlExpiresAt: string;
    /**
     * SHA-256 hash of the feed's uncompressed contents. It changes only when the feed's contents change.
     */
    checksum: string;
    /**
     * Size of the gzip-compressed file, in bytes.
     * @minimum 0
     * @maximum 9007199254740991
     */
    sizeBytes: number;
    /**
     * Number of records in the file (one record per line).
     * @minimum 0
     * @maximum 9007199254740991
     */
    recordCount: number;
    /**
     * The file format: newline-delimited JSON, one record per line.
     */
    format: 'ndjson';
    /**
     * The file is gzip-compressed. Decompress it before reading.
     */
    encoding: 'gzip';
    /**
     * When this feed was last rebuilt. This advances on every rebuild, even when the new file is identical to the previous one.
     * @format date-time
     */
    lastRefreshedAt: string;
    /**
     * When the feed's current contents were first produced. This advances only when the contents actually change, so it tracks `checksum`: a rebuild that produces the same `checksum` keeps the same `generatedAt`, while `lastRefreshedAt` still moves.
     * @format date-time
     */
    generatedAt: string;
  }

  export interface Expansions {
    /**
     * Which feed this is.
     */
    feedType: 'expansions';
    /**
     * A time-limited link to download the feed file. It stops working at `urlExpiresAt`; request this endpoint again for a fresh link.
     */
    url: string;
    /**
     * When `url` stops working.
     * @format date-time
     */
    urlExpiresAt: string;
    /**
     * SHA-256 hash of the feed's uncompressed contents. It changes only when the feed's contents change.
     */
    checksum: string;
    /**
     * Size of the gzip-compressed file, in bytes.
     * @minimum 0
     * @maximum 9007199254740991
     */
    sizeBytes: number;
    /**
     * Number of records in the file (one record per line).
     * @minimum 0
     * @maximum 9007199254740991
     */
    recordCount: number;
    /**
     * The file format: newline-delimited JSON, one record per line.
     */
    format: 'ndjson';
    /**
     * The file is gzip-compressed. Decompress it before reading.
     */
    encoding: 'gzip';
    /**
     * When this feed was last rebuilt. This advances on every rebuild, even when the new file is identical to the previous one.
     * @format date-time
     */
    lastRefreshedAt: string;
    /**
     * When the feed's current contents were first produced. This advances only when the contents actually change, so it tracks `checksum`: a rebuild that produces the same `checksum` keeps the same `generatedAt`, while `lastRefreshedAt` still moves.
     * @format date-time
     */
    generatedAt: string;
  }

  export interface Prices {
    /**
     * Which feed this is.
     */
    feedType: 'prices';
    /**
     * A time-limited link to download the feed file. It stops working at `urlExpiresAt`; request this endpoint again for a fresh link.
     */
    url: string;
    /**
     * When `url` stops working.
     * @format date-time
     */
    urlExpiresAt: string;
    /**
     * SHA-256 hash of the feed's uncompressed contents. It changes only when the feed's contents change.
     */
    checksum: string;
    /**
     * Size of the gzip-compressed file, in bytes.
     * @minimum 0
     * @maximum 9007199254740991
     */
    sizeBytes: number;
    /**
     * Number of records in the file (one record per line).
     * @minimum 0
     * @maximum 9007199254740991
     */
    recordCount: number;
    /**
     * The file format: newline-delimited JSON, one record per line.
     */
    format: 'ndjson';
    /**
     * The file is gzip-compressed. Decompress it before reading.
     */
    encoding: 'gzip';
    /**
     * When this feed was last rebuilt. This advances on every rebuild, even when the new file is identical to the previous one.
     * @format date-time
     */
    lastRefreshedAt: string;
    /**
     * When the feed's current contents were first produced. This advances only when the contents actually change, so it tracks `checksum`: a rebuild that produces the same `checksum` keeps the same `generatedAt`, while `lastRefreshedAt` still moves.
     * @format date-time
     */
    generatedAt: string;
  }
}

export interface FeedListCatalogResponse {
  /**
   * Which feed this is.
   */
  feedType: 'catalog';
  /**
   * A time-limited link to download the feed file. It stops working at `urlExpiresAt`; request this endpoint again for a fresh link.
   */
  url: string;
  /**
   * When `url` stops working.
   * @format date-time
   */
  urlExpiresAt: string;
  /**
   * SHA-256 hash of the feed's uncompressed contents. It changes only when the feed's contents change.
   */
  checksum: string;
  /**
   * Size of the gzip-compressed file, in bytes.
   * @minimum 0
   * @maximum 9007199254740991
   */
  sizeBytes: number;
  /**
   * Number of records in the file (one record per line).
   * @minimum 0
   * @maximum 9007199254740991
   */
  recordCount: number;
  /**
   * The file format: newline-delimited JSON, one record per line.
   */
  format: 'ndjson';
  /**
   * The file is gzip-compressed. Decompress it before reading.
   */
  encoding: 'gzip';
  /**
   * When this feed was last rebuilt. This advances on every rebuild, even when the new file is identical to the previous one.
   * @format date-time
   */
  lastRefreshedAt: string;
  /**
   * When the feed's current contents were first produced. This advances only when the contents actually change, so it tracks `checksum`: a rebuild that produces the same `checksum` keeps the same `generatedAt`, while `lastRefreshedAt` still moves.
   * @format date-time
   */
  generatedAt: string;
}

export interface FeedListExpansionsResponse {
  /**
   * Which feed this is.
   */
  feedType: 'expansions';
  /**
   * A time-limited link to download the feed file. It stops working at `urlExpiresAt`; request this endpoint again for a fresh link.
   */
  url: string;
  /**
   * When `url` stops working.
   * @format date-time
   */
  urlExpiresAt: string;
  /**
   * SHA-256 hash of the feed's uncompressed contents. It changes only when the feed's contents change.
   */
  checksum: string;
  /**
   * Size of the gzip-compressed file, in bytes.
   * @minimum 0
   * @maximum 9007199254740991
   */
  sizeBytes: number;
  /**
   * Number of records in the file (one record per line).
   * @minimum 0
   * @maximum 9007199254740991
   */
  recordCount: number;
  /**
   * The file format: newline-delimited JSON, one record per line.
   */
  format: 'ndjson';
  /**
   * The file is gzip-compressed. Decompress it before reading.
   */
  encoding: 'gzip';
  /**
   * When this feed was last rebuilt. This advances on every rebuild, even when the new file is identical to the previous one.
   * @format date-time
   */
  lastRefreshedAt: string;
  /**
   * When the feed's current contents were first produced. This advances only when the contents actually change, so it tracks `checksum`: a rebuild that produces the same `checksum` keeps the same `generatedAt`, while `lastRefreshedAt` still moves.
   * @format date-time
   */
  generatedAt: string;
}

export interface FeedListPricesResponse {
  /**
   * Which feed this is.
   */
  feedType: 'prices';
  /**
   * A time-limited link to download the feed file. It stops working at `urlExpiresAt`; request this endpoint again for a fresh link.
   */
  url: string;
  /**
   * When `url` stops working.
   * @format date-time
   */
  urlExpiresAt: string;
  /**
   * SHA-256 hash of the feed's uncompressed contents. It changes only when the feed's contents change.
   */
  checksum: string;
  /**
   * Size of the gzip-compressed file, in bytes.
   * @minimum 0
   * @maximum 9007199254740991
   */
  sizeBytes: number;
  /**
   * Number of records in the file (one record per line).
   * @minimum 0
   * @maximum 9007199254740991
   */
  recordCount: number;
  /**
   * The file format: newline-delimited JSON, one record per line.
   */
  format: 'ndjson';
  /**
   * The file is gzip-compressed. Decompress it before reading.
   */
  encoding: 'gzip';
  /**
   * When this feed was last rebuilt. This advances on every rebuild, even when the new file is identical to the previous one.
   * @format date-time
   */
  lastRefreshedAt: string;
  /**
   * When the feed's current contents were first produced. This advances only when the contents actually change, so it tracks `checksum`: a rebuild that produces the same `checksum` keeps the same `generatedAt`, while `lastRefreshedAt` still moves.
   * @format date-time
   */
  generatedAt: string;
}

export interface FeedListChangelogParams {
  cursor?: string;
  /**
   * @default 50
   * @minimum 1
   * @maximum 100
   */
  limit?: number;
  /**
   * When true, each entry lists the products and expansions that changed — slug and id — not just the counts.
   * @default false
   */
  includeChanges?: boolean;
}

export interface FeedListChangelogResponse {
  data: Array<FeedListChangelogResponse.Data>;
  pagination: FeedListChangelogResponse.Pagination;
}

export namespace FeedListChangelogResponse {
  export interface Data {
    /**
     * This changelog entry's identifier.
     */
    id: string;
    /**
     * When this catalog update went live.
     * @format date-time
     */
    deployedAt: string;
    summary: Data.Summary;
    /**
     * The products and expansions that changed. Present only when you pass `includeChanges=true`.
     */
    changes?: Data.Changes;
  }

  export namespace Data {
    export interface Summary {
      /**
       * How many products changed in this update.
       */
      products: Summary.Products;
      /**
       * How many expansions changed in this update.
       */
      expansions: Summary.Expansions;
    }

    export namespace Summary {
      export interface Products {
        /**
         * Number added in this update.
         * @minimum 0
         * @maximum 9007199254740991
         */
        added: number;
        /**
         * Number modified in this update.
         * @minimum 0
         * @maximum 9007199254740991
         */
        modified: number;
        /**
         * Number removed in this update.
         * @minimum 0
         * @maximum 9007199254740991
         */
        removed: number;
      }

      export interface Expansions {
        /**
         * Number added in this update.
         * @minimum 0
         * @maximum 9007199254740991
         */
        added: number;
        /**
         * Number modified in this update.
         * @minimum 0
         * @maximum 9007199254740991
         */
        modified: number;
        /**
         * Number removed in this update.
         * @minimum 0
         * @maximum 9007199254740991
         */
        removed: number;
      }
    }

    export interface Changes {
      products: Changes.Products;
      expansions: Changes.Expansions;
    }

    export namespace Changes {
      export interface Products {
        /**
         * Products added in this update.
         */
        added: Array<Products.Added>;
        /**
         * Products modified in this update.
         */
        modified: Array<Products.Modified>;
        /**
         * Products removed in this update.
         */
        removed: Array<Products.Removed>;
      }

      export namespace Products {
        export interface Added {
          /**
           * The product's slug — matches `slug` in the catalog feed. Unique per printing within the game.
           */
          slug: string;
          /**
           * The product's identifier — matches `id` in the catalog feed and the Products endpoints. Absent for products that have been removed from the catalog.
           * @minimum -9007199254740991
           * @maximum 9007199254740991
           */
          productId?: OffersAPI.CatalogID;
        }

        export interface Modified {
          /**
           * The product's slug — matches `slug` in the catalog feed. Unique per printing within the game.
           */
          slug: string;
          /**
           * The product's identifier — matches `id` in the catalog feed and the Products endpoints. Absent for products that have been removed from the catalog.
           * @minimum -9007199254740991
           * @maximum 9007199254740991
           */
          productId?: OffersAPI.CatalogID;
        }

        export interface Removed {
          /**
           * The product's slug — matches `slug` in the catalog feed. Unique per printing within the game.
           */
          slug: string;
          /**
           * The product's identifier — matches `id` in the catalog feed and the Products endpoints. Absent for products that have been removed from the catalog.
           * @minimum -9007199254740991
           * @maximum 9007199254740991
           */
          productId?: OffersAPI.CatalogID;
        }
      }

      export interface Expansions {
        /**
         * Expansions added in this update.
         */
        added: Array<Expansions.Added>;
        /**
         * Expansions modified in this update.
         */
        modified: Array<Expansions.Modified>;
        /**
         * Expansions removed in this update.
         */
        removed: Array<Expansions.Removed>;
      }

      export namespace Expansions {
        export interface Added {
          /**
           * The expansion's slug — matches `slug` in the expansions feed and on `GET /v1/games/{gameId}/expansions`.
           */
          slug: string;
          /**
           * The expansion's identifier — matches `id` in the expansions feed and the Products endpoints. Absent for expansions that have been removed from the catalog.
           * @minimum -9007199254740991
           * @maximum 9007199254740991
           */
          expansionId?: OffersAPI.CatalogID;
        }

        export interface Modified {
          /**
           * The expansion's slug — matches `slug` in the expansions feed and on `GET /v1/games/{gameId}/expansions`.
           */
          slug: string;
          /**
           * The expansion's identifier — matches `id` in the expansions feed and the Products endpoints. Absent for expansions that have been removed from the catalog.
           * @minimum -9007199254740991
           * @maximum 9007199254740991
           */
          expansionId?: OffersAPI.CatalogID;
        }

        export interface Removed {
          /**
           * The expansion's slug — matches `slug` in the expansions feed and on `GET /v1/games/{gameId}/expansions`.
           */
          slug: string;
          /**
           * The expansion's identifier — matches `id` in the expansions feed and the Products endpoints. Absent for expansions that have been removed from the catalog.
           * @minimum -9007199254740991
           * @maximum 9007199254740991
           */
          expansionId?: OffersAPI.CatalogID;
        }
      }
    }
  }

  export interface Pagination {
    nextCursor: string | null;
  }
}
export declare namespace Feeds {
  export {
    type FeedRetrieveResponse as FeedRetrieveResponse,
    type FeedListCatalogResponse as FeedListCatalogResponse,
    type FeedListExpansionsResponse as FeedListExpansionsResponse,
    type FeedListPricesResponse as FeedListPricesResponse,
    type FeedListChangelogResponse as FeedListChangelogResponse,
    type FeedListChangelogParams as FeedListChangelogParams,
  };
}
