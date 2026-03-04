import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'reviewing', label: 'Reviewing' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'rejected', label: 'Rejected' },
];

const SORT_OPTIONS = [
  { value: 'score', label: 'Score (high → low)' },
  { value: 'date', label: 'Newest first' },
  { value: 'name', label: 'Name (A-Z)' },
];

export default function FilterBar({ filters, onChange, roles = [] }) {
  const update = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-sm">
      <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-slate-700">
        <SlidersHorizontal className="h-4 w-4" />
        Filters
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Role filter */}
        {roles.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Role</label>
            <select
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={filters.roleId || ''}
              onChange={(e) => update('roleId', e.target.value || undefined)}
            >
              <option value="">All Roles</option>
              {roles.map((r) => (
                <option key={r._id} value={r._id}>{r.title}</option>
              ))}
            </select>
          </div>
        )}

        {/* Status */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
          <select
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={filters.hrStatus || 'all'}
            onChange={(e) => update('hrStatus', e.target.value)}
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Min score */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Min Score: <span className="font-bold">{filters.minScore || 0}</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={filters.minScore || 0}
            onChange={(e) => update('minScore', Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
        </div>

        {/* Sort */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Sort By</label>
          <select
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={filters.sortBy || 'score'}
            onChange={(e) => update('sortBy', e.target.value)}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Reset */}
        <div className="flex items-end">
          <button
            onClick={() =>
              onChange({ hrStatus: 'all', minScore: 0, sortBy: 'score', roleId: undefined })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
