import app from './app';
import { initDatabase } from './db/dbConfig';
import { APP_PORT, HOST } from './constants/constants';
import { seedData } from './db/seed';

async function startServer() {
  try {
    const db = initDatabase();

    if (process.env.SEED_DB === 'true') {
      const rowCount = db.prepare('SELECT count(*) as count FROM user_preferences').get() as { count: number };

      // Only seed if the table is empty to avoid accidental data loss during server restarts
      if (rowCount.count === 0) {
        console.log('Detected SEED_DB=true and empty database. Seeding...');
        seedData();
      } else {
        console.log('Detected SEED_DB=true and NON empty database. Skipping seeding.');
      }
    }
    app.listen(APP_PORT, HOST, () => {
      console.log(`Server running on port ${APP_PORT}`);
    });

    process.on('SIGTERM', () => {
      db.close();
      process.exit(0);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
