import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  Image,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  Alert,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Ionicons } from "@expo/vector-icons";

// constants
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/font";
import icons from "@/constants/icons";
import { fontSize } from "@/constants/fontUtils";

// Components
import Screen from "@/components/common/Screen";
import AppButton from "@/components/common/AppButton";
import AppHeader from "@/components/common/AppHeader";
import DatePicker from "@/components/common/DatePicker";

const VisitSchedule = () => {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const handleBack = () => {
    router.back();
  };
  const handleSend = () => {
    if (!date) {
      Alert.alert("Please select a date");
      return;
    }
    if (!time) {
      Alert.alert("Please select a time");
      return;
    }

    Alert.alert("Request has been sent");
    router.push("/(tabs)/Home");
  };
  return (
    <Screen style={styles.screen}>
      <AppHeader title="Schedule" onPress={() => handleBack()} />

      <View style={styles.cardDetail}>
        <View style={{ flex: 1 }}>
          {/* Title + Type */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.name}>Sterlin Apartment</Text>
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
              Street no 3, Area 20, California, USA
            </Text>
          </View>
        </View>

        {/* Price + Area */}
        <View style={{ alignItems: "flex-end" }}>
          <View style={{ marginTop: RFPercentage(1) }} />
          <Text style={styles.name}>$200,000</Text>
        </View>
      </View>

      <View style={{ width: "90%", marginTop: RFPercentage(4) }}>
        <Text style={styles.dateText}>
          Select the date and time for your visit
        </Text>
        <DatePicker
          placeholder="DD-MM-YYYY"
          value={date}
          onDateChange={setDate}
          borderColor={Colors.stroke}
        />

        {/* Time Picker */}
        <DatePicker
          placeholder="HH:MM"
          value={time}
          onTimeChange={setTime}
          isTimePicker={true}
          borderColor={Colors.stroke}
          icon="access-time"
        />
      </View>

      {/* button */}
      <TouchableOpacity
        onPress={handleSend}
        style={styles.loginbutton}
        activeOpacity={0.7}
      >
        <AppButton title="Send" buttonColor={Colors.blue} />
      </TouchableOpacity>
    </Screen>
  );
};

export default VisitSchedule;
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  cardDetail: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: RFPercentage(2),
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
  dateText: {
    fontSize: fontSize(14),
    fontFamily: FontFamily.medium,
    color: Colors.lightBlack,
  },

  loginbutton: {
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: RFPercentage(3),
    position: "absolute",
    bottom: RFPercentage(5),
  },
});
