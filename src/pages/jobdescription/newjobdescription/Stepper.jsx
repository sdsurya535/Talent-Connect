import React from "react";
import { cn } from "@/lib/utils";

const Stepper = ({ steps, currentStep, className }) => {
  return (
    <div className={cn("w-full py-4", className)}>
      <div className="flex items-center space-x-2 px-1">
        <span className="text-sm font-medium text-gray-900">
          {currentStep} of {steps.length}:
        </span>
        <span className="text-sm text-gray-900">
          {steps[currentStep - 1].label}
        </span>
        <div className="flex-1 h-1 bg-gray-200 rounded-full">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default Stepper;
