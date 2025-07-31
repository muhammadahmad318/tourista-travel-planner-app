import { Colors } from "@/constants/Colors";
import { StyleSheet, Text, TouchableOpacity } from "react-native";


const ButtonUI = ({ onClick, name, color, ...remaining }) => {
  return (
    <TouchableOpacity
      onPress={onClick}
      style={[styles.container, { ...remaining }]}
    >
      <Text style={{ fontSize: 20, fontWeight: 900, color: color }}>{name}</Text>
    </TouchableOpacity>
  );
};

export default ButtonUI;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 3,
    maxWidth: 300
  },
});
