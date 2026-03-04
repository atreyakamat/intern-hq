/**
 * ApplicantModal.jsx — Modal overlay showing full applicant detail.
 *
 * Displayed when an applicant row/card is clicked on the dashboard.
 * Shows resume data, score breakdown, AI evaluation, strengths/weaknesses.
 */

import React, { useState, useEffect } from 'react';
import ScoreBadge from '../components/Applicants/ScoreBadge';
import { getApplicantById } from '../api/api';
import {
  X, Mail, Github, Linkedin, Globe, CheckCircle, XCircle,
  Briefcase, GraduationCap, Clock, Star, AlertTriangle,
} from 'lucide-react';

const STATUS_STYLES = {
  pending:   'bg-slate-100 text-slate-700',
  reviewing: 'bg-blue-100 text-blue-700',
  accepted:  'bg-emerald-100 text-emerald-700',
  rejected:  'bg-red-100 text-red-700',
};

export default function ApplicantModal({ applicantId, onClose, onStatusChange }) {
  const [applicant, setApplicant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!applicantId) return;
    (async () => {
      try {
        setLoading(true);
        const res = await getApplicantById(applicantId);
        setApplicant(res.data);
      } catch (err) {
        console.error('Error loading applicant:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [applicantId]);

  if (!applicantId) return null;

  /* Backdrop click → close */
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  const a = applicant;
  const det = a?.deterministicScore || {};

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleBackdrop}
    >
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-100 transition z-10"
        >
          <X className="h-5 w-5 text-slate-400" />
        </button>

        {loading ? (
          <div className="flex items-center justify-center py-24 text-slate-400">
            <Clock className="h-5 w-5 animate-spin mr-2" /> Loading...
          </div>
        ) : !a ? (
          <div className="text-center py-24 text-slate-400">Applicant not found.</div>
        ) : (
          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-slate-900">{a.name}</h1>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[a.hrStatus] || STATUS_STYLES.pending}`}>
                    {a.hrStatus}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-500">
                  {a.email && (
                    <span className="inline-flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {a.email}</span>
                  )}
                  {a.role?.title && (
                    <span className="inline-flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" /> {a.role.title}</span>
                  )}
                  {a.education && (
                    <span className="inline-flex items-center gap-1"><GraduationCap className="h-3.5 w-3.5" /> {a.education}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-3">
                  {a.githubUrl && (
                    <a href={a.githubUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-700 transition"><Github className="h-4 w-4" /></a>
                  )}
                  {a.linkedinUrl && (
                    <a href={a.linkedinUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-700 transition"><Linkedin className="h-4 w-4" /></a>
                  )}
                  {a.portfolioUrl && (
                    <a href={a.portfolioUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-700 transition"><Globe className="h-4 w-4" /></a>
                  )}
                </div>
              </div>
              <ScoreBadge score={a.finalScore} size="lg" />
            </div>

            {/* Score breakdown */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Deterministic */}
              <div className="bg-slate-50 rounded-xl p-5">
                <h2 className="font-semibold text-slate-900 mb-4">Deterministic Scores</h2>
                <div className="space-y-3">
                  {[
                    { label: 'Skill Match', val: det.skillMatch },
                    { label: 'Experience', val: det.experienceScore },
                    { label: 'Project Depth', val: det.projectDepth },
                    { label: 'Communication', val: det.communication },
                    { label: 'Bonus Signals', val: det.bonusSignals },
                  ].map(({ label, val }) => (
                    <div key={label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600">{label}</span>
                        <span className="font-medium text-slate-800">{val ?? 0}</span>
                      </div>
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${val ?? 0}%` }} />
                      </div>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-slate-200 flex justify-between font-semibold text-sm">
                    <span>Weighted Total</span>
                    <span>{det.weighted ?? 0}</span>
                  </div>
                </div>
              </div>

              {/* AI eval */}
              <div className="bg-slate-50 rounded-xl p-5">
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
                <p className="text-sm text-slate-600 leading-relaxed">{a.aiSummary || 'No AI summary yet.'}</p>
              </div>
            </div>

            {/* Strengths / Weaknesses */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-slate-50 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="h-4 w-4 text-emerald-600" />
                  <h3 className="font-semibold text-slate-900">Strengths</h3>
                </div>
                <ul className="space-y-1.5">
                  {(a.strengths || []).map((s, i) => (
                    <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />{s}
                    </li>
                  ))}
                  {(!a.strengths || a.strengths.length === 0) && (
                    <li className="text-sm text-slate-400 italic">Not evaluated yet</li>
                  )}
                </ul>
              </div>
              <div className="bg-slate-50 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <h3 className="font-semibold text-slate-900">Weaknesses</h3>
                </div>
                <ul className="space-y-1.5">
                  {(a.weaknesses || []).map((w, i) => (
                    <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />{w}
                    </li>
                  ))}
                  {(!a.weaknesses || a.weaknesses.length === 0) && (
                    <li className="text-sm text-slate-400 italic">Not evaluated yet</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Skills */}
            {a.skills?.length > 0 && (
              <div className="bg-slate-50 rounded-xl p-5 mb-6">
                <h3 className="font-semibold text-slate-900 mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {a.skills.map((s, i) => (
                    <span key={i} className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg text-sm font-medium">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Email log */}
            {a.emailLog?.length > 0 && (
              <div className="bg-slate-50 rounded-xl p-5 mb-6">
                <h3 className="font-semibold text-slate-900 mb-3">Email Log</h3>
                <div className="space-y-2">
                  {a.emailLog.map((log, i) => (
                    <div key={i} className="flex items-center justify-between bg-white rounded-lg px-4 py-2 text-sm border border-slate-100">
                      <div>
                        <span className="font-medium capitalize">{log.type}</span>
                        <span className="text-slate-400 ml-2">{log.subject}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${log.status === 'sent' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
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
                onClick={() => onStatusChange?.(a._id, 'accepted')}
                disabled={a.hrStatus === 'accepted'}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <CheckCircle className="h-4 w-4" /> Accept & Notify
              </button>
              <button
                onClick={() => onStatusChange?.(a._id, 'rejected')}
                disabled={a.hrStatus === 'rejected'}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <XCircle className="h-4 w-4" /> Reject & Notify
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
