import { useState, useMemo } from "react";
import { getV8TopIngredients } from "../../data/analytics";
import { CircleDot, Sparkles } from "lucide-react";

export function V8TopIngredients() {
  const ingredients = useMemo(() => getV8TopIngredients(), []);
  const [selectedIngredient, setSelectedIngredient] = useState<string | null>(ingredients[0]?.ingredient || null);

  const maxFreq = ingredients[0]?.frequency || 50;

  const current = ingredients.find((i) => i.ingredient === selectedIngredient) || ingredients[0];

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 text-[#f7f7f5] overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#4d5757]/40 gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-tech text-[#cef79e]">
            <span>V8 · LEXICAL INGREDIENT FREQUENCY</span>
            <span>·</span>
            <span>BUBBLE PACKING</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-light text-[#ffffff]">
            Top 20 Ingredients Frequency
          </h2>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-[#222f30] border border-[#4d5757]/60 text-xs font-mono-tech flex items-center gap-2">
          <CircleDot className="w-3.5 h-3.5 text-[#cef79e]" />
          <span>AREA PROPORTIONAL TO CORPUS COUNT</span>
        </div>
      </div>

      {/* Interactive Bubble Packing Grid */}
      <div className="my-4 p-5 rounded-xl bg-[#222f30]/60 border border-[#4d5757]/40">
        <div className="flex justify-between items-center mb-3 text-xs font-mono-tech text-[#64748b]">
          <span>CLICK BUBBLE TO HIGHLIGHT STATS</span>
          <span>{ingredients.length} MOST POPULAR STAPLES</span>
        </div>

        {/* Bubble Cluster */}
        <div className="flex flex-wrap items-center justify-center gap-3 p-4 min-h-[220px]">
          {ingredients.map((item, idx) => {
            const isSelected = item.ingredient === selectedIngredient;
            const sizePct = item.frequency / maxFreq;
            const diameter = Math.max(54, Math.floor(sizePct * 115));

            return (
              <button
                key={item.ingredient}
                onClick={() => setSelectedIngredient(item.ingredient)}
                style={{ width: `${diameter}px`, height: `${diameter}px` }}
                className={`rounded-full flex flex-col items-center justify-center p-2 text-center transition-all duration-300 cursor-pointer transform hover:scale-110 relative ${
                  isSelected
                    ? "bg-[#cef79e] text-[#172021] shadow-[0_0_20px_#cef79e] z-10"
                    : "bg-[#283739] text-[#f7f7f5] border border-[#4d5757]/60 hover:border-[#cef79e]"
                }`}
              >
                <span className="text-[10px] font-mono-tech opacity-70">#{idx + 1}</span>
                <span className="text-xs font-medium truncate max-w-full capitalize px-1">
                  {item.ingredient}
                </span>
                <span className="text-[11px] font-mono-tech font-bold">
                  {item.frequency}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Highlight Detail Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono-tech">
        <div className="p-3 rounded-lg bg-[#222f30] border border-[#4d5757]/40">
          <div className="text-[#64748b]">SELECTED INGREDIENT</div>
          <div className="text-base text-[#cef79e] font-semibold capitalize mt-0.5">
            {current.ingredient}
          </div>
          <div className="text-[10px] text-[#ffffff]">Appears in {current.frequency} of 255 dishes ({((current.frequency / 255) * 100).toFixed(1)}%)</div>
        </div>
        <div className="p-3 rounded-lg bg-[#222f30] border border-[#4d5757]/40">
          <div className="text-[#64748b]">TOP AROMATIC PILLARS</div>
          <div className="text-base text-[#ffffff] font-semibold mt-0.5">
            Sugar, Ghee, Garam Masala
          </div>
          <div className="text-[10px] text-[#38bdf8]">Foundation of both desserts and curries</div>
        </div>
        <div className="p-3 rounded-lg bg-[#222f30] border border-[#4d5757]/40">
          <div className="text-[#64748b]">STAPLE FLOURS & DAIRY</div>
          <div className="text-base text-[#ffffff] font-semibold mt-0.5">
            Rice Flour, Milk, Maida
          </div>
          <div className="text-[10px] text-[#f59e0b]">Regional divergence between North & South</div>
        </div>
      </div>
    </div>
  );
}
