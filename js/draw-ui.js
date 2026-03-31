/* =========================
   DRAW: UI OVERLAYS
   ========================= */

function updateScoreDisplay() {
  const el = document.getElementById('scoreText');
  if (el) el.textContent = score;
}

function drawCenterOverlay() {
  ctx.fillStyle = "rgba(40,100,220,0.082)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.shadowColor   = "rgba(10,25,60,0.35)";
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;
  ctx.shadowBlur    = 2;
  ctx.textAlign     = "center";
  ctx.fillStyle     = "#254160";
  ctx.font          = `${RULE_FONT_SIZE}px 'Fredoka One', cursive`;
  ctx.fillText(RULE_TEXT, canvas.width / 2, canvas.height / 2 + RULE_Y_OFFSET);

  ctx.font = `${STATUS_FONT_SIZE}px 'Fredoka One', cursive`;

  let line = "";
  if (!readyToStart) {
    line = `Loading${".".repeat(loadingDots)}`;
  } else if (countdownActive) {
    line = `Starting in: ${countdown}`;
  }

  if (line) {
    ctx.fillText(line, canvas.width / 2, canvas.height / 2 + STATUS_Y_OFFSET);
  }

  ctx.shadowColor   = "transparent";
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.shadowBlur    = 0;
  ctx.textAlign     = "left";
}

function drawGameOver() {
  const w = DEFEAT_IMG_W;
  const h = DEFEAT_IMG_H;
  const x = (canvas.width  - w) / 2;
  const y = (canvas.height - h) / 2 + DEFEAT_IMG_Y_OFFSET;

  const defeatImg = (defeatAltFrame && defeat1.complete && defeat1.naturalWidth > 0) ? defeat1 : defeat;

  const scale = hoverDefeat ? 1.05 : 1;
  const dw = w * scale,         dh = h * scale;
  const dx = x - (dw - w) / 2, dy = y - (dh - h) / 2;

  ctx.fillStyle = "rgba(40,100,220,0.082)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (defeatImg.complete && defeatImg.naturalWidth > 0) {
    ctx.drawImage(defeatImg, dx, dy, dw, dh);
  }

  ctx.textAlign = "left";
}
