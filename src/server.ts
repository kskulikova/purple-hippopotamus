import app from './app';
import dotenv from 'dotenv';
import { initDatabase } from './config/dbConfig';
import { APP_PORT } from './constants/constants';

dotenv.config();

async function startServer() {
  try {
    await initDatabase();
    app.listen(APP_PORT, () => {
      console.log(`Server running on port ${APP_PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();