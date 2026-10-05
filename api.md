# CardNexus Public TypeScript API

Complete reference of every operation, grouped by resource. See [the README](./README.md) for usage and configuration.

## Contents

- [`Offers`](#offers)
  - [List your offers](#list-your-offers)
  - [Send an opening offer](#send-an-opening-offer)
  - [Get an offer](#get-an-offer)
  - [Submit a counterproposal](#submit-a-counterproposal)
  - [Accept the current proposal](#accept-the-current-proposal)
  - [Decline the current proposal](#decline-the-current-proposal)
  - [Cancel an open offer](#cancel-an-open-offer)
  - [Add an accepted offer to your cart](#add-an-accepted-offer-to-your-cart)
- [`Account`](#account)
  - [Get your account](#get-your-account)
  - [Get your wallet balance](#get-your-wallet-balance)
  - [`Account Vacation`](#account-vacation)
    - [Get your vacation mode](#get-your-vacation-mode)
    - [Set your vacation mode](#set-your-vacation-mode)
- [`Products`](#products)
  - [List supported games](#list-supported-games)
  - [Get a game](#get-a-game)
  - [List a game's expansions](#list-a-games-expansions)
  - [Get an expansion](#get-an-expansion)
  - [Search products](#search-products)
  - [Get a product](#get-a-product)
  - [Get a product's listings](#get-a-products-listings)
  - [Resolve products by marketplace id](#resolve-products-by-marketplace-id)
- [`Feeds`](#feeds)
  - [Get a game's feeds](#get-a-games-feeds)
  - [Get the catalog feed](#get-the-catalog-feed)
  - [Get the expansions feed](#get-the-expansions-feed)
  - [Get the prices feed](#get-the-prices-feed)
  - [Get the catalog changelog](#get-the-catalog-changelog)
- [`Pricing`](#pricing)
  - [Get a product's current prices](#get-a-products-current-prices)
  - [Get a product's price history](#get-a-products-price-history)
  - [Get a product's recent sales](#get-a-products-recent-sales)
- [`Optimizer`](#optimizer)
  - [`Optimizer Runs`](#optimizer-runs)
    - [Start a cart-wizard run](#start-a-cart-wizard-run)
    - [Get a cart-wizard run](#get-a-cart-wizard-run)
    - [Apply a run's option to your cart](#apply-a-runs-option-to-your-cart)
- [`Cart`](#cart)
  - [Get your cart](#get-your-cart)
  - [Clear your cart](#clear-your-cart)
  - [`Cart Items`](#cart-items)
    - [Add items to your cart](#add-items-to-your-cart)
    - [Update a cart item's quantity](#update-a-cart-items-quantity)
    - [Remove an item from your cart](#remove-an-item-from-your-cart)
- [`Lines`](#lines)
  - [Get your inventory lines](#get-your-inventory-lines)
  - [Add inventory lines](#add-inventory-lines)
  - [Search your inventory](#search-your-inventory)
  - [Get an inventory line](#get-an-inventory-line)
  - [Update an inventory line](#update-an-inventory-line)
  - [Delete an inventory line](#delete-an-inventory-line)
  - [Set an inventory line's photos](#set-an-inventory-lines-photos)
- [`BulkOperations`](#bulkoperations)
  - [Start a bulk import](#start-a-bulk-import)
  - [Import a Cardmarket stock file](#import-a-cardmarket-stock-file)
  - [Import a TCGplayer export](#import-a-tcgplayer-export)
  - [Import a TCG Power Tools export](#import-a-tcg-power-tools-export)
  - [Start a bulk export](#start-a-bulk-export)
  - [Update inventory lines in bulk](#update-inventory-lines-in-bulk)
  - [Get a bulk job](#get-a-bulk-job)
- [`Tags`](#tags)
  - [List your tags](#list-your-tags)
  - [Create a tag](#create-a-tag)
  - [Rename or recolor a tag](#rename-or-recolor-a-tag)
  - [Delete a tag](#delete-a-tag)
- [`Locations`](#locations)
  - [List your locations](#list-your-locations)
  - [Create a location](#create-a-location)
  - [Rename or recolor a location](#rename-or-recolor-a-location)
  - [Delete a location](#delete-a-location)
- [`Listings`](#listings)
  - [Get your listings](#get-your-listings)
  - [List an inventory line for sale](#list-an-inventory-line-for-sale)
  - [Change a listing's price](#change-a-listings-price)
  - [Take a listing off sale](#take-a-listing-off-sale)
- [`Lists`](#lists)
  - [Get your lists](#get-your-lists)
  - [Create a list](#create-a-list)
  - [Get a list](#get-a-list)
  - [Update a list](#update-a-list)
  - [Delete a list](#delete-a-list)
- [`ListItems`](#listitems)
  - [Add or update cards in a list](#add-or-update-cards-in-a-list)
  - [Remove a card from a list](#remove-a-card-from-a-list)
- [`Sales`](#sales)
  - [List your sales](#list-your-sales)
  - [Get a sale](#get-a-sale)
  - [Mark a sale shipped](#mark-a-sale-shipped)
  - [Cancel a sale](#cancel-a-sale)
  - [Refund part of a sale](#refund-part-of-a-sale)
  - [Update a sale's metadata](#update-a-sales-metadata)
- [`Purchases`](#purchases)
  - [List your purchases](#list-your-purchases)
  - [Get a purchase](#get-a-purchase)
- [`Tracking`](#tracking)
  - [Send tracking scans](#send-tracking-scans)
- [`Connect`](#connect)
  - [Exchange a connect code](#exchange-a-connect-code)
- [`Accounts`](#accounts)
  - [Create a managed account](#create-a-managed-account)
  - [Create an onboarding link](#create-an-onboarding-link)

## Setup

```ts
import CardNexusPublicAPI from '@cardnexus/cardnexus-public';

const client = new CardNexusPublicAPI({
  bearerAuth: process.env['BEARER_AUTH'], // defaults to the BEARER_AUTH env var
});
```

## `Offers`

Send and respond to offers, read proposal history, and restore accepted offers to your cart. See [Offers](https://docs.cardnexus.com/offers).

### List your offers

Returns your sent and received offers, newest first by creation time.

Filter by role, repeatable status, or creation timestamps. All roles and statuses are included by default.

Follow pagination.nextCursor until it is null. The default limit is 50 and the maximum is 100.

Each result is a summary; fetch an offer for its items and proposal history. Requires offers:read.

| Direction | Type |
| --- | --- |
| Request | [`OfferListParams`](./src/resources/offers.ts) |
| Response | [`OfferListResponse`](./src/resources/offers.ts) |

```ts
const offer = await client.offers.list({
  limit: 50,
});
```

### Send an opening offer

Creates one offer for 1–1,000 distinct listings from one seller. Each item supplies only its listing ID and quantity. Supply either total in the listing currency or discountPercentage for the complete item subtotal. Per-item prices are not accepted.

The whole request is validated before creation. Your cart is unchanged, and stock is reserved only on acceptance. An existing live offer with this seller returns 409 with its offerId; cancel an open offer explicitly before replacing it.

The original subtotal must be at least 20 in the listing currency. Discounts may not exceed 40%; totals below 60% of the original subtotal or above the original subtotal return 422. The server allocates prices with the same rounding rules as the website; currentProposal.total is the resulting subtotal. You may make five creation requests per hour across your API credentials. Retries count toward this limit.

Returns the offer summary. Send an optional Idempotency-Key to repeat the same response for 24 hours. Requires offers:write.

| Direction | Type |
| --- | --- |
| Request | [`OfferCreateParams`](./src/resources/offers.ts) |
| Response | [`OfferCreateResponse`](./src/resources/offers.ts) |

```ts
const offer = await client.offers.create({
  items: [{ listingId: '665f3a2b1c8d4e9f7a6b5c52', quantity: 2 }],
  total: { amount: 25, currency: 'EUR' },
});
```

### Get an offer

Returns your offer with every negotiated item and its proposal history.

Proposals are ordered chronologically. Quantities and original listing prices remain fixed throughout the negotiation.

Only the buyer and seller can access an offer; other accounts receive 404.

The actions array lists operations currently available to you. Requires offers:read.

| Direction | Type |
| --- | --- |
| Response | [`OfferRetrieveResponse`](./src/resources/offers.ts) |

```ts
const offer = await client.offers.retrieve('665f3a2b1c8d4e9f7a6b5c59');
```

### Submit a counterproposal

Proposes a different total price for an open offer. You can counter only a proposal sent by the other participant.

Supply either total in the offer currency or discountPercentage for the complete original item subtotal. Discounts may not exceed 40%. Item membership and quantities remain fixed; per-item prices are not accepted. The returned total includes the same rounding as the website.

Set `proposalId` to `currentProposal.id` from GET /v1/offers/{offerId}. If a new price has arrived since you fetched the offer, the request returns `409 Conflict` without sending your counterproposal. Fetch the offer again and review the new price before responding.

Buyer proposals count toward the marketplace limit. A buyer counter beyond the limit declines the offer and returns a proposal-limit error.

Returns the updated summary. Supports an optional Idempotency-Key. Requires offers:write.

| Direction | Type |
| --- | --- |
| Request | [`OfferCounterParams`](./src/resources/offers.ts) |
| Response | [`OfferCounterResponse`](./src/resources/offers.ts) |

```ts
const offer = await client.offers.counter('665f3a2b1c8d4e9f7a6b5c59', {
  proposalId: '665f3a2b1c8d4e9f7a6b5c60',
  total: { amount: 26, currency: 'EUR' },
});
```

### Accept the current proposal

Accepts the current price proposal and reserves its stock. You can accept only a proposal sent by the other participant.

Set `proposalId` to `currentProposal.id` from GET /v1/offers/{offerId}. If the other participant has sent a new price since you fetched the offer, the request returns `409 Conflict` without accepting it. Fetch the offer again and review the new price before accepting.

If stock cannot be reserved, acceptance fails and the offer remains open. Acceptance starts a 48-hour redemption window. It leaves your cart unchanged and does not create a paid order. The buyer adds the accepted offer to the cart separately.

Returns the updated summary. Supports an optional Idempotency-Key. Requires offers:write.

| Direction | Type |
| --- | --- |
| Request | [`OfferAcceptParams`](./src/resources/offers.ts) |
| Response | [`OfferAcceptResponse`](./src/resources/offers.ts) |

```ts
const offer = await client.offers.accept('665f3a2b1c8d4e9f7a6b5c59', {
  proposalId: '665f3a2b1c8d4e9f7a6b5c60',
});
```

### Decline the current proposal

Declines the current price proposal and closes the offer. You can decline only a proposal sent by the other participant.

Set `proposalId` to `currentProposal.id` from GET /v1/offers/{offerId}. If a new price has arrived since you fetched the offer, the request returns `409 Conflict` without declining it. Fetch the offer again and review the new price before responding.

The offer's proposal history remains available through GET /v1/offers/{offerId}.

Returns the updated summary. Supports an optional Idempotency-Key. Requires offers:write.

| Direction | Type |
| --- | --- |
| Request | [`OfferDeclineParams`](./src/resources/offers.ts) |
| Response | [`OfferDeclineResponse`](./src/resources/offers.ts) |

```ts
const offer = await client.offers.decline('665f3a2b1c8d4e9f7a6b5c59', {
  proposalId: '665f3a2b1c8d4e9f7a6b5c60',
});
```

### Cancel an open offer

Withdraws from a pending or countered negotiation.

Either participant may cancel an open offer, including the participant who submitted its latest proposal.

Closed offers cannot be cancelled through this operation. The proposal history remains available.

Returns the updated summary. Supports an optional Idempotency-Key. Requires offers:write.

| Direction | Type |
| --- | --- |
| Request | [`OfferCancelParams`](./src/resources/offers.ts) |
| Response | [`OfferCancelResponse`](./src/resources/offers.ts) |

```ts
const offer = await client.offers.cancel('665f3a2b1c8d4e9f7a6b5c59');
```

### Add an accepted offer to your cart

Restores an accepted offer's items into the buyer's cart at their agreed quantities. Only the buyer may call this operation.

The offer must be accepted, unexpired, and unspent. Repeating the operation does not add the quantities again. Other cart items are preserved.

After restoration, removing negotiated items or reducing their quantities below the agreement voids the offer. Failed restoration voids this offer and releases its reservation.

Returns the offer summary; GET /v1/cart returns cart contents. Supports an optional Idempotency-Key. Requires offers:write and cart:write.

| Direction | Type |
| --- | --- |
| Request | [`OfferCreateToCartParams`](./src/resources/offers.ts) |
| Response | [`OfferCreateToCartResponse`](./src/resources/offers.ts) |

```ts
const offer = await client.offers.createToCart('665f3a2b1c8d4e9f7a6b5c59');
```

## `Account`

Read the account that owns your API key, check your wallet balance, and turn vacation mode on or off. See [Authentication](https://docs.cardnexus.com/guides/authentication).

### Get your account

Returns your account: your account id, identity (username, email, avatar, signup date), your seller profile if you've onboarded as a seller (including whether CardNexus manages shipping on your new sales), and the list of scopes your API key holds.

Requires the `account:read` scope.

| Direction | Type |
| --- | --- |
| Response | [`AccountMeResponse`](./src/resources/account/account.ts) |

```ts
const account = await client.account.me();
```

### Get your wallet balance

Returns your wallet balance: the funds `available` to pay out and the funds still `pending` from recent sales, each as a money amount, plus when the balance was last refreshed.

Requires the `financial:read` scope.

| Direction | Type |
| --- | --- |
| Response | [`AccountBalanceResponse`](./src/resources/account/account.ts) |

```ts
const account = await client.account.balance();
```

### `Account Vacation`

Read the account that owns your API key, check your wallet balance, and turn vacation mode on or off. See [Authentication](https://docs.cardnexus.com/guides/authentication).

#### Get your vacation mode

Returns whether vacation mode is on. While it's on, your listings are hidden from the Marketplace and buyers can't order from you; your inventory is kept and comes back when you turn it off.

Requires the `account:read` scope.

| Direction | Type |
| --- | --- |
| Response | [`VacationListResponse`](./src/resources/account/vacation.ts) |

```ts
const vacation = await client.account.vacation.list();
```

#### Set your vacation mode

Turns vacation mode on or off. Turning it on hides your listings from the Marketplace and stops new orders while keeping your inventory; turning it off restores them.

The change takes effect immediately and returns the resulting state.

Requires the `account:write` scope.

| Direction | Type |
| --- | --- |
| Request | [`VacationSetParams`](./src/resources/account/vacation.ts) |
| Response | [`VacationSetResponse`](./src/resources/account/vacation.ts) |

```ts
const vacation = await client.account.vacation.set({
  enabled: false,
});
```

## `Products`

Browse the CardNexus catalogue: list games and their expansions, search or look up individual products, browse a product's Marketplace listings, and resolve marketplace ids to CardNexus products. Product search also reports what is for sale and the cheapest copy that ships to a given country — see [Listing-aware search](https://docs.cardnexus.com/products/listing-aware-search). The [Feeds guide](https://docs.cardnexus.com/feeds) covers the same catalogue as downloadable files.

### List supported games

Returns every game CardNexus tracks. Use the `id` of each entry to address the game in other catalogue endpoints.

Authentication is required (any valid API key); no scope.

| Direction | Type |
| --- | --- |
| Response | [`ProductListGamesResponse`](./src/resources/products.ts) |

```ts
const product = await client.products.listGames();
```

### Get a game

Returns a single game by its identifier.

Authentication is required (any valid API key); no scope.

| Direction | Type |
| --- | --- |
| Response | [`GameSummary`](./src/resources/products.ts) |

```ts
const gameSummary = await client.products.retrieveGame('gameId');
```

### List a game's expansions

Returns every expansion (set) of a game, paginated. Newest expansions first by release date.

Authentication is required (any valid API key); no scope.

| Direction | Type |
| --- | --- |
| Request | [`ProductListGameExpansionsParams`](./src/resources/products.ts) |
| Response | [`ProductListGameExpansionsResponse`](./src/resources/products.ts) |

```ts
const product = await client.products.listGameExpansions('gameId', {
  offset: 0,
  limit: 50,
});
```

### Get an expansion

Returns a single expansion (set) by its identifier — name, code, release date, card and sealed-product counts, supported languages, logo and symbol URLs.

Authentication is required (any valid API key); no scope.

| Direction | Type |
| --- | --- |
| Response | [`ExpansionSummary`](./src/resources/products.ts) |

```ts
const expansionSummary = await client.products.retrieveExpansion('expansionId');
```

### Search products

Searches the catalogue. Returns a paginated list of products matching the body.

Use this to find a card by name, browse an expansion, or filter on game-specific attributes like rarity or color. To replicate the full catalogue, use `GET /v1/feeds/products` instead — the feed is regenerated whenever a game's catalogue updates (typically minutes after a change).

Filter fields:

- `name` — free-text search against the product name, ranked by relevance. A print number before or after the name (`sephiroth 44`) pins that print; an expansion code plus print number (`msh-54`, `msh 54`, `msh54`) pins a single card; an expansion code on its own (`msh`) surfaces that expansion's products.
- `printNumber` — exact print-number match, ignoring case.
- `productIds`, `expansionId`, `nameSlug` — direct lookups when you already know the identifier. `productIds`, `expansionId`, `cardmarketId`, and `tcgplayerId` take up to 200 ids per call — split larger sets across several calls.
- `expansionId` — one or more expansions, matched as "any of". Pair it with `nameSlug` to follow a card across a set of expansions.
- `productType`, `productCategory` — restrict to cards or sealed (and a sealed category like `booster_box`).
- `gameFilters` — pick a game (e.g. `{ "game": "mtg" }`), and optionally that game's own attribute filters in the same object.

Marketplace listings:

Send a `listings` object — even an empty one — and every result gains an `availability` block: how many listings match, and the cheapest one you can buy, with its `listingId` ready for `POST /v1/cart/items`. Filter those listings with `deliveryCountry`, `condition`, `language`, and `finish`, and set `inStock: true` to drop products with no match.

`deliveryCountry` applies the same rule as checkout, so a listing returned here can be added to your cart. Sellers ship within their own country and across Europe and North America; a country outside that set matches nothing.

`availability.cheapest.price` is what you pay. It sits alongside `pricesByFinish`, where `cardnexus.low` is the marketplace floor across every country and every seller — so the two differ whenever the cheapest copy in the world can't reach you.

Two combinations are rejected with `400`: `listings` together with `cardmarketId` or `tcgplayerId`, and `listings` together with `sortBy: releaseDate`. With `listings`, results are ordered by relevance and `offset` + `limit` cannot exceed 300,000.

Language: send an `Accept-Language` header (`en`, `fr`, `it`, `es`, `de`) to work in another language — your `name` text is matched in that language where a translation exists (falling back to English), and product and expansion names in the results come back in it where a translation exists. Searching `Blizzaroi` with `Accept-Language: fr` finds Abomasnow.

Pagination + sort:

- `limit` defaults to 50, max 200. `offset` defaults to 0.
- `sortBy`, `sortDirection` — sort the results.

Each result has `productType` set to either `card` or `sealed`. Card products carry per-finish prices and per-game attributes; sealed products carry a single price plus EAN/SKU.

This endpoint has its own rate-limit bucket (`catalogue-search`); paginating through tens of thousands of results will hit it before your account-level limit. The daily feeds are the right tool for bulk catalogue replication.

Authentication is required (any valid API key); no scope.

| Direction | Type |
| --- | --- |
| Request | [`ProductSearchParams`](./src/resources/products.ts) |
| Response | [`ProductSearchResponse`](./src/resources/products.ts) |

```ts
const product = await client.products.search({
  offset: 0,
  limit: 50,
});
```

### Get a product

Returns a single product by its identifier, including cross-platform IDs that map this product to its Cardmarket and TCGplayer equivalents.

The response is a discriminated union by `productType` (`card` or `sealed`).

Authentication is required (any valid API key); no scope.

| Direction | Type |
| --- | --- |
| Response | [`ProductRetrieveResponse`](./src/resources/products.ts) |

```ts
const product = await client.products.retrieve('productId');
```

### Get a product's listings

Returns the Marketplace listings for a catalogue product — every listing's price, quantity for sale, the card's condition and language, the seller's photos of the card, and the seller behind it.

Listings are sorted by price, cheapest first; when sellers list in different currencies, prices are compared in a common currency for the sort. Each listing's `price` stays in the currency the seller lists in.

Filter with any combination of `condition`, `language`, `finish`, and `region`. `condition`, `language`, and `finish` can each be repeated to match any of several values, e.g. `?condition=NM&condition=LP`. Pass `deliveryCountry` to keep only listings from sellers who ship to you — each listing then carries the seller's shipping charge under `seller.shipping`. Without `deliveryCountry`, every listing is returned and `seller.shipping` is `null`.

Results are paginated: follow `pagination.nextCursor` by passing it back as `cursor` until it comes back `null`. `limit` defaults to 50, maximum 100.

To buy from a listing, pass its `listingId` to `POST /v1/cart/items`.

Requests count against the `product-listings` rate limit: 120 requests per hour. If your integration needs more, contact support with your username and what you're building — limits can be raised per account.

Authentication is required (any valid API key); no scope.

| Direction | Type |
| --- | --- |
| Request | [`ProductListListingsParams`](./src/resources/products.ts) |
| Response | [`ProductListListingsResponse`](./src/resources/products.ts) |

```ts
const product = await client.products.listListings('productId', {
  limit: 50,
});
```

### Resolve products by marketplace id

Maps Cardmarket or TCGplayer product ids to CardNexus products, up to 200 ids per call.

Each id resolves to at most one product, including the finish the id maps to — a marketplace product id is finish-specific, so a card's Foil and Standard printings carry different ids. Ids with no match come back with `product: null`, so a single call gives you a complete mapping table, misses included.

Pair this with the bulk import: resolve your Cardmarket `idProduct` (or TCGplayer product id) column to CardNexus product ids, then send those as the `productId` on each `POST /v1/inventory/bulk/import` row.

Authentication is required (any valid API key); no scope.

| Direction | Type |
| --- | --- |
| Request | [`ProductResolveParams`](./src/resources/products.ts) |
| Response | [`ProductResolveResponse`](./src/resources/products.ts) |

```ts
const product = await client.products.resolve({
  marketplace: 'cardmarket',
  ids: [0],
});
```

## `Feeds`

Download the catalogue and price data as bulk files: per-game catalog, expansions, prices, and a catalog changelog. See the [Feeds guide](https://docs.cardnexus.com/feeds).

### Get a game's feeds

Returns download links and metadata for all three of a game's feeds: the products catalog, the expansions list, and current prices.

Each feed is a gzip-compressed, newline-delimited JSON file (one record per line). A feed is `null` until it has been generated for the first time.

Each `url` is a time-limited download link. Request this endpoint again to get fresh links once they expire.

The feed file formats and record shapes are documented at https://docs.cardnexus.com/feeds.

Authentication is required (any valid API key); no scope.

| Direction | Type |
| --- | --- |
| Response | [`FeedRetrieveResponse`](./src/resources/feeds.ts) |

```ts
const feed = await client.feeds.retrieve('gameId');
```

### Get the catalog feed

Returns a download link and metadata for a game's products catalog feed.

The file is gzip-compressed, newline-delimited JSON. Each line is one product: its identifier, product type, name, expansion, finishes, languages, images, Cardmarket / TCGplayer ids, and game-specific attributes — the same field names as the Products endpoints. It does not contain prices — see the prices feed for those. The download is the literal gzip bytes — your HTTP client will not decompress it automatically. Gunzip the file before reading it; see https://docs.cardnexus.com/feeds for download examples in Node and Python.

The catalog feed is rebuilt when a game's catalog is updated. `checksum` changes only when the catalog changes. The `url` is a time-limited download link; request this endpoint again for a fresh link once it expires.

The file's record shape (one product per line) is documented at https://docs.cardnexus.com/feeds/catalog.

Authentication is required (any valid API key); no scope.

| Direction | Type |
| --- | --- |
| Response | [`FeedListCatalogResponse`](./src/resources/feeds.ts) |

```ts
const feed = await client.feeds.listCatalog('gameId');
```

### Get the expansions feed

Returns a download link and metadata for a game's expansions feed.

The file is gzip-compressed, newline-delimited JSON. Each line is one expansion (set): its identifier, name, code, release date, card and sealed-product counts, and game-specific attributes. The download is the literal gzip bytes — your HTTP client will not decompress it automatically. Gunzip the file before reading it; see https://docs.cardnexus.com/feeds for download examples in Node and Python.

The expansions feed is rebuilt when a game's catalog is updated. `checksum` changes only when the expansions change. The `url` is a time-limited download link; request this endpoint again for a fresh link once it expires.

The file's record shape (one expansion per line) is documented at https://docs.cardnexus.com/feeds/expansions.

Authentication is required (any valid API key); no scope.

| Direction | Type |
| --- | --- |
| Response | [`FeedListExpansionsResponse`](./src/resources/feeds.ts) |

```ts
const feed = await client.feeds.listExpansions('gameId');
```

### Get the prices feed

Returns a download link and metadata for a game's prices feed.

The file is gzip-compressed, newline-delimited JSON. Each line is one product: its current Cardmarket, TCGplayer, and CardNexus marketplace prices, broken down by finish — the same price blocks as `GET /v1/products/{productId}/prices`. Products link back to the catalog feed by `productId`. The download is the literal gzip bytes — your HTTP client will not decompress it automatically. Gunzip the file before reading it; see https://docs.cardnexus.com/feeds for download examples in Node and Python.

The prices feed is rebuilt when a game's prices are refreshed. The `url` is a time-limited download link; request this endpoint again for a fresh link once it expires.

The file's record shape (one product per line) is documented at https://docs.cardnexus.com/feeds/prices.

Authentication is required (any valid API key); no scope.

| Direction | Type |
| --- | --- |
| Response | [`FeedListPricesResponse`](./src/resources/feeds.ts) |

```ts
const feed = await client.feeds.listPrices('gameId');
```

### Get the catalog changelog

Returns the history of a game's catalog updates, newest first.

Each entry covers one catalog update: when it went live and how many products and expansions were added, modified, or removed. Pass `includeChanges=true` to also get the slug and id of everything that changed.

Results are paginated. Pass the `nextCursor` from one response as `cursor` on the next request to walk the full history; `nextCursor` is `null` on the last page.

For the feeds these updates apply to, see https://docs.cardnexus.com/feeds.

Authentication is required (any valid API key); no scope.

| Direction | Type |
| --- | --- |
| Request | [`FeedListChangelogParams`](./src/resources/feeds.ts) |
| Response | [`FeedListChangelogResponse`](./src/resources/feeds.ts) |

```ts
const feed = await client.feeds.listChangelog('gameId', {
  limit: 50,
  includeChanges: false,
});
```

## `Pricing`

Read market prices for catalogue products: current prices, price history, and recent sales. See the [Pricing guide](https://docs.cardnexus.com/pricing).

### Get a product's current prices

Returns the product's current prices from three sources, keyed by finish:

- `cardmarket` — Cardmarket's daily price snapshot, in EUR: `low`/`mid`/`high`/`marketValue` tiers plus 24h/7d/30d trend percentages.
- `tcgplayer` — TCGplayer's daily price snapshot, in USD, with the same fields.
- `cardnexus` — the listings live on the CardNexus marketplace right now. `low` is the cheapest listing anywhere on the marketplace, converted to EUR at the current exchange rate; `listingCount` and `availableQuantity` count every region's listings. `regions` breaks the same numbers down per market region — `eu` in EUR and `na` in USD, each with its own cheapest listing, counts, and per-condition / per-language breakdowns. A region's prices are in that region's currency and never mixed with the other region's. A region with no live listings has no key. Graded listings count toward the totals but have no condition bucket.

A source block is absent when it has no data — a finish with no live listings has no `cardnexus` block, and a product with no prices at all returns an empty `pricesByFinish` object.

For day-by-day price history, see `GET /v1/products/{productId}/prices/history`. To download prices for a whole game in one file, see `GET /v1/feeds/{gameId}/prices`.

Requests count against the `pricing-snapshot` rate limit: 600 requests per hour.

Authentication is required (any valid API key); no scope.

| Direction | Type |
| --- | --- |
| Response | [`PricingListProductPricesResponse`](./src/resources/pricing.ts) |

```ts
const pricing = await client.pricing.listProductPrices('productId');
```

### Get a product's price history

Returns the product's daily price snapshots from Cardmarket (EUR) and TCGplayer (USD), one entry per day, marketplace, and finish, ordered by date ascending.

Each entry carries the day's `low`/`mid`/`high`/`marketValue` tiers. Days without a snapshot are absent from the result.

Narrow the result with `marketplace` and `finish`. `from` and `to` bound the range (both inclusive): `to` defaults to today, `from` to 30 days before `to`, and a single request can span at most 365 days.

For the current price including live CardNexus listings, see `GET /v1/products/{productId}/prices`.

Requests count against the `pricing-history` rate limit: 120 requests per hour.

Authentication is required (any valid API key); no scope.

| Direction | Type |
| --- | --- |
| Request | [`PricingListHistoryParams`](./src/resources/pricing.ts) |
| Response | [`PricingListHistoryResponse`](./src/resources/pricing.ts) |

```ts
const pricing = await client.pricing.listHistory('productId');
```

### Get a product's recent sales

Returns the product's sales on the CardNexus marketplace from the last 30 days, as a cursor-paginated list. There are no date parameters — the 30-day window is fixed.

A sale appears as soon as its order is placed, including orders still being shipped or delivered. If the order is later cancelled or refunded in full, the sale no longer appears.

Each sale carries the card's finish, condition (or grading), language, the quantity sold, the seller's market region (`eu` or `na`), and two prices: `price`, the per-card price the card was listed at in the listing's own currency, and `priceEur`, the same price converted to EUR at the exchange rate of the sale date. Sales carry no buyer or seller identifiers.

The list is ordered by `soldAt`, newest first. Narrow the result with `finish`, `condition`, and `language`. A page can hold slightly more entries than `limit` when one order contained several matching cards.

Walk the list by following `pagination.nextCursor`: pass it back as `cursor` until it comes back `null`. `limit` defaults to 50, maximum 100.

Requests count against the `product-sales` rate limit: 60 requests per hour.

Authentication is required (any valid API key); no scope.

| Direction | Type |
| --- | --- |
| Request | [`PricingListSalesParams`](./src/resources/pricing.ts) |
| Response | [`PricingListSalesResponse`](./src/resources/pricing.ts) |

```ts
const pricing = await client.pricing.listSales('productId', {
  limit: 50,
});
```

## `Optimizer`

### `Optimizer Runs`

Optimize a basket of cards into the cheapest, fewest-seller, or balanced ways to buy them across the marketplace — accounting for each seller's shipping, fees, and VAT. Start a run, poll it for the result, then apply an option to your cart.

#### Start a cart-wizard run

Optimizes a basket of cards into the cheapest / fewest-seller / balanced ways to buy them, accounting for each seller's shipping, fees and VAT.

The run executes in the background: this call returns right away with a run id and `status: "queued"`. Poll `GET /v1/optimizer/runs/{id}` — the options' totals fill in as it solves, and the full per-seller breakdown is ready once `status` is `done`. Subscribe to the `optimizer.run.completed` webhook to avoid polling. When two modes yield the same solution, the result contains a single option whose `modes` lists both.

Each target is either a specific printing (`productId`) or any printing of a card (`card` by slug). A basket holds up to 400 targets, in any mix of the two forms. Set per-target condition / finish / language, or `defaults` for the whole basket. Narrow the sellers by country, rating or an explicit include/exclude list.

Rate limited to 10 runs per hour. Send an `Idempotency-Key` header to make retries safe.

| Direction | Type |
| --- | --- |
| Request | [`RunCreateParams`](./src/resources/optimizer/runs.ts) |
| Response | [`RunCreateResponse`](./src/resources/optimizer/runs.ts) |

```ts
const run = await client.optimizer.runs.create({
  targets: [
    {
      quantity: 1,
    },
  ],
  destination: {
    country: 'xx',
  },
});
```

#### Get a cart-wizard run

Returns the current state of a run — `status`, best-so-far option totals while `solving`, and the full per-seller breakdown once `done`.

| Direction | Type |
| --- | --- |
| Response | [`RunRetrieveResponse`](./src/resources/optimizer/runs.ts) |

```ts
const run = await client.optimizer.runs.retrieve('id');
```

#### Apply a run's option to your cart

Replaces your cart with one of the run's options. Every line of the option goes into your cart exactly as proposed — listing and quantity — and anything already in your cart is removed. Cart prices are shown in each seller's listing currency, which can differ from the currency the run reports totals in. Unlike `POST /v1/cart/items`, which adds to what is already there, this replaces the whole cart in one step.

The run must be `done` — a run that is still `queued` or `solving`, or that `failed`, returns `409 RUN_NOT_READY`. Pick the option by `mode` — `lowest_price`, `fewest_sellers`, or `balanced` — matching the `modes` of the run's `result.options`; a mode no option satisfies returns `404 OPTION_NOT_FOUND`.

Your cart's delivery country becomes the run's destination country.

Returns your updated cart, in the same shape as `GET /v1/cart`.

Send an `Idempotency-Key` header to make retries safe: the same key returns the same response for 24 hours.

Requires the `cart:write` scope.

| Direction | Type |
| --- | --- |
| Request | [`RunApplyParams`](./src/resources/optimizer/runs.ts) |
| Response | [`Cart`](./src/resources/optimizer/runs.ts) |

```ts
const cart = await client.optimizer.runs.apply('id', {
  mode: 'lowest_price',
});
```

## `Cart`

Manage your shopping cart: read it, add listings to it, change quantities, and remove items. Add listings by their `listingId`, from `GET /v1/products/{productId}/listings` or an optimizer run's results.

### Get your cart

Returns your shopping cart, grouped by seller. Each group carries the seller's profile, their shipping charge to your delivery country, and the items you are buying from them.

An empty cart returns `deliveryCountry: null` and no seller groups.

Each item's `unitPrice` is the price when you added it. If the seller lowers their price, your cart price follows; if they raise it, the item is removed from your cart. When a listing no longer has enough units, your cart quantity is reduced to what is available.

Adding items to your cart does not put them on hold — availability is checked at checkout.

Requires the `cart:read` scope.

```ts
const cart = await client.cart.list();
```

### Clear your cart

Removes every item from your cart and returns the now-empty cart.

Clearing an empty cart changes nothing and still succeeds, so retries are safe.

Requires the `cart:write` scope.

| Direction | Type |
| --- | --- |
| Request | [`CartClearParams`](./src/resources/cart/cart.ts) |

```ts
const cart = await client.cart.clear({});
```

### `Cart Items`

Manage your shopping cart: read it, add listings to it, change quantities, and remove items. Add listings by their `listingId`, from `GET /v1/products/{productId}/listings` or an optimizer run's results.

#### Add items to your cart

Adds one or more listings to your cart. Each item names a listing (from `GET /v1/products/{productId}/listings` or an optimizer run's `lines`) and how many units to buy.

Items are processed in order, and each succeeds or fails on its own: the response carries your updated cart plus an `errors` array naming the rejected items and why. Adding a listing already in your cart adds to its quantity, subject to any per-listing limit the seller sets — going past it rejects the item with `QUANTITY_LIMIT_EXCEEDED`.

`deliveryCountry` sets where your order will ship, on every call. When it differs from your cart's current delivery country, the cart switches to it — items already in your cart from sellers who don't ship to the new country are removed. A cart holds items from one marketplace region (`eu` or `na`) at a time — listings from the other region are rejected with `REGION_MISMATCH`.

To buy an optimizer result, pass each line's `listingId` and `quantity` from the option you chose.

Send an `Idempotency-Key` header to make retries safe: the same key returns the same response for 24 hours.

Requires the `cart:write` scope.

| Direction | Type |
| --- | --- |
| Request | [`ItemCreateParams`](./src/resources/cart/items.ts) |
| Response | [`ItemCreateResponse`](./src/resources/cart/items.ts) |

```ts
const item = await client.cart.items.create({
  deliveryCountry: 'xx',
  items: [
    {
      listingId: 'x',
      quantity: 1,
    },
  ],
});
```

#### Update a cart item's quantity

Sets how many units of a listing your cart holds. Unlike `POST /v1/cart/items`, which adds to the existing quantity, this replaces it. A quantity past a per-listing limit the seller sets is rejected with `400 Bad Request`.

`quantity: 0` removes the item from your cart. A listing that is not in your cart returns `404 Not Found`.

Send an `Idempotency-Key` header to make retries safe: the same key returns the same response for 24 hours.

Requires the `cart:write` scope.

| Direction | Type |
| --- | --- |
| Request | [`ItemUpdateParams`](./src/resources/cart/items.ts) |

```ts
const cart = await client.cart.items.update('listingId', {
  quantity: 0,
});
```

#### Remove an item from your cart

Removes a listing from your cart and returns the updated cart.

Removing a listing that is not in your cart changes nothing and still succeeds, so retries are safe.

Requires the `cart:write` scope.

| Direction | Type |
| --- | --- |
| Request | [`ItemDeleteParams`](./src/resources/cart/items.ts) |

```ts
const cart = await client.cart.items.delete('listingId');
```

## `Lines`

Create, read, update, and delete individual inventory lines, and set their photos. See [Managing lines](https://docs.cardnexus.com/inventory/managing-lines).

### Get your inventory lines

Returns your inventory lines, newest writes included, as a cursor-paginated list ordered by line id.

Each line carries its product, finish, condition (or grading), language, quantity, and — when it is for sale — its listing price. `forSale` is `true` for lines published to the Marketplace and `false` for lines kept in your Collection.

Filter with any combination of `game`, `productId` (repeatable), `forSale`, `condition`, `language`, `finish`, `graded`, `customId`, `customIdPrefix`, `customIdContains`, `commentContains`, `location`, and `tags` (repeatable — matches lines carrying any of the named tags). Filters are combined with AND.

Walk the full set by following `pagination.nextCursor`: pass it back as `cursor` until it comes back `null`. The id order is stable, so a sweep stays consistent while you write to your inventory. `limit` defaults to 50, maximum 100.

This endpoint is for **reading and syncing** your inventory: it always reflects your latest changes and walks every line to the end. To find lines instead — free-text product-name search, all-of tag matching, relevance ranking — use `POST /v1/inventory/search`; both return the same line shape.

Requires the `inventory:read` scope.

| Direction | Type |
| --- | --- |
| Request | [`LineListParams`](./src/resources/lines.ts) |
| Response | [`LineListResponse`](./src/resources/lines.ts) |

```ts
const line = await client.lines.list({
  limit: 50,
});
```

### Add inventory lines

Adds new lines to your inventory — between 1 and 1000 per call.

Each line names a catalogue product (see `GET /v1/products`), a finish, a language, and a quantity, plus either a `condition` (raw cards) or `graded` details (graded cards). Optionally attach a `customId` (your own identifier, unique across your live lines), a `comment` (shown to buyers), private `notes`, a `location`, `tags`, or a `listing` to publish the line to the Marketplace right away.

`location` and `tags` are referenced by name and must already exist — create them first with `POST /v1/inventory/locations` and `POST /v1/inventory/tags`. A name that matches none of your labels rejects that line with `LOCATION_NOT_FOUND` or `TAG_NOT_FOUND`.

Lines are processed one by one: valid lines land in `created`, rejected lines are reported in `errors` with the position they had in your request. The response status is 200 even when some — or all — lines were rejected, so check both fields.

A new line without a `customId` that matches an existing line of yours exactly (same product, finish, condition, language, grading, and listing state) merges into it: the quantity is added to the existing line, and that line is returned in `created`.

When any line carries a `listing`, your seller account must be active and every listing price must use your seller currency.

Send an `Idempotency-Key` header to make retries safe: the same key returns the same response for 24 hours.

Requires the `inventory:write` scope.

| Direction | Type |
| --- | --- |
| Request | [`LineCreateParams`](./src/resources/lines.ts) |
| Response | [`LineCreateResponse`](./src/resources/lines.ts) |

```ts
const line = await client.lines.create({
  lines: [
    {
      productId: 50212,
      finish: 'Standard',
      language: 'x',
      quantity: 1,
    },
  ],
});
```

### Search your inventory

Searches your inventory lines. Returns a paginated list of lines matching the body, with `total` for the filtered set.

Filter fields (all combined with AND):

- `name` — free-text search against the product name, ranked by relevance. A print number before or after the name (`sephiroth 44`) pins that print; an expansion code plus print number (`msh-54`, `msh 54`, `msh54`) pins a single card. Send an `Accept-Language` header (`en`, `fr`, `it`, `es`, `de`) to match names in that language — not the same as the `language` filter, which matches the printed language of the cards themselves.
- `printNumber` — exact print-number match, ignoring case.
- `nameSlug` — exact slug match, ignoring case: every line you hold of that card, across printings and expansions.
- `tags`, `location` — match by label name. `{ "op": "or", "values": ["to-verify", "reserved"] }` returns lines carrying either tag; `"op": "and"` requires both. Pass `null` as a value to match lines with no tag (or no location) — `{ "op": "or", "values": [null] }` returns untagged lines.
- `customId`, `customIdPrefix`, `customIdContains` — match your own line identifiers, case-insensitively. `commentContains` matches your buyer-facing comments word by word.
- `productIds`, `expansionId`, `nameSlug` — direct catalogue lookups. `productIds` and `expansionId` take up to 200 ids per call — split larger sets across several calls.
- `condition`, `language`, `finish`, `graded`, `forSale`, `quantity`, `listingPrice` — line attributes.
- `productType`, `productCategory` — restrict to cards or sealed.
- `gameFilters` — pick a game (e.g. `{ "game": "mtg" }`), and optionally that game's own attribute filters in the same object.

Pagination + sort:

- `limit` defaults to 50, max 200. `offset` defaults to 0 and pages up to the first 10,000 matches — for a complete walk of your inventory use `GET /v1/inventory` or `POST /v1/inventory/bulk/export`.
- `sortBy`, `sortDirection` — sort the results. When `name` is set, results are ranked by relevance unless you sort explicitly.

This endpoint is for **finding** lines: relevance ranking, label and text matching, jump-to-page pagination. Results can lag your latest changes by a few seconds. To walk your whole inventory — always up to date, in a stable order, with no depth limit — use `GET /v1/inventory`; both return the same line shape.

`POST /v1/inventory/bulk/export` accepts the same `filters`, so a search can be turned into an export unchanged.

This endpoint has its own rate-limit bucket (`inventory-search`).

Requires the `inventory:read` scope.

| Direction | Type |
| --- | --- |
| Request | [`LineSearchParams`](./src/resources/lines.ts) |
| Response | [`LineSearchResponse`](./src/resources/lines.ts) |

```ts
const line = await client.lines.search({
  offset: 0,
  limit: 50,
});
```

### Get an inventory line

Returns a single inventory line of yours by its id.

The response carries the line's product, finish, condition (or grading), language, quantity, publication state, and listing price when it is for sale.

Requires the `inventory:read` scope.

| Direction | Type |
| --- | --- |
| Response | [`LineRetrieveResponse`](./src/resources/lines.ts) |

```ts
const line = await client.lines.retrieve('inventoryId');
```

### Update an inventory line

Changes a single inventory line — its quantity, condition, language, finish, grading, `customId`, `comment`, `notes`, `location`, `tags`, or `photos`. Send only the fields you want to change. A field this endpoint does not list is rejected with `BAD_REQUEST`.

`finish` and `language` must be ones the product exists in — see the product's `finishes` and `languages` on `GET /v1/products/{productId}`. A finish the product doesn't come in is rejected with `INVALID_FINISH`; a language it doesn't come in with `INVALID_LANGUAGE`.

Quantity takes either `{"set": n}` (new total) or `{"adjust": n}` (signed change). A change that would leave zero or fewer cards is rejected with `INSUFFICIENT_QUANTITY` — use `DELETE /v1/inventory/{inventoryId}` to remove a line.

`photos` takes the `url` values of the photos to keep, from the line's `photos`, in the order you want them: a photo you leave out is removed, and `[]` removes every photo. A URL that is not on the line returns `PHOTO_NOT_FOUND`. New photos are uploaded with `PUT /v1/inventory/{inventoryId}/media`.

`location` takes a location name, or `null` to move the line to no location. `tags` takes `{"set": [...]}` (replace the whole set, `[]` clears), `{"add": [...]}` (add, keep the rest), or `{"remove": [...]}` (remove only those). `location` and `tags` names must already exist — a name that matches none of your labels returns `LOCATION_NOT_FOUND` or `TAG_NOT_FOUND`. `notes` is your private note; pass `null` to remove it.

`count` applies the attribute changes to only part of the line. When `count` is lower than the line's quantity, the line splits: `count` cards take the changes and come back as `line`, the rest stays unchanged and comes back as `remainder`. The split-off part inherits the original line's `comment` unless you send a new one, and never inherits its `customId` — send `customId` to give the new part its own. `count` needs at least one attribute change and cannot be combined with `quantity`.

If the changes make this line identical to another of your lines (same product, finish, condition, language, grading, and listing state, neither line carrying a `customId`), the two merge; `line` is the surviving line.

Send an `Idempotency-Key` header to make retries safe: the same key returns the same response for 24 hours.

Requires the `inventory:write` scope.

| Direction | Type |
| --- | --- |
| Request | [`LineUpdateParams`](./src/resources/lines.ts) |
| Response | [`LineUpdateResponse`](./src/resources/lines.ts) |

```ts
const line = await client.lines.update('inventoryId');
```

### Delete an inventory line

Removes an inventory line entirely, whatever its quantity. If the line is published to the Marketplace, its listing is cancelled with it.

The line's `customId`, if it had one, becomes available for reuse on another line.

Requires the `inventory:write` scope.

| Direction | Type |
| --- | --- |
| Request | [`LineDeleteParams`](./src/resources/lines.ts) |
| Response | [`LineDeleteResponse`](./src/resources/lines.ts) |

```ts
const line = await client.lines.delete('inventoryId');
```

### Set an inventory line's photos

Replaces the photos attached to an inventory line. Buyers see these photos on your Marketplace listing for the line.

Send the request as `multipart/form-data` with each photo in the `files` field — between 1 and 10 images, any `image/*` content type, up to 10 MB each. The whole set is replaced in one call: include every photo the line should keep. A file that cannot be read as an image is rejected with `BAD_REQUEST`.

Requires the `inventory:write` scope.

| Direction | Type |
| --- | --- |
| Request | [`LineSetMediaParams`](./src/resources/lines.ts) |
| Response | [`LineSetMediaResponse`](./src/resources/lines.ts) |

```ts
const line = await client.lines.setMedia('inventoryId', {
  files: [''],
});
```

## `BulkOperations`

Import and export inventory files, apply bulk updates, import from Cardmarket, TCGplayer, and TCG Power Tools, and track job progress. See [Bulk operations](https://docs.cardnexus.com/inventory/bulk).

### Start a bulk import

Imports inventory lines from a file. Send the request as `multipart/form-data` with the file in the `file` field and its content type — `text/csv`, `application/json`, or `application/gzip`; `mode` and `format` are sent as plain form fields alongside it. Files up to 256 MB are accepted; larger uploads are rejected with `PAYLOAD_TOO_LARGE`, other content types with `UNSUPPORTED_CONTENT_TYPE`. When the file is gzip-compressed, `format` must say whether it holds `json` or `csv`.

The import runs in the background: this call returns a job right away, and you poll `GET /v1/inventory/bulk/jobs/{jobId}` for progress and results. Files produced by `POST /v1/inventory/bulk/export` use the same layout, so an export can be edited and imported back unchanged.

## File contents

A JSON file is a top-level array of row objects. A CSV file starts with a header row; columns are matched by name, in any order, and columns a row doesn't need can be left out entirely. Unknown columns are ignored. The full column set:

`productId,cardmarketId,tcgplayerId,finish,condition,gradedGrade,gradedCertification,gradedGradingService,language,quantity,customId,comment,notes,location,tags,listingPrice,listingCurrency`

In JSON, the three `graded*` columns are a single `graded` object with `grade`, `certification`, and `gradingService` fields, `tags` is an array of names, and omitted fields are left out of the row object. In CSV, `tags` is a single cell of comma-separated names (`Trade binder, Graded pile`). Files may be gzip-compressed. A file can hold up to 5,000,000 rows and 256 MB of data (after decompression).

Each row describes one inventory line:

- `productId` — the catalogue product's numeric id, from `GET /v1/products`. Required unless you supply a `cardmarketId` or `tcgplayerId`.
- `cardmarketId`, `tcgplayerId` — a Cardmarket or TCGplayer product id, resolved to the catalogue product when `productId` is absent. When a row has both a `productId` and a marketplace id, the `productId` wins. A marketplace id that matches no product fails that row with `PRODUCT_NOT_FOUND`.
- `finish` — the card's finish, e.g. `Standard`, `Foil`, `Reverse Holo`. Required.
- `condition` — `NM` (Near Mint), `LP` (Lightly Played), `MP` (Moderately Played), `HP` (Heavily Played), or `DMG` (Damaged). Required for raw cards; leave empty for graded cards.
- `gradedGrade`, `gradedCertification`, `gradedGradingService` — grading details for graded cards. A graded card needs `gradedGrade` and `gradedGradingService`; `gradedCertification` may be left empty when you do not have the certification number. Leave all three empty for raw cards.
- `language` — the card's language as a two-letter code, e.g. `en`. Required.
- `quantity` — the line's total quantity, a whole number of 0 or more. Required. This is an absolute count, not an increment: a row that matches an existing line by `customId` sets that line to this quantity.
- `customId` — your own stable identifier for the line, unique across your live lines.
- `comment` — free-text note for the line, shown to buyers on your Marketplace listing.
- `notes` — private note for the line, visible only to you.
- `location` — the name of a location to put the line in. Must match one of your existing locations (see `GET /v1/inventory/locations`); an unknown name fails that row with `LOCATION_NOT_FOUND`.
- `tags` — the names of tags to attach to the line. Each must match one of your existing tags (see `GET /v1/inventory/tags`); an unknown name fails that row with `TAG_NOT_FOUND`.
- `listingPrice`, `listingCurrency` — publish the line to the Marketplace at this per-card price, in decimal major units (`19.99`). Either both or neither.

## How rows apply

Rows carrying a `customId` that matches one of your live lines update that line to the row's state — quantity, attributes, and listing. Fields the row leaves empty (`comment`, `notes`, `location`, `tags`, the listing pair) keep the line's current value. Rows whose `customId` matches nothing create a new line. `tags` and `location` are referenced by name and must already exist; importing does not create labels.

Rows without a `customId` are additive: the quantity merges into an existing line with the same product, finish, condition, language, and grading, or creates one.

With `mode: "replace"`, every live line the file does not mention is set to a quantity of zero after all rows are applied.

A row that fails — unknown product, invalid value — does not stop the import. Failed rows are collected into a JSON error report, linked from the job's `errorReportUrl` when it completes.

Send an `Idempotency-Key` header to make retries safe: the same key returns the same response for 24 hours.

Requires the `inventory:write` scope.

| Direction | Type |
| --- | --- |
| Request | [`BulkOperationImportParams`](./src/resources/bulk-operations.ts) |
| Response | [`BulkOperationImportResponse`](./src/resources/bulk-operations.ts) |

```ts
const bulkOperation = await client.bulkOperations.import({
  file: '',
  mode: 'upsert',
});
```

### Import a Cardmarket stock file

Imports a Cardmarket "Export Own Stock" file as-is — send the file you downloaded from Cardmarket, no reformatting. Send it as `multipart/form-data` with the file in the `file` field and `mode` as a plain form field.

Each row is matched to a CardNexus product by its `idProduct`. The `idArticle` becomes the line's `customId`, the foil / reverse-holo flags set the finish, and the price is kept in EUR. Cardmarket's seven conditions map onto the five CardNexus conditions: `MT` and `NM` → `NM`, `EX` and `LP` → `LP`, `GD` → `MP`, `PL` → `HP`, `PO` → `DMG`.

The file's structure is checked right away: a file that can't be read as a Cardmarket export comes back with `UNPROCESSABLE_FILE`. Once accepted, the import runs in the background — this call returns a job, and you poll `GET /v1/inventory/bulk/jobs/{jobId}` for progress. A row whose `idProduct` matches no product fails with `PRODUCT_NOT_FOUND` in the error report; the rest still import.

Send an `Idempotency-Key` header to make retries safe. Requires the `inventory:write` scope.

| Direction | Type |
| --- | --- |
| Request | [`BulkOperationImportCardmarketParams`](./src/resources/bulk-operations.ts) |
| Response | [`BulkOperationImportCardmarketResponse`](./src/resources/bulk-operations.ts) |

```ts
const bulkOperation = await client.bulkOperations.importCardmarket({
  file: '',
  mode: 'upsert',
});
```

### Import a TCGplayer export

Imports a TCGplayer seller CSV (the Mass Update / Pricing export) as-is. Send it as `multipart/form-data` with the file in the `file` field and `mode` as a plain form field.

Each row is matched to a CardNexus product by its game (`Product Line`), set (`Set Name`), and collector number (`Number`). The `TCGplayer Id` column is a SKU rather than a product id, so it is kept as the line's `customId` and not used for matching. The ` Foil` suffix on the condition sets the finish, conditions map one-to-one, and the price is kept in USD.

The file's structure is checked right away: a file that can't be read as a TCGplayer export comes back with `UNPROCESSABLE_FILE`. Once accepted, the import runs in the background — this call returns a job, and you poll `GET /v1/inventory/bulk/jobs/{jobId}`. A row that matches no product, or matches more than one, fails with `PRODUCT_NOT_FOUND` in the error report; the rest still import.

Send an `Idempotency-Key` header to make retries safe. Requires the `inventory:write` scope.

| Direction | Type |
| --- | --- |
| Request | [`BulkOperationImportTcgplayerParams`](./src/resources/bulk-operations.ts) |
| Response | [`BulkOperationImportTcgplayerResponse`](./src/resources/bulk-operations.ts) |

```ts
const bulkOperation = await client.bulkOperations.importTcgplayer({
  file: '',
  mode: 'upsert',
});
```

### Import a TCG Power Tools export

Imports a TCG Power Tools CSV export as-is. Send it as `multipart/form-data` with the file in the `file` field and `mode` as a plain form field.

Each row is matched to a CardNexus product by its `cardmarketId` (or `tcgplayerId` when present). The `isFoil` flag sets the finish, the price is kept in EUR, and the condition codes map the same way as Cardmarket: `MT` and `NM` → `NM`, `EX` and `LP` → `LP`, `GD` → `MP`, `PL` → `HP`, `PO` → `DMG`.

The file's structure is checked right away: a file that can't be read as a TCG Power Tools export comes back with `UNPROCESSABLE_FILE`. Once accepted, the import runs in the background — this call returns a job, and you poll `GET /v1/inventory/bulk/jobs/{jobId}`. A row whose id matches no product fails with `PRODUCT_NOT_FOUND` in the error report; the rest still import.

Send an `Idempotency-Key` header to make retries safe. Requires the `inventory:write` scope.

| Direction | Type |
| --- | --- |
| Request | [`BulkOperationImportTcgPowerToolsParams`](./src/resources/bulk-operations.ts) |
| Response | [`BulkOperationImportTcgPowerToolsResponse`](./src/resources/bulk-operations.ts) |

```ts
const bulkOperation = await client.bulkOperations.importTcgPowerTools({
  file: '',
  mode: 'upsert',
});
```

### Start a bulk export

Exports your inventory lines to a gzip-compressed file. The export runs in the background: this call returns a job right away, and you poll `GET /v1/inventory/bulk/jobs/{jobId}` until `status` is `completed` and `downloadUrl` carries the link to the file. The file is kept for 7 days (the job's `expiresAt`).

Exported files use the exact row layout `POST /v1/inventory/bulk/import` accepts — column set, condition values, prices in decimal major units — so a file can be exported, edited, and imported back. Each line's `comment`, `notes`, `location`, and `tags` are included; `location` is the location name and `tags` is a comma-separated list of names in CSV (an array in JSON). Each row's `productId` is the catalogue product's numeric id, as returned by `GET /v1/products`. Rows also carry informational columns next to `productId`: `name`, `expansion`, `url`, `game`, `printNumber`, `rarity`, and the finish-matched `cardmarketId` and `tcgplayerId` (the Cardmarket / TCGplayer product id for this line's own finish). These are ignored on import.

Pass `filters` to export a subset — the same filters `POST /v1/inventory/search` accepts, so a search can be turned into an export unchanged. Export a single location with `{ "location": { "op": "or", "values": ["Store A"] } }`, or every untagged line with `{ "tags": { "op": "or", "values": [null] } }`. Filtered exports match lines the same way the search endpoint does, so the selection can lag your latest changes by a few seconds; exports without `filters` always reflect your latest changes.

Starting an export counts against the `inventory-export` rate limit: 1 request every 10 minutes.

Send an `Idempotency-Key` header to make retries safe: the same key returns the same response for 24 hours.

Requires the `inventory:read` scope.

| Direction | Type |
| --- | --- |
| Request | [`BulkOperationExportParams`](./src/resources/bulk-operations.ts) |
| Response | [`BulkOperationExportResponse`](./src/resources/bulk-operations.ts) |

```ts
const bulkOperation = await client.bulkOperations.export({
  format: 'json',
});
```

### Update inventory lines in bulk

Changes up to 200 inventory lines in one call, without a file round-trip. Each item names one line — by `inventoryId` or by `customId` — and carries the changes to apply: quantity, condition, language, finish, comment, notes, location, or tags. Send only the fields you want to change. Each line can appear in only one item per call; further items naming the same line are rejected with `INVALID_ITEM`. The same change rules as `PATCH /v1/inventory/{inventoryId}` apply, including `count` splits, merging into an identical line, the `location` name (or `null` to clear), and the `tags` `{"set"|"add"|"remove"}` change. `location` and `tags` names must already exist, or the item is rejected with `LOCATION_NOT_FOUND` or `TAG_NOT_FOUND`.

Items are checked one by one. Items that fail — unknown line, quantity underflow, invalid `count` — come back in `results` with `status: "error"` and do not block the rest. All items that pass are applied together: either every one of them takes effect, or — when they collide with each other or with another of your lines — none do and the call fails with `CONFLICT`.

Send an `Idempotency-Key` header to make retries safe: the same key returns the same response for 24 hours.

Requires the `inventory:write` scope.

| Direction | Type |
| --- | --- |
| Request | [`BulkOperationUpdateParams`](./src/resources/bulk-operations.ts) |
| Response | [`BulkOperationUpdateResponse`](./src/resources/bulk-operations.ts) |

```ts
const bulkOperation = await client.bulkOperations.update({
  items: [{}],
});
```

### Get a bulk job

Returns the current state of one of your bulk import or export jobs — status, row counts, progress, and, once the job has completed, the download links.

`downloadUrl` (exports) and `errorReportUrl` (imports with failed rows) are temporary links: each one stops working 15 minutes after this response. Fetch the job again for fresh links. The files themselves are kept until the job's `expiresAt`, 7 days after completion.

Requires the `inventory:read` scope.

| Direction | Type |
| --- | --- |
| Response | [`BulkOperationRetrieveJobResponse`](./src/resources/bulk-operations.ts) |

```ts
const bulkOperation = await client.bulkOperations.retrieveJob('jobId');
```

## `Tags`

Manage the tags you attach to inventory lines. See [Tags & locations](https://docs.cardnexus.com/inventory/tags-and-locations).

### List your tags

Returns every tag in your account, each with its name and optional display colour and icon.

Tags are labels you attach to inventory lines to group them however you like. Attach and detach them on a line through the inventory write endpoints (`POST /v1/inventory`, `PATCH /v1/inventory/{inventoryId}`, and the bulk endpoints).

Requires the `inventory:read` scope.

| Direction | Type |
| --- | --- |
| Response | [`TagListResponse`](./src/resources/tags.ts) |

```ts
const tag = await client.tags.list();
```

### Create a tag

Creates a new tag in your account.

The name must be one you don't already use — names are compared case-insensitively, so `Trade` and `trade` count as the same and the second request returns `CONFLICT`.

Send `"upsert": true` to make the call safe to repeat: when the tag already exists it is returned — updated with any `color` or `icon` you sent — instead of failing with `CONFLICT`. One call then guarantees the tag exists before you reference it on inventory lines.

Requires the `inventory:write` scope.

| Direction | Type |
| --- | --- |
| Request | [`TagCreateParams`](./src/resources/tags.ts) |
| Response | [`TagCreateResponse`](./src/resources/tags.ts) |

```ts
const tag = await client.tags.create({
  name: 'Trade binder',
});
```

### Rename or recolor a tag

Renames a tag or changes its display colour or icon. Send only the fields you want to change.

Renaming keeps the tag attached to every line that already carries it — the lines follow the new name. A new name that clashes with another of your tags returns `CONFLICT`.

Requires the `inventory:write` scope.

| Direction | Type |
| --- | --- |
| Request | [`TagUpdateParams`](./src/resources/tags.ts) |
| Response | [`TagUpdateResponse`](./src/resources/tags.ts) |

```ts
const tag = await client.tags.update('tagName');
```

### Delete a tag

Deletes a tag from your account and detaches it from every line that carries it. The lines themselves are kept — only the tag is removed.

Requires the `inventory:write` scope.

| Direction | Type |
| --- | --- |
| Request | [`TagDeleteParams`](./src/resources/tags.ts) |

```ts
const response = await client.tags.delete('tagName');
```

## `Locations`

Manage the locations where you keep your stock. See [Tags & locations](https://docs.cardnexus.com/inventory/tags-and-locations).

### List your locations

Returns every location in your account, each with its name and optional display colour and icon.

Locations are labels for where you keep your stock. A line has at most one location. Set and clear a line's location through the inventory write endpoints (`POST /v1/inventory`, `PATCH /v1/inventory/{inventoryId}`, and the bulk endpoints).

Requires the `inventory:read` scope.

| Direction | Type |
| --- | --- |
| Response | [`LocationListResponse`](./src/resources/locations.ts) |

```ts
const location = await client.locations.list();
```

### Create a location

Creates a new location in your account.

The name must be one you don't already use — names are compared case-insensitively, so `Shelf A` and `shelf a` count as the same and the second request returns `CONFLICT`.

Send `"upsert": true` to make the call safe to repeat: when the location already exists it is returned — updated with any `color` or `icon` you sent — instead of failing with `CONFLICT`. One call then guarantees the location exists before you reference it on inventory lines.

Requires the `inventory:write` scope.

| Direction | Type |
| --- | --- |
| Request | [`LocationCreateParams`](./src/resources/locations.ts) |
| Response | [`LocationCreateResponse`](./src/resources/locations.ts) |

```ts
const location = await client.locations.create({
  name: 'Trade binder',
});
```

### Rename or recolor a location

Renames a location or changes its display colour or icon. Send only the fields you want to change.

Renaming keeps the location on every line that already sits there — the lines follow the new name. A new name that clashes with another of your locations returns `CONFLICT`.

Requires the `inventory:write` scope.

| Direction | Type |
| --- | --- |
| Request | [`LocationUpdateParams`](./src/resources/locations.ts) |
| Response | [`LocationUpdateResponse`](./src/resources/locations.ts) |

```ts
const location = await client.locations.update('locationName');
```

### Delete a location

Deletes a location from your account. Every line that sits there is moved back to having no location — the lines themselves are kept.

Requires the `inventory:write` scope.

| Direction | Type |
| --- | --- |
| Request | [`LocationDeleteParams`](./src/resources/locations.ts) |

```ts
const response = await client.locations.delete('locationName');
```

## `Listings`

List, publish, reprice, and remove your Marketplace listings. See [Listings](https://docs.cardnexus.com/inventory/listings).

### Get your listings

Returns the inventory lines you have published to the Marketplace, as a cursor-paginated list ordered by line id.

This is `GET /v1/inventory` restricted to lines that are for sale — every line in the response has `forSale` set to `true` and carries a `listing` price. Lines in your Collection are not included.

Filter with any combination of `game`, `productId` (repeatable), `condition`, `language`, `finish`, `graded`, `customId`, `customIdPrefix`, `customIdContains`, `commentContains`, `location`, and `tags` (repeatable — matches lines carrying any of the named tags). Filters are combined with AND.

Walk the full set by following `pagination.nextCursor` until it comes back `null`. `limit` defaults to 50, maximum 100.

Requires the `listings:read` scope.

| Direction | Type |
| --- | --- |
| Request | [`ListingListParams`](./src/resources/listings.ts) |
| Response | [`ListingListResponse`](./src/resources/listings.ts) |

```ts
const listing = await client.listings.list({
  limit: 50,
});
```

### List an inventory line for sale

Publishes an inventory line to the Marketplace at the given per-card price. The price currency must match your seller currency, and your seller account must be active.

By default the whole line is listed. Pass `quantity` to list only part of it: the listed cards move to their own line (returned as `line`), the rest stays in your Collection on the original line (returned as `remainder`). The split-off listed line inherits the original's `comment` but never its `customId`.

If listing the whole line makes it identical to one of your existing listed lines (same product, finish, condition, language, grading, and price, neither line carrying a `customId`), the two merge; `line` is the surviving line.

Send an `Idempotency-Key` header to make retries safe: the same key returns the same response for 24 hours.

Requires the `listings:write` scope.

| Direction | Type |
| --- | --- |
| Request | [`ListingCreateParams`](./src/resources/listings.ts) |
| Response | [`ListingCreateResponse`](./src/resources/listings.ts) |

```ts
const listing = await client.listings.create('inventoryId', {
  price: { amount: 14.99, currency: 'USD' },
});
```

### Change a listing's price

Changes the per-card price of a listed inventory line. The price is the only thing this endpoint changes — how many cards are for sale is a property of the line itself: list more via `POST /v1/inventory/{inventoryId}/listing` or take some off sale via `DELETE /v1/inventory/{inventoryId}/listing`.

If the new price makes this line identical to another of your listed lines (same product, finish, condition, language, grading, and price, neither line carrying a `customId`), the two merge; the response is the surviving line.

Send an `Idempotency-Key` header to make retries safe: the same key returns the same response for 24 hours.

Requires the `listings:write` scope.

| Direction | Type |
| --- | --- |
| Request | [`ListingUpdateParams`](./src/resources/listings.ts) |
| Response | [`ListingUpdateResponse`](./src/resources/listings.ts) |

```ts
const listing = await client.listings.update('inventoryId', {
  price: { amount: 14.99, currency: 'USD' },
});
```

### Take a listing off sale

Takes a listed inventory line off the Marketplace. The cards stay in your inventory — they move back to your Collection.

By default the whole listing is cancelled and the response is the line's new state in your Collection. Pass `quantity` to take only part of it off sale: the delisted cards move back to your Collection, the rest stays for sale on this line, and the response is this line's new, reduced state.

Delisted cards merge into an identical unlisted line of yours when one exists (same product, finish, condition, language, and grading, neither line carrying a `customId`). After a full delist that merges, the response is the surviving line.

Requires the `listings:write` scope.

| Direction | Type |
| --- | --- |
| Request | [`ListingDeleteParams`](./src/resources/listings.ts) |
| Response | [`ListingDeleteResponse`](./src/resources/listings.ts) |

```ts
const listing = await client.listings.delete('inventoryId');
```

## `Lists`

Create, read, update, and delete your lists — decks, want lists, and for-sale lists. See the [Lists guide](https://docs.cardnexus.com/lists).

### Get your lists

Returns your lists — decks, want lists, and for-sale lists — each with its name, status, and a summary of how many cards it holds and how complete it is.

The cards themselves are not included here. Fetch a single list with `GET /v1/lists/{listId}` to get its cards.

Filter by game, status, visibility, or name. Results are paginated with `offset` and `limit`.

Requires the `lists:read` scope.

| Direction | Type |
| --- | --- |
| Request | [`ListListParams`](./src/resources/lists.ts) |
| Response | [`ListListResponse`](./src/resources/lists.ts) |

```ts
const list = await client.lists.list({
  offset: 0,
  limit: 50,
});
```

### Create a list

Creates a new, empty list for the given game.

The new list takes its currency from your account settings. Add cards to it with `POST /v1/lists/{listId}/items`.

You can have up to 200 lists. Once you have 200, this endpoint returns `LIST_LIMIT_REACHED` until you delete one with `DELETE /v1/lists/{listId}`.

Send an `Idempotency-Key` header to make retries safe — a repeated key returns the first response instead of creating a second list.

Requires the `lists:write` scope.

| Direction | Type |
| --- | --- |
| Request | [`ListCreateParams`](./src/resources/lists.ts) |
| Response | [`ListCreateResponse`](./src/resources/lists.ts) |

```ts
const list = await client.lists.create({
  name: 'x',
  game: 'x',
  status: 'toComplete',
});
```

### Get a list

Returns a single list of yours in full — its metadata and every card in it.

To enumerate your lists without their cards, see `GET /v1/lists`.

Requires the `lists:read` scope.

| Direction | Type |
| --- | --- |
| Response | [`ListRetrieveResponse`](./src/resources/lists.ts) |

```ts
const list = await client.lists.retrieve('listId');
```

### Update a list

Changes a list's settings. Send only the fields you want to change; the rest are left as they are.

This updates the list itself, not its cards. Add or remove cards with `POST /v1/lists/{listId}/items` and `DELETE /v1/lists/{listId}/items/{itemId}`.

Requires the `lists:write` scope.

| Direction | Type |
| --- | --- |
| Request | [`ListUpdateParams`](./src/resources/lists.ts) |
| Response | [`ListUpdateResponse`](./src/resources/lists.ts) |

```ts
const list = await client.lists.update('listId');
```

### Delete a list

Deletes a list and every card in it. Your inventory is not affected.

Requires the `lists:write` scope.

| Direction | Type |
| --- | --- |
| Request | [`ListDeleteParams`](./src/resources/lists.ts) |
| Response | [`ListDeleteResponse`](./src/resources/lists.ts) |

```ts
const list = await client.lists.delete('listId');
```

## `ListItems`

Add cards to a list, update them, and remove them. See the [Lists guide](https://docs.cardnexus.com/lists).

### Add or update cards in a list

Adds cards to a list, or updates cards already in it, in a single call. Returns the list with its new contents.

Each entry names a catalogue product plus its finish and language. Set `quantity` to `0` to remove that card. To change an existing line, pass its `itemId` from a list response.

Every card must belong to the list's game, in a finish and language that product exists in. A single list can hold at most 2000 cards.

Send an `Idempotency-Key` header to make retries safe.

Requires the `lists:write` scope.

| Direction | Type |
| --- | --- |
| Request | [`ListItemCreateParams`](./src/resources/list-items.ts) |
| Response | [`ListItemCreateResponse`](./src/resources/list-items.ts) |

```ts
const listItem = await client.listItems.create('listId', {
  items: [
    {
      productId: 50212,
      finish: 'Standard',
      language: 'en',
      quantity: 0,
    },
  ],
});
```

### Remove a card from a list

Removes a single card from a list, addressed by its line id. The list itself is kept.

To remove several cards at once, or to clear a card by setting its quantity to `0`, use `POST /v1/lists/{listId}/items`.

Requires the `lists:write` scope.

| Direction | Type |
| --- | --- |
| Request | [`ListItemDeleteParams`](./src/resources/list-items.ts) |
| Response | [`ListItemDeleteResponse`](./src/resources/list-items.ts) |

```ts
const listItem = await client.listItems.delete('itemId', {
  listId: 'listId',
});
```

## `Sales`

Read and manage the orders where you're the seller: list your sales, fetch a single sale by order number, mark orders shipped, cancel them, refund part of them, and attach your own metadata. See [Track sales in your own system](https://docs.cardnexus.com/recipes/order-metadata).

### List your sales

Returns your sales — orders where you are the seller — as a cursor-paginated list, newest first.

Each item carries the order, its items and totals, the **buyer** you sold to — their handle, country, review score, and recent order-handling stats — and the address to ship to, so a batch of parcels can be prepared from one call.

Filter with `status` (repeatable), the `placedFrom` / `placedTo` date range, and your own `metadata` — `?metadata[fulfillment_stage]=packed` returns the sales carrying exactly that pair, and repeating the parameter with another key requires all of them. Walk the full set by following `pagination.nextCursor`: pass it back as `cursor` until it comes back `null`. `limit` defaults to 50, maximum 100.

Requires the `sales:read` scope.

| Direction | Type |
| --- | --- |
| Request | [`SaleListParams`](./src/resources/sales.ts) |
| Response | [`SaleListResponse`](./src/resources/sales.ts) |

```ts
const sale = await client.sales.list({
  limit: 50,
});
```

### Get a sale

Returns one of your sales in full — the seller view of the order.

On top of the items and totals, you get the fee breakdown, your payout and when it's eligible, the buyer's shipping address, tracking, and the buyer's profile (country, review score, recent order-handling stats).

Only the seller on the order can read it; any other order number returns `404 Not Found`.

Requires the `sales:read` scope.

| Direction | Type |
| --- | --- |
| Response | [`SaleDetail`](./src/resources/sales.ts) |

```ts
const saleDetail = await client.sales.retrieve('orderNumber');
```

### Mark a sale shipped

Marks one of your sales shipped and registers its tracking number. The order moves to `shipped`, and the buyer is notified.

The order must be awaiting dispatch (`pending_shipment`) or have an open cancellation request (`cancellation_requested`) — you can still ship within the cancellation-request window. Any other status returns `409 INVALID_STATUS`.

The response carries a tracking link under `shipping`. The carrier is detected automatically from the tracking number and appears on the sale once detection completes. A tracking number that is rejected as invalid returns `422 TRACKING_REGISTRATION_FAILED`. Pass `trackingUrl` to show the buyer your own tracking page instead.

A USPS Intelligent Mail barcode (IMb) number ships the sale as a letter: `shipping.type` is `letter` and the carrier is `usps`. CardNexus cannot follow IMb scans itself; the application that printed the label sends them with `POST /v1/tracking/events`.

When the sale's `shippingService` is `untracked`, the buyer paid for an untracked letter: you can leave `trackingNumber` out and the sale ships without one, with `shipping.trackingNumber` and `shipping.type` set to `null`. The sale then closes on its own at `untrackedCloseAt`. Leaving `trackingNumber` out on a `tracked` sale returns `409 TRACKING_NUMBER_REQUIRED`.

Pass `metadata` to stamp your own key/value pairs in the same call, merged the same way `PATCH /v1/sales/{orderNumber}/metadata` merges them. The two either both apply or neither does: a tracking number rejected as invalid leaves the sale's metadata unchanged, and metadata that would take the sale past its key limit returns `422 METADATA_LIMIT_EXCEEDED` without shipping the order.

CardNexus Shield shipping insurance cannot be opted into through the API — sales shipped here are uninsured. Use the web or mobile app to insure a shipment.

Sales on CardNexus-managed shipping (`shippingManagedByCardNexus: true` on the sale) cannot be self-shipped: the buyer already paid CardNexus for the label, so shipping them here would cost you the postage twice. Those sales return `409 SHIPPING_MANAGED_BY_CARDNEXUS`. Generate the shipping label from the web app instead.

Returns the updated sale, in the same shape as `GET /v1/sales/{orderNumber}`.

Send an `Idempotency-Key` header to make retries safe: the same key returns the same response for 24 hours.

Requires the `sales:write` scope.

| Direction | Type |
| --- | --- |
| Request | [`SaleMarkShippedParams`](./src/resources/sales.ts) |
| Response | [`SaleDetail`](./src/resources/sales.ts) |

```ts
const saleDetail = await client.sales.markShipped('orderNumber');
```

### Cancel a sale

Cancels one of your sales. The order moves to `cancelled_seller`, the buyer is refunded in full, and the cards return to your inventory.

The order must be awaiting dispatch (`pending_shipment`). Any other status returns `409 INVALID_STATUS`.

`reasonText` is shown to the buyer along with the reason code, and both appear on the sale's `cancellation` afterwards.

Returns the updated sale, in the same shape as `GET /v1/sales/{orderNumber}`.

Send an `Idempotency-Key` header to make retries safe: the same key returns the same response for 24 hours.

Requires the `sales:write` scope.

| Direction | Type |
| --- | --- |
| Request | [`SaleCancelParams`](./src/resources/sales.ts) |
| Response | [`SaleDetail`](./src/resources/sales.ts) |

```ts
const saleDetail = await client.sales.cancel('orderNumber', {
  reason: 'item_unavailable',
  reasonText: 'xxxxxxxxxx',
});
```

### Refund part of a sale

Refunds part of one of your sales to the buyer. The refund is issued immediately and cannot be undone. The buyer is notified of the refund.

The refund is taken from the order payment CardNexus holds, so it lowers your payout for this sale. Nothing is debited from your account.

If the buyer used a CardNexus coupon on the order, the refund is split in the same proportion as their payment: part goes back to their payment method and the rest comes off their coupon. The buyer is told how much of each.

`amount` is in your selling currency — the sale's `currency`. You can refund a sale more than once, but all refunds on a sale together must stay below the sale's total (items plus the shipping you charged). An amount above what you can still refund returns `409 AMOUNT_TOO_HIGH`, with the most you can still refund in `maxAllowed`. To refund the buyer in full, cancel the sale with `POST /v1/sales/{orderNumber}/cancel` while it is awaiting dispatch (`pending_shipment`).

The order must be `pending_shipment`, `cancellation_requested`, `shipped`, or `delivered`. Any other status returns `409 INVALID_STATUS`.

While another refund or payout on the sale is being processed, the request returns `409 REFUND_IN_PROGRESS`. Read the sale with `GET /v1/sales/{orderNumber}` before you retry: `refunded` is the total refunded so far.

Returns the updated sale, in the same shape as `GET /v1/sales/{orderNumber}`. Its `refunded` includes this refund.

Send an `Idempotency-Key` header to make retries safe: the same key returns the same response for 24 hours.

Requires the `sales:write` scope.

| Direction | Type |
| --- | --- |
| Request | [`SaleRefundParams`](./src/resources/sales.ts) |
| Response | [`SaleDetail`](./src/resources/sales.ts) |

```ts
const saleDetail = await client.sales.refund('orderNumber', {
  amount: 2.5,
});
```

### Update a sale's metadata

Writes your own key/value pairs onto one of your sales. Use it to carry a reference from your own system, or a fulfillment state finer than the order statuses CardNexus tracks.

The write merges rather than replaces. Keys you send are set, keys you send as `null` are removed, and keys you leave out keep their value — so two systems can each own their keys on the same sale without overwriting each other. An empty string is a value, not a removal; sending `{}` changes nothing.

Keys start with a letter and may contain letters, digits, `_`, `.` and `-`, up to 64 characters. Values are strings of up to 500 characters. A sale holds at most 50 keys once the write is applied; a write that would go past that stores nothing and returns `422 METADATA_LIMIT_EXCEEDED`.

Metadata can be written in any status, including on completed and cancelled sales. It is yours alone — the buyer never sees it, and it never appears on their purchase.

Filter on it with `GET /v1/sales?metadata[key]=value`, and read it back under `metadata` on every sales response.

Returns the updated sale, in the same shape as `GET /v1/sales/{orderNumber}`.

Send an `Idempotency-Key` header to make retries safe: the same key returns the same response for 24 hours.

Requires the `sales:write` scope.

| Direction | Type |
| --- | --- |
| Request | [`SaleSetMetadataParams`](./src/resources/sales.ts) |
| Response | [`SaleDetail`](./src/resources/sales.ts) |

```ts
const saleDetail = await client.sales.setMetadata('orderNumber', {
  metadata: { fulfillment_stage: 'packed', picked_by: null },
});
```

## `Purchases`

Read the orders where you're the buyer: list your purchases and fetch a single purchase by order number.

### List your purchases

Returns your purchases — orders where you are the buyer — as a cursor-paginated list, newest first.

Each item carries the order, its items and totals, and the **seller** you bought from: their handle, country, review score, and recent order-handling stats.

Filter with `status` (repeatable) and the `placedFrom` / `placedTo` date range. Walk the full set by following `pagination.nextCursor`: pass it back as `cursor` until it comes back `null`. `limit` defaults to 50, maximum 100.

Requires the `purchases:read` scope.

| Direction | Type |
| --- | --- |
| Request | [`PurchaseListParams`](./src/resources/purchases.ts) |
| Response | [`PurchaseListResponse`](./src/resources/purchases.ts) |

```ts
const purchase = await client.purchases.list({
  limit: 50,
});
```

### Get a purchase

Returns one of your purchases in full — the buyer view of the order.

On top of the items and totals, you get what you paid (buyer fee and tax), the shipping address, tracking and delivery, any refund, and the seller's profile (country, review score, recent order-handling stats).

Only the buyer on the order can read it; any other order number returns `404 Not Found`.

Requires the `purchases:read` scope.

| Direction | Type |
| --- | --- |
| Response | [`PurchaseDetail`](./src/resources/purchases.ts) |

```ts
const purchaseDetail = await client.purchases.retrieve('orderNumber');
```

## `Tracking`

For integration applications with the tracking privilege: send the mail and carrier scans of the labels you printed for sellers who connected your application. See [Building an integration](https://docs.cardnexus.com/guides/integrations).

### Send tracking scans

Records the mail and carrier scans of shipments whose labels your application printed. Only available to applications CardNexus has granted the tracking privilege; any other application gets `403 FORBIDDEN`.

Call it with your application credential and no `CardNexus-Account` header. Each shipment is matched by tracking number to the sales of sellers who connected your application with the `sales:write` scope. A tracking number that matches no sale yet returns `matchedSales: 0`; send the shipment again with its next scan and the earlier ones are recorded then.

Send every scan you have for a shipment each time. Scans are matched by `eventId`, so a scan you already sent is counted in `duplicates` and recorded only once.

A `delivered` scan marks the sale delivered, for parcels and letters alike.

Scans appear in `shipping.history` with `source: "application"`.

| Direction | Type |
| --- | --- |
| Request | [`TrackingPushEventsParams`](./src/resources/tracking.ts) |
| Response | [`TrackingPushEventsResponse`](./src/resources/tracking.ts) |

```ts
const tracking = await client.tracking.pushEvents({
  shipments: [
    {
      trackingNumber: '00310110084032371774',
      trackingUrl: 'https://track.sortswift.example/l/00310110084032371774',
      events: [
        {
          eventId: 'evt_8811',
          status: 'label_created',
          occurredAt: '2026-09-21T10:21:00.000Z',
          location: { city: 'Laurel', state: 'MD' },
          description: 'Label created',
        },
        {
          eventId: 'evt_8812',
          status: 'in_mailstream',
          occurredAt: '2026-09-22T23:35:00.000Z',
          location: { city: 'Gaithersburg', state: 'MD', postalCode: '20898' },
          description: 'Origin processing',
        },
      ],
    },
  ],
});
```

## `Connect`

Complete the account-connection handshake for an integration application: exchange the one-time code from the connect redirect for the account id and the permissions it granted you. See [Building an integration](https://docs.cardnexus.com/guides/integrations).

### Exchange a connect code

Completes the account-connection handshake. After a user approves your application, CardNexus redirects them back to you with a one-time `code`. Exchange that code here — authenticated with your application credential — to learn which account was connected and what it granted you.

The code is single-use and expires 5 minutes after it is issued. The account id you receive is what you send in the `CardNexus-Account` header on every subsequent request for that account.

| Direction | Type |
| --- | --- |
| Request | [`ConnectExchangeParams`](./src/resources/connect.ts) |
| Response | [`ConnectExchangeResponse`](./src/resources/connect.ts) |

```ts
const connect = await client.connect.exchange({
  code: 'x',
});
```

## `Accounts`

For integration applications with the managed-account privilege: create an account for a seller who isn't on CardNexus yet, then issue a hosted-onboarding link so they can take it live. See [Building an integration](https://docs.cardnexus.com/guides/integrations).

### Create a managed account

Creates a CardNexus account for a seller who isn't on CardNexus yet, and connects it to your application in one step. Only available to applications CardNexus has granted the managed-account privilege.

The account is created **staged**: you can sync inventory and create listings into it immediately, but the listings stay hidden from the marketplace until the seller completes onboarding. Request a hosted-onboarding link with `POST /v1/account/onboarding-link` and send it to the seller. Once they accept the CardNexus terms and Stripe's terms in that flow (individual sellers also give Stripe their name and date of birth), the account goes **live** and its listings are shown. Read the current state from `seller.status` on `GET /v1/account/me`.

We email the address a link to claim the account. Anyone who did not ask for the account can reply to that email to have it deleted.

Pass `sellerType: "pro"` for a registered company and, optionally, its `business` identity; whatever you leave out, the seller fills in during onboarding.

If the email already belongs to an account, this fails with `ACCOUNT_EXISTS` — send that seller through the normal connect flow instead.

The privilege comes with a daily allowance of managed accounts. Once your application has used it up, this fails with `QUOTA_EXCEEDED` until the allowance resets at midnight UTC.

| Direction | Type |
| --- | --- |
| Request | [`AccountCreateParams`](./src/resources/accounts.ts) |
| Response | [`AccountCreateResponse`](./src/resources/accounts.ts) |

```ts
const account = await client.accounts.create({
  email: 'shop@northarena.example',
  country: 'FR',
  sellerType: 'pro',
  username: 'north_arena_tcg',
  firstName: 'Léa',
  lastName: 'Martin',
  language: 'fr',
  business: {
    companyName: 'North Arena TCG',
    registrationNumber: '912345678',
    vatNumber: 'FR12345678901',
    address: { line1: '12 rue des Cartes', city: 'Lyon', postalCode: '69001', country: 'FR' },
  },
});
```

### Create an onboarding link

Issues a link into the CardNexus-hosted onboarding flow for an account your application created. Send it in the `CardNexus-Account` header naming that account.

Send the seller to the returned URL. There they accept the CardNexus terms and complete the payment-onboarding steps in their own browser — which is what takes their listings live. When they finish, CardNexus returns them to your `returnUrl`.

While the account is unclaimed the link signs the seller straight in; once they've claimed it, the link takes them through normal sign-in.

| Direction | Type |
| --- | --- |
| Request | [`AccountCreateOnboardingLinkParams`](./src/resources/accounts.ts) |
| Response | [`AccountCreateOnboardingLinkResponse`](./src/resources/accounts.ts) |

```ts
const account = await client.accounts.createOnboardingLink({
  returnUrl: 'x',
});
```
