import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { Briefcase, Plus, ChevronRight } from 'lucide-react';

export default function RoleList() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/roles`);
        setRoles(res.data);
      } catch (err) {
        console.error('Failed to fetch roles:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
          <Plus className="h-4 w-4" />
          New Role
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading roles...</div>
      ) : roles.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
          <Briefcase className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 mb-4">No roles created yet.</p>
          <button
            onClick={() => navigate('/roles/new')}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
          >
            <Plus className="h-4 w-4" /> Create First Role
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {roles.map((role) => (
            <div
              key={role._id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center justify-between hover:border-indigo-200 transition cursor-pointer group"
              onClick={() => navigate(`/upload?roleId=${role._id}`)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-900 truncate">{role.title}</h3>
                  <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                    {role.experienceLevel}
                  </span>
                </div>
                {role.description && (
                  <p className="text-sm text-slate-500 mt-1 line-clamp-1">{role.description}</p>
                )}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {(role.requiredSkills || []).slice(0, 6).map((s, i) => (
                    <span key={i} className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs font-medium">
                      {s}
                    </span>
                  ))}
                  {(role.requiredSkills || []).length > 6 && (
                    <span className="text-xs text-slate-400">+{role.requiredSkills.length - 6} more</span>
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
