# StoreKit Sandbox Proof Procedure — Inner Phases (Sadhana)

**Purpose:** Capture the evidence App Review needs to validate the monthly-with-12-month-commitment subscription plan. This plan uses a Sadhana-owned native bridge (`SadhanaStoreKitCommitment`) because `expo-iap` 4.2.7 does not expose `Product.SubscriptionInfo.pricingTerms` or `Product.PurchaseOption.billingPlanType(_:)`. The annual upfront plan goes through `expo-iap` as normal.

## SKUs under test

| Plan ID | Product ID | Billing | Notes |
|---------|-----------|---------|-------|
| `monthly-12-month` | `com.sadhana.premium.annual` (StoreKit product) | `monthly` (native bridge) | 12 monthly billing periods; commitment offer |
| `annual` | `com.sadhana.premium.annual` | `upFront` (`expo-iap`) | 14-day free trial then annual |

Local StoreKit definition: `ios/Sadhana/SadhanaProducts.storekit`. Source of truth: `src/billing/products.ts`.

## Prerequisites

1. **App Store Connect sandbox tester account** configured under **Users and Access → Sandbox**. Use an account that has *never* purchased the Sadhana SKUs (sandbox can be reset via "Manage Sandbox Account" → "Clear Purchase History", but cleaner to use a fresh tester).
2. **TestFlight build uploaded** (release configuration). Sandbox StoreKit only honors real product metadata on a build distributed via TestFlight or Ad Hoc — running against the local `.storekit` file in Xcode is **not** App Review-grade evidence.
3. Device (physical iPhone preferred, simulator acceptable for screenshots only) signed into the sandbox account at **Settings → App Store → Sandbox Account**, not the production Apple ID.
4. App built against the production bundle id `com.sankalpsthakur.sadhana` (sandbox routes by bundle id).
5. Time zone and language match the App Store Connect localization being validated.

## Test matrix (capture each row)

| # | Step | Evidence to capture | File name |
|---|------|---------------------|-----------|
| 1 | Launch the TestFlight build with a fresh sandbox account signed in | Screenshot of paywall in `OnboardingSequence` with both plans listed and `[Sandbox]` price strings | `01-paywall-listing.png` |
| 2 | Tap **Continue with monthly plan** (`monthly-12-month`) | Apple's StoreKit sheet showing **"12 monthly payments"**, commitment language, sandbox tag | `02-monthly-commitment-sheet.png` |
| 3 | Confirm purchase with Face ID / sandbox password | Apple confirmation receipt screen (sandbox banner visible) | `03-monthly-purchase-confirmed.png` |
| 4 | Land back in app, observe entitlement | Screenshot of Home with paid features visible (no paywall, demo-controlled Phase >0) | `04-monthly-entitlement-active.png` |
| 5 | Kill the app, reopen, observe restore | Console log + screenshot showing `refreshSadhanaEntitlement` returned `active: true`, `source: 'monthly-12-month'` | `05-monthly-entitlement-restore.png` + log excerpt |
| 6 | Tap **Restore Purchases** | Apple "Restoring..." sheet → success → entitlement remains active | `06-restore-success.png` |
| 7 | In sandbox, **Settings → App Store → Subscriptions → Cancel** the 12-month commitment | Confirm the cancellation flow surfaces App Store's policy text about commitment plans | `07-cancel-commitment-flow.png` |
| 8 | Wait for sandbox renewal cycle (sandbox accelerates: 1 month = 5 minutes) | Screenshot of receipt with `expires_date` advanced; ensure renewal triggers `refreshSadhanaEntitlement` correctly | `08-monthly-renewal.png` |
| 9 | Repeat steps 1–4 for the **annual** plan with a different sandbox tester (clean slate) | `09-annual-sheet.png`, `10-annual-trial-confirmed.png`, `11-annual-entitlement-active.png` | — |

Place all files under `store-readiness/sandbox-proof/`.

## Receipt / transaction evidence to collect

For each successful purchase (rows 3 and 10 above), capture:

1. The **transaction ID** returned by the native bridge (`NativeCommitmentPurchaseResult.transactionId`) — visible in `console.log` from `purchaseSadhanaSubscription`.
2. The **`originalTransactionId`** from `refreshSadhanaEntitlement`'s normalized snapshot.
3. The **App Store receipt fields** (decode via `https://buy.itunes.apple.com/verifyReceipt` with sandbox shared secret, or use the local `expo-iap` receipt inspector if added):
   - `bundle_id` = `com.sankalpsthakur.sadhana`
   - `product_id` = `com.sadhana.premium.annual`
   - `expires_date` (rounded to sandbox-accelerated time)
   - `original_purchase_date`
   - `is_trial_period` (annual only) / `is_in_intro_offer_period`
   - For 12-month: confirm `pricingTerms` (raw StoreKit JWS, decoded via Apple's verifier) carries the commitment metadata that `expo-iap` cannot surface.
4. Server-side log of how the app reacts to the renewal notification (App Store Server Notifications v2 → your endpoint). If no backend exists yet (current state), document that gap explicitly.

Save decoded receipts as `receipts/<transaction-id>.json`.

## Cancel-commitment behavior

Per App Review, monthly-with-commitment plans must clearly disclose the commitment in-app *before* purchase. Capture:

1. The pre-purchase paywall row for `monthly-12-month` — confirm copy includes `"12-month commitment"` eyebrow and `"12 monthly billing periods; App Store shows cancellation and renewal rules before purchase."` commitment line. Source: `SADHANA_MONTHLY_12_MONTH_PLAN` in `src/billing/products.ts`.
2. The Apple-presented purchase sheet (step 2 above) — Apple's own copy enumerates the 12-month commitment.
3. Cancellation flow (step 7) — Apple's Settings UI confirms cancellation does **not** terminate the 12-month commitment; the user is billed through the commitment end. Screenshot the wording.

## Submission checklist

- [ ] All 11 screenshots above captured against a current TestFlight build.
- [ ] Receipt JSON for at least one monthly-commitment and one annual purchase saved to `receipts/`.
- [ ] Decoded receipt for the monthly-commitment includes the commitment metadata our local bridge consumes.
- [ ] Demo video (≤30 s) of cancel-commitment flow recorded via simulator screen recording, uploaded to App Review attachments.
- [ ] App Review notes call out the native bridge (`SadhanaStoreKitCommitment`) and link to `src/billing/storeKit.ts` and `ios/Sadhana/SadhanaStoreKitCommitment.swift` in the Notes field.

## Known caveat

- `expo-iap` 4.2.7's type definitions do not expose `Product.SubscriptionInfo.pricingTerms` or `Product.PurchaseOption.billingPlanType(_:)`. This is acknowledged in `SADHANA_STOREKIT_26_NATIVE_GAP` (constant in `src/billing/products.ts`) and worked around by the native bridge. App Review should be told the JS layer relies on the bridge for the commitment plan; otherwise reviewers may attempt to validate against `expo-iap` directly and flag a missing field.
- Wave-2 readiness script (`scripts/check-app-store-readiness.mjs`) reports this as the single remaining WARN; the WARN is informational, not a build blocker.
