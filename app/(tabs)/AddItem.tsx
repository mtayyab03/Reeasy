import React, { useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  Alert,
  TextInput,
  ScrollView,
  Image,
  Switch,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import PlacesInput from "@/components/common/PlacesInput";
// Components
import Screen from "@/components/common/Screen";
import AppButton from "@/components/common/AppButton";
import InputField from "@/components/common/InputField";
import CustomAlert from "@/components/common/CustomAlert";
import { ThemedText } from "@/components/themed-text";

// API
import apiClient from "@/app/apis/apiClient";

// constants
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/font";
import icons from "@/constants/icons";
import { fontSize } from "@/constants/fontUtils";

interface Coordinates {
  latitude: number | null;
  longitude: number | null;
}

const AddItem = () => {
  const router = useRouter(); // ✅ get router instance
  const [title, setTitle] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [bedrooms, setBedrooms] = useState<string>("");
  const [fullBath, setFullBath] = useState<string>("");
  const [halfBath, setHalfBath] = useState<string>("");
  const [livigAreaSize, setLivigAreaSize] = useState<string>("");
  const [yearBuilt, setYearBuilt] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [coordinates, setCoordinates] = useState<Coordinates>({
    latitude: null,
    longitude: null,
  });
  const [description, setDescription] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("Single fam");
  const propertyTypes = ["Single fam", "Condo", "Townhouse", "Multi Family"];
  const additionFeature = ["Pool", "Garage", "Water Front"];
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [isEnabledAppointment, setIsEnabledAppointment] = useState(true);

  const [images, setImages] = useState<string[]>([]);

  const pickImage = async () => {
    if (images.length >= 4) {
      Alert.alert("Limit Reached", "You can add up to 4 images only.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"], // Use "images" (plural)
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  // 📌 Remove image
  const removeImage = (index: number) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  // 📌 Validate min images
  const handleSubmit = async () => {
    if (images.length < 1) {
      Alert.alert("Minimum Required", "Please add at least 2 images.");
      return;
    }
    // ✅ Validations
    if (
      !title.trim() ||
      !price.trim() ||
      !bedrooms.trim() ||
      !fullBath.trim() ||
      !halfBath.trim() ||
      !livigAreaSize.trim() ||
      !yearBuilt.trim() ||
      !address.trim() ||
      !description.trim()
    ) {
      Alert.alert("Missing Field", "Please fill all the required fields.");
      return;
    }
    if (!coordinates.latitude || !coordinates.longitude) {
      Alert.alert(
        "Missing Field",
        "Please select a valid address from suggestions."
      );
      return;
    }

    // ✅ Prepare payload
    const payload = {
      title: title.trim(),
      propertyType: selectedType,
      price: price.trim(),
      totalBedRooms: bedrooms.trim(),
      fullBath: fullBath.trim(),
      halfBath: halfBath.trim(),
      area: livigAreaSize.trim(),
      builtYear: yearBuilt.trim(),
      address: address.trim(),
      latlng: `[${coordinates.latitude}, ${coordinates.longitude}]`,
      pool: selectedFeatures.includes("Pool"),
      garage: selectedFeatures.includes("Garage"),
      waterFront: selectedFeatures.includes("Water Front"),
      appointmentOpen: isEnabledAppointment,
      language: "en",
      description: description.trim(),
    };

    try {
      // 1️⃣ Create property
      const response = await apiClient.post("/api/property", payload);
      console.log("Property Response:", response.data);

      const propertyUid = response.data.data.propertyUid;

      if (!propertyUid) {
        Alert.alert("Error", "Property UID not received from API.");
        return;
      }

      // 2️⃣ Upload images
      if (images.length > 0) {
        // If API expects FormData for images:
        const formData = new FormData();
        images.forEach((uri, index) => {
          const filename = uri.split("/").pop()!;
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : `image`;
          formData.append("images", {
            uri,
            name: filename,
            type,
          } as any); // as any for React Native
        });

        const imageResponse = await apiClient.post(
          `/api/property/image/${propertyUid}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        console.log("Images uploaded:", imageResponse.data);
      }

      // 3️⃣ Success - navigate to Home
      Alert.alert("Success", "Property submitted successfully!", [
        {
          text: "OK",
          onPress: () => router.replace("/(tabs)/Home"),
        },
      ]);
    } catch (error: any) {
      if (error.response) {
        // Server responded with a status other than 2xx
        console.log("Status:", error.response.status);
        console.log("Headers:", error.response.headers);
        console.log("Data:", error.response.data); // <-- This usually contains detailed message
      } else if (error.request) {
        // Request was made but no response received
        console.log("No response received:", error.request);
      } else {
        // Something else happened
        console.log("Error:", error.message);
      }

      Alert.alert(
        "Error",
        `Failed to submit property. ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const handleToggle = (feature: string) => {
    if (selectedFeatures.includes(feature)) {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== feature));
    } else {
      setSelectedFeatures([...selectedFeatures, feature]);
    }
  };
  return (
    <Screen style={styles.screen}>
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
        }}
        style={{ width: "100%" }}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText
          type="Black16Reg"
          style={{
            fontFamily: FontFamily.medium,
            fontSize: fontSize(18),
          }}
        >
          Add Property
        </ThemedText>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ marginTop: RFPercentage(2) }}
          style={{ flexGrow: 0 }}
        >
          <View style={styles.imageRow}>
            {images.length === 0 ? (
              <View style={styles.placeholderBox}>
                <Ionicons name="camera" size={40} color={Colors.darkGrey} />
                <Text style={styles.placeholderText}>Choose Images</Text>
              </View>
            ) : (
              images.map((uri, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri }} style={styles.image} />
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => removeImage(index)}
                  >
                    <Ionicons name="close-circle" size={22} color="red" />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        </ScrollView>

        {/* Add Images Button */}
        <TouchableOpacity style={styles.addBtn} onPress={pickImage}>
          <Text style={styles.addBtnText}>Add Images</Text>
        </TouchableOpacity>

        {/* Add property details */}
        <InputField placeTitle="Title" value={title} onChangeText={setTitle} />
        <View style={{ marginTop: RFPercentage(1) }} />
        <InputField
          placeTitle="Price"
          value={price}
          onChangeText={setPrice}
          numeric
        />
        <View style={{ marginTop: RFPercentage(1) }} />
        <InputField
          placeTitle="Total bedrooms"
          value={bedrooms}
          onChangeText={setBedrooms}
          numeric
        />

        <View
          style={{
            width: "90%",
            flexDirection: "row",
            marginTop: RFPercentage(1),
            justifyContent: "space-between",
          }}
        >
          <View style={{ width: "49%" }}>
            <InputField
              placeTitle="Full baths"
              value={fullBath}
              onChangeText={setFullBath}
              containerStyle={{ width: "100%", height: fontSize(43) }}
              numeric
            />
          </View>
          <View style={{ width: "49%" }}>
            <InputField
              placeTitle="Half baths"
              value={halfBath}
              onChangeText={setHalfBath}
              containerStyle={{ width: "100%", height: fontSize(43) }}
              numeric
            />
          </View>
        </View>

        <View style={{ marginTop: RFPercentage(1) }} />
        <InputField
          placeTitle="Living area Sqft"
          value={livigAreaSize}
          onChangeText={setLivigAreaSize}
          numeric
        />
        <View style={{ marginTop: RFPercentage(1) }} />
        <InputField
          placeTitle="Year Built"
          value={yearBuilt}
          onChangeText={setYearBuilt}
          numeric
        />
        <View style={{ marginTop: RFPercentage(1) }} />
        <PlacesInput
          onSelect={({ address, latitude, longitude }) => {
            setAddress(address);
            setCoordinates({ latitude, longitude });
            console.log("Selected Address:", address);
            console.log("Latitude:", latitude);
            console.log("Longitude:", longitude);
          }}
        />

        <View style={{ marginTop: RFPercentage(1) }} />
        <InputField
          placeTitle="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={5}
          containerStyle={{ height: fontSize(60) }} // make it taller
        />

        <View style={{ marginTop: RFPercentage(1) }} />

        <View
          style={{
            width: "90%",
            flexDirection: "row",
            alignItems: "center",
            marginVertical: RFPercentage(1),
            justifyContent: "space-between",
          }}
        >
          {propertyTypes.map((type, index) => {
            const isSelected = selectedType === type;
            return (
              <TouchableOpacity
                activeOpacity={0.7}
                key={index}
                onPress={() => setSelectedType(type)}
                style={{
                  backgroundColor: isSelected ? Colors.blue : Colors.stroke,
                  paddingHorizontal: RFPercentage(1.5),
                  paddingVertical: RFPercentage(1),
                  borderRadius: RFPercentage(1),
                  marginRight: RFPercentage(0.5),
                  marginBottom: RFPercentage(1),
                }}
              >
                <Text
                  style={{
                    color: isSelected ? Colors.white : Colors.darkGrey,
                    fontFamily: FontFamily.medium,
                    fontSize: fontSize(10),
                  }}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* check */}

        <View style={{ width: "90%", marginTop: RFPercentage(1) }}>
          <ThemedText
            type="Black16Reg"
            style={{
              fontFamily: FontFamily.medium,
              fontSize: fontSize(16),
            }}
          >
            Additional features :
          </ThemedText>
        </View>
        <View
          style={{
            width: "90%",
            marginTop: RFPercentage(1.5),
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {additionFeature.map((feature, index) => {
            const isChecked = selectedFeatures.includes(feature);
            return (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: RFPercentage(1.5),
                }}
              >
                <TouchableOpacity
                  onPress={() => handleToggle(feature)}
                  activeOpacity={0.7}
                  style={[
                    styles.checkedContainer,
                    {
                      backgroundColor: isChecked ? Colors.blue : Colors.white, // show filled when checked
                    },
                  ]}
                >
                  {isChecked && (
                    <FontAwesome6 name="check" size={12} color={Colors.white} />
                  )}
                </TouchableOpacity>
                <Text
                  style={{
                    color: Colors.darkGrey,
                    fontFamily: FontFamily.regular,
                    fontSize: fontSize(12),
                    marginLeft: RFPercentage(1),
                  }}
                >
                  {feature}
                </Text>
              </View>
            );
          })}
        </View>

        {/* switch */}
        <View style={[styles.row, { marginTop: RFPercentage(2) }]}>
          <ThemedText type="default">Open forAppointments</ThemedText>
          <Switch
            value={isEnabledAppointment}
            onValueChange={(val) => {
              setIsEnabledAppointment(val);
            }}
            trackColor={{ false: "#767577", true: Colors.blue }}
            thumbColor={isEnabledAppointment ? Colors.white : "#f4f3f4"}
          />
        </View>

        {/* button */}
        <TouchableOpacity
          onPress={handleSubmit}
          style={styles.loginbutton}
          activeOpacity={0.7}
        >
          <AppButton title="Submit" buttonColor={Colors.blue} />
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  );
};

export default AddItem;
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: Colors.white,
  },

  imageRow: {
    flexDirection: "row",
    marginBottom: RFPercentage(1),
    height: RFPercentage(16),
  },
  imageWrapper: {
    marginRight: 10,
    position: "relative",
  },
  loginbutton: {
    width: "90%",
    marginTop: RFPercentage(5),
  },
  row: {
    width: "90%",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    marginTop: RFPercentage(6),
  },
  image: {
    width: RFPercentage(15),
    height: RFPercentage(15),
    borderRadius: RFPercentage(1),
  },
  removeBtn: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: Colors.white,
    borderRadius: 12,
  },
  placeholderBox: {
    width: RFPercentage(15),
    height: RFPercentage(15),
    borderWidth: 2,
    borderColor: Colors.stroke,
    borderRadius: RFPercentage(1),
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    marginTop: 5,
    fontSize: fontSize(10),
    color: Colors.lightGrey,
  },
  addBtn: {
    backgroundColor: Colors.blue,
    paddingHorizontal: RFPercentage(2.5),
    paddingVertical: RFPercentage(1.3),
    borderRadius: RFPercentage(1),
    marginBottom: RFPercentage(2),
  },
  addBtnText: {
    color: Colors.white,
    fontFamily: FontFamily.medium,
    fontSize: fontSize(12),
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
