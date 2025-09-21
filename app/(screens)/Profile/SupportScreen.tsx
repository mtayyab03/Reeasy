import React, { useState } from "react";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

// constants
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/font";
import icons from "@/constants/icons";
import { fontSize } from "@/constants/fontUtils";

// Components
import Screen from "@/components/common/Screen";
import AppHeader from "@/components/common/AppHeader";
import TwoEndContainer from "@/components/Specific/TwoEndContainer";

const SupportScreen = () => {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  return (
    <Screen style={styles.screen}>
      <AppHeader title="Help & Support" onPress={() => handleBack()} />
      <View style={{ marginTop: RFPercentage(4) }} />
      <TwoEndContainer
        title="Email"
        subtitle="info@reeasy.app"
        icon={icons.mail}
      />
      <TwoEndContainer
        title="Website"
        subtitle="https://reeasy.com"
        icon={icons.web}
      />
    </Screen>
  );
};

export default SupportScreen;
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  loginbutton: {
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: RFPercentage(3),
    position: "absolute",
    bottom: RFPercentage(5),
  },
  logocontainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: RFPercentage(4),
    marginBottom: RFPercentage(4),
  },
  logo: {
    width: fontSize(100),
    height: fontSize(100),
  },
});
