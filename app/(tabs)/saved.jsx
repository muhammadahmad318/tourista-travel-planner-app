import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme
} from "react-native";
import { Colors } from "../../constants/Colors";
import { useTripContext } from '../../context/createTripContext';
import { useUser, useUserSavedItems } from "../../hooks/useUser";
import { GeneratePhoto } from '../../scripts/PhotoGenerator';

const Saved = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
  const { user, isAuthenticated } = useUser();
  const { savedItems, loading, error, fetchSavedItems, removeSavedItem } = useUserSavedItems();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { setTripData } = useTripContext();

  // Fetch saved items when component mounts
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchSavedItems(user.uid);
    }
  }, [isAuthenticated, user, fetchSavedItems]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      paddingTop: 60,
      paddingBottom: 30,
      paddingHorizontal: 20,
    },
    headerTitle: {
      fontSize: 32,
      fontWeight: "800",
      color: theme.text,
      marginBottom: 8,
    },
    headerSubtitle: {
      fontSize: 16,
      color: theme.textSecondary,
      lineHeight: 22,
    },
    categoryContainer: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    categoryButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginHorizontal: 4,
      borderRadius: 12,
      alignItems: 'center',
      borderWidth: 1,
    },
    categoryButtonActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    categoryButtonInactive: {
      backgroundColor: theme.backgroundSecondary,
      borderColor: theme.border,
    },
    categoryButtonText: {
      fontSize: 14,
      fontWeight: '600',
    },
    categoryButtonTextActive: {
      color: theme.white,
    },
    categoryButtonTextInactive: {
      color: theme.text,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 40,
    },
    emptyIcon: {
      backgroundColor: theme.backgroundSecondary,
      width: 120,
      height: 120,
      borderRadius: 60,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 30,
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 8,
    },
    emptyTitle: {
      fontSize: 24,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 12,
      textAlign: "center",
    },
    emptyDescription: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: "center",
      lineHeight: 24,
      marginBottom: 40,
    },
    exploreButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: 32,
      paddingVertical: 16,
      borderRadius: 16,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    exploreButtonText: {
      color: theme.white,
      fontSize: 16,
      fontWeight: "600",
    },
    savedItem: {
      backgroundColor: theme.backgroundSecondary,
      borderRadius: 16,
      marginHorizontal: 20,
      marginBottom: 16,
      overflow: 'hidden',
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    savedItemImage: {
      width: '100%',
      height: 200,
    },
    savedItemContent: {
      padding: 16,
    },
    savedItemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    savedItemTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.text,
      flex: 1,
      marginRight: 8,
    },
    savedItemType: {
      fontSize: 12,
      fontWeight: '500',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      overflow: 'hidden',
    },
    savedItemTypeAI: {
      backgroundColor: '#FF6B6B20',
      color: '#FF6B6B',
    },
    savedItemTypePackage: {
      backgroundColor: '#4ECDC420',
      color: '#4ECDC4',
    },
    savedItemLocation: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    savedItemPrice: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.primary,
      marginBottom: 12,
    },
    savedItemActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    actionButton: {
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginHorizontal: 4,
    },
    viewButton: {
      backgroundColor: theme.primary,
    },
    removeButton: {
      backgroundColor: theme.error,
    },
    actionButtonText: {
      fontSize: 12,
      fontWeight: '600',
    },
    viewButtonText: {
      color: theme.white,
    },
    removeButtonText: {
      color: theme.white,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  // Filter saved items by category
  const filteredItems = savedItems.filter(item => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'ai' && item.type === 'ai_generated_tour') return true;
    if (selectedCategory === 'packages' && item.type === 'tour_package') return true;
    return false;
  });

  const handleRemoveItem = async (itemId) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from your saved collection?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await removeSavedItem(itemId);
            } catch (error) {
              Alert.alert("Error", "Failed to remove item");
            }
          }
        }
      ]
    );
  };

  const handleViewItem = (item) => {
    if (item.type === 'tour_package') {
      router.push(`/listing/${item.itemData.id}`);
    } else if (item.type === 'ai_generated_tour') {
      // For AI-generated tours, we need to set the trip data in context
      // and navigate to the AI tour page
      const tripData = {
        tour_info: {
          destination_name: item.itemData.tour_info.destination_name,
          description: item.itemData.tour_info.description,
          dateRange: item.itemData.tour_info.dateRange,
          travel_type: item.itemData.tour_info.travel_type,
          mode_of_transport: item.itemData.tour_info.mode_of_transport
        }
      };
      // Set the trip data in context
      setTripData(tripData);
      // Navigate to the AI tour page
      router.push('/(AI)/aiGeneratedTour');
    }
  };

  // AsyncImage component to handle loading images from GeneratePhoto
  const AsyncImage = ({ placeName, style, onError, onLoad, fallbackUrl }) => {
    const [imageUrl, setImageUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
      const loadImage = async () => {
        try {
          setIsLoading(true);
          setHasError(false);

          // If we have a fallback URL (for tour packages), use it directly
          if (fallbackUrl) {
            setImageUrl(fallbackUrl);
            return;
          }

          // Try to get image from GeneratePhoto function for AI tours
          if (placeName) {
            const unsplashUrl = await GeneratePhoto(placeName);
            if (unsplashUrl) {
              setImageUrl(unsplashUrl);
            } else {
              setImageUrl('https://via.placeholder.com/400x200/CCCCCC/666666?text=Image+Not+Available');
            }
          } else {
            setImageUrl('https://via.placeholder.com/400x200/CCCCCC/666666?text=Image+Not+Available');
          }
        } catch (error) {
          console.error(`Error loading image for ${placeName}:`, error);
          setImageUrl('https://via.placeholder.com/400x200/CCCCCC/666666?text=Image+Not+Available');
          setHasError(true);
        } finally {
          setIsLoading(false);
        }
      };

      loadImage();
    }, [placeName, fallbackUrl]);

    if (isLoading) {
      return (
        <View style={[style, { backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="small" color="#ccc" />
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

  const renderSavedItem = ({ item }) => {
    const isAI = item.type === 'ai_generated_tour';
    const itemData = item.itemData;

    return (
      <View style={styles.savedItem}>
        <AsyncImage
          placeName={isAI ? itemData.tour_info.destination_name : null}
          fallbackUrl={isAI ? null : itemData.image}
          style={styles.savedItemImage}
          onError={(error) => {
            console.log(`Saved item image load error:`, error.nativeEvent.error);
          }}
          onLoad={() => {
            console.log(`Saved item image loaded successfully`);
          }}
        />
        <View style={styles.savedItemContent}>
          <View style={styles.savedItemHeader}>
            <Text style={styles.savedItemTitle} numberOfLines={2}>
              {isAI ? itemData.tour_info.destination_name : itemData.name}
            </Text>
            <Text style={[
              styles.savedItemType,
              isAI ? styles.savedItemTypeAI : styles.savedItemTypePackage
            ]}>
              {isAI ? 'AI Tour' : 'Package'}
            </Text>
          </View>

          <View style={styles.savedItemLocation}>
            <FontAwesome5 name="map-marker-alt" size={12} color={theme.textSecondary} />
            <Text style={{ marginLeft: 4 }}>
              {isAI ? itemData.tour_info.destination_name : itemData.location}
            </Text>
          </View>

          {!isAI && (
            <Text style={styles.savedItemPrice}>
              PKR {itemData.price?.toLocaleString() || 'N/A'}
            </Text>
          )}

          <View style={styles.savedItemActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.viewButton]}
              onPress={() => handleViewItem(item)}
            >
              <Text style={[styles.actionButtonText, styles.viewButtonText]}>View</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.removeButton]}
              onPress={() => handleRemoveItem(item.id)}
            >
              <Text style={[styles.actionButtonText, styles.removeButtonText]}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Ionicons name="lock-closed" size={48} color={theme.primary} />
          </View>
          <Text style={styles.emptyTitle}>Login Required</Text>
          <Text style={styles.emptyDescription}>
            Please log in to view your saved tours and packages
          </Text>
          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => router.push("/(LoginSignup)")}
          >
            <Text style={styles.exploreButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={{ marginTop: 16, fontSize: 16, color: theme.text }}>
            Loading your saved items...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Saved Items</Text>
          <Text style={styles.headerSubtitle}>
            Your favorite tour packages and AI-generated tours
          </Text>
        </View>

        {/* Category Filter */}
        <View style={styles.categoryContainer}>
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === 'all' ? styles.categoryButtonActive : styles.categoryButtonInactive
            ]}
            onPress={() => setSelectedCategory('all')}
          >
            <Text style={[
              styles.categoryButtonText,
              selectedCategory === 'all' ? styles.categoryButtonTextActive : styles.categoryButtonTextInactive
            ]}>
              All ({savedItems.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === 'packages' ? styles.categoryButtonActive : styles.categoryButtonInactive
            ]}
            onPress={() => setSelectedCategory('packages')}
          >
            <Text style={[
              styles.categoryButtonText,
              selectedCategory === 'packages' ? styles.categoryButtonTextActive : styles.categoryButtonTextInactive
            ]}>
              Packages ({savedItems.filter(item => item.type === 'tour_package').length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === 'ai' ? styles.categoryButtonActive : styles.categoryButtonInactive
            ]}
            onPress={() => setSelectedCategory('ai')}
          >
            <Text style={[
              styles.categoryButtonText,
              selectedCategory === 'ai' ? styles.categoryButtonTextActive : styles.categoryButtonTextInactive
            ]}>
              AI Tours ({savedItems.filter(item => item.type === 'ai_generated_tour').length})
            </Text>
          </TouchableOpacity>
        </View>

        {filteredItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Ionicons name="bookmark-outline" size={48} color={theme.primary} />
            </View>
            <Text style={styles.emptyTitle}>
              {selectedCategory === 'all' ? 'No saved items yet' :
                selectedCategory === 'packages' ? 'No saved tour packages' : 'No saved AI tours'}
            </Text>
            <Text style={styles.emptyDescription}>
              {selectedCategory === 'all' ?
                'Start exploring amazing destinations and save your favorites to plan your next adventure' :
                selectedCategory === 'packages' ?
                  'Browse our tour packages and save the ones you like' :
                  'Generate AI tours and save them for future reference'
              }
            </Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => router.push("/(tabs)/home")}
            >
              <Text style={styles.exploreButtonText}>Explore Destinations</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredItems}
            renderItem={renderSavedItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </>
  );
};

export default Saved;

