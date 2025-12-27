import React, { useState, useEffect } from "react";
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
import { useRouter, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";

// Components
import Screen from "@/components/common/Screen";
import AppButton from "@/components/common/AppButton";
import InputField from "@/components/common/InputField";
import { ThemedText } from "@/components/themed-text";
import AppHeader from "@/components/common/AppHeader";

// API
import apiClient, { BASE_URL } from "@/app/apis/apiClient";

// constants
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/font";
import icons from "@/constants/icons";
import { fontSize } from "@/constants/fontUtils";
type PropertyImage = {
  uri: string;
  isNew: boolean;
  uuid?: string; // only for existing images
};
const ItemEdit = () => {
  const router = useRouter(); // ✅ get router instance
  const { property } = useLocalSearchParams();
  console.log("Previous screend data", property);
  // Ensure we have a string
  const propertyString = Array.isArray(property) ? property[0] : property;
  const parsedProperty = propertyString ? JSON.parse(propertyString) : null;

  const [propertyData, setPropertyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [bedrooms, setBedrooms] = useState<string>("");
  const [fullBath, setFullBath] = useState<string>("");
  const [halfBath, setHalfBath] = useState<string>("");
  const [livigAreaSize, setLivigAreaSize] = useState<string>("");
  const [yearBuilt, setYearBuilt] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("single fam");
  const propertyTypes = ["single fam", "condo", "townhouse", "multi family"];
  const additionFeature = ["Pool", "Garage", "Water Front"];
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [isEnabledAppointment, setIsEnabledAppointment] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Change from string[] to object[]
  const [images, setImages] = useState<PropertyImage[]>([]);

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
      setImages([...images, { uri: result.assets[0].uri, isNew: true }]);
    }
  };

  // 📌 Remove image
  const removeImage = async (index: number) => {
    console.log("🗑 removeImage called");
    console.log("📍 Index received:", index);

    const img = images[index];

    console.log("🖼 Image at index:", {
      uri: img?.uri,
      isNew: img?.isNew,
      uuid: img?.uuid,
    });

    // Safety check
    if (!img) {
      console.warn("⚠️ No image found at index:", index);
      return;
    }

    // =========================
    // DELETE FROM SERVER (OLD IMAGE)
    // =========================
    if (!img.isNew && img.uuid) {
      console.log("🌐 Calling DELETE API for image UUID:", img.uuid);

      try {
        const response = await apiClient.delete(
          `/api/property/image/${img.uuid}`
        );

        console.log("✅ Image deleted from server:", response?.data);
      } catch (error: any) {
        console.error("❌ Failed to delete image from server");
        console.error("Status:", error?.response?.status);
        console.error("URL:", error?.response?.config?.url);
        console.error("Response:", error?.response?.data);
        return;
      }
    } else {
      console.log("🆕 New image → skipping DELETE API");
    }

    // =========================
    // REMOVE FROM STATE
    // =========================
    const updated = [...images];
    updated.splice(index, 1);

    console.log(
      "📉 Images before removal:",
      images.map((img, i) => ({
        i,
        uri: img.uri,
        isNew: img.isNew,
        uuid: img.uuid,
      }))
    );

    setImages(updated);

    console.log(
      "📈 Images after removal:",
      updated.map((img, i) => ({
        i,
        uri: img.uri,
        isNew: img.isNew,
        uuid: img.uuid,
      }))
    );
  };

  // 📌 Fetch property from API
  useEffect(() => {
    const fetchProperty = async () => {
      if (!parsedProperty?.uuid) return;
      try {
        const response = await apiClient.get(
          `/api/property/${parsedProperty.uuid}?language=en`
        );

        if (response.data.success) {
          const data = response.data.data;
          setPropertyData(data);

          // Map API fields to state
          setTitle(data.title || "");
          setPrice(data.price?.toString() || "");
          setBedrooms(data.totalBedRooms?.toString() || "");
          setFullBath(data.fullBath?.toString() || "");
          setHalfBath(data.halfBath?.toString() || "");
          setLivigAreaSize(data.area?.toString() || "");
          setYearBuilt(data.builtYear?.toString() || "");
          setAddress(data.address || "");
          setDescription(data.description || "");
          setSelectedType(data.propertyType || "single fam");
          setIsEnabledAppointment(
            typeof data.appointmentOpen === "boolean"
              ? data.appointmentOpen
              : true
          );

          // Map features
          const selected: string[] = [];
          if (data.pool) selected.push("Pool");
          if (data.garage) selected.push("Garage");
          if (data.waterFront) selected.push("Water Front");
          setSelectedFeatures(selected);

          // Map images
          setImages(
            data.images.map((img: any) => ({
              uri: `${BASE_URL}${img.imageUrl}`,
              uuid: img.uuid,
              isNew: false,
            }))
          );
        }
      } catch (error) {
        console.error("Failed to fetch property details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [parsedProperty?.uuid]);

  // 📌 Submit edited property to API
  const handleSubmit = async () => {
    console.log("🚀 handleSubmit started");

    if (isSubmitting) {
      console.log("⛔ Already submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      // =========================
      // 1️⃣ PATCH PROPERTY DATA
      // =========================
      const patchData = {
        title: title.trim() !== "" ? title : "empty",
        price,
        totalBedRooms: bedrooms,
        fullBath,
        halfBath,
        area: livigAreaSize,
        builtYear: yearBuilt,
        address,
        description,
        propertyType: selectedType,
        pool: selectedFeatures.includes("Pool"),
        garage: selectedFeatures.includes("Garage"),
        waterFront: selectedFeatures.includes("Water Front"),
        appointmentOpen: isEnabledAppointment,
        language: "en",
      };

      console.log("📦 PATCH DATA:", patchData);

      await apiClient.patch(`/api/property/${parsedProperty.uuid}`, patchData);

      console.log("✅ PATCH success");

      // =========================
      // 2️⃣ UPLOAD ONLY NEW IMAGES
      // =========================
      const newImages = images.filter((img) => img.isNew);

      console.log("🆕 New images count:", newImages.length);

      if (newImages.length > 0) {
        const formData = new FormData();

        newImages.forEach((img, index) => {
          console.log("📤 Uploading image:", img.uri);

          formData.append("images", {
            uri: img.uri,
            name: `image_${Date.now()}_${index}.jpg`,
            type: "image/jpeg",
          } as any);
        });

        const uploadResponse = await apiClient.post(
          `/api/property/image/${parsedProperty.uuid}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        console.log("✅ Images uploaded:", uploadResponse.data);
      } else {
        console.log("ℹ️ No new images to upload");
      }

      // =========================
      // 3️⃣ SUCCESS
      // =========================
      Alert.alert("Success", "Property updated successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      console.error("🔥 SUBMIT ERROR");
      console.error("Status:", error?.response?.status);
      console.error("URL:", error?.response?.config?.url);
      console.error("Response:", error?.response?.data);
      console.error("Message:", error?.message);

      Alert.alert("Error", "Something went wrong. Check logs.");
    } finally {
      setIsSubmitting(false);
      console.log("🧹 handleSubmit finished");
    }
  };

  const handleToggle = (feature: string) => {
    if (selectedFeatures.includes(feature)) {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== feature));
    } else {
      setSelectedFeatures([...selectedFeatures, feature]);
    }
  };

  const handleBack = () => {
    router.back();
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
        <AppHeader title="Item Edit" onPress={() => handleBack()} />

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
              images.map((img, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri: img.uri }} style={styles.image} />
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
        {/* <InputField placeTitle="Title" value={title} onChangeText={setTitle} /> */}
        <View style={{ marginTop: RFPercentage(1) }} />

        <InputField
          placeTitle="Price"
          value={price}
          onChangeText={setPrice}
          numeric
          showInitialText
          InitialText="$"
          containerStyle={{ flexDirection: "row", alignItems: "center" }}
        />
        <View style={{ marginTop: RFPercentage(1) }} />
        <InputField
          placeTitle="Enter total bedrooms"
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
              placeTitle="Enter #full baths"
              value={fullBath}
              onChangeText={setFullBath}
              containerStyle={{ width: "100%", height: fontSize(43) }}
              numeric
            />
          </View>
          <View style={{ width: "49%" }}>
            <InputField
              placeTitle="Enter #half baths"
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
          showInitialText
          InitialText="Sqft"
          containerStyle={{
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: RFPercentage(4),
          }}
        />
        <View style={{ marginTop: RFPercentage(1) }} />
        <InputField
          placeTitle="Enter Year Built"
          value={yearBuilt}
          onChangeText={setYearBuilt}
          numeric
        />
        <View style={{ marginTop: RFPercentage(1) }} />
        <InputField
          placeTitle="Enter complete address"
          value={address}
          onChangeText={setAddress}
        />
        <View style={{ marginTop: RFPercentage(1) }} />
        <InputField
          placeTitle="Enter Description"
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
          disabled={isSubmitting}
        >
          <AppButton
            title={isSubmitting ? "Submitting..." : "Submit"}
            buttonColor={Colors.blue}
          />
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  );
};

export default ItemEdit;
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
