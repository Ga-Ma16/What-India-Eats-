import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.express as px
import plotly.graph_objects as go
from sklearn.metrics import mean_squared_error
import json
import requests

# ==========================================
# 1. DATA INGESTION & FEATURE ENGINEERING
# ==========================================
# Load and clean data
df = pd.read_csv('indian_food.csv')
df['prep_time'] = df['prep_time'].replace(-1, np.nan)
df['cook_time'] = df['cook_time'].replace(-1, np.nan)
df = df.replace('-1', np.nan)

# Engineer numerical features from text
df['is_rice'] = df['ingredients'].str.lower().str.contains('rice|poha').astype(int)
df['is_wheat'] = df['ingredients'].str.lower().str.contains('wheat|maida|atta|flour').astype(int)
df['is_dairy'] = df['ingredients'].str.lower().str.contains('milk|paneer|ghee|butter|yogurt|curd').astype(int)
spice_keywords = ['chili', 'chilli', 'garam masala', 'pepper', 'ginger', 'garlic', 'mustard']
df['spice_intensity'] = df['ingredients'].str.lower().apply(
    lambda x: sum(1 for spice in spice_keywords if spice in x)
)
df['total_time'] = df['prep_time'] + df['cook_time']
total_dishes = len(df)

# ==========================================
# 2. UNIT 1: MATHEMATICAL & STATISTICAL OUTPUT
# ==========================================
print("--- DATASET SHAPE & INTEGRITY ---")
print(f"Rows: {df.shape[0]}, Columns: {df.shape[1]}")
print(df.isnull().sum()[df.isnull().sum() > 0])

print("\n--- CONTINUOUS SUMMARY STATS & QUANTILES ---")
num_cols = ['prep_time', 'cook_time', 'total_time', 'spice_intensity']
stats = df[num_cols].describe(percentiles=[0.25, 0.50, 0.75]).T
stats['variance'] = df[num_cols].var()
stats['skewness'] = df[num_cols].skew()
print(stats[['count', 'mean', 'std', 'variance', 'min', '25%', '50%', '75%', 'max', 'skewness']])

print("\n--- CATEGORICAL FREQUENCIES (PRIORS) ---")
cat_cols = ['diet', 'flavor_profile', 'course', 'region']
for col in cat_cols:
    print(f"\n{col.upper()}:")
    print(df[col].value_counts(normalize=True) * 100)

print("\n--- CONDITIONAL EXPECTATIONS (E[X]) ---")
print("E[Cook Time | Diet]:\n", df.groupby('diet')['cook_time'].mean())
print("E[Cook Time | Flavor]:\n", df.groupby('flavor_profile')['cook_time'].mean())
print("E[Spice Intensity | Region]:\n", df.groupby('region')['spice_intensity'].mean().sort_values(ascending=False))

print("\n--- COVARIANCE & CORRELATION ---")
cov_df = df[['prep_time', 'cook_time', 'spice_intensity']].dropna()
print("Covariance Matrix:\n", cov_df.cov())
print("Correlation Matrix:\n", cov_df.corr())

print("\n--- DISCRETE PROBABILITY & BAYES RULE ---")
p_sweet = len(df[df['flavor_profile'] == 'sweet']) / total_dishes
p_veg_and_sweet = len(df[(df['diet'] == 'vegetarian') & (df['flavor_profile'] == 'sweet')]) / total_dishes
print(f"P(Vegetarian | Sweet) = {(p_veg_and_sweet / p_sweet)*100:.1f}%")

p_east = len(df[df['region'] == 'East']) / total_dishes
p_nonveg_and_east = len(df[(df['diet'] == 'non vegetarian') & (df['region'] == 'East')]) / total_dishes
print(f"P(Non-Veg | East) = {(p_nonveg_and_east / p_east)*100:.1f}%")

print("\n--- CONDITIONAL INDEPENDENCE TESTS ---")
p_rice = df['is_rice'].mean()
p_south = len(df[df['region'] == 'South']) / total_dishes
p_rice_and_south = len(df[(df['is_rice'] == 1) & (df['region'] == 'South')]) / total_dishes
print(f"Rice & South -> P(Rice)*P(South): {p_rice*p_south:.4f} | P(Rice AND South): {p_rice_and_south:.4f}")

print("\n--- POLYNOMIAL CURVE FITTING (MSE) ---")
curve_df = df.dropna(subset=['prep_time', 'cook_time'])
x, y = curve_df['prep_time'], curve_df['cook_time']
for degree in range(1, 6):
    y_pred = np.poly1d(np.polyfit(x, y, degree))(x)
    print(f"Degree {degree} MSE = {mean_squared_error(y, y_pred):.2f}")


# ==========================================
# 3. THE VISUALIZATION SUITE (FRONTEND PROTOTYPES)
# ==========================================
sns.set_theme(style="whitegrid")
plt.rcParams.update({'figure.max_open_warning': 0})

# V1: Dietary Heatmap Data (Bayes Rule: P(Non-Veg | State))
state_diet = pd.crosstab(df['state'], df['diet'], normalize='index') * 100
state_diet = state_diet.reset_index().rename(columns={'non vegetarian': 'p_non_veg'})

# Fetch the GeoJSON file containing India's state borders from the web
url = "https://gist.githubusercontent.com/jbrobst/56c13bbbf9d97d187fea01ca62ea5112/raw/e388c4cae20aa53cb5090210a42ebb9b765c0a36/india_states.geojson"
india_geojson = requests.get(url).json()

# 1. Handle state name mismatches
state_diet['state'] = state_diet['state'].replace({
    'NCT of Delhi': 'Delhi',
    'Jammu & Kashmir': 'Jammu and Kashmir',
    'Andaman & Nicobar Islands': 'Andaman & Nicobar Island'
})

# 2. Add Ladakh explicitly so we don't have a hole in the post-2019 map
ladakh_row = state_diet[state_diet['state'] == 'Jammu and Kashmir'].copy()
ladakh_row['state'] = 'Ladakh'
state_diet = pd.concat([state_diet, ladakh_row], ignore_index=True)

# 3. Render the actual Geospatial Choropleth Map
fig1 = px.choropleth(
    state_diet,
    geojson=india_geojson,
    featureidkey='properties.ST_NM', 
    locations='state',
    color='p_non_veg',
    color_continuous_scale='Reds',
    title="V1: Dietary Heatmap - P(Non-Veg | State)",
    hover_name='state'
)

# 4. Force dark borders so the 0% (White/Peach) states like J&K and Gujarat pop out!
fig1.update_traces(marker_line_color='black', marker_line_width=1)
fig1.update_geos(fitbounds="locations", visible=False)
fig1.update_layout(margin={"r":0,"t":40,"l":0,"b":0})
fig1.show()
# V2: Time-to-Cook Densities (Continuous Random Variables)
plt.figure(figsize=(10, 5))
sns.kdeplot(data=df, x='cook_time', fill=True, color="crimson", alpha=0.5, label='Cook Time')
sns.kdeplot(data=df, x='prep_time', fill=True, color="navy", alpha=0.5, label='Prep Time')
plt.title('V2: Probability Densities - Prep Time vs Cook Time', fontweight='bold')
plt.xlim(0, 150); plt.legend(); plt.show()

# V3: Polynomial Playground (Curve Fitting)
plt.figure(figsize=(10, 6))
sns.scatterplot(x=x, y=y, color='black', alpha=0.6)
x_range = np.linspace(x.min(), 150, 100)
plt.plot(x_range, np.poly1d(np.polyfit(x, y, 2))(x_range), color='blue', linestyle='--', label='Degree 2')
plt.plot(x_range, np.poly1d(np.polyfit(x, y, 3))(x_range), color='magenta', label='Degree 3')
plt.title('V3: Polynomial Curve Fitting', fontweight='bold')
plt.xlim(0, 150); plt.ylim(0, 150); plt.legend(); plt.show()

# V4: Regional KPIs (Expectation & Variance)
region_stats = df.groupby('region')['cook_time'].agg(Expectation='mean', Variance='var').reset_index().dropna()
fig4 = px.bar(region_stats, x='region', y=['Expectation', 'Variance'], barmode='group', 
              title="V4: Regional KPI - E[X] and Variance of Cook Time")
fig4.show()

import plotly.graph_objects as go

# V5: Grain Flow (Sankey Diagram)
sankey_data = df.dropna(subset=['region']).copy()
sankey_data['Grain'] = np.where(sankey_data['is_rice']==1, 'Rice', 
                       np.where(sankey_data['is_wheat']==1, 'Wheat', 'Other/None'))
flow_counts = sankey_data.groupby(['region', 'Grain']).size().reset_index(name='count')

# 1. Define the Nodes (The blocks in the flow chart)
regions = list(flow_counts['region'].unique())
grains = list(flow_counts['Grain'].unique())
nodes = ["All Indian Dishes"] + regions + grains

# Map nodes to integer indices for Plotly
node_indices = {node: i for i, node in enumerate(nodes)}
sources = []
targets = []
values = []

# 2. Link 1: All Dishes -> Regions
region_totals = flow_counts.groupby('region')['count'].sum()
for region, count in region_totals.items():
    sources.append(node_indices["All Indian Dishes"])
    targets.append(node_indices[region])
    values.append(count)

# 3. Link 2: Regions -> Grains
for _, row in flow_counts.iterrows():
    sources.append(node_indices[row['region']])
    targets.append(node_indices[row['Grain']])
    values.append(row['count'])

# 4. Render the Sankey Diagram
fig5 = go.Figure(data=[go.Sankey(
    node=dict(
        pad=20, thickness=30,
        line=dict(color="black", width=0.5),
        label=nodes,
        color="#4A90E2"
    ),
    link=dict(
        source=sources, target=targets, value=values,
        color="rgba(200, 200, 200, 0.4)"
    )
)])

fig5.update_layout(title_text="V5: Regional Grain Flow & Conditional Dependence", font_size=14)
fig5.show()

# V6: Flavor Radar Chart
flavor_counts = df['flavor_profile'].value_counts(normalize=True) * 100
fig6 = go.Figure(data=go.Scatterpolar(
  r=flavor_counts.values, theta=flavor_counts.index.str.title(),
  fill='toself', marker_color='indigo'
))
fig6.update_layout(title="V6: Flavor Profile Distribution (Radar)")
fig6.show()

# V7: Covariance Matrix Heatmap
plt.figure(figsize=(6, 5))
sns.heatmap(cov_df.corr(), annot=True, cmap='coolwarm', vmin=-1, vmax=1, linewidths=1)
plt.title('V7: Correlation Heatmap', fontweight='bold')
plt.show()

# V8: Ingredient Bubble Packing (Plotly Scatter Proxy)
all_ingredients = [i.strip() for i in ','.join(df['ingredients']).lower().split(',')]
ing_df = pd.Series(all_ingredients).value_counts().head(20).reset_index()
ing_df.columns = ['ingredient', 'frequency']
fig8 = px.scatter(ing_df, x='ingredient', y='frequency', size='frequency', 
                  color='frequency', title="V8: Top 20 Ingredients (Bubble Packing)", size_max=40)
fig8.show()

# V9: Spice Intensity (Diverging Bar Chart)
spice_region = df.groupby('region')['spice_intensity'].mean().reset_index()
spice_region['divergence'] = spice_region['spice_intensity'] - df['spice_intensity'].mean()
fig9 = px.bar(spice_region.sort_values('divergence'), x='divergence', y='region', orientation='h',
              color='divergence', color_continuous_scale='RdBu_r', title="V9: Regional Spice Intensity Divergence")
fig9.show()

# V10: Outlier Trivia Board
slowest_mains = df[df['course'] == 'main course'].sort_values('cook_time', ascending=False).head(5)
fig10 = px.bar(slowest_mains, x='cook_time', y='name', orientation='h', 
               title="V10: Outlier Trivia - Slowest Main Courses", color_discrete_sequence=['#ff4b4b'])
fig10.show()