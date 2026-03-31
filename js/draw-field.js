/* =========================
   DRAW: BACKGROUND / FIELD
   ========================= */

function clearField() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(239,243,249,0.85)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
