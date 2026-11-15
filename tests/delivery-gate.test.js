import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assessPullRequest } from '../scripts/lib/delivery-gate.mjs';
const hash = 'a'.repeat(40);
// Synthetic identities only for unit testing the gate; not actual GitHub approvals.
const team = {
  members: [{ github: 'owner-fixture' }, { github: 'lead-fixture' }, { github: 'qa-fixture' }],
};
const collaborators = ['owner-fixture', 'lead-fixture', 'qa-fixture'].map((login) => ({
  login,
  role_name: 'write',
}));
function input() {
  return {
    state: 'OPEN',
    isDraft: false,
    author: { login: 'owner-fixture' },
    headRefOid: hash,
    baseRefName: 'main',
    mergeable: 'MERGEABLE',
    reviews: [],
    statusCheckRollup: ['verify', 'browser', 'container'].map((name) => ({
      name,
      conclusion: 'SUCCESS',
      completedAt: '2026-01-01T00:00:00Z',
    })),
  };
}
function approval(login = 'lead-fixture', oid = hash) {
  return {
    author: { login },
    state: 'APPROVED',
    commit: { oid },
    submittedAt: '2026-01-01T00:00:00Z',
  };
}
test('Delivery refuses absent peer approval and self approval', () => {
  const pr = input();
  assert.equal(assessPullRequest(pr, collaborators, team).ready, false);
  pr.reviews = [approval('owner-fixture')];
  assert.equal(assessPullRequest(pr, collaborators, team).ready, false);
});
test('Delivery refuses stale approvals and nonmember approvals', () => {
  const pr = input();
  pr.reviews = [approval('lead-fixture', 'b'.repeat(40))];
  assert.equal(assessPullRequest(pr, collaborators, team).ready, false);
  pr.reviews = [approval('outside-fixture')];
  assert.equal(
    assessPullRequest(
      pr,
      [...collaborators, { login: 'outside-fixture', role_name: 'write' }],
      team,
    ).ready,
    false,
  );
});
test('Delivery requires all three CI checks; a later failed run cannot be hidden by an old success', () => {
  const pr = input();
  pr.reviews = [approval()];
  pr.statusCheckRollup.pop();
  assert.equal(assessPullRequest(pr, collaborators, team).ready, false);
  pr.statusCheckRollup.push({
    name: 'container',
    conclusion: 'FAILURE',
    completedAt: '2026-01-02T00:00:00Z',
  });
  assert.equal(assessPullRequest(pr, collaborators, team).ready, false);
});
test('Delivery accepts a current independent approval but respects a later request for changes', () => {
  const pr = input();
  pr.reviews = [approval()];
  assert.equal(assessPullRequest(pr, collaborators, team).ready, true);
  pr.reviews.push({
    ...approval(),
    state: 'CHANGES_REQUESTED',
    submittedAt: '2026-01-02T00:00:00Z',
  });
  assert.equal(assessPullRequest(pr, collaborators, team).ready, false);
});
test('A comment does not erase an approval, while a dismissal does', () => {
  const pr = input();
  pr.reviews = [
    approval(),
    { ...approval(), state: 'COMMENTED', submittedAt: '2026-01-02T00:00:00Z' },
  ];
  assert.equal(assessPullRequest(pr, collaborators, team).ready, true);
  pr.reviews.push({ ...approval(), state: 'DISMISSED', submittedAt: '2026-01-03T00:00:00Z' });
  assert.equal(assessPullRequest(pr, collaborators, team).ready, false);
});
test('Delivery refuses drafts, wrong base and conflicts even with approval', () => {
  for (const change of [
    { isDraft: true },
    { baseRefName: 'other' },
    { mergeable: 'CONFLICTING' },
  ]) {
    const pr = { ...input(), ...change, reviews: [approval()] };
    assert.equal(assessPullRequest(pr, collaborators, team).ready, false);
  }
});
