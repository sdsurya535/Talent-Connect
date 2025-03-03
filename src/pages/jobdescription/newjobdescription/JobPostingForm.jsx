import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Eye, Users, Loader2, Save } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";

import Stepper from "./Stepper";
import { formSections, getInitialFormState } from "./formSections";
import JobDescription from "./JobDescription";
import BasicDetails from "./BasicDetails";
import JobPreview from "./JobPreview";
import FilterDetails from "./FilterDetails";
import ScreeningQuestions from "./ScreeningQuestions";

const STORAGE_KEY = "jobPostingFormData";

const SaveAsDraftModal = ({ isOpen, onOpenChange, onConfirm, onCancel }) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md dark:bg-gray-800 dark:border-gray-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-semibold dark:text-white">
            Save as Draft
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
            Are you sure you want to save this job posting as a draft? Please
            note that once saved as a draft, it cannot be edited further.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="space-x-2">
          <AlertDialogCancel
            onClick={onCancel}
            className="mt-0 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Save as Draft
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const UpdateConfirmModal = ({ isOpen, onOpenChange, onConfirm, onCancel }) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md dark:bg-gray-800 dark:border-gray-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-semibold dark:text-white">
            Update Job Posting
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
            Are you sure you want to update this job posting? This will update
            the current job posting with your changes.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="space-x-2">
          <AlertDialogCancel
            onClick={onCancel}
            className="mt-0 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Update
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const StudentCountVerificationModal = ({
  filters,
  isOpen,
  onOpenChange,
  onConfirm,
  onCancel,
}) => {
  const [studentCount, setStudentCount] = React.useState(null);
  const { sendRequest, loading, error } = useApi();
  const abortControllerRef = React.useRef(null);

  const fetchStudentCount = React.useCallback(async () => {
    if (!isOpen) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      const transformedIsComplete =
        filters.isComplete?.map((value) =>
          value === "Yes" ? 1 : value === "No" ? 0 : value
        ) || [];
      const filterData = {
        stateId: filters.states?.map((state) => state.value) || [],
        programId: filters.ugPrograms?.map((prog) => prog.value) || [],
        pgProgramId: filters.pgPrograms?.map((prog) => prog.value) || [],
        branches: filters.ugBranches?.map((branch) => branch.value) || [],
        pgBranch: filters.pgBranches?.map((branch) => branch.value) || [],
        domainId: filters.domains?.map((domain) => domain.value) || [],
        instituteId:
          filters.institutes?.map((institutes) => institutes.value) || [],
        finalYear: filters.ugPassoutYears || [],
        pgYearOfPassing: filters.pgPassoutYears || [],
        tenth: filters.tenth || "",
        twelfth: filters.twelfth || "",
        btech: filters.btech || "",
        isCompleted: transformedIsComplete,
      };

      const response = await sendRequest({
        method: "POST",
        url: "/talent/connect/studentIntakeCount",
        data: filterData,
        timeout: 60000,
        signal: abortControllerRef.current.signal,
      });

      if (response && response.studentsCounting !== undefined) {
        setStudentCount(response.studentsCounting);
      }
    } catch (err) {
      // Ignore errors from cancelled requests
      if (err.message !== "REQUEST_CANCELLED") {
        console.error("Error fetching student count:", err);
        toast.error("Failed to fetch student count");
      }
    }
  }, [filters, isOpen, sendRequest]);

  React.useEffect(() => {
    if (isOpen) {
      setStudentCount(null);
      fetchStudentCount();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchStudentCount, isOpen]);

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setStudentCount(null);
    onCancel();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md dark:bg-gray-800 dark:border-gray-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-semibold dark:text-white">
            Verify Student Count
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4 dark:text-gray-300">
            {loading ? (
              <div className="flex items-center justify-center space-x-2 py-8">
                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Calculating student count...
                </span>
              </div>
            ) : error ? (
              <Alert
                variant="destructive"
                className="dark:bg-red-900 dark:border-red-800"
              >
                <AlertTitle className="dark:text-red-200">Error</AlertTitle>
                <AlertDescription className="dark:text-red-100">
                  Failed to fetch student count. Please try again.
                </AlertDescription>
              </Alert>
            ) : studentCount !== null ? (
              <div className="space-y-4">
                <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-900 dark:border-blue-800">
                  <Users className="h-5 w-5 text-blue-500 dark:text-blue-300" />
                  <AlertTitle className="text-blue-700 dark:text-blue-200">
                    Eligible Students
                  </AlertTitle>
                  <AlertDescription className="text-2xl font-bold text-blue-800 dark:text-blue-100">
                    {studentCount.toLocaleString()} Students
                  </AlertDescription>
                </Alert>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Based on your selected filters, this job posting will be
                  visible to the above number of students. Would you like to
                  proceed with creating the job posting?
                </p>
              </div>
            ) : null}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="space-x-2">
          <AlertDialogCancel
            onClick={handleCancel}
            className="mt-0 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            Back to Filters
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            disabled={loading || error || studentCount === null}
          >
            Proceed
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const JobPostingForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(getInitialFormState());
  const [previewOpen, setPreviewOpen] = useState(false);
  const [verificationOpen, setVerificationOpen] = useState(false);
  const [draftModalOpen, setDraftModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const { sendRequest, loading } = useApi();
  const { jobId } = useParams(); // Get jobId from URL if present
  const navigate = useNavigate();

  // Check if we're in update mode based on presence of jobId
  useEffect(() => {
    if (jobId) {
      setIsUpdateMode(true);
      fetchJobDetails(jobId);
    } else {
      // We're in create mode, load from localStorage
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        try {
          setFormData(JSON.parse(savedData));
        } catch (error) {
          console.error("Error loading saved form data:", error);
        }
      }
    }
  }, [jobId]);

  // Fetch job details for editing
  const fetchJobDetails = async (id) => {
    const loadingToast = toast.loading("Loading job posting details...");
    try {
      const response = await sendRequest({
        method: "GET",
        url: `/talent/connect/job/${id}`,
        timeout: 60000,
      });

      if (response) {
        // Parse filters and screening questions
        let jobData = {
          ...response,
          filters: response.filters
            ? JSON.parse(response.filters)
            : getInitialFormState().filters,
          screeningQuestions: response.screeningQuestions
            ? JSON.parse(response.screeningQuestions)
            : [],
        };

        // Transform isCompleted array back to "Yes"/"No" format if needed
        if (jobData.filters.isCompleted) {
          jobData.filters.isComplete = jobData.filters.isCompleted.map((val) =>
            val === 1 ? "Yes" : val === 0 ? "No" : val
          );
        }

        setFormData(jobData);
      }
      toast.dismiss(loadingToast);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Failed to load job posting details");
      console.error("Error fetching job details:", error);
    }
  };

  // Save to localStorage when form data changes (only in create mode)
  useEffect(() => {
    if (!isUpdateMode) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      } catch (error) {
        console.error("Error saving form data:", error);
      }
    }
  }, [formData, isUpdateMode]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveAsDraft = async () => {
    const loadingToast = toast.loading("Saving job posting as draft...");

    try {
      const transformedIsComplete =
        formData.filters.isComplete?.map((value) =>
          value === "Yes" ? 1 : value === "No" ? 0 : value
        ) || [];

      const submitData = {
        ...formData,
        status: "draft",
        screeningQuestions: JSON.stringify(formData.screeningQuestions),
        filters: JSON.stringify({
          stateId: formData.filters.states?.map((state) => state.value) || [],
          programId:
            formData.filters.ugPrograms?.map((prog) => prog.value) || [],
          pgProgramId:
            formData.filters.pgPrograms?.map((prog) => prog.value) || [],
          branches:
            formData.filters.ugBranches?.map((branch) => branch.value) || [],
          pgBranch:
            formData.filters.pgBranches?.map((branch) => branch.value) || [],
          domainId:
            formData.filters.domains?.map((domain) => domain.value) || [],
          instituteId:
            formData.filters.institutes?.map(
              (institutes) => institutes.value
            ) || [],
          finalYear: formData.filters.ugPassoutYears || [],
          pgYearOfPassing: formData.filters.pgPassoutYears || [],
          isCompleted: transformedIsComplete,
          tenth: formData.filters.tenth || "",
          twelfth: formData.filters.twelfth || "",
          btech: formData.filters.btech || "",
        }),
        stateId: formData.filters.states?.map((state) => state.value) || [],
        programId: formData.filters.ugPrograms?.map((prog) => prog.value) || [],
        pgProgramId:
          formData.filters.pgPrograms?.map((prog) => prog.value) || [],
        branches:
          formData.filters.ugBranches?.map((branch) => branch.value) || [],
        pgBranch:
          formData.filters.pgBranches?.map((branch) => branch.value) || [],
        domainId: formData.filters.domains?.map((domain) => domain.value) || [],
        instituteId:
          formData.filters.institutes?.map((institutes) => institutes.value) ||
          [],
        finalYear: formData.filters.ugPassoutYears || [],
        pgYearOfPassing: formData.filters.pgPassoutYears || [],
        isCompleted: transformedIsComplete,
        tenth: formData.filters.tenth || "",
        twelfth: formData.filters.twelfth || "",
        btech: formData.filters.btech || "",
      };

      await sendRequest({
        method: "POST",
        url: "/talent/connect/createJobPosting",
        data: submitData,
        timeout: 60000,
      });

      toast.dismiss(loadingToast);
      toast.success("Job posting saved as draft successfully!");

      localStorage.removeItem(STORAGE_KEY);
      setFormData(getInitialFormState());
      setCurrentStep(1);

      // Redirect to job listings page
      navigate("/jobs");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Failed to save job posting as draft");
      console.error("Error saving draft:", error);
    }
  };

  const handleUpdateJob = async () => {
    const loadingToast = toast.loading("Updating job posting...");

    try {
      const transformedIsComplete =
        formData.filters.isComplete?.map((value) =>
          value === "Yes" ? 1 : value === "No" ? 0 : value
        ) || [];

      const updateData = {
        ...formData,
        screeningQuestions: JSON.stringify(formData.screeningQuestions),
        filters: JSON.stringify({
          stateId: formData.filters.states?.map((state) => state.value) || [],
          programId:
            formData.filters.ugPrograms?.map((prog) => prog.value) || [],
          pgProgramId:
            formData.filters.pgPrograms?.map((prog) => prog.value) || [],
          branches:
            formData.filters.ugBranches?.map((branch) => branch.value) || [],
          pgBranch:
            formData.filters.pgBranches?.map((branch) => branch.value) || [],
          domainId:
            formData.filters.domains?.map((domain) => domain.value) || [],
          instituteId:
            formData.filters.institutes?.map(
              (institutes) => institutes.value
            ) || [],
          finalYear: formData.filters.ugPassoutYears || [],
          pgYearOfPassing: formData.filters.pgPassoutYears || [],
          isCompleted: transformedIsComplete,
          tenth: formData.filters.tenth || "",
          twelfth: formData.filters.twelfth || "",
          btech: formData.filters.btech || "",
        }),
        stateId: formData.filters.states?.map((state) => state.value) || [],
        programId: formData.filters.ugPrograms?.map((prog) => prog.value) || [],
        pgProgramId:
          formData.filters.pgPrograms?.map((prog) => prog.value) || [],
        branches:
          formData.filters.ugBranches?.map((branch) => branch.value) || [],
        pgBranch:
          formData.filters.pgBranches?.map((branch) => branch.value) || [],
        domainId: formData.filters.domains?.map((domain) => domain.value) || [],
        instituteId:
          formData.filters.institutes?.map((institutes) => institutes.value) ||
          [],
        finalYear: formData.filters.ugPassoutYears || [],
        pgYearOfPassing: formData.filters.pgPassoutYears || [],
        isCompleted: transformedIsComplete,
        tenth: formData.filters.tenth || "",
        twelfth: formData.filters.twelfth || "",
        btech: formData.filters.btech || "",
      };

      await sendRequest({
        method: "PUT",
        url: `/talent/connect/updateJob/${jobId}`,
        data: updateData,
        timeout: 60000,
      });

      toast.dismiss(loadingToast);
      toast.success("Job posting updated successfully!");

      // Redirect to job listings page
      navigate("/jobs");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Failed to update job posting");
      console.error("Error updating job:", error);
    }
  };

  const handleNextStep = () => {
    const currentSection = formSections[currentStep - 1];

    if (currentSection.key === "filters") {
      setVerificationOpen(true);
    } else if (currentStep < formSections.length) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // If in update mode, show update confirmation modal
      if (isUpdateMode) {
        setUpdateModalOpen(true);
      } else {
        // Otherwise show save as draft modal (create mode)
        setDraftModalOpen(true);
      }
    }
  };

  const handleVerificationConfirm = () => {
    setVerificationOpen(false);
    setCurrentStep((prev) => prev + 1);
  };

  const handleVerificationCancel = () => {
    setVerificationOpen(false);
  };

  const renderSectionContent = (section) => {
    switch (section.key) {
      case "basicDetails":
        return (
          <BasicDetails formData={formData} onChange={handleInputChange} />
        );

      case "description":
        return (
          <JobDescription
            value={formData.description}
            onChange={(value) => handleInputChange("description", value)}
          />
        );

      case "filters":
        return (
          <FilterDetails
            formData={formData.filters}
            onChange={(filters) => handleInputChange("filters", filters)}
          />
        );

      case "screeningQuestions":
        return (
          <ScreeningQuestions
            value={formData.screeningQuestions}
            onChange={(questions) =>
              handleInputChange("screeningQuestions", questions)
            }
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <Card className="px-6 py-6 dark:bg-gray-800 dark:border-gray-700">
        <div className="border-b pb-4 mb-6 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isUpdateMode ? "Edit Job Posting" : "Create Job Posting"}
            </h1>
          </div>
          <div className="mt-4">
            <Stepper steps={formSections} currentStep={currentStep} />
          </div>
        </div>

        {renderSectionContent(formSections[currentStep - 1])}

        <div className="flex justify-between mt-8 pt-4 border-t dark:border-gray-700">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
            >
              Back
            </Button>
            <Sheet open={previewOpen} onOpenChange={setPreviewOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full sm:max-w-2xl overflow-y-auto dark:bg-gray-800 dark:border-gray-700"
              >
                <JobPreview formData={formData} />
              </SheetContent>
            </Sheet>

            {/* Add Save button that's always available in update mode */}
            {isUpdateMode && (
              <Button
                variant="outline"
                className="flex items-center gap-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
                onClick={() => setUpdateModalOpen(true)}
                disabled={loading}
              >
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            )}
          </div>
          <Button
            onClick={handleNextStep}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {currentStep === formSections.length
              ? isUpdateMode
                ? "Update Job"
                : "Save as Draft"
              : "Next"}
          </Button>
        </div>
      </Card>

      <StudentCountVerificationModal
        filters={formData.filters}
        isOpen={verificationOpen}
        onOpenChange={setVerificationOpen}
        onConfirm={handleVerificationConfirm}
        onCancel={handleVerificationCancel}
      />

      <SaveAsDraftModal
        isOpen={draftModalOpen}
        onOpenChange={setDraftModalOpen}
        onConfirm={() => {
          setDraftModalOpen(false);
          handleSaveAsDraft();
        }}
        onCancel={() => setDraftModalOpen(false)}
      />

      <UpdateConfirmModal
        isOpen={updateModalOpen}
        onOpenChange={setUpdateModalOpen}
        onConfirm={() => {
          setUpdateModalOpen(false);
          handleUpdateJob();
        }}
        onCancel={() => setUpdateModalOpen(false)}
      />
    </div>
  );
};

export default JobPostingForm;
