import React from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Users,
  CalendarRange,
  MapPin,
  Building,
  Clock,
  BookOpen,
  Award,
} from "lucide-react";

const StudentDetailsModal = ({ open, onOpenChange, student }) => {
  if (!student) return null;

  const personalDetails = [
    { icon: User, label: "Full Name", value: student.name },
    { icon: Mail, label: "Email", value: student.emailid },
    { icon: Phone, label: "Mobile", value: student.mobile },
    { icon: Users, label: "Gender", value: student.gender },
    { icon: MapPin, label: "State", value: student.state },
  ];

  const academicDetails = [
    { icon: GraduationCap, label: "Branch", value: student.branch },
    {
      icon: Award,
      label: "CGPA",
      value: student.btech_cgpa,
      custom: (value) => (
        <Badge variant={parseFloat(value) >= 8 ? "success" : "default"}>
          {value}
        </Badge>
      ),
    },
    { icon: CalendarRange, label: "Final Year", value: student.final_year },
    { icon: Building, label: "Institute", value: student.institute },
    {
      icon: Clock,
      label: "Application Status",
      value: student.status,
      custom: (value) => (
        <Badge
          variant={
            value === "shortlisted"
              ? "success"
              : value === "pending"
              ? "warning"
              : value === "rejected"
              ? "destructive"
              : "default"
          }
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      ),
    },
  ];

  const DetailSection = ({ title, details, className }) => (
    <Card
      className={`p-4 md:p-6 bg-white dark:bg-slate-900 shadow-sm ${className}`}
    >
      <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-4 flex items-center gap-2">
        <BookOpen className="h-5 w-5" />
        {title}
      </h3>
      <div className="space-y-4">
        {details.map((detail, index) => (
          <div key={index} className="break-words">
            <div className="flex items-center gap-2 text-sm flex-wrap">
              <detail.icon className="h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-blue-600 dark:text-blue-400">
                {detail.label}
              </span>
            </div>
            <div className="mt-1 pl-6">
              {detail.custom ? (
                detail.custom(detail.value)
              ) : (
                <span className="text-base text-slate-800 dark:text-slate-200 break-all">
                  {detail.value}
                </span>
              )}
            </div>
            {index < details.length - 1 && (
              <Separator className="my-4 bg-slate-200 dark:bg-slate-700" />
            )}
          </div>
        ))}
      </div>
    </Card>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] block">
        <DialogHeader className="px-2">
          <DialogTitle className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            Student Details
          </DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-400">
            Comprehensive information about the student's application
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-auto flex-1 px-2 py-4 h-[calc(90vh-12rem)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <DetailSection
              title="Personal Information"
              details={personalDetails}
            />
            <DetailSection
              title="Academic Information"
              details={academicDetails}
            />
          </div>
        </div>

        <DialogFooter className="px-2 py-4 border-t border-slate-200 dark:border-slate-700">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/50"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

StudentDetailsModal.propTypes = {
  open: PropTypes.bool,
  onOpenChange: PropTypes.func,
  student: PropTypes.object,
};

export default StudentDetailsModal;
