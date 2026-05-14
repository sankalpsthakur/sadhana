# iPad 13-inch screenshots

Device: iPad Pro 13-inch (M4) simulator (target).

## Status: NOT CAPTURED — recommend `supportsTablet: false`

No iPad screenshots were captured in wave 3. The same blocker that prevented post-onboarding 6.9-inch capture applies (see `../6.9-inch/README.md`). The iPad-specific risk is higher: the React Native UI in `src/` is built around safe-area-anchored vertical layouts with no documented iPad breakpoints. Without empirical confirmation of layout integrity at 1024-pt + width, shipping iPad screenshots risks broken UI being filed as an App Review rejection.

## Recommendation

Edit `app.json`:

```json
{
  "expo": {
    "ios": {
      "supportsTablet": false
    }
  }
}
```

This:
1. Removes the requirement to submit iPad screenshots.
2. Removes the implicit promise that the app works well on iPad.
3. Lets engineering focus on the iPhone 6.9-inch and standard sets first.

If iPad support is a product requirement, schedule a follow-on wave to:
1. Build for `iPad Pro 13-inch (M4)` simulator.
2. Walk every primary screen, verify layout (especially: `OnboardingSequence`, `HomeScreen`, `PracticeScreen`, `LadderScreen`, `TrendsScreen`, `JournalScreen` and all overlays in `src/components/flows/`).
3. Add iPad-specific responsive styles where the safe-area-anchored vertical layout breaks at iPad widths.
4. Capture the same six panels at 2064×2752.
