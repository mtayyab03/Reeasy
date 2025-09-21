import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

// Components
import Screen from "@/components/common/Screen";
import AppButton from "@/components/common/AppButton";
import { ThemedText } from "@/components/themed-text";

// constants
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/font";
import icons from "@/constants/icons";
import { fontSize } from "@/constants/fontUtils";

const OnBoarding = () => {
  const router = useRouter();
  const [step, setStep] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const onboardingData = [
    {
      image: icons.onb1,
      title: "Buy & Sell with Ease",
      description:
        "Discover your dream home or list your property in just a few clicks. Fast, secure, and hassle-free.",
    },
    {
      image: icons.onb2,
      title: "Smart Scheduling",
      description:
        "Book property showings instantly or set them for later—manage everything on your time.",
    },
  ];
  const handleNext = () => {
    if (step < onboardingData.length - 1) {
      setStep(step + 1);
    } else {
      router.replace("/Login/LoginScreen");
    }
  };
  return (
    <Screen style={styles.screen}>
      <TouchableOpacity
        onPress={() => router.push("/Login/LoginScreen")}
        style={{
          width: "90%",
          alignItems: "flex-end",
          marginTop: RFPercentage(1),
        }}
      >
        <ThemedText type="Black16Reg" style={{ fontFamily: FontFamily.medium }}>
          Skip
        </ThemedText>
      </TouchableOpacity>
      <Image
        style={{
          width: fontSize(270),
          height: fontSize(215),
          marginVertical: RFPercentage(7),
        }}
        source={onboardingData[step].image}
      />
      <Text
        style={{
          color: Colors.blacky,
          fontFamily: FontFamily.bold,
          fontSize: fontSize(23),
        }}
      >
        {onboardingData[step].title}
      </Text>

      <ThemedText
        type="Black16Reg"
        style={{
          fontFamily: FontFamily.medium,
          textAlign: "center",
          marginTop: RFPercentage(3),
          width: "85%",
          lineHeight: fontSize(24),
        }}
      >
        {onboardingData[step].description}
      </ThemedText>

      <View
        style={{
          width: "100%",
          position: "absolute",
          bottom: RFPercentage(7),
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: RFPercentage(1),
          }}
        >
          <View
            style={{
              width: RFPercentage(1.3),
              height: RFPercentage(1.3),
              borderRadius: RFPercentage(3),
              backgroundColor: step === 0 ? Colors.lightBlack : Colors.grey,
              marginRight: RFPercentage(1),
            }}
          />
          <View
            style={{
              width: RFPercentage(1.3),
              height: RFPercentage(1.3),
              borderRadius: RFPercentage(3),
              backgroundColor: step === 1 ? Colors.lightBlack : Colors.grey,
            }}
          />
        </View>
        <TouchableOpacity
          style={styles.loginbutton}
          activeOpacity={0.7}
          onPress={handleNext}
        >
          <AppButton
            title={"Next"}
            buttonColor={Colors.blue}
            loading={loading}
            buttonStyle={{ borderRadius: RFPercentage(5) }}
          />
        </TouchableOpacity>
      </View>
    </Screen>
  );
};

export default OnBoarding;
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
  },
});
