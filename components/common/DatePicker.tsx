import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker, { Event } from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

// config
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/font";

interface DatePickerProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onDateChange?: (date: string) => void;
  onTimeChange?: (time: string) => void;
  isTimePicker?: boolean;
  error?: boolean;
  setError?: (error: Record<string, boolean>) => void;
  borderColor?: string;
  width?: string | number;
  titleSize?: number;
  icon?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  label = "Starting Date",
  placeholder,
  value,
  onDateChange,
  onTimeChange,
  isTimePicker = false,
  error,
  setError,
  borderColor = Colors.darkGrey,
  width = "100%",
  titleSize = RFPercentage(1.8),
  icon = "calendar",
}) => {
  const [date, setDate] = useState<string>("");
  const [isDatePickerVisible, setDatePickerVisibility] =
    useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  // Sync selectedDate when value changes
  useEffect(() => {
    if (!value) return;

    if (isTimePicker) {
      const [hour, minute] = value.split(":").map(Number);
      if (!isNaN(hour) && !isNaN(minute)) {
        const now = new Date();
        const parsedTime = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          hour,
          minute
        );
        setSelectedDate(parsedTime);
        setDate(value);
      }
    } else {
      const [day, month, year] = value.split("-").map(Number);
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        const parsedDate = new Date(year, month - 1, day);
        setSelectedDate(parsedDate);
        setDate(value);
      }
    }
  }, [value, isTimePicker]);

  const handleConfirm = (selected: Date) => {
    hideDatePicker();
    setSelectedDate(selected);

    if (isTimePicker) {
      const formattedTime = selected.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setDate(formattedTime);
      onTimeChange?.(formattedTime);
    } else {
      const day = selected.getDate().toString().padStart(2, "0");
      const month = (selected.getMonth() + 1).toString().padStart(2, "0");
      const year = selected.getFullYear();
      const formattedDate = `${day}-${month}-${year}`;
      setDate(formattedDate);
      onDateChange?.(formattedDate);
    }
  };

  const handleChangeText = (text: string) => {
    setDate(text);
    if (setError) {
      setError((prev: any) => ({ ...prev, date: false }));
    }
  };

  return (
    <View style={{ marginTop: RFPercentage(1) }}>
      <Text
        style={{
          marginTop: RFPercentage(0.7),
          color: Colors.blacky,
          fontFamily: FontFamily.Regular,
          fontSize: titleSize,
        }}
      >
        {label}
      </Text>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          backgroundColor: Colors.white,
          borderWidth: RFPercentage(0.1),
          borderColor: borderColor,
          padding: RFPercentage(1.5),
          alignItems: "center",
          borderRadius: RFPercentage(1),
          justifyContent: "space-between",
          marginTop: RFPercentage(1),
        }}
      >
        <TextInput
          onChangeText={handleChangeText}
          value={date}
          placeholder={placeholder}
          placeholderTextColor={Colors.blacky}
          style={styles.textInput}
          editable={false}
        />
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={showDatePicker}
          style={styles.calendarIcon}
        >
          <MaterialCommunityIcons name={icon} size={20} color={Colors.gray} />
        </TouchableOpacity>
      </View>

      {Platform.OS === "ios" ? (
        <Modal transparent visible={isDatePickerVisible} animationType="fade">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <DateTimePicker
                value={selectedDate}
                mode={isTimePicker ? "time" : "date"}
                display={isTimePicker ? "spinner" : "inline"}
                minuteInterval={5}
                onChange={(event: Event, date?: Date) => {
                  if (date) handleConfirm(date);
                }}
              />
            </View>
          </View>
        </Modal>
      ) : (
        isDatePickerVisible && (
          <DateTimePicker
            value={selectedDate}
            mode={isTimePicker ? "time" : "date"}
            display="default"
            minuteInterval={5}
            onChange={(event: Event, date?: Date) => {
              if (date) handleConfirm(date);
            }}
          />
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    color: Colors.blacky,
    fontSize: RFPercentage(1.4),
    fontFamily: FontFamily.Regular,
  },
  calendarIcon: {
    marginLeft: RFPercentage(1),
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: Colors.white,
    padding: RFPercentage(2),
    borderRadius: RFPercentage(1.5),
    alignItems: "center",
  },
});

export default DatePicker;
