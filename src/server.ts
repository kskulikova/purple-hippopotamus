import app from './app';
import { initDatabase } from './config/dbConfig';
import { APP_PORT, HOST } from './constants/constants';

async function startServer() {
  try {
    initDatabase();
    app.listen(APP_PORT, HOST, () => {
      console.log(`Server running on port ${APP_PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
