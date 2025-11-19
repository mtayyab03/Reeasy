import React, { useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  Alert,
  TextInput,
  Image,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { AntDesign, Ionicons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// Components
import Screen from "@/components/common/Screen";
import AppButton from "@/components/common/AppButton";

// apis
import apiClient from "@/app/apis/apiClient";

// constants
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/font";
import icons from "@/constants/icons";
import { fontSize } from "@/constants/fontUtils";

export default function ForgetPassword() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const onChangeEmail = (text: string) => {
    setEmail(text.toLowerCase());
  };

  const handleForgetEmail = async () => {
    if (!email) {
      Alert.alert("Alert", "Please Provide your Email");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Alert", "Invalid email format");
      return;
    }

    try {
      setLoading(true);
      console.log("🔹 Sending forgot password request:", email);

      const response = await apiClient.post("/api/auth/password/forgot", {
        email,
      });

      console.log("🔹 API Response:", response.data);

      if (response.status === 200 || response.status === 201) {
        Alert.alert(
          "Success",
          response.data.message || "OTP sent to email successfully."
        );

        router.push({
          pathname: "/(screens)/Login/OTPScreen",
          params: { email, type: "forget" },
        });
      } else {
        Alert.alert(
          "Failed",
          response.data.message || "Unable to send OTP right now."
        );
      }
    } catch (error: any) {
      console.log("❌ Forgot Password Error:", error.response || error.message);

      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false); // ✅ Stop loading
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Screen style={styles.screen}>
      {/* arrow icon */}
      <View style={styles.arrowContainer}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.iconCircle}
          onPress={handleBack}
        >
          <Feather name="arrow-left" size={24} color={Colors.blacky} />
        </TouchableOpacity>
      </View>

      {/* text */}

      <View style={styles.logocontainer}>
        <Image
          style={{ width: fontSize(66), height: fontSize(82) }}
          source={icons.logox}
        />
        <Text
          style={{
            color: Colors.blacky,
            fontFamily: FontFamily.semiBold,
            fontSize: fontSize(23),
            marginTop: RFPercentage(1.5),
          }}
        >
          Forgot Password?
        </Text>
        <View style={{ width: "70%" }}>
          <Text
            style={{
              textAlign: "center",
              marginTop: RFPercentage(1),
              color: Colors.grey,
              fontFamily: FontFamily.regular,
              fontSize: RFPercentage(1.3),
            }}
          >
            Enter your registered email and we’ll send you a verification code
            to reset your password.
          </Text>
        </View>
      </View>

      {/* email address field */}
      <View style={{ marginTop: RFPercentage(5) }} />
      <View style={styles.emailmain}>
        <Ionicons
          color={Colors.grey}
          style={{ marginRight: RFPercentage(2) }}
          size={RFPercentage(3)}
          name={"mail"}
        />
        <TextInput
          style={styles.input}
          keyboardType="email-address"
          onChangeText={onChangeEmail}
          autoCapitalize="none"
          value={email}
          placeholder="Email Address"
          placeholderTextColor={Colors.grey}
        />
      </View>

      {/* button */}
      <TouchableOpacity
        style={styles.loginbutton}
        activeOpacity={0.7}
        onPress={handleForgetEmail}
      >
        <AppButton
          title="Send Code"
          buttonColor={Colors.blue}
          loading={loading}
        />
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  arrowContainer: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    marginTop: RFPercentage(2),
  },
  loginbutton: {
    width: "90%",
    marginTop: RFPercentage(5),
  },
  iconCircle: {
    width: RFPercentage(5),
    height: RFPercentage(5),
    borderRadius: RFPercentage(3),
    borderWidth: RFPercentage(0.1),
    borderColor: Colors.stroke,
    alignItems: "center",
    justifyContent: "center",
  },
  logocontainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  emailmain: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    height: RFPercentage(7),
    borderBottomWidth: RFPercentage(0.2),
    borderBottomColor: Colors.blue,
    color: Colors.blacky,
    paddingLeft: RFPercentage(1.5),
    borderRadius: RFPercentage(1),
  },
  input: {
    width: "70%",
    fontFamily: FontFamily.regular,
    color: Colors.lightBlack,
    fontSize: RFPercentage(2),
  },
});
