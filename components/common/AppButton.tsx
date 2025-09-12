// components/common/AppButton.tsx

import React from "react";
import { StyleSheet, View, ViewStyle, ActivityIndicator } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { LinearGradient } from "expo-linear-gradient";

// componenets
import { ThemedText } from "../themed-text";
import AppLoading from "./AppLoading";

// config
import { Colors } from "../../constants/Colors";
import { FontFamily } from "../../constants/font";
import { fontSize } from "@/constants/fontUtils";

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
    <LinearGradient
      colors={[Colors.lightBlue, Colors.blue]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.button, buttonStyle]}
    >
      {!loading ? (
        <ThemedText type="button" style={styles.buttontext}>
          {title}
        </ThemedText>
      ) : (
        <ActivityIndicator color={Colors.pureWhite} />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: fontSize(43),
    borderRadius: RFPercentage(1),
    alignItems: "center",
    justifyContent: "center",
    marginTop: RFPercentage(1),
  },
  buttontext: {
    color: Colors.white,
    fontSize: fontSize(16),
    fontFamily: FontFamily.medium,
    marginBottom: RFPercentage(0.4),
  },
});
