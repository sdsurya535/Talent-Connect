import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Calendar,
  GraduationCap,
  Briefcase,
  Loader2,
  User,
  Award,
  BookOpen,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ResumeViewer = ({
  studentData = {
    name: "John Smith",
    emailid: "john.smith@example.com",
    mobile: "+91 9876543210",
    branch: "Computer Science",
    gender: "Male",
    final_year: "2024",
    btech_cgpa: "8.9",
    institute: "Indian Institute of Technology",
    state: "Maharashtra",
    status: "shortlisted",
    skills: ["JavaScript", "React", "Node.js", "Python", "Java", "Git"],
    languages: ["English", "Hindi"],
    achievements: [
      "Best Project Award at College Tech Fest",
      "1st Prize in National Coding Competition",
      "Published research paper in IEEE conference",
    ],
  },
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const resumeRef = useRef(null);

  const generatePDF = async () => {
    try {
      setIsGenerating(true);

      // Dynamically import required libraries
      const domtoimage = (await import("dom-to-image")).default;
      const { jsPDF } = await import("jspdf");

      const element = resumeRef.current;
      const padding = 10; // padding in mm

      // Calculate dimensions
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Convert to image with higher quality
      const image = await domtoimage.toPng(element, {
        quality: 1,
        scale: 2,
        style: {
          transform: "scale(1)",
          transformOrigin: "top left",
          width: `${element.offsetWidth}px`,
          height: `${element.offsetHeight}px`,
          background: "white",
        },
      });

      // Calculate dimensions to fit A4 with padding
      const imgWidth = pdfWidth - 2 * padding;
      const imgHeight = (element.offsetHeight * imgWidth) / element.offsetWidth;

      // Add image to PDF
      pdf.addImage(
        image,
        "PNG",
        padding,
        padding,
        imgWidth,
        imgHeight,
        undefined,
        "FAST"
      );

      // Add additional pages if content overflows
      if (imgHeight > pdfHeight - 2 * padding) {
        let remainingHeight = imgHeight;
        let currentPage = 1;

        while (remainingHeight > pdfHeight - 2 * padding) {
          pdf.addPage();
          currentPage++;

          pdf.addImage(
            image,
            "PNG",
            padding,
            padding - (pdfHeight - 2 * padding) * (currentPage - 1),
            imgWidth,
            imgHeight,
            undefined,
            "FAST"
          );

          remainingHeight -= pdfHeight - 2 * padding;
        }
      }

      // Save the PDF
      pdf.save(
        `${studentData.name.toLowerCase().replace(" ", "_")}_resume.pdf`
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Resume Preview</h1>
        <Button onClick={generatePDF} disabled={isGenerating} className="w-40">
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </>
          )}
        </Button>
      </div>

      <div ref={resumeRef} className="bg-white p-8 shadow-lg rounded-lg">
        {/* Header Section */}
        <div className="text-center space-y-4 mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            {studentData.name}
          </h2>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              {studentData.emailid}
            </div>
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              {studentData.mobile}
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {studentData.state}
            </div>
          </div>
          <div className="flex justify-center gap-4">
            <Badge variant="outline" className="px-4">
              <User className="h-3 w-3 mr-1" />
              {studentData.gender}
            </Badge>
            <Badge
              variant={
                studentData.status === "shortlisted"
                  ? "success"
                  : studentData.status === "pending"
                  ? "warning"
                  : "destructive"
              }
              className="px-4"
            >
              {studentData.status.charAt(0).toUpperCase() +
                studentData.status.slice(1)}
            </Badge>
          </div>
        </div>

        {/* Education Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-800">Education</h3>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-gray-800">
                  {studentData.branch}
                </h4>
                <p className="text-gray-600">{studentData.institute}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  {studentData.final_year}
                </div>
                <Badge
                  variant={
                    parseFloat(studentData.btech_cgpa) >= 8
                      ? "success"
                      : "default"
                  }
                >
                  CGPA: {studentData.btech_cgpa}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-800">
              Skills & Languages
            </h3>
          </div>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">
                Technical Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {studentData.skills?.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Languages</h4>
              <div className="flex flex-wrap gap-2">
                {studentData.languages?.map((language, index) => (
                  <Badge key={index} variant="outline">
                    {language}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-800">Achievements</h3>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <ul className="space-y-2">
              {studentData.achievements?.map((achievement, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span className="text-gray-700">{achievement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Professional Summary */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-800">
              Professional Summary
            </h3>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700">
              A dedicated {studentData.branch} student with strong academic
              performance (CGPA: {studentData.btech_cgpa}) and practical
              experience in various technical projects. Skilled in multiple
              programming languages and technologies, with a focus on delivering
              high-quality solutions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

ResumeViewer.propTypes = {
  studentData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    emailid: PropTypes.string.isRequired,
    mobile: PropTypes.string.isRequired,
    branch: PropTypes.string.isRequired,
    gender: PropTypes.string.isRequired,
    final_year: PropTypes.string.isRequired,
    btech_cgpa: PropTypes.string.isRequired,
    institute: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    skills: PropTypes.arrayOf(PropTypes.string),
    languages: PropTypes.arrayOf(PropTypes.string),
    achievements: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default ResumeViewer;
