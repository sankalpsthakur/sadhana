# Sadhana Design Language (vNext)

## North Star
Sadhana is a daily ritual, not a dashboard. The interface must feel grounded, warm, and precise - supportive when the nervous system is fragile, and quietly powerful when the user is steady.

## Experience Qualities
- Grounded: warm neutrals, tactile surfaces, quiet depth.
- Clear: high-contrast typography, generous spacing, and purposeful hierarchy.
- Human: organic rhythm in line height and spacing; no sterile grids.
- Safe: emotionally legible states with predictable placement and calm motion.

## Typography
**Primary typeface (body):** Sora
- Humanist geometry, compact, legible at small sizes.
- Weights: Regular, Medium, SemiBold.

**Display typeface (headings):** Fraunces
- Warm serif, spiritual but modern. Used for titles and emotional emphasis.
- Weights: Regular, SemiBold, Bold.

### Type Scale (pt)
- Display: 42 / 48
- H1: 32 / 38
- H2: 26 / 32
- H3: 20 / 26
- Body: 15 / 22
- Body Small: 13 / 20
- Caption: 11 / 16

Usage: Headings use Fraunces; body and UI labels use Sora. Numbers use `fontVariant: ['tabular-nums']` for stability.

## Color System
Two base schemes with phase-driven accent color.

### Light
- Base: #F7F3EE
- Surface: #FFFDFA
- Elevated: #F1EAE1
- Text: #1F1B17
- Muted text: #8A8076
- Border: #E4D9CE

### Dark
- Base: #0E0F11
- Surface: #15181C
- Elevated: #1C2026
- Text: #F5F1EB
- Muted text: #8A8076
- Border: #2A2F37

### Phase Accents
- Phase 1 (Earth): #B26A3E
- Phase 2 (Water): #4F7B8A
- Phase 3 (Ember): #C0713E
- Phase 4 (Heart): #6C9A7A
- Phase 5 (Throat): #3D7C9B
- Phase 6 (Deep): #8B7D6A
- Phase 7 (Crown): #74665B

### Emotional Quadrants
- Red: #D55C4A
- Blue: #4C78A6
- Green: #4E9B72
- Yellow: #D4A441

### Safety Locks
Use subdued tones that retain urgency without alarm.
- Kavacha: #D15A4A
- Nightmare/Sleep: #4B78A6
- Neti: #6F6B9A
- Serpent: #C79B3B
- Union: #7C746C

## Layout & Spacing
- 4pt base grid with soft rhythm: 4 / 8 / 12 / 20 / 28 / 40 / 56.
- Cards breathe: 20-24pt padding on primary content surfaces.
- Touch targets: 48pt min height, 12-16pt corner radius.

## Surfaces & Elevation
- Cards are quiet and tactile, never glossy.
- Borders at 1pt, subtle; shadows only for priority overlays.

## Motion
- Purposeful transitions only: 220-280ms.
- Safety flows use slower easing for calm reassurance.
- Reduce motion when system preference indicates.

## Accessibility
- Contrast: minimum 4.5:1 for all text, 3:1 for large headings.
- Dynamic type enabled by default.
- Errors and safety states always include text + icon.

## Platform Notes
**iOS:**
- Preserve native sheets for safety and sleep flows.
- Use thicker separators for dark mode legibility.

**Android:**
- Emphasize elevation separation between card and background.
- Respect system font scaling and device contrast settings.

## Component Principles
- Primary CTA: single dominant action per screen.
- Safety banners: persistent, top-anchored, dismissible with explanation.
- Chips and tags: low-contrast, compact, always legible.
