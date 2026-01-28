export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface WeatherData {
  temperature: number;
  windspeed: number;
  weathercode: number;
}

export interface AirQualityData {
  pm2_5: number;
  pm10: number;
}

export const createWeatherResponse = (apiData?: any, error?: string): ApiResponse<WeatherData> => ({
  error: error ?? null,
  data: {
    temperature: apiData?.currentWeather?.temperature ?? 0,
    windspeed: apiData?.currentWeather?.windspeed ?? 0,
    weathercode: apiData?.currentWeather?.weathercode ?? 0,
  },
});

export const createAirQualityResponse = (apiData?: any, error?: string): ApiResponse<AirQualityData> => ({
  error: error ?? null,
  data: {
    pm2_5: apiData?.current?.pm2_5 ?? 0,
    pm10: apiData?.current?.pm10 ?? 0,
  },
});
