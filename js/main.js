/* =========================
   RESET / RESTART
   ========================= */

function resetRunState() {
  bugs         = [];
  score        = 0;
  updateScoreDisplay();
  gameOver     = false;
  escapedCats  = 0;
  lastCatIndex = -1;

  waterCurrentY = canvas.height;
  waterTargetY  = canvas.height;
  waveClock     = 0;

  spawnInterval = SPAWN_INTERVAL_START_MS;
  stopSpawning();

  countdown      = 3;
  countdownActive = false;

  if (countdownTimerId) {
    clearInterval(countdownTimerId);
    countdownTimerId = null;
  }

  // If assets are already loaded, go straight to countdown
  if (readyToStart) {
    startCountdown();
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
    if (readyToStart && !countdownActive) {
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

  requestAnimationFrame(loop);
}

loop();
