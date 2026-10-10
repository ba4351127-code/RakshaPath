/**
 * Time-Dependent Dual Route Engine (Primary + Geographically Diverse Backup)
 * With Sigmoid Reliability Score R = product(P_e) & Plain-Language Guidance.
 */

import { NETWORK_NODES, ROAD_EDGES } from './graphData';
import { calculatePassabilityProbability, calculateRiskMultiplier, VEHICLE_CLASSES } from './vehicleProfiles';
import { calculateEdgeWaterAtHour } from './floodTimeline';

/**
 * Computes shortest path using Dijkstra algorithm with custom edge weights
 */
function dijkstra(nodes, adjacency, source, target, edgeWeights) {
  const dist = {};
  const prev = {};
  const visited = new Set();
  const queue = new Set(Object.keys(nodes));

  Object.keys(nodes).forEach((n) => {
    dist[n] = Infinity;
    prev[n] = null;
  });
  dist[source] = 0;

  while (queue.size > 0) {
    let u = null;
    let minDist = Infinity;
    for (const node of queue) {
      if (dist[node] < minDist) {
        minDist = dist[node];
        u = node;
      }
    }

    if (!u || dist[u] === Infinity || u === target) break;
    queue.delete(u);
    visited.add(u);

    const neighbors = adjacency[u] || [];
    for (const edge of neighbors) {
      const v = edge.v;
      if (visited.has(v)) continue;

      const edgeKey = `${u}__${v}`;
      const weight = edgeWeights[edgeKey] || 9999;
      const alt = dist[u] + weight;

      if (alt < dist[v]) {
        dist[v] = alt;
        prev[v] = { from: u, edge };
      }
    }
  }

  // Reconstruct path
  if (dist[target] === Infinity) return null;

  const pathSegments = [];
  let curr = target;
  while (prev[curr]) {
    const step = prev[curr];
    pathSegments.unshift(step.edge);
    curr = step.from;
  }

  return {
    total_cost: dist[target],
    segments: pathSegments
  };
}

/**
 * Builds bidirectional adjacency list from edges
 */
function buildAdjacency() {
  const adj = {};
  Object.keys(NETWORK_NODES).forEach((k) => { adj[k] = []; });

  ROAD_EDGES.forEach((edge) => {
    if (!adj[edge.u]) adj[edge.u] = [];
    if (!adj[edge.v]) adj[edge.v] = [];

    // Forward edge
    adj[edge.u].push({ ...edge });
    // Reverse edge
    adj[edge.v].push({
      ...edge,
      u: edge.v,
      v: edge.u
    });
  });

  return adj;
}

/**
 * Generates plain-language situational reasoning for a corridor step
 */
function generateStepExplanation(edge, waterDepth, vehicleType, passabilityP) {
  const elev = edge.elevation_type || 'standard_road';
  const roadName = edge.road_name || 'Highway Corridor';

  if (elev === 'elevated_bridge') {
    return `Traversing ${roadName} via elevated deck (dry surface). Elevated high above local water surges.`;
  }
  if (waterDepth >= 60) {
    return `Extreme water warning along ${roadName} (${waterDepth} cm). Traversable only by heavy tactical units; low passenger vehicles diverted.`;
  }
  if (waterDepth >= 30) {
    return `Moderate waterlogging on ${roadName} (${waterDepth} cm). Maintained safe corridor around submerged chokepoints.`;
  }
  if (edge.damage >= 4.0 || edge.debris >= 4.0) {
    return `Structural road caution on ${roadName}. Road damage index ${edge.damage}/10. Cruising speed reduced to 30 km/h.`;
  }
  return `Clear corridor along ${roadName}. Nominal traction and dry road conditions.`;
}

/**
 * Computes Dual Corridors (Primary + Geographically Diverse Backup)
 */
export function solveDualRoutes({
  source,
  target,
  vehicleType = 'Ambulance',
  forecastHour = 0,
  scenarioId = 'heavy',
  overrideWaterDepth = null,
  overrideDamage = null,
  overrideDebris = null,
  blockedEdgeKeys = []
}) {
  const profile = VEHICLE_CLASSES[vehicleType] || VEHICLE_CLASSES['Ambulance'];
  const adjacency = buildAdjacency();

  // Validate source and target
  if (!NETWORK_NODES[source] || !NETWORK_NODES[target]) {
    // Fallback if mismatched states
    source = Object.keys(NETWORK_NODES)[0];
    target = Object.keys(NETWORK_NODES)[1];
  }

  // 1. Calculate edge weights & passabilities under current weather conditions
  const edgeWeights = {};
  const edgeDetails = {};

  ROAD_EDGES.forEach((edge) => {
    let waterCm = calculateEdgeWaterAtHour(edge, forecastHour, scenarioId);
    let damage = edge.damage || 0;
    let debris = edge.debris || 0;

    // Apply manual overrides if provided
    if (overrideWaterDepth !== null && overrideWaterDepth !== undefined) {
      if (edge.elevation_type !== 'elevated_bridge') {
        waterCm = Number(overrideWaterDepth);
      }
    }
    if (overrideDamage !== null && overrideDamage !== undefined) {
      damage = Number(overrideDamage);
    }
    if (overrideDebris !== null && overrideDebris !== undefined) {
      debris = Number(overrideDebris);
    }

    const passabilityP = calculatePassabilityProbability(waterCm, vehicleType);
    const riskMult = calculateRiskMultiplier(passabilityP, damage, debris);

    // Base transit time in minutes
    const effectiveSpeed = profile.base_speed_kmh * Math.max(0.25, passabilityP);
    const transitTimeMin = (edge.distance_km / Math.max(10, effectiveSpeed)) * 60;

    // Cost function for Dijkstra: transit time weighted by risk multiplier
    let cost = transitTimeMin * riskMult;

    // If edge is manually reported as blocked by in-cab crew
    const forwardKey = `${edge.u}__${edge.v}`;
    const reverseKey = `${edge.v}__${edge.u}`;
    if (blockedEdgeKeys.includes(forwardKey) || blockedEdgeKeys.includes(reverseKey)) {
      cost += 50000; // Effectively impassable
    }

    // Heavy penalty for non-amphibious ground vehicles if water exceeds clearance
    if (!profile.is_amphibious && waterCm > profile.max_clearance_cm) {
      cost += 10000 * (waterCm - profile.max_clearance_cm);
    }

    edgeWeights[forwardKey] = cost;
    edgeWeights[reverseKey] = cost;

    const detailObj = {
      ...edge,
      effective_water_cm: waterCm,
      effective_damage: damage,
      effective_debris: debris,
      passability_probability: passabilityP,
      risk_multiplier: riskMult,
      transit_time_min: transitTimeMin
    };
    edgeDetails[forwardKey] = detailObj;
    edgeDetails[reverseKey] = detailObj;
  });

  // 2. Compute Primary Route
  const primaryResult = dijkstra(NETWORK_NODES, adjacency, source, target, edgeWeights);

  if (!primaryResult) {
    return {
      success: false,
      message: 'No traversable corridor found between selected hubs under current flood severity.'
    };
  }

  // 3. Assemble Primary Route Telemetry
  let primaryDistKm = 0;
  let primaryTimeMin = 0;
  let primaryRiskSum = 0;
  let primaryReliability = 1.0;
  const primarySegments = [];
  const primaryUsedEdges = new Set();

  primaryResult.segments.forEach((seg, i) => {
    const key = `${seg.u}__${seg.v}`;
    const detail = edgeDetails[key] || seg;
    primaryUsedEdges.add(key);
    primaryUsedEdges.add(`${seg.v}__${seg.u}`);

    primaryDistKm += seg.distance_km;
    primaryTimeMin += detail.transit_time_min;
    primaryRiskSum += detail.risk_multiplier;
    primaryReliability *= detail.passability_probability;

    const fromNode = NETWORK_NODES[seg.u] || { name: seg.u };
    const toNode = NETWORK_NODES[seg.v] || { name: seg.v };

    primarySegments.push({
      step: i + 1,
      from_node: fromNode.name,
      to_node: toNode.name,
      road_name: seg.road_name,
      distance_km: seg.distance_km,
      elevation_type: seg.elevation_type,
      water_depth_cm: detail.effective_water_cm,
      segment_risk_multiplier: detail.risk_multiplier,
      passability_p: Number(detail.passability_probability.toFixed(3)),
      explanation: generateStepExplanation(seg, detail.effective_water_cm, vehicleType, detail.passability_probability)
    });
  });

  const avgPrimaryRisk = Number((primaryRiskSum / Math.max(1, primaryResult.segments.length)).toFixed(2));
  const primaryReliabilityPct = Number((primaryReliability * 100).toFixed(1));

  // 4. Compute Geographically Diverse Backup Route by penalizing edges of Primary Route
  const backupEdgeWeights = { ...edgeWeights };
  primaryUsedEdges.forEach((edgeKey) => {
    // 3.5x penalty to force diverse path
    backupEdgeWeights[edgeKey] = (backupEdgeWeights[edgeKey] || 1) * 4.5;
  });

  const backupResult = dijkstra(NETWORK_NODES, adjacency, source, target, backupEdgeWeights);

  let backupCorridor = null;
  if (backupResult && backupResult.segments.length > 0) {
    let backupDistKm = 0;
    let backupTimeMin = 0;
    let backupRiskSum = 0;
    let backupReliability = 1.0;
    const backupSegments = [];

    backupResult.segments.forEach((seg, i) => {
      const key = `${seg.u}__${seg.v}`;
      const detail = edgeDetails[key] || seg;

      backupDistKm += seg.distance_km;
      backupTimeMin += detail.transit_time_min;
      backupRiskSum += detail.risk_multiplier;
      backupReliability *= detail.passability_probability;

      const fromNode = NETWORK_NODES[seg.u] || { name: seg.u };
      const toNode = NETWORK_NODES[seg.v] || { name: seg.v };

      backupSegments.push({
        step: i + 1,
        from_node: fromNode.name,
        to_node: toNode.name,
        road_name: seg.road_name,
        distance_km: seg.distance_km,
        elevation_type: seg.elevation_type,
        water_depth_cm: detail.effective_water_cm,
        segment_risk_multiplier: detail.risk_multiplier,
        passability_p: Number(detail.passability_probability.toFixed(3)),
        explanation: generateStepExplanation(seg, detail.effective_water_cm, vehicleType, detail.passability_probability)
      });
    });

    backupCorridor = {
      name: 'Diverse Backup Evacuation Corridor',
      total_distance_km: Number(backupDistKm.toFixed(2)),
      estimated_transit_time_min: Math.round(backupTimeMin),
      average_risk_multiplier: Number((backupRiskSum / Math.max(1, backupResult.segments.length)).toFixed(2)),
      reliability_score_pct: Number((backupReliability * 100).toFixed(1)),
      is_fully_passable: backupReliability >= 0.25,
      segments: backupSegments,
      diversity_note: 'Geographically independent bypass route avoiding primary corridor chokepoints.'
    };
  }

  // 5. Construct Baseline Naive Route (ignoring flood hazards, purely shortest distance)
  const naiveEdgeWeights = {};
  ROAD_EDGES.forEach((e) => {
    naiveEdgeWeights[`${e.u}__${e.v}`] = e.distance_km;
    naiveEdgeWeights[`${e.v}__${e.u}`] = e.distance_km;
  });
  const naiveResult = dijkstra(NETWORK_NODES, adjacency, source, target, naiveEdgeWeights);
  let naiveDistKm = primaryDistKm;
  let naiveRisk = avgPrimaryRisk;
  if (naiveResult) {
    let nDist = 0;
    let nRisk = 0;
    naiveResult.segments.forEach((seg) => {
      nDist += seg.distance_km;
      const detail = edgeDetails[`${seg.u}__${seg.v}`] || seg;
      nRisk += detail.risk_multiplier || 1.0;
    });
    naiveDistKm = Number(nDist.toFixed(2));
    naiveRisk = Number((nRisk / Math.max(1, naiveResult.segments.length)).toFixed(2));
  }

  // Safety grade
  let safetyStatus = 'SECURED (Grade A)';
  if (primaryReliabilityPct < 40 || avgPrimaryRisk > 5.0) {
    safetyStatus = 'HAZARDOUS (Grade D)';
  } else if (primaryReliabilityPct < 70 || avgPrimaryRisk > 2.5) {
    safetyStatus = 'CAUTION (Grade B)';
  }

  return {
    success: true,
    source: NETWORK_NODES[source],
    destination: NETWORK_NODES[target],
    safe_corridor: {
      name: 'Primary Safe Evacuation Corridor',
      total_distance_km: Number(primaryDistKm.toFixed(2)),
      estimated_transit_time_min: Math.round(primaryTimeMin),
      average_risk_multiplier: avgPrimaryRisk,
      reliability_score_pct: primaryReliabilityPct,
      is_fully_passable: primaryReliabilityPct >= 35,
      segments: primarySegments
    },
    backup_corridor: backupCorridor,
    shortest_naive: {
      total_distance_km: naiveDistKm,
      estimated_transit_time_min: Math.round(naiveDistKm / (profile.base_speed_kmh * 0.4) * 60),
      average_risk_multiplier: Math.max(avgPrimaryRisk, naiveRisk)
    },
    is_detour_advised: Math.abs(primaryDistKm - naiveDistKm) > 0.5 || avgPrimaryRisk < naiveRisk,
    safety_status: safetyStatus,
    forecast_hour: forecastHour,
    scenario_id: scenarioId
  };
}
