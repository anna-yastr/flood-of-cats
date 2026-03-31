/* =========================
   DRAW: WATER LEVEL
   ========================= */

function drawWaterLevel() {
  if (!waterLevelImg.complete || waterLevelImg.naturalWidth === 0) return;

  const imgH = waterLevelImg.naturalHeight * (canvas.width / waterLevelImg.naturalWidth);

  // Move image up based on how many cats escaped
  const steps     = Math.floor(escapedCats / 2);
  const rawTarget = canvas.height - steps * WATER_LEVEL_STEP * canvas.height;

  // Cap: image top can't go higher than 120% of its own height from the bottom
  waterTargetY = Math.max(rawTarget, canvas.height - imgH * 1.2);

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
