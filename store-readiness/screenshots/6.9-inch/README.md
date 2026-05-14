# 6.9-inch iPhone screenshots (1320×2868)

Device: iPhone 16 Pro Max simulator, iOS 18.6.

| File | Panel | Status |
|------|-------|--------|
| `01-onboarding.png` | Onboarding question screen ("What would change…") | Captured |
| `02-phase-1-home.png` | Home in Phase 1 | **Outstanding** — see blocker note below |
| `03-phase-4-mid-journey.png` | Home / Practice in Phase 4 mid-journey | **Outstanding** |
| `04-healthkit-permission.png` | Apple Health permission sheet | **Outstanding** |
| `05-stability-lock.png` | Safety lock screen (kavacha / serpent) | **Outstanding** |
| `06-paywall.png` | Onboarding paywall step (`monthly-12-month` + annual) | **Outstanding** |

## Blocker (documented in `progress/wave3-sadhana.md`)

The remaining five panels require navigating past onboarding, which requires either:

1. An actual sandbox StoreKit purchase to satisfy `entitlement?.active` in `App.tsx`, OR
2. A debug-only bypass flag (not currently present in the codebase), OR
3. Manual taps via the Simulator GUI with accessibility permissions granted to the automation tool.

Attempted: writing pre-seeded persisted Zustand state directly to `Library/Application Support/com.sankalpsthakur.sadhana/RCTAsyncLocalStorage_V1/manifest.json` with `hasOnboarded:true` and `entitlement.active:true`. The app reads this state at launch (Zustand `persist` middleware), but `App.tsx:62` calls `refreshSadhanaEntitlement()` immediately and StoreKit-in-simulator returns no purchases, so `clearEntitlement()` flips the state back to onboarding before render.

The simulator-tap automation (`mcp__bridge4simulator`) racing with Apple's Simulator app — which auto-boots other simulators (iPhone 16 Pro, iPhone 17 Pro) — broke the targeting; tap commands routinely landed on the wrong simulator's foreground app.

## Recommended path forward (4–6 hours)

- Add a `__DEV__`-only `bypassEntitlement` flag to `App.tsx` for screenshot capture, or
- Use a real sandbox tester on a physical device, or
- Use `fastlane snapshot` / `xcodebuild test` with XCUITest for deterministic UI automation.
