import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useFonts } from "expo-font";
import { Provider } from "react-redux";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import * as Notifications from "expo-notifications";
import PushTokenManager from "@/components/Specific/PushTokenManager";

import { store } from "./redux/store";

/* 🔔 GLOBAL NOTIFICATION HANDLER */

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true, // replaces shouldShowAlert
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
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
    <Provider store={store}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <PushTokenManager />
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
          <Stack.Screen
            name="(screens)/Main/DriveToScreen"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(screens)/Main/VisitSchedule"
            options={{ headerShown: false }}
          />

          {/* Profile */}
          <Stack.Screen
            name="(screens)/Profile/EditPersonalDetails"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(screens)/Profile/MyItems"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(screens)/Profile/ItemEdit"
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
    </Provider>
  );
}
