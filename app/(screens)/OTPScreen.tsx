import React, { useState, useRef } from "react";
import { useRouter } from "expo-router";
import {
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  TextInput,
  Alert,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { AntDesign } from "@expo/vector-icons";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
// Components
import Screen from "../../components/common/Screen";
import AppButton from "../../components/common/AppButton";

// constants
import { Colors } from "../../constants/Colors";
import { FontFamily } from "../../constants/font";
import icons from "../../constants/icons";
import { fontSize } from "@/constants/fontUtils";

type OTPRouteParams = {
  email: string;
};

export default function OTPScreen() {
  const router = useRouter();
  const route = useRoute<RouteProp<{ params: OTPRouteParams }, "params">>();
  const navigation = useNavigation();
  const email = (route.params as OTPRouteParams)?.email;
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

  const handleSubmit = () => {
    if (otp.every((digit) => digit.length > 0)) {
      // No API integration, just navigate
      router.replace({
        pathname: "/(screens)/ForgetPassword",
        params: { email },
      });
    } else {
      Alert.alert("Alert", "Please enter the complete OTP");
    }
  };

  return (
    <Screen style={styles.screen}>
      {/* arrow icon */}
      <View
        style={{
          width: "90%",
          flexDirection: "row",
          alignItems: "center",
          marginTop: RFPercentage(2),
        }}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          style={{
            width: RFPercentage(5),
            height: RFPercentage(5),
            borderRadius: RFPercentage(3),
            borderWidth: RFPercentage(0.1),
            borderColor: Colors.lightGrey,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => {
            navigation.navigate("ForgetMailScreen" as never);
          }}
        >
          <AntDesign name="arrow-left" size={24} color={Colors.blacky} />
        </TouchableOpacity>
      </View>

      {/* text */}
      <View
        style={{
          width: "90%",
          alignItems: "center",
          justifyContent: "center",
          marginTop: RFPercentage(3),
          marginBottom: RFPercentage(1),
        }}
      >
        <Text
          style={{
            color: Colors.blue,
            fontFamily: FontFamily.semiBold,
            fontSize: RFPercentage(3.2),
          }}
        >
          Enter OTP
        </Text>
        <View style={{ width: "80%" }}>
          <Text
            style={{
              textAlign: "center",
              marginTop: RFPercentage(1),
              color: Colors.grey,
              fontFamily: FontFamily.regular,
              fontSize: RFPercentage(1.3),
            }}
          >
            Enter your verification code that we sent you on your email
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
      <View
        style={{
          width: "90%",
          justifyContent: "flex-end",
          marginTop: RFPercentage(2),
          flexDirection: "row",
        }}
      >
        <Text
          style={{
            fontSize: RFPercentage(1.3),
            color: Colors.grey,
            fontFamily: FontFamily.regular,
          }}
        >
          Haven’t received code?
        </Text>

        <TouchableOpacity
          onPress={() => {
            router.replace("/(screens)/ForgetPassword");
          }}
          activeOpacity={0.7}
        >
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

      {/*  button */}
      <TouchableOpacity
        style={styles.loginbutton}
        activeOpacity={0.7}
        onPress={handleSubmit}
      >
        <AppButton title="Confirm" buttonColor={Colors.blue} />
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
  otpContainer: {
    width: "90%",
    marginTop: RFPercentage(3),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  otpInput: {
    width: "14.5%",
    backgroundColor: Colors.white,
    borderRadius: 10,
    borderWidth: RFPercentage(0.1),
    borderColor: Colors.blue,
    paddingVertical: 16,
    fontSize: 20,
    textAlign: "center",
    marginHorizontal: 5,
  },
  loginbutton: {
    width: "90%",
    marginTop: RFPercentage(2),
  },
});
