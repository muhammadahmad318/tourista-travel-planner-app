import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { onAuthStateChanged, signOut } from 'firebase/auth';
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { useProfile } from '../context/ProfileContext';
import { auth } from '../firebaseConfig';

const DrawerContent = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const { profileImage, DefaultProfileIcon } = useProfile();

  const [userEmail, setUserEmail] = useState('Guest');
  const [userName, setUserName] = useState('Guest');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email || 'No Email');
        setUserName(user.displayName || user.email.split('@')[0] || 'Guest');
      } else {
        setUserEmail('Guest');
        setUserName('Guest');
      }
    });

    return () => unsubscribe();
  }, []);

  const menuItems = [
    { icon: "home", label: "Home", route: "/(tabs)" },
    { icon: "settings", label: "Settings", route: "/(DrawerPages)/settings" },
    { icon: "help-circle", label: "Help", route: "/(tabs)/help" },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out successfully!");
      router.replace('/(LoginSignup)');
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Failed to logout. Please try again.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        {profileImage ? (
          <Image
            source={{ uri: profileImage }}
            style={styles.profileImage}
          />
        ) : (
          <DefaultProfileIcon size={100} />
        )}
        <Text style={[styles.profileName, { color: theme.text }]}>
          {userName}
        </Text>
        <Text style={[styles.profileEmail, { color: theme.textSecondary }]}>
          {userEmail}
        </Text>
      </View>

      {/* Menu Items */}
      <View style={styles.menuItemsContainer}>
        {menuItems.map((item, index) => (
          <DrawerMenuItem
            key={index}
            icon={item.icon}
            label={item.label}
            onPress={() => router.push(item.route)}
            theme={theme}
          />
        ))}
      </View>

      {/* Spacer */}
      <View style={{ flex: 1 }} />

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out" size={24} color={Colors.light.white} />
        <Text style={[styles.logoutButtonText, { color: Colors.light.white }]}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DrawerContent;

const DrawerMenuItem = ({ icon, label, onPress, theme }) => {
  return (
    <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.cardBackground }]} onPress={onPress}>
      <Ionicons name={icon} size={22} color={theme.icon} style={styles.menuItemIcon} />
      <Text style={[styles.menuItemText, { color: theme.text }]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.light.border,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 14,
  },
  menuItemsContainer: {
    flexGrow: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  menuItemIcon: {
    marginRight: 15,
  },
  menuItemText: {
    fontSize: 18,
    fontWeight: "600",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.red,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  logoutButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
