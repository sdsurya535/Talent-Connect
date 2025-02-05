import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, MoreHorizontal, Pencil, Trash2, Search } from "lucide-react";
import AddCompanyForm from "./AddCompanyForm";

// Dummy data
const initialCompanies = [
  {
    id: 1,
    name: "Tech Corp",
    address: "123 Tech Street, Silicon Valley",
    createdDate: "2024-01-15",
    updatedDate: "2024-01-20",
    status: "active",
  },
  // ... (previous dummy data)
];

const CompanyTable = () => {
  const [companies, setCompanies] = useState(initialCompanies);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);

  // Filter companies based on search and status
  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(search.toLowerCase()) ||
      company.address.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || company.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCompanies.length / pageSize);
  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Handle adding/editing company
  const handleSubmit = (formData) => {
    const currentDate = new Date().toISOString().split("T")[0];

    if (editingCompany) {
      setCompanies(
        companies.map((company) =>
          company.id === editingCompany.id
            ? {
                ...company,
                ...formData,
                updatedDate: currentDate,
              }
            : company
        )
      );
    } else {
      const newId = Math.max(...companies.map((c) => c.id)) + 1;
      setCompanies([
        ...companies,
        {
          ...formData,
          id: newId,
          createdDate: currentDate,
          updatedDate: currentDate,
        },
      ]);
    }

    setIsFormOpen(false);
    setEditingCompany(null);
  };

  // Handle delete company
  const handleDelete = (id) => {
    setCompanies(companies.filter((company) => company.id !== id));
  };

  // Handle edit company
  const handleEdit = (company) => {
    setEditingCompany(company);
    setIsFormOpen(true);
  };

  return (
    <Card className="bg-white dark:bg-gray-900 shadow-lg">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search companies..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 border-gray-200 focus:border-blue-500 focus-visible:outline-none
                            focus-visible:ring-0
                            focus-visible:ring-offset-0 dark:border-gray-800 dark:focus:border-blue-600"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger
                  className="w-full sm:w-40 border-blue-200 focus-visible:outline-none
                            focus-visible:ring-0
                            focus-visible:ring-offset-0 focus:border-blue-400 dark:border-blue-900 dark:focus:border-blue-700"
                >
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={() => setIsFormOpen(true)}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Company
            </Button>
          </div>

          {/* Table */}
          <div className="rounded-md border border-blue-200 dark:border-blue-900">
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-50 dark:bg-blue-950">
                  <TableHead className="w-16">SL No.</TableHead>
                  <TableHead>Company Name</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Address
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Created Date
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Updated Date
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-16">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCompanies.map((company, index) => (
                  <TableRow
                    key={company.id}
                    className="hover:bg-blue-50/50 dark:hover:bg-blue-950/50"
                  >
                    <TableCell>
                      {(currentPage - 1) * pageSize + index + 1}
                    </TableCell>
                    <TableCell className="font-medium">
                      {company.name}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {company.address}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {company.createdDate}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {company.updatedDate}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          company.status === "active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {company.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(company)}>
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(company.id)}
                            className="text-red-600 dark:text-red-400"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination and Page Size */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Rows per page:
              </span>
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => {
                  setPageSize(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-20 border-blue-200 focus:border-blue-400 dark:border-blue-900 dark:focus:border-blue-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 20, 50].map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="border-blue-200 hover:border-blue-400 dark:border-blue-900 dark:hover:border-blue-700"
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="border-blue-200 hover:border-blue-400 dark:border-blue-900 dark:hover:border-blue-700"
              >
                Next
              </Button>
            </div>
          </div>
        </div>

        {/* Add/Edit Company Form Dialog */}
        <AddCompanyForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingCompany(null);
          }}
          onSubmit={handleSubmit}
          editData={editingCompany}
        />
      </CardContent>
    </Card>
  );
};

export default CompanyTable;
