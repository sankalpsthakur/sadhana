# Audio assets

## bowl_strike.m4a

Generated singing-bowl strike used by `PhaseOpenCeremony` on phase advance.
432 Hz fundamental with exponential decay over 3 seconds.

```
ffmpeg -f lavfi -i "aevalsrc='sin(2*PI*432*t)*exp(-t*0.6)':d=3" \
  -ac 1 -ar 44100 -c:a aac -b:a 96k assets/audio/bowl_strike.m4a
```

Notes:
- Synthetic. A real chakra-frequency set (C2..B2 per phase, see §6 of the
  redesign brief and the TODO in `PhaseOpenCeremony.tsx`) is the long-term
  target. The single 432 Hz tone is the wave 11 placeholder so the ceremony
  has *something* on the attack until those assets land.
- Mono, 44.1 kHz, ~96 kbps AAC. ~38 KB on disk.
- Played via `expo-av` `Audio.Sound.createAsync(..., { shouldPlay: true })`.
