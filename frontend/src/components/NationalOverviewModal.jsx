import React from 'react';
import { X, ShieldAlert, Waves, MapPin, ArrowRight, ExternalLink, Activity } from 'lucide-react';
import { PAN_INDIA_REGIONS } from '../engine/graphData';

export default function NationalOverviewModal({ isOpen, onClose, onSelectRegion }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-4xl max-h-[90vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold">
              🌐
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Pan-India Flood Command Center</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold">
                  7 Active River Basins
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                National overview of monsoon inundation zones, hydrological radar warnings, and instant sector deployment.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 7 Basin Cards Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {PAN_INDIA_REGIONS.map((region) => (
            <div
              key={region.id}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                region.id === 'prayagraj'
                  ? 'bg-gradient-to-b from-sky-950/40 to-slate-900 border-sky-500/60 shadow-lg shadow-sky-500/10'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-sky-400" />
                    <span>{region.name}</span>
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    region.severity === 'Critical'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : region.severity === 'High'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                  }`}>
                    {region.severity} Severity
                  </span>
                </div>

                <div className="text-xs space-y-1 text-slate-300">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">River Basin:</span>
                    <strong className="text-white">{region.basin}</strong>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Telemetry Trend:</span>
                    <strong className="text-amber-400 font-mono">{region.water_trend}</strong>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Key Elevated Corridor:</span>
                    <span className="text-emerald-300 truncate font-medium">{region.key_bridge}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 pt-1">
                    Radar Status: <span className="text-slate-200">{region.warning_level}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  {region.id === 'prayagraj' ? '★ Deep Pilot Calibrated' : 'Active Basin Sector'}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    onSelectRegion(region);
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  <span>Deploy to City</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>Continuous Hydrological Ingestion across National River Basins</span>
          <button
            onClick={onClose}
            className="text-sky-400 hover:underline font-semibold"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
}
