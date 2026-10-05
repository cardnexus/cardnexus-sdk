# Changelog

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
