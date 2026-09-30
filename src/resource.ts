// File generated from our OpenAPI spec by Scalar. See README.md for details.

import type { CardNexusPublicAPI } from './client';

export abstract class APIResource {
  protected _client: CardNexusPublicAPI;

  constructor(client: CardNexusPublicAPI) {
    this._client = client;
  }
}
