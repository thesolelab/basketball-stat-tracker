// Presentation only: no game mutations, persisted fields, or API requests.
(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const namespace = 'http://www.w3.org/2000/svg';
  const court = document.createElementNS(namespace, 'svg');
  court.setAttribute('viewBox', '0 0 720 1000');
  court.setAttribute('preserveAspectRatio', 'xMidYMid slice');
  court.setAttribute('aria-hidden', 'true');
  court.classList.add('court-backdrop');
  court.innerHTML = '<g fill="none" stroke="currentColor" stroke-width="2"><path d="M50 80H670V920H50ZM240 80V320H480V80M50 500H670M80 80V180C80 620 640 620 640 180V80"/><circle cx="360" cy="320" r="80"/><circle cx="360" cy="500" r="100"/><path d="M330 120H390M360 120V145"/><circle cx="360" cy="155" r="12"/></g>';
  document.body.prepend(court);

  const toast = document.createElement('div');
  toast.className = 'hud-toast';
  toast.setAttribute('role', 'status');
  toast.hidden = true;
  document.body.append(toast);
  let toastTimer;
  let session = '';
  let milestones = new Set();
  let seasonHigh = 0;
  const lastValues = new Map();
  const labels = {
    '2pt-made': '2PT MADE', '2pt-miss': '2PT MISS',
    '3pt-made': '3PT MADE', '3pt-miss': '3PT MISS',
    'ft-made': 'FT MADE', 'ft-miss': 'FT MISS',
    oreb: 'OFF REB', dreb: 'DEF REB', assist: 'ASSIST',
    steal: 'STEAL', block: 'BLOCK', turnover: 'TURNOVER', foul: 'PERSONAL FOUL'
  };
  function announce(message) {
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.hidden = false;
    toastTimer = window.setTimeout(() => { toast.hidden = true; }, 2500);
  }
  function progress(id, made, attempted) {
    const value = document.getElementById(id);
    if (!value) return;
    const row = value.closest('.season-shooting-list > div, .shooting-detail-list > div');
    if (!row) return;
    let bar = row.querySelector('progress');
    if (!bar) {
      bar = document.createElement('progress');
      bar.className = 'hud-progress';
      bar.max = 100;
      bar.setAttribute('aria-hidden', 'true');
      row.append(bar);
    }
    bar.value = attempted ? Math.max(0, Math.min(100, made / attempted * 100)) : 0;
  }
  function refresh() {
    const number = currentGame.playerNumber || getSavedPlayerNumber();
    const homeNumber = getSavedPlayerNumber();
    document.querySelector('.home-number').textContent = `#${homeNumber}`;
    document.querySelector('.home-hero').dataset.jersey = homeNumber;
    document.querySelector('.game-header').dataset.jersey = number;
    document.getElementById('recentActions').textContent = actionHistory.slice(-3)
      .map(action => labels[action] || action).join('  ·  ') || 'Ready for tip-off';
    for (const id of ['points', 'rebounds', 'assists', 'steals', 'blocks', 'turnovers', 'fouls', 'fgPercent']) {
      const element = document.getElementById(id);
      const value = element.textContent.trim();
      if (lastValues.has(id) && lastValues.get(id) !== value && !reducedMotion.matches) {
        element.classList.remove('hud-pulse');
        void element.offsetWidth;
        element.classList.add('hud-pulse');
      }
      lastValues.set(id, value);
    }
    for (const id of ['seasonFgPercent', 'seasonThreePercent', 'seasonFtPercent']) {
      const value = Number.parseFloat(document.getElementById(id).textContent) || 0;
      progress(id, value, 100);
    }
    if (selectedDetailGame) {
      const game = selectedDetailGame;
      progress('detailFieldGoals', safeNumber(game.fieldGoalsMade), safeNumber(game.fieldGoalAttempts));
      progress('detailThreePoint', safeNumber(game.threeMade), safeNumber(game.threeAttempted));
      progress('detailFreeThrows', safeNumber(game.freeThrowMade), safeNumber(game.freeThrowAttempted));
    }
    if (!gameIsActive) return;
    const key = `${currentGameNumber}:${currentGame.date}:${currentGame.opponent}`;
    if (session !== key || actionHistory.length === 0) {
      session = key;
      milestones = new Set();
      seasonHigh = Math.max(0, ...getSeasonGames().map(game => safeNumber(game.points)));
    }
    const categories = [calculatePoints(), calculateRebounds(), stats.assists, stats.steals, stats.blocks];
    const candidates = [
      ['double-double', categories.filter(value => value >= 10).length >= 2, 'Double-double'],
      ['threes', stats.threeMade >= 3, 'Three triples. Keep shooting.'],
      ['season-high', seasonHigh > 0 && calculatePoints() > seasonHigh, 'New season high · points']
    ];
    const reached = candidates.filter(([id, condition]) => condition && !milestones.has(id));
    reached.forEach(([id]) => milestones.add(id));
    if (reached.length) announce(reached.map(([, , message]) => message).join(' · '));
  }
  const observer = new MutationObserver(refresh);
  for (const id of ['points', 'rebounds', 'assists', 'steals', 'blocks', 'turnovers', 'fouls', 'fgPercent',
    'shootingSummary', 'gamePlayerNumber', 'seasonFgPercent', 'seasonThreePercent', 'seasonFtPercent',
    'detailFieldGoals', 'detailThreePoint', 'detailFreeThrows']) {
    observer.observe(document.getElementById(id), { childList: true, characterData: true, subtree: true });
  }
  document.querySelectorAll('[data-action$="-made"]').forEach(button => {
    button.addEventListener('click', () => {
      if (!gameIsActive || reducedMotion.matches) return;
      const floating = document.createElement('span');
      floating.className = 'shot-float';
      floating.setAttribute('aria-hidden', 'true');
      floating.textContent = button.dataset.action.startsWith('2') ? '+2' : button.dataset.action.startsWith('3') ? '+3' : '+1';
      button.append(floating);
      window.setTimeout(() => floating.remove(), 180);
    });
  });
  document.getElementById('seasonStatsEmpty').querySelector('strong').textContent = 'Tip-off pending';
  document.getElementById('seasonStatsEmpty').querySelector('span').textContent = 'Start Game 1 to light this up.';
  refresh();
})();
