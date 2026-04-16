/* =========================
   ASSET PRELOAD
   ========================= */

function markLoaded() {
  assetsLoaded++;
  if (assetsLoaded >= assetsToLoad) {
    readyToStart = true;
    waitingToStart = true;
    stopLoadingDots();
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

// Load start button images
start1.onload  = markLoaded;
start1.onerror = markLoaded;
start1.src = START_SRC1;

start2.onload  = markLoaded;
start2.onerror = markLoaded;
start2.src = START_SRC2;

// Load tutorial button images
tut1.onload  = markLoaded;
tut1.onerror = markLoaded;
tut1.src = TUTORIAL_SRC1;

tut2.onload  = markLoaded;
tut2.onerror = markLoaded;
tut2.src = TUTORIAL_SRC2;

// Load anchor image (src assigned after extractAlpha is defined below)

// Load combo paw image
comboPawImg.onload  = markLoaded;
comboPawImg.onerror = markLoaded;
comboPawImg.src = COMBO_PAW_SRC;

// Extracts alpha channel from an image into img._alpha (Uint8Array),
// img._aw / img._ah — natural dimensions. Used for pixel-perfect hit detection.
function extractAlpha(img) {
  const oc   = document.createElement('canvas');
  oc.width   = img.naturalWidth;
  oc.height  = img.naturalHeight;
  const octx = oc.getContext('2d');
  octx.drawImage(img, 0, 0);
  const data    = octx.getImageData(0, 0, oc.width, oc.height).data;
  const alpha   = new Uint8Array(oc.width * oc.height);
  for (let i = 0; i < alpha.length; i++) alpha[i] = data[i * 4 + 3];
  img._alpha = alpha;
  img._aw    = oc.width;
  img._ah    = oc.height;
}

// Load all cat images
for (let i = 1; i <= CAT_COUNT; i++) {
  const img = new Image();
  img.onload  = () => { extractAlpha(img); markLoaded(); };
  img.onerror = markLoaded;
  img.src = `${CAT_PREFIX}${i}.png`;
  cats.push(img);
}

// Extract alpha for anchor (src set here so onload is guaranteed to fire after handler is assigned)
anchorImg.onload  = () => { extractAlpha(anchorImg); markLoaded(); };
anchorImg.onerror = markLoaded;
anchorImg.src     = ANCHOR_SRC;

startLoadingDots();
