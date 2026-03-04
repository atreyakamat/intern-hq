/**
 * ApplicantCard.jsx — Compact card view for an applicant.
 *
 * Used in grid/card layouts as an alternative to the table view.
 */

import React from 'react';
import ScoreBadge from '../components/Applicants/ScoreBadge';
import { CheckCircle, XCircle, Eye } from 'lucide-react';

const STATUS_STYLES = {
  pending:   'bg-slate-100 text-slate-700',
  reviewing: 'bg-blue-100 text-blue-700',
  accepted:  'bg-emerald-100 text-emerald-700',
  rejected:  'bg-red-100 text-red-700',
};

const FIT_STYLES = {
  Excellent: 'bg-emerald-100 text-emerald-800',
  Strong:    'bg-green-100 text-green-800',
  Moderate:  'bg-amber-100 text-amber-800',
  Weak:      'bg-red-100 text-red-800',
};

export default function ApplicantCard({ applicant, onView, onAccept, onReject }) {
  const a = applicant;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition p-5 flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {a.rank && (
              <span className="text-xs font-mono text-slate-400">#{a.rank}</span>
            )}
            <h3 className="font-semibold text-slate-900 truncate">{a.name}</h3>
          </div>
          <p className="text-xs text-slate-400 truncate mt-0.5">{a.email}</p>
        </div>
        <ScoreBadge score={a.finalScore} size="sm" />
      </div>

      {/* Fit + Status */}
      <div className="flex items-center gap-2 mb-3">
        {a.fitRating && (
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${FIT_STYLES[a.fitRating] || 'bg-slate-100 text-slate-600'}`}>
            {a.fitRating}
          </span>
        )}
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[a.hrStatus] || STATUS_STYLES.pending}`}>
          {a.hrStatus}
        </span>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1 mb-3">
        {(a.skills || []).slice(0, 5).map((s, i) => (
          <span key={i} className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded text-xs">
            {s}
          </span>
        ))}
        {(a.skills || []).length > 5 && (
          <span className="text-xs text-slate-400">+{a.skills.length - 5}</span>
        )}
      </div>

      {/* AI Summary */}
      <p className="text-xs text-slate-500 line-clamp-2 flex-1 mb-4">
        {a.aiSummary || 'Not evaluated yet.'}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-1.5 pt-3 border-t border-slate-100">
        <button
          onClick={() => onView?.(a._id)}
          className="flex-1 inline-flex items-center justify-center gap-1 text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 px-2 py-1.5 rounded-lg transition"
        >
          <Eye className="h-3.5 w-3.5" /> View
        </button>
        <button
          onClick={() => onAccept?.(a._id)}
          className="flex-1 inline-flex items-center justify-center gap-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50 px-2 py-1.5 rounded-lg transition"
        >
          <CheckCircle className="h-3.5 w-3.5" /> Accept
        </button>
        <button
          onClick={() => onReject?.(a._id)}
          className="flex-1 inline-flex items-center justify-center gap-1 text-xs font-medium text-red-600 hover:bg-red-50 px-2 py-1.5 rounded-lg transition"
        >
          <XCircle className="h-3.5 w-3.5" /> Reject
        </button>
      </div>
    </div>
  );
}
