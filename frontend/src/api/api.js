/**
 * api.js — Centralized API client for InternSieve
 *
 * All backend calls go through this module so that endpoint URLs
 * and request shaping live in a single place.
 */

import axios from 'axios';
import { API_BASE_URL } from '../config';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 120_000, // AI calls can take a while
});

/* ---------- Role ---------- */

/** POST /api/role — Create a new internship role */
export const createRole = (roleData) => client.post('/api/role', roleData);

/** GET /api/roles — List all roles */
export const getRoles = () => client.get('/api/roles');

/** GET /api/roles/:id */
export const getRoleById = (id) => client.get(`/api/roles/${id}`);

/** PUT /api/roles/:id */
export const updateRole = (id, data) => client.put(`/api/roles/${id}`, data);

/** DELETE /api/roles/:id */
export const deleteRole = (id) => client.delete(`/api/roles/${id}`);

/* ---------- Applicants ---------- */

/**
 * POST /api/apply — Submit application with resume(s)
 * Accepts FormData with: roleId, resume (file), name, email, phone, skills, coverLetter
 */
export const applyToRole = (formData) =>
  client.post('/api/apply', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 180_000,
  });

/** GET /api/applicants?roleId=&status=&sort=&page=&limit= */
export const getApplicants = (params = {}) =>
  client.get('/api/applicants', { params });

/** GET /api/applicants/:id */
export const getApplicantById = (id) => client.get(`/api/applicants/${id}`);

/* ---------- Workflow actions ---------- */

/** POST /api/evaluate — { roleId, applicantIds? } */
export const evaluateApplicants = (roleId, applicantIds) =>
  client.post('/api/evaluate', { roleId, applicantIds }, { timeout: 300_000 });

/** POST /api/rank — { roleId } */
export const rankApplicants = (roleId) =>
  client.post('/api/rank', { roleId });

/** POST /api/notify — { applicantIds, action: 'accept'|'reject' } */
export const notifyApplicants = (applicantIds, action) =>
  client.post('/api/notify', { applicantIds, action });

/* ---------- Extended ---------- */

/** PATCH /api/applicants/:id/status — { status, sendEmail? } */
export const updateApplicantStatus = (id, status, sendEmail = false) =>
  client.patch(`/api/applicants/${id}/status`, { status, sendEmail });

/** POST /api/applicants/bulk-action — { applicantIds, action, sendEmail? } */
export const bulkAction = (applicantIds, action, sendEmail = false) =>
  client.post('/api/applicants/bulk-action', { applicantIds, action, sendEmail });

/** GET /api/applicants/compare/:roleId?topN= */
export const compareApplicants = (roleId, topN = 5) =>
  client.get(`/api/applicants/compare/${roleId}`, { params: { topN } });

/** GET /api/applicants/analytics?roleId= */
export const getAnalytics = (roleId) =>
  client.get('/api/applicants/analytics', { params: { roleId } });

export default client;
