/* ======================================================
   BASKETBALL STAT TRACKER
====================================================== */


/* ======================================================
   APP SETTINGS
====================================================== */

const CURRENT_SEASON = "2026–27";

const ACTIVE_GAME_KEY =
  "basketballStatTracker.activeGame";

const PLAYER_NUMBER_KEY =
  "basketballStatTracker.playerNumber";

const COMPLETED_GAMES_KEY =
  "basketballStatTracker.completedGames";

let currentGameNumber = 1;
let gameIsActive = false;


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

const homeScreen =
  document.getElementById("homeScreen");

const setupScreen =
  document.getElementById("setupScreen");

const gameScreen =
  document.getElementById("gameScreen");

const historyScreen =
  document.getElementById("historyScreen");

const gameDetailScreen =
  document.getElementById("gameDetailScreen");


const newGameButton =
  document.getElementById("newGameButton");

const gameHistoryButton =
  document.getElementById("gameHistoryButton");

const gameHistorySummary =
  document.getElementById("gameHistorySummary");

const historyBackButton =
  document.getElementById("historyBackButton");

const detailBackButton =
  document.getElementById("detailBackButton");

const historyGameCount =
  document.getElementById("historyGameCount");

const historyList =
  document.getElementById("historyList");

const historyEmpty =
  document.getElementById("historyEmpty");

const resumeGameCard =
  document.getElementById("resumeGameCard");

const resumeGameButton =
  document.getElementById("resumeGameButton");

const resumeOpponent =
  document.getElementById("resumeOpponent");

const resumeDetails =
  document.getElementById("resumeDetails");

const resumeGameType =
  document.getElementById("resumeGameType");


const setupBackButton =
  document.getElementById("setupBackButton");

const gameSetupForm =
  document.getElementById("gameSetupForm");

const playerNumberInput =
  document.getElementById("playerNumber");

const opponentInput =
  document.getElementById("opponentInput");

const gameDateInput =
  document.getElementById("gameDate");

const setupMessage =
  document.getElementById("setupMessage");


const locationHome =
  document.getElementById("locationHome");

const typeRegular =
  document.getElementById("typeRegular");


const gameSeasonLabel =
  document.getElementById("gameSeasonLabel");

const gamePlayerNumber =
  document.getElementById("gamePlayerNumber");

const gameOpponent =
  document.getElementById("gameOpponent");

const gameTypeBadge =
  document.getElementById("gameTypeBadge");


const pointsElement =
  document.getElementById("points");

const reboundsElement =
  document.getElementById("rebounds");

const assistsElement =
  document.getElementById("assists");

const stealsElement =
  document.getElementById("steals");

const blocksElement =
  document.getElementById("blocks");

const turnoversElement =
  document.getElementById("turnovers");

const foulsElement =
  document.getElementById("fouls");

const fgPercentElement =
  document.getElementById("fgPercent");

const shootingSummaryElement =
  document.getElementById("shootingSummary");


const undoButton =
  document.getElementById("undoButton");

const endGameButton =
  document.getElementById("endGameButton");

const exitGameButton =
  document.getElementById("exitGameButton");


const endGameModal =
  document.getElementById("endGameModal");

const cancelEndGameButton =
  document.getElementById("cancelEndGame");

const confirmEndGameButton =
  document.getElementById("confirmEndGame");

const finalPointsElement =
  document.getElementById("finalPoints");

const finalReboundsElement =
  document.getElementById("finalRebounds");

const finalAssistsElement =
  document.getElementById("finalAssists");

const finalStealsElement =
  document.getElementById("finalSteals");

const finalShootingElement =
  document.getElementById("finalShooting");


const cancelGameModal =
  document.getElementById("cancelGameModal");

const keepGameButton =
  document.getElementById("keepGameButton");

const discardGameButton =
  document.getElementById("discardGameButton");


const replaceGameModal =
  document.getElementById("replaceGameModal");

const resumeInsteadButton =
  document.getElementById("resumeInsteadButton");

const replaceGameButton =
  document.getElementById("replaceGameButton");


const detailSeasonLabel =
  document.getElementById("detailSeasonLabel");

const detailTitle =
  document.getElementById("detailTitle");

const detailGameNumber =
  document.getElementById("detailGameNumber");

const detailOpponent =
  document.getElementById("detailOpponent");

const detailMeta =
  document.getElementById("detailMeta");

const detailPoints =
  document.getElementById("detailPoints");

const detailRebounds =
  document.getElementById("detailRebounds");

const detailAssists =
  document.getElementById("detailAssists");

const detailSteals =
  document.getElementById("detailSteals");

const detailBlocks =
  document.getElementById("detailBlocks");

const detailTurnovers =
  document.getElementById("detailTurnovers");

const detailFouls =
  document.getElementById("detailFouls");

const detailFieldGoals =
  document.getElementById("detailFieldGoals");

const detailTwoPoint =
  document.getElementById("detailTwoPoint");

const detailThreePoint =
  document.getElementById("detailThreePoint");

const detailFreeThrows =
  document.getElementById("detailFreeThrows");

const detailOffensiveRebounds =
  document.getElementById("detailOffensiveRebounds");

const detailDefensiveRebounds =
  document.getElementById("detailDefensiveRebounds");


const statButtons =
  document.querySelectorAll("[data-action]");


/* ======================================================
   SCREEN NAVIGATION
====================================================== */

function showScreen(screen) {

  document
    .querySelectorAll(".screen")
    .forEach((item) => {
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

  const year =
    now.getFullYear();

  const month =
    String(now.getMonth() + 1)
      .padStart(2, "0");

  const day =
    String(now.getDate())
      .padStart(2, "0");

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

  if (attempts === 0) {
    return "—";
  }

  return (
    Math.round(
      (
        calculateFieldGoalsMade() /
        attempts
      ) * 100
    ) + "%"
  );
}


function getShootingSummary() {

  return (
    `FG ${calculateFieldGoalsMade()}/${calculateFieldGoalAttempts()} · ` +
    `3PT ${stats.threeMade}/${stats.threeAttempted} · ` +
    `FT ${stats.freeThrowMade}/${stats.freeThrowAttempted}`
  );
}


/* ======================================================
   LOCAL STORAGE CHECK
====================================================== */

function storageAvailable() {

  try {

    const testKey =
      "__basketball_storage_test__";

    localStorage.setItem(
      testKey,
      "1"
    );

    localStorage.removeItem(
      testKey
    );

    return true;

  } catch (error) {

    console.error(
      "Local storage unavailable:",
      error
    );

    return false;
  }
}


const canUseStorage =
  storageAvailable();


/* ======================================================
   ACTIVE GAME STORAGE
====================================================== */

function readActiveGame() {

  if (!canUseStorage) {
    return null;
  }

  try {

    const raw =
      localStorage.getItem(
        ACTIVE_GAME_KEY
      );

    if (!raw) {
      return null;
    }

    const saved =
      JSON.parse(raw);

    if (
      !saved ||
      saved.active !== true ||
      !saved.game ||
      !saved.stats
    ) {
      return null;
    }

    return saved;

  } catch (error) {

    console.error(
      "Could not read active game:",
      error
    );

    return null;
  }
}


function writeActiveGame() {

  if (
    !canUseStorage ||
    !gameIsActive
  ) {
    return;
  }

  const payload = {

    version: 2,

    active: true,

    season:
      CURRENT_SEASON,

    gameNumber:
      currentGameNumber,

    game: {
      ...currentGame
    },

    stats: {
      ...stats
    },

    history: [
      ...actionHistory
    ],

    savedAt:
      new Date().toISOString()
  };

  try {

    localStorage.setItem(
      ACTIVE_GAME_KEY,
      JSON.stringify(payload)
    );

  } catch (error) {

    console.error(
      "Could not save active game:",
      error
    );
  }
}


function deleteActiveGame() {

  if (!canUseStorage) {
    return;
  }

  try {

    localStorage.removeItem(
      ACTIVE_GAME_KEY
    );

  } catch (error) {

    console.error(
      "Could not remove active game:",
      error
    );
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

    const raw =
      localStorage.getItem(
        COMPLETED_GAMES_KEY
      );

    if (!raw) {
      return [];
    }

    const saved =
      JSON.parse(raw);

    return Array.isArray(saved)
      ? saved
      : [];

  } catch (error) {

    console.error(
      "Could not read completed games:",
      error
    );

    return [];
  }
}


function writeCompletedGames(games) {

  if (!canUseStorage) {
    return false;
  }

  try {

    localStorage.setItem(
      COMPLETED_GAMES_KEY,
      JSON.stringify(games)
    );

    return true;

  } catch (error) {

    console.error(
      "Could not save completed games:",
      error
    );

    return false;
  }
}


function saveCompletedGame(game) {

  const games =
    readCompletedGames();

  games.push(game);

  return writeCompletedGames(
    games
  );
}


function getNextGameNumber() {

  const seasonGames =
    readCompletedGames().filter(
      (game) =>
        game.season === CURRENT_SEASON
    );

  if (seasonGames.length === 0) {
    return 1;
  }

  const highestGameNumber =
    Math.max(
      ...seasonGames.map(
        (game) =>
          Number(game.gameNumber) || 0
      )
    );

  return highestGameNumber + 1;
}


function createGameId() {

  if (
    window.crypto &&
    typeof window.crypto.randomUUID === "function"
  ) {

    return window.crypto.randomUUID();
  }

  return (
    `game-${Date.now()}-` +
    Math.random()
      .toString(36)
      .slice(2, 10)
  );
}


function formatGameDate(dateString) {

  if (!dateString) {
    return "Date unavailable";
  }

  const parts =
    dateString.split("-");

  if (parts.length !== 3) {
    return dateString;
  }

  const date =
    new Date(
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


function formatPercentage(
  made,
  attempted
) {

  const attempts =
    Number(attempted) || 0;

  const makes =
    Number(made) || 0;

  if (attempts === 0) {
    return "—";
  }

  return (
    `${Math.round(
      (makes / attempts) * 100
    )}%`
  );
}


function refreshGameHistorySummary() {

  const count =
    readCompletedGames()
      .filter(
        (game) =>
          game.season === CURRENT_SEASON
      )
      .length;

  gameHistorySummary.textContent =
    count === 0
      ? "No completed games yet"
      : `${count} completed ${count === 1 ? "game" : "games"}`;
}


function renderGameHistory() {

  const games =
    readCompletedGames()
      .filter(
        (game) =>
          game.season === CURRENT_SEASON
      )
      .sort(
        (a, b) =>
          (Number(b.gameNumber) || 0) -
          (Number(a.gameNumber) || 0)
      );

  historyGameCount.textContent =
    games.length;

  historyList.innerHTML = "";

  historyEmpty.hidden =
    games.length !== 0;


  games.forEach(
    (game) => {

      const button =
        document.createElement(
          "button"
        );

      button.type = "button";

      button.className =
        "history-game-card";


      button.innerHTML = `
        <div class="history-game-card-top">

          <div class="history-game-copy">

            <span class="history-game-label">
              GAME ${game.gameNumber}
            </span>

            <strong class="history-game-opponent">
              vs. ${escapeHtml(game.opponent)}
            </strong>

            <span class="history-game-meta">
              ${escapeHtml(formatGameDate(game.date))} ·
              ${escapeHtml(game.location)} ·
              ${escapeHtml(game.type)}
            </span>

          </div>

          <div class="history-game-points">

            <strong>
              ${Number(game.points) || 0}
            </strong>

            <span>
              PTS
            </span>

          </div>

        </div>

        <div class="history-game-stats">

          <div>
            <strong>
              ${Number(game.rebounds) || 0}
            </strong>
            <span>REB</span>
          </div>

          <div>
            <strong>
              ${Number(game.assists) || 0}
            </strong>
            <span>AST</span>
          </div>

          <div>
            <strong>
              ${Number(game.steals) || 0}
            </strong>
            <span>STL</span>
          </div>

          <div>
            <strong>
              ${Number(game.blocks) || 0}
            </strong>
            <span>BLK</span>
          </div>

        </div>
      `;


      button.addEventListener(
        "click",
        () => {

          renderGameDetail(
            game
          );

          showScreen(
            gameDetailScreen
          );
        }
      );


      historyList.appendChild(
        button
      );
    }
  );
}


function renderGameDetail(game) {

  const fieldGoalsMade =
    Number(
      game.fieldGoalsMade
    ) || 0;

  const fieldGoalAttempts =
    Number(
      game.fieldGoalAttempts
    ) || 0;


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
    `${formatGameDate(game.date)}`;


  detailPoints.textContent =
    Number(game.points) || 0;


  detailRebounds.textContent =
    Number(game.rebounds) || 0;


  detailAssists.textContent =
    Number(game.assists) || 0;


  detailSteals.textContent =
    Number(game.steals) || 0;


  detailBlocks.textContent =
    Number(game.blocks) || 0;


  detailTurnovers.textContent =
    Number(game.turnovers) || 0;


  detailFouls.textContent =
    Number(game.fouls) || 0;


  detailFieldGoals.textContent =
    `${fieldGoalsMade}/${fieldGoalAttempts} · ` +
    `${formatPercentage(
      fieldGoalsMade,
      fieldGoalAttempts
    )}`;


  detailTwoPoint.textContent =
    `${Number(game.twoMade) || 0}/` +
    `${Number(game.twoAttempted) || 0} · ` +
    `${formatPercentage(
      game.twoMade,
      game.twoAttempted
    )}`;


  detailThreePoint.textContent =
    `${Number(game.threeMade) || 0}/` +
    `${Number(game.threeAttempted) || 0} · ` +
    `${formatPercentage(
      game.threeMade,
      game.threeAttempted
    )}`;


  detailFreeThrows.textContent =
    `${Number(game.freeThrowMade) || 0}/` +
    `${Number(game.freeThrowAttempted) || 0} · ` +
    `${formatPercentage(
      game.freeThrowMade,
      game.freeThrowAttempted
    )}`;


  detailOffensiveRebounds.textContent =
    Number(
      game.offensiveRebounds
    ) || 0;


  detailDefensiveRebounds.textContent =
    Number(
      game.defensiveRebounds
    ) || 0;
}


function escapeHtml(value) {

  return String(
    value ?? ""
  )
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
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
    (Number(savedStats.twoMade) || 0) * 2 +
    (Number(savedStats.threeMade) || 0) * 3 +
    (Number(savedStats.freeThrowMade) || 0)
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
  ).forEach(
    (key) => {

      stats[key] =
        Number(
          saved.stats[key]
        ) || 0;
    }
  );


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


/* ======================================================
   RESET STATS
====================================================== */

function resetGameStats() {

  Object.keys(
    stats
  ).forEach(
    (key) => {

      stats[key] = 0;
    }
  );

  actionHistory.length = 0;

  updateDisplay();
}


/* ======================================================
   HOME EVENTS
====================================================== */

newGameButton.addEventListener(
  "click",
  () => {

    const savedGame =
      readActiveGame();

    if (savedGame) {

      openModal(
        replaceGameModal
      );

      return;
    }


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


gameHistoryButton.addEventListener(
  "click",
  () => {

    renderGameHistory();

    showScreen(
      historyScreen
    );
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
      playerNumberInput.value
        .trim();


    const opponent =
      opponentInput.value
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

      playerNumber:
        playerNumber,

      opponent:
        opponent,

      date:
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


    /*
      IMPORTANT:
      Save the game immediately when
      START GAME is pressed.
    */

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


  window.setTimeout(
    () => {

      button.classList.remove(
        "stat-recorded"
      );

    },
    220
  );
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


  /*
    Save after every recorded action.
  */

  writeActiveGame();
}


/* ======================================================
   STAT BUTTON EVENTS
====================================================== */

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


    deleteActiveGame();


    currentGameNumber =
      getNextGameNumber();


    closeModal(
      endGameModal
    );


    resetGameStats();


    refreshResumeCard();

    refreshGameHistorySummary();


    showScreen(
      homeScreen
    );
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
  () => {

    gameIsActive = false;


    deleteActiveGame();


    closeModal(
      replaceGameModal
    );


    resetGameStats();


    refreshResumeCard();


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
].forEach(
  (modal) => {

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
  }
);


/* ======================================================
   MOBILE / BROWSER AUTOSAVE
====================================================== */

document.addEventListener(
  "visibilitychange",
  () => {

    if (
      document.visibilityState === "hidden" &&
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


  /*
    Check for an unfinished game every
    time the site loads.
  */

  refreshResumeCard();

  refreshGameHistorySummary();


  showScreen(
    homeScreen
  );
}


initializeApp();
