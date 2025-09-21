import React, { useState } from "react";
import {
  TextInput,
  TouchableOpacity,
  StyleSheet,
  View,
  TextInputProps,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// config
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/font";
import icons from "@/constants/icons";
import { fontSize } from "@/constants/fontUtils";

interface PasswordFieldProps {
  passwrd: string;
  value: string;
  onChange: (text: string) => void;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  passwrd,
  value,
  onChange,
}) => {
  const [eyeIcon, setEyeIcon] = useState(false);

  return (
    <View style={styles.emailmain}>
      <TextInput
        style={styles.input}
        onChangeText={onChange}
        value={value}
        placeholder={passwrd}
        placeholderTextColor={Colors.placeholder}
        secureTextEntry={!eyeIcon}
      />
      <TouchableOpacity
        onPress={() => setEyeIcon(!eyeIcon)}
        activeOpacity={0.7}
        style={styles.eyeicon}
      >
        <MaterialCommunityIcons
          color={Colors.lightBlack}
          style={{ right: RFPercentage(1) }}
          size={RFPercentage(2.5)}
          name={eyeIcon ? "eye-outline" : "eye-off-outline"}
        />
      </TouchableOpacity>
    </View>
  );
};

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
  eyeicon: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: RFPercentage(2),
  },
});

export default PasswordField;
