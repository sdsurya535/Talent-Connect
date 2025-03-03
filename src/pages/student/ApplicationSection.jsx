import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Users, Filter } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import StudentDashboard from "./StudentDashboard";
import { useTheme } from "../../hooks/useTheme";
import { useApplicationContext } from "@/context/ApplicationContext";

// Counter animation component
const AnimatedCounter = ({ value, duration = 1000, className }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;

      const percentage = Math.min(progress / duration, 1);
      const currentCount = Math.floor(value * percentage);

      setCount(currentCount);

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration]);

  return <div className={className}>{count}</div>;

  
};

// Stat Card Component
const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  loading,
  colorClass,
  isDark,
}) => {
  return (
    <Card
      className={`border-l-4 border-t-4 ${colorClass} hover:shadow-lg transition-shadow ${
        isDark ? "bg-gray-800" : "bg-white"
      }`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle
          className={`text-sm font-medium ${
            isDark
              ? `${colorClass.replace("border-l-", "text-")}-300`
              : `${colorClass.replace("border-l-", "text-")}-900`
          }`}
        >
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {loading ? (
          <>
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-3 w-24" />
          </>
        ) : (
          <>
            <AnimatedCounter
              value={value}
              className={`text-2xl font-bold ${
                isDark
                  ? `${colorClass.replace("border-l-", "text-")}-300`
                  : `${colorClass.replace("border-l-", "text-")}-700`
              }`}
            />
            <p
              className={`text-xs ${
                isDark
                  ? `${colorClass.replace("border-l-", "text-")}-400`
                  : `${colorClass.replace("border-l-", "text-")}-600`
              }`}
            >
              {subtitle}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
};
StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  subtitle: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  loading: PropTypes.bool.isRequired,
  colorClass: PropTypes.string.isRequired,
  isDark: PropTypes.bool.isRequired,
};

const ApplicationSection = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { stats, fetchData, loading } = useApplicationContext();

  useEffect(() => {
    fetchData({});
  }, [fetchData]);

  const statsData = [
    {
      title: "Total Applications",
      value: stats.total,
      subtitle: "From all universities",
      colorClass: "border-l-blue-500 border-t-blue-500",
      icon: <Users className="h-4 w-4 text-blue-700" />,
    },
    {
      title: "Shortlisted",
      value: stats.shortlisted,
      subtitle: "Qualified candidates",
      colorClass: "border-l-emerald-500 border-t-emerald-500",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-4 w-4 text-emerald-500"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      title: "Average CGPA",
      value: stats.avgCGPA,
      subtitle: "Across all applications",
      colorClass: "border-l-purple-500 border-t-purple-500",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-4 w-4 text-purple-700"
        >
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      ),
    },
  ];

  return (
    <div
      className={`space-y-4 p-4 pt-2 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
    >
      {/* Section Header */}
      <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:items-center md:justify-between">
        <div>
          <h2
            className={`text-2xl font-semibold tracking-tight ${
              isDark ? "text-indigo-200" : "text-indigo-900"
            }`}
          >
            Student Applications
          </h2>
          <p
            className={`text-sm ${
              isDark ? "text-indigo-300" : "text-indigo-600"
            }`}
          >
            Manage and track student job applications
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className={`${
              isDark
                ? "border-indigo-700 hover:bg-indigo-900 text-indigo-300"
                : "border-indigo-200 hover:bg-indigo-50 text-indigo-600"
            }`}
            onClick={() => fetchData({})}
            disabled={loading}
          >
            <Filter
              className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            {loading ? "Refreshing..." : "Refresh Stats"}
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {statsData.map((stat, index) => (
          <StatCard key={index} {...stat} loading={loading} isDark={isDark} />
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList
          className={`border ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <TabsTrigger
            value="all"
            className={`${
              isDark
                ? "data-[state=active]:bg-indigo-900 data-[state=active]:text-indigo-200"
                : "data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700"
            }`}
          >
            All Applications
          </TabsTrigger>
          <TabsTrigger
            value="shortlisted"
            className={`${
              isDark
                ? "data-[state=active]:bg-indigo-900 data-[state=active]:text-indigo-200"
                : "data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700"
            }`}
          >
            Shortlisted
          </TabsTrigger>
          <TabsTrigger
            value="pending"
            className={`${
              isDark
                ? "data-[state=active]:bg-indigo-900 data-[state=active]:text-indigo-200"
                : "data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700"
            }`}
          >
            Pending
          </TabsTrigger>
          <TabsTrigger
            value="rejected"
            className={`${
              isDark
                ? "data-[state=active]:bg-indigo-900 data-[state=active]:text-indigo-200"
                : "data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700"
            }`}
          >
            Rejected
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card className={`px-4 py-4 ${isDark ? "bg-gray-800" : "bg-white"}`}>
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            ) : (
              <StudentDashboard status="all" key="all-tab" />
            )}
          </Card>
        </TabsContent>
        <TabsContent value="shortlisted">
          <Card className={isDark ? "bg-gray-800" : "bg-white"}>
            <CardHeader>
              <CardTitle
                className={isDark ? "text-indigo-200" : "text-indigo-900"}
              >
                Shortlisted Applications
              </CardTitle>
              <CardDescription
                className={isDark ? "text-indigo-300" : "text-indigo-600"}
              >
                View all shortlisted candidates
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              ) : (
                <StudentDashboard status="shortlisted" key="shortlisted-tab" />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pending">
          <Card className={isDark ? "bg-gray-800" : "bg-white"}>
            <CardHeader>
              <CardTitle
                className={isDark ? "text-indigo-200" : "text-indigo-900"}
              >
                Pending Applications
              </CardTitle>
              <CardDescription
                className={isDark ? "text-indigo-300" : "text-indigo-600"}
              >
                Applications awaiting review
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              ) : (
                <StudentDashboard status="pending" key="pending-tab" />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="rejected">
          <Card className={isDark ? "bg-gray-800" : "bg-white"}>
            <CardHeader>
              <CardTitle
                className={isDark ? "text-indigo-200" : "text-indigo-900"}
              >
                Rejected Applications
              </CardTitle>
              <CardDescription
                className={isDark ? "text-indigo-300" : "text-indigo-600"}
              >
                Previously rejected applications
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              ) : (
                <StudentDashboard status="rejected" key="rejected-tab" />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

AnimatedCounter.propTypes = {
  value: PropTypes.number.isRequired,
  duration: PropTypes.number,
  className: PropTypes.string,
};

export default ApplicationSection;
