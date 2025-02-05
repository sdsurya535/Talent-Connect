import { useEffect } from "react";
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
import StudentDashboard from "./StudentDashboard";
import { useTheme } from "../../hooks/useTheme";
import { useApplicationContext } from "@/context/ApplicationContext";

const ApplicationSection = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { stats, fetchData } = useApplicationContext();

  useEffect(() => {
    fetchData({});
  }, [fetchData]);
 
  //     total: 0,
  //     shortlisted: 0,
  //     avgCGPA: 0,
  //   });

  //   useEffect(() => {
  //     fetchStats();
  //   }, []);

  //   const fetchStats = async () => {
  //     try {
  //       // First fetch company details - keeping this API as is
  //       const companyResponse = await fetch(
  //         "http://192.168.0.136:8000/documents/companyDetails"
  //       );
  //       const companyData = await companyResponse.json();

  //       // Create FormData and append all required fields
  //       const formData = new FormData();
  //       formData.append("companyId", companyData.companyResponse[0].company_id);
  //       formData.append("jdId", companyData.jdResponse[0].jd_id);
  //       formData.append(
  //         "jdLocation",
  //         companyData.locationResponse[0].jd_location
  //       );
  //       formData.append("pageSize", 8); // Large number to get all data for stats
  //       formData.append("pageNumber", 1);
  //       formData.append("status", "all");

  //       // Make the POST request with FormData
  //       const response = await fetch(
  //         "http://192.168.0.136:8000/talent/connect/applied/student2",
  //         {
  //           method: "POST",
  //           body: formData,
  //         }
  //       );
  //       const data = await response.json();
  //       const students = data.studentsResponse;

  //       // Calculate stats from the complete dataset
  //       const totalApplications = students.length;
  //       const shortlisted = students.filter(
  //         (app) => app.status === "shortlisted"
  //       ).length;
  //       const avgCGPA =
  //         students.reduce((sum, app) => sum + parseFloat(app.btech_cgpa), 0) /
  //         students.length;

  //       setStats({
  //         total: totalApplications,
  //         shortlisted: shortlisted,
  //         avgCGPA: avgCGPA.toFixed(1),
  //       });
  //     } catch (error) {
  //       console.error("Error fetching stats:", error);
  //     }
  //   };

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
          >
            <Filter className="mr-2 h-4 w-4" />
            Refresh Stats
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card
          className={`border-l-4 border-l-blue-500 border-t-4 border-t-blue-500  hover:shadow-lg transition-shadow ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle
              className={`text-sm font-medium ${
                isDark ? "text-blue-300" : "text-blue-900"
              }`}
            >
              Total Applications
            </CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                isDark ? "text-blue-300" : "text-blue-700"
              }`}
            >
              {stats.total}
            </div>
            <p
              className={`text-xs ${
                isDark ? "text-blue-400" : "text-blue-600"
              }`}
            >
              From all universities
            </p>
          </CardContent>
        </Card>
        <Card
          className={`border-l-4 border-l-emerald-500 border-t-4 border-t-emerald-500 hover:shadow-lg transition-shadow ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle
              className={`text-sm font-medium ${
                isDark ? "text-emerald-300" : "text-emerald-900"
              }`}
            >
              Shortlisted
            </CardTitle>
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
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                isDark ? "text-emerald-300" : "text-emerald-700"
              }`}
            >
              {stats.shortlisted}
            </div>
            <p
              className={`text-xs ${
                isDark ? "text-emerald-400" : "text-emerald-600"
              }`}
            >
              Qualified candidates
            </p>
          </CardContent>
        </Card>
        <Card
          className={`border-l-4 border-l-purple-500 border-t-4 border-t-purple-500 hover:shadow-lg transition-shadow ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle
              className={`text-sm font-medium ${
                isDark ? "text-purple-300" : "text-purple-900"
              }`}
            >
              Average CGPA
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-purple-500"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                isDark ? "text-purple-300" : "text-purple-700"
              }`}
            >
              {stats.avgCGPA}
            </div>
            <p
              className={`text-xs ${
                isDark ? "text-purple-400" : "text-purple-600"
              }`}
            >
              Across all applications
            </p>
          </CardContent>
        </Card>
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
            <StudentDashboard status="all" key="all-tab" />
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
              <StudentDashboard status="shortlisted" key="shortlisted-tab" />
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
              <StudentDashboard status="pending" key="pending-tab" />
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
              <StudentDashboard status="rejected" key="rejected-tab" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApplicationSection;
