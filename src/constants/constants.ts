import dotenv from 'dotenv';
import path = require('path');

dotenv.config();

// Use the ENV variable if it exists, otherwise fallback to a default value
export const APP_PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
export const HOST = process.env.HOST || '0.0.0.0';
export const DB_PATH = process.env.DATABASE_URL || path.resolve(process.cwd(), 'skypulse.db');

// External APIs
export const WEATHER_API_URL = process.env.WEATHER_API || `https://api.open-meteo.com/v1/forecast`;
export const AIR_QUALITY_API_URL =
  process.env.AIR_QUALITY_API || `https://air-quality-api.open-meteo.com/v1/air-quality`;
export const ANALYTICS_ENDPOINT_URL = process.env.ANALYTICS_ENDPOINT || `https://httpbin.org/post`;
export const ANALYTICS_API_KEY = process.env.ANALYTICS_API_KEY || `sk_live_RoundsPlatform2024xYz`;
