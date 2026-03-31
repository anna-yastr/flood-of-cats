/* =========================
   ASSET PRELOAD
   ========================= */

function markLoaded() {
  assetsLoaded++;
  if (assetsLoaded >= assetsToLoad) {
    readyToStart = true;
    startCountdown(); // defined in main.js — called after all scripts load
  }
}

function startLoadingDots() {
  if (loadingDotsTimerId) return;
  loadingDotsTimerId = setInterval(() => {
    loadingDots = (loadingDots + 1) % 4; // cycles 0..3
  }, 350);
}

function stopLoadingDots() {
  if (loadingDotsTimerId) {
    clearInterval(loadingDotsTimerId);
    loadingDotsTimerId = null;
  }
}

// Load water images
waterLevelImg.onload  = markLoaded;
waterLevelImg.onerror = markLoaded;
waterLevelImg.src = WATER_LEVEL_SRC;

waterLevelTopImg.onload  = markLoaded;
waterLevelTopImg.onerror = markLoaded;
waterLevelTopImg.src = WATER_LEVEL_TOP_SRC;

// Load defeat screens
defeat.onload  = markLoaded;
defeat.onerror = markLoaded;
defeat.src = DEFEAT_SRC;

defeat1.onload  = markLoaded;
defeat1.onerror = markLoaded;
defeat1.src = "assets/defeat1.png";

// Alternate defeat frames every 600ms
setInterval(() => { defeatAltFrame = !defeatAltFrame; }, 600);

// Load all cat images
for (let i = 1; i <= CAT_COUNT; i++) {
  const img = new Image();
  img.onload  = markLoaded;
  img.onerror = markLoaded;
  img.src = `${CAT_PREFIX}${i}.png`;
  cats.push(img);
}

startLoadingDots();
