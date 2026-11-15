import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const npmCli = process.env.npm_execpath;
if (!npmCli) throw new Error('Chạy bằng npm.cmd run qa:verify (Windows) hoặc npm run qa:verify.');
const git = (...args) => {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
  return result.status === 0 ? result.stdout.trim() : null;
};
const capturedAt = new Date().toISOString();
const dir = path.join(root, 'data/qa-runs', capturedAt.replace(/[:.]/g, '-'));
mkdirSync(dir, { recursive: true });
const manifest = {
  captured_at: capturedAt,
  performed_by: 'Codex-assisted automated verification; not a student peer approval or UAT',
  source_commit: git('rev-parse', 'HEAD'),
  branch: git('branch', '--show-current'),
  tracked_changes: git('status', '--porcelain', '--untracked-files=no'),
  steps: [],
  limitations: [
    'Human peer approval pending',
    'Production HTTPS/UAT/sign-off not performed by this command',
  ],
};
for (const script of ['check', 'lint', 'format:check', 'test']) {
  console.log('VERIFY: npm run ' + script);
  const result = spawnSync(process.execPath, [npmCli, 'run', script], {
    cwd: root,
    encoding: 'utf8',
    env: process.env,
  });
  const log = (result.stdout || '') + (result.stderr || '');
  writeFileSync(path.join(dir, script.replace(':', '-') + '.log'), log);
  manifest.steps.push({ script, exit_code: result.status, passed: result.status === 0 });
  console.log(result.status === 0 ? 'PASS: ' + script : 'FAIL: ' + script);
  if (result.status !== 0) {
    console.error(log);
    break;
  }
}
manifest.all_passed = manifest.steps.length === 4 && manifest.steps.every((step) => step.passed);
writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log('Evidence: ' + dir);
console.log('Không tự approve/merge PR hoặc xác nhận đóng góp của thành viên.');
process.exitCode = manifest.all_passed ? 0 : 1;
