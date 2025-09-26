import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";

type Props = {
  label: string;
  min: number;
  max: number;
  step: number;
  initial?: [number, number];
  onChange?: (range: [number, number]) => void;
};

export default function RangeSelector({
  label,
  min,
  max,
  step,
  initial,
  onChange,
}: Props) {
  const [range, setRange] = useState<[number, number]>(initial ?? [min, max]);
  const [active, setActive] = useState<"min" | "max">("min");

  const handleValueChange = (val: number) => {
    if (active === "min") {
      // ensure min does not exceed current max
      const newMin = Math.min(val, range[1]);
      const newRange: [number, number] = [newMin, range[1]];
      setRange(newRange);
      onChange?.(newRange);
    } else {
      // ensure max not below current min
      const newMax = Math.max(val, range[0]);
      const newRange: [number, number] = [range[0], newMax];
      setRange(newRange);
      onChange?.(newRange);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.fakeInput, active === "min" && styles.activeInput]}
          onPress={() => setActive("min")}
          activeOpacity={0.8}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.inputText}>{range[0]}</Text>
        </TouchableOpacity>

        <Text style={styles.dash}> - </Text>

        <TouchableOpacity
          style={[styles.fakeInput, active === "max" && styles.activeInput]}
          onPress={() => setActive("max")}
          activeOpacity={0.8}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.inputText}>{range[1]}</Text>
        </TouchableOpacity>
      </View>

      <Slider
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={active === "min" ? range[0] : range[1]}
        onValueChange={handleValueChange}
        minimumTrackTintColor="#2F80ED"
        maximumTrackTintColor="#ddd"
      />

      <View style={styles.labelsRow}>
        <Text>{min}</Text>
        <Text>{max}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 12 },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  fakeInput: {
    minWidth: 70,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  activeInput: {
    borderColor: "#2F80ED",
    borderWidth: 2,
    shadowColor: "#2F80ED",
    shadowOpacity: 0.12,
    elevation: 2,
  },
  dash: { marginHorizontal: 8, fontSize: 16 },
  inputText: { fontSize: 14 },
  labelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
});
