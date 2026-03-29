export function buildApplicantQuery(filters = {}) {
  const params = {};

  if (filters.hrStatus && filters.hrStatus !== 'all') params.status = filters.hrStatus;
  if (filters.minScore) params.minScore = filters.minScore;
  if (filters.sortBy) params.sortBy = filters.sortBy;
  if (filters.roleId) params.roleId = filters.roleId;

  return params;
}

export function resolveActiveRoleId(filters = {}, applicants = [], roles = []) {
  if (filters.roleId) return filters.roleId;

  const applicantRoleIds = [
    ...new Set(
      applicants
        .map((applicant) => applicant?.role?._id || applicant?.role || '')
        .filter(Boolean)
    ),
  ];

  if (applicantRoleIds.length === 1) {
    return applicantRoleIds[0];
  }

  if (roles.length === 1) {
    return roles[0]?._id || '';
  }

  return '';
}

export function getUnnotifiedApplicantsByStatus(applicants = [], status) {
  return applicants.filter((applicant) => applicant.hrStatus === status && !applicant.emailSent);
}
