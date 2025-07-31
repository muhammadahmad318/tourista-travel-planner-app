import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Platform, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useUser } from '../../hooks/useUser';
import { getUserTrips } from '../../utils/firestoreUtils';


const BookingsScreen = () => {
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
    const { user, isAuthenticated } = useUser();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchBookings = async () => {
            if (!isAuthenticated || !user) {
                setBookings([]);
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const trips = await getUserTrips(user.uid);
                setBookings(trips);
            } catch (err) {
                setError('Failed to load bookings.');
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, [isAuthenticated, user]);

    const renderBooking = ({ item }) => {
        const tour = item.tourPackage || {};
        return (
            <View style={[styles.card, { backgroundColor: theme.backgroundSecondary, shadowColor: theme.text }]}>
                <View style={styles.cardHeader}>
                    <Text style={[styles.tourName, { color: theme.primary }]}>{tour.name}</Text>
                    <View style={styles.statusBadge}>
                        <Text style={[styles.statusText, { color: theme.white }]}>{item.status || 'booked'}</Text>
                    </View>
                </View>
                <Text style={[styles.location, { color: theme.textSecondary }]}> <FontAwesome5 name="map-marker-alt" size={14} color={theme.primary} /> {tour.location}</Text>
                <View style={styles.row}>
                    <Ionicons name="calendar" size={16} color={theme.primary} />
                    <Text style={[styles.date, { color: theme.text }]}>{tour.departureDate} - {tour.endingDate}</Text>
                </View>
                <View style={styles.row}>
                    <FontAwesome5 name="money-bill-wave" size={16} color={theme.primary} />
                    <Text style={[styles.price, { color: theme.text }]}>PKR {tour.price}</Text>
                </View>
                <Text style={[styles.description, { color: theme.textSecondary }]} numberOfLines={2}>{tour.description}</Text>
            </View>
        );
    };

    if (!isAuthenticated) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
                <Ionicons name="lock-closed" size={48} color={theme.primary} />
                <Text style={{ color: theme.text, fontSize: 18, marginTop: 16 }}>Please log in to view your bookings.</Text>
                <TouchableOpacity style={[styles.loginBtn, { backgroundColor: theme.primary }]} onPress={() => router.push('/(LoginSignup)')}>
                    <Text style={{ color: theme.white, fontWeight: 'bold', fontSize: 16 }}>Login</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={theme.primary} />
                <Text style={{ color: theme.text, marginTop: 16 }}>Loading your bookings...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
                <Ionicons name="alert-circle" size={48} color={theme.red} />
                <Text style={{ color: theme.red, fontSize: 16, marginTop: 16 }}>{error}</Text>
                <TouchableOpacity style={[styles.loginBtn, { backgroundColor: theme.primary }]} onPress={() => router.back()}>
                    <Text style={{ color: theme.white, fontWeight: 'bold', fontSize: 16 }}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (bookings.length === 0) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
                <Ionicons name="information-circle" size={48} color={theme.textSecondary} />
                <Text style={{ color: theme.textSecondary, fontSize: 16, marginTop: 16 }}>No bookings found.</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>My Bookings</Text>
            </View>
            <FlatList
                data={bookings}
                keyExtractor={item => item.id}
                renderItem={renderBooking}
                contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: Platform.OS === 'android' ? 50 : 30,
        paddingBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: 'transparent',
    },
    backBtn: {
        marginRight: 16,
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    card: {
        borderRadius: 18,
        padding: 20,
        marginBottom: 18,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    tourName: {
        fontSize: 20,
        fontWeight: '700',
        flex: 1,
    },
    statusBadge: {
        backgroundColor: Colors.light.primary,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginLeft: 10,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },
    location: {
        fontSize: 15,
        marginBottom: 6,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    date: {
        fontSize: 14,
        marginLeft: 8,
    },
    price: {
        fontSize: 15,
        marginLeft: 8,
        fontWeight: '600',
    },
    description: {
        fontSize: 13,
        marginTop: 8,
    },
    loginBtn: {
        marginTop: 24,
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 8,
        alignItems: 'center',
    },
});

export default BookingsScreen; 