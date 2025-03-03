import { lazy } from "react";
import { ROLES } from "../utils/roleService";
import MainLayout from "../components/layout/MainLayout";
import JobPostingForm from "@/pages/jobdescription/newjobdescription/JobPostingForm";

// import ResumeViewer from "@/components/layout/resume/ResumeViewer";
const JobListings = lazy(() => import("../pages/jobdescription/JobListings"));
const Scheduler = lazy(() => import("../pages/scheduler/Scheduler"));
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const JobApplicants = lazy(() =>
  import("../pages/jobapplicants/JobApplicants")
);
const ResumeSearch = lazy(() => import("../pages/resumesearch/ResumeSearch"));
const JobDashboard = lazy(() => import("../pages/jobdashboard/JobDashboard"));
const DashboardJobs = lazy(() =>
  import("../pages/jobdescription/managejobs/JobsPage")
);
const ResumeViewer = lazy(() => import("../pages/resume/ResumeViewer"));
const NotificationPage = lazy(() =>
  import("../pages/notificationpage/NotificationPage")
);

const TicketSystem = lazy(() => import("../pages/ticket/TicketSystem"));
const FeedbackForm = lazy(() => import("../pages/feedback/FeedbackForm"));
const CompanyManagement = lazy(() =>
  import("../pages/company/CompanyManagement")
);
const JobDescriptionForm = lazy(() =>
  import("../pages/jobdescription/JobDescriptionForm")
);
const RegistrationForm = lazy(() => import("../pages/auth/Registration"));
const RoleBasedNavigation = lazy(() => "../pages/roles/RolesBasedNavigation");

const Login = lazy(() => import("../pages/auth/Login"));
// const Register = lazy(() => import("../pages/auth/Register"));
const NotFound = lazy(() => import("../pages/errors/NotFound"));

const ApplicationWrapper = lazy(() =>
  import("../pages/student/ApplicationWrapper")
);

export const routes = [
  {
    path: "/admin",
    element: MainLayout,
    private: true,
    children: [
      {
        path: "dashboard",
        element: Dashboard,
        roles: [ROLES.ADMIN, ROLES.USER, ROLES.GUEST],
      },
      {
        path: "notifications",
        element: NotificationPage,
        roles: [ROLES.ADMIN],
      },
      {
        path: "company",
        element: CompanyManagement,
        roles: [ROLES.ADMIN],
      },
      {
        path: "student",
        element: ApplicationWrapper,
        roles: [ROLES.ADMIN],
      },
      {
        path: "resume",
        element: ResumeViewer,
        roles: [ROLES.ADMIN],
      },
      {
        path: "ticket",
        element: TicketSystem,
        roles: [ROLES.ADMIN],
      },
      {
        path: "job_description",
        element: JobListings,
        roles: [ROLES.ADMIN],
      },
      {
        path: "create_job_description",
        element: JobDescriptionForm,
        roles: [ROLES.ADMIN],
      },
      {
        path: "scheduler",
        element: Scheduler,
        roles: [ROLES.ADMIN],
      },
      {
        path: "job-posting",
        element: JobPostingForm,
        roles: [ROLES.ADMIN],
      },
      {
        path: "job-posting/:jobId",
        element: JobPostingForm,
        roles: [ROLES.ADMIN],
      },
      {
        path: "job-page",
        element: DashboardJobs,
        roles: [ROLES.ADMIN],
      },
      {
        path: "job-applicants/:id",
        element: JobApplicants,
        roles: [ROLES.ADMIN],
      },
      {
        path: "job-dashboard",
        element: JobDashboard,
        roles: [ROLES.ADMIN],
      },
      {
        path: "resume-search",
        element: ResumeSearch,
        roles: [ROLES.ADMIN],
      },
      // {
      //   path: "feedback",
      //   element: FeedbackForm,
      //   roles: [ROLES.ADMIN],
      // },
      // Add other protected routes here
    ],
  },
  {
    path: "/admin/login",
    element: Login,
    private: false,
  },
  {
    path: "/admin/resume/:userId",
    element: ResumeViewer,
    private: false,
  },
  {
    path: "/admin/register",
    element: RegistrationForm,
    private: false,
  },
  {
    path: "/admin/feedback",
    element: FeedbackForm,
    private: true,
  },
  {
    path: "/admin/navigate_roles",
    element: RoleBasedNavigation,
    private: true,
  },

  //   {
  //     path: "/register",
  //     element: Register,
  //     private: false,
  //   },
  {
    path: "*",
    element: NotFound,
    private: false,
  },
];
