# Learn (feature/learn)

Owner: Learn assignee. Edit only `src/features/learn/**`. Public exports (do not rename): `LearnPage`, `LessonPage` from `index.tsx`.

## Personalization mode: deterministic, on-device
`logic/recommend.ts` is a pure function. Same inputs always give the same order. No server model, no provider keys, no network.
Inputs (all from `@/shared/state`): expertise, interests, Feed signals (stories read, their topic tags, wrong Feed-quiz answers), completed lessons and lessons in progress.

| Signal | Effect |
| --- | --- |
| Read a Feed story the lesson builds on (`feedHook.postIds`) | +5 |
| Shared interest | +3 each |
| Expertise vs difficulty | new: beginner +3, advanced −2 · familiar: intermediate +3 · expert: advanced +3, beginner −1 |
| Topic tags seen in Feed | +1 each, max 2 |
| Wrong Feed-quiz answer | beginner lessons +2 |
| Unmet soft prerequisite (newcomers only) | −3 |

Ties break by catalog order. The highest contribution becomes the one-line reason shown on the row.
A lesson already in progress is pinned first and is never reranked. Completed lessons go last and stay free to replay.
If a server model is added later, validate any returned lesson IDs against `CATALOG` and fall back to this function.

## Add a lesson (data only)
1. Create `catalog/lessons/<id>.ts` exporting a `Lesson` (see `types.ts`): story, one `interaction`, `quiz`, `explanation`.
2. Add it to `ALL_LESSONS` in `catalog/index.ts`. Lessons that fail `catalog/validate.ts` are not shown as available.
3. Interaction kinds: `passing-lanes`, `aggregate`, `sequence`, `classify`. A new kind = a type in `types.ts` + one component + one `case` in `steps/InteractionStep.tsx`.
Categories with no lesson show "Coming soon" in the Modules grid.

## Progress and scoring contract
- Steps: story(0) → interaction(1) → quiz(2) → explanation(3). `currentStep === 4` with `completedAt` set = finished.
- Saved under `answers.interaction` (`{ solved, state }`) and `answers.quiz` (`{ selected, firstChoice, correct, attempts }`).
- The quiz calls `scoreboardActions.recordFirstAttempt('soccer', exerciseId.lessonStep(lessonId, 'quiz'), correct)` on every check. Only the first call writes, so retries, replays and reloads add nothing.
- Paywall: `isLessonUnlocked` from shared state. After two distinct completed lessons the next one shows `MembershipCard`. "Try membership demo · No charge" calls `courseActions.startDemoMembership()`. Nothing is charged.

## Notes for the integrator
- Add the personalization mode above to the main README.
- `Pitch` uses its own SVG and only semantic tokens. No new dependencies.

## Learning path (Duolingo-style islands)
`/learn` is a winding path: level switcher (Beginner · Intermediate · Advanced), points / day-streak / lessons counters, an overall level progress bar, then 5 blocks per level. Each block has a colored banner (level and block number, `x/y lessons` bar, guide button) and zig-zag island nodes. The team avatar sits beside the path where the reference shows the owl.

- Structure: `catalog/path.ts`. Planned blocks without authored lessons show "Coming soon" and are never playable.
- **Rules basics** (`catalog/rulesBasics.ts`) is the first Beginner block: 10 short lessons (`/learn/rules-drill-*`), each with a key rule and a quick check, unlocked one by one, then a 10-question block quiz (`/learn/rules-basics-quiz`): counter, progress bar, instant feedback, results, pass at 7/10, Retry. A mid-quiz reload resumes the same question.
- Gate: newcomers (expertise `new` or not set) must pass Rules basics before other lessons and levels open on the path. Familiar/expert fans see it as an optional refresher. Deep links to course lessons (for example from Feed) always open, as journey 2 requires.
- Rules basics progress is stored in `course.lessons['rules-basics'].answers` and never calls `completeLesson`, so it does not use up the two free course lessons. Each drill check and quiz question scores 10 points on its first attempt only, through `recordFirstAttempt`.
- State is pure and tested in `logic/path.ts` (`buildPath`, `readRules`, `streakDays`).

## Illustrations
`art/Illustration.tsx`: 20 original vector scenes (pitch diagrams, scoreboards, cards, trophy and so on), drawn with semantic tokens only. No photos, club crests or logos. Every Rules lesson (`Drill.art`), every block-quiz question (`ChoiceQuestion.art`), every course lesson story (`Lesson.art`) and its quiz (`quiz.art`, or the tactical `diagram`), and every block banner (`PathBlock.art`) has one. Each scene has alt text in `ART_ALT`. `art/art.test.ts` fails if any item is missing a picture. To add a scene: add its ID to `ART_IDS`, its alt text and a drawing in `SCENES`.
