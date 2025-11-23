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

// Components
import Screen from "@/components/common/Screen";

// constants
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/font";
import { fontSize } from "@/constants/fontUtils";
import icons from "@/constants/icons";

const DriveToScreen = () => {
  const router = useRouter();
  const { profileImage, name, type, address, latitude, longitude } =
    useLocalSearchParams();
  const [showBanner, setShowBanner] = useState(true);
  const [routeCoords, setRouteCoords] = useState<LatLng[]>([]);
  const selectedMarker = {
    id: 1,
    profileImage: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "John Doe",
    type: "Apartment",
    address: "123 Main Street, San Francisco, CA",
    latitude: 37.78925,
    longitude: -122.4314,
  };

  const [currentLocation, setCurrentLocation] = useState({
    latitude: 37.78825, // mock current location
    longitude: -122.4324,
  });

  const destination = {
    latitude: Number(latitude) || 37.78925,
    longitude: Number(longitude) || -122.4314,
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
    const origin = `${currentLocation.latitude},${currentLocation.longitude}`;
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

  return (
    <View style={styles.screen}>
      {/* Back Arrow */}
      <View style={styles.arrowContainer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.lightBlack} />
        </TouchableOpacity>
      </View>

      {/* Map */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {/* Start Marker */}
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
                1.7 km away
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
