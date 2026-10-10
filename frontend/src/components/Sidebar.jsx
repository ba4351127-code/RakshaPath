import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Truck, 
  Waves, 
  RotateCcw, 
  ShieldAlert, 
  Sliders, 
  LifeBuoy,
  Layers
} from 'lucide-react';

const VEHICLE_OPTIONS = [
  { id: 'Ambulance', label: 'Ambulance', icon: '🚑', clearance: '30 cm', speed: '60 km/h' },
  { id: 'NDRF Truck', label: 'Rescue Truck', icon: '🚛', clearance: '85 cm', speed: '45 km/h' },
  { id: 'Flood Boat', label: 'Flood Rescue Boat', icon: '🚤', clearance: 'Deep Water', speed: '25 km/h' },
  { id: 'Rapid Response', label: 'Quick Relief Jeep', icon: '🚙', clearance: '45 cm', speed: '65 km/h' },
  { id: 'Evacuation Bus', label: 'Evacuation Bus', icon: '🚌', clearance: '40 cm', speed: '40 km/h' }
];

export default function Sidebar({
  isOpen,
  onToggle,
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
  onResetForm
}) {
  const [section1Open, setSection1Open] = useState(true);
  const [section2Open, setSection2Open] = useState(true);
  const [section3Open, setSection3Open] = useState(true);

  const statesList = Object.keys(statesData);
  const districtsList = ['All Districts', ...(statesData[selectedState] || [])];
  const activeVehicle = VEHICLE_OPTIONS.find((v) => v.id === vehicleType) || VEHICLE_OPTIONS[0];

  return (
    <aside
      className={`absolute top-0 bottom-0 left-0 z-30 transition-all duration-300 ease-in-out flex pointer-events-auto ${
        isOpen ? 'w-80 sm:w-96' : 'w-0'
      }`}
    >
      {/* Main Drawer Body */}
      <div className={`h-full w-full bg-slate-900/95 backdrop-blur-xl border-r border-slate-700/70 shadow-2xl flex flex-col overflow-hidden transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">Emergency Help & Rescue Portal</h2>
              <p className="text-[11px] text-slate-400">Step 1: Choose Location & Check Road Dangers</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Collapse Sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Controls Section */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* SECTION 1: LOCATION SELECTION */}
          <div className="border border-slate-800 bg-slate-900/60 rounded-xl overflow-hidden shadow-sm">
            <button
              onClick={() => setSection1Open(!section1Open)}
              className="w-full px-3.5 py-2.5 bg-slate-800/40 hover:bg-slate-800/70 flex items-center justify-between text-xs font-semibold text-slate-200 transition-colors"
            >
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky-400" />
                Where are you going? (Select Start & Safe Place)
              </span>
              <span className="text-slate-400 text-xs">{section1Open ? '−' : '+'}</span>
            </button>

            {section1Open && (
              <div className="p-3.5 space-y-3">
                {/* State Dropdown */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">State</label>
                  <select
                    value={selectedState}
                    onChange={(e) => onStateChange(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    {statesList.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                {/* District Dropdown */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">District / City</label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => onDistrictChange(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    {districtsList.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* Origin Hub */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Starting Location / Hub</label>
                  <select
                    value={selectedOrigin}
                    onChange={(e) => onOriginChange(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    {originNodes.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.name} [{n.category || 'Hub'}]
                      </option>
                    ))}
                  </select>
                </div>

                {/* Destination Safe Shelter */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Destination Safe Place / Shelter</label>
                  <select
                    value={selectedDest}
                    onChange={(e) => onDestChange(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    {destNodes.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.name} [{n.category || 'Shelter'}]
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: RESCUE VEHICLE PROFILE */}
          <div className="border border-slate-800 bg-slate-900/60 rounded-xl overflow-hidden shadow-sm">
            <button
              onClick={() => setSection2Open(!section2Open)}
              className="w-full px-3.5 py-2.5 bg-slate-800/40 hover:bg-slate-800/70 flex items-center justify-between text-xs font-semibold text-slate-200 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-400" />
                Select Rescue Vehicle (Ambulance, Bus, Boat)
              </span>
              <span className="text-slate-400 text-xs">{section2Open ? '−' : '+'}</span>
            </button>

            {section2Open && (
              <div className="p-3.5 space-y-3">
                <div className="grid grid-cols-1 gap-1.5">
                  {VEHICLE_OPTIONS.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => onVehicleChange(v.id)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs border transition-all ${
                        vehicleType === v.id
                          ? 'bg-amber-500/15 border-amber-500/50 text-amber-200 font-semibold'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{v.icon}</span>
                        <span>{v.label}</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {v.clearance} • {v.speed}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                  Active Asset: <strong>{activeVehicle.label}</strong> | Max Wading Limit: <code>{activeVehicle.clearance}</code> | Base Speed: <code>{activeVehicle.speed}</code>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 3: PHYSICAL HAZARD SLIDERS */}
          <div className="border border-slate-800 bg-slate-900/60 rounded-xl overflow-hidden shadow-sm">
            <button
              onClick={() => setSection3Open(!section3Open)}
              className="w-full px-3.5 py-2.5 bg-slate-800/40 hover:bg-slate-800/70 flex items-center justify-between text-xs font-semibold text-slate-200 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Waves className="w-4 h-4 text-rose-400" />
                Current Danger Level (Water logging, Damage, Debris)
              </span>
              <span className="text-slate-400 text-xs">{section3Open ? '−' : '+'}</span>
            </button>

            {section3Open && (
              <div className="p-3.5 space-y-3.5">
                {/* Water Depth Slider */}
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
                </div>

                {/* Road Damage Slider */}
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

                {/* Debris Obstruction Slider */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1 font-medium">
                    <span className="text-slate-400">Debris & Obstruction Level (0-10)</span>
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

                {/* Real-Time Physics Evaluation Card */}
                {hazardEvaluation && (
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Hazard Multiplier:</span>
                      <span className="font-mono font-bold text-white">{hazardEvaluation.risk_multiplier}x</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Road Condition:</span>
                      <span style={{ color: hazardEvaluation.color }} className="font-bold">
                        {hazardEvaluation.grade}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Can Vehicle Pass?:</span>
                      <span className={hazardEvaluation.is_passable ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                        {hazardEvaluation.is_passable ? '✅ YES (Passable)' : '❌ NO (Impassable / High Water)'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80">
          <button
            onClick={onResetForm}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold transition-all active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Form</span>
          </button>
        </div>
      </div>

      {/* Collapse Toggle Tab when closed */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="self-center p-2 rounded-r-xl bg-slate-900/90 hover:bg-slate-800 border border-l-0 border-slate-700 text-sky-400 shadow-xl backdrop-blur-md transition-all active:scale-95"
          title="Open Control Drawer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </aside>
  );
}
