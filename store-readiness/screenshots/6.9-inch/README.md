# 6.9-inch iPhone screenshots (1320×2868)

Device: iPhone 16 Pro Max simulator, iOS 18.6.

| File | Panel | Status |
|------|-------|--------|
| `01-onboarding.png` | Onboarding question screen ("What would change…") | Captured (wave 3) |
| `02-phase-1.png` | Home in Phase 1 (Fear / Muladhara) | Captured (wave 4) |
| `03-phase-4.png` | Home in Phase 4 (Grief / Anahata), stability 82 | Captured (wave 4) |
| `04-healthkit-permission.png` | Connect Apple Health card on Home | Captured (wave 4) — see note |
| `05-stability-lock.png` | Phase 5 with serpent lock active, stability 45 | Captured (wave 4) |
| `06-paywall.png` | Onboarding paywall step (12-month commitment + annual) | Captured (wave 4) |

## How the wave-4 captures were produced

Wave 3 was blocked by `App.tsx`'s `entitlement?.active` gate. Wave 4 adds a
`__DEV__`-only `SCREENSHOT_MODE` bypass that:

- Reads `EXPO_PUBLIC_SCREENSHOT_MODE=1` at bundle time
- Skips `refreshSadhanaEntitlement()`
- Synthesises a fake active entitlement so the entitled views render
- Accepts state hints: `EXPO_PUBLIC_SCREENSHOT_PHASE`,
  `EXPO_PUBLIC_SCREENSHOT_STABILITY`, `EXPO_PUBLIC_SCREENSHOT_LOCK_SERPENT`,
  `EXPO_PUBLIC_SCREENSHOT_PAYWALL`

The bypass is gated on `__DEV__` so it cannot ship to production. See
`App.tsx` and `src/components/onboarding/OnboardingSequence.tsx` for the
implementation.

## Known gap: panel 04

`04-healthkit-permission.png` currently shows the in-app "Connect Apple Health"
card, **not** the native HKHealthStore permission sheet. The auto-trigger path
(`EXPO_PUBLIC_SCREENSHOT_REQUEST_HEALTH=1`) is wired but the dialog does not
appear because the existing debug build was signed without the
`com.apple.developer.healthkit` runtime entitlement (Info.plist has
`NSHealthShareUsageDescription` but the binary entitlements payload is empty).
The HKHealthStore framework reports `isHealthDataAvailable=true` but
`initHealthKit` returns silently without surfacing the sheet.

To capture the OS sheet:

1. `cd ios && pod install`
2. Rebuild with `xcodebuild -workspace Sadhana.xcworkspace -scheme Sadhana
   -configuration Debug -destination "id=<SIM>" build` — make sure
   `CODE_SIGN_ENTITLEMENTS = Sadhana/Sadhana.entitlements` is picked up
3. Install the rebuilt `.app` on the simulator
4. Launch with `EXPO_PUBLIC_SCREENSHOT_MODE=1 EXPO_PUBLIC_SCREENSHOT_REQUEST_HEALTH=1`
5. The bypass fires `requestHealthPermissions()` 1.5 s after the entitled view
   mounts; screenshot the sheet at ~3 s after launch.
