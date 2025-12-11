import React, { useEffect, useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  Image,
  ImageBackground,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import MapView, { Marker, Polyline, LatLng } from "react-native-maps";
import polyline from "@mapbox/polyline";
import * as Location from "expo-location";

// Components
import Screen from "@/components/common/Screen";

// API
import apiClient, { BASE_URL } from "@/app/apis/apiClient";

// constants
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/font";
import { fontSize } from "@/constants/fontUtils";
import icons from "@/constants/icons";

const DriveToScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const propertyDetails = params.propertyDetails
    ? JSON.parse(params.propertyDetails as string)
    : null;

  const propertyOwner = params.propertyOwner
    ? JSON.parse(params.propertyOwner as string)
    : null;

  console.log("PROPERTY DETAILS:", propertyDetails);
  console.log("PROPERTY OWNER:", propertyOwner);

  const [showBanner, setShowBanner] = useState(true);
  const [routeCoords, setRouteCoords] = useState<LatLng[]>([]);
  let parsedLat = 0;
  let parsedLng = 0;

  if (propertyDetails?.latlng) {
    try {
      const coords = JSON.parse(propertyDetails.latlng); // converts string -> array
      parsedLat = Number(coords[0]);
      parsedLng = Number(coords[1]);
    } catch (e) {
      console.log("LatLng parse error:", e);
    }
  }

  // Final destination
  const destination = {
    latitude: parsedLat || 37.78925,
    longitude: parsedLng || -122.4314,
  };

  // User current location (mock)
  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);
  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission denied");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    } catch (error) {
      console.log("Location error:", error);
    }
  };
  useEffect(() => {
    const init = async () => {
      await getCurrentLocation(); // get real location first
    };

    init();
  }, []);

  // Fetch route AFTER current location is available
  useEffect(() => {
    if (currentLocation) {
      fetchRoute();
    }
  }, [currentLocation]);

  // Bottom card data
  const selectedMarker = {
    profileImage: propertyOwner?.profilePic
      ? `${BASE_URL}${propertyOwner.profilePic}`
      : icons.emptyP,

    name: propertyOwner?.fullName || "Unknown Owner",
    type: propertyDetails?.title || "Property",
    address: propertyDetails?.address || "No address available",
  };

  // Example polyline (straight line between currentLocation and destination)
  const polylineCoords = [currentLocation, destination];

  // const selectedMarker = {
  //   profileImage: profileImage as string,
  //   name: name as string,
  //   type: type as string,
  //   address: address as string,
  // };

  const fetchRoute = async () => {
    const origin = `${currentLocation?.latitude},${currentLocation?.longitude}`;
    const dest = `${destination.latitude},${destination.longitude}`;
    const API_KEY = "AIzaSyDbPuqJ96Z93BSDauOCQqXTNfXVg2yA2DQ";
    try {
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${dest}&key=${API_KEY}`;
      console.log("Fetching route:", url);

      const response = await fetch(url);
      const data = await response.json();

      console.log(
        "Google Directions API response:",
        JSON.stringify(data, null, 2)
      );

      if (data.status !== "OK") {
        console.warn("Directions API error:", data.status, data.error_message);
        return;
      }

      if (data.routes.length) {
        const points = polyline.decode(data.routes[0].overview_polyline.points);
        const coords = points.map((point: number[]) => ({
          latitude: point[0],
          longitude: point[1],
        }));

        console.log("Decoded coordinates:", coords.slice(0, 5), "..."); // show first 5
        setRouteCoords(coords);
      } else {
        console.log("No routes found in response.");
      }
    } catch (error) {
      console.error("Error fetching directions:", error);
    }
  };

  useEffect(() => {
    fetchRoute();
  }, []);

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): string => {
    const R = 6371; // kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance.toFixed(1); // return "X.X"
  };

  return (
    <View style={styles.screen}>
      {/* Back Arrow */}
      <View style={styles.arrowContainer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.lightBlack} />
        </TouchableOpacity>
      </View>

      {/* Map */}
      {currentLocation && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          {/* Current Location Marker */}
          <Marker coordinate={currentLocation} title="You">
            <Image
              source={icons.direc}
              style={{ width: 50, height: 50, resizeMode: "contain" }}
            />
          </Marker>

          {/* Destination Marker */}
          <Marker
            coordinate={destination}
            title={selectedMarker.name}
            description={selectedMarker.address}
          >
            <Image
              source={icons.drivloc}
              style={{ width: 50, height: 50, resizeMode: "contain" }}
            />
          </Marker>

          {/* Route Polyline */}
          {routeCoords.length > 0 && (
            <Polyline
              coordinates={routeCoords}
              strokeColor={Colors.blue}
              strokeWidth={4}
            />
          )}
        </MapView>
      )}

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

      {/* Bottom Card */}
      <View
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View style={styles.bottomCardInner}>
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
            <View style={styles.detailButton}>
              <Text
                style={{
                  color: "white",
                  fontFamily: FontFamily.semiBold,
                }}
              >
                {currentLocation
                  ? `${calculateDistance(
                      currentLocation.latitude,
                      currentLocation.longitude,
                      destination.latitude,
                      destination.longitude
                    )} km away`
                  : "Loading..."}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default DriveToScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  arrowContainer: {
    position: "absolute",
    top: RFPercentage(8),
    left: RFPercentage(2),
    zIndex: 10,
    backgroundColor: Colors.white,
    padding: 8,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  map: {
    flex: 1,
  },
  bottomCardInner: {
    position: "absolute",
    bottom: RFPercentage(4),
    width: "90%",
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
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
    fontSize: fontSize(14),
    fontFamily: FontFamily.bold,
    color: Colors.lightBlack,
  },
  details: {
    fontSize: fontSize(10),
    fontFamily: FontFamily.regular,
    color: Colors.darkGrey,
  },
  detailButton: {
    backgroundColor: Colors.lightBlack,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
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
});
