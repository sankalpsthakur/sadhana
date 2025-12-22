# Sadhana Home Design System
## Single App, Multiple Modes — Mockup-Ready Specification

**Version:** 2.0
**Scope:** Home Screen Architecture + Phase-by-Phase Layouts
**Target:** Designer ready to build reusable component system

---

## Part 1: Global Navigation

### Mobile (Bottom Nav, 5 Items)

| Position | Icon | Label | Notes |
|----------|------|-------|-------|
| 1 | 🏠 | Home | Default landing, always visible |
| 2 | ◎ | Practice | Contains modules + Dyads tab when unlocked |
| 3 | 📓 | Journal | Log, Reflect, Review modes |
| 4 | 📊 | Trends | Locked until Stability ≥ 60 for 7 days |
| 5 | ⛰️ | Ladder | Pathway Map / Progression |

**Conditional Elements (Not New Nav Items):**
- **Dyads** appears as a tab inside Practice AND as a card on Home when Phase 4+ unlocked
- No "phase shopping" — users don't browse phases from nav

### Desktop (Left Rail)

```
┌─────────────────┐
│  ◉ Sadhana      │
├─────────────────┤
│  🏠 Home        │ ← Active indicator
│  ◎ Practice     │
│  📓 Journal     │
│  📊 Trends      │  (locked state if <60 stability)
│  ⛰️ Ladder      │
├─────────────────┤
│                 │
│                 │
│                 │
├─────────────────┤
│  ⚙️ Settings    │
│  🛡️ Safety      │
│  ❓ Help        │
│  🔒 On-device   │ ← Privacy status indicator
└─────────────────┘
```

### Always-Available Global Controls (Top Right)

| Control | Icon | Action |
|---------|------|--------|
| Safety | ⚡ / 🛡️ | Opens "Emergency Downshift" modal |
| Settings | ⚙️ | User preferences, skin toggle |
| Privacy | 🔒 | Shows "On-device" status (green = local-first active) |

---

## Part 2: Home Screen Skeleton (Constant Layout)

The Home screen uses **7 fixed blocks** in the same order across all phases. Content inside blocks changes; structure does not.

```
┌──────────────────────────────────────────┐
│ H0  SAFETY BANNER (conditional)          │ ← Sticky under top bar
├──────────────────────────────────────────┤
│ H1  MODE HEADER                          │
├──────────────────────────────────────────┤
│ H2  STATE STRIP                          │
├──────────────────────────────────────────┤
│                                          │
│ H3  PRIMARY ACTION CARD                  │
│                                          │
├──────────────────────────────────────────┤
│ H4  QUICK JOURNAL CARD                   │
├──────────────────────────────────────────┤
│ H5  MODE TOOLS (2–3 cards)               │
├──────────────────────────────────────────┤
│ H6  TODAY'S PATTERN                      │
├──────────────────────────────────────────┤
│ H7  NEXT UNLOCK / LADDER                 │
└──────────────────────────────────────────┘
│ PERSISTENT FOOTER: Emergency Downshift   │
```

---

## Part 3: Block Specifications

### H0 — Safety Banner (Conditional)

**Visibility:** Only when safety locks are active

**Trigger Conditions:**

| Condition | Banner Text | Color |
|-----------|-------------|-------|
| Kavacha active | "Depth locked. Ground first." | Muted red |
| Nightmare gate (2+ terror nights) | "Dream work paused for nervous system safety." | Deep blue |
| Neti cooldown (72h) | "Neti paused. Return to embodiment." | Dark violet |
| Serpent cooldown (7 days) | "Voltage too high. Cooling period: X days remaining." | Amber |
| Union lock (partner unstable) | "Dyad paused. Partner stabilizing." | Soft gray |

**Component:** `SafetyBanner`

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

### H1 — Mode Header (Always Visible)

**Purpose:** Show two-axis identity (Phase = capability, Mode = current state)

**Layout:**

```
┌─────────────────────────────────────────────┐
│ [Phase Chip]        Today         [Band]    │
│ ◉ Foundation        Dec 22        Unstable  │
│   (Muladhara)                     ●●○○○     │
└─────────────────────────────────────────────┘
```

**Component:** `ModeHeader`

**Elements:**

| Element | Position | Content |
|---------|----------|---------|
| Phase Chip | Left | Phase name + chakra icon (tappable → opens phase detail) |
| Date | Center | "Today" + weekday |
| Stability Band | Right | Text label + 5-pip indicator |

**Stability Bands:**

| Band | Pip Display | Threshold |
|------|-------------|-----------|
| Unstable | ●○○○○ | Stability < 50 |
| Settling | ●●○○○ | Stability 50–64 |
| Stable | ●●●○○ | Stability 65–79 |
| Radiant | ●●●●○ | Stability 80–89 |
| HV-Eligible | ●●●●● | Stability ≥ 90 (30+ days) |

---

### H2 — State Strip (Always Visible)

**Purpose:** User's "instrument cluster" — quick-glance system state

**Layout:**

```
┌─────────────────────────────────────────────┐
│ [Mood]   [Body]    [Sleep]      [Locks]     │
│  🟡       Chest    Protected     🔒 0       │
└─────────────────────────────────────────────┘
```

**Component:** `StateStrip`

**Tiles (4 total, each tappable):**

| Tile | Icon/Display | States | Tap Action |
|------|--------------|--------|------------|
| Mood | Quadrant color dot | Red/Blue/Green/Yellow/Empty | Opens Mood Meter |
| Body | Zone label | "Chest", "Jaw", "Belly", "—" | Opens Body Map |
| Sleep | Status text | "Protected" / "At risk" / "Unknown" | Opens sleep detail |
| Locks | Lock icon + count | 0–3 active locks | Opens lock summary |

**Tile States:**
- **Default:** Shows current value
- **Stale (>4 hours):** Dimmed opacity (60%)
- **Tapped:** Opens relevant input/detail modal

---

### H3 — Primary Action Card (Always Visible)

**Purpose:** Single dominant CTA — "Do this next"

**Layout:**

```
┌─────────────────────────────────────────────┐
│                                             │
│  Heavy Earth                               │
│  ─────────────────────────────              │
│  Arousal is high. Bring attention           │
│  to feet first.                             │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │          START (3:00)               │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Why this? ↗                               │
└─────────────────────────────────────────────┘
```

**Component:** `PrimaryActionCard`

**Elements:**

| Element | Purpose |
|---------|---------|
| Title | Practice/action name |
| Reason line | 1-line contextual why (state-aware) |
| Primary CTA | "Start (duration)" or "Begin" |
| Secondary link | "Why this?" → opens explainer modal |

**Card Selection Logic (Priority Order):**

1. **Safety override:** If lock active → shows relevant grounding action
2. **Mode-based:** Current mode determines suggested practice
3. **Time-based:** Morning/day/night influences selection
4. **Streak consideration:** If streak at risk, surfaces maintainer

---

### H4 — Quick Journal Card (Always Visible)

**Purpose:** Fast Plot → Place → Name flow (consistent muscle memory)

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

**Component:** `QuickJournalCard`

**Flow:**
1. **Plot:** Tap opens Mood Meter grid → place dot → quadrant color appears
2. **Place:** Tap opens Body Map → tap zone → zone label appears
3. **Name:** Tap opens word chips (8–16, quadrant-filtered) → select → word appears
4. **Save:** Creates Journal entry, updates State Strip

**States:**
- **Empty:** All three show placeholder icons
- **Partial:** Completed steps show filled state, incomplete show outline
- **Complete:** All three filled → Save button enabled

---

### H5 — Mode Tools (Always Visible, 2–3 Cards)

**Purpose:** Phase-aware tool availability

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
│                                             │
│  ┌──────────────┐                          │
│  │ Churn        │                          │
│  │ (Purge)      │                          │
│  │ 3min         │                          │
│  │ ◉ Available  │                          │
│  └──────────────┘                          │
└─────────────────────────────────────────────┘
```

**Component:** `ModeToolsGrid`

**Card States:**

| State | Visual | Interaction |
|-------|--------|-------------|
| Available | Full opacity, green indicator | Tap → opens tool |
| Locked (phase) | Dimmed, lock icon | Tap → shows unlock requirement |
| Locked (state) | Dimmed, shield icon | Tap → shows stability requirement |
| Cooldown | Timer overlay | Non-interactive until timer expires |

---

### H6 — Today's Pattern (Always Visible)

**Purpose:** One clean signal, not therapy

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

**Component:** `PatternCard`

**Content Rules:**
- Maximum 2 sentences
- Observation only, never prescription
- Links to Trends for full context
- Rotates daily (doesn't repeat same pattern within 7 days)

**Pattern Types:**

| Category | Example |
|----------|---------|
| Trigger correlation | "Red spikes follow Thursday meetings" |
| Recovery insight | "Return to Green is fastest after walking" |
| Sleep connection | "Blue mornings correlate with <6hr sleep" |
| Practice efficacy | "Bellows + Deep Work = 2x output logged" |

---

### H7 — Next Unlock / Ladder Card (Always Visible)

**Purpose:** Prevent "what do I do now?" anxiety

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

**Component:** `LadderCard`

**Elements:**
- Progress bar (phase completion %)
- Next requirement (1 line)
- CTA to full Ladder view

---

### Persistent Footer (Always Visible on Mobile)

**Component:** `EmergencyFooter`

```
┌─────────────────────────────────────────────┐
│  [🛡️ Emergency Downshift]                   │
└─────────────────────────────────────────────┘
```

**Behavior:**
- Sticky at bottom
- Tap opens Emergency Downshift modal (full-screen takeover)
- Available from any screen (via global gesture or persistent button)

---

## Part 4: Phase-by-Phase Home Configurations

Each phase uses the same skeleton. Below are the specific configurations.

---

### Phase 1 — Foundation (Muladhara)

**Skin:** Earth / Heavy (matte surfaces, slow transitions, dark earth tones)

**Mode Header:**
```
◉ Foundation (Muladhara)    Today, Dec 22    [Unstable ●●○○○]
```

**Primary Action Card Options:**

| Mode | Title | Reason | Duration |
|------|-------|--------|----------|
| Armor | Heavy Earth | "Arousal is high. Bring attention to feet first." | 3:00 |
| Rebuild | Gentle Warmth | "Energy is low. Restore before striving." | 5:00 |
| Maintain | Seal Protocol | "Stable. Protect the baseline." | 2:00 |

**Mode Tools:**

| Tool | Availability | Lock Reason |
|------|--------------|-------------|
| Wandering Tap | Always | — |
| Vent & Ground | Always | — |
| Sleep Shield | Always | — |
| Dream Capture | 🔒 | "Unlock in Phase 2" |

**Pattern Card Examples:**
- "Your Red entries cluster in the evening."
- "Walking correlates with faster Green return."

**Ladder Card:**
```
Phase 1 Progress: 45%
Next: Stability ≥ 70 for 14 consecutive days
```

---

### Phase 2 — Flow (Svadhisthana)

**Skin:** Water / Reflective (soft sheen, ripple micro-motion, cool blues/teals)

**Mode Header:**
```
◉ Flow (Svadhisthana)    Today, Jan 15    [Stable ●●●○○]
```

**Primary Action Card Options:**

| Mode | Title | Reason | Duration |
|------|-------|--------|----------|
| Mirror | Dream Capture | "Morning. Subconscious is close." | 1:00 |
| Armor | Heavy Earth | "Activation detected. Ground first." | 3:00 |
| Rebuild | Warmth Protocol | "Low energy. Rebuild gently." | 5:00 |

**Mode Tools:**

| Tool | Availability | Lock Reason |
|------|--------------|-------------|
| Dream Capture | ◉ Available | — |
| Shadow Dex | ◉ Available | — |
| Churn (Purge) | ◉ Available | — |
| Wandering Tap | Always | — |
| Mission | 🔒 | "Unlock in Phase 3" |

**Safety Banners Possible:**
- Nightmare Gate: "Dream work paused. 2 terror nights detected."

**Pattern Card Examples:**
- "Chase/trapped symbols appear after conflict days."
- "Your Shadow Critic visits when HRV < 40ms."

**Ladder Card:**
```
Phase 2 Progress: 62%
Next: Complete Shadow Dex integration (3 entries)
```

---

### Phase 3 — Fire (Manipura)

**Skin:** Ember / Crisp (sharp typography, warm ambers, energetic but restrained)

**Mode Header:**
```
◉ Fire (Manipura)    Today, Feb 20    [Radiant ●●●●○]
```

**Primary Action Card Options:**

| Mode | Title | Reason | Duration |
|------|-------|--------|----------|
| Forge | Mission + Deep Work | "Productive heat detected. Aim the fire." | 25:00 |
| Armor | Heavy Earth | "Heat without resilience. Ground first." | 3:00 |
| Bridge | Coherence Breath | "Coherence window. Attune before action." | 5:00 |

**Yellow Audit Flow:**
When user enters Yellow quadrant, before showing Forge mode:

```
┌─────────────────────────────────────────────┐
│  Yellow Audit                               │
│  ─────────────────────────────              │
│  1. Hours slept last night? [___]           │
│  2. Jaw tension now? [None/Some/High]       │
│  3. Can you drop to Green in 60 seconds?    │
│     [Yes] [No]                              │
│                                             │
│  [Continue] [Ground Instead]                │
└─────────────────────────────────────────────┘
```

**Audit Failure:** Routes to Armor mode, not Forge

**Mode Tools:**

| Tool | Availability | Lock Reason |
|------|--------------|-------------|
| Transmute Now | ◉ Available | — |
| Mission | ◉ Available | — |
| Deep Work Timer | ◉ Available | — |
| Bellows (90s) | ◉ Available | — |
| Dream Capture | Always | — |
| Neti | 🔒 | "Unlock in Phase 4" |

**Pattern Card Examples:**
- "Yellow used well: 3 deep work sessions this week."
- "Energy leaks correlate with skipped missions."

**Ladder Card:**
```
Phase 3 Progress: 71%
Next: Complete 7 missions without fail
```

---

### Phase 4 — Resonance (Anahata)

**Skin:** Warm / Coherent (gentle glow, paired symmetry motifs, rose/gold accents)

**Mode Header:**
```
◉ Resonance (Anahata)    Today, Mar 18    [Radiant ●●●●○]
```

**Primary Action Card Options:**

| Mode | Title | Reason | Duration |
|------|-------|--------|----------|
| Bridge | Coherence (Solo) | "Heart coherence window. Tune the field." | 5:00 |
| Bridge + Dyad | Resonant Sync | "Partner stable. Co-regulate available." | 10:00 |
| Forge | Mission | "Productive heat. Aim into service." | 25:00 |

**Mode Tools:**

| Tool | Availability | Lock Reason |
|------|--------------|-------------|
| Humming / Drone | ◉ Available | — |
| Mala Breath | ◉ Available | — |
| Dyad Sync | ◉ Available (if partner stable) | "Partner stabilizing" |
| Mission | Always | — |
| Neti | 🔒 | "Unlock in Phase 5" |

**Dyad Card (when unlocked):**

```
┌─────────────────────────────────────────────┐
│  Dyad Available                             │
│  ─────────────────────────────              │
│  Partner: [Name]                            │
│  Status: Stable ●●●○○                       │
│                                             │
│  [Start Resonant Sync]                      │
└─────────────────────────────────────────────┘
```

**Pattern Card Examples:**
- "Sync scores highest after solo coherence prep."
- "Post-humming, return to Green is 40% faster."

**Ladder Card:**
```
Phase 4 Progress: 55%
Next: 5 Dyad sessions with Sync ≥ 75
```

---

### Phase 5 — Signal (Vishuddha)

**Skin:** Signal / Clean (high whitespace, "broadcast" lines, silver/white/light blue)

**Mode Header:**
```
◉ Signal (Vishuddha)    Today, Apr 22    [Radiant ●●●●○]
```

**Primary Action Card Options:**

| Mode | Title | Reason | Duration |
|------|-------|--------|----------|
| Signal | Silence Seal | "Stable and low arousal. Restraint is power." | 4:00:00 |
| Bridge | Coherence | "Heart open. Attune before speech." | 5:00 |
| Forge | Essential Truth | "Channel energy into clean expression." | 15:00 |

**Silence Seal Card:**

```
┌─────────────────────────────────────────────┐
│  Silence Seal                               │
│  ─────────────────────────────              │
│  Duration: 4 hours                          │
│  Rules: No speech. Emergency break only.    │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │          BEGIN SEAL                 │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [Emergency Break] (always visible)         │
└─────────────────────────────────────────────┘
```

**Mode Tools:**

| Tool | Availability | Lock Reason |
|------|--------------|-------------|
| Silence Seal | ◉ Available | — |
| Essential Truths Log | ◉ Available | — |
| Voice Biofeedback | ◉ Available | — |
| Neti | 🔒 | "Unlock in Phase 6" |

**Pattern Card Examples:**
- "Most impulsive speech urges appear after conflict."
- "Silence Seals correlate with cleaner meetings next day."

**Ladder Card:**
```
Phase 5 Progress: 40%
Next: 3 complete Silence Seals (no emergency breaks)
```

---

### Phase 6 — Vision (Ajna)

**Skin:** Void / Spacious (minimal, quiet, high contrast black/white, vast negative space)

**Mode Header:**
```
◉ Vision (Ajna)    Today, May 30    [HV-Eligible ●●●●●]
```

**Primary Action Card Options:**

| Mode | Title | Reason | Duration |
|------|-------|--------|----------|
| Void | Neti (Slicing) | "Stability high. Safe to witness." | 7:00 |
| Bridge | Coherence | "Prepare the field before void work." | 5:00 |
| Armor | Heavy Earth | "Drift detected. Ground first." | 3:00 |

**Neti Session Flow:**

```
┌─────────────────────────────────────────────┐
│  Neti: Void Work                            │
│  ─────────────────────────────              │
│  This session dissolves identification.     │
│  Re-entry is mandatory.                     │
│                                             │
│  [Begin Slicing]                            │
│                                             │
│  ⚠️ Mandatory re-entry (60s) follows        │
└─────────────────────────────────────────────┘
```

**Post-Session Re-entry (Forced):**

```
┌─────────────────────────────────────────────┐
│  Re-Entry Protocol                          │
│  ─────────────────────────────              │
│  □ Feel feet on floor                       │
│  □ Name 3 red objects                       │
│  □ Squeeze hands (10 seconds)               │
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

**If flagged:** Neti locks for 72h, forces Phase 1 journaling

**Mode Tools:**

| Tool | Availability | Lock Reason |
|------|--------------|-------------|
| Neti (Slicing) | ◉ Available | — |
| Identity Sort | ◉ Available | — |
| Re-Entry Protocol | Always (auto after Neti) | — |
| Serpent | 🔒 | "Unlock in Phase 7" |

**Pattern Card Examples:**
- "Uncoupling events increasing. Dissociation markers stable."
- "Neti sessions most effective after morning coherence."

**Ladder Card:**
```
Phase 6 Progress: 68%
Next: 10 Neti sessions with clean re-entry
```

---

### Phase 7 — Union (Sahasrara / Serpent)

**Skin:** Austere / Reverent (almost clinical, no "fun" visuals, pure white/obsidian, maximum restraint)

**Mode Header:**
```
◉ Union (Sahasrara)    Today, Jul 15    [HV-Eligible ●●●●●]
```

**Master Lock Gate:**

```
┌─────────────────────────────────────────────┐
│  Serpent Access                             │
│  ─────────────────────────────              │
│  Requirements:                              │
│  ✓ Stability ≥ 90 for 30 days              │
│  ✓ Weaver complete                          │
│  ✓ Mirror stable (no nightmare spiral)      │
│  ✓ Neti clean (no dissociation flags)       │
│                                             │
│  [FaceID/Biometric to Proceed]              │
└─────────────────────────────────────────────┘
```

**Primary Action Card Options:**

| Mode | Title | Reason | Duration |
|------|-------|--------|----------|
| Conductor | Sushumna Rise | "Vessel stable. Conduct with reverence." | 12:00 |
| Void | Neti | "Prepare through dissolution." | 7:00 |
| Armor | Emergency Vent | "Spike detected. Vent immediately." | 3:00 |

**Serpent Session Screen:**

```
┌─────────────────────────────────────────────┐
│                                             │
│                    │                        │
│                    │  ← Spine visualization │
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

**Kill-Switch Trigger (Automated):**
If HR spike > 130 BPM while body is still:

```
┌─────────────────────────────────────────────┐
│                                             │
│  ⚠️ VOLTAGE SPIKE DETECTED                  │
│                                             │
│  Navigation locked.                         │
│  Follow the breath circle.                  │
│                                             │
│         ○ ← Pacing circle (60s)            │
│                                             │
│  [Audio: 40Hz binaural grounding]           │
└─────────────────────────────────────────────┘
```

**Post-Session Cooldown:**
If kill-switch triggered → 7-day Serpent lock

**Mode Tools:**

| Tool | Availability | Lock Reason |
|------|--------------|-------------|
| Sushumna Rise | ◉ Available (if audit passes) | "Audit failed" |
| Spinal Heat Map | ◉ Available | — |
| Emergency Vent | Always | — |
| Ecstatic Window | ◉ Available (1x/day max) | "Already used today" |
| Dharma Map | ◉ Available | — |

**Ecstatic Window Rules:**
- 6–12 minutes maximum
- Must end with forced downshift
- Cannot repeat same day (anti-chasing)
- Only available when all audits pass

**Pattern Card Examples:**
- "Head pressure correlates with cold feet. Vent downward."
- "Stable ecstatic windows: 2 this week (within safe range)."

**Ladder Card:**
```
Phase 7: Ongoing
Focus: Conductivity without distress
Service: Dharma commitments this week: 3
```

---

## Part 5: Card Ordering Rules

The H3 Primary Action Card and H5 Mode Tools follow strict ordering logic.

### Time-Based Priority (Morning / Day / Night)

**Morning (5am–11am):**
1. Dream Capture (if Phase 2+)
2. Morning Check-in
3. Gentle activation (if stable)

**Day (11am–6pm):**
1. Mission / Deep Work (if Forge mode)
2. Coherence (if Bridge mode)
3. Maintenance (if stable)

**Night (6pm–5am):**
1. Seal the Day
2. Sleep Shield
3. Churn (if Phase 2+)
4. NO intensity practices (blocked)

### State-Based Overrides (Highest Priority)

| State | Override | Reason |
|-------|----------|--------|
| Kavacha active | Force grounding | Safety first |
| Red quadrant | Vent & Ground only | De-escalate |
| Blue quadrant | Warmth & Rebuild | Restore |
| Sleep crash (2 nights) | Lock all depth | Protect baseline |
| Nightmare gate | Lock dream work | Nervous system safety |
| Dissociation flag | Force Phase 1 | Re-embody |

### Mode Selection Logic (Flowchart)

```
START
  │
  ▼
[Safety lock active?]──Yes──► Show grounding only
  │ No
  ▼
[Red quadrant?]──Yes──► Armor Mode (Vent & Ground)
  │ No
  ▼
[Blue quadrant?]──Yes──► Rebuild Mode (Warmth)
  │ No
  ▼
[Yellow quadrant?]──Yes──► [Run Yellow Audit]
  │                              │
  │                        Pass──► Forge Mode
  │                        Fail──► Armor Mode
  │ No (Green)
  ▼
[Time of day?]
  │
  Morning──► Mirror Mode (if Phase 2+) or Maintain
  Day──────► Forge Mode (if stable) or Bridge Mode
  Night────► Seal Mode (no intensity)
```

---

## Part 6: Phase Skins (Token Changes Only)

All phases use identical layout. Skins change tokens only.

### Token Categories

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

### Phase 1 — Foundation (Earth / Heavy)

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

### Phase 2 — Flow (Water / Reflective)

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

### Phase 3 — Fire (Ember / Crisp)

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

### Phase 4 — Resonance (Warm / Coherent)

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

### Phase 5 — Signal (Signal / Clean)

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

### Phase 6 — Vision (Void / Spacious)

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

### Phase 7 — Union (Austere / Reverent)

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

## Part 7: Component Inventory (Figma Checklist)

### Global Components

| ID | Component | States |
|----|-----------|--------|
| G-01 | `BottomNav` | Default, Active item, Locked item |
| G-02 | `SafetyBanner` | Kavacha, Nightmare, Neti, Serpent, Union |
| G-03 | `ModeHeader` | All phases × all bands |
| G-04 | `StateStrip` | Default, Stale, Empty |
| G-05 | `EmergencyFooter` | Default, Pressed |

### Home Components

| ID | Component | States |
|----|-----------|--------|
| H-01 | `PrimaryActionCard` | Default, Loading, Disabled |
| H-02 | `QuickJournalCard` | Empty, Partial (1-2 filled), Complete |
| H-03 | `ModeToolsGrid` | 2-card layout, 3-card layout |
| H-04 | `ToolCard` | Available, Locked (phase), Locked (state), Cooldown |
| H-05 | `PatternCard` | Default (with link) |
| H-06 | `LadderCard` | All phases |

### Journal Components

| ID | Component | States |
|----|-----------|--------|
| J-01 | `MoodPlotGrid` | Empty, Placed, With word |
| J-02 | `SomaticPinMap` | Empty, Zone selected |
| J-03 | `WordChips` | Quadrant-filtered sets (Red, Blue, Green, Yellow) |
| J-04 | `EntryCard` | All entry types |
| J-05 | `TimeboxTimer` | Running, Expired, Extended |
| J-06 | `DualDot` | Aligned, Drifted |

### Safety Components

| ID | Component | States |
|----|-----------|--------|
| S-01 | `SoftAuditSheet` | Drift reconciliation |
| S-02 | `YellowAudit` | Questions, Pass result, Fail result |
| S-03 | `DissociationCheck` | Questions, Clear, Flagged |
| S-04 | `KillSwitchOverlay` | Active (with pacing circle) |
| S-05 | `CooldownTimer` | 72h (Neti), 7d (Serpent) |

### Phase-Specific Components

| ID | Component | Phase |
|----|-----------|-------|
| P2-01 | `DreamCaptureFlow` | Phase 2 |
| P2-02 | `ShadowDexCapture` | Phase 2 |
| P2-03 | `ChurnScreen` | Phase 2 |
| P3-01 | `TransmuteNowFlow` | Phase 3 |
| P3-02 | `MissionCard` | Phase 3 |
| P3-03 | `DeepWorkTimer` | Phase 3 |
| P4-01 | `ResonanceVisualizer` | Phase 4 |
| P4-02 | `DyadSyncScreen` | Phase 4 |
| P5-01 | `SilenceSealTimer` | Phase 5 |
| P6-01 | `NetiVoidScreen` | Phase 6 |
| P6-02 | `ReEntryProtocol` | Phase 6 |
| P7-01 | `SerpentMasterLock` | Phase 7 |
| P7-02 | `SpinalHeatMap` | Phase 7 |
| P7-03 | `SurgeButton` | Phase 7 |

---

## Part 8: Acceptance Criteria

### Navigation
- [ ] Bottom nav is consistent across all screens
- [ ] Trends tab shows locked state when Stability < 60
- [ ] Safety button accessible from any screen
- [ ] Dyads appears in Practice tab AND Home (when unlocked)

### Home Skeleton
- [ ] All 7 blocks render in correct order
- [ ] Safety Banner pins under top bar when active
- [ ] Emergency Downshift footer persists on scroll

### Phase Configurations
- [ ] Each phase loads correct skin tokens
- [ ] Mode Tools show correct locked/available states
- [ ] Primary Action Card reflects current mode
- [ ] Ladder Card shows accurate progress

### Safety Systems
- [ ] Yellow Audit intercepts all Yellow quadrant entries
- [ ] Audit failure routes to grounding (not Forge)
- [ ] Dissociation check triggers after all Neti sessions
- [ ] Kill-switch activates on HR spike during stillness
- [ ] Cooldown timers enforce lock periods

### Card Ordering
- [ ] Time-based rules apply correctly (morning/day/night)
- [ ] State overrides take priority over time rules
- [ ] No intensity practices surface at night

---

## Appendix: Screen ID Reference

For Figma organization:

```
HOME
├── H-01: Home (Phase 1, Armor Mode)
├── H-02: Home (Phase 1, Rebuild Mode)
├── H-03: Home (Phase 2, Mirror Mode)
├── H-04: Home (Phase 3, Forge Mode)
├── H-05: Home (Phase 3, Yellow Audit)
├── H-06: Home (Phase 4, Bridge Mode)
├── H-07: Home (Phase 4, Dyad Available)
├── H-08: Home (Phase 5, Signal Mode)
├── H-09: Home (Phase 6, Void Mode)
├── H-10: Home (Phase 7, Conductor Mode)
├── H-11: Home (Safety Banner Active)
└── H-12: Home (Cooldown State)

SAFETY
├── S-01: Soft Audit Sheet (Drift)
├── S-02: Yellow Audit Flow
├── S-03: Dissociation Check
├── S-04: Kill-Switch Overlay
├── S-05: Emergency Downshift Modal
└── S-06: Cooldown Display

JOURNAL
├── J-01: Quick Log (Empty)
├── J-02: Quick Log (Complete)
├── J-03: Mood Meter Grid
├── J-04: Body Map Pin
└── J-05: Word Chips (by quadrant)
```

---

*End of Specification*
