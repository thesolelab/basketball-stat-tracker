# Instructions for Codex

These instructions apply throughout this repository.

## Branches and pull requests

- Start each new task on a separate branch based on the latest `main`. Use a descriptive name such as `fix/login-error` or `feature/player-search`.
- If the current session already has a branch dedicated to this task, continue on it. Do not discard uncommitted work or overwrite another person's changes.
- Never commit or push directly to `main`. Do not force-push.
- Keep each branch and pull request focused on one task.
- Run relevant checks, review the diff, then open a pull request targeting `main` when the changes are ready.
- Do not merge pull requests unless the repository owner explicitly asks.
- If repository access or permissions prevent this workflow, explain the blocker instead of changing `main`.

## Making and checking changes

- Read the README and any applicable directory instructions before editing.
- Follow the existing project structure and coding conventions. Keep changes limited to the requested task.
- Use the project's documented checks when available. For behavior changes, verify the affected functionality; for visual changes, check the page in a browser when possible.
- Do not invent test commands or claim checks passed when they were not run. Explain any checks that could not be completed.
- For documentation-only changes, review the text and diff; application tests are not required.
- Never commit passwords, API keys, tokens, or private user data.

## Explaining the work

- Use beginner-friendly language and explain unfamiliar Git or coding terms when needed.
- In the pull request, describe what changed, why it changed, and how it was checked. Mention any remaining limitations.
- Share the pull request link and explain the next step for the owner.

## Design System: Basketball Stat Tracker, "Court HUD"

A dark, sharp, gaming-HUD interface with basketball DNA: court lines,
scoreboard digits, jersey styling, and net/ball texture details.
Think NBA 2K player card meets arena scoreboard.

### Scope (read first)

Restyle visually only. Do NOT change functionality or data logic:
- Game setup, live tracking, undo ("Correct"), end/cancel game,
  resume/discard flow, edit completed game, season stats, game
  history, share stats, and sync status must work exactly as before.
- Do not change stored data formats, stat calculations, or routes.
- Keep `meta theme-color` and viewport settings.

This is used courtside on a phone, often one-handed, often in
glare or a dim gym. Speed and legibility beat decoration. If a visual
effect slows a tap, delays input, or hurts readability, remove it.

### Palette rule

Graphite/charcoal surfaces (not pure black), white text, and ONE brand
accent (the site's existing red `#c8102e`). Near-black is reserved for
the live scoreboard header and inset fields. The only extra colors
allowed are functional:
- Made shot: green (--made)
- Destructive actions: the red accent family (--danger)
- Warm "hardwood" tone: a very dark amber tint used ONLY in
  background textures at low opacity (never for text or buttons)

No rainbow category colors. No gradients on interactive surfaces.

### Step 1: Tokens

Define in :root and use ONLY these variables (no hard-coded colors
in components).

```css
:root {
  --bg: #1a1c20;                 /* lifted graphite page background */
  --bg-elevated: #23262b;        /* panels, header bar, modals */
  --surface: rgba(255, 255, 255, 0.06);
  --surface-inset: #121417;      /* inputs, tiles: darker than page = depth */
  --scoreboard-bg: #0d0e10;      /* live score header ONLY, darkest element */
  --border: rgba(255, 255, 255, 0.14);
  --border-strong: rgba(255, 255, 255, 0.26);

  --accent: #c8102e;          /* existing brand red */
  --accent-hover: #e0183a;
  --accent-tint: rgba(200, 16, 46, 0.12);
  --accent-glow: rgba(200, 16, 46, 0.35);
  --on-accent: #ffffff;

  --made: #2ecc71;
  --made-tint: rgba(46, 204, 113, 0.14);
  --miss: rgba(242, 242, 242, 0.45);   /* muted, never loud */
  --danger: var(--accent);

  --hardwood: rgba(176, 120, 60, 0.09);  /* texture only */
  --court-line: rgba(255, 255, 255, 0.07);

  --text: #f4f4f4;
  --text-muted: rgba(244, 244, 244, 0.66);

  --radius: 2px;
  --font-display: "Barlow Condensed", "Oswald", system-ui, sans-serif;
  --font-body: "Barlow", system-ui, sans-serif;

  --tap-min: 56px;             /* minimum height of primary tap targets */
  --ease-snap: cubic-bezier(0.2, 0.9, 0.3, 1);
}
```

### Step 2: Typography

- Load Barlow Condensed (600, 700, 800) and Barlow (400, 500, 600)
  from Google Fonts. Fallback: Oswald, then system-ui.
- Display and numbers: var(--font-display), uppercase, bold/extra
  bold, tight tracking. All stat numbers use
  `font-variant-numeric: tabular-nums` so digits never jump.
- Labels (POINTS, REB, AST, FG%, section headers): 11-13px,
  uppercase, bold, letter-spacing 0.1em, var(--text-muted).
- Body copy: var(--font-body), 15-16px minimum on mobile.
- The live score and PTS number are the largest text in the app.

### Step 3: Global look

- Background: var(--bg) with two stacked subtle textures:
  1. A faint basketball court line drawing in SVG
     (half-court: key/paint rectangle, free-throw circle, three-point
     arc) in var(--court-line), anchored behind content, fixed, low
     opacity, never competing with text.
  2. A very light hardwood tint (var(--hardwood)) as a soft vertical
     wash at the edges, optional.
- Optional: a corner radial glow using var(--accent-glow) at ~6%
  opacity behind the header.
- **Depth rule (important):** the page is lifted graphite
  (var(--bg)), panels sit slightly lighter (var(--bg-elevated)),
  and anything that should feel "inset" (inputs, stat tiles, shot
  buttons' wells, score chips) is darker than the page
  (var(--surface-inset)). The darkest element on any screen is the
  live scoreboard header (var(--scoreboard-bg)). Do not use pure
  #000 anywhere. This contrast keeps the app from feeling flat or
  heavy.
- Border radius is var(--radius) everywhere. No pills, no big
  rounded cards.
- Respect safe-area insets (notch, home indicator) with
  `env(safe-area-inset-*)` on headers, footers, and bottom action
  bars.

### Step 4: Signature basketball + gaming details

Use these consistently; they are what make the app feel designed:
- **Jersey trim stripe:** panels/cards that represent the player get a
  3px accent stripe on the left edge, like the side panel of a jersey.
- **Corner brackets:** an 8px L-shaped bracket in var(--border-strong)
  on the top-left of main panels (HUD frame feel).
- **Clipped corner:** primary and active buttons use one clipped
  corner: `clip-path: polygon(0 0, 100% 0, 100% 70%, 92% 100%, 0 100%)`.
- **Jersey number watermark:** show the player number (#2) as a huge,
  faint outlined numeral (about 4-6% opacity) behind the live-game
  header and the home player card.
- **Net texture:** a very faint diagonal crosshatch (net/mesh) behind
  hero score areas, under 4% opacity.
- **Ball seam divider:** section dividers may use a thin line with a
  small curved seam notch at the center, in var(--border-strong).
- **Shot clock digits:** the score and big counters use a slightly
  wider-tracked, scoreboard-style numeric treatment.

### Step 5: Screens and components

#### Home (player card)

- Player name (ADDYSON) in display type, huge, with the number badge
  (#2) beside it. Season label small and muted ("2026-27 SEASON").
- Season record shown as a compact scoreboard chip (e.g. "0-0").
- Menu items (Start New Game, Season Stats, Game History) are large
  full-width rows: icon-free, uppercase title, muted subtitle, a
  chevron, 1px border, jersey stripe on the left. "Start New Game" is
  the primary row: accent background, clipped corner.
- Sync status ("Checking sync...") becomes a small status pill-less
  chip with a tiny dot: muted when checking, var(--made) when synced,
  var(--accent) on error.

#### New Game form

- Fields: dark inset inputs, 1px var(--border-strong), square, bold
  values, accent border on focus.
- Home/Away and Game Type: segmented controls, rectangular, selected
  segment filled with var(--accent), others transparent.
- "START GAME" is the primary clipped accent button, full width,
  at least var(--tap-min) tall.

#### Live Game screen (most important)

Layout, top to bottom:
1. **Scoreboard header:** background var(--scoreboard-bg) (the
   darkest element on screen, with a 1px var(--border) bottom edge
   and a 2px accent line) so it reads like an arena scoreboard
   sitting on the lighter graphite page. Huge POINTS number (display
   font, animated count when it changes), player name and #,
   opponent and Home/Away, game type tag. Jersey number watermark
   behind.
2. **Stat strip:** REB, AST, STL, BLK, TOV, PF, FG% as a compact row
   of mini-tiles (dark inset, tiny label, bold value). A tile
   pulses briefly (150ms) when its value changes.
3. **Shots section ("SCORING"):** three rows (2PT, 3PT, FT), each
   with a big MADE button and a smaller MISS button side by side.
   - MADE: var(--made) tint background, bold, shows "+2/+3/+1".
   - MISS: dark inset, muted text, "X" icon.
   - Running splits (FG 0/0, 3PT 0/0, FT 0/0) sit under the header
     as small numeric chips; optionally add a thin progress bar or
     ring per split showing percentage.
4. **Other stats grid:** OFF REB, DEF REB, ASSIST, STEAL, BLOCK,
   TURNOVER, PERSONAL FOUL as a 2-column grid of large tap tiles,
   uppercase label, icon optional. Turnover and Personal Foul use a
   subtle var(--accent) left stripe to signal negative stats.
5. **Recent actions ticker:** a one-line scrolling or stacked log of
   the last 3 actions ("3PT MADE", "REB", "2PT MISS") in small muted
   text under the shot section, so mis-taps are easy to catch.
6. **Bottom action bar** (sticky, safe-area aware): "Correct" (undo)
   on the left as a secondary button, "END GAME" on the right as the
   primary clipped accent button. "Cancel Game" is a small text
   button, visually separated and far from END GAME.

Interaction feedback (all under 200ms, never blocking input):
- Every tap: a press-down scale (0.97) and a brief accent flash.
- On a made shot: a floating "+2 / +3 / +1" rises and fades from the
  tapped button; the score number rolls up.
- Optional haptics: `navigator.vibrate(10)` on tap where supported,
  with a user-visible on/off toggle if a settings area exists.
- Respect `prefers-reduced-motion`: disable float/roll/pulse
  animations, keep instant color feedback only.

#### Milestone toasts

When existing stats cross a threshold, show a brief non-blocking toast
that auto-dismisses in ~2.5s, styled as a small HUD banner (clipped
corner, accent left stripe):
- Double-double, season-high points, 3+ threes in a game, etc.
- Compute only from stats the app already stores. Do not add new
  persisted data. Toasts must never cover the shot buttons.

#### Modals ("End this game?", "Correct stat", "Edit Game", etc.)

- Panel background var(--bg-elevated) with corner brackets and a 2px
  accent top line, square corners. Dim overlay (rgba black ~60%)
  with slight blur only if performance allows. The final-score row
  inside the modal uses var(--scoreboard-bg) as its backdrop.
- Title in display type. Final score row styled as a scoreboard:
  team name left, big numerals, team name right.
- Destructive confirm ("DISCARD GAME") uses var(--danger); the safe
  option is always visually dominant when the action is destructive.

#### Season Stats ("player card")

- Top block styled like a ratings card: PPG, RPG, APG as three huge
  numbers with tiny labels, record and games played as chips.
- Secondary per-game stats (SPG, BPG, TOV/G, PF/G) as a 2x2 or 4-up
  grid of inset tiles.
- Shooting: three rows (Field Goals, 3PT, Free Throws) each with the
  percentage large, makes/attempts muted, and a thin progress bar or
  arc. Empty state shows "—" and the bar at 0.
- Season Totals as a compact tile strip.
- Filter chips (All Games, Preseason, Regular, Tournament, Club):
  rectangular, active chip filled var(--accent).
- Optional: a "Career highs" strip (best points, rebounds, assists in
  a single game) if derivable from existing data.
- Empty state: a court-line illustration with a short line such as
  "Tip-off pending. Start Game 1 to light this up."

#### Game History and Game Details

- History list: each game is a row with a W/L badge (W in
  var(--made), L in var(--accent)), opponent, date, and final score
  in display type. Jersey stripe on the left, hover/press highlight.
- Game Detail: scoreboard header (KHS vs Opponent with big numerals,
  W/L badge), then box score tiles, shooting splits with progress
  bars, rebounding split. "EDIT GAME" secondary, "SHARE STATS"
  primary.

#### Share Stats

If the share action produces an image or text, restyle the output as
a recap card: dark background, jersey number watermark, big score,
stat line, shooting splits, date and opponent. Keep the existing
sharing mechanism; only change the visual template.

### Step 6: Rules

- One accent (red). Green only for "made". Everything else is
  black/charcoal/white.
- Avoid: neon text glow, glassmorphism, emoji icons, drop shadows
  heavier than a 1px border, gradients on buttons, pill shapes.
- Primary tap targets are at least var(--tap-min) tall with 8px+
  spacing. No tiny tap targets in the live game screen.
- Maintain WCAG AA contrast (white on red, dark text on light
  elements, muted text on graphite). Re-check muted labels against
  the lighter var(--bg) and var(--bg-elevated); raise
  var(--text-muted) opacity if any label falls below AA. Check
  outdoor/glare readability.
- No pure black (#000) backgrounds. Use var(--surface-inset) for
  inset elements and var(--scoreboard-bg) for the live score header.
- Inputs, selects, and stat tiles must always be darker than the
  surface they sit on, never the same shade or lighter.
- Every interactive element needs :hover (desktop), :active (press),
  and :focus-visible states.
- Decorative layers (court lines, net texture, watermark number) use
  `pointer-events: none` and sit behind content.
- Performance: no large images, no heavy filters; keep layout
  shifts at zero when numbers update.

### Workflow

1. Add tokens, fonts, and the global background (court lines, net,
   hardwood tint).
2. Restyle shared components (buttons, inputs, segmented controls,
   panels, modals, chips).
3. Rebuild the Live Game screen: scoreboard header, shot buttons,
   stat grid, recent actions ticker, bottom action bar, tap feedback.
4. Restyle Home, New Game, Season Stats, Game History, Game Details.
5. Add milestone toasts and the empty states.
6. Polish: spacing, alignment, motion timing, reduced-motion support.
7. Verify every flow still works (start, track, correct, end, save,
   edit, resume, discard, share, sync) with no change in stat results.
