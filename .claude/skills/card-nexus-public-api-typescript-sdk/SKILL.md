---
name: card-nexus-public-api-typescript-sdk
description: "TypeScript SDK for CardNexus Public API. Use when writing TypeScript code that calls CardNexus Public API with the @cardnexus/cardnexus-public package: installing it, constructing and authenticating the client, and calling API operations."
---

# CardNexus Public API TypeScript SDK

Generated TypeScript client for CardNexus Public API, published as `@cardnexus/cardnexus-public`. Use the generated client instead of hand-writing HTTP requests.

## Install

```sh
npm install @cardnexus/cardnexus-public
```

## Client setup and authentication

```ts
import CardNexusPublicAPI from '@cardnexus/cardnexus-public';

const client = new CardNexusPublicAPI({
  bearerAuth: process.env['BEARER_AUTH'], // defaults to the BEARER_AUTH env var
});
```

Provide credentials using the options below. Environment variables are read automatically when the target runtime supports them:

- `bearerAuth` (env: `BEARER_AUTH`) — CardNexus API key. Mint one from cardnexus.com → Settings → API Keys. Format: `cnk_live_` followed by a random string.

## Calling operations

```ts
import CardNexusPublicAPI from '@cardnexus/cardnexus-public';

const client = new CardNexusPublicAPI({
  bearerAuth: process.env['BEARER_AUTH'], // defaults to the BEARER_AUTH env var
});

const offer = await client.offers.list({
  limit: 50,
});

console.log(offer);
```

Method names, parameter shapes, and response types are generated from the API description — do not guess them. Look up the exact call signature in [api.md](../../../api.md) before writing a call.

## Error handling

Non-success responses throw generated API errors. Error objects expose status, headers, response body, and request metadata where the target runtime supports it.

```ts
import { APIError } from '@cardnexus/cardnexus-public';

try {
  const offer = await client.offers.list({
    limit: 50,
  });
} catch (err) {
  if (err instanceof APIError) {
    console.log(err.status, err.name, err.headers);
  }
  throw err;
}
```

## Requirements

- Node.js 20+, a modern browser, or any runtime with `fetch` support

## Reference files

- [README.md](../../../README.md) — full feature tour: client options, request options, retries and timeouts, logging.
- [api.md](../../../api.md) — complete catalogue of every operation with request and response types.
