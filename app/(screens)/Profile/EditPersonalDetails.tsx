import React, { useState, useEffect } from "react";
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
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

// Components
import Screen from "@/components/common/Screen";
import AppButton from "@/components/common/AppButton";
import AppHeader from "@/components/common/AppHeader";
import InputField from "../../../components/common/InputField";
import CustomAlert from "@/components/common/CustomAlert";

// API
import apiClient, { BASE_URL } from "@/app/apis/apiClient";

// constants
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/font";
import icons from "@/constants/icons";
import { fontSize } from "@/constants/fontUtils";

const EditPersonalDetails = () => {
  const router = useRouter();

  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [image, setImage] = useState<string | null>("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiClient.get("/api/user/me");
        const user = response.data.data;

        setName(user.fullName || "");
        setPhone(user.phone || "");
        setEmail(user.email || "");
        setImage(user.profilePic ? `${BASE_URL}${user.profilePic}` : null);
        console.log("data response", response.data);
      } catch (error) {
        console.log("Error fetching user", error);
      }
    };

    fetchUser();
  }, []);

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

  // ✅ Save Edit function
  const handleSaveEdit = async () => {
    try {
      if (!name.trim() || !phone.trim()) {
        Alert.alert("Error", "Full name and phone number cannot be empty.");
        return;
      }

      if (!/^\d{9,}$/.test(phone)) {
        Alert.alert("Error", "Please enter a valid phone number.");
        return;
      }

      // 1️⃣ PATCH name + phone
      const patchData = { fullName: name, phone: phone };
      console.log("🔹 Sending PATCH data:", patchData);

      const response = await apiClient.patch("/api/user/me", patchData);
      console.log("🔹 PATCH response:", response.data);

      // 2️⃣ Upload image if selected
      if (image && !image.startsWith("http")) {
        const formData = new FormData();
        formData.append("profilePic", {
          uri: image,
          name: "profile.jpg",
          type: "image/jpeg",
        } as any);
        console.log("🔹 Sending PUT formData:", formData);

        const imgRes = await apiClient.put(
          "/api/user/me/profile-pic",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
        console.log("🔹 PUT response:", imgRes.data);
      }

      Alert.alert("Success", "Profile updated successfully!");
      router.replace("/(tabs)/Profile");
    } catch (err) {
      console.log("Update Error:", err);
      Alert.alert("Error", "Something went wrong while updating.");
    }
  };

  return (
    <Screen style={styles.screen}>
      {/* arrow icon */}

      <AppHeader title="Edit Profile" onPress={() => handleBack()} />

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={pickImage}
        style={styles.imagePickerContainer}
      >
        {image ? (
          <Image
            style={{
              width: RFPercentage(12),
              height: RFPercentage(12),
              borderRadius: RFPercentage(8),
            }}
            source={{ uri: image }}
          />
        ) : (
          <FontAwesome name="camera" size={32} color={Colors.lightBlack} />
        )}
      </TouchableOpacity>

      {/* fields */}
      <InputField placeTitle="Full name" value={name} onChangeText={setName} />

      <View style={{ marginTop: RFPercentage(1) }} />

      <InputField
        placeTitle="Phone number"
        value={phone}
        onChangeText={setPhone}
      />
      <View style={{ marginTop: RFPercentage(1) }} />

      <InputField
        placeTitle="email address"
        value={email}
        onChangeText={setEmail}
        editable={false}
      />

      {/* button */}
      <TouchableOpacity
        style={styles.loginbutton}
        activeOpacity={0.7}
        onPress={handleSaveEdit}
      >
        <AppButton title="Save Edit" buttonColor={Colors.blue} />
      </TouchableOpacity>

      {/* alert */}
      <CustomAlert
        message={alertMessage}
        type={alertType}
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
      />
    </Screen>
  );
};

export default EditPersonalDetails;
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  loginbutton: {
    width: "90%",
    position: "absolute",
    bottom: RFPercentage(5),
  },
  iconCircle: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: 0,
  },
  emailmain: {
    width: "90%",
    height: fontSize(50),
    backgroundColor: Colors.white,
    borderWidth: RFPercentage(0.1),
    borderColor: Colors.stroke,
    color: Colors.blacky,
    paddingLeft: RFPercentage(2.5),
    borderRadius: RFPercentage(1),
    justifyContent: "center",
  },
  input: {
    width: "70%",
    fontFamily: FontFamily.regular,
    color: Colors.lightBlack,
    fontSize: fontSize(12),
  },
  imagePickerContainer: {
    width: RFPercentage(12),
    height: RFPercentage(12),
    borderRadius: RFPercentage(8),
    borderColor: Colors.stroke,
    borderWidth: RFPercentage(0.2),
    marginBottom: RFPercentage(3),
    marginTop: RFPercentage(3),
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  uploadId: {
    fontFamily: FontFamily.regular,
    color: Colors.darkGrey,
    fontSize: fontSize(12),
    marginLeft: RFPercentage(1.5),
  },
  checkedContainer: {
    width: RFPercentage(2),
    height: RFPercentage(2),
    borderWidth: 1,
    borderColor: Colors.darkGrey,
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginTop: RFPercentage(0.2),
  },
});
