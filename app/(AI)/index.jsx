import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming
} from "react-native-reanimated";
import { Colors } from "../../constants/Colors";
import { useTripContext } from "../../context/createTripContext";
import FloatingAIButton from "./../../components/FloatingAIButton";

const { width, height } = Dimensions.get("window");

const AI = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
  const [isNavigating, setIsNavigating] = useState(false);
  const { tripData, resetTripData } = useTripContext();

  // Animation values
  const fadeIn = useSharedValue(0);
  const slideIn = useSharedValue(50);
  const scale = useSharedValue(0.8);
  const pulse = useSharedValue(1);
  const iconRotation = useSharedValue(0);

  useEffect(() => {
    // Staggered animations
    fadeIn.value = withTiming(1, { duration: 1000 });
    slideIn.value = withSpring(0, { damping: 15, stiffness: 100 });
    scale.value = withSpring(1, { damping: 15, stiffness: 100 });

    // Continuous pulse animation for the button
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );

    // Icon rotation animation
    iconRotation.value = withRepeat(
      withTiming(360, { duration: 3000 }),
      -1,
      false
    );
  }, []);

  const fadeInStyle = useAnimatedStyle(() => ({
    opacity: fadeIn.value,
  }));

  const slideInStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slideIn.value }],
  }));

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${iconRotation.value}deg` }],
  }));

  const handleGetStarted = () => {
    if (isNavigating) return; // Prevent multiple rapid presses

    setIsNavigating(true);
    router.push("/(AI)/searchStartingPoint");

    // Reset navigation state after a short delay
    setTimeout(() => setIsNavigating(false), 500);
  };

  const handleBackToTabs = () => {
    // Always navigate back to the tabs layout
    router.replace("/(tabs)");
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContainer: {
      flexGrow: 1,
      paddingHorizontal: 20,
      paddingTop: 60,
      paddingBottom: 40,
    },
    header: {
      alignItems: "center",
      marginBottom: 40,
    },
    iconContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: theme.backgroundSecondary,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
      shadowColor: theme.text,
      shadowOffset: {
        width: 0,
        height: 10,
      },
      shadowOpacity: 0.2,
      shadowRadius: 20,
      elevation: 10,
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      color: theme.text,
      textAlign: "center",
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: "center",
      fontWeight: "500",
    },
    tripSummaryContainer: {
      marginBottom: 30,
    },
    tripSummaryTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.text,
      textAlign: "center",
      marginBottom: 15,
    },
    tripSummaryCard: {
      backgroundColor: theme.backgroundSecondary,
      borderRadius: 16,
      padding: 20,
      shadowColor: theme.text,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    tripSummaryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    tripSummaryText: {
      fontSize: 14,
      color: theme.text,
      marginLeft: 12,
      flex: 1,
    },
    tripSummaryActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 15,
    },
    tripActionButton: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
      marginHorizontal: 5,
      alignItems: 'center',
    },
    tripActionText: {
      fontSize: 14,
      fontWeight: '600',
    },
    featuresContainer: {
      marginBottom: 40,
    },
    featuresTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.text,
      textAlign: "center",
      marginBottom: 25,
    },
    featureItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.backgroundSecondary,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      shadowColor: theme.text,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    featureIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.primary + '20',
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    featureText: {
      flex: 1,
    },
    featureTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 4,
    },
    featureDescription: {
      fontSize: 14,
      color: theme.textSecondary,
      lineHeight: 20,
    },
    buttonContainer: {
      alignItems: "center",
      marginBottom: 30,
    },
    getStartedButton: {
      width: width - 40,
      borderRadius: 25,
      shadowColor: theme.primary,
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 10,
    },
    getStartedText: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.white,
      textAlign: "center",
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      position: 'absolute',
      top: 60,
      left: 20,
      zIndex: 1000,
    },
  });

  return (
    <View style={styles.container}>
      {/* Floating Back Button */}
      <TouchableOpacity
        onPress={handleBackToTabs}
        style={[styles.backButton, { backgroundColor: theme.backgroundSecondary }]}
      >
        <Ionicons name="arrow-back" size={24} color={theme.text} />
      </TouchableOpacity>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.header, fadeInStyle, slideInStyle]}>
          <Animated.View style={[styles.iconContainer, scaleStyle]}>
            <Animated.View style={iconStyle}>
              <Ionicons name="sparkles" size={50} color={theme.primary} />
            </Animated.View>
          </Animated.View>
          <Text style={styles.title}>Tourista AI</Text>
          <Text style={styles.subtitle}>Your AI Travel Companion</Text>
        </Animated.View>

        <Animated.View style={[styles.featuresContainer, fadeInStyle, slideInStyle]}>
          <Text style={styles.featuresTitle}>What You Can Do</Text>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="search" size={24} color={theme.primary} />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Find Destinations</Text>
              <Text style={styles.featureDescription}>
                Discover amazing places to visit with AI-powered recommendations
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="calendar" size={24} color={theme.primary} />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Plan Your Trip</Text>
              <Text style={styles.featureDescription}>
                Get personalized itineraries based on your preferences and budget
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="chatbubbles" size={24} color={theme.primary} />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>AI Travel Assistant</Text>
              <Text style={styles.featureDescription}>
                Chat with our AI to get instant travel advice and recommendations
              </Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={[styles.buttonContainer, fadeInStyle]}>
          <Animated.View style={pulseStyle}>
            <TouchableOpacity
              style={styles.getStartedButton}
              onPress={handleGetStarted}
              disabled={isNavigating}
              activeOpacity={0.8}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <LinearGradient
                colors={[theme.primary, theme.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  borderRadius: 25,
                  paddingVertical: 16,
                  paddingHorizontal: 32,
                }}
              >
                <Text style={styles.getStartedText}>
                  {isNavigating ? "Loading..." : "Get Started"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </ScrollView>
      <FloatingAIButton />
    </View>
  );
};

export default AI;
