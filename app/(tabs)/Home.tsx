// screens/MapScreen.tsx
import React, { useState, useRef } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Feather, Ionicons } from "@expo/vector-icons";
// Components
import Screen from "@/components/common/Screen";
import FilterModal from "@/components/Specific/FilterModal";

// constants
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/font";
import icons from "@/constants/icons";

type MarkerData = {
  id: string;
  name: string;
  type: string;
  address: string;
  coordinate: { latitude: number; longitude: number };
  profileImage: string;
  icon: any;
  status: "available" | "unavailable";
};

const markers: MarkerData[] = [
  {
    id: "1",
    name: "John Doe",
    type: "Single fam",
    address: "123 Green St, New York",
    coordinate: { latitude: 40.7128, longitude: -74.006 },
    profileImage: "https://randomuser.me/api/portraits/men/1.jpg",
    icon: icons.Pgreen,
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
    status: "unavailable",
  },
  {
    id: "4",
    name: "Jone Snow",
    type: "Condo",
    address: "456 Red Ave, New York",
    coordinate: { latitude: 40.7258, longitude: -74.001 },
    profileImage: "https://randomuser.me/api/portraits/men/3.jpg",
    icon: icons.Pgreen,
    status: "available",
  },
  {
    id: "5",
    name: "Allen Virk",
    type: "Town House",
    address: "456 Red Ave, New York",
    coordinate: { latitude: 40.7178, longitude: -73.992 },
    profileImage: "https://randomuser.me/api/portraits/women/4.jpg",
    icon: icons.Pgreen,
    status: "available",
  },
  {
    id: "6",
    name: "Lemo Roge",
    type: "Town House",
    address: "456 Green Ave, California",
    coordinate: { latitude: 40.7378, longitude: -73.992 },
    profileImage: "https://randomuser.me/api/portraits/women/5.jpg",
    icon: icons.Pred,
    status: "unavailable",
  },
];

export default function Home() {
  const router = useRouter();
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);
  const [showBanner, setShowBanner] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const propertyTypes = ["Single fam", "Condo", "Townhouse", "Multi Family"];
  const additionFeature = ["Pool", "Garage", "Water Front"];
  const mapRef = useRef<MapView>(null);

  const initialRegion: Region = {
    latitude: 40.7128,
    longitude: -74.006,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  const handleGetLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const coords = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
    setUserLocation(coords);

    // Center map on user location
    mapRef.current?.animateToRegion(
      {
        ...coords,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000
    );
  };

  return (
    <Screen style={styles.screen}>
      {/* Map */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={initialRegion}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            onPress={() => setSelectedMarker(marker)}
            coordinate={marker.coordinate}
          >
            <Image
              source={marker.icon}
              style={{
                width: 40,
                height: 40,
                opacity: selectedMarker?.id === marker.id ? 0.7 : 1,
              }}
              resizeMode="contain"
            />
          </Marker>
        ))}

        {/* User location marker */}
        {userLocation && (
          <Marker coordinate={userLocation}>
            <Image
              source={
                // status check for user icon
                markers[0].status === "available" ? icons.Pgreen : icons.Pred
              }
              style={{ width: 40, height: 40 }}
              resizeMode="contain"
            />
          </Marker>
        )}
      </MapView>

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

      {showBanner && (
        <View style={styles.bannerContainer}>
          <ImageBackground
            source={icons.adbanner}
            style={{
              width: "100%",
              alignItems: "flex-end",
              height: RFPercentage(20),
            }}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowBanner(false)} // close on X
            >
              <Feather
                color={Colors.white}
                style={{
                  marginRight: RFPercentage(1.5),
                  marginTop: RFPercentage(1),
                }}
                size={24}
                name={"x"}
              />
            </TouchableOpacity>
          </ImageBackground>
        </View>
      )}
      <View style={styles.currentLocation}>
        <TouchableOpacity
          style={styles.locationButton}
          onPress={handleGetLocation}
        >
          <Image source={icons.location} style={styles.locationicon} />
        </TouchableOpacity>
      </View>

      {/* Bottom Card */}
      {selectedMarker && (
        <View style={styles.bottomCard}>
          <View style={styles.bottomCardInner}>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: RFPercentage(1),
              }}
            >
              <Text
                style={[
                  styles.name,
                  { fontFamily: FontFamily.medium, fontSize: 16 },
                ]}
              >
                Property Details
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setSelectedMarker(null)}
              >
                <Feather
                  color={Colors.lightBlack}
                  style={{ marginRight: RFPercentage(1) }}
                  size={24}
                  name={"x"}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.cardDetail}>
              <Image
                source={{ uri: selectedMarker.profileImage }}
                style={styles.profileImage}
              />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.name}>{selectedMarker.name}</Text>
                <Text style={styles.details}>{selectedMarker.type}</Text>
                <Text style={styles.details}>{selectedMarker.address}</Text>
              </View>
              <TouchableOpacity
                style={styles.detailButton}
                onPress={() => router.push("/(screens)/Main/ItemDetails")}
              >
                <Text
                  style={{ color: "white", fontFamily: FontFamily.semiBold }}
                >
                  Details
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <TouchableOpacity
        onPress={() => router.push("/(screens)/Main/EventMapListView")}
        activeOpacity={0.7}
        style={styles.ListviewContainer}
      >
        <Text
          style={{
            color: Colors.blacky,
            fontFamily: FontFamily.semiBold,
            fontSize: RFPercentage(1.5),
          }}
        >
          List View
        </Text>
      </TouchableOpacity>

      <FilterModal
        modalVisible={isModalVisible}
        setModalVisible={setIsModalVisible}
        propertyTypes={propertyTypes}
        additionFeature={additionFeature}
        onSubmit={(filters) => console.log("filters:", filters)}
      />
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
  searchContainer: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: Colors.white,
    borderRadius: RFPercentage(10),
    paddingHorizontal: 15,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  bannerContainer: {
    position: "absolute",
    top: 130,
    left: 20,
    right: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
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

  bottomCard: {
    width: "100%",
    position: "absolute",
    bottom: RFPercentage(5),
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  bottomCardInner: {
    width: "95%",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  cardDetail: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  name: {
    fontSize: 18,
    fontFamily: FontFamily.bold,
    color: Colors.lightBlack,
  },
  details: {
    fontSize: 14,
    fontFamily: FontFamily.regular,
    color: "#555",
  },
  detailButton: {
    backgroundColor: "#007BFF",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  locationButton: {
    width: RFPercentage(7),
    backgroundColor: Colors.white,
    // 🔽 Shadow
    shadowColor: "#000", // iOS + Android
    shadowOffset: { width: 0, height: -3 }, // iOS
    shadowOpacity: 0.1, // iOS
    shadowRadius: 4, // iOS
    elevation: 6, // Android
    height: RFPercentage(7),
    borderRadius: RFPercentage(10),
    alignItems: "center",
    justifyContent: "center",
  },
  currentLocation: {
    position: "absolute",
    bottom: RFPercentage(5),
    left: 0,
    right: 0,
    width: "95%",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    zIndex: 1,
  },
  locationicon: {
    width: RFPercentage(4),
    height: RFPercentage(4),
  },
  ListviewContainer: {
    width: "100%",
    height: RFPercentage(4),
    borderTopLeftRadius: RFPercentage(20),
    borderTopRightRadius: RFPercentage(10),
    position: "absolute",
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    // 🔽 Shadow
    shadowColor: "#000", // iOS + Android
    shadowOffset: { width: 0, height: -3 }, // iOS
    shadowOpacity: 0.1, // iOS
    shadowRadius: 4, // iOS
    elevation: 6, // Android
  },
});
