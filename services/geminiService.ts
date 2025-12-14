
import { FortuneData, UserProfile, DivinationType } from "../types";

// User provided configuration
const BASE_URL = "https://open.bigmodel.cn/api/paas/v4";
// Switched to glm-4-flash as autoglm-phone generates excessive internal monologue/pseudo-code
const TEXT_MODEL = "glm-4-flash"; 
const IMAGE_MODEL = "cogview-3"; 
const API_KEY = "26eddc5086674e36a43fdd47015f9399.2pPSvY5lC7j33a99";

// Fallback images (Chinese Ink Wash Style)
const FALLBACK_IMAGES = [
    "https://images.unsplash.com/photo-1518176593590-b1480f76903f?q=80&w=1600&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1505672675380-ea1fa66804bd?q=80&w=1600&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1627555191986-e3d1796191c9?q=80&w=1600&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1542642833-2a549929252a?q=80&w=1600&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1600&auto=format&fit=crop"  
];

function extractJson(text: string): any {
    // 0. Remove potential single line comments that some models hallucinate into JSON
    const cleanText = text.replace(/^\s*\/\/.*$/gm, '');

    // 1. Try cleaning markdown code blocks first
    const markdownMatch = cleanText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (markdownMatch) {
        try { return JSON.parse(markdownMatch[1]); } catch (e) {}
    }

    // 2. Scan for JSON-like structures
    let startIndex = -1;
    for (let i = 0; i < cleanText.length; i++) {
        if (cleanText[i] === '{') {
            let j = i + 1;
            while (j < cleanText.length && /\s/.test(cleanText[j])) j++;
            if (j < cleanText.length && cleanText[j] === '"') {
                startIndex = i;
                break;
            }
        }
    }

    if (startIndex !== -1) {
        let endIndex = cleanText.lastIndexOf('}');
        while (endIndex > startIndex) {
            const potentialJson = cleanText.substring(startIndex, endIndex + 1);
            try {
                const obj = JSON.parse(potentialJson);
                if (obj && typeof obj === 'object') return obj;
            } catch (e) {
                endIndex = cleanText.lastIndexOf('}', endIndex - 1);
            }
        }
    }

    // 3. Fallback: Simple extraction
    const firstBrace = cleanText.indexOf('{');
    const lastBrace = cleanText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
         try { return JSON.parse(cleanText.substring(firstBrace, lastBrace + 1)); } catch(e) {}
    }

    throw new Error("Could not extract valid JSON object from response");
}

const getRandomFallbackImage = () => {
    return FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
};

// --- PROMPT GENERATORS ---

const getSystemPrompt = (type: DivinationType): string => {
    const base = `你是一位精通易经八卦、梅花易数、四柱八字（子平术）、紫微斗数与现代心理学的国学大师。请进行深度演算。
    Output ONLY a single valid JSON object. No markdown, no filler, NO comments inside the JSON.`;

    if (type === 'ziwei') {
        return `${base} 
        重点使用【紫微斗数】排盘。
        1. 确定命宫、身宫主星。
        2. 分析三方四正与大限流年。
        3. 识别吉星（如左辅右弼）与凶星（如羊陀火铃）。
        同时结合八字基础进行辅助验证。`;
    } else if (type === 'dream') {
        return `${base} 
        重点使用【周公解梦】与【荣格心理学】分析梦境。
        1. 提取梦中关键意象（Symbolism）。
        2. 判断吉凶（Omen）。
        3. 给出心理学层面的投射解释与现实建议。`;
    } else {
        // Daily / Combined
        return `${base} 
        重点使用【四柱八字】与【梅花易数】。
        1. 分析日主强弱与五行喜忌。
        2. 起卦分析当下时运。`;
    }
};

const getUserPrompt = (profile: UserProfile, nowStr: string): string => {
    const baseInfo = `用户：${profile.name || "善信"}, ${profile.gender}, ${profile.age}岁, ${profile.zodiac}。
    生辰：${profile.birthHour === 'unknown' ? '时辰不详' : profile.birthHour}。
    当前时间：${nowStr}。`;

    if (profile.type === 'ziwei') {
        return `${baseInfo}
        意图：${profile.intent || "紫微流年运势"}。
        
        **任务：紫微斗数深度排盘**
        1. 必须推算命宫、身宫主星。
        2. 识别当前大限（十年运）。
        3. 给出详细的运势分析。

        返回JSON结构（必须包含 'ziwei' 对象）：
        {
            "luckyColor": "...", "colorExplanation": "...", "luckyNumbers": [1,2,3],
            "direction": "...", "directionSignificance": "...", "reminder": "...", "rating": 4,
            "hexagramCode": "000000", "hexagramName": "紫微星", 
            "lunarDate": "...", "solarTerm": "...", "yi": "...", "ji": "...",
            "luckyStars": ["主星1", "吉星2"],
            "scores": { "wealth": 80, "career": 80, "love": 80, "health": 80 },
            "ziwei": {
                "lifePalace": "命宫主星",
                "bodyPalace": "身宫主星",
                "luckyStars": ["吉星列表"],
                "unluckyStars": ["凶星列表"],
                "decade": "当前大限范围及主题",
                "analysis": "详细的紫微盘面分析..."
            },
            "bazi": { "year": "甲辰", "month": "...", "day": "...", "hour": "...", "dayMaster": "...", "dayMasterStrength": "..." }
        }`;
    } else if (profile.type === 'dream') {
        return `${baseInfo}
        **梦境内容**："${profile.dreamContent}"。
        
        **任务：周公解梦与心理分析**
        1. 拆解梦境元素。
        2. 结合传统解梦与现代心理学。
        3. 判断吉凶。

        返回JSON结构（必须包含 'dream' 对象）：
        {
            "luckyColor": "补运颜色", "colorExplanation": "...", "luckyNumbers": [1,2],
            "direction": "安神方位", "directionSignificance": "...", "reminder": "...", "rating": 3,
            "hexagramCode": "101010", "hexagramName": "梦占", 
            "lunarDate": "...", "solarTerm": "...", "yi": "...", "ji": "...",
            "scores": { "wealth": 50, "career": 50, "love": 50, "health": 50 },
            "luckyStars": [],
            "dream": {
                "title": "简短梦境标题",
                "elements": ["元素1", "元素2"],
                "interpretation": "深度解析...",
                "omen": "吉/凶/平",
                "action": "建议采取的行动..."
            }
        }`;
    } else {
        // Daily
        return `${baseInfo}
        意图：${profile.intent || "今日运势"}。
        
        **任务：八字与梅花易数**
        1. 八字排盘分析日主强弱。
        2. 梅花易数起卦。

        返回JSON结构：
        {
            "luckyColor": "...", "colorExplanation": "...", "luckyNumbers": [],
            "direction": "...", "directionSignificance": "...", "reminder": "...", "rating": 4,
            "hexagramCode": "...", "hexagramName": "...", "luckyTime": "...",
            "lunarDate": "...", "solarTerm": "...", "yi": "...", "ji": "...",
            "bazi": { "year": "...", "month": "...", "day": "...", "hour": "...", "dayMaster": "...", "dayMasterStrength": "..." },
            "fiveElements": { "metal": 20, "wood": 20, "water": 20, "fire": 20, "earth": 20 },
            "luckyStars": [],
            "scores": { "wealth": 80, "career": 80, "love": 80, "health": 80 },
            "advice": { "life": "...", "career": "...", "relationships": "..." },
            "currentHourAnalysis": { "shichen": "...", "baguaDirection": "...", "element": "...", "emotion": "...", "health": "...", "decision": "..." }
        }`;
    }
};

export const getDailyFortune = async (profile: UserProfile): Promise<FortuneData> => {
  const now = new Date();
  const currentDateTimeStr = now.toLocaleString('zh-CN', { hour12: false });
  
  const systemPrompt = getSystemPrompt(profile.type);
  const userPrompt = getUserPrompt(profile, currentDateTimeStr);

  try {
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: TEXT_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 2000,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content;
    
    if (!content) throw new Error("Empty response from oracle");

    try {
        const parsedData = extractJson(content);
        return parsedData as FortuneData;
    } catch (parseError) {
        console.error("JSON Parse Error. Content was:", content);
        throw new Error("Failed to parse oracle response");
    }

  } catch (error) {
    console.error("Error fetching fortune:", error);
    return getFallbackFortune(profile.type);
  }
};

export const generateFortuneImage = async (fortuneData: FortuneData): Promise<string> => {
    try {
        let promptTheme = `抽象表现"${fortuneData.hexagramName}"与"${fortuneData.reminder}"的意境`;
        if (fortuneData.dream) {
            promptTheme = `超现实主义梦境，${fortuneData.dream.title}，神秘，心理学隐喻`;
        } else if (fortuneData.ziwei) {
            promptTheme = `紫微斗数，星象，宇宙，命运之轮，${fortuneData.ziwei.lifePalace}`;
        }

        const imagePrompt = `中国水墨画风格，禅意，${promptTheme}，高质量，极简主义。主要色调：${fortuneData.luckyColor}与水墨黑。`;

        const response = await fetch(`${BASE_URL}/images/generations`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: IMAGE_MODEL,
                prompt: imagePrompt
            })
        });

        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        const data = await response.json();
        const generatedUrl = data.data?.[0]?.url;
        if (!generatedUrl) throw new Error("No URL returned");
        
        return generatedUrl;

    } catch (imgError) {
        console.warn("Image generation failed, using fallback.", imgError);
        return getRandomFallbackImage();
    }
};

// Fallback Data
const getFallbackFortune = (type: DivinationType): FortuneData => {
    // Generate dynamic date strings
    const now = new Date();
    const dateStr = now.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' });
    const fullDate = `农历${dateStr}`; 
    const terms = ["立春", "雨水", "惊蛰", "春分", "清明", "谷雨", "立夏", "小满", "芒种", "夏至", "小暑", "大暑", "立秋", "处暑", "白露", "秋分", "寒露", "霜降", "立冬", "小雪", "大雪", "冬至", "小寒", "大寒"];
    const termIndex = Math.floor((now.getMonth() * 2) + (now.getDate() > 15 ? 1 : 0));
    const term = terms[termIndex % 24];

    const base = {
        luckyColor: "🍂 玄黄",
        colorExplanation: "天地玄黄，宇宙洪荒，积蓄力量。",
        luckyNumbers: [1, 6, 8],
        direction: "正南",
        directionSignificance: "离火生财，光明普照。",
        reminder: "🍵 静坐常思己过，闲谈莫论人非，心如止水，万事皆安。",
        rating: 4,
        luckyImage: getRandomFallbackImage(),
        hexagramCode: "000000",
        hexagramName: "坤为地",
        luckyTime: "巳时",
        lunarDate: fullDate, // Better than "Unknown"
        solarTerm: term, // Approximate term
        yi: "静修, 读书",
        ji: "远行, 动土",
        luckyStars: ["福星"],
        scores: { wealth: 70, career: 75, love: 60, health: 85 }
    };

    if (type === 'ziwei') {
        return {
            ...base,
            hexagramName: "紫微星拱照",
            ziwei: {
                lifePalace: "紫微",
                bodyPalace: "天府",
                luckyStars: ["左辅", "文曲"],
                unluckyStars: ["地劫"],
                decade: "暂无数据，需精确时辰",
                analysis: "紫微星坐命，气宇轩昂，但也需注意人际关系的和谐。"
            }
        };
    } else if (type === 'dream') {
        return {
            ...base,
            hexagramName: "梦兆",
            dream: {
                title: "吉梦",
                elements: ["云雾", "登山"],
                interpretation: "梦见登山，主步步高升。",
                omen: "吉",
                action: "把握机会，勇往直前。"
            }
        };
    }

    return {
        ...base,
        bazi: { year: "甲辰", month: "未知", day: "未知", hour: "未知", dayMaster: "未知", dayMasterStrength: "平" },
        fiveElements: { metal: 20, wood: 20, "water": 20, fire: 20, earth: 20 },
        advice: { life: "宜静", career: "守成", relationships: "和睦" },
        currentHourAnalysis: { shichen: "未知", baguaDirection: "中", element: "土", emotion: "平", health: "安", decision: "缓" }
    };
};
