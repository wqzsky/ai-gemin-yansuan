
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Bagua } from './components/Bagua';
import { FortuneResult } from './components/FortuneResult';
import { InputModal } from './components/InputModal';
import { FortuneData, UserProfile } from './types';
import { getDailyFortune, generateFortuneImage } from './services/geminiService';
import { Sun, Moon } from 'lucide-react';

// === Sound Service: Guqin Synthesizer ===
const playGuqinSound = () => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;
  const ctx = new AudioContext();

  const t = ctx.currentTime;
  
  // Create Oscillator Nodes (Fundamental + Harmonics)
  const osc = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  // Pentatonic Pitch (G3 approx 196Hz, or deeper C3 130.81Hz)
  const freq = 130.81; // C3 - Deep resonant
  osc.frequency.setValueAtTime(freq, t);
  osc2.frequency.setValueAtTime(freq * 2, t); // Octave

  // Waveform
  osc.type = 'triangle'; // Soft string
  osc2.type = 'sine'; // Pure overtone

  // Filter for wood resonance
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(800, t);
  filter.Q.value = 5;
  filter.frequency.exponentialRampToValueAtTime(300, t + 2);

  // Envelope (Pluck)
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.4, t + 0.05); // Attack
  gain.gain.exponentialRampToValueAtTime(0.001, t + 3.5); // Long Decay

  // Connections
  osc.connect(filter);
  osc2.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  // Play
  osc.start(t);
  osc2.start(t);
  osc.stop(t + 4);
  osc2.stop(t + 4);
};

const App: React.FC = () => {
  const [fortune, setFortune] = useState<FortuneData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBagua, setShowBagua] = useState(true);
  
  // Theme State (Dark default)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Particles state
  const [particles, setParticles] = useState<Array<{
    top: string, 
    left: string, 
    size: string, 
    duration: string,
    tx: string,
    ty: string,
    opacity: number
  }>>([]);

  // Parallax ref
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize particles
  useEffect(() => {
    // Particles
    const newParticles = [...Array(35)].map(() => {
      const tx = (Math.random() - 0.5) * 80;
      const ty = -(Math.random() * 100 + 80);
      return {
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: `${Math.random() * 3 + 1}px`,
        duration: `${Math.random() * 8 + 8}s`,
        tx: `${tx}px`,
        ty: `${ty}px`,
        opacity: Math.random() * 0.4 + 0.3
      };
    });
    setParticles(newParticles);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    playGuqinSound(); // Subtle feedback
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 30;
    const y = (clientY / innerHeight - 0.5) * 30;
    containerRef.current.style.setProperty('--mouse-x', `${x}px`);
    containerRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  const triggerHaptic = (pattern: number | number[]) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(pattern); } catch (e) {}
    }
  };

  // Step 1: Open Modal when Bagua center is clicked
  const handleBaguaClick = () => {
    if (loading) return;
    playGuqinSound(); // Sound Feedback
    triggerHaptic(10);
    setIsModalOpen(true);
  };

  // Step 2: Handle Form Submission from Modal
  const handleFormSubmit = useCallback(async (profile: UserProfile) => {
    setIsModalOpen(false); // Close modal
    triggerHaptic(20);
    setLoading(true);
    setError(null);
    playGuqinSound(); // Sound Feedback
    
    // Aggressively reduced artificial delay: 500ms minimum to allow animation to start but finish fast
    const minSpinTime = new Promise(resolve => setTimeout(resolve, 500));
    try {
      // Pass the profile object to the service
      const [data] = await Promise.all([
        getDailyFortune(profile),
        minSpinTime
      ]);
      
      triggerHaptic([50, 50, 50]);
      setFortune(data);
      
      // Reduce transition delay to 300ms for snappier UI switch
      setTimeout(() => {
        setShowBagua(false);
        setLoading(false);
        generateFortuneImage(data).then((imageUrl) => {
            if (imageUrl) {
                setFortune(prev => prev ? { ...prev, luckyImage: imageUrl } : null);
            }
        });
      }, 300); 
    } catch (err) {
      triggerHaptic([100, 50, 100]); 
      setError("网络波动，心诚则灵，请重试");
      setLoading(false);
    }
  }, []);

  const handleReset = () => {
    triggerHaptic(15);
    setFortune(null);
    setShowBagua(true);
  };

  // Theme Styles
  const isDark = theme === 'dark';
  const bgClass = isDark ? 'bg-[#0c0a09] text-stone-100' : 'bg-[#f5f5f4] text-stone-900';
  const fogColor = isDark ? 'from-[#292524] via-[#0c0a09] to-black' : 'from-stone-200 via-[#f5f5f4] to-white';
  const particleColor = isDark ? 'bg-amber-500' : 'bg-stone-800'; // Darker particles in light mode

  return (
    <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className={`h-[100dvh] w-full flex flex-col overflow-hidden relative font-sans transition-colors duration-1000 ${bgClass}`}
        style={{ '--mouse-x': '0px', '--mouse-y': '0px' } as React.CSSProperties}
    >
      
      {/* Background Layers */}
      <div className={`absolute inset-[-50px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] ${fogColor} opacity-80 pointer-events-none animate-fog transition-colors duration-1000`}></div>
      <div 
        className="absolute inset-[-50px] bg-[radial-gradient(circle_800px_at_50%_50%,_rgba(180,83,9,0.05),transparent_70%)] pointer-events-none transition-transform duration-[800ms] ease-out will-change-transform"
        style={{ transform: 'translate(var(--mouse-x), var(--mouse-y))' }}
      ></div>
      <div className={`absolute inset-0 opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')] pointer-events-none ${!isDark && 'invert'}`}></div>

      {/* Ember Particles */}
      {particles.map((p, i) => (
        <div 
            key={i} 
            className={`absolute rounded-full ${particleColor} animate-particle blur-[0.5px] mix-blend-screen`} 
            style={{
                top: p.top, 
                left: p.left, 
                width: p.size, 
                height: p.size, 
                animationDuration: p.duration, 
                animationDelay: `-${Math.random() * 15}s`,
                '--tx': p.tx,
                '--ty': p.ty,
                '--p-opacity': p.opacity,
                boxShadow: `0 0 ${parseInt(p.size) * 3}px rgba(245, 158, 11, 0.5)` // Soft glow
            } as React.CSSProperties} 
        />
      ))}

      {/* Input Modal - Fixed Overlay */}
      <InputModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSubmit={handleFormSubmit}
      />

      {/* Theme Toggle Button */}
      <div className="absolute top-6 right-6 z-50">
        <button 
          onClick={toggleTheme}
          className={`p-2 rounded-full border transition-all duration-300 ${isDark ? 'bg-stone-900 border-stone-700 text-amber-500 hover:text-amber-300' : 'bg-white border-stone-200 text-stone-600 hover:text-stone-900 shadow-md'}`}
          aria-label="Toggle Theme"
        >
          {isDark ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>

      {/* Error Message */}
      {error && (
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 px-6 py-2 bg-red-900/30 border border-red-800/50 rounded-full text-red-300 text-sm backdrop-blur-sm z-50 whitespace-nowrap">
                {error}
                <button onClick={() => setError(null)} className="ml-4 hover:text-white">✕</button>
            </div>
      )}

      {/* --- Header Section --- */}
      <header className={`relative z-10 pt-8 pb-2 flex-none text-center transition-all duration-700 transform ${fortune ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
          <h1 className={`text-4xl md:text-5xl font-bold text-transparent bg-clip-text font-serif tracking-[0.3em] drop-shadow-lg mb-2 ${isDark ? 'bg-gradient-to-b from-amber-100 to-amber-700' : 'bg-gradient-to-b from-stone-800 to-stone-500'}`}>
            乾坤演算
          </h1>
          <p className={`${isDark ? 'text-amber-500/40' : 'text-stone-500/60'} text-[10px] md:text-xs tracking-[0.5em] uppercase`}>Daily Divination</p>
      </header>

      {/* --- Main Content Area --- */}
      <main className="relative z-10 flex-1 w-full min-h-0">
         <div className="w-full h-full flex items-center justify-center pb-20">
            
            {/* Bagua Container - With Fade In on Mount */}
            {showBagua && (
             <div 
               className={`relative flex flex-col items-center justify-center transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform
               ${fortune 
                 ? 'opacity-0 scale-50 rotate-[60deg] blur-xl -translate-y-[200px] pointer-events-none' 
                 : 'opacity-100 scale-100 rotate-0 blur-0 translate-y-0'
               }`}
             >
                <div className="scale-[0.80] sm:scale-90 md:scale-100 transform-gpu animate-assemble-base">
                    <Bagua isSpinning={loading} onClick={handleBaguaClick} theme={theme} />
                </div>
                
                {loading && (
                  <div className={`absolute -bottom-20 w-full text-center transition-opacity duration-300 ${fortune ? 'opacity-0' : 'opacity-100'}`}>
                    <p className={`${isDark ? 'text-amber-500/80' : 'text-stone-600'} font-serif animate-pulse tracking-[0.3em] text-sm`}>
                        凝神静气 · 推演天机
                    </p>
                  </div>
                )}

                {!loading && !isModalOpen && !fortune && (
                    <div className="absolute -bottom-16 w-full text-center animate-float">
                        <p className={`font-serif text-xs tracking-[0.2em] transition-colors ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
                           点击罗盘 · 输入庚帖
                        </p>
                    </div>
                )}
             </div>
           )}

           {/* Fortune Result */}
           {fortune && !showBagua && (
             <div className="w-full h-full overflow-y-auto no-scrollbar flex justify-center items-start pt-2 px-4 pb-20">
                <div className="animate-in fade-in zoom-in duration-700 w-full flex justify-center">
                    <FortuneResult data={fortune} onReset={handleReset} />
                </div>
             </div>
           )}

         </div>
      </main>

      {/* --- Footer Section --- */}
      <footer className={`relative z-10 flex-none pb-6 text-center transition-opacity duration-500 ${fortune ? 'opacity-0' : 'opacity-100'}`}>
        <p className={`text-[10px] tracking-widest uppercase mix-blend-screen ${isDark ? 'text-stone-800' : 'text-stone-400'}`}>
            I Ching AI Oracle
        </p>
      </footer>

    </div>
  );
};

export default App;
