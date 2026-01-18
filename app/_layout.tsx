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

// notification
import { registerForPushNotifications } from "@/constants/utils/notifications";

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

  /* 🔔 NOTIFICATION SETUP */
  // useEffect(() => {
  //   let foregroundSub: Notifications.Subscription;
  //   let responseSub: Notifications.Subscription;

  //   const setupNotifications = async () => {
  //     // 1️⃣ Register push token
  //     const token = await registerForPushNotificationsAsync();

  //     if (token) {
  //       try {
  //         await apiClient.post("/api/user/save-push-token", {
  //           pushToken: token,
  //         });
  //       } catch (e) {
  //         console.log("Failed to save push token");
  //       }
  //     }

  //     // 2️⃣ Foreground notifications
  //     foregroundSub =
  //       Notifications.addNotificationReceivedListener(notification => {
  //         console.log(
  //           "🔔 Foreground notification:",
  //           notification.request.content
  //         );
  //       });

  //     // 3️⃣ Background / tap handling
  //     responseSub =
  //       Notifications.addNotificationResponseReceivedListener(response => {
  //         const data =
  //           response.notification.request.content.data || {};

  //         console.log("🔔 Notification tapped:", data);

  //         /**
  //          * Expected backend payload:
  //          * data: { screen: "Appointments", appointmentUid: "123" }
  //          */

  //         if (data.screen === "Appointments") {
  //           router.push("/(tabs)/Appointments");
  //         }

  //         if (data.screen === "VisitSchedule") {
  //           router.push({
  //             pathname: "/(screens)/Main/VisitSchedule",
  //             params: { uuid: data.appointmentUid },
  //           });
  //         }

  //         if (data.screen === "Chat") {
  //           router.push({
  //             pathname: "/(screens)/Main/ChatScreen",
  //             params: { chatId: data.chatId },
  //           });
  //         }
  //       });
  //   };

  //   setupNotifications();

  //   return () => {
  //     foregroundSub?.remove();
  //     responseSub?.remove();
  //   };
  // }, []);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <Provider store={store}>
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
