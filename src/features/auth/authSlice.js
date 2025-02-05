import { createSlice } from "@reduxjs/toolkit";
import { requestOTP, verifyOTP, login, logout } from "./authAPI";
import { getAuthData } from "../../utils/tokenService";
import { getCurrentUserRoles } from "../../utils/roleService";

// Initialize state from encrypted storage if available
const getInitialState = () => {
  const storedData = getAuthData();
  if (storedData?.user && storedData?.accessToken) {
    return {
      user: storedData.user,
      roles: getCurrentUserRoles(), // Use role service to get normalized roles
      isAuthenticated: true,
      isLoading: false,
      error: null,
      otpRequested: false,
      otpVerified: false,
    };
  }
  return {
    user: null,
    roles: [],
    isAuthenticated: false,
    isLoading: false,
    error: null,
    otpRequested: false,
    otpVerified: false,
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    setCredentials: (state, { payload }) => {
      state.user = payload.user;
      state.roles = Array.isArray(payload.roles)
        ? payload.roles
        : [payload.user?.role].filter(Boolean);
      state.isAuthenticated = true;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.roles = [];
      state.isAuthenticated = false;
      state.otpRequested = false;
      state.otpVerified = false;
    },
    // New reducer to sync with storage
    syncWithStorage: (state) => {
      const storedData = getAuthData();
      if (storedData?.user) {
        state.user = storedData.user;
        state.roles = getCurrentUserRoles();
        state.isAuthenticated = true;
      } else {
        state.user = null;
        state.roles = [];
        state.isAuthenticated = false;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Request OTP
      .addCase(requestOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(requestOTP.fulfilled, (state) => {
        state.isLoading = false;
        state.otpRequested = true;
        state.error = null;
      })
      .addCase(requestOTP.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })

      // Verify OTP
      .addCase(verifyOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.otpVerified = true;
        state.user = payload.user;
        state.roles = Array.isArray(payload.roles)
          ? payload.roles
          : [payload.user?.role].filter(Boolean);
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(verifyOTP.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = payload.user;
        state.roles = Array.isArray(payload.roles)
          ? payload.roles
          : [payload.user?.role].filter(Boolean);
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        return getInitialState();
      })
      .addCase(logout.rejected, (state, { payload }) => {
        state.error = payload;
      });
  },
});

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectUserRoles = (state) => state.auth.roles;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthError = (state) => state.auth.error;

export const { setCredentials, clearCredentials, syncWithStorage } =
  authSlice.actions;
export default authSlice.reducer;
