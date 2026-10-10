import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CloudRain, Clock, AlertTriangle } from 'lucide-react';
import { RAIN_SCENARIOS } from '../engine/floodTimeline';

export default function TimelineControl({
  forecastHour,
  onHourChange,
  scenarioId,
  onScenarioChange,
  maxWaterDepthCm = 45,
  rainfallMm = 110
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Play timeline ticker: 1 step every 1.8 seconds
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        onHourChange((prev) => (prev >= 6 ? 0 : prev + 1));
      }, 1800);
    }
    return () => clearInterval(timer);
  }, [isPlaying, onHourChange]);

  const activeScenario = RAIN_SCENARIOS[scenarioId] || RAIN_SCENARIOS['heavy'];

  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs z-10 shadow-sm">
      {/* Left: Weather Scenario Selector */}
      <div className="flex items-center gap-2 w-full md:w-auto">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-500/15 border border-sky-500/30 text-sky-300 font-bold">
          <CloudRain className="w-3.5 h-3.5 text-sky-400" />
          <span>Weather Scenario:</span>
        </div>
        <select
          value={scenarioId}
          onChange={(e) => onScenarioChange(e.target.value)}
          className="bg-slate-950 border border-slate-700 text-white rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-sky-500 font-semibold"
        >
          {Object.values(RAIN_SCENARIOS).map((sc) => (
            <option key={sc.id} value={sc.id}>{sc.name}</option>
          ))}
        </select>
      </div>

      {/* Center: 0 - 6 Hours Timeline Slider with Play/Pause */}
      <div className="flex items-center gap-3 w-full md:flex-1 max-w-xl">
        <button
          type="button"
          onClick={() => setIsPlaying(!isPlaying)}
          className={`p-1.5 rounded-lg border flex items-center justify-center transition-all ${
            isPlaying
              ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
              : 'bg-slate-800 border-slate-700 text-slate-200 hover:text-white hover:bg-slate-700'
          }`}
          title={isPlaying ? 'Pause forecast timeline' : 'Auto-play 6-hour flood forecast'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>

        <div className="flex-1 flex flex-col gap-1">
          <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-sky-400" />
              <span>Forecast: <strong>T + {forecastHour}h</strong></span>
            </span>
            <span className="text-slate-300">
              Rainfall: <strong>{activeScenario.rainfall_rate_mmh * Math.max(1, forecastHour)} mm</strong>
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="6"
            step="1"
            value={forecastHour}
            onChange={(e) => {
              setIsPlaying(false);
              onHourChange(Number(e.target.value));
            }}
            className="w-full accent-sky-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />

          <div className="flex justify-between text-[9px] text-slate-500 font-mono px-0.5">
            <span>Now (0h)</span>
            <span>+1h</span>
            <span>+2h</span>
            <span>+3h</span>
            <span>+4h</span>
            <span>+5h</span>
            <span>+6h (Peak)</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsPlaying(false);
            onHourChange(0);
          }}
          className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white"
          title="Reset to Hour 0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right: Live Predictive Alert Badge */}
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
          <span className="text-slate-400">Peak Water:</span>
          <strong className="text-sky-300 font-mono">{maxWaterDepthCm} cm</strong>
        </span>
        <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
          forecastHour >= 4 || maxWaterDepthCm >= 70
            ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
            : forecastHour >= 2 || maxWaterDepthCm >= 35
            ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
            : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
        }`}>
          <AlertTriangle className="w-3 h-3" />
          <span>{forecastHour >= 4 ? 'Surge Peak' : forecastHour >= 2 ? 'Inundation Rising' : 'Nominal Transit'}</span>
        </span>
      </div>
    </div>
  );
}
