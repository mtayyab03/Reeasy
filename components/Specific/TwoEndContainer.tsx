import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

// constants
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/font";
import icons from "@/constants/icons";
import { fontSize } from "@/constants/fontUtils";

interface TwoEndContainerProps {
  title: string;
  subtitle: string;
  icon: any;
}

const TwoEndContainer: React.FC<TwoEndContainerProps> = ({
  title,
  subtitle,
  icon,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.innerRow}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image style={styles.logo} source={icon} />
          <Text style={styles.title}>{title}</Text>
        </View>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "90%",
    backgroundColor: "#F4F4F4",
    borderRadius: RFPercentage(1),
    paddingVertical: RFPercentage(1.5),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: RFPercentage(0.1),
    borderColor: Colors.stroke,
    marginTop: RFPercentage(1),
  },
  innerRow: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: Colors.blacky,
    fontFamily: FontFamily.semiBold,
    fontSize: fontSize(11),
  },
  subtitleContainer: {
    position: "absolute",
    right: 0,
  },
  subtitle: {
    color: Colors.darkGrey,
    fontFamily: FontFamily.regular,
    fontSize: fontSize(11),
  },
  logo: {
    width: fontSize(20),
    height: fontSize(20),
    marginRight: RFPercentage(0.7),
  },
});

export default TwoEndContainer;
