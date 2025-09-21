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
} & TextInputProps;

const InputField: React.FC<InputFieldProps> = ({
  placeTitle,
  value,
  onChangeText,
  containerStyle,
  ...rest
}) => {
  return (
    <View style={[styles.emailmain, containerStyle]}>
      <TextInput
        style={[
          styles.input,
          rest.multiline && {
            textAlignVertical: "top",
            width: "95%",
            height: "90%",
          },
        ]}
        onChangeText={onChangeText}
        value={value}
        autoCapitalize="none"
        placeholder={placeTitle}
        placeholderTextColor={Colors.placeholder}
        {...rest}
      />
    </View>
  );
};

export default InputField;

const styles = StyleSheet.create({
  emailmain: {
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
    width: "70%",
    fontFamily: FontFamily.regular,
    color: Colors.lightBlack,
    fontSize: fontSize(12),
  },
});
