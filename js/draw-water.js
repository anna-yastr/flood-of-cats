/* =========================
   DRAW: WATER LEVEL
   ========================= */

function drawWaterTop(topY) {
  if (!waterLevelTopImg.complete || waterLevelTopImg.naturalWidth === 0) return;
  const scale = 1.2;
  const topW  = canvas.width * scale;
  const topH  = waterLevelTopImg.naturalHeight * (topW / waterLevelTopImg.naturalWidth);
  waveClock  += 0.0135;
  const topX  = -(topW - canvas.width) / 2 + Math.sin(waveClock) * canvas.width * 0.05;
  ctx.drawImage(waterLevelTopImg, topX, topY, topW, topH);
}

function drawFieldTexture() {
  if (!waterLevelTopImg.complete || waterLevelTopImg.naturalWidth === 0) return;

  const scale   = 1.2;
  const imgW    = canvas.width * scale;
  const imgH    = waterLevelTopImg.naturalHeight * (imgW / waterLevelTopImg.naturalWidth);
  const waveX   = Math.sin(Date.now() / 2000) * canvas.width * 0.05;
  const imgX    = -(imgW - canvas.width) / 2 + waveX;

  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  ctx.globalAlpha = 0.20;
  ctx.drawImage(waterLevelTopImg, imgX, -100, imgW, imgH);
  ctx.restore();
}

function drawWaterLevel() {
  if (!waterLevelImg.complete || waterLevelImg.naturalWidth === 0) return;

  const imgH = waterLevelImg.naturalHeight * (canvas.width / waterLevelImg.naturalWidth);

  // Move image up based on how many cats escaped
  const steps     = escapedCats;
  const rawTarget = canvas.height - steps * WATER_LEVEL_STEP * canvas.height;

  // Cap: bottom edge of image can't go above 120% of canvas height
  // i.e. waterCurrentY + imgH >= canvas.height * 1.2
  waterTargetY = Math.max(rawTarget, canvas.height * 1.2 - imgH);

  // Smooth lerp toward target
  waterCurrentY += (waterTargetY - waterCurrentY) * 0.04;

  if (waterCurrentY >= canvas.height) return; // not visible yet

  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.clip();
  ctx.drawImage(waterLevelImg, 0, waterCurrentY, canvas.width, imgH);

  drawWaterTop(waterCurrentY - canvas.height * 0.10);
  ctx.restore();
}
