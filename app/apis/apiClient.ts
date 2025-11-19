import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create an Axios instance
const apiClient = axios.create({
  baseURL: "https://giveloans.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to requests, excluding specific endpoints
apiClient.interceptors.request.use(
  async (config) => {
    if (config.url) {
      const skipAuthEndpoints = [
        "/login",
        "/signup",
        "/otp-verify",
        "/forgot",
        "/reset",
        "/me",
        "/otp-resend",
      ];

      // Check if the URL ends with any of the skip endpoints
      const shouldSkip = skipAuthEndpoints.some((endpoint) =>
        config.url?.endsWith(endpoint)
      );

      if (shouldSkip) {
        return config; // Skip adding Authorization header
      }
    }

    const token = await AsyncStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
