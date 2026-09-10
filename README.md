# GYM-Interval-Timer

A gym interval timer: track your sets, run a rest countdown, and get an audible alarm when rest is over. The set progress auto-advances when a rest is skipped or completed.

Ported from a single-file `gym_interval_timer.html` prototype to a Vue 3 + TypeScript + Vite project, styled with Tailwind CSS v4, using Tone.js for the alarm sound and Font Awesome for icons.

## App Structure

- `src/App.vue` — layout, wires state into the three cards
- `src/components/SetProgressCard.vue` — set visualizer (add / select / reset)
- `src/components/RestTimerCard.vue` — circular countdown, rest adjustment, presets
- `src/components/ActionBar.vue` — floating Skip / Start-Pause-Stop Alarm / +30s bar
- `src/composables/useIntervalTimer.ts` — timer, set and alarm state logic
- `src/audio/ringtone.ts` — Tone.js alarm tone (FMSynth arpeggio loop)

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

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

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```
