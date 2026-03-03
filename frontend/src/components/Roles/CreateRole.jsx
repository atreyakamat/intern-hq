import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { useNavigate } from 'react-router-dom';
import './CreateRole.css';

const CreateRole = () => {
  const [role, setRole] = useState({
    title: '',
    description: '',
    requiredSkills: '',
    preferredSkills: '',
    experienceLevel: 'Entry Level',
    companyCulture: '',
    weightConfig: {
      skills: 0.4,
      projects: 0.3,
      clarity: 0.2,
      experience: 0.1
    }
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('weight_')) {
      const weightName = name.split('_')[1];
      setRole({
        ...role,
        weightConfig: {
          ...role.weightConfig,
          [weightName]: parseFloat(value)
        }
      });
    } else {
      setRole({ ...role, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedRole = {
      ...role,
      requiredSkills: role.requiredSkills.split(',').map(s => s.trim()),
      preferredSkills: role.preferredSkills.split(',').map(s => s.trim()),
    };

    try {
      await axios.post(`${API_BASE_URL}/api/roles`, formattedRole);
      navigate('/upload');
    } catch (error) {
      console.error('Error creating role:', error);
    }
  };

  return (
    <div className="create-role-container">
      <h2>Create New Internship Role</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Role Title</label>
          <input 
            type="text" 
            name="title" 
            value={role.title} 
            onChange={handleChange} 
            placeholder="e.g. Frontend Developer Intern" 
            required 
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea 
            name="description" 
            value={role.description} 
            onChange={handleChange} 
            placeholder="Describe the role..." 
          />
        </div>

        <div className="form-group">
          <label>Required Skills (comma separated)</label>
          <input 
            type="text" 
            name="requiredSkills" 
            value={role.requiredSkills} 
            onChange={handleChange} 
            placeholder="React, JavaScript, CSS" 
          />
        </div>

        <div className="form-group">
          <label>Preferred Skills (comma separated)</label>
          <input 
            type="text" 
            name="preferredSkills" 
            value={role.preferredSkills} 
            onChange={handleChange} 
            placeholder="TypeScript, Redux, Node.js" 
          />
        </div>

        <div className="form-group">
          <label>Experience Level</label>
          <select name="experienceLevel" value={role.experienceLevel} onChange={handleChange}>
            <option value="Entry Level">Entry Level</option>
            <option value="Junior">Junior</option>
            <option value="Intermediate">Intermediate</option>
          </select>
        </div>

        <h3>Scoring Weights (0.0 to 1.0, total should be 1.0)</h3>
        <div className="weights-grid">
          <div className="form-group">
            <label>Skills Match</label>
            <input type="number" step="0.1" name="weight_skills" value={role.weightConfig.skills} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Projects Depth</label>
            <input type="number" step="0.1" name="weight_projects" value={role.weightConfig.projects} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Communication Clarity</label>
            <input type="number" step="0.1" name="weight_clarity" value={role.weightConfig.clarity} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Experience</label>
            <input type="number" step="0.1" name="weight_experience" value={role.weightConfig.experience} onChange={handleChange} />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">Create Role</button>
          <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default CreateRole;
