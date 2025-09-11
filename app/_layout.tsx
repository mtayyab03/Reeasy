import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useFonts } from "expo-font";

import { useColorScheme } from "@/hooks/use-color-scheme";

// export const unstable_settings = {
//   anchor: "(tabs)",
// };

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    PoppinsThin: require("../assets/fonts/Poppins-Thin.ttf"),
    PoppinsLight: require("../assets/fonts/Poppins-Light.ttf"),
    PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
    PoppinsMedium: require("../assets/fonts/Poppins-Medium.ttf"),
    PoppinsSemiBold: require("../assets/fonts/Poppins-SemiBold.ttf"),
    PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
    PoppinsExtraBold: require("../assets/fonts/Poppins-ExtraBold.ttf"),
    PoppinsBlack: require("../assets/fonts/Poppins-Black.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack initialRouteName="(screens)/SplashScreen">
        <Stack.Screen
          name="(screens)/SplashScreen"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(screens)/OnBoarding"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(screens)/LoginScreen"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(screens)/SignupScreen"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(screens)/PersonalDetails"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(screens)/ForgetPassword"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(screens)/OTPScreen"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(screens)/ResetPassword"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
