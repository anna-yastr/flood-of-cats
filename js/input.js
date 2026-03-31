/* =========================
   INPUT HANDLING
   ========================= */

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
  const y = (canvas.height - h) / 2 + DEFEAT_IMG_Y_OFFSET;
  return { x, y, w, h };
}

function tryHit(mx, my) {
  if (gameOver) return;
  if (!readyToStart || countdownActive) return;

  // Hit-test each cat using axis-aligned bounding box, back to front
  for (let i = bugs.length - 1; i >= 0; i--) {
    const b   = bugs[i];
    const hit = mx >= b.x && mx <= b.x + b.size && my >= b.y && my <= b.y + b.size;
    if (hit) {
      bugs.splice(i, 1);
      score += 1;
      updateScoreDisplay();
      spawnInterval = Math.max(SPAWN_INTERVAL_MIN_MS, Math.floor(spawnInterval * CLICK_SPEEDUP_FACTOR));
      return;
    }
  }
}

// Hover cursor over defeat button
canvas.addEventListener("mousemove", (e) => {
  if (!gameOver) { hoverDefeat = false; canvas.style.cursor = ""; return; }
  const p = pointerPos(e);
  const r = defeatRect();
  hoverDefeat = p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h;
  canvas.style.cursor = hoverDefeat ? "pointer" : "";
});

// Click: restart if on defeat button, otherwise try to hit a cat
canvas.addEventListener("click", (e) => {
  const p = pointerPos(e);
  if (gameOver) {
    const r = defeatRect();
    if (p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h) {
      resetRunState();
      return;
    }
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
      resetRunState();
      return;
    }
  }
  tryHit(p.x, p.y);
}, { passive: false });

// Keyboard: R to restart
window.addEventListener("keydown", (e) => {
  if (e.key && e.key.toLowerCase() === "r") {
    resetRunState();
  }
});
