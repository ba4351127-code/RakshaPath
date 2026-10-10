/**
 * Vehicle Profiles & Soft-Sigmoid Passability Model
 * P(d) = 1 / (1 + exp(k * (d - d_safe)))
 */

export const VEHICLE_CLASSES = {
  'Ambulance': {
    id: 'Ambulance',
    name: 'Advanced Life Support Ambulance',
    icon: '🚑',
    d_safe_cm: 25.0,
    k_slope: 0.25,
    max_clearance_cm: 30.0,
    max_damage_tolerance: 5.0,
    max_debris_tolerance: 4.0,
    base_speed_kmh: 60.0,
    is_amphibious: false,
    capacity: 2,
    description: 'Standard ALS ambulance with high-speed medical transit.'
  },
  'NDRF Truck': {
    id: 'NDRF Truck',
    name: 'NDRF Heavy Rescue Truck / Fire Tender',
    icon: '🚛',
    d_safe_cm: 70.0,
    k_slope: 0.15,
    max_clearance_cm: 85.0,
    max_damage_tolerance: 8.5,
    max_debris_tolerance: 7.5,
    base_speed_kmh: 45.0,
    is_amphibious: false,
    capacity: 12,
    description: 'Heavy tactical high-chassis rescue vehicle for deep water.'
  },
  'Flood Boat': {
    id: 'Flood Boat',
    name: 'Tactical Flood Rescue Boat',
    icon: '🚤',
    d_safe_cm: 200.0,
    k_slope: 0.05,
    min_water_depth_cm: 15.0,
    max_clearance_cm: 999.0,
    max_damage_tolerance: 9.0,
    max_debris_tolerance: 6.0,
    base_speed_kmh: 25.0,
    is_amphibious: true,
    capacity: 8,
    description: 'Inflatable rescue boat; requires water to operate.'
  },
  'Rapid Response': {
    id: 'Rapid Response',
    name: 'Rapid Response 4x4 Recon Unit',
    icon: '🚙',
    d_safe_cm: 45.0,
    k_slope: 0.20,
    max_clearance_cm: 55.0,
    max_damage_tolerance: 7.0,
    max_debris_tolerance: 6.0,
    base_speed_kmh: 65.0,
    is_amphibious: false,
    capacity: 4,
    description: 'All-terrain 4WD command vehicle for rapid scouting.'
  },
  'Evacuation Bus': {
    id: 'Evacuation Bus',
    name: 'Civilian Evacuation Transport Bus',
    icon: '🚌',
    d_safe_cm: 35.0,
    k_slope: 0.22,
    max_clearance_cm: 42.0,
    max_damage_tolerance: 4.5,
    max_debris_tolerance: 3.5,
    base_speed_kmh: 40.0,
    is_amphibious: false,
    capacity: 45,
    description: 'Mass transit civilian evacuation carrier.'
  }
};

/**
 * Computes the soft-sigmoid passability probability P(d) in [0, 1]
 * P(d) = 1 / (1 + exp(k * (d - d_safe)))
 */
export function calculatePassabilityProbability(waterDepthCm, vehicleType = 'Ambulance') {
  const profile = VEHICLE_CLASSES[vehicleType] || VEHICLE_CLASSES['Ambulance'];

  // Special physics for flood boat
  if (profile.is_amphibious) {
    if (waterDepthCm < profile.min_water_depth_cm) {
      // Boat cannot traverse dry ground or shallow puddles
      return 0.02;
    }
    // Boat thrives in water >= 15 cm
    return Math.min(0.99, 0.85 + Math.min(150, waterDepthCm) * 0.001);
  }

  // Non-amphibious ground vehicles: sigmoid curve
  const exponent = profile.k_slope * (waterDepthCm - profile.d_safe_cm);
  // Guard against exponential overflow
  if (exponent > 15) return 0.0001;
  if (exponent < -15) return 0.9999;

  const p = 1.0 / (1.0 + Math.exp(exponent));
  return Math.max(0.0001, Math.min(0.9999, p));
}

/**
 * Computes dynamic risk multiplier from passability probability and road condition
 */
export function calculateRiskMultiplier(passabilityP, damageLevel = 0, debrisLevel = 0) {
  // If passability is near 1, multiplier is close to 1.0. As passability drops, multiplier spikes.
  const waterRisk = 1.0 + (1.0 - passabilityP) * 12.0 + (passabilityP < 0.2 ? 35.0 : 0.0);
  const damageRisk = 1.0 + Math.pow(Math.min(10, Math.max(0, damageLevel)) / 10.0, 1.8) * 3.5;
  const debrisRisk = 1.0 + Math.pow(Math.min(10, Math.max(0, debrisLevel)) / 10.0, 1.6) * 2.5;

  return Number((waterRisk * damageRisk * debrisRisk).toFixed(2));
}

/**
 * Evaluates comprehensive hazard profile for a given water depth and vehicle
 */
export function evaluateVehicleHazard(waterDepthCm, damageLevel = 0, debrisLevel = 0, vehicleType = 'Ambulance') {
  const profile = VEHICLE_CLASSES[vehicleType] || VEHICLE_CLASSES['Ambulance'];
  const prob = calculatePassabilityProbability(waterDepthCm, vehicleType);
  const riskMult = calculateRiskMultiplier(prob, damageLevel, debrisLevel);
  const isPassable = prob >= 0.40;

  // Grade classification
  let grade = 'OPTIMAL_SAFE';
  let color = '#10b981';
  let statement = 'Clear corridor within vehicle safety threshold.';

  if (prob >= 0.85 && riskMult <= 1.5) {
    grade = 'GRADE A (Optimal Safe)';
    color = '#10b981';
    statement = `Nominal conditions. ${profile.name} can transit at standard cruising speed.`;
  } else if (prob >= 0.55 && riskMult <= 3.5) {
    grade = 'GRADE B (Moderate Caution)';
    color = '#38bdf8';
    statement = `Surface water detected (${waterDepthCm} cm). Reduced speed advised.`;
  } else if (prob >= 0.35 && riskMult <= 8.0) {
    grade = 'GRADE C (Elevated Risk)';
    color = '#f59e0b';
    statement = `Approaching safe wading limit (${profile.d_safe_cm} cm). Hydrolocking hazard.`;
  } else {
    grade = 'GRADE D (Impassable / Flood Hazard)';
    color = '#f43f5e';
    statement = `Submerged roadway (${waterDepthCm} cm). Exceeds safe clearance. Rerouting required.`;
  }

  // Effective cruising speed
  const speedFactor = Math.max(0.2, prob);
  const effectiveSpeedKmh = Number((profile.base_speed_kmh * speedFactor).toFixed(1));

  return {
    risk_multiplier: riskMult,
    passability_probability: Number(prob.toFixed(3)),
    grade,
    color,
    is_passable: isPassable,
    effective_speed_kmh: effectiveSpeedKmh,
    statement
  };
}
