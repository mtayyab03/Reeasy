import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Ionicons } from "@expo/vector-icons";
// Components
import Screen from "@/components/common/Screen";
import AppHeader from "@/components/common/AppHeader";
import ProductCard from "@/components/Specific/ProductCard";

// API
import apiClient, { BASE_URL } from "@/app/apis/apiClient";

// constants
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/font";
import icons from "@/constants/icons";
import { fontSize } from "@/constants/fontUtils";

type PropertyImage = {
  imageUrl: string;
};

type Property = {
  uuid: string;
  title: string;
  price: number;
  area: number;
  address: string;
  propertyType: string;
  latlng: string;
  images: PropertyImage[];
  displayImage?: { uri: string } | any;
  createdAt: string;
};

const MyItems = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);
  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await apiClient.get("/api/property/mine/");
        const data: Property[] = response.data.data; // ✅ correct

        const mapped = data.map((prop) => ({
          ...prop,
          displayImage:
            prop.images && prop.images.length > 0
              ? { uri: `${BASE_URL}${prop.images[0].imageUrl}` }
              : icons.house1,
        }));

        setProperties(mapped);
      } catch (error) {
        console.log("API Error:", error);
      }
    };

    fetchProperties();
  }, []);

  const filteredProperties = properties.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <Screen style={styles.screen}>
      <AppHeader title="My items" onPress={() => handleBack()} />

      <View style={{ marginTop: RFPercentage(2) }} />
      {/* Search bar */}
      <View style={styles.searchContainer}>
        {/* Search Icon */}
        <Ionicons
          name="search"
          size={20}
          color="#999"
          style={{ marginHorizontal: 8 }}
        />

        {/* Input */}
        <TextInput
          placeholder="Search..."
          style={styles.searchInput}
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)} // controlled input
        />
      </View>

      {/* 🏡 Property List or Empty Message */}
      {filteredProperties.length === 0 ? (
        <View style={{ marginTop: RFPercentage(5), alignItems: "center" }}>
          <Text
            style={{
              fontFamily: FontFamily.medium,
              fontSize: fontSize(16),
              color: Colors.grey,
            }}
          >
            No items found
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{
            alignItems: "center",
            paddingBottom: RFPercentage(10),
          }}
          style={{ width: "100%" }}
          showsVerticalScrollIndicator={false}
        >
          {filteredProperties.map((property) => (
            <ProductCard
              key={property.uuid}
              image={property.displayImage}
              title={property.title}
              address={property.address}
              price={`$${property.price}`}
              area={`${property.area} sqft`}
              type={property.propertyType}
              cardpage="Edit"
              onPress={() =>
                router.push({
                  pathname: "/(screens)/Profile/ItemEdit",
                  params: { property: JSON.stringify(property) },
                })
              }
              onPressCard={() =>
                router.push({
                  pathname: "/(screens)/Main/ItemDetails",
                  params: {
                    property: JSON.stringify(property),
                  },
                })
              }
            />
          ))}
        </ScrollView>
      )}

      {/* list end */}
    </Screen>
  );
};

export default MyItems;
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  cardDetail: {
    width: "93%",
    flexDirection: "row",
    // backgroundColor: Colors.blue,
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: RFPercentage(1),
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  name: {
    fontSize: fontSize(16),
    fontFamily: FontFamily.semiBold,
    color: Colors.lightBlack,
  },
  details: {
    fontSize: fontSize(10),
    fontFamily: FontFamily.medium,
    color: Colors.darkGrey,
  },
  searchContainer: {
    width: "90%",
    backgroundColor: Colors.white,
    borderRadius: RFPercentage(1),
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: RFPercentage(0.1),
    borderColor: Colors.stroke,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: RFPercentage(1),
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: Colors.lightBlack,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
});
