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
      escapedCats++;
      const waterFill = Math.floor(escapedCats / 2) * WATER_LEVEL_STEP;
      if (waterFill >= 1.0 && !gameOver) {
        gameOver = true;
        stopSpawning();
        if (countdownTimerId) clearInterval(countdownTimerId);
      }
      continue;
    }

    drawBug(b);
  }
}
