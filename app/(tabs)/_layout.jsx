import { Ionicons } from "@expo/vector-icons";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Tabs, useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity, View, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Colors } from "../../constants/Colors";
import { ProfileProvider } from "../../context/ProfileContext";
import DrawerContent from "./../../components/DrawerContent";

const SideDrawer = () => {
  const Drawer = createDrawerNavigator();
  return (
    <ProfileProvider screenOptions={{ headerShown: false }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer.Navigator
          screenOptions={{ headerShown: false }}
          drawerContent={() => <DrawerContent />}
        >
          <Drawer.Screen name="Tabs" component={Layout} />
        </Drawer.Navigator>
      </GestureHandlerRootView>
    </ProfileProvider>
  );
};

const Layout = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.background }}>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: theme.background,
            borderTopWidth: 1,
            borderTopColor: theme.border,
            paddingTop: 8,
            paddingBottom: 8,
            height: 80,
            elevation: 0,
            shadowOpacity: 0,
          },
          tabBarShowLabel: true,
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.textTertiary,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
            marginTop: 4,
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            headerShown: true,
            tabBarLabel: "Explore",
            tabBarIcon: ({ color, focused }) => (
              <View style={{
                borderRadius: 12,
              }}>
                <Ionicons
                  name={focused ? "compass" : "compass-outline"}
                  size={24}
                  color={color}
                />
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="ai"
          options={{
            headerShown: false,
            tabBarLabel: "AI",
            tabBarButton: (props) => (
              <View style={{
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 20,
              }}>
                <TouchableOpacity
                  onPress={() => {
                    router.push("/(AI)");
                  }}
                  style={{
                    backgroundColor: theme.primary,
                    borderRadius: 25,
                    height: 50,
                    width: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    shadowColor: theme.primary,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8,
                    borderWidth: 3,
                    borderColor: theme.background,
                  }}
                >
                  <Ionicons name="sparkles" size={24} color={theme.white} />
                </TouchableOpacity>
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="saved"
          options={{
            headerShown: true,
            tabBarLabel: "My Trips",
            tabBarIcon: ({ color, focused }) => (
              <View style={{
                borderRadius: 12,
              }}>
                <Ionicons
                  name={focused ? "bookmarks" : "bookmark-outline"}
                  size={24}
                  color={color}
                />
              </View>
            ),
          }}
        />
      </Tabs>
    </GestureHandlerRootView>
  );
};

export default SideDrawer;
