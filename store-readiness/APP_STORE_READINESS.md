# Sadhana App Store Readiness

Last local readiness pass: 2026-05-11.

## Closed Locally

- HealthKit is read-only in tracked source: iOS reads sleep analysis, heart-rate variability, and resting heart rate; writes are an empty permission set.
- `app.json` declares the HealthKit entitlement and only `NSHealthShareUsageDescription`.
- Health permission copy now says exactly what is read and states that Inner Phases does not write to Health.
- The in-app Health CTA mirrors the same read-only behavior.
- The tracked iOS app icon source is 1024x1024 and opaque.
- `expo-iap` is installed and registered as an Expo config plugin.
- A minimal StoreKit/paywall source boundary exists at `src/billing`: it declares the subscription product IDs, loads subscription products, starts subscription purchase, refreshes local entitlement from active subscriptions/available purchases, and exposes restore purchases.
- Onboarding copy now frames Inner Phases as seven paid, non-sequential gates: fear, guilt, shame, grief, lies, illusion, and attachment. Users choose the gate they want to work with first; the ladder is no longer described as a forced sequential unlock.
- End-of-onboarding paywall now defaults to the monthly-with-12-month commitment plan, keeps the upfront annual plan as a secondary 14-day-trial option, and uses App Store product display prices only where the JS layer can represent the returned billing terms safely.
- A native iOS bridge exists at `ios/Sadhana/SadhanaStoreKitCommitment.swift` / `ios/Sadhana/SadhanaStoreKitCommitment.m`; it loads the annual product, verifies StoreKit 26.4+ monthly pricing terms with a 12-month commitment, and purchases with `Product.PurchaseOption.billingPlanType(.monthly)`.
- A local StoreKit config exists at `store-readiness/SadhanaProducts.storekit` and is synced to `ios/StoreKit/SadhanaProducts.storekit`; the annual product is labelled as the 12-month plan and includes a 14-day free introductory offer.
- Six local 6.5-inch App Store screenshot candidates exist in `store-readiness/screenshots`.
- The Seven Gates screen/card now treat the selected phase as a chosen focus gate, not a lock ladder. Practice, tool, journal, and trend copy no longer block by phase, while stability/time safety checks remain active.
- A repeatable local readiness check exists: `npm run check:store-readiness`.

## Current Blocking Gates

- StoreKit is source-wired and onboarding now calls the purchase/restore boundary, persists entitlement, and refreshes entitlement on launch, but it still needs App Store Connect subscription products and sandbox purchase/restore proof before submission.
- Native bridge proof still needs a real StoreKit/App Store Connect product that exposes StoreKit 26.4+ `Product.SubscriptionInfo.pricingTerms` with `.billingPlanType(.monthly)`. Local StoreKit JSON labels the product and can compile the bridge, but it does not prove Apple will return the monthly commitment pricing terms in TestFlight.
- Local screenshots currently cover one 6.5-inch class size only; 6.9-inch and iPad screenshot sets still need real-device/simulator capture before submission.
- Because `supportsTablet` remains true, iPad screenshot and layout proof are still part of the submission burden.

## Reviewer And Privacy Copy

Suggested App Review note:

Inner Phases requests read-only Apple Health access for sleep duration, heart-rate variability, and resting heart rate. These signals personalize daily practice guidance on device. Inner Phases does not write data to Apple Health and does not upload, sell, or share Health data.

Suggested App Privacy answers, assuming no analytics/backend is added before submission:

- Health data: used for app functionality and personalization.
- Tracking: no.
- Linked to user: no.
- Shared with third parties: no.
- Stored off device: no.

Re-check these answers if analytics, crash reporting, accounts, sync, or a backend are added.

## Icon, Splash, And Screenshots

- iOS icon source: `assets/icon.png`, 1024x1024, opaque.
- Android adaptive foreground: `assets/adaptive-icon.png`, 1024x1024.
- Splash source: `assets/splash-icon.png`, 1024x1024 on `#0B1418`.
- Screenshot candidates exist for 6.5-inch iPhone at `store-readiness/screenshots`; capture real iPhone 6.9-inch, iPhone 5.5-inch if required, and iPad 13-inch / 12.9-inch sets if `supportsTablet` remains true.
- Recommended screenshot set: non-sequential gate choice onboarding, paid trial boundary, Home, Health connect prompt, Practice flow, Journal, Trends, Safety lock/downshift state.

## Generated iOS Reproducibility

The `/ios` folder is generated and ignored by Git. Treat `app.json`, `src/health/provider.ios.ts`, and assets as the durable truth.

Local verification commands:

```bash
npm run check:store-readiness
npx expo config --json
```

Before a native iOS build intended for review, regenerate native config locally and rerun the readiness check:

```bash
npx expo prebuild --platform ios --no-install
npm run check:store-readiness
```

## Dependency Audit

Current local audit result: `npm run check:audit` reports 0 vulnerabilities.

Keep using `npm audit --omit=dev` as the readiness gate before native release work, and avoid broad dependency churn unless a new audit finding or Expo compatibility check requires it.
