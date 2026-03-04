import React from 'react';
import { useNavigate } from 'react-router-dom';
import ScoreBadge from '../Applicants/ScoreBadge';
import { Eye, CheckCircle, XCircle, Clock } from 'lucide-react';

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

export default function ApplicantTable({ applicants, onStatusChange, onRowClick, loading }) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400">
        <Clock className="h-5 w-5 animate-spin mr-2" />
        Loading applicants...
      </div>
    );
  }

  if (!applicants || applicants.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-dashed border-slate-300 flex items-center justify-center py-20 text-slate-400">
        No applicants found. Upload some resumes to get started.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-4 py-3">Rank</th>
              <th className="px-4 py-3">Applicant</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3 hidden md:table-cell">Fit</th>
              <th className="px-4 py-3 hidden lg:table-cell">Skills</th>
              <th className="px-4 py-3 hidden md:table-cell">AI Summary</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {applicants.map((a) => (
              <tr
                key={a._id}
                className="hover:bg-slate-50/80 transition cursor-pointer"
                onClick={() => onRowClick ? onRowClick(a._id) : navigate(`/applicants/${a._id}`)}
              >
                {/* Rank */}
                <td className="px-4 py-3 font-mono text-slate-500">
                  #{a.rank || '—'}
                </td>

                {/* Name + email */}
                <td className="px-4 py-3">
                  <p className="font-semibold text-slate-900 truncate max-w-[180px]">{a.name}</p>
                  <p className="text-xs text-slate-400 truncate max-w-[180px]">{a.email}</p>
                </td>

                {/* Score badge */}
                <td className="px-4 py-3">
                  <ScoreBadge score={a.finalScore} size="sm" />
                </td>

                {/* Fit rating */}
                <td className="px-4 py-3 hidden md:table-cell">
                  {a.fitRating ? (
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${FIT_STYLES[a.fitRating] || 'bg-slate-100 text-slate-600'}`}>
                      {a.fitRating}
                    </span>
                  ) : '—'}
                </td>

                {/* Skills */}
                <td className="px-4 py-3 hidden lg:table-cell">
                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {(a.skills || []).slice(0, 4).map((s, i) => (
                      <span key={i} className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded text-xs">
                        {s}
                      </span>
                    ))}
                    {(a.skills || []).length > 4 && (
                      <span className="text-xs text-slate-400">+{a.skills.length - 4}</span>
                    )}
                  </div>
                </td>

                {/* AI Summary */}
                <td className="px-4 py-3 hidden md:table-cell">
                  <p className="text-xs text-slate-500 line-clamp-2 max-w-[250px]">
                    {a.aiSummary || '—'}
                  </p>
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[a.hrStatus] || STATUS_STYLES.pending}`}>
                    {a.hrStatus}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1">
                    <button
                      title="View details"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                      onClick={() => navigate(`/applicants/${a._id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      title="Accept"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition"
                      onClick={() => onStatusChange(a._id, 'accepted')}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                    <button
                      title="Reject"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                      onClick={() => onStatusChange(a._id, 'rejected')}
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
