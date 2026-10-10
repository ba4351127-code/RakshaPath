import React, { useState } from 'react';
import { 
  Route, 
  Clock, 
  AlertOctagon, 
  CheckCircle2, 
  ShieldCheck, 
  Navigation, 
  ListOrdered, 
  Scale, 
  Truck, 
  FileText, 
  Send, 
  Info,
  Check,
  Shield,
  Radio,
  ArrowRight
} from 'lucide-react';
import { createIncident } from '../services/api';

export default function DetailedReportSection({
  routeData,
  vehicleType,
  waterDepth,
  damageLevel,
  debrisLevel,
  selectedState,
  selectedDistrict,
  units = [],
  onIncidentReported,
  userRole,
  onOpenCrewMobileModal
}) {
  const [activeTab, setActiveTab] = useState('directions');
  const [activeCorridorView, setActiveCorridorView] = useState('primary'); // 'primary' | 'backup'

  // Incident reporting form state
  const [formTitle, setFormTitle] = useState('Water Inundation on Access Road');
  const [formType, setFormType] = useState('Flooding / Waterlogging');
  const [formSev, setFormSev] = useState('High');
  const [formWater, setFormWater] = useState(waterDepth || 50);
  const [formDamage, setFormDamage] = useState(damageLevel || 4.5);
  const [formDebris, setFormDebris] = useState(debrisLevel || 3.5);
  const [formDesc, setFormDesc] = useState('Floodwaters rising rapidly over bridge approach.');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitIncident = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const newInc = {
      title: formTitle,
      incident_type: formType,
      severity: formSev,
      state: selectedState,
      district: selectedDistrict !== 'All Districts' ? selectedDistrict : 'Sector Zone',
      lat: routeData?.source?.lat || 25.4358,
      lon: routeData?.source?.lon || 81.8463,
      water_depth_cm: Number(formWater),
      damage_level: Number(formDamage),
      debris_level: Number(formDebris),
      description: formDesc
    };
    await createIncident(newInc);
    setIsSubmitting(false);
    setSubmitSuccess(true);
    if (onIncidentReported) onIncidentReported();
    setTimeout(() => setSubmitSuccess(false), 4000);
  };

  const primaryCorridor = routeData?.safe_corridor;
  const backupCorridor = routeData?.backup_corridor;
  const shortestNaive = routeData?.shortest_naive;
  const isDetourAdvised = routeData?.is_detour_advised;

  // Selected corridor to view
  const currentCorridor = activeCorridorView === 'backup' && backupCorridor ? backupCorridor : primaryCorridor;
  const segments = currentCorridor?.segments || [];

  const safeDistance = currentCorridor ? currentCorridor.total_distance_km : 0;
  const naiveDistance = shortestNaive ? shortestNaive.total_distance_km : safeDistance;
  const detourDiff = Number((safeDistance - naiveDistance).toFixed(2));
  const safeRisk = currentCorridor ? currentCorridor.average_risk_multiplier : 1.0;
  const naiveRisk = shortestNaive ? shortestNaive.average_risk_multiplier : safeRisk;
  const transitTime = currentCorridor ? currentCorridor.estimated_transit_time_min : 0;
  const reliabilityScore = currentCorridor?.reliability_score_pct || 92.5;

  return (
    <section className="w-full bg-slate-900 border-t border-slate-800 p-4 sm:p-6 space-y-6 text-slate-100">
      {/* Header & Dual Corridor Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-sky-400"></div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>Detailed Incident & Corridor Report</span>
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Predictive corridor telemetry, soft-sigmoid passability physics, and multi-agency response metrics.
          </p>
        </div>

        {/* Dual Corridor Toggle Buttons */}
        <div className="flex items-center gap-2">
          {primaryCorridor && (
            <button
              type="button"
              onClick={() => setActiveCorridorView('primary')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                activeCorridorView === 'primary'
                  ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 shadow-md'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Primary Corridor ({primaryCorridor.reliability_score_pct}% R)</span>
            </button>
          )}

          {backupCorridor && (
            <button
              type="button"
              onClick={() => setActiveCorridorView('backup')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                activeCorridorView === 'backup'
                  ? 'bg-sky-500/20 border-sky-500/60 text-sky-300 shadow-md'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
              <span>Diverse Backup Corridor ({backupCorridor.reliability_score_pct}% R)</span>
            </button>
          )}

          {onOpenCrewMobileModal && (
            <button
              type="button"
              onClick={onOpenCrewMobileModal}
              className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-rose-500/40 text-rose-300 font-bold text-xs flex items-center gap-1.5"
            >
              <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>In-Cab View</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 Prominent Telemetry Metric Cards */}
      {currentCorridor ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Safe Distance */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Corridor Distance
              </span>
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center">
                <Route className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-white tracking-tight">
                {safeDistance} <span className="text-sm font-semibold text-slate-400">km</span>
              </div>
              <div className="text-xs mt-1 text-slate-400">
                {isDetourAdvised && detourDiff > 0 ? (
                  <span className="text-amber-400 font-semibold">+{detourDiff} km elevated bypass</span>
                ) : (
                  <span className="text-emerald-400 font-semibold">Direct corridor clear</span>
                )}
              </div>
            </div>
          </div>

          {/* Card 2: Transit Time */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Transit Duration (ETA)
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-white tracking-tight">
                {transitTime} <span className="text-sm font-semibold text-slate-400">mins</span>
              </div>
              <div className="text-xs mt-1 text-slate-400 truncate">
                Profile: <strong className="text-slate-200">{vehicleType}</strong>
              </div>
            </div>
          </div>

          {/* Card 3: Hazard Risk Multiplier */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Risk Multiplier
              </span>
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center">
                <AlertOctagon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-white tracking-tight">
                {safeRisk}x
              </div>
              <div className="text-xs mt-1 text-slate-400">
                {naiveRisk > safeRisk ? (
                  <span className="text-emerald-400 font-semibold">Avoided {naiveRisk}x flooded chokepoints</span>
                ) : (
                  <span className="text-slate-400">Nominal traction index</span>
                )}
              </div>
            </div>
          </div>

          {/* Card 4: Sigmoid Reliability Score R */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Reliability Score R
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-300 tracking-tight">
                {reliabilityScore}%
              </div>
              <div className="text-xs mt-1 font-semibold text-emerald-400">
                $R = \prod P_e$ (Passable Corridor)
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
          <Navigation className="w-8 h-8 text-sky-400 mx-auto animate-pulse" />
          <h3 className="text-sm font-bold text-white">No Corridor Calculated Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Select your starting location and safe destination on the left, then click <strong>"Calculate Dual Evacuation Corridors"</strong>.
          </p>
        </div>
      )}

      {/* Tabs Section: Turn-by-Turn Explanations, Comparison, Fleet, Report Hazard */}
      <div className="space-y-4">
        {/* Tab Buttons */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('directions')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'directions'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>Turn-by-Turn Navigation & Reasoning</span>
            {segments.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300 font-bold">
                {segments.length} steps
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('comparison')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'comparison'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Dual Route Comparison Matrix</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('report')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'report'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-rose-400" />
            <span>Report Road Hazard</span>
          </button>
        </div>

        {/* Tab 1: Plain-Language Turn-by-Turn Navigation with WHY explanations */}
        {activeTab === 'directions' && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Step-by-Step Corridor Guidance (Plain-Language Route Reasoning)
              </h3>
              <span className="text-[11px] text-sky-400 font-semibold">
                Viewing: {currentCorridor?.name || 'Active Corridor'}
              </span>
            </div>

            {segments.length === 0 ? (
              <p className="text-xs text-slate-400">
                No route waypoints calculated yet. Click "Calculate Dual Evacuation Corridors".
              </p>
            ) : (
              <div className="space-y-2.5">
                {segments.map((seg, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1.5 text-xs hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-sky-500/15 text-sky-400 font-bold flex items-center justify-center text-[11px] flex-shrink-0">
                          {i + 1}
                        </div>
                        <div className="font-bold text-white">
                          {seg.from_node} &rarr; {seg.to_node}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                          {seg.distance_km} km
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          seg.passability_p >= 0.70
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : seg.passability_p >= 0.40
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          {Math.round(seg.passability_p * 100)}% Passability
                        </span>
                      </div>
                    </div>

                    {/* WHY THIS ROUTE WAS CHOSEN EXPLANATION */}
                    <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 flex items-start gap-2">
                      <Info className="w-3.5 h-3.5 text-sky-400 flex-shrink-0 mt-0.5" />
                      <span className="leading-relaxed">
                        <strong>Reason for Selection:</strong> {seg.explanation}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Dual Route Comparison Matrix */}
        {activeTab === 'comparison' && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Comparison Matrix: Primary vs Diverse Backup vs Naive Blocked Path
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                    <th className="py-2.5 px-3">Metric Parameter</th>
                    <th className="py-2.5 px-3 text-emerald-400 font-bold">Primary Safe Route</th>
                    <th className="py-2.5 px-3 text-sky-400 font-bold">Diverse Backup Route</th>
                    <th className="py-2.5 px-3 text-rose-400 font-bold">Naive Shortest Path</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  <tr>
                    <td className="py-3 px-3 font-medium">Total Distance</td>
                    <td className="py-3 px-3 text-emerald-300 font-bold font-mono">
                      {primaryCorridor?.total_distance_km || 0} km
                    </td>
                    <td className="py-3 px-3 text-sky-300 font-bold font-mono">
                      {backupCorridor?.total_distance_km || 0} km
                    </td>
                    <td className="py-3 px-3 text-slate-400 font-mono">
                      {shortestNaive?.total_distance_km || 0} km
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3 px-3 font-medium">Transit Duration (ETA)</td>
                    <td className="py-3 px-3 text-emerald-300 font-bold font-mono">
                      {primaryCorridor?.estimated_transit_time_min || 0} mins
                    </td>
                    <td className="py-3 px-3 text-sky-300 font-bold font-mono">
                      {backupCorridor?.estimated_transit_time_min || 0} mins
                    </td>
                    <td className="py-3 px-3 text-rose-400 font-semibold">
                      Severely Delayed (High Water)
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3 px-3 font-medium">Reliability Score ($R = \prod P_e$)</td>
                    <td className="py-3 px-3 text-emerald-300 font-bold">
                      {primaryCorridor?.reliability_score_pct || 0}% (Optimal Safe)
                    </td>
                    <td className="py-3 px-3 text-sky-300 font-bold">
                      {backupCorridor?.reliability_score_pct || 0}% (Independent Escape)
                    </td>
                    <td className="py-3 px-3 text-rose-400 font-bold">
                      &lt; 5% (Hydrolocking Hazard)
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3 px-3 font-medium">Geographic Independence</td>
                    <td className="py-3 px-3 text-slate-300">Optimal elevated bridges</td>
                    <td className="py-3 px-3 text-sky-300 font-semibold">Zero shared flooded bottlenecks</td>
                    <td className="py-3 px-3 text-rose-400">Crosses lowest elevation basins</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Report Road Hazard Form */}
        {activeTab === 'report' && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Report Real-Time Road Danger / Blockage
                </h3>
                <p className="text-[11px] text-slate-400">
                  Submitted incidents dynamically update the routing and Hungarian dispatch engines in real time.
                </p>
              </div>
              <span className="text-[11px] text-sky-400 font-semibold">Sector: {selectedState}</span>
            </div>

            {submitSuccess && (
              <div className="p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Road hazard incident successfully logged! Network routing recalculating live corridors.</span>
              </div>
            )}

            <form onSubmit={handleSubmitIncident} className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Incident Title</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Problem Category</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-sky-500"
                >
                  <option value="Flooding / Waterlogging">Flooding / Waterlogging</option>
                  <option value="Road Structural Damage">Road Structural Damage</option>
                  <option value="Tree / Debris Obstruction">Tree / Debris Obstruction</option>
                  <option value="Bridge Submerged">Bridge Submerged</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Water Depth (cm): {formWater} cm</label>
                <input
                  type="range"
                  min="0"
                  max="140"
                  value={formWater}
                  onChange={(e) => setFormWater(Number(e.target.value))}
                  className="w-full accent-sky-500 h-1.5 bg-slate-800 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Damage Level (0-10): {formDamage}</label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={formDamage}
                  onChange={(e) => setFormDamage(Number(e.target.value))}
                  className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-slate-400 mb-1">Detailed Description & Landmark Notes</label>
                <textarea
                  rows="2"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-sky-500"
                  placeholder="Provide precise street names, nearby hospitals, or water level observations..."
                  required
                />
              </div>

              <div className="md:col-span-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>Broadcast Hazard Incident</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
