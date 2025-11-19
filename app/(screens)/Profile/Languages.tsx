import React, { useState } from "react";
import { useRouter } from "expo-router";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

// constants
import { Colors } from "@/constants/Colors";

// Components
import Screen from "@/components/common/Screen";
import AppHeader from "@/components/common/AppHeader";
import AppButton from "@/components/common/AppButton";
import RadioButton from "@/components/common/RadioButton";

const Languages = () => {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };

  const options = ["English", "Spanish"];
  const [selectedName, setSelectedName] = useState(options[0]);
  return (
    <Screen style={styles.screen}>
      <AppHeader title="Languages" onPress={() => handleBack()} />

      <View style={{ marginTop: RFPercentage(3) }} />

      {options.map((name) => (
        <RadioButton
          key={name}
          name={name}
          selectedName={selectedName}
          onpress={() => setSelectedName(name)}
        />
      ))}

      {/* button */}
      <TouchableOpacity style={styles.loginbutton} activeOpacity={0.7}>
        <AppButton title="Save" buttonColor={Colors.blue} />
      </TouchableOpacity>
    </Screen>
  );
};

export default Languages;
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  loginbutton: {
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: RFPercentage(3),
    position: "absolute",
    bottom: RFPercentage(5),
  },
});
