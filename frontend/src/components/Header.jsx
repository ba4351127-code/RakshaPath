import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, AlertTriangle, Shield, Radio, Navigation } from 'lucide-react';
import { searchLocations } from '../services/api';

const CITY_PRESETS = [
  { label: 'Delhi NCR', node: 'DEL_HQ', state: 'Delhi NCR', district: 'Central Delhi' },
  { label: 'Lucknow', node: 'UP_SGPGI_LKO', state: 'Uttar Pradesh', district: 'Lucknow' },
  { label: 'Agra', node: 'UP_AGRA_HOSP', state: 'Uttar Pradesh', district: 'Agra' },
  { label: 'Varanasi', node: 'UP_BHU_TRAUMA', state: 'Uttar Pradesh', district: 'Varanasi' },
  { label: 'Dehradun', node: 'UK_DEHRADUN_HQ', state: 'Uttarakhand', district: 'Dehradun' },
  { label: 'Mumbai', node: 'MH_MUMBAI_HQ', state: 'Maharashtra', district: 'Mumbai' },
  { label: 'Patna', node: 'BR_AIIMS_PATNA', state: 'Bihar', district: 'Patna' },
  { label: 'Kolkata', node: 'WB_SSKM_HOSPITAL', state: 'West Bengal', district: 'Kolkata' }
];

export default function Header({
  selectedState,
  onSelectCity,
  onUseLocation,
  onSimulateFlood,
  onSelectSearchNode
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

  return (
    <header className="absolute top-4 left-4 right-4 z-20 flex flex-col gap-2.5 pointer-events-none">
      {/* Top Hero Brand & Status Banner */}
      <div className="flex items-center justify-between px-5 py-2.5 bg-slate-900/90 backdrop-blur-md border border-slate-700/60 rounded-xl shadow-2xl pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 font-bold text-lg shadow-inner">
            🛡️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-base tracking-tight">RAKSHAPATH</span>
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full bg-sky-500 text-slate-950">
                Emergency Mobility Network
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Risk-Weighted Safe Emergency Routing • Avoid Floods, Landslides & Roadblocks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Core: ONLINE</span>
          </div>
        </div>
      </div>

      {/* Floating Search Bar and Action Controls */}
      <div className="flex flex-col sm:flex-row gap-2 pointer-events-auto">
        {/* Search Input with Autocomplete */}
        <div className="relative flex-1" ref={dropdownRef}>
          <div className="flex items-center px-4 py-2.5 bg-slate-900/90 backdrop-blur-md border border-slate-700/70 rounded-xl shadow-lg focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/20 transition-all">
            <Search className="w-4 h-4 text-slate-400 mr-2.5 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search location, landmark, or hospital (e.g. AIIMS Delhi, SGPGI Lucknow, Agra Fort, KEM Mumbai)..."
              className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
            />
            {isSearching && (
              <div className="w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {dropdownOpen && (
            <div className="absolute left-0 right-0 top-full mt-1.5 max-h-60 overflow-y-auto bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl py-1 z-30">
              {searchResults.map((node) => (
                <button
                  key={node.id}
                  onClick={() => {
                    onSelectSearchNode(node);
                    setDropdownOpen(false);
                    setSearchQuery(node.name);
                  }}
                  className="w-full text-left px-4 py-2 text-xs hover:bg-slate-800/80 transition-colors flex items-center justify-between border-b border-slate-800/50 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-200">{node.name}</div>
                      <div className="text-[11px] text-slate-400">
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

        {/* Quick GPS Geolocation Button */}
        <button
          onClick={onUseLocation}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/70 rounded-xl text-xs font-semibold shadow-lg backdrop-blur-md transition-all active:scale-95"
          title="Snap to nearest emergency hub from device location"
        >
          <Navigation className="w-4 h-4 text-sky-400" />
          <span className="whitespace-nowrap">Use My Device Location</span>
        </button>

        {/* Fast Flood Simulation Button */}
        <button
          onClick={onSimulateFlood}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-950/80 hover:bg-rose-900/80 text-rose-200 border border-rose-700/50 rounded-xl text-xs font-semibold shadow-lg backdrop-blur-md transition-all active:scale-95"
          title="Simulate 85cm waterlogging on primary direct route"
        >
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span className="whitespace-nowrap">Test Flood Warning</span>
        </button>
      </div>

      {/* Quick City Presets Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pointer-events-auto no-scrollbar">
        {CITY_PRESETS.map((city) => (
          <button
            key={city.label}
            onClick={() => onSelectCity(city)}
            className={`px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-md transition-all whitespace-nowrap shadow-sm ${
              selectedState === city.state
                ? 'bg-sky-500/20 border-sky-400 text-sky-300 font-semibold shadow-sky-500/10'
                : 'bg-slate-900/80 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            📍 {city.label}
          </button>
        ))}
      </div>
    </header>
  );
}
