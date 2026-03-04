import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Upload, FileText, ArrowLeft, Check, AlertCircle, Plus } from 'lucide-react';

export default function ResumeUpload() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [files, setFiles] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(searchParams.get('roleId') || '');
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null); // { type, message }
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/roles`);
        setRoles(res.data);
        if (!selectedRole && res.data.length > 0) setSelectedRole(res.data[0]._id);
      } catch (err) {
        console.error('Error fetching roles:', err);
      }
    })();
  }, []);

  const handleFiles = (incoming) => {
    const valid = incoming.filter(
      (f) =>
        f.type === 'application/pdf' ||
        f.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    setFiles((prev) => [...prev, ...valid]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(Array.from(e.dataTransfer.files));
  };

  const removeFile = (idx) => setFiles((prev) => prev.filter((_, i) => i !== idx));

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!files.length || !selectedRole) {
      setStatus({ type: 'error', message: 'Select at least one file and a role.' });
      return;
    }

    const formData = new FormData();
    files.forEach((f) => formData.append('resumes', f));
    formData.append('roleId', selectedRole);

    try {
      setUploading(true);
      setStatus({ type: 'info', message: 'Uploading and processing resumes — this may take a moment...' });
      const res = await axios.post(`${API_BASE_URL}/api/applicants/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setStatus({ type: 'success', message: res.data.message || 'Upload successful!' });
      setFiles([]);
      setTimeout(() => navigate('/'), 2500);
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || err.message });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 mb-6 transition"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <div className="flex items-center gap-3 mb-6">
          <Upload className="h-6 w-6 text-indigo-600" />
          <h1 className="text-xl font-bold text-slate-900">Upload Resumes</h1>
        </div>

        <form onSubmit={handleUpload} className="space-y-5">
          {/* Role selector */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Select Role *</label>
            <div className="flex gap-2">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                required
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">— Choose a role —</option>
                {roles.map((r) => (
                  <option key={r._id} value={r._id}>{r.title}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => navigate('/roles/new')}
                className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 border border-indigo-200 px-3 py-2.5 rounded-lg hover:bg-indigo-50 transition"
              >
                <Plus className="h-4 w-4" /> New
              </button>
            </div>
          </div>

          {/* Drop zone */}
          <div
            className={`relative rounded-xl border-2 border-dashed p-8 text-center transition
              ${dragActive ? 'border-indigo-400 bg-indigo-50' : 'border-slate-300 hover:border-slate-400'}`}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
          >
            <FileText className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-600 mb-1">
              Drag & drop PDF files here, or{' '}
              <label className="text-indigo-600 cursor-pointer hover:underline font-medium">
                browse
                <input
                  type="file"
                  multiple
                  accept=".pdf,.docx"
                  className="hidden"
                  onChange={(e) => handleFiles(Array.from(e.target.files))}
                />
              </label>
            </p>
            <p className="text-xs text-slate-400">PDF or DOCX, up to 10 MB each</p>
          </div>

          {/* File list */}
          {files.length > 0 && (
            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-slate-700 mb-2">
                Selected Files ({files.length})
              </h4>
              <ul className="space-y-1.5">
                {files.map((f, i) => (
                  <li key={i} className="flex items-center justify-between text-sm text-slate-600">
                    <span className="truncate">{f.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="text-xs text-red-500 hover:text-red-700 ml-2"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Status */}
          {status && (
            <div className={`flex items-start gap-2 rounded-lg p-3 text-sm ${
              status.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
              status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
              'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>
              {status.type === 'success' ? <Check className="h-4 w-4 mt-0.5 shrink-0" /> :
               status.type === 'error' ? <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" /> : null}
              {status.message}
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={uploading || !files.length}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <Upload className="h-4 w-4" />
              {uploading ? 'Processing...' : 'Upload & Process'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              disabled={uploading}
              className="px-6 py-3 rounded-xl border border-slate-300 text-slate-600 font-medium hover:bg-slate-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
