import React from 'react';
import { Users, TrendingUp, CheckCircle, XCircle } from 'lucide-react';

const CARDS = [
  { key: 'totalApplicants', label: 'Total Applicants',     icon: Users,       color: 'text-indigo-600 bg-indigo-50' },
  { key: 'averageScore',    label: 'Average Score',        icon: TrendingUp,  color: 'text-emerald-600 bg-emerald-50' },
  { key: 'accepted',        label: 'Accepted',             icon: CheckCircle, color: 'text-green-600 bg-green-50' },
  { key: 'rejected',        label: 'Rejected',             icon: XCircle,     color: 'text-red-600 bg-red-50' },
];

export default function StatsCards({ stats }) {
  if (!stats) return null;

  const values = {
    totalApplicants: stats.totalApplicants,
    averageScore: stats.averageScore,
    accepted: stats.statusCounts?.accepted ?? 0,
    rejected: stats.statusCounts?.rejected ?? 0,
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {CARDS.map(({ key, label, icon: Icon, color }) => (
        <div
          key={key}
          className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm"
        >
          <div className={`rounded-lg p-2.5 ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{values[key]}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
