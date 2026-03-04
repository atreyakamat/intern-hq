import React from 'react';
import { X, Lightbulb, AlertTriangle, TrendingUp, Sparkles } from 'lucide-react';

export default function ComparisonPanel({ comparison, onClose }) {
  if (!comparison) return null;

  const standouts = comparison.topThreeStandout || [];
  const weaknesses = comparison.commonWeaknessesLowerRanked || [];
  const trend = comparison.overallTrend || '';
  const actions = comparison.recommendedActions || [];

  return (
    <div className="bg-indigo-50/60 border border-indigo-200 rounded-xl p-6 mb-6 relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-1 rounded-lg hover:bg-indigo-100 transition"
      >
        <X className="h-4 w-4 text-indigo-500" />
      </button>

      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-indigo-600" />
        <h2 className="text-lg font-bold text-indigo-900">AI Comparative Intelligence</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Top standouts */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="h-4 w-4 text-emerald-600" />
            <h3 className="font-semibold text-slate-800">Top Candidates</h3>
          </div>
          <ul className="space-y-2">
            {standouts.map((s, i) => (
              <li key={i} className="bg-white rounded-lg p-3 border border-indigo-100 shadow-sm">
                <div className="font-medium text-slate-900">
                  #{s.rank} {s.name}
                </div>
                <p className="text-xs text-slate-500 mt-1">{s.whyStandout}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses & actions */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <h3 className="font-semibold text-slate-800">Common Weaknesses</h3>
            </div>
            <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
              {weaknesses.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          </div>

          {trend && (
            <div className="bg-white rounded-lg p-3 border border-indigo-100">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-indigo-600" />
                <h3 className="font-semibold text-sm text-slate-800">Pool Trend</h3>
              </div>
              <p className="text-sm text-slate-600">{trend}</p>
            </div>
          )}

          {actions.length > 0 && (
            <div>
              <h3 className="font-semibold text-sm text-slate-800 mb-1">Recommended Actions</h3>
              <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                {actions.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
