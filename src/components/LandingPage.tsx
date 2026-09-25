import { MetalButton } from "./ui/metal-button";
import {
  Sparkles,
  ArrowRight,
  Database,
  Orbit,
  Activity,
  Layers
} from "lucide-react";
import { ATOM_NODES } from "./AtomMenu";

interface LandingPageProps {
  onNavigate: (path: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="w-full min-h-screen bg-[#172021] text-[#f7f7f5]">
      {/* 1. Hero Section - Banana Leaf Container Cultural Redesign */}
      <section className="relative overflow-hidden w-full min-h-[85vh] flex items-center justify-center bg-[#172021] py-16 sm:py-20 px-4 sm:px-6">
        {/* Subtle warm ambient background behind the floating leaf */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_40%,rgba(46,74,30,0.22),transparent_70%)]" />

        {/* Banana Leaf Container: Organic leaf shape, natural green gradient, deep drop shadow */}
        <div className="relative z-10 w-full max-w-4xl mx-auto overflow-hidden rounded-[70px_14px_70px_14px] sm:rounded-[150px_10px_150px_10px] lg:rounded-[170px_16px_170px_16px] bg-gradient-to-br from-[#2e4a1e] via-[#223d17] to-[#162b0e] p-8 sm:p-14 lg:p-16 border border-[#528236]/40 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85),0_0_45px_rgba(46,74,30,0.35)]">
          {/* Subtle banana leaf organic vein and natural texture overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_top_left,rgba(232,213,170,0.18),transparent_65%)]" />
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-15 stroke-[#E8D5AA]"
            viewBox="0 0 800 500"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {/* Organic banana leaf midrib line */}
            <path
              d="M 50 480 Q 400 250 750 20"
              strokeWidth="2.5"
              strokeDasharray="6 4"
            />
            {/* Lateral delicate leaf veins */}
            <path d="M 220 370 Q 180 290 140 250" strokeWidth="1" />
            <path d="M 340 295 Q 310 200 260 160" strokeWidth="1" />
            <path d="M 460 220 Q 440 120 400 80" strokeWidth="1" />
            <path d="M 580 145 Q 570 70 540 30" strokeWidth="1" />
            <path d="M 250 350 Q 300 420 360 450" strokeWidth="1" />
            <path d="M 370 275 Q 430 350 490 380" strokeWidth="1" />
            <path d="M 490 200 Q 560 270 630 300" strokeWidth="1" />
          </svg>

          <div className="relative z-10 flex flex-col items-center text-center space-y-6 sm:space-y-8">
            {/* Laboratory Pill Tag with Soft Gold styling */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#162b0e]/85 border border-[#E8D5AA]/50 text-xs font-mono-tech text-[#E8D5AA] shadow-sm backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#E8D5AA] animate-pulse" />
              <span className="tracking-widest uppercase">LABORATORY EXPLORATION · 255 DISHES</span>
            </div>

            {/* Heading with Traditional Indian Typography (Rozha One / Yatra One) */}
            <div className="space-y-3">
              <h1
                className="text-4xl sm:text-6xl lg:text-7xl font-normal tracking-wide text-[#FDFBF7] leading-[1.12] text-balance drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]"
                style={{ fontFamily: "'Rozha One', 'Yatra One', serif" }}
              >
                What Does India Eat?
              </h1>
              <p className="text-xl sm:text-2xl lg:text-3xl text-[#E8D5AA] font-light tracking-wide">
                A Mathematical & Cultural Analysis
              </p>
            </div>

            {/* Description in off-white (#FDFBF7) */}
            <p className="text-base sm:text-lg text-[#FDFBF7]/90 max-w-2xl mx-auto leading-relaxed font-light text-balance">
              A rigorous computational exploration of 255 traditional Indian dishes. Deconstructing culinary heritage through Bayesian probability, continuous random variables, polynomial regressions, and regional grain flows.
            </p>

            {/* Custom CTA Actions in Soft Gold & Off-White */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <MetalButton
                preset="gold"
                theme="dark"
                metalVariant="button"
                strength={0.85}
                variant="outline"
                className="gap-2 px-6 py-2.5 text-xs text-[#E8D5AA] font-semibold tracking-wider uppercase cursor-pointer bg-[#162b0e]/70 border-[#E8D5AA]/60 hover:bg-[#162b0e] hover:border-[#E8D5AA]"
                onClick={() => onNavigate("/visualisations")}
              >
                <Orbit className="w-3.5 h-3.5 text-[#E8D5AA]" />
                <span className="text-[#E8D5AA]">Visualisations (V1–V10)</span>
              </MetalButton>

              <MetalButton
                preset="silver"
                theme="dark"
                metalVariant="button"
                strength={0.75}
                variant="outline"
                className="gap-2 px-6 py-2.5 text-xs text-[#FDFBF7] tracking-wider uppercase cursor-pointer bg-[#162b0e]/70 border-[#FDFBF7]/40 hover:bg-[#162b0e] hover:border-[#FDFBF7]"
                onClick={() => onNavigate("/dataset")}
              >
                <Database className="w-3.5 h-3.5 text-[#FDFBF7]" />
                <span className="text-[#FDFBF7]">More About Dataset</span>
              </MetalButton>
            </div>

            {/* Tech Badges with soft gold (#E8D5AA) & off-white (#FDFBF7) */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-6 border-t border-[#E8D5AA]/30 text-xs font-mono-tech text-[#E8D5AA] w-full max-w-2xl">
              {[
                { name: "255 Dishes" },
                { name: "13 Engineered Features" },
                { name: "Bayesian Probability" },
                { name: "10 Plotly Models" }
              ].map((tech, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#162b0e]/75 border border-[#E8D5AA]/40 shadow-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E8D5AA]" />
                  <span className="text-[#FDFBF7]">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Three Empirical Mathematical Proof Banners */}
      <section className="border-y border-[#4d5757]/40 bg-[#1b2628]/60 py-12 px-6">
        <div className="max-w-[1360px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2 p-5 rounded-xl bg-[#222f30]/80 border border-[#4d5757]/40">
            <div className="flex items-center gap-2 text-xs font-mono-tech text-[#cef79e]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>BAYES' RULE ON DIETARY FLAVORS</span>
            </div>
            <div className="text-3xl font-light font-mono-tech text-[#ffffff]">
              98.7% <span className="text-xs text-[#94a3b8] font-sans">P(Veg | Sweet)</span>
            </div>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Empirical calculation from Unit 1: out of 56 sweet desserts in the catalog, 55 are strictly vegetarian, proving extreme cultural conditioning.
            </p>
          </div>

          <div className="space-y-2 p-5 rounded-xl bg-[#222f30]/80 border border-[#4d5757]/40">
            <div className="flex items-center gap-2 text-xs font-mono-tech text-[#38bdf8]">
              <Activity className="w-3.5 h-3.5" />
              <span>CONTINUOUS RANDOM VARIABLES</span>
            </div>
            <div className="text-3xl font-light font-mono-tech text-[#ffffff]">
              34.4m <span className="text-xs text-[#94a3b8] font-sans">E[Cook Time]</span>
            </div>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Gaussian Kernel Density Estimation reveals a heavily skewed log-normal profile with median 30m and extreme right outliers extending to 720m (Shrikhand).
            </p>
          </div>

          <div className="space-y-2 p-5 rounded-xl bg-[#222f30]/80 border border-[#4d5757]/40">
            <div className="flex items-center gap-2 text-xs font-mono-tech text-[#f59e0b]">
              <Layers className="w-3.5 h-3.5" />
              <span>CONDITIONAL STAPLE DEPENDENCE</span>
            </div>
            <div className="text-3xl font-light font-mono-tech text-[#ffffff]">
              0.088 <span className="text-xs text-[#94a3b8] font-sans">P(Rice ∩ South)</span>
            </div>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              P(Rice) × P(South) = 0.057 vs joint probability 0.088, validating statutory statistical dependence between geography and grain choice.
            </p>
          </div>
        </div>
      </section>

      {/* 3. The 10 Visualisations Gallery (Direct Launchpad into Atom Menu) */}
      <section className="py-20 px-6 max-w-[1360px] mx-auto space-y-10">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-mono-tech text-[#cef79e]">
            <Orbit className="w-3.5 h-3.5" />
            <span>THE 10 PLOTLY PROTOTYPES TRANSLATED TO REACT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-light text-[#ffffff] tracking-tight">
            Visualisation Suite: The Atom Menu
          </h2>
          <p className="text-sm text-[#94a3b8] max-w-xl mx-auto font-light">
            Each module mathematically reproduces the calculations and figures mapped in the Python analysis pipeline.
          </p>
          <button
            onClick={() => onNavigate("/visualisations")}
            className="inline-flex items-center gap-2 text-xs font-mono-tech text-[#cef79e] hover:underline cursor-pointer pt-2"
          >
            <span>LAUNCH FULLSCREEN ATOM DASHBOARD</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 10 Nodes Showcase Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {ATOM_NODES.map((node) => {
            const Icon = node.icon;
            return (
              <button
                key={node.id}
                onClick={() => onNavigate("/visualisations")}
                className="p-4 rounded-xl bg-[#222f30] border border-[#4d5757]/40 text-left hover:border-[#cef79e] transition-all group cursor-pointer space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono-tech text-[#cef79e] px-2 py-0.5 rounded bg-[#172021] border border-[#4d5757]/40">
                    V{node.number}
                  </span>
                  <Icon className="w-4 h-4 text-[#64748b] group-hover:text-[#cef79e] transition-colors" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-[#ffffff] group-hover:text-[#cef79e] transition-colors">
                    {node.label}
                  </h3>
                  <p className="text-xs text-[#94a3b8] font-mono-tech mt-1 line-clamp-2">
                    {node.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#4d5757]/40 bg-[#000000] py-8 px-6 text-xs font-mono-tech text-[#64748b]">
        <div className="max-w-[1360px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[#c9cbbe]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#cef79e]" />
            <span>WHAT DOES INDIA EAT? · STATISTICAL & MATHEMATICAL ANALYSIS</span>
          </div>
          <div>255 DISHES · UNIT 1 MATHEMATICS & UNIT 3 VISUALISATIONS (P1.PY)</div>
        </div>
      </footer>
    </div>
  );
}
