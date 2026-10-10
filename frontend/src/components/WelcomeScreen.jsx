import React, { useState } from 'react';
import { 
  Shield, 
  Truck, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  Radio, 
  Activity,
  Compass
} from 'lucide-react';

export default function WelcomeScreen({ onSelectRole }) {
  const [selectedRole, setSelectedRole] = useState('Citizen');

  const handleProceed = () => {
    if (onSelectRole) {
      onSelectRole(selectedRole);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-slate-950 font-sans text-slate-100 flex flex-col justify-between selection:bg-sky-500 selection:text-white relative overflow-x-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-sky-600/15 via-blue-600/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-t from-emerald-600/10 via-transparent to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Top National Branding Bar */}
      <header className="w-full px-6 py-4 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold text-lg shadow-inner">
            🛡️
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider font-bold text-sky-400">
              Government Public Safety Initiative
            </div>
            <div className="text-sm font-black text-white tracking-tight">
              RakshaPath Mobility Network
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            National Grid Active
          </span>
        </div>
      </header>

      {/* Hero Content & Role Selection */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-5xl mx-auto w-full z-10">
        {/* Title & Mission Statement */}
        <div className="text-center space-y-3 max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/25 text-sky-300 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5 text-sky-400 animate-spin" style={{ animationDuration: '8s' }} />
            Disaster Evacuation & Corridor Logistics Platform
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            RakshaPath
          </h1>
          <p className="text-lg sm:text-xl font-medium text-slate-300 tracking-normal">
            National Emergency Mobility Network
          </p>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
            AI-powered risk-weighted routing to navigate citizens safely around urban flooding, road damage, and debris chokepoints directly to verified relief shelters.
          </p>
        </div>

        {/* STAGE 1: ROLE SELECTION CARDS */}
        <div className="w-full max-w-3xl space-y-3 mb-8">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 text-center">
            Step 1: Select Your User Role to Enter
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Role 1: Citizen */}
            <div
              onClick={() => setSelectedRole('Citizen')}
              className={`cursor-pointer rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between ${
                selectedRole === 'Citizen'
                  ? 'bg-gradient-to-b from-sky-950/60 to-slate-900 border-sky-400 shadow-xl shadow-sky-500/15 ring-2 ring-sky-500/30'
                  : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900 hover:border-slate-700'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
                    <Shield className="w-6 h-6" />
                  </div>
                  <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs font-bold ${
                    selectedRole === 'Citizen'
                      ? 'border-sky-400 bg-sky-500 text-white'
                      : 'border-slate-600 bg-slate-800'
                  }`}>
                    {selectedRole === 'Citizen' && '✓'}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">Citizen Evacuation</h3>
                  <div className="text-xs font-medium text-sky-400">Public Safety & Safe Shelter Navigation</div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Find the safest dry route to nearby relief shelters, monitor road waterlogging levels, and get step-by-step directions to stay safe.
                </p>

                <div className="pt-2 border-t border-slate-800 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>Safe road corridors bypassing high water</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>Verified relief shelters with bed availability</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>One-click GPS device location support</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold">
                <span className={selectedRole === 'Citizen' ? 'text-sky-300' : 'text-slate-500'}>
                  {selectedRole === 'Citizen' ? 'Active Selection' : 'Click to Select'}
                </span>
                <span className="text-sky-400">Standard Access</span>
              </div>
            </div>

            {/* Role 2: Field Responder / Evaluator */}
            <div
              onClick={() => setSelectedRole('Field Responder / Evaluator')}
              className={`cursor-pointer rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between ${
                selectedRole === 'Field Responder / Evaluator'
                  ? 'bg-gradient-to-b from-amber-950/40 to-slate-900 border-amber-400 shadow-xl shadow-amber-500/15 ring-2 ring-amber-500/30'
                  : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900 hover:border-slate-700'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Truck className="w-6 h-6" />
                  </div>
                  <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs font-bold ${
                    selectedRole === 'Field Responder / Evaluator'
                      ? 'border-amber-400 bg-amber-500 text-white'
                      : 'border-slate-600 bg-slate-800'
                  }`}>
                    {selectedRole === 'Field Responder / Evaluator' && '✓'}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">Field Responder / Evaluator</h3>
                  <div className="text-xs font-medium text-amber-400">NDRF / SDRF Logistics & Road Calibration</div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Calibrate real-time water depth, road damage, and debris levels. Deploy heavy rescue units, flood boats, and report road hazards.
                </p>

                <div className="pt-2 border-t border-slate-800 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span>Heavy vehicle clearance profiles (NDRF Truck, Boats)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span>Live physical hazard multiplier calibration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span>Direct road blockage and hazard reporting</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold">
                <span className={selectedRole === 'Field Responder / Evaluator' ? 'text-amber-300' : 'text-slate-500'}>
                  {selectedRole === 'Field Responder / Evaluator' ? 'Active Selection' : 'Click to Select'}
                </span>
                <span className="text-amber-400">Command Console</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enter Command Center Action Button */}
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={handleProceed}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm tracking-wide shadow-xl shadow-sky-600/30 flex items-center gap-3 transition-all transform active:scale-95"
          >
            <span>Enter Command Center as {selectedRole === 'Citizen' ? 'Citizen' : 'Field Responder'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-[11px] text-slate-500">
            You can switch your role or exit back to this screen anytime from the dashboard header.
          </p>
        </div>
      </main>

      {/* Bottom Infrastructure Metric Strip */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950/80 px-6 py-3.5">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <strong>50+</strong> Verified Shelters
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
              <strong>7</strong> Metropolitan Regions
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <strong>A*</strong> Dynamic Risk Routing
            </span>
          </div>

          <div className="text-slate-500 text-[11px]">
            RakshaPath National Emergency Mobility System • 100% Free Public Safety Platform
          </div>
        </div>
      </footer>
    </div>
  );
}
