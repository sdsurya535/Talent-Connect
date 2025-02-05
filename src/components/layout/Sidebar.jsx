import { NavLink } from "react-router-dom";
import React, { useState, useEffect, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../hooks/useTheme";
import Logo from "../../assets/logo-dark.svg";
import { Icon } from "@iconify/react";
import { ROLES } from "../../utils/roleService";
import PropTypes from "prop-types";

// PropTypes for menu items
const MenuItemShape = {
  title: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string),
  icon: PropTypes.string.isRequired,
  submenu: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
    })
  ),
};

// PropTypes for theme styles
const ThemeStylesShape = {
  sidebar: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  hoverBg: PropTypes.string.isRequired,
  activeBg: PropTypes.string.isRequired,
  subtext: PropTypes.string.isRequired,
  iconButton: PropTypes.string.isRequired,
};

// Memoized MenuItem component to prevent unnecessary re-renders
const MenuItem = memo(
  React.forwardRef(
    ({
      item,
      collapsed,
      isMobile,
      openSubmenu,
      onSubmenuClick,
      onMobileClick,
      themeStyles,
    }) => {
      const isSubmenuOpen = openSubmenu === item.path;

      const submenuVariants = {
        open: {
          opacity: 1,
          height: "auto",
          transition: {
            duration: 0.3,
            ease: "easeInOut",
            staggerChildren: 0.07,
            delayChildren: 0.1,
          },
        },
        closed: {
          opacity: 0,
          height: 0,
          transition: {
            duration: 0.3,
            ease: "easeInOut",
          },
        },
      };

      const submenuItemVariants = {
        open: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.3,
          },
        },
        closed: {
          opacity: 0,
          y: -10,
          transition: {
            duration: 0.3,
          },
        },
      };

      const itemContent = (
        <>
          <Icon
            icon={item.icon}
            width="20"
            height="20"
            className="flex-shrink-0"
          />
          {(!collapsed || isMobile) && (
            <span className="ml-3 whitespace-nowrap">{item.title}</span>
          )}
        </>
      );

      if (item.submenu) {
        return (
          <div className="px-2 mb-1">
            <button
              onClick={() => onSubmenuClick(item.path)}
              className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors duration-200 
              ${themeStyles.text} ${themeStyles.hoverBg} relative group`}
            >
              {itemContent}
              {(!collapsed || isMobile) && (
                <motion.div
                  animate={{ rotate: isSubmenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="ml-auto flex-shrink-0"
                >
                  <Icon
                    icon="material-symbols:expand-more"
                    width="20"
                    height="20"
                  />
                </motion.div>
              )}
            </button>
            <AnimatePresence initial={false}>
              {isSubmenuOpen && (!collapsed || isMobile) && (
                <motion.div
                  variants={submenuVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  className="overflow-hidden ml-4"
                >
                  {item.submenu.map((subItem) => (
                    <motion.div
                      key={subItem.path}
                      variants={submenuItemVariants}
                    >
                      <NavLink
                        to={subItem.path}
                        className={({ isActive }) => `
                          flex items-center px-4 py-2 mt-1 rounded-lg transition-colors duration-200
                          ${isActive ? themeStyles.activeBg : ""} 
                          ${themeStyles.text} ${themeStyles.hoverBg}
                        `}
                        onClick={() => isMobile && onMobileClick()}
                      >
                        <Icon
                          icon={subItem.icon}
                          width="18"
                          height="18"
                          className="flex-shrink-0"
                        />
                        <span className="ml-3 whitespace-nowrap">
                          {subItem.title}
                        </span>
                      </NavLink>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      }

      return (
        <div className="px-2 mb-1">
          <NavLink
            to={item.path}
            className={({ isActive }) => `
              flex items-center px-4 py-2 rounded-lg transition-colors duration-200
              ${isActive ? themeStyles.activeBg : ""} 
              ${themeStyles.text} ${themeStyles.hoverBg}
            `}
            onClick={() => isMobile && onMobileClick()}
          >
            {itemContent}
          </NavLink>
        </div>
      );
    }
  )
);

// Memoized mobile menu button
const MobileMenuButton = memo(
  React.forwardRef(({ showSidebar, toggleSidebar, themeStyles }) => (
    <motion.button
      onClick={toggleSidebar}
      className={`fixed top-4 left-4 z-50 p-2 rounded-lg md:hidden ${themeStyles.iconButton}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle Menu"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={showSidebar ? "close" : "menu"}
          initial={{ opacity: 0, rotate: -180 }}
          animate={{ opacity: 1, rotate: 0 }}
          exit={{ opacity: 0, rotate: 180 }}
          transition={{ duration: 0.2 }}
        >
          <Icon
            icon={
              showSidebar ? "material-symbols:close" : "material-symbols:menu"
            }
            width="24"
            height="24"
          />
        </motion.div>
      </AnimatePresence>
    </motion.button>
  ))
);

const AppSidebar = () => {
  const { theme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const themeStyles = useMemo(
    () => ({
      sidebar:
        theme === "dark"
          ? "bg-gray-800 border-r border-gray-700"
          : "bg-gray-100 border-r border-gray-200",
      text: theme === "dark" ? "text-gray-200" : "text-gray-700",
      hoverBg: theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200",
      activeBg: theme === "dark" ? "bg-gray-700" : "bg-gray-200",
      subtext: theme === "dark" ? "text-gray-400" : "text-gray-500",
      iconButton:
        theme === "dark"
          ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
          : "bg-gray-200 hover:bg-gray-300 text-gray-600",
    }),
    [theme]
  );

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setShowSidebar(!mobile);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = useMemo(
    () => [
      {
        title: "Dashboard",
        path: "/dashboard",
        roles: [ROLES.ADMIN],
        icon: "material-symbols:dashboard",
      },
      {
        title: "Company",
        path: "/company",
        roles: [ROLES.ADMIN],
        icon: "mdi:company",
      },
      {
        title: "Job",
        path: "/job",
        roles: [ROLES.ADMIN],
        icon: "material-symbols:work",
        submenu: [
          {
            title: "Job Posts",
            path: "/job/posts",
            icon: "material-symbols:description",
          },
          {
            title: "Applications",
            path: "/job/applications",
            icon: "material-symbols:list-alt",
          },
          {
            title: "Job Categories",
            path: "/job/categories",
            icon: "material-symbols:category",
          },
        ],
      },
      {
        title: "Internship",
        path: "/internship",
        roles: [ROLES.ADMIN],
        icon: "material-symbols:school",
      },
    ],
    []
  );

  const toggleSidebar = () => {
    if (isMobile) {
      setShowSidebar(!showSidebar);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const handleSubmenuClick = (path) => {
    setOpenSubmenu(openSubmenu === path ? null : path);
  };

  const handleMobileClick = () => {
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  return (
    <>
      <MobileMenuButton
        showSidebar={showSidebar}
        toggleSidebar={toggleSidebar}
        themeStyles={themeStyles}
      />

      <motion.div
        initial={false}
        animate={{
          width: !isMobile && collapsed ? "80px" : "240px",
          x: showSidebar ? 0 : "-100%",
        }}
        transition={{
          type: "spring",
          bounce: 0,
          duration: 0.4,
        }}
        className={`fixed md:relative z-40 h-screen ${themeStyles.sidebar}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex-shrink-0 px-4 py-4">
            <div className="flex items-center justify-between">
              <AnimatePresence mode="wait">
                {(!collapsed || isMobile) && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="md:ml-0 ml-14"
                  >
                    <motion.img
                      src={Logo}
                      alt="Logo"
                      className="w-36 object-contain"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {!isMobile && (
                <motion.button
                  onClick={toggleSidebar}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-1.5 rounded-lg ${themeStyles.iconButton}`}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={collapsed ? "right" : "left"}
                      initial={{ opacity: 0, rotate: -180 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 180 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icon
                        icon={
                          collapsed
                            ? "material-symbols:chevron-right"
                            : "material-symbols:chevron-left"
                        }
                        width="20"
                        height="20"
                      />
                    </motion.div>
                  </AnimatePresence>
                </motion.button>
              )}
            </div>
          </div>

          {/* Menu Items */}
          <div className="flex-grow overflow-y-auto overflow-x-hidden scrollbar-hide">
            {menuItems.map((item) => (
              <MenuItem
                key={item.path}
                item={item}
                collapsed={collapsed}
                isMobile={isMobile}
                openSubmenu={openSubmenu}
                onSubmenuClick={handleSubmenuClick}
                onMobileClick={handleMobileClick}
                themeStyles={themeStyles}
              />
            ))}
          </div>

          {/* Feedback Button */}
          <div className="flex-shrink-0">
            <div
              className={`p-4 border-t ${
                theme === "dark" ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <NavLink to="/feedback">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 
                    ${themeStyles.text} ${themeStyles.hoverBg}`}
                >
                  <Icon
                    icon="material-symbols:feedback"
                    width="20"
                    height="20"
                    className="flex-shrink-0"
                  />
                  {(!collapsed || isMobile) && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="whitespace-nowrap"
                    >
                      Feedback
                    </motion.span>
                  )}
                </motion.button>
              </NavLink>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Overlay */}
      <AnimatePresence>
        {isMobile && showSidebar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setShowSidebar(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

// PropTypes for MenuItem component
MenuItem.propTypes = {
  item: PropTypes.shape(MenuItemShape).isRequired,
  collapsed: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool.isRequired,
  openSubmenu: PropTypes.string,
  onSubmenuClick: PropTypes.func.isRequired,
  onMobileClick: PropTypes.func.isRequired,
  themeStyles: PropTypes.shape(ThemeStylesShape).isRequired,
};

MenuItem.displayName = "MenuItem";

// PropTypes for MobileMenuButton component
MobileMenuButton.propTypes = {
  showSidebar: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
  themeStyles: PropTypes.shape(ThemeStylesShape).isRequired,
};

MobileMenuButton.displayName = "MobileMenuButton";

// PropTypes for AppSidebar component
AppSidebar.propTypes = {
  className: PropTypes.string,
};

export default AppSidebar;
