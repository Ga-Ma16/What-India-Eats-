import { useState, useMemo } from "react";
import { getV5SankeyData, calculateBayesianProbabilities } from "../../data/analytics";
import { GitFork, ArrowRight, Zap } from "lucide-react";

export function V5GrainFlowSankey() {
  const { nodes, links, rawCounts } = useMemo(() => getV5SankeyData(), []);
  const bayes = useMemo(() => calculateBayesianProbabilities(), []);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Grouped nodes: Col 0 (All Dishes), Col 1 (Regions), Col 2 (Grains)
  const allDishesNode = nodes[0];
  const regionNodes = nodes.filter((n) => n.id.startsWith("reg-"));
  const grainNodes = nodes.filter((n) => n.id.startsWith("grain-"));

  // Layout coordinates for SVG
  const width = 800;
  const height = 340;

  const col0X = 40;
  const col1X = 350;
  const col2X = 660;
  const nodeWidth = 24;

  // Compute node Y positions
  const col1Spacing = height / (regionNodes.length + 0.5);
  const col2Spacing = height / (grainNodes.length + 0.5);

  const nodePositions: Record<string, { x: number; y: number; height: number }> = {
    all: { x: col0X, y: 70, height: 180 }
  };

  regionNodes.forEach((node, i) => {
    nodePositions[node.id] = {
      x: col1X,
      y: 20 + i * (col1Spacing - 6),
      height: 38
    };
  });

  grainNodes.forEach((node, i) => {
    nodePositions[node.id] = {
      x: col2X,
      y: 45 + i * (col2Spacing + 10),
      height: 60
    };
  });

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 text-[#f7f7f5] overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#4d5757]/40 gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-tech text-[#cef79e]">
            <span>V5 · CONDITIONAL DEPENDENCE FLOW</span>
            <span>·</span>
            <span>SANKEY DIAGRAM</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-light text-[#ffffff]">
            Regional Grain Flow (Dishes → Regions → Grain)
          </h2>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-[#222f30] border border-[#4d5757]/60 text-xs font-mono-tech flex items-center gap-2">
          <GitFork className="w-3.5 h-3.5 text-[#cef79e]" />
          <span>MARKOV CATEGORICAL TRANSITION</span>
        </div>
      </div>

      {/* SVG Sankey Interactive Visual */}
      <div className="relative my-4 p-4 rounded-xl bg-[#222f30]/60 border border-[#4d5757]/40">
        <div className="flex justify-between items-center mb-2 text-xs font-mono-tech text-[#64748b]">
          <span>LEVEL 0: ORIGIN</span>
          <span>LEVEL 1: REGIONAL PARTITIONS</span>
          <span>LEVEL 2: GRAIN STAPLE (RICE / WHEAT)</span>
        </div>

        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto max-h-[320px] overflow-visible">
          {/* Ribbons / Links from All -> Regions */}
          {regionNodes.map((reg) => {
            const src = nodePositions["all"];
            const dst = nodePositions[reg.id];
            if (!src || !dst) return null;

            const isHighlighted = selectedNode === null || selectedNode === "all" || selectedNode === reg.id;
            const x1 = src.x + nodeWidth;
            const y1 = src.y + 15 + regionNodes.indexOf(reg) * 22;
            const x2 = dst.x;
            const y2 = dst.y + dst.height / 2;
            const midX = (x1 + x2) / 2;

            const path = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;

            return (
              <path
                key={`all-${reg.id}`}
                d={path}
                fill="none"
                stroke={isHighlighted ? "#cef79e" : "#334155"}
                strokeWidth={isHighlighted ? 4 : 1.5}
                strokeOpacity={isHighlighted ? 0.45 : 0.15}
                className="transition-all duration-300"
              />
            );
          })}

          {/* Ribbons / Links from Regions -> Grains */}
          {regionNodes.map((reg) => {
            const rawReg = reg.name.replace(" India", "");
            const grainCounts = rawCounts[rawReg] || {};
            const src = nodePositions[reg.id];
            if (!src) return null;

            return grainNodes.map((grn) => {
              const rawGrn = grn.name;
              const count = grainCounts[rawGrn] || 0;
              if (count === 0) return null;

              const dst = nodePositions[grn.id];
              if (!dst) return null;

              const isHighlighted =
                selectedNode === null || selectedNode === reg.id || selectedNode === grn.id;
              const x1 = src.x + nodeWidth;
              const y1 = src.y + dst.height / 3;
              const x2 = dst.x;
              const y2 = dst.y + (grainNodes.indexOf(grn) === 0 ? 15 : grainNodes.indexOf(grn) === 1 ? 30 : 45);
              const midX = (x1 + x2) / 2;

              const path = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
              const strokeColor =
                rawGrn === "Rice" ? "#38bdf8" : rawGrn === "Wheat" ? "#fbbf24" : "#a855f7";

              return (
                <path
                  key={`${reg.id}-${grn.id}`}
                  d={path}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={Math.max(2, count * 0.7)}
                  strokeOpacity={isHighlighted ? 0.7 : 0.12}
                  className="transition-all duration-300"
                />
              );
            });
          })}

          {/* Nodes Level 0: All Dishes */}
          <g
            className="cursor-pointer"
            onClick={() => setSelectedNode(selectedNode === "all" ? null : "all")}
          >
            <rect
              x={nodePositions["all"].x}
              y={nodePositions["all"].y}
              width={nodeWidth}
              height={nodePositions["all"].height}
              rx={6}
              fill="#cef79e"
              className="transition-all hover:scale-105"
            />
            <text
              x={nodePositions["all"].x - 10}
              y={nodePositions["all"].y + nodePositions["all"].height / 2}
              textAnchor="end"
              fill="#cef79e"
              fontSize="12"
              className="font-mono-tech"
            >
              All Dishes (255)
            </text>
          </g>

          {/* Nodes Level 1: Regions */}
          {regionNodes.map((reg) => {
            const pos = nodePositions[reg.id];
            const isSel = selectedNode === reg.id;
            return (
              <g
                key={reg.id}
                className="cursor-pointer"
                onClick={() => setSelectedNode(isSel ? null : reg.id)}
              >
                <rect
                  x={pos.x}
                  y={pos.y}
                  width={nodeWidth}
                  height={pos.height}
                  rx={4}
                  fill={isSel ? "#cef79e" : "#4d5757"}
                  stroke={isSel ? "#ffffff" : "#222f30"}
                  strokeWidth={1.5}
                  className="transition-all hover:fill-[#cef79e]"
                />
                <text
                  x={pos.x + nodeWidth + 8}
                  y={pos.y + pos.height / 2 + 4}
                  fill="#f7f7f5"
                  fontSize="11"
                  className="font-mono-tech"
                >
                  {reg.name}
                </text>
              </g>
            );
          })}

          {/* Nodes Level 2: Grains */}
          {grainNodes.map((grn) => {
            const pos = nodePositions[grn.id];
            const isSel = selectedNode === grn.id;
            const color =
              grn.name === "Rice" ? "#38bdf8" : grn.name === "Wheat" ? "#fbbf24" : "#a855f7";

            return (
              <g
                key={grn.id}
                className="cursor-pointer"
                onClick={() => setSelectedNode(isSel ? null : grn.id)}
              >
                <rect
                  x={pos.x}
                  y={pos.y}
                  width={nodeWidth}
                  height={pos.height}
                  rx={4}
                  fill={color}
                  opacity={isSel || selectedNode === null ? 0.9 : 0.4}
                  className="transition-all hover:opacity-100"
                />
                <text
                  x={pos.x + nodeWidth + 10}
                  y={pos.y + pos.height / 2 + 4}
                  fill={color}
                  fontSize="12"
                  fontWeight="600"
                  className="font-mono-tech"
                >
                  {grn.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Bayesian Conditional Independence Verification from P1.py */}
      <div className="p-3.5 rounded-lg bg-[#222f30] border border-[#4d5757]/40 text-xs font-mono-tech space-y-2">
        <div className="flex items-center justify-between text-[#cef79e]">
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            <span>P1.PY CONDITIONAL INDEPENDENCE TEST: P(RICE ∩ SOUTH) vs P(RICE) × P(SOUTH)</span>
          </span>
          <span className="text-red-400 font-semibold">NOT INDEPENDENT (DEPENDENCE CONFIRMED)</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[#c9cbbe]">
          <div>
            P(Rice): <span className="text-[#ffffff]">{bayes.independenceTest.pRice}</span>
          </div>
          <div>
            P(South): <span className="text-[#ffffff]">{bayes.independenceTest.pSouth}</span>
          </div>
          <div>
            P(Rice) × P(South): <span className="text-[#ffffff]">{bayes.independenceTest.pRiceTimesSouth}</span>
          </div>
          <div>
            P(Rice ∩ South): <strong className="text-[#cef79e]">{bayes.independenceTest.pRiceAndSouth}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
