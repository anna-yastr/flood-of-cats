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
  const factor = streak5Hits >= STREAK5_BONUS_HITS3 ? STREAK5_INTERVAL_FACTOR3
               : streak5Hits >= STREAK5_BONUS_HITS2 ? STREAK5_INTERVAL_FACTOR2
               : streak5Hits >= STREAK5_BONUS_HITS1 ? STREAK5_INTERVAL_FACTOR1
               : 1;
  spawnTimerId = setTimeout(() => {
    spawnBug();
    scheduleNextSpawn();
  }, Math.max(SPAWN_INTERVAL_MIN_MS, Math.round(spawnInterval * factor)));
}

function startSpawning() {
  const indices = cats.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = randi(i + 1);
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  introCatQueue = indices.slice(0, 5);

  stopSpawning();
  scheduleNextSpawn();
}

/* =========================
   SPAWN A CAT
   ========================= */

function spawnBug() {
  if (gameOver) return;
  if (bugs.length >= MAX_BUGS_ON_SCREEN) return;

  const baseSize = Math.max(10, Math.floor(BASE_BUG_SIZE * IMAGE_SCALE));
  const sizeMin  = Math.floor(baseSize * (1 - SIZE_JITTER));
  const sizeMax  = Math.floor(baseSize * (1 + SIZE_JITTER));
  const size     = Math.max(10, Math.floor(randf(sizeMin, sizeMax)));

  // Position: random X, starts just above the canvas
  const x = Math.random() * (canvas.width - size);
  const y = -size;

  // Bigger objects fall faster
  const t  = (size - sizeMin) / (sizeMax - sizeMin);

  // First 5 spawns: unique cats, no anchors
  if (introCatQueue.length > 0) {
    const catIndex = introCatQueue.shift();
    lastCatIndex  = catIndex;
    lastSpawnType = 'cat';
    const flip = Math.random() < CAT_FLIP_CHANCE;
    const vy = (CAT_BASE_SPEED + t * CAT_SPEED_VARIANCE) * fallSpeedMultiplier * FALL_SPEED_BOOST;
    bugs.push({ x, y, size, img: cats[catIndex], rot: 0, flip, vy, type: 'cat' });
    return;
  }

  // Decide: anchor or cat
  // Anchor chance is random in [MIN, MAX] each spawn, and anchor can't appear twice in a row
  const anchorChance = randf(ANCHOR_SPAWN_CHANCE_MIN, ANCHOR_SPAWN_CHANCE_MAX);
  const spawnAnchor  = lastSpawnType !== 'anchor' && Math.random() < anchorChance;

  if (spawnAnchor) {
    // Anchor: no rotation, falls faster than cats
    const vy = (ANCHOR_BASE_SPEED + t * ANCHOR_SPEED_VARIANCE) * fallSpeedMultiplier * FALL_SPEED_BOOST * ANCHOR_SPEED_BOOST;
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
    const vy = (CAT_BASE_SPEED + t * CAT_SPEED_VARIANCE) * fallSpeedMultiplier * FALL_SPEED_BOOST;
    bugs.push({ x, y, size, img: cats[catIndex], rot: 0, flip, vy, type: 'cat' });
  }
}
