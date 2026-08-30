# Rebuild the Cancara "MVP Mobility" journey in the online Cancara Design System

## Context

There are **two** Cancara design systems:

- **OLD (local, reference only)** — `/Users/phillipclose/Documents/my-work/lldys-testing/GitHub/lldys-testing/`. Hand-built from the Figma files, inconsistent naming, gap-filled. It contains a complete, animated multi-page journey (the "01 MVP Journey"): you're in a Lloyds bank app, you onboard a car, a car spins, you add insurance/servicing reminders, and a mobility hub animates progress bars, ticks and newly-added list items. **This plan file itself lives at `/Users/phillipclose/.claude/plans/i-have-created-a-fancy-meteor.md` on the user's machine — the online agent cannot read that path directly; the user pastes/uploads it (and the OLD journey's page files) into the project's `uploads/` folder each session.** As of this update the following OLD-journey files are mounted in `uploads/` and are the ones to build against (not the local path above): `mobility-hub.html`, `mobility-hub.css`, `hub-navigation.js`, `hub-new-animations.js`, `hub-state-machine-simple.js`, `01-account-summary/account-summary.html`, `03-insurance-capture/insurance-capture.html`, `03-insurance-capture-success/insurance-capture-success.html` + `success-redirect.js`, `04-service-capture/service-capture.html`, `04-service-capture-success/service-capture-success.html` + `success-redirect.js`, `05-tax-added/tax-added.html`, `06-mot-added/mot-added.html`, `07-insurance-added/insurance-added.html`, `08-service-added/service-added.html`, `scripts/inline-svg-styles.css` + `inline-svg-loader.js`. Treat these mounted files as the literal source of truth for content/copy/sequence/dates to recreate — never copy their code or class names, only their structure and text.
- **NEW (online, the target)** — a token-driven, rule-governed Cancara system authored in Claude Design. A local mirror exists **for analysis only** at `/Users/phillipclose/Desktop/phill-os/claude/001-system-connect/incoming/Cancara Design System`. **We build on the ONLINE version, not this mirror.**

**Goal:** recreate the *exact journey and feel* of the OLD system's MVP journey — same screens, same sequence, same animations, same visual proportions — but authored **correctly** in the NEW system: its scaffolds, its namespace components, its tokens, its rules. We do **not** mirror the old system's structure, code, class names or naming; we use it only to understand *what* to build. Nothing from the old system is imported except assets we explicitly upload (the two car-spin videos).

Because the build happens in the ONLINE tool in a series of fresh chats, this plan is the **master brief**: it carries — in text — every layout, sequence, animation and proportion detail the online agent needs, since that agent cannot see either the old system or this file. Each online session builds a few pages, then emits a handoff prompt for the next chat.

---

## Decisions locked (from the user)

1. **Car spin = port the WebM movie.** Upload `car-spin.webm` (dark) + `car-spin-light.webm` (light) into the online project and play them in the hub hero. This is a **deliberate, owner-approved exception** to the system's "no media assets / CSS-only animation" rule — the online agent must *flag* it as an added asset, not treat it as a system component.
2. **Progress = prominent custom hero bar.** Rebuild the big inline "X% complete / N of 4 tasks" bar inside the hub hero from layout primitives + page-scoped CSS + token colours (green fill = `--background-sentiment-success` / brand green token). Flag that a reusable ProgressBar/Stepper component is missing from the system.
3. **Phased, multi-session build.** Build a few pages per online chat; each session ends by writing the next session's prompt (template in this plan). All pages, sub-journeys and animations get built across the sessions. Sequences must be in the correct order; layouts recreated in proportion to the old design, the new-system way.
4. **Use the NEW system's chrome — do NOT recreate the old.** The new system already provides the **index page**, the **account-summary** template, **tray** templates, and **light/dark theme control**. We do **not** rebuild any of these from the old journey — we copy the new scaffolds and **only move the old journey's *content* into them**. Old components **marry up to** new components (names differ between systems); where a bespoke layout is needed it must be **token-driven** and composed from primitives.
5. **Output = separate, downloadable pages that run locally in a browser.** The journey is authored as **one `.dc.html` page per screen**, linked by relative `<a href>`, so the whole journey can be **downloaded as a folder and opened/run locally**. Follow the system's standalone-demo pattern (`examples/journey-demo/journey-demo.html` — React + ReactDOM + Babel from CDN + `_ds_bundle.js`, namespace components as JSX) so it runs outside the dc-runtime. **Flag, don't guess:** if a clean double-click `file://` open isn't achievable (local asset/CORS restrictions may require a tiny static server e.g. `python3 -m http.server`), the agent states the exact run method and prompts the user rather than guessing.
6. **Hard rule — stop and prompt on any big obstacle.** If a component/asset can't be found, a rule conflicts, a mapping is ambiguous, or anything blocks progress, the agent **stops and prompts the user** — it never guesses or invents a workaround. Each session prompt names where the master plan lives so continuity is preserved: **`/Users/phillipclose/.claude/plans/i-have-created-a-fancy-meteor.md`** (held by the user; the agent asks the user to paste any part it needs).

---

## The NEW system in one screen (what the online agent must obey)

- **Point the agent at `readme.md` first**, then read in order: `CLAUDE.md` → `docs/journey-assembly.md` → `docs/page-archetypes.md` → `templates/` → `docs/component-usage-guide.md` → each component's `src/components/**/<Name>.prompt.md` + `.d.ts` → the voice/brand docs.
- **A journey is a separate project that *binds* Cancara.** Pages are `.dc.html` documents rendered by the dc-runtime (`support.js`). Components are placed as `<x-import component-from-global-scope="CancaraDesignSystem_4b0109.<Name>" base-path="../..">`. `ds-base.js` has one editable line (`const base = '../..'`) pointing at the bound system root, and links **`journey.css`** (NOT `styles.css` alone — the `.cnc-l-*` layout primitives live in `layout.css`, bundled only by `journey.css`).
- **Start every screen by copying a `templates/` scaffold** — never hand-build the shell. Scaffolds: `project-index`, `splash`, `account-summary`, `journey-page`, `journey-page-tray`, `question-page`, `action-menu`.
- **Non-negotiables:** token-driven only (`var(--…)`, no hex/rgb/invented values); **reuse components exactly** (never recreate/re-skin/override with external CSS — flag missing instead); never place `_`-prefixed internal components directly; **forward `base-path` everywhere artwork renders** or icons 404; **dark by default**, theme set on `<html>` pre-paint from `localStorage("cnc-theme")`, remaps the whole system; icons/pictograms/illustrations **by name, never inlined**; sentence case, no full stops in headlines, no emoji; **one decision/step per page**; content starts 24px below header, 76px clearance below last content (`.cnc-l-page-end`); 430px device frame.
- **Entry sequence is mandatory and fixed:** **Project Index → theme popup → journey.** (Splash is app-entry-only and optional — the old journey had none, so we skip it and go Index → Account Summary.)
- **Navigation:** static prototype = one `.dc.html` per screen linked by relative `<a href>` on `ActionButton`/nav `onClick`; forward steps get a **back arrow** (`Arrows/Arrow Left/Arrow Left`) + **slide-right** in, **slide-left** back (content region only; header/nav fixed). **Bottom-nav Home tab returns to the Project Index**; the other four tabs are inert chrome. Label each screen `[data-screen-label]`.
- **Custom layout/animation is allowed only as** layout primitives + **page-scoped `<helmet>` CSS/JS** (like the templates' own pinned tab band / fixed action bar) — never as a re-skin of a component. Transitions use `transitions.css` classes (`.cnc-view--slide-right/-left`, `--dissolve`, `.cnc-overlay-fade`, `.cnc-tray-up`) + `--cnc-motion-*`; all respect `prefers-reduced-motion`.

---

## Assets: what to upload vs. what already ships

**Upload into the online project (the only things ported from the old system):**
- `assets/videos/car-spin.webm` (dark, ~193 KB) and `car-spin-light.webm` (light, ~218 KB) — from the old system's `assets/videos/`. Optional: `car-spin-converted.mp4` (~169 KB) as a Safari fallback.

**Use the NEW system's shipped assets for everything else (do NOT port old raster/PNG/SVG assets):**
- Car imagery (tray result, detail pages, empty state): `SpotIllustration`/`Pictogram` **`Car`** / **`Car Finance`** (light+dark pairs ship in every palette). Replaces the old `renault-rafale-front.png`.
- Tick: `Icon` **`Action/Tick`** or **`Sentiment system/Success` / `Success Filled`**; success illustration: **`Complete`**.
- Pictograms: **`Car`**, plus finance/insurance/settings glyphs from `assets/pictograms/Generic/`.
- Icons: `Travel/Car`, `Security/Shield`, `Date and time/Calendar`, `Arrows/Arrow Left` + `Chevron Right`, `Navigation/Close`, `Action/Plus` + `Action/Tick`.
- Brand horse: `assets/components/Bank Logo/Lloyds/Lloyds.svg` (Index logo + "all caught up" motif).
- Illustrations for "Plan and prepare": **`Car Finance`** / **`Savings`** / **`Credit Score`**.
- Spinner: the `Spinner` / `NativeSpinnerConfiguration` components (replaces old spinner SVG frame sequences).

---

## Old → New page map (all screens, in sequence)

| # | Old page (reference) | New scaffold to copy | Role / key content |
|---|---|---|---|
| 0 | `index.html` | `project-index` | Launcher: horse logo, **one journey card** ("MVP Mobility Journey") → theme popup → Account Summary |
| 1 | `01-account-summary` | `account-summary` | Bank home. Seeded **"Manage my car" tile** + **"Home insurance" account row** already exist in the scaffold — reuse them. Car tile opens the onboarding tray |
| 2 | tray in `01-account-summary` | `journey-page-tray` (TrayTemplate over #1) | Onboard a car: reg entry (native keyboard) → search → vehicle result → Connect → loader → go to hub |
| 3 | `02-mobility-hub` | `journey-page` + custom hero | **Centerpiece.** Car-spin video, prominent progress bar, 2 ghost tiles (Insurance/Servicing), reminders list, completion notification, manage-vehicle tray |
| 4 | `03-insurance-capture` | `question-page` | Set insurance reminder: `CalendarPicker` + Set reminder / Skip |
| 5 | `03-insurance-capture-success` | `journey-page` (centered) | Tick + "You've added your insurance reminder" + Continue → hub (triggers increase animation) |
| 6 | `04-service-capture` | `question-page` | Mirror of #4 for servicing |
| 7 | `04-service-capture-success` | `journey-page` (centered) | Mirror of #5; Continue → hub → **100% completion** path |
| 8 | `05-tax-added` | `journey-page` | Tax reminder detail: hero panel (reg, tax date, warning tag, "Tax your vehicle" → popup), hint, accordion "Manage reminder" |
| 9 | `06-mot-added` | `journey-page` | MOT detail: alert banner + hero panel + **mileage graph → simplify** (no chart component; use a data-playback/panel and FLAG it) |
| 10 | `07-insurance-added` | `journey-page` | Insurance detail: hero panel pattern |
| 11 | `08-service-added` | `journey-page` | Servicing detail: hero panel pattern |

**Navigation / sequence flow (must be exact):**
- Index card → theme popup (Dark/Light, persisted to `cnc-theme`) → **Account Summary**.
- Account Summary → "Manage my car" tile → **onboarding tray** (over the page) → enter reg → search → result → "Connect vehicle" → **Mobility Hub** (first arrival plays car spin + progress→50%).
- Hub **Insurance ghost tile** → **Insurance Capture** → Set reminder → **Insurance Success** → Continue → **Hub** (progress 50→75%, insurance tick + list row added).
- Hub **Servicing ghost tile** → **Service Capture** → **Service Success** → Continue → **Hub** (progress 75→100%, servicing tick, completion notification "You're up to date").
- Hub reminders list rows → **Tax / MOT / Insurance / Servicing detail** pages; back returns to Hub with state preserved.
- Every internal page: back arrow → previous screen; bottom-nav Home → Index.

---

## Layout proportions per key screen (recreate the old visual rhythm, new-system way)

Each screen is a top-to-bottom stack in the 430 frame; sections 48px apart, 16px gutters, 76px end clearance.

**Account Summary** — status bar → header ("Hi Alex", leading **sun toggle**, trailing help + profile) → **sticky tab band** (Summary·Everyday·Save & Invest·Homes·Borrow·Insure, Summary active) → section **"Your accounts"** (Style-2 title + reorder icon; **3 account panels**: Club Lloyds £1,324.50, Monthly Saver £2,124, **Home insurance / Gold Cover**; action-colour border, name/desc left + balance right) → section **"Your spaces"** (`TileGrid` 2×2: Add accounts / **Manage my car** / Your credit score / Travel) → horse "all caught up" motif → bottom nav (Home active).

**Onboarding tray** (TrayTemplate over Account Summary, §12a overlay+class-flip) — grabber → header "Manage my car" + Close → 3 pictogram info rows → reg `TextField` (interactive, native keyboard) → **"Connect vehicle"** primary + "Browse without connecting" tertiary → on search: `Spinner` → **vehicle result panel** (`Car` illustration + "Renault Rafale" + plate) reveal → on connect: loader → close tray → navigate to Hub.

**Mobility Hub** — status bar → header ("Manage vehicle", back arrow → Account Summary, trailing sun toggle) → **HERO (custom, page-scoped, dominates upper third):** top row (`Car` pictogram + "Renault Rafale / VX73 TZB" + "Edit" link → manage tray); **car-spin `<video>`** (~16:9, theme-aware src, plays once then rests on last frame); **progress section** ("Your car profile is X% complete" + **bar: token track + green fill, ~20px tall, full radius** + "N of 4 tasks completed"); **dashboard grid: 2 `GhostPanel` tiles** side by side (Insurance / Servicing: title + "Get reminder" + plus button); hidden **completion `NotificationPanel`** ("You're up to date"). Then **reminders `ListActionGroup`** (Tax + warning tag "Due in 28 days"; MOT; Insurance [hidden until added]; Servicing [hidden until added] — each: icon + title + date + chevron). Then **"Plan and prepare"** (illustration panel "Finance your next vehicle" + Explore finance; two list rows: Set savings goals / Get a motor insurance quote; feedback "How are we doing?" + Give feedback). Then horse motif → bottom nav.

**Insurance / Service Capture** (question-page) — status bar → header (back arrow, "Set insurance reminder") → intro body (Style 6) → **one question block**: `CalendarPicker`, label = the question ("When is your insurance due?") → **fixed action bar** (`ActionButtonStack`: "Set reminder" primary + "Skip this step" tertiary) → bottom nav. Enters slide-right.

**Success (Insurance/Service)** — centered content: **`Complete` SpotIllustration** (or Sentiment Success) → title "You've added your insurance reminder" (Style 2/3) → short body → **"Continue"** primary → on click: mark task complete in state, navigate to Hub.

**Detail pages (Tax/MOT/Insurance/Servicing)** — header (back, title) → [MOT only: alert `NotificationPanel`/`ErrorBanner` "Your MOT is due in 30 days"] → **hero panel** (`.cnc-l-panel` with `Car` pictogram overlap; reg row "Renault Rafale | VX73 TZB"; service + date row + `NotificationTag` warning; primary "Tax your vehicle" → `CustomPopupModal`; `NotificationHint`; `Divider`; `Accordion` "Manage reminder" with cost rows + "Turn reminder off") → [MOT only: simplified mileage via `ListDataPlaybackGroup`/panel — FLAG missing chart] → bottom nav.

---

## Animation & state specs (recreate with page-scoped CSS/JS, vanilla, no libraries)

1. **Car spin** — hub `<video muted playsinline>`; JS selects src by theme (`data-theme` → dark/light webm). First hub arrival (state flag `hasSeenInitialAnimation` false): `play()` once, on `ended` pause on last frame, then kick the progress fill. Return visits: set `currentTime = duration; pause()` (static last frame). ~2–3s.
2. **Progress bar fill** — width `transition: width 1s ease`. **4 tasks = Tax, MOT (pre-seeded), Insurance, Servicing.** Base connected = **2/4 = 50%** (first arrival animates 0→50 after car settles); insurance added → **75%**; servicing added → **100%**. Percent text set discretely (not counted up); only the bar width tweens.
3. **Ghost tile → tick** — returning from a capture-success, the matching `GhostPanel`'s plus button flips (`rotateY(180deg)`, 0.6s), swaps `Action/Plus`→`Action/Tick`, subtitle → "Added", then the tile fades out (`opacity 0.4s`).
4. **Tile resolve** — when one ghost remains, the survivor expands to full width (flex transition). At 100%, both resolve and the completion `NotificationPanel` reveals (height/opacity 0.5s).
5. **Reminder list-item add** — the hidden row (Insurance/Servicing) animates `height 0→auto` + `opacity 0→1` (0.4s) to "add" it to the list.
6. **Cross-page state** — `localStorage` object `{ isConnected, completedTasks[], hasSeenInitialAnimation, lastCompletedTask }`. Carry "just completed X" (storage flag or `?completed=` query) so the Hub plays the increase choreography on arrival, then clears the flag so later loads render the final static state.
7. **Tray** — `.cnc-tray-up` + scrim fade via the §12a class-flip controller (mount → flip `--open` a tick later; close → remove `--open`, unmount after exit).
8. **Screen transitions** — forward `.cnc-view--slide-right`, back `.cnc-view--slide-left`, content region only; header/nav fixed; `prefers-reduced-motion` respected.

---

## Old → new asset/SVG marrying (grows every session — check here before adding a new mapping)

The OLD journey's `data-icon` / `data-pictogram` / `data-illustration` names do not exist in Cancara; every one must be resolved to a **real file that exists under the bound `_ds/<cancara>/assets/`** (copying it in from the full design-system project's `assets/` first if the bound copy is missing it — never inventing or re-drawing one). Resolved so far:

| OLD reference name | NEW Cancara asset (path under `assets/`) |
|---|---|
| `data-icon="edit"` (edit) | `icons/Edit/Edit/Edit.svg` |
| `data-icon="calendar"` (date-and-time) | `icons/Date & time/Calendar/Calendar.svg` |
| `data-icon="shield"` (security, insurance) | used as illustration instead: `illustrations/Default/Insure/Insure.svg` (+ Dark Mode) |
| `data-icon="car"` (travel, servicing) | used as illustration instead: `illustrations/Default/Repair/Repair.svg` (+ Dark Mode) |
| `data-icon="id"` (security, MOT) | `icons/Documents/Document Success 1/Document Success 1.svg` |
| back arrow (`arrow-left`) | `icons/Arrows/Chevron Left/Chevron Left.svg` (Cancara's Custom Header default leading glyph — a chevron, not a straight arrow; faithful Cancara equivalent, not a 1:1 icon match) |
| `action/plus`, `action/tick` (ghost tile flip) | `icons/Action/Plus/Plus.svg`, `icons/Action/Tick/Tick.svg` |
| `action/minus-alt-01` (remove vehicle) | `icons/Action/Minus Alt 01/Minus Alt 01.svg` |
| `notification-tag.tag-warning` "Due in 28 days" | Cancara `NotificationTag` — **gap:** the built `ListItemAction` row only wires the brand-green "NEW" tag type, no sentiment variant, so a row-level warning tag is not yet achievable faithfully; flagged, using description text and/or the NEW-styled pill as an approximation until the component gains sentiment support |
| `data-pictogram="Car_Lloyds_-_V2"` | Pictogram, `pictogramIcon="Travel/Car/Car"`, style default |
| `data-illustration="Financial_Planning_Lloyds_-_V2"` | `illustrations/Default/Financial Planning/Financial Planning.svg` (+ Dark Mode) |
| `Car_Finance_Lloyds_-_V2` (remove-vehicle illustration) | `illustrations/Default/Car Finance/Car Finance.svg` (+ Dark Mode) |
| `data-pictogram="Piggy_Bank_Lloyds_-_V2"` | Pictogram, `pictogramIcon="Finance/Piggy Bank/Piggy Bank"` |
| `data-pictogram="Insurance_Soft_Lloyds_-_V2"` | Pictogram, `pictogramIcon="Finance/Insurance Soft/Insurance Soft"` |
| `assets/brand/cancara-horse*.svg` ("all caught up") | `assets/components/Bank Logo/Lloyds/Lloyds.svg`, tinted via `Icon` `color="var(--icon-generic-brand)"` (same pattern as the Project Index logo) |
| `assets/icons/arrows/chevron-right` (list-item chevron) | built into `ListItemAction`'s own trailing action icon — no separate mapping needed |
| "Links" pictogram (tray intro row 3, "Connect and get going") | no "Links" icon exists in the icon library; substituted `icons/Cards/Card Linked/Card Linked.svg` (linking concept, closest available) |
| `Insurance Soft` used as an ICON glyph (hub "Get a motor insurance quote" row) | invalid — Insurance Soft only exists as a pictogram-category asset, not an icon-library name; substituted `icons/Security/Shield/Shield.svg` |
| `Financial_Planning_Lloyds_-_V2` (hub "Finance your next vehicle" panel) | confirmed via mounted `mobility-hub.html`'s `ill-default-alt-01` class: palette is **Default Alt 01**, not Default — `illustrations/Default Alt 01/Financial Planning/Financial Planning.svg` (copied into bound `_ds/` from the full design-system project, was missing) |
| `renault-rafale-front.png` (account-summary onboarding tray vehicle-result row) | **owner-approved exception**, overriding the earlier "no old raster assets" decision for this one row — user uploaded the actual photo and asked for it verbatim instead of the Car SpotIllustration substitute; ported to `assets/images/renault-rafale-front.png` |
| `assets/illustrations/default-alt-01/Tick_Lloyds_-_V2(.svg / _-_Dark_Mode.svg)` (insurance/service success tick) | `SpotIllustration` `illustration="Default/Complete/Complete"` (already present in the bound `_ds/cancara/assets/illustrations/Default/Complete/`, no copy needed) |
| old single success "Continue"/"Done" button (plain `<button class="action-button">`) | Cancara `ActionButton` (`variant="primary"`, `icon="Arrows/Arrow Right/Arrow Right"`) — a single full-width primary, not `ActionButtonStack` (no tertiary on success screens) |
| old capture-page inline calendar (`<input type="date">` + custom picker chrome, no real calendar surface) | Cancara `CalendarPicker` `interactive` + a real month-grid `Calendar` dropped into its `calendar` slot, driven by a page-scoped date-math helper (real current month, `onSelectDate`/`onPrevMonth`/`onNextMonth`/`onCancel` wired); closing the calendar after a pick is done by bumping a `key` on `CalendarPicker` (forces remount → its internal `open` state resets) since the primitive has no controlled-close prop — flagged as a page-level workaround, not a component change |
| old capture-page "Skip this step" tertiary button (no `onclick` in the reference — a dead button) | wired to navigate straight to `hub.dc.html` **without** writing `completedTasks` — a skip leaves the task ghost/incomplete; this is an inferred behaviour (the reference never wired it), flagged for owner confirmation |
| old `service-hero-panel` (Tax/MOT/Insurance/Servicing detail hero) | no such component in Cancara (flagged from Session 1 onward) — composed from `.cnc-l-panel` + `Pictogram` (absolute-positioned to overlap the panel's top edge, mirroring the hub hero's video-overlap trick) + registration row + `NotificationTag` `type="warning"` + optional `ActionButton`/`NotificationHint` + `Divider` + `Accordion`. `NotificationTag` ships a real `warning` type prop directly — no page-scoped colour override needed here (unlike the hub's list-row tag, which had to hack the brand-green "new" variant) |
| `data-icon="subscription"` (tax pictogram) | Pictogram, `icon="Miscellaneous/Subscription/Subscription"` |
| `data-icon="id"` (MOT pictogram, security) | Pictogram, `icon="Security/ID/ID"` — confirmed the file exists at this exact path (earlier plan entries guessed a Documents icon; this session found the real asset) |
| old MOT/Servicing alert `ServiceAlert` (clock icon + title/text + optional secondary button, e.g. "Update status"/"Update details") | `NotificationPanel` `sentiment="warning"` `layout="title-message"` `dismiss` — **but only on the MOT page**, per this session's explicit brief ("MOT only"); the Tax/Insurance/Servicing pages' equivalent alert banners are dropped as an intentional scope cut, not a mapping gap. The embedded secondary button ("Update status") has no equivalent in `NotificationPanel` (no button slot) and was dropped rather than faked |
| old policy-detail / cost-breakdown rows (plain `<div>` label:value pairs) | `ListDataPlaybackGroup` — each row is a `dataSet:1` item (`pairs:[{title,data}]`); a real reusable component instead of bespoke CSS rows |
| old MOT mileage bar chart (`.mileage-graph`, custom bars) | simplified to a single `ListDataPlaybackGroup` reading ("Mileage for your 2025 MOT" / "11,886 miles") — the OLD reference only gave relative bar heights for 2024/2025 with no per-year digits, so rather than invent numbers this keeps the one real figure supplied. **FLAG (repeats the plan's standing gap): no chart/graph component exists in Cancara** — a faithful mileage trend needs a chart primitive the system doesn't have |
| old advisory boxes (orange-LED left-border text blocks, Tax/MOT/Servicing) | kept as page-scoped layout (`.dp-advisory`, `border-left: 4px solid var(--border-sentiment-warning)`) — this is bespoke layout composed from a token border colour, not a component re-skin (no "Advisory" component exists), matching the journey-assembly allowance for page-scoped CSS built from primitives |
| old MOT "All MOT's" history rows (custom accordion-style list, pass/fail icon + date) | Cancara `Accordion` `usage="group"` rows (`position` top/middle/bottom), `icon="Sentiment system/Success/Success"` or `"Sentiment system/Cross/Cross"`, `content="text-only"` |
| old MOT "Last MOT" status chip (`Passed 21 Oct 2024`) | `NotificationTag` `type="success"` — reused as a small status pill rather than a bespoke pill (Cancara doesn't have a separate pill/chip component) |
| `CustomPopupModal`'s Figma-fixed 375×812 frame, used for the Tax "Tax your vehicle" / Insurance "Manage policy" leave-Lloyds confirmations | overridden via a scoped selector (`.dp-modal-overlay .cnc-cpm { width:100%; height:100% }`) to fill the 430 detail-page frame instead of a fixed 812px box — the same class of override already precedented for `ListActionGroup`'s fixed 375px lock (journey-assembly.md §9); the component itself is untouched, just resized to its container the way the doc's own escape hatch describes |
| servicing-added.html reg plate typo (`VX23 TZB`, vs. `VX73 TZB` everywhere else the vehicle appears — hub, tax, MOT, insurance) | corrected to `VX73 TZB` on the Servicing detail page for vehicle consistency; flagged as a deliberate deviation from that one source file's literal text |

The bound `_ds/` copy under this project ships a **trimmed asset set** (only what earlier sessions used) — several of the above illustrations (`Insure`, `Repair`, `Financial Planning`, `Car Finance`) had to be copied in from the full design-system project's `assets/illustrations/Default/` because they were missing. **Check the bound `_ds/` folder before assuming an asset is absent — copy it in from the full design-system project rather than substituting or inventing one.**

## Gap handling (flag, don't fake)

- **Progress bar** — no component; build page-scoped from primitives + tokens; FLAG a missing reusable ProgressBar.
- **Car spin video** — added media asset, against the "no media" rule; FLAG as owner-approved exception.
- **On-screen keyboard** — parked in the system; use the device's native keyboard via `TextField` `interactive`; FLAG.
- **Mileage graph (MOT)** — no chart component; simplify to a `ListDataPlaybackGroup`/panel read-back; FLAG a missing chart.
- **Hero panel / service-hero-panel** — no such component; compose from `.cnc-l-panel` + `Pictogram` + `NotificationTag` + `ActionButton` + `Accordion`; it's *layout*, not a re-skin.
- **Cross-page state + custom animations** — page-scoped JS in `<helmet>`; allowed as page behaviour, not a component override.

---

## Session plan (a few pages per online chat)

- **Session 1 — Entry + Account Summary + Onboarding tray** (pages 0,1,2). Set up project, bind Cancara, upload the 2 WebMs. Deliver: Index → theme popup → Account Summary → car tile opens tray → reg/search/connect → link out to Hub (placeholder). Full paste-prompt below.
- **Session 2 — Mobility Hub** (page 3). The centerpiece: hero + car-spin video + prominent progress bar + 2 ghost tiles + reminders list + completion notification + manage tray + the cross-page state model + first-arrival car-spin & progress→50% animation. Wire ghost tiles → capture pages (next session) and reminders → detail pages (later).
- **Session 3 — Insurance flow + return-to-hub increase** (pages 4,5). Insurance Capture + Success; the 50→75% increase choreography on return (tick flip, "Added", ghost fade, list-row slide-in). Completes one full add-a-reminder loop.
- **Session 4 — Service flow + 100% completion** (pages 6,7). Service Capture + Success (mirror); the 75→100% path + completion notification "You're up to date". **Done** — see Session 5 prompt below for the handoff.
- **Session 5 — Reminder detail pages** (pages 8–11). Tax, MOT (+ simplified mileage, flagged), Insurance, Servicing; wire hub list → detail → back with state preserved.
- **Session 6 — Polish & QA.** Both-theme pass, proportion check vs old, transitions/reduced-motion, `CLAUDE.md` self-check, flag list review.

Sessions can merge if a chat has capacity (e.g. 4 into 3). Each session **ends by writing the next session's prompt** using the handoff template.

---

## SESSION 1 — ready-to-paste prompt (online Claude Design)

> Paste everything between the lines into a fresh Claude Design chat that has the Cancara Design System available. Upload `car-spin.webm` and `car-spin-light.webm` (from the old system's `assets/videos/`) to the project first, or when the agent asks.

---
**PROJECT: "MVP Mobility Journey" — a Cancara journey (Session 1 of ~6)**

You are building a multi-page Lloyds "Reimagined" prototype journey on top of the **Cancara Design System**. **First, read `readme.md`, then follow its ordered reading list: `CLAUDE.md` → `docs/journey-assembly.md` → `docs/page-archetypes.md` → `templates/` → `docs/component-usage-guide.md` → each component's `.prompt.md` + `.d.ts` before you place it → the voice/brand docs.** Obey every rule there. Do not recreate, re-skin, or externally-override any component; if something is missing, **flag it — never fake it**.

**GLOBAL BRIEF (applies to every session — carry this forward verbatim into each handoff):**

The journey recreates, in Cancara, a bank-app car-onboarding flow with an animated mobility hub. Build it the Cancara way (scaffolds, namespace components, tokens, 430 frame, dark-by-default, base-path forwarded, one step per page, sentence case, no emoji). Match the **visual proportions and sequence** described below, but never copy any outside code or naming.

- **Reuse the system's own chrome — do not recreate.** The index page, the account-summary template, the tray templates, and light/dark theme control **all come from Cancara** — copy those scaffolds and move only the *content* into them. Never rebuild the index, account summary, trays, or theme logic from scratch. Components map onto Cancara equivalents (names differ); bespoke layout is token-driven and composed from `.cnc-l-*` primitives only.
- **Output = separate, downloadable, locally-runnable pages.** Author **one `.dc.html` per screen**, linked by relative `<a href>`, so the whole journey downloads as a folder and **runs locally in a browser** following the standalone-demo pattern (`examples/journey-demo/journey-demo.html`: React + ReactDOM + Babel via CDN + `_ds_bundle.js`, namespace components as JSX). Confirm and state the exact local run method; if a plain `file://` double-click won't work (may need a small static server), **say so and ask** — don't guess.
- **Stop and prompt on any big obstacle — never guess.** If a component/asset can't be found, a rule conflicts, or a mapping is ambiguous, STOP and prompt the user. The master plan for this whole build is held by the user at `/Users/phillipclose/.claude/plans/i-have-created-a-fancy-meteor.md` — ask them to paste any part you need.

Full screen list & sequence (built across sessions):
0. **Project Index** (`project-index` scaffold) — one journey card → theme popup → Account Summary.
1. **Account Summary** (`account-summary` scaffold) — bank home; reuse the scaffold's seeded **"Manage my car" tile** and **"Home insurance" account row**; the car tile opens the onboarding tray.
2. **Onboarding tray** (`journey-page-tray`) — reg entry (native keyboard) → search → vehicle result → Connect → Mobility Hub.
3. **Mobility Hub** (`journey-page` + page-scoped hero) — **car-spin video**, **prominent progress bar** (2/4=50% base → 75% → 100%), two `GhostPanel` tiles (Insurance/Servicing), reminders `ListActionGroup` (Tax, MOT, + Insurance/Servicing revealed when added), completion `NotificationPanel`, manage-vehicle tray.
4/6. **Insurance / Service Capture** (`question-page`) — `CalendarPicker` + "Set reminder" / "Skip".
5/7. **Insurance / Service Success** (`journey-page`, centered) — `Complete` illustration + Continue → hub (triggers the increase animation).
8–11. **Tax / MOT / Insurance / Servicing detail** (`journey-page`) — hero panel (`.cnc-l-panel` + `Pictogram` + `NotificationTag` + `ActionButton` + `Accordion`); MOT also gets an alert panel + a **simplified** mileage read-back (flag: no chart component).

Locked decisions & flagged exceptions:
- **Car spin = a ported WebM video** (`car-spin.webm` dark / `car-spin-light.webm` light), played in the hub hero `<video>`, theme-aware src. This is an **owner-approved exception** to "no media assets" — flag it as an added asset, do not treat it as a component.
- **Progress = a prominent custom hero bar** built from layout primitives + page-scoped CSS + token colours (green fill). Flag that a reusable ProgressBar/Stepper is missing.
- **Keyboard** = device-native via `TextField` `interactive` (the system's Keyboard is parked) — flag.
- All cross-page state + bespoke animations = **page-scoped `<helmet>` JS/CSS**, vanilla, no libraries, respecting `prefers-reduced-motion`.

State & navigation model: static prototype, one `.dc.html` per screen, linked by relative `<a href>` on `ActionButton`/nav `onClick`; forward = back-arrow + `.cnc-view--slide-right`, back = `.cnc-view--slide-left`; bottom-nav **Home → Project Index**, other tabs inert; every screen gets `[data-screen-label]`. Persist onboarding/task progress in `localStorage` (`{ isConnected, completedTasks[], hasSeenInitialAnimation, lastCompletedTask }`) so the hub can reflect and animate progress on return.

**SESSION 1 TASKS — build pages 0, 1, 2:**

1. **Set up the project:** bind Cancara, edit the single `ds-base.js` `base` line, link `journey.css` (not `styles.css`). Create an `assets/videos/` folder and add the two uploaded WebMs (ask me to upload them if not present).
2. **Project Index** (copy `project-index`): Lloyds horse logo top; **one** `ListActionGroup` card centered — "MVP Mobility Journey" with a car pictogram, a one-line description, chevron; footer divider + uppercase "Lloyds Cancara Designs". Card `onClick` opens the **`CustomPopupModal` theme chooser** (Dark/Light), persist to `localStorage("cnc-theme")`, then dissolve to Account Summary.
3. **Account Summary** (copy `account-summary`): keep the scaffold's chrome (header "Hi Alex", leading sun toggle, trailing help + profile; sticky 6-tab band, Summary active; bottom nav Home active). "Your accounts": 3 account panels incl. **Home insurance / Gold Cover**. "Your spaces": `TileGrid` 2×2 incl. **Manage my car**. Wire the **Manage my car** tile to open the onboarding tray.
4. **Onboarding tray** (use `journey-page-tray` / the §12a overlay pattern over Account Summary): grabber + header "Manage my car" + Close; 3 pictogram info rows; reg `TextField` (interactive, native keyboard, placeholder like "VG23 TZM"); "Connect vehicle" primary + "Browse without connecting" tertiary. On "search/connect": show `Spinner`, then reveal a **vehicle result panel** (`Car` SpotIllustration + "Renault Rafale" + the plate), then a loader, then close the tray and navigate to the **Mobility Hub** (create a minimal placeholder `hub` page for now — Session 2 builds it fully — and set `isConnected=true`, `hasSeenInitialAnimation=false` in state so Session 2's hub plays its intro).

Match the **layout proportions**: 430 frame, 48px between sections, 16px gutters, 76px end clearance; Style-2 first section title, Style-3 subsequent, Style-6 body. Theme (light/dark) is the system's own control — **don't recreate it**. Keep each screen a **separate `.dc.html`** linked by relative hrefs so the journey **downloads as a folder and runs locally in a browser**; confirm the exact local run method and flag if a static server is needed. Verify **light and dark** and run the `CLAUDE.md` self-check.

**AT THE END OF THIS SESSION:** report what you built and any flags, then **write the Session 2 prompt** for a fresh chat using this structure: (a) the GLOBAL BRIEF above, verbatim; (b) a short "**Already built**" list of pages 0–2 with their file paths, the state keys in use, and any deviations/flags; (c) the **Session 2 tasks** = build the **Mobility Hub** (page 3) — hero + ported car-spin video (theme-aware, plays once then rests) + prominent progress bar (base 2/4 = 50%, animate 0→50 on first arrival after the car settles) + two `GhostPanel` tiles (Insurance/Servicing, plus buttons) + reminders `ListActionGroup` (Tax w/ warning tag "Due in 28 days", MOT; Insurance & Servicing hidden until added) + hidden completion `NotificationPanel` + manage-vehicle tray; wire ghost tiles → (future) capture pages and reminders → (future) detail pages; implement the `localStorage` state model and the first-arrival car-spin + progress→50% animation; (d) the closing instruction to, in turn, write the Session 3 prompt.
---

## Handoff prompt template (what every session writes for the next)

Each online session, when done, produces the next prompt as:
1. **GLOBAL BRIEF** — copied verbatim (screen list, sequence, locked decisions/flags, state & nav model).
2. **Already built** — pages completed so far, their `.dc.html` paths, state keys/flags in use, component choices made, and any flagged gaps/deviations (so the next chat doesn't re-decide).
3. **This session's tasks** — the next Session block from the "Session plan" above, expanded with the relevant "Layout proportions" + "Animation & state specs" detail for those pages (pull the exact text from this master brief).
4. **Closing instruction** — verify light+dark, run the `CLAUDE.md` self-check, report + flags, then **write the following session's prompt** the same way.

> Subsequent sessions' task detail is in the **Session plan**, **Layout proportions**, and **Animation & state specs** sections above — the user (or the next chat) copies the relevant slices into each handoff. This master plan file is the source of truth if any chat loses context.

---

## SESSION 5 — ready-to-paste prompt (online Claude Design)

---
**PROJECT: "MVP Mobility Journey" — a Cancara journey (Session 5 of ~6)**

Read `readme.md` then its ordered reading list (`CLAUDE.md` → `docs/journey-assembly.md` → `docs/page-archetypes.md` → `templates/` → `docs/component-usage-guide.md` → each component's `.prompt.md`+`.d.ts` before placing it → voice/brand docs) before placing anything. Never recreate/re-skin a component from scratch without flagging first — but the user has authorized overruling a component's default styling via page-scoped CSS when it conflicts with the supplied reference files (used heavily in prior sessions: trailing chevrons, doubled gutters, tag sentiment colours, tile alignment, forced calendar-picker remounts — check `hub.dc.html` / `account-summary.dc.html` / `insurance-capture.dc.html`'s `<style>`/logic blocks for the pattern before re-deriving it).

**GLOBAL BRIEF (carry forward verbatim):** paste the full "GLOBAL BRIEF" block from `uploads/cancara-mvp-journey-plan.md` — the old→new asset-marrying table (now also covers the `Complete` success illustration, the single-primary success `ActionButton`, the interactive `CalendarPicker`+`Calendar` pairing, and the un-wired "Skip" behaviour) and the mounted OLD-journey reference file list are the source of truth.

**Already built:**
- `index.dc.html` (page 0), `account-summary.dc.html` (page 1) — as in prior handoffs, plus this session's polish (see below).
- `insurance-capture.dc.html` / `service-capture.dc.html` (pages 4/6) — question-page pattern: back arrow → `hub.dc.html`; lead body copy verbatim from the OLD reference; `CalendarPicker` (`interactive`) with label "Insurance due date" / "Enter service date", hint text verbatim (identical copy-pasted string on both pages, per the OLD reference); the calendar opens as a **page-scoped centered scrim overlay** (fades in, card scales up) holding a real month-grid `Calendar` mounted as template markup (current month, prev/next, select, cancel wired) — no generic centered-overlay component exists in the system (`CustomPopupModal` is a fixed alert-card shape, not a content slot), so this is bespoke layout, same allowed pattern as the tray overlay; `ActionButtonStack` primary "Set reminder" → the matching success page, tertiary "Skip this step" → straight back to `hub.dc.html` with **no state write** (flagged — the OLD reference never wired Skip, so this is inferred, not confirmed).
- `insurance-capture-success.dc.html` / `service-capture-success.dc.html` (pages 5/7) — journey-page, centered: `SpotIllustration illustration="Default Alt 01/Tick/Tick"` at size 128 (corrected twice this session — first from `Default/Complete` to `Default Alt 01/Complete`, then to the actually-correct `Default Alt 01/Tick`, matching the OLD reference's `Tick_Lloyds` artwork; both had to be copied into the bound `_ds/cancara/assets/illustrations/` from the full design-system project); title + two-line body verbatim (Insurance has no trailing full stop, Service's does — kept faithful); single primary `ActionButton` — **"Continue"** on Insurance, **"Done"** on Service; on click, reads/updates `cnc-mobility-state` (`completedTasks` push + `lastCompletedTask`), then navigates to `hub.dc.html`.
- `hub.dc.html` (page 3) — the ghost-tile `onAction`/ghost ➜ capture wiring was fixed (Servicing pointed at a nonexistent `servicing-capture.dc.html`, now `service-capture.dc.html`); the Insurance reminder-list row's icon was fixed (`Finance/Insurance Soft/Insurance Soft` doesn't exist as an icon — only as a pictogram — now `Security/Shield/Shield`, matching the plan's own asset table); both ghost tiles are now click-targets on their whole area, not just the trailing icon button. **The return-to-hub choreography was substantially rebuilt this session** — found and fixed real bugs, not just polish:
  - The car video was re-playing on every visit (the play-gate only checked a per-mount flag, not `hasSeenInitialAnimation`) — now it only ever autoplays on the true first-ever visit; every return visit sets it straight to its last frame, paused.
  - The progress bar's CSS transition was always-on, so every load (including plain static revisits) visibly tweened in from 0% — fixed by seeding the constructor's initial `pct` synchronously from saved state (no more 0%-flash, and 50%/75%/100% now genuinely persist across visits instead of resetting).
  - Rebuilt the full return sequence with delays re-derived from the mounted `hub-new-animations.js` (which nests everything inside an extra 400ms "settle" delay that was initially missed): bar tween → "Added" + tick-flip (with a `scaleX(-1)` compensation on the icon so the tick isn't mirrored) → ghost tile visibly **dissolves in place** (not an instant unmount) → only THEN removed from the DOM while the sibling's flex-basis animates open to fill the space (both were snapping before; the completed tile now collapses to 0% width in the DOM before removal, so the fill is an actual animated transition) → reminder list row reveal now height-tweens open (measured old/new height, same technique) instead of popping in.
  - The 75%→100% completion swap (ghost row + progress bar → "You're up to date" notification) now: dissolves the ghost row/progress bar in place (420ms) → THEN locks the hero panel's height, swaps in the notification (still invisible) → animates the panel to its new natural height while the notification fades in. Also fixed a real bug found along the way: an already-resolved ghost tile (completed in an earlier visit) could flash back into view during this transition — its visibility check didn't account for "done and not currently animating."
  - Hero video's top/bottom flex gap removed (extended its existing negative margin to vertical too); hero-section/reminders-section spacing corrected to the standard 48px rhythm (was 24px).
- Account-summary onboarding tray: step transitions (intro → searching → result → connecting) now fade in (`mv-step` class) instead of popping; the vehicle-result panel's padding corrected to match the OLD reference (8px, not the component's 16px default); the plate badge given a background so it reads as a chip; the car photo's baked-in ~40px transparent margin was trimmed at the source (`renault-rafale-front-trimmed.png`, 194×167 from 276×240) — the "too much space" complaint was the PNG's own padding, not CSS.
- State keys in use: `cnc-mobility-state` = `{ isConnected, completedTasks[], hasSeenInitialAnimation, lastCompletedTask }` (unchanged shape).
- **Flag for Session 5 — needs the user's/next chat's attention:** icons are rendering as solid unmasked squares in the actual live preview (confirmed via a true user-view screenshot, not just the html-to-image tool's known limitation). The SVG assets and `Icon` component's mask CSS are correct; the icon URL is served cross-origin through the preview's proxy domain, and browsers refuse to apply a CSS mask sourced without CORS headers, falling back to an unmasked box. This is a preview-environment asset-serving issue, not a markup or component bug — likely resolves once opened as a standalone/exported file (same-origin), but could not be fixed from inside the DC. Re-check at the top of Session 5.
- Other flags carried forward: the Skip-button behaviour above; the `CalendarPicker`-remount-via-key workaround (no controlled-close prop on the primitive); the reminder-row height-reveal is a measured height-lock/release rather than a native per-item transition (no per-item transition hook on `ListActionGroup`).

**SESSION 5 TASKS — build pages 8–11 (Tax / MOT / Insurance / Servicing detail):**

Build against the mounted `05-tax-added/tax-added.html`, `06-mot-added/mot-added.html`, `07-insurance-added/insurance-added.html`, `08-service-added/service-added.html`.

Detail pages (`journey-page`) — header (back → hub, title) → [MOT only: alert `NotificationPanel`/`ErrorBanner` "Your MOT is due in 30 days"] → **hero panel** (`.cnc-l-panel` with `Pictogram` overlap; reg row "Renault Rafale | VX73 TZB"; service + date row + `NotificationTag` warning; primary action button e.g. "Tax your vehicle" → `CustomPopupModal`; `NotificationHint`; `Divider`; `Accordion` "Manage reminder" with cost rows + "Turn reminder off") → [MOT only: simplified mileage via `ListDataPlaybackGroup`/panel — FLAG a missing chart component, do not fake one] → bottom nav. Wire hub's `reminderItems` row `onClick` handlers (already pointing at `tax-detail.dc.html` / `mot-detail.dc.html` / `insurance-detail.dc.html` / `servicing-detail.dc.html` in `hub.dc.html` — verify filenames match what you create) and each detail page's back arrow returns to the hub with state preserved (no state is mutated by viewing a detail page).

**Closing instruction:** verify light+dark, report what was built + flags, update `uploads/cancara-mvp-journey-plan.md`'s asset-marrying table with any new mappings, then write the Session 6 (Polish & QA) prompt using this same structure.
---

## SESSION 6 — ready-to-paste prompt (online Claude Design)

---
**PROJECT: "MVP Mobility Journey" — a Cancara journey (Session 6 of ~6, Polish & QA — final session)**

Read `readme.md` then its ordered reading list (`CLAUDE.md` → `docs/journey-assembly.md` → `docs/page-archetypes.md` → `templates/` → `docs/component-usage-guide.md` → each component's `.prompt.md`+`.d.ts` before placing it → voice/brand docs) before touching anything. Never recreate/re-skin a component from scratch without flagging first — but the user has authorized overruling a component's default styling via page-scoped CSS when it conflicts with the supplied reference files (used heavily across prior sessions: trailing chevrons, doubled gutters, tag sentiment colours, tile alignment, forced calendar-picker remounts, the `CustomPopupModal` 375×812 frame resize — check `hub.dc.html` / `account-summary.dc.html` / `insurance-capture.dc.html` / `tax-detail.dc.html`'s `<style>`/logic blocks for the pattern before re-deriving it).

**GLOBAL BRIEF (carry forward verbatim):** paste the full "GLOBAL BRIEF" block from `uploads/cancara-mvp-journey-plan.md` — the old→new asset-marrying table (now also covers the detail-page hero panel composition, the `NotificationPanel`-as-alert / `NotificationTag`-as-status-pill substitutions, the `ListDataPlaybackGroup`-as-label/value-rows pattern, and the `CustomPopupModal` frame-resize override) and the mounted OLD-journey reference file list are the source of truth.

**Already built — the full journey, pages 0–11:**
- Pages 0–7 (Index, Account Summary + onboarding tray, Mobility Hub, Insurance/Service capture + success) — see prior sessions' handoffs for full detail. This session additionally fixed two live review comments against these pages: the onboarding tray's vehicle-result photo was oversized (150px; corrected to the OLD reference's 120px) in `account-summary.dc.html`, and that same tray's step-to-step content swap (intro → searching → result → connecting) snapped its height instantly instead of animating — rebuilt with a measure/lock/tween pattern (matching the hub's existing hero/list height-tween technique) that cross-fades content while tweening the wrapper's height, gated behind `prefers-reduced-motion`.
- Pages 8–11 (`tax-detail.dc.html`, `mot-detail.dc.html`, `insurance-detail.dc.html`, `servicing-detail.dc.html`) — `journey-page` pattern: back arrow → `hub.dc.html` (no state mutated by viewing a detail page); hero panel composed from `.cnc-l-panel` + overlapping `Pictogram` + reg row + `NotificationTag` (`type="warning"`) + `Divider` + `Accordion` "Manage reminder" (`ListDataPlaybackGroup` cost rows + "Turn reminder off" `ActionButton`); Tax and Insurance additionally get a primary `ActionButton` ("Tax your vehicle" / "Manage policy") opening a `CustomPopupModal` leave-Lloyds confirmation (frame resized to fill the 430 page via a scoped override — flagged in the asset table); MOT additionally gets a `NotificationPanel` `sentiment="warning"` alert (dismissible), a simplified mileage reading (flagged: no chart component), a `TwoTabsFixed` (Last MOT / All MOT's), a `NotificationTag`-as-status-pill, 3 advisory boxes, and an `Accordion` group for MOT history; Servicing additionally gets the same 3 advisory boxes under "Issues from last MOT". Per the session brief's explicit scope, only MOT carries the alert banner — the OLD reference's Tax/Insurance/Servicing alert banners were intentionally dropped, not ported.
- Hub's `reminderItems` (`hub.dc.html`) already pointed at these exact filenames — confirmed matching, no changes needed there this session.
- State keys unchanged: `cnc-mobility-state` = `{ isConnected, completedTasks[], hasSeenInitialAnimation, lastCompletedTask }`.
- **This session's live review pass (pages 8-11)** fixed many real layout bugs found only once the pages were seen rendered, not caught by the build-time checklist: the hero pictogram's overlap/scale/clearance over the panel (multiple passes — a `!important` was needed because `journey.css`'s `.cnc-l-panel` padding shorthand loads after the page's own `<style>` and silently wins the cascade on equal specificity); the accordion's default "Heading" text and its `usage="single"` double side-gutter; `ListDataPlaybackGroup`/`ListItemDataPlayback` were being misused for the Policy details, cost-breakdown, and mileage rows (none of those are tappable playback rows in the OLD reference — replaced with bespoke `.dp-policy-row` token-driven rows, and the mileage row with a bespoke large-number reading, matching the reference's actual plain layout); `NotificationHint`/`NotificationPanel`/`ListDataPlaybackGroup`'s own fixed-375 or self-gutter locks needed the same scoped-override treatment as the hub's `ListActionGroup`; the "Manage reminder" accordion opened/closed with an instant snap — added a measure/lock/tween wrapper (same technique as the hub's hero/list height animations), reduced-motion aware; the MOT History accordion group was static (no `open`/`on-toggle` wired — now interactive per-row) and its pass/fail leading icons had no sentiment colour (fixed via a `currentColor` anchor on `.cnc-accordion__lead`, pinned per row to `--icon-sentiment-success`/`--icon-sentiment-critical`, same method as the icon-colour rule in `CLAUDE.md`). **Re-verify these four pages first** in Session 6 rather than assuming Session 5's summary was the final state — this list is more current.
- **Flags carried forward, still open:**
  - The cross-origin icon-mask rendering issue flagged at the top of Session 5 — re-check whether it still reproduces; if so this needs resolving before handoff since it affects every icon on every page in the actual live preview (not just a screenshot-tool artefact).
  - The Skip-button behaviour on the capture pages (never wired in the OLD reference; inferred as "no state write").
  - The `CalendarPicker`-remount-via-key workaround (no controlled-close prop on the primitive).
  - No reusable ProgressBar/Stepper, chart/graph, or generic centred-overlay component exists in Cancara — each was worked around with page-scoped layout per the plan's "Gap handling" section; note these as system gaps in the final report, don't re-solve them differently per page.
  - MOT/Servicing's old alert "Update status"/"Update details" secondary buttons have no `NotificationPanel` equivalent and were dropped (Session 5) — confirm this reads acceptably rather than as a missing action, or flag for a real fix.

**SESSION 6 TASKS — Polish & QA (final pass across all 12 pages):**

1. **Both-theme pass.** Open every page (`index` → `account-summary` → onboarding tray → `hub` → `insurance-capture`/`service-capture` → their success pages → `tax-detail`/`mot-detail`/`insurance-detail`/`servicing-detail`) in **both** light and dark via the header sun toggle / `localStorage("cnc-theme")`, confirming no hand-written dark overrides and no icon/illustration failing to swap.
2. **Proportion check vs. the OLD reference.** Compare section order/rhythm against the "Layout proportions" spec in the master plan — hero dominates the hub's upper third, progress bar prominent, 2 equal ghost tiles, 3 account cards, 2×2 tile grid, detail-page hero panel proportions. Reference the OLD journey's mounted HTML files (not the live local path) if anything looks off.
3. **Transitions & reduced motion.** Walk the full click-path (Index → popup → Account → tray → Hub → Insurance → Success → Hub increase → Service → Success → 100% → all 4 detail pages → back to Hub each time) confirming forward = slide-right + back arrow, back = slide-left, and that every custom animation (car spin, progress tween, tick-flip, ghost fade/collapse, list reveal, tray open/close, detail-page modal fade, onboarding tray step cross-fade) respects `prefers-reduced-motion`.
4. **`CLAUDE.md` self-check on every page:** grep each `.dc.html` for `rgba(`/`#[0-9a-f]{3,8}` outside copied asset paths — must be zero; confirm every colour/spacing/radius/type is `var(--…)`; confirm no invented tokens/variants; confirm every icon/pictogram/illustration is referenced by name, never inlined.
5. **Flag list review.** Compile the full, final flag list (icon cross-origin-mask issue, Skip-button inferred behaviour, `CalendarPicker` remount workaround, missing ProgressBar/chart/overlay components, MOT/Servicing dropped alert buttons, the `car-spin` video "no media assets" exception, the `renault-rafale-front.png` raster exception) into one place in the report — this is the definitive list for the project owner, not just this session's additions.
6. **Local-run confirmation.** Re-confirm the exact method to run the downloaded folder locally in a browser (plain `file://` double-click vs. a small static server) — state it plainly in the final report; don't guess if it's changed.

**Closing instruction:** this is the final planned session. Verify light+dark and the full click-path, run the `CLAUDE.md` self-check on all 12 pages, report what was built/fixed and the complete flag list, and update `uploads/cancara-mvp-journey-plan.md` one last time marking the journey complete (no Session 7 prompt needed unless new work is scoped by the owner).
---

---

## Verification (each session + final)

- **In-tool:** open each screen in the Claude Design live view; check the **430 frame**, **light AND dark** (toggle `data-theme`), no 404s (base-path forwarded), no visible scrollbars.
- **Downloadable / local run:** the journey exports as a folder of **separate `.dc.html` pages** and opens in a browser via the standalone-demo pattern (`examples/journey-demo/journey-demo.html`); confirm the exact run method (double-click `file://` vs. a small static server like `python3 -m http.server`) and **flag** to the user if a clean double-click open isn't achievable — do not guess.
- **Proportions vs old:** compare section order/rhythm to the "Layout proportions" specs (hero dominates hub's upper third; progress bar prominent; 2 equal ghost tiles; 3 account cards; 2×2 tile grid). Reference the old system locally only if needed: `/Users/phillipclose/Documents/my-work/lldys-testing/GitHub/lldys-testing/` (open `index.html` and the `journeys/01-mvp-journey/` pages in a browser).
- **Sequence:** walk the full click-path (Index → popup → Account → tray → Hub → Insurance → Success → Hub increase → Service → Success → 100% → detail pages → back), confirming order and back-navigation.
- **Animations:** car spin plays once then rests; progress tweens 50→75→100; tick flip + "Added" + ghost fade; list-row slide-in; completion notification at 100%; `prefers-reduced-motion` honoured.
- **`CLAUDE.md` self-check:** zero hardcoded hex/rgb outside token files; every colour/spacing/radius/type via `var(--…)`; dark mode with no hand overrides; no invented tokens/variants; icons by name; all flagged gaps recorded.
