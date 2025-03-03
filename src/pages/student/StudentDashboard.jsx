import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Search,
  Download,
  RefreshCcw,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  MoreVertical,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useStudentApplications } from "@/hooks/useStudentApplication";
import StudentDetailsDrawer from "@/components/drawer/StudentDetailDrawer";
import { useApi } from "@/hooks/useApi";
import AnimatedCounter from "./AnimatedCounter";

const PAGE_SIZE_OPTIONS = [8, 10, 20, 50, 100];

const StudentDashboard = ({ status = "all" }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    companyId: "all",
    jdId: "all",
    location: "all",
  });
  const [tempFilters, setTempFilters] = useState({
    companyId: "all",
    jdId: "all",
    location: "all",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [selectedApplications, setSelectedApplications] = useState(new Set());
  const [companyDetails, setCompanyDetails] = useState({
    companies: [],
    jds: [],
    locations: [],
  });
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const { applications, loading, error, totalPages, fetchData, stats } =
    useStudentApplications();
  const { sendRequest, loading: companyLoading } = useApi();

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const data = await sendRequest({
          method: "GET",
          url: "/documents/companyDetails",
        });
        setCompanyDetails({
          companies: data.companyResponse || [],
          jds: data.jdResponse || [],
          locations: data.locationResponse || [],
        });
      } catch (err) {
        console.error("Error fetching company details:", err);
      }
    };
    fetchCompanyDetails();
  }, [sendRequest]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData({
        pageSize,
        pageNumber: currentPage,
        status,
        searchQuery: searchTerm,
        filters,
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, currentPage, pageSize, status, filters, fetchData]);

  const handleTempFilterChange = (key, value) => {
    setTempFilters((prev) => ({
      ...prev,
      [key]: value === null ? "all" : value,
    }));
  };

  const handleApplyFilters = () => {
    setFilters(tempFilters);
    setCurrentPage(1);
    setIsPopoverOpen(false);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      companyId: "all",
      jdId: "all",
      location: "all",
    };
    setTempFilters(resetFilters);
    setFilters(resetFilters);
    setCurrentPage(1);
    setIsPopoverOpen(false);
  };

  const downloadCSV = async () => {
    setIsExporting(true);
    try {
      const formData = new FormData();
      formData.append(
        "companyId",
        filters.companyId === "all" ? "" : filters.companyId
      );
      formData.append("jdId", filters.jdId === "all" ? "" : filters.jdId);
      formData.append(
        "location",
        filters.location === "all" ? "" : filters.location
      );
      formData.append("status", status);

      if (searchTerm) {
        formData.append("search", searchTerm);
      }

      const response = await sendRequest({
        method: "POST",
        url: "/talent/connect/applied/studentCsv",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const headers = [
        "Name",
        "Email",
        "Mobile",
        "Branch",
        "Gender",
        "Final Year",
        "Institute",
        "State",
        "CGPA",
        "Status",
      ];

      const escapeCSV = (field) => {
        if (field === null || field === undefined) return "";
        const stringField = String(field);
        if (
          stringField.includes(",") ||
          stringField.includes('"') ||
          stringField.includes("\n")
        ) {
          return `"${stringField.replace(/"/g, '""')}"`;
        }
        return stringField;
      };

      const csvData = response.studentsResponse.map((student) => [
        escapeCSV(student.name),
        escapeCSV(student.emailid),
        escapeCSV(student.mobile),
        escapeCSV(student.branch),
        escapeCSV(student.gender),
        escapeCSV(student.final_year),
        escapeCSV(student.institute),
        escapeCSV(student.state),
        escapeCSV(student.btech_cgpa),
        escapeCSV(student.status),
      ]);

      const csvContent = [headers.map(escapeCSV), ...csvData]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `student_applications_${new Date().toISOString()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading CSV:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(parseInt(newSize));
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    fetchData({
      pageSize,
      pageNumber: currentPage,
      status,
      searchQuery: searchTerm,
      filters,
    });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedApplications(new Set(applications.map((app) => app.id)));
    } else {
      setSelectedApplications(new Set());
    }
  };

  const toggleSelectApplication = (id) => {
    const newSelected = new Set(selectedApplications);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedApplications(newSelected);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      shortlisted: { variant: "success", icon: CheckCircle },
      pending: { variant: "warning", icon: Clock },
      rejected: { variant: "destructive", icon: XCircle },
    };

    const config = statusConfig[status];
    const Icon = config?.icon;

    return (
      <Badge
        variant={config?.variant || "default"}
        className="flex items-center gap-1"
      >
        {Icon && <Icon className="h-3 w-3" />}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (error) {
    return (
      <Card className="w-full bg-red-50 dark:bg-red-900/10">
        <CardContent className="pt-6">
          <p className="text-red-600 dark:text-red-400">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  const LocationSelectItems = ({ locations }) => {
    return (
      <>
        <SelectItem value="all">All Locations</SelectItem>
        {locations.map((loc) => (
          <SelectItem
            key={loc.jd_location}
            value={loc.jd_location || "undefined-location"} // Provide fallback value
          >
            {loc.jd_location || "Unspecified Location"}
          </SelectItem>
        ))}
      </>
    );
  };

  // Validate and transform company data
  const CompanySelectItems = ({ companies }) => {
    return (
      <>
        <SelectItem value="all">All Companies</SelectItem>
        {companies.map((company) => {
          const companyId = company.company_id?.toString();
          // Skip rendering if company_id is invalid
          if (!companyId) return null;

          return (
            <SelectItem key={companyId} value={companyId}>
              {company.company_name || "Unnamed Company"}
            </SelectItem>
          );
        })}
      </>
    );
  };

  // Validate and transform job data
  const JobSelectItems = ({ jobs }) => {
    return (
      <>
        <SelectItem value="all">All Jobs</SelectItem>
        {jobs.map((jd) => {
          const jdId = jd.jd_id?.toString();
          // Skip rendering if jd_id is invalid
          if (!jdId) return null;

          return (
            <SelectItem key={jdId} value={jdId}>
              {jd.jd_title || "Untitled Position"}
            </SelectItem>
          );
        })}
      </>
    );
  };

  return (
    <div className="space-y-4">
      {/* Search and Actions Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-blue-600 dark:text-blue-400" />
            <Input
              placeholder="Search by name, email, or institute..."
              className="pl-8 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-blue-600 dark:focus:ring-blue-400 focus:ring-1 ring-offset-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <AnimatedCounter value={stats?.filtered || 0} />
        </div>

        <div className="flex gap-2">
          {/* Filters */}
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="border-gray-300 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-blue-600 dark:focus:ring-blue-400"
              >
                <Filter className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium dark:text-gray-300">
                    Company
                  </label>
                  <Select
                    value={tempFilters.companyId}
                    onValueChange={(value) =>
                      handleTempFilterChange("companyId", value)
                    }
                  >
                    <SelectTrigger className="border-gray-300 dark:border-gray-700 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-blue-600 dark:focus:ring-blue-400 bg-white dark:bg-gray-800">
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800">
                      <CompanySelectItems
                        companies={companyDetails.companies}
                      />
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium dark:text-gray-300">
                    Job Title
                  </label>
                  <Select
                    value={tempFilters.jdId}
                    onValueChange={(value) =>
                      handleTempFilterChange("jdId", value)
                    }
                  >
                    <SelectTrigger className="border-gray-300 dark:border-gray-700 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-blue-600 dark:focus:ring-blue-400 bg-white dark:bg-gray-800">
                      <SelectValue placeholder="Select job title" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800">
                      <JobSelectItems jobs={companyDetails.jds} />
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium dark:text-gray-300">
                    Location
                  </label>
                  <Select
                    value={tempFilters.location}
                    onValueChange={(value) =>
                      handleTempFilterChange("location", value)
                    }
                  >
                    <SelectTrigger className="border-gray-300 dark:border-gray-700 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-blue-600 dark:focus:ring-blue-400 bg-white dark:bg-gray-800">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800">
                      <LocationSelectItems
                        locations={companyDetails.locations}
                      />
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-between gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 border-gray-300 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-blue-600 dark:focus:ring-blue-400"
                    onClick={handleResetFilters}
                  >
                    Reset
                  </Button>
                  <Button
                    className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
                    onClick={handleApplyFilters}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Export Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={downloadCSV}
                  disabled={isExporting}
                  className="border-gray-300 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-blue-600 dark:focus:ring-blue-400"
                >
                  <Download className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <p className="text-gray-900 dark:text-gray-100">
                  {isExporting ? "Exporting..." : "Export as CSV"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Page Size Select */}
          <Select
            value={pageSize.toString()}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="w-[130px] border-gray-300 dark:border-gray-700 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-blue-600 dark:focus:ring-blue-400 bg-white dark:bg-gray-800">
              <SelectValue placeholder="Page size" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800">
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size} per page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Refresh Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleRefresh}
                  className="border-gray-300 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-blue-600 dark:focus:ring-blue-400"
                >
                  <RefreshCcw className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <p className="text-gray-900 dark:text-gray-100">Refresh data</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-md border border-gray-200 dark:border-gray-700">
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-50 dark:bg-blue-900/20">
              <TableHead className="w-[50px]">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 dark:border-gray-700 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-blue-600 dark:focus:ring-blue-400"
                  checked={
                    applications.length > 0 &&
                    applications.every((app) =>
                      selectedApplications.has(app.id)
                    )
                  }
                  onChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="text-gray-900 dark:text-gray-100">
                Name
              </TableHead>
              <TableHead className="text-gray-900 dark:text-gray-100">
                Email
              </TableHead>
              <TableHead className="text-gray-900 dark:text-gray-100">
                Branch
              </TableHead>
              <TableHead className="text-gray-900 dark:text-gray-100">
                Gender
              </TableHead>
              <TableHead className="text-gray-900 dark:text-gray-100">
                Final Year
              </TableHead>
              <TableHead className="text-gray-900 dark:text-gray-100">
                CGPA
              </TableHead>
              <TableHead className="text-gray-900 dark:text-gray-100">
                State
              </TableHead>
              <TableHead className="text-gray-900 dark:text-gray-100">
                Status
              </TableHead>
              <TableHead className="w-[100px] text-gray-900 dark:text-gray-100">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? // Loading skeletons
                [...Array(pageSize)].map((_, idx) => (
                  <TableRow
                    key={idx}
                    className="border-t border-gray-200 dark:border-gray-700"
                  >
                    {[...Array(10)].map((_, cellIdx) => (
                      <TableCell key={cellIdx}>
                        <Skeleton className="h-4 w-full dark:bg-gray-700" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : // Data rows
                applications.map((student) => (
                  <TableRow
                    key={student.id}
                    className="hover:bg-blue-50/50 dark:hover:bg-blue-900/20 border-t border-gray-200 dark:border-gray-700"
                  >
                    <TableCell>
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 dark:border-gray-700 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-blue-600 dark:focus:ring-blue-400"
                        checked={selectedApplications.has(student.id)}
                        onChange={() => toggleSelectApplication(student.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium max-w-[150px] text-gray-900 dark:text-gray-100">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="truncate block w-full text-left">
                            {student.name}
                          </TooltipTrigger>
                          <TooltipContent className="bg-white dark:bg-gray-800">
                            <p className="text-gray-900 dark:text-gray-100">
                              {student.name}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="max-w-[200px] text-gray-900 dark:text-gray-100">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="truncate block w-full text-left">
                            {student.emailid}
                          </TooltipTrigger>
                          <TooltipContent className="bg-white dark:bg-gray-800">
                            <p className="text-gray-900 dark:text-gray-100">
                              {student.emailid}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-gray-900 dark:text-gray-100">
                      {student.branch}
                    </TableCell>
                    <TableCell className="text-gray-900 dark:text-gray-100">
                      {student.gender}
                    </TableCell>
                    <TableCell className="text-gray-900 dark:text-gray-100">
                      {student.final_year}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          parseFloat(student.btech_cgpa) >= 8
                            ? "success"
                            : "default"
                        }
                      >
                        {student.btech_cgpa}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-900 dark:text-gray-100">
                      {student.state}
                    </TableCell>
                    <TableCell>{getStatusBadge(student.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 p-0 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          >
                            <MoreVertical className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                        >
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedStudent(student);
                              setIsDrawerOpen(true);
                            }}
                            className="text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          >
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                            Download Resume
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                            Send Email
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      {/* Empty State */}
      {!loading && applications.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No applications found matching your criteria
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {(currentPage - 1) * pageSize + 1} to{" "}
          {Math.min(currentPage * pageSize, totalPages * pageSize)} of{" "}
          {totalPages * pageSize} entries
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="border-gray-300 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-blue-600 dark:focus:ring-blue-400"
          >
            First
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="border-gray-300 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-blue-600 dark:focus:ring-blue-400"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-1">
            <Input
              type="number"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value >= 1 && value <= totalPages) {
                  setCurrentPage(value);
                }
              }}
              className="w-16 h-8 text-center border-gray-300 dark:border-gray-700 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-blue-600 dark:focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              of {totalPages}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className="border-gray-300 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-blue-600 dark:focus:ring-blue-400"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="border-gray-300 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-blue-600 dark:focus:ring-blue-400"
          >
            Last
          </Button>
        </div>
      </div>

      {/* Student Details Drawer */}
      <StudentDetailsDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        student={selectedStudent}
      />
    </div>
  );
};

StudentDashboard.propTypes = {
  status: PropTypes.string,
};

export default StudentDashboard;
