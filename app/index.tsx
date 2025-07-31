import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Colors } from "../constants/Colors";

// -----------------------------------------------------------------------------
// Assets & Slide Content
// -----------------------------------------------------------------------------

// Static image imports for background slides
const backgroundImages = [
  require("../assets/images/background1.jpg"),
  require("../assets/images/background2.jpg"),
  require("../assets/images/background3.jpg"),
];

// Content for each slide (title & subtitle)
const slideContent = [
  {
    title: "Welcome to Tourista",
    subtitle: "Your one stop solution for all your travel needs",
  },
  {
    title: "Discover Places",
    subtitle: "Explore amazing destinations in Pakistan",
  },
  {
    title: "Plan Your Trip",
    subtitle: "Create unforgettable memories with our travel services",
  },
];

// -----------------------------------------------------------------------------
// Animated Slide Text Component
// -----------------------------------------------------------------------------

/**
 * AnimatedSlideText
 * Handles the animated appearance of the title and subtitle for each slide.
 */
const AnimatedSlideText = ({
  content,
  active,
  styles,
}: {
  content: any;
  active: any;
  styles: any;
}) => {
  // Animate opacity and vertical position
  const animatedStyle = useAnimatedStyle(
    () => ({
      opacity: withTiming(active ? 1 : 0, { duration: 400 }),
      transform: [
        { translateY: withTiming(active ? 0 : 20, { duration: 400 }) },
      ],
    }),
    [active]
  );

  return (
    <Animated.View
      style={[styles.textContainer, animatedStyle]}
      pointerEvents={active ? "auto" : "none"}
    >
      <Animated.Text
        style={[
          styles.welcomeText,
          {
            fontFamily: "Montserrat-SemiBold",
            letterSpacing: 1.2,
            textShadowColor: "rgba(0,0,0,0.2)",
            textShadowRadius: 4,
          },
        ]}
      >
        {content.title}
      </Animated.Text>
      <Animated.Text
        style={[styles.subtitleText, { fontFamily: "Roboto-Regular" }]}
      >
        {content.subtitle}
      </Animated.Text>
    </Animated.View>
  );
};

// -----------------------------------------------------------------------------
// Main Index Component
// -----------------------------------------------------------------------------

const Index = () => {
  // -------------------- State & Theme --------------------
  const windowWidth = Dimensions.get("window").width;
  const scrollViewRef = useRef<Animated.ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;

  const textProgress = useSharedValue(currentIndex);

  useEffect(() => {
    textProgress.value = currentIndex;
  }, [currentIndex, textProgress]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollViewRef.current) {
        const nextIndex = (currentIndex + 1) % 3;
        scrollViewRef.current.scrollTo({
          x: nextIndex * windowWidth,
          y: 0,
          animated: true,
        });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex, windowWidth]);

  // -------------------- Styles --------------------
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.dark.black,
      alignItems: "center",
      justifyContent: "center",
    },
    sliderContainer: {
      alignItems: "center",
      justifyContent: "center",
      margin: 20,
      position: "absolute",
      top: "10%",
      width: "100%",
    },
    textContainer: {
      position: "absolute",
      width: "100%",
      alignItems: "center",
      top: "10%",
    },
    welcomeText: {
      fontSize: 48,
      fontWeight: 900,
      marginBottom: 16,
      textAlign: "center",
      color: Colors.dark.primary,
      textShadowColor: "rgba(0, 0, 0, 0.3)",
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 3,
      letterSpacing: 0.5,
    },
    subtitleText: {
      fontSize: 23,
      color: Colors.dark.text,
      textAlign: "center",
      maxWidth: "80%",
      lineHeight: 28,
      letterSpacing: 0.3,
    },
    bottomContainer: {
      position: "absolute",
      bottom: 0,
      width: "100%",
      padding: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      paddingBottom: 100,
    },
    button: {
      backgroundColor: theme.primary,
      padding: 15,
      borderRadius: 10,
      width: "80%",
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      color: theme.white,
      fontSize: 20,
      fontWeight: "bold",
    },
    paginationContainer: {
      position: "absolute",
      bottom: 200,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
    },
    dot: {
      height: 8,
      borderRadius: 4,
      marginHorizontal: 4,
      width: 8,
    },
  });

  // -------------------------------------------------------------------------
  // Animated Pagination Dot
  // -------------------------------------------------------------------------
  const AnimatedDot = ({ isActive, theme }: { isActive: any; theme: any }) => {
    const progress = useSharedValue(0);
    useEffect(() => {
      progress.value = withTiming(isActive ? 1 : 0, { duration: 300 });
    }, [isActive, progress]);
    const animatedStyle = useAnimatedStyle(() => {
      const width = interpolate(progress.value, [0, 1], [8, 24]);
      return {
        width,
        backgroundColor: interpolateColor(
          progress.value,
          [0, 1],
          [theme.icon, theme.primary]
        ),
        opacity: interpolate(progress.value, [0, 1], [0.5, 1]),
        transform: [{ scale: interpolate(progress.value, [0, 1], [1, 1.2]) }],
      };
    });
    return <Animated.View style={[styles.dot, animatedStyle]} />;
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <View style={styles.container}>
      {/* Background Image Slider */}
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={{ width: "100%", height: "100%" }}
        onScroll={(event) => {
          const newIndex = Math.round(
            event.nativeEvent.contentOffset.x / windowWidth
          );
          if (newIndex !== currentIndex) {
            setCurrentIndex(newIndex);
          }
        }}
        scrollEventThrottle={16}
      >
        {backgroundImages.map((img, i) => (
          <Image
            key={i}
            source={img}
            style={{ width: windowWidth, height: "100%", opacity: 0.2 }}
            contentFit="cover"
          />
        ))}
      </Animated.ScrollView>

      {/* Pagination Dots */}
      <View style={styles.paginationContainer}>
        {[0, 1, 2].map((index) => (
          <AnimatedDot
            key={index}
            isActive={currentIndex === index}
            theme={theme}
          />
        ))}
      </View>

      {/* Animated Slide Texts */}
      <View style={styles.sliderContainer}>
        {slideContent.map((content, index) => (
          <AnimatedSlideText
            key={index}
            content={content}
            active={currentIndex === index}
            styles={styles}
          />
        ))}
      </View>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace("/(LoginSignup)")}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Index;
