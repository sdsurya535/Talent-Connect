import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, UserCheck, Send, Eye } from "lucide-react";

const NotificationAnalytics = () => {
  // Sample data - in a real app, this would come from your backend
  const stats = [
    {
      title: "Total Notifications Sent",
      value: "2,847",
      change: "+12.5%",
      icon: Bell,
      description: "Last 30 days",
    },
    {
      title: "Notification Views",
      value: "1,924",
      change: "+8.2%",
      icon: Eye,
      description: "67.6% open rate",
    },
    {
      title: "Applications Received",
      value: "849",
      change: "+24.3%",
      icon: Send,
      description: "29.8% conversion",
    },
    {
      title: "Active Students",
      value: "1,284",
      change: "+4.5%",
      icon: UserCheck,
      description: "Currently engaged",
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="dark:border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center space-x-2">
                <span
                  className={`text-xs ${
                    stat.change.startsWith("+")
                      ? "text-green-500 dark:text-green-400"
                      : "text-red-500 dark:text-red-400"
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-xs text-muted-foreground">
                  {stat.description}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default NotificationAnalytics;
