/* =========================
   SETTINGS
   ========================= */

// Loading screen
const STATUS_FONT_SIZE = 22; // font size for "Loading..." text

// Game rules
const MAX_BUGS_ON_SCREEN = 3;
const MAX_ESCAPED_CATS = 10; // 10 котов × 10% = 100% — game over

// Bug visuals
const IMAGE_SCALE = 2.1875;   // базовый скейл кота
const BASE_BUG_SIZE = 174;    // базовый размер до скейла (134 × 1.3)
const SIZE_JITTER = 0.20;     // ±20% (0.20 => [0.8..1.2])
const CAT_FLIP_CHANCE = 0.5;  // вероятность зеркалить кота по горизонтали

// Spawn speed (geometric progression)
const SPAWN_INTERVAL_START_MS = 1250;
const SPAWN_INTERVAL_MULTIPLIER = 0.985; // ближе к 1.0 = медленнее ускоряется
const SPAWN_INTERVAL_MIN_MS = 420;
const CLICK_SPEEDUP_FACTOR = 0.970;
const FALL_SPEED_BOOST = 1.125; // общий множитель скорости падения котов и якорей

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

// Miss / error sound
const ERROR_SOUND_SRC = "assets/error.mp3";
const ERROR_VOLUME = 0.03; // internal volume setting 0.0..1.0

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
const ANCHOR_SPAWN_CHANCE_MIN = 0.16; // min chance per spawn to be an anchor
const ANCHOR_SPAWN_CHANCE_MAX = 0.28; // max chance per spawn to be an anchor
const COMBO_WINDOW_MS   = 6000; // max ms for 5 hits to count as a fast combo
const COMBO_SPEED_BOOST = 1.25;  // base vy multiplier applied to one cat after fast combo-5

// Vortex drain effect (activates on game over)
const VORTEX_TANGENTIAL = 0.30;  // ускорение по касательной (закручивание)
const VORTEX_INWARD     = 0.20;  // ускорение к центру (втягивание)
const VORTEX_FRICTION   = 0.96;  // затухание скорости за кадр
const VORTEX_CENTER_X   = 0.5;   // положение центра воронки (доля ширины)
const VORTEX_CENTER_Y   = 0.52;  // положение центра воронки (доля высоты)

// Pixel-perfect hit detection debug
// When true: draws bounding box + last clicked pixel highlight on every frame
const DEBUG_PIXEL_HIT = false;
