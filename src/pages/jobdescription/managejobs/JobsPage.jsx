import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Briefcase,
  Search,
  ClipboardList,
  CheckCircle2,
  FileEdit,
  MapPin,
  Calendar,
  Users,
  Package,
  Building2,
  Loader,
  XCircle,
  Eye,
  Trash2,
} from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { useNavigate } from "react-router-dom";
import JobDetailsModal from "./JobDetailsModal";
import EditJobModal from "./EditJobModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const JOBS_PER_PAGE = 5;

const HTMLContent = ({ content, truncate = false }) => {
  const createMarkup = () => {
    if (truncate) {
      // Remove HTML tags and truncate to 150 characters
      const strippedContent = content.replace(/<[^>]+>/g, "");
      const truncatedContent =
        strippedContent.length > 150
          ? strippedContent.substring(0, 150) + "..."
          : strippedContent;
      return { __html: truncatedContent };
    }
    return { __html: content };
  };
  return content ? <div dangerouslySetInnerHTML={createMarkup()} /> : null;
};

const JobSkeleton = () => (
  <div className="p-4 border-b dark:border-gray-800 animate-pulse">
    <div className="flex items-start gap-3">
      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="flex-1">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
      </div>
    </div>
  </div>
);

const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-4 border-t dark:border-gray-800">
    <Loader className="h-6 w-6 animate-spin text-blue-600 dark:text-blue-400" />
  </div>
);

const JobActions = ({ job, onViewDetails, onPublishToggle }) => {
  const [showPublishConfirmModal, setShowPublishConfirmModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const { sendRequest } = useApi();
  const navigate = useNavigate();

  const getPublishButton = () => {
    switch (job.publish) {
      case "0": // Closed
        return {
          icon: <XCircle className="h-4 w-4" />,
          text: "Publish",
          style: "text-gray-500 hover:text-gray-700",
          confirmMessage: "Are you sure you want to publish this job?",
        };
      case "1": // Open
        return {
          icon: <CheckCircle2 className="h-4 w-4" />,
          text: "Unpublish",
          style: "text-green-600 hover:text-green-700",
          confirmMessage: "Are you sure you want to unpublish this job?",
        };
      case "2": // Draft
        return {
          icon: <XCircle className="h-4 w-4" />,
          text: "Publish",
          style: "text-gray-500 hover:text-gray-700",
          confirmMessage: "Are you sure you want to publish this job?",
        };
      default:
        return {
          icon: <XCircle className="h-4 w-4" />,
          text: "Publish",
          style: "text-gray-500 hover:text-gray-700",
          confirmMessage: "Are you sure you want to publish this job?",
        };
    }
  };

  const buttonInfo = getPublishButton();

  const handleButtonClick = (e, action) => {
    e.stopPropagation();
    action();
  };

  const handlePublishClick = (e) => {
    e.stopPropagation();
    setShowPublishConfirmModal(true);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeleteConfirmModal(true);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    navigate(`/admin/job-posting/${job.jd_id}`);
  };

  const handlePublishConfirm = () => {
    onPublishToggle(job);
    setShowPublishConfirmModal(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      await sendRequest({
        method: "POST",
        url: "/talent/connect/jobDescriptionDelete",
        data: {
          jdId: job.jd_id,
        },
      });
      window.location.reload(); // Refresh the page after successful deletion
    } catch (err) {
      console.error("Error deleting job:", err);
    }
    setShowDeleteConfirmModal(false);
  };

  return (
    <div
      className="flex items-center gap-2"
      onClick={(e) => e.stopPropagation()}
    >
      <Button
        variant="ghost"
        size="sm"
        className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
        onClick={(e) => handleButtonClick(e, () => onViewDetails(job))}
      >
        <Eye className="h-4 w-4" />
        <span>View</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
        onClick={handleEditClick}
      >
        <FileEdit className="h-4 w-4" />
        <span>Edit</span>
      </Button>
      {job.publish === "2" && (
        <Button
          variant="ghost"
          size="sm"
          className="text-red-500 hover:text-red-700 flex items-center gap-1"
          onClick={handleDeleteClick}
        >
          <Trash2 className="h-4 w-4" />
          <span>Delete</span>
        </Button>
      )}
      <Button
        variant="ghost"
        size="sm"
        className={`flex items-center gap-1 ${buttonInfo.style}`}
        onClick={handlePublishClick}
      >
        {buttonInfo.icon}
        <span>{buttonInfo.text}</span>
      </Button>

      <AlertDialog
        open={showPublishConfirmModal}
        onOpenChange={setShowPublishConfirmModal}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Action</AlertDialogTitle>
            <AlertDialogDescription>
              {buttonInfo.confirmMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePublishConfirm}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={showDeleteConfirmModal}
        onOpenChange={setShowDeleteConfirmModal}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this job? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const DashboardJobs = () => {
  const [activeTab, setActiveTab] = useState("open");
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [displayedJobs, setDisplayedJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const { sendRequest, loading, error } = useApi();
  const loadingRef = useRef();
  const navigate = useNavigate();

  const handleJobClick = (jdId) => {
    navigate(`/admin/job-applicants/${jdId}`);
  };
  const fetchJobs = async () => {
    try {
      const response = await sendRequest({
        method: "GET",
        url: "/talent/connect/jobDescriptions",
      });

      if (response?.jobDescriptions) {
        setJobs(response.jobDescriptions);
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    let filtered = jobs;

    if (activeTab === "open") {
      filtered = filtered.filter((job) => job.publish === "1");
    } else if (activeTab === "draft") {
      filtered = filtered.filter((job) => job.publish === "2");
    } else if (activeTab === "closed") {
      filtered = filtered.filter((job) => job.publish === "0");
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.jd_title?.toLowerCase().includes(term) ||
          job.jd_location?.toLowerCase().includes(term) ||
          job.jd_role?.toLowerCase().includes(term)
      );
    }

    setFilteredJobs(filtered);
    setPage(1);
    setHasMore(true);
    setDisplayedJobs(filtered.slice(0, JOBS_PER_PAGE));
  }, [activeTab, jobs, searchTerm]);

  const loadMoreJobs = useCallback(() => {
    if (isLoadingMore) return;

    setIsLoadingMore(true);

    setTimeout(() => {
      const nextPage = page + 1;
      const startIndex = (nextPage - 1) * JOBS_PER_PAGE;
      const endIndex = startIndex + JOBS_PER_PAGE;
      const nextJobs = filteredJobs.slice(startIndex, endIndex);

      if (nextJobs.length > 0) {
        setDisplayedJobs((prev) => [...prev, ...nextJobs]);
        setPage(nextPage);
        setHasMore(endIndex < filteredJobs.length);
      } else {
        setHasMore(false);
      }

      setIsLoadingMore(false);
    }, 800);
  }, [page, filteredJobs, isLoadingMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !isLoadingMore) {
          loadMoreJobs();
        }
      },
      { threshold: 1.0 }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => {
      if (loadingRef.current) {
        observer.unobserve(loadingRef.current);
      }
    };
  }, [hasMore, isLoadingMore, loadMoreJobs]);

  const handlePublishToggle = async (job) => {
    let newStatus;

    switch (job.publish) {
      case "0": // If job is Closed -> move to Open
        newStatus = "1";
        break;
      case "1": // If job is Open -> move to Closed
        newStatus = "0";
        break;
      case "2": // If job is Draft -> move to Open
        newStatus = "1";
        break;
      default:
        newStatus = "0";
    }

    try {
      await sendRequest({
        method: "POST",
        url: `/talent/connect/jobDescriptionStatus`,
        data: {
          publish: newStatus,
          jdId: job.jd_id,
        },
      });

      // Refresh the jobs list after successful update
      await fetchJobs();
    } catch (err) {
      console.error("Error toggling publish status:", err);
    }
  };

  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setIsViewModalOpen(true);
  };

  const handleEditClick = (job) => {
    setSelectedJob(job);
    setIsEditModalOpen(true);
  };

  const handleJobUpdate = (updatedJob) => {
    setJobs(
      jobs.map((job) =>
        job.jd_id === selectedJob.jd_id ? { ...job, ...updatedJob } : job
      )
    );
  };

  const getStatusLabel = (publish) => {
    switch (publish) {
      case "1":
        return "Active";
      case "2":
        return "Draft";
      case "0":
        return "Closed";
      default:
        return "Unknown";
    }
  };

  const getStatusColor = (publish) => {
    switch (publish) {
      case "1":
        return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30";
      case "2":
        return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30";
      default:
        return "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800";
    }
  };

  const formatDaysAgo = (dateString) => {
    const postedDate = new Date(dateString);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - postedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-red-500 dark:text-red-400">
          Error loading jobs: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-4">
      <JobDetailsModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        job={selectedJob}
      />

      <EditJobModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        job={selectedJob}
        onJobUpdated={handleJobUpdate}
      />

      <Card className="shadow-sm dark:bg-gray-900 dark:border-gray-800">
        <CardContent className="p-0">
          <div className="flex justify-between items-center p-4 border-b dark:border-gray-800">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Posted Jobs
            </h1>
            <Button
              onClick={() => navigate("/job-posting")}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Post a job
            </Button>
          </div>

          <div className="p-4 border-b dark:border-gray-800">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <Input
                placeholder="Search jobs..."
                className="pl-9 w-full dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="px-4 border-b dark:border-gray-800">
            <Tabs value={activeTab} className="w-full">
              <TabsList className="bg-transparent dark:bg-transparent h-12 w-full justify-start gap-8 p-0">
                <TabsTrigger
                  value="open"
                  className={`${
                    activeTab === "open"
                      ? "border-b-2 border-gray-900 dark:border-gray-100"
                      : ""
                  } data-[state=active]:bg-transparent dark:text-gray-300 px-1 flex items-center gap-2`}
                  onClick={() => setActiveTab("open")}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Open
                </TabsTrigger>
                <TabsTrigger
                  value="draft"
                  className={`${
                    activeTab === "draft"
                      ? "border-b-2 border-gray-900 dark:border-gray-100"
                      : ""
                  } data-[state=active]:bg-transparent dark:text-gray-300 px-1 flex items-center gap-2`}
                  onClick={() => setActiveTab("draft")}
                >
                  <FileEdit className="h-4 w-4" />
                  Draft
                </TabsTrigger>
                <TabsTrigger
                  value="closed"
                  className={`${
                    activeTab === "closed"
                      ? "border-b-2 border-gray-900 dark:border-gray-100"
                      : ""
                  } data-[state=active]:bg-transparent dark:text-gray-300 px-1 flex items-center gap-2`}
                  onClick={() => setActiveTab("closed")}
                >
                  <ClipboardList className="h-4 w-4" />
                  Closed
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div>
            {loading && !isLoadingMore ? (
              <>
                <JobSkeleton />
                <JobSkeleton />
                <JobSkeleton />
              </>
            ) : (
              <>
                {displayedJobs.map((job, index) => (
                  <div
                    key={job.jd_id}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 p-4 cursor-pointer ${
                      index !== displayedJobs.length - 1
                        ? "border-b dark:border-gray-800"
                        : ""
                    }`}
                    onClick={() => handleJobClick(job.jd_id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center justify-center">
                        <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-4">
                          <div className="min-w-0">
                            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
                              {job.jd_title}
                            </h3>
                            {job.company_name && (
                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                                <Building2 className="h-4 w-4" />
                                <span>{job.company_name}</span>
                              </div>
                            )}
                            {job.jd_location && (
                              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                                <MapPin className="h-4 w-4" />
                                <span>{job.jd_location}</span>
                              </div>
                            )}
                          </div>
                          <JobActions
                            job={job}
                            onViewDetails={handleViewDetails}
                            onEdit={handleEditClick}
                            onPublishToggle={handlePublishToggle}
                          />
                        </div>
                        <div className="mt-3 flex flex-wrap gap-3">
                          <span
                            className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${getStatusColor(
                              job.publish
                            )}`}
                          >
                            {job.publish === "1" ? (
                              <CheckCircle2 className="h-3 w-3" />
                            ) : (
                              <ClipboardList className="h-3 w-3" />
                            )}
                            {getStatusLabel(job.publish)}
                          </span>
                          {job.package && (
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center gap-1">
                              <Package className="h-3 w-3" />
                              {job.package}
                            </span>
                          )}
                          {job.no_of_opening && (
                            <span className="text-xs px-2 py-1 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {job.no_of_opening} openings
                            </span>
                          )}
                        </div>
                        {job.created_at && (
                          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Posted {formatDaysAgo(job.created_at)}
                          </div>
                        )}
                        {job.company_description && (
                          <div className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                            <HTMLContent
                              content={job.company_description}
                              truncate={true}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {(isLoadingMore || hasMore) && (
                  <div ref={loadingRef}>
                    {isLoadingMore && <LoadingSpinner />}
                  </div>
                )}

                {displayedJobs.length === 0 && !loading && (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    No jobs found for the current filters
                  </div>
                )}

                {!hasMore && displayedJobs.length > 0 && (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400 border-t dark:border-gray-800">
                    No more jobs to load
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardJobs;
