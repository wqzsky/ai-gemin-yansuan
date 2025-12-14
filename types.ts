
export type DivinationType = 'daily' | 'ziwei' | 'dream';

export interface BaZiChart {
  year: string; // e.g. 甲辰
  month: string; // e.g. 丙寅
  day: string;   // e.g. 戊子
  hour: string;  // e.g. 壬戌
  dayMaster: string; // The Day Stem (日元)
  dayMasterStrength: string; // e.g. 身强, 身弱
}

export interface FiveElements {
  metal: number; // 金 (Percentage 0-100)
  wood: number;  // 木
  water: number; // 水
  fire: number;  // 火
  earth: number; // 土
}

export interface ZiWeiData {
  lifePalace: string; // 命宫主星
  bodyPalace: string; // 身宫主星
  luckyStars: string[]; // 吉星 e.g. 左辅, 右弼
  unluckyStars: string[]; // 凶星 e.g. 擎羊, 陀罗
  decade: string; // 大限 (Current 10-year luck)
  analysis: string; // Detailed analysis of the chart
}

export interface DreamData {
  title: string; // Dream title
  elements: string[]; // Key elements identified
  interpretation: string; // Main interpretation (Zhou Gong)
  omen: '吉' | '凶' | '平'; // Good/Bad omen
  action: string; // Recommended action
}

export interface FortuneData {
  luckyColor: string;
  colorExplanation: string;
  luckyNumbers: number[];
  direction: string;
  directionSignificance: string;
  reminder: string;
  rating: number; // Overall rating
  luckyImage?: string; // Base64 data URL from gemini-2.5-flash-image
  
  // Existing Fields (Standard/Combined Mode)
  hexagramCode: string; // e.g., "101101"
  hexagramName: string; // e.g., "第一卦 乾为天"
  luckyTime: string; // e.g., "未时 (13:00-15:00)"

  // New Detailed Fields
  lunarDate: string; // e.g. "农历九月廿三"
  solarTerm: string; // e.g. "霜降"
  yi: string; // Suitable activities
  ji: string; // Unsuitable activities
  scores: {
    wealth: number; // 1-100
    career: number; // 1-100
    love: number;   // 1-100
    health: number; // 1-100
  };
  advice?: {
    life: string;
    career: string;
    relationships: string;
  };
  
  // Method Specific Data
  bazi?: BaZiChart; // Four Pillars of Destiny (Standard/Ziwei)
  fiveElements?: FiveElements; // Elemental Balance (Standard)
  luckyStars: string[]; // Shen Sha (Gods & Spirits)
  
  ziwei?: ZiWeiData; // New: Zi Wei Dou Shu specific
  dream?: DreamData; // New: Dream Interpretation specific

  // Real-time Analysis
  currentHourAnalysis?: {
    shichen: string; // e.g. "午时 (11:00-13:00)"
    baguaDirection: string; // e.g. "离卦 (正南)"
    element: string; // e.g. "火"
    emotion: string; // Analysis on emotion
    health: string; // Analysis on health
    decision: string; // Analysis on decision making
  };
}

export interface UserProfile {
  name: string;
  gender: string;
  age: string;
  zodiac: string;
  intent: string; // Used for Daily/Ziwei
  dreamContent?: string; // Used for Dream
  birthHour: string; 
  type: DivinationType; // New: Selected method
}

export interface BaguaTrigram {
  name: string;
  fullName: string;
  nature: string;
  symbol: string;
  lines: number[];
  position: string;
  mountains: string[];
  loShuNumber: number;
  element: string;
  colorClass: string;
  meaning: string;
  quote: string; 
}
