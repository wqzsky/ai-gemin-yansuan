import React from 'react';

export const YinYang: React.FC = () => {
  return (
    <div className="relative w-32 h-32 rounded-full shadow-[0_0_60px_rgba(0,0,0,0.8)] flex items-center justify-center bg-black group/yinyang overflow-visible">
      
      {/* Dynamic Glow Behind */}
      <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-xl animate-pulse-glow group-hover/yinyang:bg-amber-400/40 transition-colors duration-500"></div>

      <svg viewBox="0 0 100 100" className="relative w-full h-full overflow-visible drop-shadow-2xl z-10">
        <defs>
          {/* 1. Texture Noise for Jade Effect */}
          <filter id="jadeTexture" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="1.5" numOctaves="3" result="noise" />
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.1 0" in="noise" result="coloredNoise" />
            <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="composite" />
            <feBlend mode="multiply" in="composite" in2="SourceGraphic" />
          </filter>

          {/* 2. Advanced 3D Lighting (Specular) */}
          <filter id="lighting3D">
             <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur"/> 
             <feSpecularLighting in="blur" surfaceScale="5" specularConstant="1" specularExponent="20" lightingColor="#ffffff" result="specularOut">
                <fePointLight x="-50" y="-50" z="100"/>
             </feSpecularLighting>
             <feComposite in="specularOut" in2="SourceAlpha" operator="in" result="specularComposite"/>
             <feComposite in="SourceGraphic" in2="specularComposite" operator="arithmetic" k1="0" k2="1" k3="1" k4="0"/>
          </filter>

          {/* 3. Deep Inner Shadow for carved feel */}
          <filter id="deepInset">
             <feOffset dx="0" dy="1"/>
             <feGaussianBlur stdDeviation="1" result="offset-blur"/>
             <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
             <feFlood floodColor="black" floodOpacity="1" result="color"/>
             <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
             <feComposite operator="over" in="shadow" in2="SourceGraphic"/> 
          </filter>

          {/* Gradients */}
          <radialGradient id="yangGrad" cx="30%" cy="30%" r="95%">
            <stop offset="0%" stopColor="#ffffff" /> 
            <stop offset="50%" stopColor="#e7e5e4" /> 
            <stop offset="100%" stopColor="#a8a29e" /> 
          </radialGradient>
          
          <radialGradient id="yinGrad" cx="30%" cy="30%" r="95%">
             <stop offset="0%" stopColor="#57534e" /> 
             <stop offset="60%" stopColor="#0c0a09" /> 
             <stop offset="100%" stopColor="#000000" /> 
          </radialGradient>
        </defs>

        {/* --- MAIN BODY with TEXTURE --- */}
        <g filter="url(#lighting3D)">
            {/* White Side (Yang) - Base */}
            <circle cx="50" cy="50" r="50" fill="url(#yangGrad)" />
            
            {/* Black Side (Yin) - Path */}
            <path d="M50,0 A50,50 0 0,1 50,100 A25,25 0 0,1 50,50 A25,25 0 0,0 50,0 Z" fill="url(#yinGrad)" />
            
            {/* Apply Jade Texture Overlay to whole shape */}
            <circle cx="50" cy="50" r="50" fill="transparent" filter="url(#jadeTexture)" opacity="0.5" />
        </g>

        {/* --- EYES (The Dots) with Deep Inset & Glow --- */}
        {/* Top Dot (Light in Dark) - Glowing Core */}
        <g filter="url(#deepInset)">
            <circle cx="50" cy="25" r="7" fill="#1c1917" />
            <circle cx="50" cy="25" r="3" fill="#ffffff" opacity="0.8" className="animate-pulse">
                <animate attributeName="opacity" values="0.4;0.9;0.4" dur="3s" repeatCount="indefinite" />
            </circle>
        </g>

        {/* Bottom Dot (Dark in Light) - Obsidian Core */}
        <g filter="url(#deepInset)">
             <circle cx="50" cy="75" r="7" fill="#e7e5e4" />
             <circle cx="50" cy="75" r="3" fill="#000000" opacity="0.9" />
        </g>

        {/* --- DYNAMIC REFLECTION LAYER --- */}
        {/* Simulates light reflecting off the rotating glossy surface */}
        <g className="animate-spin-cw-slow origin-center opacity-40 mix-blend-overlay pointer-events-none">
            <ellipse cx="30" cy="30" rx="20" ry="10" fill="white" filter="url(#blur)" />
            <ellipse cx="70" cy="70" rx="15" ry="5" fill="white" filter="url(#blur)" />
        </g>
        
        {/* Static Rim Highlight */}
        <circle cx="50" cy="50" r="49" fill="none" stroke="url(#yangGrad)" strokeWidth="0.5" opacity="0.5" />

      </svg>
      
      {/* Outer Energy Ring (HTML) */}
      <div className="absolute -inset-1 rounded-full border border-amber-500/20 blur-[1px] group-hover/yinyang:border-amber-400/50 transition-colors"></div>
    </div>
  );
};