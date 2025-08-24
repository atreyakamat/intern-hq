import React from 'react';
import './StatsOverview.css';

const statsoverview = ({ stats }) => {
  if (!stats) return null;
  
  const { totalCandidates, statusStats, averageScore } = stats;
  
  // Format status counts
  const formatStatusCount = (status) => {
    return statusStats[status] || 0;
  };
  
  return (
    <div className="stats-overview">
      <div className="stat-card">
        <div className="stat-title">Total Candidates</div>
        <div className="stat-value">{totalCandidates}</div>
      </div>
      
      <div className="stat-card">
        <div className="stat-title">Average Score</div>
        <div className="stat-value">{averageScore}</div>
      </div>
      
      <div className="stat-card">
        <div className="stat-title">Shortlisted</div>
        <div className="stat-value">{formatStatusCount('shortlisted')}</div>
      </div>
      
      <div className="stat-card">
        <div className="stat-title">Interviewing</div>
        <div className="stat-value">{formatStatusCount('interviewed')}</div>
      </div>
    </div>
  );
};

export default StatsOverview;
