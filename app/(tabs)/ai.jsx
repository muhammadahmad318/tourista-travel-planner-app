import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View, useColorScheme } from "react-native";
import { Colors } from "../../constants/Colors";

const AI = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 40,
    },
    iconContainer: {
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
    title: {
      fontSize: 24,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 12,
      textAlign: "center",
    },
    description: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: "center",
      lineHeight: 24,
      marginBottom: 40,
    },
    aiButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: 32,
      paddingVertical: 16,
      borderRadius: 16,
      flexDirection: "row",
      alignItems: "center",
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    aiButtonText: {
      color: theme.white,
      fontSize: 16,
      fontWeight: "600",
      marginLeft: 8,
    },
  });

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Ionicons name="flash" size={48} color={theme.primary} />
        </View>
        <Text style={styles.title}>AI Assistant</Text>
        <Text style={styles.description}>
          Your AI travel companion is ready to help you plan the perfect trip.
          Get personalized recommendations and travel advice.
        </Text>
        <TouchableOpacity style={styles.aiButton}>
          <Ionicons name="chatbubble-ellipses" size={20} color={theme.white} />
          <Text style={styles.aiButtonText}>Start AI Chat</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default AI;
