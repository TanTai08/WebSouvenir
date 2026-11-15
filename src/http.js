export function fail(message, status = 400, code) {
  throw Object.assign(new Error(message), { status, code });
}
export const text = (value, max) =>
  typeof value === 'string' && value.trim().length > 0 && value.trim().length <= max;
export const positive = (value) =>
  Number.isSafeInteger(value) && value > 0 && value <= 1_000_000_000;
export const price = (value) => Number.isSafeInteger(value) && value >= 0 && value <= 1_000_000_000;
export function transaction(db, action) {
  db.exec('BEGIN IMMEDIATE');
  try {
    const result = action();
    db.exec('COMMIT');
    return result;
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}
export async function readJson(request) {
  let length = 0;
  const chunks = [];
  for await (const chunk of request) {
    length += chunk.length;
    if (length > 100_000) fail('Dữ liệu quá lớn', 413);
    chunks.push(chunk);
  }
  let value;
  try {
    value = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
  } catch {
    fail('JSON không hợp lệ');
  }
  if (!value || typeof value !== 'object' || Array.isArray(value))
    fail('Nội dung phải là JSON object');
  return value;
}
export function json(response, status, data) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  response.end(JSON.stringify(data));
  return true;
}
export function requireAdmin(user) {
  if (user.role !== 'admin') fail('Chỉ quản trị viên được thực hiện', 403);
}
