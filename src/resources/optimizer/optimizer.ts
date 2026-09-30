// File generated from our OpenAPI spec by Scalar. See README.md for details.

import { APIResource } from '../../resource';
import { APIPromise } from '../../api-promise';
import type { RequestOptions } from '../../internal/request-options';
import * as RunsAPI from './runs';
import {
  Runs,
  type OrderPartyRating,
  type Cart,
  type CartSellerGroup,
  type CartItem,
  type RunCreateResponse,
  type RunRetrieveResponse,
  type RunCreateParams,
  type RunApplyParams,
} from './runs';

export class Optimizer extends APIResource {
  runs: RunsAPI.Runs = new RunsAPI.Runs(this._client);
}

Optimizer.Runs = Runs;

export declare namespace Optimizer {
  export {
    Runs as Runs,
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
