import { useState, useMemo } from "react";
import { getV10OutlierTrivia } from "../../data/analytics";
import { Award, Clock, Flame, Utensils, AlertCircle } from "lucide-react";

export function V10OutlierTrivia() {
  const { slowestMains, longestPrep, highestSpice } = useMemo(() => getV10OutlierTrivia(), []);
  const [activeTab, setActiveTab] = useState<"slowest_mains" | "longest_prep" | "highest_spice">("slowest_mains");

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 text-[#f7f7f5] overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#4d5757]/40 gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-tech text-[#cef79e]">
            <span>V10 · STATISTICAL EXTREMES</span>
            <span>·</span>
            <span>OUTLIER TRIVIA BOARD</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-light text-[#ffffff]">
            Outlier Trivia — Slowest Mains & Time Extremes
          </h2>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 p-1 bg-[#222f30] rounded-lg border border-[#4d5757]/60 text-xs font-mono-tech">
          <button
            onClick={() => setActiveTab("slowest_mains")}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              activeTab === "slowest_mains"
                ? "bg-[#cef79e] text-[#222f30] font-semibold"
                : "text-[#c9cbbe] hover:text-[#ffffff]"
            }`}
          >
            SLOWEST MAINS
          </button>
          <button
            onClick={() => setActiveTab("longest_prep")}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              activeTab === "longest_prep"
                ? "bg-[#cef79e] text-[#222f30] font-semibold"
                : "text-[#c9cbbe] hover:text-[#ffffff]"
            }`}
          >
            LONGEST PREP
          </button>
          <button
            onClick={() => setActiveTab("highest_spice")}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              activeTab === "highest_spice"
                ? "bg-[#cef79e] text-[#222f30] font-semibold"
                : "text-[#c9cbbe] hover:text-[#ffffff]"
            }`}
          >
            SPICE KINGS
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="my-4 p-5 rounded-xl bg-[#222f30]/60 border border-[#4d5757]/40 space-y-4">
        {activeTab === "slowest_mains" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs font-mono-tech text-[#64748b]">
              <span>MAIN COURSES WITH THE LONGEST ACTIVE COOKING DURATIONS</span>
              <span className="text-[#ef4444]">RECORD: BIRYANI (120 MINS)</span>
            </div>

            <div className="space-y-3">
              {slowestMains.map((dish, i) => (
                <div
                  key={dish.name}
                  className="p-3.5 rounded-lg bg-[#1a2425] border border-[#4d5757]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#cef79e] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-red-950 border border-red-700/60 text-red-300 flex items-center justify-center text-xs font-mono-tech font-bold">
                      #{i + 1}
                    </span>
                    <div>
                      <div className="text-sm font-medium text-[#ffffff]">{dish.name}</div>
                      <div className="text-xs text-[#94a3b8]">
                        {dish.state || "India"} · {dish.region || "National"} · {dish.diet}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono-tech">
                    <div className="text-right">
                      <div className="text-base text-red-400 font-bold">{dish.cook_time} mins</div>
                      <div className="text-[10px] text-[#64748b]">Prep: {dish.prep_time}m</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "longest_prep" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs font-mono-tech text-[#64748b]">
              <span>DISHES REQUIRING OVERNIGHT FERMENTATION, SOAKING, OR AGING</span>
              <span className="text-[#38bdf8]">RECORD: PINDI CHANA (500 MINS)</span>
            </div>

            <div className="space-y-3">
              {longestPrep.map((dish, i) => (
                <div
                  key={dish.name}
                  className="p-3.5 rounded-lg bg-[#1a2425] border border-[#4d5757]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#cef79e] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-sky-950 border border-sky-700/60 text-sky-300 flex items-center justify-center text-xs font-mono-tech font-bold">
                      #{i + 1}
                    </span>
                    <div>
                      <div className="text-sm font-medium text-[#ffffff]">{dish.name}</div>
                      <div className="text-xs text-[#94a3b8]">
                        {dish.course} · {dish.flavor_profile}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono-tech">
                    <div className="text-right">
                      <div className="text-base text-sky-400 font-bold">{dish.prep_time} mins ({(Number(dish.prep_time) / 60).toFixed(1)} hrs)</div>
                      <div className="text-[10px] text-[#64748b]">Cook: {dish.cook_time}m</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "highest_spice" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs font-mono-tech text-[#64748b]">
              <span>DISHES WITH HIGHEST SPICE KEYWORD DENSITIES</span>
              <span className="text-[#cef79e]">MAX KEYWORDS: 4 CONCURRENT SPICES</span>
            </div>

            <div className="space-y-3">
              {highestSpice.map((dish, i) => (
                <div
                  key={dish.name}
                  className="p-3.5 rounded-lg bg-[#1a2425] border border-[#4d5757]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#cef79e] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-700/60 text-emerald-300 flex items-center justify-center text-xs font-mono-tech font-bold">
                      #{i + 1}
                    </span>
                    <div>
                      <div className="text-sm font-medium text-[#ffffff]">{dish.name}</div>
                      <div className="text-xs text-[#94a3b8] truncate max-w-sm">
                        {dish.ingredients}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono-tech">
                    <div className="text-right">
                      <div className="text-base text-[#cef79e] font-bold">{dish.spice_intensity} spices</div>
                      <div className="text-[10px] text-[#64748b]">{dish.state || "Regional"}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Extreme Trivia Stat Banner */}
      <div className="p-3 rounded-lg bg-[#182324] border border-[#cef79e]/40 flex items-center justify-between text-xs font-mono-tech text-[#c9cbbe]">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-[#cef79e] shrink-0" />
          <span>
            OUTLIER TRIVIA: <strong>Shrikhand</strong> holds the absolute longest cook time in the entire dataset at <strong>720 minutes (12 hours)</strong> of hanging yogurt separation and slow infusing!
          </span>
        </div>
      </div>
    </div>
  );
}
