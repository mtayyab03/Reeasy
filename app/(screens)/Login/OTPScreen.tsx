import React, { useState, useRef } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  Image,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  TextInput,
  Alert,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Feather } from "@expo/vector-icons";
import { useRoute, RouteProp } from "@react-navigation/native";

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

type OTPRouteParams = {
  email: string;
};

export default function OTPScreen() {
  const router = useRouter();
  const route = useRoute<RouteProp<{ params: OTPRouteParams }, "params">>();
  const { email, type } = useLocalSearchParams();

  console.log("Came from:", type); // signup OR forgot
  console.log("Email:", email);
  const [otp, setOTP] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleOTPChange = (index: number, value: string) => {
    if (value.length === 0 || /^[0-9]+$/.test(value)) {
      const newOTP = [...otp];
      newOTP[index] = value;
      setOTP(newOTP);
      if (value.length === 1 && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  const handleResendOTP = async () => {
    if (!email) {
      Alert.alert("Error", "Email is missing");
      return;
    }

    try {
      console.log("🔹 Resending OTP to:", email);

      const response = await apiClient.post("/api/auth/otp-resend", { email });

      console.log("🔹 Resend OTP response:", response.data);

      if (response.status === 200 || response.status === 201) {
        Alert.alert("✅ OTP sent successfully", `Check your email: ${email}`);
      } else {
        Alert.alert(
          "Failed",
          response.data?.error?.message || "Failed to resend OTP"
        );
      }
    } catch (error: any) {
      console.log(
        "❌ Resend OTP error:",
        error.response?.data || error.message
      );
      Alert.alert(
        "Error",
        error.response?.data?.error?.message || "Something went wrong"
      );
    }
  };

  const handleSubmit = async () => {
    console.log("🔹 handleSubmit triggered");
    const code = otp.join("");
    console.log("🔹 OTP entered:", code);

    if (code.length < 6) {
      console.log("❌ OTP incomplete");
      Alert.alert("Alert", "Please enter complete OTP");
      return;
    }

    try {
      console.log("🔹 Email:", email);
      console.log("🔹 Type:", type);

      let endpoint = "";
      let body = { email, otp: Number(code) };

      if (type === "signup" || type === "login") {
        endpoint = "/api/auth/otp-verify";
      } else {
        endpoint = "/api/auth/password/otp-verify";
      }

      console.log("🔹 API Endpoint:", endpoint);
      console.log("🔹 Request Body:", body);

      const response = await apiClient.post(endpoint, body);

      console.log("🔹 API Response (raw):", response);
      console.log("🔹 API Response Data:", response.data);

      if (response.status === 200 || response.status === 201) {
        if (type === "signup") {
          Alert.alert("✅ Email verified successfully");

          const accessToken = response?.data?.data?.accessToken;

          router.replace({
            pathname: "/(screens)/Login/PersonalDetails",
            params: { token: accessToken, email },
          });
        }

        if (type === "login") {
          Alert.alert("Success", "Email verified successfully");

          router.replace("/(screens)/Login/LoginScreen");
        }

        if (type === "forgot") {
          router.replace({
            pathname: "/(screens)/Login/ResetPassword",
            params: { email },
          });
        }
      } else {
        console.log("❌ OTP API returned status:", response.status);
        Alert.alert("Failed", response.data.error.message || "Invalid OTP");
      }
    } catch (error: any) {
      console.log("❌ OTP Error (full):", JSON.stringify(error, null, 2));
      console.log("❌ OTP Error response:", error.response?.data);
      console.log("❌ OTP Error message:", error.message);

      Alert.alert(
        "OTP Failed",
        error.response?.data?.error.message || "Please try again"
      );
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
          Verify Your Email
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
            We’ve sent a 6-digit code to your email. Enter it below to continue.
          </Text>
        </View>
      </View>

      {/* otp container 6 */}
      <View style={styles.otpContainer}>
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <TextInput
            key={index}
            style={styles.otpInput}
            value={otp[index]}
            onChangeText={(text) => handleOTPChange(index, text)}
            keyboardType="numeric"
            maxLength={1}
            ref={(ref) => {
              inputRefs.current[index] = ref;
            }}
            onKeyPress={({ nativeEvent }) =>
              handleKeyPress(index, nativeEvent.key)
            }
            onSubmitEditing={() => {
              if (index < 5) {
                inputRefs.current[index + 1]?.focus();
              }
            }}
          />
        ))}
      </View>

      {/*  button */}
      <TouchableOpacity
        style={styles.loginbutton}
        activeOpacity={0.7}
        onPress={handleSubmit}
      >
        <AppButton title="Verify" buttonColor={Colors.blue} />
      </TouchableOpacity>
      <View
        style={{
          marginTop: RFPercentage(3),
          flexDirection: "row",
        }}
      >
        <Text
          style={{
            fontSize: fontSize(10),
            color: Colors.lightBlack,
            fontFamily: FontFamily.medium,
          }}
        >
          Don’t receive the OTP?
        </Text>

        <TouchableOpacity onPress={handleResendOTP} activeOpacity={0.7}>
          <Text
            style={{
              fontSize: RFPercentage(1.4),
              color: Colors.blue,
              fontFamily: FontFamily.medium,
            }}
          >
            Resend
          </Text>
        </TouchableOpacity>
      </View>
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
  otpContainer: {
    width: "90%",
    marginTop: RFPercentage(4),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  otpInput: {
    width: "14.5%",
    backgroundColor: Colors.white,
    borderRadius: 10,
    borderWidth: RFPercentage(0.1),
    borderColor: Colors.lightGrey,
    paddingVertical: 16,
    fontSize: 20,
    textAlign: "center",
    marginHorizontal: 5,
  },
  loginbutton: {
    width: "90%",
    marginTop: RFPercentage(4),
  },
});
