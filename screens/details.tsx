import React, { useState, useEffect } from 'react';
import { View, Text, RefreshControl, ScrollView, StyleSheet, Image } from 'react-native';

// Function to map weather code to description
const mapWeatherCodeToDescription = (code) => {
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

export default function Details({ route }) {
  const { name, lat, long } = route.params;
  const [weatherData, setWeatherData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWeatherData = async () => {
    try {
      // Make API call to fetch weather data
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,apparent_temperature,is_day,weather_code&hourly=temperature_2m,apparent_temperature,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&temperature_unit=fahrenheit&wind_speed_unit=mph&forecast_days=16&models=best_match`
      );
      const data = await response.json();

      // Store the entire weather data object
      setWeatherData(data);
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
              source={require('../assets/WeatherIcons/Cloudy Day Sun Icon.png')}
              style={styles.image}
              resizeMode="contain"
            />
            <Text style={styles.temperature}>
              {weatherData.current?.temperature_2m.toFixed(0)}°
            </Text>
            <Text style={styles.temperature2}>
              {mapWeatherCodeToDescription(weatherData.current?.weather_code)}
            </Text>
            <Text style={styles.temperature2}>
              H:{weatherData.daily?.temperature_2m_max[0].toFixed(0)}° | L:
              {weatherData.daily?.temperature_2m_min[0].toFixed(0)}
            </Text>
          </View>
          <View style={styles.dailyContainer}>
            <Text style={{ padding: 10 }}>Daily Forecast</Text>
            <View style={styles.dailyContainerRow}>
              {weatherData.daily &&
                Array.isArray(weatherData.daily.time) &&
                weatherData.daily.time.map((day, index) => (
                  <View key={index} style={styles.dailyContainerColumn}>
                    <View style={styles.temperatureColumn}>
                      <Text style={styles.smallText}>
                        {weatherData.daily.temperature_2m_max[index].toFixed(0)}°
                      </Text>
                      <Text style={styles.smallText}>
                        {weatherData.daily.temperature_2m_min[index].toFixed(0)}°
                      </Text>
                    </View>
                  </View>
                ))}
            </View>
          </View>
          <View style={styles.hourlyContainer}>
            <Text style={{ padding: 10 }}>Hourly Forecast</Text>
            <View style={styles.hourlyContainerRow}>
              {weatherData.hourly &&
                Array.isArray(weatherData.hourly.time) &&
                weatherData.hourly.time.map((day, index) => (
                  <View key={index} style={styles.hourlyContainerColumn}>
                    <View style={styles.temperatureColumn}>
                      {weatherData.hourly.temperature_2m[index] !== null ? (
                        <Text style={styles.smallText}>
                          {weatherData.hourly.temperature_2m[index].toFixed(0)}°
                        </Text>
                      ) : (
                        <Text style={styles.smallText}>Hour {index}: N/A</Text>
                      )}
                    </View>
                  </View>
                ))}
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
    backgroundColor: 'lightgrey',
    padding: 15,
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
  },
  temperature: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  temperature2: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dailyContainer: {
    borderRadius: 5,
    borderWidth: 2,
    minWidth: '100%',
    maxWidth: '100%',
    marginTop: 20,
  },
  dailyContainerRow: {
    flexDirection: 'row',
    paddingBottom: 10,
    paddingLeft: 10,
  },
  dailyContainerColumn: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  hourlyContainer: {
    borderRadius: 5,
    borderWidth: 2,
    minWidth: '100%',
    maxWidth: '100%',
    marginTop: 20,
  },
  hourlyContainerRow: {
    flexDirection: 'row',
    paddingBottom: 10,
    paddingLeft: 10,
  },
  hourlyContainerColumn: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  temperatureColumn: {
    alignItems: 'center',
    flexDirection: 'column',
  },
  smallText: {
    fontSize: 20,
    padding: 5,
  },
});
