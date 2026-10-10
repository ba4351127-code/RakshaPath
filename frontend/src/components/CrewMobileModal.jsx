import React, { useState } from 'react';
import { X, AlertOctagon, Navigation, ArrowRight, ShieldCheck, Check, Radio } from 'lucide-react';
import { reportRoadBlock } from '../services/api';

export default function CrewMobileModal({
  isOpen,
  onClose,
  routeData,
  vehicleType,
  onSwitchToBackupRoute
}) {
  const [reportedBlocked, setReportedBlocked] = useState(false);
  const [blockedRoadName, setBlockedRoadName] = useState('');

  if (!isOpen) return null;

  const primary = routeData?.safe_corridor;
  const backup = routeData?.backup_corridor;
  const currentStep = primary?.segments?.[0] || {
    road_name: 'Civil Lines Arterial Bypass',
    water_depth_cm: 22,
    to_node: 'SRN Apex Hospital'
  };

  const handleReportRoadblock = async () => {
    const road = currentStep.road_name || 'Active Corridor';
    setBlockedRoadName(road);
    setReportedBlocked(true);

    // Report block key to engine
    const edgeKey = `${currentStep.from_node}__${currentStep.to_node}`;
    await reportRoadBlock(edgeKey);

    // Trigger auto-switch to backup corridor
    if (onSwitchToBackupRoute) {
      onSwitchToBackupRoute();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="w-full max-w-lg bg-slate-900 border-2 border-slate-700 rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col">
        {/* In-Cab Status Bar */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-black uppercase tracking-wider text-slate-300">
              IN-CAB MOBILE NAVIGATION • {vehicleType}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Big In-Cab Navigation View */}
        <div className="p-6 space-y-6 flex-1">
          {reportedBlocked && (
            <div className="p-4 rounded-2xl bg-amber-500/20 border-2 border-amber-500/60 text-amber-200 text-xs space-y-1 shadow-lg">
              <div className="font-bold text-sm flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-amber-400" />
                <span>Roadblock Broadcasted to All Units!</span>
              </div>
              <p>
                Corridor along <strong>{blockedRoadName}</strong> marked impassable. Automatic failover: <strong>Diverse Backup Corridor is now ACTIVE</strong>.
              </p>
            </div>
          )}

          {/* Current Waypoint Heading Card */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 uppercase font-bold tracking-wider text-sky-400">
                <Navigation className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Active Target</span>
              </span>
              <span className="text-slate-300 font-mono font-bold">
                ETA: {primary?.estimated_transit_time_min || 15} mins
              </span>
            </div>

            <div className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
              {currentStep.to_node || 'Safe Relief Hub'}
            </div>

            <div className="text-xs text-slate-300 pt-1">
              Via: <strong className="text-amber-300">{currentStep.road_name}</strong>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <span className="text-slate-400">Current Water Depth:</span>
              <span className="font-mono font-bold text-sky-300">{currentStep.water_depth_cm || 0} cm</span>
            </div>
          </div>

          {/* Telemetry Metric Strip */}
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Corridor Reliability</div>
              <div className="text-xl font-black text-emerald-400 mt-0.5">
                {primary?.reliability_score_pct || 94}%
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Corridor Distance</div>
              <div className="text-xl font-black text-white mt-0.5">
                {primary?.total_distance_km || 4.2} km
              </div>
            </div>
          </div>

          {/* 1-TAP BIG RED "ROAD BLOCKED" BUTTON */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleReportRoadblock}
              className="w-full py-5 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-black text-base sm:text-lg tracking-wider shadow-2xl shadow-red-600/50 flex items-center justify-center gap-3 transition-all transform active:scale-95 cursor-pointer border-2 border-red-400/40"
            >
              <AlertOctagon className="w-6 h-6 text-white animate-pulse" />
              <span>1-TAP: ROAD BLOCKED (TRIGGER BACKUP ROUTE)</span>
            </button>
            <p className="text-[11px] text-slate-400 text-center mt-2">
              Instantly notifies 112 dispatch, marks edge impassable, and switches to Diverse Backup Route.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>In-Cab Tactical Telemetry Mode</span>
          <button
            onClick={onClose}
            className="text-sky-400 hover:underline font-semibold"
          >
            Exit In-Cab View
          </button>
        </div>
      </div>
    </div>
  );
}
