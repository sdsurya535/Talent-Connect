import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../ui/button";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { User, Settings, LogOut, ChevronDown, Moon, Sun } from "lucide-react";
import NotificationsPopover from "./notification/NotificationPopover";

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Effect to sync theme class on mount
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      window.history.replaceState(null, "", "/admin/login");
      navigate("/admin/login", { replace: true });
      window.history.pushState(null, "", "/admin/login");
      window.addEventListener("popstate", () => {
        window.history.forward();
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="container px-4 py-4 mx-auto">
        <div className="flex items-center justify-end">
          <div className="flex items-center space-x-4">
            {isAuthenticated && <NotificationsPopover />}

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            <nav className="flex items-center space-x-4">
              {isAuthenticated ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <div className="flex items-center">
                        <span className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full">
                          {user?.name?.charAt(0).toUpperCase()}
                        </span>
                        <span className="ml-2">{user?.name}</span>
                        <ChevronDown className="ml-2 w-4 h-4" />
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <div className="space-y-2">
                      <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {user?.email}
                        </p>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors text-gray-700 dark:text-gray-300"
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors text-gray-700 dark:text-gray-300"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 p-2 w-full text-left text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
              ) : (
                <>
                  <Link to="/talent-login">
                    <Button
                      variant="ghost"
                      className="text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button
                      variant="default"
                      className="text-sm bg-primary hover:bg-primary/90"
                    >
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
