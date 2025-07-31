import Header from "@/components/LoginSignupComponents/Header";
import RegisterBody from "@/components/LoginSignupComponents/RegisterBody";
import { Colors } from "@/constants/Colors";
import React from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";

const Register = () => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"} // Works on both iOS & Android
      style={{ flex: 1, backgroundColor: Colors.background }}
    >

      <Header title="Register" />
      <View style={{ flex: 1.9, backgroundColor: Colors.background, top: 50 }}>

        <RegisterBody />
      </View>
    </KeyboardAvoidingView>
  );
};

export default Register;
