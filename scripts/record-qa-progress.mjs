import { spawnSync } from 'node:child_process';
const apply = process.argv.includes('--apply');
const owner = 'TanTai08',
  projectNumber = '1';
function gh(...args) {
  const result = spawnSync('gh', args, { encoding: 'utf8', windowsHide: true });
  if (result.error || result.status !== 0)
    throw new Error(result.error?.message || result.stderr || 'GitHub request failed');
  return result.stdout;
}
try {
  if (JSON.parse(gh('api', 'user')).login.toLowerCase() !== owner.toLowerCase())
    throw new Error('Chạy bằng tài khoản chủ Project TanTai08.');
  const project = JSON.parse(
    gh('project', 'view', projectNumber, '--owner', owner, '--format', 'json'),
  );
  const fields = JSON.parse(
    gh('project', 'field-list', projectNumber, '--owner', owner, '--format', 'json'),
  ).fields;
  const field = fields.find((item) => item.name === 'Status');
  const items = JSON.parse(
    gh(
      'project',
      'item-list',
      projectNumber,
      '--owner',
      owner,
      '--limit',
      '100',
      '--format',
      'json',
    ),
  ).items;
  for (const [number, status] of [
    [4, 'In Review'],
    [10, 'In Progress'],
    [17, 'In Review'],
  ]) {
    const item = items.find(
      (item) =>
        item.content?.number === number && item.content.repository === owner + '/WebSouvenir',
    );
    if (!item) throw new Error('Không tìm thấy Issue #' + number);
    const option = field.options.find((option) => option.name === status);
    if (!option) throw new Error('Không tìm thấy status ' + status);
    if (item.status === 'Done' || item.status === status) {
      console.log('#' + number + ': giữ ' + item.status);
      continue;
    }
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
        '--single-select-option-id',
        option.id,
      );
    console.log(
      '#' + number + ': ' + item.status + ' → ' + status + (apply ? ' [đã gửi]' : ' [xem trước]'),
    );
  }
  console.log(
    apply
      ? 'Tải lại Project. Không có Issue nào bị đóng/đánh Done.'
      : 'Chạy npm.cmd run qa:progress -- --apply để gửi cập nhật.',
  );
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
