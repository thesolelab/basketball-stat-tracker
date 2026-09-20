/* ======================================================
   BASKETBALL STAT TRACKER
====================================================== */

/* ======================================================
   APP SETTINGS
====================================================== */

const CURRENT_SEASON = "2026–27";

const API_URL =
  "https://script.google.com/macros/s/AKfycbznVw8zvjDEZt6-jRwLwqNI4xZ5bkEZLVnPZ8VX6Fv9t-Lgt9w44UcadPvHm7l5Tfet/exec";

const ACTIVE_GAME_KEY =
  "basketballStatTracker.activeGame";

const PLAYER_NUMBER_KEY =
  "basketballStatTracker.playerNumber";

const COMPLETED_GAMES_KEY =
  "basketballStatTracker.completedGames";

const NEXT_GAME_NUMBER_KEY =
  "basketballStatTracker.nextGameNumber";

const DELETED_GAME_IDS_KEY =
  "basketballStatTracker.deletedGameIds";

let currentGameNumber = 1;
let gameIsActive = false;
let currentSeasonFilter = "All";
let syncPromise = null;

/* ======================================================
   CURRENT GAME
====================================================== */

let currentGame = {
  playerNumber: "2",
  opponent: "",
  date: "",
  location: "Home",
  type: "Regular Season"
};

/* ======================================================
   STATS
====================================================== */

const stats = {
  twoMade: 0,
  twoAttempted: 0,
  threeMade: 0,
  threeAttempted: 0,
  freeThrowMade: 0,
  freeThrowAttempted: 0,
  offensiveRebounds: 0,
  defensiveRebounds: 0,
  assists: 0,
  steals: 0,
  blocks: 0,
  turnovers: 0,
  fouls: 0
};

const actionHistory = [];

/* ======================================================
   DOM
====================================================== */

const homeScreen = document.getElementById("homeScreen");
const setupScreen = document.getElementById("setupScreen");
const gameScreen = document.getElementById("gameScreen");
const historyScreen = document.getElementById("historyScreen");
const gameDetailScreen = document.getElementById("gameDetailScreen");
const seasonStatsScreen = document.getElementById("seasonStatsScreen");

const seasonStatsButton = document.getElementById("seasonStatsButton");
const seasonStatsSummary = document.getElementById("seasonStatsSummary");
const seasonStatsBackButton = document.getElementById("seasonStatsBackButton");
const seasonFilterButtons = document.querySelectorAll("[data-season-filter]");
const seasonStatsEmpty = document.getElementById("seasonStatsEmpty");
const seasonFilterLabel = document.getElementById("seasonFilterLabel");
const seasonGamesPlayed = document.getElementById("seasonGamesPlayed");
const seasonPpg = document.getElementById("seasonPpg");
const seasonRpg = document.getElementById("seasonRpg");
const seasonApg = document.getElementById("seasonApg");
const seasonSpg = document.getElementById("seasonSpg");
const seasonBpg = document.getElementById("seasonBpg");
const seasonTovpg = document.getElementById("seasonTovpg");
const seasonPfpg = document.getElementById("seasonPfpg");
const seasonFgPercent = document.getElementById("seasonFgPercent");
const seasonFgTotals = document.getElementById("seasonFgTotals");
const seasonThreePercent = document.getElementById("seasonThreePercent");
const seasonThreeTotals = document.getElementById("seasonThreeTotals");
const seasonFtPercent = document.getElementById("seasonFtPercent");
const seasonFtTotals = document.getElementById("seasonFtTotals");
const seasonTotalPoints = document.getElementById("seasonTotalPoints");
const seasonTotalRebounds = document.getElementById("seasonTotalRebounds");
const seasonTotalAssists = document.getElementById("seasonTotalAssists");
const seasonTotalSteals = document.getElementById("seasonTotalSteals");
const seasonTotalBlocks = document.getElementById("seasonTotalBlocks");
const seasonTotalOreb = document.getElementById("seasonTotalOreb");
const seasonTotalDreb = document.getElementById("seasonTotalDreb");

const newGameButton = document.getElementById("newGameButton");
const gameHistoryButton = document.getElementById("gameHistoryButton");
const gameHistorySummary = document.getElementById("gameHistorySummary");
const historyBackButton = document.getElementById("historyBackButton");
const detailBackButton = document.getElementById("detailBackButton");
const historyGameCount = document.getElementById("historyGameCount");
const historyList = document.getElementById("historyList");
const historyEmpty = document.getElementById("historyEmpty");

const resumeGameCard = document.getElementById("resumeGameCard");
const resumeGameButton = document.getElementById("resumeGameButton");
const resumeOpponent = document.getElementById("resumeOpponent");
const resumeDetails = document.getElementById("resumeDetails");
const resumeGameType = document.getElementById("resumeGameType");

const setupBackButton = document.getElementById("setupBackButton");
const gameSetupForm = document.getElementById("gameSetupForm");
const playerNumberInput = document.getElementById("playerNumber");
const opponentInput = document.getElementById("opponentInput");
const gameDateInput = document.getElementById("gameDate");
const setupMessage = document.getElementById("setupMessage");
const locationHome = document.getElementById("locationHome");
const typeRegular = document.getElementById("typeRegular");

const gameSeasonLabel = document.getElementById("gameSeasonLabel");
const gamePlayerNumber = document.getElementById("gamePlayerNumber");
const gameOpponent = document.getElementById("gameOpponent");
const gameTypeBadge = document.getElementById("gameTypeBadge");

const pointsElement = document.getElementById("points");
const reboundsElement = document.getElementById("rebounds");
const assistsElement = document.getElementById("assists");
const stealsElement = document.getElementById("steals");
const blocksElement = document.getElementById("blocks");
const turnoversElement = document.getElementById("turnovers");
const foulsElement = document.getElementById("fouls");
const fgPercentElement = document.getElementById("fgPercent");
const shootingSummaryElement = document.getElementById("shootingSummary");

const undoButton = document.getElementById("undoButton");
const endGameButton = document.getElementById("endGameButton");
const exitGameButton = document.getElementById("exitGameButton");

const endGameModal = document.getElementById("endGameModal");
const cancelEndGameButton = document.getElementById("cancelEndGame");
const confirmEndGameButton = document.getElementById("confirmEndGame");
const finalPointsElement = document.getElementById("finalPoints");
const finalReboundsElement = document.getElementById("finalRebounds");
const finalAssistsElement = document.getElementById("finalAssists");
const finalStealsElement = document.getElementById("finalSteals");
const finalShootingElement = document.getElementById("finalShooting");

const cancelGameModal = document.getElementById("cancelGameModal");
const keepGameButton = document.getElementById("keepGameButton");
const discardGameButton = document.getElementById("discardGameButton");

const replaceGameModal = document.getElementById("replaceGameModal");
const resumeInsteadButton = document.getElementById("resumeInsteadButton");
const replaceGameButton = document.getElementById("replaceGameButton");

const detailSeasonLabel = document.getElementById("detailSeasonLabel");
const detailTitle = document.getElementById("detailTitle");
const detailGameNumber = document.getElementById("detailGameNumber");
const detailOpponent = document.getElementById("detailOpponent");
const detailMeta = document.getElementById("detailMeta");
const detailPoints = document.getElementById("detailPoints");
const detailRebounds = document.getElementById("detailRebounds");
const detailAssists = document.getElementById("detailAssists");
const detailSteals = document.getElementById("detailSteals");
const detailBlocks = document.getElementById("detailBlocks");
const detailTurnovers = document.getElementById("detailTurnovers");
const detailFouls = document.getElementById("detailFouls");
const detailFieldGoals = document.getElementById("detailFieldGoals");
const detailTwoPoint = document.getElementById("detailTwoPoint");
const detailThreePoint = document.getElementById("detailThreePoint");
const detailFreeThrows = document.getElementById("detailFreeThrows");
const detailOffensiveRebounds = document.getElementById("detailOffensiveRebounds");
const detailDefensiveRebounds = document.getElementById("detailDefensiveRebounds");

const statButtons = document.querySelectorAll("[data-action]");

/* ======================================================
   SCREEN NAVIGATION
====================================================== */

function showScreen(screen) {
  document.querySelectorAll(".screen").forEach((item) => {
    item.classList.remove("active-screen");
  });

  screen.classList.add("active-screen");
  window.scrollTo(0, 0);
}

/* ======================================================
   DATE
====================================================== */

function getTodayForDateInput() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/* ======================================================
   CALCULATIONS
====================================================== */

function calculatePoints() {
  return (
    stats.twoMade * 2 +
    stats.threeMade * 3 +
    stats.freeThrowMade
  );
}

function calculateRebounds() {
  return stats.offensiveRebounds + stats.defensiveRebounds;
}

function calculateFieldGoalsMade() {
  return stats.twoMade + stats.threeMade;
}

function calculateFieldGoalAttempts() {
  return stats.twoAttempted + stats.threeAttempted;
}

function calculateFieldGoalPercentage() {
  const attempts = calculateFieldGoalAttempts();

  if (attempts === 0) {
    return "—";
  }

  return `${Math.round((calculateFieldGoalsMade() / attempts) * 100)}%`;
}

function getShootingSummary() {
  return (
    `FG ${calculateFieldGoalsMade()}/${calculateFieldGoalAttempts()} · ` +
    `3PT ${stats.threeMade}/${stats.threeAttempted} · ` +
    `FT ${stats.freeThrowMade}/${stats.freeThrowAttempted}`
  );
}

function safeNumber(value) {
  return Number(value) || 0;
}

function formatPercentage(made, attempted) {
  const attempts = safeNumber(attempted);
  const makes = safeNumber(made);

  if (attempts === 0) {
    return "—";
  }

  return `${Math.round((makes / attempts) * 100)}%`;
}

function formatAverage(total, gamesPlayed) {
  if (gamesPlayed === 0) {
    return "0.0";
  }

  return (total / gamesPlayed).toFixed(1);
}

/* ======================================================
   LOCAL STORAGE
====================================================== */

function storageAvailable() {
  try {
    const testKey = "__basketball_storage_test__";
    localStorage.setItem(testKey, "1");
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    console.error("Local storage unavailable:", error);
    return false;
  }
}

const canUseStorage = storageAvailable();

/* ======================================================
   ACTIVE GAME STORAGE
====================================================== */

function readActiveGame() {
  if (!canUseStorage) {
    return null;
  }

  try {
    const raw = localStorage.getItem(ACTIVE_GAME_KEY);

    if (!raw) {
      return null;
    }

    const saved = JSON.parse(raw);

    if (!saved || saved.active !== true || !saved.game || !saved.stats) {
      return null;
    }

    return saved;
  } catch (error) {
    console.error("Could not read active game:", error);
    return null;
  }
}

function writeActiveGame() {
  if (!canUseStorage || !gameIsActive) {
    return;
  }

  const payload = {
    version: 2,
    active: true,
    season: CURRENT_SEASON,
    gameNumber: currentGameNumber,
    game: { ...currentGame },
    stats: { ...stats },
    history: [...actionHistory],
    savedAt: new Date().toISOString()
  };

  try {
    localStorage.setItem(ACTIVE_GAME_KEY, JSON.stringify(payload));
  } catch (error) {
    console.error("Could not save active game:", error);
  }
}

function deleteActiveGame() {
  if (!canUseStorage) {
    return;
  }

  try {
    localStorage.removeItem(ACTIVE_GAME_KEY);
  } catch (error) {
    console.error("Could not remove active game:", error);
  }
}

/* ======================================================
   COMPLETED GAME STORAGE
====================================================== */

function readCompletedGames() {
  if (!canUseStorage) {
    return [];
  }

  try {
    const raw = localStorage.getItem(COMPLETED_GAMES_KEY);

    if (!raw) {
      return [];
    }

    const saved = JSON.parse(raw);
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    console.error("Could not read completed games:", error);
    return [];
  }
}

function writeCompletedGames(games) {
  if (!canUseStorage) {
    return false;
  }

  try {
    localStorage.setItem(COMPLETED_GAMES_KEY, JSON.stringify(games));
    return true;
  } catch (error) {
    console.error("Could not save completed games:", error);
    return false;
  }
}

function saveCompletedGame(game) {
  const games = readCompletedGames();
  games.push(game);
  return writeCompletedGames(games);
}

function readDeletedGameIds() {
  if (!canUseStorage) {
    return [];
  }

  try {
    const raw = localStorage.getItem(DELETED_GAME_IDS_KEY);

    if (!raw) {
      return [];
    }

    const ids = JSON.parse(raw);
    return Array.isArray(ids) ? ids : [];
  } catch (error) {
    console.error("Could not read pending deletes:", error);
    return [];
  }
}

function writeDeletedGameIds(ids) {
  if (!canUseStorage) {
    return;
  }

  try {
    localStorage.setItem(
      DELETED_GAME_IDS_KEY,
      JSON.stringify([...new Set(ids)])
    );
  } catch (error) {
    console.error("Could not save pending deletes:", error);
  }
}

function queueDeletedGameId(gameId) {
  const ids = readDeletedGameIds();

  if (!ids.includes(gameId)) {
    ids.push(gameId);
    writeDeletedGameIds(ids);
  }
}

function clearDeletedGameId(gameId) {
  writeDeletedGameIds(
    readDeletedGameIds().filter((id) => id !== gameId)
  );
}

/* ======================================================
   GAME NUMBER STORAGE
====================================================== */

function readStoredNextGameNumber() {
  if (!canUseStorage) {
    return 1;
  }

  try {
    return Number(localStorage.getItem(NEXT_GAME_NUMBER_KEY)) || 1;
  } catch (error) {
    return 1;
  }
}

function writeStoredNextGameNumber(number) {
  if (!canUseStorage) {
    return;
  }

  try {
    localStorage.setItem(NEXT_GAME_NUMBER_KEY, String(number));
  } catch (error) {
    console.error("Could not save next game number:", error);
  }
}

function getNextGameNumber() {
  const seasonGames = readCompletedGames().filter(
    (game) => game.season === CURRENT_SEASON
  );

  const highestCompletedGameNumber =
    seasonGames.length === 0
      ? 0
      : Math.max(
          ...seasonGames.map((game) => Number(game.gameNumber) || 0)
        );

  const activeGame = readActiveGame();

  const activeGameNumber =
    activeGame && activeGame.season === CURRENT_SEASON
      ? Number(activeGame.gameNumber) || 0
      : 0;

  const calculatedNext = Math.max(
    highestCompletedGameNumber + 1,
    activeGameNumber + 1,
    readStoredNextGameNumber(),
    1
  );

  writeStoredNextGameNumber(calculatedNext);
  return calculatedNext;
}

function advanceNextGameNumber(completedGameNumber) {
  const nextNumber = Math.max(
    Number(completedGameNumber) + 1,
    readStoredNextGameNumber()
  );

  writeStoredNextGameNumber(nextNumber);
}

function createGameId() {
  if (
    window.crypto &&
    typeof window.crypto.randomUUID === "function"
  ) {
    return window.crypto.randomUUID();
  }

  return `game-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

/* ======================================================
   GOOGLE SHEETS SYNC
====================================================== */

async function apiGetGames() {
  const response = await fetch(
    `${API_URL}?t=${Date.now()}`,
    {
      method: "GET",
      cache: "no-store"
    }
  );

  if (!response.ok) {
    throw new Error(
      `Game sync failed with HTTP ${response.status}.`
    );
  }

  const data = await response.json();

  if (
    !data ||
    data.success !== true ||
    !Array.isArray(data.games)
  ) {
    throw new Error(
      data?.error ||
        "Could not load games from Google Sheets."
    );
  }

  return data.games;
}

async function apiPost(payload) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify(payload),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(
      `Game sync failed with HTTP ${response.status}.`
    );
  }

  const data = await response.json();

  if (!data || data.success !== true) {
    throw new Error(
      data?.error ||
        "Google Sheets request failed."
    );
  }

  return data;
}

function markGameSynced(gameId) {
  const games = readCompletedGames();
  const game = games.find(
    (item) => item.id === gameId
  );

  if (!game) {
    return;
  }

  game.syncStatus = "synced";
  writeCompletedGames(games);
}

async function syncPendingDeletes() {
  const ids = readDeletedGameIds();

  for (const gameId of ids) {
    try {
      await apiPost({
        action: "deleteGame",
        id: gameId
      });

      clearDeletedGameId(gameId);
    } catch (error) {
      console.warn(
        `Could not sync deletion for ${gameId}:`,
        error
      );
    }
  }
}

async function syncPendingGames() {
  const deletedIds = new Set(
    readDeletedGameIds()
  );

  const games = readCompletedGames();

  for (const game of games) {
    if (
      !game.id ||
      deletedIds.has(game.id) ||
      game.syncStatus === "synced"
    ) {
      continue;
    }

    try {
      await apiPost({
        action: "saveGame",
        game
      });

      markGameSynced(game.id);
    } catch (error) {
      console.warn(
        `Could not sync game ${game.id}:`,
        error
      );
    }
  }
}

async function refreshGamesFromServer() {
  const remoteGames =
    await apiGetGames();

  const deletedIds = new Set(
    readDeletedGameIds()
  );

  const localGames =
    readCompletedGames();

  const pendingLocalGames =
    localGames.filter(
      (game) =>
        game.id &&
        game.syncStatus !== "synced" &&
        !deletedIds.has(game.id)
    );

  const merged = new Map();

  remoteGames.forEach((game) => {
    if (
      !game.id ||
      deletedIds.has(game.id)
    ) {
      return;
    }

    merged.set(game.id, {
      ...game,
      syncStatus: "synced"
    });
  });

  pendingLocalGames.forEach((game) => {
    if (!merged.has(game.id)) {
      merged.set(
        game.id,
        game
      );
    }
  });

  writeCompletedGames(
    [...merged.values()]
  );
}

async function synchronizeCompletedGames() {
  if (syncPromise) {
    return syncPromise;
  }

  syncPromise = (async () => {
    try {
      await syncPendingDeletes();
      await syncPendingGames();
      await refreshGamesFromServer();
    } catch (error) {
      console.warn(
        "Google Sheets sync unavailable. Using local data.",
        error
      );
    } finally {
      currentGameNumber =
        getNextGameNumber();

      refreshGameHistorySummary();
      refreshSeasonStatsSummary();

      if (
        historyScreen.classList.contains(
          "active-screen"
        )
      ) {
        renderGameHistory();
      }

      if (
        seasonStatsScreen.classList.contains(
          "active-screen"
        )
      ) {
        renderSeasonStats(
          currentSeasonFilter
        );
      }
    }
  })().finally(() => {
    syncPromise = null;
  });

  return syncPromise;
}

/* ======================================================
   FORMATTING
====================================================== */

function formatGameDate(dateString) {
  if (!dateString) {
    return "Date unavailable";
  }

  const parts =
    String(dateString).split("-");

  if (parts.length !== 3) {
    return String(dateString);
  }

  const date = new Date(
    Number(parts[0]),
    Number(parts[1]) - 1,
    Number(parts[2])
  );

  return date.toLocaleDateString(
    undefined,
    {
      month: "short",
      day: "numeric",
      year: "numeric"
    }
  );
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* ======================================================
   SEASON STATS
====================================================== */

function getSeasonGames(filter = "All") {
  return readCompletedGames()
    .filter(
      (game) =>
        game.season === CURRENT_SEASON
    )
    .filter(
      (game) =>
        filter === "All" ||
        game.type === filter
    );
}

function calculateSeasonStats(games) {
  const totals = {
    points: 0,
    offensiveRebounds: 0,
    defensiveRebounds: 0,
    rebounds: 0,
    assists: 0,
    steals: 0,
    blocks: 0,
    turnovers: 0,
    fouls: 0,
    fieldGoalsMade: 0,
    fieldGoalAttempts: 0,
    threeMade: 0,
    threeAttempted: 0,
    freeThrowMade: 0,
    freeThrowAttempted: 0
  };

  games.forEach((game) => {
    totals.points +=
      safeNumber(game.points);

    totals.offensiveRebounds +=
      safeNumber(
        game.offensiveRebounds
      );

    totals.defensiveRebounds +=
      safeNumber(
        game.defensiveRebounds
      );

    totals.rebounds +=
      safeNumber(game.rebounds);

    totals.assists +=
      safeNumber(game.assists);

    totals.steals +=
      safeNumber(game.steals);

    totals.blocks +=
      safeNumber(game.blocks);

    totals.turnovers +=
      safeNumber(game.turnovers);

    totals.fouls +=
      safeNumber(game.fouls);

    totals.fieldGoalsMade +=
      safeNumber(
        game.fieldGoalsMade
      );

    totals.fieldGoalAttempts +=
      safeNumber(
        game.fieldGoalAttempts
      );

    totals.threeMade +=
      safeNumber(game.threeMade);

    totals.threeAttempted +=
      safeNumber(
        game.threeAttempted
      );

    totals.freeThrowMade +=
      safeNumber(
        game.freeThrowMade
      );

    totals.freeThrowAttempted +=
      safeNumber(
        game.freeThrowAttempted
      );
  });

  return {
    gamesPlayed: games.length,
    totals
  };
}

function getSeasonFilterLabel(filter) {
  return filter === "All"
    ? "All Games"
    : filter;
}

function refreshSeasonStatsSummary() {
  const games =
    getSeasonGames("All");

  const seasonData =
    calculateSeasonStats(games);

  const count =
    seasonData.gamesPlayed;

  if (count === 0) {
    seasonStatsSummary.textContent =
      "No completed games yet";
    return;
  }

  seasonStatsSummary.textContent =
    `${count} ${
      count === 1
        ? "game"
        : "games"
    } · ` +
    `${formatAverage(
      seasonData.totals.points,
      count
    )} PPG`;
}

function renderSeasonStats(
  filter = currentSeasonFilter
) {
  currentSeasonFilter = filter;

  const games =
    getSeasonGames(
      currentSeasonFilter
    );

  const seasonData =
    calculateSeasonStats(games);

  const totals =
    seasonData.totals;

  const gamesPlayed =
    seasonData.gamesPlayed;

  seasonFilterButtons.forEach(
    (button) => {
      button.classList.toggle(
        "is-active",
        button.dataset.seasonFilter ===
          currentSeasonFilter
      );
    }
  );

  seasonStatsEmpty.hidden =
    gamesPlayed !== 0;

  seasonFilterLabel.textContent =
    getSeasonFilterLabel(
      currentSeasonFilter
    );

  seasonGamesPlayed.textContent =
    gamesPlayed;

  seasonPpg.textContent =
    formatAverage(
      totals.points,
      gamesPlayed
    );

  seasonRpg.textContent =
    formatAverage(
      totals.rebounds,
      gamesPlayed
    );

  seasonApg.textContent =
    formatAverage(
      totals.assists,
      gamesPlayed
    );

  seasonSpg.textContent =
    formatAverage(
      totals.steals,
      gamesPlayed
    );

  seasonBpg.textContent =
    formatAverage(
      totals.blocks,
      gamesPlayed
    );

  seasonTovpg.textContent =
    formatAverage(
      totals.turnovers,
      gamesPlayed
    );

  seasonPfpg.textContent =
    formatAverage(
      totals.fouls,
      gamesPlayed
    );

  seasonFgPercent.textContent =
    formatPercentage(
      totals.fieldGoalsMade,
      totals.fieldGoalAttempts
    );

  seasonFgTotals.textContent =
    `${totals.fieldGoalsMade}/` +
    `${totals.fieldGoalAttempts}`;

  seasonThreePercent.textContent =
    formatPercentage(
      totals.threeMade,
      totals.threeAttempted
    );

  seasonThreeTotals.textContent =
    `${totals.threeMade}/` +
    `${totals.threeAttempted}`;

  seasonFtPercent.textContent =
    formatPercentage(
      totals.freeThrowMade,
      totals.freeThrowAttempted
    );

  seasonFtTotals.textContent =
    `${totals.freeThrowMade}/` +
    `${totals.freeThrowAttempted}`;

  seasonTotalPoints.textContent =
    totals.points;

  seasonTotalRebounds.textContent =
    totals.rebounds;

  seasonTotalAssists.textContent =
    totals.assists;

  seasonTotalSteals.textContent =
    totals.steals;

  seasonTotalBlocks.textContent =
    totals.blocks;

  seasonTotalOreb.textContent =
    totals.offensiveRebounds;

  seasonTotalDreb.textContent =
    totals.defensiveRebounds;
}

/* ======================================================
   GAME HISTORY
====================================================== */

function refreshGameHistorySummary() {
  const count =
    readCompletedGames()
      .filter(
        (game) =>
          game.season ===
          CURRENT_SEASON
      )
      .length;

  gameHistorySummary.textContent =
    count === 0
      ? "No completed games yet"
      : `${count} completed ${
          count === 1
            ? "game"
            : "games"
        }`;
}

function deleteCompletedGame(gameId) {
  const games =
    readCompletedGames();

  const gameToDelete =
    games.find(
      (game) =>
        game.id === gameId
    );

  if (!gameToDelete) {
    return;
  }

  const confirmed =
    window.confirm(
      `Delete Game ${gameToDelete.gameNumber} vs. ${gameToDelete.opponent}? This cannot be undone.`
    );

  if (!confirmed) {
    return;
  }

  const remainingGames =
    games.filter(
      (game) =>
        game.id !== gameId
    );

  if (
    !writeCompletedGames(
      remainingGames
    )
  ) {
    return;
  }

  queueDeletedGameId(gameId);

  renderGameHistory();
  refreshGameHistorySummary();
  refreshSeasonStatsSummary();

  void synchronizeCompletedGames();
}

function attachSwipeToDelete(
  row,
  card,
  deleteButton
) {
  const revealDistance = 92;

  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let swiping = false;
  let horizontalSwipe = false;

  function setOffset(offset) {
    const clamped =
      Math.max(
        -revealDistance,
        Math.min(0, offset)
      );

    currentX = clamped;

    card.style.transform =
      `translateX(${clamped}px)`;

    row.classList.toggle(
      "is-delete-open",
      clamped <=
        -(revealDistance / 2)
    );
  }

  function closeRow() {
    setOffset(0);
  }

  card.addEventListener(
    "pointerdown",
    (event) => {
      if (
        event.pointerType ===
          "mouse" &&
        event.button !== 0
      ) {
        return;
      }

      startX =
        event.clientX;

      startY =
        event.clientY;

      swiping = true;
      horizontalSwipe = false;

      card.setPointerCapture?.(
        event.pointerId
      );
    }
  );

  card.addEventListener(
    "pointermove",
    (event) => {
      if (!swiping) {
        return;
      }

      const deltaX =
        event.clientX -
        startX;

      const deltaY =
        event.clientY -
        startY;

      if (
        !horizontalSwipe &&
        Math.abs(deltaX) < 8 &&
        Math.abs(deltaY) < 8
      ) {
        return;
      }

      if (
        !horizontalSwipe &&
        Math.abs(deltaY) >
          Math.abs(deltaX)
      ) {
        swiping = false;
        closeRow();
        return;
      }

      horizontalSwipe = true;

      setOffset(
        Math.min(
          0,
          deltaX
        )
      );
    }
  );

  function finishSwipe() {
    if (!swiping) {
      return;
    }

    swiping = false;

    if (
      horizontalSwipe &&
      currentX <=
        -(revealDistance / 2)
    ) {
      setOffset(
        -revealDistance
      );
    } else {
      closeRow();
    }
  }

  card.addEventListener(
    "pointerup",
    finishSwipe
  );

  card.addEventListener(
    "pointercancel",
    finishSwipe
  );

  card.addEventListener(
    "click",
    (event) => {
      if (horizontalSwipe) {
        event.preventDefault();
        event.stopPropagation();

        horizontalSwipe = false;
        return;
      }

      if (
        row.classList.contains(
          "is-delete-open"
        )
      ) {
        event.preventDefault();
        event.stopPropagation();

        closeRow();
      }
    },
    true
  );

  deleteButton.addEventListener(
    "click",
    (event) => {
      event.stopPropagation();
    }
  );
}

function renderGameHistory() {
  const games =
    readCompletedGames()
      .filter(
        (game) =>
          game.season ===
          CURRENT_SEASON
      )
      .sort(
        (a, b) =>
          (Number(
            b.gameNumber
          ) || 0) -
          (Number(
            a.gameNumber
          ) || 0)
      );

  historyGameCount.textContent =
    games.length;

  historyList.innerHTML = "";

  historyEmpty.hidden =
    games.length !== 0;

  games.forEach((game) => {
    const row =
      document.createElement(
        "div"
      );

    row.className =
      "history-swipe-row";

    const deleteButton =
      document.createElement(
        "button"
      );

    deleteButton.type =
      "button";

    deleteButton.className =
      "history-delete-button";

    deleteButton.textContent =
      "DELETE";

    deleteButton.setAttribute(
      "aria-label",
      `Delete Game ${game.gameNumber} vs. ${game.opponent}`
    );

    const button =
      document.createElement(
        "button"
      );

    button.type =
      "button";

    button.className =
      "history-game-card";

    button.innerHTML = `
      <div class="history-game-card-top">
        <div class="history-game-copy">

          <span class="history-game-label">
            GAME ${game.gameNumber}
          </span>

          <strong class="history-game-opponent">
            vs. ${escapeHtml(
              game.opponent
            )}
          </strong>

          <span class="history-game-meta">
            ${escapeHtml(
              formatGameDate(
                game.date
              )
            )} ·
            ${escapeHtml(
              game.location
            )} ·
            ${escapeHtml(
              game.type
            )}
          </span>

        </div>

        <div class="history-game-points">
          <strong>
            ${safeNumber(
              game.points
            )}
          </strong>

          <span>
            PTS
          </span>
        </div>
      </div>

      <div class="history-game-stats">

        <div>
          <strong>
            ${safeNumber(
              game.rebounds
            )}
          </strong>
          <span>REB</span>
        </div>

        <div>
          <strong>
            ${safeNumber(
              game.assists
            )}
          </strong>
          <span>AST</span>
        </div>

        <div>
          <strong>
            ${safeNumber(
              game.steals
            )}
          </strong>
          <span>STL</span>
        </div>

        <div>
          <strong>
            ${safeNumber(
              game.blocks
            )}
          </strong>
          <span>BLK</span>
        </div>

      </div>
    `;

    button.addEventListener(
      "click",
      () => {
        if (
          row.classList.contains(
            "is-delete-open"
          )
        ) {
          return;
        }

        renderGameDetail(
          game
        );

        showScreen(
          gameDetailScreen
        );
      }
    );

    deleteButton.addEventListener(
      "click",
      () => {
        deleteCompletedGame(
          game.id
        );
      }
    );

    row.appendChild(
      deleteButton
    );

    row.appendChild(
      button
    );

    attachSwipeToDelete(
      row,
      button,
      deleteButton
    );

    historyList.appendChild(
      row
    );
  });
}

function renderGameDetail(game) {
  const fieldGoalsMade =
    safeNumber(
      game.fieldGoalsMade
    );

  const fieldGoalAttempts =
    safeNumber(
      game.fieldGoalAttempts
    );

  detailSeasonLabel.textContent =
    `${game.season || CURRENT_SEASON} SEASON`;

  detailTitle.textContent =
    `Game ${game.gameNumber}`;

  detailGameNumber.textContent =
    `GAME ${game.gameNumber}`;

  detailOpponent.textContent =
    `vs. ${game.opponent || "Opponent"}`;

  detailMeta.textContent =
    `${game.location || "Home"} · ` +
    `${game.type || "Regular Season"} · ` +
    `${formatGameDate(
      game.date
    )}`;

  detailPoints.textContent =
    safeNumber(
      game.points
    );

  detailRebounds.textContent =
    safeNumber(
      game.rebounds
    );

  detailAssists.textContent =
    safeNumber(
      game.assists
    );

  detailSteals.textContent =
    safeNumber(
      game.steals
    );

  detailBlocks.textContent =
    safeNumber(
      game.blocks
    );

  detailTurnovers.textContent =
    safeNumber(
      game.turnovers
    );

  detailFouls.textContent =
    safeNumber(
      game.fouls
    );

  detailFieldGoals.textContent =
    `${fieldGoalsMade}/${fieldGoalAttempts} · ` +
    `${formatPercentage(
      fieldGoalsMade,
      fieldGoalAttempts
    )}`;

  detailTwoPoint.textContent =
    `${safeNumber(
      game.twoMade
    )}/${safeNumber(
      game.twoAttempted
    )} · ` +
    `${formatPercentage(
      game.twoMade,
      game.twoAttempted
    )}`;

  detailThreePoint.textContent =
    `${safeNumber(
      game.threeMade
    )}/${safeNumber(
      game.threeAttempted
    )} · ` +
    `${formatPercentage(
      game.threeMade,
      game.threeAttempted
    )}`;

  detailFreeThrows.textContent =
    `${safeNumber(
      game.freeThrowMade
    )}/${safeNumber(
      game.freeThrowAttempted
    )} · ` +
    `${formatPercentage(
      game.freeThrowMade,
      game.freeThrowAttempted
    )}`;

  detailOffensiveRebounds.textContent =
    safeNumber(
      game.offensiveRebounds
    );

  detailDefensiveRebounds.textContent =
    safeNumber(
      game.defensiveRebounds
    );
}

/* ======================================================
   PLAYER NUMBER STORAGE
====================================================== */

function savePlayerNumber(number) {
  if (!canUseStorage) {
    return;
  }

  try {
    localStorage.setItem(
      PLAYER_NUMBER_KEY,
      number
    );
  } catch (error) {
    console.error(
      "Could not save player number:",
      error
    );
  }
}

function getSavedPlayerNumber() {
  if (!canUseStorage) {
    return "2";
  }

  try {
    return (
      localStorage.getItem(
        PLAYER_NUMBER_KEY
      ) || "2"
    );
  } catch (error) {
    return "2";
  }
}

/* ======================================================
   RESUME CARD
====================================================== */

function calculateSavedPoints(
  savedStats
) {
  return (
    safeNumber(
      savedStats.twoMade
    ) *
      2 +
    safeNumber(
      savedStats.threeMade
    ) *
      3 +
    safeNumber(
      savedStats.freeThrowMade
    )
  );
}

function refreshResumeCard() {
  const saved =
    readActiveGame();

  if (!saved) {
    resumeGameCard.hidden = true;
    return;
  }

  const opponent =
    saved.game.opponent ||
    "Opponent";

  const location =
    saved.game.location ||
    "Home";

  const type =
    saved.game.type ||
    "Regular Season";

  const points =
    calculateSavedPoints(
      saved.stats
    );

  resumeOpponent.textContent =
    `vs. ${opponent}`;

  resumeDetails.textContent =
    `${location} · ${points} PTS`;

  resumeGameType.textContent =
    type.toUpperCase();

  resumeGameCard.hidden = false;
}

/* ======================================================
   RESTORE ACTIVE GAME
====================================================== */

function restoreActiveGame() {
  const saved =
    readActiveGame();

  if (!saved) {
    return false;
  }

  currentGameNumber =
    Number(
      saved.gameNumber
    ) || 1;

  currentGame = {
    playerNumber:
      String(
        saved.game.playerNumber ||
        "2"
      ),

    opponent:
      String(
        saved.game.opponent ||
        ""
      ),

    date:
      String(
        saved.game.date ||
        ""
      ),

    location:
      String(
        saved.game.location ||
        "Home"
      ),

    type:
      String(
        saved.game.type ||
        "Regular Season"
      )
  };

  Object.keys(
    stats
  ).forEach((key) => {
    stats[key] =
      Number(
        saved.stats[key]
      ) || 0;
  });

  actionHistory.length = 0;

  if (
    Array.isArray(
      saved.history
    )
  ) {
    actionHistory.push(
      ...saved.history
    );
  }

  gameIsActive = true;

  updateGameHeader();
  updateDisplay();

  return true;
}

/* ======================================================
   NEW GAME FORM
====================================================== */

function prepareNewGameForm() {
  currentGameNumber =
    getNextGameNumber();

  playerNumberInput.value =
    getSavedPlayerNumber();

  opponentInput.value = "";

  gameDateInput.value =
    getTodayForDateInput();

  locationHome.checked = true;
  typeRegular.checked = true;

  setupMessage.textContent = "";
}

/* ======================================================
   GAME HEADER
====================================================== */

function updateGameHeader() {
  gameSeasonLabel.textContent =
    `${CURRENT_SEASON} SEASON · GAME ${currentGameNumber}`;

  gamePlayerNumber.textContent =
    `#${currentGame.playerNumber}`;

  gameOpponent.textContent =
    `vs. ${currentGame.opponent} · ${currentGame.location}`;

  gameTypeBadge.textContent =
    currentGame.type.toUpperCase();
}

/* ======================================================
   DISPLAY
====================================================== */

function updateDisplay() {
  pointsElement.textContent =
    calculatePoints();

  reboundsElement.textContent =
    calculateRebounds();

  assistsElement.textContent =
    stats.assists;

  stealsElement.textContent =
    stats.steals;

  blocksElement.textContent =
    stats.blocks;

  turnoversElement.textContent =
    stats.turnovers;

  foulsElement.textContent =
    stats.fouls;

  fgPercentElement.textContent =
    calculateFieldGoalPercentage();

  shootingSummaryElement.textContent =
    getShootingSummary();

  undoButton.disabled =
    actionHistory.length === 0;
}

function resetGameStats() {
  Object.keys(
    stats
  ).forEach((key) => {
    stats[key] = 0;
  });

  actionHistory.length = 0;

  updateDisplay();
}

/* ======================================================
   HOME EVENTS
====================================================== */

newGameButton.addEventListener(
  "click",
  async () => {
    const savedGame =
      readActiveGame();

    if (savedGame) {
      openModal(
        replaceGameModal
      );

      return;
    }

    await synchronizeCompletedGames();

    prepareNewGameForm();

    showScreen(
      setupScreen
    );
  }
);

resumeGameButton.addEventListener(
  "click",
  () => {
    if (
      restoreActiveGame()
    ) {
      showScreen(
        gameScreen
      );
    }
  }
);

seasonStatsButton.addEventListener(
  "click",
  () => {
    currentSeasonFilter =
      "All";

    renderSeasonStats(
      currentSeasonFilter
    );

    showScreen(
      seasonStatsScreen
    );

    void synchronizeCompletedGames();
  }
);

seasonStatsBackButton.addEventListener(
  "click",
  () => {
    refreshSeasonStatsSummary();

    showScreen(
      homeScreen
    );
  }
);

seasonFilterButtons.forEach(
  (button) => {
    button.addEventListener(
      "click",
      () => {
        renderSeasonStats(
          button.dataset.seasonFilter
        );
      }
    );
  }
);

gameHistoryButton.addEventListener(
  "click",
  () => {
    renderGameHistory();

    showScreen(
      historyScreen
    );

    void synchronizeCompletedGames();
  }
);

historyBackButton.addEventListener(
  "click",
  () => {
    refreshGameHistorySummary();

    showScreen(
      homeScreen
    );
  }
);

detailBackButton.addEventListener(
  "click",
  () => {
    renderGameHistory();

    showScreen(
      historyScreen
    );
  }
);

setupBackButton.addEventListener(
  "click",
  () => {
    showScreen(
      homeScreen
    );
  }
);

/* ======================================================
   START GAME
====================================================== */

gameSetupForm.addEventListener(
  "submit",
  (event) => {
    event.preventDefault();

    const playerNumber =
      playerNumberInput.value.trim();

    const opponent =
      opponentInput.value.trim();

    const date =
      gameDateInput.value;

    const locationInput =
      document.querySelector(
        'input[name="gameLocation"]:checked'
      );

    const typeInput =
      document.querySelector(
        'input[name="gameType"]:checked'
      );

    if (!playerNumber) {
      setupMessage.textContent =
        "Enter a player number.";

      playerNumberInput.focus();

      return;
    }

    if (!opponent) {
      setupMessage.textContent =
        "Enter an opponent.";

      opponentInput.focus();

      return;
    }

    if (!date) {
      setupMessage.textContent =
        "Select a game date.";

      gameDateInput.focus();

      return;
    }

    if (
      !locationInput ||
      !typeInput
    ) {
      setupMessage.textContent =
        "Complete the game details.";

      return;
    }

    currentGame = {
      playerNumber,
      opponent,
      date,
      location:
        locationInput.value,
      type:
        typeInput.value
    };

    resetGameStats();

    gameIsActive = true;

    savePlayerNumber(
      playerNumber
    );

    updateGameHeader();
    updateDisplay();
    writeActiveGame();
    refreshResumeCard();

    showScreen(
      gameScreen
    );
  }
);

/* ======================================================
   BUTTON FEEDBACK
====================================================== */

function showTapFeedback(button) {
  button.classList.remove(
    "stat-recorded"
  );

  void button.offsetWidth;

  button.classList.add(
    "stat-recorded"
  );

  window.setTimeout(() => {
    button.classList.remove(
      "stat-recorded"
    );
  }, 220);
}

/* ======================================================
   RECORD STAT
====================================================== */

function recordAction(action) {
  switch (action) {
    case "2pt-made":
      stats.twoMade++;
      stats.twoAttempted++;
      break;

    case "2pt-miss":
      stats.twoAttempted++;
      break;

    case "3pt-made":
      stats.threeMade++;
      stats.threeAttempted++;
      break;

    case "3pt-miss":
      stats.threeAttempted++;
      break;

    case "ft-made":
      stats.freeThrowMade++;
      stats.freeThrowAttempted++;
      break;

    case "ft-miss":
      stats.freeThrowAttempted++;
      break;

    case "oreb":
      stats.offensiveRebounds++;
      break;

    case "dreb":
      stats.defensiveRebounds++;
      break;

    case "assist":
      stats.assists++;
      break;

    case "steal":
      stats.steals++;
      break;

    case "block":
      stats.blocks++;
      break;

    case "turnover":
      stats.turnovers++;
      break;

    case "foul":
      stats.fouls++;
      break;

    default:
      return;
  }

  actionHistory.push(
    action
  );

  updateDisplay();
  writeActiveGame();
}

statButtons.forEach(
  (button) => {
    button.addEventListener(
      "click",
      () => {
        recordAction(
          button.dataset.action
        );

        showTapFeedback(
          button
        );
      }
    );
  }
);

/* ======================================================
   UNDO
====================================================== */

function undoLastAction() {
  if (
    actionHistory.length === 0
  ) {
    return;
  }

  const action =
    actionHistory.pop();

  switch (action) {
    case "2pt-made":
      stats.twoMade--;
      stats.twoAttempted--;
      break;

    case "2pt-miss":
      stats.twoAttempted--;
      break;

    case "3pt-made":
      stats.threeMade--;
      stats.threeAttempted--;
      break;

    case "3pt-miss":
      stats.threeAttempted--;
      break;

    case "ft-made":
      stats.freeThrowMade--;
      stats.freeThrowAttempted--;
      break;

    case "ft-miss":
      stats.freeThrowAttempted--;
      break;

    case "oreb":
      stats.offensiveRebounds--;
      break;

    case "dreb":
      stats.defensiveRebounds--;
      break;

    case "assist":
      stats.assists--;
      break;

    case "steal":
      stats.steals--;
      break;

    case "block":
      stats.blocks--;
      break;

    case "turnover":
      stats.turnovers--;
      break;

    case "foul":
      stats.fouls--;
      break;
  }

  updateDisplay();
  writeActiveGame();
}

undoButton.addEventListener(
  "click",
  undoLastAction
);

/* ======================================================
   MODALS
====================================================== */

function openModal(modal) {
  modal.classList.add(
    "is-open"
  );

  modal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.classList.add(
    "modal-open"
  );
}

function closeModal(modal) {
  modal.classList.remove(
    "is-open"
  );

  modal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.classList.remove(
    "modal-open"
  );
}

/* ======================================================
   END GAME
====================================================== */

endGameButton.addEventListener(
  "click",
  () => {
    finalPointsElement.textContent =
      calculatePoints();

    finalReboundsElement.textContent =
      calculateRebounds();

    finalAssistsElement.textContent =
      stats.assists;

    finalStealsElement.textContent =
      stats.steals;

    finalShootingElement.textContent =
      getShootingSummary();

    openModal(
      endGameModal
    );
  }
);

cancelEndGameButton.addEventListener(
  "click",
  () => {
    closeModal(
      endGameModal
    );
  }
);

/* ======================================================
   SAVE COMPLETED GAME
====================================================== */

confirmEndGameButton.addEventListener(
  "click",
  () => {
    const completedGame = {
      id:
        createGameId(),

      completedAt:
        new Date().toISOString(),

      syncStatus:
        "pending",

      season:
        CURRENT_SEASON,

      gameNumber:
        currentGameNumber,

      playerNumber:
        currentGame.playerNumber,

      opponent:
        currentGame.opponent,

      date:
        currentGame.date,

      location:
        currentGame.location,

      type:
        currentGame.type,

      points:
        calculatePoints(),

      offensiveRebounds:
        stats.offensiveRebounds,

      defensiveRebounds:
        stats.defensiveRebounds,

      rebounds:
        calculateRebounds(),

      assists:
        stats.assists,

      steals:
        stats.steals,

      blocks:
        stats.blocks,

      turnovers:
        stats.turnovers,

      fouls:
        stats.fouls,

      twoMade:
        stats.twoMade,

      twoAttempted:
        stats.twoAttempted,

      threeMade:
        stats.threeMade,

      threeAttempted:
        stats.threeAttempted,

      freeThrowMade:
        stats.freeThrowMade,

      freeThrowAttempted:
        stats.freeThrowAttempted,

      fieldGoalsMade:
        calculateFieldGoalsMade(),

      fieldGoalAttempts:
        calculateFieldGoalAttempts()
    };

    const savedSuccessfully =
      saveCompletedGame(
        completedGame
      );

    if (!savedSuccessfully) {
      console.error(
        "Completed game could not be saved."
      );

      return;
    }

    gameIsActive = false;

    advanceNextGameNumber(
      currentGameNumber
    );

    deleteActiveGame();

    currentGameNumber =
      getNextGameNumber();

    closeModal(
      endGameModal
    );

    resetGameStats();

    refreshResumeCard();
    refreshGameHistorySummary();
    refreshSeasonStatsSummary();

    showScreen(
      homeScreen
    );

    void synchronizeCompletedGames();
  }
);

/* ======================================================
   CANCEL GAME
====================================================== */

exitGameButton.addEventListener(
  "click",
  () => {
    openModal(
      cancelGameModal
    );
  }
);

keepGameButton.addEventListener(
  "click",
  () => {
    closeModal(
      cancelGameModal
    );
  }
);

discardGameButton.addEventListener(
  "click",
  () => {
    gameIsActive = false;

    deleteActiveGame();

    closeModal(
      cancelGameModal
    );

    resetGameStats();
    refreshResumeCard();

    showScreen(
      homeScreen
    );
  }
);

/* ======================================================
   EXISTING ACTIVE GAME
====================================================== */

resumeInsteadButton.addEventListener(
  "click",
  () => {
    closeModal(
      replaceGameModal
    );

    if (
      restoreActiveGame()
    ) {
      showScreen(
        gameScreen
      );
    }
  }
);

replaceGameButton.addEventListener(
  "click",
  async () => {
    gameIsActive = false;

    deleteActiveGame();

    closeModal(
      replaceGameModal
    );

    resetGameStats();
    refreshResumeCard();

    await synchronizeCompletedGames();

    prepareNewGameForm();

    showScreen(
      setupScreen
    );
  }
);

/* ======================================================
   MODAL BACKDROP
====================================================== */

[
  endGameModal,
  cancelGameModal,
  replaceGameModal
].forEach((modal) => {
  modal.addEventListener(
    "click",
    (event) => {
      if (
        event.target === modal
      ) {
        closeModal(
          modal
        );
      }
    }
  );
});

/* ======================================================
   AUTOSAVE / SYNC EVENTS
====================================================== */

document.addEventListener(
  "visibilitychange",
  () => {
    if (
      document.visibilityState ===
        "hidden" &&
      gameIsActive
    ) {
      writeActiveGame();
    }
  }
);

window.addEventListener(
  "pagehide",
  () => {
    if (
      gameIsActive
    ) {
      writeActiveGame();
    }
  }
);

window.addEventListener(
  "online",
  () => {
    void synchronizeCompletedGames();
  }
);

/* ======================================================
   INITIALIZE APP
====================================================== */

function initializeApp() {
  currentGameNumber =
    getNextGameNumber();

  playerNumberInput.value =
    getSavedPlayerNumber();

  gameDateInput.value =
    getTodayForDateInput();

  updateDisplay();
  refreshResumeCard();
  refreshGameHistorySummary();
  refreshSeasonStatsSummary();

  showScreen(
    homeScreen
  );

  void synchronizeCompletedGames();
}

initializeApp();
