import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildApplicantQuery,
  resolveActiveRoleId,
  getUnnotifiedApplicantsByStatus,
} from '../src/utils/dashboard.js';

test('buildApplicantQuery only includes meaningful filter values', () => {
  const params = buildApplicantQuery({
    hrStatus: 'accepted',
    minScore: 75,
    sortBy: 'score',
    roleId: 'role-123',
  });

  assert.deepEqual(params, {
    status: 'accepted',
    minScore: 75,
    sortBy: 'score',
    roleId: 'role-123',
  });
});

test('buildApplicantQuery omits default filter values', () => {
  const params = buildApplicantQuery({
    hrStatus: 'all',
    minScore: 0,
    sortBy: '',
    roleId: '',
  });

  assert.deepEqual(params, {});
});

test('resolveActiveRoleId prefers explicit role filter, then applicants, then roles', () => {
  assert.equal(
    resolveActiveRoleId(
      { roleId: 'filtered-role' },
      [{ role: { _id: 'applicant-role' } }],
      [{ _id: 'fallback-role' }]
    ),
    'filtered-role'
  );

  assert.equal(
    resolveActiveRoleId(
      {},
      [{ role: { _id: 'applicant-role' } }],
      [{ _id: 'fallback-role' }]
    ),
    'applicant-role'
  );

  assert.equal(resolveActiveRoleId({}, [], [{ _id: 'fallback-role' }]), 'fallback-role');
});

test('getUnnotifiedApplicantsByStatus returns only pending notifications for a status', () => {
  const applicants = [
    { _id: '1', hrStatus: 'accepted', emailSent: false },
    { _id: '2', hrStatus: 'accepted', emailSent: true },
    { _id: '3', hrStatus: 'rejected', emailSent: false },
  ];

  assert.deepEqual(getUnnotifiedApplicantsByStatus(applicants, 'accepted'), [
    { _id: '1', hrStatus: 'accepted', emailSent: false },
  ]);
});
