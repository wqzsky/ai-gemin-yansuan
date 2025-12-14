
import React from 'react';
import { FortuneData, FiveElements } from '../types';
import { Compass, Palette, Hash, Quote, Share2, Clock, ScrollText, Calendar, CheckCircle, XCircle, X, Leaf, Briefcase, Heart, Brain, Activity, Zap, Star, Flame, Droplets, Mountain, Coins, Moon, Sparkles } from 'lucide-react';
import { HexagramVisualizer } from './HexagramVisualizer';

interface FortuneResultProps {
  data: FortuneData;
  onReset: () => void;
}

const ScoreBar: React.FC<{ label: string; score: number }> = ({ label, score }) => (
  <div className="flex flex-col gap-1">
    <div className="flex justify-between items-end">
        <span className="text-[10px] text-stone-500 uppercase tracking-widest">{label}</span>
        <span className="text-xs font-bold text-stone-700 font-display">{score}</span>
    </div>
    <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
        <div 
            className="h-full bg-gradient-to-r from-stone-400 to-amber-600 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${score}%` }}
        ></div>
    </div>
  </div>
);

const FiveElementsRadar: React.FC<{ elements: FiveElements }> = ({ elements }) => {
    const dataOrder = [
        { key: 'fire', label: '火', val: elements.fire, color: '#ef4444', icon: <Flame /> },   
        { key: 'earth', label: '土', val: elements.earth, color: '#b45309', icon: <Mountain /> }, 
        { key: 'metal', label: '金', val: elements.metal, color: '#eab308', icon: <Coins /> },    
        { key: 'water', label: '水', val: elements.water, color: '#3b82f6', icon: <Droplets /> }, 
        { key: 'wood', label: '木', val: elements.wood, color: '#10b981', icon: <Leaf /> },      
    ];

    const radius = 70; 
    const center = 100;
    
    const getPoint = (value: number, index: number) => {
        const angle = (index * 72 - 90) * (Math.PI / 180);
        const r = (value / 100) * radius;
        const x = center + r * Math.cos(angle);
        const y = center + r * Math.sin(angle);
        return `${x},${y}`;
    };

    const points = dataOrder.map((d, i) => getPoint(d.val, i)).join(' ');
    const gridLevels = [25, 50, 75, 100];

    return (
        <div className="flex flex-col items-center justify-center py-4">
            <div className="relative w-56 h-56">
                <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible drop-shadow-sm">
                    {gridLevels.map((level, idx) => (
                         <polygon 
                            key={level}
                            points={dataOrder.map((_, i) => getPoint(level, i)).join(' ')}
                            fill={idx === gridLevels.length - 1 ? "rgba(255,255,255,0.4)" : "none"}
                            stroke={level === 100 ? "#d6d3d1" : "#e7e5e4"}
                            strokeWidth={level === 100 ? "0.8" : "0.5"}
                            strokeDasharray={level === 100 ? "0" : "3 3"}
                         />
                    ))}
                    {dataOrder.map((_, i) => (
                        <line 
                            key={i}
                            x1={center} y1={center}
                            x2={getPoint(100, i).split(',')[0]}
                            y2={getPoint(100, i).split(',')[1]}
                            stroke="#e7e5e4"
                            strokeWidth="1"
                            strokeDasharray="2 2"
                        />
                    ))}
                    <polygon 
                        points={points}
                        fill="rgba(245, 158, 11, 0.25)"
                        stroke="#d97706"
                        strokeWidth="2"
                        strokeLinejoin="round"
                        className="transition-all duration-1000 ease-out drop-shadow-sm"
                    />
                    {dataOrder.map((d, i) => {
                        const [x, y] = getPoint(122, i).split(',').map(Number);
                        const [iconX, iconY] = getPoint(100, i).split(',').map(Number);
                        const [px, py] = getPoint(d.val, i).split(',').map(Number);
                        return (
                            <g key={i} className="group/point">
                                <circle cx={px} cy={py} r="3.5" fill={d.color} stroke="white" strokeWidth="2" className="transition-all duration-1000 ease-out drop-shadow-md" />
                                <foreignObject x={iconX - 10} y={iconY - 10} width="20" height="20" className="overflow-visible">
                                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-white shadow-sm transform transition-transform group-hover/point:scale-110 border border-white" style={{ backgroundColor: d.color }}>
                                        {React.cloneElement(d.icon as React.ReactElement<any>, { size: 10, strokeWidth: 3 })}
                                    </div>
                                </foreignObject>
                                <text x={x} y={y + 4} textAnchor="middle" fontSize="10" className="fill-stone-600 font-serif font-bold tracking-widest pointer-events-none">{d.val}%</text>
                            </g>
                        )
                    })}
                </svg>
            </div>
        </div>
    );
};

export const FortuneResult: React.FC<FortuneResultProps> = ({ data, onReset }) => {
  const isImageLoading = !data.luckyImage;
  
  // Safe access defaults
  const scores = data.scores || { wealth: 50, career: 50, love: 50, health: 50 };
  const luckyNumbers = data.luckyNumbers || [];
  const luckyStars = data.luckyStars || [];
  const ziweiStars = data.ziwei?.luckyStars || [];
  const displayStars = data.ziwei ? ziweiStars : luckyStars;

  // Reliable backup image if primary fails
  const BACKUP_IMAGE = "https://images.unsplash.com/photo-1516233758813-a38d024919c5?q=80&w=1600&auto=format&fit=crop";

  return (
    <div className="relative w-full max-w-md mt-4 mb-12 group perspective-1000">
      
      {/* Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-b from-amber-600/30 to-purple-900/30 rounded-[4px] blur-xl opacity-60"></div>
      
      {/* Paper Container */}
      <div className="relative bg-[#f5f5f4] text-stone-800 rounded-[4px] overflow-hidden shadow-2xl flex flex-col border-t-8 border-b-8 border-[#292524]">
         <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')] pointer-events-none"></div>

         {/* --- HERO IMAGE SECTION --- */}
         <div className="relative w-full aspect-video bg-stone-200 overflow-hidden border-b border-stone-300 group/hero">
            {data.luckyImage ? (
                <img 
                    src={data.luckyImage} 
                    alt="Fortune Visualization" 
                    onError={(e) => {
                        e.currentTarget.src = BACKUP_IMAGE;
                    }}
                    className="w-full h-full object-cover opacity-90 sepia-[0.3] contrast-[1.1] transition-transform duration-[20s] group-hover/hero:scale-110"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-stone-100">
                    <div className="flex flex-col items-center gap-2">
                        <div className="relative">
                            <ScrollText className="w-8 h-8 text-stone-300 animate-pulse" />
                            <div className="absolute inset-0 blur-lg bg-amber-500/20 animate-pulse"></div>
                        </div>
                        <span className="text-stone-400 text-xs tracking-widest font-serif animate-pulse">绘意中...</span>
                    </div>
                </div>
            )}
            
            <div className="absolute top-3 right-3 z-20">
                <button 
                    onClick={onReset}
                    className="bg-black/30 hover:bg-red-900/80 text-white/90 p-2 rounded-full backdrop-blur-md border border-white/20 transition-all duration-300 hover:rotate-90 shadow-lg active:scale-90"
                >
                    <X size={18} />
                </button>
            </div>

            <div className="absolute top-4 left-4 flex flex-col items-start gap-1 z-10">
                 <div className="bg-stone-900/80 text-amber-50 backdrop-blur-md px-2 py-1 rounded-sm border border-amber-500/30 shadow-lg">
                    <div className="flex items-center gap-1.5">
                        <Calendar size={10} className="text-amber-400"/>
                        <span className="text-[10px] tracking-widest font-serif">{data.lunarDate}</span>
                    </div>
                 </div>
                 <div className="bg-amber-800/90 text-white backdrop-blur-md px-2 py-0.5 rounded-sm shadow-lg transform rotate-2 ml-1">
                    <span className="text-[10px] tracking-[0.2em] font-serif">{data.solarTerm}</span>
                 </div>
            </div>
            
            {/* Conditional Overlay: Hexagram or Dream/Star Icon */}
            <div className="absolute bottom-4 left-4 bg-white/90 p-2 rounded-sm shadow-lg border border-stone-200 backdrop-blur-sm z-10">
                {data.dream ? (
                    <div className="w-12 h-16 flex flex-col items-center justify-center border border-stone-300 rounded-sm">
                        <Moon size={24} className="text-indigo-800" />
                        <span className="text-[10px] text-stone-500 mt-1 font-bold">梦占</span>
                    </div>
                ) : data.ziwei ? (
                    <div className="w-12 h-16 flex flex-col items-center justify-center border border-stone-300 rounded-sm">
                        <Star size={24} className="text-purple-800" />
                        <span className="text-[10px] text-stone-500 mt-1 font-bold">紫微</span>
                    </div>
                ) : (
                    <HexagramVisualizer code={data.hexagramCode || '000000'} color={data.luckyColor} loading={isImageLoading} />
                )}
            </div>
         </div>

         {/* --- CONTENT BODY --- */}
         <div className="p-6 md:p-8 relative">
            
            {/* Title / Name */}
            <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 tracking-[0.2em] mb-3">
                    {data.dream ? data.dream.title : data.hexagramName}
                </h2>
                <div className="flex items-center justify-center gap-3 opacity-60">
                     <div className="h-px w-8 bg-gradient-to-r from-transparent via-stone-400 to-transparent"></div>
                     <span className="text-[10px] text-stone-500 uppercase tracking-[0.3em]">
                        {data.dream ? 'Dream Interpretation' : (data.ziwei ? 'Zi Wei Astrology' : 'The Oracle Speaks')}
                     </span>
                     <div className="h-px w-8 bg-gradient-to-r from-transparent via-stone-400 to-transparent"></div>
                </div>
            </div>

            {/* Reminder Quote */}
            <div className={`relative bg-gradient-to-br p-6 mb-8 rounded-sm shadow-inner border border-stone-200/50 group/quote
                ${data.dream ? 'from-indigo-50 to-stone-100' : 'from-[#ebeae8] to-[#f0efed]'}`}>
                 <Quote className="absolute top-3 left-3 w-5 h-5 text-amber-800/20 rotate-180 transition-transform group-hover/quote:-translate-y-1" />
                 <p className="font-serif text-lg md:text-xl text-stone-800 leading-relaxed text-center italic relative z-10">
                    {data.dream ? data.dream.interpretation : data.reminder}
                 </p>
            </div>

            {/* --- DREAM SPECIFIC: Symbolism & Action --- */}
            {data.dream && (
                <div className="mb-8 space-y-4">
                     {/* Elements */}
                     <div className="flex flex-wrap gap-2 justify-center">
                        {(data.dream.elements || []).map((el, i) => (
                            <span key={i} className="bg-indigo-100 text-indigo-900 px-3 py-1 rounded-full text-xs font-bold border border-indigo-200">
                                {el}
                            </span>
                        ))}
                     </div>
                     {/* Action */}
                     <div className="bg-stone-100 p-4 border-l-4 border-indigo-500 rounded-sm">
                        <span className="text-xs font-bold text-stone-500 uppercase tracking-widest block mb-1">化解/指引 (Guidance)</span>
                        <p className="text-sm font-serif text-stone-800">{data.dream.action}</p>
                     </div>
                     {/* Omen Badge */}
                     <div className="text-center mt-2">
                        <span className={`inline-block px-4 py-1 rounded-sm text-sm font-bold tracking-[0.2em] border ${data.dream.omen === '吉' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : (data.dream.omen === '凶' ? 'bg-red-100 text-red-800 border-red-200' : 'bg-stone-200 text-stone-600')}`}>
                            {data.dream.omen === '吉' ? '大吉' : (data.dream.omen === '凶' ? '警示' : '平顺')}
                        </span>
                     </div>
                </div>
            )}

            {/* --- ZI WEI SPECIFIC: Palaces & Stars --- */}
            {data.ziwei && (
                <div className="mb-8">
                     <div className="flex items-center justify-center gap-2 mb-4 opacity-80">
                         <Star size={12} className="text-purple-600" />
                         <span className="text-xs font-bold text-stone-500 uppercase tracking-[0.2em]">紫微命盘 · Zi Wei Chart</span>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-purple-50 p-4 border border-purple-100 rounded-sm flex flex-col items-center">
                            <span className="text-[10px] text-purple-400 mb-1">命宫主星</span>
                            <span className="text-xl font-bold text-purple-900 font-serif">{data.ziwei.lifePalace || '未知'}</span>
                        </div>
                        <div className="bg-purple-50 p-4 border border-purple-100 rounded-sm flex flex-col items-center">
                            <span className="text-[10px] text-purple-400 mb-1">身宫主星</span>
                            <span className="text-xl font-bold text-purple-900 font-serif">{data.ziwei.bodyPalace || '未知'}</span>
                        </div>
                     </div>

                     <div className="bg-stone-50 p-4 border border-stone-200 rounded-sm">
                        <span className="text-xs font-bold text-stone-500 uppercase tracking-widest block mb-2">大限分析 (Decade)</span>
                        <p className="text-sm font-serif text-stone-800 mb-3">{data.ziwei.decade}</p>
                        <div className="h-px bg-stone-200 w-full mb-3"></div>
                        <span className="text-xs font-bold text-stone-500 uppercase tracking-widest block mb-2">盘面详批 (Analysis)</span>
                        <p className="text-sm font-serif text-stone-800 leading-relaxed">{data.ziwei.analysis}</p>
                     </div>
                </div>
            )}

            {/* --- BAZI (Only show for Daily or Ziwei if available and not Dream) --- */}
            {!data.dream && data.bazi && (
                <div className="mb-8">
                     <div className="flex items-center justify-center gap-2 mb-4 opacity-80">
                         <div className="w-1 h-1 rounded-full bg-stone-400"></div>
                         <span className="text-xs font-bold text-stone-500 uppercase tracking-[0.2em]">八字 · Destiny Chart</span>
                         <div className="w-1 h-1 rounded-full bg-stone-400"></div>
                     </div>
                     <div className="grid grid-cols-4 gap-0 bg-[#fffbf7] rounded-sm border border-stone-200 shadow-sm overflow-hidden divide-x divide-stone-200/60">
                         {/* Simplified Grid for brevity since we might have Ziwei above */}
                         <div className="flex flex-col items-center py-4 bg-stone-50/30"><span className="text-[10px] text-stone-400 mb-1">年</span><span className="text-lg font-serif font-bold text-stone-800 writing-vertical-lr">{data.bazi.year}</span></div>
                         <div className="flex flex-col items-center py-4 bg-stone-50/30"><span className="text-[10px] text-stone-400 mb-1">月</span><span className="text-lg font-serif font-bold text-stone-800 writing-vertical-lr">{data.bazi.month}</span></div>
                         <div className="flex flex-col items-center py-4 bg-amber-50/50"><span className="text-[10px] text-amber-600 mb-1">日</span><span className="text-lg font-serif font-bold text-amber-900 writing-vertical-lr">{data.bazi.day}</span></div>
                         <div className="flex flex-col items-center py-4 bg-stone-50/30"><span className="text-[10px] text-stone-400 mb-1">时</span><span className="text-lg font-serif font-bold text-stone-800 writing-vertical-lr">{data.bazi.hour}</span></div>
                     </div>
                </div>
            )}

            {/* --- Five Elements Radar (Standard Mode Only) --- */}
            {data.fiveElements && !data.dream && !data.ziwei && (
                <div className="mb-8">
                    <div className="bg-stone-100/50 p-4 rounded-sm border border-stone-200 relative overflow-hidden">
                        <FiveElementsRadar elements={data.fiveElements} />
                    </div>
                </div>
            )}

            {/* Common Advice (Life/Career/Relationships) - Applicable to all except maybe simple Dream */}
            {data.advice && (
                <div className="mb-8 space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="mt-1 p-1 bg-stone-200 rounded-full"><Leaf size={14} className="text-emerald-700"/></div>
                        <div><span className="text-xs font-bold text-stone-500 uppercase tracking-widest block mb-1">生活</span><p className="text-sm font-serif text-stone-800">{data.advice.life}</p></div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="mt-1 p-1 bg-stone-200 rounded-full"><Briefcase size={14} className="text-amber-700"/></div>
                        <div><span className="text-xs font-bold text-stone-500 uppercase tracking-widest block mb-1">事业</span><p className="text-sm font-serif text-stone-800">{data.advice.career}</p></div>
                    </div>
                    {/* Only show Love advice if not Dream (unless explicitly mapped, but keeping simple) */}
                    <div className="flex items-start gap-3">
                        <div className="mt-1 p-1 bg-stone-200 rounded-full"><Heart size={14} className="text-rose-700"/></div>
                        <div><span className="text-xs font-bold text-stone-500 uppercase tracking-widest block mb-1">人际</span><p className="text-sm font-serif text-stone-800">{data.advice.relationships}</p></div>
                    </div>
                </div>
            )}

            {/* Detailed Scores - Defensive access with defaults */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-8">
                <ScoreBar label="财运 (Wealth)" score={scores.wealth ?? 50} />
                <ScoreBar label="事业 (Career)" score={scores.career ?? 50} />
                <ScoreBar label="姻缘 (Love)" score={scores.love ?? 50} />
                <ScoreBar label="健康 (Health)" score={scores.health ?? 50} />
            </div>

            {/* Common Attributes Grid */}
            <div className="grid grid-cols-2 gap-6 font-serif border-t border-stone-300 pt-6">
                <div className="flex flex-col items-center border-r border-stone-200">
                    <div className="flex items-center gap-2 text-amber-700 mb-1">
                        <Palette size={14} />
                        <span className="text-xs font-bold tracking-widest uppercase">宜 · 色</span>
                    </div>
                    <div className="text-lg font-bold text-stone-900">{data.luckyColor}</div>
                    <div className="text-[10px] text-stone-500 mt-1 max-w-[80px] text-center leading-tight">{data.colorExplanation}</div>
                </div>

                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2 text-amber-700 mb-1">
                        <Compass size={14} />
                        <span className="text-xs font-bold tracking-widest uppercase">利 · 方</span>
                    </div>
                    <div className="text-lg font-bold text-stone-900">{data.direction}</div>
                    <div className="text-[10px] text-stone-500 mt-1 max-w-[80px] text-center leading-tight">{data.directionSignificance}</div>
                </div>
                
                <div className="flex flex-col items-center border-r border-stone-200 border-t pt-4">
                     <div className="flex items-center gap-2 text-amber-700 mb-1">
                        <Hash size={14} />
                        <span className="text-xs font-bold tracking-widest uppercase">灵 · 数</span>
                    </div>
                    <div className="flex gap-2">
                        {luckyNumbers.map((num, i) => (
                            <span key={i} className="font-display text-stone-800 font-bold border-b border-stone-300 px-1">{num}</span>
                        ))}
                    </div>
                </div>
                
                {/* Lucky Stars (or Dream Elements hint) */}
                <div className="flex flex-col items-center border-t border-stone-200 pt-4">
                     <div className="flex items-center gap-2 text-amber-700 mb-1">
                        <Sparkles size={14} />
                        <span className="text-xs font-bold tracking-widest uppercase">吉 · 星</span>
                    </div>
                    <div className="flex gap-1 flex-wrap justify-center max-w-[100px]">
                        {displayStars.slice(0, 3).map((star, i) => (
                             <span key={i} className="text-xs text-stone-700 border-b border-stone-300">{star}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Reset Button */}
            <div className="mt-8 pt-6 border-t border-stone-300/50">
                <button 
                    onClick={onReset}
                    className="w-full group flex items-center justify-center gap-2 px-6 py-3 bg-stone-800 text-[#f5f5f4] hover:bg-stone-700 transition-all duration-300 shadow-lg text-xs tracking-[0.3em] uppercase rounded-sm"
                >
                    <Share2 className="w-3 h-3 group-hover:rotate-12 transition-transform" />
                    <span>诚心重求</span>
                </button>
            </div>

         </div>
      </div>
    </div>
  );
};
