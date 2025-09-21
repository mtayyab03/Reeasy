import React, { ReactNode } from "react";
import { StatusBar, StyleProp, StyleSheet, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

//config
import { Colors } from "../../constants/Colors";

interface ScreenProps {
  children: ReactNode;
  statusBarColor?: string;
  style?: StyleProp<ViewStyle>;
}

const Screen: React.FC<ScreenProps> = ({
  children,
  statusBarColor = Colors.white,
  style,
}) => {
  return (
    <SafeAreaView style={[styles.screen, style]}>
      <StatusBar backgroundColor={statusBarColor} barStyle="dark-content" />

      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});

export default Screen;
