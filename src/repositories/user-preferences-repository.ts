import db from '../config/dbConfig';

interface PreferenceRow {
  preference_type: string;
  preference_value: string;
}

interface LocationRow {
  location_id: string;
}

export async function fetchPreferences(lat: number, lon: number) {
  const locationId = `${lat.toFixed(2)},${lon.toFixed(2)}`;

  const rows = db
    .prepare('SELECT preference_type, preference_value FROM user_preferences WHERE location_id = ?')
    .all(locationId) as PreferenceRow[];

  return { preferences: rows };
}

export async function fetchLocations() {
  const rows = db.prepare('SELECT DISTINCT location_id FROM user_preferences LIMIT 100').all() as LocationRow[];

  const locations = rows.map((row) => row.location_id);

  return { locations: locations };
}
