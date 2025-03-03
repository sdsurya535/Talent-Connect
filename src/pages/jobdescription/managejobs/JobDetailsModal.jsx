import React from "react";
import {
  Building2,
  MapPin,
  Package,
  Users,
  Calendar,
  GraduationCap,
  Clock,
  Briefcase,
  X,
} from "lucide-react";

// Enhanced HTMLContent component with proper list styling
const HTMLContent = ({ content }) => {
  // Add specific styles for lists while maintaining security
  const sanitizedContent = content
    ?.replace(
      /<ul>/g,
      '<ul style="list-style-type: disc; padding-left: 1.5rem; margin: 0.5rem 0;">'
    )
    .replace(
      /<ol>/g,
      '<ol style="list-style-type: decimal; padding-left: 1.5rem; margin: 0.5rem 0;">'
    );

  const createMarkup = () => ({ __html: sanitizedContent });

  return content ? (
    <div
      className="prose prose-sm dark:prose-invert max-w-none"
      style={{
        "& ul": { listStyleType: "disc" },
        "& ol": { listStyleType: "decimal" },
      }}
      dangerouslySetInnerHTML={createMarkup()}
    />
  ) : null;
};

const JobDetailsModal = ({ isOpen, onClose, job }) => {
  if (!job) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="bg-white dark:bg-gray-900 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Header Section */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 z-10 p-6 border-b">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {job.jd_title}
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {job.company_name}
                </span>
                {job.jd_location && (
                  <>
                    <span>•</span>
                    <span>{job.jd_location}</span>
                  </>
                )}
                {job.workplace_type && (
                  <>
                    <span>•</span>
                    <span>{job.workplace_type}</span>
                  </>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Key Details */}
          <div className="flex flex-col gap-4">
            {job.package && (
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    Compensation
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {job.package}
                  </div>
                </div>
              </div>
            )}

            {job.no_of_opening && (
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    Number of openings
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {job.no_of_opening} positions
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Academic Requirements */}
          {(job.matric || job.intermadiate || job.cgpa || job.passout_year) && (
            <div className="border-t pt-6">
              <h3 className="text-base font-semibold mb-4 text-gray-900 dark:text-white">
                Academic Requirements
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {job.matric && (
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        Matric
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {job.matric}%
                      </div>
                    </div>
                  </div>
                )}
                {job.intermadiate && (
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        Intermediate
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {job.intermadiate}%
                      </div>
                    </div>
                  </div>
                )}
                {job.cgpa && (
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        CGPA
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {job.cgpa}
                      </div>
                    </div>
                  </div>
                )}
                {job.passout_year && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        Passout Year
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {job.passout_year}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Registration Timeline */}
          {(job.reg_start || job.reg_end) && (
            <div className="border-t pt-6">
              <h3 className="text-base font-semibold mb-4 text-gray-900 dark:text-white">
                Registration Timeline
              </h3>
              <div className="flex flex-col gap-4">
                {job.reg_start && (
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        Registration opens
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(job.reg_start)}
                      </div>
                    </div>
                  </div>
                )}
                {job.reg_end && (
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        Registration closes
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(job.reg_end)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Company Description */}
          {job.company_description && (
            <div className="border-t pt-6">
              <h3 className="text-base font-semibold mb-4 text-gray-900 dark:text-white">
                About the company
              </h3>
              <HTMLContent content={job.company_description} />
            </div>
          )}

          {/* Posted Date */}
          {job.created_at && (
            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 pt-6 border-t">
              <Calendar className="h-3 w-3" />
              <span>Posted {formatDate(job.created_at)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;
