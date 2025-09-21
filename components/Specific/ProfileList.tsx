import React from "react";
import {
  Image,
  TouchableOpacity,
  View,
  Text,
  ImageSourcePropType,
  GestureResponderEvent,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { MaterialIcons } from "@expo/vector-icons";

// constants
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/font";
import icons from "@/constants/icons";
import { fontSize } from "@/constants/fontUtils";

interface ProfileListProps {
  icon: ImageSourcePropType;
  title: string;
  onpress?: (event: GestureResponderEvent) => void;
}

const ProfileList: React.FC<ProfileListProps> = ({ icon, title, onpress }) => {
  return (
    <>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onpress}
        style={{
          width: "80%",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Image
          style={{ width: RFPercentage(3), height: RFPercentage(3) }}
          source={icon}
        />
        <View style={{ marginLeft: RFPercentage(1.4) }}>
          <Text
            style={{
              color: Colors.lightBlack,
              fontFamily: FontFamily.medium,
              fontSize: fontSize(14),
            }}
          >
            {title}
          </Text>
        </View>
        <View
          style={{
            position: "absolute",
            right: 0,
          }}
        >
          <MaterialIcons
            name="arrow-forward-ios"
            size={24}
            color={Colors.lightBlack}
          />
        </View>
      </TouchableOpacity>

      <View
        style={{
          width: "80%",
          height: RFPercentage(0.1),
          backgroundColor: Colors.lightGrey,
          borderRadius: RFPercentage(0.5),
          marginVertical: RFPercentage(1.8),
        }}
      />
    </>
  );
};

export default ProfileList;
