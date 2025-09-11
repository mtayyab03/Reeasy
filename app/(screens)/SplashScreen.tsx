import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

// constants
import { Colors } from "../../constants/Colors";
import { FontFamily } from "../../constants/font";
import icons from "../../constants/icons";
import { fontSize } from "@/constants/fontUtils";

export default function SplashScreen() {
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/LoginScreen"); // Adjust path based on file location in app directory
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <View style={styles.background}>
      <Image source={icons.logo} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>
        <Text style={[styles.title, { fontFamily: FontFamily.semiBold }]}>
          Finding
        </Text>
        {" Real Estate made easy."}
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  logo: {
    width: RFPercentage(20),
    height: RFPercentage(20),
    marginBottom: 40,
  },
  title: {
    fontSize: fontSize(24),
    fontFamily: FontFamily.light,
    color: Colors.pureBlack,
    textAlign: "center",
    lineHeight: 45,
  },
});
