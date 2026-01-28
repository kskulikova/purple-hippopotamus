import { Request, Response } from 'express';
import { getAirQuality, getWeather, saveStatistics } from '../services/weather-service';
import { calculateOutdoorScore, getRecommendation } from '../utils/helper';
import { fetchPreferences } from '../repositories/user-preferences-repository';
import { v4 as uuidv4 } from 'uuid';

interface ActivityScoreQuery {
  lat?: string;
  lon?: string;
  user_id?: string;
}

export const getActivityScore = async (req: Request<{}, any, any, ActivityScoreQuery>, res: Response) => {
  try {
    const { lat: latStr, lon: lonStr } = req.query;

    // If userId is missing, generate a temporary one or use a "GUEST" prefix
    let userId = (req.query.user_id as string) || `guest_${uuidv4()}`;

    if (!latStr || !lonStr) {
      return res.status(400).json({ error: 'lat and lon are required' });
    }

    const lat = Number(latStr);
    const lon = Number(lonStr);

    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({ error: 'lat and lon must be numbers' });
    }

    // Added: Coordinate range check
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      return res.status(400).json({ error: 'Invalid coordinate range' });
    }

    const [weatherResponse, airQualityResponse] = await Promise.all([
      getWeather(Number(lat), Number(lon)),
      getAirQuality(Number(lat), Number(lon)),
    ]);

    // Use 502 (Bad Gateway) because our server is fine, but the external API failed.
    if (weatherResponse.error || !weatherResponse.data) {
      return res.status(502).json({
        error: `Weather service unavailable: ${weatherResponse.error || 'No data received'}`,
      });
    }

    if (airQualityResponse.error || !airQualityResponse.data) {
      return res.status(502).json({
        error: `Air Quality service unavailable: ${airQualityResponse.error || 'No data received'}`,
      });
    }

    const weather = weatherResponse.data;
    const airQuality = airQualityResponse.data;

    const score = calculateOutdoorScore(weather, airQuality);
    const recommendation = getRecommendation(score);
    const preferences = await fetchPreferences(lat, lon);

    //TODO: apply preferences

    // Save statistics to analytics
    await saveStatistics(userId, lat, lon, score);

    return res.status(200).json({
      score: score,
      recommendation: recommendation,
      weather: {
        temperature: weather.temperature,
        wind_speed: weather.windspeed,
        conditions: weather.weathercode,
      },
      air_quality: {
        pm2_5: airQuality.pm2_5,
        pm10: airQuality.pm10,
      },
    });
  } catch (error: any) {
    throw new Error(`Failed to get Activity Score: ${error.message}`);
  }
};
