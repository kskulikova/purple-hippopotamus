import Database from 'better-sqlite3';
import { DB_PATH } from '../constants/constants';

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_preferences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      location_id TEXT NOT NULL,
      preference_type TEXT NOT NULL,
      preference_value TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  return db;
}

export default db;
