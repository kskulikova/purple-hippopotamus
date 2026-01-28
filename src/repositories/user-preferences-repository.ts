import { getDb } from '../config/dbConfig';

export async function fetchPreferences(lat: number, lon: number) {
  const db = await getDb();
  try {
    const locationId = `${lat.toFixed(2)},${lon.toFixed(2)}`;

    type Row = { preference_type: string; preference_value: string };

    const rows = await db.all<Row[]>(
      'SELECT preference_type, preference_value FROM user_preferences WHERE location_id = ?',
      [locationId]
    );

    return { preferences: rows };
  } finally {
    await db.close();
  }
}

export async function fetchLocations() {
  const db = await getDb();
  try {
    type Row = { location_id: string };

    const rows = await db.all<Row[]>('SELECT DISTINCT location_id FROM user_preferences LIMIT 100');

    const locations = rows.map((row) => row.location_id);

    return { locations: locations };
  } finally {
    await db.close();
  }
}
