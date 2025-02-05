import { useSelector } from 'react-redux';
import { ROLES } from '../utils/roleService';

export const useAuth = () => {
  const { user, roles, isAuthenticated, isLoading } = useSelector((state) => state.auth);

  const hasRole = (requiredRoles) => {
    if (!Array.isArray(requiredRoles)) {
      requiredRoles = [requiredRoles];
    }
    return requiredRoles.some(role => roles.includes(role));
  };

  const isAdmin = () => roles.includes(ROLES.ADMIN);
  const isUser = () => roles.includes(ROLES.USER);

  return {
    user,
    roles,
    isAuthenticated,
    isLoading,
    hasRole,
    isAdmin,
    isUser,
  };
};