import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  MapPin, 
  AlertTriangle, 
  Navigation, 
  LogOut, 
  Globe, 
  Cpu, 
  BarChart3, 
  HelpCircle, 
  Truck,
  Activity,
  Layers
} from 'lucide-react';
import { searchLocations } from '../services/api';

const METRO_ZONES = [
  { label: 'Prayagraj (Pilot)', node: 'UP_PRY_SANGAM_CHOKE', state: 'Uttar Pradesh', district: 'Prayagraj' },
  { label: 'Delhi NCR', node: 'DEL_HQ', state: 'Delhi NCR', district: 'Central Delhi' },
  { label: 'Patna', node: 'BR_PATNA_GHAT_CHOKE', state: 'Bihar', district: 'Patna' },
  { label: 'Guwahati', node: 'AS_GHY_GHAT_CHOKE', state: 'Assam', district: 'Guwahati' },
  { label: 'Mumbai', node: 'MH_SION_LOWLAND_CHOKE', state: 'Maharashtra', district: 'Mumbai' },
  { label: 'Chennai', node: 'TN_ADYAR_RIVER_CHOKE', state: 'Tamil Nadu', district: 'Chennai' },
  { label: 'Kolkata', node: 'WB_HOWRAH_CHOKE', state: 'West Bengal', district: 'Kolkata' }
];

export default function Header({
  selectedState,
  onSelectCity,
  onUseLocation,
  onSimulateFlood,
  onSelectSearchNode,
  userRole,
  onSwitchRole,
  backendState,
  onOpenNationalOverview,
  onOpenDispatchModal,
  onOpenSimulationModal,
  onOpenCrewMobileModal,
  onOpenGuideModal
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setDropdownOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchLocations(searchQuery.trim(), selectedState);
      setSearchResults(results);
      setDropdownOpen(results.length > 0);
      setIsSearching(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedState]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isOnline = backendState?.isOnline;

  return (
    <header className="px-4 py-3 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 flex flex-col gap-2.5 z-20 shadow-lg">
      {/* Top Bar: Bilingual Branding & Action Buttons */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 w-full">
        {/* Left: Bilingual Project Identity */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold text-base shadow-inner">
            🛡️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black text-white tracking-tight flex items-center gap-1.5">
                <span>RakshaPath</span>
                <span className="text-sky-400 font-bold font-sans">|</span>
                <span className="text-sky-300 font-normal">रक्ष पथ</span>
              </h1>

              {/* Status Indicator Pill */}
              <span
                className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                  isOnline
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    : 'bg-sky-500/15 border-sky-500/40 text-sky-300'
                }`}
                title={isOnline ? 'Connected to FastAPI REST API' : 'Running on Embedded Standalone Engine in Browser'}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-sky-400'}`}></span>
                <span>{isOnline ? 'FastAPI Live' : 'Embedded Engine (Vercel Standalone)'}</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Predictive Emergency Routing & Dispatch Platform
            </p>
          </div>
        </div>

        {/* Right Action Modals Bar */}
        <div className="flex items-center flex-wrap gap-1.5 w-full lg:w-auto">
          {/* Pan-India Command Center Button */}
          <button
            type="button"
            onClick={onOpenNationalOverview}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 rounded-xl text-xs font-semibold shadow-sm transition-all"
            title="Open Pan-India 7 River Basin Command Center"
          >
            <Globe className="w-3.5 h-3.5 text-sky-400" />
            <span>Pan-India Basins</span>
          </button>

          {/* Hungarian Dispatch Button */}
          <button
            type="button"
            onClick={onOpenDispatchModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 rounded-xl text-xs font-semibold shadow-sm transition-all"
            title="Open Hungarian Joint Dispatch Optimizer"
          >
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span>Dispatch Optimizer</span>
          </button>

          {/* In-Cab Crew Mobile View */}
          <button
            type="button"
            onClick={onOpenCrewMobileModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 rounded-xl text-xs font-semibold shadow-sm transition-all"
            title="In-Cab Driver Screen with 1-Tap Road Blocked trigger"
          >
            <Truck className="w-3.5 h-3.5 text-rose-400" />
            <span>Crew Mobile</span>
          </button>

          {/* Simulation Benchmark Button */}
          <button
            type="button"
            onClick={onOpenSimulationModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 rounded-xl text-xs font-semibold shadow-sm transition-all"
            title="View SimPy discrete-event simulation benchmarks"
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Simulation</span>
          </button>

          {/* User Guide Button */}
          <button
            type="button"
            onClick={onOpenGuideModal}
            className="flex items-center gap-1.5 px-2 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded-xl text-xs font-semibold"
            title="Platform Guide"
          >
            <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
            <span>Guide</span>
          </button>

          {/* Switch Role Button */}
          {onSwitchRole && (
            <button
              type="button"
              onClick={onSwitchRole}
              className="flex items-center gap-1 px-2 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 rounded-xl text-xs font-semibold"
              title="Return to Welcome Screen to switch user role"
            >
              <LogOut className="w-3 h-3 text-slate-400" />
              <span>Exit</span>
            </button>
          )}
        </div>
      </div>

      {/* Middle Row: Autocomplete Search Bar & GPS / Flood Warning triggers */}
      <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
        {/* Search Input with Autocomplete */}
        <div className="relative flex-1 w-full" ref={dropdownRef}>
          <div className="flex items-center px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl shadow-inner focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/20 transition-all">
            <Search className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search emergency hospital, shelter, or bridge (e.g., Sangam Ghats, SRN Hospital, Shastri Bridge, AIIMS, Bandra-Worli)..."
              className="w-full bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none"
            />
            {isSearching && (
              <div className="w-3.5 h-3.5 border-2 border-sky-400 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {dropdownOpen && (
            <div className="absolute left-0 right-0 top-full mt-1.5 max-h-56 overflow-y-auto bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl py-1 z-50">
              {searchResults.map((node) => (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => {
                    onSelectSearchNode(node);
                    setDropdownOpen(false);
                    setSearchQuery(node.name);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs hover:bg-slate-800 transition-colors flex items-center justify-between border-b border-slate-800 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-200">{node.name}</div>
                      <div className="text-[10px] text-slate-400">
                        {node.district}, {node.state}
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] rounded bg-slate-800 text-slate-300 font-medium">
                    {node.category || 'Hub'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* GPS Location & Flood Test buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={onUseLocation}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-950 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-95"
            title="Locate nearest emergency staging hub from device GPS"
          >
            <Navigation className="w-3.5 h-3.5 text-sky-400" />
            <span className="whitespace-nowrap">My GPS Location</span>
          </button>

          <button
            type="button"
            onClick={onSimulateFlood}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-800 rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-95"
            title="Simulate 85cm waterlogging surge on primary route"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span className="whitespace-nowrap">Simulate Surge</span>
          </button>
        </div>
      </div>

      {/* Bottom Row: Quick Metropolitan City Jumpers */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
        <span className="text-[10px] uppercase font-bold text-slate-500 whitespace-nowrap mr-1">
          Flood Zones:
        </span>
        {METRO_ZONES.map((city) => (
          <button
            key={city.label}
            type="button"
            onClick={() => onSelectCity(city)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all whitespace-nowrap shadow-sm ${
              selectedState === city.state
                ? 'bg-sky-500/20 border-sky-400 text-sky-300 font-semibold'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            📍 {city.label}
          </button>
        ))}
      </div>
    </header>
  );
}
