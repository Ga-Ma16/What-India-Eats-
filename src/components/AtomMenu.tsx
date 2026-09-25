import { useState, useEffect } from "react";
import { AtomOrbitMenu } from "./AtomOrbitMenu";
import { V1DietaryHeatmap } from "./visualisations/V1DietaryHeatmap";
import { V2TimeDensities } from "./visualisations/V2TimeDensities";
import { V3PolynomialPlayground } from "./visualisations/V3PolynomialPlayground";
import { V4RegionalKpi } from "./visualisations/V4RegionalKpi";
import { V5GrainFlowSankey } from "./visualisations/V5GrainFlowSankey";
import { V6FlavorRadar } from "./visualisations/V6FlavorRadar";
import { V7CorrelationHeatmap } from "./visualisations/V7CorrelationHeatmap";
import { V8TopIngredients } from "./visualisations/V8TopIngredients";
import { V9SpiceDivergence } from "./visualisations/V9SpiceDivergence";
import { V10OutlierTrivia } from "./visualisations/V10OutlierTrivia";
import {
  MapPin,
  Activity,
  Calculator,
  BarChart3,
  GitFork,
  Compass,
  Grid,
  CircleDot,
  Flame,
  Award,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export interface AtomNode {
  id: string;
  number: number;
  label: string;
  subtitle: string;
  icon: typeof MapPin;
}

export const ATOM_NODES: AtomNode[] = [
  { id: "v1", number: 1, label: "Dietary Heatmap", subtitle: "Bayes Prior P(Non-Veg | State)", icon: MapPin },
  { id: "v2", number: 2, label: "Time Densities", subtitle: "KDE Prep vs Cook PDFs", icon: Activity },
  { id: "v3", number: 3, label: "Polynomial Playground", subtitle: "Least Squares MSE Fitting", icon: Calculator },
  { id: "v4", number: 4, label: "Regional KPIs", subtitle: "E[Cook Time] & Variance", icon: BarChart3 },
  { id: "v5", number: 5, label: "Grain Flow", subtitle: "Sankey Markov Transitions", icon: GitFork },
  { id: "v6", number: 6, label: "Flavor Radar", subtitle: "Polar Profile Distribution", icon: Compass },
  { id: "v7", number: 7, label: "Correlation Matrix", subtitle: "Multivariate Covariance Heatmap", icon: Grid },
  { id: "v8", number: 8, label: "Top Ingredients", subtitle: "Bubble Frequency Packing", icon: CircleDot },
  { id: "v9", number: 9, label: "Spice Divergence", subtitle: "Regional Residual vs Mean", icon: Flame },
  { id: "v10", number: 10, label: "Outlier Trivia", subtitle: "Slowest Mains & Extreme Tails", icon: Award }
];

export function VisualisationsPage() {
  const [activeNodeId, setActiveNodeId] = useState<string>("v1");

  const activeIndex = ATOM_NODES.findIndex((n) => n.id === activeNodeId);
  const activeNode = ATOM_NODES[activeIndex] || ATOM_NODES[0];

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % ATOM_NODES.length;
    setActiveNodeId(ATOM_NODES[nextIdx].id);
  };

  const handlePrev = () => {
    const prevIdx = (activeIndex - 1 + ATOM_NODES.length) % ATOM_NODES.length;
    setActiveNodeId(ATOM_NODES[prevIdx].id);
  };

  // Keyboard navigation between V1 and V10
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex]);

  const renderActiveChart = () => {
    switch (activeNodeId) {
      case "v1": return <V1DietaryHeatmap />;
      case "v2": return <V2TimeDensities />;
      case "v3": return <V3PolynomialPlayground />;
      case "v4": return <V4RegionalKpi />;
      case "v5": return <V5GrainFlowSankey />;
      case "v6": return <V6FlavorRadar />;
      case "v7": return <V7CorrelationHeatmap />;
      case "v8": return <V8TopIngredients />;
      case "v9": return <V9SpiceDivergence />;
      case "v10": return <V10OutlierTrivia />;
      default: return <V1DietaryHeatmap />;
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-[#172021] text-[#f7f7f5] py-4 px-4 sm:px-6 relative overflow-hidden flex flex-col items-center justify-between">
      {/* Background Orbital Rings and Bioluminescent Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center z-0">
        <div className="w-[1200px] h-[1200px] rounded-full border border-[#4d5757]/15 border-dashed animate-[spin_160s_linear_infinite]" />
        <div className="w-[900px] h-[900px] rounded-full border border-[#cef79e]/10 animate-[spin_100s_linear_infinite_reverse]" />
        <div className="absolute inset-0 bg-radial from-[#cef79e]/5 via-transparent to-[#172021]" />
      </div>

      {/* Top Controller Header - Clean minimal status bar without clutter */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between pb-2 gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#cef79e] shadow-[0_0_8px_#cef79e]" />
          <span className="text-sm font-light tracking-tight text-[#ffffff]">
            Model V{activeNode.number}: {activeNode.label}
          </span>
        </div>

        {/* Quick Node Navigation Stepper */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            aria-label="Previous node"
            className="p-1.5 sm:p-2 rounded-lg border border-[#4d5757] bg-[#222f30] text-[#c9cbbe] hover:text-[#cef79e] hover:border-[#cef79e] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="px-3 py-1 sm:py-1.5 rounded-lg border border-[#4d5757]/60 bg-[#1e2a2c] text-xs font-mono-tech text-[#cef79e]">
            NODE V{activeNode.number} / V10
          </div>
          <button
            onClick={handleNext}
            aria-label="Next node"
            className="p-1.5 sm:p-2 rounded-lg border border-[#4d5757] bg-[#222f30] text-[#c9cbbe] hover:text-[#cef79e] hover:border-[#cef79e] transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Orbital Atom Geometry & Central Fixed Box with 70vmin Orbit rotating behind */}
      <div className="relative w-full max-w-5xl mx-auto flex-1 flex flex-col items-center justify-center my-auto">
        {/* Horizontal Quick-Selector Bar for Mobile / Compact viewports */}
        <div className="w-full flex lg:hidden items-center justify-start gap-2 overflow-x-auto pb-2 pt-1 mb-2 scrollbar-none shrink-0 z-30">
          {ATOM_NODES.map((node) => {
            const isActive = node.id === activeNodeId;
            const Icon = node.icon;
            return (
              <button
                key={node.id}
                onClick={() => setActiveNodeId(node.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono-tech transition-all cursor-pointer whitespace-nowrap border shrink-0 ${
                  isActive
                    ? "bg-[#cef79e] text-[#172021] border-[#cef79e] font-semibold shadow-[0_0_15px_rgba(206,247,158,0.4)] scale-105"
                    : "bg-[#222f30]/80 text-[#c9cbbe] border-[#4d5757]/50 hover:border-[#cef79e] hover:text-[#ffffff]"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#172021]" : "text-[#cef79e]"}`} />
                <span>V{node.number} · {node.label}</span>
              </button>
            );
          })}
        </div>

        {/* Atom Orbit Component: 10 Nodes Positioned with CSS Trigonometry R=70vmin behind z-20 central box */}
        <AtomOrbitMenu
          activeNodeId={activeNodeId}
          onSelectNode={(id) => setActiveNodeId(id)}
        >
          {renderActiveChart()}
        </AtomOrbitMenu>
      </div>

      {/* Bottom Keyboard Hint */}
      <div className="relative z-10 w-full max-w-5xl mx-auto pt-3 flex justify-between items-center text-[11px] font-mono-tech text-[#64748b] shrink-0">
        <span>USE ← / → ARROW KEYS TO CYCLE ATOM NODES</span>
        <span className="text-[#cef79e]">DATASET: 255 DISHES · INDIAN_FOOD.CSV</span>
      </div>
    </div>
  );
}
