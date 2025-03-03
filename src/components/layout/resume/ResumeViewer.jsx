import React from "react";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Globe, Printer } from "lucide-react";

const Resume = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Print Styles */}
      <style>
        {`
          @page {
            size: A4;
            margin: 0;
          }
          
          @media print {
            body * {
              visibility: hidden;
            }
            
            body {
              background: white;
              margin: 0;
              padding: 0;
            }

            #resume, #resume * {
              visibility: visible;
            }

            #resume {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100vh;
              padding: 0;
              margin: 0;
            }

            .no-print {
              display: none !important;
            }

            /* Adjust font sizes for print */
            #resume h1 { font-size: 24px !important; }
            #resume h2 { font-size: 18px !important; }
            #resume p, #resume li { font-size: 12px !important; }
            #resume .text-lg { font-size: 14px !important; }
            
            /* Adjust spacing for print */
            #resume .p-6 { padding: 1rem !important; }
            #resume .mb-8 { margin-bottom: 1rem !important; }
            #resume .mb-4 { margin-bottom: 0.5rem !important; }
            #resume .space-y-2 > * + * { margin-top: 0.25rem !important; }
            #resume .gap-6 { gap: 1rem !important; }
            
            /* Ensure proper column widths */
            #resume .w-1/3 { width: 30% !important; }
            #resume .w-2/3 { width: 70% !important; }
            
            /* Remove shadows and borders for better printing */
            #resume { box-shadow: none !important; }
          }
        `}
      </style>

      <div className="max-w-5xl mx-auto p-4">
        <Button
          onClick={handlePrint}
          className="mb-4 bg-indigo-600 hover:bg-indigo-700 no-print"
        >
          <Printer className="mr-2 h-4 w-4" />
          Print Resume
        </Button>

        {/* Resume Content */}
        <div
          id="resume"
          className="flex gap-6 bg-white rounded-lg shadow-xl overflow-hidden"
        >
          {/* Left Column */}
          <div className="w-1/3 bg-gradient-to-b from-indigo-900 to-indigo-700 text-white p-6">
            {/* Profile Image */}
            <div className="mb-6">
              <div className="bg-white p-1 rounded-full w-24 h-24 mx-auto mb-4">
                <img
                  src="/api/placeholder/150/150"
                  alt="Profile"
                  className="rounded-full w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-3 border-b border-indigo-500 pb-2">
                CONTACT
              </h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-indigo-100 text-sm">
                  <Phone size={14} />
                  <span>+123-456-7890</span>
                </div>
                <div className="flex items-center gap-2 text-indigo-100 text-sm">
                  <Mail size={14} />
                  <span>hello@example.com</span>
                </div>
                <div className="flex items-center gap-2 text-indigo-100 text-sm">
                  <MapPin size={14} />
                  <span>123 Main St, Any City</span>
                </div>
                <div className="flex items-center gap-2 text-indigo-100 text-sm">
                  <Globe size={14} />
                  <span>www.example.com</span>
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-3 border-b border-indigo-500 pb-2">
                EDUCATION
              </h2>
              <div className="mb-3">
                <div className="font-bold text-indigo-200 text-sm">
                  2029 - 2030
                </div>
                <div className="font-semibold text-sm">CENTRAL UNIVERSITY</div>
                <div className="text-indigo-100 text-sm">
                  Master of Business
                </div>
              </div>
              <div>
                <div className="font-bold text-indigo-200 text-sm">
                  2025 - 2029
                </div>
                <div className="font-semibold text-sm">CENTRAL UNIVERSITY</div>
                <div className="text-indigo-100 text-sm">
                  Bachelor of Business
                </div>
                <div className="text-indigo-200 text-sm">GPA: 3.8 / 4.0</div>
              </div>
            </div>

            {/* Skills */}
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-3 border-b border-indigo-500 pb-2">
                SKILLS
              </h2>
              <ul className="space-y-1 text-sm">
                {[
                  "Project Management",
                  "Public Relations",
                  "Teamwork",
                  "Time Management",
                  "Leadership",
                  "Communication",
                  "Critical Thinking",
                ].map((skill) => (
                  <li key={skill} className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-indigo-300 rounded-full"></div>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>

            {/* Languages */}
            <div>
              <h2 className="text-lg font-bold mb-3 border-b border-indigo-500 pb-2">
                LANGUAGES
              </h2>
              <ul className="space-y-1 text-sm">
                {[
                  "English (Fluent)",
                  "French (Fluent)",
                  "German (Basic)",
                  "Spanish (Intermediate)",
                ].map((language) => (
                  <li key={language} className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-indigo-300 rounded-full"></div>
                    {language}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column */}
          <div className="w-2/3 p-6 bg-gray-50">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-indigo-900">
                MICHAEL ANDERSON
              </h1>
              <h2 className="text-xl text-indigo-600">MARKETING MANAGER</h2>
            </div>

            {/* Profile */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3 text-indigo-900 border-b border-indigo-200 pb-2">
                PROFILE
              </h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                Experienced marketing professional with a proven track record in
                developing and executing comprehensive marketing strategies.
                Skilled in team leadership, brand management, and digital
                marketing initiatives. Demonstrates strong analytical abilities
                and a data-driven approach to optimizing marketing campaigns and
                achieving business objectives.
              </p>
            </div>

            {/* Work Experience */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3 text-indigo-900 border-b border-indigo-200 pb-2">
                WORK EXPERIENCE
              </h2>

              {/* Current Position */}
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <h3 className="text-lg font-bold text-indigo-800">
                    Digital Studio
                  </h3>
                  <span className="text-indigo-600 text-sm">
                    2030 - PRESENT
                  </span>
                </div>
                <div className="text-base text-indigo-700 mb-2">
                  Marketing Manager & Specialist
                </div>
                <ul className="space-y-1 text-sm">
                  {[
                    "Lead and execute comprehensive marketing strategies aligned with company objectives",
                    "Manage and mentor a team of marketing professionals",
                    "Monitor and optimize brand consistency across all channels",
                  ].map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-gray-700"
                    >
                      <div className="w-1 h-1 bg-indigo-400 rounded-full mt-2"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Previous Position */}
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <h3 className="text-lg font-bold text-indigo-800">
                    Creative Agency
                  </h3>
                  <span className="text-indigo-600 text-sm">2025 - 2029</span>
                </div>
                <div className="text-base text-indigo-700 mb-2">
                  Marketing Manager & Specialist
                </div>
                <ul className="space-y-1 text-sm">
                  {[
                    "Developed and managed marketing budgets and ROI optimization",
                    "Conducted market research and competitive analysis",
                    "Maintained brand consistency across marketing channels",
                  ].map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-gray-700"
                    >
                      <div className="w-1 h-1 bg-indigo-400 rounded-full mt-2"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* References */}
            <div>
              <h2 className="text-xl font-bold mb-3 text-indigo-900 border-b border-indigo-200 pb-2">
                REFERENCES
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    name: "Emily Parker",
                    position: "Digital Studio / CTO",
                    phone: "123-456-7890",
                    email: "emily@example.com",
                  },
                  {
                    name: "James Wilson",
                    position: "Creative Agency / CEO",
                    phone: "123-456-7890",
                    email: "james@example.com",
                  },
                ].map((reference, index) => (
                  <div key={index} className="text-sm">
                    <h3 className="font-bold text-indigo-800">
                      {reference.name}
                    </h3>
                    <div className="text-indigo-600">{reference.position}</div>
                    <div className="text-gray-700">
                      Phone: {reference.phone}
                    </div>
                    <div className="text-gray-700">
                      Email: {reference.email}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Resume;
