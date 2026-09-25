import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Database,
  Orbit,
  Home,
  ChevronRight,
  Compass,
  MapPin,
  Activity,
  Calculator,
  BarChart3,
  GitFork,
  Grid,
  CircleDot,
  Flame,
  Award
} from "lucide-react";

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

const ATOM_MODELS = [
  { id: "v1", number: 1, label: "Dietary Heatmap", icon: MapPin },
  { id: "v2", number: 2, label: "Time Densities", icon: Activity },
  { id: "v3", number: 3, label: "Polynomial Playground", icon: Calculator },
  { id: "v4", number: 4, label: "Regional KPIs", icon: BarChart3 },
  { id: "v5", number: 5, label: "Grain Flow", icon: GitFork },
  { id: "v6", number: 6, label: "Flavor Radar", icon: Compass },
  { id: "v7", number: 7, label: "Correlation Matrix", icon: Grid },
  { id: "v8", number: 8, label: "Top Ingredients", icon: CircleDot },
  { id: "v9", number: 9, label: "Spice Divergence", icon: Flame },
  { id: "v10", number: 10, label: "Outlier Trivia", icon: Award }
];

export function Navbar({ currentPath, onNavigate }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleNav = (path: string) => {
    onNavigate(path);
    setIsOpen(false);
  };

  const navLinks = [
    {
      label: "Overview",
      path: "/",
      icon: Home,
      description: "Mathematical & cultural analysis hero"
    },
    {
      label: "Visualisations (V1–V10)",
      path: "/visualisations",
      icon: Orbit,
      description: "Interactive 70vmin Atom orbital dashboard"
    },
    {
      label: "Dataset & Priors",
      path: "/dataset",
      icon: Database,
      description: "255 Indian dishes raw catalog and feature priors"
    }
  ];

  return (
    <>
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 w-full border-b border-[#4d5757]/40 bg-[#172021]/80 backdrop-blur-md">
        <div className="max-w-[1360px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Brand Wordmark */}
          <button
            onClick={() => handleNav("/")}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#cef79e] group-hover:scale-125 transition-transform shadow-[0_0_8px_#cef79e]" />
              <span className="text-base sm:text-lg font-light tracking-tight text-[#ffffff] group-hover:text-[#cef79e] transition-colors">
                What Does India Eat?
              </span>
            </div>
          </button>

          {/* Fixed/Sticky Hamburger Menu Button on Top Right */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen(true)}
              aria-label="Open Navigation Sidebar"
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#4d5757]/80 bg-[#222f30] text-[#c9cbbe] hover:text-[#cef79e] hover:border-[#cef79e] hover:bg-[#283739] transition-all cursor-pointer shadow-md group"
            >
              <Menu className="w-5 h-5 text-[#cef79e] group-hover:scale-110 transition-transform" />
              <span className="text-xs font-mono-tech uppercase tracking-wider hidden sm:inline text-[#ffffff]">
                Menu
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out Sleek Vertical Navigation Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop overlay */}
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
            aria-hidden="true"
          />

          {/* Sidebar Drawer */}
          <aside className="relative z-10 w-full max-w-sm sm:max-w-md h-full bg-[#172021] border-l border-[#4d5757]/60 shadow-[0_0_50px_rgba(0,0,0,0.85)] flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-6 border-b border-[#4d5757]/40 flex items-center justify-between bg-[#192325]">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#cef79e] shadow-[0_0_8px_#cef79e]" />
                <div>
                  <h2 className="text-sm font-semibold text-[#ffffff] tracking-tight">
                    What Does India Eat?
                  </h2>
                  <p className="text-[10px] font-mono-tech text-[#cef79e]">
                    NAVIGATION SYSTEM
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close navigation"
                className="p-2 rounded-lg border border-[#4d5757] bg-[#222f30] text-[#c9cbbe] hover:text-[#cef79e] hover:border-[#cef79e] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Body */}
            <div className="p-6 space-y-6 flex-1">
              {/* Primary Pages */}
              <div className="space-y-2">
                <div className="text-[10px] font-mono-tech uppercase text-[#64748b] tracking-wider mb-2">
                  Main Pages
                </div>
                {navLinks.map((item) => {
                  const isActive = currentPath === item.path;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleNav(item.path)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left group cursor-pointer ${
                        isActive
                          ? "bg-[#222f30] border-[#cef79e] text-[#cef79e] shadow-[0_0_20px_rgba(206,247,158,0.15)]"
                          : "bg-[#1b2527]/70 border-[#4d5757]/40 text-[#f7f7f5] hover:border-[#cef79e]/60 hover:bg-[#222f30]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg border ${
                            isActive
                              ? "bg-[#cef79e]/15 border-[#cef79e] text-[#cef79e]"
                              : "bg-[#172021] border-[#4d5757]/60 text-[#c9cbbe] group-hover:text-[#cef79e]"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">{item.label}</div>
                          <div className="text-[11px] text-[#94a3b8] font-mono-tech mt-0.5">
                            {item.description}
                          </div>
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                          isActive ? "text-[#cef79e]" : "text-[#4d5757]"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Atom Menu Visualisations Direct Launcher */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono-tech uppercase text-[#64748b] tracking-wider">
                    Atom Models (V1–V10)
                  </span>
                  <span className="text-[10px] font-mono-tech text-[#cef79e]">
                    10 NODES
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {ATOM_MODELS.map((model) => {
                    const Icon = model.icon;
                    return (
                      <button
                        key={model.id}
                        onClick={() => handleNav("/visualisations")}
                        className="flex items-center gap-2 p-2 rounded-lg bg-[#1a2426] border border-[#4d5757]/40 text-left hover:border-[#cef79e] hover:bg-[#202d30] transition-colors group cursor-pointer"
                      >
                        <span className="text-[10px] font-mono-tech text-[#cef79e] font-bold">
                          V{model.number}
                        </span>
                        <span className="text-xs text-[#c9cbbe] group-hover:text-[#ffffff] truncate">
                          {model.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sidebar Footer */}
            <div className="p-6 border-t border-[#4d5757]/40 bg-[#162022] text-xs font-mono-tech text-[#64748b] space-y-1">
              <div className="flex items-center justify-between text-[#c9cbbe]">
                <span>255 DISHES</span>
                <span className="text-[#cef79e]">BAYESIAN EXPLORATION</span>
              </div>
              <p className="text-[10px] text-[#64748b]">
                Statistical & Cultural Dietary Analysis · Unit 1 & Unit 3
              </p>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
