import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Briefcase,
  MapPin,
  Calendar,
  Users,
  Package,
  Building2,
  GraduationCap,
  Globe,
  Clock,
} from "lucide-react";
import ReactQuill from 'react-quill';

// Quill modules configuration
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    ['clean'],
  ],
};

// HTML Content Parser Component
const HTMLContent = ({ content }) => {
  const createMarkup = () => ({ __html: content });
  return content ? <div dangerouslySetInnerHTML={createMarkup()} /> : null;
};

export const EditJobDialog = ({ job, open, onOpenChange, onSave }) => {
  const [formData, setFormData] = useState({
    jd_title: "",
    jd_location: "",
    no_of_opening: "",
    package: "",
    qualification: "",
    company_description: "",
    shifting_time: "",
    workplace_type: "",
    jobtype: "",
    year_of_passing: "",
    matric_mark: "",
    diploma_mark: "",
    btech_mark: "",
    gender: "",
    backlog: "",
    Bond: "",
    reg_start: "",
    reg_end: "",
  });

  useEffect(() => {
    if (job) {
      setFormData({
        jd_title: job.jd_title || "",
        jd_location: job.jd_location || "",
        no_of_opening: job.no_of_opening || "",
        package: job.package || "",
        qualification: job.qualification || "",
        company_description: job.company_description || "",
        shifting_time: job.shifting_time || "",
        workplace_type: job.workplace_type || "",
        jobtype: job.jobtype || "",
        year_of_passing: job.year_of_passing || "",
        matric_mark: job.matric_mark || "",
        diploma_mark: job.diploma_mark || "",
        btech_mark: job.btech_mark || "",
        gender: job.gender || "",
        backlog: job.backlog || "",
        Bond: job.Bond || "",
        reg_start: job.reg_start || "",
        reg_end: job.reg_end || "",
      });
    }
  }, [job]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...job, ...formData });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Job Details</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Job Title</Label>
                <Input
                  value={formData.jd_title}
                  onChange={(e) => setFormData(prev => ({ ...prev, jd_title: e.target.value }))}
                />
              </div>
              <div>
                <Label>Location</Label>
                <Input
                  value={formData.jd_location}
                  onChange={(e) => setFormData(prev => ({ ...prev, jd_location: e.target.value }))}
                />
              </div>
              <div>
                <Label>Number of Openings</Label>
                <Input
                  type="number"
                  value={formData.no_of_opening}
                  onChange={(e) => setFormData(prev => ({ ...prev, no_of_opening: e.target.value }))}
                />
              </div>
              <div>
                <Label>Package</Label>
                <Input
                  value={formData.package}
                  onChange={(e) => setFormData(prev => ({ ...prev, package: e.target.value }))}
                />
              </div>
              <div>
                <Label>Job Type</Label>
                <Select
                  value={formData.jobtype}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, jobtype: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Workplace Type</Label>
                <Select
                  value={formData.workplace_type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, workplace_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select workplace type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="On-site">On-site</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Qualification Requirements */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Qualification Requirements</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Qualification</Label>
                <Input
                  value={formData.qualification}
                  onChange={(e) => setFormData(prev => ({ ...prev, qualification: e.target.value }))}
                />
              </div>
              <div>
                <Label>Year of Passing</Label>
                <Input
                  value={formData.year_of_passing}
                  onChange={(e) => setFormData(prev => ({ ...prev, year_of_passing: e.target.value }))}
                />
              </div>
              <div>
                <Label>Matric Mark (%)</Label>
                <Input
                  type="number"
                  value={formData.matric_mark}
                  onChange={(e) => setFormData(prev => ({ ...prev, matric_mark: e.target.value }))}
                />
              </div>
              <div>
                <Label>Diploma Mark (%)</Label>
                <Input
                  type="number"
                  value={formData.diploma_mark}
                  onChange={(e) => setFormData(prev => ({ ...prev, diploma_mark: e.target.value }))}
                />
              </div>
              <div>
                <Label>B.Tech CGPA</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.btech_mark}
                  onChange={(e) => setFormData(prev => ({ ...prev, btech_mark: e.target.value }))}
                />
              </div>
              <div>
                <Label>Maximum Backlogs</Label>
                <Input
                  type="number"
                  value={formData.backlog}
                  onChange={(e) => setFormData(prev => ({ ...prev, backlog: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Additional Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Gender Preference</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Any">Any</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Bond Period</Label>
                <Input
                  value={formData.Bond}
                  onChange={(e) => setFormData(prev => ({ ...prev, Bond: e.target.value }))}
                  placeholder="e.g., 2 years"
                />
              </div>
              <div>
                <Label>Registration Start Date</Label>
                <Input
                  type="datetime-local"
                  value={formData.reg_start}
                  onChange={(e) => setFormData(prev => ({ ...prev, reg_start: e.target.value }))}
                />
              </div>
              <div>
                <Label>Registration End Date</Label>
                <Input
                  type="datetime-local"
                  value={formData.reg_end}
                  onChange={(e) => setFormData(prev => ({ ...prev, reg_end: e.target.value }))}
                />
              </div>
              <div>
                <Label>Shifting Time</Label>
                <Input
                  value={formData.shifting_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, shifting_time: e.target.value }))}
                  placeholder="e.g., 9 AM - 6 PM"
                />
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="space-y-2">
            <Label>Job Description</Label>
            <div className="border rounded-lg overflow-hidden">
              <ReactQuill
                theme="snow"
                value={formData.company_description}
                onChange={(content) => setFormData(prev => ({ ...prev, company_description: content }))}
                modules={quillModules}
                className="min-h-[200px]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
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

export const ViewJobDialog = ({ job, open, onOpenChange }) => {
  if (!job) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Job Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Header Section */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Briefcase className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">{job.jd_title}</h2>
              <div className="flex flex-wrap gap-3 mt-2">
                {job.company_name && (
                  <div className="flex items-center gap-1 text-gray-600">
                    <Building2 className="h-4 w-4" />
                    <span>{job.company_name}</span>
                  </div>
                )}
                {job.jd_location && (
                  <div className="flex items-center gap-1 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{job.jd_location}</span>
                  </div>
                )}
                {job.workplace_type && (
                  <div className="flex items-center gap-1 text-gray-600">
                    <Globe className="h-4 w-4" />
                    <span>{job.workplace_type}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Key Details */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
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
            {job.jobtype && (
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Job Type</p>
                  <p className="font-medium">{job.jobtype}</p>
                </div>
              </div>
            )}
            {job.shifting_time && (
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Shift</p>
                  <p className="font-medium">{job.shifting_time}</p>
                </div>
              </div>
            )}
          </div>

          {/* Registration Period */}
          {(job.reg_start || job.reg_end) && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Registration Period</h3>
              <div className="grid grid-cols-2 gap-4">
                {job.reg_start && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Starts</p>
                      <p className="font-medium">{formatDate(job.reg_start)}</p>
                    </div>
                  </div>
                )}
                {job.reg_end && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Ends</p>
                      <p className="font-medium">{formatDate(job.reg_end)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Qualifications Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Qualifications</h3>
            <div className="grid gap-4">
              {job.qualification && (
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Required Qualification</p>
                    <p className="font-medium">{job.qualification}</p>
                  </div>
                </div>
              )}
              {job.year_of_passing && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Year of Passing</p>
                    <p className="font-medium">{job.year_of_passing}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Academic Requirements */}
            {(job.matric_mark || job.diploma_mark || job.btech_mark || job.backlog) && (
              <div className="mt-4 bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <h4 className="font-medium mb-3">Academic Requirements</h4>
                <div className="grid grid-cols-2 gap-4">
                  {job.matric_mark && (
                    <div>
                      <p className="text-sm text-gray-500">Matric</p>
                      <p className="font-medium">{job.matric_mark}%</p>
                    </div>
                  )}
                  {job.diploma_mark && (
                    <div>
                      <p className="text-sm text-gray-500">Diploma</p>
                      <p className="font-medium">{job.diploma_mark}%</p>
                    </div>
                  )}
                  {job.btech_mark && (
                    <div>
                      <p className="text-sm text-gray-500">B.Tech CGPA</p>
                      <p className="font-medium">{job.btech_mark}</p>
                    </div>
                  )}
                  {job.backlog && (
                    <div>
                      <p className="text-sm text-gray-500">Maximum Backlogs</p>
                      <p className="font-medium">{job.backlog}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Additional Requirements */}
          {(job.gender || job.Bond) && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Additional Requirements</h3>
              <div className="grid grid-cols-2 gap-4">
                {job.gender && (
                  <div>
                    <p className="text-sm text-gray-500">Gender Preference</p>
                    <p className="font-medium">{job.gender}</p>
                  </div>
                )}
                {job.Bond && (
                  <div>
                    <p className="text-sm text-gray-500">Bond Period</p>
                    <p className="font-medium">{job.Bond}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Job Description */}
          {job.company_description && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Job Description</h3>
              <div className="prose dark:prose-invert max-w-none">
                <HTMLContent content={job.company_description} />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default {
  EditJobDialog,
  ViewJobDialog
};