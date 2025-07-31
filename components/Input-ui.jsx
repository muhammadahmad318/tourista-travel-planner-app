import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

const InputUI = ({ Logo, placeholder, ...rem }) => {
  return (
    <View style={[styles.inputSection, { ...rem }]}>
      <View style={styles.inputLogo}>
        <Logo />
      </View>
      <Text style={styles.Separator}>|</Text>
      {/* <Text style={styles.placeHolderAnimate}>Username</Text> */}

      <TextInput
        inputMode="email"
        style={styles.inputTag}
        placeholder={placeholder}
      />
    </View>
  );
};

export default InputUI;

const styles = StyleSheet.create({
  inputSection: {
    display: "flex",
    flexDirection: "row",
    height: 45,
    borderRadius: 15,
    width: "80%",
    maxWidth: 250,
    marginVertical: 5,
  },
  inputTag: {
    backgroundColor: "rgb(104, 159, 255)",
    paddingLeft: 55,
    borderRadius: 15,
    width: "100%",
    zIndex: 1,
    color: "rgb(0,0,0)",
  },
  inputLogo: {
    position: "absolute",
    top: "20%",
    left: "5%",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  placeHolderAnimate: {
    position: "absolute",
    top: "26%",
    left: "22%",
  },
  Separator: {
    position: "absolute",
    top: "20%",
    left: "16%",
    fontSize: 20,
    zIndex: 2,
    color: "rgba(0, 0, 0, 0.55)",
  },
});
