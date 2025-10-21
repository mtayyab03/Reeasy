import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import AppModal from "@/components/common/AppModal";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Feather } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/font";
import { fontSize } from "@/constants/fontUtils";

type SavedFilter = {
  id: string;
  name: string;
  type?: string | null;
  features?: string[];
};

type Props = {
  modalVisible: boolean;
  setModalVisible: (v: boolean) => void;
  savedFilters: SavedFilter[];
  onApply: (filter: SavedFilter) => void;
  onDelete: (id: string) => void;
};

export default function SavedFiltersModal({
  modalVisible,
  setModalVisible,
  savedFilters,
  onApply,
  onDelete,
}: Props) {
  return (
    <AppModal
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      RecStyle={{ width: "90%", height: "70%" }}
    >
      <View style={{ width: "100%", padding: RFPercentage(2) }}>
        {/* Header */}
        <View
          style={{
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: RFPercentage(2),
          }}
        >
          <Text
            style={{
              fontFamily: FontFamily.medium,
              fontSize: fontSize(18),
            }}
          >
            Saved Filters
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{ position: "absolute", right: 0 }}
            onPress={() => setModalVisible(false)}
          >
            <Feather
              color={Colors.lightBlack}
              style={{ marginRight: RFPercentage(1) }}
              size={24}
              name="x"
            />
          </TouchableOpacity>
        </View>

        {/* Saved list */}
        {savedFilters.length === 0 ? (
          <Text style={{ textAlign: "center", color: Colors.darkGrey }}>
            No saved filters yet.
          </Text>
        ) : (
          <FlatList
            data={savedFilters}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.filterRow}>
                <Text style={styles.filterName}>{item.name}</Text>

                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    onPress={() => onApply(item)}
                    style={[styles.smallBtn, { backgroundColor: Colors.blue }]}
                  >
                    <Text style={{ color: Colors.white }}>Apply</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => onDelete(item.id)}
                    style={[styles.smallBtn, { backgroundColor: "red" }]}
                  >
                    <Text style={{ color: Colors.white }}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </AppModal>
  );
}

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: RFPercentage(1.5),
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  filterName: {
    fontFamily: FontFamily.medium,
    fontSize: fontSize(14),
  },
  smallBtn: {
    marginLeft: RFPercentage(1),
    paddingHorizontal: RFPercentage(1.5),
    paddingVertical: RFPercentage(0.7),
    borderRadius: 6,
  },
});
