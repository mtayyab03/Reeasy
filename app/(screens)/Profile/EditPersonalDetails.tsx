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
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

// Components
import Screen from "@/components/common/Screen";
import AppButton from "@/components/common/AppButton";
import AppHeader from "@/components/common/AppHeader";
import InputField from "../../../components/common/InputField";
import CustomAlert from "@/components/common/CustomAlert";

// constants
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/font";
import icons from "@/constants/icons";
import { fontSize } from "@/constants/fontUtils";

const EditPersonalDetails = () => {
  const router = useRouter();

  const existingUser = {
    name: "John Doe",
    phone: "1234567890",
    address: "123 Main Street",
    bsn: "123456789",
    postcode: "12345",
    country: "Netherlands",
    imageUri: "https://i.imgur.com/CzXTtJV.jpg",
  };

  const [name, setName] = useState<string>(existingUser.name);
  const [phone, setPhone] = useState<string>(existingUser.phone);
  const [address, setAddress] = useState<string>(existingUser.address);
  const [bsn, setBsn] = useState<string>(existingUser.bsn);
  const [postcode, setPostcode] = useState<string>(existingUser.postcode);
  const [country, setCountry] = useState<string>(existingUser.country);
  const [image, setImage] = useState<string | null>(existingUser.imageUri);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");

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

  const handleSignup = () => {
    if (
      !name.trim() ||
      !address.trim() ||
      !phone.trim() ||
      !bsn.trim() ||
      !postcode.trim() ||
      !country.trim()
    ) {
      setAlertMessage("Please fill in all the fields.");
      setAlertType("error");
      setAlertVisible(true);
      return;
    }

    if (!/^\d{10,}$/.test(phone)) {
      setAlertMessage("Please enter a valid phone number.");
      setAlertType("error");
      setAlertVisible(true);
      return;
    }

    if (!image) {
      setAlertMessage("Please upload your profile image.");
      setAlertType("error");
      setAlertVisible(true);
      return;
    }

    Alert.alert("Edit successful!");

    router.back();
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
      <InputField placeTitle="Full name" value={name} onChangeText={setName} />

      <View style={{ marginTop: RFPercentage(1) }} />

      <InputField
        placeTitle="Phone number"
        value={phone}
        onChangeText={setPhone}
      />

      {/* button */}
      <TouchableOpacity
        style={styles.loginbutton}
        activeOpacity={0.7}
        onPress={handleSignup}
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
    borderColor: Colors.lightGrey,
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
