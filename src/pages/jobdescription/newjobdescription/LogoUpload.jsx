import React, { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Image, Upload, X } from "lucide-react";

const LogoUpload = ({ value, onChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (file) {
      if (file.size > 200 * 1024) {
        setError("File size must be less than 200KB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        onChange("companyLogo", event.target.result);
        setError("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleRemoveLogo = () => {
    onChange("companyLogo", "");
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="font-medium">Company Logo</Label>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Max size: 200KB
        </span>
      </div>

      {value ? (
        <div className="relative group">
          <img
            src={value}
            alt="Company logo"
            className="w-full h-32 object-contain border rounded-lg bg-white dark:bg-gray-800"
          />
          <button
            onClick={handleRemoveLogo}
            className="absolute top-2 right-2 p-1.5 bg-gray-900/70 rounded-full 
                     text-white opacity-0 group-hover:opacity-100 transition-opacity
                     hover:bg-gray-900/90"
            aria-label="Remove logo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative cursor-pointer
            border-2 border-dashed rounded-lg
            p-6 text-center
            transition-colors duration-200
            ${
              isDragging
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
            }
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />

          <div className="space-y-3">
            <div
              className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 
                          flex items-center justify-center"
            >
              <Upload
                className={`w-6 h-6 ${
                  isDragging ? "text-blue-500" : "text-gray-400"
                }`}
              />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Drop your company logo here, or{" "}
                <span className="text-blue-500">browse</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Supports: JPG, PNG, GIF
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default LogoUpload;
