/* ======================================================
   BASKETBALL STAT TRACKER
====================================================== */


/* ======================================================
   APP SETTINGS
====================================================== */

const CURRENT_SEASON = "2026–27";

let currentGameNumber = 1;


/* ======================================================
   CURRENT GAME INFORMATION
====================================================== */

let currentGame = {
  playerNumber: "2",
  opponent: "",
  date: "",
  location: "Home",
  type: "Regular Season"
};


/* ======================================================
   GAME STATS
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
   SCREENS
====================================================== */

const homeScreen =
  document.getElementById("homeScreen");

const setupScreen =
  document.getElementById("setupScreen");

const gameScreen =
  document.getElementById("gameScreen");


function showScreen(screen) {

  document
    .querySelectorAll(".screen")
    .forEach((item) => {

      item.classList.remove(
        "active-screen"
      );

    });


  screen.classList.add(
    "active-screen"
  );


  window.scrollTo(0, 0);

}


/* ======================================================
   HOME
====================================================== */

const newGameButton =
  document.getElementById("newGameButton");


newGameButton.addEventListener(
  "click",
  () => {

    prepareNewGameForm();

    showScreen(setupScreen);

  }
);


/* ======================================================
   GAME SETUP
====================================================== */

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


function getTodayForDateInput() {

  const now = new Date();

  const year =
    now.getFullYear();

  const month =
    String(
      now.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      now.getDate()
    ).padStart(2, "0");


  return `${year}-${month}-${day}`;

}


function prepareNewGameForm() {

  opponentInput.value = "";

  setupMessage.textContent = "";


  if (!gameDateInput.value) {

    gameDateInput.value =
      getTodayForDateInput();

  }

}


setupBackButton.addEventListener(
  "click",
  () => {

    showScreen(homeScreen);

  }
);


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

    const location =
      document.querySelector(
        'input[name="gameLocation"]:checked'
      ).value;

    const type =
      document.querySelector(
        'input[name="gameType"]:checked'
      ).value;


    if (!playerNumber) {

      setupMessage.textContent =
        "Enter a player number.";

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

      return;

    }


    currentGame = {
      playerNumber,
      opponent,
      date,
      location,
      type
    };


    setupMessage.textContent = "";


    resetGameStats();

    updateGameHeader();

    showScreen(gameScreen);

  }
);


/* ======================================================
   GAME HEADER
====================================================== */

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
   STAT DOM
====================================================== */

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
  document.getElementById(
    "shootingSummary"
  );


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

  const made =
    calculateFieldGoalsMade();

  const attempts =
    calculateFieldGoalAttempts();


  if (attempts === 0) {
    return "—";
  }


  return (
    Math.round(
      (made / attempts) * 100
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
   UPDATE GAME DISPLAY
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
   RESET GAME
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
   TAP FEEDBACK
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
   RECORD ACTION
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


  actionHistory.push(action);

  updateDisplay();

}


/* ======================================================
   STAT BUTTONS
====================================================== */

const statButtons =
  document.querySelectorAll(
    "[data-action]"
  );


statButtons.forEach(
  (button) => {

    button.addEventListener(
      "click",
      () => {

        recordAction(
          button.dataset.action
        );

        showTapFeedback(button);

      }
    );

  }
);


/* ======================================================
   UNDO
====================================================== */

const undoButton =
  document.getElementById(
    "undoButton"
  );


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

}


undoButton.addEventListener(
  "click",
  undoLastAction
);


/* ======================================================
   MODAL HELPERS
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

const endGameButton =
  document.getElementById(
    "endGameButton"
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


function openEndGameModal() {

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


  openModal(endGameModal);

}


endGameButton.addEventListener(
  "click",
  openEndGameModal
);


cancelEndGameButton.addEventListener(
  "click",
  () => {

    closeModal(endGameModal);

  }
);


endGameModal.addEventListener(
  "click",
  (event) => {

    if (
      event.target === endGameModal
    ) {

      closeModal(endGameModal);

    }

  }
);


/* ======================================================
   TEMPORARY SAVE GAME
====================================================== */

confirmEndGameButton.addEventListener(
  "click",
  () => {

    const completedGame = {

      season:
        CURRENT_SEASON,

      gameNumber:
        currentGameNumber,

      ...currentGame,

      points:
        calculatePoints(),

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
        stats.freeThrowAttempted

    };


    console.log(
      "Completed Game:",
      completedGame
    );


    /*
      Google Sheets saving will replace
      this temporary behavior.
    */


    currentGameNumber++;


    closeModal(endGameModal);

    resetGameStats();

    showScreen(homeScreen);

  }
);


/* ======================================================
   CANCEL / DISCARD GAME
====================================================== */

const exitGameButton =
  document.getElementById(
    "exitGameButton"
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

    closeModal(
      cancelGameModal
    );

    resetGameStats();

    showScreen(
      homeScreen
    );

  }
);


cancelGameModal.addEventListener(
  "click",
  (event) => {

    if (
      event.target ===
      cancelGameModal
    ) {

      closeModal(
        cancelGameModal
      );

    }

  }
);


/* ======================================================
   INITIALIZE
====================================================== */

gameDateInput.value =
  getTodayForDateInput();


updateDisplay();


showScreen(
  homeScreen
);
