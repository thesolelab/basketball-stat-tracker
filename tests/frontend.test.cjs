const { test } = require('node:test');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');

test('frontend save, sync, keyboard, and export regressions', async (t) => {
  const root = path.resolve(__dirname, '..');
  const server = http.createServer(async (req, res) => {
    try {
      const pathname = new URL(req.url, 'http://localhost').pathname;
      const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
      if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
      const types = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html' };
      res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
      res.end(await fs.readFile(file));
    } catch { res.writeHead(404).end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ headless: true,
    ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}) });
  t.after(async () => { await browser.close(); await new Promise(resolve => server.close(resolve)); });
  const page = await browser.newPage();
  page.setDefaultTimeout(5000);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  let failPosts = false;
  let remote = [];
  await page.route('https://script.google.com/**', async route => {
    if (route.request().method() === 'POST' && failPosts) {
      await route.fulfill({ status: 503, body: 'Unavailable' });
    } else {
      await route.fulfill({ json: { success: true, games: remote } });
    }
  });
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await page.waitForFunction(() => document.getElementById('syncStatusText').textContent === 'Synced');
  await t.test('failed upload preserves pending edits and reports pending', async () => {
    remote = [{ id: 'g1', points: 10, season: '2026–27', gameNumber: 1 }];
    failPosts = true;
    const result = await page.evaluate(async () => {
      writeCompletedGames([{ id: 'g1', points: 20, season: CURRENT_SEASON, gameNumber: 1, syncStatus: 'pending' }]);
      await synchronizeCompletedGames();
      return { game: readCompletedGames()[0], status: syncStatusText.textContent };
    });
    assert.equal(result.game.points, 20);
    assert.equal(result.game.syncStatus, 'pending');
    assert.match(result.status, /will retry/);
  });
  await t.test('old acknowledgment cannot acknowledge a newer edit', async () => {
    assert.equal(await page.evaluate(() => {
      const uploaded = readCompletedGames()[0];
      updateCompletedGame({ ...uploaded, points: 30 });
      markGameSynced(uploaded);
      return readCompletedGames()[0].syncStatus;
    }), 'pending');
  });
  await t.test('background sync keeps the active game number', async () => {
    assert.equal(await page.evaluate(async () => {
      gameIsActive = true;
      currentGameNumber = 7;
      writeActiveGame();
      await synchronizeCompletedGames();
      return currentGameNumber;
    }), 7);
  });
  await t.test('dialogs trap focus and restore it on Escape', async () => {
    await page.evaluate(() => {
      newGameButton.focus();
      openModal(replaceGameModal);
    });
    await page.waitForFunction(() => replaceGameModal.contains(document.activeElement));
    await page.evaluate(() => {
      const items = replaceGameModal.querySelectorAll(focusableSelector);
      items[items.length - 1].focus();
    });
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement === replaceGameModal.querySelector(focusableSelector)), true);
    await page.keyboard.press('Escape');
    assert.equal(await page.evaluate(() => document.activeElement === newGameButton), true);
  });
  await t.test('storage failures warn without throwing away the active game', async () => {
    assert.equal(await page.evaluate(() => {
      const original = Storage.prototype.setItem;
      Storage.prototype.setItem = () => { throw new DOMException('Full', 'QuotaExceededError'); };
      try {
        writeActiveGame();
        return !document.getElementById('storageWarning').hidden && gameIsActive;
      } finally { Storage.prototype.setItem = original; }
    }), true);
  });
  await t.test('PNG export produces a shareable file', async () => {
    const file = await page.evaluate(async () => {
      const file = await createStatCardFile({ id: 'g1', season: CURRENT_SEASON, gameNumber: 1, opponent: 'Test', date: '2026-11-08' });
      return { type: file.type, size: file.size, name: file.name };
    });
    assert.equal(file.type, 'image/png');
    assert.ok(file.size > 1000);
    assert.match(file.name, /\.png$/);
  });
  await t.test('failed deletion stays queued and cannot reappear from the server', async () => {
    const result = await page.evaluate(async () => {
      window.confirm = () => true;
      deleteCompletedGame('g1');
      await syncPromise;
      return { games: readCompletedGames(), deleted: readDeletedGameIds() };
    });
    assert.equal(result.games.length, 0);
    assert.deepEqual(result.deleted, ['g1']);
  });
  await t.test('game entry, resume, corrections, and completion work together', async () => {
    remote = [];
    await page.evaluate(() => { gameIsActive = false; localStorage.clear(); });
    await page.reload();
    await page.waitForFunction(() => document.getElementById('syncStatusText').textContent === 'Synced');
    await page.click('#newGameButton');
    await page.fill('#playerNumber', '2');
    await page.fill('#opponentInput', 'Test Opponent');
    await page.locator('#gameSetupForm').evaluate(form => form.requestSubmit());
    await page.click('[data-action="2pt-made"]');
    await page.click('[data-action="3pt-made"]');
    await page.click('[data-action="oreb"]');
    assert.equal(await page.locator('#points').textContent(), '5');
    await page.reload();
    await page.click('#resumeGameButton');
    assert.equal(await page.locator('#points').textContent(), '5');
    await page.click('[data-action="3pt-made"]');
    await page.click('[data-action="3pt-made"]');
    await page.waitForFunction(() => document.querySelector('.hud-toast').textContent.includes('Three triples'));
    assert.match(await page.locator('#recentActions').textContent(), /3PT MADE/);
    await page.evaluate(() => {
      correctRecordedAction('3pt-made');
      correctRecordedAction('3pt-made');
      correctRecordedAction('3pt-made');
    });
    assert.equal(await page.locator('#points').textContent(), '2');
    await page.click('#endGameButton');
    await page.fill('#teamScoreInput', '50');
    await page.fill('#opponentScoreInput', '40');
    const failure = await page.evaluate(() => {
      const original = Storage.prototype.setItem;
      Storage.prototype.setItem = () => { throw new DOMException('Full', 'QuotaExceededError'); };
      try {
        confirmEndGameButton.click();
        return { active: gameIsActive, message: scoreMessage.textContent };
      } finally { Storage.prototype.setItem = original; }
    });
    assert.equal(failure.active, true);
    assert.match(failure.message, /could not be saved/);
    await page.click('#confirmEndGame');
    const game = await page.evaluate(() => readCompletedGames()[0]);
    assert.equal(game.points, 2);
    assert.equal(game.rebounds, 1);
    assert.equal(game.result, 'W');
    assert.equal(await page.evaluate(() => readActiveGame()), null);
  });
  await t.test('Court HUD stays usable across phone and desktop screens', async () => {
    for (const width of [320, 390, 720, 1280]) {
      await page.setViewportSize({ width, height: 844 });
      await page.evaluate(() => renderGameHistory());
      for (const screen of ['homeScreen', 'setupScreen', 'gameScreen', 'seasonStatsScreen', 'historyScreen', 'gameDetailScreen']) {
        await page.evaluate(screen => {
          if (screen === 'seasonStatsScreen') renderSeasonStats();
          if (screen === 'gameDetailScreen') renderGameDetail(readCompletedGames()[0]);
          showScreen(document.getElementById(screen));
        }, screen);
        const dimensions = await page.evaluate(() => ({ viewport: innerWidth, content: document.documentElement.scrollWidth }));
        assert.ok(dimensions.content <= dimensions.viewport, `${screen} overflows at ${width}px`);
      }
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.click('#editGameButton');
    await page.fill('#editOpponent', 'Updated Opponent');
    await page.click('#saveEditGame');
    assert.equal(await page.evaluate(() => readCompletedGames()[0].opponent), 'Updated Opponent');
    assert.equal(await page.evaluate(() => document.querySelector('.modal-backdrop.is-open')), null);
    const style = await page.evaluate(() => {
      const made = document.querySelector('.btn-made');
      return { radius: getComputedStyle(made).borderRadius, min: parseFloat(getComputedStyle(made).minHeight), bg: getComputedStyle(document.body).backgroundColor };
    });
    assert.equal(style.radius, '2px');
    assert.ok(style.min >= 56);
    assert.equal(style.bg, 'rgb(8, 9, 10)');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    assert.equal(await page.evaluate(() => getComputedStyle(document.querySelector('.btn-made')).animationName), 'none');
    await page.evaluate(() => { gameIsActive = true; showScreen(gameScreen); });
    await page.click('#exitGameButton');
    await page.click('#keepGameButton');
    assert.equal(await page.evaluate(() => gameIsActive), true);
    await page.click('#exitGameButton');
    await page.click('#discardGameButton');
    assert.equal(await page.evaluate(() => readActiveGame()), null);
  });
  assert.deepEqual(errors, []);
});
