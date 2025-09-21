import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/font";
import { fontSize } from "@/constants/fontUtils";

interface RadioButtonProps {
  name: string;
  selectedName: string;
  onpress: () => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  name,
  selectedName,
  onpress,
}) => {
  const isSelected = selectedName === name;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onpress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        width: "90%",
        justifyContent: "space-between",
        marginVertical: RFPercentage(1.5),
      }}
    >
      <Text
        style={{
          color: Colors.blacky,
          fontFamily: FontFamily.medium,
          fontSize: fontSize(14),
        }}
      >
        {name}
      </Text>

      <View
        style={{
          width: RFPercentage(2),
          height: RFPercentage(2),
          borderWidth: RFPercentage(0.2),
          borderColor: isSelected ? Colors.blue : Colors.lightBlack,
          borderRadius: RFPercentage(3),
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isSelected && (
          <View
            style={{
              width: RFPercentage(1.2),
              height: RFPercentage(1.2),
              borderRadius: RFPercentage(3),
              backgroundColor: Colors.blue,
            }}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default RadioButton;
