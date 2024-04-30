import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { View, SafeAreaView, StyleSheet, Platform } from 'react-native';

import Details from '../screens/details';
import Overview from '../screens/overview';

export type RootStackParamList = {
  Overview: undefined;
  Details: { name: string };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function RootStack() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      {Platform.OS !== 'ios' && <View style={styles.customTopView} />}
      <SafeAreaView style={styles.appTop} />
      <Stack.Navigator initialRouteName="Overview">
        <Stack.Screen name="Overview" component={Overview} options={{ headerShown: false }} />
        <Stack.Screen name="Details" component={Details} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: 'white',
  },
  appTop: {
    flex: 0, // Make sure SafeAreaView doesn't stretch
    backgroundColor: 'lightgrey',
  },
  customTopView: {
    width: '100%',
    height: '5%',
  },
  loadingScreen: {
    flex: 1,
    backgroundColor: 'black',
  },
});
