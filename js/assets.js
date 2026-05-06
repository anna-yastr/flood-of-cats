/* =========================
   ASSET PRELOAD
   ========================= */

function markLoaded() {
  assetsLoaded++;
  if (assetsLoaded >= assetsToLoad) {
    readyToStart = true;
    stopLoadingDots();
  }
}

const meowAudioAssets = [];
// Removed errorAudioAssets - using visual flash instead

function createAudioAsset(src, volume) {
  const audio = new Audio();
  audio.preload = 'auto';
  audio.src = src;
  audio.volume = Math.min(1, Math.max(0, volume));
  audio.oncanplaythrough = markLoaded;
  audio.onerror = markLoaded;
  audio.load();
  return audio;
}

function initAudioAssets() {
  if (typeof MEOW_SOUND_SOURCES !== 'undefined' && MEOW_SOUND_SOURCES.length > 0) {
    for (let i = 0; i < MEOW_SOUND_SOURCES.length; i++) {
      meowAudioAssets.push(createAudioAsset(MEOW_SOUND_SOURCES[i], MEOW_VOLUME));
    }
  }
  // Removed error sound loading - using visual flash instead
}

function playMeowSound() {
  if (!soundEnabled || meowAudioAssets.length === 0) return;
  const index = Math.floor(Math.random() * meowAudioAssets.length);
  const audio = meowAudioAssets[index];
  if (!audio) return;
  try {
    if (audio.readyState >= 2) {
      // HAVE_CURRENT_DATA or better — safe to seek
      audio.currentTime = 0;
    }
  } catch (err) {
    // some browsers may reject currentTime reset while not ready
  }
  audio.play().catch(() => {});
}

// Removed playErrorSound - using visual flash instead

function updateSoundToggleButton() {
  const btn = document.getElementById('soundToggleBtn');
  if (!btn) return;
  btn.textContent = soundEnabled ? 'Sound ON' : 'Sound OFF';
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  localStorage.setItem(SOUND_ENABLED_STORAGE_KEY, soundEnabled ? '1' : '0');
  updateSoundToggleButton();
}

const soundToggleBtn = document.getElementById('soundToggleBtn');
if (soundToggleBtn) {
  soundToggleBtn.addEventListener('click', toggleSound);
  updateSoundToggleButton();
}

function markUiLoaded() {
  uiAssetsLoaded++;
  if (uiAssetsLoaded >= uiAssetsToLoad) {
    uiReady = true;
    waitingToStart = true;
  }
  markLoaded();
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
defeat1.src = "assets/defeat1.webp";

// Alternate defeat/start/tutorial frames every 600ms
setInterval(() => { defeatAltFrame = !defeatAltFrame; }, 600);
setInterval(() => { startAltFrame  = !startAltFrame;  }, 600);
setInterval(() => { tutAltFrame    = !tutAltFrame;    }, 600);
// Alternate scoreboard texture every 800ms
setInterval(() => { texFrame = !texFrame; }, 800);
// Scoreboard paw checkerboard blink every 1s
setInterval(() => { sbPawBlinkFrame = !sbPawBlinkFrame; }, 1000);
// NEW! text blink every 600ms
setInterval(() => { newBlinkFrame = !newBlinkFrame; }, 600);

// Load scoreboard textures
tex1.onload  = markLoaded;
tex1.onerror = markLoaded;
tex1.src = TEXTURE1_SRC;

tex2.onload  = markLoaded;
tex2.onerror = markLoaded;
tex2.src = TEXTURE2_SRC;

// Load start button images — critical UI assets (show start screen as soon as these 4 are ready)
start1.onload  = markUiLoaded;
start1.onerror = markUiLoaded;
start1.src = START_SRC1;

start2.onload  = markUiLoaded;
start2.onerror = markUiLoaded;
start2.src = START_SRC2;

// Load tutorial button images
tut1.onload  = markUiLoaded;
tut1.onerror = markUiLoaded;
tut1.src = TUTORIAL_SRC1;

tut2.onload  = markUiLoaded;
tut2.onerror = markUiLoaded;
tut2.src = TUTORIAL_SRC2;

// Load anchor image (src assigned after extractAlpha is defined below)

// Load combo paw image
comboPawImg.onload  = markLoaded;
comboPawImg.onerror = markLoaded;
comboPawImg.src = COMBO_PAW_SRC;

// Extracts alpha channel from an image or canvas into ._alpha (Uint8Array),
// ._aw / ._ah — dimensions. Used for pixel-perfect hit detection.
function extractAlpha(img) {
  const oc   = document.createElement('canvas');
  oc.width   = img.naturalWidth  || img.width;
  oc.height  = img.naturalHeight || img.height;
  const octx = oc.getContext('2d');
  octx.drawImage(img, 0, 0);
  const data  = octx.getImageData(0, 0, oc.width, oc.height).data;
  const alpha = new Uint8Array(oc.width * oc.height);
  for (let i = 0; i < alpha.length; i++) alpha[i] = data[i * 4 + 3];
  img._alpha = alpha;
  img._aw    = oc.width;
  img._ah    = oc.height;
}

// Load cat atlas (3×3 grid) and slice into CAT_COUNT canvas frames
const catAtlas = new Image();
catAtlas.onload = () => {
  const cols = CAT_ATLAS_COLS;
  const rows = CAT_ATLAS_COLS;
  const fw = Math.floor(catAtlas.naturalWidth  / cols);
  const fh = Math.floor(catAtlas.naturalHeight / rows);
  for (let i = 0; i < CAT_COUNT; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const fc  = document.createElement('canvas');
    fc.width  = fw;
    fc.height = fh;
    fc.getContext('2d').drawImage(catAtlas, col * fw, row * fh, fw, fh, 0, 0, fw, fh);
    extractAlpha(fc);
    cats.push(fc);
  }
  markLoaded();
};
catAtlas.onerror = markLoaded;
catAtlas.src = CAT_ATLAS_SRC;

// Extract alpha for anchor (src set here so onload is guaranteed to fire after handler is assigned)
anchorImg.onload  = () => { extractAlpha(anchorImg); markLoaded(); };
anchorImg.onerror = markLoaded;
anchorImg.src     = ANCHOR_SRC;

initAudioAssets();
startLoadingDots();
