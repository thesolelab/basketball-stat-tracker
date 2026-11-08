// Stat-card drawing and sharing. Loaded before app.js.

function drawRoundedRect(
  ctx,
  x,
  y,
  width,
  height,
  radius
) {
  const r =
    Math.min(
      radius,
      width / 2,
      height / 2
    );


  ctx.beginPath();

  ctx.moveTo(
    x + r,
    y
  );

  ctx.lineTo(
    x + width - r,
    y
  );

  ctx.quadraticCurveTo(
    x + width,
    y,
    x + width,
    y + r
  );

  ctx.lineTo(
    x + width,
    y + height - r
  );

  ctx.quadraticCurveTo(
    x + width,
    y + height,
    x + width - r,
    y + height
  );

  ctx.lineTo(
    x + r,
    y + height
  );

  ctx.quadraticCurveTo(
    x,
    y + height,
    x,
    y + height - r
  );

  ctx.lineTo(
    x,
    y + r
  );

  ctx.quadraticCurveTo(
    x,
    y,
    x + r,
    y
  );

  ctx.closePath();
}


function getOpponentAbbreviation(name) {
  const words =
    String(name || "OPP")
      .trim()
      .replace(/[^A-Za-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(Boolean);

  if (words.length === 0) {
    return "OPP";
  }

  if (words.length === 1) {
    return words[0]
      .slice(0, 4)
      .toUpperCase();
  }

  return words
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 5)
    .toUpperCase();
}


function getRecordThroughGame(game) {
  const gameNumber =
    Number(game.gameNumber) || 0;

  const season =
    game.season || CURRENT_SEASON;

  const gameType =
    game.type || "Regular Season";

  const gamesThroughThisGame =
    readCompletedGames()
      .filter(
        (item) =>
          (item.season || CURRENT_SEASON) === season &&
          (item.type || "Regular Season") === gameType &&
          (Number(item.gameNumber) || 0) <= gameNumber
      );

  return calculateRecord(
    gamesThroughThisGame
  );
}


async function createStatCardFile(game) {
  await document.fonts.ready;
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available.");
  const tokens = getComputedStyle(document.documentElement);
  const color = (token) => tokens.getPropertyValue(token).trim();
  const display = color("--font-display");
  const text = (value, x, y, size, tone = "--text", align = "left") => {
    ctx.fillStyle = color(tone);
    ctx.textAlign = align;
    ctx.font = `700 ${size}px ${display}`;
    ctx.fillText(String(value), x, y, 940);
  };
  ctx.fillStyle = color("--bg");
  ctx.fillRect(0, 0, 1080, 1350);
  ctx.strokeStyle = color("--court-line");
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 40, 1000, 1270);
  ctx.strokeRect(330, 40, 420, 400);
  ctx.beginPath(); ctx.arc(540, 440, 160, 0, Math.PI * 2); ctx.stroke();
  // Three-point arc and corner lines, behind the recap content.
  ctx.beginPath();
  ctx.moveTo(80, 40);
  ctx.lineTo(80, 155);
  ctx.arc(540, 155, 460, Math.PI, 0, true);
  ctx.lineTo(1000, 40);
  ctx.stroke();
  ctx.fillStyle = color("--accent");
  ctx.fillRect(40, 70, 5, 1120);
  text(`${game.season || CURRENT_SEASON} SEASON  /  GAME ${game.gameNumber || 1}`, 80, 110, 27, "--text-muted");
  text(`ADDYSON  #${game.playerNumber || "2"}`, 80, 225, 92);
  text(`VS. ${game.opponent || "OPPONENT"}`.toUpperCase(), 80, 290, 46);
  text(`${formatGameDate(game.date)}  ·  ${game.location || "Home"}`, 80, 340, 28, "--text-muted");
  ctx.fillStyle = color("--bg-elevated");
  ctx.fillRect(80, 395, 920, 160);
  const result = game.result || calculateGameResult(game.teamScore, game.opponentScore);
  text('KHS', 110, 435, 24, "--text-muted");
  text(game.teamScore ?? "—", 110, 525, 90);
  text(getOpponentAbbreviation(game.opponent), 970, 435, 24, "--text-muted", "right");
  text(game.opponentScore ?? "—", 970, 525, 90, "--text", "right");
  text(result, 540, 505, 56, result === 'W' ? '--made' : '--accent', "center");
  text('POINTS', 80, 625, 26, "--text-muted");
  text(safeNumber(game.points), 75, 815, 210);
  const stats = [['REB', game.rebounds], ['AST', game.assists], ['STL', game.steals], ['BLK', game.blocks], ['TOV', game.turnovers], ['PF', game.fouls]];
  stats.forEach(([label, value], index) => {
    const x = 80 + index * 155;
    text(label, x, 895, 25, "--text-muted");
    text(safeNumber(value), x, 955, 54);
  });
  ctx.strokeStyle = color("--border-strong");
  ctx.beginPath(); ctx.moveTo(80, 1000); ctx.lineTo(1000, 1000); ctx.stroke();
  const splits = [['FIELD GOALS', game.fieldGoalsMade, game.fieldGoalAttempts], ['3PT', game.threeMade, game.threeAttempted], ['FREE THROWS', game.freeThrowMade, game.freeThrowAttempted]];
  splits.forEach(([label, made, attempts], index) => {
    const x = 80 + index * 310;
    text(label, x, 1060, 25, "--text-muted");
    text(`${safeNumber(made)}/${safeNumber(attempts)}`, x, 1120, 48);
    text(formatPercentage(made, attempts), x, 1160, 26, "--text-muted");
  });
  text(`${formatRecord(getRecordThroughGame(game))} RECORD`, 80, 1255, 28, "--text-muted");
  text('BASKETBALL STAT TRACKER', 1000, 1255, 25, "--text-muted", "right");
  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob((result) => result ? resolve(result) : reject(new Error("Could not create the stat card image.")), "image/png");
  });
  return new File([blob], getStatCardFilename(game), { type: "image/png" });
}


function getStatCardFilename(
  game
) {
  const opponent =
    String(
      game.opponent ||
        "opponent"
    )
      .trim()
      .toLowerCase()
      .replace(
        /[^a-z0-9]+/g,
        "-"
      )
      .replace(
        /^-|-$/g,
        ""
      );


  return (
    `addyson-vs-${opponent || "opponent"}-stats.png`
  );
}


async function shareSelectedGame() {
  return shareGame(selectedDetailGame, shareStatsButton);
}


async function shareGame(game, trigger) {
  if (
    !game
  ) {
    return;
  }


  const originalButtonText =
    trigger
      ? trigger
          .textContent
      : "SHARE STATS";


  try {

    if (
      trigger
    ) {
      trigger.disabled =
        true;

      trigger.textContent =
        "CREATING IMAGE…";
    }


    const file =
      await createStatCardFile(
        game
      );


    const shareData = {

      title:
        `Addyson vs. ${
          game.opponent ||
          "Opponent"
        }`,

      files:
        [
          file
        ]
    };


    if (
      navigator.share &&
      (
        !navigator.canShare ||
        navigator.canShare(
          shareData
        )
      )
    ) {
      await navigator.share(
        shareData
      );

      return;
    }


    const url =
      URL.createObjectURL(
        file
      );


    const link =
      document.createElement(
        "a"
      );


    link.href =
      url;


    link.download =
      file.name;


    document.body.appendChild(
      link
    );


    link.click();


    link.remove();


    window.setTimeout(
      () => {

        URL.revokeObjectURL(
          url
        );

      },
      1500
    );

  } catch (error) {

    if (
      error &&
      error.name ===
        "AbortError"
    ) {
      return;
    }


    console.error(
      "Could not share stat card:",
      error
    );


    window.alert(
      "Could not create or share the stat card."
    );

  } finally {

    if (
      trigger
    ) {
      trigger.disabled =
        false;

      trigger.textContent =
        originalButtonText;
    }
  }
}


