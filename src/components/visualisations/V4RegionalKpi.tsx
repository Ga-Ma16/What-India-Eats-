import { useMemo } from "react";
import { getConditionalExpectation } from "../../data/analytics";
import { BarChart3, TrendingUp, Layers } from "lucide-react";

export function V4RegionalKpi() {
  const regionalData = useMemo(() => {
    return getConditionalExpectation("region", "cook_time")
      .filter((r) => r.group !== "Unknown")
      .sort((a, b) => b.expectation - a.expectation);
  }, []);

  const maxExpectation = Math.max(...regionalData.map((r) => r.expectation));
  const maxVariance = Math.max(...regionalData.map((r) => r.variance));

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 text-[#f7f7f5] overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#4d5757]/40 gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-tech text-[#cef79e]">
            <span>V4 · MOMENT STATISTICS</span>
            <span>·</span>
            <span>E[COOK TIME | REGION] & VARIANCE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-light text-[#ffffff]">
            Regional KPI — Expectation vs. Variance
          </h2>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-[#222f30] border border-[#4d5757]/60 text-xs font-mono-tech flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-[#cef79e]" />
          <span>CONDITIONAL FIRST & SECOND MOMENTS</span>
        </div>
      </div>

      {/* Main Bar Chart Comparison */}
      <div className="my-4 p-5 rounded-xl bg-[#222f30]/60 border border-[#4d5757]/40 space-y-6">
        <div className="flex justify-between items-center text-xs font-mono-tech">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#cef79e]">
              <span className="w-3 h-3 rounded-xs bg-[#cef79e]" />
              <span>Expectation E[X] (Mean Mins)</span>
            </span>
            <span className="flex items-center gap-1.5 text-[#f59e0b]">
              <span className="w-3 h-3 rounded-xs bg-[#f59e0b]" />
              <span>Variance Var(X) (Spread)</span>
            </span>
          </div>
          <span className="text-[#64748b]">N = 6 GEOGRAPHIC REGIONS</span>
        </div>

        {/* Grouped Bars */}
        <div className="space-y-4">
          {regionalData.map((r) => {
            const expPct = (r.expectation / (maxExpectation * 1.1)) * 100;
            const varPct = (r.variance / (maxVariance * 1.1)) * 100;

            return (
              <div key={r.group} className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono-tech">
                  <span className="text-[#ffffff] font-medium">{r.group} India</span>
                  <div className="flex gap-4 text-[#c9cbbe]">
                    <span>
                      E[X]: <strong className="text-[#cef79e]">{r.expectation}m</strong>
                    </span>
                    <span>
                      Var: <strong className="text-[#f59e0b]">{Math.round(r.variance)}</strong>
                    </span>
                    <span className="text-[#64748b]">({r.count} dishes)</span>
                  </div>
                </div>

                {/* Expectation bar */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono-tech text-[#cef79e] w-8">E[X]</span>
                  <div className="flex-1 h-3 bg-[#172021] rounded overflow-hidden">
                    <div
                      className="h-full bg-[#cef79e] rounded transition-all duration-500 shadow-[0_0_8px_rgba(206,247,158,0.4)]"
                      style={{ width: `${expPct}%` }}
                    />
                  </div>
                </div>

                {/* Variance bar */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono-tech text-[#f59e0b] w-8">VAR</span>
                  <div className="flex-1 h-2 bg-[#172021] rounded overflow-hidden">
                    <div
                      className="h-full bg-[#f59e0b] rounded transition-all duration-500"
                      style={{ width: `${varPct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* KPI Insight Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono-tech">
        <div className="p-3 rounded-lg bg-[#222f30] border border-[#4d5757]/40">
          <div className="text-[#64748b]">HIGHEST EXPECTATION E[X]</div>
          <div className="text-base text-[#ffffff] font-semibold mt-0.5">
            {regionalData[0]?.group} India ({regionalData[0]?.expectation}m)
          </div>
          <div className="text-[10px] text-[#cef79e]">Long simmering stews & gravies</div>
        </div>
        <div className="p-3 rounded-lg bg-[#222f30] border border-[#4d5757]/40">
          <div className="text-[#64748b]">HIGHEST VARIANCE (VOLATILITY)</div>
          <div className="text-base text-[#ffffff] font-semibold mt-0.5">
            {regionalData.slice().sort((a, b) => b.variance - a.variance)[0]?.group} India
          </div>
          <div className="text-[10px] text-[#f59e0b]">High disparity between fast snacks & slow sweets</div>
        </div>
        <div className="p-3 rounded-lg bg-[#222f30] border border-[#4d5757]/40">
          <div className="text-[#64748b]">LOWEST VARIANCE (CONSISTENCY)</div>
          <div className="text-base text-[#ffffff] font-semibold mt-0.5">
            {regionalData.slice().sort((a, b) => a.variance - b.variance)[0]?.group} India
          </div>
          <div className="text-[10px] text-[#38bdf8]">Uniform cooking durations</div>
        </div>
      </div>
    </div>
  );
}
