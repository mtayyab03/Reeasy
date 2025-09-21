import React from "react";
import {
  Image,
  TouchableOpacity,
  View,
  Text,
  ImageSourcePropType,
  StyleSheet,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

// Components
import AppModal from "../../components/common/AppModal";

// constants
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/font";
import icons from "@/constants/icons";
import { fontSize } from "@/constants/fontUtils";

interface CommonModalProps {
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  image: ImageSourcePropType;
  title: string;
  subtitle: string;
  buttonpri: string;
  buttonsec: string;

  onpressPri: () => void;
  onpressSec: () => void;
}

const CommonModal: React.FC<CommonModalProps> = ({
  isModalVisible,
  setIsModalVisible,
  image,
  title,
  subtitle,
  buttonpri,
  buttonsec,
  onpressPri,
  onpressSec,
}) => {
  return (
    <AppModal
      modalVisible={isModalVisible}
      setModalVisible={setIsModalVisible}
      style={styles.modalContainer}
    >
      {/* Image at top */}
      <View
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image source={image} style={styles.image} />
      </View>
      {/* Title text */}
      <Text style={styles.title}>{title}</Text>

      <Text style={styles.subtitle}>{subtitle}</Text>
      {/* Buttons row */}
      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={onpressSec} style={styles.secondaryButton}>
          <Text style={styles.secondaryText}>{buttonsec}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onpressPri} style={styles.primaryButton}>
          <Text style={styles.primaryText}>{buttonpri}</Text>
        </TouchableOpacity>
      </View>
    </AppModal>
  );
};

export default CommonModal;

const styles = StyleSheet.create({
  modalContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontFamily: FontFamily.semiBold,
    fontSize: fontSize(20),
    marginBottom: RFPercentage(2),
    textAlign: "center",
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: fontSize(12),
    marginBottom: RFPercentage(2),
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: RFPercentage(3),
  },
  primaryButton: {
    backgroundColor: Colors.red,
    paddingVertical: 13,
    width: "45%",
    borderRadius: 10,
    marginRight: 10,
    alignItems: "center",
  },
  primaryText: {
    fontSize: fontSize(14),
    color: Colors.white,
    fontFamily: FontFamily.medium,
  },
  secondaryButton: {
    backgroundColor: "#B9B9B9",
    paddingVertical: 13,
    paddingHorizontal: 15,
    width: "45%",
    borderRadius: 10,
    alignItems: "center",
  },
  secondaryText: {
    fontSize: fontSize(14),
    color: Colors.lightBlack,
    fontFamily: FontFamily.medium,
  },
});
