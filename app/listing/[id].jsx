import { GeneratePhoto } from "@/scripts/PhotoGenerator";
import {
  Feather,
  FontAwesome5,
  Ionicons
} from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme
} from "react-native";
import Animated, {
  SlideInDown,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";
import { useDestination } from "../../hooks/useDestinations";
import { useUser, useUserSavedItems } from "../../hooks/useUser";
import { Colors } from "./../../constants/Colors";

const { width } = Dimensions.get("window");
const IMG_HEIGHT = 400;

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
  }, [placeName]);

  if (isLoading) {
    return (
      <View style={[style, { backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#ccc" />
      </View>
    );
  }

  return (
    <Animated.Image
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

// Separate component for the main content with animations
const ListingContent = ({ listing, theme, styles, router }) => {
  const scrollRef = useAnimatedRef();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const { user, isAuthenticated } = useUser();
  const {
    saveTourPackage,
    removeSavedItem,
    checkIsTourPackageSaved,
    savedItems
  } = useUserSavedItems();

  const [isSaved, setIsSaved] = useState(false);
  const [savedItemId, setSavedItemId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Check if this tour is already saved
  useEffect(() => {
    const checkSavedStatus = async () => {
      if (isAuthenticated && listing) {
        try {
          const saved = await checkIsTourPackageSaved(user.uid, listing.id);
          setIsSaved(saved);

          // Find the saved item ID if it exists
          const savedItem = savedItems.find(item =>
            item.type === "tour_package" &&
            item.itemData.id === listing.id
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
  }, [isAuthenticated, listing, user, savedItems]);

  const handleSaveToggle = async () => {
    if (!isAuthenticated) {
      Alert.alert(
        "Login Required",
        "Please log in to save tour packages",
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
        Alert.alert("Removed", "Tour package removed from saved items");
      } else {
        // Save to saved items
        const newSavedItemId = await saveTourPackage(user.uid, listing);
        setIsSaved(true);
        setSavedItemId(newSavedItemId);
        Alert.alert("Saved", "Tour package saved to your collection");
      }
    } catch (error) {
      console.error("Error toggling save status:", error);
      Alert.alert("Error", "Failed to update saved status");
    } finally {
      setIsSaving(false);
    }
  };

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [2, 1, 1]
          ),
        },
      ],
    };
  });

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={20} color={theme.text} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSaveToggle}
          style={styles.bookmarkButton}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size={16} color={theme.text} />
          ) : (
            <Ionicons
              name={isSaved ? "bookmark" : "bookmark-outline"}
              size={20}
              color={isSaved ? theme.primary : theme.text}
            />
          )}
        </TouchableOpacity>

        <Animated.ScrollView
          ref={scrollRef}
          contentContainerStyle={{ paddingBottom: 150 }}
          showsVerticalScrollIndicator={false}
        >
          <AsyncImage
            placeName={listing.name}
            style={[styles.image, imageAnimatedStyle]}
            onError={(error) => {
              console.log(`Listing image load error:`, error.nativeEvent.error);
            }}
            onLoad={() => {
              console.log(`Listing image loaded successfully`);
            }}
          />
          <View style={styles.contentWrapper}>
            <Text style={styles.listingName}>{listing.name}</Text>

            <View style={styles.locationContainer}>
              <View style={styles.listingLocationWrapper}>
                <FontAwesome5
                  name="map-marker-alt"
                  size={18}
                  color={theme.primary}
                />
                <Text style={styles.listingLocationTxt}>
                  {listing.location}
                </Text>
              </View>
            </View>

            <View style={styles.highlightWrapper}>
              <View style={styles.highlightItem}>
                <View style={styles.highlightIcon}>
                  <Ionicons name="calendar" size={20} color={theme.primary} />
                </View>
                <Text style={styles.highlightTxt}>Departure</Text>
                <Text style={styles.highlightTxtVal}>{listing.departureDate}</Text>
              </View>
              <View style={styles.highlightItem}>
                <View style={styles.highlightIcon}>
                  <Ionicons name="calendar" size={20} color={theme.primary} />
                </View>
                <Text style={styles.highlightTxt}>End</Text>
                <Text style={styles.highlightTxtVal}>{listing.endingDate}</Text>
              </View>
              <View style={styles.highlightItem}>
                <View style={styles.highlightIcon}>
                  <Ionicons name="time" size={20} color={theme.primary} />
                </View>
                <Text style={styles.highlightTxt}>Duration</Text>
                <Text style={styles.highlightTxtVal}>{listing.duration} Days</Text>
              </View>
            </View>

            <View style={styles.highlightWrapper}>
              <View style={styles.highlightItem}>
                <View style={styles.highlightIcon}>
                  <FontAwesome5 name="map-marker-alt" size={20} color={theme.primary} />
                </View>
                <Text style={styles.highlightTxt}>Starting Point</Text>
                <Text style={styles.highlightTxtVal}>{listing.startingPoint}</Text>
              </View>
              <View style={styles.highlightItem}>
                <View style={styles.highlightIcon}>
                  <Ionicons name="star" size={20} color={theme.primary} />
                </View>
                <Text style={styles.highlightTxt}>Rating</Text>
                <Text style={styles.highlightTxtVal}>{listing.rating}</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>About This Destination</Text>
            <Text style={styles.listingDetails}>{listing.description}</Text>

            <Text style={styles.sectionTitle}>Itinerary</Text>
            <View style={styles.planDetailsContainer}>
              {listing.itinerary.map((step, idx) => {
                let typeIcon = "map-marker-alt";
                switch (step.type) {
                  case "hotel":
                    typeIcon = "hotel";
                    break;
                  case "food":
                    typeIcon = "utensils";
                    break;
                  case "tourist_spot":
                    typeIcon = "landmark";
                    break;
                  case "transport":
                    typeIcon = "bus";
                    break;
                  case "trek":
                    typeIcon = "hiking";
                    break;
                  case "shopping":
                    typeIcon = "shopping-bag";
                    break;
                  default:
                    typeIcon = "map-marker-alt";
                }
                return (
                  <View key={idx} style={styles.planDetailItem}>
                    <View style={styles.planDetailHeader}>
                      <View style={styles.planDetailIcon}>
                        <Ionicons name="navigate" size={18} color={theme.white} />
                      </View>
                      <Text style={styles.planDetailTitle}>{step.place}</Text>
                    </View>
                    <Text style={styles.planDetailLabel}>{step.time}</Text>
                    <Text style={styles.planDetailValue}>{step.description}</Text>
                    <View style={{ flexDirection: 'row', marginTop: 8, alignItems: 'center' }}>
                      <FontAwesome5 name="money-bill-wave" size={14} color={theme.primary} />
                      <Text style={{ marginLeft: 6, color: theme.text, fontSize: 13 }}>PKR {step.price}</Text>
                      <FontAwesome5 name={typeIcon} size={14} color={theme.primary} style={{ marginLeft: 16 }} />
                      <Text style={{ marginLeft: 6, color: theme.textSecondary, fontSize: 13 }}>{step.type.replace('_', ' ')}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </Animated.ScrollView>
      </View>

      <Animated.View style={styles.footer} entering={SlideInDown.delay(200)}>
        <TouchableOpacity
          onPress={() => { }}
          style={[styles.footerBtn, styles.footerBookBtn]}
        >
          <Text style={styles.footerBtnTxt}>Book Now</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { }} style={styles.footerBtn}>
          <Text style={styles.footerPriceTxt}>PKR {listing.price}</Text>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
};

const ListingDetails = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
  const { id } = useLocalSearchParams();
  const { destination: listing, loading, error } = useDestination(id);
  const router = useRouter();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    image: {
      width: width,
      height: IMG_HEIGHT,
    },
    contentWrapper: {
      padding: 20,
      backgroundColor: theme.background,
    },
    listingName: {
      fontSize: 28,
      fontWeight: "700",
      color: theme.text,
      letterSpacing: 0.5,
      lineHeight: 34,
      marginBottom: 12,
    },
    locationContainer: {
      backgroundColor: theme.backgroundSecondary,
      alignSelf: "flex-start",
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginBottom: 20,
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    listingLocationWrapper: {
      flexDirection: "row",
      alignItems: "center",
    },
    listingLocationTxt: {
      fontSize: 16,
      marginLeft: 8,
      color: theme.text,
      fontWeight: "500",
    },
    highlightWrapper: {
      flexDirection: "row",
      marginBottom: 30,
      justifyContent: "space-between",
    },
    highlightItem: {
      alignItems: "center",
      flex: 1,
    },
    highlightIcon: {
      backgroundColor: theme.backgroundSecondary,
      padding: 12,
      borderRadius: 16,
      marginBottom: 8,
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    highlightTxt: {
      fontSize: 12,
      color: theme.textTertiary,
      marginBottom: 4,
      fontWeight: "500",
    },
    highlightTxtVal: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.text,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: "700",
      marginVertical: 20,
      color: theme.text,
    },
    listingDetails: {
      fontSize: 16,
      color: theme.textSecondary,
      lineHeight: 26,
      letterSpacing: 0.3,
      marginBottom: 20,
    },
    planDetailsContainer: {
      marginBottom: 20,
    },
    planDetailItem: {
      backgroundColor: theme.backgroundSecondary,
      padding: 16,
      borderRadius: 16,
      marginBottom: 12,
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    planDetailHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    planDetailIcon: {
      backgroundColor: theme.primary,
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    planDetailTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.text,
    },
    planDetailContent: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    planDetailInfo: {
      alignItems: "center",
    },
    planDetailLabel: {
      fontSize: 12,
      color: theme.textTertiary,
      marginBottom: 4,
    },
    planDetailValue: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.text,
    },
    footer: {
      flexDirection: "row",
      position: "absolute",
      bottom: 0,
      padding: 20,
      paddingBottom: Platform.OS === 'ios' ? 40 : 30,
      width: width,
      backgroundColor: theme.background,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    footerBtn: {
      flex: 1,
      backgroundColor: theme.backgroundSecondary,
      padding: 16,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    footerBookBtn: {
      backgroundColor: theme.primary,
      marginRight: 8,
    },
    footerBtnTxt: {
      color: theme.white,
      fontSize: 16,
      fontWeight: "700",
    },
    footerPriceTxt: {
      color: theme.primary,
      fontSize: 18,
      fontWeight: "700",
    },
    backButton: {
      position: 'absolute',
      top: Platform.OS === 'android' ? 50 : 30,
      left: 20,
      zIndex: 10,
      backgroundColor: theme.background,
      opacity: 0.9,
      padding: 12,
      borderRadius: 20,
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
    },
    bookmarkButton: {
      position: 'absolute',
      top: Platform.OS === 'android' ? 50 : 30,
      right: 20,
      zIndex: 10,
      backgroundColor: theme.background,
      opacity: 0.9,
      padding: 12,
      borderRadius: 20,
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
    },
  });

  // Show loading state
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={20} color={theme.text} />
        </TouchableOpacity>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ marginTop: 16, fontSize: 16, color: theme.text }}>
          Loading destination details...
        </Text>
      </View>
    );
  }

  // Show error state
  if (error) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={20} color={theme.text} />
        </TouchableOpacity>
        <Ionicons name="alert-circle" size={48} color="red" />
        <Text style={{ marginTop: 16, fontSize: 16, color: 'red', textAlign: 'center' }}>
          {error === "Destination not found"
            ? "Destination not found"
            : `Error loading destination: ${error}`}
        </Text>
        <TouchableOpacity
          style={{ marginTop: 16, padding: 12, backgroundColor: theme.primary, borderRadius: 8 }}
          onPress={() => router.back()}
        >
          <Text style={{ color: 'white', fontWeight: '600' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Show not found state
  if (!listing) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={20} color={theme.text} />
        </TouchableOpacity>
        <Ionicons name="location-off" size={48} color={theme.textSecondary} />
        <Text style={{ marginTop: 16, fontSize: 18, color: theme.text, textAlign: 'center' }}>
          Destination not found
        </Text>
        <Text style={{ marginTop: 8, fontSize: 14, color: theme.textSecondary, textAlign: 'center' }}>
          The destination you&apos;re looking for doesn&apos;t exist or has been removed.
        </Text>
        <TouchableOpacity
          style={{ marginTop: 16, padding: 12, backgroundColor: theme.primary, borderRadius: 8 }}
          onPress={() => router.back()}
        >
          <Text style={{ color: 'white', fontWeight: '600' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Only render the animated content when we have valid listing data
  return <ListingContent listing={listing} theme={theme} styles={styles} router={router} />;
};

export default ListingDetails;

