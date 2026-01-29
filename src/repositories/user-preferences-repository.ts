import db from '../db/dbConfig';
import { Preference } from '../models';

export async function fetchPreferences(lat: number, lon: number, userId: string) {
  const locationId = `${lat.toFixed(2)},${lon.toFixed(2)}`;

  const rows = db
    .prepare('SELECT preference_type, preference_value FROM user_preferences WHERE user_id = ? AND location_id = ?')
    .all(userId, locationId) as Preference[];

  return rows;
}

export async function fetchLocations() {
  return db.prepare('SELECT DISTINCT location_id FROM user_preferences LIMIT 100').pluck().all() as string[];
}
