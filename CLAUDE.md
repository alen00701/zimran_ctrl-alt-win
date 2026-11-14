# Read the Game · Zimran Business Cup

Repository instructions for Claude Code and every other coding assistant. Each contributor receives one assignment: Foundation, Feed, Learn, Community, or Account. Work only on the assigned scope. Build a responsive **web application** for mobile and desktop browsers. All user-facing copy is in natural US English. The contest track is Entertainment. The audience is US adults aged 25–45 who want to enjoy and understand soccer.

## Design handoff — read the team's attachments first

Before styling, inspect the supplied palette document, UI brief, avatar artwork and Duolingo reference screenshots. They may be attached in chat or supplied as repository files. In the shared README record their actual filenames and a compact mapping from reference screen to our screen, shared components and avatar placement. Other contributors must be able to implement from the committed foundation even if they cannot see the integrator's chat. Treat raw reference screenshots as design inputs, not production assets.

The team's palette governs color. Take exact values from the palette document when specified. The UI brief governs screen requirements, typography, density and interactions. The team's avatar artwork governs the character's identity, proportions, colors and expression. Use Duolingo screenshots to understand hierarchy, pacing, placement, spacing, and feedback states. Build editable, responsive web components. Keep the four-tab product architecture. Mark any inferred design choice explicitly in the handoff. If a specific attachment cannot be read or two instructions materially conflict, identify the file or decision and continue independent foundation work.

Where a reference screen uses the Duolingo owl, render the supplied team avatar in that role. Apply this to every relevant appearance, including onboarding, lesson feedback and completion when shown in the references. Keep the original reference files intact. Preserve the supplied avatar's aspect ratio and transparency. If the team supplied one pose, reuse that pose across states and communicate the state with text and layout. If only a description or an unusable file is supplied, reserve the layout, identify the needed image, and continue the shell. Avoid shipping the owl, Duolingo logos or reference screenshots as UI backgrounds. A user's personal profile photo and the product mascot are separate assets.

The integrator owns src/shared/brand/ for production avatar assets, a reusable BrandAvatar component and semantic CSS tokens for backgrounds, text, accents, borders, feedback, spacing, typography and radii. Publish the component API, token names and import examples before feature work splits. The four feature owners consume these shared assets. Feature changes stay in their own directories.

Visually inspect the implemented onboarding and four shell routes at 375px and desktop width before handoff. Check the avatar in context, button contrast, text wrapping and bottom navigation against the supplied documents. At final integration repeat this check for lesson feedback and completion. Report the screens inspected and any temporary asset gaps.

## First commit — the integrator owns the foundation

Inspect the repository first. Preserve an existing usable web stack. For an empty repo use React, TypeScript and Vite. Build a runnable web shell, onboarding, shared design tokens, persistent guest state, typed contracts and a minimal working entry point for each of the four tabs. Verify the production build and direct URL reloads. Commit this foundation and share its commit ID before feature work begins. The first assignment ends here. The integrator later reviews and merges the four feature branches.

## Ownership and parallel work

| Assignment | Files it owns | Browser route |
| --- | --- | --- |
| Feed | src/features/feed/**, including its content, assets and tests | /feed and /feed/:postId |
| Learn | src/features/learn/**, including lessons, selection logic and tests | /learn and /learn/:lessonId |
| Community | src/features/community/**, including groups, events and tests | /community and /community/events/:eventId |
| Account | src/features/account/**, including profile, membership display and soccer scoreboard | /account |
| Foundation / integration | Everything outside those four directories, including onboarding, app shell, routes, shared types, storage, global CSS, manifest, lockfile, CI, deployment and README | / and shared navigation |

Each tab exports its page from its own index.tsx. Register all routes and tab entries in the foundation commit. Use feature-local CSS modules, assets and content catalogs. Each contributor starts a separate branch and separate checkout or worktree from the same foundation commit. Never have two assistants editing one working directory. No feature-to-feature imports. Use named routes and the shared guest-state API for cross-tab actions. Send requests for dependencies, shared contract changes or global styling to the integrator; do not edit common files in feature branches. The integrator publishes any necessary contract change once. Feature branches take that commit before depending on it. Keep formatting and tests within assigned paths.

## Shared contracts to freeze before splitting work

Publish exact TypeScript signatures, route builders, stable IDs, article/event deep-link examples and demo fixtures in the foundation commit. Feature owners must be able to run their tab against these immediately.

- Guest preferences: expertise (new, familiar, expert), selected interests, edit preferences without erasing progress.
- Feed signals: unique viewed post IDs, subject tags, dismissed/answered quiz IDs, saved match picks. Reading an article twice does not count as two articles.
- Course: stable lesson ID, current step, saved answers, completed lesson IDs, first scored attempt, demo membership. Two distinct completed lessons are free; replaying either stays free. Demo membership unlocks the third lesson.
- Community: join/leave by group ID and RSVP/cancel by event ID. Feed links to the same event ID that Community owns. Account reads the same memberships and RSVPs.
- Scoreboard: sport ID, exercise ID, points and date of first attempt. The first correct attempt earns 10 points when the first submitted answer is correct. Retrying and refreshing cannot add points. Weekly rankings use dated records and distinguish sample players from the guest.
- Use a shared, versioned browser-storage adapter with scoped updates. A write from one feature must preserve other features' state. Provide safe defaults and a confirmed full demo reset. Components must not overwrite a full saved profile with an old snapshot.

## Entry and navigation

First visit: “How well do you know soccer?” with “I’m new here”, “I know my way around”, “Try me. I know ball.” Then collect interests: tactics, strategy, techniques and skills, rules, players and biographies, transfers, club history, tournaments. Open Feed. Returning visitors resume without repeating onboarding. Support shared article links: open the requested story immediately, preserve its URL and offer personalization afterward.

Exactly four bottom tabs: **Feed · Learn · Community · Account**. Render a usable 375px-wide layout, keyboard controls, accessible buttons and desktop layout. Guests can use the full solo experience.

## Feed — a reason to open the app today

Build a dated editorial feed mixing real match moments, news, transfers, biographies, historical events, scandals, statistics and match previews. Rank the user's interests higher while keeping other subjects discoverable. Include the following sourced seed stories. Write original short summaries. Every card opens real content. Show the event date, publisher and direct source.

- Messi’s Miami debut and stoppage-time free kick: https://www.intermiamicf.com/news/match-recap-lionel-messi-scores-late-free-kick-winner-in-inter-miami-cf-debut
- Messi’s move to Miami and a short career timeline: https://www.intermiamicf.com/news/inter-miami-cf-signs-seven-time-ballon-d-or-winner-world-cup-champion-lionel-mes
- Liverpool’s quick corner against Barcelona and the aggregate score: https://www.uefa.com/uefachampionsleague/news/025d-0f5553e09799-f2005c82c870-1000--watch-in-full-liverpool-4-0-barca/
- Carli Lloyd’s hat trick and the long-range third goal in the 2015 final: https://www.ussoccer.com/stories/2015/07/world-champions-usa-wins-2015-fifa-womens-world-cup
- Maradona’s two goals against England and why the first was controversial: https://www.fifa.com/en/tournaments/mens/worldcup/articles/argentina-england-1986-diego-maradona
- For the November 14, 2026 demo edition, Orlando City–FC Cincinnati on November 19: https://www.mlssoccer.com/news/audi-2026-mls-cup-playoffs-field-set-and-wild-card-match-schedule-announced . Separate sourced facts, editorial opinion and the user's saved prediction. Show the edition date.

Verify at least one actual match clip via an official player or a direct “Watch the original” link to a page containing the footage. Label simulations “Tactical reconstruction”. After two distinct stories, offer a skippable one-question quiz about a story actually read, with feedback. Persist dismissal. Add a fictional publisher with shareable posts, a clearly marked sponsored merch card, and a promoted watch party linking to the Community event. The feed stays free.

## Learn — a subscription for tailored, authored lessons

Build a data-driven catalog with stable IDs, modules, difficulty, interests, prerequisites, media, exercises and correct answers. Support adding lessons as data. Ship at least six finished short lessons. Provide rules, tactics, strategy, techniques and skills, history, tournaments, biographies and transfers as extensible module categories. Only display playable content as available.

Use expertise, interests and quiz signals to choose and order existing lesson IDs. Newcomers can explore the aggregate score; experienced fans can analyze the quick corner; transfer fans can reconstruct Messi’s move. Each recommendation gives a short reason. When a server-side model is available, validate returned IDs against the catalog. For a standalone demo, ship deterministic selection using the same inputs and disclose the active mode in README. Keep provider keys server-side. Preserve any lesson already in progress when reranking.

Each lesson includes a story or game moment, one meaningful interaction, a quiz and an explanation. In a tactical lesson let the user move a defender and see the passing option change, then check understanding on a different setup. After two completed lessons, show the specific third lesson and what membership includes: the full personalized course, new modules and four prematch editions per month for **$7.99/month**. “Try membership demo · No charge” unlocks real content. No card or actual charge.

## Community — groups and matchday events

Ship a group with join/leave and a fictional sponsored venue with a watch party, match, date, local time, location, price and organizer. “I’m going” and cancel persist and are reflected in Account. Label the sample “Demo event”. The venue pays for placement in the business concept; admission to the demo event is free. The app makes no claim of an actual club, league, venue or media partnership.

## Account — preferences, membership and scoreboards

Show and edit expertise and interests, demo subscription status, resume lesson, achievements, groups and RSVPs through shared state. Link back to the owning tab for each action. Show separate scoreboards by sport, with Soccer as the one active vertical. Personal scores work for the first visitor; mark illustrative leaderboard entries “Demo players”. Include confirmed demo reset.

## Integration and release

Each feature owner verifies the assigned route, reload behavior and production build and reports the branch, changed paths and remaining issues. The integrator merges one feature at a time, checks overlapping files and tests cross-tab behavior in the browser. Confirm these journeys before publishing:

1. New guest selects interests → personalized feed and course → two real stories → contextual quiz.
2. Public article link → real footage → optional lesson → reload resumes the exact step.
3. Complete two distinct lessons → third is gated → demo membership unlocks it → free feed remains accessible.
4. Feed event → Community RSVP → Account reflects it → cancel persists after reload.
5. Account changes expertise → learning recommendations update → progress and scored attempts survive.
6. Confirm reset → test the expert route; verify mobile, direct URL reloads and desktop.

The 24-hour deliverable is a working website and public GitHub repository with build instructions, personalization mode and a two-minute jury walkthrough. Verify deployed URLs as a guest when publishing access is available. Contest weights: working product and engineering 40%, paid value and retention 20%, user understanding 15%, business potential 15%, originality 10%.
