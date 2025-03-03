import React, { memo, useCallback, useState } from "react";
import { Check, ChevronDown, ChevronUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Add click outside handler to close dropdown
const useClickOutside = (ref, handler) => {
  React.useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};

const CheckboxSelect = memo(
  ({
    options = [],
    value = [],
    onChange,
    placeholder,
    disabled = false,
    icon: Icon,
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = React.useRef(null);
    useClickOutside(wrapperRef, () => setIsOpen(false));

    const optionLookup = React.useMemo(() => {
      return options.reduce((acc, opt) => {
        acc[opt.value] = opt.label;
        return acc;
      }, {});
    }, [options]);

    const toggleOption = useCallback(
      (optionValue) => {
        if (value.includes(optionValue)) {
          onChange(value.filter((v) => v !== optionValue));
        } else {
          onChange([...value, optionValue]);
        }
      },
      [value, onChange]
    );

    const removeItem = useCallback(
      (itemToRemove) => {
        onChange(value.filter((item) => item !== itemToRemove));
      },
      [value, onChange]
    );

    return (
      <div className="space-y-2" ref={wrapperRef}>
        <div className="relative">
          <Button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            disabled={disabled}
            className={cn(
              "w-full justify-between border border-slate-200 bg-white hover:bg-slate-100 text-slate-900",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <div className="flex items-center">
              {Icon && <Icon className="w-4 h-4 mr-2 text-blue-500" />}
              <span className="text-sm">{placeholder}</span>
            </div>
            {isOpen ? (
              <ChevronUp className="w-4 h-4 ml-2" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-2" />
            )}
          </Button>

          {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg">
              <div className="max-h-60 overflow-auto p-2 space-y-1">
                {options.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => toggleOption(option.value)}
                    className="flex items-center space-x-2 p-2 hover:bg-slate-100 rounded cursor-pointer"
                  >
                    <div
                      className={cn(
                        "w-4 h-4 border rounded flex items-center justify-center",
                        value.includes(option.value)
                          ? "bg-blue-500 border-blue-500"
                          : "border-slate-300"
                      )}
                    >
                      {value.includes(option.value) && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <span className="text-sm">{option.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {value.map((selectedValue) => (
            <div
              key={selectedValue}
              className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
            >
              <span className="text-sm">{optionLookup[selectedValue]}</span>
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

CheckboxSelect.displayName = "CheckboxSelect";

export default CheckboxSelect;
