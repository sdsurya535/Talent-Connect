import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserRoundCheck, Download, Search } from "lucide-react";

const ApplicationStats = ({ filteredApplications, filtrationCount }) => {
  return (
    <div className="w-full flex flex-col sm:flex-row gap-4 mb-4">
      <div className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Applications
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {filteredApplications}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserRoundCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Eligible Candidates
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {filtrationCount}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActionButtons = ({ onExport, onRefresh, loading }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-4">
      <Button
        variant="outline"
        size="sm"
        onClick={onExport}
        className="flex items-center justify-center gap-2"
      >
        <Download className="w-4 h-4" />
        Export CSV
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onRefresh}
        disabled={loading}
        className="flex items-center justify-center gap-2"
      >
        <svg
          className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        Refresh
      </Button>
    </div>
  );
};

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder="Search by email..."
        className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export const StudentListHeader = ({
  filteredApplications,
  filtrationCount,
  onExport,
  onRefresh,
  loading,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <CardHeader className="border-b border-gray-200 dark:border-gray-700 p-4">
      <ApplicationStats
        filteredApplications={filteredApplications}
        filtrationCount={filtrationCount}
      />

      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
        <div className="flex-1">
          <SearchBar value={searchQuery} onChange={onSearchChange} />
        </div>
        <div className="flex justify-end">
          <ActionButtons
            onExport={onExport}
            onRefresh={onRefresh}
            loading={loading}
          />
        </div>
      </div>
    </CardHeader>
  );
};

export default StudentListHeader;
