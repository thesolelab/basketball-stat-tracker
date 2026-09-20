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


const newGameButton =
  document.getElementById("newGameButton");

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

function calculateSavedPoints(savedStats) {

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
    saved.game.opponent || "Opponent";

  const location =
    saved.game.location || "Home";

  const type =
    saved.game.type || "Regular Season";

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
    Number(saved.gameNumber) || 1;

  currentGame = {

    playerNumber:
      String(
        saved.game.playerNumber || "2"
      ),

    opponent:
      String(
        saved.game.opponent || ""
      ),

    date:
      String(
        saved.game.date || ""
      ),

    location:
      String(
        saved.game.location || "Home"
      ),

    type:
      String(
        saved.game.type || "Regular Season"
      )
  };


  Object.keys(stats).forEach(
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

  Object.keys(stats).forEach(
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


    console.log(
      "Completed Game:",
      completedGame
    );


    /*
      Google Sheets connection comes next.

      For now, SAVE GAME ends the active
      game and removes the recovery copy.
    */

    gameIsActive = false;

    deleteActiveGame();

    currentGameNumber++;

    closeModal(
      endGameModal
    );

    resetGameStats();

    refreshResumeCard();

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

  showScreen(
    homeScreen
  );
}


initializeApp();
