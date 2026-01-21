// hooks/useSyncPushToken.ts
import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import apiClient from "@/app/apis/apiClient";
import { registerForPushNotifications } from "@/constants/utils/notifications";
import { router } from "expo-router";
import { selectIsLoggedIn } from "@/app/redux/features/authSlice";
export const useSyncPushToken = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) return; // Only run if logged in

    let responseSub: Notifications.EventSubscription;

    const syncPushToken = async () => {
      try {
        const newToken = await registerForPushNotifications();
        if (!newToken) return;

        // Get user profile
        const res = await apiClient.get("/api/user/me");
        const user = res.data?.data;
        const savedToken = user?.fcmToken;

        if (!savedToken || savedToken !== newToken) {
          await apiClient.patch("/api/user/me", { fcmToken: newToken });
          console.log("✅ FCM token updated");
        } else {
          console.log("ℹ️ FCM token already up to date");
        }
      } catch (error: any) {
        console.log("❌ Push token sync failed", error);
      }
    };

    syncPushToken();

    responseSub = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data || {};
        if (data.screen === "Appointments") router.push("/Schedule");
        if (data.screen === "VisitSchedule")
          router.push("/(screens)/Main/VisitSchedule");
        if (data.screen === "Chat") router.push("/(screens)/Main/ChatScreen");
      },
    );

    return () => responseSub?.remove();
  }, [isLoggedIn]);
};
