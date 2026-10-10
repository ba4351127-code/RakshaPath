import React from 'react';
import { Route, Clock, AlertOctagon, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function TelemetryCards({ routeData, vehicleType }) {
  if (!routeData || !routeData.safe_corridor) return null;

  const { safe_corridor, shortest_naive, is_detour_advised, safety_status } = routeData;
  const naiveDist = shortest_naive?.total_distance_km || safe_corridor.total_distance_km;
  const detourDiff = Number((safe_corridor.total_distance_km - naiveDist).toFixed(2));
  const naiveRisk = shortest_naive?.average_risk_multiplier || 1.0;
  const riskSaved = Number((naiveRisk - safe_corridor.average_risk_multiplier).toFixed(1));

  return (
    <div className="absolute top-36 left-4 right-4 z-10 flex flex-col gap-2 pointer-events-none">
      {/* 4 Floating Telemetry HUD Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pointer-events-auto">
        {/* Distance Card */}
        <div className="px-4 py-3 bg-slate-900/85 backdrop-blur-md border border-slate-700/60 rounded-xl shadow-xl flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400">
            <Route className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Safe Route Distance</div>
            <div className="text-lg font-bold text-white tracking-tight">{safe_corridor.total_distance_km} km</div>
            <div className="text-[11px] font-medium text-slate-400">
              {is_detour_advised ? `+${detourDiff} km safe detour` : 'Direct Route Clear'}
            </div>
          </div>
        </div>

        {/* Travel Time Card */}
        <div className="px-4 py-3 bg-slate-900/85 backdrop-blur-md border border-slate-700/60 rounded-xl shadow-xl flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Est. Travel Time</div>
            <div className="text-lg font-bold text-white tracking-tight">{safe_corridor.estimated_transit_time_min} mins</div>
            <div className="text-[11px] font-medium text-slate-400">{vehicleType} @ Safe Speed</div>
          </div>
        </div>

        {/* Danger Multiplier Card */}
        <div className="px-4 py-3 bg-slate-900/85 backdrop-blur-md border border-slate-700/60 rounded-xl shadow-xl flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Road Danger Factor</div>
            <div className="text-lg font-bold text-white tracking-tight">{safe_corridor.average_risk_multiplier}x</div>
            <div className="text-[11px] font-medium text-emerald-400">
              {is_detour_advised ? `-${riskSaved}x safer vs blocked road` : 'Normal Safe Road'}
            </div>
          </div>
        </div>

        {/* Safety Grade Status Card */}
        <div className="px-4 py-3 bg-slate-900/85 backdrop-blur-md border border-slate-700/60 rounded-xl shadow-xl flex items-center gap-3">
          <div className={`p-2.5 rounded-lg border ${
            safe_corridor.is_fully_passable
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}>
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Corridor Safety Status</div>
            <div className="text-xs font-bold text-white truncate">{safety_status || 'SECURED'}</div>
            <div className={`text-[11px] font-semibold ${
              safe_corridor.is_fully_passable ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {safe_corridor.is_fully_passable ? '🟢 CLEAR & PASSABLE' : '🔴 IMPASSABLE / CAUTION'}
            </div>
          </div>
        </div>
      </div>

      {/* Advisory Alert Banner when Safe Detour is Activated */}
      {is_detour_advised && (
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/15 border border-amber-500/40 rounded-xl text-amber-200 text-xs backdrop-blur-md shadow-lg pointer-events-auto">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>
            <strong>Safer Route Found:</strong> Direct road has high water or structural damage ({naiveRisk}x hazard factor). RakshaPath has safely guided transit onto an elevated open detour corridor.
          </span>
        </div>
      )}
    </div>
  );
}
