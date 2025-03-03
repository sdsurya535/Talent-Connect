import { useState, useEffect } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, MoreHorizontal, Pencil, Trash2, Search } from "lucide-react";
import toast from "react-hot-toast";
import AddCompanyForm from "./AddCompanyForm";
import { useApi } from "@/hooks/useApi";

// Skeleton loader component for table rows
const TableRowSkeleton = () => (
  <TableRow>
    <TableCell>
      <Skeleton className="h-4 w-8" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-40" />
    </TableCell>
    <TableCell className="hidden md:table-cell">
      <Skeleton className="h-4 w-48" />
    </TableCell>
    <TableCell className="hidden sm:table-cell">
      <Skeleton className="h-4 w-24" />
    </TableCell>
    <TableCell className="hidden lg:table-cell">
      <Skeleton className="h-4 w-32" />
    </TableCell>
    <TableCell className="hidden lg:table-cell">
      <Skeleton className="h-4 w-32" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-16" />
    </TableCell>
  </TableRow>
);

const CompanyTable = () => {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const { sendRequest, loading } = useApi();

  // Format date helper function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Fetch companies
  const fetchCompanies = async () => {
    try {
      const response = await sendRequest({
        method: "GET",
        url: "/talent/connect/companies",
      });
      setCompanies(response.companyResponse || []);
    } catch (error) {
      toast.error("Failed to fetch companies");
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Filter companies based on search and status
  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.company_name.toLowerCase().includes(search.toLowerCase()) ||
      company.company_addr.toLowerCase().includes(search.toLowerCase());
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
  const handleSubmit = async (formData) => {
    const loadingToast = toast.loading(
      editingCompany ? "Updating company..." : "Creating company..."
    );

    try {
      if (editingCompany) {
        await sendRequest({
          method: "PUT",
          url: `/companies/${editingCompany.id}`,
          data: {
            companyName: formData.name,
            companyAddress: formData.address,
            status: formData.status,
          },
        });
        toast.success("Company updated successfully", { id: loadingToast });
      } else {
        await sendRequest({
          method: "POST",
          url: "/talent/connect/createCompany",
          data: {
            companyName: formData.name,
            companyAddress: formData.address,
          },
        });
        toast.success("Company created successfully", { id: loadingToast });
      }

      fetchCompanies();
      setIsFormOpen(false);
      setEditingCompany(null);
    } catch (error) {
      toast.error(error.message || "Failed to save company", {
        id: loadingToast,
      });
    }
  };

  // Handle edit company
  const handleEdit = (company) => {
    setEditingCompany(company);
    setIsFormOpen(true);
  };

  // Handle delete company
  const handleDelete = async (id) => {
    const loadingToast = toast.loading("Deleting company...");

    try {
      await sendRequest({
        method: "DELETE",
        url: `/companies/${id}`,
      });
      toast.success("Company deleted successfully", { id: loadingToast });
      fetchCompanies();
    } catch (error) {
      toast.error("Failed to delete company", { id: loadingToast });
    }
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
                  className="pl-8 border-gray-200 focus:border-blue-500"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
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
              className="w-full sm:w-auto"
              disabled={loading}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Company
            </Button>
          </div>

          {/* Table with horizontal scroll for small screens */}
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">SL No.</TableHead>
                  <TableHead>Company Name</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Address
                  </TableHead>

                  <TableHead className="hidden lg:table-cell">
                    Created At
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Updated At
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead className="w-16">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: pageSize }).map((_, index) => (
                    <TableRowSkeleton key={index} />
                  ))
                ) : paginatedCompanies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No companies found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedCompanies.map((company, index) => (
                    <TableRow key={company.id}>
                      <TableCell className="font-medium">
                        {(currentPage - 1) * pageSize + index + 1}
                      </TableCell>
                      <TableCell>{company?.company_name}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {company?.company_addr}
                      </TableCell>

                      <TableCell className="hidden lg:table-cell">
                        {formatDate(company.created_at)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {formatDate(company.update_at)}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            company.is_active === "1"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {company.is_active === "1" ? "Active" : "Inactive"}
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
                            {/* <DropdownMenuItem
                              onClick={() => handleEdit(company)}
                            >
                              <Pencil className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem> */}
                            <DropdownMenuSeparator />
                            {/* <DropdownMenuItem
                              onClick={() => handleDelete(company.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem> */}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Rows per page:</span>
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => {
                  setPageSize(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-20">
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
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>

        {isFormOpen && (
          <AddCompanyForm
            isOpen={isFormOpen}
            onClose={() => {
              setIsFormOpen(false);
              setEditingCompany(null);
            }}
            onSubmit={handleSubmit}
            editData={editingCompany}
            loading={loading}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default CompanyTable;
