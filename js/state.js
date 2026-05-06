/* =========================
   GAME STATE
   ========================= */

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Active cats on screen
let bugs = [];
let hitEffects  = []; // click pop effects: { x, y, r, life }
let dyingBugs   = []; // swirling-out cats: { x, y, size, img, rot, tx, ty, life }
let score = 0;
let streak = 0;
let gameOver = false;
let escapedCats = 0;
let lastCatIndex = -1;
let lastSpawnType = null; // 'cat' | 'anchor' — prevents same object twice in a row
let fallSpeedMultiplier = 1.0; // accumulates on each combo-5 hit
let streakHitTimes = []; // timestamps of hits in current streak (for fast-combo detection)
let comboSpeedBoostPending = false; // next spawned cat gets ×COMBO_SPEED_BOOST
let lastHundredSound = 0; // tracks the last hundred milestone for meow sound
let errorFlash = 0; // frames left for red border flash on error

// Water level animation
let waterCurrentY = canvas.height; // current Y position (top of image)
let waterTargetY  = canvas.height; // target Y position
let waveClock     = 0;             // time counter for wave oscillation

// Spawn timing
let spawnInterval = SPAWN_INTERVAL_START_MS;
let spawnTimerId = null;

// Images
const waterLevelImg    = new Image();
const waterLevelTopImg = new Image();
const defeat  = new Image();
const defeat1 = new Image();
let defeatAltFrame = false;
let hoverDefeat = false;
const start1 = new Image();
const start2 = new Image();
let startAltFrame = false;
let hoverStart = false;
const tut1 = new Image();
const tut2 = new Image();
let tutAltFrame  = false;
let hoverTutorial = false;
let showTutorial      = false;
let hoverBack         = false;
let tutCatIndex       = 0;
let tutClosing        = false; // water-fill exit animation active
let tutCloseProgress  = 0;    // 0..1, water fills from 10% to 100%
const tex1 = new Image();
const tex2 = new Image();
let texFrame = false;
let sbPawBlinkFrame = false; // toggles every 1s for checkerboard blink
let newBlinkFrame   = false; // toggles every 400ms for NEW! blink
const cats = [];
const anchorImg   = new Image();
const comboPawImg = new Image();

// Paw border overlay canvas
const pawCanvas = document.getElementById('pawCanvas');
const pawCtx    = pawCanvas.getContext('2d');

// Asset loading progress
let assetsToLoad = 17; // waterLevel + waterLevelTop + defeat + defeat1 + anchor + comboPaw + start1 + start2 + tex1 + tex2 + tut1 + tut2 + catAtlas + 4 meow sounds
let assetsLoaded = 0;
let uiReady = false;           // start+tutorial buttons loaded → show start screen
let uiAssetsLoaded = 0;
const uiAssetsToLoad = 4;     // start1, start2, tut1, tut2
let readyToStart = false;     // all gameplay assets loaded → game can start
let waitingToStart = false;   // player is on start screen, hasn't clicked yet
let bestScores = JSON.parse(localStorage.getItem('flood_best_scores') || '[]');
const SOUND_ENABLED_STORAGE_KEY = 'flood_sound_enabled';
let soundEnabled = localStorage.getItem(SOUND_ENABLED_STORAGE_KEY);
if (soundEnabled === null) {
  soundEnabled = true;
} else {
  soundEnabled = soundEnabled === '1';
}
let newScoreIndex = -1; // index in bestScores of the just-recorded score, -1 = none
let defeatTimeoutId = null;   // 30-second auto-switch from defeat to start screen

// Countdown before game starts (kept for compatibility)
let countdown = 3;
let countdownActive = false;
let countdownTimerId = null;

// Loading animation dots
let loadingDots = 0;
let loadingDotsTimerId = null;
