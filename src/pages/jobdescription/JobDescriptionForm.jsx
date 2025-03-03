import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Plus,
  X,
  Type,
  PlusCircle,
  Check,
  Building,
  Briefcase,
  MapPin,
  Users,
  GraduationCap,
  Calendar,
  DollarSign,
  Award,
  BookOpen,
  CheckSquare,
  User,
  Scale,
  CheckCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import MultiSelect from "./MultiSelect";
import _ from "lodash";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useApi } from "@/hooks/useApi";
import toast from "react-hot-toast";
import CheckboxSelect from "./CheckBoxSelect";
import FilterDetailsSection from "./FilterDetailsSection";

const JobDescriptionForm = () => {
  const [companies, setCompanies] = useState([]);
  const [customFields, setCustomFields] = useState([]);
  const [newFieldDialog, setNewFieldDialog] = useState(false);
  const [newField, setNewField] = useState({
    name: "",
    label: "",
    type: "text",
    required: false,
    section: "",
    isMultiEntry: false,
  });
  const [states, setStates] = useState([]);
  const [ugprograms, setUgPrograms] = useState([]);
  const [pgprograms, setPgPrograms] = useState([]);
  const [domains, setDomains] = useState([]);
  const [ugBranches, setUgBranches] = useState([]);
  const [pgBranches, setPgBranches] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [studentCount, setStudentCount] = useState(null);
  const [isCheckingCount, setIsCheckingCount] = useState(false);
  const [newEntries, setNewEntries] = useState({});

  const [formData, setFormData] = useState({
    jdTitle: "",
    companyId: 18,
    weeklyOff: "",
    noOfOpening: "",
    shiftingTime: "",
    jdLocation: "",
    gender: [],
    qualification: [],
    matricMark: "",
    diplomaMark: "",
    btechMark: "",
    backlog: "",
    package: "",
    joining: "",
    skillRequired: [],
    responsibility: [],
    selectionProcess: [],
    updateAt: "",
    bond: "",
    registrationStart: "",
    registrationEnd: "",
    customFields: {},
    stateIds: [],
    programId: [],
    pgProgramId: [],
    domainIds: [],
    branches: [],
    pgBranch: [],
    finalYear: [],
    pgYearOfPassing: [],
    isCompleted: [],
  });

  const { sendRequest, loading, error } = useApi();

  // Input field configurations
  const inputFields = useMemo(
    () => [
      {
        section: "Basic Information",
        fields: [
          {
            name: "companyId",
            label: "Company",
            type: "select",
            icon: Building,
            options: companies.map((company) => ({
              value: company?.company_id.toString(),
              label: company?.company_name,
            })),
            required: false,
          },
          {
            name: "jdTitle",
            label: "Job Title",
            type: "text",
            placeholder: "Enter job title",
            icon: Briefcase,
            required: false,
          },
          {
            name: "noOfOpening",
            label: "Number of Openings",
            type: "number",
            min: 1,
            icon: Users,
            required: false,
          },
          {
            name: "weeklyOff",
            label: "Weekly Off",
            type: "number",
            min: 1,
            icon: Calendar,
            required: false,
          },
          {
            name: "jdLocation",
            label: "Location",
            type: "text",
            placeholder: "Enter job location",
            icon: MapPin,
            required: false,
          },
          {
            name: "shiftingTime",
            label: "Shifting Time",
            type: "text",
            placeholder: "Enter Shifting Time",
            icon: MapPin,
            required: false,
          },
        ],
      },
      {
        section: "Qualifications",
        fields: [
          {
            name: "backlog",
            label: "Backlog",
            type: "number",
            icon: BookOpen,
            min: 0,
            required: false,
          },
        ],
      },
      {
        section: "Academic Details",
        fields: [
          {
            name: "matricMark",
            label: "10th Board Marks (%)",
            type: "text",
            placeholder: "Enter marks",
            icon: Award,
            required: false,
          },
          {
            name: "diplomaMark",
            label: "Diploma/12th Marks (%)",
            type: "text",
            placeholder: "Enter marks",
            icon: Award,
            required: false,
          },
          {
            name: "btechMark",
            label: "B.Tech/Equivalent Marks (%)",
            type: "text",
            placeholder: "Enter marks",
            icon: Award,
            required: false,
          },
        ],
      },
      {
        section: "Package and Bond",
        fields: [
          {
            name: "package",
            label: "Package",
            type: "text",
            placeholder: "Enter package details",
            icon: DollarSign,
            required: false,
          },
          {
            name: "bond",
            label: "Bond Period",
            type: "text",
            placeholder: "Enter bond period",
            icon: Scale,
            required: false,
          },
          {
            name: "joining",
            label: "Joining",
            type: "text",
            placeholder: "Enter joining details",
            icon: Calendar,
            required: false,
          },
        ],
      },
      {
        section: "Registration Dates",
        fields: [
          {
            name: "registrationStart",
            label: "Registration Start Date",
            type: "date",
            icon: Calendar,
            required: false,
          },
          {
            name: "registrationEnd",
            label: "Registration End Date",
            type: "date",
            icon: Calendar,
            required: false,
          },
        ],
      },
      //   {
      //     section: "Filter Details",
      //     fields: [
      //       {
      //         name: "stateIds",
      //         label: "States",
      //         type: "multiselect",
      //         icon: MapPin,
      //         options: states.map((state) => ({
      //           value: state.state_id.toString(),
      //           label: state.state_name,
      //         })),
      //         required: false,
      //       },
      //       {
      //         name: "programId",
      //         label: "UG Programs",
      //         type: "multiselect",
      //         icon: GraduationCap,
      //         options: ugprograms.map((program) => ({
      //           value: program.program_id.toString(),
      //           label: program.program_name,
      //         })),
      //         required: false,
      //       },
      //       {
      //         name: "branches",
      //         label: "UG Branches",
      //         type: "multiselect",
      //         icon: BookOpen,
      //         options: ugBranches
      //           .map((branch) => ({
      //             value:
      //               branch.branch?.toString() ||
      //               branch.branch_id?.toString() ||
      //               "",
      //             label: branch.branch || "",
      //           }))
      //           .filter((option) => option.value && option.label),
      //         required: false,
      //         disabled: formData.programId.length === 0,
      //       },
      //       {
      //         name: "finalYear",
      //         label: "UG Passout Year",
      //         type: "multiselect",
      //         icon: Calendar,
      //         options: [...Array(17)].map((_, i) => {
      //           const year = new Date().getFullYear() - 8 + i;
      //           return { value: year, label: year };
      //         }),
      //         required: false,
      //       },
      //       {
      //         name: "pgProgramId",
      //         label: "PG Programs",
      //         type: "multiselect",
      //         icon: GraduationCap,
      //         options: pgprograms.map((program) => ({
      //           value: program.program_id.toString(),
      //           label: program.program_name,
      //         })),
      //         required: false,
      //       },
      //       {
      //         name: "pgBranch",
      //         label: "PG Branches",
      //         type: "multiselect",
      //         icon: BookOpen,
      //         options: pgBranches
      //           .map((branch) => ({
      //             value:
      //               branch.pg_branch?.toString() ||
      //               branch.branch_id?.toString() ||
      //               "",
      //             label: branch.pg_branch || "",
      //           }))
      //           .filter((option) => option.value && option.label),
      //         required: false,
      //         disabled: formData.pgProgramId.length === 0,
      //       },
      //       {
      //         name: "pgYearOfPassing",
      //         label: "PG Passout Year",
      //         type: "multiselect",
      //         icon: Calendar,
      //         options: [...Array(17)].map((_, i) => {
      //           const year = new Date().getFullYear() - 8 + i;
      //           return { value: year, label: year };
      //         }),
      //         required: false,
      //       },
      //       {
      //         name: "domainIds",
      //         label: "Domains",
      //         type: "multiselect",
      //         icon: Briefcase,
      //         options: domains.map((domain) => ({
      //           value: domain.domain_id.toString(),
      //           label: domain.domain_name,
      //         })),
      //         required: false,
      //       },
      //       {
      //         name: "isCompleted",
      //         label: "Is Completed",
      //         type: "multiselect",
      //         icon: CheckCircle,
      //         options: [
      //           { value: 1, label: "Yes" },
      //           { value: 0, label: "No" },
      //         ],
      //         required: false,
      //       },
      //     ],
      //   },
    ],
    [
      companies,
      states,
      ugprograms,
      pgprograms,
      ugBranches,
      pgBranches,
      formData.programId,
      formData.pgProgramId,
    ]
  );

  const multiEntryFields = [
    {
      name: "skillRequired",
      label: "Skills Required",
      icon: BookOpen,
      placeholder: "Enter a skill",
    },
    {
      name: "gender",
      label: "Gender",
      icon: User,
      placeholder: "Enter a Gender",
    },
    {
      name: "selectionProcess",
      label: "Selection Process",
      icon: CheckSquare,
      placeholder: "Enter a selection process step",
    },
    {
      name: "qualification",
      label: "Qualification",
      icon: GraduationCap,
      placeholder: "Enter qualification",
    },
    {
      name: "responsibility",
      label: "Responsibilities",
      icon: BookOpen,
      placeholder: "Enter Responsibilities",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const companiesResponse = await sendRequest({
          method: "GET",
          url: "/documents/companyDetails",
        });

        if (companiesResponse.companyResponse) {
          setCompanies(companiesResponse.companyResponse);
        }

        const screeningResponse = await sendRequest({
          method: "GET",
          url: "/documents/studentScreening",
        });

        if (screeningResponse.statesResponse) {
          setStates(screeningResponse.statesResponse);
        }
        if (screeningResponse.programsResponse) {
          setUgPrograms(screeningResponse.programsResponse);
        }
        if (screeningResponse.pgProgramsResponse) {
          setPgPrograms(screeningResponse.programsResponse);
        }
        if (screeningResponse.domainsResponse) {
          setDomains(screeningResponse.domainsResponse);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
        toast.error("Failed to load form data");
      }
    };

    fetchData();
  }, []);

  const debouncedFetchUgBranches = useCallback(
    _.debounce(async (selectedPrograms) => {
      if (selectedPrograms.length > 0) {
        try {
          const response = await sendRequest({
            method: "POST",
            url: "/talent/connect/ugBranches",
            data: { programId: selectedPrograms },
          });

          if (response && Array.isArray(response.ugBranches)) {
            setUgBranches(response.ugBranches);
          }
        } catch (error) {
          console.error("Failed to fetch UG branches:", error);
          toast.error("Failed to load UG branches");
        }
      } else {
        setUgBranches([]);
      }
    }, 500),
    []
  );

  const debouncedFetchPgBranches = useCallback(
    _.debounce(async (selectedPrograms) => {
      if (selectedPrograms.length > 0) {
        try {
          const response = await sendRequest({
            method: "POST",
            url: "/talent/connect/pgBranches",
            data: { pgProgramId: selectedPrograms },
          });
          if (response && Array.isArray(response.pgBranches)) {
            setPgBranches(response.pgBranches);
          }
        } catch (error) {
          console.error("Failed to fetch PG branches:", error);
          toast.error("Failed to load PG branches");
        }
      } else {
        setPgBranches([]);
      }
    }, 500),
    []
  );

  const handleMultiSelectChange = useCallback(
    (value, fieldName) => {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: value,
      }));

      if (fieldName === "programId") {
        debouncedFetchUgBranches(value);
        setFormData((prev) => ({
          ...prev,
          branchId: [],
        }));
      } else if (fieldName === "pgProgramId") {
        debouncedFetchPgBranches(value);
        setFormData((prev) => ({
          ...prev,
          pgBranchId: [],
        }));
      }
    },
    [debouncedFetchUgBranches, debouncedFetchPgBranches]
  );

  const handleAddCustomField = () => {
    if (newField.label) {
      const fieldKey = `custom_${newField.label
        .toLowerCase()
        .replace(/\s+/g, "_")}`;
      const newCustomField = {
        ...newField,
        name: fieldKey,
        icon: Type,
        isMultiEntry: newField.type === "multi-entry",
        section: newField.section || "Custom Fields",
      };

      setCustomFields((prev) => [...prev, newCustomField]);

      setFormData((prev) => ({
        ...prev,
        customFields: {
          ...prev.customFields,
          [fieldKey]: newField.type === "multi-entry" ? [] : "",
        },
      }));

      setNewField({
        name: "",
        label: "",
        type: "text",
        required: false,
        section: "",
        isMultiEntry: false,
      });

      setNewFieldDialog(false);
    }
  };

  const handleNewCustomEntryChange = (fieldName, value) => {
    setNewEntries((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const addCustomItem = (fieldName) => {
    const value = newEntries[fieldName];
    if (value?.trim()) {
      setFormData((prev) => ({
        ...prev,
        customFields: {
          ...prev.customFields,
          [fieldName]: [...(prev.customFields[fieldName] || []), value.trim()],
        },
      }));
      setNewEntries((prev) => ({
        ...prev,
        [fieldName]: "",
      }));
    }
  };

  const removeCustomItem = (fieldName, index) => {
    setFormData((prev) => ({
      ...prev,
      customFields: {
        ...prev.customFields,
        [fieldName]: prev.customFields[fieldName].filter((_, i) => i !== index),
      },
    }));
  };

  const handleNewEntryChange = (field, value) => {
    setNewEntries((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addItem = (field) => {
    const value = newEntries[field];
    if (value?.trim()) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], value.trim()],
      }));
      setNewEntries((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const removeItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const removeCustomField = (fieldName) => {
    setCustomFields((prev) => prev.filter((field) => field.name !== fieldName));
    setFormData((prev) => {
      const newCustomFields = { ...prev.customFields };
      delete newCustomFields[fieldName];
      return {
        ...prev,
        customFields: newCustomFields,
      };
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date, field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: format(date, "yyyy-MM-dd"),
    }));
  };

  const handleSelectChange = (value, field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCustomFieldChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      customFields: {
        ...prev.customFields,
        [name]: value,
      },
    }));
  };

  const generateJobTableName = () => {
    const timestamp = format(new Date(), "ddMMyyyyHHmmss");
    const sanitizedJobTitle = formData.jdTitle
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "_")
      .replace(/_+/g, "_");
    return `${formData.companyId}_${sanitizedJobTitle}_${timestamp}`;
  };

  const getFilterData = () => {
    return {
      stateId: formData.stateIds || [],
      programId: formData.programId || [],
      pgProgramId: formData.pgProgramId || [],
      branches: formData.branches || [],
      pgBranch: formData.pgBranch || [],
      domainId: formData.domainIds || [],
      finalYear: formData.finalYear || [],
      pgYearOfPassing: formData.pgYearOfPassing || [],
      isCompleted: formData.isCompleted || [],
    };
  };

  const checkStudentCount = async (e) => {
    e.preventDefault();
    setIsCheckingCount(true);

    try {
      const filterData = getFilterData();
      const response = await sendRequest({
        method: "POST",
        url: "/talent/connect/studentIntakeCount",
        data: filterData,
        timeout: 60000,
      });

      if (response && response.studentsCounting !== undefined) {
        setStudentCount(response.studentsCounting);
        setShowConfirmation(true);
      } else {
        toast.error("Failed to get student count");
      }
    } catch (error) {
      console.error("Error checking student count:", error);
      toast.error("Failed to get student count");
    } finally {
      setIsCheckingCount(false);
    }
  };

  const handleConfirmedSubmit = async () => {
    setShowConfirmation(false);

    const submitData = {
      ...formData,
      jobTableName: generateJobTableName(),
      skillRequired: JSON.stringify(formData.skillRequired),
      responsibility: JSON.stringify(formData.responsibility),
      qualification: JSON.stringify(formData.qualification),
      gender: JSON.stringify(formData.gender),
      selectionProcess: JSON.stringify(formData.selectionProcess),
      customFields: JSON.stringify(formData.customFields),
      ...getFilterData(),
    };

    const loadingToast = toast.loading("Creating job description...");

    try {
      await sendRequest({
        method: "POST",
        url: "/talent/connect/createJobDescription",
        data: submitData,
        timeout: 60000,
      });

      toast.dismiss(loadingToast);
      toast.success("Job description created successfully!");

      // Reset form
      setFormData({
        jdTitle: "",
        companyId: 18,
        weeklyOff: 1,
        noOfOpening: 1,
        shiftingTime: "",
        jdLocation: "",
        gender: [],
        qualification: [],
        yearOfPassing: "",
        matricMark: "",
        diplomaMark: "",
        btechMark: "",
        backlog: "",
        package: "",
        joining: "",
        skillRequired: [],
        responsibility: [],
        selectionProcess: [],
        updateAt: "",
        bond: "",
        registrationStart: "",
        registrationEnd: "",
        customFields: {},
        stateIds: [],
        programId: [],
        pgProgramId: [],
        branches: [],
        pgBranch: [],
        domainIds: [],
        finalYear: [],
        pgYearOfPassing: [],
        isCompleted: [],
      });
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(
        `Failed to create job description: ${err.message || "Unknown error"}`
      );
      console.error("Failed to create job description:", err);
    }
  };

  // Group custom fields by section
  const groupedCustomFields = useMemo(() => {
    return _.groupBy(customFields, "section");
  }, [customFields]);

  const renderField = (field) => {
    switch (field.type) {
      case "multiselect":
        return (
          <CheckboxSelect
            options={field.options || []}
            value={formData[field.name] || []}
            onChange={(value) => handleMultiSelectChange(value, field.name)}
            placeholder={`Select ${field.label.toLowerCase()}`}
            disabled={field.disabled}
            icon={field.icon}
          />
        );
      case "radio":
        return (
          <RadioGroup
            onValueChange={(value) => handleSelectChange(value, field.name)}
            defaultValue={formData[field.name]}
            className="flex space-x-4"
          >
            {field.options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem
                  className="border-slate-200 focus:ring-blue-500 focus-visible:outline-none
                  focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-blue-500"
                  value={option.value}
                  id={`${field.name}-${option.value}`}
                />
                <Label htmlFor={`${field.name}-${option.value}`}>
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );
      case "select":
        return (
          <Select
            onValueChange={(value) => handleSelectChange(value, field.name)}
          >
            <SelectTrigger className="border-slate-200 focus:ring-blue-500 focus:border-blue-500">
              <SelectValue
                placeholder={`Select ${field.label.toLowerCase()}`}
              />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "date":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal border-slate-200 hover:bg-slate-100 focus:ring-blue-500 focus:border-blue-500"
              >
                <field.icon className="mr-2 h-4 w-4 text-blue-500" />
                {formData[field.name]
                  ? format(new Date(formData[field.name]), "PPP")
                  : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={
                  formData[field.name]
                    ? new Date(formData[field.name])
                    : undefined
                }
                onSelect={(date) => handleDateChange(date, field.name)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );
      case "textarea":
        return (
          <Textarea
            name={field.name}
            value={formData[field.name]}
            onChange={handleInputChange}
            className="min-h-[100px] border-slate-200 focus:ring-blue-500 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-blue-500"
            placeholder={field.placeholder}
            required={field.required}
          />
        );
      default:
        return (
          <Input
            name={field.name}
            type={field.type}
            value={
              field.name.startsWith("custom_")
                ? formData.customFields[field.name]
                : formData[field.name]
            }
            onChange={(e) =>
              field.name.startsWith("custom_")
                ? handleCustomFieldChange(field.name, e.target.value)
                : handleInputChange(e)
            }
            min={field.min}
            className="border-slate-200 focus:ring-blue-500 focus-visible:outline-none
              focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-blue-500"
            placeholder={
              field.placeholder || `Enter ${field.label.toLowerCase()}`
            }
            required={field.required}
          />
        );
    }
  };

  const renderCustomField = (field) => {
    if (field.type === "multi-entry") {
      return (
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              value={newEntries[field.name] || ""}
              onChange={(e) =>
                handleNewCustomEntryChange(field.name, e.target.value)
              }
              className="border-slate-200 focus:ring-blue-500 focus:border-blue-500"
              placeholder={`Add new ${field.label.toLowerCase()}`}
            />
            <Button
              type="button"
              onClick={() => addCustomItem(field.name)}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(formData.customFields[field.name] || []).map((item, index) => (
              <div
                key={index}
                className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => removeCustomItem(field.name, index)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return renderField(field);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <form
        onSubmit={checkStudentCount}
        className="max-w-6xl mx-auto space-y-6"
      >
        <Card className="border-t-4 border-t-blue-500 shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-6 h-6 text-blue-500" />
                <CardTitle className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  Create Job Description
                </CardTitle>
              </div>
              <Dialog open={newFieldDialog} onOpenChange={setNewFieldDialog}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2 border-blue-500 text-blue-500 hover:bg-blue-50"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Add Custom Field</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Custom Field</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Field Label</Label>
                      <Input
                        value={newField.label}
                        onChange={(e) =>
                          setNewField((prev) => ({
                            ...prev,
                            label: e.target.value,
                          }))
                        }
                        placeholder="Enter field label"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Section</Label>
                      <Input
                        value={newField.section}
                        onChange={(e) =>
                          setNewField((prev) => ({
                            ...prev,
                            section: e.target.value,
                          }))
                        }
                        placeholder="Enter section name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Field Type</Label>
                      <Select
                        value={newField.type}
                        onValueChange={(value) =>
                          setNewField((prev) => ({ ...prev, type: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select field type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="date">Date</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="multi-entry">
                            Multi Entry
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="required"
                        checked={newField.required}
                        onChange={(e) =>
                          setNewField((prev) => ({
                            ...prev,
                            required: e.target.checked,
                          }))
                        }
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="required">Required field</Label>
                    </div>
                    <Button
                      onClick={handleAddCustomField}
                      className="w-full"
                      disabled={!newField.label}
                    >
                      Add Field
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <CardDescription className="text-slate-500 dark:text-slate-400">
              Fill in the details to create a new job posting
              {error && (
                <div className="mt-2 text-red-500 text-sm">Error: {error}</div>
              )}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Custom Fields Sections */}
            {Object.entries(groupedCustomFields).map(([section, fields]) => (
              <div key={section} className="space-y-4">
                <h3 className="font-medium text-lg text-slate-900 dark:text-slate-100">
                  {section}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {fields.map((field, index) => (
                    <div key={index} className="space-y-2 relative">
                      <Label className="flex items-center space-x-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                        <field.icon className="w-4 h-4 text-blue-500" />
                        <span>{field.label}</span>
                        {field.required && (
                          <span className="text-red-500">*</span>
                        )}
                      </Label>
                      {renderCustomField(field)}
                      <button
                        type="button"
                        onClick={() => removeCustomField(field.name)}
                        className="absolute -top-2 -right-2 p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {/* Regular Form Sections */}
            {inputFields.map((section, sectionIndex) => (
              <div key={sectionIndex} className="space-y-4">
                <h3 className="font-medium text-lg text-slate-900 dark:text-slate-100">
                  {section.section}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {section.fields.map((field, fieldIndex) => (
                    <div key={fieldIndex} className="space-y-2">
                      <Label className="flex items-center space-x-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                        <field.icon className="w-4 h-4 text-blue-500" />
                        <span>{field.label}</span>
                        {field.required && (
                          <span className="text-red-500">*</span>
                        )}
                      </Label>
                      {renderField(field)}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Multi-Entry Fields */}
            <div className="space-y-6">
              {multiEntryFields.map((field, index) => (
                <div key={index} className="space-y-4">
                  <Label className="flex items-center space-x-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <field.icon className="w-4 h-4 text-blue-500" />
                    <span>{field.label}</span>
                  </Label>
                  <div className="flex space-x-2">
                    <Input
                      value={newEntries[field.name] || ""}
                      onChange={(e) =>
                        handleNewEntryChange(field.name, e.target.value)
                      }
                      className="border-slate-200 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={field.placeholder}
                    />
                    <Button
                      type="button"
                      onClick={() => addItem(field.name)}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData[field.name].map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                      >
                        <span>{item}</span>
                        <button
                          type="button"
                          onClick={() => removeItem(field.name, itemIndex)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="font-medium rounded-lg bg-blue-700 text-center text-white text-lg  dark:text-slate-100">
                Filter Details
              </h3>
              <FilterDetailsSection
                formData={formData}
                handleMultiSelectChange={handleMultiSelectChange}
                states={states}
                ugprograms={ugprograms}
                pgprograms={pgprograms}
                ugBranches={ugBranches}
                pgBranches={pgBranches}
                domains={domains}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                disabled={isCheckingCount || loading}
              >
                {isCheckingCount ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Checking Student Count...</span>
                  </>
                ) : (
                  <>
                    <Briefcase className="w-5 h-5" />
                    <span>Create Job Description</span>
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Confirm Job Description Creation
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>
                Based on your selected filters, this job description will be
                visible to:
              </p>
              <Alert>
                <Users className="h-5 w-5" />
                <AlertTitle>Student Count</AlertTitle>
                <AlertDescription className="font-semibold text-lg">
                  {studentCount} Students
                </AlertDescription>
              </Alert>
              <p>
                Would you like to proceed with creating this job description?
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-blue-700 hover:bg-blue-800 dark:text-white"
              onClick={handleConfirmedSubmit}
            >
              Proceed
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default React.memo(JobDescriptionForm);
