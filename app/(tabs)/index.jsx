import { Ionicons } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import { DrawerActions } from "@react-navigation/native";
import { Stack, useNavigation } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";
import { useProfile } from "../../context/ProfileContext";
import { useDestinations } from '../../hooks/useDestinations';
import CategoryButtons from "./../../components/CategoryButtons";
import Listings from "./../../components/Listings";
import { Colors } from "./../../constants/Colors";
import destinationCategories from "./../../data/categories";

const HomePage = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
  const headerHeight = useHeaderHeight();
  const scrollViewRef = useRef(null);
  const sectionRefs = useRef({});
  const [searchText, setSearchText] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isProgrammaticScroll, setIsProgrammaticScroll] = useState(false);
  const { destinations, loading, error } = useDestinations();

  // Filter destinations based on search text only
  const filteredDestinations = React.useMemo(() => {
    if (!searchText.trim()) {
      return destinations; // Return all destinations when search is empty
    }

    return destinations.filter(destination => {
      return destination.name.toLowerCase().includes(searchText.toLowerCase()) ||
        destination.category.toLowerCase().includes(searchText.toLowerCase()) ||
        destination.description?.toLowerCase().includes(searchText.toLowerCase());
    });
  }, [destinations, searchText]);

  // Group destinations by category for display
  const groupedDestinations = React.useMemo(() => {
    const groups = {};

    // Always include "All" category with filtered destinations
    groups["All"] = filteredDestinations;

    // Group remaining destinations by category
    destinationCategories.forEach(cat => {
      const categoryItems = filteredDestinations.filter(item => item.category === cat.title);
      if (categoryItems.length > 0) {
        groups[cat.title] = categoryItems;
      }
    });

    return groups;
  }, [filteredDestinations]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    contentContainer: {
      paddingHorizontal: 20,
      paddingTop: 15,
    },
    welcomeSection: {
      marginBottom: 25,
    },
    greetingText: {
      fontSize: 16,
      color: theme.textSecondary,
      marginBottom: 5,
    },
    headingTxt: {
      fontSize: 32,
      fontWeight: "800",
      color: theme.text,
      marginBottom: 5,
      lineHeight: 38,
    },
    subtitleText: {
      fontSize: 16,
      color: theme.textTertiary,
      lineHeight: 22,
    },
    searchSection: {
      marginBottom: 25,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.backgroundSecondary,
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 12,
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    searchIcon: {
      marginRight: 12,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: theme.text,
      paddingVertical: 4,
    },
    filterButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
      marginLeft: 12,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
    },
    filterButtonText: {
      color: theme.white,
      fontSize: 14,
      fontWeight: "600",
    },
    categoriesSection: {
      marginBottom: 20,
    },
    stickyHeader: {
      backgroundColor: theme.background,
      paddingHorizontal: 5,
      paddingTop: 5
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorText: {
      fontSize: 18,
    },
  });

  const onCatChanged = (category) => {
    setActiveCategory(category);
    setIsProgrammaticScroll(true);

    const node = sectionRefs.current[category];
    if (node && scrollViewRef.current) {
      node.measure((x, y) => {
        scrollViewRef.current?.scrollTo({
          y: category === "All" ? y - 250 : y - headerHeight,
          animated: true,
        });

        setTimeout(() => {
          setIsProgrammaticScroll(false);
        }, 500);
      });
    }
  };

  const handleScroll = (event) => {
    if (isProgrammaticScroll) {
      return;
    }

    const scrollY = event.nativeEvent.contentOffset.y;
    const headerOffset = headerHeight + 200;

    const categories = ["All", ...destinationCategories.map(cat => cat.title)];

    for (let i = categories.length - 1; i >= 0; i--) {
      const category = categories[i];
      const node = sectionRefs.current[category];

      if (node) {
        node.measure((x, y) => {
          const sectionTop = y - headerOffset;
          const sectionBottom = sectionTop + 300;

          if (scrollY >= sectionTop && scrollY < sectionBottom) {
            if (activeCategory !== category) {
              setActiveCategory(category);
            }
          }
        });
      }
    }
  };

  return (
    <>
      <Header />
      <View style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: theme.error }]}>
              {error}
            </Text>
          </View>
        ) : (
          <ScrollView
            stickyHeaderIndices={[2]}
            ref={scrollViewRef}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
          >
            <View style={styles.welcomeSection}>
              <Text style={styles.greetingText}>Welcome back! 👋</Text>
              <Text style={styles.headingTxt}>Explore The Beauty of Pakistan!</Text>
              <Text style={styles.subtitleText}>
                Discover amazing destinations and plan your next adventure
              </Text>
            </View>

            <View style={styles.searchSection}>
              <SearchBar
                value={searchText}
                onChangeText={setSearchText}
                theme={theme}
              />
            </View>

            <View style={styles.stickyHeader}>
              <CategoryButtons
                onCategoryChanged={onCatChanged}
                activeCategory={activeCategory}
              />
            </View>

            {/* Show "All" category first */}
            <View style={styles.categoriesSection}>
              <View ref={(ref) => (sectionRefs.current["All"] = ref)}>
                <Listings listings={groupedDestinations["All"] || []} category="All" />
              </View>
            </View>

            {/* Show other categories */}
            {destinationCategories.map((cat, index) => {
              const categoryListings = groupedDestinations[cat.title];
              if (!categoryListings || categoryListings.length === 0) return null;

              return (
                <View
                  key={index}
                  style={styles.categoriesSection}
                  ref={(ref) => (sectionRefs.current[cat.title] = ref)}
                >
                  <Listings listings={categoryListings} category={cat.title} />
                </View>
              );
            })}
          </ScrollView>
        )}
      </View>
    </>
  );
};

export default HomePage;

const Header = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
  const { profileImage, DefaultProfileIcon } = useProfile();

  return (
    <Stack.Screen
      options={{
        headerTransparent: false,
        headerTitle: "",
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => {
              navigation.dispatch(DrawerActions.openDrawer());
            }}
            style={{
              marginLeft: 20,
              padding: 8,
              borderRadius: 12,
              shadowColor: theme.text,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: theme.primary,
                }}
              />
            ) : (
              <DefaultProfileIcon size={40} />
            )}
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity
            onPress={() => { }}
            style={{
              marginRight: 20,
              padding: 5,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: theme.primary,
              shadowColor: theme.text,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Ionicons name="notifications-outline" size={22} color={theme.primary} />
          </TouchableOpacity>
        ),
      }}
    />
  );
};

const SearchBar = ({ value, onChangeText, theme }) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <View style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.backgroundSecondary,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        shadowColor: theme.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}>
        <Ionicons
          name="search"
          size={20}
          style={{ marginRight: 12 }}
          color={theme.textTertiary}
        />
        <TextInput
          style={{
            flex: 1,
            fontSize: 16,
            color: theme.text,
            paddingVertical: 4,
          }}
          placeholder="Search destinations..."
          placeholderTextColor={theme.textTertiary}
          value={value}
          onChangeText={onChangeText}
        />
      </View>


    </View>
  );
};
