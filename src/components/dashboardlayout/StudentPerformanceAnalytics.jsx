import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Filter,
  Download,
  Calendar as CalendarIcon,
  RefreshCcw,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

const StudentPerformanceAnalytics = () => {
  // Base data
  const initialData = {
    cgpa: [
      { range: "3.5-4.0", count: 145, fill: "#22c55e" },
      { range: "3.0-3.49", count: 230, fill: "#3b82f6" },
      { range: "2.5-2.99", count: 180, fill: "#f59e0b" },
      { range: "2.0-2.49", count: 85, fill: "#ef4444" },
    ],
    applications: [
      { name: "Applied", value: 845, fill: "#3b82f6" },
      { name: "Shortlisted", value: 320, fill: "#22c55e" },
      { name: "Rejected", value: 240, fill: "#ef4444" },
      { name: "Pending", value: 285, fill: "#f59e0b" },
    ],
    departments: [
      {
        department: "Computer Science",
        avgCGPA: 3.45,
        placementRate: 85,
        shortlistRate: 75,
        fill: "#3b82f6",
      },
      {
        department: "Electrical",
        avgCGPA: 3.32,
        placementRate: 80,
        shortlistRate: 70,
        fill: "#22c55e",
      },
      {
        department: "Mechanical",
        avgCGPA: 3.28,
        placementRate: 78,
        shortlistRate: 68,
        fill: "#f59e0b",
      },
      {
        department: "Civil",
        avgCGPA: 3.25,
        placementRate: 75,
        shortlistRate: 65,
        fill: "#8b5cf6",
      },
    ],
  };

  // Filter states
  const [department, setDepartment] = useState("all");
  const [year, setYear] = useState("all");
  const [courseType, setCourseType] = useState("all");
  const [date, setDate] = useState(new Date());
  const [selectedMetrics, setSelectedMetrics] = useState([
    "cgpa",
    "placement",
    "applications",
  ]);

  // Filtered data states
  const [cgpaData, setCgpaData] = useState(initialData.cgpa);
  const [applicationData, setApplicationData] = useState(
    initialData.applications
  );
  const [departmentData, setDepartmentData] = useState(initialData.departments);

  // Filter options
  const filterOptions = {
    departments: ["Computer Science", "Electrical", "Mechanical", "Civil"],
    years: ["2024", "2023", "2022", "2021"],
    courseTypes: ["Undergraduate", "Postgraduate", "PhD"],
  };

  // Apply filters
  useEffect(() => {
    let filteredCgpaData = [...initialData.cgpa];
    let filteredApplicationData = [...initialData.applications];
    let filteredDepartmentData = [...initialData.departments];

    // Apply department filter
    if (department !== "all") {
      const factor = Math.random() * 0.5 + 0.5; // Random factor between 0.5 and 1
      filteredCgpaData = filteredCgpaData.map((item) => ({
        ...item,
        count: Math.floor(item.count * factor),
      }));
      filteredApplicationData = filteredApplicationData.map((item) => ({
        ...item,
        value: Math.floor(item.value * factor),
      }));
      filteredDepartmentData = filteredDepartmentData.filter(
        (item) => item.department.toLowerCase() === department.toLowerCase()
      );
    }

    // Apply year filter
    if (year !== "all") {
      const factor = Math.random() * 0.3 + 0.7; // Random factor between 0.7 and 1
      filteredCgpaData = filteredCgpaData.map((item) => ({
        ...item,
        count: Math.floor(item.count * factor),
      }));
      filteredApplicationData = filteredApplicationData.map((item) => ({
        ...item,
        value: Math.floor(item.value * factor),
      }));
    }

    // Apply course type filter
    if (courseType !== "all") {
      const factor = Math.random() * 0.4 + 0.6; // Random factor between 0.6 and 1
      filteredCgpaData = filteredCgpaData.map((item) => ({
        ...item,
        count: Math.floor(item.count * factor),
      }));
      filteredApplicationData = filteredApplicationData.map((item) => ({
        ...item,
        value: Math.floor(item.value * factor),
      }));
    }

    setCgpaData(filteredCgpaData);
    setApplicationData(filteredApplicationData);
    setDepartmentData(filteredDepartmentData);
  }, [department, year, courseType]);

  const handleMetricChange = (metric) => {
    setSelectedMetrics((prev) => {
      if (prev.includes(metric)) {
        return prev.filter((m) => m !== metric);
      }
      return [...prev, metric];
    });
  };

  const handleRefresh = () => {
    setCgpaData(initialData.cgpa);
    setApplicationData(initialData.applications);
    setDepartmentData(initialData.departments);
    setDepartment("all");
    setYear("all");
    setCourseType("all");
    setDate(new Date());
  };

  const handleExport = () => {
    const data = {
      cgpaDistribution: cgpaData,
      applicationStatus: applicationData,
      departmentPerformance: departmentData,
      filters: {
        department,
        year,
        courseType,
        date: format(date, "yyyy-MM-dd"),
      },
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "student-analytics-export.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-semibold">{label || payload[0].name}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.fill }} className="text-sm">
              {entry.name}: {entry.value}
              {entry.name === "avgCGPA" ? "" : "%"}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const FilterDialog = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Advanced Filters
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter Analytics</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h4 className="font-medium">Metrics to Display</h4>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "cgpa", label: "CGPA Distribution" },
                { id: "placement", label: "Placement Rates" },
                { id: "applications", label: "Application Status" },
              ].map((metric) => (
                <div key={metric.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={metric.id}
                    checked={selectedMetrics.includes(metric.id)}
                    onCheckedChange={() => handleMetricChange(metric.id)}
                  />
                  <label
                    htmlFor={metric.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {metric.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Active Filters</h4>
            <div className="flex flex-wrap gap-2">
              {department !== "all" && (
                <Badge variant="secondary" className="px-3 py-1">
                  {department}
                  <button
                    className="ml-2 hover:text-red-500"
                    onClick={() => setDepartment("all")}
                  >
                    ×
                  </button>
                </Badge>
              )}
              {year !== "all" && (
                <Badge variant="secondary" className="px-3 py-1">
                  Year: {year}
                  <button
                    className="ml-2 hover:text-red-500"
                    onClick={() => setYear("all")}
                  >
                    ×
                  </button>
                </Badge>
              )}
              {courseType !== "all" && (
                <Badge variant="secondary" className="px-3 py-1">
                  {courseType}
                  <button
                    className="ml-2 hover:text-red-500"
                    onClick={() => setCourseType("all")}
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-4 p-4">
      {/* Filter Bar */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 md:justify-between">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {filterOptions.departments.map((dept) => (
                    <SelectItem key={dept} value={dept.toLowerCase()}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={year} onValueChange={setYear}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {filterOptions.years.map((y) => (
                    <SelectItem key={y} value={y}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={courseType} onValueChange={setCourseType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Course Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  {filterOptions.courseTypes.map((type) => (
                    <SelectItem key={type} value={type.toLowerCase()}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(date, "MMM dd, yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => newDate && setDate(newDate)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-wrap gap-2 justify-end">
              <FilterDialog />
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {selectedMetrics.includes("cgpa") && (
          <Card>
            <CardHeader>
              <CardTitle>CGPA Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cgpaData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-gray-200 dark:stroke-gray-700"
                    />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" name="Number of Students">
                      {cgpaData.map((entry, index) => (
                        <Cell key={index} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {selectedMetrics.includes("applications") && (
          <Card>
            <CardHeader>
              <CardTitle>Application Status Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={applicationData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={100}
                      dataKey="value"
                    >
                      {applicationData.map((entry, index) => (
                        <Cell key={index} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {selectedMetrics.includes("placement") && (
          <Card className={selectedMetrics.length === 1 ? "lg:col-span-2" : ""}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Department Performance Analytics</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="performance" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="performance">
                    Overall Performance
                  </TabsTrigger>
                  <TabsTrigger value="placement">Placement Rates</TabsTrigger>
                </TabsList>
                <TabsContent value="performance">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={departmentData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          className="stroke-gray-200 dark:stroke-gray-700"
                        />
                        <XAxis dataKey="department" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar
                          dataKey="avgCGPA"
                          name="Average CGPA"
                          fill="#3b82f6"
                        />
                        <Bar
                          dataKey="shortlistRate"
                          name="Shortlist Rate"
                          fill="#22c55e"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                <TabsContent value="placement">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart
                        cx="50%"
                        cy="50%"
                        innerRadius="20%"
                        outerRadius="90%"
                        data={departmentData}
                        startAngle={180}
                        endAngle={0}
                      >
                        <RadialBar
                          minAngle={15}
                          label={{
                            fill: "#666",
                            position: "insideStart",
                            formatter: (value) => `${value}%`,
                          }}
                          background
                          clockWise={true}
                          dataKey="placementRate"
                          name="Placement Rate"
                        />
                        <Legend />
                        <Tooltip content={<CustomTooltip />} />
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StudentPerformanceAnalytics;
