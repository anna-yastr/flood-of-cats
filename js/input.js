/* =========================
   INPUT HANDLING
   ========================= */

function pixelHit(b, mx, my) {
  if (b.type === 'anchor') {
    const insetX = b.size * 0.12;
    const insetY = b.size * 0.03;
    return mx >= b.x + insetX && mx <= b.x + b.size - insetX &&
           my >= b.y + insetY && my <= b.y + b.size - insetY;
  }
  // cats: trim 3% from each side
  const inset = b.size * 0.03;
  return mx >= b.x + inset && mx <= b.x + b.size - inset &&
         my >= b.y + inset && my <= b.y + b.size - inset;
}

function pointerPos(evt) {
  const rect    = canvas.getBoundingClientRect();
  const clientX = evt.touches ? evt.touches[0].clientX : evt.clientX;
  const clientY = evt.touches ? evt.touches[0].clientY : evt.clientY;

  const scaleX = canvas.width  / rect.width;
  const scaleY = canvas.height / rect.height;

  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top)  * scaleY
  };
}

function defeatRect() {
  const w = DEFEAT_IMG_W, h = DEFEAT_IMG_H;
  const x = (canvas.width  - w) / 2;
  const y = canvas.height * 0.33 - h / 2;
  return { x, y, w, h };
}

function startRect() {
  const w = START_IMG_W, h = START_IMG_H;
  const x = (canvas.width  - w) / 2;
  const y = canvas.height * 0.33 - h / 2 + START_IMG_Y_OFFSET;
  return { x, y, w, h };
}

function tutorialRect() {
  const hasSb = bestScores.length > 0;
  const tw = hasSb ? Math.round(TUTORIAL_IMG_W * 0.5) : TUTORIAL_IMG_W;
  const th = hasSb ? Math.round(TUTORIAL_IMG_H * 0.5) : TUTORIAL_IMG_H;
  const tx = (canvas.width - tw) / 2;
  const { y: sy, h: sh } = startRect();
  const ty = hasSb ? canvas.height * 0.60 + SCOREBOARD_Y_OFFSET + 142 + TUTORIAL_SB_GAP_Y : sy + sh + TUTORIAL_GAP_Y;
  return { x: tx, y: ty, w: tw, h: th };
}

function tryHit(mx, my) {
  if (gameOver) return;
  if (!readyToStart || waitingToStart) return;

  // Hit-test in reverse draw order: bugs[0] is drawn last (on top), so check it first
  for (let i = 0; i < bugs.length; i++) {
    const b   = bugs[i];
    const hit = pixelHit(b, mx, my);
    if (hit) {
      hitEffects.push({ x: b.x + b.size / 2, y: b.y + b.size / 2, r: b.size * 0.32, life: 1.0 });
      dyingBugs.push({ x: b.x, y: b.y, size: b.size, img: b.img, rot: b.rot, flip: b.flip, tx: mx, ty: my, life: 1.0 });
      bugs.splice(i, 1);
      if (b.type === 'anchor') {
        errorFlash = 42; // ~0.7 sec at 60 FPS
        streak = 0;
        streak5Since = null;
        streakHitTimes = [];
        fallSpeedMultiplier = Math.max(FALL_SPEED_MULTIPLIER_START, fallSpeedMultiplier * 0.95);
        updateScoreDisplay();
      } else {
        const now = Date.now();
        streakHitTimes.push(now);
        const prevStreak = streak;
        streak = Math.min(streak + 1, 5);
        if (streak === 5 && prevStreak < 5) streak5Since = now;
        score += streak;
        if (Math.floor(score / 100) > lastHundredSound) {
          lastHundredSound = Math.floor(score / 100);
          playMeowSound();
        }
        updateScoreDisplay();
        if (streak === 5 && streakHitTimes.length % 5 === 0) {
          const comboBoost = randf(COMBO_BOOST_MIN, COMBO_BOOST_MAX);
          spawnInterval = Math.max(SPAWN_INTERVAL_MIN_MS, Math.floor(spawnInterval * (2 - comboBoost)));
          fallSpeedMultiplier = Math.min(FALL_SPEED_MULTIPLIER_MAX, fallSpeedMultiplier * comboBoost);
        }
      }
      return;
    }
  }
}

// Hover cursor over defeat / start button
canvas.addEventListener("mousemove", (e) => {
  const p = pointerPos(e);
  if (gameOver) {
    hoverStart = false;
    const r = defeatRect();
    hoverDefeat = p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h;
    canvas.style.cursor = hoverDefeat ? "pointer" : "";
    return;
  }
  hoverDefeat = false;
  if (waitingToStart) {
    if (showTutorial) {
      hoverStart = hoverTutorial = false;
      if (!tutClosing) {
        const bcx = canvas.width - BACK_BTN_MARGIN - BACK_BTN_RADIUS;
        const bcy = BACK_BTN_MARGIN + BACK_BTN_RADIUS;
        const bdx = p.x - bcx, bdy = p.y - bcy;
        hoverBack = bdx * bdx + bdy * bdy <= BACK_BTN_RADIUS * BACK_BTN_RADIUS;
        canvas.style.cursor = hoverBack ? "pointer" : "";
      } else {
        hoverBack = false;
        canvas.style.cursor = "";
      }
      return;
    }
    const r = startRect();
    hoverStart = p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h;
    hoverTutorial = false;
    if (!hoverStart) {
      const tr = tutorialRect();
      hoverTutorial = p.x >= tr.x && p.x <= tr.x + tr.w && p.y >= tr.y && p.y <= tr.y + tr.h;
    }
    canvas.style.cursor = (hoverStart || hoverTutorial) ? "pointer" : "";
    return;
  }
  hoverStart = hoverTutorial = false;
  canvas.style.cursor = "";
});

// Click: start / restart / hit cat
canvas.addEventListener("click", (e) => {
  const p = pointerPos(e);
  if (gameOver) {
    const r = defeatRect();
    if (p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h) {
      resetRunState(true);
    }
    return;
  }
  if (waitingToStart) {
    if (showTutorial) {
      if (!tutClosing) {
        const bcx = canvas.width - BACK_BTN_MARGIN - BACK_BTN_RADIUS;
        const bcy = BACK_BTN_MARGIN + BACK_BTN_RADIUS;
        const bdx = p.x - bcx, bdy = p.y - bcy;
        if (bdx * bdx + bdy * bdy <= BACK_BTN_RADIUS * BACK_BTN_RADIUS) {
          tutClosing = true;
          hoverBack  = false;
        }
      }
      return;
    }
    const r = startRect();
    if (p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h) {
      if (!readyToStart) return; // gameplay assets still loading
      waitingToStart = false;
      hoverStart = false;
      startSpawning();
      setMusicVolume(1.0);
      const bgMusic = document.getElementById('backgroundMusic');
      if (bgMusic && soundEnabled && bgMusic.paused) {
        bgMusic.play().catch(() => {});
      }
      return;
    }
    {
      const tr = tutorialRect();
      if (p.x >= tr.x && p.x <= tr.x + tr.w && p.y >= tr.y && p.y <= tr.y + tr.h) {
        tutCatIndex = Math.floor(Math.random() * cats.length);
        showTutorial = true;
        hoverTutorial = false;
        return;
      }
    }
    return;
  }
  tryHit(p.x, p.y);
});

// Touch: same as click
canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  const p = pointerPos(e);
  if (gameOver) {
    const r = defeatRect();
    if (p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h) {
      resetRunState(true);
    }
    return;
  }
  if (waitingToStart) {
    if (showTutorial) {
      if (!tutClosing) {
        const bcx = canvas.width - BACK_BTN_MARGIN - BACK_BTN_RADIUS;
        const bcy = BACK_BTN_MARGIN + BACK_BTN_RADIUS;
        const bdx = p.x - bcx, bdy = p.y - bcy;
        if (bdx * bdx + bdy * bdy <= BACK_BTN_RADIUS * BACK_BTN_RADIUS) {
          tutClosing = true;
          hoverBack  = false;
        }
      }
      return;
    }
    const r = startRect();
    if (p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h) {
      if (!readyToStart) return; // gameplay assets still loading
      waitingToStart = false;
      hoverStart = false;
      startSpawning();
      setMusicVolume(1.0);
      const bgMusic = document.getElementById('backgroundMusic');
      if (bgMusic && soundEnabled && bgMusic.paused) {
        bgMusic.play().catch(() => {});
      }
      return;
    }
    {
      const tr = tutorialRect();
      if (p.x >= tr.x && p.x <= tr.x + tr.w && p.y >= tr.y && p.y <= tr.y + tr.h) {
        tutCatIndex = Math.floor(Math.random() * cats.length);
        showTutorial = true;
        hoverTutorial = false;
        return;
      }
    }
    return;
  }
  tryHit(p.x, p.y);
}, { passive: false });

// Keyboard: R to restart
window.addEventListener("keydown", (e) => {
  if (e.key && e.key.toLowerCase() === "r") {
    resetRunState(true);
  }
});
