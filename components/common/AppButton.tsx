// components/common/AppButton.tsx

import React from "react";
import { StyleSheet, View, ViewStyle, ActivityIndicator } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

// componenets
import { ThemedText } from "../themed-text";
import AppLoading from "./AppLoading";

// config
import { Colors } from "../../constants/Colors";
import { FontFamily } from "../../constants/font";

type AppButtonProps = {
  title: string;
  buttonColor?: string;
  onPress?: () => void;
  buttonStyle?: ViewStyle; // ✅ added to support custom styling
  loading?: boolean;
};

export default function AppButton({
  title,
  buttonColor = Colors.blacky, // fallback colors
  loading,
  buttonStyle,
}: AppButtonProps) {
  return (
    <View
      style={[styles.button, { backgroundColor: buttonColor }, buttonStyle]}
    >
      {!loading ? (
        <ThemedText type="button">{title}</ThemedText>
      ) : (
        <ActivityIndicator color={Colors.pureWhite} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: RFPercentage(5.7),
    borderRadius: RFPercentage(1),
    alignItems: "center",
    justifyContent: "center",
    marginTop: RFPercentage(1),
  },
  buttontext: {
    color: Colors.white,
    fontSize: RFPercentage(2.2),
    fontFamily: FontFamily.bold,
    marginBottom: RFPercentage(0.4),
  },
});
