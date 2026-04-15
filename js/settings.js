/* =========================
   SETTINGS
   ========================= */

// Loading screen
const STATUS_FONT_SIZE = 22; // font size for "Loading..." text

// Game rules
const MAX_BUGS_ON_SCREEN = 20;
const MAX_ESCAPED_CATS = 10; // 10 котов × 10% = 100% — game over

// Bug visuals
const IMAGE_SCALE = 2.1875;   // базовый скейл ботинка
const BASE_BUG_SIZE = 112;    // базовый размер до скейла
const SIZE_JITTER = 0.20;     // ±20% (0.20 => [0.8..1.2])
const ROTATE_DEG = 30;        // ±30 градусов

// Spawn speed (geometric progression)
const SPAWN_INTERVAL_START_MS = 1406;
const SPAWN_INTERVAL_MULTIPLIER = 0.978; // ближе к 1.0 = медленнее ускоряется
const SPAWN_INTERVAL_MIN_MS = 391;
const CLICK_SPEEDUP_FACTOR = 0.976;

// Defeat image sizing
const DEFEAT_IMG_W = 449;
const DEFEAT_IMG_H = 449;
const DEFEAT_IMG_Y_OFFSET = 0;

// Start button sizing
const START_IMG_W = 449;
const START_IMG_H = 449;
const START_IMG_Y_OFFSET  = -50; // px, negative = higher
const SCOREBOARD_Y_OFFSET = -40; // px, negative = higher
const START_SRC1 = "assets/start1.png";
const START_SRC2 = "assets/start2.png";

// Tutorial button sizing (80% of start button)
const TUTORIAL_IMG_W = Math.round(START_IMG_W * 0.8);
const TUTORIAL_IMG_H = Math.round(START_IMG_H * 0.8);
const TUTORIAL_GAP_Y    = -100; // px offset from bottom of start button (negative = higher)
const TUTORIAL_SB_GAP_Y =   0; // px gap between scoreboard bottom and tutorial button

// Back button on tutorial screen
const BACK_BTN_RADIUS = 26; // circle radius in px
const BACK_BTN_MARGIN = 18; // distance from canvas edges
const TUTORIAL_SRC1  = "assets/tutorial1.png";
const TUTORIAL_SRC2  = "assets/tutorial2.png";

// Assets
const DEFEAT_SRC = "assets/defeat.png";
const CAT_COUNT = 6;
const CAT_PREFIX = "assets/cat";
const WATER_LEVEL_SRC = "assets/Water_level.png";
const WATER_LEVEL_TOP_SRC = "assets/Water_level_top.png";
const WATER_LEVEL_STEP = 0.1;   // +10% высоты канваса за каждого пропущенного кота → 10 котов = 100%

// Anchor
const ANCHOR_SRC = "assets/anchor1.png";

// Scoreboard textures
const TEXTURE1_SRC = "assets/texture1.png";
const TEXTURE2_SRC = "assets/texture2.png";

// Combo paw border (streak >= 3)
const COMBO_PAW_SRC     = "assets/combo_paw.png";
const COMBO_PAW_SIZE    = 29;   // px — base rendered size (42 × 0.7)
const COMBO_PAW_SPACING = 58;   // px — distance between paw centres
const COMBO_PAW_SPEED_4 = 15;   // px/s — march speed at streak 4
const COMBO_PAW_SPEED   = 50;   // px/s — march speed at streak 5
const COMBO_PAW_BORDER  = 30;   // px — strip width outside canvasFrame on each side
const ANCHOR_SPAWN_CHANCE_MIN = 0.08; // min chance per spawn to be an anchor
const ANCHOR_SPAWN_CHANCE_MAX = 0.16; // max chance per spawn to be an anchor
