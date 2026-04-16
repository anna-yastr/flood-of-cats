/* =========================
   DRAW: CATS
   ========================= */

function drawBug(b) {
  const cx = b.x + b.size / 2;
  const cy = b.y + b.size / 2;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(b.rot);
  ctx.drawImage(b.img, -b.size / 2, -b.size / 2, b.size, b.size);
  ctx.restore();
}

function drawBugs() {
  for (let i = bugs.length - 1; i >= 0; i--) {
    const b = bugs[i];

    b.y += b.vy;

    if (b.y > canvas.height) {
      bugs.splice(i, 1);
      if (b.type === 'anchor') continue;
      streak = 0;
      streakHitTimes = [];
      fallSpeedMultiplier = 1.0;
      updateScoreDisplay();
      escapedCats++;
      const waterFill = escapedCats * WATER_LEVEL_STEP;
      if (waterFill >= 1.0 && !gameOver) {
        gameOver = true;
        recordScore();
        stopSpawning();
        if (countdownTimerId) clearInterval(countdownTimerId);
        defeatTimeoutId = setTimeout(() => {
          defeatTimeoutId = null;
          resetRunState(false);
        }, 30000);
      }
      continue;
    }

    drawBug(b);

    if (DEBUG_PIXEL_HIT) {
      // Bounding box outline
      ctx.save();
      ctx.strokeStyle = 'rgba(0,200,255,0.5)';
      ctx.lineWidth = 1;
      ctx.strokeRect(b.x, b.y, b.size, b.size);
      ctx.restore();
    }
  }

  if (DEBUG_PIXEL_HIT && window._dbgClick) {
    const d = window._dbgClick;
    // Red dot on miss, green on hit
    ctx.save();
    ctx.beginPath();
    ctx.arc(d.mx, d.my, 5, 0, Math.PI * 2);
    ctx.fillStyle = d.hit ? 'lime' : 'red';
    ctx.fill();
    // Alpha value label
    ctx.fillStyle = 'white';
    ctx.font = '11px monospace';
    ctx.fillText(`α=${d.alpha} px=(${d.px},${d.py})`, d.mx + 8, d.my - 4);
    ctx.restore();
  }
}
