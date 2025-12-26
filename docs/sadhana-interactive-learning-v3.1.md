# Sadhana: Interactive Learning & Gamification Layer
## Design System Addendum v3.1

**Scope:** Illustrative sections, interactive tutorials, gamified learning across Phases, Ladder, and Mode Tools  
**Core Principle:** Delight without addiction — engagement serves understanding, not chasing

---

# PART I: DESIGN PHILOSOPHY

## 1.1 The Gamification Paradox

Most apps gamify to increase engagement (time in app, return visits, dopamine loops).

Sadhana gamifies to **decrease dependency** while **increasing competency**.

### What We Gamify

| Element | Purpose | Anti-Addiction Guard |
|---------|---------|---------------------|
| Understanding | "I get how this works" | No points for reading |
| Competency | "I can do this myself" | Progress = less app need |
| Consistency | "I show up" | Streaks break gracefully |
| Depth | "I'm ready for more" | Gates, not bribes |

### What We Never Gamify

| Element | Why Not |
|---------|---------|
| Time in app | Longer ≠ better |
| Social comparison | Your path is yours |
| Content consumption | No infinite scroll |
| Notification response | No Pavlovian hooks |

---

## 1.2 The Illustration Language

### Visual Style

| Attribute | Specification |
|-----------|---------------|
| Style | Minimalist, symbolic, not cartoonish |
| Motion | Slow, intentional, breath-synced where possible |
| Color | Phase-appropriate tokens, never garish |
| Density | High whitespace, never crowded |
| Personality | Wise elder, not cheerful mascot |

### Illustration Types

| Type | Use Case | Example |
|------|----------|---------|
| **Symbolic** | Concepts, chakras, elements | Stylized flame for Manipura |
| **Diagrammatic** | Flows, relationships, anatomy | Spine with nodes |
| **Animated** | Breath guides, transitions, feedback | Pulsing circle |
| **Interactive** | Tutorials, explorations, games | Draggable mood dot |

---

# PART II: JOURNEY ONBOARDING

## 2.1 The Opening Sequence (First Launch)

### Screen O-01: The Question

```
┌─────────────────────────────────────────────┐
│                                             │
│                                             │
│         [Animated: Single flame]            │
│                                             │
│                                             │
│   "What would change if you could           │
│    trust your own nervous system?"          │
│                                             │
│                                             │
│              [Continue →]                   │
│                                             │
└─────────────────────────────────────────────┘
```

**Interaction:** Flame responds subtly to scroll/touch

---

### Screen O-02: The Map (Interactive)

```
┌─────────────────────────────────────────────┐
│                                             │
│   The Path                                  │
│   ─────────────────────────────             │
│                                             │
│        ○ Union         ← [locked]           │
│        │                                    │
│        ○ Vision        ← [locked]           │
│        │                                    │
│        ○ Expression    ← [locked]           │
│        │                                    │
│        ○ Resonance     ← [locked]           │
│        │                                    │
│        ○ Fire          ← [locked]           │
│        │                                    │
│        ○ Flow          ← [locked]           │
│        │                                    │
│        ● Foundation    ← [You are here]     │
│                                             │
│   [Tap any phase to learn more]             │
│                                             │
└─────────────────────────────────────────────┘
```

**Interaction:** 
- Vertical scroll through spine visualization
- Tap phase → brief tooltip (1 sentence + icon)
- Locked phases show requirement on tap
- Current phase pulses gently

---

### Screen O-03: The Compass (Interactive Tutorial)

```
┌─────────────────────────────────────────────┐
│                                             │
│   Your Compass                              │
│   ─────────────────────────────             │
│                                             │
│   This is the Mood Meter.                   │
│   It maps your nervous system.              │
│                                             │
│   ┌───────────────────────────────────┐    │
│   │      HIGH ENERGY                   │    │
│   │   [RED]         [YELLOW]           │    │
│   │   Fight         Flow               │    │
│   │                                    │    │
│   │ ──────────────●────────────────── │    │
│   │               ↑                    │    │
│   │         [Drag me]                  │    │
│   │   [BLUE]        [GREEN]            │    │
│   │   Freeze        Rest               │    │
│   │      LOW ENERGY                    │    │
│   └───────────────────────────────────┘    │
│                                             │
│   Drag the dot to where you are now.        │
│                                             │
└─────────────────────────────────────────────┘
```

**Interaction:**
- User drags dot to current state
- Quadrant highlights on entry
- Tooltip explains what that quadrant means
- Haptic feedback on quadrant change

**After placement:**
```
┌─────────────────────────────────────────────┐
│                                             │
│   You placed yourself in [YELLOW]           │
│   ─────────────────────────────             │
│                                             │
│   This means: High energy, pleasant.        │
│                                             │
│   [Animated: Sun/fire symbol]               │
│                                             │
│   In this state, you have fuel.             │
│   The question is: where does it go?        │
│                                             │
│   Sadhana helps you aim it.                 │
│                                             │
│              [Continue →]                   │
│                                             │
└─────────────────────────────────────────────┘
```

---

### Screen O-04: The Body (Interactive Tutorial)

```
┌─────────────────────────────────────────────┐
│                                             │
│   Where does it live?                       │
│   ─────────────────────────────             │
│                                             │
│   Emotions aren't just thoughts.            │
│   They have addresses in your body.         │
│                                             │
│   ┌───────────────────────────────────┐    │
│   │                                    │    │
│   │           ○ Head                   │    │
│   │                                    │    │
│   │     ○     ○ Throat    ○           │    │
│   │           ○ Chest  ←[pulsing]      │    │
│   │           ○ Solar                  │    │
│   │           ○ Belly                  │    │
│   │                                    │    │
│   │        ○       ○                   │    │
│   │                                    │    │
│   └───────────────────────────────────┘    │
│                                             │
│   Tap where you feel something right now.   │
│                                             │
└─────────────────────────────────────────────┘
```

**Interaction:**
- Zones glow subtly on hover/approach
- On tap: ripple animation + zone name appears
- Brief explanation of that zone's meaning

---

### Screen O-05: The Promise

```
┌─────────────────────────────────────────────┐
│                                             │
│                                             │
│   [Animated: Seven ascending dots/chakras]  │
│                                             │
│                                             │
│   Sadhana won't make you feel good.         │
│                                             │
│   It will teach you to navigate             │
│   whatever you feel.                        │
│                                             │
│   Until you don't need the app anymore.     │
│                                             │
│                                             │
│              [Begin →]                      │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 2.2 Phase Unlocking Ceremonies

When a user unlocks a new phase, they receive an **interactive learning moment** (not just a badge).

### Unlock Screen Template

```
┌─────────────────────────────────────────────┐
│                                             │
│   [Animated: Phase symbol emerging]         │
│                                             │
│   Phase 2: Flow                             │
│   ─────────────────────────────             │
│                                             │
│   You've proven you can ground.             │
│   Now you can look beneath.                 │
│                                             │
│   [Learn what unlocked →]                   │
│                                             │
└─────────────────────────────────────────────┘
```

**On "Learn what unlocked":**

Interactive carousel (3-5 cards, swipeable):

```
Card 1:
┌─────────────────────────────────────────────┐
│   The Mirror                                │
│   ─────────────────────────────             │
│                                             │
│   [Illustration: Moon/water reflection]     │
│                                             │
│   Dreams are messages from the              │
│   parts of you that don't speak.            │
│                                             │
│   You can now capture them.                 │
│                                     [1/4] → │
└─────────────────────────────────────────────┘

Card 2:
┌─────────────────────────────────────────────┐
│   The Shadow Dex                            │
│   ─────────────────────────────             │
│                                             │
│   [Illustration: Masked figure]             │
│                                             │
│   Recurring patterns have names.            │
│   "The Critic." "The Jailer."               │
│                                             │
│   Naming them reduces their power.          │
│                                     [2/4] → │
└─────────────────────────────────────────────┘

Card 3:
┌─────────────────────────────────────────────┐
│   The Churn                                 │
│   ─────────────────────────────             │
│                                             │
│   [Illustration: Spiral dissolving]         │
│                                             │
│   Some things need to be written            │
│   and then burned.                          │
│                                             │
│   This is that fire.                        │
│                                     [3/4] → │
└─────────────────────────────────────────────┘

Card 4:
┌─────────────────────────────────────────────┐
│   The Safety Gate                           │
│   ─────────────────────────────             │
│                                             │
│   [Illustration: Shield with moon]          │
│                                             │
│   If nightmares repeat, the Mirror          │
│   locks automatically.                      │
│                                             │
│   Your nervous system comes first.          │
│                                             │
│              [Begin Phase 2 →]      [4/4]   │
└─────────────────────────────────────────────┘
```

---

## 2.3 Tool Introduction Flows

Each new tool gets a **micro-tutorial** on first access.

### Pattern: Tool Intro (3 screens)

**Screen 1: The Why**
```
┌─────────────────────────────────────────────┐
│   Dream Capture                             │
│   ─────────────────────────────             │
│                                             │
│   [Illustration: Night sky → consciousness] │
│                                             │
│   You spend 2 hours in REM each night.      │
│   Your subconscious is processing.          │
│                                             │
│   This tool helps you listen.               │
│                                             │
│              [How it works →]               │
└─────────────────────────────────────────────┘
```

**Screen 2: The How (Interactive)**
```
┌─────────────────────────────────────────────┐
│   Dream Capture                             │
│   ─────────────────────────────             │
│                                             │
│   Step 1: Plot mood on waking               │
│   [Mini Mood Meter — interactive]           │
│                                             │
│   Step 2: Mark lucidity                     │
│   [Yes] [No] [Unsure] ← tap one             │
│                                             │
│   Step 3: Tag symbols                       │
│   [Chase] [Water] [Falling] ← tap any       │
│                                             │
│   That's it. 60 seconds.                    │
│                                             │
│              [Try it now →]                 │
└─────────────────────────────────────────────┘
```

**Screen 3: The Practice (Sandbox)**
```
┌─────────────────────────────────────────────┐
│   Practice Round                            │
│   ─────────────────────────────             │
│                                             │
│   Think of any dream you remember.          │
│   (It doesn't have to be recent.)           │
│                                             │
│   [Full Dream Capture interface]            │
│                                             │
│   This won't save. Just practice.           │
│                                             │
│              [Done practicing →]            │
└─────────────────────────────────────────────┘
```

---

# PART III: LADDER VISUALIZATION

## 3.1 The Ladder Screen (Main View)

```
┌─────────────────────────────────────────────┐
│   Your Path                                 │
│   ─────────────────────────────             │
│                                             │
│   [Interactive vertical spine/ladder]       │
│                                             │
│   ┌─────────────────────────────────────┐  │
│   │                                      │  │
│   │         ◇ Union (locked)            │  │
│   │         │   "Integration"            │  │
│   │         │                            │  │
│   │         ◇ Vision (locked)           │  │
│   │         │   "Witness"                │  │
│   │         │                            │  │
│   │         ◇ Expression (locked)       │  │
│   │         │   "Truth"                  │  │
│   │         │                            │  │
│   │         ◇ Resonance (locked)        │  │
│   │         │   "Connection"             │  │
│   │         │                            │  │
│   │         ◇ Fire (locked)             │  │
│   │         │   "Agency"                 │  │
│   │         │   ████░░░░░ 40%           │  │
│   │         │                            │  │
│   │         ◉ Flow ← CURRENT            │  │
│   │         │   "Subconscious"           │  │
│   │         │   ████████░ 82%           │  │
│   │         │                            │  │
│   │         ✓ Foundation (complete)     │  │
│   │             "Grounding"              │  │
│   │                                      │  │
│   └─────────────────────────────────────┘  │
│                                             │
│   [Scroll to explore]                       │
│                                             │
└─────────────────────────────────────────────┘
```

**Interactions:**
- Scroll vertically through phases
- Tap any phase → expands to detail view
- Current phase pulses gently
- Completed phases show checkmark
- Locked phases show requirements on tap

---

## 3.2 Phase Detail View (Expanded)

```
┌─────────────────────────────────────────────┐
│   ← Back                                    │
│                                             │
│   Phase 2: Flow                             │
│   Svadhisthana • Sacral • Water             │
│   ─────────────────────────────             │
│                                             │
│   [Animated: Water/moon illustration]       │
│                                             │
│   Progress: ████████░░ 82%                  │
│                                             │
│   ┌─────────────────────────────────────┐  │
│   │  Unlocked Tools                      │  │
│   │                                      │  │
│   │  ◉ Dream Capture        [Used: 14x] │  │
│   │  ◉ Shadow Dex           [Used: 3x]  │  │
│   │  ◉ Churn                [Used: 8x]  │  │
│   └─────────────────────────────────────┘  │
│                                             │
│   ┌─────────────────────────────────────┐  │
│   │  Requirements for Phase 3            │  │
│   │                                      │  │
│   │  ✓ 14 days journaling               │  │
│   │  ✓ 3+ Shadow Dex entries            │  │
│   │  ○ Stability ≥ 70 (current: 68)     │  │
│   └─────────────────────────────────────┘  │
│                                             │
│   [What is Phase 3? →]                      │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 3.3 Phase Preview (Locked Phases)

```
┌─────────────────────────────────────────────┐
│   ← Back                                    │
│                                             │
│   Phase 3: Fire                    [LOCKED] │
│   Manipura • Solar Plexus • Fire            │
│   ─────────────────────────────             │
│                                             │
│   [Illustration: Ember/flame - dimmed]      │
│                                             │
│   ┌─────────────────────────────────────┐  │
│   │  What you'll learn                   │  │
│   │                                      │  │
│   │  • Channel energy into output        │  │
│   │  • Complete missions in the world    │  │
│   │  • Build agency without burning out  │  │
│   └─────────────────────────────────────┘  │
│                                             │
│   ┌─────────────────────────────────────┐  │
│   │  Tools that unlock                   │  │
│   │                                      │  │
│   │  🔒 Transmute Now                    │  │
│   │  🔒 Mission Engine                   │  │
│   │  🔒 Deep Work Timer                  │  │
│   │  🔒 Bellows Breath                   │  │
│   └─────────────────────────────────────┘  │
│                                             │
│   ┌─────────────────────────────────────┐  │
│   │  To unlock, complete:                │  │
│   │                                      │  │
│   │  ○ Phase 2: Flow (82% complete)      │  │
│   │  ○ Stability ≥ 70 (current: 68)      │  │
│   └─────────────────────────────────────┘  │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 3.4 The Spine Visualization (Anatomical)

For users who want to understand the embodiment layer:

```
┌─────────────────────────────────────────────┐
│   The Pathway                               │
│   ─────────────────────────────             │
│                                             │
│   [Interactive spine illustration]          │
│                                             │
│            ◇ Crown                          │
│            │  Pineal • Integration          │
│            │                                │
│            ◇ Third Eye                      │
│            │  Pituitary • Witness           │
│            │                                │
│            ◇ Throat                         │
│            │  Thyroid • Expression          │
│            │                                │
│            ◉ Heart ← [highlighted]          │
│            │  Thymus • Connection           │
│            │                                │
│            ◇ Solar Plexus                   │
│            │  Pancreas • Agency             │
│            │                                │
│            ◇ Sacral                         │
│            │  Gonads • Creativity           │
│            │                                │
│            ◇ Root                           │
│               Adrenals • Survival           │
│                                             │
│   [Tap any node to learn more]              │
│                                             │
└─────────────────────────────────────────────┘
```

**Interaction:**
- Tap node → shows chakra, endocrine gland, function, associated emotions
- Current phase node pulses
- Unlocked nodes are bright, locked are dimmed

---

# PART IV: MODE TOOLS LEARNING

## 4.1 Tool Cards (Enhanced)

Each tool card shows a **learning indicator** for users who haven't completed the tutorial:

```
┌──────────────────────────────────────┐
│                                      │
│  Dream Capture                       │
│  ─────────────────                   │
│  60s • Morning                       │
│                                      │
│  ◉ Available                         │
│                                      │
│  [Start]     [How it works? ↗]       │
│                                      │
└──────────────────────────────────────┘
```

After tutorial completed:
```
┌──────────────────────────────────────┐
│                                      │
│  Dream Capture              ✓ Learned│
│  ─────────────────                   │
│  60s • Morning                       │
│                                      │
│  ◉ Available • Used 14x              │
│                                      │
│  [Start]                             │
│                                      │
└──────────────────────────────────────┘
```

---

## 4.2 In-Practice Guidance Layers

For complex tools, show **progressive disclosure** during the practice:

### Example: Neti Protocol

**First time - Full guidance:**
```
┌─────────────────────────────────────────────┐
│   Neti: Step 1 of 4                         │
│   ─────────────────────────────             │
│                                             │
│   [Illustration: Settling posture]          │
│                                             │
│   Settle into stillness.                    │
│   Feel the body breathing itself.           │
│                                             │
│   Timer: 1:47                               │
│                                             │
│   [Next step appears automatically]         │
│                                             │
└─────────────────────────────────────────────┘
```

**Fifth time - Minimal guidance:**
```
┌─────────────────────────────────────────────┐
│   Neti                                      │
│   ─────────────────────────────             │
│                                             │
│              [Void screen]                  │
│                                             │
│         Uncouplings: 7                      │
│                                             │
│   [Show guidance] (collapsed)               │
│                                             │
└─────────────────────────────────────────────┘
```

**Guidance Toggle:**
- Users can expand/collapse guidance at any time
- Default changes based on experience level
- Never remove the option entirely

---

## 4.3 Tool Mastery Indicators

Show progression within each tool (not gamified points, but competency markers):

```
┌─────────────────────────────────────────────┐
│   Dream Capture                             │
│   ─────────────────────────────             │
│                                             │
│   Sessions: 14                              │
│                                             │
│   Insights unlocked:                        │
│                                             │
│   ✓ Symbol patterns detected                │
│   ✓ Lucidity correlation found              │
│   ○ Recurring complex identified            │
│   ○ Dream→waking connection mapped          │
│                                             │
│   [View your dream patterns →]              │
│                                             │
└─────────────────────────────────────────────┘
```

---

# PART V: INTERACTIVE LEARNING MODULES

## 5.1 Concept Explainers

Accessible from Help or contextually when relevant:

### Module: "Understanding the Quadrants"

```
┌─────────────────────────────────────────────┐
│   The Four States                           │
│   ─────────────────────────────             │
│                                             │
│   [Interactive quadrant with animations]    │
│                                             │
│   ┌───────────────────────────────────┐    │
│   │      🔴 RED         🟡 YELLOW     │    │
│   │      High alarm     High flow      │    │
│   │      ───────────────────────────── │    │
│   │      🔵 BLUE        🟢 GREEN      │    │
│   │      Low crash      Low rest       │    │
│   └───────────────────────────────────┘    │
│                                             │
│   [Tap any quadrant to explore]             │
│                                             │
└─────────────────────────────────────────────┘
```

**On tap (e.g., RED):**
```
┌─────────────────────────────────────────────┐
│   RED: High Energy, Low Pleasantness        │
│   ─────────────────────────────             │
│                                             │
│   [Illustration: Lightning/alarm]           │
│                                             │
│   Emotions: Angry, Anxious, Panicked,       │
│   Frustrated, Enraged, Terrified            │
│                                             │
│   Biology: Cortisol surge, sympathetic      │
│   activation, blood to muscles              │
│                                             │
│   What Sadhana does: Grounds first.         │
│   No depth work until you're safe.          │
│                                             │
│   [← Back]     [What helps in RED? →]       │
│                                             │
└─────────────────────────────────────────────┘
```

---

### Module: "The Stability Score"

```
┌─────────────────────────────────────────────┐
│   Your Stability Score                      │
│   ─────────────────────────────             │
│                                             │
│   [Animated: Score building from inputs]    │
│                                             │
│   What goes in:                             │
│                                             │
│   ┌─────────────────────────────────────┐  │
│   │  ↗ Consistent Green returns         │  │
│   │  ↗ Sleep quality                    │  │
│   │  ↗ Practice completion              │  │
│   │  ↗ Low volatility (no wild swings)  │  │
│   │  ↘ Overwhelm spikes                 │  │
│   │  ↘ Sleep crashes                    │  │
│   │  ↘ Skipped days                     │  │
│   └─────────────────────────────────────┘  │
│                                             │
│   Why it matters:                           │
│   High-voltage practices require a          │
│   stable vessel. This score proves          │
│   you've built one.                         │
│                                             │
│   [See your stability history →]            │
│                                             │
└─────────────────────────────────────────────┘
```

---

### Module: "Drift Detection"

```
┌─────────────────────────────────────────────┐
│   When Mind and Body Disagree               │
│   ─────────────────────────────             │
│                                             │
│   [Interactive DualDot visualization]       │
│                                             │
│   ┌─────────────────────────────────────┐  │
│   │                                      │  │
│   │       ● Your report (Yellow)        │  │
│   │                                      │  │
│   │               ○ Body signal (Red)   │  │
│   │                                      │  │
│   └─────────────────────────────────────┘  │
│                                             │
│   Sometimes you feel fine, but your         │
│   body tells a different story.             │
│                                             │
│   This can mean:                            │
│   • True peace (you're right)               │
│   • Numbness (protective disconnect)        │
│   • Building pressure (not yet felt)        │
│                                             │
│   Sadhana asks you to pause and check.      │
│   Not because you're wrong—because          │
│   both signals matter.                      │
│                                             │
│   [What happens when drift is detected? →]  │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 5.2 Contextual Micro-Learning

Pop-up cards that appear at relevant moments (not interrupting, augmenting):

### Trigger: First time in Yellow after Red streak

```
┌─────────────────────────────────────────────┐
│   💡 You shifted                            │
│   ─────────────────────────────             │
│                                             │
│   3 days ago: mostly Red                    │
│   Today: Yellow                             │
│                                             │
│   This is the kind of shift that            │
│   builds Stability over time.               │
│                                             │
│   [Dismiss]        [What made it work? →]   │
│                                             │
└─────────────────────────────────────────────┘
```

### Trigger: First Mission completion

```
┌─────────────────────────────────────────────┐
│   💡 Mission Complete                       │
│   ─────────────────────────────             │
│                                             │
│   You just proved you can channel           │
│   fire into action.                         │
│                                             │
│   This is the Weaver's core skill.          │
│                                             │
│   [See your Mission history →]              │
│                                             │
└─────────────────────────────────────────────┘
```

### Trigger: Stability crosses threshold

```
┌─────────────────────────────────────────────┐
│   💡 New Threshold                          │
│   ─────────────────────────────             │
│                                             │
│   Stability: 70 (Stable band)               │
│                                             │
│   You've crossed into Stable.               │
│   This unlocks more depth when ready.       │
│                                             │
│   [What's new at Stable? →]                 │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 5.3 Practice Previews

Before committing to a longer practice, users can preview:

```
┌─────────────────────────────────────────────┐
│   Silence Seal                              │
│   ─────────────────────────────             │
│                                             │
│   Duration: 4 hours                         │
│                                             │
│   [Preview: What will happen? ▼]            │
│                                             │
│   ┌─────────────────────────────────────┐  │
│   │                                      │  │
│   │   1. Set intention (1 min)          │  │
│   │   2. Begin seal — no speech         │  │
│   │   3. App tracks time (background)    │  │
│   │   4. Log speech urges (optional)     │  │
│   │   5. End seal — log Essential Truths │  │
│   │                                      │  │
│   │   You can break early if needed.     │  │
│   │   No penalty.                        │  │
│   │                                      │  │
│   └─────────────────────────────────────┘  │
│                                             │
│   [Start Seal]     [Not right now]          │
│                                             │
└─────────────────────────────────────────────┘
```

---

# PART VI: GAMIFIED ELEMENTS

## 6.1 What We Track (Visibly)

| Metric | Display | Purpose |
|--------|---------|---------|
| **Stability Score** | Number + band | Core safety metric |
| **Phase Progress** | % bar | Unlock proximity |
| **Consistency** | Calendar dots | Pattern visibility |
| **Tool Usage** | Count per tool | Competency building |
| **Mission Pillars** | Balance wheel | Self-knowledge |

## 6.2 What We Don't Track (Deliberately)

| Metric | Why Not |
|--------|---------|
| Points / XP | Creates chasing behavior |
| Leaderboards | Comparison is poison |
| Streaks with punishment | Creates anxiety |
| Time in app | Longer ≠ better |
| Social shares | Not a performance |

---

## 6.3 Consistency Visualization (Not Streaks)

Instead of "37-day streak!" (which creates anxiety about breaking):

```
┌─────────────────────────────────────────────┐
│   This Month                                │
│   ─────────────────────────────             │
│                                             │
│   M  T  W  T  F  S  S                       │
│   ●  ●  ●  ○  ●  ●  ●                       │
│   ●  ●  ●  ●  ●  ○  ●                       │
│   ●  ●  ●  ●  ●  ●  ●                       │
│   ●  ◐  ·  ·  ·  ·  ·                       │
│                                             │
│   ● Complete  ◐ Partial  ○ Missed  · Future │
│                                             │
│   Pattern: Strong weekday practice.         │
│   Saturdays sometimes slip.                 │
│                                             │
│   [That's information, not judgment]        │
│                                             │
└─────────────────────────────────────────────┘
```

**Philosophy:**
- Show the pattern, not the count
- Missed days are visible but not punished
- The insight is "when do I slip?" not "how long is my streak?"

---

## 6.4 Mission Integrity Wheel

Visual representation of pillar balance:

```
┌─────────────────────────────────────────────┐
│   Your Integrity Map                        │
│   ─────────────────────────────             │
│                                             │
│           Restraint                         │
│              ╱╲                             │
│             ╱  ╲                            │
│        ───╱    ╲───                         │
│     Truth        Service                    │
│        ───╲    ╱───                         │
│             ╲  ╱                            │
│              ╲╱                             │
│           Recovery                          │
│              │                              │
│           Output                            │
│                                             │
│   Strong: Service, Output                   │
│   Developing: Restraint, Truth              │
│   Needs attention: Recovery                 │
│                                             │
│   [Suggest missions for Recovery →]         │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 6.5 Unlockable Insights (Not Achievements)

Instead of badges, users unlock **insights about themselves**:

```
┌─────────────────────────────────────────────┐
│   Insight Unlocked                          │
│   ─────────────────────────────             │
│                                             │
│   "Thursday Trigger"                        │
│                                             │
│   Based on 6 weeks of data:                 │
│                                             │
│   Your Red spikes cluster on Thursday       │
│   afternoons (3-6pm).                       │
│                                             │
│   This might correlate with:                │
│   • End-of-week deadlines                   │
│   • Accumulated fatigue                     │
│   • Specific recurring meetings             │
│                                             │
│   [Add to your Pattern Library →]           │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 6.6 Phase Completion Moments

When completing a phase, no confetti or celebration—instead, **reflection**:

```
┌─────────────────────────────────────────────┐
│                                             │
│   [Slow fade: Phase 2 symbol]               │
│                                             │
│   Phase 2: Complete                         │
│   ─────────────────────────────             │
│                                             │
│   You entered Flow 47 days ago.             │
│                                             │
│   In that time:                             │
│   • 23 dreams captured                      │
│   • 4 Shadows named                         │
│   • 2 patterns integrated                   │
│                                             │
│   Something shifted:                        │
│   "I notice the script, not just the        │
│    feeling."                                │
│                                             │
│                                             │
│   [Continue to Phase 3 →]                   │
│                                             │
└─────────────────────────────────────────────┘
```

---

# PART VII: COMPONENT ADDITIONS

## 7.1 New Components

| ID | Component | Purpose |
|----|-----------|---------|
| IL-01 | `OnboardingSequence` | First-launch flow (5 screens) |
| IL-02 | `PhaseUnlockCeremony` | Unlock learning carousel |
| IL-03 | `ToolIntroFlow` | 3-screen tool tutorial |
| IL-04 | `ConceptExplainer` | Interactive learning module |
| IL-05 | `MicroLearningCard` | Contextual pop-up insight |
| IL-06 | `PracticePreview` | Expandable preview section |
| IL-07 | `LadderVisualization` | Interactive spine/ladder |
| IL-08 | `PhaseDetailView` | Expanded phase information |
| IL-09 | `IntegrityWheel` | Mission pillar balance |
| IL-10 | `ConsistencyCalendar` | Non-punitive pattern view |
| IL-11 | `InsightCard` | Unlocked self-knowledge |
| IL-12 | `PhaseReflection` | Completion moment |
| IL-13 | `GuidanceToggle` | Show/hide practice instructions |
| IL-14 | `MasteryIndicator` | Tool competency markers |

## 7.2 Animation Specifications

| Animation | Trigger | Duration | Easing |
|-----------|---------|----------|--------|
| Phase node pulse | Current phase | 2s loop | ease-in-out |
| Unlock reveal | Phase completion | 800ms | ease-out |
| Quadrant highlight | Mood dot entry | 200ms | ease-out |
| Ripple on body tap | Zone selection | 400ms | ease-out |
| Card expand | Detail reveal | 300ms | ease-in-out |
| Fade transitions | Screen change | 250ms | ease |
| Progress fill | Score update | 500ms | ease-out |
| Insight slide-up | Trigger condition | 350ms | ease-out |

## 7.3 Illustration Inventory

| ID | Subject | Phases Used | Style |
|----|---------|-------------|-------|
| ILL-01 | Flame (single) | Onboarding, P3 | Symbolic |
| ILL-02 | Spine with nodes | Ladder, P7 | Diagrammatic |
| ILL-03 | Moon/water | P2 | Symbolic |
| ILL-04 | Masked figure | P2 Shadow | Symbolic |
| ILL-05 | Spiral dissolving | P2 Churn | Animated |
| ILL-06 | Sun/fire burst | P3 | Symbolic |
| ILL-07 | Heart coherence | P4 | Animated |
| ILL-08 | Throat/sound waves | P5 | Symbolic |
| ILL-09 | Eye/void | P6 | Symbolic |
| ILL-10 | Crown light | P7 | Symbolic |
| ILL-11 | Four quadrants | Mood explainer | Diagrammatic |
| ILL-12 | Body outline | Somatic map | Diagrammatic |
| ILL-13 | DualDot | Drift explainer | Animated |

---

# PART VIII: ACCEPTANCE CRITERIA (ADDENDUM)

## 8.1 Onboarding
- [ ] Opening sequence completes in < 3 minutes
- [ ] Mood Meter tutorial allows practice placement
- [ ] Body Map tutorial registers zone tap
- [ ] All illustrations load and animate correctly
- [ ] Skip option available (but not prominent)

## 8.2 Ladder
- [ ] All 7 phases visible in ladder view
- [ ] Current phase highlighted
- [ ] Locked phases show requirements on tap
- [ ] Phase detail expands with full information
- [ ] Spine visualization works on all screen sizes

## 8.3 Tool Learning
- [ ] First-time tool access triggers intro
- [ ] Tutorial can be skipped
- [ ] Tutorial completion tracked
- [ ] Guidance toggle works mid-practice
- [ ] Mastery indicators update after sessions

## 8.4 Gamification Boundaries
- [ ] No points or XP displayed anywhere
- [ ] No streak counts with penalty language
- [ ] No social comparison features
- [ ] No time-in-app metrics shown to user
- [ ] Consistency calendar shows pattern, not judgment

## 8.5 Contextual Learning
- [ ] Micro-learning cards appear at correct triggers
- [ ] Cards are dismissable without consequence
- [ ] "Learn more" paths lead to concept explainers
- [ ] Insights unlock based on actual data patterns

---

# APPENDIX: Content Guidelines

## Voice for Learning Content

| Quality | Do | Don't |
|---------|-----|-------|
| **Tone** | Wise elder, patient teacher | Enthusiastic coach, cheerleader |
| **Length** | Concise, one idea per screen | Dense, paragraph-heavy |
| **Language** | Plain, embodied | Jargon-heavy, abstract |
| **Framing** | "This is how it works" | "You should do this" |
| **Pacing** | Slow, breath-friendly | Rapid, overwhelming |

## Example Rewrites

**Before:** "Great job completing your first mission! You're on your way to becoming a productivity master! 🎉"

**After:** "Mission complete. You channeled fire into action. That's the Weaver's skill."

**Before:** "WARNING: Your stability is dropping! Complete more practices to avoid losing access to advanced features!"

**After:** "Stability: 58 (Settling). The system is protecting you from depth work until you're grounded again."

**Before:** "You've unlocked the SHADOW DEX! This powerful tool will help you CONQUER your inner demons!"

**After:** "Shadow Dex unlocked. Naming patterns reduces their power. You're ready to begin."

---

*End of Interactive Learning & Gamification Layer v3.1*
