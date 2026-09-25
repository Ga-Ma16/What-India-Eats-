import { useState, useEffect } from "react";
import { getV1StateDietaryData } from "../../data/analytics";
import createPlotlyComponent from "react-plotly.js/factory";
import Plotly from "plotly.js-dist-min";
import { MapPin, Info, Loader2 } from "lucide-react";

const Plot = createPlotlyComponent(Plotly);

const GEOJSON_URL =
  "https://gist.githubusercontent.com/jbrobst/56c13bbbf9d97d187fea01ca62ea5112/raw/e388c4cae20aa53cb5090210a42ebb9b765c0a36/india_states.geojson";

export function V1DietaryHeatmap() {
  const data = getV1StateDietaryData();
  const [geojson, setGeojson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<string>("Assam");

  useEffect(() => {
    let active = true;
    // Attempt fetch from original P1.py URL with fallback to local cached file
    fetch(GEOJSON_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Remote fetch failed");
        return res.json();
      })
      .catch(() => fetch("/india_states.geojson").then((r) => r.json()))
      .then((geo) => {
        if (active) {
          setGeojson(geo);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error loading GeoJSON", err);
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const currentState = data.find((d) => d.state === selectedState) || data[0];

  const locations = data.map((d) => d.state);
  const zValues = data.map((d) => d.p_non_veg);

  return (
    <div className="w-full h-full flex flex-col justify-between p-3 sm:p-5 text-[#f7f7f5] overflow-hidden">
      {/* Header and Bayes Formula */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#4d5757]/40 gap-2 shrink-0">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-tech text-[#cef79e]">
            <span>V1 · GEOSPATIAL CHOROPLETH</span>
            <span>·</span>
            <span>REACT-PLOTLY.JS</span>
          </div>
          <h2 className="text-lg sm:text-xl font-light text-[#ffffff]">
            V1: Dietary Heatmap — P(Non-Veg | State)
          </h2>
        </div>
        <div className="px-2.5 py-1 rounded-lg bg-[#222f30] border border-[#4d5757]/60 text-xs font-mono-tech flex items-center gap-2">
          <span className="text-[#64748b]">BAYES PRIOR: </span>
          <span className="text-[#cef79e]">P(Non-Veg ∩ State) / P(State)</span>
        </div>
      </div>

      {/* Main Grid: Interactive Plotly Choropleth Map + Inspection Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 my-2 flex-1 min-h-0 items-stretch">
        {/* Choropleth Map Container */}
        <div className="lg:col-span-8 rounded-xl bg-[#172021]/80 border border-[#4d5757]/50 relative overflow-hidden flex items-center justify-center min-h-[300px]">
          {loading || !geojson ? (
            <div className="flex flex-col items-center gap-2 text-[#c9cbbe] font-mono-tech text-xs">
              <Loader2 className="w-5 h-5 text-[#cef79e] animate-spin" />
              <span>Loading India GeoJSON State Boundaries...</span>
            </div>
          ) : (
            <Plot
              data={[
                {
                  type: "choropleth",
                  geojson: geojson,
                  featureidkey: "properties.ST_NM",
                  locations: locations,
                  z: zValues,
                  colorscale: "Reds",
                  text: data.map(
                    (d) =>
                      `<b>${d.state}</b><br>P(Non-Veg | State): ${d.p_non_veg}%<br>P(Veg | State): ${d.p_veg}%<br>Catalog Dishes: ${d.total_dishes}`
                  ),
                  hoverinfo: "text",
                  marker: {
                    line: {
                      color: "#172021",
                      width: 0.8,
                    },
                  },
                  colorbar: {
                    title: {
                      text: "P(Non-Veg) %",
                      font: { color: "#c9cbbe", size: 10, family: "Roboto Mono" },
                    },
                    tickfont: { color: "#c9cbbe", size: 9, family: "Roboto Mono" },
                    thickness: 10,
                    len: 0.7,
                  },
                },
              ]}
              layout={{
                geo: {
                  fitbounds: "locations",
                  visible: false,
                  bgcolor: "rgba(0,0,0,0)",
                },
                paper_bgcolor: "rgba(0,0,0,0)",
                plot_bgcolor: "rgba(0,0,0,0)",
                margin: { r: 0, t: 10, l: 0, b: 0 },
                autosize: true,
              }}
              useResizeHandler={true}
              config={{
                responsive: true,
                displayModeBar: false,
              }}
              style={{ width: "100%", height: "100%" }}
              onClick={(event: any) => {
                const pt = event.points?.[0];
                if (pt && typeof pt.location === "string") {
                  setSelectedState(pt.location);
                }
              }}
            />
          )}
        </div>

        {/* Selected State Statistical Card */}
        <div className="lg:col-span-4 p-4 rounded-xl bg-[#222f30] border border-[#4d5757]/60 flex flex-col justify-between space-y-3 shrink-0 overflow-y-auto">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#4d5757]/40 pb-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#cef79e]" />
                <h3 className="text-base font-light text-[#ffffff]">{currentState.state}</h3>
              </div>
              <span className="text-xs font-mono-tech text-[#cef79e] px-2 py-0.5 rounded bg-[#172021] border border-[#4d5757]/50">
                {currentState.p_non_veg}% Non-Veg
              </span>
            </div>

            {/* Probability Breakdown Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono-tech">
                <span className="text-[#64748b]">Conditional Prior:</span>
                <span className="text-[#ef4444] font-semibold">{currentState.p_non_veg}%</span>
              </div>
              <div className="w-full h-2 bg-[#172021] rounded-full overflow-hidden flex border border-[#4d5757]/50">
                <div
                  className="h-full bg-red-500 transition-all duration-500"
                  style={{ width: `${currentState.p_non_veg}%` }}
                />
                <div
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${currentState.p_veg}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono-tech text-[#64748b]">
                <span>Non-Veg: {currentState.non_veg_count}</span>
                <span>Veg: {currentState.veg_count}</span>
                <span>Total: {currentState.total_dishes}</span>
              </div>
            </div>

            {/* Sample Catalog Dishes */}
            <div className="space-y-1.5 text-xs">
              <div className="text-[10px] font-mono-tech text-[#c9cbbe] uppercase">
                Sample Catalog Dishes:
              </div>
              <div className="flex flex-wrap gap-1">
                {currentState.sample_dishes.map((dish, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-[#172021] border border-[#4d5757]/40 text-[10px] font-mono-tech text-[#cef79e]"
                  >
                    {dish}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#172021]/80 border border-[#4d5757]/30 text-[11px] text-[#94a3b8] leading-relaxed flex gap-2">
            <Info className="w-3.5 h-3.5 text-[#cef79e] shrink-0 mt-0.5" />
            <span>
              Click any state on the Plotly choropleth map to update the posterior probabilities and catalog dishes.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
