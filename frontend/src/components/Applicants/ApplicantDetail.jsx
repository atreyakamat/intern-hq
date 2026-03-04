import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import ScoreBadge from './ScoreBadge';
import {
  ArrowLeft, Mail, Github, Linkedin, Globe, CheckCircle, XCircle,
  Briefcase, GraduationCap, Clock, Star, AlertTriangle,
} from 'lucide-react';

const STATUS_STYLES = {
  pending:   'bg-slate-100 text-slate-700',
  reviewing: 'bg-blue-100 text-blue-700',
  accepted:  'bg-emerald-100 text-emerald-700',
  rejected:  'bg-red-100 text-red-700',
};

export default function ApplicantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [applicant, setApplicant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetch = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/applicants/${id}`);
      setApplicant(res.data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, [id]);

  const handleStatus = async (status) => {
    try {
      setActionLoading(true);
      await axios.patch(`${API_BASE_URL}/api/applicants/${id}/status`, {
        status,
        sendNotification: true,
      });
      await fetch();
    } catch (err) {
      console.error('Status update error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400">
        <Clock className="h-5 w-5 animate-spin mr-2" /> Loading...
      </div>
    );
  }

  if (!applicant) {
    return (
      <div className="text-center py-20 text-slate-400">
        Applicant not found.
        <button onClick={() => navigate('/')} className="ml-2 text-indigo-600 underline">Go back</button>
      </div>
    );
  }

  const a = applicant;
  const det = a.deterministicScore || {};

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 mb-6 transition"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </button>

      {/* Header card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{a.name}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[a.hrStatus] || STATUS_STYLES.pending}`}>
                {a.hrStatus}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-500">
              {a.email && (
                <span className="inline-flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" /> {a.email}
                </span>
              )}
              {a.role?.title && (
                <span className="inline-flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5" /> {a.role.title}
                </span>
              )}
              {a.education && (
                <span className="inline-flex items-center gap-1">
                  <GraduationCap className="h-3.5 w-3.5" /> {a.education}
                </span>
              )}
            </div>
            {/* Links */}
            <div className="flex items-center gap-3 mt-3">
              {a.githubUrl && (
                <a href={a.githubUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-700 transition">
                  <Github className="h-4 w-4" />
                </a>
              )}
              {a.linkedinUrl && (
                <a href={a.linkedinUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-700 transition">
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
              {a.portfolioUrl && (
                <a href={a.portfolioUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-700 transition">
                  <Globe className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
          <ScoreBadge score={a.finalScore} size="lg" />
        </div>
      </div>

      {/* Score breakdown */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Deterministic scores */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h2 className="font-semibold text-slate-900 mb-4">Deterministic Score Breakdown</h2>
          <div className="space-y-3">
            {[
              { label: 'Skill Match', val: det.skillMatch },
              { label: 'Experience', val: det.experienceScore },
              { label: 'Project Depth', val: det.projectDepth },
              { label: 'Clarity', val: det.clarityScore },
              { label: 'Bonus Signals', val: det.bonusSignals },
            ].map(({ label, val }) => (
              <div key={label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">{label}</span>
                  <span className="font-medium text-slate-800">{val ?? 0}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all"
                    style={{ width: `${val ?? 0}%` }}
                  />
                </div>
              </div>
            ))}
            <div className="pt-2 border-t border-slate-100 flex justify-between font-semibold text-sm">
              <span>Weighted Total</span>
              <span>{det.weighted ?? 0}</span>
            </div>
          </div>
        </div>

        {/* AI evaluation */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h2 className="font-semibold text-slate-900 mb-4">AI Evaluation</h2>
          <div className="flex items-center gap-3 mb-4">
            <div className="text-3xl font-bold text-indigo-600">{a.aiScore}</div>
            {a.fitRating && (
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                a.fitRating === 'Excellent' ? 'bg-emerald-100 text-emerald-800' :
                a.fitRating === 'Strong' ? 'bg-green-100 text-green-800' :
                a.fitRating === 'Moderate' ? 'bg-amber-100 text-amber-800' :
                'bg-red-100 text-red-800'
              }`}>
                {a.fitRating}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">{a.aiSummary || 'No AI summary available.'}</p>
        </div>
      </div>

      {/* Strengths / Weaknesses */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <Star className="h-4 w-4 text-emerald-600" />
            <h3 className="font-semibold text-slate-900">Strengths</h3>
          </div>
          <ul className="space-y-1.5">
            {(a.strengths || []).map((s, i) => (
              <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                {s}
              </li>
            ))}
            {(!a.strengths || a.strengths.length === 0) && (
              <li className="text-sm text-slate-400 italic">No strengths identified</li>
            )}
          </ul>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <h3 className="font-semibold text-slate-900">Weaknesses</h3>
          </div>
          <ul className="space-y-1.5">
            {(a.weaknesses || []).map((w, i) => (
              <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                {w}
              </li>
            ))}
            {(!a.weaknesses || a.weaknesses.length === 0) && (
              <li className="text-sm text-slate-400 italic">No weaknesses identified</li>
            )}
          </ul>
        </div>
      </div>

      {/* Skills */}
      {a.skills && a.skills.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-6">
          <h3 className="font-semibold text-slate-900 mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {a.skills.map((s, i) => (
              <span key={i} className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg text-sm font-medium">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Email log */}
      {a.emailLog && a.emailLog.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-6">
          <h3 className="font-semibold text-slate-900 mb-3">Email Log</h3>
          <div className="space-y-2">
            {a.emailLog.map((log, i) => (
              <div key={i} className="flex items-center justify-between bg-slate-50 rounded-lg px-4 py-2 text-sm">
                <div>
                  <span className="font-medium capitalize">{log.type}</span>
                  <span className="text-slate-400 ml-2">{log.subject}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  log.status === 'sent' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                }`}>
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => handleStatus('accepted')}
          disabled={actionLoading || a.hrStatus === 'accepted'}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <CheckCircle className="h-4 w-4" />
          Accept & Notify
        </button>
        <button
          onClick={() => handleStatus('rejected')}
          disabled={actionLoading || a.hrStatus === 'rejected'}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <XCircle className="h-4 w-4" />
          Reject & Notify
        </button>
        <button
          onClick={() => handleStatus('reviewing')}
          disabled={actionLoading}
          className="flex-1 inline-flex items-center justify-center gap-2 border border-slate-300 text-slate-700 px-6 py-3 rounded-xl font-medium hover:bg-slate-50 transition disabled:opacity-50 shadow-sm"
        >
          Mark Reviewing
        </button>
      </div>
    </div>
  );
}
