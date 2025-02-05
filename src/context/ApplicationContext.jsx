import { useStudentApplications } from "@/hooks/useStudentApplication";
import { createContext, useContext } from "react";


const ApplicationContext = createContext();

export const ApplicationProvider = ({ children }) => {
  const applicationData = useStudentApplications();

  return (
    <ApplicationContext.Provider value={applicationData}>
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplicationContext = () => {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error(
      "useApplicationContext must be used within an ApplicationProvider"
    );
  }
  return context;
};
