# Loop Vercel prototype

Integrated prototype package for GitHub and Vercel testing.

## Included

- Latest Loop prototype UI
- Course selector using the 5-course database
- Tee selector with par, yardage and stroke index attached to each hole
- Loop insight engine connected to review, next round plan, smart prompt and practice plan screens
- Single-select hole tags for tee shot, approach, short game and putting
- Logo asset in `public/loop-logo.png`

## Insight engine check

Open the Round Review screen after saving holes. The screen includes an `Insight engine` card marked `Connected and running`. The review, plan, prompt and practice screens are generated from the saved holes, selected course and insight rules.

## Local test

```bash
npm install
npm run dev
```

## Vercel build

```bash
npm run build
```
