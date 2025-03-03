import React from "react";
import PropTypes from "prop-types";
import { Eye, Edit2, MapPin, Users, DollarSign, Calendar } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const JobCardView = ({ jobs, onViewDetails }) => {
  const parseSkills = (skillsString) => {
    try {
      if (!skillsString) return [];
      if (typeof skillsString === "string") {
        // Try parsing if it's a JSON string
        try {
          const parsed = JSON.parse(skillsString);
          if (Array.isArray(parsed)) {
            // Handle case where it's an array with comma-separated string
            if (parsed.length === 1 && typeof parsed[0] === "string") {
              return parsed[0].split(",").map((skill) => skill.trim());
            }
            return parsed;
          }
        } catch {
          // If not JSON, split by comma
          return skillsString.split(",").map((skill) => skill.trim());
        }
      }
      return [];
    } catch (error) {
      console.error("Error parsing skills:", error);
      return [];
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <Card
          key={job.company_id}
          className="flex flex-col hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border border-blue-100 dark:border-blue-900"
        >
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                  {job.jd_title}
                </h3>

                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{job.jd_location}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <Users className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="text-sm">{job.no_of_opening} Openings</span>
                </div>
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <DollarSign className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="text-sm">{job.package}</span>
                </div>
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="text-sm">{job.joining}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Required Skills:
                </div>
                <div className="flex flex-wrap gap-1">
                  {parseSkills(job.skill_required).map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {job.jd_role && (
                <div className="space-y-1">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Role Description:
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                    {job.jd_role}
                  </p>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="mt-auto pt-4 flex justify-between items-center">
            <Button
              variant="outline"
              size="sm"
              className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/50 dark:border-blue-900"
              onClick={() => onViewDetails(job)}
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                >
                  <Edit2 className="h-4 w-4 text-blue-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="border-blue-100 dark:border-blue-900"
              >
                <DropdownMenuItem className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50">
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
JobCardView.propTypes = {
  jobs: PropTypes.arrayOf(
    PropTypes.shape({
      company_id: PropTypes.string.isRequired,
      jd_title: PropTypes.string.isRequired,
      jd_location: PropTypes.string.isRequired,
      no_of_opening: PropTypes.number.isRequired,
      package: PropTypes.string.isRequired,
      joining: PropTypes.string.isRequired,
      skill_required: PropTypes.string.isRequired,
      jd_role: PropTypes.string,
    })
  ).isRequired,
  onViewDetails: PropTypes.func.isRequired,
};

export default JobCardView;
