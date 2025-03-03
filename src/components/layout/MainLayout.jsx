import { Suspense, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import LoadingSpinner from "../shared/LoadingSpinner";
import { Toaster } from "react-hot-toast";

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
    <>
      <div className="flex h-screen bg-[#F4F2EE] dark:bg-gray-900">
        {/* Progress Bar */}
        <div
          className={`fixed top-0 left-0 right-0 h-1 bg-blue-600 transform origin-left transition-transform duration-300 ease-in-out z-50 ${
            isLoading ? "scale-x-100" : "scale-x-0"
          }`}
        />

        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex flex-col flex-1">
          {/* Header */}
          <Header />

          {/* Main Content Area */}
          <main className="flex-1 overflow-auto">
            <Suspense fallback={<LoadingSpinner />}>
              <Outlet />
            </Suspense>
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </div>

      {/* Toast Container */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            style: {
              background: "#059669",
            },
          },
          error: {
            style: {
              background: "#DC2626",
            },
          },
        }}
      />

      {/* Scrollbar Styles */}
      <style>{`
        /* Progress Bar Animation */
        @keyframes progress {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(0.5); }
          100% { transform: scaleX(1); }
        }

        .scale-x-100 {
          animation: progress 0.5s ease-in-out;
        }

        /* Custom Scrollbar Styles */
        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: #E2E8F0;
        }

        ::-webkit-scrollbar-thumb {
          background-color: #A0AEC0;
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background-color: #718096;
        }

        /* Dark Mode Scrollbar */
        @media (prefers-color-scheme: dark) {
          ::-webkit-scrollbar-track {
            background: #2D3748;
          }

          ::-webkit-scrollbar-thumb {
            background-color: #718096;
          }

          ::-webkit-scrollbar-thumb:hover {
            background-color: #A0AEC0;
          }
        }
      `}</style>
    </>
  );
};

export default MainLayout;
