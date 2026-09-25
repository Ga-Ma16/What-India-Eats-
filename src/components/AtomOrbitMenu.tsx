import React, { useState, useEffect } from "react";
import { ATOM_NODES } from "./AtomMenu";
import { RotateCw } from "lucide-react";

interface AtomOrbitMenuProps {
  activeNodeId: string;
  onSelectNode: (id: string) => void;
  children: React.ReactNode;
}

export function AtomOrbitMenu({
  activeNodeId,
  onSelectNode,
  children
}: AtomOrbitMenuProps) {
  const [rotationOffset, setRotationOffset] = useState<number>(0);
  const [isRotating, setIsRotating] = useState<boolean>(true);

  // Slow orbital rotation of the 70vmin atom ring
  useEffect(() => {
    if (!isRotating) return;
    const interval = setInterval(() => {
      setRotationOffset((prev) => (prev + 0.15) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, [isRotating]);

  const totalNodes = ATOM_NODES.length; // 10 nodes (V1 to V10)
  const angleStep = 360 / totalNodes; // 36deg per node

  return (
    <div
      className="relative w-full max-w-6xl mx-auto min-h-[640px] flex items-center justify-center select-none"
      style={{ "--radius": "70vmin" } as React.CSSProperties}
    >
      {/* Visual Orbital Guide Rings in background (z-0, rotating behind the fixed central content box) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0">
        {/* Main 70vmin Orbit Perimeter Ring matching the CSS radius */}
        <div
          className="absolute rounded-full border border-[#cef79e]/25 shadow-[0_0_80px_rgba(206,247,158,0.08)] pointer-events-none"
          style={{
            width: "calc(var(--radius) * 2)",
            height: "calc(var(--radius) * 2)",
          }}
        />

        {/* Secondary Decorative Dashed Concentric Track */}
        <div
          className="absolute rounded-full border border-[#4d5757]/30 border-dashed animate-[spin_200s_linear_infinite] pointer-events-none"
          style={{
            width: "calc(var(--radius) * 2 + 40px)",
            height: "calc(var(--radius) * 2 + 40px)",
          }}
        />

        {/* Inner Subtle Guide Ring */}
        <div
          className="absolute rounded-full border border-[#4d5757]/20 pointer-events-none"
          style={{
            width: "calc(var(--radius) * 2 - 40px)",
            height: "calc(var(--radius) * 2 - 40px)",
          }}
        />
      </div>

      {/* 10 Circular Orbit Nodes positioned using CSS Trigonometric Functions (cos, sin, calc) */}
      {/* Set to z-0 so the giant 70vmin atom ring rotates behind the fixed central content box */}
      <div className="absolute inset-0 pointer-events-none atom-orbit-container z-0">
        {ATOM_NODES.map((node, index) => {
          const isActive = node.id === activeNodeId;
          const Icon = node.icon;

          // Compute angle in degrees
          // Node 0 starts at -90deg (top / zenith)
          const baseDeg = -90 + index * angleStep;
          const currentDeg = baseDeg + rotationOffset;

          // Pure CSS Trigonometry variables:
          // Evaluated inside CSS calc(50% + cos(var(--node-angle)) * var(--radius) - var(--node-half-w))
          const nodeStyle: React.CSSProperties = {
            // @ts-expect-error CSS trigonometric custom property
            "--node-angle": `${currentDeg}deg`,
            "--node-half-w": "36px",
            "--node-half-h": "36px",
          };

          return (
            <div
              key={node.id}
              style={nodeStyle}
              className="absolute atom-orbit-node pointer-events-auto transition-transform duration-300 z-0"
            >
              <button
                onClick={() => onSelectNode(node.id)}
                className={`relative group flex flex-col items-center justify-center w-[72px] h-[72px] rounded-full backdrop-blur-md transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-[#cef79e] text-[#172021] border-2 border-[#ffffff] shadow-[0_0_30px_#cef79e] scale-110 ring-4 ring-[#cef79e]/30"
                    : "bg-[#182325]/90 text-[#c9cbbe] border border-[#4d5757]/80 hover:border-[#cef79e] hover:bg-[#223133] hover:scale-105"
                }`}
                title={`V${node.number}: ${node.label} - ${node.subtitle}`}
              >
                {/* Orbital Spoke Indicator Ray when active */}
                {isActive && (
                  <div className="absolute inset-0 rounded-full animate-ping bg-[#cef79e]/20 pointer-events-none" />
                )}

                {/* Node Top Micro-Tag */}
                <div
                  className={`text-[9px] font-mono-tech tracking-wider font-bold ${
                    isActive ? "text-[#172021]" : "text-[#cef79e]"
                  }`}
                >
                  V{node.number}
                </div>

                {/* Icon */}
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? "text-[#172021]" : "text-[#f7f7f5]"
                  }`}
                />

                {/* Compact Node Label */}
                <div
                  className={`text-[8px] font-mono-tech uppercase font-medium text-center px-1 leading-tight line-clamp-1 max-w-[62px] ${
                    isActive ? "text-[#172021] font-bold" : "text-[#94a3b8]"
                  }`}
                >
                  {node.label.split(" ")[0]}
                </div>

                {/* Tooltip on Hover */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap px-2.5 py-0.5 rounded bg-[#0f1719] border border-[#4d5757] text-[10px] font-mono-tech text-[#cef79e] shadow-xl z-50">
                  V{node.number}: {node.label}
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Fixed Central Charting Display Box - locked to readable size max-w-5xl w-full min-h-[600px] and high z-index z-20 */}
      <div className="relative z-20 max-w-5xl w-full min-h-[600px] h-[640px] rounded-3xl bg-[#172021]/95 backdrop-blur-2xl border border-[#4d5757]/70 shadow-[0_25px_80px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden transition-all duration-300">
        {/* Container Header HUD */}
        <div className="h-10 px-5 border-b border-[#4d5757]/40 bg-[#162022]/90 flex items-center justify-between text-[11px] font-mono-tech text-[#64748b] shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#cef79e] animate-pulse" />
            <span className="text-[#cef79e] font-semibold tracking-wide">
              70VMIN ATOM ORBIT HUD · CSS TRIGONOMETRY
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsRotating(!isRotating)}
              className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] border cursor-pointer transition-colors ${
                isRotating
                  ? "border-[#cef79e] text-[#cef79e] bg-[#cef79e]/10"
                  : "border-[#4d5757] text-[#64748b] hover:text-[#c9cbbe]"
              }`}
              title="Toggle Orbital Revolution"
            >
              <RotateCw className={`w-2.5 h-2.5 ${isRotating ? "animate-spin" : ""}`} />
              <span>{isRotating ? "ORBIT ACTIVE" : "ORBIT PAUSED"}</span>
            </button>
            <span className="text-[#94a3b8] hidden sm:inline">R = 70vmin</span>
          </div>
        </div>

        {/* Chart Viewport */}
        <div className="flex-1 w-full min-h-0 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
