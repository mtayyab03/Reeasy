import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Feather, Ionicons } from "@expo/vector-icons";
// Components
import Screen from "@/components/common/Screen";
import CustomTabBar from "@/components/common/CustomTabBar";
import ScheduleCard from "@/components/Specific/ScheduleCard";

// constants
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/font";
import icons from "@/constants/icons";
import { fontSize } from "@/constants/fontUtils";

const Schedule = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  type TabType = "Received" | "Requested" | "Confirmed" | "Visits";

  const tabs: TabType[] = ["Received", "Requested", "Confirmed", "Visits"];

  const [selectedTab, setSelectedTab] = useState<TabType>("Received");

  const scheduleData: Record<TabType, any[]> = {
    Received: [
      {
        id: 1,
        profileImage: icons.pf1,
        name: "Daisy Shah",
        requestText: "Visiting Request Received",
        propertyName: "Stephan Villa Lake",
        dateTime: "13/04/2025 - 07:25",
      },
      {
        id: 2,
        profileImage: icons.pf5,
        name: "Ana Hermes",
        requestText: "Visiting Request Received",
        propertyName: "Zinc Residency",
        dateTime: "08/04/2025 - 03:00",
      },
      {
        id: 3,
        profileImage: icons.pf2,
        name: "Nima Hilton",
        requestText: "Visiting Request Received",
        propertyName: "Palm Residency",
        dateTime: "15/04/2025 - 09:00",
      },
    ],
    Requested: [
      {
        id: 4,
        profileImage: icons.pf3,
        name: "Elsa Ryon",
        requestText: "Visiting Request Send",
        propertyName: "Sunset Heights",
        dateTime: "16/04/2025 - 11:00",
        requestStatus: "Pending", // 👈 status for Requested
      },
      {
        id: 5,
        profileImage: icons.pf4,
        name: "Jhon Mark",
        requestText: "Visiting Request Send",
        propertyName: "Skyline Apartments",
        dateTime: "17/04/2025 - 15:30",
        requestStatus: "Accepted",
      },
    ],
    Confirmed: [
      {
        id: 6,
        profileImage: icons.pf6,
        name: "Priyanka Kat",
        requestText: "Visits I Accepted",
        propertyName: "Beachside Villa",
        dateTime: "18/04/2025 - 13:00",
      },
    ],
    Visits: [
      {
        id: 7,
        profileImage: icons.pf5,
        name: "Jane Singh",
        requestText: "Visits I Will Attend",
        propertyName: "Hilltop Bungalow",
        dateTime: "19/04/2025 - 10:00",
      },
      {
        id: 8,
        profileImage: icons.pf3,
        name: "Zara Loker",
        requestText: "Visits I Will Attend",
        propertyName: "Hilltop Bungalow",
        dateTime: "19/04/2025 - 10:00",
      },
    ],
  };

  return (
    <Screen style={styles.screen}>
      {/* Search bar */}
      <View style={styles.searchContainer}>
        {/* Search Icon */}
        <Ionicons
          name="search"
          size={20}
          color={Colors.lightGrey}
          style={{ marginHorizontal: 8 }}
        />

        {/* Input */}
        <TextInput
          placeholder="Search by name"
          style={styles.searchInput}
          placeholderTextColor={Colors.lightGrey}
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)} // controlled input
        />
      </View>

      <CustomTabBar
        tabs={tabs}
        onTabChange={(tab: string) => setSelectedTab(tab as TabType)} // update selected tab
      />

      {/* cards */}

      {scheduleData[selectedTab]
        .filter((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map((item) => (
          <ScheduleCard
            key={item.id}
            profileImage={item.profileImage}
            name={item.name}
            requestText={item.requestText}
            propertyName={item.propertyName}
            dateTime={item.dateTime}
            statusTab={selectedTab} // 👈 pass current tab
            requestStatus={item.requestStatus} // only applies for Requested
            onAccept={() => console.log(`Accepted ${item.id}`)}
            onReject={() => console.log(`Rejected ${item.id}`)}
            onReschedule={() => console.log(`Rescheduled ${item.id}`)}
            onCancel={() => console.log(`Canceled ${item.id}`)}
            onDriveTo={() => router.push("/(screens)/Main/DriveToScreen")} // 👈 navigate
          />
        ))}
      {scheduleData[selectedTab].filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).length === 0 && (
        <Text
          style={{
            marginTop: RFPercentage(5),
            fontSize: fontSize(12),
            fontFamily: FontFamily.medium,
            color: Colors.lightGrey,
            textAlign: "center",
          }}
        >
          No results found
        </Text>
      )}
    </Screen>
  );
};

export default Schedule;
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  searchContainer: {
    width: "92%",
    backgroundColor: Colors.pureWhite,
    borderRadius: RFPercentage(1),
    paddingHorizontal: 15,
    paddingVertical: 7,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: RFPercentage(0.1),
    borderColor: Colors.stroke,
    marginTop: RFPercentage(1),
  },
  bottomCardInner: {
    width: "92%",
    backgroundColor: Colors.white,
    borderWidth: RFPercentage(0.1),
    borderColor: "#B9B9B9",
    padding: 15,
    borderRadius: 7,
    marginTop: RFPercentage(1),
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: Colors.lightBlack,
  },
  cardDetail: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  name: {
    fontSize: fontSize(14),
    fontFamily: FontFamily.bold,
    color: Colors.lightBlack,
  },
  details: {
    fontSize: fontSize(8),
    fontFamily: FontFamily.regular,
    color: Colors.lightBlack,
    marginTop: RFPercentage(0.3),
  },
  detailButton: {
    backgroundColor: Colors.lightBlack,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    borderRadius: 4,
    margin: RFPercentage(0.3),
  },
  buttonText: {
    color: Colors.white,
    fontFamily: FontFamily.semiBold,
    fontSize: fontSize(10),
  },
});
