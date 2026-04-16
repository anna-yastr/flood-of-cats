/* =========================
   RESET / RESTART
   ========================= */

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
  score        = 0;
  streak       = 0;
  gameOver     = false;
  escapedCats  = 0;
  lastCatIndex = -1;
  lastSpawnType = null;
  fallSpeedMultiplier = 1.0;
  streakHitTimes = [];
  comboSpeedBoostPending = false;
  newScoreIndex = -1;

  waterCurrentY = canvas.height;
  waterTargetY  = canvas.height;
  waveClock     = 0;

  spawnInterval = SPAWN_INTERVAL_START_MS;
  stopSpawning();
  updateScoreDisplay();

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
