// formSections.jsx
export const formSections = [
  {
    id: 1,
    label: "Review job details",
    key: "basicDetails",
    required: true,
    fields: [
      { name: "jobTitle", type: "text", required: true },
      { name: "company", type: "text", required: true },
      { name: "workplaceType", type: "select", required: true },
      { name: "jobLocation", type: "text", required: true },
      { name: "jobType", type: "select", required: true },
      { name: "package", type: "text", required: true },
      { name: "openings", type: "number", required: true },
      { name: "registrationStart", type: "date", required: true },
      { name: "registrationEnd", type: "date", required: true },
    ],
  },
  {
    id: 2,
    label: "Review job description",
    key: "description",
    required: true,
    fields: [{ name: "description", type: "richText", required: true }],
  },

  {
    id: 4,
    label: "Review filters",
    key: "filters",
    required: false,
    fields: [{ name: "filters", type: "filterDetails", required: false }],
  },
  {
    id: 5,
    label: "Review screening questions",
    key: "screeningQuestions",
    required: false,
    fields: [{ name: "screeningQuestions", type: "array", required: false }],
  },
  //   {
  //     id: 4,
  //     label: "Review skills",
  //     key: "skills",
  //     required: true,
  //     fields: [{ name: "skills", type: "skillset", required: true }],
  //   },
  //   {
  //     id: 5,
  //     label: "Review requirements",
  //     key: "requirements",
  //     required: false,
  //     fields: [
  //       { name: "requirements", type: "richText", required: false },
  //       { name: "qualifications", type: "multientry", required: false },
  //     ],
  //   },
  //   {
  //     id: 6,
  //     label: "Review benefits",
  //     key: "benefits",
  //     required: false,
  //     fields: [
  //       { name: "benefits", type: "multientry", required: false },
  //       { name: "salary", type: "text", required: false },
  //     ],
  //   },
];

export const getInitialFormState = () => {
  return {
    // Basic Details
    jdTitle: "",
    company: "EduSkills Foundation",
    companyId: "",
    workplaceType: "On-site",
    companyLogo: "",
    jdLocation: "",
    jobType: "Full-time",
    package: "",
    noOfOpening: "",
    registrationStart: "",
    registrationEnd: "",

    // Skills
    skills: [],

    screeningQuestions: [],

    // Custom Fields
    customFields: [],

    // Description
    description: "",

    // Requirements
    requirements: "",
    qualifications: [""],

    // Benefits
    benefits: [""],
    salary: "",

    // Filters
    // Filters
    filters: {
      // Basic Filters
      states: [],
      ugPrograms: [],
      ugPassoutYears: [],
      pgPrograms: [],
      pgPassoutYears: [],
      isComplete: [],
      institutes: [],

      // Advanced Filters
      domains: [],

      tenth: "",
      twelfth: "",
      btech: "",
    },
  };
};

export default { formSections, getInitialFormState };
