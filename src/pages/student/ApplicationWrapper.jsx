// src/pages/student/ApplicationWrapper.jsx
import { lazy, Suspense } from "react";

import LoadingSpinner from "../../components/shared/LoadingSpinner";
import { ApplicationProvider } from "@/context/ApplicationContext";
const ApplicationSection = lazy(() => import("./ApplicationSection"));

const ApplicationWrapper = () => {
  return (
    <ApplicationProvider>
      <Suspense fallback={<LoadingSpinner />}>
        <ApplicationSection />
      </Suspense>
    </ApplicationProvider>
  );
};

export default ApplicationWrapper;
