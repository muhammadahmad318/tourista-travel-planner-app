import { FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { Colors } from "../../constants/Colors";
import { useTripContext } from "../../context/createTripContext";
import FloatingAIButton from "./../../components/FloatingAIButton";

const { height } = Dimensions.get("window");

const BUDGET_OPTIONS = [
    {
        key: "cheap",
        title: "Cheap",
        description: "Budget-friendly travel",
        subText: "Affordable accommodations and activities",
        icon: <Ionicons name="wallet-outline" size={32} />,
    },
    {
        key: "moderate",
        title: "Moderate",
        description: "Balanced comfort and cost",
        subText: "Good value for money experiences",
        icon: <MaterialCommunityIcons name="cash-multiple" size={32} />,
    },
    {
        key: "luxury",
        title: "Luxury",
        description: "Premium travel experience",
        subText: "High-end accommodations and services",
        icon: <FontAwesome5 name="crown" size={32} />,
    },
];

const BudgetSelector = () => {
    const colorScheme = useColorScheme();
    const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
    const [selected, setSelected] = useState("moderate");
    const router = useRouter();
    const { tripData, setTripData } = useTripContext();

    const handleBack = () => {
        router.back();
    };

    const handleNext = () => {
        // Update trip context with budget selection
        setTripData(prevData => ({
            ...prevData,
            tour_info: {
                ...prevData.tour_info,
                budgetType: selected
            }
        }));

        // Navigate to the review plan page
        router.push('/(AI)/reviewPlan');
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Back Button - Absolute Position */}
            <TouchableOpacity
                onPress={handleBack}
                style={[styles.backButton, { backgroundColor: theme.backgroundSecondary }]}
            >
                <Ionicons name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>

            <Text style={[styles.header, { color: theme.text }]}>What&apos;s Your Budget?</Text>
            <Text style={[styles.subHeader, { color: theme.textSecondary }]}>Choose your spending preference</Text>

            {/* Trip Summary Card */}
            {(
                <View style={[styles.tripSummaryCard, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}>
                    {tripData.tour_info?.destination_name && (
                        <View style={styles.summaryRow}>
                            <Ionicons name="location" size={16} color={theme.primary} />
                            <Text style={[styles.summaryText, { color: theme.text }]}>
                                {tripData.tour_info.destination_name}
                            </Text>
                        </View>
                    )}
                    {tripData.tour_info?.travel_type && (
                        <View style={styles.summaryRow}>
                            <Ionicons name="people" size={16} color={theme.primary} />
                            <Text style={[styles.summaryText, { color: theme.text }]}>
                                {tripData.tour_info.travel_type === 'solo' ? 'Solo Traveler' :
                                    tripData.tour_info.travel_type === 'couple' ? 'Couple' :
                                        tripData.tour_info.travel_type === 'family' ? 'Family' : 'Friends'}
                            </Text>
                        </View>
                    )}
                    {tripData.tour_info?.dateRange && (
                        <View style={styles.summaryRow}>
                            <Ionicons name="calendar" size={16} color={theme.primary} />
                            <Text style={[styles.summaryText, { color: theme.text }]}>
                                {tripData.tour_info.dateRange.numberOfDays} day{tripData.tour_info.dateRange.numberOfDays !== 1 ? 's' : ''} trip
                            </Text>
                        </View>
                    )}
                </View>
            )}

            <View style={styles.optionsColumn}>
                {BUDGET_OPTIONS.map((option) => {
                    const isSelected = selected === option.key;
                    return (
                        <TouchableOpacity
                            key={option.key}
                            style={[
                                styles.card,
                                {
                                    backgroundColor: isSelected ? theme.primary : theme.backgroundSecondary,
                                    borderColor: isSelected ? theme.accent : theme.border,
                                },
                            ]}
                            activeOpacity={0.85}
                            onPress={() => setSelected(option.key)}
                        >
                            <View style={styles.cardRow}>
                                <View style={[styles.iconCircle, { backgroundColor: isSelected ? theme.accent : theme.backgroundTertiary }]}>
                                    {React.cloneElement(option.icon, { color: isSelected ? theme.white : theme.primary })}
                                </View>
                                <View style={styles.textColumn}>
                                    <Text style={[styles.cardTitle, { color: isSelected ? theme.white : theme.text }]}>{option.title}</Text>
                                    <Text style={[styles.cardDesc, { color: isSelected ? theme.white : theme.textSecondary }]}>{option.description}</Text>
                                    <Text style={[styles.cardSubText, { color: isSelected ? theme.white + 'CC' : theme.textTertiary }]}>{option.subText}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
            <View style={{ padding: 20, backgroundColor: theme.background }}>
                <TouchableOpacity
                    style={{
                        backgroundColor: selected ? theme.primary : theme.primary + '55',
                        minHeight: 44,
                        width: 320,
                        alignSelf: 'center',
                        borderRadius: 14,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row',
                        paddingHorizontal: 24,
                        paddingVertical: 10,
                        opacity: selected ? 1 : 0.7,
                        shadowColor: theme.primary,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: selected ? 0.18 : 0,
                        shadowRadius: 6,
                        elevation: selected ? 3 : 0,
                        marginTop: 8,
                    }}
                    disabled={!selected}
                    onPress={handleNext}
                >
                    <Text
                        style={{
                            color: theme.white,
                            fontWeight: 'bold',
                            fontSize: 18,
                            flexShrink: 1,
                            textAlign: 'center',
                            marginRight: 8,
                            flex: 0,
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        Review Budget
                    </Text>
                    <Ionicons name="eye" size={22} color={theme.white} />
                </TouchableOpacity>
            </View>
            <FloatingAIButton />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 48,
        paddingBottom: 12,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    tripSummaryCard: {
        width: '85%',
        maxWidth: 380,
        borderRadius: 12,
        borderWidth: 1,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    summaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    summaryText: {
        fontSize: 14,
        marginLeft: 8,
        flex: 1,
    },
    optionsColumn: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flex: 1,
        width: '100%',
        gap: 25,
        top: 30,
        marginBottom: 0,
    },
    card: {
        width: '80%',
        maxWidth: 380,
        minHeight: (height - 610) / 3,
        borderRadius: 16,
        borderWidth: 2,
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 0,
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    textColumn: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 2,
        textAlign: 'left',
    },
    cardDesc: {
        fontSize: 13,
        textAlign: 'left',
        opacity: 0.85,
        marginBottom: 2,
    },
    cardSubText: {
        fontSize: 11,
        textAlign: 'left',
        opacity: 0.7,
    },
    header: {
        fontSize: 25,
        fontWeight: "bold",
        marginBottom: 8,
        textAlign: "center",
        paddingTop: 30
    },
    subHeader: {
        fontSize: 16,
        marginBottom: 32,
        textAlign: "center",
        opacity: 0.8,
    },
    backButton: {
        position: 'absolute',
        top: 48,
        left: 20,
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
        zIndex: 10,
    },
});

export default BudgetSelector; 