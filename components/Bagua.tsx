
import React, { useRef, useState } from 'react';
import { YinYang } from './YinYang';
import { BaguaTrigram } from '../types';

interface BaguaProps {
  isSpinning: boolean;
  onClick: () => void;
  theme?: 'dark' | 'light';
}

// 后天八卦 (Later Heaven Sequence)
const TRIGRAMS: BaguaTrigram[] = [
  { 
    name: '离', fullName: '后天 离卦', nature: '火', symbol: '☲', lines: [1, 0, 1], 
    mountains: ['丙', '午', '丁'], loShuNumber: 9, element: 'Fire', colorClass: 'text-red-500',
    meaning: 'Clinging, Radiance, Light',
    quote: '日月丽乎天，百谷草木丽乎土。',
    position: '' // Legacy fields ignored
  },
  { 
    name: '坤', fullName: '后天 坤卦', nature: '土', symbol: '☷', lines: [0, 0, 0], 
    mountains: ['未', '坤', '申'], loShuNumber: 2, element: 'Earth', colorClass: 'text-stone-400',
    meaning: 'Receptive, Yielding, Mother',
    quote: '地势坤，君子以厚德载物。',
    position: ''
  },
  { 
    name: '兑', fullName: '后天 兑卦', nature: '金', symbol: '☱', lines: [1, 1, 0], 
    mountains: ['庚', '酉', '辛'], loShuNumber: 7, element: 'Metal', colorClass: 'text-amber-500',
    meaning: 'Joyous, Lake, Satisfaction',
    quote: '丽泽兑，君子以朋友讲习。',
    position: ''
  },
  { 
    name: '乾', fullName: '后天 乾卦', nature: '金', symbol: '☰', lines: [1, 1, 1], 
    mountains: ['戌', '乾', '亥'], loShuNumber: 6, element: 'Metal', colorClass: 'text-amber-500',
    meaning: 'Creative, Heaven, Strength',
    quote: '天行健，君子以自强不息。',
    position: ''
  },
  { 
    name: '坎', fullName: '后天 坎卦', nature: '水', symbol: '☵', lines: [0, 1, 0], 
    mountains: ['壬', '子', '癸'], loShuNumber: 1, element: 'Water', colorClass: 'text-blue-500',
    meaning: 'Abysmal, Gorge, Depth',
    quote: '水流而不盈，行险而不失其信。',
    position: ''
  },
  { 
    name: '艮', fullName: '后天 艮卦', nature: '土', symbol: '☶', lines: [0, 0, 1], 
    mountains: ['丑', '艮', '寅'], loShuNumber: 8, element: 'Earth', colorClass: 'text-stone-400',
    meaning: 'Stillness, Mountain, Stability',
    quote: '艮其背，不获其身，行其庭，不见其人。',
    position: ''
  },
  { 
    name: '震', fullName: '后天 震卦', nature: '木', symbol: '☳', lines: [1, 0, 0], 
    mountains: ['甲', '卯', '乙'], loShuNumber: 3, element: 'Wood', colorClass: 'text-emerald-500',
    meaning: 'Arousing, Thunder, Growth',
    quote: '震惊百里，不丧匕鬯。',
    position: ''
  },
  { 
    name: '巽', fullName: '后天 巽卦', nature: '木', symbol: '☴', lines: [0, 1, 1], 
    mountains: ['辰', '巽', '巳'], loShuNumber: 4, element: 'Wood', colorClass: 'text-emerald-500',
    meaning: 'Gentle, Wind, Penetration',
    quote: '随风巽，君子以申命行事。',
    position: ''
  },
];

const TrigramLines: React.FC<{ lines: number[], colorClass: string }> = ({ lines, colorClass }) => {
  let bgColor = 'bg-stone-500';
  
  // Logic to map text color class to background color class for the lines
  if (colorClass.includes('text-stone-900')) bgColor = 'bg-stone-900'; // Ink/B&W mode for light theme
  else if (colorClass.includes('red')) bgColor = 'bg-red-600';
  else if (colorClass.includes('emerald')) bgColor = 'bg-emerald-600';
  else if (colorClass.includes('blue')) bgColor = 'bg-blue-600';
  else if (colorClass.includes('amber')) bgColor = 'bg-amber-600';

  return (
    <div className="flex flex-col-reverse gap-[2px] w-5 md:w-6 items-center justify-center opacity-90">
      {lines.map((val, i) => (
        <div key={i} className="w-full h-[2px] md:h-[3px] flex justify-between">
           {val === 1 ? (
             <div className={`w-full h-full ${bgColor} rounded-[1px]`}></div>
           ) : (
             <>
               <div className={`w-[45%] h-full ${bgColor} rounded-[1px]`}></div>
               <div className={`w-[45%] h-full ${bgColor} rounded-[1px]`}></div>
             </>
           )}
        </div>
      ))}
    </div>
  );
};

const BaguaBackgroundSVG: React.FC<{isDark: boolean}> = React.memo(({isDark}) => {
    const rRing4 = 48; // Ticks start
    const rRing3 = 42; // Names
    const rRing2 = 37; // Mountains
    const rRing1 = 31; // Symbols
    const rHole = 22;  // Center Hole
    
    // Theme Colors
    // Dark Mode: Amber/Stone
    // Light Mode (Ink): Black/Dark Grey
    const majorTickColor = isDark ? '#b45309' : '#000000'; 
    const minorTickColor = isDark ? '#57534e' : '#57534e'; 
    const ringColor = isDark ? '#78716c' : '#a8a29e'; 
    const holeBorderColor = isDark ? '#b45309' : '#7f1d1d'; // Amber vs Cinnabar Red (Dark Red)
    const compassColor = isDark ? '#d97706' : '#44403c'; 

    return (
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
            {/* Compass Rose Decoration (Background Layer) */}
            <g opacity={isDark ? 0.15 : 0.08}>
                {/* Main Cardinals (N,S,E,W) - Pointing Outwards */}
                <path d="M50,15 L53,44 L50,50 L47,44 Z" fill={compassColor} />
                <path d="M50,85 L53,56 L50,50 L47,56 Z" fill={compassColor} />
                <path d="M15,50 L44,47 L50,50 L44,53 Z" fill={compassColor} />
                <path d="M85,50 L56,47 L50,50 L56,53 Z" fill={compassColor} />
                
                {/* Diagonals (NE, SE, SW, NW) - Thinner Lines */}
                <path d="M75,25 L55,45 L50,50 L45,55 L25,75" stroke={compassColor} strokeWidth="0.5" fill="none" />
                <path d="M25,25 L45,45 L50,50 L55,55 L75,75" stroke={compassColor} strokeWidth="0.5" fill="none" />
                
                {/* Decorative Inner Circles */}
                <circle cx="50" cy="50" r="28" fill="none" stroke={compassColor} strokeWidth="0.3" strokeDasharray="1 3" />
                <circle cx="50" cy="50" r="14" fill="none" stroke={compassColor} strokeWidth="0.5" />
            </g>

            {/* Ticks */}
            <g>
                {Array.from({ length: 120 }).map((_, i) => {
                    const isMajor = i % 10 === 0;
                    const angle = (i * 3) * (Math.PI / 180);
                    const rInner = isMajor ? 48 : 49;
                    const rOuter = 50;
                    const x1 = 50 + rInner * Math.sin(angle);
                    const y1 = 50 - rInner * Math.cos(angle);
                    const x2 = 50 + rOuter * Math.sin(angle);
                    const y2 = 50 - rOuter * Math.cos(angle);
                    return (
                        <line 
                            key={i} x1={x1} y1={y1} x2={x2} y2={y2} 
                            strokeWidth={isMajor ? 0.4 : 0.2}
                            stroke={isMajor ? majorTickColor : minorTickColor}
                            opacity={isDark ? 1 : 0.8}
                        />
                    );
                })}
            </g>
            {/* Concentric Circles */}
            <circle cx="50" cy="50" r={rRing4} fill="none" stroke={ringColor} strokeWidth="0.2" />
            <circle cx="50" cy="50" r={rRing3} fill="none" stroke={ringColor} strokeWidth="0.2" />
            <circle cx="50" cy="50" r={rRing2} fill="none" stroke={ringColor} strokeWidth="0.2" />
            <circle cx="50" cy="50" r={rRing1} fill="none" stroke={ringColor} strokeWidth="0.2" />
            
            {/* Center Hole Accent */}
            <circle cx="50" cy="50" r={rHole} fill="none" stroke={holeBorderColor} strokeWidth={isDark ? 0.5 : 0.8} strokeOpacity={isDark ? 1 : 0.6} />
        </svg>
    );
});

export const Bagua: React.FC<BaguaProps> = ({ isSpinning, onClick, theme = 'dark' }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const isDark = theme === 'dark';

  // --- Theme Configuration ---
  
  // 1. Base Plate & Background
  // Dark: Dark Wood Texture | Light: Rice Paper (Off-white)
  const plateBg = isDark ? 'bg-[#1c1917]' : 'bg-[#f5f5f0]'; 
  const plateBorder = isDark ? 'border-[#451a03]' : 'border-stone-800'; // Dark Wood vs Ink Black
  const woodTextureOpacity = isDark ? 'opacity-10' : 'opacity-[0.03] grayscale'; // Faint texture on paper
  
  // 2. Text Colors
  // Light Mode: High contrast Ink Black for primary text
  const textPrimary = isDark ? 'text-stone-400' : 'text-stone-900 font-medium';
  const textSecondary = isDark ? 'text-stone-500' : 'text-stone-500';
  const textHighlight = isDark ? 'text-stone-200' : 'text-red-900 font-bold'; // Cinnabar Red highlight

  // 3. Ambient Glow / Ink Wash
  // Dark: Amber Energy | Light: Ink Spreading
  const ambientEffect = isDark 
    ? 'bg-amber-600/5 blur-3xl' 
    : 'bg-stone-900/5 blur-2xl'; // Subtle ink wash background

  // 4. Center Hole
  const centerHoleBg = isDark ? 'bg-[#1c1917]' : 'bg-[#e7e5e4]';
  const centerHoleBorder = isDark ? 'border-[#78350f]' : 'border-red-900/30'; // Cinnabar hint

  return (
    <div 
        ref={containerRef}
        className="relative w-[340px] h-[340px] sm:w-[380px] sm:h-[380px] md:w-[500px] md:h-[500px] flex items-center justify-center select-none font-serif group"
    >
      
      {/* Container for the Bagua Plate */}
      <div className="relative w-full h-full flex items-center justify-center">
          
          {/* 1. Ambient Background Layer */}
          <div className={`absolute inset-0 rounded-full ${ambientEffect} transition-all duration-1000 ${isSpinning ? 'scale-125 opacity-60' : 'scale-100 opacity-40 animate-breathe'}`}></div>
          
          {/* Light Mode: Extra Ink Stain Effect on Hover */}
          {!isDark && !isSpinning && (
              <div className="absolute inset-[-10%] bg-stone-900/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 transform scale-90 group-hover:scale-100"></div>
          )}
          
          {/* Dark Mode: Ping Effect */}
          {isSpinning && isDark && (
            <div className="absolute inset-0 rounded-full border border-amber-500/20 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
          )}

          {/* 2. Outer Decorative Ring - 
              Logic: When spinning, rotate CCW (Counter-Clockwise) significantly to contrast with inner disk.
          */}
          <div 
            className={`absolute inset-[-12px] rounded-full border border-dashed pointer-events-none flex items-center justify-center animate-assemble-base 
            ${isDark ? 'border-stone-700/40' : 'border-stone-800/20'}
            ${isSpinning ? 'animate-[spin-ccw_3s_linear_infinite]' : 'animate-spin-ccw-slow'} 
            transition-all duration-500 group-hover:scale-[1.02] group-hover:opacity-50`}
          >
              <div className={`absolute w-[101%] h-[101%] border-t border-b rounded-full ${isDark ? 'border-stone-600/20' : 'border-stone-900/10'}`}></div>
          </div>

          {/* 3. === The Lo Pan (Main Rotating Disk) === 
              Logic: When spinning, rotate CW (Clockwise) very fast.
          */}
          <div 
            className={`relative w-full h-full rounded-full shadow-[0_0_60px_rgba(0,0,0,0.5)] will-change-transform animate-assemble-base transition-transform duration-700 cubic-bezier(0.34, 1.56, 0.64, 1)
            ${isSpinning ? 'animate-spin-cw-fast' : 'animate-spin-idle group-hover:[animation-play-state:paused]'}`}
          >
            
            {/* BASE PLATE BACKGROUND */}
            <div className={`absolute inset-0 rounded-full ${plateBg} border-[4px] ${plateBorder} shadow-2xl overflow-hidden transition-colors duration-500`}>
                {/* Texture */}
                <div className={`absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] ${woodTextureOpacity}`}></div>
                
                {/* SVG Geometry */}
                <BaguaBackgroundSVG isDark={isDark} />
                
                {/* Light Mode: Subtle Paper Gradient overlay */}
                {!isDark && (
                    <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_40%,rgba(28,25,23,0.03)_100%)] pointer-events-none"></div>
                )}
            </div>

            {/* --- RINGS ANIMATION: Concentric Expansion on Hover --- 
                On hover, the rings translate Z or Scale to separate visually
            */}

            {/* --- RING 4: Names (Tangential Layout) --- */}
            <div className="absolute inset-0 rounded-full pointer-events-none animate-assemble-ring-4 transition-transform duration-500 ease-out group-hover:scale-[1.04]">
                {TRIGRAMS.map((trigram, i) => (
                    <div key={`r4-${i}`} className="absolute inset-0 flex justify-center" style={{ transform: `rotate(${i * 45}deg)` }}>
                        <div className="mt-[2%] h-[6%] flex items-center justify-center">
                            <span className={`block ${textPrimary} font-bold text-[10px] sm:text-[11px] md:text-sm tracking-[0.2em] whitespace-nowrap drop-shadow-sm`}>
                                {trigram.fullName}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- RING 3: 24 Mountains (Radial Layout) --- */}
            <div className="absolute inset-0 rounded-full pointer-events-none animate-assemble-ring-3 transition-transform duration-500 ease-out group-hover:scale-[1.02]">
                {TRIGRAMS.map((trigram, i) => (
                    trigram.mountains.map((char, j) => (
                        <div key={`r3-${i}-${j}`} className="absolute inset-0 flex justify-center" style={{ transform: `rotate(${i * 45 + (j - 1) * 15}deg)` }}>
                            <div className="mt-[8%] h-[5%] flex items-center justify-center">
                                <span className={`block transform rotate-180 text-[9px] md:text-xs ${j === 1 ? `font-bold ${textHighlight} scale-110` : `${textSecondary} font-medium`}`}>
                                  {char}
                                </span>
                            </div>
                        </div>
                    ))
                ))}
            </div>

            {/* --- RING 2: Trigram Symbols (Interactive) --- */}
            <div className="absolute inset-0 rounded-full pointer-events-none animate-assemble-ring-2 transition-transform duration-500 ease-out group-hover:scale-[0.98]">
                {TRIGRAMS.map((trigram, i) => {
                    const isHovered = hoveredIndex === i;
                    // B&W Override: If light mode, make symbol and name black/dark grey
                    const displayColorClass = isDark ? trigram.colorClass : 'text-stone-900';

                    return (
                        <div key={`r2-${i}`} className="absolute inset-0 flex justify-center" style={{ transform: `rotate(${i * 45}deg)` }}>
                            {/* Interactive Container */}
                            <div 
                                className="mt-[13%] h-[6%] w-16 flex flex-col items-center justify-center pointer-events-auto cursor-help"
                                onMouseEnter={() => setHoveredIndex(i)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                {/* Tooltip */}
                                <div className={`absolute bottom-full mb-6 w-56 pointer-events-none transition-all duration-300 z-50 ${isHovered && !isSpinning ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`} style={{ transform: `rotate(-${i * 45}deg)` }}>
                                    <div className={`${isDark ? 'bg-[#1c1917]/95 text-stone-200' : 'bg-[#fafaf9]/95 text-stone-800 border-stone-300'} border-y-2 border-amber-800 text-center rounded-sm p-4 shadow-2xl backdrop-blur-md relative overflow-hidden`}>
                                        {/* Light Mode Seal Mark */}
                                        {!isDark && <div className="absolute -top-4 -right-4 w-12 h-12 bg-red-800/10 rounded-full blur-md"></div>}

                                        <div className="flex justify-center items-center gap-2 mb-2 border-b border-stone-700/50 pb-2">
                                            <span className={`text-xl font-bold ${isDark ? 'text-amber-500' : 'text-red-800'}`}>{trigram.name}</span>
                                            <span className="text-xs opacity-50">·</span>
                                            <span className="text-sm tracking-widest opacity-80">{trigram.fullName}</span>
                                        </div>
                                        <div className="text-xs opacity-70 font-serif italic leading-relaxed">"{trigram.quote}"</div>
                                    </div>
                                </div>

                                {/* Symbol Content */}
                                <div className={`transform rotate-180 flex flex-col items-center gap-[1px] transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}>
                                    <span className={`font-serif font-bold text-[10px] md:text-sm leading-none ${displayColorClass} drop-shadow ${isHovered ? 'brightness-125' : ''}`}>
                                        {trigram.name}
                                    </span>
                                    <div className="scale-90 md:scale-100 mt-[1px]">
                                        <TrigramLines lines={trigram.lines} colorClass={displayColorClass} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* --- RING 1: Lo Shu Numbers --- */}
            <div className="absolute inset-0 rounded-full pointer-events-none animate-assemble-ring-1 transition-transform duration-500 ease-out group-hover:scale-[0.96]">
                {TRIGRAMS.map((trigram, i) => (
                    <div key={`r1-${i}`} className="absolute inset-0 flex justify-center" style={{ transform: `rotate(${i * 45}deg)` }}>
                        <div className="mt-[19%] h-[9%] flex items-center justify-center">
                            <span className={`block transform rotate-180 font-display font-bold text-[10px] md:text-sm ${isDark ? 'text-stone-500/80' : 'text-stone-400/80'}`}>
                                {trigram.loShuNumber}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- RING 0: Center Void --- */}
            <div className={`absolute inset-[44%] rounded-full ${centerHoleBg} border-[2px] ${centerHoleBorder} shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] transition-colors duration-500`}></div>

          </div>
          
          {/* Light Mode Overlay Gradient for depth without metallic sheen */}
          {!isDark && (
             <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.05)_100%)] pointer-events-none opacity-50"></div>
          )}

          {/* === CENTER BUTTON === */}
          <div className="absolute z-20 animate-assemble-core transition-transform duration-500 group-hover:scale-105" style={{ transform: 'translateZ(20px)' }}> 
              <button
                onClick={onClick}
                disabled={isSpinning}
                className="group/btn relative transform transition-all duration-300 active-press-vibrate outline-none cursor-pointer"
                aria-label="Start Divination"
              >
                {/* 1. Holographic Ring (Dark) / Ink Swirl (Light) */}
                <div className={`absolute -inset-6 rounded-full opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 pointer-events-none ${isSpinning ? 'opacity-0' : ''}`}>
                    <div className="w-full h-full rounded-full animate-[spin_4s_linear_infinite]" 
                         style={{ background: isDark 
                            ? 'conic-gradient(from 0deg, transparent 0%, rgba(245, 158, 11, 0.1) 20%, rgba(245, 158, 11, 0.4) 50%, rgba(245, 158, 11, 0.1) 80%, transparent 100%)' 
                            : 'conic-gradient(from 0deg, transparent 0%, rgba(28, 25, 23, 0.05) 20%, rgba(127, 29, 29, 0.1) 50%, rgba(28, 25, 23, 0.05) 80%, transparent 100%)'
                        }}>
                    </div>
                </div>

                {/* 2. YinYang - Logic: When spinning, rotate CCW (Counter-Clockwise) to create vortex center effect. */}
                <div className={`transition-transform origin-center ${isSpinning ? 'animate-[spin-ccw_1.5s_linear_infinite]' : 'animate-spin-idle-reverse'}`}>
                  <div className="transform scale-[0.35] sm:scale-[0.5] md:scale-100">
                    <YinYang />
                  </div>
                </div>

                {/* 3. Outer Rim Glow */}
                {!isSpinning && (
                  <div className={`absolute inset-0 rounded-full border-2 ${isDark ? 'border-amber-500/0 group-hover/btn:border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.2)]' : 'border-red-900/0 group-hover/btn:border-red-900/30 shadow-[0_0_30px_rgba(127,29,29,0.1)]'} transition-all duration-500 scale-[0.4] sm:scale-[0.6] md:scale-100 group-hover/btn:scale-[0.45] sm:group-hover/btn:scale-[0.65] md:group-hover/btn:scale-110 pointer-events-none`}></div>
                )}

                {/* 4. Text Label */}
                {!isSpinning && (
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-100 transition-all duration-500 z-50">
                    <div className="flex flex-col items-center gap-1 animate-float">
                        <div className={`w-px h-4 bg-gradient-to-b from-transparent ${isDark ? 'to-amber-500/80' : 'to-stone-800/80'}`}></div>
                        <span className={`relative px-4 py-1.5 rounded-sm text-[12px] tracking-[0.3em] backdrop-blur-md font-serif uppercase transition-all
                            ${isDark 
                                ? 'bg-black/90 text-amber-500 border border-amber-900/50 shadow-[0_0_20px_rgba(245,158,11,0.2)]' 
                                : 'bg-[#fafaf9] text-stone-900 border-2 border-stone-800 shadow-xl'
                            }
                        `}>
                            <span className="relative z-10">启卦</span>
                        </span>
                    </div>
                  </div>
                )}
              </button>
          </div>
      </div>
      
    </div>
  );
};
