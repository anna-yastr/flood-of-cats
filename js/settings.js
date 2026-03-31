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
const MAX_ESCAPED_CATS = 40; // 40 / 2 * 5% = 100% — вода заливает поле

// Bug visuals
const IMAGE_SCALE = 2.1875;   // базовый скейл ботинка
const BASE_BUG_SIZE = 120;    // базовый размер до скейла
const SIZE_JITTER = 0.20;     // ±20% (0.20 => [0.8..1.2])
const ROTATE_DEG = 30;        // ±30 градусов

// Spawn speed (geometric progression)
const SPAWN_INTERVAL_START_MS = 900;
const SPAWN_INTERVAL_MULTIPLIER = 0.970; // ближе к 1.0 = медленнее ускоряется
const SPAWN_INTERVAL_MIN_MS = 250;
const CLICK_SPEEDUP_FACTOR = 0.968;

// Defeat image sizing
const DEFEAT_IMG_W = 390;
const DEFEAT_IMG_H = 390;
const DEFEAT_IMG_Y_OFFSET = 0;

// Assets
const DEFEAT_SRC = "assets/defeat.png";
const CAT_COUNT = 5;
const CAT_PREFIX = "assets/cat";
const WATER_LEVEL_SRC = "assets/Water_level.png";
const WATER_LEVEL_TOP_SRC = "assets/Water_level_top.png";
const WATER_LEVEL_STEP = 0.05;   // +5% высоты канваса за каждых 2 пропущенных кота
