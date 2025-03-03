import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApi } from "@/hooks/useApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LogoUpload from "./LogoUpload";

const BasicDetails = ({ formData, onChange }) => {
  const { sendRequest, loading, error } = useApi();
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await sendRequest({
          method: "GET",
          url: "/documents/companyDetails",
        });

        if (response?.companyResponse) {
          setCompanies(response.companyResponse);
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, [sendRequest]);

  return (
    <div className="space-y-6">
      {/* Company Information Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Company Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="company" className="font-medium">
                  Company
                </Label>
              </div>
              <Select
                value={formData.companyId}
                onValueChange={(value) => {
                  onChange("companyId", value);
                  const selectedCompany = companies.find(
                    (c) => c.company_id === value
                  );
                  onChange("company", selectedCompany?.company_name || "");
                }}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem
                      key={company.company_id}
                      value={company.company_id}
                    >
                      {company.company_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Logo Upload Component */}
            {/* <div className="space-y-2">
              <LogoUpload value={formData.companyLogo} onChange={onChange} />
            </div> */}
          </div>
        </CardContent>
      </Card>

      {/* Job Details Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Job Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Label htmlFor="jobTitle" className="font-medium">
                  Job title
                </Label>
              </div>
              <Input
                id="jobTitle"
                value={formData.jdTitle}
                onChange={(e) => onChange("jdTitle", e.target.value)}
                placeholder="Placement Coordinator"
                className="h-12"
              />
            </div>

            <div>
              <div>
                <Label htmlFor="jobType" className="font-medium">
                  Job type
                </Label>
              </div>
              <Select
                value={formData.jobType}
                onValueChange={(value) => onChange("jobType", value)}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Temporary">Temporary</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <Label htmlFor="jobLocation" className="font-medium mb-1">
                  Job location
                </Label>
              </div>
              <Input
                id="jobLocation"
                value={formData.jdLocation}
                onChange={(e) => onChange("jdLocation", e.target.value)}
                placeholder="Bhubaneswar, Odisha, India"
                className="h-12"
              />
            </div>

            <div>
              <Label htmlFor="workplaceType" className="font-medium">
                Workplace type
              </Label>
              <Select
                value={formData.workplaceType}
                onValueChange={(value) => onChange("workplaceType", value)}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select workplace type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="On-site">On-site</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                  <SelectItem value="Remote">Remote</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="openings" className="font-medium">
                  Number of Openings
                </Label>
              </div>
              <Input
                id="openings"
                type="number"
                value={formData.noOfOpening}
                onChange={(e) => onChange("noOfOpening", e.target.value)}
                placeholder="Enter number of openings"
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="package" className="font-medium">
                  Package
                </Label>
              </div>
              <Input
                id="package"
                value={formData.package}
                onChange={(e) => onChange("package", e.target.value)}
                placeholder="Enter package details"
                className="h-12"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Registration Period Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Registration Period
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="font-medium">Registration Start Date</Label>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "h-12 w-full justify-start text-left font-normal",
                      !formData.registrationStart && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.registrationStart ? (
                      format(new Date(formData.registrationStart), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={
                      formData.registrationStart
                        ? new Date(formData.registrationStart)
                        : undefined
                    }
                    onSelect={(date) =>
                      onChange(
                        "registrationStart",
                        date ? date.toISOString() : ""
                      )
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div> */}

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="font-medium">Registration End Date</Label>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "h-12 w-full justify-start text-left font-normal",
                      !formData.registrationEnd && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.registrationEnd ? (
                      format(new Date(formData.registrationEnd), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={
                      formData.registrationEnd
                        ? new Date(formData.registrationEnd)
                        : undefined
                    }
                    onSelect={(date) =>
                      onChange(
                        "registrationEnd",
                        date ? date.toISOString() : ""
                      )
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BasicDetails;
