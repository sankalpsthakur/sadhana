# Sadhana App Store Readiness

Last local readiness pass: 2026-05-11.

## Closed Locally

- HealthKit is read-only in tracked source: iOS reads sleep analysis, heart-rate variability, and resting heart rate; writes are an empty permission set.
- `app.json` declares the HealthKit entitlement and only `NSHealthShareUsageDescription`.
- Health permission copy now says exactly what is read and states that Sadhana does not write to Health.
- The in-app Health CTA mirrors the same read-only behavior.
- The tracked iOS app icon source is 1024x1024 and opaque.
- `expo-iap` is installed and registered as an Expo config plugin.
- A minimal StoreKit/paywall source boundary exists at `src/billing`: it declares the subscription product IDs, loads subscription products, starts subscription purchase, refreshes local entitlement from active subscriptions/available purchases, and exposes restore purchases.
- Onboarding copy now frames Sadhana as seven paid, non-sequential gates: fear, guilt, shame, grief, lies, illusion, and attachment. Users choose the gate they want to work with first; the ladder is no longer described as a forced sequential unlock.
- The Seven Gates screen/card now treat the selected phase as a chosen focus gate, not a lock ladder. Practice, tool, journal, and trend copy no longer block by phase, while stability/time safety checks remain active.
- A repeatable local readiness check exists: `npm run check:store-readiness`.

## Current Blocking Gates

- StoreKit is source-wired and onboarding now calls the purchase/restore boundary, persists entitlement, and refreshes entitlement on launch, but it still needs App Store Connect subscription products, intro-offer/trial configuration, local StoreKit config, and sandbox purchase/restore proof before submission.
- No local App Store screenshot assets are present yet.
- Because `supportsTablet` remains true, iPad screenshot and layout proof are still part of the submission burden.

## Reviewer And Privacy Copy

Suggested App Review note:

Sadhana requests read-only Apple Health access for sleep duration, heart-rate variability, and resting heart rate. These signals personalize daily practice guidance on device. Sadhana does not write data to Apple Health and does not upload, sell, or share Health data.

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
- Screenshots are still open: capture real iPhone 6.9-inch, iPhone 6.5-inch, iPhone 5.5-inch if required, and iPad 13-inch / 12.9-inch sets if `supportsTablet` remains true.
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
