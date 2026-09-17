# GYM Interval Timer ⏱️

GYM Interval Timer: rest countdown and auto track your sets.

The set progress auto-advances when a rest is completed.

> [!NOTE]
> Visit website: https://ittuann.github.io/GYM-Interval-Timer/

## 🛠️ Development

```sh
pnpm install
```

- Compile and Hot-Reload for Development (http://localhost:3000)

```sh
pnpm dev
```

- Compile and Minify for Production

```sh
pnpm build
```

- Build a fully static site (`.output/public`)

```sh
pnpm generate
```

- Build with the GitHub Pages preset (prerenders `/` and `/404.html`, writes `.nojekyll`; requires the base URL env)

```sh
NUXT_APP_BASE_URL=/GYM-Interval-Timer/ pnpm build:pages
```

- Run Unit Tests with Vitest

```sh
pnpm test:unit
```

- Run End-to-End Tests with Playwright

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
pnpm build

# Runs the end-to-end tests
pnpm test:e2e
# Runs the tests only on Chromium
pnpm test:e2e --project=chromium
# Runs the tests of a specific file
pnpm test:e2e e2e/timer.spec.ts
# Runs the tests in debug mode
pnpm test:e2e --debug
```

- Lint with ESLint

```sh
pnpm lint
```

### App Structure

- `nuxt.config.ts` — Nuxt configuration (SPA mode, GitHub Pages base URL, head metadata)
- `app/app.vue` — layout, wires state into the three cards
- `app/components/SetProgressCard.vue` — set visualizer (add / select / reset)
- `app/components/RestTimerCard.vue` — circular countdown, rest adjustment, presets
- `app/components/ActionBar.vue` — floating Skip / Start-Pause-Stop Alarm / +30s bar
- `app/composables/useIntervalTimer.ts` — timer, set and alarm state logic
- `app/audio/ringtone.ts` — Tone.js alarm tone (FMSynth arpeggio loop)
