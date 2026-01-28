import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { DB_PATH } from '../constants/constants';

let db: Database | null = null;

export async function initDatabase() {
  const db = await getDb();

  await db.exec(`
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

  // Clear existing data
  db.exec('DELETE FROM user_preferences');

  ('Generating user preference records...');

  let records = [];
  let record_count = 0;

  //TODO: continue seeding

  db.close();
  return db;
}

export async function getDb() {
  if (!db) {
    db = await open({
      filename: DB_PATH,
      driver: sqlite3.Database,
    });
  }
  return db;
}
