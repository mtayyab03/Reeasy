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
import { Feather, Ionicons, FontAwesome } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";

// Components
import Screen from "@/components/common/Screen";
import AppButton from "@/components/common/AppButton";
import { ThemedText } from "@/components/themed-text";

// API
import apiClient, { BASE_URL } from "@/app/apis/apiClient";

// constants
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/font";
import icons from "@/constants/icons";
import { fontSize } from "@/constants/fontUtils";

const PersonalDetails = () => {
  const router = useRouter();
  const { token } = useLocalSearchParams();
  console.log("signup token for personal details", token);
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    // Request permission
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Please allow access to your photos.");
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"], // Use "images" (plural)
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleSignup = async () => {
    try {
      if (!name.trim() || !phone.trim()) {
        Alert.alert("Error", "Full name and phone number cannot be empty.");
        return;
      }

      if (!/^\d{9,}$/.test(phone)) {
        Alert.alert("Error", "Please enter a valid phone number.");
        return;
      }

      // 🔹 1️⃣ Prepare data to send
      const patchData = {
        fullName: name,
        phone: phone,
      };
      console.log("🔹 Sending PATCH data:", patchData);

      // 1️⃣ First update name + phone
      const response = await apiClient.patch(`/api/user/me`, patchData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("🔹 PATCH response:", response.data);

      // 🔹 2️⃣ Prepare image formData if available
      if (image) {
        const formData = new FormData();
        formData.append("profilePic", {
          uri: image,
          name: "profile.jpg",
          type: "image/jpeg",
        } as any);

        console.log("🔹 Sending PUT formData:", formData);

        // 2️⃣ Upload image
        const imgRes = await apiClient.put(
          `/api/user/me/profile-pic`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("🔹 PUT response:", imgRes.data);
      }

      Alert.alert("Success", "Profile updated successfully!");
      router.replace("/(screens)/Login/LoginScreen");
    } catch (err) {
      console.log("Update Error:", err);
      Alert.alert("Error", "Something went wrong while updating.");
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
          justifyContent: "center",
          marginTop: RFPercentage(2),
        }}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.iconCircle}
          onPress={handleBack}
        >
          <Feather name="arrow-left" size={24} color={Colors.blacky} />
        </TouchableOpacity>
        <ThemedText
          type="Black16Reg"
          style={{
            fontFamily: FontFamily.medium,
            fontSize: fontSize(18),
          }}
        >
          Personal Details
        </ThemedText>
      </View>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={pickImage}
        style={{
          width: RFPercentage(12),
          height: RFPercentage(12),
          borderRadius: RFPercentage(8),
          borderColor: Colors.lightGrey,
          borderWidth: RFPercentage(0.2),
          marginBottom: RFPercentage(4),
          marginTop: RFPercentage(6),
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {!image ? (
          <FontAwesome name="camera" size={32} color={Colors.lightBlack} />
        ) : (
          <Image
            style={{
              width: RFPercentage(12),
              height: RFPercentage(12),
              borderRadius: RFPercentage(8),
            }}
            source={{ uri: image }}
          />
        )}
      </TouchableOpacity>

      {/* fields */}
      <View style={styles.emailmain}>
        <TextInput
          style={styles.input}
          onChangeText={setName}
          autoCapitalize="none"
          value={name}
          placeholder="Full name"
          placeholderTextColor={Colors.grey}
        />
      </View>
      <View style={{ marginTop: RFPercentage(2) }} />
      <View style={styles.emailmain}>
        <TextInput
          style={styles.input}
          onChangeText={setPhone}
          autoCapitalize="none"
          value={phone}
          placeholder="Phone number"
          placeholderTextColor={Colors.grey}
        />
      </View>

      {/* button */}
      <TouchableOpacity
        style={styles.loginbutton}
        activeOpacity={0.7}
        onPress={handleSignup}
      >
        <AppButton title="Sign up" buttonColor={Colors.blue} />
      </TouchableOpacity>
    </Screen>
  );
};

export default PersonalDetails;
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  loginbutton: {
    width: "90%",
    marginTop: RFPercentage(6),
  },
  iconCircle: {
    width: RFPercentage(5),
    height: RFPercentage(5),
    borderRadius: RFPercentage(3),
    borderWidth: RFPercentage(0.1),
    borderColor: Colors.stroke,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: 0,
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
