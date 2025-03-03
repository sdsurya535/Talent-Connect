import React, { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Briefcase,
  MapPin,
  Clock,
  Users,
  DollarSign,
  GraduationCap,
  Award,
} from "lucide-react";

export const JobDetailView = ({ job, open, onClose }) => {
  // Cleanup effect to remove any stray overlays when component unmounts
  useEffect(() => {
    return () => {
      // Remove any remaining dialog overlays on unmount
      const overlays = document.querySelectorAll('[role="presentation"]');
      overlays.forEach((overlay) => overlay.remove());
    };
  }, []);

  // Handle modal close properly
  const handleClose = () => {
    if (onClose) {
      onClose();
      // Small timeout to ensure smooth transition
      setTimeout(() => {
        const overlays = document.querySelectorAll('[role="presentation"]');
        overlays.forEach((overlay) => overlay.remove());
      }, 100);
    }
  };

  const parseJsonString = (jsonString, defaultValue = []) => {
    try {
      if (!jsonString) return defaultValue;
      const parsed = JSON.parse(jsonString);
      // Handle cases where the JSON string contains a single string with commas
      if (Array.isArray(parsed)) {
        if (
          parsed.length === 1 &&
          typeof parsed[0] === "string" &&
          parsed[0].includes(",")
        ) {
          return parsed[0].split(",").map((item) => item.trim());
        }
        return parsed;
      }
      return defaultValue;
    } catch (error) {
      console.error("Error parsing JSON string:", error);
      return defaultValue;
    }
  };

  const skills = parseJsonString(job.skill_required, []);
  const gender = parseJsonString(job.gender, []);
  const selectionProcess = parseJsonString(job.selection_process, []);
  const responsibilities = parseJsonString(job.responsibility, []);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 border border-blue-100 dark:border-blue-900">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            {job.jd_title}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-6">
            {/* Location Section */}
            <div>
              <h3 className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4" />
                Location
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {job.jd_location}
              </p>
            </div>

            {/* Schedule Section */}
            <div>
              <h3 className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4" />
                Schedule
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Shift Time: {job.shifting_time}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Weekly Off: {job.weekly_off} days
              </p>
            </div>

            {/* Details Section */}
            <div>
              <h3 className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-2 mb-2">
                <Users className="h-4 w-4" />
                Details
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Openings: {job.no_of_opening} positions
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Gender: {gender.join(", ")}
              </p>
            </div>

            {/* Package & Joining Section */}
            <div>
              <h3 className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4" />
                Package & Joining
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Package: {job.package}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Joining: {job.joining}
              </p>
              {job.Bond && (
                <p className="text-gray-700 dark:text-gray-300">
                  Bond Period: {job.Bond}
                </p>
              )}
            </div>

            {/* Job Role Section */}
            <div>
              <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">
                Job Role
              </h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {job.jd_role}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Qualifications Section */}
            <div>
              <h3 className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-2 mb-2">
                <GraduationCap className="h-4 w-4" />
                Required Qualifications
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Education: {job.qualification}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Passing Year: {job.year_of_passing}
              </p>
              <div className="mt-2">
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  Minimum Marks:
                </p>
                <ul className="list-disc ml-6 text-gray-700 dark:text-gray-300">
                  <li>Matric: {job.matric_mark}%</li>
                  <li>Diploma: {job.diploma_mark}%</li>
                  <li>B.Tech: {job.btech_mark} CGPA</li>
                </ul>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mt-2">
                Maximum Backlog: {job.backlog}
              </p>
            </div>

            {/* Skills Section */}
            <div>
              <h3 className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-2 mb-2">
                <Award className="h-4 w-4" />
                Skills Required
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <Badge
                    key={index}
                    className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Responsibilities Section */}
            {responsibilities.length > 0 && (
              <div>
                <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">
                  Responsibilities
                </h3>
                <ul className="list-disc ml-6 text-gray-700 dark:text-gray-300">
                  {responsibilities.map((responsibility, index) => (
                    <li key={index}>{responsibility}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Selection Process Section */}
            <div>
              <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">
                Selection Process
              </h3>
              <ol className="list-decimal ml-6 text-gray-700 dark:text-gray-300">
                {selectionProcess.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>

            {/* Dates Section */}
            <div>
              <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">
                Important Dates
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Registration Start:{" "}
                {new Date(job.reg_start).toLocaleDateString()}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Registration End: {new Date(job.reg_end).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailView;
