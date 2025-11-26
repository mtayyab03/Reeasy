// screens/ItemDetails.tsx
import React, { useState, useRef, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";

//componenet
import Screen from "@/components/common/Screen";
import AppLine from "@/components/common/AppLine";
import ReadMoreText from "@/components/common/ReadMoreText";

// API
import apiClient, { BASE_URL } from "@/app/apis/apiClient";

//constants
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/font";
import icons from "@/constants/icons";
import { fontSize } from "@/constants/fontUtils";

const { width } = Dimensions.get("window");

const ItemDetails = () => {
  const router = useRouter();
  const { property } = useLocalSearchParams();
  console.log("Previous screend data", property);
  // Ensure we have a string
  const propertyString = Array.isArray(property) ? property[0] : property;
  const parsedProperty = propertyString ? JSON.parse(propertyString) : null;

  const [propertyData, setPropertyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slide = Math.ceil(
      event.nativeEvent.contentOffset.x /
        event.nativeEvent.layoutMeasurement.width
    );
    if (slide !== activeIndex) {
      setActiveIndex(slide);
    }
  };

  const propertyLatLng = propertyData?.latlng
    ? JSON.parse(propertyData.latlng)
    : [37.78825, -122.4324]; // default
  useEffect(() => {
    const fetchProperty = async () => {
      if (!parsedProperty?.uuid) return;
      try {
        const response = await apiClient.get(
          `/api/property/${parsedProperty.uuid}?language=en`
        );
        if (response.data.success) {
          setPropertyData(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch property details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [parsedProperty?.uuid]);

  const images =
    propertyData?.images?.length > 0
      ? propertyData.images.map((img: { imageUrl: string }) => ({
          uri: `${BASE_URL}${img.imageUrl}`,
        }))
      : [icons.house1];

  return (
    <Screen style={styles.screen}>
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
        }}
        style={{ width: "100%" }}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Slider */}
        <View style={{ height: RFPercentage(30) }}>
          <FlatList
            ref={flatListRef}
            data={images}
            keyExtractor={(_, i) => i.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            renderItem={({ item }) => (
              <Image source={item} style={styles.image} />
            )}
          />

          {/* Dots Indicator */}
          <View style={styles.dotsContainer}>
            {images.map((_: any, index: number) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      index === activeIndex ? Colors.blue : "#ccc", // active = primary, inactive = grey
                  },
                ]}
              />
            ))}
          </View>
        </View>

        {/* Overlay controls */}
        <View style={styles.overlay}>
          {/* Back arrow */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.circleBtn}
          >
            <Ionicons name="arrow-back" size={22} color={"#000"} />
          </TouchableOpacity>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {/* Available tag */}
            <View style={styles.availableTag}>
              <Image source={icons.availb} style={{ width: 28, height: 28 }} />
              <Text style={styles.availableText}>
                {propertyData?.appointmentOpen ? "Available" : "Not Available"}
              </Text>
            </View>

            {/* Heart button */}
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.circleBtn, { marginLeft: RFPercentage(1) }]}
              onPress={() => setLiked(!liked)}
            >
              <Ionicons
                name={liked ? "heart" : "heart-outline"}
                size={22}
                color={liked ? "red" : "#000"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Example content below */}
        <View style={styles.cardDetail}>
          <View style={{ flex: 1 }}>
            {/* Title + Type */}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.name}>
                {propertyData?.title?.charAt(0).toUpperCase() +
                  propertyData?.title?.slice(1)}
              </Text>
            </View>

            {/* Address */}
            <View style={styles.addressRow}>
              <Ionicons
                name="location"
                size={14}
                color={Colors.blue}
                style={{ marginRight: RFPercentage(0.3) }}
              />
              <Text style={[styles.details, { fontSize: fontSize(9) }]}>
                {propertyData?.address}
              </Text>
            </View>

            <View style={styles.typeTag}>
              <Text style={styles.typeText}>
                {propertyData?.propertyType?.charAt(0).toUpperCase() +
                  propertyData?.propertyType?.slice(1)}
              </Text>
            </View>
          </View>

          {/* Price + Area */}
          <View style={{ alignItems: "flex-end" }}>
            <TouchableOpacity
              style={styles.detailButton}
              onPress={() =>
                router.push({
                  pathname: "/(screens)/Main/VisitSchedule",
                  params: {
                    title: propertyData?.title,
                    address: propertyData?.address,
                    price: propertyData?.price?.toString(),
                    uuid: propertyData?.uuid,
                  },
                })
              }
            >
              <Text style={{ color: "white", fontFamily: FontFamily.semiBold }}>
                Request a visit
              </Text>
            </TouchableOpacity>
            <View style={{ marginTop: RFPercentage(1) }} />
            <Text style={styles.name}>
              ${propertyData?.price.toLocaleString()}
            </Text>
          </View>
        </View>

        <View
          style={{
            width: "92%",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: RFPercentage(2),
          }}
        >
          <View style={styles.container}>
            <View style={styles.featureContainer}>
              <Image source={icons.bed} style={{ width: 24, height: 24 }} />
            </View>
            <Text style={[styles.name, { fontSize: fontSize(12) }]}>
              {propertyData?.totalBedRooms || 0} beds
            </Text>
          </View>
          <View style={styles.container}>
            <View style={styles.featureContainer}>
              <Image source={icons.bath} style={{ width: 24, height: 24 }} />
            </View>
            <Text style={[styles.name, { fontSize: fontSize(12) }]}>
              {propertyData?.fullBath || 0} Baths
            </Text>
          </View>
          <View style={styles.container}>
            <View style={styles.featureContainer}>
              <Image source={icons.area} style={{ width: 24, height: 24 }} />
            </View>
            <Text style={[styles.name, { fontSize: fontSize(12) }]}>
              {propertyData?.area || 0} Sqft
            </Text>
          </View>
        </View>

        <View style={{ width: "92%", marginVertical: RFPercentage(0.5) }}>
          <AppLine />
        </View>

        <View style={[styles.cardDetail, { marginTop: RFPercentage(0.2) }]}>
          <Image
            source={
              propertyData?.user?.profilePic
                ? { uri: `${BASE_URL}${propertyData.user.profilePic}` }
                : icons.pf1
            }
            style={styles.profileImage}
          />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={[styles.name, { fontSize: fontSize(14) }]}>
              {propertyData?.user?.fullName ||
                propertyData?.user?.email ||
                "Owner"}
            </Text>
            <Text style={styles.details}>Owner</Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/(screens)/Main/ChatScreen",
                params: {
                  name: "Daisy Shah",
                  time: "12:00pm",
                },
              })
            }
          >
            <Ionicons
              size={28}
              name="chatbubble-ellipses-outline"
              color={Colors.lightBlack}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            width: "92%",
            marginTop: RFPercentage(2),
          }}
        >
          <Text style={[styles.name, { fontSize: fontSize(14) }]}>
            Description
          </Text>
          <ReadMoreText
            text={propertyData?.description || "No description available"}
          />
        </View>

        <View style={styles.bannerContainer}>
          <Image
            source={icons.adbanner}
            style={{
              width: "100%",
              height: RFPercentage(20),
            }}
          />
        </View>

        {/* Map */}
        <View style={styles.mapContainer}>
          {/* Map */}
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: propertyLatLng[0],
              longitude: propertyLatLng[1],
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            {/* Destination Marker */}
            <Marker
              coordinate={{
                latitude: propertyLatLng[0],
                longitude: propertyLatLng[1],
              }}
              title={propertyData?.title || "Property"}
              description={propertyData?.address || ""}
            >
              <Image
                source={icons.Pgreen}
                style={{ width: 50, height: 50, resizeMode: "contain" }}
              />
            </Marker>
          </MapView>

          {/* Top-left "View Direction" Button */}
          <TouchableOpacity
            style={styles.viewDirectionBtn}
            activeOpacity={0.7}
            onPress={() => router.push("/(screens)/Main/DriveToScreen")} // 👉 change route as needed
          >
            <Image source={icons.availb} style={{ width: 24, height: 24 }} />
            <Text style={styles.availableText}>View Direction</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen>
  );
};

export default ItemDetails;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  image: {
    width: width,
    height: RFPercentage(30),
    resizeMode: "cover",
  },
  dotsContainer: {
    position: "absolute",
    bottom: 10,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    marginHorizontal: 5,
  },
  overlay: {
    position: "absolute",
    top: RFPercentage(2),
    left: RFPercentage(2),
    right: RFPercentage(2),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  circleBtn: {
    backgroundColor: "#fff",
    padding: RFPercentage(1.2),
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    width: 55,
    height: 55,
    borderRadius: 30,
  },
  bannerContainer: {
    width: "92%",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginTop: RFPercentage(2),
  },

  availableTag: {
    backgroundColor: "#fff",
    paddingRight: RFPercentage(1),
    paddingLeft: RFPercentage(0.5),
    paddingVertical: RFPercentage(0.7),
    borderRadius: RFPercentage(1),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  availableText: {
    fontSize: fontSize(14),
    color: Colors.blue,
    fontFamily: FontFamily.medium,
  },
  title: {
    fontSize: RFPercentage(2.5),
    fontFamily: FontFamily.bold,
    color: Colors.lightBlack,
  },
  description: {
    fontSize: RFPercentage(2),
    fontFamily: FontFamily.regular,
    color: "#666",
    marginTop: RFPercentage(1),
  },

  cardTagText: {
    fontSize: fontSize(10),
    fontFamily: FontFamily.semiBold,
    color: Colors.lightBlack,
  },
  cardDetail: {
    width: "92%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: RFPercentage(1.5),
  },
  name: {
    fontSize: fontSize(18),
    fontFamily: FontFamily.semiBold,
    color: Colors.lightBlack,
  },
  details: {
    fontSize: fontSize(10),
    fontFamily: FontFamily.medium,
    color: Colors.darkGrey,
  },
  typeTag: {
    width: RFPercentage(10),
    paddingHorizontal: RFPercentage(1),
    paddingVertical: RFPercentage(0.6),
    backgroundColor: "#E3F2FF",
    borderRadius: RFPercentage(0.5),
    alignItems: "center",
    justifyContent: "center",
    marginTop: RFPercentage(1),
  },
  typeText: {
    fontSize: fontSize(9),
    fontFamily: FontFamily.semiBold,
    color: Colors.blue,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: RFPercentage(0.8),
  },

  detailButton: {
    backgroundColor: "#007BFF",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },

  featureContainer: {
    width: RFPercentage(4),
    height: RFPercentage(4),
    backgroundColor: "#E3F2FF",
    borderRadius: RFPercentage(5),
    alignItems: "center",
    justifyContent: "center",
    marginRight: RFPercentage(1),
  },
  container: { alignItems: "center", flexDirection: "row" },

  mapContainer: {
    width: "92%",
    height: RFPercentage(25),
    borderRadius: RFPercentage(2),
    overflow: "hidden",
    alignSelf: "center",
    marginTop: RFPercentage(2),
  },
  map: {
    width: "100%",
    height: "100%",
  },
  viewDirectionBtn: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: Colors.white,
    paddingHorizontal: RFPercentage(2),
    paddingVertical: RFPercentage(1),
    borderRadius: RFPercentage(1.5),
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    flexDirection: "row",
  },
});
