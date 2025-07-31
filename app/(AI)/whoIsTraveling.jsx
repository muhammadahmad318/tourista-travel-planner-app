import { FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { Colors } from "../../constants/Colors";
import { useTripContext } from "../../context/createTripContext";
import FloatingAIButton from "./../../components/FloatingAIButton";

const { height } = Dimensions.get("window");

const TRAVEL_OPTIONS = [
    {
        key: "solo",
        title: "Just Me",
        description: "A solo traveler",
        icon: <Ionicons name="person" size={32} />,
        defaultCount: 1,
        minCount: 1,
        maxCount: 1,
    },
    {
        key: "couple",
        title: "A Couple",
        description: "Two traveling together",
        icon: <MaterialCommunityIcons name="human-male-female" size={32} />,
        defaultCount: 2,
        minCount: 2,
        maxCount: 2,
    },
    {
        key: "family",
        title: "Family",
        description: "A group of family members",
        icon: <FontAwesome5 name="users" size={32} />,
        defaultCount: 4,
        minCount: 3,
        maxCount: 8,
    },
    {
        key: "friends",
        title: "Friends",
        description: "A group of friends",
        icon: <Ionicons name="people" size={32} />,
        defaultCount: 3,
        minCount: 2,
        maxCount: 10,
    },
];

const WhoIsTraveling = () => {
    const colorScheme = useColorScheme();
    const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
    const [selected, setSelected] = useState("solo");
    const [numberOfPersons, setNumberOfPersons] = useState(1);
    const router = useRouter();
    const { setTripData } = useTripContext();

    // Get current travel option
    const currentOption = TRAVEL_OPTIONS.find(option => option.key === selected);

    // Update number of persons when travel type changes
    useEffect(() => {
        if (currentOption) {
            setNumberOfPersons(currentOption.defaultCount);
        }
    }, [selected]);

    const handleBack = () => {
        router.back();
    };

    const handleNext = () => {
        // Update trip context with both traveler type and number of persons
        setTripData(prevData => ({
            ...prevData,
            tour_info: {
                ...prevData.tour_info,
                travel_type: selected,
                number_of_persons: numberOfPersons
            }
        }));

        // Navigate to date range picker
        router.push('/(AI)/dateRangePicker');
    };

    const incrementCount = () => {
        if (currentOption && numberOfPersons < currentOption.maxCount) {
            setNumberOfPersons(prev => prev + 1);
        }
    };

    const decrementCount = () => {
        if (currentOption && numberOfPersons > currentOption.minCount) {
            setNumberOfPersons(prev => prev - 1);
        }
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

            <Text style={[styles.header, { color: theme.text }]}>Who&apos;s Traveling</Text>
            <Text style={[styles.subHeader, { color: theme.textSecondary }]}>Choose your travelers</Text>

            {/* Display destination info if available */}


            <View style={styles.optionsColumn}>
                {TRAVEL_OPTIONS.map((option) => {
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
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Number of Persons Selector */}
            {currentOption && currentOption.maxCount > 1 && (
                <View style={[styles.numberSelectorContainer, { backgroundColor: theme.backgroundSecondary }]}>
                    <Text style={[styles.numberSelectorTitle, { color: theme.text }]}>Number of People</Text>
                    <View style={styles.numberSelectorRow}>
                        <TouchableOpacity
                            style={[
                                styles.numberButton,
                                {
                                    backgroundColor: numberOfPersons > currentOption.minCount ? theme.primary : theme.backgroundTertiary,
                                    opacity: numberOfPersons > currentOption.minCount ? 1 : 0.5,
                                }
                            ]}
                            onPress={decrementCount}
                            disabled={numberOfPersons <= currentOption.minCount}
                        >
                            <Ionicons
                                name="remove"
                                size={24}
                                color={numberOfPersons > currentOption.minCount ? theme.white : theme.textSecondary}
                            />
                        </TouchableOpacity>

                        <View style={[styles.numberDisplay, { backgroundColor: theme.background }]}>
                            <Text style={[styles.numberText, { color: theme.text }]}>{numberOfPersons}</Text>
                        </View>

                        <TouchableOpacity
                            style={[
                                styles.numberButton,
                                {
                                    backgroundColor: numberOfPersons < currentOption.maxCount ? theme.primary : theme.backgroundTertiary,
                                    opacity: numberOfPersons < currentOption.maxCount ? 1 : 0.5,
                                }
                            ]}
                            onPress={incrementCount}
                            disabled={numberOfPersons >= currentOption.maxCount}
                        >
                            <Ionicons
                                name="add"
                                size={24}
                                color={numberOfPersons < currentOption.maxCount ? theme.white : theme.textSecondary}
                            />
                        </TouchableOpacity>
                    </View>
                    <Text style={[styles.numberRangeText, { color: theme.textSecondary }]}>
                        {currentOption.minCount} - {currentOption.maxCount} people
                    </Text>
                </View>
            )}

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
                        Next
                    </Text>
                    <Ionicons name="arrow-forward-circle" size={22} color={theme.white} />
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
    optionsColumn: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        width: '100%',
        gap: 12,
        marginBottom: 20,
    },
    card: {
        width: '80%',
        maxWidth: 380,
        minHeight: (height - 400) / 4,
        borderRadius: 16,
        borderWidth: 2,
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingVertical: 8,
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
    numberSelectorContainer: {
        width: '80%',
        maxWidth: 380,
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    numberSelectorTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    numberSelectorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    numberButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    numberDisplay: {
        width: 80,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#e0e0e0',
    },
    numberText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    numberRangeText: {
        fontSize: 14,
        textAlign: 'center',
        opacity: 0.7,
    },
});

export default WhoIsTraveling; 