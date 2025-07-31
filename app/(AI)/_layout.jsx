import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { TripProvider } from "../../context/createTripContext";

const AiLayout = () => {
  useEffect(() => {
    // Disable header for index screen
    const disableHeader = () => {
      // This ensures header is hidden for the index screen
    };
    disableHeader();
  }, []);

  return (
    <TripProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
            title: "",
            presentation: "card",
          }}
        />
        <Stack.Screen
          name="aiChat"
          options={{
            headerShown: false,
            presentation: "card",
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="searchStartingPoint"
          options={{
            headerShown: false,
            presentation: "card",
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="searchDestination"
          options={{
            headerShown: false,
            presentation: "card",
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="whoIsTraveling"
          options={{
            headerShown: false,
            presentation: "card",
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="dateRangePicker"
          options={{
            headerShown: false,
            presentation: "card",
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="budgetSelector"
          options={{
            headerShown: false,
            presentation: "card",
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="reviewPlan"
          options={{
            headerShown: false,
            presentation: "card",
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="transportMode"
          options={{
            headerShown: false,
            presentation: "card",
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="aiGeneratedTour"
          options={{
            headerShown: false,
            presentation: "card",
            animation: "slide_from_right",
          }}
        />
      </Stack>
    </TripProvider>
  );
};

export default AiLayout;

