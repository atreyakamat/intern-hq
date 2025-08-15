import React, { useState } from 'react';
import './CandidateCard.css';

const CandidateCard = ({ candidate, onViewProfile, onAction }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getScoreColor = (score) => {
    if (score >= 80) return 'score-high';
    if (score >= 60) return 'score-medium';
    return 'score-low';
  };

  return (
    <div className={`candidate-card ${isExpanded ? 'expanded' : ''}`}>
      <div className="card-header">
        <div className="candidate-name">{candidate.name}</div>
        <div className={`candidate-score ${getScoreColor(candidate.aiScore)}`}>
          {candidate.aiScore}
        </div>
      </div>

      <div className="card-body">
        <div className="candidate-info">
          <div className="info-item">
            <span className="label">Education:</span>
            <span className="value">{candidate.education}</span>
          </div>
          <div className="info-item">
            <span className="label">Experience:</span>
            <span className="value">{candidate.yearsOfExperience} years</span>
          </div>
          <div className="info-item">
            <span className="label">Status:</span>
            <span className="value status-tag">{candidate.status}</span>
          </div>
        </div>

        {isExpanded && (
          <div className="candidate-details">
            <h4>Skills</h4>
            <div className="skills-container">
              {candidate.skills.map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>
            
            <h4>AI Summary</h4>
            <p className="ai-summary">{candidate.aiSummary}</p>
          </div>
        )}
      </div>

      <div className="card-footer">
        <button 
          className="btn-text" 
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </button>
        <button className="btn-outline" onClick={onViewProfile}>
          View Profile
        </button>
        <div className="action-dropdown">
          <button className="btn-primary">Actions</button>
          <div className="dropdown-content">
            <button onClick={() => onAction('approve')}>Approve</button>
            <button onClick={() => onAction('reject')}>Reject</button>
            <button onClick={() => onAction('contact')}>Contact</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;
