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
      <Stack initialRouteName="(screens)/Login/SplashScreen">
        <Stack.Screen
          name="(screens)/Login/SplashScreen"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(screens)/Login/OnBoarding"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(screens)/Login/LoginScreen"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(screens)/Login/SignupScreen"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(screens)/Login/PersonalDetails"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(screens)/Login/ForgetPassword"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(screens)/Login/OTPScreen"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(screens)/Login/ResetPassword"
          options={{ headerShown: false }}
        />

        {/* Main */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(screens)/Main/ItemDetails"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(screens)/Main/EventMapListView"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(screens)/Main/ChatScreen"
          options={{ headerShown: false }}
        />

        {/* Screen */}
        <Stack.Screen
          name="(screens)/Profile/EditPersonalDetails"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(screens)/Profile/MyItems"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(screens)/Profile/FavoriteScreen"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(screens)/Profile/ChangePassword"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(screens)/Profile/Languages"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(screens)/Profile/SupportScreen"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(screens)/Profile/TermsCondition"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
