import React, { useState, useRef } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Feather, Ionicons, FontAwesome6 } from "@expo/vector-icons";

// Components
import AppModal from "@/components/common/AppModal";
import RangeSelector from "@/components/common/RangeSelector";
import { ThemedText } from "@/components/themed-text";
import SavedFiltersModal from "./SavedFiltersModal";

// constants
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/font";
import icons from "@/constants/icons";
import { fontSize } from "@/constants/fontUtils";

type Props = {
  modalVisible: boolean;
  setModalVisible: (v: boolean) => void;
  propertyTypes: string[];
  additionFeature: string[];
  onSubmit?: (filters: any) => void;
  onCancel?: () => void;
};

export default function FilterModal({
  modalVisible,
  setModalVisible,
  propertyTypes,
  additionFeature,
  onSubmit,
  onCancel,
}: Props) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [isSavedModalVisible, setSavedModalVisible] = useState(false);
  const [savedFilters, setSavedFilters] = useState<any[]>([]);
  const handleSaveFilter = (newFilter: any) => {
    setSavedFilters((prev) => [...prev, newFilter]);
  };
  const handleDeleteFilter = (id: string) => {
    setSavedFilters((prev) => prev.filter((f) => f.id !== id));
  };

  const handleToggle = (feature: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
  };
  const handleApplyFilter = (filter: any) => {
    console.log("Applying filter:", filter);
    setSavedModalVisible(false);
  };
  const handleSubmit = () => {
    const filters = {
      selectedType,
      selectedFeatures,
      // TODO: collect values from RangeSelectors if you want to lift them up
    };
    onSubmit?.(filters);
    setModalVisible(false);
  };

  const handleSave = () => {
    const newFilter = {
      id: Date.now().toString(),
      name: `Filter ${new Date().toLocaleTimeString()}`,
      type: selectedType,
      features: selectedFeatures,
    };

    setSavedFilters((prev) => [...prev, newFilter]);
    onSubmit?.(newFilter);

    // Close filter modal and open saved modal
    setModalVisible(false);
    setSavedModalVisible(true);
  };

  return (
    <AppModal
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      RecStyle={{ width: "90%", height: "80%" }}
    >
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          paddingBottom: RFPercentage(3),
        }}
        style={{ width: "100%" }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ width: "100%" }}>
          {/* Header */}
          <View
            style={{
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setSavedModalVisible(true)}
            >
              <Text
                style={{
                  fontFamily: FontFamily.medium,
                  fontSize: fontSize(18),
                  color: Colors.blue,
                }}
              >
                Saved
              </Text>
            </TouchableOpacity>
            <Text
              style={[
                styles.name,
                { fontFamily: FontFamily.medium, fontSize: fontSize(18) },
              ]}
            >
              Filters
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
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

          {/* Range Selectors */}
          <RangeSelector
            label="Price ($)"
            min={50000}
            max={5000000}
            step={50000}
          />
          <RangeSelector label="Bedrooms" min={1} max={10} step={1} />
          <RangeSelector label="Full Baths" min={1} max={10} step={1} />
          <RangeSelector label="Half Baths" min={1} max={10} step={1} />
          <RangeSelector
            label="Living area (sqft)"
            min={1000}
            max={50000}
            step={100}
          />

          {/* Property Types */}
          <View style={styles.propertyTypeRow}>
            {propertyTypes.map((type, index) => {
              const isSelected = selectedType === type;
              return (
                <TouchableOpacity
                  activeOpacity={0.7}
                  key={index}
                  onPress={() => setSelectedType(type)}
                  style={[
                    styles.propertyTypeBtn,
                    {
                      backgroundColor: isSelected ? Colors.blue : Colors.stroke,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: isSelected ? Colors.white : Colors.darkGrey,
                      fontFamily: FontFamily.medium,
                      fontSize: fontSize(8),
                    }}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Additional Features */}
          <View style={{ width: "90%", marginTop: RFPercentage(1) }}>
            <ThemedText
              type="Black16Reg"
              style={{ fontFamily: FontFamily.medium, fontSize: fontSize(16) }}
            >
              Additional features :
            </ThemedText>
          </View>
          <View style={styles.featuresRow}>
            {additionFeature.map((feature, index) => {
              const isChecked = selectedFeatures.includes(feature);
              return (
                <View key={index} style={styles.featureItem}>
                  <TouchableOpacity
                    onPress={() => handleToggle(feature)}
                    activeOpacity={0.7}
                    style={[
                      styles.checkedContainer,
                      {
                        backgroundColor: isChecked ? Colors.blue : Colors.white,
                      },
                    ]}
                  >
                    {isChecked && (
                      <FontAwesome6
                        name="check"
                        size={12}
                        color={Colors.white}
                      />
                    )}
                  </TouchableOpacity>
                  <Text
                    style={{
                      color: Colors.darkGrey,
                      fontFamily: FontFamily.regular,
                      fontSize: fontSize(12),
                      marginLeft: RFPercentage(1),
                    }}
                  >
                    {feature}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "#ccc" }]}
              onPress={onCancel ?? (() => setModalVisible(false))}
            >
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: Colors.blue }]}
              onPress={handleSave}
            >
              <Text style={styles.btnText}>Save Filter</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, { backgroundColor: Colors.blue }]}
              onPress={handleSubmit}
            >
              <Text style={styles.btnText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <SavedFiltersModal
        modalVisible={isSavedModalVisible}
        setModalVisible={setSavedModalVisible}
        savedFilters={savedFilters}
        onApply={handleApplyFilter}
        onDelete={handleDeleteFilter}
      />
    </AppModal>
  );
}

const styles = StyleSheet.create({
  name: { textAlign: "center", marginVertical: RFPercentage(2) },
  propertyTypeRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: RFPercentage(2),
  },
  propertyTypeBtn: {
    paddingHorizontal: RFPercentage(1.5),
    paddingVertical: RFPercentage(1),
    borderRadius: RFPercentage(0.5),
    marginRight: RFPercentage(0.5),
    marginBottom: RFPercentage(1),
  },

  //new
  label: {
    fontSize: RFPercentage(2),
    fontFamily: FontFamily.medium,
    color: Colors.lightBlack,
    marginVertical: RFPercentage(1),
  },
  rangeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: RFPercentage(1),
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.stroke,
    borderRadius: 5,
    padding: 5,
    minWidth: 70,
    textAlign: "center",
    marginHorizontal: 5,
  },
  rangeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: RFPercentage(2),
  },
  typeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    backgroundColor: "#eee",
    alignItems: "center",
  },
  typeText: {
    fontSize: RFPercentage(1.8),
    fontFamily: FontFamily.medium,
    color: Colors.lightBlack,
  },
  featuresRow: {
    flexDirection: "row",
    marginVertical: 10,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  featureText: {
    marginLeft: 5,
    fontSize: RFPercentage(1.8),
    fontFamily: FontFamily.medium,
    color: Colors.lightBlack,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: RFPercentage(4),
  },
  btn: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: {
    color: Colors.white,
    fontFamily: FontFamily.semiBold,
    fontSize: RFPercentage(2),
  },
  checkedContainer: {
    width: RFPercentage(2),
    height: RFPercentage(2),
    borderWidth: 1,
    borderColor: Colors.darkGrey,
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginTop: RFPercentage(0.2),
  },
});
