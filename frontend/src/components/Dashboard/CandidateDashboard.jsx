import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CandidateCard from './CandidateCard';
import FilterPanel from '../Filters/FilterPanel';
import StatsOverview from '../Analytics/StatsOverview';
import { mockCandidates, mockStats } from '../utils/mockData';
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
      const response = await axios.get(`${API_BASE_URL}/api/analytics/overview`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
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
          <button className="btn-secondary" onClick={() => navigate('/settings')}>
            Settings
          </button>
        </div>
      </div>
      
      {stats && <StatsOverview stats={stats} />}
      
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
