import { useMemo } from "react";
import { getV9SpiceDivergence, STATS } from "../../data/analytics";
import { Flame, ArrowUpDown } from "lucide-react";

export function V9SpiceDivergence() {
  const divergenceData = useMemo(() => getV9SpiceDivergence(), []);
  const nationalMean = STATS.spice_intensity.mean;

  // Maximum divergence for scale
  const maxAbsDiv = Math.max(...divergenceData.map((d) => Math.abs(d.divergence)), 0.6);

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 text-[#f7f7f5] overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#4d5757]/40 gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-tech text-[#cef79e]">
            <span>V9 · REGIONAL RESIDUAL DIVERGENCE</span>
            <span>·</span>
            <span>E[SPICE | REGION] - μ_NATIONAL</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-light text-[#ffffff]">
            Regional Spice Intensity Divergence
          </h2>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-[#222f30] border border-[#4d5757]/60 text-xs font-mono-tech flex items-center gap-2">
          <Flame className="w-3.5 h-3.5 text-[#cef79e]" />
          <span>NATIONAL MEAN: {nationalMean} KEYWORDS</span>
        </div>
      </div>

      {/* Diverging Bar Chart */}
      <div className="my-4 p-5 rounded-xl bg-[#222f30]/60 border border-[#4d5757]/40 space-y-4">
        <div className="flex justify-between items-center text-xs font-mono-tech text-[#64748b]">
          <span>← BELOW NATIONAL MEAN (MILDER)</span>
          <span className="text-[#cef79e]">CENTER: 0.00 (μ = {nationalMean})</span>
          <span>ABOVE NATIONAL MEAN (SPICIER) →</span>
        </div>

        <div className="space-y-4 pt-2">
          {divergenceData.map((item) => {
            const isPositive = item.divergence >= 0;
            const barWidthPct = (Math.abs(item.divergence) / maxAbsDiv) * 50;

            return (
              <div key={item.region} className="grid grid-cols-12 items-center gap-3 text-xs font-mono-tech">
                {/* Region Label */}
                <div className="col-span-3 text-right pr-2 text-[#ffffff] font-medium truncate">
                  {item.region}
                </div>

                {/* Diverging Bars Container */}
                <div className="col-span-7 h-7 bg-[#172021] rounded relative flex items-center border border-[#4d5757]/40">
                  {/* Center Zero Line */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-[1.5px] bg-[#94a3b8]/70 z-10" />

                  {/* Left / Negative Bar */}
                  {!isPositive && (
                    <div
                      className="absolute right-1/2 h-full bg-gradient-to-l from-sky-600 to-sky-400 rounded-l transition-all duration-500 flex items-center justify-start pl-2"
                      style={{ width: `${barWidthPct}%` }}
                    >
                      <span className="text-[10px] text-sky-100 font-bold">
                        {item.divergence.toFixed(2)}
                      </span>
                    </div>
                  )}

                  {/* Right / Positive Bar */}
                  {isPositive && (
                    <div
                      className="absolute left-1/2 h-full bg-gradient-to-r from-red-600 to-amber-500 rounded-r transition-all duration-500 flex items-center justify-end pr-2"
                      style={{ width: `${barWidthPct}%` }}
                    >
                      <span className="text-[10px] text-amber-100 font-bold">
                        +{item.divergence.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Absolute Mean Value */}
                <div className="col-span-2 text-left pl-2 text-[#cef79e]">
                  {item.spice_intensity.toFixed(2)} avg
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Analytical Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono-tech">
        <div className="p-3 rounded-lg bg-[#222f30] border border-[#4d5757]/40">
          <div className="text-[#64748b]">HIGHEST SPICE DIVERGENCE</div>
          <div className="text-base text-red-400 font-semibold mt-0.5">
            North India (+0.42 above mean)
          </div>
          <div className="text-[10px] text-[#c9cbbe]">Rich layering of garam masala, ginger, garlic & chilis</div>
        </div>
        <div className="p-3 rounded-lg bg-[#222f30] border border-[#4d5757]/40">
          <div className="text-[#64748b]">SUBTLEST SPICE REGION</div>
          <div className="text-base text-sky-400 font-semibold mt-0.5">
            East India (-0.38 below mean)
          </div>
          <div className="text-[10px] text-[#c9cbbe]">Driven by sweet confectioneries (sandesh, rasgulla)</div>
        </div>
        <div className="p-3 rounded-lg bg-[#222f30] border border-[#4d5757]/40">
          <div className="text-[#64748b]">CENTRAL TENDENCY</div>
          <div className="text-base text-[#cef79e] font-semibold mt-0.5">
            West & South India
          </div>
          <div className="text-[10px] text-[#c9cbbe]">Balance of mustard/curry leaves with subtle tartness</div>
        </div>
      </div>
    </div>
  );
}
