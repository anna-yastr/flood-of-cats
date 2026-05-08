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
  const extraSlot = streak >= 5 && streak5Since !== null && Date.now() - streak5Since >= 2000 ? 1 : 0;
  if (bugs.length >= MAX_BUGS_ON_SCREEN + extraSlot) return;

  // Random size with ±20% jitter
  const baseSize = Math.max(10, Math.floor(BASE_BUG_SIZE * IMAGE_SCALE));
  const sizeMin  = Math.floor(baseSize * (1 - SIZE_JITTER));
  const sizeMax  = Math.floor(baseSize * (1 + SIZE_JITTER));
  const size     = Math.max(10, Math.floor(baseSize * randf(1 - SIZE_JITTER, 1 + SIZE_JITTER)));

  // Position: random X, starts just above the canvas
  const x = Math.random() * (canvas.width - size);
  const y = -size;

  // Bigger objects fall faster
  const t  = (size - sizeMin) / (sizeMax - sizeMin);

  // Decide: anchor or cat
  // Anchor chance is random in [MIN, MAX] each spawn, and anchor can't appear twice in a row
  const anchorChance = randf(ANCHOR_SPAWN_CHANCE_MIN, ANCHOR_SPAWN_CHANCE_MAX);
  const spawnAnchor  = lastSpawnType !== 'anchor' && Math.random() < anchorChance;

  if (spawnAnchor) {
    // Anchor: no rotation, falls faster than cats
    const vy = (3.45 + t * 2.40) * fallSpeedMultiplier * FALL_SPEED_BOOST * 1.15;
    bugs.push({ x, y, size, img: anchorImg, rot: 0, vy, type: 'anchor' });
    lastSpawnType = 'anchor';
  } else {
    // Pick a random cat image, never repeat the same index as last spawn
    let catIndex = randi(cats.length);
    if (cats.length > 1 && catIndex === lastCatIndex) {
      catIndex = (catIndex + 1 + randi(cats.length - 1)) % cats.length;
    }
    lastCatIndex  = catIndex;
    lastSpawnType = 'cat';

    const flip = Math.random() < CAT_FLIP_CHANCE;
    const comboBoost = comboSpeedBoostPending ? Math.min(1.6, COMBO_SPEED_BOOST * fallSpeedMultiplier) : 1;
    comboSpeedBoostPending = false;
    const vy = (2.875 + t * 2.00) * fallSpeedMultiplier * comboBoost * FALL_SPEED_BOOST;
    bugs.push({ x, y, size, img: cats[catIndex], rot: 0, flip, vy, type: 'cat' });
  }
}
