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
  Alert,
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

type FavouriteItem = {
  uuid: string;
  propertyDetails: {
    uuid: string;
    title: string;
    price: number;
    area: number;
    address: string;
    propertyType: string;
    images: { imageUrl: string }[];
  };
};

const FavoriteScreen = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [favProperties, setFavProperties] = useState<FavouriteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [favoriteList, setFavoriteList] = useState<string[]>([]); // store UUIDs

  const handleBack = () => {
    router.back();
  };
  const toggleFavourite = async (propertyId: string) => {
    try {
      await apiClient.delete(`/api/property/favourite/${propertyId}`);

      // remove from favoriteList (for heart state)
      setFavoriteList((prev) => prev.filter((id) => id !== propertyId));

      // remove from favProperties (to remove card)
      setFavProperties((prev) =>
        prev.filter((item) => item.uuid !== propertyId)
      );

      Alert.alert("Removed", "Property has been removed from favorites");
    } catch (error: any) {
      if (error.response?.status === 409) {
        // Already removed, still remove locally
        setFavoriteList((prev) => prev.filter((id) => id !== propertyId));
        setFavProperties((prev) =>
          prev.filter((item) => item.uuid !== propertyId)
        );

        Alert.alert(
          "Already removed",
          "This property is no longer in favorites"
        );
      } else {
        console.log("Remove favourite error:", error);
        Alert.alert("Error", "Failed to remove property from favorites");
      }
    }
  };

  // Fetch Favorite Properties
  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/api/property/favourite");

      if (response.data?.success) {
        setFavProperties(response.data.data);

        // fill favoriteList with all propertyDetails.uuid
        const favIds = response.data.data.map(
          (item: FavouriteItem) => item.uuid
        );
        setFavoriteList(favIds);
      }
    } catch (error) {
      console.log("Fav API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  // Search Filter
  const filteredProperties = favProperties.filter((item) =>
    item.propertyDetails.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <Screen style={styles.screen}>
      <AppHeader title="Favorite" onPress={() => handleBack()} />

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

      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          paddingBottom: RFPercentage(10),
        }}
        style={{ width: "100%" }}
        showsVerticalScrollIndicator={false}
      >
        {loading && <Text style={{ marginTop: 20 }}>Loading...</Text>}

        {!loading && filteredProperties.length === 0 && (
          <Text style={{ marginTop: 20, fontSize: 16, color: Colors.darkGrey }}>
            No Data Found
          </Text>
        )}

        {!loading &&
          filteredProperties.map((item) => {
            const prop = item.propertyDetails;

            const imageSource =
              prop.images && prop.images.length > 0
                ? { uri: `${BASE_URL}${prop.images[0].imageUrl}` }
                : icons.house1;

            return (
              <ProductCard
                key={prop.uuid}
                image={imageSource}
                title={prop.title}
                address={prop.address}
                price={`$${prop.price}`}
                area={`${prop.area} sqft`}
                type={prop.propertyType}
                cardpage="favorite"
                isFavourite={favoriteList.includes(item.uuid)}
                onToggleFavourite={() => toggleFavourite(item.uuid)} // use top-level uuid
                onPressCard={() =>
                  router.push({
                    pathname: "/(screens)/Main/ItemDetails",
                    params: {
                      property: JSON.stringify(prop),
                    },
                  })
                }
              />
            );
          })}
      </ScrollView>

      {/* list end */}
    </Screen>
  );
};

export default FavoriteScreen;
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
