import CompanyTable from "@/components/layout/table/CompanyTable";
import { Card } from "@/components/ui/card";
import { Building2 } from "lucide-react";

const CompanyManagement = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Building2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Company Management
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Manage your companies and their information
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <Card className="p-4 bg-white dark:bg-gray-800 border-blue-100 dark:border-blue-900">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Companies
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                    24
                  </h3>
                </div>
                <div className="p-2 bg-blue-50 dark:bg-blue-900/50 rounded-lg">
                  <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600 dark:text-green-400">
                  ↑ 12% from last month
                </span>
              </div>
            </Card>

            <Card className="p-4 bg-white dark:bg-gray-800 border-green-100 dark:border-green-900">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Active Companies
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                    18
                  </h3>
                </div>
                <div className="p-2 bg-green-50 dark:bg-green-900/50 rounded-lg">
                  <div className="h-5 w-5 rounded-full bg-green-500 dark:bg-green-400" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600 dark:text-green-400">
                  75% of total
                </span>
              </div>
            </Card>

            <Card className="p-4 bg-white dark:bg-gray-800 border-red-100 dark:border-red-900">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Inactive Companies
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                    6
                  </h3>
                </div>
                <div className="p-2 bg-red-50 dark:bg-red-900/50 rounded-lg">
                  <div className="h-5 w-5 rounded-full bg-red-500 dark:bg-red-400" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-red-600 dark:text-red-400">
                  25% of total
                </span>
              </div>
            </Card>

            <Card className="p-4 bg-white dark:bg-gray-800 border-purple-100 dark:border-purple-900">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    New This Month
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                    3
                  </h3>
                </div>
                <div className="p-2 bg-purple-50 dark:bg-purple-900/50 rounded-lg">
                  <div className="h-5 w-5 rounded-full bg-purple-500 dark:bg-purple-400" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-purple-600 dark:text-purple-400">
                  Added recently
                </span>
              </div>
            </Card>
          </div>
        </div>

        {/* Company Table Section */}
        <div className="mt-8">
          <CompanyTable />
        </div>
      </div>
    </div>
  );
};

export default CompanyManagement;
