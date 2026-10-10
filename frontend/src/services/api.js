/**
 * Resilient API Service Client for RakshaPath
 * Features:
 * 1. Automatic detection of FastAPI backend if VITE_API_URL is configured and reachable.
 * 2. Instant, seamless fallback to Embedded Local Standalone Engine when offline or on Vercel.
 * 3. Connection health state reporting (never a blank screen).
 */

import {
  embeddedFetchStates,
  embeddedFetchNodes,
  embeddedFetchShelters,
  embeddedFetchHazards,
  embeddedFetchUnits,
  embeddedSearchLocations,
  embeddedFindNearestNode,
  embeddedEvaluateHazardRisk,
  embeddedCalculateRoute,
  embeddedCreateIncident,
  embeddedReportRoadBlock,
  embeddedRunDispatch,
  embeddedGetRegionsOverview,
  embeddedGetSimulationMetrics,
  embeddedResetNetwork
} from '../engine/embeddedApi';

const ENV_API_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/$/, '') : '';

// Connection status
let backendOnline = false;
let hasCheckedHealth = false;
const listeners = new Set();

function notifyStatus() {
  const state = getBackendHealthState();
  listeners.forEach((fn) => fn(state));
}

export function subscribeBackendHealth(fn) {
  listeners.add(fn);
  fn(getBackendHealthState());
  return () => listeners.delete(fn);
}

export function getBackendHealthState() {
  return {
    isOnline: backendOnline,
    mode: backendOnline ? 'Live FastAPI Backend' : 'Embedded Standalone Engine (Vercel Mode)',
    apiUrl: ENV_API_URL || 'Local Browser Engine'
  };
}

/**
 * Probes backend health with a timeout
 */
export async function checkBackendHealth() {
  if (!ENV_API_URL && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    // On production domain (e.g. Vercel) without explicit backend URL:
    // Default to embedded engine directly for instant 0ms startup
    backendOnline = false;
    hasCheckedHealth = true;
    notifyStatus();
    return false;
  }

  const probeUrl = ENV_API_URL ? `${ENV_API_URL}/` : '/api/states';
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s fast probe
    const res = await fetch(probeUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      backendOnline = true;
      hasCheckedHealth = true;
      notifyStatus();
      return true;
    }
  } catch (err) {
    // Backend unreachable
  }

  backendOnline = false;
  hasCheckedHealth = true;
  notifyStatus();
  return false;
}

// Initial health check probe on load
if (typeof window !== 'undefined') {
  setTimeout(() => { checkBackendHealth(); }, 100);
}

// ==========================================
// API METHODS (WITH AUTOMATIC ENGINE FALLBACK)
// ==========================================

export async function fetchStates() {
  if (ENV_API_URL || backendOnline) {
    try {
      const res = await fetch(`${ENV_API_URL}/api/states`);
      if (res.ok) {
        backendOnline = true;
        notifyStatus();
        return await res.json();
      }
    } catch (e) {
      backendOnline = false;
      notifyStatus();
    }
  }
  return embeddedFetchStates();
}

export async function fetchNodes(state = '') {
  if (ENV_API_URL || backendOnline) {
    try {
      const url = state ? `${ENV_API_URL}/api/nodes?state=${encodeURIComponent(state)}` : `${ENV_API_URL}/api/nodes`;
      const res = await fetch(url);
      if (res.ok) {
        backendOnline = true;
        notifyStatus();
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (e) {
      backendOnline = false;
      notifyStatus();
    }
  }
  return embeddedFetchNodes(state);
}

export async function fetchShelters(state = '', district = '') {
  if (ENV_API_URL || backendOnline) {
    try {
      let url = `${ENV_API_URL}/api/shelters`;
      const params = new URLSearchParams();
      if (state) params.append('state', state);
      if (district && district !== 'All Districts') params.append('district', district);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      if (res.ok) {
        backendOnline = true;
        notifyStatus();
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (e) {
      backendOnline = false;
      notifyStatus();
    }
  }
  return embeddedFetchShelters(state, district);
}

export async function fetchHazards(state = '') {
  if (ENV_API_URL || backendOnline) {
    try {
      const url = state ? `${ENV_API_URL}/api/hazards?state=${encodeURIComponent(state)}` : `${ENV_API_URL}/api/hazards`;
      const res = await fetch(url);
      if (res.ok) {
        backendOnline = true;
        notifyStatus();
        return await res.json();
      }
    } catch (e) {
      backendOnline = false;
      notifyStatus();
    }
  }
  return embeddedFetchHazards(state);
}

export async function fetchUnits(state = '') {
  if (ENV_API_URL || backendOnline) {
    try {
      const url = state ? `${ENV_API_URL}/api/units?state=${encodeURIComponent(state)}` : `${ENV_API_URL}/api/units`;
      const res = await fetch(url);
      if (res.ok) {
        backendOnline = true;
        notifyStatus();
        return await res.json();
      }
    } catch (e) {
      backendOnline = false;
      notifyStatus();
    }
  }
  return embeddedFetchUnits(state);
}

export async function searchLocations(query, state = '') {
  if (!query) return [];
  if (ENV_API_URL || backendOnline) {
    try {
      let url = `${ENV_API_URL}/api/search?q=${encodeURIComponent(query)}`;
      if (state) url += `&state=${encodeURIComponent(state)}`;
      const res = await fetch(url);
      if (res.ok) {
        backendOnline = true;
        notifyStatus();
        return await res.json();
      }
    } catch (e) {
      backendOnline = false;
      notifyStatus();
    }
  }
  return embeddedSearchLocations(query, state);
}

export async function findNearestNode(lat, lon, state = null) {
  if (ENV_API_URL || backendOnline) {
    try {
      const res = await fetch(`${ENV_API_URL}/api/nearest-node`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lon, state })
      });
      if (res.ok) {
        backendOnline = true;
        notifyStatus();
        return await res.json();
      }
    } catch (e) {
      backendOnline = false;
      notifyStatus();
    }
  }
  return embeddedFindNearestNode(lat, lon, state);
}

export async function evaluateHazardRisk(waterDepth, damage, debris, vehicleType) {
  if (ENV_API_URL || backendOnline) {
    try {
      const res = await fetch(`${ENV_API_URL}/api/hazards/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          water_depth_cm: Number(waterDepth),
          damage_level: Number(damage),
          debris_level: Number(debris),
          vehicle_type: vehicleType
        })
      });
      if (res.ok) {
        backendOnline = true;
        notifyStatus();
        return await res.json();
      }
    } catch (e) {
      backendOnline = false;
      notifyStatus();
    }
  }
  return embeddedEvaluateHazardRisk(waterDepth, damage, debris, vehicleType);
}

export async function calculateRoute(source, target, vehicleType, waterDepth, damage, debris, forecastHour = 0, scenarioId = 'heavy') {
  if (ENV_API_URL || backendOnline) {
    try {
      const res = await fetch(`${ENV_API_URL}/api/route`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source,
          target,
          vehicle_type: vehicleType,
          override_water_depth_cm: Number(waterDepth),
          override_damage_level: Number(damage),
          override_debris_level: Number(debris),
          forecast_hour: Number(forecastHour),
          scenario_id: scenarioId
        })
      });
      if (res.ok) {
        backendOnline = true;
        notifyStatus();
        const data = await res.json();
        if (data && data.success) return data;
      }
    } catch (e) {
      backendOnline = false;
      notifyStatus();
    }
  }
  // Standalone Embedded Fallback Solver
  return embeddedCalculateRoute({
    source,
    target,
    vehicleType,
    waterDepth,
    damage,
    debris,
    forecastHour,
    scenarioId
  });
}

export async function createIncident(incidentData) {
  if (ENV_API_URL || backendOnline) {
    try {
      const res = await fetch(`${ENV_API_URL}/api/incidents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(incidentData)
      });
      if (res.ok) {
        backendOnline = true;
        notifyStatus();
        return await res.json();
      }
    } catch (e) {
      backendOnline = false;
      notifyStatus();
    }
  }
  return embeddedCreateIncident(incidentData);
}

export async function reportRoadBlock(edgeKey) {
  return embeddedReportRoadBlock(edgeKey);
}

export async function runDispatchOptimization(state = 'Uttar Pradesh', overrides = {}) {
  return embeddedRunDispatch(state, overrides);
}

export async function fetchRegionsOverview() {
  return embeddedGetRegionsOverview();
}

export async function fetchSimulationMetrics() {
  return embeddedGetSimulationMetrics();
}

export async function resetNetworkGrid() {
  if (ENV_API_URL || backendOnline) {
    try {
      const res = await fetch(`${ENV_API_URL}/api/reset-network`, { method: 'POST' });
      if (res.ok) {
        backendOnline = true;
        notifyStatus();
        return await res.json();
      }
    } catch (e) {
      backendOnline = false;
      notifyStatus();
    }
  }
  return embeddedResetNetwork();
}
