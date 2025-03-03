import React from "react";
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
import { Users, Loader2 } from "lucide-react";
import { useApi } from "@/hooks/useApi";

const StudentCountVerification = ({
  filters,
  isOpen,
  onOpenChange,
  onConfirm,
  onCancel,
}) => {
  const [studentCount, setStudentCount] = React.useState(null);
  const { sendRequest, loading, error } = useApi();

  const fetchStudentCount = React.useCallback(async () => {
    if (!isOpen) return;

    try {
      const filterData = {
        stateId: filters.states || [],
        programId: filters.ugPrograms?.map((prog) => prog.value) || [],
        pgProgramId: filters.pgPrograms?.map((prog) => prog.value) || [],
        branches: filters.ugBranches?.map((branch) => branch.value) || [],
        pgBranch: filters.pgBranches?.map((branch) => branch.value) || [],
        domainId: filters.domains || [],
        finalYear: filters.ugPassoutYears || [],
        pgYearOfPassing: filters.pgPassoutYears || [],
        isCompleted: filters.isComplete || [],
      };

      const response = await sendRequest({
        method: "POST",
        url: "/talent/connect/studentIntakeCount",
        data: filterData,
        timeout: 60000,
      });

      if (response && response.studentsCounting !== undefined) {
        setStudentCount(response.studentsCounting);
      }
    } catch (err) {
      console.error("Error fetching student count:", err);
    }
  }, [filters, isOpen, sendRequest]);

  React.useEffect(() => {
    fetchStudentCount();
  }, [fetchStudentCount]);

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md dark:bg-gray-800">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-semibold dark:text-white">
            Verify Student Count
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center space-x-2 py-8">
                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                <span className="text-sm text-gray-600 dark:text-gray-100">
                  Calculating student count...
                </span>
              </div>
            ) : error ? (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Failed to fetch student count. Please try again.
                </AlertDescription>
              </Alert>
            ) : studentCount !== null ? (
              <div className="space-y-4">
                <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-900 dark:border-blue-800">
                  <Users className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                  <AlertTitle className="text-blue-700 dark:text-blue-300">
                    Eligible Students
                  </AlertTitle>
                  <AlertDescription className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                    {studentCount.toLocaleString()} Students
                  </AlertDescription>
                </Alert>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Based on your selected filters, this job posting will be
                  visible to the above number of students. Would you like to
                  proceed?
                </p>
              </div>
            ) : null}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="space-x-2">
          <AlertDialogCancel
            onClick={onCancel}
            className="mt-0 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            Go Back
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
            disabled={loading || error || studentCount === null}
          >
            Proceed
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default StudentCountVerification;
