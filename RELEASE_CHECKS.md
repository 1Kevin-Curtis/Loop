# Loop prototype release checks

This package includes the fixes requested after the production clean-up.

## Verified changes

- Course setup uses dropdown menus for course and tee selection.
- The 5-course database is loaded from `src/courseData.js`.
- Course setup shows a database summary: number of loaded courses, par and total yardage.
- The main Loop logo is in `public/loop-logo.png` and rendered by the welcome screen.
- Hole-by-hole tags are single-select within each section. Selecting a new tag replaces the previous tag in that section.
- The round review screen includes a visible insight-engine status card: `Insight engine · Connected and running`.
- Insight outputs are generated through `LoopInsightEngine.generateRoundInsights` using saved hole data and selected course name.

## Build check

Validated with:

```bash
npm ci
npm run build
```
