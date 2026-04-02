import React, { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
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
import { AxiosError } from "axios";
// constants
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/font";
import icons from "@/constants/icons";
import { fontSize } from "@/constants/fontUtils";

// API
import apiClient from "@/app/apis/apiClient";

// Components
import Screen from "@/components/common/Screen";
import AppButton from "@/components/common/AppButton";
import AppHeader from "@/components/common/AppHeader";
import DatePicker from "@/components/common/DatePicker";

const VisitSchedule = () => {
  const router = useRouter();
  const { title, address, price, uuid, selectedTab } = useLocalSearchParams();
  console.log("Received:", title, address, price, uuid, selectedTab);
  const [date, setDate] = useState(""); // original DD-MM-YYYY from picker
  const [time, setTime] = useState(""); // 24h HH:MM
  const [displayDate, setDisplayDate] = useState(""); // formatted for UI
  const [loading, setLoading] = useState(false);

  // Detect user timezone
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // -----------------------
  // UTILITY FUNCTIONS
  // -----------------------
  const localToUTC = (date: string, time: string) => {
    const formattedDate = formatDate(date); // YYYY-MM-DD
    const localDateTime = new Date(`${formattedDate}T${time}`); // interpreted as LOCAL time

    return {
      appointmentDateUTC: localDateTime.toISOString().split("T")[0],
      appointmentTimeUTC: localDateTime.toISOString().split("T")[1].slice(0, 5),
    };
  };

  const formatDate = (value: string) => {
    // Convert DD-MM-YYYY → YYYY-MM-DD
    const parts = value.split(/[-/]/);
    if (parts.length !== 3) return value;
    const [day, month, year] = parts;
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  const toMMDDYYYY = (value: string) => {
    const parts = value.split(/[-/]/);
    if (parts.length !== 3) return value;
    const [day, month, year] = parts;
    return `${month}-${day}-${year}`;
  };

  const formatTime = (value: string) => {
    // Converts 1:30PM → 13:30 or keeps 24h format
    if (value.includes("AM") || value.includes("PM"))
      return convertTo24Hour(value);

    const parts = value.split(":");
    if (parts.length === 2)
      return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}`;
    return value;
  };

  const convertTo24Hour = (value: string) => {
    const clean = value.replace(/\s/g, "");
    const match = clean.match(/(\d{1,2}):(\d{2})(AM|PM)/i);
    if (!match) return clean;

    let [_, hour, minute, period] = match;
    let h = parseInt(hour, 10);
    if (period.toUpperCase() === "PM" && h !== 12) h += 12;
    if (period.toUpperCase() === "AM" && h === 12) h = 0;

    return `${h.toString().padStart(2, "0")}:${minute}`;
  };

  const capitalizeFirstLetter = (text: string) =>
    text ? text.charAt(0).toUpperCase() + text.slice(1) : "";

  // -----------------------
  // HANDLERS
  // -----------------------
  const handleBack = () => router.back();

  const handleSend = async () => {
    if (loading) return; // prevent double click
    if (!date) return Alert.alert("Please select a date");
    if (!time) return Alert.alert("Please select a time");
    setLoading(true);
    const { appointmentDateUTC, appointmentTimeUTC } = localToUTC(
      date,
      formatTime(time),
    );

    try {
      let endpoint = "/api/property/appointment";
      const payload: Record<string, any> = {
        appointmentDate: appointmentDateUTC,
        appointmentTime: appointmentTimeUTC,
      };

      if (selectedTab === "Requested" || selectedTab === "Visits") {
        endpoint = "/api/property/appointment/booker-reschedule";
        payload.appointmentUid = uuid;
      } else if (selectedTab === "Received" || selectedTab === "Confirmed") {
        endpoint = "/api/property/appointment/owner-reschedule";
        payload.appointmentUid = uuid;
      } else {
        payload.propertyUid = uuid;
      }

      console.log("Sending Appointment Payload:", payload, "to", endpoint);
      const response = await apiClient.post(endpoint, payload);
      console.log("Response:", response.data);

      Alert.alert("Success", "Request has been sent");
      router.push("/(tabs)/Home");
    } catch (err) {
      const error = err as AxiosError<any>;
      let errorMessage = "Something went wrong. Please try again.";
      const apiError = error.response?.data?.error;
      if (typeof apiError === "string") errorMessage = apiError;
      else if (typeof apiError === "object")
        errorMessage =
          apiError.message ||
          apiError.appointmentDate ||
          Object.values(apiError)[0];

      Alert.alert("Alert", String(errorMessage));
    } finally {
      setLoading(false); // always stop loader
    }
  };

  return (
    <Screen style={styles.screen}>
      <AppHeader title="Schedule" onPress={() => handleBack()} />

      <View style={styles.cardDetail}>
        <View style={{ width: "65%" }}>
          {/* Title + Type */}
          {/* {title ? (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.name}>
                {" "}
                {capitalizeFirstLetter(
                  Array.isArray(title) ? title[0] : title || ""
                )}
              </Text>
            </View>
          ) : null} */}
          {/* Address */}
          {address ? (
            <View style={styles.addressRow}>
              <Ionicons
                name="location"
                size={14}
                color={Colors.blue}
                style={{ marginRight: RFPercentage(0.3) }}
              />
              <Text style={[styles.details, { fontSize: fontSize(9) }]}>
                {address}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Price + Area */}
        {price ? (
          <View style={{ alignItems: "flex-end" }}>
            <View style={{ marginTop: RFPercentage(1) }} />
            <Text style={styles.name}>${price}</Text>
          </View>
        ) : null}
      </View>

      <View style={{ width: "90%", marginTop: RFPercentage(4) }}>
        <Text style={styles.dateText}>
          Select the date and time for your visit
        </Text>
        <DatePicker
          placeholder="MM-DD-YYYY"
          value={displayDate}
          onDateChange={(selectedDate) => {
            setDate(selectedDate); // keep original DD-MM-YYYY for backend
            setDisplayDate(toMMDDYYYY(selectedDate)); // show MM-DD-YYYY
          }}
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
        <AppButton
          title={loading ? "Sending..." : "Send"}
          buttonColor={Colors.blue}
        />
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
