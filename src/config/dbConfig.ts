import Database from 'better-sqlite3';
import { DB_PATH } from '../constants/constants';

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

type City = [string, string];

const CITIES: City[] = [
  ['40.71,-74.01', 'New York'],
  ['34.05,-118.24', 'Los Angeles'],
  ['41.88,-87.63', 'Chicago'],
  ['29.76,-95.37', 'Houston'],
  ['33.45,-112.07', 'Phoenix'],
  ['47.61,-122.33', 'Seattle'],
  ['51.51,-0.13', 'London'],
  ['48.86,2.35', 'Paris'],
  ['35.68,139.69', 'Tokyo'],
  ['-33.87,151.21', 'Sydney'],
];

const PREFERENCE_TYPES = [
  'activity_type',
  'notification_enabled',
  'temperature_unit',
  'wind_sensitivity',
  'air_quality_threshold',
  'preferred_time',
  'weekly_goal',
] as const;

const ACTIVITY_VALUES = ['running', 'cycling', 'hiking', 'walking', 'swimming', 'tennis', 'golf', 'yoga'];
const BOOL_VALUES = ['true', 'false'];
const TEMP_UNITS = ['celsius', 'fahrenheit'];
const SENSITIVITY_VALUES = ['low', 'medium', 'high'];
const TIME_VALUES = ['morning', 'afternoon', 'evening', 'any'];

// --- Helpers ---

const choice = <T>(array: T[] | readonly T[]): T => array[Math.floor(Math.random() * array.length)];
const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomUniform = (min: number, max: number): number => Math.random() * (max - min) + min;

const sample = <T>(array: readonly T[], size: number): T[] => {
  return [...array].sort(() => 0.5 - Math.random()).slice(0, size);
};

export function getRandomValue(prefType: string): string {
  switch (prefType) {
    case 'activity_type':
      return choice(ACTIVITY_VALUES);
    case 'notification_enabled':
      return choice(BOOL_VALUES);
    case 'temperature_unit':
      return choice(TEMP_UNITS);
    case 'wind_sensitivity':
      return choice(SENSITIVITY_VALUES);
    case 'air_quality_threshold':
      return getRandomInt(15, 100).toString();
    case 'preferred_time':
      return choice(TIME_VALUES);
    case 'weekly_goal':
      return getRandomInt(1, 7).toString();
    default:
      return 'unknown';
  }
}

export function generateLocationVariations(baseLat: number, baseLon: number, count: number = 10): string[] {
  const locations: string[] = [];
  for (let i = 0; i < count; i++) {
    const lat = baseLat + getRandomUniform(-0.5, 0.5);
    const lon = baseLon + getRandomUniform(-0.5, 0.5);
    locations.push(`${lat.toFixed(2)},${lon.toFixed(2)}`);
  }
  return locations;
}

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

  seedDatabase();

  return db;
}

function seedDatabase() {
  // Clear existing data
  db.prepare('DELETE FROM user_preferences').run();

  console.log('Generating user preference records...');

  const records: [string, string, string, string][] = [];
  let recordCount = 0;

  for (const [cityCoords] of CITIES) {
    const [baseLat, baseLon] = cityCoords.split(',').map(Number);
    const locations = generateLocationVariations(baseLat, baseLon, 10);

    for (const locationId of locations) {
      const numUsers = getRandomInt(5, 10);

      for (let userNum = 0; userNum < numUsers; userNum++) {
        const userId = `user_${recordCount}_${userNum}`;
        const numPrefs = getRandomInt(2, 4);
        const selectedPrefs = sample(PREFERENCE_TYPES, numPrefs);

        for (const prefType of selectedPrefs) {
          const prefValue = getRandomValue(prefType);
          records.push([userId, locationId, prefType, prefValue]);
        }
      }
      recordCount++;
    }
  }

  const insert = db.prepare(
    'INSERT INTO user_preferences (user_id, location_id, preference_type, preference_value) VALUES (?, ?, ?, ?)'
  );

  const insertMany = db.transaction((data: [string, string, string, string][]) => {
    for (const row of data) insert.run(row);
  });

  insertMany(records);

  const result = db.prepare('SELECT COUNT(*) as count FROM user_preferences').get() as { count: number };
  console.log(`Created ${result.count} records in ${DB_PATH}`);
}

export default db;
