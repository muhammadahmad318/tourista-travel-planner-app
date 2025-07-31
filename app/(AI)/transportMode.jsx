import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from "react-native";
import { Colors } from "../../constants/Colors";
import { useTripContext } from "../../context/createTripContext";

const TransportMode = () => {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
    const { setTripData } = useTripContext();

    const [selectedMode, setSelectedMode] = useState(null);

    const transportModes = [
        {
            id: "car",
            name: "Car",
            icon: "car-sport",
            description: "Drive yourself or rent a car",
            benefits: ["Flexible schedule", "Direct routes", "Privacy"],
            color: "#4CAF50"
        },
        {
            id: "bus",
            name: "Bus",
            icon: "bus",
            description: "Public or private bus service",
            benefits: ["Cost-effective", "No driving stress", "Scenic routes"],
            color: "#2196F3"
        },
        {
            id: "train",
            name: "Train",
            icon: "train",
            description: "Railway transportation",
            benefits: ["Fast & efficient", "Comfortable", "Reliable"],
            color: "#FF9800"
        }
    ];

    const handleModeSelection = (mode) => {
        setSelectedMode(mode);

        // Update trip data with selected transport mode
        setTripData(prevData => ({
            ...prevData,
            tour_info: {
                ...prevData.tour_info,
                mode_of_transport: mode.id
            }
        }));
    };

    const handleBack = () => {
        router.back();
    };

    const handleNext = () => {
        if (selectedMode) {
            router.push({
                pathname: '/(AI)/whoIsTraveling',
            });
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
            paddingTop: 0,
        },
        backButton: {
            position: 'absolute',
            top: 48,
            left: 20,
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: theme.backgroundSecondary,
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
            zIndex: 10,
        },
        content: {
            flex: 1,
            padding: 20,
            paddingTop: 80,
            justifyContent: 'space-between',
        },
        title: {
            fontSize: 24,
            fontWeight: "bold",
            color: theme.text,
            marginBottom: 8,
            textAlign: "center",
        },
        subtitle: {
            fontSize: 16,
            color: theme.textSecondary,
            marginBottom: 32,
            textAlign: "center",
        },
        modesContainer: {
            gap: 12,
        },
        modeCard: {
            backgroundColor: theme.backgroundSecondary,
            borderRadius: 16,
            padding: 16,
            borderWidth: 2,
            borderColor: "transparent",
            shadowColor: theme.text,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
        },
        selectedModeCard: {
            borderColor: theme.primary,
            backgroundColor: theme.primary + "10",
        },
        modeHeader: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 8,
        },
        modeIcon: {
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 12,
        },
        modeInfo: {
            flex: 1,
        },
        modeName: {
            fontSize: 16,
            fontWeight: "bold",
            color: theme.text,
            marginBottom: 2,
        },
        modeDescription: {
            fontSize: 13,
            color: theme.textSecondary,
        },
        benefitsContainer: {
            marginTop: 6,
        },
        benefitsTitle: {
            fontSize: 11,
            fontWeight: "600",
            color: theme.textTertiary,
            marginBottom: 4,
            textTransform: "uppercase",
        },
        benefitsList: {
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 6,
        },
        benefitTag: {
            backgroundColor: theme.backgroundTertiary,
            paddingHorizontal: 6,
            paddingVertical: 3,
            borderRadius: 10,
        },
        benefitText: {
            fontSize: 11,
            color: theme.textSecondary,
        },
        nextButton: {
            backgroundColor: selectedMode ? theme.primary : theme.primary + "55",
            minHeight: 56,
            width: "100%",
            borderRadius: 14,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            paddingHorizontal: 24,
            paddingVertical: 16,
            opacity: selectedMode ? 1 : 0.5,
            shadowColor: theme.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: selectedMode ? 0.25 : 0,
            shadowRadius: 8,
            elevation: selectedMode ? 5 : 0,
            borderWidth: selectedMode ? 0 : 1,
            borderColor: theme.border,
        },
        nextButtonText: {
            color: theme.white,
            fontWeight: "bold",
            fontSize: 18,
            marginRight: 8,
        },
        buttonContainer: {
            marginTop: 20,
        },
    });

    return (
        <View style={styles.container}>
            {/* Back Button - Absolute Position */}
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>

            {/* Content */}
            <View style={styles.content}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.title}>How will you travel?</Text>
                    <Text style={styles.subtitle}>
                        Choose your preferred mode of transportation
                    </Text>

                    <ScrollView
                        style={{ flex: 1 }}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    >
                        <View style={styles.modesContainer}>
                            {transportModes.map((mode) => (
                                <TouchableOpacity
                                    key={mode.id}
                                    style={[
                                        styles.modeCard,
                                        selectedMode?.id === mode.id && styles.selectedModeCard
                                    ]}
                                    onPress={() => handleModeSelection(mode)}
                                >
                                    <View style={styles.modeHeader}>
                                        <View style={[styles.modeIcon, { backgroundColor: mode.color + "20" }]}>
                                            <Ionicons name={mode.icon} size={24} color={mode.color} />
                                        </View>
                                        <View style={styles.modeInfo}>
                                            <Text style={styles.modeName}>{mode.name}</Text>
                                            <Text style={styles.modeDescription}>{mode.description}</Text>
                                        </View>
                                        {selectedMode?.id === mode.id && (
                                            <Ionicons name="checkmark-circle" size={24} color={theme.primary} />
                                        )}
                                    </View>

                                    <View style={styles.benefitsContainer}>
                                        <Text style={styles.benefitsTitle}>Benefits</Text>
                                        <View style={styles.benefitsList}>
                                            {mode.benefits.map((benefit, index) => (
                                                <View key={index} style={styles.benefitTag}>
                                                    <Text style={styles.benefitText}>{benefit}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </View>

                {/* Next Button - Fixed at bottom */}
                <View style={styles.buttonContainer}>
                    {selectedMode && (
                        <Text style={{
                            color: theme.textSecondary,
                            textAlign: 'center',
                            marginBottom: 10,
                            fontSize: 14
                        }}>
                            Selected: {selectedMode.name}
                        </Text>
                    )}
                    <TouchableOpacity
                        style={styles.nextButton}
                        disabled={!selectedMode}
                        onPress={handleNext}
                    >
                        <Text style={styles.nextButtonText}>
                            {selectedMode ? 'Continue' : 'Select a transport mode'}
                        </Text>
                        {selectedMode && (
                            <Ionicons name="arrow-forward-circle" size={22} color={theme.white} />
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default TransportMode; 