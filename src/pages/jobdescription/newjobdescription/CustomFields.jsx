import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, Type, Hash, AlignLeft, ListPlus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const CustomFields = ({ fields, onChange }) => {
  const [activePopover, setActivePopover] = useState(null);

  const fieldTypeConfig = {
    text: {
      icon: <Type className="w-5 h-5" />,
      label: "Short answer",
      description: "Small text response",
    },
    textarea: {
      icon: <AlignLeft className="w-5 h-5" />,
      label: "Paragraph",
      description: "Long text response",
    },
    number: {
      icon: <Hash className="w-5 h-5" />,
      label: "Number",
      description: "Numerical input",
    },
    multientry: {
      icon: <ListPlus className="w-5 h-5" />,
      label: "Multiple items",
      description: "Multiple text entries",
    },
  };

  const addField = () => {
    onChange([
      ...fields,
      {
        id: Date.now(),
        label: "",
        type: "text",
        value: "",
        entries: [""],
      },
    ]);
  };

  const removeField = (id) => {
    onChange(fields.filter((field) => field.id !== id));
  };

  const updateField = (id, updates) => {
    onChange(
      fields.map((field) =>
        field.id === id ? { ...field, ...updates } : field
      )
    );
  };

  const addEntryToField = (fieldId) => {
    onChange(
      fields.map((field) => {
        if (field.id === fieldId) {
          return {
            ...field,
            entries: [...field.entries, ""],
          };
        }
        return field;
      })
    );
  };

  const updateEntryInField = (fieldId, entryIndex, value) => {
    onChange(
      fields.map((field) => {
        if (field.id === fieldId) {
          const newEntries = [...field.entries];
          newEntries[entryIndex] = value;
          return {
            ...field,
            entries: newEntries,
          };
        }
        return field;
      })
    );
  };

  const removeEntryFromField = (fieldId, entryIndex) => {
    onChange(
      fields.map((field) => {
        if (field.id === fieldId) {
          const newEntries = field.entries.filter(
            (_, index) => index !== entryIndex
          );
          return {
            ...field,
            entries: newEntries,
          };
        }
        return field;
      })
    );
  };

  const renderFieldInput = (field) => {
    switch (field.type) {
      case "textarea":
        return (
          <Textarea
            placeholder="Long answer text"
            value={field.value}
            onChange={(e) => updateField(field.id, { value: e.target.value })}
            className="min-h-[100px] mt-2"
          />
        );

      case "number":
        return (
          <Input
            type="number"
            placeholder="Number"
            value={field.value}
            onChange={(e) => updateField(field.id, { value: e.target.value })}
            className="h-12 mt-2"
          />
        );

      case "multientry":
        return (
          <div className="space-y-2 mt-2">
            {field.entries.map((entry, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={`Item ${index + 1}`}
                  value={entry}
                  onChange={(e) =>
                    updateEntryInField(field.id, index, e.target.value)
                  }
                  className="h-12"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeEntryFromField(field.id, index)}
                  className="h-12 w-12"
                  disabled={field.entries.length === 1}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => addEntryToField(field.id)}
              className="w-full mt-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>
        );

      default: // text
        return (
          <Input
            placeholder="Short answer text"
            value={field.value}
            onChange={(e) => updateField(field.id, { value: e.target.value })}
            className="h-12 mt-2"
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Custom Fields</h2>
        <Button
          onClick={addField}
          variant="outline"
          className="h-12 px-4 text-gray-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add custom field
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field) => (
          <div
            key={field.id}
            className="p-4 border rounded-lg bg-white shadow-sm"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex-1 flex items-center gap-2">
                  <Input
                    placeholder="Question"
                    value={field.label}
                    onChange={(e) =>
                      updateField(field.id, { label: e.target.value })
                    }
                    className="h-12"
                  />
                  <Popover
                    open={activePopover === field.id}
                    onOpenChange={(isOpen) =>
                      setActivePopover(isOpen ? field.id : null)
                    }
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-12 w-12 rounded-full hover:bg-gray-100"
                      >
                        {fieldTypeConfig[field.type].icon}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-72 p-2"
                      align="start"
                      sideOffset={5}
                    >
                      <div className="grid grid-cols-1 gap-0.5">
                        {Object.entries(fieldTypeConfig).map(
                          ([type, config]) => (
                            <Button
                              key={type}
                              variant="ghost"
                              className={`flex items-start justify-start h-auto px-3 py-2.5 w-full text-left hover:bg-gray-50 ${
                                field.type === type
                                  ? "bg-gray-100 hover:bg-gray-100"
                                  : ""
                              }`}
                              onClick={() => {
                                updateField(field.id, {
                                  type,
                                  value: "",
                                  entries:
                                    type === "multientry" ? [""] : undefined,
                                });
                                setActivePopover(null);
                              }}
                            >
                              <div className="flex gap-3 min-w-0 w-full">
                                <div className="flex-shrink-0 text-gray-600 mt-0.5">
                                  {config.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-left text-sm truncate">
                                    {config.label}
                                  </div>
                                  <div className="text-xs text-gray-500 font-normal truncate">
                                    {config.description}
                                  </div>
                                </div>
                              </div>
                            </Button>
                          )
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeField(field.id)}
                  className="ml-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {renderFieldInput(field)}
            </div>
          </div>
        ))}
      </div>

      {fields.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No custom fields added yet. Click the button above to add one.
        </div>
      )}
    </div>
  );
};

export default CustomFields;
