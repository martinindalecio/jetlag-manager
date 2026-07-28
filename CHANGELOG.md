# Changelog

## 0.2.0.0 — MVP

- Circadian engine (`lib/circadian/`): CBTmin/DLMO phase estimation, direction/shift-size resolution with 12h-wraparound inversion, light phase-response-curve seek/avoid windows, simplified sleep-window derivation, and a pure offline `getCurrentStatus` resolver — all recommendation timestamps are absolute UTC instants computed once at plan-creation time.
- Timezone handling (`lib/timezones/`) via `Intl.DateTimeFormat`, DST-safe, no bundled tz data; curated city/airport list (`lib/data/cities.ts`).
- Local-only persistence (`lib/storage/`): zod-validated `localStorage` CRUD for chronotype profile and trips — no backend, fully offline once a plan exists.
- Onboarding flow with MCTQ-lite chronotype capture and medical disclaimer (not FDA-evaluated, 18+ acknowledgment).
- Trip creation and plan timeline UI: create a trip, see the day-by-day seek-light/avoid-light/sleep schedule in destination-local time, with graceful clamping for short trips.
- Verified against the PRD's worked NY→Tokyo example: 11h delay over 8 days, confirmed both in unit tests and a live manual walkthrough.

## 0.1.0.0 — Unreleased

- Project scaffold: Next.js (App Router) + TypeScript + Tailwind v4 + Vitest + shadcn.
