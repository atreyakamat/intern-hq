export function buildApplicantQuery(filters = {}) {
  const params = {};

  if (filters.hrStatus && filters.hrStatus !== 'all') params.status = filters.hrStatus;
  if (filters.minScore) params.minScore = filters.minScore;
  if (filters.sortBy) params.sortBy = filters.sortBy;
  if (filters.roleId) params.roleId = filters.roleId;

  return params;
}

export function resolveActiveRoleId(filters = {}, applicants = [], roles = []) {
  return filters.roleId || applicants[0]?.role?._id || applicants[0]?.role || roles[0]?._id || '';
}

export function getUnnotifiedApplicantsByStatus(applicants = [], status) {
  return applicants.filter((applicant) => applicant.hrStatus === status && !applicant.emailSent);
}
