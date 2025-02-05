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

  const { applications, loading, error, totalPages, fetchData } =
    useStudentApplications();
  const { sendRequest, loading: companyLoading } = useApi();

  // Initial Data Fetch
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

  // Search and Filter Effect
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

  // Filter Handlers
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

  // CSV Export Handler with form-data
  const downloadCSV = async () => {
    setIsExporting(true);
    try {
      // Create FormData object
      const formData = new FormData();

      // Convert 'all' values to blank strings
      formData.append(
        "companyId",
        filters.companyId === "all" ? "" : filters.companyId
      );
      formData.append("jdId", filters.jdId === "all" ? "" : filters.jdId);
      formData.append(
        "location",
        filters.location === "all" ? "" : filters.location
      );

      const response = await sendRequest({
        method: "POST",
        url: "/talent/connect/applied/studentCsv",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Debug logs
      // console.log("Full Response:", response);
      // console.log("Response Data:", response.data);
      // console.log("Students Response:", response.data.studentsResponse);

      // Define headers for CSV

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

      // Helper function to escape CSV fields
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

      // Convert data to CSV format
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

      // Combine headers and data
      const csvContent = [headers.map(escapeCSV), ...csvData]
        .map((row) => row.join(","))
        .join("\n");

      // Create and download the blob
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

  // Pagination Handlers
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

  // Selection Handlers
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

  // Status Badge Helper
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

  // Error State
  if (error) {
    return (
      <Card className="w-full bg-red-50 dark:bg-red-900/10">
        <CardContent className="pt-6">
          <p className="text-red-600 dark:text-red-400">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Actions Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or institute..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2">
          {/* Filters Popover */}
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company</label>
                  <Select
                    value={tempFilters.companyId}
                    onValueChange={(value) =>
                      handleTempFilterChange("companyId", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Companies</SelectItem>
                      {companyDetails.companies.map((company) => (
                        <SelectItem
                          key={company.company_id}
                          value={company.company_id.toString()}
                        >
                          {company.company_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Job Title</label>
                  <Select
                    value={tempFilters.jdId}
                    onValueChange={(value) =>
                      handleTempFilterChange("jdId", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select job title" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Jobs</SelectItem>
                      {companyDetails.jds.map((jd) => (
                        <SelectItem key={jd.jd_id} value={jd.jd_id.toString()}>
                          {jd.jd_title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <Select
                    value={tempFilters.location}
                    onValueChange={(value) =>
                      handleTempFilterChange("location", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      {companyDetails.locations.map((loc) => (
                        <SelectItem
                          key={loc.jd_location}
                          value={loc.jd_location}
                        >
                          {loc.jd_location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-between gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleResetFilters}
                  >
                    Reset
                  </Button>
                  <Button className="flex-1" onClick={handleApplyFilters}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Export CSV Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={downloadCSV}
                  disabled={isExporting}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isExporting ? "Exporting..." : "Export as CSV"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Page Size Select */}
          <Select
            value={pageSize.toString()}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Page size" />
            </SelectTrigger>
            <SelectContent>
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
                <Button variant="outline" size="icon" onClick={handleRefresh}>
                  <RefreshCcw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh data</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  checked={
                    applications.length > 0 &&
                    applications.every((app) =>
                      selectedApplications.has(app.id)
                    )
                  }
                  onChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Final Year</TableHead>
              <TableHead>CGPA</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? // Loading state rows
                [...Array(pageSize)].map((_, idx) => (
                  <TableRow key={idx}>
                    {[...Array(10)].map((_, cellIdx) => (
                      <TableCell key={cellIdx}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : // Data rows
                applications.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={selectedApplications.has(student.id)}
                        onChange={() => toggleSelectApplication(student.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium max-w-[150px] text-left">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="truncate block w-full text-left">
                            {student.name}
                          </TooltipTrigger>
                          <TooltipContent className="text-left">
                            <p>{student.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="max-w-[200px] text-left">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="truncate block w-full text-left">
                            {student.emailid}
                          </TooltipTrigger>
                          <TooltipContent className="text-left">
                            <p>{student.emailid}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>{student.branch}</TableCell>
                    <TableCell>{student.gender}</TableCell>
                    <TableCell>{student.final_year}</TableCell>
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
                    <TableCell>{student.state}</TableCell>
                    <TableCell>{getStatusBadge(student.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 p-0"
                          >
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedStudent(student);
                              setIsDrawerOpen(true);
                            }}
                          >
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>Download Resume</DropdownMenuItem>
                          <DropdownMenuItem>Send Email</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      {/* Student Details Drawer */}
      <StudentDetailsDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        student={selectedStudent}
      />

      {/* Empty State */}
      {!loading && applications.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No applications found matching your criteria
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
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
          >
            First
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
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
              className="w-16 h-8 text-center"
            />
            <span className="text-sm text-muted-foreground">
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
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            Last
          </Button>
        </div>
      </div>
    </div>
  );
};

StudentDashboard.propTypes = {
  status: PropTypes.string,
};

export default StudentDashboard;
