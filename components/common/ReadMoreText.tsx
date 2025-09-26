import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "../themed-text";
import { Colors } from "@/constants/Colors";
import { RFPercentage } from "react-native-responsive-fontsize";

const ReadMoreText = ({ text }: { text: string }) => {
  const [expanded, setExpanded] = useState(false);

  // Split into words
  const words = text.split(" ");
  const isLong = words.length > 30;

  // Show first 30 words if not expanded
  const displayText =
    !expanded && isLong ? words.slice(0, 30).join(" ") + "..." : text;

  return (
    <View style={{ marginTop: RFPercentage(0.5) }}>
      <ThemedText type="Black10Reg">{displayText}</ThemedText>

      {isLong && (
        <TouchableOpacity onPress={() => setExpanded(!expanded)}>
          <ThemedText
            type="Black10Reg"
            style={{ color: Colors.blue, marginTop: 5 }}
          >
            {expanded ? "Read Less" : "Read More"}
          </ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ReadMoreText;
