import { readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const filename = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(filename) : /\.(js|mjs)$/.test(filename) ? [filename] : [];
  });
}
const files = [
  'server.js',
  ...walk('src'),
  ...walk('public'),
  ...walk('scripts'),
  ...walk('tests'),
];
for (const file of files) {
  const result = spawnSync(process.execPath, ['--check', file], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status || 1);
}
console.log(`Syntax check passed: ${files.length} JavaScript files.`);
