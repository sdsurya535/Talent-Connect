import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Loader2,
  Percent,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { useApi } from "@/hooks/useApi";

const currentYear = new Date().getFullYear();
const passoutYears = Array.from({ length: 10 }, (_, index) =>
  (currentYear - 2 + index).toString()
);

const ScoreInput = ({ label, value, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4" />
          <span>{label}</span>
          <Percent className="h-4 w-4" />
        </div>
      </label>
      <div className="relative">
        <Input
          type="number"
          min="0"
          max="100"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter percentage"
          className="pr-8"
        />
      </div>
    </div>
  );
};

const MultiSelect = ({
  options,
  selected,
  setSelected,
  label,
  id,
  loading,
  disabled,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (e, option) => {
    e.stopPropagation();
    if (disabled) return;

    setSelected((prev) => {
      const isSelected = prev.some((item) =>
        typeof item === "object" && item !== null
          ? item.value === option.value
          : item === option
      );

      if (isSelected) {
        return prev.filter((item) =>
          typeof item === "object" && item !== null
            ? item.value !== option.value
            : item !== option
        );
      } else {
        return [...prev, option];
      }
    });
  };

  const handleRemoveTag = (e, option) => {
    e.stopPropagation();
    if (disabled) return;

    setSelected((prev) =>
      prev.filter((item) =>
        typeof item === "object" && item !== null
          ? item.value !== option.value
          : item !== option
      )
    );
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <Popover
        open={isOpen && !disabled}
        onOpenChange={(open) => !disabled && setIsOpen(open)}
      >
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-between text-left font-normal"
            role="combobox"
            aria-expanded={isOpen}
            disabled={disabled}
          >
            {selected.length === 0
              ? `Select ${label}`
              : `${selected.length} selected`}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[--radix-popover-trigger-width] p-0"
          align="start"
        >
          <div className="max-h-64 overflow-auto">
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
              </div>
            ) : (
              options.map((option) => (
                <div
                  key={`${id}-${option.value || option}`}
                  className="flex items-center px-2 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={(e) => handleToggle(e, option)}
                >
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border rounded flex items-center justify-center">
                      {selected.some((item) =>
                        typeof item === "object" && item !== null
                          ? item.value === option.value
                          : item === option
                      ) && <Check className="h-3 w-3" />}
                    </div>
                    <span className="text-sm">{option.label || option}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </PopoverContent>
      </Popover>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selected.map((item) => (
            <span
              key={`${id}-tag-${item.value || item}`}
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md"
            >
              {item.label || item}
              <button
                type="button"
                onClick={(e) => handleRemoveTag(e, item)}
                className="hover:text-blue-600 focus:outline-none"
                disabled={disabled}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const FilterDetails = ({ onChange }) => {
  const { sendRequest, loading: initialLoading } = useApi();
  const [screeningData, setScreeningData] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loadingUGBranches, setLoadingUGBranches] = useState(false);
  const [loadingPGBranches, setLoadingPGBranches] = useState(false);

  const [selectedStates, setSelectedStates] = useState([]);
  const [selectedUGPrograms, setSelectedUGPrograms] = useState([]);
  const [selectedUGBranches, setSelectedUGBranches] = useState([]);
  const [selectedUGPassoutYears, setSelectedUGPassoutYears] = useState([]);
  const [selectedPGPrograms, setSelectedPGPrograms] = useState([]);
  const [selectedPGBranches, setSelectedPGBranches] = useState([]);
  const [selectedPGPassoutYears, setSelectedPGPassoutYears] = useState([]);
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [isComplete, setIsComplete] = useState([]);

  const [tenthScore, setTenthScore] = useState("");
  const [twelfthScore, setTwelfthScore] = useState("");
  const [btechScore, setBtechScore] = useState("");

  const [ugBranches, setUGBranches] = useState([]);
  const [pgBranches, setPGBranches] = useState([]);
  const [selectedInstitutes, setSelectedInstitutes] = useState([]);

  useEffect(() => {
    const fetchScreeningData = async () => {
      try {
        const response = await sendRequest({
          url: "/documents/studentScreening",
          method: "GET",
        });
        setScreeningData(response);
      } catch (error) {
        console.error("Error fetching screening data:", error);
      }
    };

    fetchScreeningData();
  }, [sendRequest]);

  useEffect(() => {
    const fetchUGBranches = async () => {
      if (selectedUGPrograms.length > 0) {
        setLoadingUGBranches(true);
        setSelectedUGBranches([]); // Reset selected branches when programs change
        try {
          const programIds = selectedUGPrograms.map((program) => program.value);
          const response = await sendRequest({
            url: "/talent/connect/ugBranches",
            method: "POST",
            data: { programId: programIds },
          });

          const allBranches = response?.ugBranches
            .filter((branch) => branch?.branch)
            .map((branch) => ({
              value: branch.branch,
              label: branch.branch,
            }));

          setUGBranches(allBranches);
        } catch (error) {
          console.error("Error fetching UG branches:", error);
        } finally {
          setLoadingUGBranches(false);
        }
      } else {
        setUGBranches([]);
        setSelectedUGBranches([]);
      }
    };

    fetchUGBranches();
  }, [selectedUGPrograms, sendRequest]);

  useEffect(() => {
    const fetchPGBranches = async () => {
      if (selectedPGPrograms.length > 0) {
        setLoadingPGBranches(true);
        setSelectedPGBranches([]); // Reset selected branches when programs change
        try {
          const programIds = selectedPGPrograms.map((program) => program.value);
          const response = await sendRequest({
            url: "/talent/connect/pgBranches",
            method: "POST",
            data: { programId: programIds },
          });

          const allBranches = response?.pgBranches
            .filter((branch) => branch?.pg_branch)
            .map((branch) => ({
              value: branch.pg_branch,
              label: branch.pg_branch,
            }));

          setPGBranches(allBranches);
        } catch (error) {
          console.error("Error fetching PG branches:", error);
        } finally {
          setLoadingPGBranches(false);
        }
      } else {
        setPGBranches([]);
        setSelectedPGBranches([]);
      }
    };

    fetchPGBranches();
  }, [selectedPGPrograms, sendRequest]);

  const filterData = useMemo(
    () => ({
      states: selectedStates,
      ugPrograms: selectedUGPrograms,
      ugBranches: selectedUGBranches,
      ugPassoutYears: selectedUGPassoutYears,
      pgPrograms: selectedPGPrograms,
      pgBranches: selectedPGBranches,
      pgPassoutYears: selectedPGPassoutYears,
      domains: selectedDomains,
      isComplete: isComplete,
      tenth: tenthScore,
      twelfth: twelfthScore,
      btech: btechScore,
      institutes: selectedInstitutes,
    }),
    [
      selectedStates,
      selectedUGPrograms,
      selectedUGBranches,
      selectedUGPassoutYears,
      selectedPGPrograms,
      selectedPGBranches,
      selectedPGPassoutYears,
      selectedDomains,
      isComplete,
      tenthScore,
      twelfthScore,
      btechScore,
      selectedInstitutes,
    ]
  );

  const handleChange = useCallback(() => {
    onChange(filterData);
  }, [filterData]);

  useEffect(() => {
    handleChange();
  }, [handleChange]);

  const getStates = () =>
    screeningData?.statesResponse?.map((state) => ({
      value: state.state_id.toString(),
      label: state.state_name,
    })) || [];
  const getPrograms = () =>
    screeningData?.programsResponse?.map((program) => ({
      value: program.program_id.toString(),
      label: program.program_name,
    })) || [];
  const getPgPrograms = () =>
    screeningData?.pgProgramsResponse?.map((program) => ({
      value: program.program_id,
      label: program.program_name,
    })) || [];
  const getDomains = () =>
    screeningData?.domainsResponse?.map((domain) => ({
      value: domain.domain_id,
      label: domain.domain_name,
    })) || [];
  const getInstitutes = () =>
    screeningData?.institutesResponse?.map((domain) => ({
      value: domain.institue_id,
      label: domain.institute_name,
    })) || [];

  return (
    <div className="space-y-6">
      <Alert className="mb-6">
        <AlertDescription>
          <span className="text-red-500 font-bold mr-1">*</span>
          Note: If no options are selected for a filter, all values for that
          field will be included in the results by default.
        </AlertDescription>
      </Alert>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Basic Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MultiSelect
            id="states"
            label="States"
            options={getStates()}
            selected={selectedStates}
            setSelected={setSelectedStates}
            loading={initialLoading}
            disabled={initialLoading}
          />
          <MultiSelect
            id="ugPrograms"
            label="UG Programs"
            options={getPrograms()}
            selected={selectedUGPrograms}
            setSelected={setSelectedUGPrograms}
            loading={initialLoading}
            disabled={initialLoading}
          />
          {(selectedUGPrograms.length > 0 || loadingUGBranches) && (
            <MultiSelect
              id="ugBranches"
              label="UG Branches"
              options={ugBranches}
              selected={selectedUGBranches}
              setSelected={setSelectedUGBranches}
              loading={loadingUGBranches}
              disabled={loadingUGBranches}
            />
          )}
          <MultiSelect
            id="ugPassoutYears"
            label="UG Passout Year"
            options={passoutYears}
            selected={selectedUGPassoutYears}
            setSelected={setSelectedUGPassoutYears}
            loading={false}
          />
          <MultiSelect
            id="pgPrograms"
            label="PG Programs"
            options={getPgPrograms()}
            selected={selectedPGPrograms}
            setSelected={setSelectedPGPrograms}
            loading={initialLoading}
            disabled={initialLoading}
          />
          {(selectedPGPrograms.length > 0 || loadingPGBranches) && (
            <MultiSelect
              id="pgBranches"
              label="PG Branches"
              options={pgBranches}
              selected={selectedPGBranches}
              setSelected={setSelectedPGBranches}
              loading={loadingPGBranches}
              disabled={loadingPGBranches}
            />
          )}
          <MultiSelect
            id="pgPassoutYears"
            label="PG Passout Year"
            options={passoutYears}
            selected={selectedPGPassoutYears}
            setSelected={setSelectedPGPassoutYears}
            loading={false}
          />
          <MultiSelect
            id="isComplete"
            label="Is Complete"
            options={["Yes", "No"]}
            selected={isComplete}
            setSelected={setIsComplete}
            loading={false}
          />
        </div>
      </div>

      <div className="space-y-6">
        <Button
          type="button"
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
          Advanced Filters
        </Button>

        {showAdvanced && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MultiSelect
                id="domains"
                label="Domains"
                options={getDomains()}
                selected={selectedDomains}
                setSelected={setSelectedDomains}
                loading={initialLoading}
                disabled={initialLoading}
              />{" "}
              <MultiSelect
                id="institutes"
                label="Institutes"
                options={getInstitutes()}
                selected={selectedInstitutes}
                setSelected={setSelectedInstitutes}
                loading={initialLoading}
                disabled={initialLoading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ScoreInput
                label="10th Mark is greater than"
                value={tenthScore}
                onChange={setTenthScore}
              />
              <ScoreInput
                label="12th Mark is greater than"
                value={twelfthScore}
                onChange={setTwelfthScore}
              />
              <ScoreInput
                label="B.Tech Mark is greater than"
                value={btechScore}
                onChange={setBtechScore}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterDetails;
