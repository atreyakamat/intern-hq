import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import StatsCards from '../Analytics/StatsCards';
import FilterBar from '../Filters/FilterBar';
import ApplicantTable from './ApplicantTable';
import ComparisonPanel from './ComparisonPanel';
import { Upload, Sparkles } from 'lucide-react';

export default function ApplicantDashboard() {
  const navigate = useNavigate();

  const [applicants, setApplicants] = useState([]);
  const [roles, setRoles] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comparison, setComparison] = useState(null);
  const [comparing, setComparing] = useState(false);

  const [filters, setFilters] = useState({
    hrStatus: 'all',
    minScore: 0,
    sortBy: 'score',
    roleId: undefined,
  });

  /* ---- Fetch data ---- */
  const fetchApplicants = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.hrStatus && filters.hrStatus !== 'all') params.hrStatus = filters.hrStatus;
      if (filters.minScore) params.minScore = filters.minScore;
      if (filters.sortBy) params.sortBy = filters.sortBy;
      if (filters.roleId) params.roleId = filters.roleId;

      const res = await axios.get(`${API_BASE_URL}/api/applicants`, { params });
      setApplicants(res.data);
    } catch (err) {
      console.error('Error fetching applicants:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchRoles = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/roles`);
      setRoles(res.data);
    } catch (err) {
      console.error('Error fetching roles:', err);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const params = filters.roleId ? { roleId: filters.roleId } : {};
      const res = await axios.get(`${API_BASE_URL}/api/applicants/analytics`, { params });
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, [filters.roleId]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  useEffect(() => {
    fetchApplicants();
    fetchStats();
  }, [fetchApplicants, fetchStats]);

  /* ---- Actions ---- */
  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/applicants/${id}/status`, {
        status: newStatus,
        sendNotification: true,
      });
      fetchApplicants();
      fetchStats();
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  const handleCompare = async () => {
    if (applicants.length < 2) return alert('Need at least 2 applicants to compare.');
    const roleId = filters.roleId || applicants[0]?.role?._id || applicants[0]?.role;
    if (!roleId) return alert('Select a role or upload applicants linked to a role.');

    try {
      setComparing(true);
      const res = await axios.get(`${API_BASE_URL}/api/applicants/compare/${roleId}`);
      setComparison(res.data);
    } catch (err) {
      console.error('Comparison failed:', err);
      alert('Comparison failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setComparing(false);
    }
  };

  /* ---- Render ---- */
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Applicant Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            AI-powered candidate evaluation and ranking
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/upload')}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition shadow-sm"
          >
            <Upload className="h-4 w-4" />
            Upload Resumes
          </button>
          <button
            onClick={handleCompare}
            disabled={comparing || applicants.length < 2}
            className="inline-flex items-center gap-2 border border-indigo-300 text-indigo-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="h-4 w-4" />
            {comparing ? 'Analyzing...' : 'Compare Top'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <StatsCards stats={stats} />

      {/* Comparison panel */}
      {comparison && (
        <ComparisonPanel comparison={comparison} onClose={() => setComparison(null)} />
      )}

      {/* Filters */}
      <FilterBar filters={filters} onChange={setFilters} roles={roles} />

      {/* Table */}
      <ApplicantTable
        applicants={applicants}
        onStatusChange={handleStatusChange}
        loading={loading}
      />
    </div>
  );
}
