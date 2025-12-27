import React from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TextInputProps,
  ViewStyle,
  TextStyle,
  Text,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

// config
import { Colors } from "../../constants/Colors";
import { FontFamily } from "../../constants/font";
import { fontSize } from "@/constants/fontUtils";

type InputFieldProps = {
  placeTitle: string;
  value: string;
  onChangeText: (text: string) => void;
  containerStyle?: ViewStyle; // 👈 new prop
  inputStyle?: TextStyle; // 👈 new prop
  numeric?: boolean;
  showInitialText?: boolean;
  showLastText?: boolean;
  InitialText?: string;
  LastText?: string;
} & TextInputProps;

const InputField: React.FC<InputFieldProps> = ({
  placeTitle,
  value,
  onChangeText,
  containerStyle,
  inputStyle,
  numeric = false,
  showInitialText = false,
  showLastText = false,
  InitialText,
  LastText,
  ...rest
}) => {
  const handleTextChange = (text: string) => {
    if (numeric) {
      // Remove any non-digit characters
      const numericText = text.replace(/[^0-9]/g, "");
      onChangeText(numericText);
    } else {
      onChangeText(text);
    }
  };
  return (
    <View style={[styles.Inputmain, containerStyle]}>
      {showInitialText && <Text style={styles.prefix}>{InitialText}</Text>}
      {/* ✅ Show only if true */}
      <TextInput
        style={[
          styles.input,
          rest.multiline && {
            textAlignVertical: "top",
            width: "95%",
            height: "90%",
          },
          inputStyle,
        ]}
        onChangeText={handleTextChange}
        value={value}
        autoCapitalize="none"
        placeholder={placeTitle}
        placeholderTextColor={Colors.placeholder}
        keyboardType={numeric ? "numeric" : "default"}
        {...rest}
      />
      {showLastText && (
        <Text
          style={[
            styles.prefix,
            { position: "absolute", right: RFPercentage(1) },
          ]}
        >
          {LastText}
        </Text>
      )}
    </View>
  );
};

export default InputField;

const styles = StyleSheet.create({
  Inputmain: {
    width: "90%",
    height: fontSize(50),
    backgroundColor: Colors.white,
    borderWidth: RFPercentage(0.1),
    borderColor: Colors.stroke,
    color: Colors.blacky,
    paddingLeft: RFPercentage(2.5),
    borderRadius: RFPercentage(1),
    justifyContent: "center",
  },
  input: {
    width: "100%",
    fontFamily: FontFamily.regular,
    color: Colors.lightBlack,
    fontSize: fontSize(12),
  },
  prefix: {
    fontSize: 16,
    marginRight: 4,
    color: "#000",
  },
});
