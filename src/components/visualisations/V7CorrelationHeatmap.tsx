import { useState, useMemo } from "react";
import { calculateCovarianceAndCorrelation } from "../../data/analytics";
import { Grid, HelpCircle } from "lucide-react";

export function V7CorrelationHeatmap() {
  const [mode, setMode] = useState<"correlation" | "covariance">("correlation");
  const stats = useMemo(() => calculateCovarianceAndCorrelation(), []);

  const variables = ["prep_time", "cook_time", "spice_intensity"];

  // Helper color map for Pearson correlation (-1 to +1)
  const getCorrColor = (val: number) => {
    if (val === 1) return "#3b82f6"; // perfect identity
    if (val > 0.2) return "#ef4444"; // positive
    if (val > 0) return "#f97316";
    if (val < -0.2) return "#3b82f6"; // negative
    return "#334155"; // near zero
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 text-[#f7f7f5] overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#4d5757]/40 gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-tech text-[#cef79e]">
            <span>V7 · MULTIVARIATE DEPENDENCE</span>
            <span>·</span>
            <span>COVARIANCE & PEARSON CORRELATION MATRIX</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-light text-[#ffffff]">
            Correlation Heatmap
          </h2>
        </div>

        {/* Toggle between Correlation and Covariance */}
        <div className="flex items-center gap-1 p-1 bg-[#222f30] rounded-lg border border-[#4d5757]/60 text-xs font-mono-tech">
          <button
            onClick={() => setMode("correlation")}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              mode === "correlation"
                ? "bg-[#cef79e] text-[#222f30] font-semibold"
                : "text-[#c9cbbe] hover:text-[#ffffff]"
            }`}
          >
            CORRELATION (r)
          </button>
          <button
            onClick={() => setMode("covariance")}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              mode === "covariance"
                ? "bg-[#cef79e] text-[#222f30] font-semibold"
                : "text-[#c9cbbe] hover:text-[#ffffff]"
            }`}
          >
            COVARIANCE (Cov)
          </button>
        </div>
      </div>

      {/* Heatmap Matrix Display */}
      <div className="my-4 p-5 rounded-xl bg-[#222f30]/60 border border-[#4d5757]/40 max-w-xl mx-auto w-full space-y-4">
        <div className="flex justify-between items-center text-xs font-mono-tech text-[#64748b]">
          <span>COMPLETE CASES: N = {stats.completeCount} DISHES</span>
          <span>SCALE: [-1.0 COOLWARM TO +1.0]</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr>
                <th className="p-3 text-left text-xs font-mono-tech text-[#64748b]">VARIABLE</th>
                {variables.map((v) => (
                  <th key={v} className="p-3 text-xs font-mono-tech text-[#cef79e]">
                    {v}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {variables.map((rowVar) => {
                const rowData = (mode === "correlation" ? stats.correlation : stats.covariance).find(
                  (r) => r.name === rowVar
                );
                return (
                  <tr key={rowVar}>
                    <td className="p-3 text-left text-xs font-mono-tech text-[#ffffff] font-medium border-t border-[#334155]">
                      {rowVar}
                    </td>
                    {variables.map((colVar) => {
                      const val = (rowData as Record<string, unknown>)?.[colVar] as number;
                      const isDiag = rowVar === colVar;
                      const bg = mode === "correlation" ? getCorrColor(val) : isDiag ? "#1e3a8a" : "#222f30";

                      return (
                        <td
                          key={colVar}
                          className="p-4 border border-[#334155] font-mono-tech text-sm transition-all hover:scale-105"
                          style={{
                            backgroundColor: `${bg}40`,
                            color: isDiag ? "#cef79e" : Math.abs(val) > 0.05 ? "#ffffff" : "#94a3b8"
                          }}
                        >
                          <div className="font-semibold">
                            {mode === "correlation" ? val.toFixed(4) : val.toFixed(1)}
                          </div>
                          <div className="text-[10px] text-[#64748b]">
                            {isDiag ? "Identity" : val > 0 ? "Positive" : "Inverse"}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mathematical Takeaways */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono-tech">
        <div className="p-3 rounded-lg bg-[#222f30] border border-[#4d5757]/40">
          <div className="text-[#cef79e]">PREP TIME vs COOK TIME (r ≈ -0.065)</div>
          <div className="text-[#94a3b8] mt-1 leading-relaxed">
            Near-zero orthogonal correlation: recipes requiring extensive fermentation or marination do not necessarily demand longer stove cook times.
          </div>
        </div>
        <div className="p-3 rounded-lg bg-[#222f30] border border-[#4d5757]/40">
          <div className="text-[#cef79e]">SPICE INTENSITY vs COOK TIME (r ≈ -0.053)</div>
          <div className="text-[#94a3b8] mt-1 leading-relaxed">
            Highly spiced dishes (garam masala, chilis, mustard) are fast to prepare and stir-fry, disproving the assumption that spice complexity requires lengthy simmering.
          </div>
        </div>
      </div>
    </div>
  );
}
