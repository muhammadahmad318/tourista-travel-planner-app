import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSpring,
    withTiming
} from "react-native-reanimated";
import { Colors } from "../../constants/Colors";
import { useTripContext } from "../../context/createTripContext";
import FloatingAIButton from "./../../components/FloatingAIButton";

const { width } = Dimensions.get("window");

const ReviewPlan = () => {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
    const { tripData } = useTripContext();

    // Animation values for slide from right
    const slideIn = useSharedValue(width);
    const fadeIn = useSharedValue(0);

    // Card animation values
    const card1Scale = useSharedValue(0.8);
    const card2Scale = useSharedValue(0.8);
    const card3Scale = useSharedValue(0.8);
    const card4Scale = useSharedValue(0.8);
    const card5Scale = useSharedValue(0.8);
    const card1Opacity = useSharedValue(0);
    const card2Opacity = useSharedValue(0);
    const card3Opacity = useSharedValue(0);
    const card4Opacity = useSharedValue(0);
    const card5Opacity = useSharedValue(0);

    useEffect(() => {
        // Slide from right animation
        slideIn.value = withSpring(0, { damping: 20, stiffness: 100 });
        fadeIn.value = withTiming(1, { duration: 800 });

        // Staggered card animations
        if (tripData.tour_info?.destination_name) {
            card1Scale.value = withDelay(300, withSpring(1, { damping: 15, stiffness: 100 }));
            card1Opacity.value = withDelay(300, withTiming(1, { duration: 600 }));
        }
        if (tripData.tour_info?.mode_of_transport) {
            card5Scale.value = withDelay(500, withSpring(1, { damping: 15, stiffness: 100 }));
            card5Opacity.value = withDelay(500, withTiming(1, { duration: 600 }));
        }
        if (tripData.tour_info?.travel_type) {
            card2Scale.value = withDelay(700, withSpring(1, { damping: 15, stiffness: 100 }));
            card2Opacity.value = withDelay(700, withTiming(1, { duration: 600 }));
        }
        if (tripData.tour_info?.dateRange) {
            card3Scale.value = withDelay(900, withSpring(1, { damping: 15, stiffness: 100 }));
            card3Opacity.value = withDelay(900, withTiming(1, { duration: 600 }));
        }
        if (tripData.tour_info?.budgetType) {
            card4Scale.value = withDelay(1100, withSpring(1, { damping: 15, stiffness: 100 }));
            card4Opacity.value = withDelay(1100, withTiming(1, { duration: 600 }));
        }

    });

    const slideInStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: slideIn.value }],
    }));

    const fadeInStyle = useAnimatedStyle(() => ({
        opacity: fadeIn.value,
    }));

    const card1Style = useAnimatedStyle(() => ({
        transform: [{ scale: card1Scale.value }],
        opacity: card1Opacity.value,
    }));

    const card2Style = useAnimatedStyle(() => ({
        transform: [{ scale: card2Scale.value }],
        opacity: card2Opacity.value,
    }));

    const card3Style = useAnimatedStyle(() => ({
        transform: [{ scale: card3Scale.value }],
        opacity: card3Opacity.value,
    }));

    const card4Style = useAnimatedStyle(() => ({
        transform: [{ scale: card4Scale.value }],
        opacity: card4Opacity.value,
    }));

    const card5Style = useAnimatedStyle(() => ({
        transform: [{ scale: card5Scale.value }],
        opacity: card5Opacity.value,
    }));

    const handleBack = () => {
        router.back();
    };

    const handleStartPlanning = () => {
        // Navigate to AI Generated Tour page
        router.push('/(AI)/aiGeneratedTour');
    };

    const getBudgetIcon = (budgetType) => {
        switch (budgetType) {
            case 'cheap':
                return <Ionicons name="wallet-outline" size={24} color={theme.primary} />;
            case 'moderate':
                return <Ionicons name="cash" size={24} color={theme.primary} />;
            case 'luxury':
                return <Ionicons name="diamond" size={24} color={theme.primary} />;
            default:
                return <Ionicons name="wallet" size={24} color={theme.primary} />;
        }
    };

    const getTravelerIcon = (travelerType) => {
        switch (travelerType) {
            case 'solo':
                return <Ionicons name="person" size={24} color={theme.primary} />;
            case 'couple':
                return <Ionicons name="people" size={24} color={theme.primary} />;
            case 'family':
                return <Ionicons name="people-circle" size={24} color={theme.primary} />;
            case 'friends':
                return <Ionicons name="people" size={24} color={theme.primary} />;
            default:
                return <Ionicons name="people" size={24} color={theme.primary} />;
        }
    };

    const getTransportIcon = (transportMode) => {
        switch (transportMode) {
            case 'car':
                return <Ionicons name="car-sport" size={24} color={theme.primary} />;
            case 'bus':
                return <Ionicons name="bus" size={24} color={theme.primary} />;
            case 'train':
                return <Ionicons name="train" size={24} color={theme.primary} />;
            default:
                return <Ionicons name="car" size={24} color={theme.primary} />;
        }
    };

    const getTransportName = (transportMode) => {
        switch (transportMode) {
            case 'car':
                return 'Car';
            case 'bus':
                return 'Bus';
            case 'train':
                return 'Train';
            default:
                return 'Transport';
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <Animated.View style={[styles.header, slideInStyle]}>
                <TouchableOpacity onPress={handleBack} style={[styles.backButton, { backgroundColor: theme.backgroundSecondary }]}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Review Your Plan</Text>
                <View style={styles.placeholder} />
            </Animated.View>

            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Trip Overview Cards */}
                <View style={styles.overviewContainer}>
                    {/* Starting Location Card */}
                    {tripData.transportation?.starting_location?.city && (
                        <Animated.View style={[styles.overviewCard, card1Style]}>
                            <TouchableOpacity
                                style={[styles.cardContent, { backgroundColor: theme.backgroundSecondary }]}
                                activeOpacity={0.8}
                            >
                                <View style={styles.cardHeader}>
                                    <Ionicons name="home" size={24} color={theme.primary} />
                                    <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>Starting Point</Text>
                                </View>
                                <Text style={[styles.cardValue, { color: theme.text }]} numberOfLines={2}>
                                    {tripData.transportation.starting_location.city}
                                </Text>
                                <View style={styles.cardFooter}>
                                    <Ionicons name="checkmark-circle" size={16} color={theme.primary} />
                                    <Text style={[styles.cardStatus, { color: theme.textSecondary }]}>Selected</Text>
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    )}

                    {/* Destination Card */}
                    {tripData.tour_info?.destination_name && (
                        <Animated.View style={[styles.overviewCard, card1Style]}>
                            <TouchableOpacity
                                style={[styles.cardContent, { backgroundColor: theme.backgroundSecondary }]}
                                activeOpacity={0.8}
                            >
                                <View style={styles.cardHeader}>
                                    <Ionicons name="location" size={24} color={theme.primary} />
                                    <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>Destination</Text>
                                </View>
                                <Text style={[styles.cardValue, { color: theme.text }]} numberOfLines={2}>
                                    {tripData.tour_info.destination_name}
                                </Text>
                                <View style={styles.cardFooter}>
                                    <Ionicons name="checkmark-circle" size={16} color={theme.primary} />
                                    <Text style={[styles.cardStatus, { color: theme.textSecondary }]}>Selected</Text>
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    )}
                    {/* Transport Mode Card */}
                    {tripData.tour_info?.mode_of_transport && (
                        <Animated.View style={[styles.overviewCard, card5Style]}>
                            <TouchableOpacity
                                style={[styles.cardContent, { backgroundColor: theme.backgroundSecondary }]}
                                activeOpacity={0.8}
                            >
                                <View style={styles.cardHeader}>
                                    {getTransportIcon(tripData.tour_info.mode_of_transport)}
                                    <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>Transport</Text>
                                </View>
                                <Text style={[styles.cardValue, { color: theme.text }]}>
                                    {getTransportName(tripData.tour_info.mode_of_transport)}
                                </Text>
                                <View style={styles.cardFooter}>
                                    <Ionicons name="checkmark-circle" size={16} color={theme.primary} />
                                    <Text style={[styles.cardStatus, { color: theme.textSecondary }]}>Selected</Text>
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    )}

                    {/* Traveler Type Card */}
                    {tripData.tour_info?.travel_type && (
                        <Animated.View style={[styles.overviewCard, card2Style]}>
                            <TouchableOpacity
                                style={[styles.cardContent, { backgroundColor: theme.backgroundSecondary }]}
                                activeOpacity={0.8}
                            >
                                <View style={styles.cardHeader}>
                                    {getTravelerIcon(tripData.tour_info.travel_type)}
                                    <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>Travelers</Text>
                                </View>
                                <Text style={[styles.cardValue, { color: theme.text }]}>
                                    {tripData.tour_info.travel_type === 'solo' ? 'Solo Traveler' :
                                        tripData.tour_info.travel_type === 'couple' ? 'Couple' :
                                            tripData.tour_info.travel_type === 'family' ? 'Family' : 'Friends'}
                                </Text>
                                <View style={styles.cardFooter}>
                                    <Ionicons name="checkmark-circle" size={16} color={theme.primary} />
                                    <Text style={[styles.cardStatus, { color: theme.textSecondary }]}>Confirmed</Text>
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    )}

                    {/* Date Range Card */}
                    {tripData.tour_info?.dateRange && (
                        <Animated.View style={[styles.overviewCard, card3Style]}>
                            <TouchableOpacity
                                style={[styles.cardContent, { backgroundColor: theme.backgroundSecondary }]}
                                activeOpacity={0.8}
                            >
                                <View style={styles.cardHeader}>
                                    <Ionicons name="calendar" size={24} color={theme.primary} />
                                    <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>Duration</Text>
                                </View>
                                <Text style={[styles.cardValue, { color: theme.text }]}>
                                    {tripData.tour_info.dateRange.numberOfDays} day{tripData.tour_info.dateRange.numberOfDays !== 1 ? 's' : ''} trip
                                </Text>
                                <View style={styles.cardFooter}>
                                    <Ionicons name="checkmark-circle" size={16} color={theme.primary} />
                                    <Text style={[styles.cardStatus, { color: theme.textSecondary }]}>Scheduled</Text>
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    )}

                    {/* Budget Card */}
                    {tripData.tour_info?.budgetType && (
                        <Animated.View style={[styles.overviewCard, card4Style]}>
                            <TouchableOpacity
                                style={[styles.cardContent, { backgroundColor: theme.backgroundSecondary }]}
                                activeOpacity={0.8}
                            >
                                <View style={styles.cardHeader}>
                                    {getBudgetIcon(tripData.tour_info.budgetType)}
                                    <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>Budget</Text>
                                </View>
                                <Text style={[styles.cardValue, { color: theme.text }]}>
                                    {tripData.tour_info.budgetType.charAt(0).toUpperCase() + tripData.tour_info.budgetType.slice(1)}
                                </Text>
                                <View style={styles.cardFooter}>
                                    <Ionicons name="checkmark-circle" size={16} color={theme.primary} />
                                    <Text style={[styles.cardStatus, { color: theme.textSecondary }]}>Set</Text>
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    )}


                </View>

                {/* Summary Section */}
                <Animated.View style={[styles.summarySection, fadeInStyle]}>
                    <View style={[styles.summaryCard, { backgroundColor: theme.backgroundSecondary }]}>
                        <View style={styles.summaryHeader}>
                            <Ionicons name="airplane" size={28} color={theme.primary} />
                            <Text style={[styles.summaryTitle, { color: theme.text }]}>Trip Summary</Text>
                        </View>
                        <Text style={[styles.summaryText, { color: theme.textSecondary }]}>
                            Your trip is ready! All details have been confirmed and you&apos;re ready to start planning your adventure.
                        </Text>
                    </View>
                </Animated.View>
            </ScrollView>

            {/* Fixed Start Planning Button */}
            <Animated.View style={[styles.fixedActionContainer, slideInStyle, fadeInStyle]}>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.primary, flex: 1 }]}
                    onPress={handleStartPlanning}
                >
                    <Ionicons name="sparkles" size={20} color={theme.white} />
                    <Text style={[styles.actionButtonText, { color: theme.white }]}>Start Planning</Text>
                </TouchableOpacity>
            </Animated.View>

            <FloatingAIButton />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
    },
    placeholder: {
        width: 40,
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        paddingBottom: 100,
    },
    overviewContainer: {
        marginBottom: 30,
        gap: 16,
    },
    overviewCard: {
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
    },
    cardContent: {
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.08)',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardLabel: {
        fontSize: 14,
        marginLeft: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    cardValue: {
        fontSize: 18,
        fontWeight: '700',
        marginLeft: 36,
        marginBottom: 12,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 36,
    },
    cardStatus: {
        fontSize: 12,
        marginLeft: 6,
        fontWeight: '500',
    },
    summarySection: {
        marginBottom: 20,
    },
    summaryCard: {
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    summaryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    summaryTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 12,
    },
    summaryText: {
        fontSize: 16,
        lineHeight: 24,
        opacity: 0.8,
    },
    fixedActionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 20,
        paddingBottom: 30,
        backgroundColor: 'transparent',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 16,
        marginHorizontal: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    actionButtonText: {
        fontSize: 16,
        fontWeight: '700',
        marginLeft: 10,
    },
});

export default ReviewPlan; 