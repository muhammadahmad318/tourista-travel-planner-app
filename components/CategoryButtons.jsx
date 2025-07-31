import { Colors } from "@/constants/Colors";
import destinationCategories from "@/data/categories";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme
} from "react-native";

const CategoryButtons = ({ onCategoryChanged, activeCategory }) => {
  const scrollRef = useRef(null);
  const itemRef = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;

  // Create categories array with "All" at the beginning
  const allCategories = [
    { title: "All", iconName: "view-grid" },
    ...destinationCategories
  ];

  useEffect(() => {
    const index = allCategories.findIndex(
      (cat) => cat.title === activeCategory
    );
    if (index !== -1 && index !== activeIndex) {
      setActiveIndex(index);
      const selected = itemRef.current[index];
      selected?.measure((x) => {
        scrollRef.current?.scrollTo({ x: x, y: 0, animated: true });
      });
    }
  }, [activeCategory, activeIndex]);

  const handleSelectCategory = (index) => {
    const selected = itemRef.current[index];
    setActiveIndex(index);

    selected?.measure((x) => {
      scrollRef.current?.scrollTo({ x: x, y: 0, animated: true });
    });

    onCategoryChanged(allCategories[index].title);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.background,
        bottom: 1,
      }}
    >
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: 20,
          paddingVertical: 10,
          marginBottom: 10,
        }}
      >
        {allCategories.map((item, index) => (
          <TouchableOpacity
            key={index}
            ref={(el) => (itemRef.current[index] = el)}
            onPress={() => handleSelectCategory(index)}
            style={[
              styles.categoryBtn,
              {
                backgroundColor: activeIndex === index
                  ? theme.primary
                  : colorScheme === 'dark'
                    ? theme.backgroundTertiary
                    : theme.backgroundSecondary,
                borderColor: activeIndex === index
                  ? theme.primary
                  : theme.border,
                borderWidth: 1,
              }
            ]}
          >
            <MaterialCommunityIcons
              name={item.iconName}
              size={20}
              color={activeIndex === index
                ? theme.background
                : colorScheme === 'dark'
                  ? theme.textSecondary
                  : theme.text}
            />
            <Text
              style={[
                styles.categoryBtnTxt,
                {
                  color: activeIndex === index
                    ? theme.background
                    : colorScheme === 'dark'
                      ? theme.textSecondary
                      : theme.text
                }
              ]}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default CategoryButtons;

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  categoryBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  categoryBtnTxt: {
    marginLeft: 5,
  },
});
