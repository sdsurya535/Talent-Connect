import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

import PropTypes from "prop-types";

const NotificationItem = ({ title, message, time, isRead }) => (
  <div
    className={`p-3 border-b last:border-b-0 border-gray-200 dark:border-gray-700 
    ${!isRead ? "bg-blue-50 dark:bg-blue-900/20" : ""} 
    hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer`}
  >
    <div className="flex justify-between items-start">
      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
        {title}
      </h4>
      <span className="text-xs text-gray-500 dark:text-gray-400">{time}</span>
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{message}</p>
  </div>
);

const NotificationsPopover = () => {
  // Example notifications - in a real app, these would come from props or a state management system
  const notifications = [
    {
      id: 1,
      title: "New Message",
      message: "You have received a new message from John Doe",
      time: "5m ago",
      isRead: false,
    },
    {
      id: 2,
      title: "System Update",
      message: "System maintenance scheduled for tonight",
      time: "1h ago",
      isRead: false,
    },
    {
      id: 3,
      title: "Welcome!",
      message: "Welcome to our platform. Get started with our quick tour",
      time: "2h ago",
      isRead: true,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="relative text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 text-xs flex items-center justify-center bg-red-500 text-white rounded-full">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Notifications
            </h3>
            <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
              Mark all as read
            </button>
          </div>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.map((notification) => (
            <NotificationItem key={notification.id} {...notification} />
          ))}
        </div>
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-center">
          <Link
            to="/notifications"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline block w-full"
          >
            View all notifications
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
};
NotificationItem.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  isRead: PropTypes.bool.isRequired,
};

export default NotificationsPopover;
