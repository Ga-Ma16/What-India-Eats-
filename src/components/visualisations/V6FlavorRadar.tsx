import { useMemo } from "react";
import { getCategoricalFrequencies, calculateBayesianProbabilities } from "../../data/analytics";
import { Compass, Sparkles } from "lucide-react";

export function V6FlavorRadar() {
  const flavorData = useMemo(() => getCategoricalFrequencies("flavor_profile"), []);
  const bayes = useMemo(() => calculateBayesianProbabilities(), []);

  // Compute Radar Chart geometry
  const size = 320;
  const center = size / 2;
  const radius = center - 45;
  const totalAxes = flavorData.length;

  const maxVal = Math.max(...flavorData.map((d) => d.percentage), 60);

  // Radial points
  const points = flavorData.map((d, i) => {
    const angle = (Math.PI * 2 * i) / totalAxes - Math.PI / 2;
    const r = (d.percentage / maxVal) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { ...d, x, y, angle };
  });

  const polygonPath = `M ${points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" L ")} Z`;

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 text-[#f7f7f5] overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#4d5757]/40 gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-tech text-[#cef79e]">
            <span>V6 · POLAR DISCRETE FREQUENCIES</span>
            <span>·</span>
            <span>RADAR GEOMETRY</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-light text-[#ffffff]">
            Flavor Profile Distribution (Radar)
          </h2>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-[#222f30] border border-[#4d5757]/60 text-xs font-mono-tech flex items-center gap-2">
          <Compass className="w-3.5 h-3.5 text-[#cef79e]" />
          <span>RADIAL POLAR COORDINATE SYSTEM</span>
        </div>
      </div>

      {/* Main Grid: Radar SVG + Stats */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-4 items-center">
        {/* Radar SVG */}
        <div className="md:col-span-7 flex justify-center items-center p-2 rounded-xl bg-[#222f30]/60 border border-[#4d5757]/40">
          <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[300px] h-auto overflow-visible">
            {/* Concentric grid rings */}
            {[0.25, 0.5, 0.75, 1.0].map((ring) => (
              <circle
                key={ring}
                cx={center}
                cy={center}
                r={radius * ring}
                fill="none"
                stroke="#334155"
                strokeDasharray="2 3"
              />
            ))}

            {/* Radial axes lines & labels */}
            {points.map((p, idx) => {
              const outerX = center + (radius + 22) * Math.cos(p.angle);
              const outerY = center + (radius + 22) * Math.sin(p.angle);

              return (
                <g key={idx}>
                  <line
                    x1={center}
                    y1={center}
                    x2={center + radius * Math.cos(p.angle)}
                    y2={center + radius * Math.sin(p.angle)}
                    stroke="#334155"
                    strokeWidth="1"
                  />
                  <text
                    x={outerX}
                    y={outerY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#f7f7f5"
                    fontSize="11"
                    className="font-mono-tech uppercase"
                  >
                    {p.name} ({p.percentage}%)
                  </text>
                </g>
              );
            })}

            {/* Radar Polygon Filled Web */}
            <path
              d={polygonPath}
              fill="rgba(206, 247, 158, 0.25)"
              stroke="#cef79e"
              strokeWidth="2.5"
              className="drop-shadow-[0_0_10px_rgba(206,247,158,0.3)]"
            />

            {/* Vertex points */}
            {points.map((p, idx) => (
              <circle
                key={idx}
                cx={p.x}
                cy={p.y}
                r="4.5"
                fill="#cef79e"
                stroke="#172021"
                strokeWidth="2"
              />
            ))}
          </svg>
        </div>

        {/* Breakdown details */}
        <div className="md:col-span-5 space-y-3">
          <div className="text-xs font-mono-tech text-[#64748b] uppercase">
            FLAVOR MARGINAL PROBABILITIES
          </div>
          <div className="space-y-2">
            {flavorData.map((f) => (
              <div
                key={f.name}
                className="p-2.5 rounded-lg bg-[#222f30] border border-[#4d5757]/40 flex justify-between items-center text-xs font-mono-tech"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      f.name === "spicy"
                        ? "bg-red-400"
                        : f.name === "sweet"
                        ? "bg-amber-300"
                        : f.name === "bitter"
                        ? "bg-emerald-400"
                        : "bg-sky-400"
                    }`}
                  />
                  <span className="capitalize text-[#ffffff] font-medium">{f.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#cef79e] font-semibold">{f.percentage}%</span>
                  <span className="text-[#64748b]">({f.count} dishes)</span>
                </div>
              </div>
            ))}
          </div>

          {/* Bayes conditional callout from P1.py */}
          <div className="p-3 rounded-lg bg-[#1a2527] border border-[#cef79e]/30 text-xs font-mono-tech space-y-1">
            <div className="flex items-center gap-1.5 text-[#cef79e]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>BAYES SWEET-VEG DERIVATION</span>
            </div>
            <div className="text-[#ffffff]">
              P(Vegetarian | Sweet) = <strong className="text-[#cef79e]">{bayes.pVegGivenSweet}%</strong>
            </div>
            <div className="text-[11px] text-[#64748b]">
              Over 98% of sweet dishes in the 255-dish dataset are purely vegetarian.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
