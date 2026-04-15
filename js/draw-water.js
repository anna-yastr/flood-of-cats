/* =========================
   DRAW: WATER LEVEL
   ========================= */

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

  if (waterLevelTopImg.complete && waterLevelTopImg.naturalWidth > 0) {
    const scale   = 1.2;
    const topImgW = canvas.width * scale;
    const topImgH = waterLevelTopImg.naturalHeight * (topImgW / waterLevelTopImg.naturalWidth);

    // Oscillate ±5% of canvas width
    waveClock += 0.0135;
    const waveX   = Math.sin(waveClock) * canvas.width * 0.05;
    const topImgX = -(topImgW - canvas.width) / 2 + waveX;
    const topImgY = waterCurrentY - canvas.height * 0.10; // 10% above main water level

    ctx.drawImage(waterLevelTopImg, topImgX, topImgY, topImgW, topImgH);
  }
  ctx.restore();
}
