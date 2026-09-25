import { RAW_INDIAN_FOOD_CSV, parseCSV, RawDish } from './rawIndianFood';

export interface EngineeredDish extends RawDish {
  id: string;
  is_rice: number;
  is_wheat: number;
  is_dairy: number;
  spice_intensity: number;
  total_time: number | null;
}

const SPICE_KEYWORDS = ['chili', 'chilli', 'garam masala', 'pepper', 'ginger', 'garlic', 'mustard'];

export function engineerFeatures(dishes: RawDish[]): EngineeredDish[] {
  return dishes.map((dish, idx) => {
    const ingLower = dish.ingredients.toLowerCase();
    
    // Feature engineering as defined in P1.py:
    const is_rice = /(rice|poha)/.test(ingLower) ? 1 : 0;
    const is_wheat = /(wheat|maida|atta|flour)/.test(ingLower) ? 1 : 0;
    const is_dairy = /(milk|paneer|ghee|butter|yogurt|curd)/.test(ingLower) ? 1 : 0;
    
    let spice_intensity = 0;
    for (const kw of SPICE_KEYWORDS) {
      if (ingLower.includes(kw)) {
        spice_intensity++;
      }
    }

    const total_time = (dish.prep_time !== null && dish.cook_time !== null) 
      ? dish.prep_time + dish.cook_time 
      : null;

    return {
      ...dish,
      id: `dish-${idx + 1}`,
      is_rice,
      is_wheat,
      is_dairy,
      spice_intensity,
      total_time
    };
  });
}

// Global parsed and engineered dataset
export const ALL_DISHES: EngineeredDish[] = engineerFeatures(parseCSV(RAW_INDIAN_FOOD_CSV));
export const TOTAL_DISHES = ALL_DISHES.length; // 255

// Statistical summary metrics helper
export interface ColumnStats {
  count: number;
  mean: number;
  std: number;
  variance: number;
  min: number;
  p25: number;
  median: number;
  p75: number;
  max: number;
  skewness: number;
}

export function calculateSummaryStats(values: number[]): ColumnStats {
  const valid = values.filter(v => v !== null && !isNaN(v)).sort((a, b) => a - b);
  const n = valid.length;
  if (n === 0) {
    return { count: 0, mean: 0, std: 0, variance: 0, min: 0, p25: 0, median: 0, p75: 0, max: 0, skewness: 0 };
  }

  const sum = valid.reduce((acc, v) => acc + v, 0);
  const mean = sum / n;
  
  const variance = valid.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / (n - 1);
  const std = Math.sqrt(variance);

  const getPercentile = (p: number) => {
    const idx = (n - 1) * p;
    const lower = Math.floor(idx);
    const upper = Math.ceil(idx);
    const weight = idx - lower;
    return valid[lower] * (1 - weight) + valid[upper] * weight;
  };

  // Adjusted Fisher-Pearson standardized moment coefficient (sample skewness)
  let m3 = 0;
  for (const v of valid) {
    m3 += Math.pow((v - mean) / (std || 1), 3);
  }
  const skewness = (n / ((n - 1) * (n - 2))) * m3;

  return {
    count: n,
    mean: Number(mean.toFixed(2)),
    std: Number(std.toFixed(2)),
    variance: Number(variance.toFixed(2)),
    min: valid[0],
    p25: Number(getPercentile(0.25).toFixed(2)),
    median: Number(getPercentile(0.50).toFixed(2)),
    p75: Number(getPercentile(0.75).toFixed(2)),
    max: valid[n - 1],
    skewness: Number(skewness.toFixed(2))
  };
}

// Global stats for numeric columns
export const STATS = {
  prep_time: calculateSummaryStats(ALL_DISHES.map(d => d.prep_time).filter((v): v is number => v !== null)),
  cook_time: calculateSummaryStats(ALL_DISHES.map(d => d.cook_time).filter((v): v is number => v !== null)),
  total_time: calculateSummaryStats(ALL_DISHES.map(d => d.total_time).filter((v): v is number => v !== null)),
  spice_intensity: calculateSummaryStats(ALL_DISHES.map(d => d.spice_intensity))
};

// Categorical Priors
export function getCategoricalFrequencies(field: keyof RawDish) {
  const counts: Record<string, number> = {};
  for (const dish of ALL_DISHES) {
    const rawVal = String(dish[field] || '-1');
    const val = rawVal === '-1' ? 'Unknown' : rawVal;
    counts[val] = (counts[val] || 0) + 1;
  }
  return Object.entries(counts).map(([name, count]) => ({
    name,
    count,
    percentage: Number(((count / TOTAL_DISHES) * 100).toFixed(2))
  })).sort((a, b) => b.count - a.count);
}

// Conditional Expectations E[Cook Time | Diet], etc.
export function getConditionalExpectation(groupBy: keyof RawDish, targetNum: 'cook_time' | 'prep_time' | 'spice_intensity') {
  const groups: Record<string, number[]> = {};
  for (const dish of ALL_DISHES) {
    const rawVal = String(dish[groupBy] || '-1');
    const key = rawVal === '-1' ? 'Unknown' : rawVal;
    const val = dish[targetNum];
    if (val !== null && !isNaN(val)) {
      if (!groups[key]) groups[key] = [];
      groups[key].push(val);
    }
  }

  return Object.entries(groups).map(([group, vals]) => {
    const sum = vals.reduce((a, b) => a + b, 0);
    const mean = vals.length ? sum / vals.length : 0;
    const variance = vals.length > 1 
      ? vals.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / (vals.length - 1)
      : 0;
    return {
      group,
      count: vals.length,
      expectation: Number(mean.toFixed(2)),
      variance: Number(variance.toFixed(2)),
      std: Number(Math.sqrt(variance).toFixed(2))
    };
  }).sort((a, b) => b.expectation - a.expectation);
}

// Covariance and Correlation calculation
export function calculateCovarianceAndCorrelation() {
  const completeCases = ALL_DISHES.filter(d => d.prep_time !== null && d.cook_time !== null)
    .map(d => ({
      prep_time: d.prep_time as number,
      cook_time: d.cook_time as number,
      spice_intensity: d.spice_intensity
    }));

  const n = completeCases.length;
  const meanPrep = completeCases.reduce((a, c) => a + c.prep_time, 0) / n;
  const meanCook = completeCases.reduce((a, c) => a + c.cook_time, 0) / n;
  const meanSpice = completeCases.reduce((a, c) => a + c.spice_intensity, 0) / n;

  const vars = {
    prep: completeCases.reduce((a, c) => a + Math.pow(c.prep_time - meanPrep, 2), 0) / (n - 1),
    cook: completeCases.reduce((a, c) => a + Math.pow(c.cook_time - meanCook, 2), 0) / (n - 1),
    spice: completeCases.reduce((a, c) => a + Math.pow(c.spice_intensity - meanSpice, 2), 0) / (n - 1),
  };

  const cov = (colA: 'prep_time' | 'cook_time' | 'spice_intensity', meanA: number,
               colB: 'prep_time' | 'cook_time' | 'spice_intensity', meanB: number) => {
    const sum = completeCases.reduce((acc, item) => acc + (item[colA] - meanA) * (item[colB] - meanB), 0);
    return sum / (n - 1);
  };

  const covPrepCook = cov('prep_time', meanPrep, 'cook_time', meanCook);
  const covPrepSpice = cov('prep_time', meanPrep, 'spice_intensity', meanSpice);
  const covCookSpice = cov('cook_time', meanCook, 'spice_intensity', meanSpice);

  const corr = (covVal: number, varA: number, varB: number) => {
    const denom = Math.sqrt(varA * varB);
    return denom === 0 ? 0 : covVal / denom;
  };

  return {
    completeCount: n,
    covariance: [
      { name: 'prep_time', prep_time: vars.prep, cook_time: covPrepCook, spice_intensity: covPrepSpice },
      { name: 'cook_time', prep_time: covPrepCook, cook_time: vars.cook, spice_intensity: covCookSpice },
      { name: 'spice_intensity', prep_time: covPrepSpice, cook_time: covCookSpice, spice_intensity: vars.spice },
    ],
    correlation: [
      { name: 'prep_time', prep_time: 1.0, cook_time: Number(corr(covPrepCook, vars.prep, vars.cook).toFixed(4)), spice_intensity: Number(corr(covPrepSpice, vars.prep, vars.spice).toFixed(4)) },
      { name: 'cook_time', prep_time: Number(corr(covPrepCook, vars.prep, vars.cook).toFixed(4)), cook_time: 1.0, spice_intensity: Number(corr(covCookSpice, vars.cook, vars.spice).toFixed(4)) },
      { name: 'spice_intensity', prep_time: Number(corr(covPrepSpice, vars.prep, vars.spice).toFixed(4)), cook_time: Number(corr(covCookSpice, vars.cook, vars.spice).toFixed(4)), spice_intensity: 1.0 },
    ]
  };
}

// Bayes Rule and Discrete Probabilities from P1.py
export function calculateBayesianProbabilities() {
  const sweetDishes = ALL_DISHES.filter(d => d.flavor_profile === 'sweet');
  const pSweet = sweetDishes.length / TOTAL_DISHES;
  const vegAndSweet = sweetDishes.filter(d => d.diet === 'vegetarian');
  const pVegAndSweet = vegAndSweet.length / TOTAL_DISHES;
  const pVegGivenSweet = (pVegAndSweet / pSweet) * 100;

  const eastDishes = ALL_DISHES.filter(d => d.region === 'East');
  const pEast = eastDishes.length / TOTAL_DISHES;
  const nonVegAndEast = eastDishes.filter(d => d.diet === 'non vegetarian');
  const pNonVegAndEast = nonVegAndEast.length / TOTAL_DISHES;
  const pNonVegGivenEast = (pNonVegAndEast / pEast) * 100;

  // Independence test: Rice & South
  const pRice = ALL_DISHES.filter(d => d.is_rice === 1).length / TOTAL_DISHES;
  const pSouth = ALL_DISHES.filter(d => d.region === 'South').length / TOTAL_DISHES;
  const pRiceAndSouth = ALL_DISHES.filter(d => d.is_rice === 1 && d.region === 'South').length / TOTAL_DISHES;
  const pRiceTimesSouth = pRice * pSouth;
  const isIndependent = Math.abs(pRiceTimesSouth - pRiceAndSouth) < 0.01;

  return {
    pSweet: Number((pSweet * 100).toFixed(2)),
    pVegGivenSweet: Number(pVegGivenSweet.toFixed(2)),
    pEast: Number((pEast * 100).toFixed(2)),
    pNonVegGivenEast: Number(pNonVegGivenEast.toFixed(2)),
    independenceTest: {
      pRice: Number(pRice.toFixed(4)),
      pSouth: Number(pSouth.toFixed(4)),
      pRiceTimesSouth: Number(pRiceTimesSouth.toFixed(4)),
      pRiceAndSouth: Number(pRiceAndSouth.toFixed(4)),
      divergence: Number((pRiceAndSouth - pRiceTimesSouth).toFixed(4)),
      isIndependent
    }
  };
}

// Polynomial curve fitting: Least Squares implementation for degrees 1 to 5
export function fitPolynomial(x: number[], y: number[], degree: number): {
  coeffs: number[];
  predict: (xVal: number) => number;
  mse: number;
} {
  const n = x.length;
  const k = degree + 1;

  // Normal equations: (X^T * X) * w = X^T * y
  const A: number[][] = Array.from({ length: k }, () => Array(k).fill(0));
  const B: number[] = Array(k).fill(0);

  for (let i = 0; i < k; i++) {
    for (let j = 0; j < k; j++) {
      let sumPower = 0;
      for (let p = 0; p < n; p++) {
        sumPower += Math.pow(x[p], i + j);
      }
      A[i][j] = sumPower;
    }
    let sumY = 0;
    for (let p = 0; p < n; p++) {
      sumY += y[p] * Math.pow(x[p], i);
    }
    B[i] = sumY;
  }

  // Gaussian elimination with partial pivoting
  const augmented: number[][] = A.map((row, i) => [...row, B[i]]);
  for (let i = 0; i < k; i++) {
    let maxRow = i;
    for (let r = i + 1; r < k; r++) {
      if (Math.abs(augmented[r][i]) > Math.abs(augmented[maxRow][i])) {
        maxRow = r;
      }
    }
    [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];

    const pivot = augmented[i][i];
    if (Math.abs(pivot) < 1e-12) continue;

    for (let c = i; c <= k; c++) {
      augmented[i][c] /= pivot;
    }

    for (let r = 0; r < k; r++) {
      if (r !== i) {
        const factor = augmented[r][i];
        for (let c = i; c <= k; c++) {
          augmented[r][c] -= factor * augmented[i][c];
        }
      }
    }
  }

  const coeffs = augmented.map(row => row[k]); // c0, c1, c2, ...

  const predict = (xVal: number) => {
    let sum = 0;
    for (let i = 0; i < coeffs.length; i++) {
      sum += coeffs[i] * Math.pow(xVal, i);
    }
    return sum;
  };

  // Mean Squared Error
  let sse = 0;
  for (let p = 0; p < n; p++) {
    const pred = predict(x[p]);
    sse += Math.pow(y[p] - pred, 2);
  }
  const mse = Number((sse / n).toFixed(2));

  return { coeffs, predict, mse };
}

// Polynomial model evaluation for degrees 1..5
export function getPolynomialModels() {
  const valid = ALL_DISHES.filter(d => d.prep_time !== null && d.cook_time !== null);
  const x = valid.map(d => d.prep_time as number);
  const y = valid.map(d => d.cook_time as number);

  const models: Array<{ degree: number; mse: number; coeffs: number[]; predict: (xVal: number) => number }> = [];
  for (let deg = 1; deg <= 5; deg++) {
    const fit = fitPolynomial(x, y, deg);
    models.push({ degree: deg, mse: fit.mse, coeffs: fit.coeffs, predict: fit.predict });
  }

  return {
    rawPoints: valid.map(d => ({ x: d.prep_time as number, y: d.cook_time as number, name: d.name, diet: d.diet })),
    models
  };
}

// V1: State Dietary Heatmap Data: P(Non-Veg | State)
export function getV1StateDietaryData() {
  const stateMap: Record<string, { veg: number; nonVeg: number; total: number; dishes: string[] }> = {};

  for (const dish of ALL_DISHES) {
    let state = dish.state;
    if (!state || state === '-1') continue;

    // Normalizations from P1.py:
    if (state === 'NCT of Delhi') state = 'Delhi';
    if (state === 'Jammu & Kashmir') state = 'Jammu and Kashmir';
    if (state === 'Andaman & Nicobar Islands') state = 'Andaman & Nicobar Island';

    if (!stateMap[state]) {
      stateMap[state] = { veg: 0, nonVeg: 0, total: 0, dishes: [] };
    }
    stateMap[state].total++;
    stateMap[state].dishes.push(dish.name);
    if (dish.diet === 'non vegetarian') {
      stateMap[state].nonVeg++;
    } else {
      stateMap[state].veg++;
    }
  }

  // Explicitly add Ladakh from Jammu and Kashmir if present
  if (stateMap['Jammu and Kashmir']) {
    stateMap['Ladakh'] = { ...stateMap['Jammu and Kashmir'], dishes: [...stateMap['Jammu and Kashmir'].dishes] };
  }

  return Object.entries(stateMap).map(([state, data]) => {
    const pNonVeg = Number(((data.nonVeg / data.total) * 100).toFixed(1));
    const pVeg = Number(((data.veg / data.total) * 100).toFixed(1));
    return {
      state,
      p_non_veg: pNonVeg,
      p_veg: pVeg,
      total_dishes: data.total,
      veg_count: data.veg,
      non_veg_count: data.nonVeg,
      sample_dishes: data.dishes.slice(0, 4)
    };
  }).sort((a, b) => b.p_non_veg - a.p_non_veg);
}

// V2: Probability Density / KDE Data (Prep vs Cook)
export function getV2KdeData(bandwidth: number = 8) {
  const valid = ALL_DISHES.filter(d => d.prep_time !== null && d.cook_time !== null);
  const prep = valid.map(d => d.prep_time as number);
  const cook = valid.map(d => d.cook_time as number);

  // Gaussian kernel density estimation
  const gaussianKernel = (u: number) => (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * u * u);
  
  const kde = (data: number[], xVals: number[], h: number) => {
    const n = data.length;
    return xVals.map(x => {
      let sum = 0;
      for (let i = 0; i < n; i++) {
        sum += gaussianKernel((x - data[i]) / h);
      }
      return sum / (n * h);
    });
  };

  const xRange: number[] = [];
  for (let i = 0; i <= 150; i += 2) {
    xRange.push(i);
  }

  const prepDensities = kde(prep, xRange, bandwidth);
  const cookDensities = kde(cook, xRange, bandwidth);

  return xRange.map((minute, idx) => ({
    minute,
    prep_density: prepDensities[idx],
    cook_density: cookDensities[idx]
  }));
}

// V5: Sankey Flow Data (All Dishes -> Regions -> Grain)
export function getV5SankeyData() {
  const regionGrainCounts: Record<string, Record<string, number>> = {};
  const validDishes = ALL_DISHES.filter(d => d.region && d.region !== '-1');

  for (const d of validDishes) {
    const grain = d.is_rice === 1 ? 'Rice' : (d.is_wheat === 1 ? 'Wheat' : 'Other/None');
    if (!regionGrainCounts[d.region]) {
      regionGrainCounts[d.region] = { Rice: 0, Wheat: 0, 'Other/None': 0 };
    }
    regionGrainCounts[d.region][grain]++;
  }

  // Construct nodes and links
  const regions = Object.keys(regionGrainCounts).sort();
  const grains = ['Rice', 'Wheat', 'Other/None'];
  
  const nodes = [
    { id: 'all', name: 'All Indian Dishes', color: '#cef79e' },
    ...regions.map(r => ({ id: `reg-${r}`, name: `${r} India`, color: '#68d391' })),
    ...grains.map(g => ({ id: `grain-${g}`, name: g, color: g === 'Rice' ? '#63b3ed' : (g === 'Wheat' ? '#f6ad55' : '#b794f4') }))
  ];

  const nodeIndexMap = new Map(nodes.map((n, i) => [n.id, i]));
  const links: Array<{ source: number; target: number; value: number; label: string }> = [];

  // Link 1: All Dishes -> Regions
  for (const r of regions) {
    const regTotal = Object.values(regionGrainCounts[r]).reduce((a, b) => a + b, 0);
    links.push({
      source: nodeIndexMap.get('all')!,
      target: nodeIndexMap.get(`reg-${r}`)!,
      value: regTotal,
      label: `All → ${r}: ${regTotal} dishes`
    });
  }

  // Link 2: Regions -> Grains
  for (const r of regions) {
    for (const g of grains) {
      const count = regionGrainCounts[r][g] || 0;
      if (count > 0) {
        links.push({
          source: nodeIndexMap.get(`reg-${r}`)!,
          target: nodeIndexMap.get(`grain-${g}`)!,
          value: count,
          label: `${r} → ${g}: ${count} dishes`
        });
      }
    }
  }

  return { nodes, links, rawCounts: regionGrainCounts };
}

// V8: Top 20 Ingredients Frequency
export function getV8TopIngredients() {
  const ingMap: Record<string, number> = {};
  for (const d of ALL_DISHES) {
    const items = d.ingredients.split(',').map(s => s.trim().toLowerCase());
    for (const item of items) {
      if (!item) continue;
      ingMap[item] = (ingMap[item] || 0) + 1;
    }
  }

  return Object.entries(ingMap)
    .map(([ingredient, frequency]) => ({ ingredient, frequency }))
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 20);
}

// V9: Regional Spice Intensity Divergence
export function getV9SpiceDivergence() {
  const meanSpice = STATS.spice_intensity.mean;
  const regionalSpice = getConditionalExpectation('region', 'spice_intensity')
    .filter(r => r.group !== 'Unknown');

  return regionalSpice.map(r => ({
    region: r.group,
    spice_intensity: r.expectation,
    divergence: Number((r.expectation - meanSpice).toFixed(3)),
    sample_count: r.count
  })).sort((a, b) => a.divergence - b.divergence);
}

// V10: Outlier Trivia Board
export function getV10OutlierTrivia() {
  const mains = ALL_DISHES.filter(d => d.course === 'main course' && d.cook_time !== null)
    .sort((a, b) => (b.cook_time as number) - (a.cook_time as number));
  
  const slowestMains = mains.slice(0, 5).map(d => ({
    name: d.name,
    cook_time: d.cook_time as number,
    prep_time: d.prep_time,
    state: d.state,
    region: d.region,
    flavor_profile: d.flavor_profile,
    diet: d.diet,
    ingredients: d.ingredients
  }));

  const longestPrep = ALL_DISHES.filter(d => d.prep_time !== null)
    .sort((a, b) => (b.prep_time as number) - (a.prep_time as number))
    .slice(0, 5);

  const highestSpice = ALL_DISHES.slice()
    .sort((a, b) => b.spice_intensity - a.spice_intensity)
    .slice(0, 5);

  return {
    slowestMains,
    longestPrep,
    highestSpice
  };
}
