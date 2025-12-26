import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { store } from "@/app/redux/store";
import { clearTokensAsync } from "@/app/redux/features/authSlice";
import { router } from "expo-router";

export const BASE_URL = "https://giveloans.com";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ===================== REQUEST INTERCEPTOR ===================== */
apiClient.interceptors.request.use(
  async (config) => {
    const skipAuthEndpoints = [
      "/login",
      "/signup",
      "/otp-verify",
      "/forgot",
      "/reset",
      "/otp-resend",
    ];

    const shouldSkip = skipAuthEndpoints.some((endpoint) =>
      config.url?.endsWith(endpoint)
    );

    if (!shouldSkip) {
      const token = await AsyncStorage.getItem("accessToken");

      // 🚨 prevent "null" / "undefined" string bug
      if (token && token !== "null" && token !== "undefined") {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ===================== RESPONSE INTERCEPTOR ===================== */
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.log("🚨 401 detected – force logout");

      // 1️⃣ Clear Redux + AsyncStorage
      store.dispatch(clearTokensAsync());

      // 2️⃣ Hard redirect to Login
      router.replace("/Login/LoginScreen");

      // OPTIONAL: you can emit an event or redux action here
    }

    return Promise.reject(error);
  }
);

export default apiClient;
