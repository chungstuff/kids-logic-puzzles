# Puzzle JSON Schema (finalized)

This is the real schema, replacing the illustrative-only example in `puzzle-authoring-context.md`. It's designed to represent both a single-grid puzzle (Hana's style so far) and a linked multi-grid puzzle (Perry's style so far) with one shape.

## Shape

```json
{
  "id": "field-day-mystery",
  "kid": "hana",
  "theme": "Field Day",
  "characters": [
    { "id": "panda", "label": "Panda", "icon": "panda" }
  ],
  "grids": [
    {
      "colCategory": "sport",
      "cols": [
        { "id": "swimming", "label": "Swimming", "icon": "swimming" }
      ],
      "solution": { "panda": "gymnastics" }
    }
  ],
  "clues": [ "Otter's favorite sport is Swimming." ],
  "hints": [ "Clue 1 just tells you Otter's answer outright — mark a check in Otter's Swimming box to get started." ]
}
```

## Field notes

- **`characters`** are the shared row entities (the "who") — always defined once per puzzle, even when there are multiple linked grids. Every grid's rows are this same character list.
- **`grids`** is an array, always. A single-grid puzzle (Field Day, Science Fair) has one entry. A linked multi-grid puzzle (Dance Studio, Art Studio) has two or more, each with its own `colCategory`, `cols`, and `solution`, but sharing the same `characters`.
- **`icon`** values reference keys in the shared `icons.js` library (e.g. `"icon": "panda"`). A puzzle should only use icons that exist there; new icons get added to the library when a new puzzle needs art that doesn't exist yet — not invented inline.
- **`solution`** maps each character id to the correct column id for that grid.
- **`hints`** are bespoke per puzzle and describe the actual next deduction step (not a generic "look at clue 2"). Order matters — the shell reveals them one at a time, in order, on repeated hint-button presses.
- **No `date` or `completions` fields live in this file.** This schema describes static puzzle *content* only. The daily pairing (one theme, two tiers, under a date key) and the completions/reset tracking are a separate concern, handled by the shell + Firestore once real daily batches are authored (Backlog Phase 4). These four converted files are standalone content for shell development and testing, not yet paired into dated two-tier documents.

## Minimum bar (per the PRD's difficulty-tier rules)

- 4×4 floor (at least 4 characters × 4 columns) for both kids' tiers.
- Linked multi-grid puzzles are fair game for either kid, not just the harder tier.
