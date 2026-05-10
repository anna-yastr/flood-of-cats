/* =========================
   RESET / RESTART
   ========================= */

function applyGameMode(mode) {
  gameMode = mode;
  localStorage.setItem(GAME_MODE_STORAGE_KEY, mode);
  const cfg = mode === 'stressful' ? GAME_MODE_DEFAULTS : GAME_MODE_CONFIGS[mode];
  SPAWN_INTERVAL_START_MS  = cfg.SPAWN_INTERVAL_START_MS;
  STREAK5_BONUS_HITS1      = cfg.STREAK5_BONUS_HITS1;
  STREAK5_BONUS_HITS2      = cfg.STREAK5_BONUS_HITS2;
  STREAK5_BONUS_HITS3      = cfg.STREAK5_BONUS_HITS3;
  STREAK5_INTERVAL_FACTOR1 = cfg.STREAK5_INTERVAL_FACTOR1;
  STREAK5_INTERVAL_FACTOR2 = cfg.STREAK5_INTERVAL_FACTOR2;
  STREAK5_INTERVAL_FACTOR3 = cfg.STREAK5_INTERVAL_FACTOR3;
  STREAK_BOOST_EVERY_N     = cfg.STREAK_BOOST_EVERY_N;
  STREAK_SPEED_BOOST_M     = cfg.STREAK_SPEED_BOOST_M;
  COMBO_BOOST_MIN          = cfg.COMBO_BOOST_MIN;
  COMBO_BOOST_MAX          = cfg.COMBO_BOOST_MAX;
}

applyGameMode(gameMode);

document.getElementById('resetScoreBtn').addEventListener('click', () => {
  bestScores    = [];
  newScoreIndex = -1;
  localStorage.removeItem('flood_best_scores');
});

function recordScore() {
  if (score <= 0) return;
  const newVal = score;
  bestScores.push(newVal);
  bestScores.sort((a, b) => b - a);
  const idx = bestScores.indexOf(newVal);
  bestScores = bestScores.slice(0, 3);
  newScoreIndex = idx < bestScores.length ? idx : -1;
  localStorage.setItem('flood_best_scores', JSON.stringify(bestScores));
}

function resetRunState(startImmediately = false) {
  if (defeatTimeoutId) {
    clearTimeout(defeatTimeoutId);
    defeatTimeoutId = null;
  }

  bugs         = [];
  hitEffects   = [];
  dyingBugs    = [];
  score        = 0;
  streak       = 0;
  streak5Since = null;
  streak5Hits  = 0;
  gameOver     = false;
  escapedCats  = 0;
  lastCatIndex = -1;
  lastSpawnType = null;
  fallSpeedMultiplier = 1.0;
  streakHitTimes = [];
  newScoreIndex = -1;
  lastHundredSound = 0;
  errorFlash = 0;

  waterCurrentY = canvas.height;
  waterTargetY  = canvas.height;
  waveClock     = 0;

  spawnInterval = SPAWN_INTERVAL_START_MS;
  stopSpawning();
  updateScoreDisplay();

  setMusicVolume(BACKGROUND_MUSIC_MENU_FACTOR);

  countdown      = 3;
  countdownActive = false;

  if (countdownTimerId) {
    clearInterval(countdownTimerId);
    countdownTimerId = null;
  }

  if (readyToStart) {
    if (startImmediately) {
      waitingToStart = false;
      startSpawning();
    } else {
      waitingToStart = true;
    }
  }
}

/* =========================
   COUNTDOWN
   ========================= */

function startCountdown() {
  if (countdownActive || gameOver) return;

  stopLoadingDots();

  countdown       = 3;
  countdownActive = true;

  countdownTimerId = setInterval(() => {
    countdown--;
    if (countdown <= 0) {
      clearInterval(countdownTimerId);
      countdownTimerId = null;
      countdownActive  = false;
      startSpawning();
    }
  }, 1000);
}

/* =========================
   GAME LOOP
   ========================= */

function loop() {
  if (errorFlash > 0) errorFlash--;

  clearField();

  if (!gameOver) {
    if (readyToStart && !waitingToStart) {
      drawBugs();
      drawWaterLevel();
    } else {
      drawCenterOverlay();
    }
  } else {
    drawBugs();
    drawWaterLevel();
    drawGameOver();
  }

  drawFieldTexture();
  drawPawBorder();
  requestAnimationFrame(loop);
}

loop();
