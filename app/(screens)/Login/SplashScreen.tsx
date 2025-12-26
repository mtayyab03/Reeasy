import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useDispatch, useSelector } from "react-redux";

// redux
import { AppDispatch } from "@/app/redux/store";
import { loadTokens, selectAccessToken } from "@/app/redux/features/authSlice";

// constants
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/font";
import icons from "@/constants/icons";
import { fontSize } from "@/constants/fontUtils";

export default function SplashScreen() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const accessToken = useSelector(selectAccessToken);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      await dispatch(loadTokens());
      setLoading(false);
    };

    checkToken();
  }, [dispatch]);

  useEffect(() => {
    if (!loading) {
      if (
        accessToken &&
        accessToken !== "null" &&
        accessToken !== "undefined"
      ) {
        router.replace("/(tabs)/Home");
      } else {
        router.replace("/Login/LoginScreen");
      }
    }
  }, [loading, accessToken]);

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
