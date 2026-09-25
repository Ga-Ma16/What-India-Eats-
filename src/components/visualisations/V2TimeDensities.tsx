import { useState, useMemo } from "react";
import { getV2KdeData, STATS } from "../../data/analytics";
import { Sliders, Activity } from "lucide-react";

export function V2TimeDensities() {
  const [bandwidth, setBandwidth] = useState<number>(8);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const kdePoints = useMemo(() => getV2KdeData(bandwidth), [bandwidth]);

  const maxDensity = useMemo(() => {
    let max = 0;
    for (const p of kdePoints) {
      if (p.prep_density > max) max = p.prep_density;
      if (p.cook_density > max) max = p.cook_density;
    }
    return max || 0.04;
  }, [kdePoints]);

  const width = 760;
  const height = 300;
  const padding = { top: 20, right: 30, bottom: 40, left: 55 };

  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const scaleX = (minute: number) => padding.left + (minute / 150) * chartW;
  const scaleY = (density: number) => padding.top + chartH - (density / maxDensity) * chartH;

  // Build SVG path strings
  const cookPath = useMemo(() => {
    const pts = kdePoints.map(
      (p) => `${scaleX(p.minute).toFixed(1)},${scaleY(p.cook_density).toFixed(1)}`
    );
    const line = `M ${pts.join(" L ")}`;
    const area = `${line} L ${scaleX(150)},${scaleY(0)} L ${scaleX(0)},${scaleY(0)} Z`;
    return { line, area };
  }, [kdePoints, maxDensity]);

  const prepPath = useMemo(() => {
    const pts = kdePoints.map(
      (p) => `${scaleX(p.minute).toFixed(1)},${scaleY(p.prep_density).toFixed(1)}`
    );
    const line = `M ${pts.join(" L ")}`;
    const area = `${line} L ${scaleX(150)},${scaleY(0)} L ${scaleX(0)},${scaleY(0)} Z`;
    return { line, area };
  }, [kdePoints, maxDensity]);

  const hoveredPoint = hoverIndex !== null ? kdePoints[hoverIndex] : null;

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 text-[#f7f7f5] overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#4d5757]/40 gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-tech text-[#cef79e]">
            <span>V2 · CONTINUOUS PROBABILITY DISTRIBUTIONS</span>
            <span>·</span>
            <span>KERNEL DENSITY ESTIMATION (KDE)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-light text-[#ffffff]">
            Prep Time vs. Cook Time Densities
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono-tech text-[#c9cbbe]">
            <Sliders className="w-3.5 h-3.5 text-[#cef79e]" />
            <span>BANDWIDTH (h):</span>
            <select
              value={bandwidth}
              onChange={(e) => setBandwidth(Number(e.target.value))}
              aria-label="KDE Bandwidth"
              className="bg-[#222f30] border border-[#4d5757] text-[#cef79e] rounded px-2 py-1 focus:outline-none"
            >
              <option value={4}>4 min (Sensitive)</option>
              <option value={8}>8 min (Standard)</option>
              <option value={14}>14 min (Smoothed)</option>
            </select>
          </div>
        </div>
      </div>

      {/* SVG Density Chart */}
      <div className="relative my-4 p-4 rounded-xl bg-[#222f30]/60 border border-[#4d5757]/40">
        <div className="flex justify-between items-center mb-2 text-xs font-mono-tech">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#ef4444]">
              <span className="w-3 h-3 rounded-full bg-red-500/50 border border-red-500" />
              <span>Cook Time Density (μ = {STATS.cook_time.mean}m)</span>
            </span>
            <span className="flex items-center gap-1.5 text-[#38bdf8]">
              <span className="w-3 h-3 rounded-full bg-sky-500/50 border border-sky-500" />
              <span>Prep Time Density (μ = {STATS.prep_time.mean}m)</span>
            </span>
          </div>
          {hoveredPoint && (
            <div className="text-[#cef79e]">
              t = {hoveredPoint.minute}m | Cook: {(hoveredPoint.cook_density * 100).toFixed(2)}% | Prep: {(hoveredPoint.prep_density * 100).toFixed(2)}%
            </div>
          )}
        </div>

        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto max-h-[300px] overflow-visible"
          onMouseLeave={() => setHoverIndex(null)}
        >
          {/* Grid lines */}
          {[0, 30, 60, 90, 120, 150].map((m) => (
            <g key={m}>
              <line
                x1={scaleX(m)}
                y1={padding.top}
                x2={scaleX(m)}
                y2={padding.top + chartH}
                stroke="#334155"
                strokeDasharray="3 3"
              />
              <text
                x={scaleX(m)}
                y={padding.top + chartH + 18}
                textAnchor="middle"
                fontSize="11"
                fill="#64748b"
                className="font-mono-tech"
              >
                {m}m
              </text>
            </g>
          ))}

          {/* Y Axis ticks */}
          {[0, 0.01, 0.02, 0.03].map((val) => (
            <g key={val}>
              <line
                x1={padding.left}
                y1={scaleY(val)}
                x2={padding.left + chartW}
                y2={scaleY(val)}
                stroke="#334155"
                strokeWidth="0.5"
              />
              <text
                x={padding.left - 8}
                y={scaleY(val) + 4}
                textAnchor="end"
                fontSize="10"
                fill="#64748b"
                className="font-mono-tech"
              >
                {val.toFixed(2)}
              </text>
            </g>
          ))}

          {/* Cook Time Density Area & Line */}
          <path d={cookPath.area} fill="rgba(239, 68, 68, 0.25)" />
          <path d={cookPath.line} fill="none" stroke="#ef4444" strokeWidth="2.5" />

          {/* Prep Time Density Area & Line */}
          <path d={prepPath.area} fill="rgba(56, 189, 248, 0.2)" />
          <path d={prepPath.line} fill="none" stroke="#38bdf8" strokeWidth="2.5" />

          {/* Interactive mouse overlay */}
          {kdePoints.map((pt, idx) => (
            <rect
              key={idx}
              x={scaleX(pt.minute) - (chartW / kdePoints.length) / 2}
              y={padding.top}
              width={chartW / kdePoints.length}
              height={chartH}
              fill="transparent"
              onMouseEnter={() => setHoverIndex(idx)}
              className="cursor-crosshair"
            />
          ))}

          {/* Hover indicator cursor */}
          {hoveredPoint && (
            <line
              x1={scaleX(hoveredPoint.minute)}
              y1={padding.top}
              x2={scaleX(hoveredPoint.minute)}
              y2={padding.top + chartH}
              stroke="#cef79e"
              strokeWidth="1.5"
            />
          )}
        </svg>
      </div>

      {/* Statistical Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono-tech">
        <div className="p-3 rounded-lg bg-[#222f30] border border-[#4d5757]/40">
          <div className="text-[#64748b]">COOK MEDIAN (Q2)</div>
          <div className="text-base text-[#ffffff] font-semibold">{STATS.cook_time.median} mins</div>
          <div className="text-[10px] text-[#ef4444]">IQR: {STATS.cook_time.p25}m - {STATS.cook_time.p75}m</div>
        </div>
        <div className="p-3 rounded-lg bg-[#222f30] border border-[#4d5757]/40">
          <div className="text-[#64748b]">PREP MEDIAN (Q2)</div>
          <div className="text-base text-[#ffffff] font-semibold">{STATS.prep_time.median} mins</div>
          <div className="text-[10px] text-[#38bdf8]">IQR: {STATS.prep_time.p25}m - {STATS.prep_time.p75}m</div>
        </div>
        <div className="p-3 rounded-lg bg-[#222f30] border border-[#4d5757]/40">
          <div className="text-[#64748b]">COOK SKEWNESS</div>
          <div className="text-base text-[#cef79e] font-semibold">+{STATS.cook_time.skewness}</div>
          <div className="text-[10px] text-[#64748b]">Heavy right-tail outliers</div>
        </div>
        <div className="p-3 rounded-lg bg-[#222f30] border border-[#4d5757]/40">
          <div className="text-[#64748b]">PREP SKEWNESS</div>
          <div className="text-base text-[#cef79e] font-semibold">+{STATS.prep_time.skewness}</div>
          <div className="text-[10px] text-[#64748b]">Concentrated &lt; 20 mins</div>
        </div>
      </div>
    </div>
  );
}
