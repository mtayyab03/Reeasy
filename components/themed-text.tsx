import { StyleSheet, Text, type TextProps } from "react-native";

import { Colors } from "../constants/Colors";
import { FontFamily } from "../constants/font";
import { fontSize } from "@/constants/fontUtils";
import { useThemeColor } from "../hooks/use-theme-color";
import { RFPercentage } from "react-native-responsive-fontsize";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?:
    | "default"
    | "title"
    | "defaultSemiBold"
    | "subtitle"
    | "link"
    | "button"
    | "Grey14Reg"
    | "Grey12Reg"
    | "Grey10Reg"
    | "Black12Reg"
    | "Black10Reg";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Text
      style={[
        { color },
        type === "default" ? styles.default : undefined,
        type === "button" ? styles.button : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        type === "Grey14Reg" ? styles.Grey14Reg : undefined,
        type === "Grey12Reg" ? styles.Grey12Reg : undefined,
        type === "Grey10Reg" ? styles.Grey10Reg : undefined,
        type === "Black10Reg" ? styles.Black10Reg : undefined,
        type === "Black12Reg" ? styles.Black12Reg : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: fontSize(14),
    color: Colors.lightBlack,
    fontFamily: FontFamily.regular,
  },
  Grey14Reg: {
    fontSize: fontSize(14),
    color: Colors.darkGrey,
    fontFamily: FontFamily.regular,
  },
  Grey12Reg: {
    fontSize: fontSize(12),
    color: Colors.darkGrey,
    fontFamily: FontFamily.regular,
  },
  Grey10Reg: {
    fontSize: fontSize(10),
    color: Colors.darkGrey,
    fontFamily: FontFamily.regular,
  },
  Black12Reg: {
    fontSize: fontSize(12),
    color: Colors.lightBlack,
    fontFamily: FontFamily.regular,
  },
  Black10Reg: {
    fontSize: fontSize(10),
    color: Colors.lightBlack,
    fontFamily: FontFamily.regular,
  },
  button: {
    fontSize: fontSize(14),
    color: Colors.white,
    fontFamily: FontFamily.medium,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  title: {
    fontSize: RFPercentage(5),
    fontFamily: FontFamily.bold,
    color: Colors.lightBlack,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: "#0a7ea4",
  },
});
