import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  useColorScheme
} from "react-native";
import { Colors } from "../constants/Colors";

const GroupListings = ({ listings }) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;

  const renderItem = ({ item }) => {
    return (
      <View style={[styles.item, { backgroundColor: theme.backgroundSecondary }]}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View>
          <Text style={[styles.itemTxt, { color: theme.text }]}>{item.name}</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="star" size={20} color={theme.primary} />
            <Text style={[styles.itemRating, { color: theme.text }]}>{item.rating}</Text>
            <Text style={[styles.itemReviews, { color: theme.textTertiary }]}>
              ({item.reviews})
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{ marginVertical: 20 }}>
      <Text style={[styles.title, { color: theme.text }]}>Top Travel Groups</Text>
      <FlatList
        data={listings}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default GroupListings;

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 10,
  },
  item: {
    padding: 10,
    borderRadius: 10,
    marginRight: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: 80,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  itemTxt: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  itemRating: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 5,
  },
  itemReviews: {
    fontSize: 14,
  },
});
