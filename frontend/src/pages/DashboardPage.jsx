/**
 * DashboardPage.jsx — Main HR dashboard page.
 *
 * Wraps the existing dashboard components and adds the
 * step-by-step workflow actions: Evaluate → Rank → Notify.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import StatsCards from '../components/Analytics/StatsCards';
import FilterBar from '../components/Filters/FilterBar';
import ApplicantTable from '../components/Dashboard/ApplicantTable';
import ComparisonPanel from '../components/Dashboard/ComparisonPanel';
import ApplicantModal from './ApplicantModal';
import {
  Upload, Sparkles, Zap, BarChart3, Bell,
} from 'lucide-react';
import {
  getApplicants, getRoles, getAnalytics, compareApplicants,
  evaluateApplicants, rankApplicants, notifyApplicants,
  updateApplicantStatus,
} from '../api/api';

export default function DashboardPage() {
  const navigate = useNavigate();

  const [applicants, setApplicants] = useState([]);
  const [roles, setRoles] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comparison, setComparison] = useState(null);
  const [comparing, setComparing] = useState(false);

  /* Workflow action state */
  const [evaluating, setEvaluating] = useState(false);
  const [ranking, setRanking] = useState(false);
  const [notifying, setNotifying] = useState(false);
  const [actionMsg, setActionMsg] = useState(null);

  /* Modal */
  const [selectedApplicantId, setSelectedApplicantId] = useState(null);

  const [filters, setFilters] = useState({
    hrStatus: 'all',
    minScore: 0,
    sortBy: 'score',
    roleId: undefined,
  });

  /* ---- Data fetching ---- */
  const fetchApplicants = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.hrStatus && filters.hrStatus !== 'all') params.status = filters.hrStatus;
      if (filters.minScore) params.minScore = filters.minScore;
      if (filters.sortBy) params.sort = filters.sortBy;
      if (filters.roleId) params.roleId = filters.roleId;

      const res = await getApplicants(params);
      setApplicants(res.data);
    } catch (err) {
      console.error('Error fetching applicants:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchRoles = useCallback(async () => {
    try {
      const res = await getRoles();
      setRoles(res.data);
    } catch (err) {
      console.error('Error fetching roles:', err);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await getAnalytics(filters.roleId);
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, [filters.roleId]);

  useEffect(() => { fetchRoles(); }, [fetchRoles]);
  useEffect(() => { fetchApplicants(); fetchStats(); }, [fetchApplicants, fetchStats]);

  /* ---- Utility ---- */
  const activeRoleId = filters.roleId || applicants[0]?.role?._id || applicants[0]?.role;

  const flash = (type, msg) => {
    setActionMsg({ type, msg });
    setTimeout(() => setActionMsg(null), 5000);
  };

  /* ---- Inline actions ---- */
  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateApplicantStatus(id, newStatus, true);
      fetchApplicants();
      fetchStats();
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  const handleCompare = async () => {
    if (!activeRoleId) return alert('Select a role first.');
    try {
      setComparing(true);
      const res = await compareApplicants(activeRoleId);
      setComparison(res.data);
    } catch (err) {
      console.error('Comparison failed:', err);
      alert('Comparison failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setComparing(false);
    }
  };

  /* ---- Workflow actions ---- */
  const handleEvaluate = async () => {
    if (!activeRoleId) return alert('Select a role first.');
    try {
      setEvaluating(true);
      const res = await evaluateApplicants(activeRoleId);
      flash('success', res.data.message || 'Evaluation complete!');
      fetchApplicants();
      fetchStats();
    } catch (err) {
      flash('error', err.response?.data?.message || err.message);
    } finally {
      setEvaluating(false);
    }
  };

  const handleRank = async () => {
    if (!activeRoleId) return alert('Select a role first.');
    try {
      setRanking(true);
      const res = await rankApplicants(activeRoleId);
      flash('success', res.data.message || 'Ranking complete!');
      fetchApplicants();
      fetchStats();
    } catch (err) {
      flash('error', err.response?.data?.message || err.message);
    } finally {
      setRanking(false);
    }
  };

  const handleNotifyAccepted = async () => {
    const accepted = applicants.filter((a) => a.hrStatus === 'accepted' && !a.emailSent);
    if (!accepted.length) return alert('No un-notified accepted applicants.');
    try {
      setNotifying(true);
      const ids = accepted.map((a) => a._id);
      const res = await notifyApplicants(ids, 'accept');
      flash('success', res.data.message || `Notified ${ids.length} applicant(s).`);
      fetchApplicants();
    } catch (err) {
      flash('error', err.response?.data?.message || err.message);
    } finally {
      setNotifying(false);
    }
  };

  const handleNotifyRejected = async () => {
    const rejected = applicants.filter((a) => a.hrStatus === 'rejected' && !a.emailSent);
    if (!rejected.length) return alert('No un-notified rejected applicants.');
    try {
      setNotifying(true);
      const ids = rejected.map((a) => a._id);
      const res = await notifyApplicants(ids, 'reject');
      flash('success', res.data.message || `Notified ${ids.length} applicant(s).`);
      fetchApplicants();
    } catch (err) {
      flash('error', err.response?.data?.message || err.message);
    } finally {
      setNotifying(false);
    }
  };

  /* ---- Render ---- */
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Applicant Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">AI-powered candidate evaluation and ranking</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => navigate('/upload')}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition shadow-sm"
          >
            <Upload className="h-4 w-4" /> Upload Resumes
          </button>
          <button
            onClick={handleCompare}
            disabled={comparing || applicants.length < 2}
            className="inline-flex items-center gap-2 border border-indigo-300 text-indigo-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="h-4 w-4" /> {comparing ? 'Analyzing...' : 'Compare Top'}
          </button>
        </div>
      </div>

      {/* Action message */}
      {actionMsg && (
        <div className={`rounded-lg px-4 py-3 mb-4 text-sm font-medium ${
          actionMsg.type === 'success'
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {actionMsg.msg}
        </div>
      )}

      {/* Workflow actions */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
        <h2 className="text-sm font-semibold text-slate-700 mb-3">Pipeline Actions</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleEvaluate}
            disabled={evaluating || !activeRoleId}
            className="inline-flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-violet-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Zap className="h-4 w-4" /> {evaluating ? 'Evaluating...' : 'Evaluate All'}
          </button>
          <button
            onClick={handleRank}
            disabled={ranking || !activeRoleId}
            className="inline-flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <BarChart3 className="h-4 w-4" /> {ranking ? 'Ranking...' : 'Rank Applicants'}
          </button>
          <button
            onClick={handleNotifyAccepted}
            disabled={notifying}
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Bell className="h-4 w-4" /> Notify Accepted
          </button>
          <button
            onClick={handleNotifyRejected}
            disabled={notifying}
            className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Bell className="h-4 w-4" /> Notify Rejected
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
        onRowClick={(id) => setSelectedApplicantId(id)}
        loading={loading}
      />

      {/* Applicant modal */}
      {selectedApplicantId && (
        <ApplicantModal
          applicantId={selectedApplicantId}
          onClose={() => setSelectedApplicantId(null)}
          onStatusChange={(id, status) => {
            handleStatusChange(id, status);
            setSelectedApplicantId(null);
          }}
        />
      )}
    </div>
  );
}
