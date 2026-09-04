---
name: hevy-style-dark-ui
description: Design system and UI conventions for this workout tracker app — dark theme tokens, typography, spacing, and component patterns. Apply automatically whenever building or modifying any screen, component, or style in this React Native/Expo app.
---

# Workout Tracker — Dark UI System

You are implementing UI for a minimalist, dark-themed workout tracker (React Native + Expo), in the spirit of Hevy. Every screen and component you touch must pull from the tokens below — never hardcode a color, spacing value, or font size inline.

## Token file

All tokens live in `theme/tokens.ts`. If it doesn't exist yet, create it before writing any screen. Every component imports from it — no exceptions, no local overrides of color or spacing.

```ts
export const colors = {
  background: '#0B0B0D',
  surface: '#18181B',
  surfaceElevated: '#212124',
  border: '#2A2A2E',
  textPrimary: '#EDEDED',
  textSecondary: '#8E8E93',
  accent: '#FF6A3D',       // placeholder — swap this one value if a different accent is chosen, nothing else should need to change
  danger: '#E5484D',
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

export const radius = { card: 14, pill: 999 };

export const typography = {
  numeral: { fontFamily: 'Inter_800ExtraBold', fontVariant: ['tabular-nums'] }, // weight/reps/time in logging grids
  heading: { fontFamily: 'Inter_700Bold' },
  body: { fontFamily: 'Inter_400Regular' },
  label: { fontFamily: 'Inter_500Medium', color: colors.textSecondary },
};
```

Use `@expo-google-fonts/inter` and load `Inter_400Regular`, `Inter_500Medium`, `Inter_700Bold`, `Inter_800ExtraBold` at app startup. Two weights would be lazy for this much numeric density — the extra weights are what let the logging screen (numerals) read as distinct from labels without switching typefaces.

## Color usage rules

- `background` is the screen base. `surface` is for cards/rows sitting on it. `surfaceElevated` is only for things floating above content — modals, the active-session bar, bottom sheets.
- `accent` is used in exactly one role at a time: primary CTA, the active/running state (timer, in-progress set), and completed-set checkmarks. Never introduce a second accent color for "variety" — one consistent accent used sparingly is what makes this read as sleek rather than busy.
- No gradients, no colored shadows, no soft `rgba(0,0,0,0.1)` card shadows applied uniformly to every surface — that's the generic SaaS-card look, not this app's. Separate surfaces with the `border` color or a subtle elevation (background vs. surface vs. surfaceElevated), not drop shadows.

## Typography rules

- Numerals (weight, reps, time, distance) always use `typography.numeral` with tabular figures, so a column of logged sets aligns visually.
- No ALL CAPS labels. No tracked-out "eyebrow" labels above section headers. Section headers are sentence case, `typography.heading`.
- One typeface family only (Inter). Don't introduce a second family for "personality" — the numeral/heading/body weight contrast is the personality.

## Component patterns

- **Card/row primitive**: `surface` background, `radius.card` corners, `spacing.md`–`spacing.lg` internal padding. Reuse this same primitive for routine rows, exercise rows, and history rows — don't invent a new card style per screen.
- **Set-logging row**: fields shown depend on the exercise's `tracking_type` (see spec.md §4) — weight+reps, time only, weight+time, distance+time, or count. Never show a field that doesn't apply to that exercise's tracking type.
- **Active session bar**: persistent, `surfaceElevated`, pinned near the navbar, shows running time in `typography.numeral` with `accent` color while active.
- **Empty states**: short, active voice, tell the person what to do next ("Add your first routine" not "No routines found"). No apologetic tone, no filler.
- **Bottom tab bar**: icons only or icon + short label, not both with heavy borders — keep it quiet, it's navigation chrome, not a focal point.
- **Touch targets**: minimum ~44pt height on anything tappable during an active session (set rows, +/- steppers) — this gets used mid-workout, sometimes with sweaty hands, not in a calm browsing context.

## What to avoid

- Don't default to a bright acid-green accent just because it's the common "dark fitness app" cliché — the placeholder `accent` above is a deliberate starting point, not that default. If asked to change the accent, change only the one token value.
- Don't add a "→" to buttons, don't join meta text with middle dots, don't add decorative numbering (01 / 02 / 03) unless the content is genuinely a sequence.
- Don't build a different card style, shadow, or corner radius per screen — the whole point of the token file is that changing one value restyles the whole app consistently.
