# Basketball stat tracker

A mobile-friendly tracker for one player's basketball games and season statistics.
It runs as a static website, including on GitHub Pages; production needs no npm
packages or build step.

## Run locally

From the repository directory, run `python3 -m http.server 8000`, then open
http://localhost:8000. Use a local web server rather than opening the HTML file
directly so browser storage and sharing behave consistently.

## Structure

- `index.html`: screens, forms, and dialogs.
- `css/styles.css`: responsive styling and feedback.
- `js/persistence.js`: browser storage, game numbering, and synchronization.
- `js/sharing.js`: canvas stat cards and image sharing/downloads.
- `js/app.js`: game state, statistics, navigation, and event handlers.
- `js/presentation.js`: Court HUD decorations, recent plays, progress bars, and milestone feedback.
- `tests/frontend.test.cjs`: Chromium regression tests with a mocked backend.

The Court HUD design system is documented in `AGENTS.md`. Its visual feedback
uses existing stats and does not add persisted data. Google Fonts supplies Barlow
and Barlow Condensed; local system fonts remain available if fonts cannot load.
Reduced-motion preferences disable animation.

Scripts load in the order listed in `index.html`. They share the existing browser
script scope; this keeps deployment compatible with GitHub Pages without a bundler.

## Data and synchronization

An active game is saved to this browser after every recorded action. Completed
games are saved locally before uploading. The `basketballStatTracker.*` localStorage
keys hold the active game, completed games, remembered player number, next game
number, and queued deletion IDs. Clearing browser data removes unsynced games.
Active games are local to the device; only completed games sync.

`API_URL` in `js/app.js` points to an external Google Apps Script deployment, whose
source is maintained separately. This frontend retains its existing contract:

- GET returns `{ "success": true, "games": [...] }`.
- POST with `{ "action": "saveGame", "game": {...} }` saves a game by ID.
- POST with `{ "action": "deleteGame", "id": "..." }` deletes a game by ID.
- Successful POST responses contain `{ "success": true }`.

Pending local edits take precedence over downloaded copies. An upload only marks
the exact uploaded snapshot as synced. Failed work retries with a delay increasing
from 5 seconds to at most 60 seconds while online. Requests time out after 20 seconds.
Deletion IDs remain queued until local and remote removal succeed. Save/delete
operations on the backend should be safe to repeat after uncertain network results.

No Apps Script or Google Sheets changes are required for these frontend fixes.
There is still no server-enforced conflict detection between different devices;
that requires a backend revision protocol. Season selection remains configured by
`CURRENT_SEASON` in `js/app.js`; changing it does not migrate old records or reset
the existing stored numbering counter.

If a save warning appears, keep the tab open and free browser storage before trying
again. The app preserves the active game in memory when finishing cannot be saved.

## Checks

Use Node.js 20 or newer:

```sh
npm ci
npx playwright install chromium
npm run check
npm test
```

To use an existing Chromium installation, set `CHROMIUM_PATH`, for example:
`CHROMIUM_PATH=/usr/bin/chromium npm test`.

The browser tests intercept Google Apps Script requests; they do not modify live
Google Sheets data. They cover failed uploads, edits during acknowledgment, active
game numbers, deletion retries, storage failures, keyboard dialogs, PNG generation,
and recording/resuming/finishing a game. Backend integration and cross-device
conflicts require separate validation against the Apps Script implementation.
