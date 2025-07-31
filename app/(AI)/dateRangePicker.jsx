import { Ionicons } from "@expo/vector-icons";
import { format } from 'date-fns';
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, useColorScheme } from "react-native";
import CalendarPicker from 'react-native-calendar-picker';
import { Colors } from "../../constants/Colors";
import { useTripContext } from "../../context/createTripContext";
import FloatingAIButton from "./../../components/FloatingAIButton";

const DateRangePicker = () => {
    const colorScheme = useColorScheme();
    const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
    const router = useRouter();
    const { setTripData } = useTripContext();

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const handleDateChange = (date, type) => {
        if (type === 'END_DATE') {
            setEndDate(date);
        } else {
            setStartDate(date);
            setEndDate(null);
        }
    };

    const handleBack = () => {
        router.back();
    };

    const handleNext = () => {
        if (startDate && endDate) {
            // Update trip context with date range - merge with existing data
            setTripData(prevData => ({
                ...prevData,
                tour_info: {
                    ...prevData.tour_info,
                    dateRange: {
                        startDate: startDate.toISOString(),
                        endDate: endDate.toISOString(),
                        numberOfDays: getNumberOfDays()
                    }
                }
            }));

            // Navigate to budget selector
            router.push('/(AI)/budgetSelector');
        }
    };

    const formatDate = (date) => {
        if (!date) return '';
        return format(date, 'MMM dd, yyyy');
    };

    const getDateRangeText = () => {
        if (!startDate) return 'Select start date';
        if (!endDate) return 'Select end date';
        return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    };

    const getNumberOfDays = () => {
        if (!startDate || !endDate) return 0;
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays + 1; // Include both start and end dates
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

            {/* Content */}
            <View style={styles.content}>
                <Text style={[styles.title, { color: theme.text }]}>When are you traveling?</Text>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                    Choose your travel dates
                </Text>

                {/* Selected Date Range Display */}
                <View style={[styles.dateRangeContainer, { backgroundColor: theme.backgroundSecondary }]}>
                    <Ionicons name="calendar" size={20} color={theme.primary} />
                    <Text style={[styles.dateRangeText, { color: theme.text }]}>
                        {getDateRangeText()}
                    </Text>
                    {startDate && endDate && (
                        <Text style={[styles.daysText, { color: theme.textSecondary }]}>
                            {getNumberOfDays()} day{getNumberOfDays() !== 1 ? 's' : ''}
                        </Text>
                    )}
                </View>

                {/* Calendar */}
                <View style={[styles.calendarContainer, { backgroundColor: theme.backgroundSecondary }]}>
                    <CalendarPicker
                        onDateChange={handleDateChange}
                        startDate={startDate}
                        endDate={endDate}
                        allowRangeSelection={true}
                        minDate={new Date()}
                        maxDate={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)} // 1 year from now
                        selectedDayColor={theme.primary}
                        selectedDayTextColor={theme.white}
                        todayBackgroundColor={theme.accent}
                        todayTextStyle={{ color: theme.white }}
                        textStyle={{ color: theme.text }}
                        previousTitle="Previous"
                        nextTitle="Next"
                        previousTitleStyle={{ color: theme.primary }}
                        nextTitleStyle={{ color: theme.primary }}
                        monthTitleStyle={{ color: theme.text, fontWeight: 'bold' }}
                        yearTitleStyle={{ color: theme.text, fontWeight: 'bold' }}
                        dayLabels={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
                        dayShape="circle"
                        width={340}
                        customDatesStyles={[
                            {
                                date: startDate,
                                style: { backgroundColor: theme.primary },
                                textStyle: { color: theme.white },
                            },
                            {
                                date: endDate,
                                style: { backgroundColor: theme.primary },
                                textStyle: { color: theme.white },
                            },
                        ]}
                    />
                </View>
            </View>

            {/* Next Button */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[
                        styles.nextButton,
                        {
                            backgroundColor: startDate && endDate ? theme.primary : theme.primary + '55',
                            opacity: startDate && endDate ? 1 : 0.7,
                        }
                    ]}
                    disabled={!startDate || !endDate}
                    onPress={handleNext}
                >
                    <Text style={[styles.nextButtonText, { color: theme.white }]}>
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
        paddingTop: 80,

    },
    backButton: {
        position: 'absolute',
        top: 60,
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
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    title: {
        fontSize: 25,
        fontWeight: "bold",
        marginBottom: 8,
        textAlign: "center",
        paddingLeft: 15

    },
    subtitle: {
        fontSize: 16,
        marginBottom: 32,
        textAlign: "center",
        opacity: 0.8,
    },
    dateRangeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    dateRangeText: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 12,
        flex: 1,
    },
    daysText: {
        fontSize: 14,
        marginLeft: 8,
    },
    calendarContainer: {
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    buttonContainer: {
        padding: 20,
        backgroundColor: 'transparent',
    },
    nextButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 14,
        minHeight: 48,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.18,
        shadowRadius: 6,
        elevation: 3,
    },
    nextButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 8,
    },
});

export default DateRangePicker; 