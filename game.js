/* =========================
   SETTINGS
   ========================= */

// Center overlay text
const RULE_TEXT = "Click cats before they flood the screen";
const RULE_FONT_SIZE = 26;
const STATUS_FONT_SIZE = 22;
const RULE_Y_OFFSET = -10;
const STATUS_Y_OFFSET = 30;

// Game rules
const MAX_BUGS_ON_SCREEN = 20;
const MAX_ESCAPED_CATS = 20;

// Bug visuals
const IMAGE_SCALE = 2.1875;   // базовый скейл ботинка
const BASE_BUG_SIZE = 120;    // базовый размер до скейла
const SIZE_JITTER = 0.20;     // ±20% (0.20 => [0.8..1.2])
const ROTATE_DEG = 30;        // ±30 градусов

// Spawn speed (geometric progression)
const SPAWN_INTERVAL_START_MS = 900;
const SPAWN_INTERVAL_MULTIPLIER = 0.970; // ближе к 1.0 = медленнее ускоряется
const SPAWN_INTERVAL_MIN_MS = 150;
const CLICK_SPEEDUP_FACTOR = 0.968;

// Defeat image sizing
const DEFEAT_IMG_W = 390;
const DEFEAT_IMG_H = 390;
const DEFEAT_IMG_Y_OFFSET = 0;

// Assets
const DEFEAT_SRC = "assets/defeat.png";
const CAT_COUNT = 5;
const CAT_PREFIX = "assets/cat";

/* =========================
   GAME STATE
   ========================= */

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");


let bugs = [];
let score = 0;
let gameOver = false;
let escapedCats = 0;
let lastCatIndex = -1;

// spawn control
let spawnInterval = SPAWN_INTERVAL_START_MS;
let spawnTimerId = null;

// preload
const defeat = new Image();
const defeat1 = new Image();
let defeatAltFrame = false;
let hoverDefeat = false;
const cats = [];

let assetsToLoad = 2 + CAT_COUNT; // defeat + defeat1 + cats
let assetsLoaded = 0;
let readyToStart = false;

// countdown + loading dots
let countdown = 3;
let countdownActive = false;
let countdownTimerId = null;

let loadingDots = 0;
let loadingDotsTimerId = null;

/* =========================
   UTILS
   ========================= */

function randi(n){ return Math.floor(Math.random() * n); }
function randf(a,b){ return a + Math.random() * (b-a); }
function degToRad(d){ return d * Math.PI / 180; }

/* =========================
   SPAWN CONTROL
   ========================= */

function stopSpawning(){
  if(spawnTimerId !== null){
    clearTimeout(spawnTimerId);
    spawnTimerId = null;
  }
}

function scheduleNextSpawn(){
  if(gameOver) return;

  spawnTimerId = setTimeout(() => {
    spawnBug();
    spawnInterval = Math.max(SPAWN_INTERVAL_MIN_MS, Math.floor(spawnInterval * SPAWN_INTERVAL_MULTIPLIER));
    scheduleNextSpawn();
  }, spawnInterval);
}

function startSpawning(){
  stopSpawning();
  scheduleNextSpawn();
}

/* =========================
   RESET / RESTART
   ========================= */

function resetRunState(){

  bugs = [];
  score = 0;
  gameOver = false;
  escapedCats = 0;
  lastCatIndex = -1;

  spawnInterval = SPAWN_INTERVAL_START_MS;
  stopSpawning();

  countdown = 3;
  countdownActive = false;

  if(countdownTimerId){
    clearInterval(countdownTimerId);
    countdownTimerId = null;
  }

  // если ассеты уже загружены — сразу запускаем отсчёт
  if(readyToStart){
    startCountdown();
  }
}


// удобно: клавиша R
window.addEventListener("keydown", (e) => {
  if(e.key && e.key.toLowerCase() === "r"){
    resetRunState();
  }
});

/* =========================
   ASSET PRELOAD
   ========================= */

function markLoaded(){
  assetsLoaded++;
  if(assetsLoaded >= assetsToLoad){
    readyToStart = true;
    startCountdown();
  }
}

function startLoadingDots(){
  if(loadingDotsTimerId) return;
  loadingDotsTimerId = setInterval(() => {
    loadingDots = (loadingDots + 1) % 4; // 0..3
  }, 350);
}

function stopLoadingDots(){
  if(loadingDotsTimerId){
    clearInterval(loadingDotsTimerId);
    loadingDotsTimerId = null;
  }
}

defeat.onload = markLoaded;
defeat.onerror = markLoaded;
defeat.src = DEFEAT_SRC;

defeat1.onload = markLoaded;
defeat1.onerror = markLoaded;
defeat1.src = "assets/defeat1.png";

setInterval(() => { defeatAltFrame = !defeatAltFrame; }, 600);

for(let i=1; i<=CAT_COUNT; i++){
  const img = new Image();
  img.onload = markLoaded;
  img.onerror = markLoaded;
  img.src = `${CAT_PREFIX}${i}.png`;
  cats.push(img);
}

startLoadingDots();

/* =========================
   COUNTDOWN
   ========================= */

function startCountdown(){
  if(countdownActive || gameOver) return;

  stopLoadingDots();

  countdown = 3;
  countdownActive = true;

  countdownTimerId = setInterval(() => {
    countdown--;
    if(countdown <= 0){
      clearInterval(countdownTimerId);
      countdownTimerId = null;
      countdownActive = false;
      startSpawning();
    }
  }, 1000);
}

/* =========================
   SPAWN / HIT
   ========================= */

function spawnBug(){
  if(gameOver) return;

  // базовый размер с jitter ±20%
  const baseSize = Math.max(10, Math.floor(BASE_BUG_SIZE * IMAGE_SCALE));
  const size = Math.max(10, Math.floor(baseSize * randf(1 - SIZE_JITTER, 1 + SIZE_JITTER)));

  // угол ±30°
  const rot = degToRad(randf(-ROTATE_DEG, ROTATE_DEG));

  // выбираем рандомного кота, исключая предыдущего
  let catIndex = randi(cats.length);
  if(cats.length > 1 && catIndex === lastCatIndex){
    catIndex = (catIndex + 1 + randi(cats.length - 1)) % cats.length;
  }
  lastCatIndex = catIndex;
  const img = cats[catIndex];

  // позиция так, чтобы не вылезало (с учётом size)
 const x = Math.random() * (canvas.width - size);

/* появляется немного выше поля */
const y = -size;

const vy = randf(2.5, 4.5);  // скорость падения

bugs.push({ x, y, size, img, rot, vy });
}

function pointerPos(evt){
  const rect = canvas.getBoundingClientRect();
  const clientX = evt.touches ? evt.touches[0].clientX : evt.clientX;
  const clientY = evt.touches ? evt.touches[0].clientY : evt.clientY;

  const scaleX = canvas.width  / rect.width;
  const scaleY = canvas.height / rect.height;

  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top)  * scaleY
  };
}

function tryHit(mx, my){
  if(gameOver) return;
  if(!readyToStart || countdownActive) return;

  // кликаем по axis-aligned bbox
  for(let i = bugs.length - 1; i >= 0; i--){
    const b = bugs[i];
    const hit = (mx >= b.x && mx <= b.x + b.size && my >= b.y && my <= b.y + b.size);
    if(hit){
      bugs.splice(i, 1);
      score += 1;
      
      // дополнительное ускорение за успешный клик
      spawnInterval = Math.max(
      SPAWN_INTERVAL_MIN_MS,
      Math.floor(spawnInterval * CLICK_SPEEDUP_FACTOR)
      );

       
      return;
    }
  }
}

function defeatRect(){
  const w = DEFEAT_IMG_W, h = DEFEAT_IMG_H;
  const x = (canvas.width - w) / 2;
  const y = (canvas.height - h) / 2 + DEFEAT_IMG_Y_OFFSET;
  return { x, y, w, h };
}

canvas.addEventListener("mousemove", (e) => {
  if(!gameOver){ hoverDefeat = false; canvas.style.cursor = ""; return; }
  const p = pointerPos(e);
  const r = defeatRect();
  hoverDefeat = p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h;
  canvas.style.cursor = hoverDefeat ? "pointer" : "";
});

canvas.addEventListener("click", (e) => {
  const p = pointerPos(e);
  if(gameOver){
    const r = defeatRect();
    if(p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h){
      resetRunState();
      return;
    }
  }
  tryHit(p.x, p.y);
});

canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  const p = pointerPos(e);
  if(gameOver){
    const r = defeatRect();
    if(p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h){
      resetRunState();
      return;
    }
  }
  tryHit(p.x, p.y);
}, { passive: false });

/* =========================
   DRAW
   ========================= */

function clearField(){
  ctx.clearRect(0,0,canvas.width, canvas.height);
  ctx.fillStyle = "rgba(210,220,238,0.85)";
  ctx.fillRect(0,0,canvas.width, canvas.height);
}

function drawHUD(){
  const hx = canvas.width * 0.02 + 14;
  const hy = canvas.height * 0.02;
  const scoreY  = 32 + hy;
  const escapedY = 56 + hy;

  // measure text widths to size the background pill
  ctx.font = "28px 'Fredoka One', cursive";
  const scoreW = ctx.measureText(`Score: ${score}`).width;
  ctx.font = "18px 'Fredoka One', cursive";
  const escapedW = ctx.measureText(`Escaped: ${escapedCats}/${MAX_ESCAPED_CATS}`).width;

  const padX = 10, padY = 7;
  const boxX = hx - padX;
  const boxY = scoreY - 22 - padY;           // ~cap-height above score baseline
  const boxW = Math.max(scoreW, escapedW) + padX * 2;
  const boxH = (escapedY - scoreY + 18) + padY + (padY + 4);  // span both lines + padding

  ctx.fillStyle = "rgba(255,255,255,0.52)";
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, boxW, boxH, 12);
  ctx.fill();

  ctx.shadowColor = "rgba(10,25,60,0.35)";
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;
  ctx.shadowBlur = 2;
  ctx.fillStyle = "#254160";
  ctx.font = "28px 'Fredoka One', cursive";
  ctx.textAlign = "left";
  ctx.fillText(`Score: ${score}`, hx, scoreY);

  ctx.fillStyle = "#254160";
  ctx.font = "18px 'Fredoka One', cursive";
  ctx.fillText(`Escaped: ${escapedCats}/${MAX_ESCAPED_CATS}`, hx, escapedY);
  ctx.shadowColor = "transparent";
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.shadowBlur = 0;
}

function drawBug(b){
  const cx = b.x + b.size / 2;
  const cy = b.y + b.size / 2;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(b.rot);
  ctx.drawImage(b.img, -b.size/2, -b.size/2, b.size, b.size);
  ctx.restore();
}

function drawBugs(){
  for(let i = bugs.length - 1; i >= 0; i--){
    const b = bugs[i];

    if(b.vy){
      b.y += b.vy;
    }

    if(b.y > canvas.height){
      bugs.splice(i, 1);
      escapedCats++;
      if(escapedCats >= MAX_ESCAPED_CATS && !gameOver){
        gameOver = true;
        stopSpawning();
        if(countdownTimerId) clearInterval(countdownTimerId);
      }
      continue;
    }

    drawBug(b);
  }
}

function drawCenterOverlay(){
  ctx.fillStyle = "rgba(40,100,220,0.082)";
  ctx.fillRect(0,0,canvas.width, canvas.height);

  ctx.shadowColor = "rgba(10,25,60,0.35)";
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;
  ctx.shadowBlur = 2;
  ctx.textAlign = "center";
  ctx.fillStyle = "#254160";
  ctx.font = `${RULE_FONT_SIZE}px 'Fredoka One', cursive`;
  ctx.fillText(RULE_TEXT, canvas.width/2, canvas.height/2 + RULE_Y_OFFSET);

  ctx.fillStyle = "#254160";
  ctx.font = `${STATUS_FONT_SIZE}px 'Fredoka One', cursive`;

  let line = "";
  if(!readyToStart){
    const dots = ".".repeat(loadingDots);
    line = `Loading${dots}`;
  } else if(countdownActive){
    line = `Starting in: ${countdown}`;
  }

  if(line){
    ctx.fillText(line, canvas.width/2, canvas.height/2 + STATUS_Y_OFFSET);
  }

  ctx.shadowColor = "transparent";
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.shadowBlur = 0;
  ctx.textAlign = "left";
}

function drawGameOver(){
  // гарантируем что кнопка видима на экране поражения

  const w = DEFEAT_IMG_W;
  const h = DEFEAT_IMG_H;
  const x = (canvas.width - w) / 2;
  const y = (canvas.height - h) / 2 + DEFEAT_IMG_Y_OFFSET;

  const defeatImg = (defeatAltFrame && defeat1.complete && defeat1.naturalWidth > 0) ? defeat1 : defeat;

  const scale = hoverDefeat ? 1.05 : 1;
  const dw = w * scale, dh = h * scale;
  const dx = x - (dw - w) / 2, dy = y - (dh - h) / 2;

  ctx.fillStyle = "rgba(40,100,220,0.082)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if(defeatImg.complete && defeatImg.naturalWidth > 0){
    ctx.drawImage(defeatImg, dx, dy, dw, dh);
  }

  ctx.textAlign = "left";
}

function loop(){
  clearField();

  if(!gameOver){
  
    if(readyToStart && !countdownActive){
      drawBugs();
      drawHUD();
    } else {
      drawCenterOverlay();
      drawHUD();
    }
  } else {
    drawBugs();
    drawHUD();
    drawGameOver();
  }

  requestAnimationFrame(loop);
}

loop();
