export interface LatLonRequestParams {
  lat: string;
  lon: string;
}
export interface GetWeatherResponse {
  currentWeather: CurrentWeather;
  error: string | null;
}

export interface CurrentWeather {
  temperature: number;
  windspeed: number;
  weathercode: number;
}

export class WeatherResponse implements GetWeatherResponse {
  currentWeather: CurrentWeather;
  error: string | null;

  constructor(apiData?: any, errorMessage?: string) {
    this.error = errorMessage ?? null;
    this.currentWeather = {
      temperature: apiData?.currentWeather?.temperature ?? 0,
      windspeed: apiData?.currentWeather?.windspeed ?? 0,
      weathercode: apiData?.currentWeather?.weathercode ?? 0,
    };
  }
}

export interface GetAirQualityResponse {
  current: currentAirQuality;
  error: string | null;
}

export interface currentAirQuality {
  pm2_5: number;
  pm10: number;
}

export class AirQualityResponse implements GetAirQualityResponse {
  current: currentAirQuality;
  error: string | null;

  constructor(apiData?: any, errorMessage?: string) {
    this.error = errorMessage ?? null;
    this.current = {
      pm2_5: apiData?.current?.pm2_5 ?? 0,
      pm10: apiData?.current?.pm10 ?? 0,
    };
  }
}
