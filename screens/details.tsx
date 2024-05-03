import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useEffect } from 'react';
import { View, Text, RefreshControl, ScrollView, StyleSheet, Image } from 'react-native';

import { RootStackParamList } from '../App';

type DetailsScreenNavigationProps = StackNavigationProp<RootStackParamList, 'Overview'>;

// Function to map weather code to description
const mapWeatherCodeToDescription = (code: number) => {
  switch (code) {
    case 0:
      return 'Clear Sky';
    case 1:
      return 'Mostly Clear';
    case 2:
      return 'Partly Cloudy';
    case 3:
      return 'Overcast';
    case 45:
      return 'Foggy';
    case 48:
      return 'Dense Fog';
    case 51:
      return 'Light Drizzle';
    case 53:
      return 'Moderate Drizzle';
    case 55:
      return 'Heavy Drizzle';
    case 56:
      return 'Light Freezing Drizzle';
    case 57:
      return 'Heavy Freezing Drizzle';
    case 61:
      return 'Slight Rain';
    case 63:
      return 'Moderate Rain';
    case 65:
      return 'Heavy Rain';
    case 66:
      return 'Light Freezing Rain';
    case 67:
      return 'Heavy Freezing Rain';
    case 71:
      return 'Slight Snowfall';
    case 73:
      return 'Moderate Snowfall';
    case 75:
      return 'Heavy Snowfall';
    case 77:
      return 'Snow Grains';
    case 80:
      return 'Slight Rain Showers';
    case 81:
      return 'Moderate Rain Showers';
    case 82:
      return 'Violent Rain Showers';
    case 85:
      return 'Slight Snow Showers';
    case 86:
      return 'Heavy Snow Showers';
    case 95:
      return 'Thunderstorm: Slight or Moderate';
    case 96:
      return 'Thunderstorm with Slight Hail';
    case 99:
      return 'Thunderstorm with Heavy Hail';
    default:
      return 'Unknown';
  }
};

// Function to map weather code to description
const mapWeatherCodeToImage = (code: number) => {
  switch (code) {
    case 0:
      return require('../assets/WeatherIcons/day_clear_sky.png');
    case 1:
      return require('../assets/WeatherIcons/day_foggy.png');
    case 2:
      return require('../assets/WeatherIcons/day_cloudy.png');
    case 3:
      return require('../assets/WeatherIcons/cloudy.png');
    case 45:
      return require('../assets/WeatherIcons/foggy.png');
    case 48:
      return require('../assets/WeatherIcons/foggy.png');
    case 51:
      return require('../assets/WeatherIcons/day_rain_light.png');
    case 53:
      return require('../assets/WeatherIcons/day_rain_moderate.png');
    case 55:
      return require('../assets/WeatherIcons/day_rain.png');
    case 56:
      return require('../assets/WeatherIcons/day_rain_light.png');
    case 57:
      return require('../assets/WeatherIcons/day_rain.png');
    case 61:
      return require('../assets/WeatherIcons/day_rain_light.png');
    case 63:
      return require('../assets/WeatherIcons/day_rain_moderate.png');
    case 65:
      return require('../assets/WeatherIcons/day_rain.png');
    case 66:
      return require('../assets/WeatherIcons/day_rain_light.png');
    case 67:
      return require('../assets/WeatherIcons/day_rain.png');
    case 71:
      return require('../assets/WeatherIcons/day_snow.png');
    case 73:
      return require('../assets/WeatherIcons/day_snow.png');
    case 75:
      return require('../assets/WeatherIcons/day_snow.png');
    case 77:
      return require('../assets/WeatherIcons/day_snow.png');
    case 80:
      return require('../assets/WeatherIcons/day_rain_light.png');
    case 81:
      return require('../assets/WeatherIcons/day_rain_moderate.png');
    case 82:
      return require('../assets/WeatherIcons/day_thunderstorm_light.png');
    case 85:
      return require('../assets/WeatherIcons/day_snow.png');
    case 86:
      return require('../assets/WeatherIcons/day_snow.png');
    case 95:
      return require('../assets/WeatherIcons/day_thunderstorm_light.png');
    case 96:
      return require('../assets/WeatherIcons/day_rain_hail.png');
    case 99:
      return require('../assets/WeatherIcons/day_rain_hail.png');
    default:
      return 'Unknown';
  }
};

interface RouteParams {
  params: {
    name: string;
    lat: number;
    long: number;
  };
}

export default function Details({ route }: { route: RouteParams }) {
  const navigation = useNavigation<DetailsScreenNavigationProps>();
  const { name, lat, long } = route.params;
  const [weatherData, setWeatherData] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWeatherData = async () => {
    try {
      // Make API call to fetch weather data
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth,weather_code,visibility,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=auto&past_hours=1&forecast_days=16&models=best_match`
      );
      const data = await response.json();

      // Store the entire weather data object
      setWeatherData(data);

      // console.log(data.daily.weather_code);
      setRefreshing(false); // Disable refreshing after successful fetch
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setRefreshing(false); // Disable refreshing after error
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, [lat, long]);

  const onRefresh = () => {
    setRefreshing(true); // Enable refreshing indicator
    fetchWeatherData(); // Fetch weather data again
  };

  const getDayOfWeek = (dateString: string): string => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const date = new Date(`${dateString}T00:00:00`); // Add T00:00:00 to create a valid ISO date string
    const dayIndex = date.getDay();
    return daysOfWeek[dayIndex];
  };

  const formatTime = (time: string): string => {
    if (time === 'now') {
      return 'Now';
    }

    const hours = new Date(time).getHours();
    const amPm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}${amPm}`;
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>{name}</Text>
      {weatherData && (
        <View>
          <View style={styles.infoContainer}>
            <Image
              source={mapWeatherCodeToImage(weatherData.current?.weather_code)}
              style={styles.image}
              resizeMode="contain"
            />
            <Text style={styles.temperature}>
              {weatherData.current?.temperature_2m.toFixed(0)}°
            </Text>
            <Text style={styles.temperature2}>
              {mapWeatherCodeToDescription(weatherData.current?.weather_code)}
            </Text>
            <Text style={styles.temperature3}>
              H: {weatherData.daily?.temperature_2m_max[0].toFixed(0)}°{' '}
              <Text style={{ fontWeight: 'bold' }}> · </Text> L:{' '}
              {weatherData.daily?.temperature_2m_min[0].toFixed(0)}
            </Text>
          </View>
          <View style={styles.fullContainer}>
            <Text style={{ padding: 10, fontWeight: 'bold', fontSize: 20 }}>Hourly Forecast</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.fullContainerRow}>
                {weatherData.hourly &&
                  Array.isArray(weatherData.hourly.time) &&
                  weatherData.hourly.time.slice(1, 26).map((day: string, index: number) => (
                    <View key={index} style={styles.fullContainerColumn}>
                      <Text style={styles.dateText}>{index === 0 ? 'Now' : formatTime(day)}</Text>
                      <Image
                        source={mapWeatherCodeToImage(weatherData.hourly.weather_code[index + 1])}
                        style={styles.image2}
                        resizeMode="contain"
                      />
                      {weatherData.hourly.temperature_2m[index + 1] !== null ? (
                        <Text style={styles.smallText}>
                          {weatherData.hourly.temperature_2m[index + 1].toFixed(0)}°
                        </Text>
                      ) : (
                        <Text style={styles.smallText}>-</Text>
                      )}
                    </View>
                  ))}
              </View>
            </ScrollView>
          </View>
          <View style={styles.fullContainer}>
            <Text style={{ padding: 10, fontWeight: 'bold', fontSize: 20 }}>Daily Forecast</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.fullContainerRow}>
                {weatherData.daily &&
                  Array.isArray(weatherData.daily.time) &&
                  weatherData.daily.time.map((day: string, index: number) => (
                    <View key={index} style={styles.fullContainerColumn}>
                      <Text style={styles.dateText}>{index === 0 ? 'Now' : getDayOfWeek(day)}</Text>
                      <Image
                        source={mapWeatherCodeToImage(weatherData.daily.weather_code[index])}
                        style={styles.image2}
                        resizeMode="contain"
                      />
                      <Text style={styles.smallText}>
                        {weatherData.daily.temperature_2m_max[index].toFixed(0)}°
                      </Text>
                      <Text style={styles.smallText}>
                        {weatherData.daily.temperature_2m_min[index].toFixed(0)}°
                      </Text>
                    </View>
                  ))}
              </View>
            </ScrollView>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={styles.halfContainer}>
              <Text style={{ padding: 10, fontWeight: 'bold', fontSize: 20 }}>UV Index</Text>
            </View>
            <View style={styles.halfContainer}>
              <Text style={{ padding: 10, fontWeight: 'bold', fontSize: 20 }}>Feels Like</Text>
              <Text>{weatherData.current.apparent_temperature.toFixed(0)}°</Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1B1B',
    padding: 15,
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
  },
  infoContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
  },
  image2: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  temperature: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  temperature2: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  temperature3: {
    fontSize: 20,
    marginBottom: 10,
    color: 'white',
  },
  fullContainer: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#8B8B8B',
    minWidth: '100%',
    maxWidth: '100%',
    marginTop: 20,
    backgroundColor: 'white',
  },
  fullContainerRow: {
    flexDirection: 'row',
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  fullContainerColumn: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center', // Add this line
    padding: 5,
  },
  halfContainer: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#8B8B8B',
    minWidth: '47.75%',
    maxWidth: '47.75%',
    marginTop: 20,
    backgroundColor: 'white',
  },
  halfContainerRow: {
    flexDirection: 'row',
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  halfContainerColumn: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center', // Add this line
    padding: 5,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  smallText: {
    fontSize: 20,
    padding: 5,
    textAlign: 'center',
  },
});
