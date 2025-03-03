import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { getAuthData } from "../utils/tokenService";
import { checkUserHasRole } from "../utils/roleService";

const PrivateRoute = ({ children, requiredRoles = [] }) => {
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Check both Redux auth state and encrypted storage
  const storedAuthData = getAuthData();
  const isStorageValid = !!storedAuthData?.accessToken;

  // Verify both Redux state and storage state
  if (!isAuthenticated || !isStorageValid) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Check if user has required roles using role service
  if (requiredRoles.length > 0 && !checkUserHasRole(requiredRoles)) {
    return <Navigate to="/admin/unauthorized" replace />;
  }

  return children;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRoles: PropTypes.arrayOf(PropTypes.string),
};

export default PrivateRoute;
