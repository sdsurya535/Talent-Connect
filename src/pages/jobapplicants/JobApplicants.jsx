import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building,
  Clock,
  Eye,
  Mail,
  Phone,
  GraduationCap,
  BookOpen,
  Briefcase,
  ArrowLeft,
  UsersRound,
} from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { Skeleton } from "@/components/ui/skeleton";
import AgreementSection from "./AgreementBadges";
import StudentListHeader from "./StudentListBar";

const StudentManagement = () => {
  const location = useParams();
  const jdId = location.id;
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDetailView, setIsDetailView] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [studentsData, setStudentsData] = useState({
    studentsResponse: [],
    totalPages: 0,
    filteredApplications: 0,
    jobDescription: {},
  });

  const observer = useRef();
  const { sendRequest, loading, error } = useApi();

  const lastStudentElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const fetchStudents = async () => {
    if (!jdId) return;

    try {
      const response = await sendRequest({
        url: "talent/connect/applied/student3",
        method: "POST",
        data: {
          jdId: jdId.toString(),
          search: searchQuery,
          pageNumber: pageNumber,
          status: "pending",
        },
      });

      const newStudents =
        pageNumber === 1
          ? response.studentsResponse
          : [...studentsData.studentsResponse, ...response.studentsResponse];

      setStudentsData((prev) => ({
        ...response,
        studentsResponse: newStudents,
      }));

      // Auto-select first student when data is first loaded
      if (pageNumber === 1 && newStudents.length > 0 && !selectedStudent) {
        handleStudentClick(newStudents[0]);
      }

      setHasMore(response.studentsResponse.length > 0);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  const handleExportCSV = async () => {
    try {
      const formData = new FormData();
      formData.append("companyId", "");
      formData.append("jdId", jdId);
      formData.append("location", "");
      formData.append("status", "pending");

      const response = await sendRequest({
        url: "talent/connect/applied/studentCsv2",
        method: "POST",
        data: formData,
      });

      if (response.studentsResponse && response.studentsResponse.length > 0) {
        // Process student data
        const processedStudents = response.studentsResponse.map((student) => {
          // Create a processed copy of student data
          const processedStudent = { ...student };

          // Handle companyAgreement parsing
          if (processedStudent.companyAgreement) {
            // Create a basic agreement status field
            processedStudent["agreement_status"] = "Not Processed";

            try {
              // Don't delete original yet in case of error
              let agreementData = processedStudent.companyAgreement;

              // Log the raw data for debugging
              console.log(
                `Processing agreement for ${processedStudent.name}:`,
                agreementData
              );

              // First try: handle if it's already a parsed object
              if (
                typeof agreementData === "object" &&
                agreementData !== null &&
                !Array.isArray(agreementData)
              ) {
                // It's already an object, no parsing needed
                processedStudent["agreement_status"] = "Pre-Parsed Object";
              }
              // Second try: handle doubly-stringified JSON (with escaped quotes)
              else if (
                typeof agreementData === "string" &&
                agreementData.startsWith('"[') &&
                agreementData.endsWith(']"')
              ) {
                try {
                  // Remove outer quotes and parse
                  const unescaped = agreementData
                    .substring(1, agreementData.length - 1)
                    .replace(/\\"/g, '"');
                  agreementData = JSON.parse(unescaped);
                  processedStudent["agreement_status"] = "Double-Quoted JSON";
                } catch (innerError) {
                  console.error("Failed first-level JSON parse:", innerError);
                  processedStudent["agreement_status"] =
                    "Failed Double-Quote Parse";
                  throw innerError;
                }
              }
              // Third try: standard JSON string
              else if (typeof agreementData === "string") {
                try {
                  agreementData = JSON.parse(agreementData);
                  processedStudent["agreement_status"] = "Standard JSON";
                } catch (innerError) {
                  console.error("Failed standard JSON parse:", innerError);
                  processedStudent["agreement_status"] =
                    "Failed Standard Parse";
                  throw innerError;
                }
              }

              // Now handle the parsed data if it's an array
              if (Array.isArray(agreementData)) {
                agreementData.forEach((item, index) => {
                  // Skip if missing question property
                  if (!item || !item.question) {
                    console.warn(
                      `Agreement item ${index} missing question property`
                    );
                    return;
                  }

                  // Create a column name that includes the full question
                  // Use the questionId as part of the column name to ensure uniqueness
                  const questionKey = `Q${item.questionId || index}_${
                    item.question
                  }`;

                  // Handle different answer types dynamically
                  let formattedAnswer;

                  if (typeof item.answer === "boolean") {
                    formattedAnswer = item.answer ? "Yes" : "No";
                  } else if (
                    item.answer === "" ||
                    item.answer === null ||
                    item.answer === undefined
                  ) {
                    formattedAnswer = "Not Answered";
                  } else if (
                    typeof item.answer === "object" &&
                    item.answer !== null
                  ) {
                    // Handle if answer is an object (like selections from multiple choice)
                    try {
                      formattedAnswer = JSON.stringify(item.answer);
                    } catch (e) {
                      formattedAnswer = "Complex Answer";
                    }
                  } else {
                    // Handle string/number/other types
                    formattedAnswer = String(item.answer);
                  }

                  // Add timestamp in brackets if available
                  if (item.timestamp) {
                    try {
                      const date = new Date(item.timestamp);
                      if (!isNaN(date)) {
                        // Format: Yes [Feb 28, 2025 10:36 AM]
                        const formattedDate = date.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        });

                        const formattedTime = date.toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        });

                        formattedAnswer += ` [${formattedDate} ${formattedTime}]`;
                      } else {
                        formattedAnswer += ` [${item.timestamp}]`;
                      }
                    } catch (e) {
                      // If date parsing fails, use the original timestamp
                      formattedAnswer += ` [${item.timestamp}]`;
                    }
                  }

                  processedStudent[questionKey] = formattedAnswer;
                });

                // Now we can safely remove the original
                delete processedStudent.companyAgreement;
                // Remove the agreement_status field if parsing was successful
                delete processedStudent["agreement_status"];
              } else {
                processedStudent["agreement_status"] =
                  "Not An Array After Parse";
                processedStudent["agreement_data_type"] = typeof agreementData;
              }
            } catch (error) {
              console.error(
                `Error parsing agreement for ${processedStudent.name}:`,
                error
              );
              processedStudent["agreement_parsing_error"] =
                error.message || "Unknown parsing error";
            }
          }

          return processedStudent;
        });

        // Get all unique headers from all students
        const allHeaders = new Set();
        processedStudents.forEach((student) => {
          Object.keys(student).forEach((key) => allHeaders.add(key));
        });
        const headers = Array.from(allHeaders);

        // Create CSV content with all headers properly quoted
        let csvContent =
          headers.map((header) => `"${header.replace(/"/g, '""')}"`).join(",") +
          "\n";

        // Add data rows with proper CSV escaping
        processedStudents.forEach((student) => {
          const row = headers
            .map((header) => {
              const value = student[header]?.toString() || "";
              // Escape quotes with double quotes and wrap in quotes if contains comma, newline or quote
              return value.includes(",") ||
                value.includes("\n") ||
                value.includes('"')
                ? `"${value.replace(/"/g, '""')}"`
                : value;
            })
            .join(",");
          csvContent += row + "\n";
        });

        // Create and download the CSV file
        const blob = new Blob([csvContent], {
          type: "text/csv;charset=utf-8;",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;

        // Use company name and job title in the filename
        const jobTitle = studentsData.jobDescription.jd_title || "job";
        const companyName =
          studentsData.jobDescription.company_name || "company";
        const location = studentsData.jobDescription.jd_location || "location";

        // Sanitize the filename to remove characters that could cause issues
        const sanitizedJobTitle = jobTitle
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-");
        const sanitizedCompanyName = companyName
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-");
        const sanitizedLocation = location
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-");

        a.download = `${sanitizedCompanyName}-${sanitizedJobTitle}-${sanitizedLocation}-${
          new Date().toISOString().split("T")[0]
        }.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error("No student data available for export");
      }
    } catch (error) {
      console.error("Error exporting CSV:", error);
    }
  };

  useEffect(() => {
    setPageNumber(1);
    setStudentsData((prev) => ({ ...prev, studentsResponse: [] }));
    setSelectedStudent(null);
  }, [searchQuery]);

  useEffect(() => {
    fetchStudents();
  }, [jdId, pageNumber, searchQuery]);

  const handleResumeClick = (resumeNumber, userId) => {
    window.open(`/admin/resume/${userId}?type=${resumeNumber}`, "_blank");
  };

  const handleStudentClick = async (student) => {
    setIsLoadingDetails(true);
    setSelectedStudent(student);
    if (window.innerWidth < 768) {
      setIsDetailView(true);
    }

    // Simulate API delay for student details
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoadingDetails(false);
  };

  const handleBackToList = () => {
    setIsDetailView(false);
  };

  const EmptyStateSection = ({ icon: Icon, title, message }) => (
    <div className="py-6 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
      <Icon className="w-12 h-12 mb-2 opacity-50" />
      <h4 className="font-medium text-lg">{title}</h4>
      <p className="text-sm text-center max-w-md mt-1">{message}</p>
    </div>
  );

  const LoadingListSkeleton = () => (
    <div className="p-4 animate-pulse">
      <div className="flex gap-4">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-3 w-24 mb-2" />
          <Skeleton className="h-3 w-48 mb-2" />
          <Skeleton className="h-3 w-20 mb-2" />
          <div className="flex gap-2 mt-2">
            <Skeleton className="h-5 w-28 rounded-full" />
            <Skeleton className="h-5 w-28 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );

  const DetailsSkeleton = () => (
    <div className="animate-pulse space-y-6">
      {/* Education Section */}
      <div>
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-4">
          <div>
            <Skeleton className="h-4 w-48 mb-2" />
            <Skeleton className="h-3 w-36 mb-2" />
            <Skeleton className="h-3 w-24" />
          </div>
          <div>
            <Skeleton className="h-4 w-40 mb-2" />
            <Skeleton className="h-3 w-32 mb-2" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>
      </div>

      {/* Experience Section */}
      <div>
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-4">
          <div>
            <Skeleton className="h-4 w-44 mb-2" />
            <Skeleton className="h-3 w-36 mb-2" />
            <Skeleton className="h-3 w-48 mb-2" />
            <Skeleton className="h-3 w-full max-w-md" />
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div>
        <Skeleton className="h-6 w-24 mb-4" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>

      {/* Contact Section */}
      <div>
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-36" />
        </div>
      </div>
    </div>
  );

  if (!jdId) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <p className="text-center text-gray-600 dark:text-gray-300">
              No job ID provided. Please check the URL parameters.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      {error && (
        <Card className="mb-4 bg-red-50 dark:bg-red-900">
          <CardContent className="p-4">
            <p className="text-red-600 dark:text-red-200">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Job Info Card */}
      <Card className="mb-4 bg-white dark:bg-gray-800">
        <CardContent className="p-4">
          {loading && pageNumber === 1 ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-40" />
            </div>
          ) : (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {studentsData.jobDescription.jd_title}
                </h2>
                <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1 mt-2">
                  <p className="flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    {studentsData.jobDescription.company_name ||
                      "Company"} ·{" "}
                    {studentsData.jobDescription.jd_location || "Location"}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Registration:{" "}
                    {studentsData.jobDescription.reg_start
                      ? new Date(
                          studentsData.jobDescription.reg_start
                        ).toLocaleDateString()
                      : "N/A"}{" "}
                    -{" "}
                    {studentsData.jobDescription.reg_end
                      ? new Date(
                          studentsData.jobDescription.reg_end
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <p className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    {studentsData.filteredApplications || 0} applications
                  </p>
                </div>
              </div>
              <Button variant="outline">Manage Job</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Students List */}
        <div
          className={`${
            isDetailView ? "hidden md:block" : ""
          } h-[calc(100vh-16rem)]`}
        >
          <Card className="bg-white dark:bg-gray-800 h-full flex flex-col">
            <StudentListHeader
              filteredApplications={studentsData.filteredApplications || 0}
              filtrationCount={
                studentsData.jobDescription.filtration_count || 0
              }
              onExport={handleExportCSV}
              onRefresh={() => {
                setPageNumber(1);
                setStudentsData((prev) => ({ ...prev, studentsResponse: [] }));
                fetchStudents();
              }}
              loading={loading}
              searchQuery={searchQuery}
              onSearchChange={(e) => setSearchQuery(e.target.value)}
            />

            <CardContent className="p-0 flex-1 overflow-y-auto">
              {!loading && studentsData.studentsResponse.length === 0 ? (
                <EmptyStateSection
                  icon={UsersRound}
                  title="No Students Found"
                  message="No student applications match your current search criteria."
                />
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {studentsData.studentsResponse.map((student, index) => (
                    <div
                      key={student.emailid || index}
                      ref={
                        index === studentsData.studentsResponse.length - 1
                          ? lastStudentElementRef
                          : null
                      }
                      className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 
                  ${
                    selectedStudent?.emailid === student.emailid
                      ? "bg-blue-50 dark:bg-gray-700"
                      : ""
                  }`}
                      onClick={() => handleStudentClick(student)}
                    >
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-lg font-semibold">
                            {student.name ? student.name.charAt(0) : "?"}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-blue-600 dark:text-blue-400">
                            {student.name || "Unknown Student"}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {student.branch || "No branch information"}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <Mail className="w-4 h-4" />
                            <span>{student.emailid || "No email"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <GraduationCap className="w-4 h-4" />
                            <span>CGPA: {student.btech_cgpa || "N/A"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <>
                      <LoadingListSkeleton />
                      <LoadingListSkeleton />
                      <LoadingListSkeleton />
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Detail View */}
        {selectedStudent && (isDetailView || window.innerWidth >= 768) && (
          <Card className="bg-white dark:bg-gray-800 h-[calc(100vh-16rem)] flex flex-col">
            <CardHeader className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
              {isDetailView && (
                <Button
                  variant="ghost"
                  className="md:hidden mb-4"
                  onClick={handleBackToList}
                >
                  <ArrowLeft className="mr-2 w-4 h-4" /> Back to list
                </Button>
              )}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-2xl font-semibold">
                    {selectedStudent.name
                      ? selectedStudent.name.charAt(0)
                      : "?"}
                  </span>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {selectedStudent.name || "Unknown Student"}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    {selectedStudent.branch || "No branch information"}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-2">
                    <GraduationCap className="w-4 h-4" />
                    <span>CGPA: {selectedStudent.btech_cgpa || "N/A"}</span>
                  </div>
                </div>
                <Badge variant="secondary">
                  {selectedStudent.status || "Pending"}
                </Badge>
              </div>

              {/* Resume Buttons */}
              <div className="flex gap-2 mt-4 flex-wrap">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => handleResumeClick("1", selectedStudent.resume)}
                  disabled={!selectedStudent.resume}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Resume 1
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => handleResumeClick("2", selectedStudent.resume)}
                  disabled={!selectedStudent.resume}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Resume 2
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => handleResumeClick("3", selectedStudent.resume)}
                  disabled={!selectedStudent.resume}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Resume 3
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-6 overflow-y-auto flex-1">
              {isLoadingDetails ? (
                <DetailsSkeleton />
              ) : (
                <>
                  {/* Agreement Section */}
                  {selectedStudent.agreement && (
                    <AgreementSection agreement={selectedStudent.agreement} />
                  )}

                  {/* Education Section */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-900 dark:text-white">
                      <BookOpen className="w-5 h-5" />
                      Education
                    </h3>
                    {Array.isArray(selectedStudent.education) &&
                    selectedStudent.education.length > 0 ? (
                      <div className="space-y-4">
                        {selectedStudent.education.map((edu, index) => (
                          <div
                            key={index}
                            className="border-l-2 border-gray-200 dark:border-gray-700 pl-4"
                          >
                            <p className="font-medium text-gray-900 dark:text-white">
                              {edu.degree || "Degree not specified"}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {edu.school || "Institution not specified"}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {edu.passoutYear
                                ? new Date(edu.passoutYear).getFullYear()
                                : "Year not specified"}{" "}
                              ·{" "}
                              {edu.percentage
                                ? `${edu.percentage}%`
                                : "Score not specified"}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyStateSection
                        icon={BookOpen}
                        title="No Education Data"
                        message="No education information is available for this student."
                      />
                    )}
                  </div>

                  {/* Experience Section */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-900 dark:text-white">
                      <Briefcase className="w-5 h-5" />
                      Experience
                    </h3>
                    {Array.isArray(selectedStudent.experience) &&
                    selectedStudent.experience.length > 0 ? (
                      <div className="space-y-4">
                        {selectedStudent.experience.map((exp, index) => (
                          <div
                            key={index}
                            className="border-l-2 border-gray-200 dark:border-gray-700 pl-4"
                          >
                            <p className="font-medium text-gray-900 dark:text-white">
                              {exp.jobTitle || "Role not specified"}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {exp.companyName || "Company not specified"}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {exp.fromDate
                                ? new Date(exp.fromDate).toLocaleDateString()
                                : "Start date not specified"}{" "}
                              -{" "}
                              {exp.toDate
                                ? new Date(exp.toDate).toLocaleDateString()
                                : "End date not specified"}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 whitespace-pre-line">
                              {exp.roleDescription ||
                                "No description available"}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyStateSection
                        icon={Briefcase}
                        title="No Experience Data"
                        message="This student has no work experience listed."
                      />
                    )}
                  </div>

                  {/* Projects Section */}
                  <div>
                    <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">
                      Projects
                    </h3>
                    {Array.isArray(selectedStudent.projects) &&
                    selectedStudent.projects.length > 0 ? (
                      <div className="space-y-4">
                        {selectedStudent.projects.map((project, index) => (
                          <div
                            key={index}
                            className="border-l-2 border-gray-200 dark:border-gray-700 pl-4"
                          >
                            <p className="font-medium text-gray-900 dark:text-white">
                              {project.projectTitle || "Untitled Project"}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 whitespace-pre-line">
                              {project.projectDescription ||
                                "No description provided"}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyStateSection
                        icon={Briefcase}
                        title="No Projects"
                        message="This student has not listed any projects."
                      />
                    )}
                  </div>

                  {/* Skills Section */}
                  <div>
                    <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">
                      Skills
                    </h3>
                    {selectedStudent.skills ? (
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(selectedStudent.skills) ? (
                          selectedStudent.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary">
                              {skill}
                            </Badge>
                          ))
                        ) : typeof selectedStudent.skills === "string" ? (
                          selectedStudent.skills
                            .split(",")
                            .map((skill, index) => (
                              <Badge key={index} variant="secondary">
                                {skill.trim()}
                              </Badge>
                            ))
                        ) : (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            No skills data available
                          </p>
                        )}
                      </div>
                    ) : (
                      <EmptyStateSection
                        icon={BookOpen}
                        title="No Skills Listed"
                        message="This student has not specified any skills."
                      />
                    )}
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">
                      Contact Information
                    </h3>
                    <div className="space-y-2">
                      <p className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        {selectedStudent.emailid ? (
                          <a
                            href={`mailto:${selectedStudent.emailid}`}
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {selectedStudent.emailid}
                          </a>
                        ) : (
                          <span className="text-gray-500">
                            No email provided
                          </span>
                        )}
                      </p>
                      <p className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        {selectedStudent.mobile ? (
                          <a
                            href={`tel:${selectedStudent.mobile}`}
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {selectedStudent.mobile}
                          </a>
                        ) : (
                          <span className="text-gray-500">
                            No phone number provided
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StudentManagement;
