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


async function createStatCardFile(
  game
) {
  const canvas =
    document.createElement(
      "canvas"
    );

  canvas.width =
    1080;

  canvas.height =
    1350;

  const ctx =
    canvas.getContext(
      "2d"
    );

  if (!ctx) {
    throw new Error(
      "Canvas is not available."
    );
  }

  const fieldGoalsMade =
    safeNumber(
      game.fieldGoalsMade
    );

  const fieldGoalAttempts =
    safeNumber(
      game.fieldGoalAttempts
    );

  const cardResult =
    game.result ||
    calculateGameResult(
      game.teamScore,
      game.opponentScore
    );

  const opponentAbbreviation =
    getOpponentAbbreviation(
      game.opponent
    );

  const recordThroughGame =
    getRecordThroughGame(
      game
    );

  const recordText =
    formatRecord(
      recordThroughGame
    );

  const cardFont =
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif';

  ctx.fillStyle =
    "#f4f7f8";

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  ctx.textAlign =
    "center";

  ctx.textBaseline =
    "alphabetic";

  ctx.fillStyle =
    "#111820";

  ctx.font =
    `900 58px ${cardFont}`;

  ctx.fillText(
    "ADDYSON",
    540,
    88
  );

  ctx.font =
    `800 40px ${cardFont}`;

  ctx.fillText(
    `vs. ${game.opponent || "Opponent"}`,
    540,
    142
  );

  ctx.fillStyle =
    "#66717d";

  ctx.font =
    `700 27px ${cardFont}`;

  ctx.fillText(
    formatGameDate(
      game.date
    ),
    540,
    187
  );

  if (cardResult) {
    const badgeWidth = 62;
    const badgeHeight = 42;
    const scoreGap = 18;
    const scoreText =
      `KHS ${safeNumber(
        game.teamScore
      )}–${safeNumber(
        game.opponentScore
      )} ${opponentAbbreviation}`;

    ctx.font =
      `900 29px ${cardFont}`;

    const scoreWidth =
      ctx.measureText(
        scoreText
      ).width;

    const groupWidth =
      badgeWidth +
      scoreGap +
      scoreWidth;

    const groupX =
      (canvas.width - groupWidth) /
      2;

    drawRoundedRect(
      ctx,
      groupX,
      211,
      badgeWidth,
      badgeHeight,
      14
    );

    if (cardResult === "W") {
      ctx.fillStyle =
        "#e7f6ec";
    } else if (cardResult === "L") {
      ctx.fillStyle =
        "#fde8ec";
    } else {
      ctx.fillStyle =
        "#eef1f3";
    }

    ctx.fill();

    ctx.textAlign =
      "center";

    if (cardResult === "W") {
      ctx.fillStyle =
        "#23824a";
    } else if (cardResult === "L") {
      ctx.fillStyle =
        "#c8102e";
    } else {
      ctx.fillStyle =
        "#66717d";
    }

    ctx.font =
      `900 27px ${cardFont}`;

    ctx.fillText(
      cardResult,
      groupX + badgeWidth / 2,
      240
    );

    ctx.textAlign =
      "left";

    ctx.fillStyle =
      "#111820";

    ctx.font =
      `900 29px ${cardFont}`;

    ctx.fillText(
      scoreText,
      groupX + badgeWidth + scoreGap,
      241
    );

    ctx.textAlign =
      "center";

    ctx.fillStyle =
      "#66717d";

    ctx.font =
      `800 22px ${cardFont}`;

    ctx.fillText(
      `SEASON RECORD  ${recordText}`,
      540,
      276
    );
  }

  drawRoundedRect(
    ctx,
    60,
    300,
    960,
    220,
    30
  );

  ctx.fillStyle =
    "#c8102e";

  ctx.fill();

  ctx.fillStyle =
    "#ffffff";

  ctx.font =
    `800 25px ${cardFont}`;

  ctx.fillText(
    "POINTS",
    540,
    360
  );

  ctx.font =
    `900 116px ${cardFont}`;

  ctx.fillText(
    String(
      safeNumber(
        game.points
      )
    ),
    540,
    477
  );

  ctx.textAlign =
    "left";

  ctx.fillStyle =
    "#8a96a3";

  ctx.font =
    `900 24px ${cardFont}`;

  ctx.fillText(
    "BOX SCORE",
    65,
    570
  );

  const boxStats = [
    [
      safeNumber(
        game.rebounds
      ),
      "REB"
    ],
    [
      safeNumber(
        game.assists
      ),
      "AST"
    ],
    [
      safeNumber(
        game.steals
      ),
      "STL"
    ],
    [
      safeNumber(
        game.blocks
      ),
      "BLK"
    ],
    [
      safeNumber(
        game.turnovers
      ),
      "TOV"
    ],
    [
      safeNumber(
        game.fouls
      ),
      "PF"
    ]
  ];

  const boxWidth =
    300;

  const boxHeight =
    145;

  const boxGap =
    30;

  boxStats.forEach(
    (
      [
        value,
        label
      ],
      index
    ) => {
      const column =
        index % 3;

      const row =
        Math.floor(
          index / 3
        );

      const x =
        60 +
        column *
          (
            boxWidth +
            boxGap
          );

      const y =
        605 +
        row *
          (
            boxHeight +
            25
          );

      drawRoundedRect(
        ctx,
        x,
        y,
        boxWidth,
        boxHeight,
        22
      );

      ctx.fillStyle =
        "#ffffff";

      ctx.fill();

      ctx.textAlign =
        "center";

      ctx.fillStyle =
        "#111820";

      ctx.font =
        `900 52px ${cardFont}`;

      ctx.fillText(
        String(
          value
        ),
        x +
          boxWidth / 2,
        y + 66
      );

      ctx.fillStyle =
        "#8a96a3";

      ctx.font =
        `800 21px ${cardFont}`;

      ctx.fillText(
        label,
        x +
          boxWidth / 2,
        y + 108
      );
    }
  );

  const shootingY =
    945;

  drawRoundedRect(
    ctx,
    60,
    shootingY,
    960,
    345,
    28
  );

  ctx.fillStyle =
    "#ffffff";

  ctx.fill();

  ctx.textAlign =
    "left";

  ctx.fillStyle =
    "#8a96a3";

  ctx.font =
    `900 24px ${cardFont}`;

  ctx.fillText(
    "SHOOTING",
    90,
    shootingY + 50
  );

  const shootingRows = [
    [
      "Field Goals",
      `${fieldGoalsMade}/${fieldGoalAttempts} · ${formatPercentage(
        fieldGoalsMade,
        fieldGoalAttempts
      )}`
    ],
    [
      "2PT",
      `${safeNumber(
        game.twoMade
      )}/${safeNumber(
        game.twoAttempted
      )} · ${formatPercentage(
        game.twoMade,
        game.twoAttempted
      )}`
    ],
    [
      "3PT",
      `${safeNumber(
        game.threeMade
      )}/${safeNumber(
        game.threeAttempted
      )} · ${formatPercentage(
        game.threeMade,
        game.threeAttempted
      )}`
    ],
    [
      "Free Throws",
      `${safeNumber(
        game.freeThrowMade
      )}/${safeNumber(
        game.freeThrowAttempted
      )} · ${formatPercentage(
        game.freeThrowMade,
        game.freeThrowAttempted
      )}`
    ]
  ];

  shootingRows.forEach(
    (
      [
        label,
        value
      ],
      index
    ) => {
      const y =
        shootingY +
        111 +
        index *
          63;

      ctx.textAlign =
        "left";

      ctx.fillStyle =
        "#66717d";

      ctx.font =
        `700 28px ${cardFont}`;

      ctx.fillText(
        label,
        90,
        y
      );

      ctx.textAlign =
        "right";

      ctx.fillStyle =
        "#111820";

      ctx.font =
        `800 28px ${cardFont}`;

      ctx.fillText(
        value,
        990,
        y
      );
    }
  );

  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob((result) => {
      if (result) resolve(result);
      else reject(new Error("Could not create the stat card image."));
    }, "image/png");
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
  if (
    !selectedDetailGame
  ) {
    return;
  }


  const originalButtonText =
    shareStatsButton
      ? shareStatsButton
          .textContent
      : "SHARE STATS";


  try {

    if (
      shareStatsButton
    ) {
      shareStatsButton.disabled =
        true;

      shareStatsButton.textContent =
        "CREATING IMAGE…";
    }


    const file =
      await createStatCardFile(
        selectedDetailGame
      );


    const shareData = {

      title:
        `Addyson vs. ${
          selectedDetailGame.opponent ||
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
      shareStatsButton
    ) {
      shareStatsButton.disabled =
        false;

      shareStatsButton.textContent =
        originalButtonText;
    }
  }
}


