import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, CheckCircle2, CloudRain, Route, ShieldCheck, Radio } from 'lucide-react';

const GUIDE_STEPS = [
  {
    step: 1,
    title: 'Predictive Flood Timeline (0–6 Hours)',
    icon: '🌧️',
    subtitle: 'Forecasting Road Inundation Hour-by-Hour',
    description:
      'Unlike conventional maps that only react after roads are flooded, RakshaPath forecasts future water accumulation 0 to 6 hours ahead using runoff modeling. Select a rain scenario (Light, Heavy, or Extreme Cloudburst) and scrub the timeline to preview when underpasses submerge and when elevated bridges become critical.',
    bulletPoints: [
      'Preview water depth changes hour-by-hour across lowlands',
      'Soft-sigmoid vehicle clearance ensures engines never hydrolock',
      'Automatic warnings when water approaches vehicle safety limits'
    ]
  },
  {
    step: 2,
    title: 'Dual Safe Corridors & Reliability Scoring',
    icon: '🛣️',
    subtitle: 'Primary Safe Route + Geographically Diverse Backup Route',
    description:
      'Never rely on a single route during monsoon disasters. RakshaPath computes a Primary safe route and a penalty-diversified Backup route that avoids sharing the same flooded chokepoints. Both corridors are scored with a mathematical reliability index: R = product of edge passabilities.',
    bulletPoints: [
      'Primary route minimizes risk-weighted travel time',
      'Diverse backup route ensures independent escape paths',
      'Plain-language turn directions explain WHY bridges or bypasses were selected'
    ]
  },
  {
    step: 3,
    title: 'Hungarian Dispatch & Hospital Bed Verification',
    icon: '🏥',
    subtitle: 'Matching 108/112 Emergency Calls to Free ICU Beds',
    description:
      'In floods, ambulances often transport critical patients to hospitals whose ICU beds are already full. RakshaPath’s Hungarian algorithm solver (Munkres bipartite matcher) jointly pairs emergency incidents to available vehicles with adequate wading clearance AND hospitals with verified free trauma/ICU beds.',
    bulletPoints: [
      'Global minimum response time matching in polynomial time',
      '100% elimination of hospital diversion rejections due to zero beds',
      'Dispatch console includes real-time incident queue & manual operator overrides'
    ]
  },
  {
    step: 4,
    title: 'Closed-Loop Crew Mobile Failover',
    icon: '🚨',
    subtitle: '1-Tap Roadblock Reporting from Field Crews',
    description:
      'If an ambulance or NDRF crew encounters an unmapped flood barrier or downed power line on the road, they tap the 1-Tap "Road Blocked" button on the in-cab screen. This broadcasts an alert to central dispatch and immediately fails over the vehicle to the Diverse Backup Route.',
    bulletPoints: [
      'High-contrast in-cab dashboard view for vehicle drivers',
      '1-tap emergency road blockage reporting',
      'Instant zero-delay failover to verified backup evacuation corridor'
    ]
  }
];

export default function GuideModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const stepData = GUIDE_STEPS[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{stepData.icon}</span>
            <div>
              <div className="text-[10px] text-sky-400 font-bold uppercase tracking-wider">
                Platform Operator Guide • Step {currentStep + 1} of 4
              </div>
              <h2 className="text-base font-bold text-white">{stepData.title}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 flex-1">
          <div>
            <h3 className="text-sm font-semibold text-sky-300">{stepData.subtitle}</h3>
            <p className="text-xs text-slate-300 leading-relaxed mt-2">
              {stepData.description}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Operational Key Points:
            </div>
            {stepData.bulletPoints.map((point, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{point}</span>
              </div>
            ))}
          </div>

          {/* Step Progress Indicator Dots */}
          <div className="flex justify-center items-center gap-2 pt-2">
            {GUIDE_STEPS.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentStep === idx
                    ? 'bg-sky-400 w-8'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
                title={`Go to step ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Footer Navigation Buttons */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <button
            type="button"
            disabled={currentStep === 0}
            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:pointer-events-none text-xs font-semibold flex items-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          {currentStep < GUIDE_STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => Math.min(GUIDE_STEPS.length - 1, prev + 1))}
              className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-sky-600/30"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-600/30"
            >
              <span>Get Started</span>
              <CheckCircle2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
