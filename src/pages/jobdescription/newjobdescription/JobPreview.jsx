import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  MapPin,
  Clock,
  Briefcase,
  Users,
  Calendar,
  BadgeCheck,
  IndianRupee,
  Building2,
} from "lucide-react";

const JobPreview = ({ formData }) => {
  const hasContent = (field) => {
    if (field === null || field === undefined) return false;

    if (Array.isArray(field)) {
      return field.some((item) => {
        if (item === null || item === undefined) return false;
        return String(item).trim() !== "";
      });
    }

    return String(field).trim() !== "";
  };

  const parseContent = (content) => {
    if (!content) return "";

    let parsedContent = content
      .replace(/•\s?(.*?)(?=(?:•|\n|$))/g, (match, p1) => {
        const indentedContent = p1.replace(/\n\s*/g, "\n        ");
        return `<li class="ml-5 pl-1">${indentedContent}</li>`;
      })
      .replace(/^\d+\.\s?(.*?)(?=(?:\d+\.|\n|$))/gm, (match, p1) => {
        const indentedContent = p1.replace(/\n\s*/g, "\n        ");
        return `<li class="ml-5 pl-1">${indentedContent}</li>`;
      });

    parsedContent = parsedContent.replace(
      /<li[^>]*>(?:[^<]|<(?!\/li>))*<\/li>(?:\s*<li[^>]*>(?:[^<]|<(?!\/li>))*<\/li>)*/g,
      (match) => {
        if (/^\d+\./.test(match)) {
          return `<ol class="list-decimal list-outside space-y-1 ml-4">${match}</ol>`;
        }
        return `<ul class="list-disc list-outside space-y-1 ml-4">${match}</ul>`;
      }
    );

    parsedContent = parsedContent.replace(/\n(?!\s*<[uo]l>)/g, "<br />");

    return parsedContent;
  };

  return (
    <Card className="p-6 max-w-4xl mx-auto bg-white dark:bg-gray-900 shadow-lg">
      <div className="space-y-6">
        {/* Header Section - LinkedIn Style */}
        <div className="flex items-start gap-6 pb-6 border-b dark:border-gray-800">
          {/* Company Logo */}
          <div className="flex-shrink-0">
            {hasContent(formData.companyLogo) ? (
              <img
                src={formData.companyLogo}
                alt={`${formData.company} logo`}
                className="w-24 h-24 object-contain rounded bg-white dark:bg-gray-800"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                <Building2 className="w-12 h-12 text-gray-400 dark:text-gray-600" />
              </div>
            )}
          </div>

          {/* Job Title and Company Info */}
          <div className="flex-1 space-y-4">
            {hasContent(formData.jdTitle) && (
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {formData.jdTitle}
              </h1>
            )}

            <div className="space-y-2">
              {hasContent(formData.company) && (
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  {formData.company}
                </h2>
              )}

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-600 dark:text-gray-400 text-sm">
                {hasContent(formData.jdLocation) && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>{formData.jdLocation}</span>
                  </div>
                )}
                {hasContent(formData.workplaceType) && (
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4" />
                    <span>{formData.workplaceType}</span>
                  </div>
                )}
                {hasContent(formData.jobType) && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{formData.jobType}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                {hasContent(formData.noOfOpening) && (
                  <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 text-sm">
                    <Users className="w-4 h-4" />
                    <span>
                      {formData.noOfOpening}{" "}
                      {parseInt(formData.noOfOpening) === 1
                        ? "opening"
                        : "openings"}
                    </span>
                  </div>
                )}
                {hasContent(formData.package) && (
                  <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 text-sm">
                    <IndianRupee className="w-4 h-4" />
                    <span>{formData.package}</span>
                  </div>
                )}
              </div>

              {/* Registration Period */}
              {(hasContent(formData.registrationStart) ||
                hasContent(formData.registrationEnd)) && (
                <div className="flex flex-wrap gap-4 pt-2 text-sm text-gray-600 dark:text-gray-400">
                  {hasContent(formData.registrationStart) && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>
                        From{" "}
                        {new Date(
                          formData.registrationStart
                        ).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  )}
                  {hasContent(formData.registrationEnd) && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Until{" "}
                        {new Date(formData.registrationEnd).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description Section */}
        {hasContent(formData.description) && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              About the job
            </h3>
            <div
              className="text-sm text-gray-600 dark:text-gray-400 prose prose-sm dark:prose-invert max-w-none [&_ul]:mt-1.5 [&_ol]:mt-1.5 [&_li]:mt-0.5 [&_li]:leading-5"
              dangerouslySetInnerHTML={{
                __html: parseContent(formData.description),
              }}
            />
          </div>
        )}

        {/* Screening Questions Section */}
        {formData.screeningQuestions &&
          formData.screeningQuestions.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Screening Questions
                </h3>
              </div>
              <div className="space-y-4">
                {formData.screeningQuestions.map((question, index) => (
                  <div
                    key={question.id}
                    className="flex items-start gap-3 pl-2"
                  >
                    <div className="pt-0.5">
                      <Checkbox disabled />
                    </div>
                    <div className="space-y-1">
                      <p className="text-gray-900 dark:text-gray-100">
                        {question.question}
                      </p>
                      {question.type === "expertise" && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Minimum {question.minimumYears} year
                          {question.minimumYears !== "1" ? "s" : ""} required
                        </p>
                      )}
                      {question.isMandatory && (
                        <Badge
                          variant="secondary"
                          className="text-xs dark:bg-gray-800 dark:text-gray-300"
                        >
                          Required
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Skills Section */}
        {formData.skills &&
          formData.skills.length > 0 &&
          formData.skills.some((skill) => hasContent(skill)) && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map(
                  (skill, index) =>
                    hasContent(skill) && (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="px-2.5 py-1 text-sm dark:bg-gray-800 dark:text-gray-300"
                      >
                        {skill}
                      </Badge>
                    )
                )}
              </div>
            </div>
          )}

        {/* Requirements Section */}
        {(hasContent(formData.requirements) ||
          (formData.qualifications &&
            formData.qualifications.some((qual) => hasContent(qual)))) && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Requirements
            </h3>
            {hasContent(formData.requirements) && (
              <div
                className="text-sm text-gray-600 dark:text-gray-400 prose prose-sm dark:prose-invert max-w-none [&_ul]:mt-1.5 [&_ol]:mt-1.5 [&_li]:mt-0.5 [&_li]:leading-5"
                dangerouslySetInnerHTML={{
                  __html: parseContent(formData.requirements),
                }}
              />
            )}
            {formData.qualifications &&
              formData.qualifications.some((qual) => hasContent(qual)) && (
                <ul className="list-disc list-outside ml-4 text-sm text-gray-600 dark:text-gray-400 space-y-0.5">
                  {formData.qualifications.map(
                    (qual, index) =>
                      hasContent(qual) && (
                        <li key={index} className="ml-1 pl-1 leading-5">
                          {qual}
                        </li>
                      )
                  )}
                </ul>
              )}
          </div>
        )}

        {/* Benefits Section */}
        {(formData.benefits?.some((benefit) => hasContent(benefit)) ||
          hasContent(formData.salary)) && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Benefits
            </h3>
            {hasContent(formData.salary) && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Salary: {formData.salary}
              </div>
            )}
            {formData.benefits &&
              formData.benefits.some((benefit) => hasContent(benefit)) && (
                <ul className="list-disc list-outside ml-4 text-sm text-gray-600 dark:text-gray-400 space-y-0.5">
                  {formData.benefits.map(
                    (benefit, index) =>
                      hasContent(benefit) && (
                        <li key={index} className="ml-1 pl-1 leading-5">
                          {benefit}
                        </li>
                      )
                  )}
                </ul>
              )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default JobPreview;
