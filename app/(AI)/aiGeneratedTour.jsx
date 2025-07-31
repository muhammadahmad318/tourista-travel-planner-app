import { FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    Image,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { useTripContext } from '../../context/createTripContext';
import { useUser, useUserSavedItems } from '../../hooks/useUser';
import { GeneratePhoto } from '../../scripts/PhotoGenerator';
import { generateTourPlan, updatedAiTrip } from '../../scripts/updateAiTourData';


const AiGeneratedTour = () => {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
    const { tripData, resetTripData } = useTripContext();
    const { user, isAuthenticated } = useUser();
    const { saveAiGeneratedTour, removeSavedItem, checkIsAiGeneratedTourSaved, savedItems } = useUserSavedItems();

    const [tourData, setTourData] = useState(null);
    const [selectedDay, setSelectedDay] = useState('2024-01-15');
    const [isLoading, setIsLoading] = useState(true);
    const [fadeAnim] = useState(new Animated.Value(0));
    const [scaleAnim] = useState(new Animated.Value(0.8));
    const [isSaved, setIsSaved] = useState(false);
    const [savedItemId, setSavedItemId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // Simulate loading time and initialize data
    useEffect(() => {
        const loadTourData = async () => {
            try {
                setIsLoading(true);

                // Try to generate tour plan using Gemini API
                if (tripData && tripData.tour_info) {
                    console.log('Generating tour plan with Gemini API...');
                    const generatedTourPlan = await generateTourPlan(tripData);

                    if (generatedTourPlan.error) {
                        console.warn('Using fallback data due to API error:', generatedTourPlan.error);
                        setTourData(updatedAiTrip);
                    } else {
                        console.log('Successfully generated tour plan with Gemini API');
                        setTourData(generatedTourPlan);
                    }
                } else {
                    console.log('No trip data available, using sample data');
                    setTourData(updatedAiTrip);
                }

                // Animate in the content
                Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.spring(scaleAnim, {
                        toValue: 1,
                        tension: 50,
                        friction: 7,
                        useNativeDriver: true,
                    })
                ]).start();
            } catch (error) {
                console.error('Error loading tour data:', error);
                setTourData(updatedAiTrip);
            } finally {
                setIsLoading(false);
            }
        };

        loadTourData();
    }, [tripData]);

    // Check if this AI tour is already saved
    useEffect(() => {
        const checkSavedStatus = async () => {
            if (isAuthenticated && tourData) {
                try {
                    const saved = await checkIsAiGeneratedTourSaved(user.uid, tourData.tour_info.destination_name);
                    setIsSaved(saved);

                    // Find the saved item ID if it exists
                    const savedItem = savedItems.find(item =>
                        item.type === "ai_generated_tour" &&
                        item.itemData.tour_info.destination_name === tourData.tour_info.destination_name
                    );
                    if (savedItem) {
                        setSavedItemId(savedItem.id);
                    }
                } catch (error) {
                    console.error("Error checking saved status:", error);
                }
            }
        };

        checkSavedStatus();
    }, [isAuthenticated, tourData, user, savedItems]);

    const handleSaveTour = async () => {
        if (!isAuthenticated) {
            Alert.alert(
                "Login Required",
                "Please log in to save AI-generated tours",
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Login", onPress: () => router.push("/(LoginSignup)") }
                ]
            );
            return;
        }

        setIsSaving(true);
        try {
            if (isSaved && savedItemId) {
                // Remove from saved
                await removeSavedItem(savedItemId);
                setIsSaved(false);
                setSavedItemId(null);
                Alert.alert("Removed", "AI-generated tour removed from saved items");
            } else {
                // Save to saved items
                const newSavedItemId = await saveAiGeneratedTour(user.uid, tourData);
                setIsSaved(true);
                setSavedItemId(newSavedItemId);
                Alert.alert("Saved", "AI-generated tour saved to your collection");
            }
        } catch (error) {
            console.error("Error toggling save status:", error);
            Alert.alert("Error", "Failed to update saved status");
        } finally {
            setIsSaving(false);
        }
    };

    // Beautiful Loader Component
    const LoadingScreen = () => {
        const [spinAnim] = useState(new Animated.Value(0));
        const [progressAnim] = useState(new Animated.Value(0));
        const [textAnim] = useState(new Animated.Value(0));

        React.useEffect(() => {
            // Spinning animation
            Animated.loop(
                Animated.timing(spinAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                })
            ).start();

            // Progress animation
            Animated.timing(progressAnim, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
            }).start();

            // Text fade animation
            Animated.timing(textAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }).start();
        }, []);

        const spin = spinAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg'],
        });

        const progress = progressAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 100],
        });

        return (
            <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
                {/* Background pattern */}
                <View style={[styles.backgroundPattern, { backgroundColor: theme.primary + '05' }]} />

                {/* Main content */}
                <View style={styles.loadingContent}>
                    {/* Spinning circle */}
                    <Animated.View
                        style={[
                            styles.spinnerContainer,
                            { transform: [{ rotate: spin }] }
                        ]}
                    >
                        <View style={[
                            styles.spinnerCircle,
                            {
                                borderColor: theme.primary,
                                backgroundColor: theme.background
                            }
                        ]}>
                            <Ionicons
                                name="sparkles"
                                size={40}
                                color={theme.primary}
                            />
                        </View>
                    </Animated.View>

                    {/* Main title */}
                    <Animated.Text
                        style={[
                            styles.loadingTitle,
                            {
                                color: theme.text,
                                opacity: textAnim
                            }
                        ]}
                    >
                        AI Tour Generator
                    </Animated.Text>

                    {/* Progress text */}
                    <Animated.Text
                        style={[
                            styles.progressText,
                            {
                                color: theme.textSecondary,
                                opacity: textAnim
                            }
                        ]}
                    >
                        {Math.round(progress)}% Complete
                    </Animated.Text>

                    {/* Status messages */}
                    <View style={styles.statusContainer}>
                        <Animated.View
                            style={[
                                styles.statusItem,
                                { opacity: textAnim }
                            ]}
                        >
                            <Ionicons name="checkmark-circle" size={20} color={theme.primary} />
                            <Text style={[styles.statusText, { color: theme.textSecondary }]}>
                                Destination selected
                            </Text>
                        </Animated.View>

                        <Animated.View
                            style={[
                                styles.statusItem,
                                { opacity: textAnim }
                            ]}
                        >
                            <Ionicons name="checkmark-circle" size={20} color={theme.primary} />
                            <Text style={[styles.statusText, { color: theme.textSecondary }]}>
                                Preferences analyzed
                            </Text>
                        </Animated.View>

                        <Animated.View
                            style={[
                                styles.statusItem,
                                { opacity: textAnim }
                            ]}
                        >
                            <Ionicons name="time" size={20} color={theme.primary} />
                            <Text style={[styles.statusText, { color: theme.textSecondary }]}>
                                Generating itinerary...
                            </Text>
                        </Animated.View>
                    </View>

                    {/* Progress bar */}
                    <View style={[styles.progressBarContainer, { backgroundColor: theme.border }]}>
                        <Animated.View
                            style={[
                                styles.progressBarFill,
                                {
                                    backgroundColor: theme.primary,
                                    transform: [{
                                        scaleX: progressAnim
                                    }]
                                }
                            ]}
                        />
                    </View>
                </View>
            </View>
        );
    };

    // Show loader while loading
    if (isLoading) {
        return <LoadingScreen />;
    }

    // Group itinerary by date
    const groupedItinerary = tourData.itinerary.reduce((acc, item) => {
        if (!acc[item.date]) {
            acc[item.date] = [];
        }
        acc[item.date].push(item);
        return acc;
    }, {});

    const getDayName = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { weekday: 'long' });
    };

    const getIconForType = (type) => {
        switch (type) {
            case 'food':
                return <Ionicons name="restaurant" size={24} color="#FF6B6B" />;
            case 'HistoricalTourSpot':
                return <Ionicons name="library" size={24} color="#8B4513" />;
            case 'HillyTourSpot':
                return <Ionicons name="triangle" size={24} color="#228B22" />;
            case 'EntertainmentTourSpot':
                return <Ionicons name="game-controller" size={24} color="#FF69B4" />;
            case 'hotel':
                return <MaterialIcons name="hotel" size={24} color="#45B7D1" />;
            case 'localTransport':
                return <Ionicons name="bus" size={24} color="#32CD32" />;
            case 'carTransport':
                return <Ionicons name="car-sport" size={24} color="#FF8C00" />;
            case 'footsteps':
                return <Ionicons name="footsteps" size={24} color="#20B2AA" />;
            // Fallback for old types
            case 'tourSpot':
                return <MaterialIcons name="place" size={24} color="#4ECDC4" />;
            case 'transport':
                return <MaterialCommunityIcons name="car" size={24} color="#96CEB4" />;
            default:
                return <Ionicons name="location" size={24} color="#FFA726" />;
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'food':
                return '#FF6B6B'; // Red
            case 'HistoricalTourSpot':
                return '#8B4513'; // Brown
            case 'HillyTourSpot':
                return '#228B22'; // Green
            case 'EntertainmentTourSpot':
                return '#FF69B4'; // Pink
            case 'hotel':
                return '#45B7D1'; // Blue
            case 'localTransport':
                return '#32CD32'; // Lime Green
            case 'carTransport':
                return '#FF8C00'; // Orange
            case 'footsteps':
                return '#20B2AA'; // Light Sea Green
            // Fallback for old types
            case 'tourSpot':
                return '#4ECDC4';
            case 'transport':
                return '#96CEB4';
            default:
                return '#FFA726'; // Orange
        }
    };

    const getTypeDisplayText = (type) => {
        switch (type) {
            case 'food':
                return 'Food';
            case 'HistoricalTourSpot':
                return 'Historical';
            case 'HillyTourSpot':
                return 'Hilly';
            case 'EntertainmentTourSpot':
                return 'Entertainment';
            case 'hotel':
                return 'Hotel';
            case 'localTransport':
                return 'Local Transport';
            case 'carTransport':
                return 'Car Transport';
            case 'footsteps':
                return 'Walk';
            // Fallback for old types
            case 'tourSpot':
                return 'Tour Spot';
            case 'transport':
                return 'Transport';
            default:
                return type.charAt(0).toUpperCase() + type.slice(1);
        }
    };

    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null || isNaN(amount)) {
            return ''; // Return empty string for undefined/null costs
        }
        return `PKR ${Number(amount).toLocaleString()}`;
    };

    const isValidMapUrl = (url) => {
        return url &&
            url.trim() !== '' &&
            url.startsWith('http') &&
            (url.includes('maps.google.com') || url.includes('google.com/maps'));
    };

    const openGoogleMaps = (url) => {
        // Validate URL before opening
        if (!isValidMapUrl(url)) {
            Alert.alert('Error', 'No valid map location available for this place');
            return;
        }

        Linking.openURL(url).catch(err => {
            Alert.alert('Error', 'Could not open Google Maps');
        });
    };

    const handleShareTour = () => {
        Alert.alert(
            'Share Tour',
            'Share this amazing tour with your friends!',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Share', onPress: () => Alert.alert('Success', 'Tour shared!') }
            ]
        );
    };

    const handleRecreateNewPlan = () => {
        Alert.alert(
            'Recreate New Plan',
            'This will clear your current plan and start fresh. Are you sure?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Recreate',
                    style: 'destructive',
                    onPress: () => {
                        // Reset trip data
                        resetTripData();
                        // Clear navigation stack and replace to index
                        router.replace('/(AI)');
                    }
                }
            ]
        );
    };

    // Simple fallback image for when Unsplash doesn't have results
    const getSimpleFallbackImage = () => {
        return 'https://via.placeholder.com/400x300/CCCCCC/666666?text=Image+Not+Available';
    };

    // AsyncImage component to handle loading images from GeneratePhoto
    const AsyncImage = ({ placeName, style, onError, onLoad }) => {
        const [imageUrl, setImageUrl] = useState(null);
        const [isLoading, setIsLoading] = useState(true);
        const [hasError, setHasError] = useState(false);

        useEffect(() => {
            const loadImage = async () => {
                try {
                    setIsLoading(true);
                    setHasError(false);

                    // Try to get image from GeneratePhoto function
                    const unsplashUrl = await GeneratePhoto(placeName);

                    if (unsplashUrl) {
                        setImageUrl(unsplashUrl);
                    } else {
                        setImageUrl(getSimpleFallbackImage());
                    }
                } catch (error) {
                    console.error(`Error loading image for ${placeName}:`, error);
                    setImageUrl(getSimpleFallbackImage());
                    setHasError(true);
                } finally {
                    setIsLoading(false);
                }
            };

            loadImage();
        }, [placeName]);

        if (isLoading) {
            return (
                <View style={[style, { backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }]}>
                    <Ionicons name="image-outline" size={40} color="#ccc" />
                </View>
            );
        }

        return (
            <Image
                source={{ uri: imageUrl }}
                style={style}
                resizeMode="cover"
                onError={(error) => {
                    console.log(`Image load error for ${placeName}:`, error.nativeEvent.error);
                    setHasError(true);
                    if (onError) onError(error);
                }}
                onLoad={() => {
                    console.log(`Image loaded successfully for ${placeName}`);
                    if (onLoad) onLoad();
                }}
            />
        );
    };

    const renderItineraryItem = (item, index) => {
        return (
            <View key={index} style={[styles.itineraryItem, { backgroundColor: theme.card }]}>
                {/* Location Image */}
                <View style={styles.imageContainer}>
                    <AsyncImage
                        placeName={item.place_name}
                        style={styles.locationImage}
                        onError={(error) => {
                            console.log(`Image load error for item ${index}:`, error.nativeEvent.error);
                        }}
                        onLoad={() => {
                            console.log(`Image loaded successfully for item ${index}`);
                        }}
                    />
                    <View style={styles.imageOverlay}>
                        <View style={[styles.typeBadge, { backgroundColor: getTypeColor(item.type) + '20' }]}>
                            {getIconForType(item.type)}
                            <Text style={[styles.typeText, { color: getTypeColor(item.type) }]}>
                                {getTypeDisplayText(item.type)}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.itineraryContent}>
                    <View style={styles.itineraryHeader}>
                        <View style={styles.timeContainer}>
                            <Ionicons name="time-outline" size={16} color={theme.text} />
                            <Text style={[styles.timeText, { color: theme.text }]}>{item.time}</Text>
                        </View>
                    </View>

                    <View style={styles.placeInfo}>
                        <Text style={[styles.placeName, { color: theme.text }]}>{item.place_name}</Text>
                        <Text style={[styles.placeLocation, { color: theme.textSecondary }]}>
                            {item.full_location_name}
                        </Text>
                        <Text style={[styles.placeDescription, { color: theme.textSecondary }]}>
                            {item.description}
                        </Text>
                    </View>

                    <View style={styles.itineraryFooter}>
                        <View style={styles.costContainer}>
                            <FontAwesome5 name="money-bill-wave" size={16} color="#4CAF50" />
                            <Text style={[styles.costText, { color: theme.text }]}>
                                {formatCurrency(item.estimated_cost)}
                            </Text>
                        </View>
                        {isValidMapUrl(item.google_maps_url) && (
                            <TouchableOpacity
                                style={styles.mapButton}
                                onPress={() => openGoogleMaps(item.google_maps_url)}
                            >
                                <Ionicons name="map-outline" size={16} color={theme.primary} />
                                <Text style={[styles.mapButtonText, { color: theme.primary }]}>View on Map</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        );
    };

    const renderDaySelector = () => (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daySelector}>
            {Object.keys(groupedItinerary).map((date) => (
                <TouchableOpacity
                    key={date}
                    style={[
                        styles.dayButton,
                        {
                            backgroundColor: selectedDay === date ? theme.primary : theme.card,
                            borderColor: selectedDay === date ? theme.primary : theme.border
                        }
                    ]}
                    onPress={() => setSelectedDay(date)}
                >
                    <Text style={[
                        styles.dayButtonText,
                        { color: selectedDay === date ? '#FFFFFF' : theme.text }
                    ]}>
                        {getDayName(date)}
                    </Text>
                    <Text style={[
                        styles.dayDateText,
                        { color: selectedDay === date ? '#FFFFFF' : theme.textSecondary }
                    ]}>
                        {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    backgroundColor: theme.background,
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }]
                }
            ]}
        >
            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.card }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>AI Generated Tour</Text>
                    <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
                        {tourData.tour_info.destination_name}
                    </Text>
                </View>
                <View style={styles.headerActions}>
                    <TouchableOpacity onPress={handleRecreateNewPlan} style={styles.actionButton}>
                        <Ionicons name="refresh" size={24} color={theme.text} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSaveTour} style={styles.actionButton} disabled={isSaving}>
                        {isSaving ? (
                            <ActivityIndicator size={20} color={theme.text} />
                        ) : (
                            <Ionicons
                                name={isSaved ? "bookmark" : "bookmark-outline"}
                                size={24}
                                color={isSaved ? theme.primary : theme.text}
                            />
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
                {/* Hero Image */}
                <View style={styles.heroContainer}>
                    <AsyncImage
                        placeName={tourData.tour_info.destination_name}
                        style={styles.heroImage}
                        onError={(error) => {
                            console.log('Hero image load error:', error.nativeEvent.error);
                        }}
                        onLoad={() => {
                            console.log('Hero image loaded successfully');
                        }}
                    />
                    <View style={styles.heroOverlay}>
                        <View style={styles.heroContent}>
                            <Text style={styles.heroTitle}>{tourData.tour_info.destination_name}</Text>
                            <Text style={styles.heroSubtitle}>
                                {tourData.tour_info.dateRange.numberOfDays} Days • {tourData.tour_info.travel_type} Trip
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Tour Overview Card */}
                <View style={[styles.overviewCard, { backgroundColor: theme.card }]}>
                    <View style={styles.overviewHeader}>
                        <View style={styles.destinationInfo}>
                            <Text style={[styles.destinationName, { color: theme.text }]}>
                                {tourData.tour_info.destination_name}
                            </Text>
                            <Text style={[styles.tourDescription, { color: theme.textSecondary }]}>
                                {tourData.tour_info.description}
                            </Text>
                        </View>
                        <View style={styles.tourStats}>
                            <View style={styles.statItem}>
                                <Ionicons name="calendar-outline" size={20} color={theme.primary} />
                                <Text style={[styles.statText, { color: theme.text }]}>
                                    {tourData.tour_info.dateRange.numberOfDays} Days
                                </Text>
                            </View>
                            <View style={styles.statItem}>
                                <Ionicons name="people-outline" size={20} color={theme.primary} />
                                <Text style={[styles.statText, { color: theme.text }]}>
                                    {tourData.tour_info.travel_type}
                                </Text>
                            </View>
                            <View style={styles.statItem}>
                                <MaterialCommunityIcons name="car" size={20} color={theme.primary} />
                                <Text style={[styles.statText, { color: theme.text }]}>
                                    {tourData.tour_info.mode_of_transport}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Cost Summary */}
                <View style={[styles.costCard, { backgroundColor: theme.card }]}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Cost Summary</Text>
                    <View style={styles.costGrid}>
                        <View style={styles.costItem}>
                            <Text style={[styles.costLabel, { color: theme.textSecondary }]}>Accommodation</Text>
                            <Text style={[styles.costValue, { color: theme.text }]}>
                                {formatCurrency(tourData.total_estimates.total_accommodation_cost)}
                            </Text>
                        </View>
                        <View style={styles.costItem}>
                            <Text style={[styles.costLabel, { color: theme.textSecondary }]}>Food</Text>
                            <Text style={[styles.costValue, { color: theme.text }]}>
                                {formatCurrency(tourData.total_estimates.total_food_cost)}
                            </Text>
                        </View>
                        <View style={styles.costItem}>
                            <Text style={[styles.costLabel, { color: theme.textSecondary }]}>Transport</Text>
                            <Text style={[styles.costValue, { color: theme.text }]}>
                                {formatCurrency(tourData.total_estimates.total_transport_cost)}
                            </Text>
                        </View>
                        <View style={styles.costItem}>
                            <Text style={[styles.costLabel, { color: theme.textSecondary }]}>Others</Text>
                            <Text style={[styles.costValue, { color: theme.text }]}>
                                {formatCurrency(tourData.total_estimates.total_others)}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.totalCost}>
                        <Text style={[styles.totalCostLabel, { color: theme.text }]}>Total Estimated Cost</Text>
                        <Text style={[styles.totalCostValue, { color: theme.primary }]}>
                            {formatCurrency(tourData.total_estimates.total_estimated_cost)}
                        </Text>
                    </View>
                </View>

                {/* Day Selector */}
                {renderDaySelector()}

                {/* Itinerary */}
                <View style={styles.itineraryContainer}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>
                        Day {Object.keys(groupedItinerary).indexOf(selectedDay) + 1} - {getDayName(selectedDay)}
                    </Text>
                    {groupedItinerary[selectedDay]?.map((item, index) => renderItineraryItem(item, index))}
                </View>

                {/* Tips and Notes */}
                <View style={[styles.tipsCard, { backgroundColor: theme.card }]}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Tips & Notes</Text>
                    {tourData.notes_and_tips.map((tip, index) => (
                        <View key={index} style={styles.tipItem}>
                            <Ionicons name="bulb-outline" size={20} color="#FFA726" />
                            <View style={styles.tipContent}>
                                <Text style={[styles.tipTitle, { color: theme.text }]}>{tip.title}</Text>
                                <Text style={[styles.tipDescription, { color: theme.textSecondary }]}>
                                    {tip.description}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Recreate New Plan Button */}
                <View style={styles.recreateButtonContainer}>
                    <TouchableOpacity
                        style={[styles.recreateButton, { backgroundColor: theme.backgroundSecondary, borderColor: theme.primary }]}
                        onPress={handleRecreateNewPlan}
                    >
                        <Ionicons name="refresh" size={20} color={theme.primary} />
                        <Text style={[styles.recreateButtonText, { color: theme.primary }]}>Recreate New Plan</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        zIndex: 1000,
    },
    backButton: {
        padding: 8,
    },
    headerContent: {
        flex: 1,
        marginLeft: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    headerSubtitle: {
        fontSize: 14,
        marginTop: 2,
    },
    headerActions: {
        flexDirection: 'row',
    },
    actionButton: {
        padding: 8,
        marginLeft: 8,
    },
    scrollView: {
        flex: 1,
    },
    heroContainer: {
        height: 250,
        position: 'relative',
        marginBottom: 16,
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    heroOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding: 20,
    },
    heroContent: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    heroTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    heroSubtitle: {
        fontSize: 16,
        color: '#FFFFFF',
        opacity: 0.9,
    },
    overviewCard: {
        margin: 16,
        marginTop: 0,
        padding: 20,
        borderRadius: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    overviewHeader: {
        marginBottom: 16,
    },
    destinationName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    tourDescription: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 16,
    },
    tourStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statText: {
        fontSize: 12,
        marginTop: 4,
        fontWeight: '500',
    },
    costCard: {
        margin: 16,
        marginTop: 0,
        padding: 20,
        borderRadius: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    costGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    costItem: {
        width: '48%',
        marginBottom: 12,
    },
    costLabel: {
        fontSize: 12,
        marginBottom: 4,
    },
    costValue: {
        fontSize: 16,
        fontWeight: '600',
    },
    totalCost: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    totalCostLabel: {
        fontSize: 16,
        fontWeight: '600',
    },
    totalCostValue: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    daySelector: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    dayButton: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        marginRight: 12,
        borderRadius: 25,
        borderWidth: 1,
        alignItems: 'center',
        minWidth: 100,
    },
    dayButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    dayDateText: {
        fontSize: 12,
        marginTop: 2,
    },
    itineraryContainer: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    itineraryItem: {
        marginBottom: 20,
        borderRadius: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        overflow: 'hidden',
    },
    imageContainer: {
        height: 200,
        position: 'relative',
    },
    locationImage: {
        width: '100%',
        height: '100%',
    },
    imageOverlay: {
        position: 'absolute',
        top: 12,
        right: 12,
    },
    itineraryContent: {
        padding: 16,
    },
    itineraryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeText: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 4,
    },
    typeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    typeText: {
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 4,
    },
    placeInfo: {
        marginBottom: 12,
    },
    placeName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    placeLocation: {
        fontSize: 12,
        marginBottom: 8,
    },
    placeDescription: {
        fontSize: 14,
        lineHeight: 20,
    },
    itineraryFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    costContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    costText: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 4,
    },
    mapButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    mapButtonText: {
        fontSize: 12,
        fontWeight: '500',
        marginLeft: 4,
    },
    tipsCard: {
        margin: 16,
        padding: 20,
        borderRadius: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    tipItem: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    tipContent: {
        flex: 1,
        marginLeft: 12,
    },
    tipTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    tipDescription: {
        fontSize: 12,
        lineHeight: 18,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundPattern: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.05,
    },
    loadingContent: {
        alignItems: 'center',
    },
    spinnerContainer: {
        marginBottom: 20,
    },
    spinnerCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    progressText: {
        fontSize: 16,
        color: '#666',
    },
    statusContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 20,
    },
    statusItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    statusText: {
        fontSize: 14,
        marginLeft: 8,
        fontWeight: '500',
    },
    progressBarContainer: {
        width: '80%',
        height: 20,
        borderRadius: 10,
        backgroundColor: '#E0E0E0',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 10,
    },
    recreateButtonContainer: {
        padding: 16,
        paddingBottom: 32,
        alignItems: 'center',
    },
    recreateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        borderWidth: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    recreateButtonText: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
});

export default AiGeneratedTour; 