import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

const Benefits = ({ benefits, salary, onChange }) => {
  const handleBenefitChange = (index, value) => {
    const newBenefits = [...benefits];
    newBenefits[index] = value;
    onChange("benefits", newBenefits);
  };

  const addBenefit = () => {
    onChange("benefits", [...benefits, ""]);
  };

  const removeBenefit = (index) => {
    const newBenefits = benefits.filter((_, i) => i !== index);
    onChange("benefits", newBenefits);
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Left Column */}
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="font-medium">Benefits & Perks</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addBenefit}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Benefit
            </Button>
          </div>

          {benefits.map((benefit, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={benefit}
                onChange={(e) => handleBenefitChange(index, e.target.value)}
                placeholder="Enter benefit"
                className="h-12"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeBenefit(index)}
                className="h-12 w-12"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}

          {benefits.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              No benefits added. Click the button above to add one.
            </p>
          )}
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="salary" className="font-medium">
            Salary Range
          </Label>
          <Input
            id="salary"
            value={salary}
            onChange={(e) => onChange("salary", e.target.value)}
            placeholder="e.g., $50,000 - $70,000 per year"
            className="h-12"
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            Tip: Good salary information helps candidates
          </h3>
          <p className="text-sm text-gray-600">
            Candidates are more likely to apply when they know the compensation
            range. Be transparent and include any additional compensation like
            bonuses or equity.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Benefits;
