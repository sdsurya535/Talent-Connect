import React, { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useApi } from "@/hooks/useApi";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Loader2, AlertCircle, X } from "lucide-react";

const modules = {
  toolbar: [
    ["bold", "italic"],
    [{ list: "ordered" }, { list: "bullet" }],

    ["clean"],
  ],
};

const formats = ["bold", "italic", "list", "bullet"];

const EditJobModal = ({ isOpen, onClose, job, onJobUpdated }) => {
  const [formData, setFormData] = useState({
    jd_title: "",
    jd_role: "",
    company_name: "",
    jd_location: "",
    no_of_opening: "",
    package: "",
    workplace_type: "",
    company_description: "",
    matric: "",
    intermadiate: "",
    cgpa: "",
    passout_year: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState(false);
  const { sendRequest, loading, error } = useApi();

  useEffect(() => {
    if (job) {
      setFormData({
        jd_title: job.jd_title || "",
        jd_role: job.jd_role || "",
        company_name: job.company_name || "",
        jd_location: job.jd_location || "",
        no_of_opening: job.no_of_opening || "",
        package: job.package || "",
        workplace_type: job.workplace_type || "",
        company_description: job.company_description || "",
        matric: job.matric || "",
        intermadiate: job.intermadiate || "",
        cgpa: job.cgpa || "",
        passout_year: job.passout_year || "",
      });
    }
  }, [job]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await sendRequest({
        method: "PUT",
        url: `/talent/connect/jobDescriptions/${job.jd_id}`,
        data: formData,
      });

      if (response) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onJobUpdated(formData);
          setIsEditing(false);
        }, 1500);
      }
    } catch (err) {
      console.error("Error updating job:", err);
    }
  };

  const handleClose = () => {
    setIsEditing(false);
    onClose();
  };

  if (!job) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader className="flex justify-between items-center flex-row">
          <AlertDialogTitle className="text-xl font-semibold">
            {isEditing ? "Edit Job" : "Job Details"}
          </AlertDialogTitle>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="p-1 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="jd_title">Job Title</Label>
                <Input
                  id="jd_title"
                  name="jd_title"
                  value={formData.jd_title}
                  onChange={handleInputChange}
                  className="w-full"
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jd_role">Role</Label>
                <Input
                  id="jd_role"
                  name="jd_role"
                  value={formData.jd_role}
                  onChange={handleInputChange}
                  className="w-full"
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                  id="company_name"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleInputChange}
                  className="w-full"
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jd_location">Location</Label>
                <Input
                  id="jd_location"
                  name="jd_location"
                  value={formData.jd_location}
                  onChange={handleInputChange}
                  className="w-full"
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="no_of_opening">Number of Openings</Label>
                <Input
                  id="no_of_opening"
                  name="no_of_opening"
                  type="number"
                  value={formData.no_of_opening}
                  onChange={handleInputChange}
                  className="w-full"
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="package">Package</Label>
                <Input
                  id="package"
                  name="package"
                  value={formData.package}
                  onChange={handleInputChange}
                  className="w-full"
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="workplace_type">Workplace Type</Label>
              <Select
                value={formData.workplace_type}
                onValueChange={(value) =>
                  handleInputChange({
                    target: { name: "workplace_type", value },
                  })
                }
                disabled={!isEditing}
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

          {/* Academic Requirements */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Academic Requirements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="matric">Matric (%)</Label>
                <Input
                  id="matric"
                  name="matric"
                  type="number"
                  value={formData.matric}
                  onChange={handleInputChange}
                  className="w-full"
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="intermadiate">Intermediate (%)</Label>
                <Input
                  id="intermadiate"
                  name="intermadiate"
                  type="number"
                  value={formData.intermadiate}
                  onChange={handleInputChange}
                  className="w-full"
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cgpa">CGPA</Label>
                <Input
                  id="cgpa"
                  name="cgpa"
                  type="number"
                  value={formData.cgpa}
                  onChange={handleInputChange}
                  className="w-full"
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="passout_year">Passout Year</Label>
                <Input
                  id="passout_year"
                  name="passout_year"
                  type="number"
                  value={formData.passout_year}
                  onChange={handleInputChange}
                  className="w-full"
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          {/* Company Description */}
          <div className="space-y-2">
            <Label htmlFor="company_description">Company Description</Label>
            {isEditing ? (
              <div className="border rounded-md">
                <ReactQuill
                  theme="snow"
                  value={formData.company_description}
                  onChange={(content) =>
                    setFormData((prev) => ({
                      ...prev,
                      company_description: content,
                    }))
                  }
                  modules={modules}
                  formats={formats}
                  className="bg-white dark:bg-gray-800"
                />
              </div>
            ) : (
              <div
                className="prose dark:prose-invert max-w-none border rounded-md p-4"
                dangerouslySetInnerHTML={{
                  __html: formData.company_description,
                }}
              />
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Error updating job: {error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>Job updated successfully!</AlertDescription>
            </Alert>
          )}

          {isEditing && (
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Job"
                )}
              </Button>
            </div>
          )}
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EditJobModal;
