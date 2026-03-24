---
name: "Flamenco Metronome Workspace Instructions"
description: "Project-specific guidance for GitHub Copilot Chat in the Flamenco Metronome React/Vite app. Includes commands, structure, conventions, and common developer tasks."
---

## Project overview
- Single-page web app in React + TypeScript + Vite, displays rhythm patterns and audio metronome controls.
- Key area: `src/` with UI components, audio hooks, constants, and config.
- No backend in this repository.

## Quick startup
- `npm install`
- `npm run dev` (development server)
- `npm run build` (production artifact)

## Key files and directories
- `src/main.tsx`: React bootstrap & root render.
- `src/App.tsx`: main UI container.
- `src/components/*`: controls, pattern selector, metronome visualizer.
- `src/hooks/useAudioPlayback.ts`: scheduling and playback logic (critical path for beat timing and bugfixes).
- `src/hooks/useScheduler.ts`: timer scheduling / worker-like loop.
- `src/constants/patterns.ts`: define available beat patterns.
- `src/config/audioSamples.json`: sample metadata.
- `public/sounds`: audio assets.

## Coding conventions
- Prefer functional React components with hooks.
- Keep audio scheduling in hooks (`useAudioContext`, `useScheduler`, `useAudioPlayback`).
- Keep UI details in presentational components (`BeatVisualizer`, `PatternSelect`, etc.).
- Use TypeScript types from `src/types/audio.ts` and `src/types.d.ts` as needed.

## Bugfix context (existing tickets)
- `BUGFIX_BEAT_DISPLAY.md`: beat display rendering issues.
- `BUGFIX_SCHEDULER.md`: timing / drift behavior.

## What to do first for the agent
1. Inspect `src/hooks/useAudioPlayback.ts` and `src/hooks/useScheduler.ts` to understand tempo calculation and UI binding.
2. Check `src/components/BeatVisualizer.tsx` for how beat indices are highlighted and displayed.
3. If adding features, validate with manual browser run (`npm run dev`) and console logs in the audio callback chain.

## Quality checks
- Ensure UI re-renders are efficient (avoid excessive state updates in interval callbacks).
- For audio timing, prefer small but consistent lookahead values to avoid drift (existing scheduler bugfixes are in docs). 
- Prefer minimal direct DOM manipulation; use React state/props.

## No tests section
- No test framework configured; changes should be tested manually in browser and through utility-level code reasoning.

## Prompt patterns for local agent
Use these when querying summarization or generate patch suggestions:
- "In Flamenco app, how should I fix tempo drift in `useScheduler`?"
- "Suggest refactor for `BeatVisualizer` to remove flicker on beat boundary."
- "Create a new pattern in `constants/patterns.ts` and update `PatternSelect` list."
