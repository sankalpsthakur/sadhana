# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sadhana is a React Native/Expo spiritual practice app implementing a "Seven-Phase Sovereignty Protocol" - a progressive system for self-actualization with built-in safety mechanisms. The app serves the body's rhythm through circadian-aware features.

## Commands

```bash
npm start          # Start Expo development server
npm run ios        # Run on iOS simulator
npm run android    # Run on Android emulator
npm run web        # Run in web browser
```

## Architecture

### Core Concepts

**Two Axes of Identity:**
- **Phase (0-7)**: Capability level - what practices are unlocked (like a driver's license class)
- **Mode**: Current biological state (Armor, Rebuild, Mirror, Forge, Bridge, Signal, Void, Conductor)

Phase is potential; Mode is reality. A Phase 7 user in Armor Mode receives Phase 1 treatment.

**Stability Score (0-100)**: Gates advanced features
- `<60`: Phases 4-7 locked, Trends locked
- `70+`: Standard progression
- `85+`: Neti eligible
- `90+` (30 days): HV-Eligible, Serpent eligible

**Time Windows**: Five circadian windows control feature availability
- Brahma Muhurta (4:00-6:00): High-voltage practices (Phase 6+)
- Morning (6:00-11:00): Dream capture, intentions
- Day (11:00-17:00): Deep work, missions
- Evening (17:00-21:00): Return to baseline
- Night (21:00-4:00): Sealed, sleep protection

### State Management

**Zustand stores in `src/store/`:**
- `useAppStore.ts`: Global user state (phase, mode, stability, locks, mood)
- `useDailyCycleStore.ts`: Daily cycle state (checkins, practices, dreams, missions, seal)

### Theme System

Phase-aware theming in `src/theme/`:
- `ThemeProvider` wraps app, receives current phase
- `phaseTokens` in `tokens.ts` define 8 distinct visual identities
- Use `useTheme()` hook to access current tokens

### Flow Coordinator

`src/utils/flowCoordinator.ts` is the decision engine that determines:
- What flow should take over the screen (morning-checkin, seal-flow, night-mode, etc.)
- What cards appear on home
- What practices are blocked and why

Priority order: Safety > Productivity > Engagement

### Key Types (`src/types/`)

```typescript
type Phase = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
type Mode = 'Armor' | 'Rebuild' | 'Mirror' | 'Forge' | 'Bridge' | 'Signal' | 'Void' | 'Conductor';
type StabilityBand = 'Unstable' | 'Settling' | 'Stable' | 'Radiant' | 'HV-Eligible';
type MoodQuadrant = 'Red' | 'Blue' | 'Green' | 'Yellow' | null;
```

### Safety Locks

The app has safety mechanisms that can lock certain features:
- `kavacha`: Red quadrant + overwhelm
- `nightmare`: 2 consecutive terror nights
- `neti`: Dissociation flag (72h cooldown)
- `serpent`: Kill-switch (7d cooldown)
- `sleepEmergency`: 2-night crash pattern

## Directory Structure

```
src/
  components/
    flows/       # Full-screen takeover flows (MorningCheckin, SealFlow, etc.)
    global/      # Persistent UI (SafetyBanner, StateStrip, EmergencyFooter)
    home/        # Home screen cards
    demo/        # Demo control panel for testing
  navigation/    # React Navigation setup
  screens/       # Tab screens
  store/         # Zustand stores
  theme/         # Phase-aware theming
  types/         # TypeScript types
  utils/         # Flow coordinator, time windows
  mock/          # Mock data for phases, modes, tools
```

## Design System References

Detailed specifications are in `docs/`:
- `DESIGN_SYSTEM_V3.md`: Core architecture, chakra-endocrine mapping, safety algorithm
- `HOME_DESIGN_SYSTEM.md`: Home screen component specs
- `DAILY_ROUTINE_SPEC.md`: Time-based flows and rituals
