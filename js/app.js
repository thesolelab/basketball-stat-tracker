/* ======================================================
   BASKETBALL STAT TRACKER
   Live Game Tracking
====================================================== */


/* ======================================================
   GAME STATE
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


/*
  Stores each action in order so Undo can reverse
  the most recent stat entry.
*/
const actionHistory = [];


/* ======================================================
   DOM ELEMENTS
====================================================== */

const pointsElement = document.getElementById("points");
const reboundsElement = document.getElementById("rebounds");
const assistsElement = document.getElementById("assists");
const stealsElement = document.getElementById("steals");
const blocksElement = document.getElementById("blocks");
const turnoversElement = document.getElementById("turnovers");
const foulsElement = document.getElementById("fouls");
const fgPercentElement = document.getElementById("fgPercent");

const shootingSummaryElement =
  document.getElementById("shootingSummary");

const undoButton =
  document.getElementById("undoButton");

const endGameButton =
  document.getElementById("endGameButton");


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
  return stats.twoMade + stats.threeMade;
}


function calculateFieldGoalAttempts() {
  return stats.twoAttempted + stats.threeAttempted;
}


function calculateFieldGoalPercentage() {
  const made = calculateFieldGoalsMade();
  const attempts = calculateFieldGoalAttempts();

  if (attempts === 0) {
    return "—";
  }

  return `${Math.round((made / attempts) * 100)}%`;
}


/* ======================================================
   UPDATE SCREEN
====================================================== */

function updateDisplay() {

  const fieldGoalsMade =
    calculateFieldGoalsMade();

  const fieldGoalAttempts =
    calculateFieldGoalAttempts();

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
    `FG ${fieldGoalsMade}/${fieldGoalAttempts} · ` +
    `FT ${stats.freeThrowMade}/${stats.freeThrowAttempted}`;
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
   UNDO
====================================================== */

function undoLastAction() {

  if (actionHistory.length === 0) {
    return;
  }

  const action = actionHistory.pop();

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


/* ======================================================
   STAT BUTTONS
====================================================== */

const statButtons =
  document.querySelectorAll("[data-action]");

statButtons.forEach((button) => {

  button.addEventListener("click", () => {

    const action =
      button.dataset.action;

    recordAction(action);

  });

});


/* ======================================================
   UNDO BUTTON
====================================================== */

undoButton.addEventListener(
  "click",
  undoLastAction
);


/* ======================================================
   END GAME
====================================================== */

endGameButton.addEventListener(
  "click",
  () => {

    const points =
      calculatePoints();

    const rebounds =
      calculateRebounds();

    const fieldGoalsMade =
      calculateFieldGoalsMade();

    const fieldGoalAttempts =
      calculateFieldGoalAttempts();

    const confirmEnd =
      window.confirm(
        `End game?\n\n` +
        `${points} PTS · ` +
        `${rebounds} REB · ` +
        `${stats.assists} AST\n\n` +
        `FG ${fieldGoalsMade}/${fieldGoalAttempts}`
      );

    if (!confirmEnd) {
      return;
    }

    /*
      Google Sheets saving will be added later.

      For now we're just confirming that the game
      tracking portion works correctly.
    */

    console.log(
      "Final Game Stats:",
      stats
    );

  }
);


/* ======================================================
   INITIALIZE
====================================================== */

updateDisplay();
