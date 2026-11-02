# Changelog

## [0.4.0](https://github.com/cardnexus/cardnexus-sdk/compare/v0.3.0...v0.4.0) (2026-11-02)


### ⚠ BREAKING CHANGES

* **api:** 30 breaking changes to the SDK surface.
    - Added required property `card_product.imageCensored`.
    - Added required property `sealed_product.imageCensored`.
    - Property `sealed_product.prices` shape changed (`object`).
    - Added required property `card_product_detail.imageCensored`.
    - Added required property `sealed_product_detail.imageCensored`.
    - Property `sealed_product_detail.prices` shape changed (`object`).
    - Property `finish_price_blocks.cardmarket` shape changed (`object`).
    - Property `finish_price_blocks.tcgplayer` shape changed (`object`).
    - Added required property `order_cancellation.requestedAt`.
    - Added required property `order_cancellation.autoAcceptAt`.
    - Added required property `sale.webUrl`.
    - Added required property `sale.shipBy`.
    - Added required property `sale.labelState`.
    - Added required property `sale.actions`.
    - Added required property `sale_detail.webUrl`.
    - Added required property `sale_detail.shipBy`.
    - Added required property `sale_detail.labelState`.
    - Added required property `sale_detail.actions`.
    - Added required property `purchase.webUrl`.
    - Added required property `purchase.shipBy`.
    - Added required property `purchase.actions`.
    - Added required property `purchase_detail.webUrl`.
    - Added required property `purchase_detail.shipBy`.
    - Added required property `purchase_detail.actions`.
    - Added required property `product_listing.marketPrice`.
    - Added required property `product_listing.priceVsMarketPercent`.
    - Added required property `product_listing.listedAt`.
    - Property `product_listing.seller` type changed from `listing_seller` to `object`.
    - Added required property `cart.webUrl`.
    - Added required property `cart_item.imageCensored`.

### Features

* **api:** add property card_product.imageCensored (+126 more changes) ([e991611](https://github.com/cardnexus/cardnexus-sdk/commit/e991611113550208220752cdf2f1780f292b1b93))

## [0.3.0](https://github.com/cardnexus/cardnexus-sdk/compare/v0.2.1...v0.3.0) (2026-10-12)


### ⚠ BREAKING CHANGES

* **api:** 14 breaking changes to the SDK surface.
    - Property `order_shipping.trackingNumber` type changed from `string` to `string | null`.
    - Property `order_shipping.type` type changed from `enum(parcel | letter)` to `enum(parcel | letter) | null`.
    - Added required property `sale.shippingService`.
    - Added required property `sale.untrackedCloseAt`.
    - Added required property `sale.shippingManagedByCardNexus`.
    - Added required property `sale_detail.shippingService`.
    - Added required property `sale_detail.untrackedCloseAt`.
    - Added required property `sale_detail.shippingManagedByCardNexus`.
    - Added required property `purchase.shippingService`.
    - Added required property `purchase.untrackedCloseAt`.
    - Added required property `purchase.shippingManagedByCardNexus`.
    - Added required property `purchase_detail.shippingService`.
    - Added required property `purchase_detail.untrackedCloseAt`.
    - Added required property `purchase_detail.shippingManagedByCardNexus`.

### Features

* **api:** initial SDK generation ([1d77348](https://github.com/cardnexus/cardnexus-sdk/commit/1d77348cce607a446290d61b440638d8d9b73205))
* **api:** update SDK surface (17 changes) ([016d195](https://github.com/cardnexus/cardnexus-sdk/commit/016d195c650709ebc8c481dd912a2cfe09d53dfd))


### Chores

* **api:** regenerate SDK ([2a9e638](https://github.com/cardnexus/cardnexus-sdk/commit/2a9e638c6325c434e5a5f6b45f68fd71cc2a1e79))
* **api:** update generated SDK content ([66c5fd0](https://github.com/cardnexus/cardnexus-sdk/commit/66c5fd01695db9d76e1dfe9993827bde199bc50a))

## [0.2.1](https://github.com/cardnexus/cardnexus-sdk/compare/v0.2.0...v0.2.1) (2026-10-12)


### Chores

* **api:** regenerate SDK ([2a9e638](https://github.com/cardnexus/cardnexus-sdk/commit/2a9e638c6325c434e5a5f6b45f68fd71cc2a1e79))

## [0.2.0](https://github.com/cardnexus/cardnexus-sdk/compare/v0.1.0...v0.2.0) (2026-10-05)


### ⚠ BREAKING CHANGES

* **api:** 14 breaking changes to the SDK surface.
    - Property `order_shipping.trackingNumber` type changed from `string` to `string | null`.
    - Property `order_shipping.type` type changed from `enum(parcel | letter)` to `enum(parcel | letter) | null`.
    - Added required property `sale.shippingService`.
    - Added required property `sale.untrackedCloseAt`.
    - Added required property `sale.shippingManagedByCardNexus`.
    - Added required property `sale_detail.shippingService`.
    - Added required property `sale_detail.untrackedCloseAt`.
    - Added required property `sale_detail.shippingManagedByCardNexus`.
    - Added required property `purchase.shippingService`.
    - Added required property `purchase.untrackedCloseAt`.
    - Added required property `purchase.shippingManagedByCardNexus`.
    - Added required property `purchase_detail.shippingService`.
    - Added required property `purchase_detail.untrackedCloseAt`.
    - Added required property `purchase_detail.shippingManagedByCardNexus`.

### Features

* **api:** initial SDK generation ([1d77348](https://github.com/cardnexus/cardnexus-sdk/commit/1d77348cce607a446290d61b440638d8d9b73205))
* **api:** update SDK surface (17 changes) ([016d195](https://github.com/cardnexus/cardnexus-sdk/commit/016d195c650709ebc8c481dd912a2cfe09d53dfd))


### Chores

* **api:** update generated SDK content ([66c5fd0](https://github.com/cardnexus/cardnexus-sdk/commit/66c5fd01695db9d76e1dfe9993827bde199bc50a))
