import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckCircle2,
  ClipboardList,
  Download,
  Search,
  Loader,
  Users,
  UserCheck,
  BarChart2,
} from "lucide-react";
import Papa from "papaparse";
import { useApi } from "@/hooks/useApi";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const JobsSummary = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showChart, setShowChart] = useState(false);
  const [activeTab, setActiveTab] = useState("open"); // "open" or "closed"
  const { sendRequest } = useApi();

  useEffect(() => {
    fetchJobsSummary();
  }, []);

  const fetchJobsSummary = async () => {
    try {
      setLoading(true);
      const response = await sendRequest({
        method: "GET",
        url: "/talent/connect/jobsSummary",
      });

      if (response?.response) {
        setJobs(response.response);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = useMemo(() => {
    // First filter by tab/status
    const statusFiltered = jobs.filter((job) => {
      if (activeTab === "open") return job.publish === "1";
      if (activeTab === "closed") return job.publish === "0";
      return true; // Default case, shouldn't happen with current implementation
    });

    // Then filter by search term
    if (!searchTerm) return statusFiltered;

    const lowerSearchTerm = searchTerm.toLowerCase();
    return statusFiltered.filter(
      (job) =>
        job.company_name.toLowerCase().includes(lowerSearchTerm) ||
        job.job_title.toLowerCase().includes(lowerSearchTerm) ||
        job.jd_location.toLowerCase().includes(lowerSearchTerm)
    );
  }, [jobs, searchTerm, activeTab]);

  // Prepare data for the bar chart
  const chartData = useMemo(() => {
    // Get top 5 jobs by applied students count
    return [...filteredJobs]
      .sort(
        (a, b) =>
          (b.applied_students_count || 0) - (a.applied_students_count || 0)
      )
      .slice(0, 5)
      .map((job, index) => ({
        name: `Job ${index + 1}`,
        shortTitle:
          job.job_title.length > 15
            ? job.job_title.substring(0, 15) + "..."
            : job.job_title,
        fullTitle: job.job_title,
        applied: parseInt(job.applied_students_count) || 0,
        eligible: parseInt(job.filtration_count) || 0,
        company: job.company_name,
      }));
  }, [filteredJobs]);

  const getStatusVariant = (publish) => {
    switch (publish) {
      case "1":
        return "success";
      case "0":
        return "secondary";
      case "2":
        return "warning";
      default:
        return "secondary";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const exportToCSV = () => {
    if (filteredJobs.length === 0) return;

    const headers = [
      "Job ID",
      "Company Name",
      "Job Title",
      "Location",
      "Status",
      "Applied Students",
      "Eligible Students",
      "Reg. Start",
      "Reg. End",
    ];

    const csvData = filteredJobs.map((job) => ({
      "Job ID": job.job_id,
      "Company Name": job.company_name,
      "Job Title": job.job_title,
      Location: job.jd_location,
      Status:
        job.publish === "1" ? "Open" : job.publish === "0" ? "Closed" : "Draft",
      "Applied Students": job.applied_students_count ?? "N/A",
      "Eligible Students": job.filtration_count ?? "N/A",
      "Reg. Start": formatDate(job.reg_start),
      "Reg. End": formatDate(job.reg_end),
    }));

    const csv = Papa.unparse(csvData, { header: true });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "jobs_summary.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );

  if (error)
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;

  return (
    <div className="space-y-5">
      <Card className="w-full mt-5 max-w-7xl mx-auto shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-200">
              Jobs Summary
            </CardTitle>
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowChart(!showChart)}
                className="flex items-center gap-2 w-full md:w-auto"
              >
                <BarChart2 className="h-4 w-4" />
                {showChart ? "Hide Chart" : "Show Chart"}
              </Button>
              <Button
                variant="outline"
                onClick={exportToCSV}
                disabled={filteredJobs.length === 0}
                className="flex items-center gap-2 w-full md:w-auto"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex mt-4 border-b border-gray-200 dark:border-gray-700">
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "open"
                  ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("open")}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Open Jobs
              </div>
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "closed"
                  ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("closed")}
            >
              <div className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                Closed Jobs
              </div>
            </button>
          </div>
        </CardHeader>

        {/* Bar Chart Section */}
        {showChart && filteredJobs.length > 0 && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">
              Top 5 {activeTab === "open" ? "Open" : "Closed"} Jobs by
              Application Count
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 30, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      value,
                      name === "applied"
                        ? "Applied Students"
                        : "Eligible Students",
                    ]}
                    labelFormatter={(label) => {
                      const job = chartData.find((item) => item.name === label);
                      return `${job?.fullTitle || ""} (${job?.company || ""})`;
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="applied"
                    name="Applied Students"
                    fill="#3B82F6"
                  />
                  <Bar
                    dataKey="eligible"
                    name="Eligible Students"
                    fill="#10B981"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Legend for job titles */}
            <div className="mt-2 px-4 mb-2 text-sm">
              <h4 className="font-medium mb-1">Job Legend:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {chartData.map((job, index) => (
                  <div key={index} className="flex items-center">
                    <span className="font-semibold mr-1">{job.name}:</span>
                    <span className="text-gray-600 dark:text-gray-300 truncate">
                      {job.fullTitle}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-100 dark:bg-gray-900/50">
              <TableRow className="hover:bg-gray-100 dark:hover:bg-gray-900/50">
                <TableHead className="w-[250px] font-bold text-gray-700 dark:text-gray-300">
                  Job Details
                </TableHead>
                <TableHead className="font-bold text-gray-700 dark:text-gray-300">
                  Company
                </TableHead>
                <TableHead className="font-bold text-gray-700 dark:text-gray-300">
                  Location
                </TableHead>
                <TableHead className="text-center font-bold text-gray-700 dark:text-gray-300">
                  Status
                </TableHead>
                <TableHead className="text-center font-bold text-gray-700 dark:text-gray-300">
                  Applied
                </TableHead>
                <TableHead className="text-center font-bold text-gray-700 dark:text-gray-300">
                  Eligible
                </TableHead>
                <TableHead className="font-bold text-gray-700 dark:text-gray-300">
                  Registration
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.map((job) => (
                <TableRow
                  key={job.job_id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  {/* Job Details */}
                  <TableCell>
                    <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                      {job.job_title}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      #{job.job_id}
                    </div>
                  </TableCell>

                  {/* Company */}
                  <TableCell className="text-sm text-gray-600 dark:text-gray-300">
                    {job.company_name}
                  </TableCell>

                  {/* Location */}
                  <TableCell className="text-sm text-gray-600 dark:text-gray-300">
                    {job.jd_location}
                  </TableCell>

                  {/* Status */}
                  <TableCell className="text-center">
                    <Badge variant={getStatusVariant(job.publish)}>
                      {job.publish === "1"
                        ? "Open"
                        : job.publish === "0"
                        ? "Closed"
                        : "Draft"}
                    </Badge>
                  </TableCell>

                  {/* Applied Students */}
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                      <Users className="h-4 w-4" />
                      <span className="font-medium">
                        {job.applied_students_count ?? "N/A"}
                      </span>
                    </div>
                  </TableCell>

                  {/* Eligible Students */}
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-green-600 dark:text-green-400">
                      <UserCheck className="h-4 w-4" />
                      <span className="font-medium">
                        {job.filtration_count ?? "N/A"}
                      </span>
                    </div>
                  </TableCell>

                  {/* Registration Dates */}
                  <TableCell>
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex flex-col">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Start:</span>
                        {formatDate(job.reg_start)}
                      </div>
                      <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500">
                        <span className="font-medium">End:</span>
                        {formatDate(job.reg_end)}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* No Jobs Found */}
          {filteredJobs.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              <div className="text-lg mb-2 font-semibold">No jobs found</div>
              <p className="text-sm">
                {searchTerm
                  ? "Try adjusting your search"
                  : `No ${activeTab} jobs available`}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default JobsSummary;
