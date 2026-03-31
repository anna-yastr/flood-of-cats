/* =========================
   GAME STATE
   ========================= */

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Active cats on screen
let bugs = [];
let score = 0;
let gameOver = false;
let escapedCats = 0;
let lastCatIndex = -1;

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
const cats = [];

// Asset loading progress
let assetsToLoad = 4 + CAT_COUNT; // waterLevel + waterLevelTop + defeat + defeat1 + cats
let assetsLoaded = 0;
let readyToStart = false;

// Countdown before game starts
let countdown = 3;
let countdownActive = false;
let countdownTimerId = null;

// Loading animation dots
let loadingDots = 0;
let loadingDotsTimerId = null;
