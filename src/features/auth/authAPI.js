// authAPI.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axios";
import {
  saveAuthData,
  clearAuthData,
  getRefreshToken,
} from "../../utils/tokenService";

// Request OTP
export const requestOTP = createAsyncThunk(
  "auth/requestOTP",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/token/adminLogin", {
        email,
        user_type: 1,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send OTP"
      );
    }
  }
);

export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/token/adminVerifyOtp", {
        email,
        otp,
        user_type: 1,
      });

      const { accessToken, refreshToken, user } = response.data;

      // Save all auth data with encryption
      saveAuthData(user, accessToken, refreshToken);

      // Return user data for the Redux store
      return {
        user: {
          ...user,
          role: user.role || "user",
        },
        roles: [user.role] || ["user"],
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to verify OTP"
      );
    }
  }
);

// Login
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/login", credentials);
      const { accessToken, refreshToken, user } = response.data;

      // Save all auth data with encryption
      saveAuthData(user, accessToken, refreshToken);

      return {
        user,
        roles: user.roles || [],
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// Logout
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        console.warn("No refresh token found during logout");
        clearAuthData();
        return null;
      }

      await axiosInstance.post("/auth/logout", {
        refreshToken: refreshToken,
      });

      clearAuthData();
      return null;
    } catch (error) {
      console.error("Backend Error:", error.response?.data?.message);
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);
