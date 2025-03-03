import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  BookOpen,
  Briefcase,
  Calendar,
  CheckCircle,
  GraduationCap,
  InfoIcon,
  MapPin,
} from "lucide-react";
import CheckboxSelect from "./CheckboxSelect";

const FilterDetailsSection = ({
  formData,
  handleMultiSelectChange,
  states,
  ugprograms,
  pgprograms,
  ugBranches,
  pgBranches,
  domains,
}) => {
  const filterFields = [
    {
      group: "Location",
      fields: [
        {
          name: "stateIds",
          label: "States",
          icon: MapPin,
          options: states.map((state) => ({
            value: state.state_id.toString(),
            label: state.state_name,
          })),
          suggestion: "Select states to target specific regions",
        },
      ],
    },
    {
      group: "UG Details",
      fields: [
        {
          name: "programId",
          label: "UG Programs",
          icon: GraduationCap,
          options: ugprograms.map((program) => ({
            value: program.program_id.toString(),
            label: program.program_name,
          })),
          suggestion: "Choose undergraduate programs relevant to the role",
        },
        {
          name: "branches",
          label: "UG Branches",
          icon: BookOpen,
          options: ugBranches
            .map((branch) => ({
              value:
                branch.branch?.toString() || branch.branch_id?.toString() || "",
              label: branch.branch || "",
            }))
            .filter((option) => option.value && option.label),
          disabled: formData.programId.length === 0,
          suggestion: "Select specific branches after choosing UG programs",
        },
        {
          name: "finalYear",
          label: "UG Passout Year",
          icon: Calendar,
          options: [...Array(17)].map((_, i) => {
            const year = new Date().getFullYear() - 8 + i;
            return { value: year, label: year.toString() };
          }),
          suggestion: "Target specific graduation years",
        },
      ],
    },
    {
      group: "PG Details",
      fields: [
        {
          name: "pgProgramId",
          label: "PG Programs",
          icon: GraduationCap,
          options: pgprograms.map((program) => ({
            value: program.program_id.toString(),
            label: program.program_name,
          })),
          suggestion: "Choose postgraduate programs if applicable",
        },
        {
          name: "pgBranch",
          label: "PG Branches",
          icon: BookOpen,
          options: pgBranches
            .map((branch) => ({
              value:
                branch.pg_branch?.toString() ||
                branch.branch_id?.toString() ||
                "",
              label: branch.pg_branch || "",
            }))
            .filter((option) => option.value && option.label),
          disabled: formData.pgProgramId.length === 0,
          suggestion: "Select specific PG branches after choosing PG programs",
        },
        {
          name: "pgYearOfPassing",
          label: "PG Passout Year",
          icon: Calendar,
          options: [...Array(17)].map((_, i) => {
            const year = new Date().getFullYear() - 8 + i;
            return { value: year, label: year.toString() };
          }),
          suggestion: "Target specific PG graduation years",
        },
      ],
    },
    {
      group: "Additional Filters",
      fields: [
        {
          name: "domainIds",
          label: "Domains",
          icon: Briefcase,
          options: domains.map((domain) => ({
            value: domain.domain_id.toString(),
            label: domain.domain_name,
          })),
          suggestion: "Select relevant domains or specializations",
        },
        {
          name: "isCompleted",
          label: "Course Completion Status",
          icon: CheckCircle,
          options: [
            { value: 1, label: "Completed" },
            { value: 0, label: "Ongoing" },
          ],
          suggestion: "Filter based on course completion status",
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {filterFields.map((group, groupIndex) => (
        <Card key={groupIndex} className="border-slate-200">
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">
              {group.group}
            </h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {group.fields.map((field, fieldIndex) => (
                <div key={fieldIndex} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-700">
                      {field.label}
                    </label>
                    {field.suggestion && (
                      <div className="group relative">
                        <InfoIcon className="w-4 h-4 text-slate-400" />
                        <div className="absolute right-0 w-48 p-2 bg-slate-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                          {field.suggestion}
                        </div>
                      </div>
                    )}
                  </div>
                  <CheckboxSelect
                    options={field.options}
                    value={formData[field.name] || []}
                    onChange={(value) =>
                      handleMultiSelectChange(value, field.name)
                    }
                    placeholder={`Select ${field.label.toLowerCase()}`}
                    disabled={field.disabled}
                    icon={field.icon}
                  />
                  {field.disabled && (
                    <Alert variant="info" className="mt-2">
                      <AlertDescription className="text-xs text-slate-500">
                        Please select{" "}
                        {field.name === "branches"
                          ? "UG Programs"
                          : "PG Programs"}{" "}
                        first
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FilterDetailsSection;
