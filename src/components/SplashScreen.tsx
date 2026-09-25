import { useState, useEffect, useRef } from "react";
import { Sparkles, Play, FastForward } from "lucide-react";

interface SplashScreenProps {
  onComplete?: () => void;
  durationMs?: number; // 8.5 seconds = 8500 ms
}

export function SplashScreen({ onComplete, durationMs = 8500 }: SplashScreenProps) {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [dishCounter, setDishCounter] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / durationMs) * 100));
      setProgress(pct);
      setDishCounter(Math.min(255, Math.floor((elapsed / durationMs) * 255)));

      if (elapsed >= durationMs) {
        clearInterval(interval);
        handleExit();
      }
    }, 40);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        clearInterval(interval);
        handleExit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [durationMs]);

  const handleExit = () => {
    setFading(true);
    setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 800); // 800ms crossfade
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col justify-between bg-[#172021] text-[#f7f7f5] transition-opacity duration-800 ease-out select-none ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Background Video */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          ref={videoRef}
          src="/assets/what-does-india-eat.mp4"
          autoPlay
          muted
          playsInline
          loop
          onLoadedData={() => setVideoLoaded(true)}
          onError={() => setVideoError(true)}
          className={`w-full h-full object-cover transition-opacity duration-1000 ${
            videoLoaded && !videoError ? "opacity-40" : "opacity-0 hidden"
          }`}
        />

        {/* Ambient WebGL-style glowing bioluminescent background simulation */}
        <div className="absolute inset-0 bg-radial from-[#cef79e]/10 via-[#222f30]/80 to-[#172021] flex items-center justify-center pointer-events-none">
          {/* Animated orbital rings */}
          <div className="absolute w-[500px] h-[500px] rounded-full border border-[#cef79e]/15 animate-[spin_20s_linear_infinite]" />
          <div className="absolute w-[360px] h-[360px] rounded-full border border-[#4d5757]/30 border-dashed animate-[spin_12s_linear_infinite_reverse]" />
          <div className="absolute w-[220px] h-[220px] rounded-full border border-[#cef79e]/20" />
        </div>
      </div>

      {/* Top Bar Status */}
      <div className="relative z-10 p-6 sm:p-8 flex justify-between items-center text-xs font-mono-tech text-[#c9cbbe]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#cef79e] animate-ping" />
          <span className="text-[#cef79e]">SYSTEM INITIALIZATION · P1.PY RUNTIME</span>
        </div>
        <button
          onClick={handleExit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#4d5757] bg-[#222f30]/80 text-[#cef79e] hover:border-[#cef79e] transition-colors cursor-pointer"
        >
          <FastForward className="w-3.5 h-3.5" />
          <span>SKIP INTRO (ESC)</span>
        </button>
      </div>

      {/* Center Cinematic Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center space-y-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#222f30] border border-[#4d5757] text-xs font-mono-tech text-[#c9cbbe]">
          <Sparkles className="w-3 h-3 text-[#cef79e]" />
          <span>DATA SCIENCE OF CULINARY HERITAGE</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-light tracking-[-0.03em] text-[#ffffff] uppercase leading-none">
          What Does <span className="text-[#cef79e] italic font-serif">India</span> Eat?
        </h1>

        <p className="text-base sm:text-lg text-[#c9cbbe] font-light max-w-xl mx-auto">
          A Mathematical & Cultural Analysis across 255 Dishes, Bayesian Probability Models, and Continuous Random Distributions.
        </p>

        {/* Live Loading Metrics */}
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto pt-4 text-center">
          <div className="p-2.5 rounded-lg bg-[#222f30]/60 border border-[#4d5757]/40">
            <div className="text-xs font-mono-tech text-[#64748b]">DISHES LOADED</div>
            <div className="text-xl font-mono-tech text-[#cef79e]">{dishCounter} / 255</div>
          </div>
          <div className="p-2.5 rounded-lg bg-[#222f30]/60 border border-[#4d5757]/40">
            <div className="text-xs font-mono-tech text-[#64748b]">MODELS</div>
            <div className="text-xl font-mono-tech text-[#ffffff]">10 PLOTS</div>
          </div>
          <div className="p-2.5 rounded-lg bg-[#222f30]/60 border border-[#4d5757]/40">
            <div className="text-xs font-mono-tech text-[#64748b]">BAYES PRIORS</div>
            <div className="text-xl font-mono-tech text-[#cef79e]">CALCULATED</div>
          </div>
        </div>
      </div>

      {/* Bottom Progress Bar */}
      <div className="relative z-10 p-6 sm:p-8 space-y-2 max-w-2xl mx-auto w-full">
        <div className="flex justify-between items-center text-xs font-mono-tech text-[#64748b]">
          <span>CALIBRATING WEBGL SHADERS & VISUALISATIONS</span>
          <span className="text-[#cef79e]">{progress}%</span>
        </div>
        <div className="w-full h-1 bg-[#222f30] rounded-full overflow-hidden border border-[#4d5757]/50">
          <div
            className="h-full bg-gradient-to-r from-[#367c66] to-[#cef79e] transition-all duration-75 ease-out rounded-full shadow-[0_0_12px_#cef79e]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
