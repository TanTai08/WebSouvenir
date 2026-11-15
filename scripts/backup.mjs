import { DatabaseSync, backup } from 'node:sqlite';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
const [source, destination] = process.argv.slice(2);
if (!source || !destination || resolve(source) === resolve(destination))
  throw Error(
    'Usage: node scripts/backup.mjs SOURCE_DB NEW_BACKUP_FILE (hai đường dẫn phải khác nhau)',
  );
if (existsSync(destination)) throw Error('Backup destination already exists; choose a new file.');
const db = new DatabaseSync(source, { readOnly: true });
try {
  await backup(db, destination);
  console.log('SQLite online backup complete.');
} finally {
  db.close();
}
