@AGENTS.md

## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. When in doubt, invoke the skill.

Key routing rules:
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → invoke /investigate
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Ship/deploy/PR → invoke /ship or /land-and-deploy
- Save progress → invoke /context-save
- Resume context → invoke /context-restore

## Portfolio sync

This project appears on Martin's portfolio at https://martingalaz.com. The site
reads project metadata from an Airtable base, so the portfolio updates itself —
no edits to martingalaz.com needed.

How it works:
- `.portfolio.json` (repo root) holds this project's portfolio card: name,
  status, url, year, tags, and EN/ES descriptions.
- `.github/workflows/portfolio-sync.yml` runs on push to `main` whenever
  `.portfolio.json` changes, and upserts the row in Airtable (keyed on `name`).
- martingalaz.com revalidates within 24h and shows the new data.

When this project's public-facing story changes (ships, gets a URL, status moves
Prototype → Live, new tagline), update `.portfolio.json` and push to `main`.
Don't change the `name` field — it's the upsert key.

Requires repo secrets `AIRTABLE_TOKEN` and `AIRTABLE_BASE_ID` (Settings →
Secrets → Actions).
