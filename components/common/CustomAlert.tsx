import React, { useEffect, useState } from "react";
import { View, Text, Animated, StyleSheet, Platform } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
// constants
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/font";
import icons from "@/constants/icons";
import { fontSize } from "@/constants/fontUtils";

type AlertType = "success" | "error";

interface CustomAlertProps {
  message: string;
  type: AlertType;
  visible: boolean;
  onClose: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  message,
  type,
  visible,
  onClose,
}) => {
  const [animation] = useState(new Animated.Value(-100)); // Initial position off-screen

  useEffect(() => {
    if (visible) {
      Animated.timing(animation, {
        toValue: 0, // Slide down to visible
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        // Auto-hide after 3 seconds
        setTimeout(() => {
          Animated.timing(animation, {
            toValue: -100, // Slide up to hide
            duration: 500,
            useNativeDriver: true,
          }).start(onClose);
        }, 3000);
      });
    }
  }, [visible]);

  if (!visible) return null;

  const styles = getStyles(type);

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY: animation }] }]}
    >
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const getStyles = (type: AlertType) => {
  const isSuccess = type === "success";
  const backgroundColor = isSuccess ? "#E7FFF4" : "#FFECEC";
  const borderLeftColor = isSuccess ? "#198754" : "#DC3545";
  const color = isSuccess ? "#198754" : "#DC3545";

  return StyleSheet.create({
    container: {
      width: "90%",
      position: "absolute",
      top: Platform.select({
        ios: RFPercentage(7),
        android: RFPercentage(2),
      }),
      left: 0,
      right: 0,
      backgroundColor,
      borderLeftWidth: 5,
      borderLeftColor,
      padding: RFPercentage(2),
      zIndex: 999,
      marginLeft: RFPercentage(2),
      borderRadius: RFPercentage(1),
    },
    message: {
      color,
      fontSize: RFPercentage(1.5),
      fontFamily: FontFamily.bold,
    },
  });
};

export default CustomAlert;
