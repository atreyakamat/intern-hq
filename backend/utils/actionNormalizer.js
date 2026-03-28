const ACTION_ALIASES = {
  accept: 'accepted',
  accepted: 'accepted',
  reject: 'rejected',
  rejected: 'rejected',
  review: 'reviewing',
  reviewing: 'reviewing',
  pending: 'pending',
};

function normalizeWorkflowAction(action) {
  if (!action) return '';
  return ACTION_ALIASES[String(action).trim().toLowerCase()] || '';
}

module.exports = { normalizeWorkflowAction };
