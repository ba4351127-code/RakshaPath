/**
 * Predictive Flood Timeline Engine (0 - 6 Hours)
 * Simulates hydrological rainfall scenarios & dynamic water depth evolution.
 */

export const RAIN_SCENARIOS = {
  'light': {
    id: 'light',
    name: 'Light Rain (15 mm/h)',
    rainfall_rate_mmh: 15,
    surge_multiplier: 0.35,
    description: 'Minor surface waterlogging. Fast urban runoff drainage.'
  },
  'heavy': {
    id: 'heavy',
    name: 'Heavy Monsoon Downpour (55 mm/h)',
    rainfall_rate_mmh: 55,
    surge_multiplier: 1.0,
    description: 'Severe monsoon downpour. Lowland underpasses submerge steadily.'
  },
  'extreme': {
    id: 'extreme',
    name: 'Extreme Cloudburst / Dam Release (120 mm/h)',
    rainfall_rate_mmh: 120,
    surge_multiplier: 2.2,
    description: 'Emergency inundation surge. Riverbanks overflow into arterial corridors.'
  }
};

/**
 * Calculates water depth (cm) on a road edge at forecast hour t in [0, 6]
 */
export function calculateEdgeWaterAtHour(edge, hour = 0, scenarioId = 'heavy') {
  const scenario = RAIN_SCENARIOS[scenarioId] || RAIN_SCENARIOS['heavy'];
  const baseWater = edge.base_water_cm || 0;
  const elevationType = edge.elevation_type || 'standard_road';

  // Elevated bridges never flood significantly due to gravity drainage
  if (elevationType === 'elevated_bridge') {
    return Math.min(2.0, baseWater * 0.05);
  }

  // Rate of rise (cm/hour) based on topography
  let riseRateCmPerHour = 0;
  switch (elevationType) {
    case 'lowland_underpass':
      // Lowlands bowl effect: rapidly accumulates water
      riseRateCmPerHour = 12.0 * scenario.surge_multiplier;
      break;
    case 'river_crossway':
      // River crossway: water swells with upstream river discharge
      riseRateCmPerHour = 10.0 * scenario.surge_multiplier;
      break;
    case 'coastal_corridor':
      // Tidal surge effect
      riseRateCmPerHour = 8.0 * scenario.surge_multiplier;
      break;
    case 'standard_road':
    default:
      // Standard roads drain partially
      riseRateCmPerHour = 4.5 * scenario.surge_multiplier;
      break;
  }

  // Compute depth at hour t
  const depth = Math.max(0, baseWater + (riseRateCmPerHour * hour));
  return Number(depth.toFixed(1));
}

/**
 * Generates hourly flood projection metrics for a region/scenario
 */
export function getHourlyForecastSummary(hour = 0, scenarioId = 'heavy', edges = []) {
  const scenario = RAIN_SCENARIOS[scenarioId] || RAIN_SCENARIOS['heavy'];
  let totalEdges = 0;
  let submergedEdges = 0;
  let maxWaterCm = 0;

  edges.forEach((edge) => {
    totalEdges++;
    const depth = calculateEdgeWaterAtHour(edge, hour, scenarioId);
    if (depth > maxWaterCm) maxWaterCm = depth;
    if (depth >= 40.0) submergedEdges++;
  });

  const impassableRatio = totalEdges > 0 ? (submergedEdges / totalEdges) : 0;

  let alertLevel = 'NORMAL';
  let badgeColor = '#10b981';
  if (impassableRatio > 0.45 || maxWaterCm > 90) {
    alertLevel = 'CRITICAL FLOOD EMERGENCY';
    badgeColor = '#f43f5e';
  } else if (impassableRatio > 0.20 || maxWaterCm > 50) {
    alertLevel = 'ELEVATED FLOOD WARNING';
    badgeColor = '#f59e0b';
  } else if (maxWaterCm > 25) {
    alertLevel = 'MODERATE CAUTION';
    badgeColor = '#38bdf8';
  }

  return {
    hour,
    scenario_name: scenario.name,
    max_water_depth_cm: maxWaterCm,
    submerged_corridors_count: submergedEdges,
    total_corridors_count: totalEdges,
    alert_level: alertLevel,
    badge_color: badgeColor,
    rainfall_accumulated_mm: Math.round(scenario.rainfall_rate_mmh * Math.max(1, hour))
  };
}
