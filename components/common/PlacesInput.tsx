import React, { useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { RFPercentage } from "react-native-responsive-fontsize";
import { fontSize } from "@/constants/fontUtils";
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/font";
const GOOGLE_API_KEY = "AIzaSyDbPuqJ96Z93BSDauOCQqXTNfXVg2yA2DQ";

type PlacePrediction = {
  place_id: string;
  description: string;
};

type PlaceDetails = {
  address: string;
  latitude: number;
  longitude: number;
};

type Props = {
  onSelect: (data: PlaceDetails) => void;
};

export default function PlacesInput({ onSelect }: Props) {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<PlacePrediction[]>([]);

  const searchPlaces = async (text: string) => {
    setQuery(text);
    if (text.length < 3) return;

    try {
      const response = await axios.get(
        "https://maps.googleapis.com/maps/api/place/autocomplete/json",
        {
          params: {
            input: text,
            key: GOOGLE_API_KEY,
          },
        }
      );

      setResults(response.data.predictions);
    } catch (error) {
      console.log("Autocomplete Error:", error);
    }
  };

  const getPlaceDetails = async (placeId: string, description: string) => {
    try {
      const response = await axios.get(
        "https://maps.googleapis.com/maps/api/place/details/json",
        {
          params: {
            place_id: placeId,
            key: GOOGLE_API_KEY,
          },
        }
      );

      const location = response.data.result.geometry.location;

      onSelect({
        address: description,
        latitude: location.lat,
        longitude: location.lng,
      });

      setResults([]);
      setQuery(description);
    } catch (error) {
      console.log("Place Details Error:", error);
    }
  };

  return (
    <View style={styles.Inputmain}>
      <TextInput
        placeholder="Complete address"
        value={query}
        onChangeText={searchPlaces}
        style={styles.input}
      />

      {results.length > 0 && (
        <View style={styles.dropdown}>
          {results.map((item) => (
            <TouchableOpacity
              key={item.place_id}
              style={styles.suggestion}
              onPress={() => getPlaceDetails(item.place_id, item.description)}
            >
              <Text>{item.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  input: {
    width: "90%",
    fontFamily: FontFamily.regular,
    color: Colors.lightBlack,
    fontSize: fontSize(12),
  },

  dropdown: {
    position: "absolute",
    top: 55,
    width: "100%",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    zIndex: 10, // important
    elevation: 3,
  },

  suggestion: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  Inputmain: {
    width: "90%",
    height: fontSize(50),
    backgroundColor: Colors.white,
    borderWidth: RFPercentage(0.1),
    borderColor: Colors.stroke,
    color: Colors.blacky,
    paddingLeft: RFPercentage(2.5),
    borderRadius: RFPercentage(1),
    justifyContent: "center",
  },
});
