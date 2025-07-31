import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const GooglePlacesSearch = ({ onPlaceSelect, placeholder = 'Search places...' }) => {
    return (
        <View style={styles.container}>
            <GooglePlacesAutocomplete
                placeholder={placeholder}
                onPress={(data, details = null) => {
                    if (onPlaceSelect) {
                        onPlaceSelect(data, details);
                    }
                    console.log('Selected place:', data, details);
                }}
                query={{
                    key: process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY, // Make sure to set this in your environment
                    language: 'en',
                    types: 'geocode', // You can change this to 'establishment' for businesses
                }}
                styles={{
                    container: styles.autocompleteContainer,
                    textInput: styles.textInput,
                    listView: styles.listView,
                    row: styles.row,
                    description: styles.description,
                }}
                fetchDetails={true}
                enablePoweredByContainer={false}
                minLength={2}
                debounce={300}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 20,
        marginVertical: 10,
    },
    autocompleteContainer: {
        flex: 0,
        marginTop: 0,
        zIndex: 1,
    },
    textInput: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    listView: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#fff',
        marginTop: 5,
    },
    row: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    description: {
        fontSize: 14,
        color: '#333',
    },
});

export default GooglePlacesSearch; 