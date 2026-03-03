import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { useNavigate } from 'react-router-dom';
import './ResumeUpload.css';

const ResumeUpload = () => {
  const [files, setFiles] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/roles`);
      setRoles(response.data);
      if (response.data.length > 0) setSelectedRole(response.data[0]._id);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (files.length === 0 || !selectedRole) {
      setStatus('Please select files and a role');
      return;
    }

    const formData = new FormData();
    files.forEach(file => {
      formData.append('resumes', file);
    });
    formData.append('roleId', selectedRole);

    try {
      setUploading(true);
      setStatus('Uploading and processing resumes... this may take a moment.');
      await axios.post(`${API_BASE_URL}/api/candidates/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setUploading(false);
      setStatus('Upload successful!');
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      setUploading(false);
      setStatus('Upload failed: ' + error.message);
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Resumes</h2>
      <form onSubmit={handleUpload}>
        <div className="form-group">
          <label>Select Role</label>
          <select 
            value={selectedRole} 
            onChange={(e) => setSelectedRole(e.target.value)}
            required
          >
            <option value="">Select a role</option>
            {roles.map(role => (
              <option key={role._id} value={role._id}>{role.title}</option>
            ))}
          </select>
          <button type="button" className="btn-text" onClick={() => navigate('/roles/new')}>
            + Create New Role
          </button>
        </div>

        <div className="form-group">
          <label>Choose Resumes (PDF)</label>
          <input 
            type="file" 
            multiple 
            accept=".pdf" 
            onChange={handleFileChange}
            required 
          />
          <p className="help-text">You can select multiple PDF files at once.</p>
        </div>

        {files.length > 0 && (
          <div className="file-list">
            <h4>Selected Files ({files.length}):</h4>
            <ul>
              {files.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="upload-actions">
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={uploading}
          >
            {uploading ? 'Processing...' : 'Upload & Process'}
          </button>
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={() => navigate('/')}
            disabled={uploading}
          >
            Cancel
          </button>
        </div>
      </form>
      
      {status && <div className={`status-message ${status.includes('failed') ? 'error' : 'info'}`}>{status}</div>}
    </div>
  );
};

export default ResumeUpload;
