/* =========================
   DRAW: CATS
   ========================= */

function drawBug(b) {
  const cx = b.x + b.size / 2;
  const cy = b.y + b.size / 2;

  ctx.save();
  ctx.translate(cx, cy);
  if (b.flip) ctx.scale(-1, 1);
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
      errorFlash = 42; // ~0.7 sec at 60 FPS
      streak = 0;
      streak5Since = null;
      streakHitTimes = [];
      fallSpeedMultiplier = Math.max(FALL_SPEED_MULTIPLIER_START, fallSpeedMultiplier * 0.95);
      updateScoreDisplay();
      escapedCats++;
      const waterFill = escapedCats * WATER_LEVEL_STEP;
      if (waterFill >= 1.0 && !gameOver) {
        gameOver = true;
        recordScore();
        stopSpawning();
        setMusicVolume(BACKGROUND_MUSIC_MENU_FACTOR);
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

  // Swirling-out cats (вортекс при клике)
  for (let i = dyingBugs.length - 1; i >= 0; i--) {
    const b  = dyingBugs[i];
    const bx = b.x + b.size / 2;
    const by = b.y + b.size / 2;
    const ang = Math.atan2(b.ty - by, b.tx - bx) + 0.38; // смещение +22° → закручивается по часовой
    const spd = 9 + (1 - b.life) * 8;                     // ускоряется по мере уменьшения
    b.x   += Math.cos(ang) * spd;
    b.y   += Math.sin(ang) * spd;
    b.rot += 0.28;
    b.life -= 0.07;
    if (b.life <= 0) { dyingBugs.splice(i, 1); continue; }
    ctx.save();
    ctx.globalAlpha = b.life;
    ctx.translate(b.x + b.size / 2, b.y + b.size / 2);
    ctx.rotate(b.rot);
    ctx.scale(b.flip ? -b.life : b.life, b.life);
    ctx.drawImage(b.img, -b.size / 2, -b.size / 2, b.size, b.size);
    ctx.restore();
  }

  // Hit pop effects
  for (let i = hitEffects.length - 1; i >= 0; i--) {
    const e = hitEffects[i];
    e.r    += 6;
    e.life -= 0.14;
    if (e.life <= 0) { hitEffects.splice(i, 1); continue; }
    ctx.save();
    // Expanding ring
    ctx.globalAlpha = e.life * 0.85;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth   = 3.5;
    ctx.beginPath();
    ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
    ctx.stroke();
    // Inner flash — только первые пару кадров
    if (e.life > 0.65) {
      ctx.globalAlpha = ((e.life - 0.65) / 0.35) * 0.45;
      ctx.fillStyle   = '#ffffff';
      ctx.beginPath();
      ctx.arc(e.x, e.y, 20, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
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
