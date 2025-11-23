import React from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TextInputProps,
  ViewStyle,
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
  numeric?: boolean;
} & TextInputProps;

const InputField: React.FC<InputFieldProps> = ({
  placeTitle,
  value,
  onChangeText,
  containerStyle,
  numeric = false,
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
      <TextInput
        style={[
          styles.input,
          rest.multiline && {
            textAlignVertical: "top",
            width: "95%",
            height: "90%",
          },
        ]}
        onChangeText={handleTextChange}
        value={value}
        autoCapitalize="none"
        placeholder={placeTitle}
        placeholderTextColor={Colors.placeholder}
        keyboardType={numeric ? "numeric" : "default"}
        {...rest}
      />
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
    width: "90%",
    fontFamily: FontFamily.regular,
    color: Colors.lightBlack,
    fontSize: fontSize(12),
  },
});
