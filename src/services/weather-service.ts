import {
  AIR_QUALITY_API_URL,
  WEATHER_API_URL,
  ANALYTICS_ENDPOINT_URL,
  ANALYTICS_API_KEY,
} from '../constants/constants';
import { AirQualityData, ApiResponse, createAirQualityResponse, createWeatherResponse, WeatherData } from '../models';

export async function getAirQuality(lat: number, lon: number): Promise<ApiResponse<AirQualityData>> {
  try {
    const response = await fetch(`${AIR_QUALITY_API_URL}?latitude=${lat}&longitude=${lon}&current=pm10,pm2_5`);

    if (!response.ok) {
      throw new Error(`Air Quality API Response was not OK: ${response.status}`);
    }

    const responseData = await response.json();

    return createAirQualityResponse(responseData);
  } catch (error: any) {
    console.error('Error fetching Air Quality', error);
    return createAirQualityResponse(null, error.message);
  }
}

export async function getWeather(lat: number, lon: number): Promise<ApiResponse<WeatherData>> {
  try {
    const response = await fetch(`${WEATHER_API_URL}?latitude=${lat}&longitude=${lon}&current_weather=true`);

    if (!response.ok) {
      throw new Error(`Weather API Response was not OK: ${response.status}`);
    }

    const responseData = await response.json();

    return createWeatherResponse(responseData);
  } catch (error: any) {
    console.error('Error fetching Weather', error);
    return createWeatherResponse(null, error.message);
  }
}

export async function saveStatistics(userId: string, lat: number, lon: number, score: number) {
  try {
    const response = await fetch(ANALYTICS_ENDPOINT_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${ANALYTICS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: 'activity_score_calculated',
        user_id: userId,
        latitude: lat,
        longitude: lon,
        score: score,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Analytics log failed:', error);
  }
}
