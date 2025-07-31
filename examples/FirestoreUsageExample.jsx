import React, { useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Text, View } from 'react-native';
import { useDestinations } from '../hooks/useDestinations';
import { useUser, useUserFavorites } from '../hooks/useUser';


/**
 * Example component showing how to use Firestore instead of local data
 * This replaces the old pattern of importing destinations.json
 */

const FirestoreUsageExample = () => {
    const { destinations, loading: destinationsLoading, error: destinationsError } = useDestinations();
    const { user, userProfile, isAuthenticated } = useUser();
    const { favorites, addFavorite, removeFavorite } = useUserFavorites();

    const [selectedCategory, setSelectedCategory] = useState('All');

    // Handle category change
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        if (category === 'All') {
            // The useDestinations hook automatically fetches all destinations
        } else {
            // You can implement category filtering here
            // fetchDestinationsByCategory(category);
        }
    };

    // Handle favorite toggle
    const handleFavoriteToggle = async (destinationId) => {
        if (!isAuthenticated) {
            Alert.alert('Login Required', 'Please log in to add favorites');
            return;
        }

        try {
            const isFavorited = favorites.some(fav => fav.destinationId === destinationId);

            if (isFavorited) {
                await removeFavorite(user.uid, destinationId);
            } else {
                await addFavorite(user.uid, destinationId);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to update favorites');
            console.error('Favorite toggle error:', error);
        }
    };

    // Render destination item
    const renderDestinationItem = ({ item }) => {
        const isFavorited = favorites.some(fav => fav.destinationId === item.id);

        return (
            <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
                <Text style={{ fontSize: 14, color: '#666', marginTop: 4 }}>{item.description}</Text>
                <Text style={{ fontSize: 16, color: '#007AFF', marginTop: 8 }}>
                    ${item.price} • {item.duration} days
                </Text>

                {/* Favorite button */}
                <Text
                    style={{
                        color: isFavorited ? '#FF3B30' : '#007AFF',
                        marginTop: 8,
                        fontWeight: 'bold'
                    }}
                    onPress={() => handleFavoriteToggle(item.id)}
                >
                    {isFavorited ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
                </Text>
            </View>
        );
    };

    // Loading state
    if (destinationsLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={{ marginTop: 16 }}>Loading destinations...</Text>
            </View>
        );
    }

    // Error state
    if (destinationsError) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'red', textAlign: 'center' }}>
                    Error loading destinations: {destinationsError}
                </Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            {/* Header with user info */}
            {isAuthenticated && userProfile && (
                <View style={{ padding: 16, backgroundColor: '#f8f9fa' }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                        Welcome, {userProfile.displayName || user.email}!
                    </Text>
                    <Text style={{ fontSize: 14, color: '#666' }}>
                        You have {favorites.length} favorite destinations
                    </Text>
                </View>
            )}

            {/* Category filter (simplified) */}
            <View style={{ padding: 16, flexDirection: 'row' }}>
                {['All', 'Mountains', 'Cities', 'Beaches'].map((category) => (
                    <Text
                        key={category}
                        style={{
                            padding: 8,
                            marginRight: 8,
                            backgroundColor: selectedCategory === category ? '#007AFF' : '#f0f0f0',
                            color: selectedCategory === category ? 'white' : 'black',
                            borderRadius: 16,
                        }}
                        onPress={() => handleCategoryChange(category)}
                    >
                        {category}
                    </Text>
                ))}
            </View>

            {/* Destinations list */}
            <FlatList
                data={destinations}
                renderItem={renderDestinationItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={{ padding: 32, alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, color: '#666' }}>
                            No destinations found
                        </Text>
                    </View>
                }
            />
        </View>
    );
};

export default FirestoreUsageExample; 