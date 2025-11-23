import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Ionicons } from "@expo/vector-icons";

// API
import apiClient, { BASE_URL } from "@/app/apis/apiClient";

// Components
import Screen from "@/components/common/Screen";
import AppHeader from "@/components/common/AppHeader";
import ProductCard from "@/components/Specific/ProductCard";
import FilterModal from "@/components/Specific/FilterModal";

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
  sponsored: boolean;
  images: PropertyImage[];
  displayImage?: { uri: string } | any;
  createdAt: string;
};

const EventMapListView = () => {
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);
  const handleBack = () => {
    router.back();
  };
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await apiClient.get("/api/property");
        const data: Property[] = response.data.data.properties;

        // Map properties and set default image if no images
        const mapped = data.map((prop) => ({
          ...prop,
          displayImage:
            prop.images && prop.images.length > 0
              ? { uri: `${BASE_URL}${prop.images[0].imageUrl}` }
              : icons.house1, // default image
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
  const propertyTypes = ["Single fam", "Condo", "Townhouse", "Multi Family"];
  const additionFeature = ["Pool", "Garage", "Water Front"];

  return (
    <Screen style={styles.screen}>
      <AppHeader title="Property List" onPress={() => handleBack()} />

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

        {/* Divider */}
        <View style={styles.divider} />

        {/* Filter Icon */}
        <TouchableOpacity onPress={() => setIsModalVisible(true)}>
          <Ionicons
            name="options-outline"
            size={22}
            color={Colors.lightBlack}
            style={{ marginHorizontal: 8 }}
          />
        </TouchableOpacity>
      </View>

      {/* 🏡 Scrollable property list */}
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
            image={property.displayImage} // first image or default
            title={property.title}
            address={property.address}
            price={`$${property.price}`}
            area={`${property.area} sqft`}
            type={property.propertyType}
            sponsored={property.sponsored}
            onPressCard={() =>
              router.push({
                pathname: "/(screens)/Main/ItemDetails",
                params: { property: JSON.stringify(property) }, // pass whole property
              })
            }
          />
        ))}
      </ScrollView>

      <FilterModal
        modalVisible={isModalVisible}
        setModalVisible={setIsModalVisible}
        propertyTypes={propertyTypes}
        additionFeature={additionFeature}
        onSubmit={(filters) => console.log("filters:", filters)}
      />
    </Screen>
  );
};

export default EventMapListView;
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
  modalContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  //new
  label: {
    fontSize: RFPercentage(2),
    fontFamily: FontFamily.medium,
    color: Colors.lightBlack,
    marginVertical: RFPercentage(1),
  },
  rangeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: RFPercentage(1),
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.stroke,
    borderRadius: 5,
    padding: 5,
    minWidth: 70,
    textAlign: "center",
    marginHorizontal: 5,
  },
  rangeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: RFPercentage(2),
  },
  typeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    backgroundColor: "#eee",
    alignItems: "center",
  },
  typeText: {
    fontSize: RFPercentage(1.8),
    fontFamily: FontFamily.medium,
    color: Colors.lightBlack,
  },
  featuresRow: {
    flexDirection: "row",
    marginVertical: 10,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  featureText: {
    marginLeft: 5,
    fontSize: RFPercentage(1.8),
    fontFamily: FontFamily.medium,
    color: Colors.lightBlack,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: RFPercentage(4),
  },
  btn: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: {
    color: Colors.white,
    fontFamily: FontFamily.semiBold,
    fontSize: RFPercentage(2),
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
