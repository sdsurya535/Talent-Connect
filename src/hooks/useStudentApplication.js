import { useState, useCallback } from "react";
import { useApi } from "@/hooks/useApi";

export const useStudentApplications = () => {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    shortlisted: 0,
    avgCGPA: 0,
  });
  const [totalPages, setTotalPages] = useState(0);

  const { sendRequest, loading, error } = useApi();

  const fetchData = useCallback(
    async ({
      pageSize = 8,
      pageNumber = 1,
      status = "all",
      searchQuery = "",
      filters = {},
    }) => {
      try {
        // Convert "all" values to empty strings
        const { companyId, jdId, location } = filters;
        const formData = new FormData();
        formData.append("pageSize", pageSize);
        formData.append("pageNumber", pageNumber);
        formData.append("status", status);
        formData.append("search", searchQuery);
        formData.append(
          "companyId",
          companyId === "all" ? "" : companyId || ""
        );
        formData.append("jdId", jdId === "all" ? "" : jdId || "");
        formData.append("jdLocation", location === "all" ? "" : location || "");

        const data = await sendRequest({
          url: "/talent/connect/applied/student2",
          method: "POST",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const students = data.studentsResponse;

        setApplications(students);
        setTotalPages(data.totalPages);

        // Calculate stats
        const totalApplications = data.totalApplications;
        const shortlisted = data.shortlisted;
        const filteredApplications = data.filteredApplications;
        const avgCGPA =
          students.length > 0
            ? students.reduce(
                (sum, app) => sum + parseFloat(app.btech_cgpa),
                0
              ) / students.length
            : 0;

        setStats({
          total: totalApplications,
          shortlisted: shortlisted,
          avgCGPA: avgCGPA.toFixed(1),
          filtered: filteredApplications,
        });
      } catch (err) {
        // Error handling is now managed by useApi hook
        console.error("Error fetching student applications:", err);
      }
    },
    [sendRequest]
  );

  return {
    applications,
    stats,
    loading,
    error,
    totalPages,
    fetchData,
  };
};
