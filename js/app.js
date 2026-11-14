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
let currentHistoryFilter = "All";
let syncPromise = null;
let syncRequested = false;
let retryTimer = null;
let retryDelay = 5000;
let selectedDetailGame = null;


let currentGame = {
  playerNumber: "2",
  opponent: "",
  date: "",
  location: "Home",
  type: "Regular Season"
};


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


const homeScreen =
  document.getElementById(
    "homeScreen"
  );

const setupScreen =
  document.getElementById(
    "setupScreen"
  );

const gameScreen =
  document.getElementById(
    "gameScreen"
  );

const historyScreen =
  document.getElementById(
    "historyScreen"
  );

const gameDetailScreen =
  document.getElementById(
    "gameDetailScreen"
  );

const seasonStatsScreen =
  document.getElementById(
    "seasonStatsScreen"
  );


const seasonStatsButton =
  document.getElementById(
    "seasonStatsButton"
  );

const seasonStatsSummary =
  document.getElementById(
    "seasonStatsSummary"
  );

const homeSeasonRecord =
  document.getElementById(
    "homeSeasonRecord"
  );

const seasonStatsBackButton =
  document.getElementById(
    "seasonStatsBackButton"
  );

const seasonFilterButtons =
  document.querySelectorAll(
    "[data-season-filter]"
  );

const seasonStatsEmpty =
  document.getElementById(
    "seasonStatsEmpty"
  );

const seasonFilterLabel =
  document.getElementById(
    "seasonFilterLabel"
  );

const seasonGamesPlayed =
  document.getElementById(
    "seasonGamesPlayed"
  );

const seasonRecord =
  document.getElementById(
    "seasonRecord"
  );

const seasonPpg =
  document.getElementById(
    "seasonPpg"
  );

const seasonRpg =
  document.getElementById(
    "seasonRpg"
  );

const seasonApg =
  document.getElementById(
    "seasonApg"
  );

const seasonSpg =
  document.getElementById(
    "seasonSpg"
  );

const seasonBpg =
  document.getElementById(
    "seasonBpg"
  );

const seasonTovpg =
  document.getElementById(
    "seasonTovpg"
  );

const seasonPfpg =
  document.getElementById(
    "seasonPfpg"
  );

const seasonFgPercent =
  document.getElementById(
    "seasonFgPercent"
  );

const seasonFgTotals =
  document.getElementById(
    "seasonFgTotals"
  );

const seasonThreePercent =
  document.getElementById(
    "seasonThreePercent"
  );

const seasonThreeTotals =
  document.getElementById(
    "seasonThreeTotals"
  );

const seasonFtPercent =
  document.getElementById(
    "seasonFtPercent"
  );

const seasonFtTotals =
  document.getElementById(
    "seasonFtTotals"
  );

const seasonTotalPoints =
  document.getElementById(
    "seasonTotalPoints"
  );

const seasonTotalRebounds =
  document.getElementById(
    "seasonTotalRebounds"
  );

const seasonTotalAssists =
  document.getElementById(
    "seasonTotalAssists"
  );

const seasonTotalSteals =
  document.getElementById(
    "seasonTotalSteals"
  );

const seasonTotalBlocks =
  document.getElementById(
    "seasonTotalBlocks"
  );

const seasonTotalOreb =
  document.getElementById(
    "seasonTotalOreb"
  );

const seasonTotalDreb =
  document.getElementById(
    "seasonTotalDreb"
  );


const newGameButton =
  document.getElementById(
    "newGameButton"
  );

const gameHistoryButton =
  document.getElementById(
    "gameHistoryButton"
  );

const gameHistorySummary =
  document.getElementById(
    "gameHistorySummary"
  );

const syncStatus =
  document.getElementById(
    "syncStatus"
  );

const syncStatusText =
  document.getElementById(
    "syncStatusText"
  );

const historyBackButton =
  document.getElementById(
    "historyBackButton"
  );

const detailBackButton =
  document.getElementById(
    "detailBackButton"
  );

const historyGameCount =
  document.getElementById(
    "historyGameCount"
  );

const historyList =
  document.getElementById(
    "historyList"
  );

const historyEmpty =
  document.getElementById(
    "historyEmpty"
  );


const resumeGameCard =
  document.getElementById(
    "resumeGameCard"
  );

const resumeGameButton =
  document.getElementById(
    "resumeGameButton"
  );

const resumeOpponent =
  document.getElementById(
    "resumeOpponent"
  );

const resumeDetails =
  document.getElementById(
    "resumeDetails"
  );

const resumeGameType =
  document.getElementById(
    "resumeGameType"
  );


const setupBackButton =
  document.getElementById(
    "setupBackButton"
  );

const gameSetupForm =
  document.getElementById(
    "gameSetupForm"
  );

const playerNumberInput =
  document.getElementById(
    "playerNumber"
  );

const opponentInput =
  document.getElementById(
    "opponentInput"
  );

const gameDateInput =
  document.getElementById(
    "gameDate"
  );

const setupMessage =
  document.getElementById(
    "setupMessage"
  );

const locationHome =
  document.getElementById(
    "locationHome"
  );

const typeRegular =
  document.getElementById(
    "typeRegular"
  );


const gameSeasonLabel =
  document.getElementById(
    "gameSeasonLabel"
  );

const gamePlayerNumber =
  document.getElementById(
    "gamePlayerNumber"
  );

const gameOpponent =
  document.getElementById(
    "gameOpponent"
  );

const gameTypeBadge =
  document.getElementById(
    "gameTypeBadge"
  );


const pointsElement =
  document.getElementById(
    "points"
  );

const reboundsElement =
  document.getElementById(
    "rebounds"
  );

const assistsElement =
  document.getElementById(
    "assists"
  );

const stealsElement =
  document.getElementById(
    "steals"
  );

const blocksElement =
  document.getElementById(
    "blocks"
  );

const turnoversElement =
  document.getElementById(
    "turnovers"
  );

const foulsElement =
  document.getElementById(
    "fouls"
  );

const fgPercentElement =
  document.getElementById(
    "fgPercent"
  );

const shootingSummaryElement =
  document.getElementById(
    "shootingSummary"
  );


const undoButton =
  document.getElementById(
    "undoButton"
  );

const endGameButton =
  document.getElementById(
    "endGameButton"
  );

const exitGameButton =
  document.getElementById(
    "exitGameButton"
  );


const endGameModal =
  document.getElementById(
    "endGameModal"
  );

const cancelEndGameButton =
  document.getElementById(
    "cancelEndGame"
  );

const confirmEndGameButton =
  document.getElementById(
    "confirmEndGame"
  );

const finalPointsElement =
  document.getElementById(
    "finalPoints"
  );

const finalReboundsElement =
  document.getElementById(
    "finalRebounds"
  );

const finalAssistsElement =
  document.getElementById(
    "finalAssists"
  );

const finalStealsElement =
  document.getElementById(
    "finalSteals"
  );

const finalShootingElement =
  document.getElementById(
    "finalShooting"
  );

const teamScoreInput =
  document.getElementById(
    "teamScoreInput"
  );

const opponentScoreInput =
  document.getElementById(
    "opponentScoreInput"
  );

const finalOpponentName =
  document.getElementById(
    "finalOpponentName"
  );

const scoreMessage =
  document.getElementById(
    "scoreMessage"
  );

const correctionModal =
  document.getElementById(
    "correctionModal"
  );

const correctionOptions =
  document.getElementById(
    "correctionOptions"
  );

const cancelCorrectionButton =
  document.getElementById(
    "cancelCorrection"
  );


const cancelGameModal =
  document.getElementById(
    "cancelGameModal"
  );

const keepGameButton =
  document.getElementById(
    "keepGameButton"
  );

const discardGameButton =
  document.getElementById(
    "discardGameButton"
  );


const replaceGameModal =
  document.getElementById(
    "replaceGameModal"
  );

const resumeInsteadButton =
  document.getElementById(
    "resumeInsteadButton"
  );

const replaceGameButton =
  document.getElementById(
    "replaceGameButton"
  );


const detailSeasonLabel =
  document.getElementById(
    "detailSeasonLabel"
  );

const detailTitle =
  document.getElementById(
    "detailTitle"
  );

const detailGameNumber =
  document.getElementById(
    "detailGameNumber"
  );

const detailOpponent =
  document.getElementById(
    "detailOpponent"
  );

const detailMeta =
  document.getElementById(
    "detailMeta"
  );

const detailFinalScoreCard =
  document.getElementById(
    "detailFinalScoreCard"
  );

const detailTeamScore =
  document.getElementById(
    "detailTeamScore"
  );

const detailOpponentScore =
  document.getElementById(
    "detailOpponentScore"
  );

const detailScoreOpponent =
  document.getElementById(
    "detailScoreOpponent"
  );

const detailResult =
  document.getElementById(
    "detailResult"
  );

const detailPoints =
  document.getElementById(
    "detailPoints"
  );

const detailRebounds =
  document.getElementById(
    "detailRebounds"
  );

const detailAssists =
  document.getElementById(
    "detailAssists"
  );

const detailSteals =
  document.getElementById(
    "detailSteals"
  );

const detailBlocks =
  document.getElementById(
    "detailBlocks"
  );

const detailTurnovers =
  document.getElementById(
    "detailTurnovers"
  );

const detailFouls =
  document.getElementById(
    "detailFouls"
  );

const detailFieldGoals =
  document.getElementById(
    "detailFieldGoals"
  );

const detailTwoPoint =
  document.getElementById(
    "detailTwoPoint"
  );

const detailThreePoint =
  document.getElementById(
    "detailThreePoint"
  );

const detailFreeThrows =
  document.getElementById(
    "detailFreeThrows"
  );

const detailOffensiveRebounds =
  document.getElementById(
    "detailOffensiveRebounds"
  );

const detailDefensiveRebounds =
  document.getElementById(
    "detailDefensiveRebounds"
  );

const shareStatsButton =
  document.getElementById(
    "shareStatsButton"
  );

const editGameButton = document.getElementById("editGameButton");
const editGameModal = document.getElementById("editGameModal");
const cancelEditGameButton = document.getElementById("cancelEditGame");
const saveEditGameButton = document.getElementById("saveEditGame");
const editGameMessage = document.getElementById("editGameMessage");
const editOpponent = document.getElementById("editOpponent");
const editDate = document.getElementById("editDate");
const editLocation = document.getElementById("editLocation");
const editType = document.getElementById("editType");
const editTeamScore = document.getElementById("editTeamScore");
const editOpponentScore = document.getElementById("editOpponentScore");
const editTwoMade = document.getElementById("editTwoMade");
const editTwoAttempted = document.getElementById("editTwoAttempted");
const editThreeMade = document.getElementById("editThreeMade");
const editThreeAttempted = document.getElementById("editThreeAttempted");
const editFreeThrowMade = document.getElementById("editFreeThrowMade");
const editFreeThrowAttempted = document.getElementById("editFreeThrowAttempted");
const editOreb = document.getElementById("editOreb");
const editDreb = document.getElementById("editDreb");
const editAssists = document.getElementById("editAssists");
const editSteals = document.getElementById("editSteals");
const editBlocks = document.getElementById("editBlocks");
const editTurnovers = document.getElementById("editTurnovers");
const editFouls = document.getElementById("editFouls");


const statButtons =
  document.querySelectorAll(
    "[data-action]"
  );


function showScreen(screen) {
  document
    .querySelectorAll(
      ".screen"
    )
    .forEach(
      (item) => {
        item.classList.remove(
          "active-screen"
        );
      }
    );

  screen.classList.add(
    "active-screen"
  );

  window.scrollTo(
    0,
    0
  );
}


function getTodayForDateInput() {
  const now =
    new Date();

  const year =
    now.getFullYear();

  const month =
    String(
      now.getMonth() + 1
    ).padStart(
      2,
      "0"
    );

  const day =
    String(
      now.getDate()
    ).padStart(
      2,
      "0"
    );

  return (
    `${year}-${month}-${day}`
  );
}


function calculatePoints() {
  return (
    stats.twoMade * 2 +
    stats.threeMade * 3 +
    stats.freeThrowMade
  );
}


function calculateRebounds() {
  return (
    stats.offensiveRebounds +
    stats.defensiveRebounds
  );
}


function calculateFieldGoalsMade() {
  return (
    stats.twoMade +
    stats.threeMade
  );
}


function calculateFieldGoalAttempts() {
  return (
    stats.twoAttempted +
    stats.threeAttempted
  );
}


function calculateFieldGoalPercentage() {
  const attempts =
    calculateFieldGoalAttempts();

  if (
    attempts === 0
  ) {
    return "—";
  }

  return (
    `${Math.round(
      (
        calculateFieldGoalsMade() /
        attempts
      ) *
        100
    )}%`
  );
}


function getShootingSummary() {
  return (
    `FG ${calculateFieldGoalsMade()}/${calculateFieldGoalAttempts()} · ` +
    `3PT ${stats.threeMade}/${stats.threeAttempted} · ` +
    `FT ${stats.freeThrowMade}/${stats.freeThrowAttempted}`
  );
}


function safeNumber(value) {
  return (
    Number(value) || 0
  );
}


function calculateGameResult(
  teamScore,
  opponentScore
) {
  if (
    teamScore === null ||
    teamScore === undefined ||
    teamScore === "" ||
    opponentScore === null ||
    opponentScore === undefined ||
    opponentScore === ""
  ) {
    return "";
  }

  const team = Number(teamScore);
  const opponent = Number(opponentScore);

  if (
    !Number.isFinite(team) ||
    !Number.isFinite(opponent)
  ) {
    return "";
  }

  if (team > opponent) {
    return "W";
  }

  if (team < opponent) {
    return "L";
  }

  return "T";
}


function getResultClass(result) {
  if (result === "W") {
    return "is-win";
  }

  if (result === "L") {
    return "is-loss";
  }

  return "is-tie";
}


function calculateRecord(games) {
  return games.reduce(
    (record, game) => {
      const result =
        game.result ||
        calculateGameResult(
          game.teamScore,
          game.opponentScore
        );

      if (result === "W") {
        record.wins++;
      } else if (result === "L") {
        record.losses++;
      } else if (result === "T") {
        record.ties++;
      }

      return record;
    },
    { wins: 0, losses: 0, ties: 0 }
  );
}


function formatRecord(record) {
  return record.ties > 0
    ? `${record.wins}-${record.losses}-${record.ties}`
    : `${record.wins}-${record.losses}`;
}


function formatPercentage(
  made,
  attempted
) {
  const attempts =
    safeNumber(
      attempted
    );

  const makes =
    safeNumber(
      made
    );

  if (
    attempts === 0
  ) {
    return "—";
  }

  return (
    `${Math.round(
      (
        makes /
        attempts
      ) *
        100
    )}%`
  );
}


function formatAverage(
  total,
  gamesPlayed
) {
  if (
    gamesPlayed === 0
  ) {
    return "0.0";
  }

  return (
    total /
    gamesPlayed
  ).toFixed(
    1
  );
}


function formatGameDate(
  dateString
) {
  if (
    !dateString
  ) {
    return (
      "Date unavailable"
    );
  }


  const parts =
    String(
      dateString
    )
      .split(
        "-"
      );


  if (
    parts.length !==
    3
  ) {
    return (
      String(
        dateString
      )
    );
  }


  const date =
    new Date(
      Number(
        parts[0]
      ),

      Number(
        parts[1]
      ) -
        1,

      Number(
        parts[2]
      )
    );


  return (
    date.toLocaleDateString(
      undefined,
      {
        month:
          "short",

        day:
          "numeric",

        year:
          "numeric"
      }
    )
  );
}


function escapeHtml(
  value
) {
  return (
    String(
      value ??
        ""
    )
      .replaceAll(
        "&",
        "&amp;"
      )
      .replaceAll(
        "<",
        "&lt;"
      )
      .replaceAll(
        ">",
        "&gt;"
      )
      .replaceAll(
        '"',
        "&quot;"
      )
      .replaceAll(
        "'",
        "&#039;"
      )
  );
}


function getSeasonGames(
  filter =
    "All"
) {
  return (
    readCompletedGames()
      .filter(
        (game) =>
          game.season ===
          CURRENT_SEASON
      )
      .filter(
        (game) =>
          filter ===
            "All" ||
          game.type ===
            filter
      )
  );
}


function calculateSeasonStats(
  games
) {
  const totals = {
    points:
      0,

    offensiveRebounds:
      0,

    defensiveRebounds:
      0,

    rebounds:
      0,

    assists:
      0,

    steals:
      0,

    blocks:
      0,

    turnovers:
      0,

    fouls:
      0,

    fieldGoalsMade:
      0,

    fieldGoalAttempts:
      0,

    threeMade:
      0,

    threeAttempted:
      0,

    freeThrowMade:
      0,

    freeThrowAttempted:
      0
  };


  games.forEach(
    (game) => {

      totals.points +=
        safeNumber(
          game.points
        );


      totals.offensiveRebounds +=
        safeNumber(
          game.offensiveRebounds
        );


      totals.defensiveRebounds +=
        safeNumber(
          game.defensiveRebounds
        );


      totals.rebounds +=
        safeNumber(
          game.rebounds
        );


      totals.assists +=
        safeNumber(
          game.assists
        );


      totals.steals +=
        safeNumber(
          game.steals
        );


      totals.blocks +=
        safeNumber(
          game.blocks
        );


      totals.turnovers +=
        safeNumber(
          game.turnovers
        );


      totals.fouls +=
        safeNumber(
          game.fouls
        );


      totals.fieldGoalsMade +=
        safeNumber(
          game.fieldGoalsMade
        );


      totals.fieldGoalAttempts +=
        safeNumber(
          game.fieldGoalAttempts
        );


      totals.threeMade +=
        safeNumber(
          game.threeMade
        );


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
    }
  );


  return {
    gamesPlayed:
      games.length,

    totals
  };
}


function getSeasonFilterLabel(
  filter
) {
  return (
    filter ===
      "All"
      ? "All Games"
      : filter
  );
}


function refreshSeasonStatsSummary() {
  const games = getSeasonGames("Regular Season");
  const record = calculateRecord(games);

  seasonStatsSummary.textContent =
    "View season averages and totals";

  if (homeSeasonRecord) {
    homeSeasonRecord.textContent =
      formatRecord(record);
  }
}


function renderSeasonStats(
  filter =
    currentSeasonFilter
) {
  currentSeasonFilter =
    filter;


  const games =
    getSeasonGames(
      currentSeasonFilter
    );


  const seasonData =
    calculateSeasonStats(
      games
    );


  const totals =
    seasonData.totals;


  const gamesPlayed =
    seasonData.gamesPlayed;


  const record =
    calculateRecord(
      games
    );


  seasonFilterButtons.forEach(
    (button) => {

      button
        .classList
        .toggle(
          "is-active",

          button
            .dataset
            .seasonFilter ===
            currentSeasonFilter
        );
    }
  );


  seasonStatsEmpty.hidden =
    gamesPlayed !==
    0;


  seasonFilterLabel.textContent =
    getSeasonFilterLabel(
      currentSeasonFilter
    );


  seasonGamesPlayed.textContent =
    gamesPlayed;


  seasonRecord.textContent =
    formatRecord(
      record
    );


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
    count ===
      0
      ? "No completed games yet"
      : `${count} completed ${
          count ===
            1
            ? "game"
            : "games"
        }`;
}


function deleteCompletedGame(
  gameId
) {
  const games =
    readCompletedGames();


  const gameToDelete =
    games.find(
      (game) =>
        game.id ===
        gameId
    );


  if (
    !gameToDelete
  ) {
    return;
  }


  const confirmed =
    window.confirm(
      `Delete Game ${gameToDelete.gameNumber} vs. ${gameToDelete.opponent}? This cannot be undone.`
    );


  if (
    !confirmed
  ) {
    return;
  }


  const remainingGames =
    games.filter(
      (game) =>
        game.id !==
        gameId
    );


  if (!queueDeletedGameId(gameId)) {
    window.alert("The deletion could not be saved. The game has been kept.");
    return;
  }
  if (!writeCompletedGames(remainingGames)) {
    showStorageWarning("The deletion is queued, but browser storage needs attention.");
  }

  renderGameHistory();

  refreshGameHistorySummary();

  refreshSeasonStatsSummary();


  void synchronizeCompletedGames();
}


function attachHistorySwipeActions(row, card, deleteButton, shareButton) {
  const revealDistance = 92;
  let startX = 0;
  let startY = 0;
  let startOffset = 0;
  let offset = 0;
  let pointerId = null;
  let horizontalSwipe = false;

  function setOffset(value) {
    offset = Math.max(-revealDistance, Math.min(revealDistance, value));
    card.style.transform = `translateX(${offset}px)`;
    const deleting = offset === -revealDistance;
    const sharing = offset === revealDistance;
    row.classList.toggle("is-delete-open", deleting);
    row.classList.toggle("is-share-open", sharing);
    deleteButton.disabled = !deleting;
    shareButton.disabled = !sharing;
    deleteButton.setAttribute("aria-hidden", String(!deleting));
    shareButton.setAttribute("aria-hidden", String(!sharing));
  }
  function closeRow() { setOffset(0); }
  function reveal(value) {
    historyList.querySelectorAll(".is-delete-open, .is-share-open").forEach((other) => {
      if (other !== row) other.dispatchEvent(new Event("close-history-actions"));
    });
    setOffset(value);
  }
  row.addEventListener("close-history-actions", closeRow);
  card.addEventListener("pointerdown", (event) => {
    if (!event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return;
    startX = event.clientX;
    startY = event.clientY;
    startOffset = offset;
    pointerId = event.pointerId;
    horizontalSwipe = false;
    card.setPointerCapture?.(pointerId);
  });
  card.addEventListener("pointermove", (event) => {
    if (event.pointerId !== pointerId) return;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    if (!horizontalSwipe) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 8) return;
      if (Math.abs(dy) > Math.abs(dx)) {
        pointerId = null;
        return;
      }
      horizontalSwipe = true;
      row.classList.add("is-dragging");
    }
    setOffset(startOffset + dx);
  });
  card.addEventListener("pointerup", (event) => {
    if (event.pointerId !== pointerId) return;
    pointerId = null;
    row.classList.remove("is-dragging");
    if (horizontalSwipe) {
      reveal(Math.abs(offset) >= revealDistance / 2 ? Math.sign(offset) * revealDistance : 0);
    }
  });
  card.addEventListener("pointercancel", () => {
    pointerId = null;
    row.classList.remove("is-dragging");
    setOffset(startOffset);
  });
  card.addEventListener("click", (event) => {
    if (horizontalSwipe || offset !== 0) {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!horizontalSwipe) closeRow();
      horizontalSwipe = false;
    }
  }, true);
  card.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      reveal(event.key === "ArrowLeft" ? -revealDistance : revealDistance);
      (event.key === "ArrowLeft" ? deleteButton : shareButton).focus();
    } else if (event.key === "Escape") {
      closeRow();
    }
  });
  [deleteButton, shareButton].forEach((button) => {
    button.addEventListener("keydown", (event) => {
      if (event.key === "Escape") { closeRow(); card.focus(); }
    });
  });
  card.setAttribute("aria-description", "Swipe left for Delete, right for Share. Use left or right arrow keys with a keyboard.");
  setOffset(0);
}


function renderGameHistory() {
  const games =
    readCompletedGames()
      .filter(
        (game) =>
          game.season ===
          CURRENT_SEASON
      )
      .filter((game) => currentHistoryFilter === "All" || game.type === currentHistoryFilter)
      .sort(
        (
          a,
          b
        ) =>
          (
            Number(
              b.gameNumber
            ) ||
            0
          ) -
          (
            Number(
              a.gameNumber
            ) ||
            0
          )
      );


  historyGameCount.textContent =
    games.length;


  historyList.innerHTML =
    "";


  historyEmpty.hidden =
    games.length !==
    0;


  document.getElementById("historyTypeFilter").value = currentHistoryFilter;
  historyEmpty.querySelector("strong").textContent = currentHistoryFilter === "All"
    ? "No completed games yet"
    : `No ${currentHistoryFilter.toLowerCase()} games yet`;
  historyEmpty.querySelector("span").textContent = currentHistoryFilter === "All"
    ? "Your saved games will appear here."
    : "Choose another game type or All Games to see more results.";

  games.forEach(
    (game) => {

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


      const shareButton = document.createElement("button");
      shareButton.type = "button";
      shareButton.className = "history-share-button";
      shareButton.textContent = "SHARE";
      shareButton.setAttribute("aria-label", `Share Game ${game.gameNumber} vs. ${game.opponent}`);
      shareButton.addEventListener("click", () => { void shareGame(game, shareButton); });

      const button =
        document.createElement(
          "button"
        );


      button.type =
        "button";


      button.className =
        "history-game-card";


      button.innerHTML =
        `
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

              ${
                game.result ||
                (
                  game.teamScore !== null &&
                  game.teamScore !== undefined &&
                  game.opponentScore !== null &&
                  game.opponentScore !== undefined
                )
                  ? `<span class="history-game-score">
                      <span class="history-result-badge ${getResultClass(
                        game.result ||
                        calculateGameResult(
                          game.teamScore,
                          game.opponentScore
                        )
                      )}">
                        ${escapeHtml(
                          game.result ||
                          calculateGameResult(
                            game.teamScore,
                            game.opponentScore
                          ) ||
                          "—"
                        )}
                      </span>
                      KHS ${safeNumber(
                        game.teamScore
                      )}–${safeNumber(
                        game.opponentScore
                      )} ${escapeHtml(
                        game.opponent
                      )}
                    </span>`
                  : ""
              }

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

              <span>
                REB
              </span>
            </div>


            <div>
              <strong>
                ${safeNumber(
                  game.assists
                )}
              </strong>

              <span>
                AST
              </span>
            </div>


            <div>
              <strong>
                ${safeNumber(
                  game.steals
                )}
              </strong>

              <span>
                STL
              </span>
            </div>


            <div>
              <strong>
                ${safeNumber(
                  game.blocks
                )}
              </strong>

              <span>
                BLK
              </span>
            </div>

          </div>
        `;


      button.addEventListener(
        "click",

        () => {

          if (
            row
              .classList
              .contains(
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


      row.appendChild(shareButton);
      row.appendChild(
        deleteButton
      );


      row.appendChild(
        button
      );


      attachHistorySwipeActions(row, button, deleteButton, shareButton);


      historyList.appendChild(
        row
      );
    }
  );
}


function renderGameDetail(
  game
) {
  selectedDetailGame =
    game;


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


  const result =
    game.result ||
    calculateGameResult(
      game.teamScore,
      game.opponentScore
    );


  const hasFinalScore =
    result !== "";


  detailFinalScoreCard.hidden =
    !hasFinalScore;


  if (hasFinalScore) {
    detailTeamScore.textContent =
      safeNumber(
        game.teamScore
      );

    detailOpponentScore.textContent =
      safeNumber(
        game.opponentScore
      );

    detailScoreOpponent.textContent =
      String(
        game.opponent ||
        "Opponent"
      ).toUpperCase();

    detailResult.textContent =
      result;

    detailResult.className =
      `detail-result-badge ${getResultClass(
        result
      )}`;
  }


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


function savePlayerNumber(
  number
) {
  if (
    !canUseStorage
  ) {
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
  if (
    !canUseStorage
  ) {
    return "2";
  }


  try {

    return (
      localStorage.getItem(
        PLAYER_NUMBER_KEY
      ) ||
      "2"
    );

  } catch (error) {

    return "2";
  }
}


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


  if (
    !saved
  ) {
    resumeGameCard.hidden =
      true;

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


  resumeGameCard.hidden =
    false;
}


function restoreActiveGame() {
  const saved =
    readActiveGame();


  if (
    !saved
  ) {
    return false;
  }


  currentGameNumber =
    Number(
      saved.gameNumber
    ) ||
    1;


  currentGame = {

    playerNumber:
      String(
        saved
          .game
          .playerNumber ||
        "2"
      ),


    opponent:
      String(
        saved
          .game
          .opponent ||
        ""
      ),


    date:
      String(
        saved
          .game
          .date ||
        ""
      ),


    location:
      String(
        saved
          .game
          .location ||
        "Home"
      ),


    type:
      String(
        saved
          .game
          .type ||
        "Regular Season"
      )
  };


  Object.keys(
    stats
  ).forEach(
    (key) => {

      stats[key] =
        Number(
          saved
            .stats[
              key
            ]
        ) ||
        0;
    }
  );


  actionHistory.length =
    0;


  if (
    Array.isArray(
      saved.history
    )
  ) {
    actionHistory.push(
      ...saved.history
    );
  }


  gameIsActive =
    true;


  updateGameHeader();

  updateDisplay();


  return true;
}


function prepareNewGameForm() {
  currentGameNumber =
    getNextGameNumber();


  playerNumberInput.value =
    getSavedPlayerNumber();


  opponentInput.value =
    "";


  gameDateInput.value =
    getTodayForDateInput();


  locationHome.checked =
    true;


  typeRegular.checked =
    true;


  setupMessage.textContent =
    "";
}


function updateGameHeader() {
  gameSeasonLabel.textContent =
    `${CURRENT_SEASON} SEASON · GAME ${currentGameNumber}`;


  gamePlayerNumber.textContent =
    `#${currentGame.playerNumber}`;


  gameOpponent.textContent =
    `vs. ${currentGame.opponent} · ${currentGame.location}`;


  gameTypeBadge.textContent =
    currentGame.type
      .toUpperCase();
}


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
    actionHistory.length ===
    0;
}


function resetGameStats() {
  Object.keys(
    stats
  ).forEach(
    (key) => {
      stats[key] =
        0;
    }
  );


  actionHistory.length =
    0;


  updateDisplay();
}


newGameButton.addEventListener(
  "click",

  async () => {

    const savedGame =
      readActiveGame();


    if (
      savedGame
    ) {
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
          button
            .dataset
            .seasonFilter
        );
      }
    );
  }
);


document.getElementById("historyTypeFilter").addEventListener("change", (event) => {
  currentHistoryFilter = event.target.value;
  renderGameHistory();
});


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


if (
  shareStatsButton
) {
  shareStatsButton.addEventListener(
    "click",

    () => {

      void shareSelectedGame();
    }
  );
}


setupBackButton.addEventListener(
  "click",

  () => {

    showScreen(
      homeScreen
    );
  }
);


gameSetupForm.addEventListener(
  "submit",

  (event) => {

    event.preventDefault();


    const playerNumber =
      playerNumberInput
        .value
        .trim();


    const opponent =
      opponentInput
        .value
        .trim();


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


    if (
      !playerNumber
    ) {
      setupMessage.textContent =
        "Enter a player number.";

      playerNumberInput.focus();

      return;
    }


    if (
      !opponent
    ) {
      setupMessage.textContent =
        "Enter an opponent.";

      opponentInput.focus();

      return;
    }


    if (
      !date
    ) {
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


    gameIsActive =
      true;


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


const tapFeedbackTimers = new WeakMap();

function showTapFeedback(
  button,
  action
) {
  window.clearTimeout(tapFeedbackTimers.get(button));

  const isMiss =
    action === "2pt-miss" ||
    action === "3pt-miss" ||
    action === "ft-miss";

  button.classList.remove(
    "stat-recorded",
    "stat-recorded-make",
    "stat-recorded-miss"
  );

  void button.offsetWidth;

  button.classList.add(
    "stat-recorded",
    isMiss
      ? "stat-recorded-miss"
      : "stat-recorded-make"
  );

  tapFeedbackTimers.set(button, window.setTimeout(
    () => {
      button.classList.remove(
        "stat-recorded",
        "stat-recorded-make",
        "stat-recorded-miss"
      );
    },
    560
  ));
}


function recordAction(
  action
) {
  switch (
    action
  ) {

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
          button,
          button.dataset.action
        );
      }
    );
  }
);


const CORRECTION_LABELS = {
  "2pt-made": "2PT Made",
  "2pt-miss": "2PT Miss",
  "3pt-made": "3PT Made",
  "3pt-miss": "3PT Miss",
  "ft-made": "FT Made",
  "ft-miss": "FT Miss",
  oreb: "Offensive Rebound",
  dreb: "Defensive Rebound",
  assist: "Assist",
  steal: "Steal",
  block: "Block",
  turnover: "Turnover",
  foul: "Personal Foul"
};


function reverseAction(action) {
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

    default:
      return false;
  }

  return true;
}


function correctRecordedAction(action) {
  const actionIndex =
    actionHistory.lastIndexOf(
      action
    );

  if (actionIndex === -1) {
    return;
  }

  if (!reverseAction(action)) {
    return;
  }

  actionHistory.splice(
    actionIndex,
    1
  );

  updateDisplay();
  writeActiveGame();
  closeModal(
    correctionModal
  );
}


function renderCorrectionOptions() {
  const counts =
    actionHistory.reduce(
      (map, action) => {
        map[action] =
          (map[action] || 0) + 1;
        return map;
      },
      {}
    );

  correctionOptions.innerHTML =
    "";

  Object.keys(
    CORRECTION_LABELS
  ).forEach(
    (action) => {
      const count =
        counts[action] || 0;

      if (count === 0) {
        return;
      }

      const button =
        document.createElement(
          "button"
        );

      button.type =
        "button";

      button.className =
        "correction-option";

      button.innerHTML =
        `<span>${CORRECTION_LABELS[action]}</span><strong>${count}</strong>`;

      button.addEventListener(
        "click",
        () => {
          button.classList.remove(
            "correction-recorded"
          );

          void button.offsetWidth;

          button.classList.add(
            "correction-recorded"
          );

          window.setTimeout(
            () => {
              correctRecordedAction(
                action
              );
            },
            700
          );
        }
      );

      correctionOptions.appendChild(
        button
      );
    }
  );
}


undoButton.addEventListener(
  "click",
  () => {
    if (
      actionHistory.length === 0
    ) {
      return;
    }

    renderCorrectionOptions();
    openModal(
      correctionModal
    );
  }
);


cancelCorrectionButton.addEventListener(
  "click",
  () => {
    closeModal(
      correctionModal
    );
  }
);


function getNonNegativeInteger(input) {
  const value = Number(input.value);

  if (
    input.value === "" ||
    !Number.isInteger(value) ||
    value < 0
  ) {
    return null;
  }

  return value;
}


function openEditGame() {
  if (!selectedDetailGame) {
    return;
  }

  const game = selectedDetailGame;

  editOpponent.value = game.opponent || "";
  editDate.value = String(game.date || "").slice(0, 10);
  editLocation.value = game.location || "Home";
  editType.value = game.type || "Regular Season";
  editTeamScore.value =
    game.teamScore ?? "";
  editOpponentScore.value =
    game.opponentScore ?? "";
  editTwoMade.value = safeNumber(game.twoMade);
  editTwoAttempted.value = safeNumber(game.twoAttempted);
  editThreeMade.value = safeNumber(game.threeMade);
  editThreeAttempted.value = safeNumber(game.threeAttempted);
  editFreeThrowMade.value = safeNumber(game.freeThrowMade);
  editFreeThrowAttempted.value = safeNumber(game.freeThrowAttempted);
  editOreb.value = safeNumber(game.offensiveRebounds);
  editDreb.value = safeNumber(game.defensiveRebounds);
  editAssists.value = safeNumber(game.assists);
  editSteals.value = safeNumber(game.steals);
  editBlocks.value = safeNumber(game.blocks);
  editTurnovers.value = safeNumber(game.turnovers);
  editFouls.value = safeNumber(game.fouls);
  editGameMessage.textContent = "";

  openModal(editGameModal);
}


function saveEditedGame() {
  if (!selectedDetailGame) {
    return;
  }

  const opponent = editOpponent.value.trim();
  const date = editDate.value;

  const values = {
    teamScore: getNonNegativeInteger(editTeamScore),
    opponentScore: getNonNegativeInteger(editOpponentScore),
    twoMade: getNonNegativeInteger(editTwoMade),
    twoAttempted: getNonNegativeInteger(editTwoAttempted),
    threeMade: getNonNegativeInteger(editThreeMade),
    threeAttempted: getNonNegativeInteger(editThreeAttempted),
    freeThrowMade: getNonNegativeInteger(editFreeThrowMade),
    freeThrowAttempted: getNonNegativeInteger(editFreeThrowAttempted),
    offensiveRebounds: getNonNegativeInteger(editOreb),
    defensiveRebounds: getNonNegativeInteger(editDreb),
    assists: getNonNegativeInteger(editAssists),
    steals: getNonNegativeInteger(editSteals),
    blocks: getNonNegativeInteger(editBlocks),
    turnovers: getNonNegativeInteger(editTurnovers),
    fouls: getNonNegativeInteger(editFouls)
  };

  if (!opponent || !date) {
    editGameMessage.textContent =
      "Opponent and game date are required.";
    return;
  }

  if (Object.values(values).some((value) => value === null)) {
    editGameMessage.textContent =
      "Enter valid whole numbers for the score and stats.";
    return;
  }

  if (
    values.twoMade > values.twoAttempted ||
    values.threeMade > values.threeAttempted ||
    values.freeThrowMade > values.freeThrowAttempted
  ) {
    editGameMessage.textContent =
      "Made shots cannot be greater than attempts.";
    return;
  }

  const fieldGoalsMade =
    values.twoMade + values.threeMade;
  const fieldGoalAttempts =
    values.twoAttempted + values.threeAttempted;
  const rebounds =
    values.offensiveRebounds + values.defensiveRebounds;
  const points =
    values.twoMade * 2 +
    values.threeMade * 3 +
    values.freeThrowMade;
  const result =
    calculateGameResult(
      values.teamScore,
      values.opponentScore
    );

  const updatedGame = {
    ...selectedDetailGame,
    opponent,
    date,
    location: editLocation.value,
    type: editType.value,
    ...values,
    rebounds,
    fieldGoalsMade,
    fieldGoalAttempts,
    points,
    result,
    syncStatus: "pending"
  };

  if (!updateCompletedGame(updatedGame)) {
    editGameMessage.textContent =
      "The game could not be updated.";
    return;
  }

  selectedDetailGame = updatedGame;
  renderGameDetail(updatedGame);
  refreshGameHistorySummary();
  refreshSeasonStatsSummary();
  closeModal(editGameModal);

  void synchronizeCompletedGames();
}


editGameButton.addEventListener("click", openEditGame);

cancelEditGameButton.addEventListener(
  "click",
  () => closeModal(editGameModal)
);

saveEditGameButton.addEventListener(
  "click",
  saveEditedGame
);


const modalFocus = new WeakMap();
const focusableSelector = 'button:not([disabled]), input:not([disabled]), select:not([disabled]), a[href], [tabindex="0"]';

function openModal(modal) {
  modalFocus.set(modal, document.activeElement);
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  const target = modal.querySelector(focusableSelector);
  window.requestAnimationFrame(() => {
    if (modal.classList.contains("is-open") && target) target.focus();
  });
}

function closeModal(modal) {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  const previous = modalFocus.get(modal);
  if (previous?.isConnected) previous.focus();
}

document.addEventListener("keydown", (event) => {
  const modal = document.querySelector('.modal-backdrop.is-open');
  if (!modal) return;
  if (event.key === "Escape") {
    event.preventDefault();
    closeModal(modal);
  } else if (event.key === "Tab") {
    const items = [...modal.querySelectorAll(focusableSelector)]
      .filter((item) => item.getClientRects().length);
    const first = items[0];
    const last = items[items.length - 1];
    if (!first) { event.preventDefault(); return; }
    if (!modal.contains(document.activeElement) ||
        (event.shiftKey && document.activeElement === first) ||
        (!event.shiftKey && document.activeElement === last)) {
      event.preventDefault();
      (event.shiftKey ? last : first).focus();
    }
  }
});


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


    teamScoreInput.value =
      "";


    opponentScoreInput.value =
      "";


    finalOpponentName.textContent =
      currentGame.opponent ||
      "Opponent";


    scoreMessage.textContent =
      "";


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


confirmEndGameButton.addEventListener(
  "click",

  () => {

    const teamScore =
      Number(
        teamScoreInput.value
      );


    const opponentScore =
      Number(
        opponentScoreInput.value
      );


    if (
      teamScoreInput.value === "" ||
      opponentScoreInput.value === "" ||
      !Number.isInteger(teamScore) ||
      !Number.isInteger(opponentScore) ||
      teamScore < 0 ||
      opponentScore < 0
    ) {
      scoreMessage.textContent =
        "Enter both final scores before saving.";

      return;
    }


    const result =
      calculateGameResult(
        teamScore,
        opponentScore
      );


    const completedGame = {

      id:
        createGameId(),


      completedAt:
        new Date()
          .toISOString(),


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


      teamScore,


      opponentScore,


      result,


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


    if (
      !savedSuccessfully
    ) {
      scoreMessage.textContent = "The game could not be saved. Keep this page open and free browser storage, then try again.";

      return;
    }


    gameIsActive =
      false;


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

    gameIsActive =
      false;


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

    gameIsActive =
      false;


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


[
  endGameModal,
  correctionModal,
  editGameModal,
  cancelGameModal,
  replaceGameModal
].forEach(
  (modal) => {

    modal.addEventListener(
      "click",

      (event) => {

        if (
          event.target ===
          modal
        ) {
          closeModal(
            modal
          );
        }
      }
    );
  }
);


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
  "online",

  () => {

    setSyncStatus(
      "syncing"
    );


    void synchronizeCompletedGames();
  }
);


window.addEventListener(
  "offline",

  () => {

    setSyncStatus(
      "offline"
    );
  }
);


function initializeApp() {
  if (!canUseStorage) {
    showStorageWarning("Browser storage is unavailable. Game progress cannot be saved on this device.");
  }
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


  setSyncStatus(
    navigator.onLine
      ? "syncing"
      : "offline"
  );


  void synchronizeCompletedGames();
}


initializeApp();
