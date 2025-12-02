import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

// constants
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/font";
import { fontSize } from "@/constants/fontUtils";
import icons from "@/constants/icons";

interface ScheduleCardProps {
  profileImage: any;
  name: string;
  requestText: string;
  propertyName: string;
  dateTime: string;
  statusTab: string; // 👈 NEW
  requestStatus?: "accepted" | "rejected" | "pending"; // 👈 NEW
  onAccept?: () => void;
  onReject?: () => void;
  onReschedule?: () => void;
  onCancel?: () => void;
  onDriveTo?: () => void;
  ownerReschedule?: boolean;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({
  profileImage,
  name,
  requestText,
  propertyName,
  dateTime,
  statusTab,
  requestStatus,
  onAccept,
  onReject,
  onReschedule,
  onCancel,
  onDriveTo,
  ownerReschedule,
}) => {
  // Render buttons dynamically
  const renderActions = () => {
    switch (statusTab) {
      case "Received":
        console.log("owerr reschedule inner card:", ownerReschedule);
        return (
          <View style={styles.rightSection}>
            {ownerReschedule !== true && (
              <>
                <TouchableOpacity
                  onPress={onAccept}
                  style={styles.detailButton}
                >
                  <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onReject}
                  style={[styles.detailButton, { backgroundColor: Colors.red }]}
                >
                  <Text style={styles.buttonText}>Reject</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity
              onPress={onReschedule}
              style={styles.detailButton}
            >
              <Text style={styles.buttonText}>Reschedule</Text>
            </TouchableOpacity>
          </View>
        );

      case "Confirmed":
        return (
          <View style={styles.rightSection}>
            <TouchableOpacity
              onPress={onReschedule}
              style={styles.detailButton}
            >
              <Text style={styles.buttonText}>Reschedule</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onReject}
              style={[styles.detailButton, { backgroundColor: Colors.red }]}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        );

      case "Visits":
        return (
          <View style={styles.rightSection}>
            <TouchableOpacity onPress={onDriveTo} style={styles.detailButton}>
              <Text style={styles.buttonText}>Drive To</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onCancel}
              style={[styles.detailButton, { backgroundColor: Colors.red }]}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onReschedule}
              style={styles.detailButton}
            >
              <Text style={styles.buttonText}>Reschedule</Text>
            </TouchableOpacity>
          </View>
        );

      case "Requested":
        let bgColor = Colors.lightGrey;
        if (requestStatus === "accepted") bgColor = Colors.green;
        if (requestStatus === "rejected") bgColor = Colors.red;

        return (
          <View style={styles.rightSection}>
            {ownerReschedule && (
              <TouchableOpacity onPress={onAccept} style={styles.detailButton}>
                <Text style={styles.buttonText}>Accept</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={onCancel}
              style={[styles.detailButton, { backgroundColor: Colors.red }]}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.detailButton, { backgroundColor: bgColor }]}
            >
              <Text style={styles.buttonText}>{requestStatus}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onReschedule}
              style={styles.detailButton}
            >
              <Text style={styles.buttonText}>Reschedule</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.bottomCardInner}>
      <View style={styles.cardDetail}>
        {/* Left side */}
        <View style={styles.leftSection}>
          <Image
            source={
              profileImage && profileImage !== ""
                ? { uri: profileImage }
                : icons.emptyP
            }
            style={styles.profileImage}
          />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.details}>{requestText}</Text>
            <Text style={[styles.details, { fontFamily: FontFamily.medium }]}>
              {propertyName}
            </Text>
            <Text style={styles.details}>{dateTime}</Text>
          </View>
        </View>

        {/* Right side (actions based on statusTab) */}
        {renderActions()}
      </View>
    </View>
  );
};

export default ScheduleCard;

const styles = StyleSheet.create({
  bottomCardInner: {
    width: "92%",
    backgroundColor: Colors.white,
    borderWidth: RFPercentage(0.1),
    borderColor: "#B9B9B9",
    padding: 12,
    borderRadius: 7,
    marginTop: RFPercentage(1),
    paddingVertical: 15,
  },
  cardDetail: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    width: "55%",
  },
  rightSection: {
    width: "45%",
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  name: {
    fontSize: fontSize(12),
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
    paddingHorizontal: 10,
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
  statusText: {
    fontFamily: FontFamily.semiBold,
    fontSize: fontSize(11),
    marginHorizontal: 5,
  },
});
