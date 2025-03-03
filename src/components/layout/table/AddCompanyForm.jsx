import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";

const AddCompanyForm = ({ isOpen, onClose, onSubmit, editData, loading }) => {
  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      name: "",
      address: "",
      status: "active",
    },
  });

  useEffect(() => {
    if (editData) {
      setValue("name", editData.company_name || "");
      setValue("address", editData.company_addr || "");
      setValue("status", editData.is_active === "1" ? "active" : "inactive");
    } else {
      reset();
    }
  }, [editData, setValue, reset]);

  const handleFormSubmit = async (data) => {
    await onSubmit(data);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editData ? "Edit Company" : "Add New Company"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Company Name</Label>
            <Input
              id="name"
              {...register("name", { required: true })}
              placeholder="Enter company name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              {...register("address", { required: true })}
              placeholder="Enter company address"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : editData ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCompanyForm;
