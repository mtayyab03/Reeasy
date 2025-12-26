import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "@/app/apis/apiClient";
import { RootState } from "../store";

/* ---------------------- Types ---------------------- */

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}
export interface AuthError {
  status?: number;
  message: string;
}
/* ---------------------- Thunks ---------------------- */

// Load tokens from storage
export const loadTokens = createAsyncThunk("auth/loadTokens", async () => {
  const accessToken = await AsyncStorage.getItem("accessToken");
  const refreshToken = await AsyncStorage.getItem("refreshToken");

  return {
    accessToken:
      accessToken && accessToken !== "null" && accessToken !== "undefined"
        ? accessToken
        : null,
    refreshToken:
      refreshToken && refreshToken !== "null" && refreshToken !== "undefined"
        ? refreshToken
        : null,
  };
});

// Login user
export const login = createAsyncThunk<
  LoginResponse,
  LoginPayload,
  { rejectValue: AuthError }
>("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await apiClient.post("/api/auth/login", {
      email,
      password,
    });

    const { accessToken, refreshToken } = response.data.data;

    await AsyncStorage.setItem("accessToken", accessToken);
    await AsyncStorage.setItem("refreshToken", refreshToken);

    return { accessToken, refreshToken };
  } catch (error: any) {
    if (error.response) {
      return rejectWithValue({
        status: error.response.status, // ✅ THIS IS KEY
        message: error.response.data?.message || "Authentication failed",
      });
    }

    return rejectWithValue({
      message: "Network error",
    });
  }
});

// Clear tokens
export const clearTokensAsync = createAsyncThunk(
  "auth/clearTokens",
  async () => {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
  }
);

/* ---------------------- Slice ---------------------- */

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Load tokens
      .addCase(loadTokens.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        loadTokens.fulfilled,
        (
          state,
          action: PayloadAction<{
            accessToken: string | null;
            refreshToken: string | null;
          }>
        ) => {
          state.status = "succeeded";
          state.accessToken = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;
        }
      )
      .addCase(loadTokens.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to load tokens";
      })

      // Login
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.status = "succeeded";
          state.accessToken = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;
          state.error = null;
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Login failed";
      })

      // Clear tokens
      .addCase(clearTokensAsync.fulfilled, (state) => {
        state.accessToken = null;
        state.refreshToken = null;
        state.status = "idle";
        state.error = null;
      });
  },
});

/* ---------------------- Selectors ---------------------- */

export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;
