import React, { useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const JobDescription = ({ value, onChange }) => {
  const quillRef = useRef(null);
  const LOCAL_STORAGE_KEY = "jobPostDescription"; // Separate key for job description

  const modules = {
    toolbar: [
      ["bold", "italic"],
      [{ list: "bullet" }, { list: "ordered" }],
      ["clean"],
    ],
  };

  const formats = ["bold", "italic", "list", "bullet"];

  // Load from localStorage on component mount
  useEffect(() => {
    const savedDescription = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedDescription && (!value || value === "")) {
      // Only apply saved content if current value is empty
      onChange(savedDescription);
    }
  }, []);

  // Save to localStorage whenever content changes
  useEffect(() => {
    if (value) {
      localStorage.setItem(LOCAL_STORAGE_KEY, value);
    }
  }, [value]);

  // Apply dark mode styles
  useEffect(() => {
    const applyDarkModeStyles = () => {
      if (!quillRef.current) return;

      const editor = quillRef.current.getEditor();
      const toolbar = editor.container.previousSibling;

      if (document.documentElement.classList.contains("dark")) {
        editor.container.classList.add("dark-mode");
        toolbar.classList.add("dark-mode");
      } else {
        editor.container.classList.remove("dark-mode");
        toolbar.classList.remove("dark-mode");
      }
    };

    // Initial application of styles
    applyDarkModeStyles();

    // Create observer to watch for dark mode changes
    const observer = new MutationObserver(applyDarkModeStyles);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
          Job Description*
        </h2>
      </div>

      <div className="border dark:border-gray-700 rounded-lg">
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder="You are responsible for your job post. Review to ensure it has all required information"
          className="h-64 dark:bg-gray-800 dark:text-gray-100"
        />
      </div>

      <style jsx global>{`
        /* Dark mode styles for Quill editor */
        .ql-container.dark-mode {
          background-color: rgb(31, 41, 55);
          color: rgb(243, 244, 246);
          border-color: rgb(75, 85, 99);
        }

        .ql-toolbar.dark-mode {
          background-color: rgb(31, 41, 55);
          border-color: rgb(75, 85, 99);
        }

        .ql-toolbar.dark-mode .ql-stroke {
          stroke: rgb(243, 244, 246);
        }

        .ql-toolbar.dark-mode .ql-fill {
          fill: rgb(243, 244, 246);
        }

        .ql-toolbar.dark-mode .ql-picker {
          color: rgb(243, 244, 246);
        }

        .ql-toolbar.dark-mode .ql-picker-options {
          background-color: rgb(31, 41, 55);
        }

        .ql-editor.dark-mode::before {
          color: rgb(156, 163, 175);
        }
      `}</style>
    </div>
  );
};

export default JobDescription;
