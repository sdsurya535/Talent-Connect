import React, { memo, useCallback, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import _ from "lodash";

const MultiSelect = memo(
  ({ options = [], value = [], onChange, placeholder, disabled = false }) => {
    // Memoize the option lookup for better performance
    const optionLookup = React.useMemo(() => {
      return options.reduce((acc, opt) => {
        acc[opt.value] = opt.label;
        return acc;
      }, {});
    }, [options]);

    // Memoize the handleSelect function
    const handleSelect = useCallback(
      (newValue) => {
        if (!value.includes(newValue)) {
          onChange([...value, newValue]);
        }
      },
      [value, onChange]
    );

    // Memoize the removeItem function
    const removeItem = useCallback(
      (itemToRemove) => {
        onChange(value.filter((item) => item !== itemToRemove));
      },
      [value, onChange]
    );

    return (
      <div className="space-y-2">
        <Select onValueChange={handleSelect} disabled={disabled}>
          <SelectTrigger
            className={`border-slate-200 focus:ring-blue-500 focus:border-blue-500 ${
              disabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex flex-wrap gap-2">
          {value.map((selectedValue) => (
            <div
              key={selectedValue}
              className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
            >
              <span>{optionLookup[selectedValue]}</span>
              <button
                type="button"
                onClick={() => removeItem(selectedValue)}
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
);

MultiSelect.displayName = "MultiSelect";

export default MultiSelect;
