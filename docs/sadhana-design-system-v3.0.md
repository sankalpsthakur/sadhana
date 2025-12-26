# Sadhana: Complete Design System v3.0
## The Seven-Phase Sovereignty Protocol

**Version:** 3.0  
**Scope:** Full System Architecture + UI Specifications + Mission Library + Journal OS  
**Target:** Designers, Engineers, Product Team  
**Core Truth:** Self-actualization is the ability to generate (and release) ecstatic states without losing ethics, sleep, or identity — and then channel that surplus into service, creation, and clean relationships.

---

# PART I: SYSTEM ARCHITECTURE

---

## 1.1 The Core Design Principle — Adhikara (Competency)

The fundamental law of Sadhana is **"No Shakti without a Vessel."**

You do not gamify awakening. You gamify variance control.

### The Two Axes of Identity

| Axis | Name | Meaning | Analogy |
|------|------|---------|---------|
| **Phase** | Capability | The highest safely unlocked depth | Your driver's license class |
| **Mode** | Right Now | The current biological state | Today's road conditions |

A Phase 7 user in Armor Mode receives Phase 1 treatment. Phase is potential. Mode is reality.

### The Safety Invariant

**No upward voltage (Weaver/Neti/Serpent) unless:**
- User can return to Green on demand
- Sleep + overwhelm markers remain stable
- Sensor audit passes (if available)

This is the physics of "wire capacity."

---

## 1.2 The Mood Meter as Biological Compass

The Mood Meter is not a journaling gimmick. It is the **diagnostic interface for the Endocrine System**.

### Quadrant Definitions

| Quadrant | Energy | Pleasantness | Endocrine State | System Response |
|----------|--------|--------------|-----------------|-----------------|
| **Red** | High | Low | Cortisol surge / Fight-flight | Kavacha (Armor) |
| **Blue** | Low | Low | Cortisol depletion / Collapse | Warmth / Rebuild |
| **Green** | Low | High | Parasympathetic baseline | Maintain / Stability |
| **Yellow** | High | High | Productive activation | Transmute / Conduct (with audits) |

### Mood-to-Chakra Mapping

| Quadrant | Sample Emotions | Chakra Disruption | Resolution Target |
|----------|-----------------|-------------------|-------------------|
| **Red** | Enraged, Panicked, Furious, Anxious | Muladhara overload | Ground to feet |
| **Blue** | Depressed, Hopeless, Drained, Lonely | Svadhisthana depletion | Restore warmth |
| **Green** | Calm, Content, Peaceful, Balanced | Anahata coherence | Maintain baseline |
| **Yellow** | Motivated, Inspired, Energized, Elated | Manipura fire | Channel to output |

### Critical Distinction: Ecstasy vs Mania

| State | Indicators | Classification |
|-------|------------|----------------|
| **Ecstasy (Safe)** | Bright, coherent, embodied, sleep intact | Yellow — eligible for conduction |
| **Manic Spike (Unsafe)** | Bright, compulsive, sleep eroding, racing | Unstable Red-adjacent — route to grounding |

The Adhikara Engine must treat Yellow as **eligible but audited**, never auto-approved.

---

## 1.3 The Chakra-Endocrine Map

Each phase targets a specific energy center and its biological correlate.

| Phase | Name | Chakra | Location | Endocrine | Function | Mood Target |
|-------|------|--------|----------|-----------|----------|-------------|
| 1 | Foundation | Muladhara | Pelvic floor | Adrenals | Survival, Grounding | Red/Blue → Green |
| 2 | Flow | Svadhisthana | Sacrum | Gonads | Subconscious, Creativity | Blue → Green |
| 3 | Fire | Manipura | Solar plexus | Pancreas | Agency, Will | Yellow (channeled) |
| 4 | Resonance | Anahata | Heart | Thymus | Coherence, Connection | Green (sustained) |
| 5 | Expression | Vishuddha | Throat | Thyroid | Truth, Communication | Green → Yellow |
| 6 | Vision | Ajna | Third eye | Pituitary | Witness, Insight | Green (deep) |
| 7 | Union | Sahasrara | Crown | Pineal | Integration, Ecstasy | Yellow (controlled) |

---

## 1.4 The Closed-Loop Architecture

### The Audit Stack (Sensor Layer)

Hardware integration transforms Mode from self-report to physiological truth.

| Sensor | Proxy For | Source | Fallback |
|--------|-----------|--------|----------|
| HRV trend | Vagal tone / Resilience | HealthKit / Health Connect | Self-report |
| Heart rate volatility | Arousal level | HealthKit / Health Connect | Self-report |
| Movement (IMU) | Context | Device sensors | Self-report |
| Respiration rate | Breath coherence | Wearables | Not available |
| Skin temperature | Activation state | Wearables | Not available |

### The Front Door Flow (Every App Open)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  STEP A: Sensor Snapshot (2-6 seconds, silent)              │
│          Background fetch: HRV, HR, sleep, movement         │
│  ↓                                                          │
│  STEP B: Mode Pre-set (before user interaction)             │
│          System determines: Armor/Rebuild/Mirror/Forge/etc  │
│  ↓                                                          │
│  STEP C: User plots Mood Meter                              │
│          Subjective state captured                          │
│  ↓                                                          │
│  STEP D: Drift Check (Body Truth vs Mind Truth)             │
│          Compare Audit proxy quadrant to Mood quadrant      │
│  ↓                                                          │
│  [If drift] → Soft Audit Sheet → Reconcile                  │
│  [If aligned] → Proceed to Home                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Mode Mapping (Sensor → Mode)

| Mode | Chakra | Audit Condition | Primary Practice |
|------|--------|-----------------|------------------|
| **Armor** | Muladhara | Low vagal tone + high arousal | Heavy Earth |
| **Rebuild** | Svadhisthana | Low energy + low movement + low resilience | Gentle Warmth |
| **Mirror** | Svadhisthana | Stable but noisy (sleep irregularity) | Dream Capture |
| **Forge** | Manipura | Elevated HR + resilient HRV | Mission + Deep Work |
| **Bridge** | Anahata | Coherence signatures (stable HRV) | Resonant Breathing |
| **Signal** | Vishuddha | Stable + low arousal | Silence Seal |
| **Void** | Ajna | Stable + low arousal + high clarity | Neti Protocol |
| **Conductor** | Sahasrara | HV-eligible + no risk markers | Sushumna Rise |

### Confidence Levels

| Level | Meaning | Badge | Unlock Impact |
|-------|---------|-------|---------------|
| **Verified** | Sufficient sensor coverage + stable signal | ✓✓ | Standard unlock path |
| **Mixed** | Partial sensors or noisy data | ✓ | Standard unlock path |
| **Self-report** | No sensors / permissions denied | ○ | Extended time requirements |

---

## 1.5 The Master Safety Algorithm

### Stability Score Calculation

```
Stability = f(
  consistency_of_green_returns,
  sleep_integrity_score,
  volatility_index_inverse,
  overwhelm_marker_absence,
  practice_completion_rate
)
```

### Stability Bands (Canonical)

| Band | Score Range | Pip Display | System Behavior |
|------|-------------|-------------|-----------------|
| **Unstable** | < 60 | ●○○○○ | Phases 4-7 hard-locked, Trends locked |
| **Settling** | 60-69 | ●●○○○ | Limited depth, Trends unlocks |
| **Stable** | 70-84 | ●●●○○ | Standard progression |
| **Radiant** | 85-89 | ●●●●○ | Neti eligible |
| **HV-Eligible** | ≥ 90 (30+ days) | ●●●●● | Serpent eligible, Dark Mode prompt |

### Phase Unlock Requirements

| Phase | Name | Stability | Duration | Additional Requirements |
|-------|------|-----------|----------|------------------------|
| 0 | Initiation | — | Days 0-3 | Complete onboarding |
| 1 | Foundation | — | Days 1-30 | — |
| 2 | Flow | ≥ 70 | 14 consecutive days | No 2-night sleep crash |
| 3 | Fire | ≥ 70 | Phase 2 complete | — |
| 4 | Resonance | ≥ 75 | Phase 3 complete | 7 missions complete |
| 5 | Expression | ≥ 80 | Phase 4 complete | 5 Dyad sessions |
| 6 | Vision | ≥ 85 | 30 days at Radiant | Clean dissociation checks |
| 7 | Union | ≥ 90 | 30+ days at HV | Master Lock requirements |

### Completion Tier Rules

| Tier | Badge | For Streaks | For Unlocks (with sensors) | For Unlocks (no sensors) |
|------|-------|-------------|---------------------------|-------------------------|
| **Verified** | ✓✓ | Counts | Required 70%+ | N/A |
| **Supported** | ✓ | Counts | Counts toward % | Counts |
| **Self-report** | ○ | Counts | N/A | +50% extended duration |

### Safety Locks

| Lock | Trigger | Duration | Resolution |
|------|---------|----------|------------|
| **Kavacha** | Red quadrant + overwhelm markers | Until Green return | Complete grounding protocol |
| **Nightmare Gate** | 2 consecutive terror nights | Until 3 stable nights | Auto-revert to Phase 1 |
| **Neti Cooldown** | Dissociation flag | 72 hours | Time-based |
| **Serpent Cooldown** | Kill-switch triggered | 7 days | Time-based |
| **Union Lock** | Partner destabilized | Until partner stable | Partner resolution |
| **Sleep Emergency** | 2-night crash pattern | Until sleep restored | Sleep protocol completion |

---

# PART II: GLOBAL NAVIGATION

---

## 2.1 Mobile Navigation (Bottom Nav, 5 Items)

| Position | Icon | Label | Notes |
|----------|------|-------|-------|
| 1 | 🏠 | Home | Default landing, always visible |
| 2 | ◎ | Practice | Modules + Dyads tab (when Phase 4+ unlocked) |
| 3 | 📓 | Journal | Log, Reflect, Review modes |
| 4 | 📊 | Trends | Locked until Stability ≥ 60 for 7 days |
| 5 | ⛰️ | Ladder | Pathway Map / Progression |

**Design Rules:**
- Dyads appears as tab in Practice AND card on Home when Phase 4+ unlocked
- No "phase shopping" — users don't browse phases from nav
- Active state uses phase-appropriate accent color

## 2.2 Desktop Navigation (Left Rail)

```
┌─────────────────────────────────────────┐
│  ◉ Sadhana                              │
├─────────────────────────────────────────┤
│  🏠 Home        ← Active indicator      │
│  ◎ Practice                             │
│  📓 Journal                             │
│  📊 Trends      (locked state)          │
│  ⛰️ Ladder                              │
├─────────────────────────────────────────┤
│                                         │
│                                         │
├─────────────────────────────────────────┤
│  ⚙️ Settings                            │
│  🛡️ Safety                              │
│  ❓ Help                                │
│  🔒 On-device                           │
└─────────────────────────────────────────┘
```

## 2.3 Global Controls (Top Right, Always Available)

| Control | Icon | Action |
|---------|------|--------|
| Safety | ⚡ | Opens Emergency Downshift modal (full-screen takeover) |
| Settings | ⚙️ | Preferences, skin toggle, sensor permissions |
| Privacy | 🔒 | On-device status indicator (green = local-first active) |

---

# PART III: HOME SCREEN ARCHITECTURE

---

## 3.1 The 7-Block Skeleton (Constant Layout)

The Home screen uses **7 fixed blocks** in the same order across all phases. Content inside blocks changes; structure does not.

```
┌──────────────────────────────────────────┐
│ H0  SAFETY BANNER (conditional)          │ ← Sticky under top bar
├──────────────────────────────────────────┤
│ H1  MODE HEADER                          │
│     Phase + Mode + Confidence + Band     │
├──────────────────────────────────────────┤
│ H2  STATE STRIP (Dual Truth)             │
│     Row 1: Subjective | Row 2: Audit     │
├──────────────────────────────────────────┤
│                                          │
│ H3  PRIMARY ACTION CARD                  │
│                                          │
├──────────────────────────────────────────┤
│ H4  QUICK JOURNAL CARD                   │
├──────────────────────────────────────────┤
│ H5  MODE TOOLS (2-3 cards)               │
├──────────────────────────────────────────┤
│ H6  TODAY'S PATTERN                      │
├──────────────────────────────────────────┤
│ H7  NEXT UNLOCK / LADDER                 │
└──────────────────────────────────────────┘
│ PERSISTENT FOOTER: Emergency Downshift   │
```

---

## 3.2 Block Specifications

### H0 — Safety Banner (Conditional)

**Visibility:** Only when safety locks active

**Component:** `SafetyBanner`

| Condition | Banner Text | Color Token |
|-----------|-------------|-------------|
| Kavacha active | "Depth locked. Ground first." | `--safety-red` |
| Nightmare gate | "Dream work paused for nervous system safety." | `--safety-blue` |
| Neti cooldown | "Neti paused. Return to embodiment." | `--safety-violet` |
| Serpent cooldown | "Voltage too high. Cooling: X days." | `--safety-amber` |
| Union lock | "Dyad paused. Partner stabilizing." | `--safety-gray` |
| Sleep emergency | "Sleep integrity compromised. Seal mode active." | `--safety-blue` |

**Layout:**
```
┌─────────────────────────────────────────────┐
│ 🛡️  Depth locked. Ground first.             │
│     [Dismiss] [Why?]                        │
└─────────────────────────────────────────────┘
```

**States:**
- Default: Visible with icon + text
- Tapped: Expands to show explanation (1 paragraph max)
- Dismissed: Collapses but safety state remains active

---

### H1 — Mode Header

**Purpose:** Two-axis identity display (Phase = capability, Mode = right-now)

**Component:** `ModeHeader`

**Layout:**
```
┌─────────────────────────────────────────────┐
│ [Phase Chip] [Mode Chip]   Today   [Band]   │
│ ◉ Fire        ⚙ Forge     Dec 22  Radiant   │
│ (Manipura)    Verified            ●●●●○     │
└─────────────────────────────────────────────┘
```

**Elements:**

| Element | Position | Content | Tap Action |
|---------|----------|---------|------------|
| Phase Chip | Left | Phase name + chakra name | Opens phase detail modal |
| Mode Chip | Left-center | Current mode + confidence | Opens "Why this mode?" modal |
| Date | Center | Today + weekday | — |
| Stability Band | Right | Band label + 5-pip indicator | Opens stability history |

**Mode Chip States:**
- Shows sensor-derived mode (Armor/Rebuild/Mirror/Forge/Bridge/Signal/Void/Conductor)
- Second line shows Confidence (Verified/Mixed/Self-report)
- If no sensors: shows "Self-report mode"

---

### H2 — State Strip (Dual Truth)

**Purpose:** Instrument cluster with subjective + objective data

**Component:** `StateStrip`

**Layout:**
```
┌─────────────────────────────────────────────┐
│ Row 1: Subjective                           │
│ [Mood]   [Body]    [Sleep]      [Locks]     │
│  🟡       Chest    Protected     🔒 0        │
│                                             │
│ Row 2: Audit (Objective)           [Drift]  │
│ [HRV]   [Arousal]  [Move]   [Breath] [Temp] │
│  Low     Spiky      Still    —       +0.3   │
└─────────────────────────────────────────────┘
```

**Row 1: Subjective Tiles**

| Tile | Display | States | Tap Action |
|------|---------|--------|------------|
| Mood | Quadrant color dot | Red/Blue/Green/Yellow/Empty | Opens Mood Meter |
| Body | Zone label | "Chest", "Jaw", "Belly", "—" | Opens Body Map |
| Sleep | Status text | Protected/At risk/Unknown | Opens sleep detail |
| Locks | Lock icon + count | 0-3 count | Opens lock summary |

**Row 2: Audit Tiles (Graceful Degradation)**

| Tile | Display | States | Tap Action |
|------|---------|--------|------------|
| HRV | Vagal tone | Low/OK/High/"—" | Opens Audit Detail |
| Arousal | Activation | Spiky/Steady/"—" | Opens Audit Detail |
| Move | Context | Still/Active/Exercising/"—" | Opens Audit Detail |
| Breath | Coherence | Coherent/Erratic/"—" | Opens Audit Detail |
| Temp | Trend | Baseline/Elevated/Dropping/"—" | Opens Audit Detail |

**Drift Badge (End of Row 2):**

| State | Display | Meaning |
|-------|---------|---------|
| Aligned | ✅ | Mood quadrant matches Audit proxy |
| Drift | ⚠️ | Mismatch → triggers Soft Audit |
| Unknown | — | Insufficient sensor data |

**Drift Detection Logic:**
```
Compute quadrant proxy from Audit:
- High arousal + low HRV → Red proxy
- Low energy + low movement + low HRV → Blue proxy
- Stable HRV + low arousal → Green proxy
- Elevated HR + stable HRV → Yellow proxy

Compare Mood quadrant vs Proxy quadrant
If mismatch → Drift = true
```

**Tile States:**
- Default: Shows current value
- Stale (>4 hours subjective, >30 min audit): Dimmed 60%
- Unavailable: Shows "—"

---

### H3 — Primary Action Card

**Purpose:** Single dominant CTA — "Do this next"

**Component:** `PrimaryActionCard`

**Layout:**
```
┌─────────────────────────────────────────────┐
│                                             │
│  Heavy Earth                                │
│  ─────────────────────────────              │
│  Arousal is high. Bring attention           │
│  to feet first.                             │
│                                             │
│  Audit: Verified                            │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │          START (3:00)               │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Why this? ↗                               │
└─────────────────────────────────────────────┘
```

**Elements:**
- Title: Practice/action name
- Reason line: 1-line contextual why (state-aware)
- Audit line: "Audit: Verified/Mixed/Self-report"
- Primary CTA: "Start (duration)"
- Secondary link: "Why this?" → explainer modal

**Selection Priority (Sensor-First):**
1. Hard safety locks (Kavacha/cooldowns)
2. Sensor preset mode (Audit → Mode)
3. Drift resolution (Soft Audit if mismatch)
4. Sleep-at-risk override (any time of day)
5. Time of day rules (morning/day/night)
6. Streak maintainer

**Soft Audit Intercept:**
Before "Start" executes, if Drift = true → Show Soft Audit Sheet

---

### H4 — Quick Journal Card

**Purpose:** Fast Plot → Place → Name flow (consistent muscle memory)

**Component:** `QuickJournalCard`

**Layout:**
```
┌─────────────────────────────────────────────┐
│  Quick Log                                  │
│  ─────────────────────────────              │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐     │
│  │  Plot   │  │  Place  │  │  Name   │     │
│  │   🎯    │  │   👤    │  │   💭    │     │
│  │ Mood    │  │ Body    │  │ Word    │     │
│  └─────────┘  └─────────┘  └─────────┘     │
│                                             │
│  [SAVE]                                     │
└─────────────────────────────────────────────┘
```

**Flow:**
1. **Plot:** Tap → Opens Mood Meter grid → Place dot → Quadrant color appears
2. **Place:** Tap → Opens Body Map → Tap zone → Zone label appears
3. **Name:** Tap → Opens word chips (quadrant-filtered) → Select → Word appears
4. **Save:** Drift check → If aligned, create entry; if drift, show Soft Audit

**States:**
- Empty: All three show placeholder icons
- Partial: Completed steps filled, incomplete outlined
- Complete: All filled → Save button enabled

---

### H5 — Mode Tools (2-3 Cards)

**Purpose:** Phase-aware tool availability

**Component:** `ModeToolsGrid`

**Layout:**
```
┌─────────────────────────────────────────────┐
│  Available Now                              │
│                                             │
│  ┌──────────────┐  ┌──────────────┐        │
│  │ Dream        │  │ Shadow Dex   │        │
│  │ Capture      │  │              │        │
│  │ 60s          │  │ 90s          │        │
│  │ ◉ Available  │  │ 🔒 Locked    │        │
│  └──────────────┘  └──────────────┘        │
└─────────────────────────────────────────────┘
```

**Card States:**

| State | Visual | Interaction |
|-------|--------|-------------|
| Available | Full opacity, green indicator | Tap → opens tool |
| Locked (phase) | Dimmed, lock icon | Tap → shows phase requirement |
| Locked (state) | Dimmed, shield icon | Tap → shows stability requirement |
| Cooldown | Timer overlay | Non-interactive until timer expires |

---

### H6 — Today's Pattern

**Purpose:** One clean signal, not therapy

**Component:** `PatternCard`

**Layout:**
```
┌─────────────────────────────────────────────┐
│  Pattern Detected                           │
│  ─────────────────────────────              │
│  Your Red spikes cluster after              │
│  late meetings.                             │
│                                             │
│  [See in Trends ↗]                         │
└─────────────────────────────────────────────┘
```

**Content Rules:**
- Maximum 2 sentences
- Observation only, never prescription
- Links to Trends for full context
- Rotates daily (no repeat within 7 days)

**Pattern Types:**

| Category | Example |
|----------|---------|
| Trigger correlation | "Red spikes follow Thursday meetings" |
| Recovery insight | "Return to Green is fastest after walking" |
| Sleep connection | "Blue mornings correlate with <6hr sleep" |
| Practice efficacy | "Bellows + Deep Work = 2x output logged" |
| Sensor insight | "HRV drops precede mood crashes by 2 hours" |

---

### H7 — Next Unlock / Ladder Card

**Purpose:** Prevent "what do I do now?" anxiety

**Component:** `LadderCard`

**Layout:**
```
┌─────────────────────────────────────────────┐
│  Your Path                                  │
│  ─────────────────────────────              │
│  ████████████░░░░░░  Phase 2: 78%          │
│                                             │
│  Next: Stability ≥ 70 for 8 more days      │
│                                             │
│  [Open Ladder ↗]                           │
└─────────────────────────────────────────────┘
```

**Elements:**
- Progress bar (phase completion %)
- Next requirement (1 line)
- CTA to full Ladder view

---

### Persistent Footer

**Component:** `EmergencyFooter`

```
┌─────────────────────────────────────────────┐
│  [🛡️ Emergency Downshift]                   │
└─────────────────────────────────────────────┘
```

**Behavior:**
- Sticky at bottom on mobile
- Tap opens Emergency Downshift modal (full-screen takeover)
- Available from any screen

---

## 3.3 Soft Audit Sheet (Drift Reconciliation)

**Component:** `SoftAuditSheet`

**Trigger Points:**
1. After Quick Journal Save if drift detected
2. Before Start on Primary Action if drift detected
3. On any attempt to launch Forge/Neti/Serpent

**Layout:**
```
┌─────────────────────────────────────────────┐
│                                             │
│  Two Signals Detected                       │
│  ─────────────────────────────              │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │     ● Your Report (Yellow)          │   │
│  │                                      │   │
│  │              ○ Sensor Snapshot (Red) │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Your body shows high-voltage activation,   │
│  but your mind feels bright. This can be    │
│  peace — or numbness.                       │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │   Downshift (recommended)           │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [Re-plot mood]     [Proceed anyway ↗]     │
│                                             │
└─────────────────────────────────────────────┘
```

**Microcopy Rules:**
- Never: "You are lying"
- Always: "There is drift between systems"

**Button Actions:**

| Button | Action |
|--------|--------|
| Downshift (recommended) | Routes to Phase 1 grounding |
| Re-plot mood | Opens Mood Meter again |
| Proceed anyway | Requires friction |

**Friction for "Proceed anyway":**
```
┌─────────────────────────────────────────────┐
│  Confirm Presence                           │
│                                             │
│         ○ ← 10-second breath circle        │
│                                             │
│  □ I feel safe and present                 │
│                                             │
│  [Confirm]                                  │
└─────────────────────────────────────────────┘
```

---

## 3.4 Card Ordering Rules

### Time-Based Priority

**Morning (5am-11am):**
1. Dream Capture (if Phase 2+)
2. Morning Check-in
3. Gentle activation (if stable + Verified)

**Day (11am-6pm):**
1. Mission/Deep Work (if Forge mode + Verified)
2. Coherence (if Bridge mode)
3. Maintenance (if stable)

**Night (6pm-5am):**
1. Seal the Day
2. Sleep Shield
3. Churn (if Phase 2+)
4. NO intensity practices (blocked)

### State-Based Overrides (Highest Priority)

| State | Override | Reason |
|-------|----------|--------|
| Kavacha active | Force grounding | Safety first |
| Red quadrant | Vent & Ground only | De-escalate |
| Red proxy (sensor) | Vent & Ground | Even if user claims Yellow |
| Blue quadrant | Warmth & Rebuild | Restore |
| Sleep crash (2 nights) | Lock all depth | Protect baseline |
| Sleep at risk (sensor) | Force Seal mode | Any time of day |
| Nightmare gate | Lock dream work | Nervous system safety |
| Dissociation flag | Force Phase 1 | Re-embody |
| Drift detected | Soft Audit | Reconcile truths |

### Mode Selection Flowchart

```
START
  │
  ▼
[Sensor snapshot available?]
  │ Yes                    │ No
  ▼                        ▼
[Run Audit Stack]     [Self-report mode]
  │                        │
  ▼                        ▼
[Compute Mode proxy]  [Use Mood plot only]
  │
  ▼
[Safety lock active?]──Yes──► Show grounding only
  │ No
  ▼
[User plots Mood]
  │
  ▼
[Drift detected?]──Yes──► Soft Audit Sheet
  │ No                        │
  ▼                           ▼
[Use sensor Mode]        [Resolved → proceed]
  │
  ▼
[Sleep at risk?]──Yes──► Force Seal mode
  │ No
  ▼
[Time of day routing]
  │
  Morning──► Mirror Mode (if Phase 2+) or Maintain
  Day──────► Forge Mode (if stable) or Bridge Mode
  Night────► Seal Mode (no intensity)
```

---

# PART IV: PHASE-BY-PHASE CONFIGURATIONS

---

## Phase 0 — Initiation (Days 0-3)

### Purpose
Prevent the classic failure mode: "download → chase intensity → destabilize"

### Onboarding Flow

**Screen I-01: Intent Selection**
```
What are you building?
○ Stability — "I want to stop the chaos"
○ Healing — "I want to process old wounds"
○ Power — "I want to channel my energy"
○ Love — "I want deeper connection"
○ Awakening — "I want to know who I am"
```

**Screen I-02: Risk Gate**
```
Quick safety check:
□ History of insomnia (3+ nights/week)
□ History of panic attacks
□ History of mania or hypomania
□ Currently in mental health crisis

[Continue]
```
If any checked → stricter thresholds applied

**Screen I-03: Grounding Contract**
```
Your anchor practice (off-app):
○ Walking (30+ min daily)
○ Strength training
○ Manual labor / gardening
○ Swimming / water immersion
○ Other: [___________]

This is your emergency exit. When the app says "ground," 
you do this.

[I commit]
```

**Screen I-04: Sensor Connect**
```
Connect your body data?

Sadhana works better when it can see your 
nervous system. This is optional.

[Connect Apple Health / Health Connect]
[Skip — I'll self-report]
```

### UI Philosophy
- Deliberately "small" — no content library, no browsing
- Only CTA is "Seal the day"
- Show: "High-voltage is locked until stability is proven"

---

## Phase 1 — Foundation (Muladhara)

### Biological Architecture

| Attribute | Value |
|-----------|-------|
| **Chakra** | Muladhara (Root) |
| **Location** | Pelvic floor, legs, feet |
| **Endocrine** | Adrenals |
| **Function** | Survival, grounding, safety |
| **Element** | Earth |

### Mood Coordinates
- **Red Zone:** Panic, Rage, Enraged, Furious, Terrified
- **Blue Zone:** Despair, Hopeless, Depressed, Exhausted

### The Ritual: "Heavy Earth"
Guided haptic stomping and isometric contractions to flush cortisol and anchor awareness in the feet.

**Protocol:**
1. Stomp feet (30 seconds) — haptic sync
2. Wall push (isometric, 20 seconds)
3. Squeeze fists (20 seconds)
4. Release and breathe (60 seconds)
5. Feel feet on ground (30 seconds)

### Mode Preset Conditions

| Mode | Audit Condition | Practice | Duration |
|------|-----------------|----------|----------|
| **Armor** | Low HRV + high arousal OR Red proxy | Heavy Earth | 3:00 |
| **Rebuild** | Low energy + low movement + Blue proxy | Gentle Warmth | 5:00 |
| **Maintain** | Stable HRV + Green proxy | Seal Protocol | 2:00 |

### Skin: Earth / Heavy

```css
--bg-primary: #1a1a1a;
--bg-secondary: #2d2d2d;
--text-primary: #e8e8e8;
--text-secondary: #8a8a8a;
--accent: #8b5a2b;
--border: #3d3d3d;
--transition-speed: 400ms;
--font-weight-heading: 700;
```

### Mode Tools

| Tool | Availability | Description |
|------|--------------|-------------|
| Wandering Tap | Always | Micro-grounding (tap when mind wanders) |
| Vent & Ground | Always | Emergency discharge protocol |
| Sleep Shield | Always | Pre-sleep protection ritual |
| Dream Capture | 🔒 Phase 2 | — |

### Daily Loop

**AM Check-in (10 seconds):**
- Mood Meter plot
- Stability Score refresh

**Stack Served:**
- Red → "Vent & Ground" (Kavacha)
- Blue → "Rebuild & Warm"
- Green → "Maintain"
- Yellow → "Hold & Aim" (not "go harder")

**PM Closure:**
- "Seal the day"
- Sleep protection prompts

### Journal Entry Types
- `DailyCheckIn` (10-20s)
- `OverwhelmSpike` (auto-prompt on Red)
- `SealDay` (sleep-first closure)
- `FallProtocol` (when streak breaks)

### Unlock Criteria for Phase 2
- Stability ≥ 70 for 14 consecutive days
- No 2-night sleep crash pattern

### Pattern Card Examples
- "Your Red entries cluster in the evening."
- "Walking correlates with faster Green return."
- "HRV drops 2 hours before mood crashes."

---

## Phase 2 — Flow (Svadhisthana)

### Biological Architecture

| Attribute | Value |
|-----------|-------|
| **Chakra** | Svadhisthana (Sacral) |
| **Location** | Sacrum, lower abdomen |
| **Endocrine** | Gonads |
| **Function** | Subconscious cache, creativity, emotion, sexuality |
| **Element** | Water |

### Mood Coordinates
- **Blue-adjacent:** Troubled, Uneasy, Gloomy, Bored, Lonely

### The Ritual: "Shadow Dex Capture"
Name the dream-figure (e.g., "The Critic," "The Jailer"). Perform 2-minute stream-of-consciousness "Purge" that is auto-deleted.

### User Journey: Dream → Day

1. **Wake Capture** (15 seconds)
   - Voice note + Mood coordinate
   
2. **Symbol Extraction**
   - "What is the pattern?" (not the story)
   
3. **Complex Naming**
   - Shadow name + somatic location
   - e.g., "The Critic lives in my throat on Thursdays"
   
4. **Expiry Rule**
   - Entries decay in 7 days unless integrated
   - Prevents Shadow-Pokémon collecting

### The Shift (Success Indicator)
- User stops saying: "I am anxious"
- User starts saying: "Anxiety script is running (chest, morning, Thursdays)"

### Mode Preset Conditions

| Mode | Audit Condition | Practice | Duration |
|------|-----------------|----------|----------|
| **Mirror** | Morning + stable sleep + Green/Yellow proxy | Dream Capture | 1:00 |
| **Armor** | High arousal + low HRV | Heavy Earth | 3:00 |
| **Rebuild** | Low energy + Blue proxy | Warmth Protocol | 5:00 |

### Skin: Water / Reflective

```css
--bg-primary: #0d1b2a;
--bg-secondary: #1b263b;
--text-primary: #e0e1dd;
--text-secondary: #778da9;
--accent: #415a77;
--border: #2d4a6a;
--transition-speed: 350ms;
--font-weight-heading: 600;
```

### Mode Tools

| Tool | Availability | Description |
|------|--------------|-------------|
| Dream Capture | ◉ Available | 60s morning log |
| Shadow Dex | ◉ Available | Complex naming |
| Churn (Purge) | ◉ Available | 3-min auto-delete writing |
| Wandering Tap | Always | — |
| Mission | 🔒 Phase 3 | — |

### Safety Gate: Nightmare Gate
- Trigger: 2 consecutive terror-tagged nights
- Action: Auto-lock dream module
- Resolution: Return to Phase 1 behavior (no drama)

### Journal Entry Types
- `DreamLog` (tags, symbols, lucidity, optional audio)
- `ComplexCapture` (name, somatic zone, trigger, expiry)
- `Churn` (text discarded, only sentiment retained)
- `NightmareGateEvent` (system-generated)

### Screen: "Dream Capture" (60s max)

```
┌─────────────────────────────────────────────┐
│  Night Self                                 │
│  ─────────────────────────────              │
│                                             │
│  Step 1: How does it feel now?              │
│  [MoodPlotGrid]                             │
│                                             │
│  Step 2: Lucid?                             │
│  [Yes] [No] [Unsure]                        │
│                                             │
│  Step 3: Symbols (pick 1-3)                 │
│  [Chase] [Trapped] [Water] [Falling] [+]    │
│                                             │
│  Step 4: Voice note (optional, 15s max)     │
│  [🎤 Record]                                │
│                                             │
│  [Extract Pattern]                          │
└─────────────────────────────────────────────┘
```

### Screen: "Churn" (3 minutes fixed)

```
┌─────────────────────────────────────────────┐
│  Dump. Don't curate.                        │
│  ─────────────────────────────              │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │                                      │   │
│  │  [Full-screen text box]              │   │
│  │  No backspace indicator              │   │
│  │                                      │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Timer: 2:47                                │
│                                             │
│  [This will be burned]                      │
└─────────────────────────────────────────────┘
```

On finish: "Burned." → content disappears → only sentiment score retained

### Unlock Criteria for Phase 3
- Phase 2 journaling consistent (14 days)
- 3+ Shadow Dex entries integrated
- Stability maintained ≥ 70

### Pattern Card Examples
- "Chase/trapped symbols appear after conflict days."
- "Your Shadow Critic visits when HRV < 40ms."
- "Morning Churn correlates with 2x Green afternoons."

---

## Phase 3 — Fire (Manipura)

### Biological Architecture

| Attribute | Value |
|-----------|-------|
| **Chakra** | Manipura (Solar Plexus) |
| **Location** | Upper abdomen, diaphragm |
| **Endocrine** | Pancreas, Adrenal Cortex |
| **Function** | Agency, will, digestive fire (Agni), personal power |
| **Element** | Fire |

### Mood Coordinates
- **Yellow Zone:** Motivated, Inspired, Energized, Restless, Frustrated

### The Ritual: "The Bellows"
Rapid diaphragmatic breathing to move energy from gut to heart, followed by Focused Mission timer.

**Protocol:**
1. Bellows breath (90 seconds) — rapid diaphragmatic pumping
2. Breath hold (30 seconds)
3. Slow exhale with "Aim" visualization
4. Launch Deep Work timer (25 minutes)

### The Transmutation Equation

```
Raw Heat (Yellow) + Channeling Protocol + Focused Action = Ojas (Vitality)
```

**Without channeling, Yellow becomes:**
- Mania (racing, sleepless, inflated)
- Leak (scattered energy, no output)
- Crash (cortisol debt, Blue collapse)

**With channeling, Yellow becomes:**
- Sustained output
- Clean ethics
- Return to Green with surplus

### Yellow Audit (Critical Safety Gate)

When user enters Yellow quadrant AND sensors show resilient state:

```
┌─────────────────────────────────────────────┐
│  Yellow Audit                               │
│  ─────────────────────────────              │
│  Sensor check: HRV resilient ✓              │
│                                             │
│  1. Hours slept last night? [___]           │
│  2. Jaw tension now? [None/Some/High]       │
│  3. Can you drop to Green in 60 seconds?    │
│     [Yes] [No]                              │
│                                             │
│  [Continue to Forge] [Ground Instead]       │
└─────────────────────────────────────────────┘
```

**Audit Failure Criteria:**
- Sleep < 6 hours → Fail
- Jaw tension = High → Fail
- Cannot drop to Green → Fail

**On Failure:** Routes to Armor mode, not Forge

### Mode Preset Conditions

| Mode | Audit Condition | Practice | Duration |
|------|-----------------|----------|----------|
| **Forge** | HR elevated + HRV resilient + Yellow audit pass | Mission + Deep Work | 25:00 |
| **Armor** | HR elevated + HRV collapsing OR audit fail | Heavy Earth | 3:00 |
| **Bridge** | Low arousal + HRV stable | Coherence Breath | 5:00 |

### Skin: Ember / Crisp

```css
--bg-primary: #1c1c1c;
--bg-secondary: #2a2a2a;
--text-primary: #f5f5f5;
--text-secondary: #b8b8b8;
--accent: #d4a574;
--border: #404040;
--transition-speed: 250ms;
--font-weight-heading: 700;
```

### Mode Tools

| Tool | Availability | Description |
|------|--------------|-------------|
| Transmute Now | ◉ Available | Bellows + channeling |
| Mission | ◉ Available | Daily action prompts |
| Deep Work Timer | ◉ Available | 25-min focused sessions |
| Bellows (90s) | ◉ Available | Standalone breath protocol |
| Dream Capture | Always | — |
| Neti | 🔒 Phase 6 | — |

### Journal Entry Types
- `UrgeSurge` (user-initiated when feeling charge)
- `DeepWorkLog` (auto after timer)
- `MissionLog` (done/failed/skipped + reflection)
- `EnergyLeak` (quick note when scattered)

### Screen: "Transmute Now"

```
┌─────────────────────────────────────────────┐
│  Transmute                                  │
│  ─────────────────────────────              │
│                                             │
│  You have fire. Let's aim it.               │
│                                             │
│  Pre-check:                                 │
│  Sleep: 7h ✓                                │
│  Jaw: Relaxed ✓                             │
│  HRV: Resilient ✓                           │
│                                             │
│  [Start Bellows (90s)]                      │
│                                             │
│  Then: Deep Work (25:00)                    │
└─────────────────────────────────────────────┘
```

### Deep Work Session Flow

1. **Bellows** (90 seconds)
2. **Aim** (set intention in 1 line)
3. **Timer** (25 minutes, no interruptions)
4. **Log Output** (what did you produce?)
5. **Return to Green** (verification)

### Unlock Criteria for Phase 4
- 7 missions completed without failure
- Stability ≥ 75
- Demonstrated return to Green after Yellow

### Pattern Card Examples
- "Yellow used well: 3 Verified deep work sessions this week."
- "Energy leaks correlate with skipped missions."
- "Transmute → Deep Work = 2.3x output (average)."

---

## Phase 3 Extended: Mission Library

### Mission Taxonomy

**Five Pillars of Manipura Mastery:**

| Pillar | Sanskrit | Core Capacity | Shadow Risk |
|--------|----------|---------------|-------------|
| **Restraint** | Dama | Hold the impulse | Suppression / Explosion |
| **Truth** | Satya | Name the real thing | Aggression / Avoidance |
| **Service** | Seva | Contribute anonymously | Martyrdom / Ego-feeding |
| **Output** | Karma | Ship something complete | Perfectionism / Abandonment |
| **Recovery** | Vishranti | Return to Green | Bypassing / Collapse |

**Difficulty Tiers:**

| Tier | Name | Unlock Condition | Risk Level |
|------|------|------------------|------------|
| **T1** | Ember | Phase 3 entry | Low |
| **T2** | Flame | 7 T1 missions complete | Medium |
| **T3** | Forge | 14 T2 missions + Stability ≥ 80 | High |
| **T4** | Blaze | 21 T3 missions + Stability ≥ 85 | Very High |

---

### Pillar 1: RESTRAINT (Dama)
*The capacity to hold fire without acting on it.*

#### Tier 1 — Ember

| ID | Mission | Duration | Success Criteria |
|----|---------|----------|------------------|
| R1-01 | **The Pause** | Moment | Notice impulse to speak/act. Hold 3 breaths before proceeding. Log impulse type. |
| R1-02 | **First Bite** | 1 meal | Before eating, pause 10 seconds. Note hunger (1-10). Eat only if ≥ 6. |
| R1-03 | **Notification Delay** | 2 hours | When phone buzzes, wait 5 minutes before checking. Log imagined vs reality. |
| R1-04 | **Scroll Interrupt** | 1 session | When caught scrolling mindlessly, close app immediately. Log duration before catch. |
| R1-05 | **Unfinished Sentence** | 1 conversation | In heated moment, stop mid-sentence. Breathe. Complete only if still necessary. |

#### Tier 2 — Flame

| ID | Mission | Duration | Success Criteria |
|----|---------|----------|------------------|
| R2-01 | **The Draft** | 24 hours | Write emotional response. Save as draft. Revisit after 24h. Send only if aligned. |
| R2-02 | **Purchase Pause** | 48 hours | Before non-essential purchase, wait 48h. Log: still wanted? |
| R2-03 | **Opinion Withhold** | 1 meeting | Hold opinion unless directly asked. Log what you would have said. |
| R2-04 | **Advice Restraint** | 1 day | When someone shares problem, ask questions only. Zero advice. Log urge count. |
| R2-05 | **Craving Observation** | 1 week | When craving arises (food/scroll/substance), observe for 90 seconds without acting. |

#### Tier 3 — Forge

| ID | Mission | Duration | Success Criteria |
|----|---------|----------|------------------|
| R3-01 | **The Full Day** | 24 hours | No impulsive speech. Every statement is considered. Log breaches. |
| R3-02 | **Desire Fast** | 3 days | Abstain from one habitual pleasure. Observe what arises. |
| R3-03 | **Conflict Hold** | 1 conflict | When triggered in disagreement, say "I need to think" and respond next day. |

---

### Pillar 2: TRUTH (Satya)
*The capacity to name reality without aggression.*

#### Tier 1 — Ember

| ID | Mission | Duration | Success Criteria |
|----|---------|----------|------------------|
| T1-01 | **The Real Answer** | 1 conversation | When asked "How are you?" — answer truthfully in one sentence. |
| T1-02 | **Name the Feeling** | 1 day | Each time you feel something strong, name it aloud (to yourself). Log 5 instances. |
| T1-03 | **Stop the Spin** | 1 instance | Catch yourself exaggerating or dramatizing. Correct to plain facts. |
| T1-04 | **Ask for What You Want** | 1 instance | Make one direct request without softening or hinting. Log the request. |
| T1-05 | **Admit Confusion** | 1 instance | Say "I don't understand" instead of pretending. |

#### Tier 2 — Flame

| ID | Mission | Duration | Success Criteria |
|----|---------|----------|------------------|
| T2-01 | **The Difficult Truth** | 1 conversation | Share something true that you've been avoiding. Without blame. |
| T2-02 | **No Complaining** | 1 day | Zero complaints. Convert each complaint into either acceptance or action request. |
| T2-03 | **Give Real Feedback** | 1 instance | Offer honest feedback to someone when asked. Be kind but complete. |
| T2-04 | **Retract a Lie** | 1 instance | Correct a previous exaggeration or false impression you've left. |
| T2-05 | **Say No** | 1 instance | Decline something you don't want to do. No false excuse. Just "No, thank you." |

#### Tier 3 — Forge

| ID | Mission | Duration | Success Criteria |
|----|---------|----------|------------------|
| T3-01 | **Truth Day** | 24 hours | No lies, exaggerations, or performative statements. Log every temptation. |
| T3-02 | **Repair Conversation** | 1 relationship | Have a conversation to repair a rift. Take responsibility for your part only. |
| T3-03 | **Public Admission** | 1 instance | Acknowledge a mistake or limitation in a group setting. |

---

### Pillar 3: SERVICE (Seva)
*The capacity to contribute without ego-feeding.*

#### Tier 1 — Ember

| ID | Mission | Duration | Success Criteria |
|----|---------|----------|------------------|
| S1-01 | **Silent Help** | 1 instance | Help someone without them knowing. Do not mention it to anyone. |
| S1-02 | **Hold the Door** | 1 day | Look for 3 opportunities to make someone's moment easier. No acknowledgment needed. |
| S1-03 | **Listen Fully** | 1 conversation | Give complete attention. No planning your response. No advice. Just presence. |
| S1-04 | **Compliment Genuinely** | 1 instance | Offer specific, true praise to someone. About something real, not appearance. |
| S1-05 | **Clean Quietly** | 1 instance | Clean or organize a shared space without announcing or being asked. |

#### Tier 2 — Flame

| ID | Mission | Duration | Success Criteria |
|----|---------|----------|------------------|
| S2-01 | **Anonymous Gift** | 1 instance | Give something valuable (time, money, object) with no attribution. |
| S2-02 | **Take the Blame** | 1 instance | Accept responsibility for something that wasn't entirely your fault. No martyrdom narrative. |
| S2-03 | **Mentor Moment** | 1 hour | Share a skill or knowledge with someone who needs it. Expect nothing. |
| S2-04 | **Invisible Labor** | 1 week | Take on an unpleasant recurring task. Tell no one. |
| S2-05 | **Generous Interpretation** | 1 day | Every time someone frustrates you, construct the most charitable explanation. |

#### Tier 3 — Forge

| ID | Mission | Duration | Success Criteria |
|----|---------|----------|------------------|
| S3-01 | **Service Day** | 8 hours | Spend a full day in service. No documentation for social proof. |
| S3-02 | **Let Them Win** | 1 instance | In a disagreement where you're right, let the other person have the win. |
| S3-03 | **Long-term Commitment** | 30 days | Commit to recurring service (weekly). Complete without fanfare. |

---

### Pillar 4: OUTPUT (Karma)
*The capacity to complete work and ship.*

#### Tier 1 — Ember

| ID | Mission | Duration | Success Criteria |
|----|---------|----------|------------------|
| O1-01 | **One Task Done** | 1 hour | Complete one task fully. No switching until done. Log task and time. |
| O1-02 | **Clear the Smallest** | 30 min | Identify smallest pending task. Complete it now. |
| O1-03 | **Finish Before New** | 1 day | Complete one work-in-progress before starting anything new. |
| O1-04 | **Ship Imperfect** | 1 instance | Send/publish/deliver something before it's "ready." |
| O1-05 | **Time Block** | 2 hours | Protect 2 hours for one project. No interruptions. Log output. |

#### Tier 2 — Flame

| ID | Mission | Duration | Success Criteria |
|----|---------|----------|------------------|
| O2-01 | **Deep Work Block** | 4 hours | 4 uninterrupted hours on one project. Document output. |
| O2-02 | **Weekly Ship** | 7 days | Complete and ship one meaningful piece of work this week. |
| O2-03 | **Inbox Zero** | 1 session | Process all pending messages/tasks to zero. |
| O2-04 | **Kill the Zombie** | 1 instance | Identify one project you'll never finish. Formally abandon it. |
| O2-05 | **Deadline Kept** | 1 commitment | Set a deadline. Meet it exactly. No extensions. |

#### Tier 3 — Forge

| ID | Mission | Duration | Success Criteria |
|----|---------|----------|------------------|
| O3-01 | **The Project** | 30 days | Complete a multi-week project from start to finish. Document completion. |
| O3-02 | **Public Commitment** | 1 instance | Announce a deliverable with a date. Meet it publicly. |
| O3-03 | **Legacy Artifact** | 90 days | Create something that will outlast this quarter. Ship it. |

---

### Pillar 5: RECOVERY (Vishranti)
*The capacity to return to Green after intensity.*

#### Tier 1 — Ember

| ID | Mission | Duration | Success Criteria |
|----|---------|----------|------------------|
| V1-01 | **Conscious Cool-Down** | Post-work | After intense work, take 10 minutes for deliberate transition. Log mood shift. |
| V1-02 | **Sleep Priority** | 1 night | Protect 8 hours of sleep opportunity. No screens 1 hour before. |
| V1-03 | **Movement Reset** | 20 minutes | After mental intensity, move body for 20 minutes. Log pre/post mood. |
| V1-04 | **Nature Contact** | 30 minutes | Spend 30 minutes in natural environment. No phone. |
| V1-05 | **Slow Meal** | 1 meal | Eat one meal slowly, no screens, no reading. Just food and sensation. |

#### Tier 2 — Flame

| ID | Mission | Duration | Success Criteria |
|----|---------|----------|------------------|
| V2-01 | **Recovery Day** | 1 day | No productive work. Only rest, play, connection. Log resistance. |
| V2-02 | **Digital Sunset** | 3 days | No screens after 8pm. Log what emerges. |
| V2-03 | **Boredom Practice** | 1 hour | Sit with nothing. No stimulation. Observe. |
| V2-04 | **Sleep Surplus** | 1 week | Sleep 30+ minutes more than usual each night. Track effects. |
| V2-05 | **Pleasure Without Guilt** | 1 instance | Do something purely enjoyable. No justification. No productivity angle. |

#### Tier 3 — Forge

| ID | Mission | Duration | Success Criteria |
|----|---------|----------|------------------|
| V3-01 | **Rest Week** | 7 days | Operate at 50% intensity. Trust that it's necessary. Log productivity fear. |
| V3-02 | **Technology Sabbath** | 24 hours | No devices. No internet. For 24 hours. |
| V3-03 | **The Integration** | 3 days | After major output, take 3 full days before next project. |

---

### Mission Engine Logic

**Mission Selection Algorithm:**

```
1. Check current stability band
2. Filter to unlocked tiers
3. Weight by:
   - Pillar balance (favor underrepresented)
   - Recent failures (reduce difficulty after consecutive fails)
   - Time of day (no Output missions at night)
   - Current mode (Armor = only Recovery; Forge = favor Output)
4. Present 1 primary + 2 alternatives
5. User selects or requests different
```

**Mission Completion Flow:**

```
┌─────────────────────────────────────────────┐
│  Mission: The Pause (R1-01)                 │
│  ─────────────────────────────              │
│                                             │
│  Notice an impulse to speak/act.            │
│  Hold for 3 breaths before proceeding.      │
│  Log the impulse type.                      │
│                                             │
│  [Done] [Failed] [Skipped]                  │
└─────────────────────────────────────────────┘
```

**On "Done":**
```
┌─────────────────────────────────────────────┐
│  What was the impulse?                      │
│  ○ To speak   ○ To react                    │
│  ○ To check   ○ To consume                  │
│  ○ Other: [___]                             │
│                                             │
│  Mood now: [MoodPlot mini]                  │
│                                             │
│  [Complete]                                 │
│                                             │
│  Ojas +5                                    │
└─────────────────────────────────────────────┘
```

**On "Failed":**
```
┌─────────────────────────────────────────────┐
│  Where did you lose center?                 │
│  ○ Forgot   ○ Overwhelmed                   │
│  ○ Chose not to   ○ External pressure       │
│                                             │
│  Next time I will: [___]                    │
│                                             │
│  [Save — no penalty]                        │
└─────────────────────────────────────────────┘
```

**Integrity Map (Weekly Review):**
```
┌─────────────────────────────────────────────┐
│  This Week                                  │
│  ─────────────────────────────              │
│                                             │
│  Done: ████████░░ 8                         │
│  Failed: ██░░░░░░░░ 2                       │
│  Skipped: █░░░░░░░░░ 1                      │
│                                             │
│  Strongest: Service (5/5)                   │
│  Weakest: Restraint (1/3)                   │
│                                             │
│  Insight: "Restraint missions fail after    │
│  low-sleep nights."                         │
└─────────────────────────────────────────────┘
```

---

## Phase 4 — Resonance (Anahata)

### Biological Architecture

| Attribute | Value |
|-----------|-------|
| **Chakra** | Anahata (Heart) |
| **Location** | Heart center, chest |
| **Endocrine** | Thymus |
| **Function** | Coherence, connection, compassion, bridge between lower and upper |
| **Element** | Air |

### Mood Coordinates
- **Green Zone (sustained):** Grateful, Appreciative, Loving, Content, Connected

### The Ritual: "HRV Bridge"
Guided humming (Vagus nerve stimulation) to synchronize Heart Rate Variability with self, partner, or field.

**Protocol:**
1. Slow breath (4-7-8 pattern) — 2 minutes
2. Humming on exhale — 3 minutes
3. Silent heart focus — 2 minutes
4. If Dyad: Sync breathing with partner — 5 minutes

### Mode Preset Conditions

| Mode | Audit Condition | Practice | Duration |
|------|-----------------|----------|----------|
| **Bridge** | Low arousal + HRV stable + breath coherent | Coherence (Solo) | 5:00 |
| **Bridge + Dyad** | Bridge conditions + partner also stable | Resonant Sync | 10:00 |
| **Forge** | Productive heat signature | Mission | 25:00 |

### Skin: Warm / Coherent

```css
--bg-primary: #1a1412;
--bg-secondary: #2d2420;
--text-primary: #f0e6e0;
--text-secondary: #c4a898;
--accent: #c9a87c;
--border: #4a3f38;
--transition-speed: 300ms;
--font-weight-heading: 600;
```

### Mode Tools

| Tool | Availability | Description |
|------|--------------|-------------|
| Humming / Drone | ◉ Available | Vagus nerve stimulation |
| Mala Breath | ◉ Available | Counted breath cycles |
| Dyad Sync | ◉ Available* | *If partner stable |
| Mission | Always | — |
| Neti | 🔒 Phase 6 | — |

### Dyad System (Symbiont Layer)

**Eligibility:**
- Both partners at Phase 4+
- Both in Green or Yellow quadrant
- Both Stability ≥ 75

**Dyad Session Flow:**
1. Both partners open app
2. System checks eligibility (bands, not raw scores)
3. Synced timer starts
4. Shared visual: two orbs approaching alignment
5. Post-session: Each logs field quality word
6. App computes Sync Score (aggregates only, no raw data shared)

**Screen: "Dyad Available"**
```
┌─────────────────────────────────────────────┐
│  Dyad Available                             │
│  ─────────────────────────────              │
│  Partner: [Name]                            │
│  Status: Stable ●●●○○                       │
│  Audit: Both Verified                       │
│                                             │
│  [Start Resonant Sync]                      │
└─────────────────────────────────────────────┘
```

**Safety: Union Lock**
If either partner drops below threshold → Dyad tab locks with compassionate banner: "Dyad paused. [Partner] is stabilizing. Support them from a distance."

### Journal Entry Types
- `DyadSession` (synced timer, joint stability only)
- `SupportProtocol` (when partner unstable)
- `CoherenceLog` (solo HRV session)

### Unlock Criteria for Phase 5
- 5 Dyad sessions with Sync ≥ 75
- Stability ≥ 80
- Consistent Green baseline

### Pattern Card Examples
- "Sync scores highest after solo coherence prep."
- "Post-humming, return to Green is 40% faster."
- "Dyad quality drops when either partner is under-slept."

---

## Phase 5 — Expression (Vishuddha)

### Biological Architecture

| Attribute | Value |
|-----------|-------|
| **Chakra** | Vishuddha (Throat) |
| **Location** | Throat, neck, jaw |
| **Endocrine** | Thyroid |
| **Function** | Truth-signal, communication, creative expression |
| **Element** | Ether/Space |

### Mood Coordinates
- **Green→Yellow:** Confident, Clear, Expressive, Authentic

### The Ritual: "The Silence Seal"
4-hour offline quest with zero impulsive speech, logging only "Essential Truths" after.

**Protocol:**
1. Set seal duration (4 hours standard)
2. Commit to rules (no speech except emergency)
3. Observe impulses to speak
4. Break only if genuine emergency
5. Post-seal: log Essential Truths discovered

### Mode Preset Conditions

| Mode | Audit Condition | Practice | Duration |
|------|-----------------|----------|----------|
| **Signal** | Stable + low arousal | Silence Seal | 4:00:00 |
| **Bridge** | Heart coherence window | Coherence | 5:00 |
| **Forge** | Productive heat for expression | Essential Truth | 15:00 |

### Skin: Signal / Clean

```css
--bg-primary: #fafafa;
--bg-secondary: #ffffff;
--text-primary: #1a1a1a;
--text-secondary: #6b6b6b;
--accent: #4a90a4;
--border: #e0e0e0;
--transition-speed: 200ms;
--font-weight-heading: 500;
```

### Mode Tools

| Tool | Availability | Description |
|------|--------------|-------------|
| Silence Seal | ◉ Available | Multi-hour speech fast |
| Essential Truths Log | ◉ Available | Post-seal insights |
| Voice Biofeedback | ◉ Available | Pitch/tone awareness |
| Neti | 🔒 Phase 6 | — |

### Screen: "Silence Seal"
```
┌─────────────────────────────────────────────┐
│  Silence Seal                               │
│  ─────────────────────────────              │
│  Duration: 4 hours                          │
│  Rules: No speech. Emergency break only.    │
│  Audit: Verified ✓✓                         │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │          BEGIN SEAL                 │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [Emergency Break] (always visible)         │
└─────────────────────────────────────────────┘
```

### Journal Entry Types
- `SilenceSeal` (start/end times, breaks, insights)
- `EssentialTruth` (max 3 per seal, short statements)
- `SpeechUrge` (logged during seal, pattern analysis)

### Unlock Criteria for Phase 6
- 3 complete Silence Seals (no emergency breaks)
- Stability ≥ 85
- Clean expression pattern (no aggression flags)

### Pattern Card Examples
- "Most impulsive speech urges appear after conflict."
- "Silence Seals correlate with cleaner meetings next day."
- "Your clearest Essential Truths come after 2+ hours."

---

## Phase 6 — Vision (Ajna)

### Biological Architecture

| Attribute | Value |
|-----------|-------|
| **Chakra** | Ajna (Third Eye) |
| **Location** | Between eyebrows, center of head |
| **Endocrine** | Pituitary |
| **Function** | Witness consciousness, insight, intuition |
| **Element** | Light |

### Mood Coordinates
- **Deep Green:** Tranquil, Serene, Balanced, Clear, Spacious

### The Ritual: "The Slicing Game" (Neti Protocol)
Visualizing identity labels and "slicing" them until only the witness (Bindu) remains.

**Protocol:**
1. Settle into stillness (2 minutes)
2. Notice a thought/identity ("I am...")
3. "Slice" — ask "Who is aware of this?"
4. Count uncouplings (not minutes)
5. Mandatory re-entry (60 seconds)
6. Dissociation check

### Mode Preset Conditions

| Mode | Audit Condition | Practice | Duration |
|------|-----------------|----------|----------|
| **Void** | Stability ≥ 85 + calm physiology + Green proxy | Neti (Slicing) | 5-7:00 |
| **Bridge** | Coherence window, prepare before void | Coherence | 5:00 |
| **Armor** | Drift detected or instability | Heavy Earth | 3:00 |

### Skin: Void / Spacious

```css
--bg-primary: #000000;
--bg-secondary: #0a0a0a;
--text-primary: #ffffff;
--text-secondary: #666666;
--accent: #ffffff;
--border: #1a1a1a;
--transition-speed: 500ms;
--font-weight-heading: 400;
```

### Mode Tools

| Tool | Availability | Description |
|------|--------------|-------------|
| Neti (Slicing) | ◉ Available | Ego-dissolution practice |
| Identity Sort | ◉ Available | Categorize "I" thoughts |
| Re-Entry Protocol | Always (auto) | Grounding after Neti |
| Serpent | 🔒 Phase 7 | — |

### Neti Session Flow

**Screen: "Neti: Void Work"**
```
┌─────────────────────────────────────────────┐
│  Neti: Void Work                            │
│  ─────────────────────────────              │
│  Audit: Verified ✓✓                         │
│                                             │
│  This session dissolves identification.     │
│  Re-entry is mandatory.                     │
│                                             │
│  [Begin Slicing]                            │
│                                             │
│  ⚠️ Mandatory re-entry follows              │
└─────────────────────────────────────────────┘
```

**During Session:**
- Minimal UI (dark void)
- Center circle
- Counter: "Uncouplings" (not time)
- No gamification

**Re-Entry Protocol (Forced, 60 seconds):**
```
┌─────────────────────────────────────────────┐
│  Re-Entry Protocol                          │
│  ─────────────────────────────              │
│  □ Feel feet on floor                       │
│  □ Name 3 red objects                       │
│  □ Squeeze hands (10 seconds)               │
│                                             │
│  Sensor validation: Checking grounding...   │
│                                             │
│  [Complete Re-Entry]                        │
└─────────────────────────────────────────────┘
```

**Dissociation Check (Post Re-entry):**
```
┌─────────────────────────────────────────────┐
│  Quick Check                                │
│  ─────────────────────────────              │
│  1. Do you feel present in your body? [Y/N] │
│  2. Does time feel normal? [Y/N]            │
│  3. Do surroundings feel real? [Y/N]        │
│                                             │
│  [Submit]                                   │
└─────────────────────────────────────────────┘
```

**If Flagged (any "No"):**
- Neti locks for 72 hours
- Forces Phase 1 journaling only
- Banner: "Neti paused. Return to embodiment."

### Journal Entry Types
- `NetiSession` (uncoupling count, re-entry status, check result)
- `IdentitySortRound` (categories of "I" observed)
- `ReEntryComplete` (forced after each session)

### Success Condition
- Uncoupling events increasing
- Dissociation markers NOT increasing

### Unlock Criteria for Phase 7
- 10 Neti sessions with clean re-entry
- Stability ≥ 90 for 30 consecutive days
- No dissociation flags
- Weaver complete
- Mirror stable (no nightmare spiral)

### Pattern Card Examples
- "Uncoupling events increasing. Dissociation markers stable."
- "Neti sessions most effective after morning coherence."
- "Identity-attachment correlates with chest tension."

---

## Phase 7 — Union (Sahasrara / Serpent)

### Biological Architecture

| Attribute | Value |
|-----------|-------|
| **Chakra** | Sahasrara (Crown) |
| **Location** | Crown of head |
| **Endocrine** | Pineal |
| **Function** | Integration, union, natural ecstasy |
| **Element** | Consciousness |

### Mood Coordinates
- **Yellow (controlled):** Ecstatic, Blissful, At One, Unified

### The Ritual: "Sushumna Rise"
Advanced Cobra Breath to circulate energy through the central channel (Sushumna), with strict kill-switch protection.

**Protocol:**
1. Master Lock verification (biometric)
2. Begin breath cycle
3. Monitor for voltage spikes
4. Kill-switch if thresholds exceeded
5. Forced downshift after session

### Mode Preset Conditions

| Mode | Audit Condition | Practice | Duration |
|------|-----------------|----------|----------|
| **Conductor** | HV-eligible + all risk markers clear | Sushumna Rise | 6-12:00 |
| **Void** | Stable but not HV-ready | Neti | 7:00 |
| **Armor** | Spike detected | Emergency Vent | 3:00 |

### Skin: Austere / Reverent

```css
--bg-primary: #fefefe;
--bg-secondary: #f8f8f8;
--text-primary: #0a0a0a;
--text-secondary: #4a4a4a;
--accent: #1a1a1a;
--border: #d0d0d0;
--transition-speed: 600ms;
--font-weight-heading: 300;
```

### Mode Tools

| Tool | Availability | Description |
|------|--------------|-------------|
| Sushumna Rise | ◉ Available* | *If all audits pass |
| Spinal Heat Map | ◉ Available | Locate node overload |
| Emergency Vent | Always | Discharge protocol |
| Ecstatic Window | ◉ Available* | *1x/day max |
| Dharma Map | ◉ Available | Values → service |

### Master Lock Gate

```
┌─────────────────────────────────────────────┐
│  Serpent Access                             │
│  ─────────────────────────────              │
│  Requirements:                              │
│  ✓ Stability ≥ 90 for 30 days              │
│  ✓ Weaver complete                          │
│  ✓ Mirror stable (no nightmare spiral)      │
│  ✓ Neti clean (no dissociation flags)       │
│  ✓ Current Audit: HV-eligible              │
│                                             │
│  [FaceID/Biometric to Proceed]              │
└─────────────────────────────────────────────┘
```

### Serpent Session Screen

```
┌─────────────────────────────────────────────┐
│                                             │
│  Audit: Verified • HR: 72 • HRV: High       │
│                                             │
│                    │                        │
│                    │  ← Spine visual        │
│                    │                        │
│                    ●  ← Active node         │
│                    │                        │
│                    │                        │
│                                             │
│  Status: Steady                             │
│                                             │
│  [STOP]                    [SURGE 🛡️]       │
└─────────────────────────────────────────────┘
```

### Spinal Heat Map

```
┌─────────────────────────────────────────────┐
│  Spinal Report                              │
│  ─────────────────────────────              │
│                                             │
│  ○ Crown      [_________]                   │
│  ○ Third Eye  [███░░░░░░] Pressure          │
│  ○ Throat     [_________]                   │
│  ○ Heart      [██░░░░░░░] Warmth            │
│  ○ Solar      [████░░░░░] Heat              │
│  ○ Sacral     [_________]                   │
│  ○ Root       [_________]                   │
│                                             │
│  Pattern: Head pressure + cold feet         │
│  Rx: Vent downward                          │
│                                             │
│  [Start Protocol]                           │
└─────────────────────────────────────────────┘
```

### Kill-Switch (Automated)

**Trigger:** HR spike > 130 BPM while body is still

```
┌─────────────────────────────────────────────┐
│                                             │
│  ⚠️ VOLTAGE SPIKE DETECTED                  │
│                                             │
│  HR: 142 BPM • Movement: Still              │
│                                             │
│  Navigation locked.                         │
│  Follow the breath circle.                  │
│                                             │
│         ○ ← Pacing circle (60s)            │
│                                             │
│  [Audio: 40Hz binaural grounding]           │
│                                             │
└─────────────────────────────────────────────┘
```

**Post Kill-Switch:**
- 7-day Serpent lock (cooldown tax)
- Banner displayed
- Forced Phase 1 behavior

### Ecstatic Window Rules
- 6-12 minutes maximum
- Must end with forced downshift
- Cannot repeat same day (anti-chasing)
- Only available when ALL audits pass
- Sensor-verified completion required

### Dharma Map (Self-Actualization Layer)

```
┌─────────────────────────────────────────────┐
│  Weekly Dharma                              │
│  ─────────────────────────────              │
│                                             │
│  Values (top 3):                            │
│  [Truth] [Service] [Creation]               │
│                                             │
│  Commitments:                               │
│  □ Mentor session (Wednesday)               │
│  □ Anonymous donation                       │
│  □ Complete manuscript chapter              │
│                                             │
│  Service logged: 3 acts                     │
│                                             │
│  [Update Commitments]                       │
└─────────────────────────────────────────────┘
```

### Journal Entry Types
- `SerpentReport` (spine node, sensation, intensity, safety outcome)
- `SurgeEvent` (emergency vent triggered)
- `CooldownTax` (lock state record)
- `DharmaEntry` (value, commitment, service action)
- `GraduationChoice` (when ready to reduce app dependency)

### Pattern Card Examples
- "Head pressure correlates with cold feet. Vent downward."
- "Stable ecstatic windows: 2 this week (both Verified)."
- "Identity knots appear in Shadow logs before voltage resistance."

### Graduation (Self-Actualization Complete)

**Indicators:**
- Usage naturally decreasing
- Stability maintained without prompts
- Service output increasing
- Clean relationships

**Graduation Screen:**
```
┌─────────────────────────────────────────────┐
│  Graduation                                 │
│  ─────────────────────────────              │
│                                             │
│  The operating system moves from the        │
│  phone to your nervous system.              │
│                                             │
│  Options:                                   │
│                                             │
│  [Maintenance Mode]                         │
│  Reduced UI, no prompts                     │
│                                             │
│  [Leave Sadhana]                            │
│  Export scores, delete option               │
│                                             │
└─────────────────────────────────────────────┘
```

**The best user "churns" because they don't need you.**

---

# PART V: JOURNAL OS

---

## 5.1 Journal Architecture

### Three Modes (same tab, different depth)

| Mode | Duration | Purpose |
|------|----------|---------|
| **Log** | 10-30s | Mood plot + body pin + one line |
| **Reflect** | 60-180s | Guided prompts (phase-specific) |
| **Review** | Variable | Timeline + pattern cards |

### Entry Types by Phase

| Phase | Entry Types |
|-------|-------------|
| 0 | `OathEntry`, `BaselineCheckIn`, `GroundingContract` |
| 1 | `DailyCheckIn`, `OverwhelmSpike`, `SealDay`, `FallProtocol` |
| 2 | `DreamLog`, `ComplexCapture`, `Churn`, `NightmareGateEvent` |
| 3 | `UrgeSurge`, `DeepWorkLog`, `MissionLog`, `EnergyLeak` |
| 4 | `DyadSession`, `SupportProtocol`, `CoherenceLog` |
| 5 | `SilenceSeal`, `EssentialTruth`, `SpeechUrge` |
| 6 | `NetiSession`, `IdentitySortRound`, `ReEntryComplete` |
| 7 | `SerpentReport`, `SurgeEvent`, `DharmaEntry`, `GraduationChoice` |

---

## 5.2 Core Journal Components

### MoodPlotGrid

```
┌─────────────────────────────────────────────┐
│                    High Energy              │
│           RED              YELLOW           │
│   ┌───────────────────────────────────┐    │
│   │                 │                  │    │
│ U │                 │                  │ P  │
│ n │        ●        │                  │ l  │
│ p │                 │                  │ e  │
│ l │─────────────────┼─────────────────│ a  │
│ e │                 │                  │ s  │
│ a │                 │                  │ a  │
│ s │                 │                  │ n  │
│ a │                 │                  │ t  │
│ n │                 │                  │    │
│ t │   BLUE          │          GREEN   │    │
│   └───────────────────────────────────┘    │
│                    Low Energy               │
└─────────────────────────────────────────────┘
```

**Interactions:**
- Tap anywhere to place dot
- Optional drag to refine
- After placement → word picker appears (8-16 words, quadrant-filtered)
- "Why?" prompt hidden until Stability ≥ 60

**Micro-delight:**
- Dot "settles" with easing animation
- Haptic: quadrant-specific (heavy thud Red, soft drop Blue, light tick Green, rising buzz Yellow)

### SomaticPinMap

```
┌─────────────────────────────────────────────┐
│           ○ Head                            │
│                                             │
│     ○     ○ Throat    ○                    │
│   L Arm   ○ Chest    R Arm                 │
│           ○ Solar                           │
│           ○ Belly                           │
│           ○ Pelvis                          │
│                                             │
│        ○ L Leg  ○ R Leg                    │
│                                             │
│  "Where is it living right now?"            │
└─────────────────────────────────────────────┘
```

**Zones (10-14 tappable):**
- Head, Throat, Chest, Solar Plexus, Belly, Pelvis
- Left/Right Arms, Left/Right Legs
- Jaw, Upper Back, Lower Back

**Micro-delight:**
- On tap: pressure ripple radiates from zone

### TimeboxTimer

**Component:** `Timebox`

- Always shows remaining time
- When expired: auto-saves + "Close & Ground" CTA
- Extend option only if Stability ≥ threshold AND quadrant not Red/Blue

### EntryCard

```
┌─────────────────────────────────────────────┐
│  Dream Log                    ✓✓ Verified   │
│  Dec 22, 7:23 AM • 45s                      │
│  ─────────────────────────────              │
│  🟡 Chest • "chase, water, falling"         │
│                                             │
│  [Expand] [Extract Pattern]                 │
└─────────────────────────────────────────────┘
```

**Fields:**
- Timestamp
- Entry type tag
- Quadrant color strip
- Completion tier badge
- One-line summary
- Actions: Expand, Extract Pattern, Archive/Delete

---

## 5.3 Data Model

**Local Encrypted Store (on-device):**

```
CheckIn {
  id, timestamp, 
  mood_x, mood_y, quadrant,
  word, somatic_zone, note,
  completion_tier
}

PracticeSession {
  id, timestamp,
  module, duration,
  pre_mood, post_mood,
  completion_tier, shift_detected
}

DreamLog {
  id, timestamp,
  mood, lucidity_flag,
  symbols[], audio_url,
  pattern_extracted
}

ComplexCapture {
  id, timestamp,
  name, somatic_zone,
  trigger_context, intensity,
  expiry_timestamp, integrated
}

Mission {
  id, timestamp,
  pillar, tier, mission_id,
  status (done/failed/skipped),
  reflection
}

NetiSession {
  id, timestamp,
  uncoupling_count,
  reentry_complete,
  dissociation_check_result
}

SerpentReport {
  id, timestamp,
  spine_node, sensation_type,
  intensity, safety_outcome,
  killswitch_triggered
}
```

**Cloud Sync (optional, aggregates only):**
- Stability Score history
- Completion tier percentages
- Phase progression
- NO raw text, NO audio

---

## 5.4 Anti-Rumination Rules

- **Churn text:** Provably discarded (only sentiment score retained)
- **Reflect mode:** If user writes > X chars → prompt "compress to one line"
- **Timebox:** Hard limits on each entry type
- **No infinite scroll:** Review shows limited cards, pattern summary only

---

# PART VI: PHASE SKINS

---

## 6.1 Token System

All phases use identical layout. Skins change tokens only.

| Token | Description |
|-------|-------------|
| `--bg-primary` | Main background |
| `--bg-secondary` | Card backgrounds |
| `--text-primary` | Main text |
| `--text-secondary` | Muted text |
| `--accent` | CTA buttons, highlights |
| `--border` | Card borders |
| `--transition-speed` | Animation timing |
| `--font-weight-heading` | Header weight |

---

## 6.2 Phase Token Sets

### Phase 1: Earth / Heavy
```css
--bg-primary: #1a1a1a;
--bg-secondary: #2d2d2d;
--text-primary: #e8e8e8;
--text-secondary: #8a8a8a;
--accent: #8b5a2b;
--border: #3d3d3d;
--transition-speed: 400ms;
--font-weight-heading: 700;
```

### Phase 2: Water / Reflective
```css
--bg-primary: #0d1b2a;
--bg-secondary: #1b263b;
--text-primary: #e0e1dd;
--text-secondary: #778da9;
--accent: #415a77;
--border: #2d4a6a;
--transition-speed: 350ms;
--font-weight-heading: 600;
```

### Phase 3: Ember / Crisp
```css
--bg-primary: #1c1c1c;
--bg-secondary: #2a2a2a;
--text-primary: #f5f5f5;
--text-secondary: #b8b8b8;
--accent: #d4a574;
--border: #404040;
--transition-speed: 250ms;
--font-weight-heading: 700;
```

### Phase 4: Warm / Coherent
```css
--bg-primary: #1a1412;
--bg-secondary: #2d2420;
--text-primary: #f0e6e0;
--text-secondary: #c4a898;
--accent: #c9a87c;
--border: #4a3f38;
--transition-speed: 300ms;
--font-weight-heading: 600;
```

### Phase 5: Signal / Clean
```css
--bg-primary: #fafafa;
--bg-secondary: #ffffff;
--text-primary: #1a1a1a;
--text-secondary: #6b6b6b;
--accent: #4a90a4;
--border: #e0e0e0;
--transition-speed: 200ms;
--font-weight-heading: 500;
```

### Phase 6: Void / Spacious
```css
--bg-primary: #000000;
--bg-secondary: #0a0a0a;
--text-primary: #ffffff;
--text-secondary: #666666;
--accent: #ffffff;
--border: #1a1a1a;
--transition-speed: 500ms;
--font-weight-heading: 400;
```

### Phase 7: Austere / Reverent
```css
--bg-primary: #fefefe;
--bg-secondary: #f8f8f8;
--text-primary: #0a0a0a;
--text-secondary: #4a4a4a;
--accent: #1a1a1a;
--border: #d0d0d0;
--transition-speed: 600ms;
--font-weight-heading: 300;
```

---

# PART VII: COMPONENT INVENTORY

---

## 7.1 Global Components

| ID | Component | States |
|----|-----------|--------|
| G-01 | `BottomNav` | Default, Active item, Locked item |
| G-02 | `SafetyBanner` | Kavacha, Nightmare, Neti, Serpent, Union, Sleep |
| G-03 | `ModeHeader` | All phases × all modes × all bands × confidence |
| G-04 | `StateStrip` | Default, Stale, Empty, Drift states |
| G-05 | `EmergencyFooter` | Default, Pressed |

## 7.2 Home Components

| ID | Component | States |
|----|-----------|--------|
| H-01 | `PrimaryActionCard` | Default, Loading, Disabled, With audit |
| H-02 | `QuickJournalCard` | Empty, Partial, Complete |
| H-03 | `ModeToolsGrid` | 2-card, 3-card layout |
| H-04 | `ToolCard` | Available, Locked (phase), Locked (state), Cooldown |
| H-05 | `PatternCard` | Default |
| H-06 | `LadderCard` | All phases |

## 7.3 Closed-Loop Components

| ID | Component | States |
|----|-----------|--------|
| CL-01 | `SensorSnapshot` | Loading, Complete, Failed |
| CL-02 | `AuditStrip` | All available, Partial, Unavailable |
| CL-03 | `AuditTile` | Value, Stale, Unavailable |
| CL-04 | `DriftBadge` | Aligned, Drift, Unknown |
| CL-05 | `ModeChip` | All 8 modes × 3 confidence |
| CL-06 | `ConfidenceIndicator` | Verified, Mixed, Self-report |

## 7.4 Safety Components

| ID | Component | States |
|----|-----------|--------|
| S-01 | `SoftAuditSheet` | With DualDot |
| S-02 | `ProceedFriction` | Breath circle + confirm |
| S-03 | `YellowAudit` | Questions, Pass, Fail |
| S-04 | `DissociationCheck` | Questions, Clear, Flagged |
| S-05 | `KillSwitchOverlay` | Active (with HR readout) |
| S-06 | `CooldownTimer` | 72h, 7d variants |

## 7.5 Hardware Screens

| ID | Component | Purpose |
|----|-----------|---------|
| HW-01 | `ConnectSensors` | Onboarding permission |
| HW-02 | `SignalQuality` | Per-sensor status |
| HW-03 | `AuditUnavailable` | Stale/noisy data explanation |
| HW-04 | `AuditDetail` | 30-min summary modal |

## 7.6 Journal Components

| ID | Component | States |
|----|-----------|--------|
| J-01 | `MoodPlotGrid` | Empty, Placed, With word |
| J-02 | `SomaticPinMap` | Empty, Zone selected |
| J-03 | `WordChips` | Red, Blue, Green, Yellow sets |
| J-04 | `EntryCard` | All types + completion badge |
| J-05 | `TimeboxTimer` | Running, Expired, Extended |
| J-06 | `DualDot` | Aligned, Drifted |
| J-07 | `CompletionBadge` | Verified, Supported, Self-report |

## 7.7 Phase-Specific Components

| ID | Component | Phase |
|----|-----------|-------|
| P2-01 | `DreamCaptureFlow` | 2 |
| P2-02 | `ShadowDexCapture` | 2 |
| P2-03 | `ChurnScreen` | 2 |
| P3-01 | `TransmuteNowFlow` | 3 |
| P3-02 | `MissionCard` | 3 |
| P3-03 | `DeepWorkTimer` | 3 |
| P3-04 | `IntegrityMap` | 3 |
| P4-01 | `ResonanceVisualizer` | 4 |
| P4-02 | `DyadSyncScreen` | 4 |
| P5-01 | `SilenceSealTimer` | 5 |
| P5-02 | `EssentialTruthLog` | 5 |
| P6-01 | `NetiVoidScreen` | 6 |
| P6-02 | `ReEntryProtocol` | 6 |
| P7-01 | `SerpentMasterLock` | 7 |
| P7-02 | `SpinalHeatMap` | 7 |
| P7-03 | `SurgeButton` | 7 |
| P7-04 | `DharmaMap` | 7 |
| P7-05 | `GraduationScreen` | 7 |

---

# PART VIII: ACCEPTANCE CRITERIA

---

## 8.1 Navigation
- [ ] Bottom nav consistent across all screens
- [ ] Trends tab locked when Stability < 60
- [ ] Safety button accessible from any screen
- [ ] Dyads in Practice tab AND Home when Phase 4+ unlocked

## 8.2 Closed-Loop Integration
- [ ] Sensor snapshot runs on every app open (2-6 seconds)
- [ ] Mode pre-set by Audit Stack before user interaction
- [ ] Mode chip shows current mode + confidence
- [ ] Audit Strip shows all 5 tiles with graceful degradation
- [ ] Drift Badge updates on mismatch

## 8.3 Home Skeleton
- [ ] All 7 blocks render in correct order
- [ ] Safety Banner pins under top bar when active
- [ ] H2 shows both Subjective and Audit rows
- [ ] Emergency Downshift footer persists

## 8.4 Drift Reconciliation
- [ ] Soft Audit intercepts Quick Journal Save when drift
- [ ] Soft Audit intercepts Primary Action Start when drift
- [ ] Proceed requires friction (10s breath + confirm)
- [ ] Downshift routes to Phase 1

## 8.5 Completion Tiers
- [ ] All sessions show tier (Verified/Supported/Self-report)
- [ ] Streaks count all three tiers
- [ ] Unlocks require minimum Verified % OR extended duration

## 8.6 Phase Configurations
- [ ] Each phase loads correct skin tokens
- [ ] Mode preset conditions drive Primary Action
- [ ] Mode Tools show correct locked/available states
- [ ] Ladder Card shows accurate progress

## 8.7 Safety Systems
- [ ] Yellow Audit intercepts Yellow entries
- [ ] Audit failure routes to grounding
- [ ] Nightmare Gate triggers on 2 terror nights
- [ ] Dissociation check after all Neti sessions
- [ ] Kill-switch on HR spike during stillness
- [ ] Cooldown timers enforce lock periods
- [ ] Sleep-at-risk forces Seal mode

## 8.8 Mission System
- [ ] Missions unlock by tier
- [ ] Pillar balance tracked
- [ ] Failure flows don't penalize
- [ ] Integrity Map shows weekly summary

## 8.9 Journal
- [ ] Daily check-in < 20 seconds
- [ ] Dream capture < 60 seconds
- [ ] Churn text provably discarded
- [ ] Every high-voltage session logs entry + safety check + downshift

---

# PART IX: APPENDICES

---

## Appendix A: Screen ID Reference

```
INITIATION
├── I-01: Intent Selection
├── I-02: Risk Gate
├── I-03: Grounding Contract
└── I-04: Sensor Connect

HOME (by phase × mode)
├── H-01 to H-14: All phase/mode combinations

CLOSED-LOOP
├── CL-01 to CL-06: Sensor/audit screens

SAFETY
├── S-01 to S-07: Safety flows

HARDWARE
├── HW-01 to HW-04: Permission/status screens

JOURNAL
├── J-01 to J-08: Journal components

PHASE-SPECIFIC
├── P2-01 to P2-03: Flow screens
├── P3-01 to P3-04: Fire screens
├── P4-01 to P4-02: Resonance screens
├── P5-01 to P5-02: Expression screens
├── P6-01 to P6-02: Vision screens
└── P7-01 to P7-05: Union screens
```

---

## Appendix B: Naming Conventions

| Term | Definition |
|------|------------|
| **Sadhana** | The complete system/app |
| **Adhikara** | Competency gating principle |
| **Phase** | Unlocked capability level (1-7) |
| **Mode** | Current physiological state |
| **Audit Stack** | Sensor integration layer |
| **Stability** | Core safety metric (0-100) |
| **Ojas** | Vitality/output currency |
| **Kavacha** | Armor/protection mode |
| **Drift** | Mismatch between subjective and objective |
| **Symbiont** | Dyad/relationship module only |

---

## Appendix C: The Pathway in One Sentence

**Self-actualization is the ability to generate (and release) ecstatic states without losing ethics, sleep, or identity — and then channel that surplus into service, creation, and clean relationships.**

The best user "churns" because they don't need you.

---

*End of Specification v3.0*
