import { Request, Response } from 'express';
import { LatLonRequestParams } from '../models';
import { getAirQuality, getWeather, saveStatistics } from '../services/weather-service';
import { calculateOutdoorScore, getRecommendation } from '../utils/helper';
import { fetchPreferences } from '../repositories/user-preferences-repository';

export const getActivityScore = async (
  // Types: Request<Params, ResBody, ReqBody, ReqQuery>
  req: Request<LatLonRequestParams, any, any, LatLonRequestParams>,
  res: Response
) => {
  try {
    const latRaw = req.query.lat;
    const lonRaw = req.query.lon;
    const userId = req.query.user_id as string;

    if (latRaw === undefined || lonRaw === undefined) {
      return res.status(400).json({ error: 'lat and lon are required' });
    }

    const lat = Number(req.query.lat);
    const lon = Number(req.query.lon);

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      return res.status(400).json({ error: 'lat and lon must be numbers' });
    }

    const weather = await getWeather(lat, lon);
    const airQuality = await getAirQuality(lat, lon);
    const score = calculateOutdoorScore(weather, airQuality);
    const recommendation = getRecommendation(score);

    const preferences = fetchPreferences(lat, lon);

    //TODO: apply preferences

    // Save statistics to analytics
    await saveStatistics(userId, lat, lon, score);

    return JSON.stringify({
      score: score,
      recommendation: recommendation,
      weather: {
        temperature: weather.currentWeather.temperature,
        wind_speed: weather.currentWeather.windspeed,
        conditions: weather.currentWeather.weathercode,
      },
      air_quality: {
        pm2_5: airQuality.current.pm2_5,
        pm10: airQuality.current.pm10,
      },
    });
  } catch (error: any) {
    throw new Error(`Failed to get Activity Score: ${error.message}`);
  }
};
