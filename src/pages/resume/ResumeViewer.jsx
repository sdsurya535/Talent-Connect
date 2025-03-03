import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { useApi } from "@/hooks/useApi";

const ResumeViewer = () => {
  // Get userId and resumeType from URL
  const pathParts = window.location.pathname.split("/");
  const userId = pathParts[pathParts.length - 1];
  const searchParams = new URLSearchParams(window.location.search);
  const resumeType = searchParams.get("type");

  const { sendRequest, loading, error } = useApi();
  const [resumeData, setResumeData] = useState(null);

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        const response = await sendRequest({
          url: `talent/connect/modifiedResume`,
          method: "POST",
          data: {
            resumeNumber: Number(resumeType),
            resumeId: Number(userId),
          },
        });

        setResumeData(response.resumeResponse);
      } catch (err) {
        console.error("Error fetching resume:", err);
      }
    };

    if (userId && resumeType) {
      fetchResumeData();
    }
  }, [userId, resumeType, sendRequest]);

//   const handleBack = () => {
//     window.history.back();
//   };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <Card>
          <CardHeader className="flex flex-row items-center space-x-4 p-4">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-8 w-40" />
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-3/4" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-11/12" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-9/12" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                </div>

                {/* Additional skeleton sections */}
                <div className="mt-8 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                </div>

                <div className="mt-8">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-11/12" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            {/* <Button onClick={handleBack} className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button> */}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-center">Resume not found</p>
            {/* <Button onClick={handleBack} className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button> */}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Fixed header */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-white dark:bg-gray-800 shadow">
        <div className="flex items-center space-x-4 p-4">
          {/* <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button> */}
          <h2 className="text-xl font-semibold">Resume Viewer</h2>
        </div>
      </div>

      {/* Full screen iframe */}
      <div className="pt-16">
        {" "}
        {/* Add padding to account for fixed header */}
        <iframe
          src={`data:application/pdf;base64,${resumeData}`}
          className="w-full h-screen"
          title="Resume Viewer"
        />
      </div>
    </div>
  );
};

export default ResumeViewer;
