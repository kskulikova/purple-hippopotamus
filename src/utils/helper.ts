import { AirQualityData, Preference, WeatherData } from '../models';

// Calculate outdoor activity score (0-100)
export function calculateOutdoorScore(weather: WeatherData, air: AirQualityData) {
  let score = 100;

  const temp = weather.temperature ?? 20;
  const wind = weather.windspeed ?? 0;

  // Temperature penalty (ideal: 18-24°C)
  if (temp < 10 || temp > 32) {
    score -= 30;
  } else if (temp < 15 || temp > 28) {
    score -= 15;
  }

  // Wind penalty
  if (wind > 30) {
    score -= 25;
  } else if (wind > 20) {
    score -= 10;
  }

  const pm25 = air.pm2_5 ?? 0;
  const pm10 = air.pm10 ?? 0;

  // PM2.5 penalty (WHO guideline: <15 μg/m³)
  if (pm25 > 50) {
    score -= 30;
  } else if (pm25 > 25) {
    score -= 15;
  } else if (pm25 > 15) {
    score -= 5;
  }

  // PM10 penalty
  if (pm10 > 100) {
    score -= 20;
  } else if (pm10 > 50) {
    score -= 10;
  }

  return Math.max(0, Math.min(100, score));
}

export function getRecommendation(score: number, preferences: Preference[]) {
  const activity =
    preferences.find((p) => p.preference_type === 'activity_type')?.preference_value ?? 'outdoor activities';

  let recommendation = `Good conditions for ${activity}`;
  if (score < 50) {
    recommendation = `Consider moving your ${activity} indoors today`;
  } else if (score < 70) {
    recommendation = `Moderate conditions - light ${activity} recommended`;
  }
  return recommendation;
}
