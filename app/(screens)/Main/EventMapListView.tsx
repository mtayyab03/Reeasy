import React, { useState, useRef } from "react";
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

// constants
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/font";
import icons from "@/constants/icons";
import { fontSize } from "@/constants/fontUtils";

type MarkerData = {
  id: string;
  name: string;
  type: string;
  address: string;
  price: string;
  title: string;
  area: string;
  coordinate: { latitude: number; longitude: number };
  profileImage: string;
  icon: any;
  propertyImg: any;
  sponsored: string;
  status: "available" | "unavailable";
};

const PropertyData: MarkerData[] = [
  {
    id: "1",
    name: "John Doe",
    type: "Single fam",
    address: "123 Green St, New York",
    coordinate: { latitude: 40.7128, longitude: -74.006 },
    profileImage: "https://randomuser.me/api/portraits/men/1.jpg",
    icon: icons.Pgreen,
    propertyImg: icons.house1,
    title: "Sterlin Apartmet",
    price: "$200k",
    area: "2200sqft",
    sponsored: "true",
    status: "available",
  },
  {
    id: "2",
    name: "Jane Smith",
    type: "Condo",
    address: "456 Red Ave, New York",
    coordinate: { latitude: 40.7138, longitude: -74.001 },
    profileImage: "https://randomuser.me/api/portraits/women/2.jpg",
    icon: icons.Pred,
    propertyImg: icons.house2,
    title: "DHA liberty Villa",
    price: "$550k",
    area: "310sqft",
    sponsored: "true",
    status: "unavailable",
  },
  {
    id: "3",
    name: "Mercy Krov",
    type: "Multi Family",
    address: "456 Red Ave, New York",
    coordinate: { latitude: 40.7258, longitude: -74.011 },
    profileImage: "https://randomuser.me/api/portraits/women/3.jpg",
    icon: icons.Pred,
    propertyImg: icons.house3,
    title: "Saudia Gilbert Villa",
    price: "$950k",
    area: "3300sqft",
    sponsored: "false",
    status: "unavailable",
  },
];

const EventMapListView = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const handleBack = () => {
    router.back();
  };
  const filteredProperties = PropertyData.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
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
        <TouchableOpacity onPress={() => console.log("Filter clicked")}>
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
            key={property.id}
            image={property.propertyImg}
            title={property.title}
            address={property.address}
            price={property.price}
            area={property.area}
            type={property.type}
            onPressCard={() => alert(`Viewing ${property.title}`)}
            sponsored={property.sponsored === "true"}
          />
        ))}
      </ScrollView>

      {/* list end */}
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
});
