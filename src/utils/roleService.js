import { getAuthData } from "./tokenService";

// Define all possible roles
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  GUEST: "guest",
};

// Check if a user has specific roles - works with both array and single role
export const hasRole = (requiredRoles, userRoles = []) => {
  if (!Array.isArray(requiredRoles)) {
    requiredRoles = [requiredRoles];
  }
  if (!Array.isArray(userRoles)) {
    userRoles = [userRoles];
  }
  return requiredRoles.some((role) => userRoles.includes(role));
};

// Get current user's roles from encrypted storage and normalize them
export const getCurrentUserRoles = () => {
  const authData = getAuthData();
  if (!authData?.user) return [];

  // Handle both array of roles and single role string
  const userRole = authData.user.role;
  if (Array.isArray(userRole)) {
    return userRole;
  }
  return userRole ? [userRole] : [];
};

// Check if current user has required roles
export const checkUserHasRole = (requiredRoles) => {
  const currentRoles = getCurrentUserRoles();
  return hasRole(requiredRoles, currentRoles);
};

// Check if role is valid
export const isValidRole = (role) => {
  return Object.values(ROLES).includes(role);
};

// Get highest priority role (assuming admin > user > guest)
export const getHighestRole = (userRoles = []) => {
  if (!Array.isArray(userRoles)) {
    userRoles = [userRoles];
  }

  if (userRoles.includes(ROLES.ADMIN)) return ROLES.ADMIN;
  if (userRoles.includes(ROLES.USER)) return ROLES.USER;
  return ROLES.GUEST;
};

// Role-based permission checking
export const PERMISSIONS = {
  [ROLES.ADMIN]: ["read", "write", "delete", "manage"],
  [ROLES.USER]: ["read", "write"],
  [ROLES.GUEST]: ["read"],
};

export const hasPermission = (permission) => {
  const currentRoles = getCurrentUserRoles();
  const highestRole = getHighestRole(currentRoles);
  return PERMISSIONS[highestRole]?.includes(permission) || false;
};

// Export everything as a service object
const roleService = {
  ROLES,
  hasRole,
  getCurrentUserRoles,
  checkUserHasRole,
  isValidRole,
  getHighestRole,
  PERMISSIONS,
  hasPermission,
};

export default roleService;
