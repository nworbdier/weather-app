import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, TextInput, FlatList, Text, TouchableOpacity } from 'react-native';

import { RootStackParamList } from '../navigation';

type OverviewScreenNavigationProps = StackNavigationProp<RootStackParamList, 'Overview'>;

export default function Overview() {
  const navigation = useNavigation<OverviewScreenNavigationProps>();
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Debounce function
  const debounce = useCallback((func, delay) => {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }, []);

  const handleSearch = useCallback(async (text: string) => {
    setSearchText(text);
    try {
      const response = await fetch(
        `https://customer-geocoding-api.open-meteo.com/v1/search?apikey=&name=${text}&count=10&format=json`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  }, []);

  const debouncedSearch = useCallback(debounce(handleSearch, 500), [handleSearch]);

  const handleCancel = () => {
    setSearchText(''); // Clear the search text
    setSearchResults([]); // Clear the search results
  };

  useEffect(() => {
    if (searchText === '') {
      setSearchResults([]); // Clear the search results if search text is empty
    } else {
      debouncedSearch(searchText);
    }
  }, [searchText, debouncedSearch]);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search for a city or zip code..."
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
        {searchText !== '' && ( // Render Cancel button only if there is text in the input
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={searchResults.results}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Details', {
                name: item.name,
                lat: item.latitude,
                long: item.longitude,
                admin1: item.admin1,
                admin2: item.admin2,
                country: item.country,
              })
            }
            style={styles.item}>
            <Text>{`${item.name}, ${item.admin1}, ${item.admin2}, ${item.country}`}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'lightgrey',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  cancelButton: {
    marginLeft: 8,
    padding: 5,
  },
  item: {
    paddingVertical: 10,
    marginVertical: 4,
  },
});
