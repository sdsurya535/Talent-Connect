import { Suspense, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import LoadingSpinner from "../shared/LoadingSpinner";

const MainLayout = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  // Handle route changes and loading state
  useEffect(() => {
    setIsLoading(true);
    const mainContent = document.querySelector(".main-content");
    if (mainContent) {
      mainContent.scrollTop = 0;
    }

    // Simulate route transition time
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* TopBar Progress Indicator */}
      <div
        className={`fixed top-0 left-0 right-0 h-1 bg-blue-600 transform origin-left transition-transform duration-300 ease-in-out z-50 ${
          isLoading ? "scale-x-100" : "scale-x-0"
        }`}
      />

      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 main-content">
          <div className="container p-6 mx-auto scrollbar-custom">
          
            <Suspense fallback={<LoadingSpinner />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
        <Footer />
      </div>

      {/* Add global styles for custom scrollbar and progress indicator */}
      <style>{`
        /* Progress Indicator Animation */
        @keyframes progress {
          0% {
            transform: scaleX(0);
          }
          50% {
            transform: scaleX(0.5);
          }
          100% {
            transform: scaleX(1);
          }
        }

        .scale-x-100 {
          animation: progress 0.5s ease-in-out;
        }

        /* Scrollbar Styles */
        .scrollbar-custom {
          scrollbar-width: thin;
          scrollbar-color: #4b5563 #1f2937;
        }

        .scrollbar-custom::-webkit-scrollbar {
          width: 8px;
        }

        .scrollbar-custom::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 4px;
        }

        .scrollbar-custom::-webkit-scrollbar-thumb {
          background-color: #4b5563;
          border-radius: 4px;
          border: 2px solid #1f2937;
        }

        .scrollbar-custom::-webkit-scrollbar-thumb:hover {
          background-color: #6b7280;
        }

        /* For Firefox */
        * {
          scrollbar-width: thin;
          scrollbar-color: #4b5563 #1f2937;
        }

        /* For light mode */
        @media (prefers-color-scheme: light) {
          .scrollbar-custom {
            scrollbar-color: #9ca3af #e5e7eb;
          }

          .scrollbar-custom::-webkit-scrollbar-track {
            background: #e5e7eb;
          }

          .scrollbar-custom::-webkit-scrollbar-thumb {
            background-color: #9ca3af;
            border: 2px solid #e5e7eb;
          }

          .scrollbar-custom::-webkit-scrollbar-thumb:hover {
            background-color: #6b7280;
          }
        }
      `}</style>
    </div>
  );
};

export default MainLayout;
