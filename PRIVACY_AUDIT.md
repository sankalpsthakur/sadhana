# Sadhana — Privacy Audit (Wave 13)

**Date:** 2026-05-14
**Auditor:** Claude (Opus 4.7)
**Manifest under audit:** `ios/Sadhana/PrivacyInfo.xcprivacy`
**Status:** PASS (with one yellow recommendation — analytics emissions exist via RN bridge)

---

## 1. What we say (PrivacyInfo.xcprivacy declarations)

### `NSPrivacyTracking`
- `false`.

### `NSPrivacyTrackingDomains`
- Empty.

### `NSPrivacyAccessedAPITypes`
| Category | Reasons |
|---|---|
| UserDefaults | CA92.1 |
| FileTimestamp | 0A2A.1, 3B52.1, C617.1 |
| DiskSpace | E174.1, 85F4.1 |
| SystemBootTime | 35F9.1 |

### `NSPrivacyCollectedDataTypes`
- **Empty.** Declares "Data Not Collected."

---

## 2. What we do (actual behavior in code)

### Identity / Contact
- **No login.** All state is local Zustand stores; no email/name captured.

### Analytics — call sites
- React Native bridge: `ios/Sadhana/IOSAppsAnalyticsBridge.{swift,m}` exposes `track(event, properties)` to JS.
- The bridge **does** emit anonymous events (phase advanced, daily check-in, paywall events) — these are Product Interaction signals.
- Current declared manifest says "Data Not Collected" — this is **inconsistent** with the bridge being live. See §3.

### HealthKit / sensitive data
- No `HKHealthStore` callsites detected in iOS source; HealthKit-style data is stored locally on device only (per app's `PRIVACY.md`).

### 3rd-party SDKs
- No third-party telemetry SDKs in `Podfile.lock` for the iOS shell. RN core, Expo modules, and Async Storage only.

### Required-reason APIs
- **UserDefaults** — used by `IOSAppsAnalyticsBridge` (UUID, opt-out flag, flag overrides). ✅ CA92.1 declared.
- **FileTimestamp / DiskSpace / SystemBootTime** — declared. No direct Swift callsites in our code, but Expo / React Native modules legitimately use these APIs. Apple's required-reason rule covers transitive use — declaration is the safe posture. ✅.

---

## 3. Mismatches (RED = blocker, YELLOW = cleanup)

| # | Severity | Finding | Action |
|---|---|---|---|
| 1 | 🟡 YELLOW | `IOSAppsAnalyticsBridge` is wired and can `track()` events from JS, yet `NSPrivacyCollectedDataTypes` is empty. If JS actually calls `track()` in production builds, manifest understates collection. | **Recommendation (post-launch decision):** if Sadhana ships with analytics enabled, add User ID (Not Linked, Analytics) and Product Interaction (Not Linked, Analytics). If Sadhana ships analytics-disabled at launch (matches its "private practice" positioning), keep manifest empty and document the bridge as inert. **Default:** match SkinScanner's stance — keep manifest empty, ship with bridge **opt-in** disabled. |
| 2 | 🟡 YELLOW | FileTimestamp reasons include `0A2A.1` (sample to app) and `3B52.1` (display to user). These are correct only if RN modules use those flows. | Cross-check at RN module dependency-audit time. Safe today. |

**No RED issues. Sadhana is App Store privacy-clean as long as launch-day default is analytics-off** (matches in-app opt-in pattern documented in `IOSAppsAnalyticsBridge.swift`).

---

## 4. App Store Connect — nutrition label entries

**Default (analytics-off at launch):**

### Data Used to Track You
- **None.**

### Data Linked to User
- **None.**

### Data Not Linked to User
- **None.** (Data Not Collected.)

### Privacy Practices
- Data collection: **No.**
- Tracks across apps: **No.**
- Privacy policy URL: `https://iosapps.io/sadhana/privacy`.

**If analytics enabled at launch (alternate posture):**
- Identifiers → User ID (Not Linked, Analytics)
- Usage Data → Product Interaction (Not Linked, Analytics)

---

## 5. User-facing privacy policy URL (per D3 umbrella)

**URL:** `https://iosapps.io/sadhana/privacy`.

Policy at that URL must state:

1. **Privacy positioning** — Sadhana is a **private spiritual-practice journal**. All practice data (phases, modes, dream entries, stability scores) stays on device unless the user explicitly enables backup or sync.
2. **No tracking** — `NSPrivacyTracking=false`; no SDKs touch advertising networks.
3. **No required login** — App functions fully without an account.
4. **Optional analytics** — A toggle exists for anonymous usage telemetry. **Off by default.** When enabled, emits anonymous Product Interaction events through `IOSAppsAnalyticsBridge` (UUID-based).
5. **Sensitive data** — Mood, dream, and safety-lock data is sensitive. We do not transmit it.
6. **Data deletion** — Uninstall removes all local data; for any synced data: `mailto:privacy@iosapps.io`.
7. **Children** — Not directed to under-13s; safety-lock framework implies adult self-monitoring.
8. **Jurisdiction** — GDPR / CCPA rights honored.
9. **Contact** — `privacy@iosapps.io`.
