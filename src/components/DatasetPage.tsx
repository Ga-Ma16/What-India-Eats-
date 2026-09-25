import { useState, useMemo } from "react";
import { ALL_DISHES, STATS, getCategoricalFrequencies, calculateBayesianProbabilities, EngineeredDish } from "../data/analytics";
import { Search, Filter, Download, Check, Sparkles, Database, Layers } from "lucide-react";

export function DatasetPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dietFilter, setDietFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [selectedDish, setSelectedDish] = useState<EngineeredDish | null>(ALL_DISHES[0]);

  const bayes = useMemo(() => calculateBayesianProbabilities(), []);

  // Filtered dishes
  const filteredDishes = useMemo(() => {
    return ALL_DISHES.filter((dish) => {
      const matchesSearch =
        dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dish.ingredients.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dish.state.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDiet = dietFilter === "all" || dish.diet === dietFilter;
      const matchesRegion = regionFilter === "all" || dish.region === regionFilter;
      const matchesCourse = courseFilter === "all" || dish.course === courseFilter;

      return matchesSearch && matchesDiet && matchesRegion && matchesCourse;
    });
  }, [searchTerm, dietFilter, regionFilter, courseFilter]);

  const handleDownloadCsv = () => {
    const csvHeader = "name,ingredients,diet,prep_time,cook_time,total_time,is_rice,is_wheat,is_dairy,spice_intensity,flavor_profile,course,state,region\n";
    const csvRows = ALL_DISHES.map((d) =>
      `"${d.name}","${d.ingredients.replace(/"/g, '""')}","${d.diet}",${d.prep_time ?? -1},${d.cook_time ?? -1},${d.total_time ?? -1},${d.is_rice},${d.is_wheat},${d.is_dairy},${d.spice_intensity},"${d.flavor_profile}","${d.course}","${d.state}","${d.region}"`
    ).join("\n");

    const blob = new Blob([csvHeader + csvRows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "indian_food_engineered.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-[#172021] text-[#f7f7f5] py-8 px-4 sm:px-6">
      <div className="max-w-[1360px] mx-auto space-y-8">
        {/* Header & CSV Download */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#4d5757]/40 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-tech text-[#cef79e]">
              <Database className="w-3.5 h-3.5" />
              <span>THE 255-DISH INDIAN CORPUS · INGESTION & FEATURE ENGINEERING</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-light text-[#ffffff] tracking-tight mt-1">
              Dataset & Mathematical Priors
            </h1>
            <p className="text-sm text-[#94a3b8] font-light max-w-2xl mt-1">
              Engineered text flags (Rice, Wheat, Dairy), lexical spice scoring, and parametric summary moments for continuous time distributions.
            </p>
          </div>

          <button
            onClick={handleDownloadCsv}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#4d5757] bg-[#222f30] text-xs font-mono-tech text-[#cef79e] hover:border-[#cef79e] hover:bg-[#283739] transition-colors cursor-pointer self-start md:self-auto"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT ENGINEERED CSV</span>
          </button>
        </div>

        {/* Continuous Summary Stats from P1.py */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono-tech text-[#64748b]">
            <span className="uppercase tracking-wider">UNIT 1: CONTINUOUS SUMMARY MOMENTS & QUANTILES</span>
            <span>SAMPLE SIZE N = {STATS.cook_time.count} VALID PAIRS</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Cook Time Stats */}
            <div className="p-4 rounded-xl bg-[#222f30] border border-[#4d5757]/50 space-y-2">
              <div className="text-xs font-mono-tech text-[#cef79e]">COOK TIME (MINUTES)</div>
              <div className="text-2xl font-mono-tech text-[#ffffff] font-light">{STATS.cook_time.mean}m avg</div>
              <div className="text-xs font-mono-tech text-[#94a3b8] space-y-0.5">
                <div>Std: {STATS.cook_time.std}m · Var: {STATS.cook_time.variance}</div>
                <div>Quantiles: [{STATS.cook_time.p25}m, {STATS.cook_time.median}m, {STATS.cook_time.p75}m]</div>
                <div className="text-[#cef79e]">Skewness: +{STATS.cook_time.skewness} (Positive tail)</div>
              </div>
            </div>

            {/* Prep Time Stats */}
            <div className="p-4 rounded-xl bg-[#222f30] border border-[#4d5757]/50 space-y-2">
              <div className="text-xs font-mono-tech text-[#38bdf8]">PREP TIME (MINUTES)</div>
              <div className="text-2xl font-mono-tech text-[#ffffff] font-light">{STATS.prep_time.mean}m avg</div>
              <div className="text-xs font-mono-tech text-[#94a3b8] space-y-0.5">
                <div>Std: {STATS.prep_time.std}m · Var: {STATS.prep_time.variance}</div>
                <div>Quantiles: [{STATS.prep_time.p25}m, {STATS.prep_time.median}m, {STATS.prep_time.p75}m]</div>
                <div className="text-[#38bdf8]">Skewness: +{STATS.prep_time.skewness}</div>
              </div>
            </div>

            {/* Spice Intensity Stats */}
            <div className="p-4 rounded-xl bg-[#222f30] border border-[#4d5757]/50 space-y-2">
              <div className="text-xs font-mono-tech text-[#f59e0b]">SPICE INTENSITY (KEYWORDS)</div>
              <div className="text-2xl font-mono-tech text-[#ffffff] font-light">{STATS.spice_intensity.mean} / 7</div>
              <div className="text-xs font-mono-tech text-[#94a3b8] space-y-0.5">
                <div>Std: {STATS.spice_intensity.std} · Var: {STATS.spice_intensity.variance}</div>
                <div>Range: [{STATS.spice_intensity.min}, {STATS.spice_intensity.max}] keywords</div>
                <div className="text-[#f59e0b]">Keywords: chili, pepper, garlic, etc.</div>
              </div>
            </div>

            {/* Bayes Derivation Card */}
            <div className="p-4 rounded-xl bg-[#222f30] border border-[#cef79e]/40 space-y-2">
              <div className="text-xs font-mono-tech text-[#cef79e]">BAYES CONDITIONAL PRIORS</div>
              <div className="text-sm font-mono-tech text-[#ffffff]">
                P(Veg | Sweet) = <strong className="text-[#cef79e]">{bayes.pVegGivenSweet}%</strong>
              </div>
              <div className="text-sm font-mono-tech text-[#ffffff]">
                P(Non-Veg | East) = <strong className="text-red-400">{bayes.pNonVegGivenEast}%</strong>
              </div>
              <div className="text-[11px] font-mono-tech text-[#64748b]">
                P(Rice ∩ South) = {bayes.independenceTest.pRiceAndSouth} (Staple dependence)
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="p-4 rounded-xl bg-[#222f30]/60 border border-[#4d5757]/40 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-[#64748b] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by dish name, ingredient (ghee, paneer, fish), or state..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#172021] border border-[#4d5757]/50 text-xs font-mono-tech text-[#f7f7f5] placeholder-[#64748b] focus:outline-none focus:border-[#cef79e]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono-tech">
            {/* Diet Filter */}
            <select
              value={dietFilter}
              onChange={(e) => setDietFilter(e.target.value)}
              aria-label="Filter by Diet"
              className="px-3 py-2 rounded-lg bg-[#172021] border border-[#4d5757]/50 text-[#c9cbbe] focus:outline-none focus:border-[#cef79e]"
            >
              <option value="all">All Diets</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="non vegetarian">Non-Vegetarian</option>
            </select>

            {/* Region Filter */}
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              aria-label="Filter by Region"
              className="px-3 py-2 rounded-lg bg-[#172021] border border-[#4d5757]/50 text-[#c9cbbe] focus:outline-none focus:border-[#cef79e]"
            >
              <option value="all">All Regions</option>
              <option value="North">North</option>
              <option value="South">South</option>
              <option value="East">East</option>
              <option value="West">West</option>
              <option value="North East">North East</option>
              <option value="Central">Central</option>
            </select>

            {/* Course Filter */}
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              aria-label="Filter by Course"
              className="px-3 py-2 rounded-lg bg-[#172021] border border-[#4d5757]/50 text-[#c9cbbe] focus:outline-none focus:border-[#cef79e]"
            >
              <option value="all">All Courses</option>
              <option value="main course">Main Course</option>
              <option value="dessert">Dessert</option>
              <option value="snack">Snack</option>
              <option value="starter">Starter</option>
            </select>

            <span className="text-[#64748b]">
              Showing {filteredDishes.length} / {ALL_DISHES.length} dishes
            </span>
          </div>
        </div>

        {/* Dataset Table & Live Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Table */}
          <div className="lg:col-span-8 rounded-xl bg-[#222f30]/80 border border-[#4d5757]/50 overflow-hidden">
            <div className="overflow-x-auto max-h-[500px]">
              <table className="w-full text-left text-xs font-mono-tech border-collapse">
                <thead className="sticky top-0 bg-[#1e2a2c] text-[#64748b] border-b border-[#4d5757]/60">
                  <tr>
                    <th className="p-3">DISH NAME</th>
                    <th className="p-3">DIET</th>
                    <th className="p-3">PREP</th>
                    <th className="p-3">COOK</th>
                    <th className="p-3">COURSE</th>
                    <th className="p-3">REGION</th>
                    <th className="p-3">RICE/WHEAT</th>
                    <th className="p-3">SPICE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#334155]/40 text-[#c9cbbe]">
                  {filteredDishes.map((dish) => {
                    const isSelected = selectedDish?.id === dish.id;
                    return (
                      <tr
                        key={dish.id}
                        onClick={() => setSelectedDish(dish)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-[#2b3a3c] text-[#ffffff]"
                            : "hover:bg-[#253234]"
                        }`}
                      >
                        <td className="p-3 font-medium text-[#ffffff]">{dish.name}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] ${
                              dish.diet === "vegetarian"
                                ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                                : "bg-red-950 text-red-300 border border-red-800"
                            }`}
                          >
                            {dish.diet === "vegetarian" ? "VEG" : "NON-VEG"}
                          </span>
                        </td>
                        <td className="p-3">{dish.prep_time !== null ? `${dish.prep_time}m` : "—"}</td>
                        <td className="p-3">{dish.cook_time !== null ? `${dish.cook_time}m` : "—"}</td>
                        <td className="p-3 capitalize">{dish.course}</td>
                        <td className="p-3">{dish.region !== "-1" ? dish.region : "—"}</td>
                        <td className="p-3">
                          {dish.is_rice === 1 ? (
                            <span className="text-sky-400">Rice</span>
                          ) : dish.is_wheat === 1 ? (
                            <span className="text-amber-400">Wheat</span>
                          ) : (
                            <span className="text-[#64748b]">Other</span>
                          )}
                        </td>
                        <td className="p-3 text-[#cef79e]">{dish.spice_intensity} / 7</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Selected Dish Inspector Card */}
          {selectedDish && (
            <div className="lg:col-span-4 p-5 rounded-xl bg-[#222f30] border border-[#4d5757]/60 space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono-tech text-[#cef79e]">
                  <span>RECORD #{selectedDish.id.replace("dish-", "")}</span>
                  <span>·</span>
                  <span className="capitalize">{selectedDish.course}</span>
                </div>
                <h3 className="text-2xl font-light text-[#ffffff]">{selectedDish.name}</h3>
                <div className="text-xs text-[#94a3b8] font-mono-tech">
                  {selectedDish.state !== "-1" ? selectedDish.state : "Unknown State"} ·{" "}
                  {selectedDish.region !== "-1" ? `${selectedDish.region} India` : "National"}
                </div>
              </div>

              {/* Ingredients Box */}
              <div className="p-3 rounded-lg bg-[#172021] border border-[#4d5757]/40 space-y-1">
                <div className="text-[11px] font-mono-tech text-[#64748b] uppercase">INGREDIENTS</div>
                <div className="text-xs text-[#f7f7f5] leading-relaxed">
                  {selectedDish.ingredients}
                </div>
              </div>

              {/* Engineered Numerical Features */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono-tech">
                <div className="p-2.5 rounded bg-[#172021] border border-[#4d5757]/40">
                  <div className="text-[#64748b]">PREP TIME</div>
                  <div className="text-sm text-[#38bdf8] font-semibold mt-0.5">
                    {selectedDish.prep_time !== null ? `${selectedDish.prep_time} mins` : "Unspecified"}
                  </div>
                </div>
                <div className="p-2.5 rounded bg-[#172021] border border-[#4d5757]/40">
                  <div className="text-[#64748b]">COOK TIME</div>
                  <div className="text-sm text-[#ef4444] font-semibold mt-0.5">
                    {selectedDish.cook_time !== null ? `${selectedDish.cook_time} mins` : "Unspecified"}
                  </div>
                </div>
                <div className="p-2.5 rounded bg-[#172021] border border-[#4d5757]/40">
                  <div className="text-[#64748b]">SPICE INTENSITY</div>
                  <div className="text-sm text-[#cef79e] font-semibold mt-0.5">
                    {selectedDish.spice_intensity} keywords
                  </div>
                </div>
                <div className="p-2.5 rounded bg-[#172021] border border-[#4d5757]/40">
                  <div className="text-[#64748b]">FLAVOR</div>
                  <div className="text-sm text-[#ffffff] font-semibold capitalize mt-0.5">
                    {selectedDish.flavor_profile !== "-1" ? selectedDish.flavor_profile : "Balanced"}
                  </div>
                </div>
              </div>

              {/* Engineered Text Flags */}
              <div className="space-y-1.5 pt-2 border-t border-[#4d5757]/40 text-xs font-mono-tech">
                <div className="text-[#64748b] text-[11px] uppercase">ENGINEERED FEATURE FLAGS</div>
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`px-2.5 py-1 rounded border text-[11px] ${
                      selectedDish.is_rice === 1
                        ? "bg-sky-950 border-sky-800 text-sky-300"
                        : "bg-[#172021] border-[#4d5757]/30 text-[#64748b]"
                    }`}
                  >
                    is_rice: {selectedDish.is_rice}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded border text-[11px] ${
                      selectedDish.is_wheat === 1
                        ? "bg-amber-950 border-amber-800 text-amber-300"
                        : "bg-[#172021] border-[#4d5757]/30 text-[#64748b]"
                    }`}
                  >
                    is_wheat: {selectedDish.is_wheat}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded border text-[11px] ${
                      selectedDish.is_dairy === 1
                        ? "bg-emerald-950 border-emerald-800 text-emerald-300"
                        : "bg-[#172021] border-[#4d5757]/30 text-[#64748b]"
                    }`}
                  >
                    is_dairy: {selectedDish.is_dairy}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
