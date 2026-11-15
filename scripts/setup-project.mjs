/** Run with Node24 + GitHub CLI authenticated as project owner (project scope). No credentials are accepted as arguments. */
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const plan = JSON.parse(readFileSync(path.join(root, 'config/project-plan.json'), 'utf8'));
const apply = process.argv.includes('--apply');
function gh(...args) {
  const r = spawnSync('gh', args, { encoding: 'utf8', windowsHide: true });
  if (r.error?.code === 'ENOENT')
    throw Error(
      'Chưa có GitHub CLI. Cài bằng: winget install --id GitHub.cli -e; sau đó mở lại VS Code.',
    );
  if (r.status !== 0) throw Error((r.stderr || r.stdout || 'GitHub request failed').trim());
  return r.stdout;
}
try {
  const identity = JSON.parse(gh('api', 'user')).login;
  console.log(
    `Tài khoản: ${identity}; Project: ${plan.owner}/${plan.number}; chế độ: ${apply ? 'ÁP DỤNG' : 'XEM TRƯỚC'}`,
  );
  if (identity.toLowerCase() !== plan.owner.toLowerCase())
    throw Error('Hãy đăng nhập tài khoản chủ Project ' + plan.owner + ' bằng gh auth login.');
  const project = JSON.parse(
    gh('project', 'view', String(plan.number), '--owner', plan.owner, '--format', 'json'),
  );
  const fields = JSON.parse(
    gh('project', 'field-list', String(plan.number), '--owner', plan.owner, '--format', 'json'),
  ).fields;
  const byName = Object.fromEntries(fields.map((f) => [f.name, f]));
  for (const name of ['Status', 'Story Points', 'Sprint'])
    if (!byName[name]) throw Error('Thiếu field ' + name + ' trong Project.');
  const iterationField = byName.Sprint;
  const query = `query($id:ID!){node(id:$id){... on ProjectV2IterationField{configuration{iterations{id title startDate duration}completedIterations{id title startDate duration}}}}}`;
  const data = JSON.parse(
    gh('api', 'graphql', '-f', 'query=' + query, '-f', 'id=' + iterationField.id),
  );
  const cfg = data.data.node.configuration,
    iterations = [...cfg.iterations, ...cfg.completedIterations];
  for (const name of new Set(plan.tasks.map((t) => t.sprint)))
    if (!iterations.some((i) => i.title === name))
      throw Error('Không tìm thấy iteration ' + name + '; hãy tạo trong Settings trước.');
  const items = JSON.parse(
    gh(
      'project',
      'item-list',
      String(plan.number),
      '--owner',
      plan.owner,
      '--limit',
      '100',
      '--format',
      'json',
    ),
  ).items;
  const report = [];
  function fieldValue(item, name) {
    const key = Object.keys(item).find(
      (k) => k.replace(/\s/g, '').toLowerCase() === name.replace(/\s/g, '').toLowerCase(),
    );
    return key ? item[key] : undefined;
  }
  function set(item, field, kind, value) {
    if (apply)
      gh(
        'project',
        'item-edit',
        '--id',
        item.id,
        '--project-id',
        project.id,
        '--field-id',
        field.id,
        kind,
        String(value),
      );
    report.push({ issue: item.content.number, field: field.name, value, applied: apply });
  }
  for (const task of plan.tasks) {
    const item = items.find(
      (i) => i.content?.number === task.issue && i.content?.repository === plan.repository,
    );
    if (!item) throw Error('Issue #' + task.issue + ' chưa được thêm vào Project.');
    const points = fieldValue(item, 'Story Points');
    if (points === undefined || points === null)
      set(item, byName['Story Points'], '--number', task.proposed_points);
    if (!fieldValue(item, 'Sprint'))
      set(
        item,
        byName.Sprint,
        '--iteration-id',
        iterations.find((i) => i.title === task.sprint).id,
      );
    const status = fieldValue(item, 'Status');
    if (!status || status === 'Backlog') {
      const option = byName.Status.options.find((o) => o.name === task.status);
      if (!option) throw Error('Thiếu status ' + task.status);
      if (status !== task.status) set(item, byName.Status, '--single-select-option-id', option.id);
    }
    console.log(
      `#${task.issue}: ${task.sprint} | ${task.proposed_points} điểm ĐỀ XUẤT | ${task.status}`,
    );
  }
  mkdirSync(path.join(root, 'data'), { recursive: true });
  writeFileSync(
    path.join(root, 'data/project-setup-result.json'),
    JSON.stringify(
      {
        recorded_at: new Date().toISOString(),
        project: project.url,
        estimate_status: 'proposed, not Planning Poker',
        report,
      },
      null,
      2,
    ),
  );
  console.log(
    apply
      ? 'Đã gửi cập nhật. Tải lại Project. Nhóm cần xác nhận ước lượng.'
      : 'Chưa thay đổi Project. Chạy npm.cmd run project:apply để áp dụng.',
  );
  console.log(
    'Không đóng Issue, không chỉnh ngày commit, không gán QA và không ghi lịch sử Sprint đã hoàn thành.',
  );
} catch (e) {
  console.error(e.message);
  console.error(
    'Nếu thiếu scope Projects, trên máy bạn chạy: gh auth refresh -h github.com -s project',
  );
  process.exitCode = 1;
}
