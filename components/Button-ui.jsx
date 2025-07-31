import { Colors } from "@/constants/Colors";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";



const ButtonUI = ({ onClick, name, ...remaining }) => {
  return (
    <TouchableOpacity
      onPress={onClick}
      style={[styles.container, { ...remaining }]}
    >
      <Text>{name}</Text>
    </TouchableOpacity>
  );
};

export default ButtonUI;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.buttonBackground,
    borderColor: Colors.buttonRadius,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 3,
  },
});
