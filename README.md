# Read the Game

Responsive web app (mobile + desktop) for US adults 25–45 who want to enjoy and understand soccer.
Four tabs: **Feed · Learn · Community · Account**. Guests use everything without registration; progress lives in the browser.

```bash
npm install
npm run dev        # http://localhost:5173
npm run check      # typecheck + unit tests
npm run build      # production build → dist/
npm run preview    # serve dist/ at http://localhost:4173 (SPA fallback on)
```

Stack: React 19 · TypeScript 6 · Vite 8 · react-router 7 (`createBrowserRouter`) · Vitest. Node ≥ 20.19.
Deploy: any static host. `vercel.json` (Vercel) and `public/_redirects` (Netlify) rewrite every path to `index.html`, so direct links and reloads work.

**Personalization mode:** deterministic, in-browser. No server model and no provider keys. The Learn owner implements the ranking function. If a server model is added later, validate the returned lesson IDs against the catalog.

---

## 1. Design handoff

### Attachments read (kept untouched in `docs/references/`)

| Repository file | Supplied as | Role |
| --- | --- | --- |
| `palette-what-we-value.png` | `1.png`, 2914×1400 | **Palette source.** Every brand color below was sampled from it. |
| `duolingo-onboarding-1-choose-course.png` | `2.png`, 588×1280 | Composition reference: list with icons, selected state, sticky CTA |
| `duolingo-onboarding-2-daily-goal.png` | `3.png`, 588×1280 | Composition reference: single choice with right-side tag, disabled CTA |
| `avatar-source-coach.png` | `4.png`, 1254×1254 | Team avatar (one pose). Original artwork. |

No separate UI-brief document was supplied. Screen requirements come from `CLAUDE.md`. Reference screenshots are design inputs only. Never ship them, the owl or any Duolingo logo.

### Palette (exact sampled values)

| Raw token | Hex | Where it appears in the palette document |
| --- | --- | --- |
| `--rtg-palette-purple` | `#5744D4` | Background (47% of pixels), purple text on the white card |
| `--rtg-palette-purple-deep` | `#4B32B2` | Diagonal bands |
| `--rtg-palette-black` | `#000000` | Value cards |
| `--rtg-palette-white` | `#FFFFFF` | Value card, text on black |
| `--rtg-palette-paper` | `#F2F2F2` | Headline on purple |
| `--rtg-palette-graphite` | `#262626` | Large glyph on black card |
| `--rtg-palette-mist` | `#E1E2EC` | Large glyph on white card |

Feature code uses **semantic tokens only**. Do not use raw `--rtg-palette-*` values or hex literals. All tokens are in `src/shared/brand/tokens.css` and load globally, so CSS modules can use them directly.

| Group | Tokens |
| --- | --- |
| Backgrounds | `--color-bg` `--color-bg-subtle` `--color-bg-brand` `--color-surface` `--color-surface-inverse` (black) `--color-surface-brand` (purple) `--color-surface-selected` |
| Text | `--color-text` `--color-text-muted` `--color-text-disabled` `--color-text-brand` `--color-text-on-brand` `--color-text-on-inverse` `--color-text-on-brand-soft` |
| Accent | `--color-accent` `--color-accent-pressed` `--color-accent-subtle` `--color-decor-on-inverse` `--color-decor-on-light` |
| Borders | `--color-border` `--color-border-strong` `--color-border-selected` `--color-focus-ring` |
| Feedback | `--color-success` `--color-success-subtle` `--color-danger` `--color-danger-subtle` `--color-danger-pressed` `--color-sponsored` `--color-sponsored-subtle` `--color-disabled-bg` |
| Spacing | `--space-0` `-1`(4) `-2`(8) `-3`(12) `-4`(16) `-5`(20) `-6`(24) `-8`(32) `-10`(40) `-12`(48) `-16`(64) |
| Type | `--font-sans` · `--text-xs` `-sm` `-md` `-lg` `-xl` `-2xl` `-3xl` `--text-display` · `--weight-regular` `-medium` `-bold` `-heavy` · `--leading-tight` `-snug` `-body` · `--tracking-display` |
| Radii | `--radius-sm`(8) `-md`(12) `-lg`(16) `-xl`(24) `-pill` `-none` |
| Other | `--lip-size` `--border-width` `--shadow-overlay` `--layout-max` `--layout-content` `--layout-gutter` `--nav-height` `--rail-width` `--tap-min` `--ease-out` `--duration-fast` `--duration-base` |

### Avatar

```tsx
import { BrandAvatar } from '@/shared/brand';
<BrandAvatar size="lg" state="correct" decorative />
```

| Prop | Type | Default |
| --- | --- | --- |
| `size` | `'xs'`(32) `'sm'`(48) `'md'`(88) `'lg'`(120) `'xl'`(176) or a number of px | `'md'` |
| `state` | `'idle' \| 'speaking' \| 'thinking' \| 'correct' \| 'incorrect' \| 'celebrate'` (subtle motion only, honors reduced motion) | `'idle'` |
| `decorative` | `true` when nearby text already carries the message | `false` |
| `label` | accessible name | "Coach, the Read the Game mascot" |

- Production file: `src/shared/brand/assets/coach.png`, 512×512, aspect ratio 1:1 (`BRAND_AVATAR_ASPECT`).
- The source had an alpha channel but an opaque white background. The production copy has the background removed with a soft edge. The original stays in `docs/references/`.
- **One pose only.** Show state through text, the bubble tone and layout. Never crop, recolor or flip the avatar.
- For an avatar + speech bubble, use `CoachPrompt` from `@/shared/ui`. It takes the owl's place in the references.

### Reference → our screens

| Reference | Our screen | Shared pieces |
| --- | --- | --- |
| `…-2-daily-goal.png`: back arrow + progress bar, owl + bubble, rows with right-side tag, disabled CTA until a choice | Onboarding step 1, "How well do you know soccer?" (`/`) | `ProgressBar`, `CoachPrompt` (avatar `lg`), `OptionCard mode="single"` with `trailing`, `Button size="lg" block` |
| `…-1-choose-course.png`: section header, rows with leading flag, selected row tinted with a colored border, sticky CTA | Onboarding step 2, interests (multi-select) | `OptionCard mode="multi"` with `leading` emoji, `fieldset` + legend counter |
| Same owl + bubble pattern (no reference screenshot supplied) | Lesson feedback and completion (Learn), empty and not-found states | `CoachPrompt tone="success" \| "danger"` + `state="correct" \| "incorrect" \| "celebrate"` |
| Bottom CTA with a 3D lip | Every primary action | `Button` / `ButtonLink` variants `primary` `secondary` `inverse` `ghost` `danger` |
| Black, white and purple value cards (palette document) | Editorial and highlight cards | `Card variant="inverse" \| "brand" \| "default" \| "subtle"` |

Disclosure labels: `<Badge variant="sponsored">`, `"demo"` (Demo event / Demo players) and `"reconstruction"` (Tactical reconstruction).

### Inferred design choices (not in the supplied files)

1. **Font:** Figtree (self-hosted through `@fontsource-variable/figtree`), a free geometric grotesk close to the palette headline. The real brand font is unknown.
2. **Supporting colors:** purple tint `#EFEDFB`, `#C9CADB`, slate text `#5C5D6B`, success `#0D7340`, error `#C62F3B`, sponsored amber `#8A5A00`. The palette has no feedback colors. All text pairs meet WCAG AA (≥ 4.5:1).
3. **Radii and 3D button lip** follow the Duolingo composition. The palette document's cards are square; `--radius-none` is available for them.
4. **Desktop navigation (≥ 1024 px):** the four bottom tabs become a left rail with the same four entries. Below 1024 px they are a bottom bar.
5. **Mascot name "Coach"**, the expertise tags (Beginner / Regular fan / Expert) and the interest emoji icons.
6. **Onboarding CTA copy:** "Continue" → "Start reading" ("Save and go back" when opened from a shared article).

---

## 2. Architecture and ownership

```
src/
  app/            App.tsx (route registry), AppShell (tabs), NotFound          ← Foundation
  onboarding/     two-step onboarding at "/"                                    ← Foundation
  shared/
    brand/        tokens.css, global.css, BrandAvatar, assets/coach.png         ← Foundation
    ui/           Button, ButtonLink, OptionCard, CoachPrompt, ProgressBar, Badge, Card, PageHeader, usePageTitle
    contracts/    types.ts (all shared types), catalog.ts (options, constants)
    fixtures/     ids.ts (stable IDs, deep links), demoPlayers.ts
    state/        storage adapter, actions, selectors, hooks (+ tests)
    routes.ts     paths, route builders, TABS
  features/
    feed/         index.tsx exports FeedPage, FeedPostPage                      ← Feed owner
    learn/        index.tsx exports LearnPage, LessonPage                       ← Learn owner
    community/    index.tsx exports CommunityPage, EventPage                    ← Community owner
    account/      index.tsx exports AccountPage                                 ← Account owner
```

Each feature folder currently holds a **minimal starter** page that already works against shared state. Owners replace the starter pages but **keep the export names in `index.tsx`**: `App.tsx` lazy-loads them by name.

Rules for feature branches:
- Edit only `src/features/<yours>/**`: pages, CSS modules (`*.module.css`), content catalogs, assets, tests (`*.test.ts(x)` run by `npm run check`).
- Do not import from another feature. Cross-tab links go through `routes.*`, and cross-tab data goes through `@/shared/state`.
- Do not edit `src/shared/**`, `src/app/**`, `package.json` or the lockfile. Send requests for new dependencies, contract changes or global styles to the integrator.
- Use semantic tokens. No hex literals in feature CSS.

### Routes and deep links (`@/shared/routes`)

| Builder | Path | Example |
| --- | --- | --- |
| `routes.onboarding({ returnTo?, edit? })` | `/` | `/?returnTo=%2Ffeed%2Fmessi-miami-debut-free-kick` |
| `routes.feed()` / `routes.feedPost(id)` | `/feed`, `/feed/:postId` | `/feed/liverpool-quick-corner-barcelona` |
| `routes.learn()` / `routes.lesson(id)` | `/learn`, `/learn/:lessonId` | `/learn/tactics-quick-corner` |
| `routes.community()` / `routes.event(id)` | `/community`, `/community/events/:eventId` | `/community/events/watch-party-orlando-city-fc-cincinnati-2026-11-19` |
| `routes.account()` | `/account` | |

`/` shows onboarding to first-time visitors and redirects returning visitors to `returnTo` or `/feed`. Tab routes never force onboarding, so shared links open immediately.

### Stable IDs (`@/shared/fixtures/ids`)

- `SEED_POSTS`: `messi-miami-debut-free-kick`, `messi-signs-with-inter-miami`, `liverpool-quick-corner-barcelona`, `carli-lloyd-2015-final-hat-trick`, `maradona-1986-england-two-goals`, `orlando-city-fc-cincinnati-2026-11-19-preview` (each with its `sourceUrl`)
- `SEED_LESSON_IDS`: `rules-aggregate-score`, `tactics-quick-corner`, `transfers-messi-to-miami`, `tactics-passing-lanes`, `history-maradona-1986`, `tournaments-2015-world-cup-final`
- `DEMO_GROUP.id`: `orlando-matchday-regulars`. `DEMO_EVENT.id`: `watch-party-orlando-city-fc-cincinnati-2026-11-19` (fictional venue "The Far Post Taproom", Orlando, FL; 7:00 PM ET on Nov 19, 2026)
- `DEMO_MATCH_ID`: `mls-2026-11-19-orlando-city-fc-cincinnati`
- `exerciseId.lessonStep(lessonId, stepId)` → `learn:<lesson>:<step>`. `exerciseId.feedQuiz(quizId)` → `feed:<quiz>`
- Constants (`@/shared/contracts/catalog`): `EXPERTISE_OPTIONS`, `INTEREST_OPTIONS`, `MODULE_CATEGORIES`, `SPORTS`, `FREE_LESSON_LIMIT = 2`, `POINTS_FOR_FIRST_CORRECT = 10`, `MEMBERSHIP_PRICE_LABEL = '$7.99/month'`, `DEMO_EDITION_DATE = '2026-11-14'`

### Guest state API (`@/shared/state`)

Storage key `rtg.guest`, envelope `{ version: 1, updatedAt, state }`. Every write re-reads the latest stored state and replaces **one slice**. No API saves a whole profile, so a stale component cannot erase another tab's data. Corrupt data falls back to defaults and is backed up to `rtg.guest.backup`. Changes made in another browser tab sync automatically.

```ts
// read
useGuestState(): GuestState
useGuestSlice('feed' | 'course' | 'community' | 'preferences' | 'scoreboard')

// preferences: editing never touches progress
preferencesActions.completeOnboarding(expertise, interests)
preferencesActions.setExpertise(expertise) / setInterests(ids) / toggleInterest(id)

// feed: views are unique per post ID
feedActions.markPostViewed(postId, tags)
feedActions.dismissQuiz(quizId) / answerQuiz(quizId, answerId, correct)   // first answer kept
feedActions.savePick({ matchId, pick: 'home'|'draw'|'away', homeGoals?, awayGoals? })

// course
courseActions.openLesson(lessonId, title)       // keeps currentStep + answers if already started
courseActions.setStep(lessonId, n) / saveAnswer(lessonId, stepId, answer)
courseActions.completeLesson(lessonId)          // distinct; replays don't double count
courseActions.startDemoMembership() / endDemoMembership()   // no card, no charge

// community
communityActions.joinGroup(id) / leaveGroup(id) / rsvp(eventId) / cancelRsvp(eventId)

// scoreboard: only the first submitted answer counts (10 pts if correct)
scoreboardActions.recordFirstAttempt('soccer', exerciseId, correct) → { awarded, alreadyAttempted, record }

// reset: call only after an in-page confirmation (Account owns it)
resetDemo()

// selectors
isOnboarded, viewedPostCount, hasMembership, isLessonUnlocked(course, id), freeLessonsRemaining,
resumableLesson, isGoing(state, eventId), isMember(state, groupId), goingEventIds, guestRecords, totalPoints
// demo leaderboard (@/shared/fixtures/demoPlayers)
buildDemoPlayers(now) → LeaderboardPlayer[] (isDemo: true), pointsWithin(records, days, now)
```

Paywall rule: the first two distinct completed lessons are free and stay free on replay. Any other lesson needs demo membership once two lessons are complete.

---

## 3. Open items

- **Avatar trademark check:** the supplied artwork shows a Nike swoosh and a "USA" crest that resembles the U.S. Soccer badge. The brief requires that the app make no claim of a real club, league or media partnership. Get a version with neutral marks before public release. To swap it, replace `src/shared/brand/assets/coach.png` with a 1:1 image that has a transparent background.
- The real brand font is unknown; Figtree is a stand-in.
- No reference screenshots were supplied for lesson feedback or completion. The pattern above is an extrapolation.
- The feature tabs are starters. Their content, seed-story summaries, lessons, venue details and full Account belong to the feature owners.
- Not yet deployed. There is no git remote yet.
