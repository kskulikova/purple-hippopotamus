import db from '../db/dbConfig';

interface PreferenceRow {
  preference_type: string;
  preference_value: string;
}

export async function fetchPreferences(lat: number, lon: number) {
  const locationId = `${lat.toFixed(2)},${lon.toFixed(2)}`;

  const rows = db
    .prepare('SELECT preference_type, preference_value FROM user_preferences WHERE location_id = ?')
    .all(locationId) as PreferenceRow[];

  return { preferences: rows };
}

export async function fetchLocations() {
  return db.prepare('SELECT DISTINCT location_id FROM user_preferences LIMIT 100').pluck().all() as string[];
}
