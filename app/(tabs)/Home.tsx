// screens/MapScreen.tsx
import React, { useState, useRef, useEffect } from "react";
import { useRouter, useFocusEffect } from "expo-router";
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
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
// Components
import Screen from "@/components/common/Screen";
import FilterModal from "@/components/Specific/FilterModal";

// API
import apiClient, { BASE_URL } from "@/app/apis/apiClient";

// constants
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/font";
import icons from "@/constants/icons";

// types
type PropertyMarker = {
  id: string;
  coordinate: { latitude: number; longitude: number };
  uuid: string;
  appointmentOpen: boolean;
  profilePic: any;
};

type MarkerData = {
  uuid: string;
  name: string;
  title: string;
  type: string;
  address: string;
  coordinate: { latitude: number; longitude: number };
  profileImage: string;
  icon: any;
  status: "available" | "unavailable";
  email: "string";
};

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
  const [activeFilters, setActiveFilters] = useState<{
    selectedType: string | null;
    selectedFeatures: string[];
    priceRange: [number, number] | null;
    bedroomsRange: [number, number] | null;
    fullBathsRange: [number, number] | null;
    halfBathsRange: [number, number] | null;
    areaRange: [number, number] | null;
  }>({
    selectedType: null,
    selectedFeatures: [],
    priceRange: null,
    bedroomsRange: null,
    fullBathsRange: null,
    halfBathsRange: null,
    areaRange: null,
  });

  const propertyTypes = ["Single fam", "Condo", "Townhouse", "Multi Family"];
  const additionFeature = ["Pool", "Garage", "Water Front"];
  const mapRef = useRef<MapView>(null);

  const [propertyMarkers, setPropertyMarkers] = useState<PropertyMarker[]>([]);
  const [selectedMarkerData, setSelectedMarkerData] =
    useState<MarkerData | null>(null);

  // fetch UUIDs + coordinates
  useFocusEffect(
    React.useCallback(() => {
      fetchProperties();
    }, []),
  );

  const fetchProperties = async () => {
    try {
      const response = await apiClient.get("/api/property");
      const data = response.data.data.properties;

      const mappedMarkers: PropertyMarker[] = data.map((prop: any) => {
        const latlng = JSON.parse(prop.latlng); // [lat, lng]
        return {
          id: prop.uuid,
          uuid: prop.uuid,
          coordinate: {
            latitude: latlng[0],
            longitude: latlng[1],
          },
          appointmentOpen: prop.appointmentOpen,
          profilePic: prop.user?.profilePic
            ? { uri: `${BASE_URL}${prop.user.profilePic}` }
            : icons.emptyP,
        };
      });
      console.log("Mapped markers:", mappedMarkers);
      setPropertyMarkers(mappedMarkers);
    } catch (error) {
      console.log("API Error:", error);
    }
  };

  // Add this useEffect to get user location on mount
  useEffect(() => {
    const getCurrentLocation = async () => {
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
        1000,
      );
    };

    getCurrentLocation();
  }, []);

  // fetch marker details on select
  const handleMarkerPress = async (marker: PropertyMarker) => {
    try {
      const response = await apiClient.get(
        `/api/property/${marker.uuid}?language=en`,
      );
      if (response.data.success) {
        const prop = response.data.data;
        console.log("Parsed property details:", prop);
        setSelectedMarkerData({
          uuid: prop.uuid,
          title: prop.title,
          type: prop.propertyType,
          address: prop.address,
          coordinate: JSON.parse(prop.latlng),
          profileImage: prop.user?.profilePic
            ? `${BASE_URL}${prop.user.profilePic}`
            : icons.pf1,
          name: prop.user?.fullName ? prop.user?.fullName : prop.user?.email,
          email: prop.user?.email,
          icon: prop.appointmentOpen ? icons.Pgreen : icons.Pred,
          status: prop.appointmentOpen ? "available" : "unavailable",
        });
      }
    } catch (error) {
      console.log("Failed to fetch property details:", error);
    }
  };

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
      1000,
    );
  };
  const capitalizeFirstLetter = (text: string) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  };
  return (
    <Screen style={styles.screen}>
      {/* Map */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        region={
          userLocation
            ? { ...userLocation, latitudeDelta: 0.01, longitudeDelta: 0.01 }
            : initialRegion
        }
      >
        {propertyMarkers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate} // already {latitude, longitude}
            onPress={() => handleMarkerPress(marker)}
          >
            <Image
              source={marker.appointmentOpen ? icons.pgreene : icons.prede} // dynamically pick icon based on appointmentOpen
              style={{
                width: 40,
                height: 40,
                opacity: selectedMarker?.uuid === marker.id ? 0.7 : 1,
              }}
              resizeMode="contain"
            />
            {marker.profilePic && (
              <Image
                source={marker.profilePic}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 20,
                  position: "absolute",
                  bottom: 15,
                  alignSelf: "center",
                }}
                resizeMode="cover"
              />
            )}
          </Marker>
        ))}

        {/* User location marker */}
        {userLocation && (
          <Marker coordinate={userLocation} key="userLocation">
            <MaterialIcons
              color={Colors.blue}
              size={24}
              name={"location-history"}
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
      {selectedMarkerData && (
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
                onPress={() => setSelectedMarkerData(null)}
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
                source={
                  selectedMarkerData?.profileImage
                    ? typeof selectedMarkerData.profileImage === "string"
                      ? { uri: selectedMarkerData.profileImage }
                      : selectedMarkerData.profileImage // local require()
                    : icons.pf1
                }
                style={styles.profileImage}
              />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.name}>
                  {capitalizeFirstLetter(selectedMarkerData.name)}
                </Text>
                <Text style={[styles.details, { color: Colors.blue }]}>
                  {capitalizeFirstLetter(selectedMarkerData.type)}
                </Text>
                <Text style={styles.details}>{selectedMarkerData.address}</Text>
              </View>
              <TouchableOpacity
                style={styles.detailButton}
                onPress={() =>
                  router.push({
                    pathname: "/(screens)/Main/ItemDetails",
                    params: { property: JSON.stringify(selectedMarkerData) },
                  })
                }
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
        onSubmit={(filters) => {
          console.log("Applied Filters:", filters);
          setActiveFilters(filters); // lift filters up
          console.log("Applied active Filters:", activeFilters);
        }}
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
    fontSize: 16,
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
