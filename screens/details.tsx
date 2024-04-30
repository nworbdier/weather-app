import React, { useState, useEffect } from 'react';
import { View, Text, RefreshControl, ScrollView, StyleSheet, Image } from 'react-native';

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

interface RouteParams {
  params: {
    name: string;
    lat: number;
    long: number;
  };
}

export default function Details({ route }: { route: RouteParams }) {
  const { name, lat, long } = route.params;
  const [weatherData, setWeatherData] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWeatherData = async () => {
    try {
      // Make API call to fetch weather data
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,apparent_temperature,is_day,weather_code&hourly=temperature_2m,apparent_temperature,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=auto&past_hours=1&forecast_days=16&models=best_match`
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
    return `${formattedHours} ${amPm}`;
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
            <Text style={styles.temperature3}>
              H:{weatherData.daily?.temperature_2m_max[0].toFixed(0)}° | L:
              {weatherData.daily?.temperature_2m_min[0].toFixed(0)}
            </Text>
          </View>
          <View style={styles.hourlyContainer}>
            <Text style={{ padding: 10, fontWeight: 'bold', fontSize: 20 }}>Hourly Forecast</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.hourlyContainerRow}>
                {weatherData.hourly &&
                  Array.isArray(weatherData.hourly.time) &&
                  weatherData.hourly.time.slice(1, 26).map((day: string, index: number) => (
                    <View key={index} style={styles.hourlyContainerColumn}>
                      <View style={styles.temperatureColumn}>
                        <Text style={styles.dateText}>{index === 0 ? 'Now' : formatTime(day)}</Text>
                        {weatherData.hourly.temperature_2m[index + 1] !== null ? (
                          <Text style={styles.smallText}>
                            {weatherData.hourly.temperature_2m[index + 1].toFixed(0)}°
                          </Text>
                        ) : (
                          <Text style={styles.smallText}>-</Text>
                        )}
                      </View>
                    </View>
                  ))}
              </View>
            </ScrollView>
          </View>
          <View style={styles.dailyContainer}>
            <Text style={{ padding: 10, fontWeight: 'bold', fontSize: 20 }}>Daily Forecast</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.dailyContainerRow}>
                {weatherData.daily &&
                  Array.isArray(weatherData.daily.time) &&
                  weatherData.daily.time.map((day: string, index: number) => (
                    <View key={index} style={styles.dailyContainerColumn}>
                      <Text style={styles.dateText}>{index === 0 ? 'Now' : getDayOfWeek(day)}</Text>
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
            </ScrollView>
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
    marginBottom: 10,
  },
  temperature: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  temperature2: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  temperature3: {
    fontSize: 20,
    marginBottom: 10,
  },

  hourlyContainer: {
    borderRadius: 10,
    borderWidth: 1,
    minWidth: '100%',
    maxWidth: '100%',
    marginTop: 20,
    backgroundColor: 'white',
  },
  hourlyContainerRow: {
    flexDirection: 'row',
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  hourlyContainerColumn: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center', // Add this line
    padding: 5,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  dailyContainer: {
    borderRadius: 10,
    borderWidth: 1,
    minWidth: '100%',
    maxWidth: '100%',
    marginTop: 20,
    backgroundColor: 'white',
  },
  dailyContainerRow: {
    flexDirection: 'row',
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  dailyContainerColumn: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center', // Add this line
    padding: 5,
  },
  temperatureColumn: {
    alignItems: 'center',
    flexDirection: 'column',
  },
  smallText: {
    fontSize: 20,
    padding: 5,
    textAlign: 'center',
  },
});
