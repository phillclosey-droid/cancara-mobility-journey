# Cancara Design System

A high-fidelity, modular design language for building and testing **Lloyds "Reimagined"** customer journeys. Cancara is intentionally lightweight: it runs locally (browser or any static server), needs no build step, and zips up cleanly to move between machines.

> **Brand scope:** Lloyds Reimagined only. GT Ultra is the sole permitted typeface. Everything is **token-driven** — no hardcoded colours, no invented values. See `CLAUDE.md` for the non-negotiable build rules that govern every change in this project, and **`docs/journey-assembly.md`** for how to assemble journeys on top of the finished system.

> **The docs, and what each owns** — so they never drift:
> - **`CLAUDE.md`** — the *rules* (brand scope, token architecture, icon-colour method, process, self-check). Non-negotiable, auto-applied every conversation.
> - **`docs/journey-assembly.md`** — the *how-to-build-journeys guide*: where journeys live, how they consume this system, the per-screen assembly recipe, and the open gaps. Read it once you start composing flows on top of the components.
> - **`readme.md`** (this file) — the *system guide*: what Cancara is, its token architecture, content/visual foundations, iconography, and folder layout. It does **not** restate the rules or repeat the per-component progress log.
> - **`docs/`** — the *guidance docs*: context for **why** the brand exists and **how** journeys should think, write and feel, plus which component to reach for. Guidance only — never defines tokens, components or visuals; where it and the system overlap, the system wins. `brand-principles.md` (positioning, outcomes, the Cancara philosophy + UX principles), `tone-of-voice.md` (the authoritative voice), `design-language.md` (brand-level colour/type/layout/illustration/icon thinking), `component-usage-guide.md` (when to use which component and how), and `page-archetypes.md` (specific-purpose page patterns). Read these when designing a journey, not when building a component.
>
> **Building a journey?** See the ordered reading list — **Building a journey — read these, in order** — directly below.

---

## Building a journey — read these, in order

A journey is a **separate project** that consumes this system. Point the AI at this `readme.md` first;
from here, read in this order:

1. **`CLAUDE.md`** — the non-negotiable rules (brand scope, tokens, icons, self-check). Applies to everything.
2. **`docs/journey-assembly.md`** — how to load the system (`.dc.html` + `<x-import>`), the **430 frame**,
   the layout primitives, the **theme model**, transitions, and the pre-ship checklist.
3. **`docs/page-archetypes.md`** — the entry sequence (**Project Index → theme popup → journey**) and the
   specific page patterns (index, splash, home, question page…).
4. **`templates/`** — the copy-me `.dc.html` scaffolds. **Start every screen by copying one** (430 frame,
   dark-by-default, theme wiring and chrome already correct).
5. **`docs/component-usage-guide.md`** — which component to reach for, and when not to.
6. **`src/components/**/<Name>.prompt.md` + `.d.ts`** — the per-component prop / variant / flag reference.
   Read a component's entry **before** you place it.
7. **`docs/tone-of-voice.md`** · **`docs/brand-principles.md`** · **`docs/design-language.md`** — the voice
   and the brand / visual intent behind the system.

> Binding Cancara brings the compiled bundle, tokens and `assets/` — **not** these markdown docs. Give a
> journey project the full set (copy the files above, or point the AI at them up front). `COMPONENT_BUILD.md`
> is **not** needed for journeys — it governs building the system's own components.

---

## Sources (source of truth)

These inputs live under `uploads/` and are the authority for the system. Do not assume the reader has them; they are recorded here for traceability.

| Source | What it provides |
|---|---|
| `uploads/lloyds_reimagined_tokens.json` | All design tokens — colour, spacing, radius, border, OS, typography (text styles), pictogram canvas. Themed tokens carry a `{light, dark}` pair; un-themed tokens (e.g. the **pictogram canvas** colours) are single values in the JSON and emit `:root` only — they are **extracted verbatim, never invented or given a hand-made dark value.** **990 tokens.** |
| `uploads/*.otf / *.ttf` (9 files) | GT Ultra fonts — Median (Thin/Regular/Bold/Black/Ultra + Lloyds-Bold) and Standard (Thin/Regular/Bold). |
| `uploads/components/**` (72 JSON) | Figma component extractions across ACTION · CONTENT · FORMS · NAVIGATION · NOTIFICATION · OS. Variants, sizing, padding, fills, strokes, radii, nested refs. |
| `uploads/Components/**` (38 SVG) | Component artwork: logos, headers, nav, spinner, picker, etc. |
| `uploads/Icons-pt1 + Icons-pt2` (~250 SVG) | The full 24-category line-icon set. |
| `uploads/Pictograms/Generic` (82 SVG) | Generic pictograms. |
| `uploads/<illustration variants>` | Spot illustrations, 156 subjects × light/dark, one folder per palette variant (Default, Default Alt 01/02, Primary, Primary Alt 01, … secondary variants pending). |

Where a token field is `null` in the Figma extraction, it was null in Figma — it is **not** substituted or guessed. Any such gap is flagged in code with a comment (e.g. the Icon 2px/3px padding).

---

## Token architecture (primitives → semantic → component)

Generated **verbatim** from the tokens JSON — never hand-edited. Regenerate from source if the JSON changes.

```
styles.css                  ← the one file consumers link
├── tokens/fonts.css        ← @font-face for GT Ultra (Median + Standard)
├── cancara-tokens.css      ← aggregates the token layers:
│   ├── tokens/primitives.css   spacing · radius · border-width · OS
│   ├── tokens/colors.css       semantic colour (--background-*, --text-*, --icon-*, --border-*)
│   ├── tokens/components.css    component tokens (--c-*)
│   └── tokens/typography.css    type scale (--type-styleN-*) + .type-styleN classes
└── tokens/base.css         ← minimal element defaults (token-driven)
```

**Naming (Option A — namespaced):** semantic colour names are 1:1 with source keys (`background-action-default` → `--background-action-default`). Component tokens take a `--c-` prefix; primitives take `--spacing-` / `--radius-` / `--border-width-` / `--os-`; typography objects split into `--type-styleN-size|line|weight|family|tracking` (CSS cannot hold a multi-field object in one custom property).

**Light / dark:** every themed token in the JSON is a `{light, dark}` pair. The generator emits the `light` value into `:root` and the `dark` value into `[data-theme="dark"]`. Switching `data-theme="dark"` on the page re-maps the **entire** system — there are **zero** hand-written dark overrides. Scaling variants (`…max100/135/160`) are intentionally excluded; default values only.

---

## Content

Voice, casing, punctuation, brevity and copy rules for journey screens — see `docs/tone-of-voice.md`. The brand philosophy behind the voice is in `docs/brand-principles.md`.

---

## Visual foundations

Brand-level colour intent, typography tone, layout, illustration and icon principles — see `docs/design-language.md`. For implementation, the tokens and components are authoritative; the design language doc provides intent and context.

---

## ICONOGRAPHY

- **Line icons** — 256 SVGs across 25 categories, mounted **verbatim** at `assets/icons/<Category>/<Icon Name>/<Icon Name>.svg`. Rendered by the `Icon` component, which **calls each file by `name`** (e.g. `<Icon name="Navigation/Home/Home" />`). **Colour is token-driven via CSS `mask`:** the source SVG is used as a mask and filled by a `var(--…)` colour token — default `currentColor` (so the glyph follows its container's `--text-*` token), or a pinned token via the `color` prop (e.g. a dedicated `--c-<component>-icon*` token). This maps light/dark automatically; the SVG is never edited and nothing is recoloured at journey level. *Caveat:* CSS `mask` doesn't render in the html-to-image screenshotter — masked icons look like solid squares in screenshots but render correctly in real browsers (verify via live view / computed style).
- **Multi-colour marks are never masked** (a mask flattens them): multi-colour brand marks (`Finance/Apple Pay`, `Finance/Google Pay`, `Brand/LBG Logo`) and all illustrations render verbatim as `<img>` via the `Icon` `asAuthored` prop / `SpotIllustration`.
- **Rule — reference, never inline:** the icon/asset library is large (~4,100 SVGs); **never inline SVG markup** into components, cards, or journey pages. Always call assets **by name** from `assets/`. Inlining the library does not scale.
- **Pictograms** — 82 generic glyphs at `assets/pictograms/Generic/<Name>/<Name>.svg`; the `Pictogram` component fills the masked glyph with `--c-pictogram-icon-<style>` on a `--c-pictogram-*-canvas-<style>` canvas.
- **Spot illustrations** — full-colour artwork at `assets/illustrations/<Palette>/<Subject>/`. **Light and dark artwork live in the SAME folder**: `<Subject>.svg` (light) sits beside `<Subject> - Dark Mode.svg` (dark) — the component swaps between the two source files on `[data-theme="dark"]` (an artwork swap, **not** a token recolour). The 12 palette categories are: `Default`, `Default Alt 01`, `Default Alt 02`, `Primary`, `Primary Alt 01`, `Primary Alt 02`, `Primary Alt 03`, `Secondary`, `Secondary Alt 01`, `Secondary Alt 02`, `Secondary Alt 03`, `Secondary Alt 04`.
- **Logos** — Lloyds black horse (`assets/components/Bank Logo/Lloyds/Lloyds.svg`), LBG group mark (`assets/components/Brand/LBG Logo/LBG Logo.svg`). The `Bank Logo/` group also contains non-Lloyds brands (BoS, Halifax, MBNA, SW) — present intentionally, to be removed manually.
- **No emoji. No unicode glyph icons.** Meaning is always carried by the SVG icon/pictogram set.

---

## Folder layout / manifest

**Root**
- `styles.css` — the single entry stylesheet consumers link
- `cancara-tokens.css` — token aggregator
- `CLAUDE.md` — universal non-negotiable rules (brand scope, tokens, icons, self-check, doc pointers)
- `COMPONENT_BUILD.md` — component build process rules (one component per conversation, Figma matching, sign-off)
- `readme.md` — this file (system guide)

**`tokens/`** — `fonts.css` · `primitives.css` · `colors.css` · `components.css` · `typography.css` · `base.css`

**`guidelines/`** — foundation specimen cards (Design System tab): Colors (Brand, Surfaces, Text & Border, Sentiment), Type (Display, Text, Small), Spacing (Scale, Radius), Brand (GT Ultra families, Logos, Iconography)

**`docs/`** — documentation: `brand-principles.md` (positioning, outcomes, Cancara philosophy) · `tone-of-voice.md` (authoritative voice) · `design-language.md` (brand-level colour/type/layout/illustration/icon thinking) · `journey-assembly.md` (wiring, layout, transitions, construction rules) · `page-archetypes.md` (specific-purpose page patterns) · `component-usage-guide.md` (when to use which component). Read when designing journeys; the curated source extractions remain under `uploads/`.

**`src/components/<category>/<group>/<Component>/`** — reusable primitives, mirroring the Figma hierarchy (category → group → component). Each folder holds the same four files: `<Name>.jsx` · `<Name>.d.ts` · `<Name>.prompt.md` · its `@dsCard` HTML. Private/nested helpers carry a leading `_` (Option B — built and exported, but never a Starting Point; see `CLAUDE.md`). Categories: ACTION · CONTENT · NOTIFICATION · NAVIGATION · FORMS · OS, then page-level TEMPLATES last.

**Component index (current — 73 built).** Names only — this is the canonical list of what the system provides. (The category subtotals below sum to 69 components + 4 templates = 73; the two **Keyboard** components remain parked — see below.)

- **ACTION** (12) — `Button/`: ActionButton · CompactButton · IconButton · LinkButton · `Button_Stack/`: ActionButtonStack · ChatButtonStack · LinkButtonStack · `Panel/`: Panel · GhostPanel · `Quick_Action_Button/`: QuickActionButton · `Tile/`: Tile · TileGrid
- **CONTENT** (11) — `Icon/`: Icon · Pictogram · SpotIllustration · `Divider/`: Divider · `Accordion/`: Accordion · `Category_Selection/`: SelectCategoryGrid · _SelectCategoryItem · `List/`: ListActionGroup · _ListItemAction · ListDataPlaybackGroup · _ListItemDataPlayback
- **NOTIFICATION** (10) — `Notification_Badge/`: NotificationDot · NotificationBadge · `Notification_Tag/`: NotificationTag · `Error_Banner/`: ErrorBanner · `Notification_Hint/`: NotificationHint · `Notification_Panel/`: NotificationPanel · `Coachmark/`: _Coachmark · CoachmarkPopup · `Pop-up_Modal/`: CustomPopupModal · PopupModalPresets
- **NAVIGATION** (10) — `Toggle/`: Toggle · `Pagination/`: _PaginationDots · Pagination · `Tabs/`: TwoTabsFixed · ThreeTabsFixed · TabCollectionScroll · `Bottom_Nav/`: BottomNav · `Header/`: CustomHeader · ModalStackHeader · PresetHeader
- **FORMS** (20) — `Text_Field/`: TextField · SortCode · Password · MIField · GlobalSearch · DropdownPicker · CountryPicker · CalendarPicker · _PhoneNumberField · PhoneNumberExtension · PhoneNumber · `Checkbox/`: Checkbox · CheckboxGroup · ConfirmationBox · `RadioButton/`: RadioButton · RadioButtonGroup · `Switch/`: _SwitchConfiguration · Switch · `Calendar/`: _CalendarDate · Calendar
- **OS** (6) — `Home_indicator/`: _Handle · HomeIndicator · `Spinner/`: _SpinnerSet · NativeSpinnerConfiguration · Spinner · `Status_Bar/`: _StatusBar _(remaining: Keyboard · Custom MI Keyboard)_
- **TEMPLATES** (4) — `templates/`: BaseTemplate · ActionMenuTemplate · ModalStackTemplate · TrayTemplate. Page-level scaffolds composing finished components (extracted at 375; a journey fills them to the 430 device frame with `.cnc-fill`); each has a plain `Container` layout frame and exposed `_Swap me out` content slots.

> The component index above is the canonical list of what the system provides. The build is complete — all 73 components are built and signed off; the only deferred items are the two Keyboard components (parked, see `docs/journey-assembly.md`) and the Spinner Set 2 gradient-export defect (cosmetic, never shown in production).

**`assets/`** (source artwork, not code, all mounted verbatim) — `fonts/` (9 GT Ultra) · `icons/` (256, 25 categories) · `pictograms/Generic/` (82) · `illustrations/<Variant>/` (12 variants, 3,744) · `components/<Group>/` (38 component SVGs) · `card-theme-toggle.js`

---

## Build status

**Complete.** Foundations (tokens, fonts, base, specimen cards), light/dark mapping, the asset library (~4,100 SVGs), and all 73 components are built and signed off. Deferred (not blocking journey work): the two **Keyboard** components are parked — their Figma extraction is only the outer shell, the key grids were never expanded, so they can't be built to the system's faithfulness bar without a fuller extraction — and **Spinner Set 2** carries a cosmetic conic-gradient export defect (never shown in production). To build on top of the system, see `docs/journey-assembly.md`.
