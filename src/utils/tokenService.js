// Encryption key - in production, this should be stored securely
const ENCRYPTION_KEY = "Eduslils-34-98-fndae32l";
const STORAGE_KEY = "auth-data";

// Simple encryption function
const encrypt = (text) => {
  const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
  const byteHex = (n) => ("0" + Number(n).toString(16)).substr(-2);
  const applySaltToChar = (code) =>
    textToChars(ENCRYPTION_KEY).reduce((a, b) => a ^ b, code);

  return text
    .split("")
    .map(textToChars)
    .map(applySaltToChar)
    .map(byteHex)
    .join("");
};

// Simple decryption function
const decrypt = (encoded) => {
  const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
  const applySaltToChar = (code) =>
    textToChars(ENCRYPTION_KEY).reduce((a, b) => a ^ b, code);

  return encoded
    .match(/.{1,2}/g)
    .map((hex) => parseInt(hex, 16))
    .map(applySaltToChar)
    .map((charCode) => String.fromCharCode(charCode))
    .join("");
};

// Encrypt an object by converting it to a string first
const encryptObject = (obj) => {
  const stringified = JSON.stringify(obj);
  return encrypt(stringified);
};

// Decrypt an encrypted object string back to an object
const decryptObject = (encrypted) => {
  const decrypted = decrypt(encrypted);
  return JSON.parse(decrypted);
};

export const saveAuthData = (userData, accessToken, refreshToken) => {
  const dataToStore = {
    user: userData,
    accessToken,
    refreshToken,
  };

  const encryptedData = encryptObject(dataToStore);
  localStorage.setItem(STORAGE_KEY, encryptedData);
};

export const getAuthData = () => {
  const encryptedData = localStorage.getItem(STORAGE_KEY);
  if (!encryptedData) return null;

  try {
    return decryptObject(encryptedData);
  } catch (error) {
    console.error("Error decrypting auth data:", error);
    return null;
  }
};

export const getAccessToken = () => {
  const data = getAuthData();
  return data?.accessToken;
};

export const getRefreshToken = () => {
  const data = getAuthData();
  return data?.refreshToken;
};

export const getUserData = () => {
  const data = getAuthData();
  return data?.user;
};

export const clearAuthData = () => {
  localStorage.removeItem(STORAGE_KEY);
};
