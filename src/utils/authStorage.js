// authStorage.js
import CryptoJS from "crypto-js";

const AUTH_KEY = "auth_data";
const SECRET_KEY = "your-fallback-secret-key";

// Encrypt data
const encrypt = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

// Decrypt data
const decrypt = (ciphertext) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
};

// Save auth data including tokens and user info
export const saveAuthData = (accessToken, refreshToken, user, roles) => {
  try {
    const authData = {
      accessToken,
      refreshToken,
      user,
      roles: Array.isArray(roles) ? roles : [roles].filter(Boolean),
      timestamp: new Date().getTime(),
    };

    const encryptedData = encrypt(authData);
    localStorage.setItem(AUTH_KEY, encryptedData);

    return true;
  } catch (error) {
    console.error("Failed to save auth data:", error);
    return false;
  }
};

// Get auth data
export const getAuthData = () => {
  try {
    const encryptedData = localStorage.getItem(AUTH_KEY);
    if (!encryptedData) return null;

    const authData = decrypt(encryptedData);
    if (!authData) return null;

    // Basic validation of stored data
    if (!authData.accessToken || !authData.user) {
      clearAuthData();
      return null;
    }

    return authData;
  } catch (error) {
    console.error("Failed to get auth data:", error);
    return null;
  }
};

// Get specific tokens
export const getTokens = () => {
  const authData = getAuthData();
  if (!authData) return null;

  return {
    accessToken: authData.accessToken,
    refreshToken: authData.refreshToken,
  };
};

export const getAccessToken = () => {
  const authData = getAuthData();
  return authData?.accessToken;
};

export const getRefreshToken = () => {
  const authData = getAuthData();
  return authData?.refreshToken;
};

// Get roles
export const getRoles = () => {
  const authData = getAuthData();
  return authData?.roles || [];
};

// Get user data
export const getUser = () => {
  const authData = getAuthData();
  return authData?.user || null;
};

// Clear auth data
export const clearAuthData = () => {
  try {
    localStorage.removeItem(AUTH_KEY);
    return true;
  } catch (error) {
    console.error("Failed to clear auth data:", error);
    return false;
  }
};

// Check if authenticated
export const isAuthenticated = () => {
  const authData = getAuthData();
  return !!(authData?.accessToken && authData?.user);
};
