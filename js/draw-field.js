/* =========================
   DRAW: BACKGROUND / FIELD
   ========================= */

function clearField() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(239,243,249,0.85)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Red border flash on error with fade out and zigzag edge
  if (errorFlash > 0) {
    const alpha   = errorFlash / ERROR_FLASH_FRAMES;
    const zigHalf = ERROR_SPIKE_STEP / 2;
    ctx.fillStyle = `rgba(255,25,25,${alpha})`;

    // Top
    ctx.beginPath();
    ctx.moveTo(0, 0);
    for (let x = 0; x < canvas.width; x += ERROR_SPIKE_STEP) {
      ctx.lineTo(x + zigHalf, ERROR_SPIKE_DEPTH);
      ctx.lineTo(x + ERROR_SPIKE_STEP, 0);
    }
    ctx.lineTo(canvas.width, 0);
    ctx.closePath();
    ctx.fill();

    // Bottom
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    for (let x = 0; x < canvas.width; x += ERROR_SPIKE_STEP) {
      ctx.lineTo(x + zigHalf, canvas.height - ERROR_SPIKE_DEPTH);
      ctx.lineTo(x + ERROR_SPIKE_STEP, canvas.height);
    }
    ctx.lineTo(canvas.width, canvas.height);
    ctx.closePath();
    ctx.fill();

    // Left
    ctx.beginPath();
    ctx.moveTo(0, 0);
    for (let y = 0; y < canvas.height; y += ERROR_SPIKE_STEP) {
      ctx.lineTo(ERROR_SPIKE_DEPTH, y + zigHalf);
      ctx.lineTo(0, y + ERROR_SPIKE_STEP);
    }
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fill();

    // Right
    ctx.beginPath();
    ctx.moveTo(canvas.width, 0);
    for (let y = 0; y < canvas.height; y += ERROR_SPIKE_STEP) {
      ctx.lineTo(canvas.width - ERROR_SPIKE_DEPTH, y + zigHalf);
      ctx.lineTo(canvas.width, y + ERROR_SPIKE_STEP);
    }
    ctx.lineTo(canvas.width, canvas.height);
    ctx.closePath();
    ctx.fill();
  }
}
