import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  Image,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  Alert,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

// constants
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/font";
import icons from "@/constants/icons";
import { fontSize } from "@/constants/fontUtils";

// Components
import Screen from "@/components/common/Screen";
import AppButton from "@/components/common/AppButton";
import PasswordField from "@/components/Specific/PasswordField";
import AppHeader from "@/components/common/AppHeader";

type ChangePasswordProps = {
  navigation: {
    goBack: () => void;
    navigate: (screen: string) => void;
  };
};

const ChangePassword: React.FC<ChangePasswordProps> = ({ navigation }) => {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const validatePassword = (pwd: string) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(pwd);
  };

  const handlePassword = () => {
    if (!password || !confirmPassword || !oldPassword) {
      Alert.alert("Alert", "Please fill all fields");
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert(
        "Alert",
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Alert", "Passwords do not match");
      return;
    }

    // Just simulate success without API
    Alert.alert("Success", "Password updated successfully");
    navigation.navigate("Profilescreen");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Screen style={styles.screen}>
      <AppHeader title="Change Password" onPress={() => handleBack()} />

      {/* fields */}
      <View style={styles.logocontainer}>
        <Image style={styles.logo} source={icons.locklogo} />
        <View style={{ width: "70%" }}>
          <Text
            style={{
              textAlign: "center",
              color: Colors.darkGrey,
              fontFamily: FontFamily.medium,
              fontSize: fontSize(11),
            }}
          >
            Please update your password to ensure your account remains secure
          </Text>
        </View>
      </View>

      <PasswordField
        passwrd="Old Password"
        value={oldPassword}
        onChange={setOldPassword}
      />
      <View style={{ marginTop: RFPercentage(1) }} />
      <PasswordField
        passwrd="New Password"
        value={password}
        onChange={setPassword}
      />
      <View style={{ marginTop: RFPercentage(1) }} />
      <PasswordField
        passwrd="Confirm New Password"
        value={confirmPassword}
        onChange={setConfirmPassword}
      />

      {/* button */}
      <TouchableOpacity
        style={styles.loginbutton}
        activeOpacity={0.7}
        onPress={handlePassword}
      >
        <AppButton title="Update Password" buttonColor={Colors.blue} />
      </TouchableOpacity>
    </Screen>
  );
};

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

export default ChangePassword;
