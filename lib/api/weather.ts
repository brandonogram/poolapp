/**
 * Weather API Utilities
 *
 * This module provides functions to fetch weather data and determine
 * if weather conditions should affect route planning or scheduling.
 * Currently uses mock data, but is structured for easy integration with real APIs.
 */

export interface WeatherData {
  temperature: number; // Fahrenheit
  precipitation: number; // Percentage chance (0-100)
  windSpeed: number; // MPH
  visibility: number; // Miles
  conditions: string; // e.g., 'Sunny', 'Partly Cloudy', 'Rain'
  humidity?: number; // Percentage
  uvIndex?: number; // 1-11+
  feelsLike?: number; // Fahrenheit
}

export interface WeatherForecast {
  date: string;
  high: number;
  low: number;
  precipitation: number;
  conditions: string;
}

// Weather condition thresholds for route adjustments
export const WEATHER_THRESHOLDS = {
  precipitation: {
    mild: 30, // > 30% chance = plan for possible delays
    moderate: 50, // > 50% chance = consider rescheduling
    severe: 70, // > 70% chance = recommend rescheduling
  },
  windSpeed: {
    mild: 15, // > 15 mph = surface debris may be worse
    moderate: 25, // > 25 mph = difficult working conditions
    severe: 35, // > 35 mph = unsafe, recommend rescheduling
  },
  temperature: {
    cold: 45, // < 45°F = cold weather precautions
    hot: 100, // > 100°F = heat safety precautions
    extreme: 110, // > 110°F = consider rescheduling
  },
  visibility: {
    poor: 3, // < 3 miles = driving hazard
    dangerous: 1, // < 1 mile = unsafe driving conditions
  },
};

// Mock weather data for different zip codes
const mockWeatherByZip: Record<string, WeatherData> = {
  '85001': { // Phoenix - typical sunny
    temperature: 85,
    precipitation: 5,
    windSpeed: 8,
    visibility: 10,
    conditions: 'Sunny',
    humidity: 20,
    uvIndex: 9,
    feelsLike: 87,
  },
  '85281': { // Tempe - partly cloudy
    temperature: 82,
    precipitation: 15,
    windSpeed: 12,
    visibility: 10,
    conditions: 'Partly Cloudy',
    humidity: 25,
    uvIndex: 7,
    feelsLike: 84,
  },
  '85251': { // Scottsdale - hot day
    temperature: 105,
    precipitation: 0,
    windSpeed: 5,
    visibility: 10,
    conditions: 'Sunny',
    humidity: 15,
    uvIndex: 11,
    feelsLike: 108,
  },
  '85016': { // Phoenix - monsoon season
    temperature: 92,
    precipitation: 60,
    windSpeed: 22,
    visibility: 7,
    conditions: 'Thunderstorms',
    humidity: 65,
    uvIndex: 4,
    feelsLike: 98,
  },
  '33101': { // Miami - rainy
    temperature: 88,
    precipitation: 75,
    windSpeed: 18,
    visibility: 5,
    conditions: 'Rain',
    humidity: 85,
    uvIndex: 3,
    feelsLike: 96,
  },
  '90210': { // Beverly Hills - perfect
    temperature: 78,
    precipitation: 0,
    windSpeed: 6,
    visibility: 10,
    conditions: 'Clear',
    humidity: 45,
    uvIndex: 6,
    feelsLike: 78,
  },
};

/**
 * Fetches current weather data for a zip code
 *
 * @param zipCode - US zip code
 * @returns Weather data or null if unavailable
 *
 * TODO: Replace mock implementation with real API call:
 * ```typescript
 * const response = await fetch(
 *   `${process.env.WEATHER_API_URL}/current?zip=${zipCode}&units=imperial`,
 *   {
 *     headers: {
 *       'Authorization': `Bearer ${process.env.WEATHER_API_KEY}`,
 *       'Content-Type': 'application/json',
 *     },
 *   }
 * );
 * if (!response.ok) return null;
 * const data = await response.json();
 * return {
 *   temperature: data.main.temp,
 *   precipitation: data.pop * 100,
 *   windSpeed: data.wind.speed,
 *   visibility: data.visibility / 1609.34, // Convert meters to miles
 *   conditions: data.weather[0].main,
 *   humidity: data.main.humidity,
 *   feelsLike: data.main.feels_like,
 * };
 * ```
 */
export async function getWeatherForZip(zipCode: string): Promise<WeatherData | null> {
  // Simulate API latency
  await new Promise((resolve) => setTimeout(resolve, 150));

  // Return mock data or generate default weather
  if (mockWeatherByZip[zipCode]) {
    return mockWeatherByZip[zipCode];
  }

  // Generate reasonable default weather for unknown zip codes
  // Slightly randomized to simulate real data variability
  return {
    temperature: 75 + Math.floor(Math.random() * 20), // 75-95°F
    precipitation: Math.floor(Math.random() * 30), // 0-30%
    windSpeed: 5 + Math.floor(Math.random() * 15), // 5-20 mph
    visibility: 8 + Math.floor(Math.random() * 3), // 8-10 miles
    conditions: ['Sunny', 'Partly Cloudy', 'Clear'][Math.floor(Math.random() * 3)],
    humidity: 30 + Math.floor(Math.random() * 40), // 30-70%
    uvIndex: 5 + Math.floor(Math.random() * 5), // 5-9
    feelsLike: 75 + Math.floor(Math.random() * 22), // 75-97°F
  };
}

/**
 * Determines if weather conditions should trigger route adjustments
 *
 * @param weather - Current weather data
 * @returns true if weather warrants route changes
 */
export function shouldAdjustRoute(weather: WeatherData): boolean {
  // Check precipitation
  if (weather.precipitation >= WEATHER_THRESHOLDS.precipitation.moderate) {
    return true;
  }

  // Check wind speed
  if (weather.windSpeed >= WEATHER_THRESHOLDS.windSpeed.moderate) {
    return true;
  }

  // Check extreme temperatures
  if (weather.temperature >= WEATHER_THRESHOLDS.temperature.extreme ||
      weather.temperature < WEATHER_THRESHOLDS.temperature.cold) {
    return true;
  }

  // Check visibility
  if (weather.visibility <= WEATHER_THRESHOLDS.visibility.poor) {
    return true;
  }

  return false;
}

/**
 * Gets detailed weather advisories based on conditions
 *
 * @param weather - Current weather data
 * @returns Array of advisory messages
 */
export function getWeatherAdvisories(weather: WeatherData): string[] {
  const advisories: string[] = [];

  // Precipitation advisories
  if (weather.precipitation >= WEATHER_THRESHOLDS.precipitation.severe) {
    advisories.push('High chance of rain - consider rescheduling outdoor work');
  } else if (weather.precipitation >= WEATHER_THRESHOLDS.precipitation.moderate) {
    advisories.push('Rain likely - expect delays and bring rain gear');
  } else if (weather.precipitation >= WEATHER_THRESHOLDS.precipitation.mild) {
    advisories.push('Possible rain - monitor conditions');
  }

  // Wind advisories
  if (weather.windSpeed >= WEATHER_THRESHOLDS.windSpeed.severe) {
    advisories.push('Dangerous wind conditions - postpone service if possible');
  } else if (weather.windSpeed >= WEATHER_THRESHOLDS.windSpeed.moderate) {
    advisories.push('High winds - difficult working conditions expected');
  } else if (weather.windSpeed >= WEATHER_THRESHOLDS.windSpeed.mild) {
    advisories.push('Windy conditions - expect more surface debris');
  }

  // Temperature advisories
  if (weather.temperature >= WEATHER_THRESHOLDS.temperature.extreme) {
    advisories.push('EXTREME HEAT WARNING - take frequent breaks, stay hydrated');
  } else if (weather.temperature >= WEATHER_THRESHOLDS.temperature.hot) {
    advisories.push('Heat advisory - ensure proper hydration and sun protection');
  } else if (weather.temperature < WEATHER_THRESHOLDS.temperature.cold) {
    advisories.push('Cold weather - check for frozen equipment');
  }

  // Visibility advisories
  if (weather.visibility <= WEATHER_THRESHOLDS.visibility.dangerous) {
    advisories.push('DANGEROUS visibility - avoid driving if possible');
  } else if (weather.visibility <= WEATHER_THRESHOLDS.visibility.poor) {
    advisories.push('Poor visibility - drive with caution');
  }

  return advisories;
}

/**
 * Gets weather severity level for UI display
 *
 * @param weather - Current weather data
 * @returns 'good' | 'caution' | 'warning' | 'danger'
 */
export function getWeatherSeverity(weather: WeatherData): 'good' | 'caution' | 'warning' | 'danger' {
  // Check for dangerous conditions
  if (
    weather.precipitation >= WEATHER_THRESHOLDS.precipitation.severe ||
    weather.windSpeed >= WEATHER_THRESHOLDS.windSpeed.severe ||
    weather.temperature >= WEATHER_THRESHOLDS.temperature.extreme ||
    weather.visibility <= WEATHER_THRESHOLDS.visibility.dangerous
  ) {
    return 'danger';
  }

  // Check for warning conditions
  if (
    weather.precipitation >= WEATHER_THRESHOLDS.precipitation.moderate ||
    weather.windSpeed >= WEATHER_THRESHOLDS.windSpeed.moderate ||
    weather.temperature >= WEATHER_THRESHOLDS.temperature.hot ||
    weather.visibility <= WEATHER_THRESHOLDS.visibility.poor
  ) {
    return 'warning';
  }

  // Check for caution conditions
  if (
    weather.precipitation >= WEATHER_THRESHOLDS.precipitation.mild ||
    weather.windSpeed >= WEATHER_THRESHOLDS.windSpeed.mild ||
    weather.temperature < WEATHER_THRESHOLDS.temperature.cold
  ) {
    return 'caution';
  }

  return 'good';
}

/**
 * Gets weather icon name based on conditions
 *
 * @param conditions - Weather condition string
 * @returns Icon identifier
 */
export function getWeatherIcon(conditions: string): string {
  const conditionLower = conditions.toLowerCase();

  if (conditionLower.includes('thunder')) return 'thunderstorm';
  if (conditionLower.includes('rain') || conditionLower.includes('shower')) return 'rain';
  if (conditionLower.includes('cloud') && conditionLower.includes('partly')) return 'partly-cloudy';
  if (conditionLower.includes('cloud') || conditionLower.includes('overcast')) return 'cloudy';
  if (conditionLower.includes('fog') || conditionLower.includes('mist')) return 'fog';
  if (conditionLower.includes('snow')) return 'snow';
  if (conditionLower.includes('clear') || conditionLower.includes('sunny')) return 'sunny';

  return 'partly-cloudy'; // Default
}

/**
 * Formats temperature for display
 *
 * @param temp - Temperature in Fahrenheit
 * @param includeUnit - Whether to include °F
 * @returns Formatted temperature string
 */
export function formatTemperature(temp: number, includeUnit: boolean = true): string {
  const rounded = Math.round(temp);
  return includeUnit ? `${rounded}°F` : `${rounded}°`;
}

/**
 * Gets 5-day forecast for a zip code
 *
 * @param zipCode - US zip code
 * @returns Array of daily forecasts
 *
 * TODO: Replace with real API implementation
 */
export async function getForecast(zipCode: string): Promise<WeatherForecast[]> {
  // Simulate API latency
  await new Promise((resolve) => setTimeout(resolve, 200));

  const currentWeather = await getWeatherForZip(zipCode);
  const baseTemp = currentWeather?.temperature || 80;

  const forecasts: WeatherForecast[] = [];
  const conditions = ['Sunny', 'Partly Cloudy', 'Mostly Sunny', 'Clear', 'Scattered Clouds'];

  for (let i = 0; i < 5; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);

    forecasts.push({
      date: date.toISOString().split('T')[0],
      high: baseTemp + Math.floor(Math.random() * 10) - 5,
      low: baseTemp - 15 + Math.floor(Math.random() * 10),
      precipitation: Math.floor(Math.random() * 40),
      conditions: conditions[Math.floor(Math.random() * conditions.length)],
    });
  }

  return forecasts;
}
