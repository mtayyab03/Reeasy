import React, { useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  Alert,
  TextInput,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// Components
import Screen from "../../components/common/Screen";
import AppButton from "../../components/common/AppButton";

// constants
import { Colors } from "../../constants/Colors";
import { FontFamily } from "../../constants/font";
import icons from "../../constants/icons";
import { fontSize } from "@/constants/fontUtils";

export default function ForgetPassword() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const onChangeEmail = (text: string) => {
    setEmail(text.toLowerCase());
  };

  const handleForgetEmail = () => {
    if (!email) {
      Alert.alert("Alert", "Please Provide your Email");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Alert", "Invalid email format");
      return;
    }

    // No API integration, just navigate to OTPScreen
    router.replace({ pathname: "/(screens)/OTPScreen", params: { email } });
  };

  const handleBack = () => {
    router.replace("/(screens)/LoginScreen");
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
            borderColor: Colors.grey,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={handleBack}
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
            color: Colors.lightBlack,
            fontFamily: FontFamily.semiBold,
            fontSize: RFPercentage(3.2),
          }}
        >
          Forget Password
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
            Please enter your registered email to reset your password !
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
  loginbutton: {
    width: "90%",

    marginTop: RFPercentage(5),
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
