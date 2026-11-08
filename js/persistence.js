// Browser persistence and Google Sheets synchronization. Loaded before app.js.

function showStorageWarning(message) {
  let warning = document.getElementById("storageWarning");
  if (!warning) {
    warning = document.createElement("p");
    warning.id = "storageWarning";
    warning.setAttribute("role", "alert");
    document.querySelector(".app").prepend(warning);
  }
  warning.textContent = message;
  warning.hidden = !message;
}


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


function readActiveGame() {
  if (
    !canUseStorage
  ) {
    return null;
  }

  try {

    const raw =
      localStorage.getItem(
        ACTIVE_GAME_KEY
      );

    if (
      !raw
    ) {
      return null;
    }

    const saved =
      JSON.parse(
        raw
      );

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
    !gameIsActive
  ) {
    return;
  }

  if (!canUseStorage) {
    showStorageWarning("Game progress cannot be saved on this device. Keep this page open.");
    return false;
  }

  const payload = {
    version: 2,
    active: true,
    season:
      CURRENT_SEASON,
    gameNumber:
      currentGameNumber,
    game:
      {
        ...currentGame
      },
    stats:
      {
        ...stats
      },
    history:
      [
        ...actionHistory
      ],
    savedAt:
      new Date()
        .toISOString()
  };

  try {

    localStorage.setItem(
      ACTIVE_GAME_KEY,
      JSON.stringify(
        payload
      )
    );

    showStorageWarning("");
    return true;
  } catch (error) {

    console.error(
      "Could not save active game:",
      error
    );
    showStorageWarning("Game progress could not be saved. Keep this page open and free browser storage.");
    return false;
  }
}


function deleteActiveGame() {
  if (
    !canUseStorage
  ) {
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


function readCompletedGames() {
  if (
    !canUseStorage
  ) {
    return [];
  }

  try {

    const raw =
      localStorage.getItem(
        COMPLETED_GAMES_KEY
      );

    if (
      !raw
    ) {
      return [];
    }

    const saved =
      JSON.parse(
        raw
      );

    return (
      Array.isArray(
        saved
      )
        ? saved
        : []
    );

  } catch (error) {

    console.error(
      "Could not read completed games:",
      error
    );

    return [];
  }
}


function writeCompletedGames(
  games
) {
  if (
    !canUseStorage
  ) {
    return false;
  }

  try {

    localStorage.setItem(
      COMPLETED_GAMES_KEY,
      JSON.stringify(
        games
      )
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


function saveCompletedGame(
  game
) {
  const games =
    readCompletedGames();

  games.push(
    game
  );

  return (
    writeCompletedGames(
      games
    )
  );
}

function updateCompletedGame(game) {
  const games = readCompletedGames();
  const index = games.findIndex(
    (item) => item.id === game.id
  );

  if (index === -1) {
    return false;
  }

  games[index] = game;
  return writeCompletedGames(games);
}


function readDeletedGameIds() {
  if (
    !canUseStorage
  ) {
    return [];
  }

  try {

    const raw =
      localStorage.getItem(
        DELETED_GAME_IDS_KEY
      );

    if (
      !raw
    ) {
      return [];
    }

    const ids =
      JSON.parse(
        raw
      );

    return (
      Array.isArray(
        ids
      )
        ? ids
        : []
    );

  } catch (error) {

    console.error(
      "Could not read pending deletes:",
      error
    );

    return [];
  }
}


function writeDeletedGameIds(
  ids
) {
  if (
    !canUseStorage
  ) {
    return false;
  }

  try {

    localStorage.setItem(
      DELETED_GAME_IDS_KEY,
      JSON.stringify(
        [
          ...new Set(
            ids
          )
        ]
      )
    );

    return true;
  } catch (error) {

    console.error(
      "Could not save pending deletes:",
      error
    );
    return false;
  }
}


function queueDeletedGameId(
  gameId
) {
  const ids =
    readDeletedGameIds();

  if (
    !ids.includes(
      gameId
    )
  ) {
    ids.push(
      gameId
    );

    return writeDeletedGameIds(ids);
  }
  return true;
}


function clearDeletedGameId(
  gameId
) {
  writeDeletedGameIds(
    readDeletedGameIds()
      .filter(
        (id) =>
          id !== gameId
      )
  );
}


function readStoredNextGameNumber() {
  if (
    !canUseStorage
  ) {
    return 1;
  }

  try {

    return (
      Number(
        localStorage.getItem(
          NEXT_GAME_NUMBER_KEY
        )
      ) ||
      1
    );

  } catch (error) {

    return 1;
  }
}


function writeStoredNextGameNumber(
  number
) {
  if (
    !canUseStorage
  ) {
    return;
  }

  try {

    localStorage.setItem(
      NEXT_GAME_NUMBER_KEY,
      String(
        number
      )
    );

  } catch (error) {

    console.error(
      "Could not save next game number:",
      error
    );
  }
}


function getNextGameNumber() {
  const seasonGames =
    readCompletedGames()
      .filter(
        (game) =>
          game.season ===
          CURRENT_SEASON
      );

  const highestCompletedGameNumber =
    seasonGames.length === 0
      ? 0
      : Math.max(
          ...seasonGames.map(
            (game) =>
              Number(
                game.gameNumber
              ) ||
              0
          )
        );

  const activeGame =
    readActiveGame();

  const activeGameNumber =
    (
      activeGame &&
      activeGame.season ===
        CURRENT_SEASON
    )
      ? Number(
          activeGame.gameNumber
        ) ||
        0
      : 0;

  const calculatedNext =
    Math.max(
      highestCompletedGameNumber +
        1,
      activeGameNumber +
        1,
      readStoredNextGameNumber(),
      1
    );

  writeStoredNextGameNumber(
    calculatedNext
  );

  return (
    calculatedNext
  );
}


function advanceNextGameNumber(
  completedGameNumber
) {
  const nextNumber =
    Math.max(
      Number(
        completedGameNumber
      ) +
        1,
      readStoredNextGameNumber()
    );

  writeStoredNextGameNumber(
    nextNumber
  );
}


function createGameId() {
  if (
    window.crypto &&
    typeof
      window.crypto.randomUUID ===
      "function"
  ) {
    return (
      window.crypto.randomUUID()
    );
  }

  return (
    `game-${Date.now()}-${Math.random()
      .toString(36)
      .slice(
        2,
        10
      )}`
  );
}


async function fetchJson(url, options) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Game sync failed with HTTP ${response.status}.`);
    }
    return await response.json();
  } finally {
    window.clearTimeout(timeout);
  }
}


async function apiGetGames() {
  const data = await fetchJson(`${API_URL}?t=${Date.now()}`, {
    method: "GET", cache: "no-store"
  });
  if (!data || data.success !== true || !Array.isArray(data.games) ||
      data.games.some((game) => !game || typeof game !== "object" || !game.id)) {
    throw new Error(data?.error || "Invalid game data from Google Sheets.");
  }
  return data.games;
}


async function apiPost(payload) {
  const data = await fetchJson(API_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
    cache: "no-store"
  });
  if (!data || data.success !== true) {
    throw new Error(data?.error || "Google Sheets request failed.");
  }
  return data;
}


function markGameSynced(
  uploadedGame
) {
  const gameId = uploadedGame.id;
  const games =
    readCompletedGames();

  const game =
    games.find(
      (item) =>
        item.id ===
        gameId
    );

  if (
    !game || JSON.stringify(game) !== JSON.stringify(uploadedGame)
  ) {
    return;
  }

  game.syncStatus =
    "synced";

  writeCompletedGames(
    games
  );
}


async function syncPendingDeletes() {
  const ids =
    readDeletedGameIds();

  for (
    const gameId
    of ids
  ) {
    try {

      await apiPost(
        {
          action:
            "deleteGame",

          id:
            gameId
        }
      );

      // Keep the tombstone until both server and local removal succeed.
      if (!writeCompletedGames(readCompletedGames().filter((game) => game.id !== gameId))) {
        throw new Error("Could not finish saving the deletion locally.");
      }
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
  const deletedIds =
    new Set(
      readDeletedGameIds()
    );

  const games =
    readCompletedGames();

  for (
    const game
    of games
  ) {
    if (
      !game.id ||
      (deletedIds.has(game.id) || readDeletedGameIds().includes(game.id)) ||
      game.syncStatus ===
        "synced"
    ) {
      continue;
    }

    try {

      await apiPost(
        {
          action:
            "saveGame",

          game
        }
      );

      markGameSynced(
        game
      );

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

  const deletedIds =
    new Set(
      readDeletedGameIds()
    );

  const localGames =
    readCompletedGames();

  const pendingLocalGames =
    localGames.filter(
      (game) =>
        game.id &&
        game.syncStatus !==
          "synced" &&
        !deletedIds.has(
          game.id
        )
    );

  const merged =
    new Map();


  remoteGames.forEach(
    (game) => {

      if (
        !game.id ||
        deletedIds.has(
          game.id
        )
      ) {
        return;
      }

      merged.set(
        game.id,
        {
          ...game,
          syncStatus:
            "synced"
        }
      );
    }
  );


  // Unacknowledged local changes always win over an older server copy.
  pendingLocalGames.forEach((game) => merged.set(game.id, game));

  if (!writeCompletedGames([...merged.values()])) {
    throw new Error("Downloaded games could not be saved on this device.");
  }
}


function setSyncStatus(
  status
) {
  if (
    !syncStatus ||
    !syncStatusText
  ) {
    return;
  }


  syncStatus.classList.remove(
    "is-pending",
    "is-synced",
    "is-syncing",
    "is-offline"
  );


  if (
    status ===
    "syncing"
  ) {
    syncStatus.classList.add(
      "is-syncing"
    );

    syncStatusText.textContent =
      "Syncing…";

    return;
  }


  if (
    status ===
    "offline"
  ) {
    syncStatus.classList.add(
      "is-offline"
    );

    syncStatusText.textContent =
      "Offline — will sync later";

    return;
  }


  if (status === "pending") {
    syncStatus.classList.add("is-pending");
    syncStatusText.textContent = "Sync incomplete — will retry";
    return;
  }

  syncStatus.classList.add(
    "is-synced"
  );

  syncStatusText.textContent =
    "Synced";
}


function scheduleSyncRetry() {
  if (retryTimer || !navigator.onLine) return;
  retryTimer = window.setTimeout(() => {
    retryTimer = null;
    void synchronizeCompletedGames();
  }, retryDelay);
  retryDelay = Math.min(retryDelay * 2, 60000);
}


async function synchronizeCompletedGames() {
  if (
    syncPromise
  ) {
    syncRequested = true;
    return syncPromise;
  }


  if (
    !navigator.onLine
  ) {
    setSyncStatus(
      "offline"
    );

    return;
  }


  setSyncStatus(
    "syncing"
  );


  syncPromise =
    (
      async () => {
        try {

          await syncPendingDeletes();

          await syncPendingGames();

          await refreshGamesFromServer();

          const pending = readDeletedGameIds().length > 0 ||
            readCompletedGames().some((game) => game.syncStatus !== "synced");
          setSyncStatus(pending ? "pending" : "synced");
          if (pending) scheduleSyncRetry();
          else retryDelay = 5000;

        } catch (error) {

          console.warn(
            "Google Sheets sync unavailable. Using local data.",
            error
          );

          setSyncStatus(navigator.onLine ? "pending" : "offline");
          scheduleSyncRetry();

        } finally {

          if (!gameIsActive) {
            currentGameNumber = getNextGameNumber();
          }

          refreshGameHistorySummary();

          refreshSeasonStatsSummary();


          if (
            historyScreen
              .classList
              .contains(
                "active-screen"
              )
          ) {
            renderGameHistory();
          }


          if (
            seasonStatsScreen
              .classList
              .contains(
                "active-screen"
              )
          ) {
            renderSeasonStats(
              currentSeasonFilter
            );
          }
        }
      }
    )()
      .finally(
        () => {
          syncPromise = null;
          if (syncRequested) {
            syncRequested = false;
            void synchronizeCompletedGames();
          }
        }
      );


  return (
    syncPromise
  );
}


