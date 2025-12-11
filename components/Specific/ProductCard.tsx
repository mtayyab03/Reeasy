import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Ionicons } from "@expo/vector-icons";

// constants
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/font";
import { fontSize } from "@/constants/fontUtils";

interface ProductCardProps {
  image: any; // local require() or {uri: string}
  title: string;
  address: string;
  price: string;
  area: string;
  type: string;
  cardpage?: string;
  onPress?: () => void;
  onPressCard?: () => void;
  sponsored?: boolean;

  isFavourite?: boolean; // NEW
  onToggleFavourite?: () => void; // NEW
}

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  title,
  address,
  price,
  area,
  type,
  cardpage,
  onPress,
  onPressCard,
  sponsored,
  isFavourite,
  onToggleFavourite,
}) => {
  const capitalizeFirstLetter = (text: string) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  };
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPressCard}
      style={styles.cardContainer}
    >
      {/* Top Image */}
      <Image source={image} style={styles.cardImage} resizeMode="cover" />

      {/* Card Actions */}
      {cardpage === "favorite" && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onToggleFavourite}
          style={styles.favCircle}
        >
          <Ionicons
            name={isFavourite ? "heart" : "heart-outline"}
            size={20}
            color={isFavourite ? "red" : Colors.darkGrey}
          />
        </TouchableOpacity>
      )}

      {cardpage === "Edit" && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onPress}
          style={styles.cardTag}
        >
          <Text style={styles.cardTagText}>Edit</Text>
        </TouchableOpacity>
      )}

      {sponsored && (
        <TouchableOpacity style={styles.cardTag}>
          <Text style={styles.cardTagText}>Sponsored</Text>
        </TouchableOpacity>
      )}

      {/* Card Details */}
      <View style={styles.cardDetail}>
        <View
          style={{
            width: "70%",
          }}
        >
          {/* Title + Type */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.name}>{capitalizeFirstLetter(title)}</Text>
            <View style={styles.typeTag}>
              <Text style={styles.typeText}>{type}</Text>
            </View>
          </View>

          {/* Address */}
          <View style={styles.addressRow}>
            <Ionicons
              name="location"
              size={14}
              color={Colors.blue}
              style={{ marginRight: RFPercentage(0.3) }}
            />
            <Text style={[styles.details, { fontSize: fontSize(8) }]}>
              {address}
            </Text>
          </View>
        </View>

        {/* Price + Area */}
        <View style={{ alignItems: "flex-end", width: "30%" }}>
          <Text style={styles.name}>{price}</Text>
          <Text style={styles.details}>{area}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  cardContainer: {
    width: "90%",
    height: RFPercentage(30),
    borderRadius: RFPercentage(1),
    borderWidth: RFPercentage(0.1),
    borderColor: Colors.stroke,
    alignItems: "center",
    overflow: "hidden",
    marginTop: RFPercentage(1.5),
    paddingBottom: RFPercentage(1),
  },
  favCircle: {
    position: "absolute",
    right: RFPercentage(1.5),
    top: RFPercentage(1.5),
    width: RFPercentage(4),
    height: RFPercentage(4),
    borderRadius: RFPercentage(2),
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: "75%",
    borderTopLeftRadius: RFPercentage(1),
    borderTopRightRadius: RFPercentage(1),
  },
  cardTag: {
    position: "absolute",
    right: RFPercentage(1.5),
    top: RFPercentage(1.5),
    paddingHorizontal: RFPercentage(1.3),
    paddingVertical: RFPercentage(0.6),
    backgroundColor: Colors.white,
    borderRadius: RFPercentage(0.3),
  },
  cardTagText: {
    fontSize: fontSize(10),
    fontFamily: FontFamily.semiBold,
    color: Colors.lightBlack,
  },
  cardDetail: {
    width: "93%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: RFPercentage(1),
  },
  name: {
    fontSize: fontSize(14),
    fontFamily: FontFamily.semiBold,
    color: Colors.lightBlack,
  },
  details: {
    fontSize: fontSize(10),
    fontFamily: FontFamily.medium,
    color: Colors.darkGrey,
  },
  typeTag: {
    paddingHorizontal: RFPercentage(1),
    paddingVertical: RFPercentage(0.3),
    backgroundColor: "#E3F2FF",
    marginLeft: RFPercentage(0.8),
    borderRadius: RFPercentage(0.3),
  },
  typeText: {
    fontSize: fontSize(7),
    fontFamily: FontFamily.regular,
    color: Colors.blue,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: RFPercentage(0.4),
  },
});
