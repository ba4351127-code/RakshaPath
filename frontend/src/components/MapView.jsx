import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { NETWORK_NODES } from '../engine/graphData';

const STATE_CENTERS = {
  'Uttar Pradesh': [25.4358, 81.8463], // Focused on Prayagraj pilot
  'Delhi NCR': [28.6139, 77.2090],
  'Bihar': [25.6000, 85.1400],
  'Assam': [26.1550, 91.7500],
  'Maharashtra': [19.0500, 72.8800],
  'Tamil Nadu': [13.0827, 80.2707],
  'West Bengal': [22.5700, 88.3600],
  'Uttarakhand': [30.1500, 78.3500],
  'Gujarat': [23.0300, 72.5800]
};

export default function MapView({
  nodes = [],
  hazards = [],
  units = [],
  routeData = null,
  selectedOrigin = '',
  selectedDest = '',
  selectedState = 'Uttar Pradesh'
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersRef = useRef({
    markers: null,
    hazards: null,
    units: null,
    primaryRoute: null,
    backupRoute: null,
    blockedRoute: null
  });

  // 1. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const defaultCenter = STATE_CENTERS[selectedState] || [25.4358, 81.8463];
      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 12,
        zoomControl: false
      });

      // Standard OpenStreetMap tiles (100% free, zero API key)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      // Add Zoom Control to bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Initialize layer groups
      layersRef.current.markers = L.layerGroup().addTo(map);
      layersRef.current.hazards = L.layerGroup().addTo(map);
      layersRef.current.units = L.layerGroup().addTo(map);
      layersRef.current.primaryRoute = L.layerGroup().addTo(map);
      layersRef.current.backupRoute = L.layerGroup().addTo(map);
      layersRef.current.blockedRoute = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;

      // Smooth ResizeObserver to prevent gray tile rendering
      const resizeObserver = new ResizeObserver(() => {
        map.invalidateSize();
      });
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 2. Pan to State Center when state changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedState) return;

    if (!routeData) {
      const center = STATE_CENTERS[selectedState] || [25.4358, 81.8463];
      const zoom = selectedState === 'Uttar Pradesh' ? 12 : 11;
      map.setView(center, zoom, { animate: true });
    }
  }, [selectedState, routeData]);

  // 3. Render Infrastructure Nodes & Custom Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !layersRef.current.markers) return;

    layersRef.current.markers.clearLayers();

    const displayNodes = nodes.length > 0 ? nodes : Object.entries(NETWORK_NODES).map(([id, n]) => ({ id, ...n }));

    displayNodes.forEach((node) => {
      const isOrigin = node.id === selectedOrigin;
      const isDest = node.id === selectedDest;

      let markerColor = '#64748b'; // default slate
      let iconSymbol = '📍';

      if (isOrigin) {
        markerColor = '#0284c7'; // Sky Blue
        iconSymbol = '🚩';
      } else if (isDest) {
        markerColor = '#10b981'; // Emerald Green
        iconSymbol = '🏁';
      } else if (node.category === 'Hospital') {
        markerColor = '#ef4444'; // Red
        iconSymbol = '🏥';
      } else if (node.category === 'Elevated Corridor') {
        markerColor = '#059669'; // Emerald
        iconSymbol = '🌉';
      } else if (node.category === 'Relief Shelter') {
        markerColor = '#8b5cf6'; // Purple
        iconSymbol = '⛺';
      } else if (node.category === 'Bridge/Chokepoint') {
        markerColor = '#f59e0b'; // Amber
        iconSymbol = '⚠️';
      }

      const customHtml = `
        <div style="
          background-color: ${markerColor};
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #ffffff;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.5);
          font-size: 13px;
        ">
          ${iconSymbol}
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-hub-icon',
        html: customHtml,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14]
      });

      const marker = L.marker([node.lat, node.lon], { icon: customIcon });
      marker.bindPopup(`
        <div style="font-family: inherit;">
          <strong style="color: #ffffff; font-size: 13px;">${node.name}</strong><br/>
          <span style="color: #94a3b8; font-size: 11px;">Category: <strong>${node.category || 'Emergency Hub'}</strong></span><br/>
          <span style="color: #94a3b8; font-size: 11px;">District: ${node.district || 'N/A'}, ${node.state || ''}</span>
          ${node.total_beds ? `<br/><span style="color: #34d399; font-size: 11px;">Free ICU Beds: <strong>${node.icu_beds_free || 12}</strong></span>` : ''}
          ${node.capacity ? `<br/><span style="color: #a78bfa; font-size: 11px;">Shelter Capacity: <strong>${node.capacity}</strong></span>` : ''}
        </div>
      `);
      marker.addTo(layersRef.current.markers);
    });
  }, [nodes, selectedOrigin, selectedDest]);

  // 4. Render Hazard Incidents
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !layersRef.current.hazards) return;

    layersRef.current.hazards.clearLayers();

    hazards.forEach((inc) => {
      const circle = L.circleMarker([inc.lat, inc.lon], {
        radius: 14,
        fillColor: '#e11d48',
        color: '#f43f5e',
        weight: 2,
        opacity: 0.9,
        fillOpacity: 0.45
      });

      circle.bindPopup(`
        <div style="font-family: inherit;">
          <strong style="color: #f43f5e; font-size: 13px;">🚨 ${inc.title}</strong><br/>
          <span style="color: #cbd5e1; font-size: 11px;">Type: <strong>${inc.incident_type}</strong> | Severity: <strong>${inc.severity}</strong></span><br/>
          <span style="color: #cbd5e1; font-size: 11px;">Water Depth: <strong>${inc.water_depth_cm} cm</strong></span><br/>
          <span style="color: #cbd5e1; font-size: 11px;">Road Damage: <strong>${inc.damage_level}/10</strong> | Debris: <strong>${inc.debris_level}/10</strong></span><br/>
          <em style="color: #94a3b8; font-size: 10px;">${inc.description || ''}</em>
        </div>
      `);
      circle.addTo(layersRef.current.hazards);
    });
  }, [hazards]);

  // 5. Render Active Rescue Units
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !layersRef.current.units) return;

    layersRef.current.units.clearLayers();

    units.forEach((u) => {
      const unitHtml = `
        <div style="
          background-color: #065f46;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #34d399;
          box-shadow: 0 4px 6px rgba(0,0,0,0.4);
          font-size: 11px;
        ">
          🚑
        </div>
      `;

      const unitIcon = L.divIcon({
        className: 'custom-unit-icon',
        html: unitHtml,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const m = L.marker([u.lat, u.lon], { icon: unitIcon });
      m.bindPopup(`
        <div>
          <strong style="color: #34d399;">🚑 ${u.name}</strong><br/>
          <span style="font-size: 11px; color: #94a3b8;">Asset: ${u.unit_type}</span><br/>
          <span style="font-size: 11px; color: #94a3b8;">Max Wading: ${u.water_clearance_cm} cm</span><br/>
          <span style="font-size: 11px; color: #94a3b8;">Speed: ${u.speed_kmh} km/h</span>
        </div>
      `);
      m.addTo(layersRef.current.units);
    });
  }, [units]);

  // 6. Render Dual Corridors (Primary Emerald + Diverse Backup Sky Blue + Naive Blocked Red)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    layersRef.current.primaryRoute.clearLayers();
    layersRef.current.backupRoute.clearLayers();
    layersRef.current.blockedRoute.clearLayers();

    if (!routeData) return;

    const allPoints = [];

    // Helper: extract coordinates from corridor
    const extractCoords = (corridor) => {
      if (!corridor) return [];
      if (corridor.waypoints && corridor.waypoints.length > 0) {
        return corridor.waypoints.map((w) => [w.lat, w.lon]);
      }
      if (corridor.segments && corridor.segments.length > 0) {
        const pts = [];
        corridor.segments.forEach((seg, i) => {
          // Check u/v or from/to
          let fromNode = NETWORK_NODES[seg.u] || Object.values(NETWORK_NODES).find((n) => n.name === seg.from_node);
          let toNode = NETWORK_NODES[seg.v] || Object.values(NETWORK_NODES).find((n) => n.name === seg.to_node);

          if (fromNode && i === 0) pts.push([fromNode.lat, fromNode.lon]);
          if (toNode) pts.push([toNode.lat, toNode.lon]);
        });
        return pts;
      }
      return [];
    };

    // 1. Blocked Direct Route (Red Dashed) if Detour Advised
    if (routeData.is_detour_advised && routeData.shortest_naive) {
      const blockedCoords = extractCoords(routeData.shortest_naive);
      if (blockedCoords.length > 1) {
        L.polyline(blockedCoords, {
          color: '#dc2626',
          weight: 4,
          opacity: 0.75,
          dashArray: '8, 8'
        }).bindTooltip('⚠️ Compromised Direct Road (Flooded Chokepoints)').addTo(layersRef.current.blockedRoute);
        allPoints.push(...blockedCoords);
      }
    }

    // 2. Geographically Diverse Backup Route (Sky Blue Dashed)
    if (routeData.backup_corridor) {
      const backupCoords = extractCoords(routeData.backup_corridor);
      if (backupCoords.length > 1) {
        L.polyline(backupCoords, {
          color: '#0284c7',
          weight: 5,
          opacity: 0.85,
          dashArray: '6, 6'
        }).bindTooltip(`🛡️ Backup Evacuation Corridor (${routeData.backup_corridor.reliability_score_pct}% Reliability)`).addTo(layersRef.current.backupRoute);
        allPoints.push(...backupCoords);
      }
    }

    // 3. Primary Safe Evacuation Route (High Visibility Emerald Polyline)
    if (routeData.safe_corridor) {
      const primaryCoords = extractCoords(routeData.safe_corridor);
      if (primaryCoords.length > 1) {
        L.polyline(primaryCoords, {
          color: '#059669',
          weight: 6,
          opacity: 0.95
        }).bindTooltip(`✅ Primary Safe Route (${routeData.safe_corridor.reliability_score_pct}% Reliability)`).addTo(layersRef.current.primaryRoute);
        allPoints.push(...primaryCoords);
      }
    }

    // Auto fit bounds
    if (allPoints.length > 0) {
      const bounds = L.latLngBounds(allPoints);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [routeData]);

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Interactive Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-10 bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 text-[10px] space-y-1.5 shadow-xl max-w-xs pointer-events-auto">
        <div className="font-bold text-slate-300 uppercase tracking-wider text-[9px] border-b border-slate-800 pb-1">
          Corridor Legend & Map Layers
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-1 bg-emerald-500 rounded"></span>
          <span className="text-slate-200">Primary Safe Route (Solid Green)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-1 border-t-2 border-dashed border-sky-400"></span>
          <span className="text-slate-200">Diverse Backup Route (Dashed Blue)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-1 border-t-2 border-dashed border-red-500"></span>
          <span className="text-slate-200">Flooded Direct Road (Dashed Red)</span>
        </div>
        <div className="flex items-center gap-2 pt-1 border-t border-slate-850">
          <span className="text-xs">🏥</span>
          <span className="text-slate-400">Hospital with Verified ICU Beds</span>
        </div>
      </div>
    </div>
  );
}
