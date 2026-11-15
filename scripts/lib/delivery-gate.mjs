const requiredChecks = ['verify', 'browser', 'container'];
const lower = (value) => String(value || '').toLowerCase();

export function assessPullRequest(pr, collaborators, team) {
  const blockers = [];
  if (pr.state !== 'OPEN') blockers.push('PR chưa ở trạng thái OPEN.');
  if (pr.isDraft !== false) blockers.push('PR còn draft hoặc chưa đọc được thông tin draft.');
  if (pr.baseRefName !== 'main') blockers.push('PR không nhắm vào main.');
  if (!/^[a-f0-9]{40}$/i.test(pr.headRefOid || ''))
    blockers.push('Không xác định được commit cần merge.');
  if (pr.mergeable !== 'MERGEABLE')
    blockers.push('GitHub chưa xác nhận mergeable hoặc đang có xung đột.');

  const knownMembers = new Set(team.members.map((member) => lower(member.github)).filter(Boolean));
  const writable = new Set(
    collaborators
      .filter(
        (member) =>
          member.permissions?.push || ['write', 'maintain', 'admin'].includes(member.role_name),
      )
      .map((member) => lower(member.login)),
  );
  const latestReviews = new Map();
  for (const review of [...(pr.reviews || [])].sort((a, b) =>
    String(a.submittedAt).localeCompare(String(b.submittedAt)),
  )) {
    const login = lower(review.author?.login);
    if (['APPROVED', 'CHANGES_REQUESTED', 'DISMISSED'].includes(review.state))
      latestReviews.set(login, review);
  }
  const reviewers = [...latestReviews.entries()].filter(
    ([login]) =>
      login !== lower(pr.author?.login) && knownMembers.has(login) && writable.has(login),
  );
  if (reviewers.some(([, review]) => review.state === 'CHANGES_REQUESTED'))
    blockers.push('Còn reviewer yêu cầu sửa chưa được giải quyết.');
  const approvals = reviewers
    .filter(([, review]) => review.state === 'APPROVED' && review.commit?.oid === pr.headRefOid)
    .map(([login]) => login);
  if (!approvals.length) blockers.push('Chưa có thành viên khác tác giả approve commit hiện tại.');

  for (const name of requiredChecks) {
    const matches = (pr.statusCheckRollup || [])
      .filter((check) => (check.name || check.context) === name)
      .sort((a, b) =>
        String(a.completedAt || a.startedAt).localeCompare(String(b.completedAt || b.startedAt)),
      );
    const check = matches.at(-1);
    if (!check || (check.conclusion || check.state) !== 'SUCCESS')
      blockers.push(`Check ${name} chưa SUCCESS.`);
  }
  return {
    ready: blockers.length === 0,
    blockers,
    approved_reviewers: approvals,
    required_checks: requiredChecks,
  };
}
