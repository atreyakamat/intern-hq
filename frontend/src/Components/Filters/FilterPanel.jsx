import React, { useState } from 'react';
import './FilterPanel.css';

const FilterPanel = ({ filters, onChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [expanded, setExpanded] = useState(false);
  
  const handleChange = (key, value) => {
    const updatedFilters = { ...localFilters, [key]: value };
    setLocalFilters(updatedFilters);
  };
  
  const handleApplyFilters = () => {
    onChange(localFilters);
  };
  
  const handleResetFilters = () => {
    const resetFilters = {
      status: 'all',
      minScore: 0,
      skills: [],
      sortBy: 'score'
    };
    setLocalFilters(resetFilters);
    onChange(resetFilters);
  };
  
  // Common skills for select dropdown
  const commonSkills = [
    'JavaScript', 'React', 'Node.js', 'Python', 'Java', 
    'Data Analysis', 'Machine Learning', 'SQL', 'UX/UI', 
    'Product Management', 'Marketing', 'Sales'
  ];

  return (
    <div className={`filter-panel ${expanded ? 'expanded' : ''}`}>
      <div className="filter-header">
        <h3>Filters</h3>
        <button 
          className="toggle-button"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Collapse' : 'Expand'}
        </button>
      </div>
      
      <div className="filter-content">
        <div className="filter-group">
          <label>Status</label>
          <select 
            value={localFilters.status} 
            onChange={(e) => handleChange('status', e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="reviewing">Reviewing</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="interviewed">Interviewed</option>
            <option value="offered">Offered</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Minimum Score</label>
          <div className="range-container">
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={localFilters.minScore} 
              onChange={(e) => handleChange('minScore', parseInt(e.target.value))}
            />
            <span className="range-value">{localFilters.minScore}</span>
          </div>
        </div>
        
        <div className="filter-group">
          <label>Skills</label>
          <div className="skills-selector">
            <select 
              multiple
              value={localFilters.skills}
              onChange={(e) => {
                const selectedSkills = Array.from(
                  e.target.selectedOptions, 
                  option => option.value
                );
                handleChange('skills', selectedSkills);
              }}
            >
              {commonSkills.map(skill => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
            <div className="skills-help">Hold Ctrl/Cmd to select multiple</div>
          </div>
        </div>
        
        <div className="filter-group">
          <label>Sort By</label>
          <select 
            value={localFilters.sortBy} 
            onChange={(e) => handleChange('sortBy', e.target.value)}
          >
            <option value="score">AI Score</option>
            <option value="date">Date Added</option>
            <option value="name">Name</option>
          </select>
        </div>
        
        <div className="filter-actions">
          <button 
            className="btn-outline" 
            onClick={handleResetFilters}
          >
            Reset
          </button>
          <button 
            className="btn-primary" 
            onClick={handleApplyFilters}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
