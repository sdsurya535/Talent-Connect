import { useState } from "react";
import { useApi } from "@/hooks/useApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, ExternalLink } from "lucide-react";

const ResumeSearch = () => {
  const [emailAddress, setEmailAddress] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [detail, setDetail] = useState("");
  const { sendRequest, loading, error } = useApi();

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!emailAddress.trim()) return;

    try {
      const response = await sendRequest({
        url: "/talent/connect/resumeInformation",
        method: "POST",
        data: { emailAddress },
      });

      // Store the detail message
      setDetail(response?.detail || "");

      // Check if the detail indicates success and resume is available
      if (
        response?.detail === "successfully fetched resume" &&
        response?.resume
      ) {
        setResumeUrl(response.resume);
      } else {
        // If the detail doesn't match or resume is missing, throw an error
        throw new Error(response?.detail || "Resume information not available");
      }
    } catch (err) {
      // Error is already handled by the useApi hook
      console.error("Search failed:", err);
    }
  };

  return (
    <div className="w-full max-w-md mt-5 mx-auto">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Resume Search</CardTitle>
          <CardDescription>
            Enter an email address to find the associated resume
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email address"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                className="w-full"
                disabled={loading}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !emailAddress.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                "Search Resume"
              )}
            </Button>
          </form>

          {loading && (
            <div className="mt-4 space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-10 w-full" />
            </div>
          )}

          {error && !loading && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {resumeUrl && !error && !loading && (
            <div className="mt-4">
              <Alert>
                <AlertDescription className="flex flex-col gap-3">
                  <span className="font-medium">Status: {detail}</span>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 truncate max-w-[70%]">
                      {resumeUrl}
                    </span>
                    <Button size="sm" variant="outline" asChild>
                      <a
                        href={`${resumeUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        Go to Resume <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeSearch;
