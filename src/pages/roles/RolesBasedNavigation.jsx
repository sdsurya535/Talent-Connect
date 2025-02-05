import React, { useState, useEffect } from "react";
import {
  Shield,
  Users,
  UserCircle,
  Settings,
  FileText,
  Trash2,
  Plus,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const RoleBasedNavigation = () => {
  // Static definitions to avoid async issues
  const ROLES = {
    ADMIN: "admin",
    USER: "user",
    GUEST: "guest",
  };

  const PERMISSIONS = {
    admin: ["read", "write", "delete", "manage"],
    user: ["read", "write"],
    guest: ["read"],
  };

  const [currentRole, setCurrentRole] = useState(ROLES.GUEST);
  const [availableRoles, setAvailableRoles] = useState([ROLES.GUEST]);
  const [menuItems, setMenuItems] = useState([]);

  const hasPermission = (permission) => {
    return PERMISSIONS[currentRole]?.includes(permission) || false;
  };

  // Define icons and colors
  const roleIcons = {
    [ROLES.ADMIN]: <Shield className="h-6 w-6" />,
    [ROLES.USER]: <UserCircle className="h-6 w-6" />,
    [ROLES.GUEST]: <Users className="h-6 w-6" />,
  };

  const roleColors = {
    [ROLES.ADMIN]: "bg-purple-100 text-purple-800 hover:bg-purple-200",
    [ROLES.USER]: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    [ROLES.GUEST]: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  };

  // Define menu items
  const allMenuItems = [
    {
      icon: <FileText className="h-6 w-6" />,
      label: "View Documents",
      permission: "read",
      onClick: () => console.log("Viewing documents"),
      bgColor: "bg-blue-50 hover:bg-blue-100",
    },
    {
      icon: <Plus className="h-6 w-6" />,
      label: "Create Document",
      permission: "write",
      onClick: () => console.log("Creating document"),
      bgColor: "bg-green-50 hover:bg-green-100",
    },
    {
      icon: <Trash2 className="h-6 w-6" />,
      label: "Delete Documents",
      permission: "delete",
      onClick: () => console.log("Deleting documents"),
      bgColor: "bg-red-50 hover:bg-red-100",
    },
    {
      icon: <Settings className="h-6 w-6" />,
      label: "Manage System",
      permission: "manage",
      onClick: () => console.log("Managing system"),
      bgColor: "bg-purple-50 hover:bg-purple-100",
    },
  ];

  // Initial setup
  useEffect(() => {
    // Set initial roles - replace this with your actual role logic
    setAvailableRoles([ROLES.USER, ROLES.GUEST]);
    setCurrentRole(ROLES.USER);
  }, []);

  // Update menu items when role changes
  useEffect(() => {
    const filteredItems = allMenuItems.filter((item) =>
      hasPermission(item.permission)
    );
    setMenuItems(filteredItems);
  }, [currentRole]);

  const handleRoleChange = (role) => {
    if (availableRoles.includes(role)) {
      setCurrentRole(role);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Role Selection */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Select Role</h2>
        <div className="flex flex-wrap gap-4">
          {Object.values(ROLES).map((role) => (
            <button
              key={role}
              onClick={() => handleRoleChange(role)}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg
                transition-colors duration-200
                ${roleColors[role]}
                ${
                  !availableRoles.includes(role)
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }
                ${
                  currentRole === role
                    ? "ring-2 ring-offset-2 ring-purple-500"
                    : ""
                }
              `}
              disabled={!availableRoles.includes(role)}
            >
              {roleIcons[role]}
              <span className="font-medium capitalize">{role}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Available Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Available Actions</h2>
        {menuItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className={`
                  flex flex-col items-center justify-center p-6 rounded-lg
                  ${item.bgColor}
                  transition-colors duration-200
                  text-gray-800 hover:shadow-md
                `}
              >
                {item.icon}
                <span className="mt-2 font-medium text-sm">{item.label}</span>
              </button>
            ))}
          </div>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No actions available for current role.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default RoleBasedNavigation;
