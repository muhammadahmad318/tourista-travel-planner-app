import { Colors } from "@/constants/Colors";
import { GeneratePhoto } from "@/scripts/PhotoGenerator";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme
} from "react-native";

const CARD_WIDTH = Dimensions.get('window').width * 0.7;
const CARD_HEIGHT = 280;
const IMAGE_HEIGHT = 160;

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

const Listings = ({ listings, category }) => {
  const [loading, setLoading] = useState(false);
  const [displayedListings, setDisplayedListings] = useState([]);
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
  const router = useRouter();

  useEffect(() => {
    if (listings && listings.length > 0) {
      setDisplayedListings(listings);
    }
  }, [listings]);

  useEffect(() => {
    if (category) {
      setLoading(true);
      // Use a small timeout to prevent flickering
      const timer = setTimeout(() => {
        setLoading(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [category]);

  const handleListingPress = (id) => {
    router.push({
      pathname: "/listing/[id]",
      params: { id }
    });
  };

  const renderItems = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => handleListingPress(item.id)}
        activeOpacity={0.7}
      >
        <View style={[styles.item, { backgroundColor: theme.backgroundSecondary }]}>
          <AsyncImage
            placeName={item.name}
            style={styles.image}
            onError={(error) => {
              console.log(`Listing image load error:`, error.nativeEvent.error);
            }}
            onLoad={() => {
              console.log(`Listing image loaded successfully`);
            }}
          />
          <View style={styles.itemRow}>
            <Text
              style={[styles.itemTxt, { color: theme.text }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.name}
            </Text>
            <Text style={[styles.itemPriceTxt, { color: theme.primary }]}>PKR {item.price}</Text>
          </View>
          <View style={styles.itemLocationRow}>
            <FontAwesome5
              name="map-marker-alt"
              size={16}
              color={theme.primary}
            />
            <Text style={[styles.itemLocationTxt, { color: theme.textSecondary }]} numberOfLines={1} ellipsizeMode="tail">
              {item.location}
            </Text>
          </View>
          <View style={styles.itemDurationRow}>
            <FontAwesome5
              name="clock"
              size={14}
              color={theme.textSecondary}
            />
            <Text style={[styles.itemDurationTxt, { color: theme.text }]} numberOfLines={1} ellipsizeMode="tail">
              {item.duration} days
            </Text>
          </View>
          <View style={styles.itemRatingRow}>
            <FontAwesome5
              name="star"
              solid
              size={14}
              color="#FFD700"
            />
            <Text style={styles.itemRatingTxt}>{item.rating}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return null; // Don't render anything while loading
  }

  return (
    <View>
      <Text
        style={{
          fontSize: category === "All" ? 30 : 22,
          fontWeight: "900",
          marginTop: 20,
          marginBottom: 10,
          marginLeft: 20,
          flex: 1,
          color: theme.text,
        }}
      >
        {category === "All" ? "Top Picks" : category}
      </Text>
      <FlatList
        data={displayedListings}
        renderItem={renderItems}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={3}
      />
    </View>
  );
};

export default Listings;

const styles = StyleSheet.create({
  item: {
    padding: 16,
    borderRadius: 14,
    marginRight: 20,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    backgroundColor: Colors.light.backgroundSecondary,
    justifyContent: 'flex-start',
  },
  image: {
    width: CARD_WIDTH - 20,
    height: IMAGE_HEIGHT,
    borderRadius: 10,
    marginBottom: 12,
    alignSelf: 'center',
    objectFit: 'cover',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  itemTxt: {
    fontSize: 17,
    fontWeight: "700",
    flex: 1,
    marginRight: 8,
    maxWidth: CARD_WIDTH - 80,
  },
  itemPriceTxt: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.light.primary,
    textAlign: 'right',
    minWidth: 60,
  },
  itemLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 4,
  },
  itemLocationTxt: {
    fontSize: 12,
    marginLeft: 5,
    color: Colors.light.textSecondary,
    maxWidth: CARD_WIDTH - 40,
  },
  itemDurationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  itemDurationTxt: {
    fontSize: 12,
    marginLeft: 5,
    maxWidth: CARD_WIDTH - 40,
  },
  itemRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  itemRatingTxt: {
    fontSize: 12,
    marginLeft: 5,
    color: Colors.light.text,
  },
});
