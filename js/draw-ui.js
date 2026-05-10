/* =========================
   DRAW: UI OVERLAYS
   ========================= */

const STREAK_COLORS  = ['#254160', '#4ab3e8', '#2ec4b6', '#f4d03f', '#ff7800'];
const STREAK_CIRCLE  = [22, 26, 30, 34, 40];  // px — diameter of white circle
const STREAK_FONT_PX = [11, 13, 14, 18, 21];  // px — font size inside circle

function updateScoreDisplay() {
  const el = document.getElementById('scoreText');
  if (el) el.textContent = score;

  const bonus = document.getElementById('streakBonus');
  if (!bonus) return;

  if (streak === 0) {
    bonus.classList.remove('streak-pulse', 'streak-fade');
    bonus.style.display = 'none';
    return;
  }

  const sz = STREAK_CIRCLE[streak - 1];
  bonus.style.display    = 'inline-flex';
  bonus.style.width      = sz + 'px';
  bonus.style.height     = sz + 'px';
  bonus.style.fontSize   = STREAK_FONT_PX[streak - 1] + 'px';
  bonus.style.color      = STREAK_COLORS[streak - 1];
  bonus.textContent      = `+${streak}`;

  // position right after the score number
  const scoreEl  = document.getElementById('scoreText');
  const barEl    = bonus.parentElement;
  if (scoreEl && barEl) {
    const barRect   = barEl.getBoundingClientRect();
    const scoreRect = scoreEl.getBoundingClientRect();
    bonus.style.left = (scoreRect.right - barRect.left + 4) + 'px';
    bonus.style.top  = (scoreRect.top - barRect.top + scoreRect.height / 2) + 'px';
  }

  // re-trigger pulse
  bonus.classList.remove('streak-pulse');
  void bonus.offsetWidth;
  bonus.classList.add('streak-pulse');
}

function drawTutorialWater() {
  if (!waterLevelImg.complete || waterLevelImg.naturalWidth === 0) return;

  // Advance closing animation
  if (tutClosing) {
    tutCloseProgress = Math.min(tutCloseProgress + 0.009, 1);
    if (tutCloseProgress >= 1) {
      showTutorial     = false;
      tutClosing       = false;
      tutCloseProgress = 0;
      return;
    }
  }

  const fillFraction = 0.10 + tutCloseProgress * 0.90;
  const waterY = canvas.height * (1 - fillFraction);
  const imgH   = waterLevelImg.naturalHeight * (canvas.width / waterLevelImg.naturalWidth);

  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.clip();
  ctx.drawImage(waterLevelImg, 0, waterY, canvas.width, imgH);

  drawWaterTop(waterY - canvas.height * 0.07);
  ctx.restore();
}

function drawTutorialScreen() {
  // Light background
  ctx.fillStyle = 'rgba(255,255,255,0.93)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const leftX   = 60;
  const imgSize = 236; // 189 * 1.25
  const textX   = leftX + imgSize + 35;

  // — HOW TO PLAY title —
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle    = '#254160';
  ctx.font         = `42px 'Fredoka One', cursive`;
  ctx.fillText('HOW TO PLAY', canvas.width / 2, 38);

  ctx.textAlign = 'left';

  // — Row 1: random cat + "click cats" —
  const row1CY = 197; // 165 + 32 for bigger margin
  const cat = cats[tutCatIndex];
  if (cat && (cat.naturalWidth > 0 || cat.width > 0)) {
    ctx.drawImage(cat, leftX, row1CY - imgSize / 2, imgSize, imgSize);
  }
  ctx.fillStyle = '#254160';
  ctx.font      = `34px 'Fredoka One', cursive`;
  ctx.fillText('click cats', textX, row1CY);

  // — Row 2: anchor + "DON'T click anchors" —
  const row2CY = 411; // 379 + 32
  const anchorSize = Math.round(imgSize * 0.9); // 10% smaller
  if (anchorImg.complete && anchorImg.naturalWidth > 0) {
    ctx.drawImage(anchorImg, leftX, row2CY - anchorSize / 2, anchorSize, anchorSize);
  }
  ctx.font = `34px 'Fredoka One', cursive`;
  const dontStr = "DON'T ";
  ctx.fillStyle = '#C0160C';
  ctx.fillText(dontStr, textX, row2CY);
  ctx.fillStyle = '#254160';
  ctx.fillText('click anchors', textX + ctx.measureText(dontStr).width, row2CY);

  // — Row 3: bottom instruction —
  ctx.textAlign = 'center';
  ctx.fillStyle = '#254160';
  ctx.font      = `30px 'Fredoka One', cursive`;
  ctx.fillText('keep clicking cats', canvas.width / 2, 535); // 503 + 32
  ctx.font = `38px 'Fredoka One', cursive`;
  ctx.fillText('BEFORE', canvas.width / 2, 575); // 543 + 32
  ctx.font = `30px 'Fredoka One', cursive`;
  ctx.fillText('water floods the screen', canvas.width / 2, 615); // 583 + 32

  ctx.textAlign    = 'left';
  ctx.textBaseline = 'alphabetic';

  drawTutorialWater();
  if (!tutClosing) drawBackButton();
}

function drawBackButton() {
  const r  = BACK_BTN_RADIUS;
  const cx = canvas.width - BACK_BTN_MARGIN - r;
  const cy = BACK_BTN_MARGIN + r;

  ctx.save();
  ctx.translate(cx, cy);
  if (hoverBack) ctx.scale(1.1, 1.1);

  // Animated border — shifts ±1px horizontally in sync with tutAltFrame
  // Circle
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fillStyle = '#8BAEE0';
  ctx.fill();

  // Animated border — drawn after fill so it appears on top
  const bShift = tutAltFrame ? 1 : -1;
  ctx.beginPath();
  ctx.arc(bShift, -bShift, r - 2, 0, Math.PI * 2);
  ctx.strokeStyle = '#E2E6EC';
  ctx.lineWidth   = 2.5;
  ctx.stroke();

  // Arrow ←
  const tip  = -r * 0.42;
  const tail =  r * 0.42;
  const head =  r * 0.30;

  ctx.strokeStyle = '#254160';
  ctx.lineWidth   = 3.5;
  ctx.lineCap     = 'round';
  ctx.lineJoin    = 'round';

  // Shaft
  ctx.beginPath();
  ctx.moveTo(tail, 0);
  ctx.lineTo(tip + head, 0);
  ctx.stroke();

  // Arrowhead chevron
  ctx.beginPath();
  ctx.moveTo(tip + head, -head);
  ctx.lineTo(tip, 0);
  ctx.lineTo(tip + head,  head);
  ctx.stroke();

  ctx.restore();
}

function drawCenterOverlay() {
  ctx.fillStyle = "rgba(40,100,220,0.082)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (!uiReady) {
    ctx.shadowColor   = "rgba(10,25,60,0.35)";
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.shadowBlur    = 2;
    ctx.textAlign     = "center";
    ctx.fillStyle     = "#254160";
    ctx.font          = `${STATUS_FONT_SIZE}px 'Fredoka One', cursive`;
    ctx.fillText(`Loading${".".repeat(loadingDots)}`, canvas.width / 2, canvas.height / 2);
    ctx.shadowColor   = "transparent";
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur    = 0;
    ctx.textAlign     = "left";
    return;
  }

  // Tutorial screen (empty for now — functionality to be added later)
  if (showTutorial) {
    drawTutorialScreen();
    return;
  }

  // Start button
  const { x, y, w, h } = startRect();

  const startImg = (startAltFrame && start2.complete && start2.naturalWidth > 0) ? start2 : start1;

  const scale = hoverStart ? 1.05 : 1;
  const dw = w * scale,         dh = h * scale;
  const dx = x - (dw - w) / 2,  dy = y - (dh - h) / 2;

  if (startImg.complete && startImg.naturalWidth > 0) {
    ctx.drawImage(startImg, dx, dy, dw, dh);
  }

  drawScoreboard();

  // Tutorial button: full size below start (no scores) / half size below scoreboard (with scores)
  {
    const { x: tx, y: ty, w: tw, h: th } = tutorialRect();

    const tutImg = (tutAltFrame && tut2.complete && tut2.naturalWidth > 0) ? tut2 : tut1;

    const tscale = hoverTutorial ? 1.05 : 1;
    const tdw = tw * tscale,          tdh = th * tscale;
    const tdx = tx - (tdw - tw) / 2,  tdy = ty - (tdh - th) / 2;

    if (tutImg.complete && tutImg.naturalWidth > 0) {
      ctx.drawImage(tutImg, tdx, tdy, tdw, tdh);
    }
  }

  if (!readyToStart) {
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(37,65,96,0.45)";
    ctx.font      = `14px 'Fredoka One', cursive`;
    ctx.fillText(`Loading${".".repeat(loadingDots)}`, canvas.width / 2, canvas.height - 20);
    ctx.textAlign = "left";
  }
}

function drawMedalShine(cx, cy, r) {
  const cycle   = 3500;
  const sweepMs = 450;
  const t = Date.now() % cycle;
  if (t > sweepMs) return;

  const progress = t / sweepMs;            // 0 → 1
  const pos = (progress * 2.4 - 1.0) * r; // sweeps left → right

  ctx.save();

  // Clip: full circle
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();

  // Sweep direction: bottom-left → top-right (perpendicular to the "/" strip)
  const posX =  pos / Math.SQRT2;
  const posY = -pos / Math.SQRT2;

  ctx.globalCompositeOperation = 'lighten';
  ctx.translate(cx + posX, cy + posY);
  ctx.rotate(-Math.PI / 4);

  const grad = ctx.createLinearGradient(-4, 0, 4, 0);
  grad.addColorStop(0,   'rgba(255,255,255,0)');
  grad.addColorStop(0.5, 'rgba(255,255,255,0.55)');
  grad.addColorStop(1,   'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(-4, -r * 2, 8, r * 4);

  ctx.restore();
}

function drawScoreboard() {
  if (bestScores.length === 0) return;

  const sbW = 312, sbH = 142, sbR = 17;
  const sbX = (canvas.width - sbW) / 2;
  const sbY = canvas.height * 0.60 + SCOREBOARD_Y_OFFSET;

  ctx.save();

  // Background
  ctx.fillStyle = '#8BAEE0';
  ctx.beginPath();
  ctx.roundRect(sbX, sbY, sbW, sbH, sbR);
  ctx.fill();

  // Texture with multiply, clipped to rounded rect
  const curTex = (texFrame && tex2.complete && tex2.naturalWidth > 0) ? tex2 : tex1;
  if (curTex.complete && curTex.naturalWidth > 0) {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(sbX, sbY, sbW, sbH, sbR);
    ctx.clip();
    ctx.globalCompositeOperation = 'multiply';
    ctx.drawImage(curTex, sbX, sbY, sbW, sbH);
    ctx.restore();
  }

  // Text
  ctx.fillStyle     = '#254160';
  ctx.shadowColor   = 'rgba(10,25,60,0.35)';
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;
  ctx.shadowBlur    = 2;
  ctx.textAlign     = 'center';
  ctx.textBaseline  = 'top';

  ctx.font = `26px 'Fredoka One', cursive`;
  ctx.fillText('Your best score', canvas.width / 2, sbY + 12);

  const MEDAL_COLORS = ['#F5C518', '#B8B8B8', '#C47A3A']; // gold, silver, bronze
  const circleR = 12;

  ctx.font = `24px 'Fredoka One', cursive`;

  // Pre-measure all scores to find the widest, so medal column stays fixed
  const scoreStrs = [0, 1, 2].map(i => String(bestScores[i] !== undefined ? bestScores[i] : '—'));
  const maxScoreW = Math.max(...scoreStrs.map(s => ctx.measureText(s).width));

  // Fixed layout based on widest score — medals always at the same X
  const groupW   = circleR * 2 + 12 + maxScoreW;
  const groupX   = canvas.width / 2 - groupW / 2;
  const circleCX = groupX + circleR;
  const scoreX   = groupX + circleR * 2 + 12;

  for (let i = 0; i < 3; i++) {
    const scoreStr = scoreStrs[i];
    const scoreW   = ctx.measureText(scoreStr).width;
    const rowY     = sbY + 46 + i * 31;
    const textCY   = rowY + 10; // vertical centre of row (textBaseline = top)

    // Medal circle
    ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(circleCX, textCY, circleR, 0, Math.PI * 2);
    ctx.fillStyle = MEDAL_COLORS[i];
    ctx.fill();

    // Diagonal glint
    drawMedalShine(circleCX, textCY, circleR);

    // Rank number inside circle
    ctx.save();
    ctx.textBaseline = 'middle';
    ctx.textAlign    = 'center';
    ctx.fillStyle    = 'rgba(255,255,255,0.92)';
    ctx.font         = `13px 'Fredoka One', cursive`;
    ctx.fillText(String(i + 1), circleCX, textCY);
    ctx.restore();

    // Restore shadow + font for score text
    ctx.shadowColor   = 'rgba(10,25,60,0.35)';
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.shadowBlur    = 2;
    ctx.font      = `24px 'Fredoka One', cursive`;
    ctx.textAlign = 'left';

    if (i === newScoreIndex) {
      ctx.fillStyle = '#254160';
      ctx.fillText(scoreStr, scoreX, rowY);
      ctx.fillStyle = newBlinkFrame ? '#D96600' : '#254160';
      ctx.fillText('  NEW!', scoreX + scoreW, rowY);
    } else {
      ctx.fillStyle = '#254160';
      ctx.fillText(scoreStr, scoreX, rowY);
    }

    ctx.textAlign = 'center';
  }

  ctx.shadowColor   = 'transparent';
  ctx.shadowBlur    = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.textBaseline  = 'alphabetic';
  ctx.textAlign     = 'left';
  ctx.restore();

  drawScoreboardPaws(sbX, sbY, sbW, sbH);
}

function _drawPaw(c, x, y, angle, size) {
  c.save();
  c.translate(x, y);
  c.rotate(angle);
  c.drawImage(comboPawImg, -size / 2, -size, size, size);
  c.restore();
}

function drawScoreboardPaws(sbX, sbY, sbW, sbH) {
  if (!comboPawImg.complete || comboPawImg.naturalWidth === 0) return;

  const size  = 25;
  const SPC   = 32;
  const pad   = 2; // distance outside the rect edges
  const isNew = newScoreIndex === 0;
  const off   = isNew ? (Date.now() / 1000 * 40) % SPC : 0;

  const left   = sbX - pad;
  const right  = sbX + sbW + pad;
  const top    = sbY - pad;
  const bottom = sbY + sbH + pad;

  let idx = 0;
  const show = (i) => isNew || (i % 2 === (sbPawBlinkFrame ? 1 : 0));

  // Top: left → right
  for (let x = left + off; x < right; x += SPC, idx++)
    if (show(idx)) _drawPaw(ctx, x, top,    0,           size);
  // Right: top → bottom
  for (let y = top + off;  y < bottom; y += SPC, idx++)
    if (show(idx)) _drawPaw(ctx, right, y,  Math.PI / 2, size);
  // Bottom: right → left
  for (let x = right - off; x > left;  x -= SPC, idx++)
    if (show(idx)) _drawPaw(ctx, x, bottom, Math.PI,     size);
  // Left: bottom → top
  for (let y = bottom - off; y > top;  y -= SPC, idx++)
    if (show(idx)) _drawPaw(ctx, left, y,  -Math.PI / 2, size);
}

function drawPawBorder() {
  if (streak < 2 || gameOver) {
    pawCtx.clearRect(0, 0, pawCanvas.width, pawCanvas.height);
    return;
  }
  if (!comboPawImg.complete || comboPawImg.naturalWidth === 0) return;

  // Keep pixel dimensions in sync with CSS layout
  const cw = pawCanvas.clientWidth;
  const ch = pawCanvas.clientHeight;
  if (pawCanvas.width !== cw || pawCanvas.height !== ch) {
    pawCanvas.width  = cw;
    pawCanvas.height = ch;
  }
  pawCtx.clearRect(0, 0, cw, ch);

  const base = COMBO_PAW_SIZE;
  const x3sz = Math.round(base * 0.8);
  const size = Math.round((streak === 2 ? Math.round(x3sz * 0.6)
             : streak >= 5  ? 32
             : x3sz) * 0.85);
  const SPC  = COMBO_PAW_SPACING;
  const cx   = COMBO_PAW_BORDER;
  const speed = streak >= 5 ? COMBO_PAW_SPEED : COMBO_PAW_SPEED_4;
  const off  = streak >= 4 ? (Date.now() / 1000 * speed) % SPC : 0;
  const W = cw, H = ch;

  // Top: left → right
  for (let x = cx + off; x < W - cx; x += SPC) _drawPaw(pawCtx, x, cx, 0, size);
  // Right: top → bottom
  for (let y = cx + off; y < H - cx; y += SPC) _drawPaw(pawCtx, W - cx, y, Math.PI / 2, size);
  // Bottom: right → left
  for (let x = W - cx - off; x > cx; x -= SPC) _drawPaw(pawCtx, x, H - cx, Math.PI, size);
  // Left: bottom → top
  for (let y = H - cx - off; y > cx; y -= SPC) _drawPaw(pawCtx, cx, y, -Math.PI / 2, size);
}


function drawGameOver() {
  const { x, y, w, h } = defeatRect();

  const defeatImg = (defeatAltFrame && defeat1.complete && defeat1.naturalWidth > 0) ? defeat1 : defeat;

  const scale = hoverDefeat ? 1.05 : 1;
  const dw = w * scale,         dh = h * scale;
  const dx = x - (dw - w) / 2, dy = y - (dh - h) / 2;

  ctx.fillStyle = "rgba(40,100,220,0.082)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (defeatImg.complete && defeatImg.naturalWidth > 0) {
    ctx.drawImage(defeatImg, dx, dy, dw, dh);
  }

  drawScoreboard();
  ctx.textAlign = "left";
}
