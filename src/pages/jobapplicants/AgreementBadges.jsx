import React from "react";
import { FileText, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const AgreementSection = ({ agreement }) => {
  // A robust function to parse agreement data in any format
  const parseAgreementData = (data) => {
    // If it's null or undefined, return null
    if (data === null || data === undefined) {
      console.log("Agreement data is null or undefined");
      return null;
    }

    // If it's already an array, return it
    if (Array.isArray(data)) {
      return data;
    }

    // If it's an object but not an array, format for display
    if (typeof data === "object" && !Array.isArray(data) && data !== null) {
      return Object.entries(data).map(([key, value]) => ({
        question: key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase())
          .trim(),
        answer: value,
      }));
    }

    // If it's a string, try to parse it
    if (typeof data === "string") {
      try {
        // Direct parse (handles normal JSON strings)
        const parsed = JSON.parse(data);

        // Handle key-value pair format like {"relocationAgreement":"1","documentForwardingAgreement":"1"}
        if (
          !Array.isArray(parsed) &&
          typeof parsed === "object" &&
          parsed !== null
        ) {
          return Object.entries(parsed).map(([key, value]) => {
            // Handle different keys formats and transform them to readable questions
            const questionMap = {
              relocationAgreement: "Are you willing to relocate as required?",
              documentForwardingAgreement:
                "Do you agree to forward all required documents?",
              bondAgreement: "Do you agree to the company bond requirements?",
              // Add more mappings as needed
            };

            // Use mapping if available, otherwise format the key as a question
            const formattedKey =
              questionMap[key] ||
              key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())
                .trim();

            // Format the answer (handle "1"/"0" strings as boolean values)
            let formattedValue = value;
            if (value === "1" || value === "true" || value === 1) {
              formattedValue = true;
            } else if (value === "0" || value === "false" || value === 0) {
              formattedValue = false;
            }

            return {
              question: formattedKey,
              answer: formattedValue,
            };
          });
        }

        return parsed;
      } catch (e1) {
        try {
          // Remove outer quotes and parse (handles quoted JSON strings)
          const withoutOuterQuotes = data.replace(/^["'](.*)["']$/, "$1");
          return JSON.parse(withoutOuterQuotes);
        } catch (e2) {
          try {
            // Remove outer quotes and unescape inner quotes
            const withoutOuterQuotes = data.replace(/^["'](.*)["']$/, "$1");
            const unescapedString = withoutOuterQuotes
              .replace(/\\"/g, '"')
              .replace(/\\'/g, "'");
            return JSON.parse(unescapedString);
          } catch (e3) {
            try {
              // Double parse for double-stringified JSON
              return JSON.parse(JSON.parse(data));
            } catch (e4) {
              // Last resort: try to extract JSON-like structure using regex
              try {
                const match = data.match(/\[.*\]/);
                if (match) {
                  return JSON.parse(match[0]);
                }

                // Try to extract object-like structure
                const objMatch = data.match(/\{.*\}/);
                if (objMatch) {
                  const parsed = JSON.parse(objMatch[0]);
                  return Object.entries(parsed).map(([key, value]) => ({
                    question: key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())
                      .trim(),
                    answer: value,
                  }));
                }
              } catch (e5) {
                console.error("All parsing methods failed:", data);
                return null;
              }
            }
          }
        }
      }
    }

    // If we couldn't parse it in any way, return null
    return null;
  };

  // Parse the agreement data
  const agreementData = parseAgreementData(agreement);

  // Log for debugging
  console.log("Original agreement:", agreement);
  console.log("Parsed agreement data:", agreementData);

  // If parsing failed or data is missing
  if (!agreementData) {
    return (
      <div className="mb-6">
        <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-900 dark:text-white">
          <FileText className="w-5 h-5" />
          Agreement Details
        </h3>
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No valid agreement data available.
          </p>
        </div>
      </div>
    );
  }

  // Format to display the agreement data
  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-900 dark:text-white">
        <FileText className="w-5 h-5" />
        Agreement Questions
      </h3>
      <div className="space-y-3">
        {agreementData.map((item, index) => (
          <div
            key={index}
            className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                {item.question || `Question ${index + 1}`}
              </span>

              {/* Display the answer based on its type */}
              {typeof item.answer === "boolean" ? (
                <Badge
                  variant={item.answer ? "success" : "destructive"}
                  className={`ml-2 flex items-center ${
                    item.answer
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                  }`}
                >
                  {item.answer ? (
                    <Check className="w-3 h-3 mr-1" />
                  ) : (
                    <X className="w-3 h-3 mr-1" />
                  )}
                  {item.answer ? "Yes" : "No"}
                </Badge>
              ) : (
                <span
                  className={`ml-2 text-sm font-medium py-1 px-2 rounded-md ${
                    item.answer === "1" ||
                    item.answer === 1 ||
                    item.answer === "true" ||
                    item.answer === true
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      : item.answer === "0" ||
                        item.answer === 0 ||
                        item.answer === "false" ||
                        item.answer === false
                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                      : "bg-gray-100 text-gray-900 dark:bg-gray-600 dark:text-gray-100"
                  }`}
                >
                  {item.answer !== undefined && item.answer !== null
                    ? item.answer === "1" ||
                      item.answer === 1 ||
                      item.answer === "true" ||
                      item.answer === true
                      ? "Yes"
                      : item.answer === "0" ||
                        item.answer === 0 ||
                        item.answer === "false" ||
                        item.answer === false
                      ? "No"
                      : String(item.answer)
                    : "No answer"}
                </span>
              )}
            </div>

            {/* Display timestamp if available */}
            {item.timestamp && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Answered on: {new Date(item.timestamp).toLocaleString()}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgreementSection;
