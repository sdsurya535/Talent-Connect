import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Briefcase,
  MapPin,
  Users,
  Calendar,
  DollarSign,
  Award,
  BookOpen,
  Scale,
  User,
  GraduationCap,
  Building,
  CheckCircle,
} from "lucide-react";
import { format } from "date-fns";

const PreviewSection = ({ title, icon: Icon, children }) => (
  <div className="space-y-3">
    <div className="flex items-center space-x-2">
      <Icon className="w-5 h-5 text-blue-500" />
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>
    <div className="pl-7">{children}</div>
  </div>
);

const PreviewField = ({ label, value, className = "" }) => (
  <div className={`text-sm ${className}`}>
    <span className="font-medium text-gray-600">{label}: </span>
    <span className="text-gray-800">{value || "Not specified"}</span>
  </div>
);

const PreviewChips = ({ items = [] }) => (
  <div className="flex flex-wrap gap-2">
    {items.map((item, index) => (
      <span
        key={index}
        className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
      >
        {item}
      </span>
    ))}
  </div>
);

const JobPreviewComponent = ({
  data,
  companies,
  studentCount,
  onBack,
  onProceed,
}) => {
  const company = companies.find(
    (c) => c.company_id.toString() === data.companyId?.toString()
  );

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-blue-900">
              Job Description Preview
            </CardTitle>
            <CardDescription>
              Review all details before creating the job description
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-600">
              Eligible Students
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {studentCount}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Basic Information */}
        <PreviewSection title="Basic Information" icon={Briefcase}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PreviewField label="Company" value={company?.company_name} />
            <PreviewField label="Job Title" value={data.jdTitle} />
            <PreviewField label="Location" value={data.jdLocation} />
            <PreviewField label="Number of Openings" value={data.noOfOpening} />
            <PreviewField label="Weekly Off" value={data.weeklyOff} />
            <PreviewField label="Shifting Time" value={data.shiftingTime} />
          </div>
        </PreviewSection>

        {/* Package and Bond Details */}
        <PreviewSection title="Package and Bond Details" icon={DollarSign}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PreviewField label="Package" value={data.package} />
            <PreviewField label="Bond Period" value={data.bond} />
            <PreviewField label="Joining" value={data.joining} />
          </div>
        </PreviewSection>

        {/* Academic Requirements */}
        <PreviewSection title="Academic Requirements" icon={GraduationCap}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PreviewField label="10th Marks" value={`${data.matricMark}%`} />
            <PreviewField
              label="12th/Diploma Marks"
              value={`${data.diplomaMark}%`}
            />
            <PreviewField label="B.Tech Marks" value={`${data.btechMark}%`} />
            <PreviewField label="Maximum Backlogs" value={data.backlog} />
          </div>
        </PreviewSection>

        {/* Skills and Requirements */}
        <PreviewSection title="Skills and Requirements" icon={BookOpen}>
          <div className="space-y-4">
            <div>
              <div className="font-medium text-gray-600 mb-2">
                Required Skills
              </div>
              <PreviewChips items={data.skillRequired} />
            </div>
            <div>
              <div className="font-medium text-gray-600 mb-2">
                Responsibilities
              </div>
              <PreviewChips items={data.responsibility} />
            </div>
          </div>
        </PreviewSection>

        {/* Selection Process */}
        <PreviewSection title="Selection Process" icon={CheckCircle}>
          <div className="space-y-2">
            {data.selectionProcess.map((step, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-800 text-sm">
                  {index + 1}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </PreviewSection>

        {/* Registration Period */}
        <PreviewSection title="Registration Period" icon={Calendar}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PreviewField
              label="Start Date"
              value={
                data.registrationStart
                  ? format(new Date(data.registrationStart), "PPP")
                  : ""
              }
            />
            <PreviewField
              label="End Date"
              value={
                data.registrationEnd
                  ? format(new Date(data.registrationEnd), "PPP")
                  : ""
              }
            />
          </div>
        </PreviewSection>

        {/* Custom Fields */}
        {Object.keys(data.customFields).length > 0 && (
          <PreviewSection title="Additional Information" icon={BookOpen}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(data.customFields).map(([key, value]) => (
                <PreviewField
                  key={key}
                  label={key
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                  value={Array.isArray(value) ? value.join(", ") : value}
                />
              ))}
            </div>
          </PreviewSection>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          <button
            onClick={onBack}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back to Edit
          </button>
          <button
            onClick={onProceed}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Proceed with Creation
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobPreviewComponent;
