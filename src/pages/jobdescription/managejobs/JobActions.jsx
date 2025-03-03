import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  MoreVertical,
  Eye,
  Edit2,
  MapPin,
  Calendar,
  Users,
  Package,
  Building2,
  Briefcase,
  GraduationCap,
  Award,
  Bookmark,
  Clock,
} from "lucide-react";

// Utility function for safe JSON parsing
const safeJsonParse = (jsonString, defaultValue = []) => {
  try {
    if (!jsonString) return defaultValue;
    const parsed = JSON.parse(jsonString);
    return Array.isArray(parsed) ? parsed : defaultValue;
  } catch (error) {
    console.warn("Error parsing JSON:", error);
    return defaultValue;
  }
};

// Component to parse and render HTML content safely
const HTMLContent = ({ content }) => {
  const createMarkup = () => ({ __html: content });
  return content ? <div dangerouslySetInnerHTML={createMarkup()} /> : null;
};

// View Details Dialog Component
const ViewDetailsDialog = ({ job, open, onOpenChange }) => {
  if (!job) return null;

  const skills = safeJsonParse(job.skill_required);
  const responsibilities = safeJsonParse(job.responsibility);

  const formatDaysAgo = (dateString) => {
    const postedDate = new Date(dateString);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - postedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Job Details</DialogTitle>
        </DialogHeader>

        {/* Job Header Section */}
        <div className="border-b pb-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
              <Briefcase className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{job.jd_title}</h2>
              {job.company_name && (
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <Building2 className="h-4 w-4" />
                  <span>{job.company_name}</span>
                </div>
              )}
              {job.jd_location && (
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <MapPin className="h-4 w-4" />
                  <span>{job.jd_location}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Key Details Grid */}
        <div className="grid grid-cols-2 gap-4 py-6 border-b">
          {job.package && (
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Package</p>
                <p className="font-medium">{job.package}</p>
              </div>
            </div>
          )}
          {job.no_of_opening && (
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Openings</p>
                <p className="font-medium">{job.no_of_opening}</p>
              </div>
            </div>
          )}
          {job.shifting_time && (
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Shifts</p>
                <p className="font-medium">{job.shifting_time}</p>
              </div>
            </div>
          )}
          {job.created_at && (
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Posted</p>
                <p className="font-medium">{formatDaysAgo(job.created_at)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Detailed Information */}
        <div className="space-y-6 py-6">
          {/* Qualifications */}
          {(job.qualification ||
            job.year_of_passing ||
            job.matric_mark ||
            job.diploma_mark ||
            job.btech_mark) && (
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                <GraduationCap className="h-5 w-5 text-blue-600" />
                Qualifications
              </h3>
              <div className="space-y-2 text-gray-700">
                {job.qualification && (
                  <p>
                    <span className="font-medium">Education:</span>{" "}
                    {job.qualification}
                  </p>
                )}
                {job.year_of_passing && (
                  <p>
                    <span className="font-medium">Year of Passing:</span>{" "}
                    {job.year_of_passing}
                  </p>
                )}
                {(job.matric_mark || job.diploma_mark || job.btech_mark) && (
                  <div>
                    <p className="font-medium">Marks Required:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      {job.matric_mark && <li>Matric: {job.matric_mark}%</li>}
                      {job.diploma_mark && (
                        <li>Diploma: {job.diploma_mark}%</li>
                      )}
                      {job.btech_mark && <li>B.Tech: {job.btech_mark} CGPA</li>}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Skills Required */}
          {skills.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                <Award className="h-5 w-5 text-blue-600" />
                Required Skills
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                {skills.map((skill, index) => (
                  <li key={index} className="text-gray-700">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Responsibilities */}
          {responsibilities.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                <Bookmark className="h-5 w-5 text-blue-600" />
                Responsibilities
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                {responsibilities.map((resp, index) => (
                  <li key={index} className="text-gray-700">
                    {resp}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Company Description */}
          {job.company_description && (
            <div>
              <h3 className="text-lg font-semibold mb-3">
                Company Description
              </h3>
              <div className="text-gray-700">
                <HTMLContent content={job.company_description} />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Edit Dialog Component
const EditDialog = ({ job, open, onOpenChange, onSave }) => {
  const [formData, setFormData] = useState({
    jd_title: job.jd_title || "",
    jd_location: job.jd_location || "",
    no_of_opening: job.no_of_opening || "",
    package: job.package || "",
    qualification: job.qualification || "",
    skill_required: safeJsonParse(job.skill_required).join("\n"),
    responsibility: safeJsonParse(job.responsibility).join("\n"),
    shifting_time: job.shifting_time || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      skill_required: JSON.stringify(
        formData.skill_required.split("\n").filter(Boolean)
      ),
      responsibility: JSON.stringify(
        formData.responsibility.split("\n").filter(Boolean)
      ),
    };
    onSave(submitData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Job Details</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jd_title">Job Title</Label>
              <Input
                id="jd_title"
                name="jd_title"
                value={formData.jd_title}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jd_location">Location</Label>
              <Input
                id="jd_location"
                name="jd_location"
                value={formData.jd_location}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="no_of_opening">Number of Openings</Label>
              <Input
                id="no_of_opening"
                name="no_of_opening"
                type="number"
                value={formData.no_of_opening}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="package">Package</Label>
              <Input
                id="package"
                name="package"
                value={formData.package}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="qualification">Qualification</Label>
              <Input
                id="qualification"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shifting_time">Shifting Time</Label>
              <Input
                id="shifting_time"
                name="shifting_time"
                value={formData.shifting_time}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="skill_required">
              Required Skills (one per line)
            </Label>
            <Textarea
              id="skill_required"
              name="skill_required"
              value={formData.skill_required}
              onChange={handleChange}
              rows={5}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsibility">
              Responsibilities (one per line)
            </Label>
            <Textarea
              id="responsibility"
              name="responsibility"
              value={formData.responsibility}
              onChange={handleChange}
              rows={5}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              type="button"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Main JobActions Component
const JobActions = ({ job }) => {
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleSave = (data) => {
    console.log("Saving job data:", data);
    // Implement save functionality
    setPopoverOpen(false);
  };

  return (
    <>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-gray-700"
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2">
          <button
            className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 rounded text-sm"
            onClick={() => {
              setIsViewOpen(true);
              setPopoverOpen(false);
            }}
          >
            <Eye className="h-4 w-4" />
            View Details
          </button>
          <button
            className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 rounded text-sm"
            onClick={() => {
              setIsEditOpen(true);
              setPopoverOpen(false);
            }}
          >
            <Edit2 className="h-4 w-4" />
            Edit
          </button>
        </PopoverContent>
      </Popover>

      <ViewDetailsDialog
        job={job}
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
      />

      <EditDialog
        job={job}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSave={handleSave}
      />
    </>
  );
};

export default JobActions;
