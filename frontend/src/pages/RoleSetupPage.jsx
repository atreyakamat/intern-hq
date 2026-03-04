/**
 * RoleSetupPage.jsx — Role management page.
 *
 * Shows role listing and creation within one page context.
 * Wraps the existing CreateRole and RoleList components.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Plus, ChevronRight, ArrowLeft, Save } from 'lucide-react';
import { getRoles, createRole as createRoleAPI } from '../api/api';

const DEFAULT_WEIGHTS = {
  skills: 0.4,
  experience: 0.25,
  projects: 0.2,
  communication: 0.1,
  bonus: 0.05,
};

export default function RoleSetupPage({ mode = 'list' }) {
  const navigate = useNavigate();

  /* ---- List state ---- */
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  /* ---- Form state ---- */
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [role, setRole] = useState({
    title: '',
    description: '',
    requiredSkills: '',
    preferredSkills: '',
    experienceLevel: 'Entry Level',
    cultureDescription: '',
    weightConfig: { ...DEFAULT_WEIGHTS },
  });

  /* ---- Fetch roles ---- */
  useEffect(() => {
    (async () => {
      try {
        const res = await getRoles();
        setRoles(res.data);
      } catch (err) {
        console.error('Failed to fetch roles:', err);
      } finally {
        setLoadingRoles(false);
      }
    })();
  }, []);

  /* ---- Form handlers ---- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('weight_')) {
      const key = name.replace('weight_', '');
      setRole((prev) => ({
        ...prev,
        weightConfig: { ...prev.weightConfig, [key]: parseFloat(value) || 0 },
      }));
    } else {
      setRole((prev) => ({ ...prev, [name]: value }));
    }
  };

  const weightTotal = Object.values(role.weightConfig).reduce((s, v) => s + v, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (Math.abs(weightTotal - 1.0) > 0.01) {
      setError(`Weights must sum to 1.0 (currently ${weightTotal.toFixed(2)})`);
      return;
    }

    const payload = {
      ...role,
      requiredSkills: role.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean),
      preferredSkills: role.preferredSkills.split(',').map((s) => s.trim()).filter(Boolean),
    };

    try {
      setSaving(true);
      await createRoleAPI(payload);
      navigate('/roles');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  /* ---- Create mode ---- */
  if (mode === 'create') {
    return (
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 mb-6 transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <Briefcase className="h-6 w-6 text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-900">Create Internship Role</h1>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Role Title *</label>
              <input type="text" name="title" value={role.title} onChange={handleChange} required
                placeholder="e.g. Frontend Developer Intern"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea name="description" value={role.description} onChange={handleChange} rows={3}
                placeholder="Describe the role, responsibilities, and what you're looking for..."
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-y" />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Required Skills</label>
                <input type="text" name="requiredSkills" value={role.requiredSkills} onChange={handleChange}
                  placeholder="React, JavaScript, CSS"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                <p className="text-xs text-slate-400 mt-1">Comma-separated</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Skills</label>
                <input type="text" name="preferredSkills" value={role.preferredSkills} onChange={handleChange}
                  placeholder="TypeScript, Node.js, Docker"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                <p className="text-xs text-slate-400 mt-1">Comma-separated</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Experience Level</label>
              <select name="experienceLevel" value={role.experienceLevel} onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                <option>Entry Level</option>
                <option>Junior</option>
                <option>Intermediate</option>
                <option>Senior</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Company Culture Description</label>
              <textarea name="cultureDescription" value={role.cultureDescription} onChange={handleChange} rows={2}
                placeholder="Describe your team's values, work style, and what cultural traits you value..."
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-y" />
            </div>

            {/* Scoring weights */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-slate-700">Scoring Weights</label>
                <span className={`text-xs font-mono ${Math.abs(weightTotal - 1.0) <= 0.01 ? 'text-emerald-600' : 'text-red-600'}`}>
                  Total: {weightTotal.toFixed(2)}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-slate-50 p-4 rounded-lg">
                {Object.entries(role.weightConfig).map(([key, val]) => (
                  <div key={key}>
                    <label className="block text-xs font-medium text-slate-500 mb-1 capitalize">{key}</label>
                    <input type="number" step="0.05" min="0" max="1" name={`weight_${key}`} value={val}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-center focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button type="submit" disabled={saving}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
                {saving ? 'Saving...' : <><Save className="h-4 w-4" /> Save Role</>}
              </button>
              <button type="button" onClick={() => navigate('/roles')} disabled={saving}
                className="px-6 py-3 rounded-xl border border-slate-300 text-slate-600 font-medium hover:bg-slate-50 transition disabled:opacity-50">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  /* ---- List mode (default) ---- */
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Internship Roles</h1>
          <p className="text-sm text-slate-500 mt-1">Manage roles and their scoring configurations</p>
        </div>
        <button
          onClick={() => navigate('/roles/new')}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition shadow-sm"
        >
          <Plus className="h-4 w-4" /> New Role
        </button>
      </div>

      {loadingRoles ? (
        <div className="text-center py-20 text-slate-400">Loading roles...</div>
      ) : roles.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
          <Briefcase className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 mb-4">No roles created yet.</p>
          <button onClick={() => navigate('/roles/new')}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
            <Plus className="h-4 w-4" /> Create First Role
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {roles.map((r) => (
            <div key={r._id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center justify-between hover:border-indigo-200 transition cursor-pointer group"
              onClick={() => navigate(`/upload?roleId=${r._id}`)}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-900 truncate">{r.title}</h3>
                  <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{r.experienceLevel}</span>
                </div>
                {r.description && <p className="text-sm text-slate-500 mt-1 line-clamp-1">{r.description}</p>}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {(r.requiredSkills || []).slice(0, 6).map((s, i) => (
                    <span key={i} className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs font-medium">{s}</span>
                  ))}
                  {(r.requiredSkills || []).length > 6 && (
                    <span className="text-xs text-slate-400">+{r.requiredSkills.length - 6} more</span>
                  )}
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-indigo-500 transition ml-3 shrink-0" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
