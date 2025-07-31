import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Keyboard, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View, useColorScheme } from "react-native";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Colors } from "../../constants/Colors";
import { useTripContext } from "../../context/createTripContext";

const SearchStartingPoint = () => {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
    const { tripData, setTripData } = useTripContext();
    const mapRef = useRef(null);

    const [selectedPlace, setSelectedPlace] = useState(null);
    const [placeDetails, setPlaceDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [apiKeyAvailable, setApiKeyAvailable] = useState(false);
    const [region, setRegion] = useState({
        latitude: 30.3753, // Pakistan center coordinates
        longitude: 69.3451,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const [marker, setMarker] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [noResultsFound, setNoResultsFound] = useState(false);

    // Check API key availability
    useEffect(() => {
        const checkApiKey = () => {
            const hasApiKey = !!process.env.EXPO_PUBLIC_REACT_NATIVE_GOOGLE_PLACES_AUTOCOMPLETE;
            setApiKeyAvailable(hasApiKey);
            setIsLoading(false);
        };

        // Add a small delay to ensure environment variables are loaded
        setTimeout(checkApiKey, 100);
    }, []);

    useEffect(() => {
        console.log('====================================');
        console.log("Trip Data :-");
        console.log(tripData);
        console.log('==================================== ended trip data');
    }, [tripData]);

    // Function to handle map press
    const handleMapPress = (event) => {
        const { coordinate } = event.nativeEvent;
        setMarker(coordinate);
        fetchPlaceDetails(coordinate);
    };

    // Function to fetch place details from coordinates
    const fetchPlaceDetails = async (coordinate) => {
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinate.latitude},${coordinate.longitude}&key=${process.env.EXPO_PUBLIC_REACT_NATIVE_GOOGLE_PLACES_AUTOCOMPLETE}`
            );
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                const place = data.results[0];
                const placeData = {
                    place_id: place.place_id,
                    description: place.formatted_address,
                };

                const details = {
                    geometry: {
                        location: {
                            lat: coordinate.latitude,
                            lng: coordinate.longitude
                        }
                    },
                    url: `https://maps.google.com/?q=${coordinate.latitude},${coordinate.longitude}`,
                    formatted_address: place.formatted_address,
                    name: place.formatted_address,
                };

                setSelectedPlace(placeData);
                setPlaceDetails(details);

                // Update trip data with starting location
                setTripData(prevData => ({
                    ...prevData,
                    transportation: {
                        ...prevData.transportation,
                        starting_location: {
                            city: place.formatted_address,
                            geo_coordinates: {
                                latitude: coordinate.latitude,
                                longitude: coordinate.longitude
                            }
                        }
                    }
                }));
            }
        } catch (error) {
            console.error('Error fetching place details:', error);
            Alert.alert('Error', 'Failed to get location details. Please try again.');
        }
    };

    // Function to handle place selection from search
    const handlePlaceSelection = (data, details) => {
        console.log('====================================');
        console.log(data);
        console.log('====================================');
        console.log('====================================');
        console.log(details);
        console.log('====================================');

        setSelectedPlace(data);
        setPlaceDetails(details);

        // Update marker position
        if (details?.geometry?.location) {
            const newCoordinate = {
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
            };
            setMarker(newCoordinate);

            // Animate map to new location
            mapRef.current?.animateToRegion({
                latitude: newCoordinate.latitude,
                longitude: newCoordinate.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
        }

        // Update trip data with starting location
        setTripData(prevData => ({
            ...prevData,
            transportation: {
                ...prevData.transportation,
                starting_location: {
                    city: data.description,
                    geo_coordinates: {
                        latitude: details?.geometry?.location?.lat,
                        longitude: details?.geometry?.location?.lng
                    }
                }
            }
        }));
    };

    // Debug: Check if API key is loaded
    console.log('API Key loaded:', !!process.env.EXPO_PUBLIC_REACT_NATIVE_GOOGLE_PLACES_AUTOCOMPLETE);
    console.log('API Key length:', process.env.EXPO_PUBLIC_REACT_NATIVE_GOOGLE_PLACES_AUTOCOMPLETE?.length);

    const handleBack = () => {
        router.back();
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
        header: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingTop: 60,
            paddingBottom: 20,
            backgroundColor: theme.backgroundSecondary,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
        },
        backButton: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: theme.backgroundTertiary,
            justifyContent: "center",
            alignItems: "center",
            shadowColor: theme.text,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        },
        headerTitle: {
            fontSize: 18,
            fontWeight: "bold",
            color: theme.text,
        },
        placeholder: {
            width: 40,
        },
        content: {
            flex: 1,
        },
        mapContainer: {
            flex: 1,
            position: 'relative',
        },
        searchContainer: {
            position: 'absolute',
            top: 20,
            left: 20,
            right: 50,
            zIndex: 1000,
        },
        map: {
            flex: 1,
        },
        instructionText: {
            position: 'absolute',
            bottom: 20,
            left: 20,
            right: 80,
            backgroundColor: theme.backgroundSecondary,
            padding: 16,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.border,
            shadowColor: theme.text,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
        },
        instructionTitle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: theme.text,
            marginBottom: 8,
        },
        instructionDescription: {
            fontSize: 14,
            color: theme.textSecondary,
            lineHeight: 20,
        },
        selectedLocationCard: {
            position: 'absolute',
            bottom: 20,
            left: 20,
            right: 80,
            backgroundColor: theme.background,
            padding: 16,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.primary,
            shadowColor: theme.primary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 4,
        },
        selectedLocationTitle: {
            fontSize: 14,
            fontWeight: 'bold',
            color: theme.primary,
            marginBottom: 4,
        },
        selectedLocationText: {
            fontSize: 13,
            color: theme.text,
            lineHeight: 18,
        },
        emptyListContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
            minHeight: 120,
        },
        emptyListText: {
            fontSize: 16,
            fontWeight: 'bold',
            color: theme.textSecondary,
            marginTop: 8,
            textAlign: 'center',
        },
        emptyListSubText: {
            fontSize: 14,
            color: theme.textTertiary,
            marginTop: 4,
            textAlign: 'center',
        },
    });

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={theme.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>
                        Select Starting Point
                    </Text>
                    <View style={styles.placeholder} />
                </View>

                {/* Map Container */}
                <View style={styles.mapContainer}>
                    {isLoading ? (
                        <View style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingHorizontal: 20,
                        }}>
                            <Ionicons name="hourglass" size={40} color={theme.primary} />
                            <Text style={{ color: theme.text, fontSize: 16, marginTop: 16, textAlign: 'center' }}>
                                Loading map...
                            </Text>
                        </View>
                    ) : apiKeyAvailable ? (
                        <>
                            <MapView
                                ref={mapRef}
                                style={styles.map}
                                provider={PROVIDER_GOOGLE}
                                initialRegion={region}
                                onLongPress={handleMapPress}
                                showsUserLocation={true}
                                showsMyLocationButton={true}
                                showsCompass={true}
                                showsScale={true}
                                mapType="standard"
                            >
                                {marker && (
                                    <Marker
                                        coordinate={marker}
                                        title="Selected Starting Point"
                                        description={selectedPlace?.description || "Tap to select location"}
                                        pinColor={theme.primary}
                                    />
                                )}
                            </MapView>

                            {/* Search Bar */}
                            <View style={styles.searchContainer}>
                                <GooglePlacesAutocomplete
                                    placeholder="Choose starting point ..."
                                    onPress={handlePlaceSelection}
                                    query={{
                                        key: process.env.EXPO_PUBLIC_REACT_NATIVE_GOOGLE_PLACES_AUTOCOMPLETE,
                                        language: 'en',
                                        types: '(cities)',
                                        components: 'country:pk',
                                        location: '30.3753,69.3451', // Pakistan center coordinates
                                        radius: '1000000', // 1000km radius
                                    }}
                                    fetchDetails={true}
                                    enablePoweredByContainer={false}
                                    onError={(error) => {
                                        console.error('Google Places API Error:', error);
                                        setIsSearching(false);
                                        setNoResultsFound(true);
                                    }}
                                    onNotFound={() => {
                                        console.log('No results found');
                                        setIsSearching(false);
                                        setNoResultsFound(true);
                                    }}
                                    onTimeout={() => {
                                        console.log('Search timeout');
                                        setIsSearching(false);
                                        setNoResultsFound(true);
                                    }}
                                    onFail={(error) => {
                                        console.log('Search failed:', error);
                                        setIsSearching(false);
                                        setNoResultsFound(true);
                                    }}
                                    styles={{
                                        container: {
                                            flex: 0,
                                        },
                                        textInputContainer: {
                                            backgroundColor: 'transparent',
                                            borderTopWidth: 0,
                                            borderBottomWidth: 0,
                                        },
                                        textInput: {
                                            height: 50,
                                            borderColor: theme.border,
                                            fontSize: 16,
                                            backgroundColor: theme.backgroundSecondary,
                                            color: theme.text,
                                            borderRadius: 12,
                                            paddingHorizontal: 16,
                                            shadowColor: theme.text,
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.1,
                                            shadowRadius: 8,
                                            elevation: 4,
                                        },
                                        listView: {
                                            backgroundColor: theme.background,
                                            width: '95%',
                                            alignSelf: 'center',
                                            marginTop: 8,
                                            borderColor: theme.border,
                                            borderWidth: 1,
                                            shadowColor: theme.text,
                                            shadowOffset: { width: 0, height: 4 },
                                            shadowOpacity: 0.15,
                                            shadowRadius: 12,
                                            elevation: 8,
                                            maxHeight: 200,
                                        },
                                        row: {
                                            borderBottomColor: theme.border,
                                            height: 50,
                                            backgroundColor: theme.background,
                                            alignItems: 'center',
                                            paddingVertical: 8,
                                        },
                                        description: {
                                            color: theme.text,
                                            fontSize: 14,
                                        },
                                        separator: {
                                            height: 1,
                                            backgroundColor: theme.border,
                                        },
                                        powered: {
                                            display: 'none',
                                        },
                                        poweredContainer: {
                                            display: 'none',
                                        },
                                    }}
                                    textInputProps={{
                                        placeholderTextColor: theme.textTertiary,
                                        returnKeyType: 'search',
                                        autoCapitalize: 'none',
                                        autoCorrect: false,
                                        onFocus: () => {
                                            setIsSearching(false);
                                            setNoResultsFound(false);
                                        },
                                        onChangeText: (text) => {
                                            if (text.length > 0) {
                                                setIsSearching(true);
                                                setNoResultsFound(false);
                                            } else {
                                                setIsSearching(false);
                                                setNoResultsFound(false);
                                            }
                                        },
                                    }}
                                    listEmptyComponent={() => {
                                        if (isSearching) {
                                            return (
                                                <View style={styles.emptyListContainer}>
                                                    <Ionicons name="hourglass" size={24} color={theme.primary} />
                                                    <Text style={[styles.emptyListText, { color: theme.textSecondary }]}>
                                                        Searching...
                                                    </Text>
                                                </View>
                                            );
                                        } else if (noResultsFound) {
                                            return (
                                                <View style={styles.emptyListContainer}>
                                                    <Ionicons name="search" size={24} color={theme.textTertiary} />
                                                    <Text style={[styles.emptyListText, { color: theme.textTertiary }]}>
                                                        No starting points found
                                                    </Text>
                                                    <Text style={[styles.emptyListSubText, { color: theme.textTertiary }]}>
                                                        Try a different search term
                                                    </Text>
                                                </View>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                            </View>

                            {/* Selected Location Card */}
                            {selectedPlace && (
                                <View style={styles.selectedLocationCard}>
                                    <Text style={styles.selectedLocationTitle}>
                                        <Ionicons name="location" size={16} color={theme.primary} /> Selected Starting Point
                                    </Text>
                                    <Text style={styles.selectedLocationText}>
                                        {selectedPlace.description}
                                    </Text>
                                </View>
                            )}

                            {/* Instructions */}
                            {!selectedPlace && (
                                <View style={styles.instructionText}>
                                    <Text style={styles.instructionTitle}>
                                        <Ionicons name="map" size={16} color={theme.primary} /> How to select starting point
                                    </Text>
                                    <Text style={styles.instructionDescription}>
                                        • Search for a place using the search bar above{'\n'}
                                        • Or Long Press anywhere on the map to select a location{'\n'}
                                        • The selected location will be marked with a pin
                                    </Text>
                                </View>
                            )}
                        </>
                    ) : (
                        <View style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingHorizontal: 20,
                        }}>
                            <Ionicons name="warning" size={40} color="#ff6b6b" />
                            <Text style={{ color: '#ff6b6b', fontSize: 16, marginTop: 16, textAlign: 'center', fontWeight: '500' }}>
                                ⚠️ Google Maps API key is not configured
                            </Text>
                            <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 8, textAlign: 'center' }}>
                                Please configure your API key to use the map feature
                            </Text>
                        </View>
                    )}
                </View>

                {/* Next Button */}
                <View style={{ padding: 20, backgroundColor: theme.background }}>
                    <TouchableOpacity
                        style={{
                            backgroundColor: placeDetails ? theme.primary : theme.primary + '55',
                            minHeight: 48,
                            width: 320,
                            alignSelf: 'center',
                            borderRadius: 14,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                            paddingHorizontal: 24,
                            paddingVertical: placeDetails ? 12 : 8,
                            opacity: placeDetails ? 1 : 0.7,
                            shadowColor: theme.primary,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: placeDetails ? 0.18 : 0,
                            shadowRadius: 6,
                            elevation: placeDetails ? 3 : 0,
                        }}
                        disabled={!placeDetails}
                        onPress={() => {
                            if (placeDetails) {
                                router.push({
                                    pathname: '/(AI)/searchDestination',
                                    params: { place: JSON.stringify(selectedPlace), details: JSON.stringify(placeDetails) },
                                });
                            }
                        }}
                    >
                        <Text
                            style={{
                                color: theme.white,
                                fontWeight: 'bold',
                                fontSize: placeDetails ? 18 : 14,
                                flexShrink: 1,
                                textAlign: 'center',
                                marginRight: placeDetails ? 8 : 0,
                                flex: 0,
                            }}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {placeDetails ? 'Next' : 'Select a starting point on the map'}
                        </Text>
                        {placeDetails && (
                            <Ionicons name="arrow-forward-circle" size={22} color={theme.white} />
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default SearchStartingPoint; 