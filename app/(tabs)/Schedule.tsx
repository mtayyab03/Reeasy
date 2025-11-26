import React, { useState, useEffect } from "react";
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

// API
import apiClient, { BASE_URL } from "@/app/apis/apiClient";

// constants
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/font";
import icons from "@/constants/icons";
import { fontSize } from "@/constants/fontUtils";

type ScheduleItem = {
  id: string;
  profileImage: string;
  name: string;
  requestText: string;
  propertyName: string;
  dateTime: string;
  requestStatus?: any;
  ownerReschedule?: boolean;
};

const Schedule = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  type TabType = "Received" | "Requested" | "Confirmed" | "Visits";

  const tabs: TabType[] = ["Received", "Requested", "Confirmed", "Visits"];
  const [selectedTab, setSelectedTab] = useState<TabType>("Received");

  const [scheduleData, setScheduleData] = useState<
    Record<TabType, ScheduleItem[]>
  >({
    Received: [],
    Requested: [],
    Confirmed: [],
    Visits: [],
  });

  useEffect(() => {
    fetchAllAppointments();
  }, []);

  const fetchAllAppointments = async () => {
    try {
      const [receivedRes, requestedRes, confirmedRes, visitsRes] =
        await Promise.all([
          apiClient.get("/api/property/appointment/owner-received"),
          apiClient.get("/api/property/appointment/booker-requested"),
          apiClient.get("/api/property/appointment/owner-confirmed"),
          apiClient.get("/api/property/appointment/booker-visit"),
        ]);

      setScheduleData({
        Received: receivedRes.data.data.map((item: any) => ({
          id: item.uuid,
          profileImage: item.booker?.profilePic
            ? `${BASE_URL}${item.booker.profilePic}`
            : "",
          name: item.booker?.fullName || "No Name",
          requestText: "Visiting Request Received",
          propertyName: item.propertyDetails.title,
          dateTime: `${item.appointmentDate} - ${item.appointmentTime}`,
        })),
        Requested: requestedRes.data.data.map((item: any) => ({
          id: item.uuid,
          profileImage: item.propertyOwner?.profilePic
            ? `${BASE_URL}${item.propertyOwner.profilePic}`
            : "",
          name: item.propertyOwner?.fullName || "No Name",
          requestText: "Visiting Request Send",
          propertyName: item.propertyDetails.title,
          dateTime: `${item.appointmentDate} - ${item.appointmentTime}`,
          requestStatus: item.status,
          ownerReschedule: item.propertyOwnerResheduled,
        })),
        Confirmed: confirmedRes.data.data.map((item: any) => ({
          id: item.uuid,
          profileImage: item.booker?.profilePic
            ? `${BASE_URL}${item.booker.profilePic}`
            : "",
          name: item.booker?.fullName || "No Name",
          requestText: "Visits I Accepted",
          propertyName: item.propertyDetails.title,
          dateTime: `${item.appointmentDate} - ${item.appointmentTime}`,
        })),
        Visits: visitsRes.data.data.map((item: any) => ({
          id: item.uuid,
          profileImage: item.booker?.profilePic
            ? `${BASE_URL}${item.booker.profilePic}`
            : "",
          name: item.booker?.fullName || "No Name",
          requestText: "Visits I Will Attend",
          propertyName: item.propertyDetails.title,
          dateTime: `${item.appointmentDate} - ${item.appointmentTime}`,
        })),
      });
    } catch (error) {
      console.log("Error fetching appointments:", error);
    }
  };

  const filteredData = scheduleData[selectedTab].filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      {filteredData.length > 0 ? (
        filteredData.map((item) => (
          <ScheduleCard
            key={item.id}
            profileImage={item.profileImage}
            name={item.name}
            requestText={item.requestText}
            propertyName={item.propertyName}
            dateTime={item.dateTime}
            statusTab={selectedTab}
            ownerReschedule={item.ownerReschedule}
            requestStatus={item.requestStatus}
            onAccept={() => console.log(`Accepted ${item.id}`)}
            onReject={() => console.log(`Rejected ${item.id}`)}
            onReschedule={() => console.log(`Rescheduled ${item.id}`)}
            onCancel={() => console.log(`Canceled ${item.id}`)}
            onDriveTo={() => router.push("/(screens)/Main/DriveToScreen")}
          />
        ))
      ) : (
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
