import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CandidateCard from './CandidateCard';
import FilterPanel from '../Filters/FilterPanel';
import StatsOverview from '../Analytics/StatsOverview';
import { mockCandidates, mockStats } from '../../utils/mockData';
import { API_BASE_URL } from '../../config';
import './Dashboard.css';

const CandidateDashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    minScore: 0,
    skills: [],
    sortBy: 'score'
  });
  const [stats, setStats] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [comparing, setComparing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCandidates();
    fetchStats();
  }, [filters]);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/candidates`, { 
        params: filters 
      });
      setCandidates(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/candidates/analytics/overview`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleCompare = async () => {
    try {
      setComparing(true);
      // For now, we'll just compare based on the first candidate's role
      if (candidates.length < 2) {
        alert("At least 2 candidates needed to compare");
        setComparing(false);
        return;
      }
      
      const roleId = candidates[0].role;
      if (!roleId) {
        alert("Candidates must be assigned to a role to compare. Please upload more resumes.");
        setComparing(false);
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/candidates/compare/${roleId}`);
      setComparison(response.data);
      setComparing(false);
    } catch (error) {
      console.error('Error comparing candidates:', error);
      setComparing(false);
      alert("Failed to compare candidates. " + (error.response?.data?.message || error.message));
    }
  };

  const handleBulkAction = async (action, selectedIds) => {
    try {
      await axios.post(`${API_BASE_URL}/api/candidates/bulk-action`, {
        action,
        candidateIds: selectedIds
      });
      fetchCandidates();
      fetchStats();
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
    }
  };

  const handleViewProfile = (id) => {
    navigate(`/candidates/${id}`);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Candidate Dashboard</h1>
        <div className="action-buttons">
          <button className="btn-primary" onClick={() => navigate('/upload')}>
            Upload Resumes
          </button>
          <button className="btn-secondary" onClick={handleCompare} disabled={comparing || candidates.length < 2}>
            {comparing ? 'Comparing...' : 'Compare Top Candidates'}
          </button>
        </div>
      </div>
      
      {stats && <StatsOverview stats={stats} />}
      
      {comparison && (
        <div className="comparison-results" style={{ margin: "2rem 0", padding: "2rem", background: "#f0f7ff", borderRadius: 12, border: "1px solid #cce3ff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ margin: 0, color: "#1a365d" }}>AI Comparative Insights</h2>
            <button style={{ background: "none", border: "none", color: "#3182ce", cursor: "pointer", fontWeight: "bold" }} onClick={() => setComparison(null)}>Close</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginTop: "1.5rem" }}>
            <div>
              <h3 style={{ color: "#2c5282" }}>Top Differentiators</h3>
              <ul style={{ paddingLeft: "1.5rem" }}>
                {(comparison['Top 3 Differentiators'] || []).map((d, i) => <li key={i} style={{ marginBottom: "0.5rem" }}>{d}</li>)}
              </ul>
            </div>
            <div>
              <h3 style={{ color: "#2c5282" }}>Common Weaknesses</h3>
              <ul style={{ paddingLeft: "1.5rem" }}>
                {(comparison['Common weaknesses among these candidates'] || comparison['Common Weakness Among Lower Ranks'] || []).map((w, i) => <li key={i} style={{ marginBottom: "0.5rem" }}>{w}</li>)}
              </ul>
            </div>
          </div>
          <div style={{ marginTop: "1.5rem", padding: "1.5rem", background: "white", borderRadius: 8, boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
            <h3 style={{ color: "#2c5282", marginTop: 0 }}>Why the top candidate stands out</h3>
            <p style={{ lineHeight: "1.6", color: "#4a5568", margin: 0 }}>{comparison['Why the top candidate stands out'] || comparison['Differentiators']}</p>
          </div>
        </div>
      )}
      
      <div className="dashboard-content">
        <FilterPanel filters={filters} onChange={setFilters} />
        
        <div className="candidates-grid">
          {loading ? (
            <div className="loading-spinner">Loading candidates...</div>
          ) : candidates.length > 0 ? (
            candidates.map(candidate => (
              <CandidateCard 
                key={candidate._id}
                candidate={candidate}
                onViewProfile={() => handleViewProfile(candidate._id)}
                onAction={(action) => handleBulkAction(action, [candidate._id])}
              />
            ))
          ) : (
            <div className="no-results">No candidates match your filters</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
