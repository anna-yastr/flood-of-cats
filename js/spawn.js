/* =========================
   MATH UTILS
   ========================= */

function randi(n)    { return Math.floor(Math.random() * n); }
function randf(a, b) { return a + Math.random() * (b - a); }
function degToRad(d) { return d * Math.PI / 180; }

/* =========================
   SPAWN CONTROL
   ========================= */

function stopSpawning() {
  if (spawnTimerId !== null) {
    clearTimeout(spawnTimerId);
    spawnTimerId = null;
  }
}

function scheduleNextSpawn() {
  if (gameOver) return;
  spawnTimerId = setTimeout(() => {
    spawnBug();
    spawnInterval = Math.max(SPAWN_INTERVAL_MIN_MS, Math.floor(spawnInterval * SPAWN_INTERVAL_MULTIPLIER));
    scheduleNextSpawn();
  }, spawnInterval);
}

function startSpawning() {
  stopSpawning();
  scheduleNextSpawn();
}

/* =========================
   SPAWN A CAT
   ========================= */

function spawnBug() {
  if (gameOver) return;

  // Random size with ±20% jitter
  const baseSize = Math.max(10, Math.floor(BASE_BUG_SIZE * IMAGE_SCALE));
  const sizeMin  = Math.floor(baseSize * (1 - SIZE_JITTER));
  const sizeMax  = Math.floor(baseSize * (1 + SIZE_JITTER));
  const size     = Math.max(10, Math.floor(baseSize * randf(1 - SIZE_JITTER, 1 + SIZE_JITTER)));

  // Random rotation ±30°
  const rot = degToRad(randf(-ROTATE_DEG, ROTATE_DEG));

  // Pick a random cat image, avoid repeating the last one
  let catIndex = randi(cats.length);
  if (cats.length > 1 && catIndex === lastCatIndex) {
    catIndex = (catIndex + 1 + randi(cats.length - 1)) % cats.length;
  }
  lastCatIndex = catIndex;
  const img = cats[catIndex];

  // Position: random X, starts just above the canvas
  const x = Math.random() * (canvas.width - size);
  const y = -size;

  // Bigger cats fall faster
  const t  = (size - sizeMin) / (sizeMax - sizeMin);
  const vy = 2.5 + t * 2.0;

  bugs.push({ x, y, size, img, rot, vy });
}
