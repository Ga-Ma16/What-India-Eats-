import { useState, useMemo } from "react";
import { getPolynomialModels } from "../../data/analytics";
import { Calculator, CheckCircle2 } from "lucide-react";

export function V3PolynomialPlayground() {
  const { rawPoints, models } = useMemo(() => getPolynomialModels(), []);
  const [activeDegrees, setActiveDegrees] = useState<number[]>([2, 3]);
  const [hoveredDish, setHoveredDish] = useState<{ x: number; y: number; name: string; diet: string } | null>(null);

  const degreeColors: Record<number, { stroke: string; dash?: string; name: string }> = {
    1: { stroke: "#38bdf8", dash: "4 4", name: "Linear (Deg 1)" },
    2: { stroke: "#60a5fa", dash: "6 4", name: "Quadratic (Deg 2)" },
    3: { stroke: "#d946ef", name: "Cubic (Deg 3)" },
    4: { stroke: "#cef79e", dash: "2 2", name: "Quartic (Deg 4)" },
    5: { stroke: "#f59e0b", name: "Quintic (Deg 5)" }
  };

  const toggleDegree = (deg: number) => {
    setActiveDegrees((prev) =>
      prev.includes(deg) ? (prev.length > 1 ? prev.filter((d) => d !== deg) : prev) : [...prev, deg]
    );
  };

  const width = 760;
  const height = 300;
  const padding = { top: 20, right: 30, bottom: 40, left: 55 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const maxVal = 150; // clipped to 150 as in P1.py: plt.xlim(0, 150); plt.ylim(0, 150)
  const scaleX = (x: number) => padding.left + (Math.min(maxVal, Math.max(0, x)) / maxVal) * chartW;
  const scaleY = (y: number) => padding.top + chartH - (Math.min(maxVal, Math.max(0, y)) / maxVal) * chartH;

  // Generate fitted curve paths
  const curvePaths = useMemo(() => {
    const xSteps: number[] = [];
    for (let i = 0; i <= maxVal; i += 2) {
      xSteps.push(i);
    }

    return models.map((m) => {
      const pts = xSteps.map((xVal) => {
        const yVal = Math.max(0, Math.min(maxVal, m.predict(xVal)));
        return `${scaleX(xVal).toFixed(1)},${scaleY(yVal).toFixed(1)}`;
      });
      return {
        degree: m.degree,
        mse: m.mse,
        path: `M ${pts.join(" L ")}`
      };
    });
  }, [models]);

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 text-[#f7f7f5] overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#4d5757]/40 gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-tech text-[#cef79e]">
            <span>V3 · REGRESSION & CURVE FITTING</span>
            <span>·</span>
            <span>LEAST SQUARES OPTIMIZATION</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-light text-[#ffffff]">
            Polynomial Playground (Cook vs Prep Time)
          </h2>
        </div>

        {/* Degree Toggles */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono-tech">
          <span className="text-[#64748b]">DEGREE:</span>
          {[1, 2, 3, 4, 5].map((deg) => {
            const active = activeDegrees.includes(deg);
            const col = degreeColors[deg];
            return (
              <button
                key={deg}
                onClick={() => toggleDegree(deg)}
                className={`px-2.5 py-1 rounded border transition-colors cursor-pointer flex items-center gap-1.5 ${
                  active
                    ? "border-[#cef79e] bg-[#222f30] text-[#cef79e]"
                    : "border-[#4d5757]/50 bg-transparent text-[#64748b] hover:text-[#f7f7f5]"
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: col.stroke }}
                />
                <span>Deg {deg}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SVG Scatter & Curves */}
      <div className="relative my-4 p-4 rounded-xl bg-[#222f30]/60 border border-[#4d5757]/40">
        <div className="flex justify-between items-center mb-2 text-xs font-mono-tech">
          <div className="flex items-center gap-3">
            <span className="text-[#64748b]">N = {rawPoints.length} DISHES SCATTERED</span>
            {activeDegrees.map((deg) => {
              const m = models.find((mod) => mod.degree === deg);
              return (
                <span key={deg} style={{ color: degreeColors[deg].stroke }}>
                  Deg {deg} MSE: {m?.mse}
                </span>
              );
            })}
          </div>
          {hoveredDish && (
            <div className="text-[#cef79e]">
              {hoveredDish.name} ({hoveredDish.diet}) · Prep: {hoveredDish.x}m · Cook: {hoveredDish.y}m
            </div>
          )}
        </div>

        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto max-h-[300px] overflow-visible"
        >
          {/* Grid lines */}
          {[0, 30, 60, 90, 120, 150].map((val) => (
            <g key={val}>
              <line
                x1={scaleX(val)}
                y1={padding.top}
                x2={scaleX(val)}
                y2={padding.top + chartH}
                stroke="#334155"
                strokeDasharray="3 3"
              />
              <text
                x={scaleX(val)}
                y={padding.top + chartH + 18}
                textAnchor="middle"
                fontSize="10"
                fill="#64748b"
                className="font-mono-tech"
              >
                {val}m
              </text>
              <line
                x1={padding.left}
                y1={scaleY(val)}
                x2={padding.left + chartW}
                y2={scaleY(val)}
                stroke="#334155"
                strokeDasharray="3 3"
              />
              <text
                x={padding.left - 8}
                y={scaleY(val) + 4}
                textAnchor="end"
                fontSize="10"
                fill="#64748b"
                className="font-mono-tech"
              >
                {val}m
              </text>
            </g>
          ))}

          {/* Scatter points */}
          {rawPoints.map((pt, idx) => {
            const isVeg = pt.diet === "vegetarian";
            return (
              <circle
                key={idx}
                cx={scaleX(pt.x)}
                cy={scaleY(pt.y)}
                r={hoveredDish?.name === pt.name ? 6 : 3.5}
                fill={isVeg ? "#22c55e" : "#ef4444"}
                opacity={hoveredDish?.name === pt.name ? 1 : 0.6}
                stroke={hoveredDish?.name === pt.name ? "#cef79e" : "#0f172a"}
                strokeWidth={1}
                className="cursor-pointer transition-all hover:scale-150"
                onMouseEnter={() => setHoveredDish(pt)}
                onMouseLeave={() => setHoveredDish(null)}
              />
            );
          })}

          {/* Active fitted curves */}
          {curvePaths
            .filter((c) => activeDegrees.includes(c.degree))
            .map((c) => {
              const col = degreeColors[c.degree];
              return (
                <path
                  key={c.degree}
                  d={c.path}
                  fill="none"
                  stroke={col.stroke}
                  strokeWidth="2.5"
                  strokeDasharray={col.dash}
                  className="transition-all"
                />
              );
            })}
        </svg>
      </div>

      {/* MSE Comparison Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs font-mono-tech">
        {models.map((m) => {
          const isBest = m.degree === 3;
          return (
            <div
              key={m.degree}
              className={`p-2.5 rounded-lg border transition-colors ${
                activeDegrees.includes(m.degree)
                  ? "bg-[#222f30] border-[#cef79e]"
                  : "bg-[#1b2526] border-[#4d5757]/40"
              }`}
            >
              <div className="flex justify-between items-center text-[#64748b]">
                <span>DEGREE {m.degree}</span>
                {isBest && <CheckCircle2 className="w-3.5 h-3.5 text-[#cef79e]" />}
              </div>
              <div className="text-base text-[#ffffff] font-semibold mt-0.5">
                MSE: {m.mse}
              </div>
              <div className="text-[10px] text-[#cef79e] truncate">
                {m.degree === 1 ? "Underfit" : m.degree === 3 ? "Optimal Fit" : m.degree >= 4 ? "Mild Overfit" : "Moderate"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
