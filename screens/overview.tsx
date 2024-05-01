import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, TextInput, FlatList, Text, TouchableOpacity } from 'react-native';

import { RootStackParamList } from '../App';

type OverviewScreenNavigationProps = StackNavigationProp<RootStackParamList, 'Overview'>;

export default function Overview() {
  const navigation = useNavigation<OverviewScreenNavigationProps>();
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  interface SearchResult {
    name: string;
    latitude: number; // Ensure this property is included
    longitude: number; // Ensure this property is included
    admin1: string;
    admin2: string;
    country: string;
    id: string | number;
  }

  // Debounce function
  const debounce = useCallback(
    <T extends (...args: any[]) => void>(
      func: T,
      delay: number
    ): ((...args: Parameters<T>) => void) => {
      let timeoutId: ReturnType<typeof setTimeout> | null = null;

      return function (this: any, ...args: Parameters<T>) {
        clearTimeout(timeoutId!);
        timeoutId = setTimeout(() => {
          func.apply(this, args);
        }, delay);
      };
    },
    []
  );

  const handleSearch = useCallback(async (text: string) => {
    setSearchText(text);
    try {
      const response = await fetch(
        `https://customer-geocoding-api.open-meteo.com/v1/search?apikey=&name=${text}&count=10&format=json`
      );
      const data = await response.json();
      setSearchResults(data.results); // Update this line
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
        data={searchResults}
        renderItem={({ item }) => {
          const searchResult = item as SearchResult; // Explicitly cast item to SearchResult
          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Details', {
                  name: searchResult.name,
                  lat: searchResult.latitude,
                  long: searchResult.longitude,
                  admin1: searchResult.admin1,
                  admin2: searchResult.admin2,
                  country: searchResult.country,
                })
              }
              style={styles.item}>
              <Text>{`${searchResult.name}, ${searchResult.admin1}, ${searchResult.admin2}, ${searchResult.country}`}</Text>
            </TouchableOpacity>
          );
        }}
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
