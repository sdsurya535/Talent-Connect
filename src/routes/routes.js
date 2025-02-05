import { lazy } from "react";
import { ROLES } from "../utils/roleService";
import MainLayout from "../components/layout/MainLayout";

// import ResumeViewer from "@/components/layout/resume/ResumeViewer";

const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const NotificationPage = lazy(() =>
  import("../pages/notificationpage/NotificationPage")
);
const ResumeViewer = lazy(() =>
  import("../components/layout/resume/ResumeViewer")
);
const TicketSystem = lazy(() => import("../pages/ticket/TicketSystem"));
const FeedbackForm = lazy(() => import("../pages/feedback/FeedbackForm"));
const CompanyManagement = lazy(() =>
  import("../pages/company/CompanyManagement")
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
    path: "/",
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
      // {
      //   path: "feedback",
      //   element: FeedbackForm,
      //   roles: [ROLES.ADMIN],
      // },
      // Add other protected routes here
    ],
  },
  {
    path: "/login",
    element: Login,
    private: false,
  },
  {
    path: "/register",
    element: RegistrationForm,
    private: false,
  },
  {
    path: "feedback",
    element: FeedbackForm,
    private: true,
  },
  {
    path: "/navigate_roles",
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
