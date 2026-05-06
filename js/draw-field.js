/* =========================
   DRAW: BACKGROUND / FIELD
   ========================= */

function clearField() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(239,243,249,0.85)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Red border flash on error with fade out and zigzag edge
  if (errorFlash > 0) {
    const alpha = errorFlash / 42; // fade from 1 to 0 over 42 frames
    const borderWidth = 16;
    const red = 220, green = 80, blue = 80; // desaturated red (15% less saturated)
    const zigStep = 24;
    const zigHalf = zigStep / 2;
    const fillColor = `rgba(${red}, ${green}, ${blue}, ${alpha})`;

    // Top zigzag
    ctx.fillStyle = fillColor;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    for (let x = 0; x <= canvas.width; x += zigStep) {
      ctx.lineTo(x + zigHalf, borderWidth);
      ctx.lineTo(x + zigStep, 0);
    }
    ctx.lineTo(canvas.width, borderWidth);
    ctx.lineTo(0, borderWidth);
    ctx.closePath();
    ctx.fill();

    // Bottom zigzag
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    for (let x = 0; x <= canvas.width; x += zigStep) {
      ctx.lineTo(x + zigHalf, canvas.height - borderWidth);
      ctx.lineTo(x + zigStep, canvas.height);
    }
    ctx.lineTo(canvas.width, canvas.height - borderWidth);
    ctx.lineTo(0, canvas.height - borderWidth);
    ctx.closePath();
    ctx.fill();

    // Left zigzag
    ctx.beginPath();
    ctx.moveTo(0, 0);
    for (let y = 0; y <= canvas.height; y += zigStep) {
      ctx.lineTo(borderWidth, y + zigHalf);
      ctx.lineTo(0, y + zigStep);
    }
    ctx.lineTo(borderWidth, canvas.height);
    ctx.lineTo(borderWidth, 0);
    ctx.closePath();
    ctx.fill();

    // Right zigzag
    ctx.beginPath();
    ctx.moveTo(canvas.width, 0);
    for (let y = 0; y <= canvas.height; y += zigStep) {
      ctx.lineTo(canvas.width - borderWidth, y + zigHalf);
      ctx.lineTo(canvas.width, y + zigStep);
    }
    ctx.lineTo(canvas.width - borderWidth, canvas.height);
    ctx.lineTo(canvas.width - borderWidth, 0);
    ctx.closePath();
    ctx.fill();
  }
}
