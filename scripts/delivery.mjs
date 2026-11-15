import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { assessPullRequest } from './lib/delivery-gate.mjs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const team = JSON.parse(readFileSync(path.join(root, 'config/team.json'), 'utf8'));
const repo = team.repository;
const merge = process.argv.includes('--merge');
function gh(...args) {
  const result = spawnSync('gh', args, { cwd: root, encoding: 'utf8', windowsHide: true });
  if (result.error || result.status !== 0)
    throw new Error(result.error?.message || result.stderr || 'GitHub request failed');
  return result.stdout.trim();
}
try {
  const login = JSON.parse(gh('api', 'user')).login;
  const pr = JSON.parse(
    gh(
      'pr',
      'view',
      '1',
      '--repo',
      repo,
      '--json',
      'number,url,state,isDraft,author,headRefOid,baseRefName,mergeable,statusCheckRollup',
    ),
  );
  if (pr.state === 'MERGED') {
    console.log('PR đã merge: ' + pr.url);
    process.exit(0);
  }
  const [owner, name] = repo.split('/');
  const query =
    'query($owner:String!,$name:String!){repository(owner:$owner,name:$name){pullRequest(number:1){reviews(last:100){nodes{author{login}state submittedAt commit{oid}}}}}}';
  pr.reviews = JSON.parse(
    gh('api', 'graphql', '-f', 'query=' + query, '-f', 'owner=' + owner, '-f', 'name=' + name),
  ).data.repository.pullRequest.reviews.nodes;
  const collaborators = JSON.parse(gh('api', `repos/${repo}/collaborators?per_page=100`));
  const result = assessPullRequest(pr, collaborators, team);
  const report = {
    checked_at: new Date().toISOString(),
    actor: login,
    source_commit: pr.headRefOid,
    pr: pr.url,
    mode: merge ? 'merge-if-ready' : 'read-only',
    ...result,
  };
  mkdirSync(path.join(root, 'data'), { recursive: true });
  writeFileSync(
    path.join(root, 'data/delivery-readiness.json'),
    JSON.stringify(report, null, 2) + '\n',
  );
  console.log(
    result.ready ? 'READY: approval và CI hợp lệ.' : 'BLOCKED:\n- ' + result.blockers.join('\n- '),
  );
  console.log('Bản ghi: data/delivery-readiness.json');
  if (!result.ready) process.exitCode = 2;
  else if (merge) {
    if (login.toLowerCase() !== owner.toLowerCase())
      throw new Error('Cần chủ repo để thực hiện bước merge đã chuẩn bị.');
    // Preserve commit history; GitHub enforces branch rules. Never use --admin or synthesize approvals.
    console.log(
      gh('pr', 'merge', '1', '--repo', repo, '--merge', '--match-head-commit', pr.headRefOid),
    );
    const updated = JSON.parse(gh('pr', 'view', '1', '--repo', repo, '--json', 'state,url'));
    if (updated.state !== 'MERGED')
      throw new Error('GitHub chưa xác nhận merge. Kiểm tra PR trên giao diện.');
    console.log('MERGED: ' + updated.url);
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
