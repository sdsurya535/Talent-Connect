// JobListings.jsx
import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Edit2,
  RefreshCcw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Briefcase,
  Users,
  Calendar,
  Building,
  Plus,
  Eye,
  LayoutGrid,
  Table as TableIcon,
  Loader2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { JobDetailView } from "./JobDetailsView";
import toast from "react-hot-toast";
import { useApi } from "@/hooks/useApi";
import JobCardView from "./JobCardsView";

const JobListings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [locationFilter, setLocationFilter] = useState("all");
  const [qualificationFilter, setQualificationFilter] = useState("all");
  const [selectedJob, setSelectedJob] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();
  const { sendRequest, loading, error } = useApi();

  // Fetch jobs data
  const fetchJobs = async () => {
    try {
      const response = await sendRequest({
        url: "/talent/connect/jobDescriptions",
        method: "GET",
      });
      setJobs(response?.jobDescriptions || []);
    } catch (err) {
      toast.error("Failed to fetch job listings. Please try again.");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const analytics = {
    totalJobs: jobs.length,
    totalOpenings: jobs.reduce((acc, job) => acc + job.noOfOpening, 0),
    activeListings: jobs.filter(
      (job) => new Date(job.registrationEnd) > new Date()
    ).length,
    locations: [...new Set(jobs.map((job) => job.jdLocation))].length,
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch = Object.values(job).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesLocation =
        locationFilter === "all" || job.jdLocation === locationFilter;
      const matchesQualification =
        qualificationFilter === "all" ||
        job.qualification === qualificationFilter;
      return matchesSearch && matchesLocation && matchesQualification;
    });
  }, [jobs, searchTerm, locationFilter, qualificationFilter]);

  const totalPages = Math.ceil(filteredJobs.length / rowsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const locations = useMemo(
    () => [...new Set(jobs.map((job) => job.jdLocation))],
    [jobs]
  );

  const qualifications = useMemo(
    () => [...new Set(jobs.map((job) => job.qualification))],
    [jobs]
  );

  const AnalyticsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="border-l-4 border-blue-500 dark:border-blue-400 shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center text-blue-600 dark:text-blue-400">
            <Briefcase className="h-4 w-4 mr-2" />
            Total Jobs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {analytics.totalJobs}
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-green-500 dark:border-green-400 shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center text-green-600 dark:text-green-400">
            <Users className="h-4 w-4 mr-2" />
            Total Openings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {analytics.totalOpenings}
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-yellow-500 dark:border-yellow-400 shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center text-yellow-600 dark:text-yellow-400">
            <Calendar className="h-4 w-4 mr-2" />
            Active Listings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
            {analytics.activeListings}
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-purple-500 dark:border-purple-400 shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center text-purple-600 dark:text-purple-400">
            <Building className="h-4 w-4 mr-2" />
            Locations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {analytics.locations}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const ViewToggle = () => (
    <div className="flex items-center space-x-2 mb-6">
      <Button
        variant={viewMode === "table" ? "default" : "outline"}
        size="sm"
        onClick={() => setViewMode("table")}
        className={viewMode === "table" ? "bg-blue-600" : "border-blue-200"}
      >
        <TableIcon className="h-4 w-4 mr-2" />
        Table View
      </Button>
      <Button
        variant={viewMode === "card" ? "default" : "outline"}
        size="sm"
        onClick={() => setViewMode("card")}
        className={viewMode === "card" ? "bg-blue-600" : "border-blue-200"}
      >
        <LayoutGrid className="h-4 w-4 mr-2" />
        Card View
      </Button>
    </div>
  );

  const TableView = () => (
    <div className="overflow-x-auto">
      <div className="border border-blue-200 dark:border-blue-800 rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-blue-600 dark:text-blue-400">
                Title
              </TableHead>
              <TableHead className="text-blue-600 dark:text-blue-400">
                Location
              </TableHead>
              <TableHead className="text-blue-600 dark:text-blue-400">
                Openings
              </TableHead>
              <TableHead className="text-blue-600 dark:text-blue-400">
                Package
              </TableHead>
              <TableHead className="text-blue-600 dark:text-blue-400">
                Status
              </TableHead>
              <TableHead className="text-blue-600 dark:text-blue-400">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedJobs.map((job) => (
              <TableRow
                key={job.company_id}
                className="hover:bg-blue-50/30 dark:hover:bg-blue-900/30 cursor-pointer"
              >
                <TableCell
                  className="font-medium"
                  onClick={() => setSelectedJob(job)}
                >
                  {job.jd_title}
                </TableCell>
                <TableCell onClick={() => setSelectedJob(job)}>
                  {job.jd_location}
                </TableCell>
                <TableCell onClick={() => setSelectedJob(job)}>
                  {job.no_of_opening}
                </TableCell>
                <TableCell onClick={() => setSelectedJob(job)}>
                  {job.package}
                </TableCell>
                <TableCell onClick={() => setSelectedJob(job)}>
                  {job.publish === "1" ? (
                    <Badge className="bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400">
                      Active
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400">
                      Inactive
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                      >
                        <span className="sr-only">Open menu</span>
                        <Edit2 className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="border-blue-100 dark:border-blue-900 bg-white dark:bg-gray-800"
                    >
                      <DropdownMenuItem
                        className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50"
                        onSelect={(e) => {
                          e.preventDefault();
                          setSelectedJob(job);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50"
                        onSelect={(e) => {
                          e.preventDefault();
                          // Handle edit action
                          toast.promise(Promise.resolve(), {
                            loading: "Updating job...",
                            success: "Job updated successfully!",
                            error: "Failed to update job",
                          });
                        }}
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50"
                        onSelect={(e) => {
                          e.preventDefault();
                          // Handle delete action
                          toast.promise(Promise.resolve(), {
                            loading: "Deleting job...",
                            success: "Job deleted successfully!",
                            error: "Failed to delete job",
                          });
                        }}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="text-red-500 text-xl">Failed to load job listings</div>
        <Button onClick={fetchJobs}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <AnalyticsCards />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-blue-100 dark:border-blue-900">
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative flex-grow sm:flex-grow-0">
                <Search className="absolute left-3 top-3 h-4 w-4 text-blue-400 dark:text-blue-300" />
                <Input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64 border-blue-200 dark:border-blue-900 focus:border-blue-400 dark:focus:border-blue-500 h-10 bg-white dark:bg-gray-900"
                />
              </div>

              <Button
                onClick={() => navigate("/create_job_description")}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Job Description
              </Button>
            </div>

            <Button
              variant="outline"
              size="icon"
              className="shrink-0 border-blue-200 dark:border-blue-900 hover:bg-blue-50 dark:hover:bg-blue-900/50 h-10 w-10"
              onClick={fetchJobs}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 text-blue-500 dark:text-blue-400 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4 text-blue-500 dark:text-blue-400" />
              )}
            </Button>
          </div>

          <ViewToggle />

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            </div>
          ) : (
            <>
              {viewMode === "table" ? (
                <TableView />
              ) : (
                <JobCardView
                  jobs={paginatedJobs}
                  onViewDetails={setSelectedJob}
                />
              )}

              {/* Pagination */}
              {paginatedJobs.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between py-4 gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <Select
                      value={rowsPerPage.toString()}
                      onValueChange={(value) => {
                        setRowsPerPage(Number(value));
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger className="w-[110px] border-blue-200 dark:border-blue-900">
                        <SelectValue placeholder="Rows per page" />
                      </SelectTrigger>
                      <SelectContent>
                        {[5, 10, 20, 50].map((pageSize) => (
                          <SelectItem
                            key={pageSize}
                            value={pageSize.toString()}
                          >
                            {pageSize} rows
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <span className="text-sm text-blue-600 dark:text-blue-400">
                      Page {currentPage} of {totalPages}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="border-blue-200 dark:border-blue-900 hover:bg-blue-50 dark:hover:bg-blue-900/50 disabled:opacity-50"
                    >
                      <ChevronsLeft className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                      className="border-blue-200 dark:border-blue-900 hover:bg-blue-50 dark:hover:bg-blue-900/50 disabled:opacity-50"
                    >
                      <ChevronLeft className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="border-blue-200 dark:border-blue-900 hover:bg-blue-50 dark:hover:bg-blue-900/50 disabled:opacity-50"
                    >
                      <ChevronRight className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="border-blue-200 dark:border-blue-900 hover:bg-blue-50 dark:hover:bg-blue-900/50 disabled:opacity-50"
                    >
                      <ChevronsRight className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Job Detail Modal */}
      {selectedJob && (
        <JobDetailView
          job={selectedJob}
          open={!!selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
};

export default JobListings;
