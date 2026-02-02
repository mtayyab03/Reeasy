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
import {
  AntDesign,
  Ionicons,
  Feather,
  Fontisto,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

// apis
import apiClient from "@/app/apis/apiClient";

// Components
import Screen from "@/components/common/Screen";
import AppButton from "@/components/common/AppButton";

// constants
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/font";
import icons from "@/constants/icons";
import { fontSize } from "@/constants/fontUtils";
export default function ResetPassword() {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [eyeIcon, setEyeIcon] = useState(false);
  const [eyeIconConfirm, setEyeIconConfirm] = useState(false);
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});

  // ...in your handle function...
  const handleResetPassword = async () => {
    let newErrors: typeof errors = {};

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

    if (!password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(password)) {
      newErrors.password =
        "Password must be at least 8 characters and include 1 uppercase letter, 1 number, and 1 special character (#, @, ! etc.)";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    // ❌ Stop if validation failed
    if (Object.keys(newErrors).length > 0) return;

    try {
      console.log("📩 Sending Reset Request for:", email);

      const body = {
        email,
        newPassword: password,
        confirmPassword: confirmPassword,
      };

      console.log("📦 Body:", body);

      const response = await apiClient.post("/api/auth/password/reset", body);

      console.log("✅ Reset Response:", response.data);

      Alert.alert("Success", "Password reset successful!");

      router.replace("/(screens)/Login/LoginScreen");
    } catch (error: any) {
      console.log("❌ Reset Error:", error.response?.data || error.message);

      Alert.alert(
        "Failed",
        error.response?.data?.message ||
          error.response?.data?.error?.message ||
          "Something went wrong",
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
          Create New Password
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
            Set a strong password for your account. Make sure it’s different
            from the old one.
          </Text>
        </View>
      </View>

      {/* email address field */}
      <View style={{ marginTop: RFPercentage(5) }} />
      {/* Password */}
      <View style={styles.emailmain}>
        <Fontisto
          color={Colors.grey}
          style={{ marginRight: RFPercentage(2) }}
          size={RFPercentage(3)}
          name={"locked"}
        />
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          placeholder="Password"
          placeholderTextColor={Colors.grey}
          secureTextEntry={!eyeIcon}
        />
        <TouchableOpacity
          onPress={() => setEyeIcon(!eyeIcon)}
          activeOpacity={0.7}
          style={styles.eyeicon}
        >
          <MaterialCommunityIcons
            color={Colors.lightBlack}
            style={{ right: RFPercentage(1) }}
            size={RFPercentage(3)}
            name={eyeIcon ? "eye-outline" : "eye-off-outline"}
          />
        </TouchableOpacity>
      </View>
      {errors.password && (
        <View style={{ width: "90%" }}>
          <Text style={styles.error}>{errors.password}</Text>
        </View>
      )}

      <View style={{ marginTop: RFPercentage(2) }} />

      {/* Confirm Password */}
      <View style={styles.emailmain}>
        <Fontisto
          color={Colors.grey}
          style={{ marginRight: RFPercentage(2) }}
          size={RFPercentage(3)}
          name={"locked"}
        />
        <TextInput
          style={styles.input}
          onChangeText={setConfirmPassword}
          value={confirmPassword}
          placeholder="Confirm Password"
          placeholderTextColor={Colors.grey}
          secureTextEntry={!eyeIconConfirm}
        />
        <TouchableOpacity
          onPress={() => setEyeIconConfirm(!eyeIconConfirm)}
          activeOpacity={0.7}
          style={styles.eyeicon}
        >
          <MaterialCommunityIcons
            color={Colors.lightBlack}
            style={{ right: RFPercentage(1) }}
            size={RFPercentage(3)}
            name={eyeIconConfirm ? "eye-outline" : "eye-off-outline"}
          />
        </TouchableOpacity>
      </View>
      {errors.confirmPassword && (
        <View style={{ width: "90%" }}>
          <Text style={styles.error}>{errors.confirmPassword}</Text>
        </View>
      )}

      {/* button */}
      <TouchableOpacity
        style={styles.loginbutton}
        activeOpacity={0.7}
        onPress={handleResetPassword}
      >
        <AppButton title="Reset Password" buttonColor={Colors.blue} />
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
  error: {
    color: "#FF0000",
    fontSize: RFPercentage(1.3),
    marginTop: RFPercentage(0.5),
    fontFamily: FontFamily.regular,
  },
  eyeicon: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: RFPercentage(1),
    width: RFPercentage(5),
    height: RFPercentage(5),
  },
});
