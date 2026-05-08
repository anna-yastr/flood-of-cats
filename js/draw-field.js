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
    const borderWidth = 28; // глубина шипа — больше = острее
    const red = 255, green = 25, blue = 25; // bright red
    const zigStep = 16;  // узкий шаг → острее
    const zigHalf = zigStep / 2;
    const fillColor = `rgba(${red}, ${green}, ${blue}, ${alpha})`;

    // Top spikes — основание на краю, острие вглубь поля
    ctx.fillStyle = fillColor;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    for (let x = 0; x < canvas.width; x += zigStep) {
      ctx.lineTo(x + zigHalf, borderWidth);
      ctx.lineTo(x + zigStep, 0);
    }
    ctx.lineTo(canvas.width, 0);
    ctx.closePath();
    ctx.fill();

    // Bottom spikes
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    for (let x = 0; x < canvas.width; x += zigStep) {
      ctx.lineTo(x + zigHalf, canvas.height - borderWidth);
      ctx.lineTo(x + zigStep, canvas.height);
    }
    ctx.lineTo(canvas.width, canvas.height);
    ctx.closePath();
    ctx.fill();

    // Left spikes
    ctx.beginPath();
    ctx.moveTo(0, 0);
    for (let y = 0; y < canvas.height; y += zigStep) {
      ctx.lineTo(borderWidth, y + zigHalf);
      ctx.lineTo(0, y + zigStep);
    }
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fill();

    // Right spikes
    ctx.beginPath();
    ctx.moveTo(canvas.width, 0);
    for (let y = 0; y < canvas.height; y += zigStep) {
      ctx.lineTo(canvas.width - borderWidth, y + zigHalf);
      ctx.lineTo(canvas.width, y + zigStep);
    }
    ctx.lineTo(canvas.width, canvas.height);
    ctx.closePath();
    ctx.fill();
  }
}
