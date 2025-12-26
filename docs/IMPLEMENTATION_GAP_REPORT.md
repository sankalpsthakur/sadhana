# Sadhana — Docs vs Implementation Gap Report

Last updated: 2025-12-24

This repo currently looks like an Expo/React Native prototype that implements portions of the v3.0–v3.4 specs (Home skeleton + some flows), but large areas of the docs are either stubbed (alerts / TODOs) or missing (Onboarding, Mission Engine, Mood Meter, etc.).

## Build / Xcode validation

### `xcodebuild` status

- `xcodebuild -list -workspace ios/Sadhana.xcworkspace` works and shows scheme `Sadhana`.
- CocoaPods is installed repo-locally via Bundler and `pod install` succeeds.
- iOS Simulator build succeeds:
  - Command used: `xcodebuild -workspace ios/Sadhana.xcworkspace -scheme Sadhana -configuration Debug -sdk iphonesimulator -derivedDataPath ./_derivedData build ARCHS=arm64 ONLY_ACTIVE_ARCH=YES EXCLUDED_ARCHS=x86_64`
  - Build product: `_derivedData/Build/Products/Debug-iphonesimulator/Sadhana.app`

### Notes / quirks encountered

- CocoaPods on system Ruby 2.6 needed `RUBYOPT='-rlogger'` to avoid `NameError: ...Logger` during boot.
- Bundler initially pulled an `ffi` binary gem for `x86_64-darwin`; forcing Ruby platform (`BUNDLE_FORCE_RUBY_PLATFORM=1`) and reinstalling fixed it for Apple Silicon.
- The “default” simulator build tried to compile both `arm64` and `x86_64`; explicitly excluding `x86_64` made the build practical.

### Android prebuild / validation

- `npx expo prebuild --platform android --no-install` succeeds and generates `android/`.
- Gradle build validation now gets past the Java + Gradle wrapper setup, but is blocked by a missing Android SDK:
  - Installed JDK 17 locally (`openjdk@17`) and used `JAVA_HOME=/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home`.
  - Switched Gradle wrapper `distributionUrl` to `downloads.gradle.org` (the default `services.gradle.org` URL timed out here) and increased `networkTimeout` in `android/gradle/wrapper/gradle-wrapper.properties`.
  - Current failure: `SDK location not found... Define ANDROID_HOME or set sdk.dir in android/local.properties`.
- Health Connect configuration was added at the native layer:
  - `android/app/build.gradle` sets `minSdkVersion 26` (required by Health Connect)
  - `android/app/src/main/AndroidManifest.xml` adds read-only Health Connect permissions for sleep + HRV + resting HR

## QA flow log (rolling)

Device: iPhone 16 (Simulator), iOS 18.6

### Latest run (2025-12-24)

- ✅ Onboarding persists across relaunch (no re-onboarding after kill/relaunch)
- ✅ Seal → Night Mode locks the app globally (no bottom tab navigation while sealed)
- ✅ Quick Log can be completed end-to-end and appears in Journal timeline
- ⚠️ Quick Log UI requires a small scroll to avoid being obscured by the fixed Emergency footer (layout/padding tweak)
- ✅ Reduced emoji usage in Journal timeline + key empty states (spec prefers minimalist symbols)
- ✅ Deep Work now enforces Day-window-only start (blocks outside 11:00–17:00)
- ✅ Dream Capture lucidity options now include an “Operator” tier (docs v3.3)
- ✅ Fixed a simulator crash when persisting daily-cycle state (AsyncStorage write error) by using `createJSONStorage` for the daily-cycle store
- ✅ E2E verified in simulator automation: Morning Check-in → Dream Capture → Seal → Night Mode lock
- ✅ Journal “Today” timeline now includes a distinct “Day Sealed” entry and surfaces gratitude when present: `src/screens/JournalScreen.tsx`
- ⚠️ iOS logs show Expo warnings about background fetch / remote notifications missing `UIBackgroundModes` entries (safe to ignore, but noisy)
- ✅ Added an explicit “On-device” privacy chip in the Mode header (docs v3.0 global nav intent): `src/components/global/ModeHeader.tsx`
- ✅ Deep Work is now fully testable end-to-end (without waiting 25 min): preflight can set “Current state”, and the timer has a dev-only skip: `src/components/flows/DeepWorkFlow.tsx`
- ✅ Dreams are now “5–6 clicks deep” navigable: tapping the Dream entry opens a Dream Detail sheet with lucidity + symbols: `src/screens/JournalScreen.tsx`
- ✅ Seal Flow buttons/plot options are now automation-friendly via accessibility labels: `src/components/flows/SealFlow.tsx`
- ⚠️ Intermittent iOS RedBox seen once during Seal (“AppRegistryBinding::startSurface failed…”); not reproducible after rebuild/relaunch — keep an eye on this as we harden flows.

## End-to-end “Daily Routine” flows (v3.4) vs current app

Docs reference: `docs/DAILY_ROUTINE_SPEC.md` (Morning check-in, Dream Capture, Deep Work, Seal, Night Mode, Brahma window constraints).

### Implemented (usable)

- Morning check-in modal exists: `src/components/flows/MorningCheckin.tsx`
- Dream capture modal exists: `src/components/flows/DreamCapture.tsx`
- Deep work flow exists (preflight → timer → output → return): `src/components/flows/DeepWorkFlow.tsx`
- Seal flow exists and can activate Night Mode: `src/components/flows/SealFlow.tsx`, `src/components/flows/NightMode.tsx`
- Flow decision engine exists and time-gates some availability: `src/utils/flowCoordinator.ts`, `src/utils/timeWindow.ts`

### Implemented (but incomplete / not wired end-to-end)

- Wake inference + “first app open after wake” behavior is not automatically happening; many time-gates depend on `wakeTimeInferred` being set (currently mostly via demo controls): `src/store/useDailyCycleStore.ts`
- Mission system is not present per v3.0 (selection algorithm, tier unlocks, completion/reflection UI). A minimal Mission picker was added to make the flow testable: `src/components/flows/MissionSelect.tsx`
- Dyad status is tracked in the store, but has no real UX beyond a toggle: `src/store/useDailyCycleStore.ts`

### Missing vs spec

- Sensor snapshot + mode preset before user interaction (silent 2–6s “front door”): not implemented (no HealthKit / audit pipeline).
- “Drift check” and soft-audit sheet: mostly placeholder (no actual soft-audit flow UI).
- “Seal within 60 min of sleep” heuristics are simplistic and not backed by real sleep signals.
- Health-driven “Sensor Snapshot” is now implemented (local-only) but is not yet used to drive the full “drift check” or mode preset pipeline end-to-end.

## Design System v3.0 (home + components) vs current UI

Docs reference: `docs/DESIGN_SYSTEM_V3.md` section “PART III: HOME SCREEN ARCHITECTURE”

### Matches the intended structure

- Home uses the 7-block skeleton ordering (H0–H7) and an emergency footer: `src/screens/HomeScreen.tsx`
- Safety banner exists and expands to show explanation: `src/components/global/SafetyBanner.tsx`
- Mode header + dual-truth strip + primary action + quick journal + tools + pattern + ladder are present as separate components.

### Gaps / visual mismatches

- Heavy emoji usage conflicts with the v3.1 illustration language (“minimalist, symbolic, not cartoonish”):
  - Tab bar icons: `src/navigation/BottomTabNavigator.tsx`
  - Empty states + timeline icons: `src/screens/PracticeScreen.tsx`, `src/screens/JournalScreen.tsx`
  - Cards/icons throughout: `src/components/**`
- Many “interactive” elements are placeholders (alerts) rather than actual in-app interactions:
  - Mood Meter / Body Map / Word chips are `Alert.alert(...)`: `src/components/home/QuickJournalCard.tsx`
- Safety banner “Dismiss” and “Why?” buttons were visually present but non-functional; now wired, but the dismissal behavior is session-local: `src/components/global/SafetyBanner.tsx`
- The Ladder is a static list, not the interactive spine visualization described in v3.1: `src/screens/LadderScreen.tsx`
- The home spec calls for an explicit “On-device” privacy indicator in global navigation; the app has “local-only” behavior but does not surface that indicator yet.

## Issues to track (highest impact first)

1. Mission Engine is largely missing (selection logic, mission library, completion flow, reflection capture, day-to-day persistence).
2. Sensor snapshot + drift check + soft audit are missing (core “dual truth” front door from v3.0).
3. Daily-cycle time inference is mostly manual (demo controls), not “first open after wake” driven.
4. Deep Work “blocked after 17:00” is not strictly enforced in UI/flow (needs explicit gating + messaging).
5. Dream module is simplified vs docs (e.g., richer lucidity scale, nightmare gate UX, intention setting).
6. Visual language still has emoji-heavy remnants (Journal/Practice icons, empty states, some cards).
7. Night Mode journaling: app enters Night Mode, but “night mode entered/exited” isn’t recorded as a timeline entry (may be useful for retrospectives).
8. Android build validation is currently blocked by missing Java runtime in this environment (native project exists; needs Gradle verification on a machine with JDK installed).

## Changes made during this pass (to make flows testable)

- Added a minimal Mission selection modal and wired `mission-reminder` cards to open it: `src/components/flows/MissionSelect.tsx`, `src/screens/HomeScreen.tsx`
- Rendered previously-unhandled flow cards (`mission-reminder`, `dyad-status`, `brahma-available`) so the coordinator output is visible: `src/screens/HomeScreen.tsx`
- Made SafetyBanner actions functional (Dismiss/Why): `src/components/global/SafetyBanner.tsx`
- Made Practice taps log a completed practice entry for today (basic end-to-end loop): `src/screens/PracticeScreen.tsx`

## Changes made after the initial gap report (2025-12-24)

- Night Mode now locks the entire app (no tab navigation while sealed): `App.tsx`
- Onboarding completion persists across relaunch (Zustand persist + AsyncStorage): `src/store/useAppStore.ts`
- First-pass copy/visual cleanup (reduce emoji-heavy UI in high-traffic surfaces): `src/navigation/BottomTabNavigator.tsx`, `src/components/home/QuickJournalCard.tsx`, `src/components/flows/DreamCapture.tsx`, `src/components/flows/DeepWorkFlow.tsx`, `src/components/flows/NightMode.tsx`
- Local-only persistence for daily-cycle journaling data (Zustand persist + AsyncStorage/localStorage with Date-safe serialization): `src/store/useDailyCycleStore.ts`, `src/store/persistStorage.ts`
- Health integrations (local-only): Apple Health (HealthKit) + Android Health Connect provider abstractions + Home connect CTA: `src/health/*`, `src/screens/HomeScreen.tsx`, `app.json`
- Android prebuild + Health Connect manifest/SDK adjustments: `android/app/build.gradle`, `android/app/src/main/AndroidManifest.xml`
- Home Primary Action “START” is now wired end-to-end + accessible labels added for automation: `src/components/home/PrimaryActionCard.tsx`, `src/screens/HomeScreen.tsx`
- Health connect initialization now times out instead of hanging (HealthKit/Health Connect): `src/health/provider.ios.ts`, `src/health/provider.android.ts`
- Dev-only LogBox warnings suppressed to keep QA runs usable (prevents warning toasts/overlays): `App.tsx`
- Journal dream detail sheet added + lucidity “Operator” mapped correctly: `src/screens/JournalScreen.tsx`
- Seal Flow accessibility labels added for plot + gratitude steps: `src/components/flows/SealFlow.tsx`

## E2E journeys — run log (rolling)

### Run: 2025-12-24 (iOS Simulator)

Test device: iPhone 16 (Simulator), iOS 18.6

**Journey A — Morning (Phase 2):** ✅ PASS
- Set demo time `Morning` + `Wake Now` + Phase 2
- Morning Check-in → Dream Capture (Operator) → Save symbols
- Verified entries appear in Journal timeline

**Journey B — Morning (Phase 3 mission):** ✅ PASS (with caveats)
- Phase 3 shows “Select Today’s Mission” card → Mission picker → Mission appears in Journal timeline
- Caveat: Mission Engine is still a stub (no selection algorithm / completion loop per v3.0)

**Journey C — Day Deep Work (Phase 3+):** ✅ PASS
- Set demo time `Day` (13:00) → Deep Work Pre-flight → Bellows → Intention → Timer → Output log → Return Check
- Verified Deep Work entry appears in Journal timeline
- ✅ Deep Work is blocked outside the `DAY` window and shows a clear “Day window only” message

**Journey D — Night Seal + Night Mode lock:** ⚠️ PARTIAL
- Seal flow completes and routes into Night Mode with tabs removed (global lock works)
- Issue: “I’m awake” currently exits Night Mode immediately even if it’s still in the `NIGHT` window, re-enabling full Home/tabs (spec intends Night Mode lock until morning)

**Practice logging:** ✅ PASS
- Tapping a practice logs completion and shows in Journal timeline

**Trends screen:** ✅ PASS (basic)
- Trends renders and is navigable when Stability is in an unlocked range (no full lock-state verification in this run)

### Automation/testing gaps found

- Demo Controls: Stability `-10/+10` buttons lack accessibility labels, making simulator automation brittle.
- Daily Cycle “reset” vs “Reset App”: Daily reset doesn’t clear long-lived app data (expected), but it makes it hard to run clean-slate E2E passes unless “Reset App” is used.

### Fixes applied after this run

- Night Mode “I’m awake” now stays locked during `NIGHT` and only exits when the window is no longer `NIGHT`: `src/components/flows/NightMode.tsx`
- Demo Controls Stability `-10/+10` now have accessibility labels for automation: `src/components/demo/DemoControlPanel.tsx`
