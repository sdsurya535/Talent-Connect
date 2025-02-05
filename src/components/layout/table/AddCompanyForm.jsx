import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { Plus } from "lucide-react";

import PropTypes from "prop-types";

const AddCompanyForm = ({ isOpen, onClose, onSubmit, editData }) => {
  const [formData, setFormData] = React.useState({
    name: "",
    address: "",
    status: "active",
  });

  React.useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name,
        address: editData.address,
        status: editData.status,
      });
    } else {
      setFormData({
        name: "",
        address: "",
        status: "active",
      });
    }
  }, [editData]);

  const handleSubmit = () => {
    onSubmit(formData);
    setFormData({ name: "", address: "", status: "active" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editData ? "Edit Company" : "Add New Company"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Company Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="border-blue-200 focus-visible:outline-none
                            focus-visible:ring-0
                            focus-visible:ring-offset-0 focus:border-2 focus:border-blue-400 dark:border-blue-900 dark:focus:border-blue-700"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="border-blue-200 focus-visible:outline-none focus-visible:ring-0
                            focus-visible:ring-offset-0 focus:border-blue-400 focus:border-2 dark:border-blue-900 dark:focus:border-blue-700"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger
                className="border-blue-200 focus-visible:outline-none
                            focus-visible:ring-0
                            focus-visible:ring-offset-0  focus:border-blue-400 dark:border-blue-900 dark:focus:border-blue-700"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            {editData ? "Update Company" : "Add Company"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
AddCompanyForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  editData: PropTypes.shape({
    name: PropTypes.string,
    address: PropTypes.string,
    status: PropTypes.string,
  }),
};

export default AddCompanyForm;
