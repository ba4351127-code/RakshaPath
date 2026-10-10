import React from 'react';
import { 
  MapPin, 
  Truck, 
  Waves, 
  RotateCcw, 
  Navigation,
  Shield,
  Activity,
  Sliders,
  CheckCircle2,
  AlertOctagon,
  LogOut,
  UserCheck,
  Compass,
  Radio
} from 'lucide-react';
import { VEHICLE_CLASSES } from '../engine/vehicleProfiles';

const VEHICLE_OPTIONS = [
  { id: 'Ambulance', label: 'Ambulance', icon: '🚑', clearance: '30 cm', speed: '60 km/h', d_safe: '25 cm' },
  { id: 'NDRF Truck', label: 'NDRF Heavy Truck / Fire Tender', icon: '🚛', clearance: '85 cm', speed: '45 km/h', d_safe: '70 cm' },
  { id: 'Flood Boat', label: 'Tactical Flood Boat', icon: '🚤', clearance: 'Deep Water', speed: '25 km/h', d_safe: '200 cm' },
  { id: 'Rapid Response', label: 'Rapid Response 4x4', icon: '🚙', clearance: '55 cm', speed: '65 km/h', d_safe: '45 cm' },
  { id: 'Evacuation Bus', label: 'Evacuation Bus', icon: '🚌', clearance: '42 cm', speed: '40 km/h', d_safe: '35 cm' }
];

export default function Sidebar({
  statesData,
  selectedState,
  onStateChange,
  selectedDistrict,
  onDistrictChange,
  originNodes,
  selectedOrigin,
  onOriginChange,
  destNodes,
  selectedDest,
  onDestChange,
  vehicleType,
  onVehicleChange,
  waterDepth,
  onWaterDepthChange,
  damageLevel,
  onDamageLevelChange,
  debrisLevel,
  onDebrisLevelChange,
  hazardEvaluation,
  onCalculateRoute,
  isCalculating,
  onResetForm,
  userRole,
  onSwitchRole,
  backendState,
  onOpenCrewMobileModal
}) {
  const statesList = Object.keys(statesData);
  const districtsList = ['All Districts', ...(statesData[selectedState] || [])];
  const activeVehicle = VEHICLE_OPTIONS.find((v) => v.id === vehicleType) || VEHICLE_OPTIONS[0];
  const isOnline = backendState?.isOnline;

  return (
    <aside className="w-80 lg:w-[390px] h-full flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col z-20 shadow-2xl">
      {/* Brand Header & Role Switcher */}
      <div className="p-4 border-b border-slate-800 bg-slate-950 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold text-base shadow-inner">
              🛡️
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-white tracking-tight leading-tight flex items-center gap-1.5">
                <span>RakshaPath</span>
                <span className="text-sky-400">|</span>
                <span className="text-sky-300 font-normal">रक्ष पथ</span>
              </h1>
              <p className="text-[10px] font-medium text-slate-400">
                National Emergency Mobility Network
              </p>
            </div>
          </div>

          <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
            isOnline
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-sky-500/10 border-sky-500/30 text-sky-400'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-sky-400'}`}></span>
            {isOnline ? 'API Live' : 'Local Engine'}
          </span>
        </div>

        {/* User Session Role Bar & Switch Role Button */}
        <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px]">
          <div className="flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-slate-400">Role:</span>
            <span className="font-bold text-sky-300">
              {userRole === 'Field Responder / Evaluator' ? 'Field Responder' : (userRole || 'Citizen')}
            </span>
          </div>

          {onSwitchRole && (
            <button
              type="button"
              onClick={onSwitchRole}
              className="text-[10px] font-semibold text-slate-400 hover:text-white flex items-center gap-1 hover:underline transition-colors"
              title="Return to Welcome Screen to switch role"
            >
              <LogOut className="w-3 h-3 text-slate-400" />
              <span>Switch Role</span>
            </button>
          )}
        </div>
      </div>

      {/* Structured Vertical Multi-Step Form (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* STEP 1: CHOOSE LOCATION */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <div className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center text-xs">
              1
            </div>
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Choose Location & Safe Shelter
            </h2>
          </div>

          {/* State Select */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">State / Region</label>
            <select
              value={selectedState}
              onChange={(e) => onStateChange(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
            >
              {statesList.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* District Select */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">District / City</label>
            <select
              value={selectedDistrict}
              onChange={(e) => onDistrictChange(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
            >
              {districtsList.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Origin Hub */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Starting Location / Staging Hub</label>
            <select
              value={selectedOrigin}
              onChange={(e) => onOriginChange(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
            >
              {originNodes.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.name} [{n.category || 'Hub'}]
                </option>
              ))}
            </select>
          </div>

          {/* Destination Shelter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Target Verified Shelter / Hospital</label>
            <select
              value={selectedDest}
              onChange={(e) => onDestChange(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
            >
              {destNodes.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.name} [{n.category || 'Shelter'}]
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* STEP 2: SELECT RESCUE VEHICLE WITH SIGMOID CALIBRATION */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs">
              2
            </div>
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Select Rescue Vehicle Class
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-1.5">
            {VEHICLE_OPTIONS.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => onVehicleChange(v.id)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs border transition-all ${
                  vehicleType === v.id
                    ? 'bg-amber-500/15 border-amber-500/60 text-amber-200 font-semibold shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/80'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{v.icon}</span>
                  <span className="truncate">{v.label}</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                  Safe: {v.d_safe} • {v.speed}
                </span>
              </button>
            ))}
          </div>

          <div className="text-[11px] text-slate-400 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 space-y-1">
            <div>
              Vehicle: <strong className="text-white">{activeVehicle.label}</strong>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Sigmoid Safe Wading $d_{`\\text{safe}`}$: <strong>{activeVehicle.d_safe}</strong> | Max Clearance: <strong>{activeVehicle.clearance}</strong>
            </div>
          </div>
        </div>

        {/* STEP 3: CURRENT DANGER LEVELS & SOFT-SIGMOID PROBABILITY */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 font-bold flex items-center justify-center text-xs">
              3
            </div>
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Hazard Calibration & Sigmoid Physics
            </h2>
          </div>

          {/* Water Depth */}
          <div>
            <div className="flex justify-between text-[11px] mb-1 font-medium">
              <span className="text-slate-400">Water Depth on Road (cm)</span>
              <span className="text-white font-mono font-bold">{waterDepth} cm</span>
            </div>
            <input
              type="range"
              min="0"
              max="140"
              step="5"
              value={waterDepth}
              onChange={(e) => onWaterDepthChange(Number(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
              <span>0 cm (Dry)</span>
              <span>45 cm (Moderate)</span>
              <span>140 cm (Flooded)</span>
            </div>
          </div>

          {/* Road Damage */}
          <div>
            <div className="flex justify-between text-[11px] mb-1 font-medium">
              <span className="text-slate-400">Road Damage Level (0-10)</span>
              <span className="text-white font-mono font-bold">{damageLevel}/10</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={damageLevel}
              onChange={(e) => onDamageLevelChange(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
          </div>

          {/* Debris Obstruction */}
          <div>
            <div className="flex justify-between text-[11px] mb-1 font-medium">
              <span className="text-slate-400">Debris & Obstruction (0-10)</span>
              <span className="text-white font-mono font-bold">{debrisLevel}/10</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={debrisLevel}
              onChange={(e) => onDebrisLevelChange(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
          </div>

          {/* Real-Time Physics Hazard Card */}
          {hazardEvaluation && (
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Sigmoid Passability $P(d)$:</span>
                <span className="font-mono font-bold text-sky-400">
                  {hazardEvaluation.passability_probability !== undefined 
                    ? `${(hazardEvaluation.passability_probability * 100).toFixed(1)}%`
                    : 'Evaluated'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Risk Multiplier:</span>
                <span className="font-mono font-bold text-white">{hazardEvaluation.risk_multiplier}x</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Safety Classification:</span>
                <span style={{ color: hazardEvaluation.color }} className="font-bold">
                  {hazardEvaluation.grade}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Can Vehicle Navigate?:</span>
                <span className={hazardEvaluation.is_passable ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {hazardEvaluation.is_passable ? '✅ Passable' : '❌ Impassable (High Water)'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Shortcut to In-Cab Crew View */}
        {onOpenCrewMobileModal && (
          <button
            type="button"
            onClick={onOpenCrewMobileModal}
            className="w-full py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-rose-500/40 text-rose-300 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>Open In-Cab Crew Mobile View</span>
          </button>
        )}
      </div>

      {/* Prominent Action Buttons at Bottom of Sidebar */}
      <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-col gap-2">
        <button
          type="button"
          onClick={onCalculateRoute}
          disabled={isCalculating}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
        >
          {isCalculating ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <Navigation className="w-4 h-4" />
          )}
          <span>Calculate Dual Evacuation Corridors</span>
        </button>

        <button
          type="button"
          onClick={onResetForm}
          className="w-full py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-800 flex items-center justify-center gap-1.5 transition-all active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          <span>Reset Form to Baseline</span>
        </button>
      </div>
    </aside>
  );
}
