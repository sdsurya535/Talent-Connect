import React, { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  CheckCircle2,
  Calendar as CalendarIcon,
  Upload,
  X,
  FileText,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { format } from "date-fns";

// File Preview Component
const FilePreview = ({ file, onRemove }) => {
  const isImage = file.type.startsWith("image/");

  return (
    <div className="flex items-center gap-2 p-2 bg-muted rounded-md group">
      {isImage ? (
        <div className="h-10 w-10 rounded overflow-hidden">
          <img
            src={URL.createObjectURL(file)}
            alt={file.name}
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
          <FileText className="h-6 w-6" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{file.name}</p>
        <p className="text-xs text-muted-foreground">
          {(file.size / 1024 / 1024).toFixed(2)} MB
        </p>
      </div>
      <Button variant="ghost" size="sm" onClick={() => onRemove(file)}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

// File Upload Zone Component
const FileUploadZone = ({ files, setFiles }) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const removeFile = (fileToRemove) => {
    setFiles((prev) => prev.filter((file) => file !== fileToRemove));
  };

  return (
    <div className="space-y-4">
      <div
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
      >
        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm font-medium">
          Drop files here or click to upload
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Support images and documents up to 10MB
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.txt"
        />
      </div>
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <FilePreview key={index} file={file} onRemove={removeFile} />
          ))}
        </div>
      )}
    </div>
  );
};

// Ticket Display Component
const TicketDisplay = ({ ticket }) => {
  const statusVariants = {
    open: "default",
    "in-progress": "warning",
    resolved: "success",
    closed: "secondary",
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">{ticket.title}</CardTitle>
            <div className="flex gap-2 mt-2">
              <Badge
                variant={
                  ticket.priority === "high" ? "destructive" : "secondary"
                }
              >
                {ticket.priority}
              </Badge>
              <Badge variant="outline">{ticket.department}</Badge>
              <Badge variant={statusVariants[ticket.status]}>
                {ticket.status}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Due: {format(new Date(ticket.dueDate), "PPP")}
          </div>
          <div className="prose dark:prose-invert max-w-none">
            {ticket.description}
          </div>
          {ticket.files && ticket.files.length > 0 && (
            <div className="border rounded-md p-4">
              <h4 className="text-sm font-medium mb-2">
                Attachments ({ticket.files.length})
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {ticket.files.map((file, index) => (
                  <div key={index} className="text-sm text-muted-foreground">
                    {file.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Main Component
const TicketSystem = () => {
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    priority: "",
    description: "",
    email: "",
    dueDate: new Date(),
  });

  const [files, setFiles] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [tickets, setTickets] = useState([
    {
      id: 1,
      title: "Cloud Storage Access Issue",
      department: "Technical Support",
      priority: "high",
      status: "open",
      description: "Unable to access cloud storage. Getting timeout errors.",
      dueDate: "2025-02-10T10:00:00",
      files: [{ name: "error-screenshot.png" }],
    },
    {
      id: 2,
      title: "Billing Discrepancy",
      department: "Billing",
      priority: "medium",
      status: "in-progress",
      description: "Discrepancy found in the latest invoice.",
      dueDate: "2025-02-15T14:30:00",
      files: [{ name: "invoice-jan-2025.pdf" }],
    },
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.department ||
      !formData.priority ||
      !formData.description ||
      !formData.email
    ) {
      setError("Please fill in all required fields");
      return;
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setSubmitted(true);

    // Simulate API call
    const newTicket = {
      id: tickets.length + 1,
      ...formData,
      status: "open",
      files: files.map((file) => ({ name: file.name })),
    };

    setTickets((prev) => [...prev, newTicket]);

    // Reset form
    setTimeout(() => {
      setFormData({
        title: "",
        department: "",
        priority: "",
        description: "",
        email: "",
        dueDate: new Date(),
      });
      setFiles([]);
      setSubmitted(false);
    }, 2000);
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold">Help Desk Portal</h1>

      <Tabs defaultValue="new-ticket" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="new-ticket">New Ticket</TabsTrigger>
          <TabsTrigger value="my-tickets">My Tickets</TabsTrigger>
        </TabsList>

        <TabsContent value="new-ticket" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Submit a Support Ticket</CardTitle>
              <CardDescription>
                Please provide detailed information about your issue.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Ticket Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Brief description of the issue"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Contact Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) =>
                        setFormData({ ...formData, department: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">
                          Technical Support
                        </SelectItem>
                        <SelectItem value="billing">Billing</SelectItem>
                        <SelectItem value="general">General Inquiry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) =>
                        setFormData({ ...formData, priority: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.dueDate
                            ? format(formData.dueDate, "PPP")
                            : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.dueDate}
                          onSelect={(date) =>
                            setFormData({ ...formData, dueDate: date })
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Please provide detailed information about your issue..."
                    className="min-h-[150px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Attachments</Label>
                  <FileUploadZone files={files} setFiles={setFiles} />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {submitted && (
                  <Alert className="bg-green-50 text-green-800 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertTitle>Success!</AlertTitle>
                    <AlertDescription>
                      Your ticket has been submitted successfully. We'll get
                      back to you soon.
                    </AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full">
                  Submit Ticket
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-tickets">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">My Tickets</h2>
                <p className="text-muted-foreground">
                  View and manage your support tickets
                </p>
              </div>
            </div>
            {tickets.map((ticket) => (
              <TicketDisplay key={ticket.id} ticket={ticket} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TicketSystem;
