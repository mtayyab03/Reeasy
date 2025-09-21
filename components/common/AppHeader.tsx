import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Feather, Ionicons, FontAwesome } from "@expo/vector-icons";

// Components
import { ThemedText } from "@/components/themed-text";

// constants
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/font";
import icons from "@/constants/icons";
import { fontSize } from "@/constants/fontUtils";

type AppHeaderProps = {
  title: string;
  onPress: () => void;
};

const AppHeader: React.FC<AppHeaderProps> = ({ title, onPress }) => {
  return (
    <View
      style={{
        width: "90%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: RFPercentage(1),
      }}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.headerContainer}
        onPress={onPress}
      >
        <Feather name="arrow-left" size={24} color={Colors.blacky} />
      </TouchableOpacity>
      <ThemedText
        type="Black16Reg"
        style={{
          fontFamily: FontFamily.medium,
          fontSize: fontSize(18),
        }}
      >
        {title}
      </ThemedText>
    </View>
  );
};

export default AppHeader;
const styles = StyleSheet.create({
  headerContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: 0,
  },
});
