import React from 'react';

interface HexagramVisualizerProps {
  code: string; // e.g., "101101"
  color: string; // Used for potential styling
  loading?: boolean; // New prop for loading state
}

export const HexagramVisualizer: React.FC<HexagramVisualizerProps> = ({ code, loading = false }) => {
  // Pad to ensure 6 chars, split into array
  // Assuming code string is index 0 = bottom line, so we map directly if we render flex-col-reverse
  const binary = code.padEnd(6, '0').split(''); 

  return (
    <div className="relative flex items-center justify-center">
      
      {/* Loading Glow Effect - Breathing Circular Aura */}
      {loading && (
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 blur-md animate-pulse"></div>
            <div className="absolute w-20 h-20 rounded-full bg-amber-400/10 blur-xl animate-breathe"></div>
        </div>
      )}

      {/* Hexagram Lines Container */}
      <div className="relative z-10 flex flex-col-reverse gap-2 w-12 md:w-16 py-2 opacity-80 filter drop-shadow-sm">
        {binary.map((bit, i) => (
          <div key={i} className="w-full h-2 flex justify-between items-center group/line">
              {bit === '1' ? (
                  // Yang (Solid Stroke) - Ink Brush style
                  <div 
                      className="w-full h-full bg-stone-800 rounded-sm transition-transform duration-500 group-hover/line:scale-x-105" 
                      style={{ 
                          clipPath: "polygon(2% 10%, 98% 15%, 100% 80%, 0% 90%)", 
                          opacity: 0.9 
                      }}
                  ></div>
              ) : (
                  // Yin (Broken Stroke)
                  <>
                      <div 
                          className="w-[42%] h-full bg-stone-800 rounded-sm transition-transform duration-500 group-hover/line:scale-x-105" 
                          style={{ 
                              clipPath: "polygon(5% 10%, 95% 20%, 100% 80%, 0% 85%)", 
                              opacity: 0.9 
                          }}
                      ></div>
                      <div 
                          className="w-[42%] h-full bg-stone-800 rounded-sm transition-transform duration-500 group-hover/line:scale-x-105" 
                          style={{ 
                              clipPath: "polygon(0% 15%, 95% 10%, 100% 85%, 5% 80%)", 
                              opacity: 0.9 
                          }}
                      ></div>
                  </>
              )}
          </div>
        ))}
      </div>
    </div>
  );
};