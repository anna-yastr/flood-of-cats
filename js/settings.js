/* =========================
   SETTINGS
   ========================= */

// Loading screen
const STATUS_FONT_SIZE = 26; // font size for "Loading..." text

// Game rules
const MAX_BUGS_ON_SCREEN = 4;
const MAX_ESCAPED_CATS = 10;    // 10 котов × 10% = 100% — game over
const ANCHOR_WATER_PENALTY = 1; // штраф уровня воды за клик на якорь (в котах)

// Bug visuals
const IMAGE_SCALE = 2.25;   // базовый скейл кота
const BASE_BUG_SIZE = 200;    // базовый размер до скейла (134 × 1.3)
const SIZE_JITTER = 0.10;     // разброс размера котов в процентах (±10% от базового размера)
const CAT_FLIP_CHANCE = 0.5;  // вероятность зеркалить кота по горизонтали

// Сложность — ускорение ТОЛЬКО от кликов, авто-ускорение отключено
const SPAWN_INTERVAL_START_MS     = 1550;
const SPAWN_INTERVAL_MIN_MS       = 350;
const FALL_SPEED_BOOST            = 0.5; // базовая скорость
const FALL_SPEED_MULTIPLIER_MAX   = 8.67;  // предел скорости (в множителях от базовой)
const CAT_BASE_SPEED              = 2.875; // базовая скорость падения кота
const CAT_SPEED_VARIANCE          = 2.00;  // добавка скорости для крупного кота
const ANCHOR_BASE_SPEED           = 3.05;  // базовая скорость падения якоря
const ANCHOR_SPEED_VARIANCE       = 2.40;  // добавка скорости для крупного якоря
const ANCHOR_SPEED_BOOST          = 1.15;  // якорь падает быстрее кота в × раз
const STREAK5_BONUS_HITS1         = 7;     // кликов в комбо 5+ до 1-го ускорения спауна
const STREAK5_BONUS_HITS2         = 14;     // кликов в комбо 5+ до 2-го ускорения спауна
const STREAK5_BONUS_HITS3         = 21;     // кликов в комбо 5+ до 3-го ускорения спауна
const STREAK5_INTERVAL_FACTOR1    = 0.65;   // интервал × 0.65 (на 35% чаще)
const STREAK5_INTERVAL_FACTOR2    = 0.50;   // интервал × 0.50 (на 50% чаще)
const STREAK5_INTERVAL_FACTOR3    = 0.35;   // интервал × 0.35 (на 65% чаще)
const STREAK_BOOST_EVERY_N        = 5;     // каждые N хитов подряд (стрик ≥ 2) — ускорение спавна и скорости
const STREAK_SPEED_BOOST_M        = 1.07;  // фиксированное ускорение +7% за N подряд
const COMBO_BOOST_MIN             = 1.01;  // рандомное ускорение при стрике 5: мин
const COMBO_BOOST_MAX             = 1.03;  // рандомное ускорение при стрике 5: макс

// Error flash & dying cat effects
const ERROR_FLASH_FRAMES   = 42;   // длительность красной рамки ошибки (~0.7 сек при 60 FPS)
const ERROR_SPIKE_DEPTH    = 28;   // px — глубина зубца (больше = острее)
const ERROR_SPIKE_STEP     = 16;   // px — шаг между зубцами (меньше = гуще)
const DYING_CAT_FADE_SPEED = 0.07; // убывание прозрачности умирающего кота за кадр

// Defeat image sizing
const DEFEAT_IMG_W = 449;
const DEFEAT_IMG_H = 449;
const DEFEAT_IMG_Y_OFFSET = 0;

// Start button sizing
const START_IMG_W = 449;
const START_IMG_H = 449;
const START_IMG_Y_OFFSET  = -50; // px, negative = higher
const SCOREBOARD_Y_OFFSET = -40; // px, negative = higher
const START_SRC1 = "assets/start1.webp";
const START_SRC2 = "assets/start2.webp";

// Tutorial button sizing (80% of start button)
const TUTORIAL_IMG_W = Math.round(START_IMG_W * 0.8);
const TUTORIAL_IMG_H = Math.round(START_IMG_H * 0.8);
const TUTORIAL_GAP_Y    = -100; // px offset from bottom of start button (negative = higher)
const TUTORIAL_SB_GAP_Y =   0; // px gap between scoreboard bottom and tutorial button

// Back button on tutorial screen
const BACK_BTN_RADIUS = 39; // circle radius in px
const BACK_BTN_MARGIN = 18; // distance from canvas edges
const TUTORIAL_SRC1  = "assets/tutorial1.webp";
const TUTORIAL_SRC2  = "assets/tutorial2.webp";

// Assets
const DEFEAT_SRC = "assets/defeat2.webp";
const CAT_COUNT = 9;
const CAT_ATLAS_SRC  = "assets/cat.webp";
const CAT_ATLAS_COLS = 3;
const WATER_LEVEL_SRC = "assets/Water_level.webp";
const WATER_LEVEL_TOP_SRC = "assets/Water_level_top.webp";
const WATER_LEVEL_STEP = 0.1;   // +10% высоты канваса за каждого пропущенного кота → 10 котов = 100%

// Anchor
const ANCHOR_SRC = "assets/anchor1.webp";

// Background music
const BACKGROUND_MUSIC_SRC = "assets/Suno_Purring_Drift.mp3";
const BACKGROUND_MUSIC_VOLUME = 0.1; // default volume 0.0..1.0
const BACKGROUND_MUSIC_STORAGE_KEY = 'flood_bg_music_volume';
const BACKGROUND_MUSIC_MENU_FACTOR = 0.6; // volume multiplier outside the game (menus, game over)

// Cat hit sound
const MEOW_VOLUME = 0.01; // internal volume setting 0.0..1.0
const MEOW_SOUND_SOURCES = [
  "assets/meow-sounds/sound_garage-cat-meow-1-fx-306178.mp3",
  "assets/meow-sounds/sound_garage-cat-meow-7-fx-306186.mp3",
  "assets/meow-sounds/sound_garage-cat-meow-9-fx-306185.mp3",
  "assets/meow-sounds/sound_garage-cat-meow-11-fx-306193.mp3",
];

// Scoreboard textures
const TEXTURE1_SRC = "assets/texture1.webp";
const TEXTURE2_SRC = "assets/texture2.webp";

// Combo paw border (streak >= 3)
const COMBO_PAW_SRC     = "assets/combo_paw.webp";
const COMBO_PAW_SIZE    = 29;   // px — base rendered size (42 × 0.7)
const COMBO_PAW_SPACING = 58;   // px — distance between paw centres
const COMBO_PAW_SPEED_4 = 15;   // px/s — march speed at streak 4
const COMBO_PAW_SPEED   = 50;   // px/s — march speed at streak 5
const COMBO_PAW_BORDER  = 30;   // px — strip width outside canvasFrame on each side
const ANCHOR_SPAWN_CHANCE_MIN = 0.10; // min chance per spawn to be an anchor
const ANCHOR_SPAWN_CHANCE_MAX = 0.18; // max chance per spawn to be an anchor
const COMBO_WINDOW_MS   = 6000; // max ms for 5 hits to count as a fast combo

// Vortex drain effect (activates on game over)
const VORTEX_TANGENTIAL = 0.30;  // ускорение по касательной (закручивание)
const VORTEX_INWARD     = 0.20;  // ускорение к центру (втягивание)
const VORTEX_FRICTION   = 0.96;  // затухание скорости за кадр
const VORTEX_CENTER_X   = 0.5;   // положение центра воронки (доля ширины)
const VORTEX_CENTER_Y   = 0.52;  // положение центра воронки (доля высоты)

// Pixel-perfect hit detection debug
// When true: draws bounding box + last clicked pixel highlight on every frame
const DEBUG_PIXEL_HIT = false;
