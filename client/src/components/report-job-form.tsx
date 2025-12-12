import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, AlertCircle } from "lucide-react";

const REPORT_TYPES = ["Job", "Course"] as const;
const REPORT_REASONS = [
  "Suspicious or fake",
  "Inaccurate information",
  "Offensive content",
  "Spam or scam",
  "Other"
] as const;

interface ReportJobFormProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export default function ReportJobForm({ isOpen, onClose, userId }: ReportJobFormProps) {
  console.log('ReportJobForm rendered with isOpen:', isOpen);
  const [formData, setFormData] = useState({
    type: "",
    title: "",
    company: "",
    url: "",
    reason: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const reportMutation = useMutation({
    mutationFn: async (data: typeof formData & { reporterId: string }) => {
      return apiRequest("POST", "/api/reports", data);
    },
    onSuccess: () => {
      toast({
        title: "Report submitted",
        description: "Thank you for your report. We'll review it shortly.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
      handleClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    },
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.type) newErrors.type = "Please select a type";
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.reason) newErrors.reason = "Please select a reason";
    if (!formData.description) newErrors.description = "Please provide details";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    reportMutation.mutate({
      ...formData,
      reporterId: userId,
    });
  };

  const handleClose = () => {
    if (!reportMutation.isPending) {
      setFormData({
        type: "",
        title: "",
        company: "",
        url: "",
        reason: "",
        description: "",
      });
      setErrors({});
      onClose();
    }
  };

  // Debug log to check if component renders
  console.log('Rendering ReportJobForm with isOpen:', isOpen, 'userId:', userId);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => {
      console.log('Dialog open state changed to:', open);
      if (!open) {
        handleClose();
      }
    }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 sm:rounded-lg">
          <div className="flex flex-col space-y-1.5 text-center sm:text-left">
            <Dialog.Title className="text-xl font-bold text-gray-900">Report a Job/Course</Dialog.Title>
            <p className="text-sm text-gray-500">
              Help us keep the platform safe by reporting suspicious or inappropriate listings.
            </p>
          </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="type">What are you reporting? *</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => handleChange("type", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {REPORT_TYPES.map((type) => (
                  <SelectItem key={type} value={type.toLowerCase()}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.type}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="title">
              {formData.type === "course" ? "Course Title *" : "Job Title *"}
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder={formData.type === "course" ? "e.g. Advanced React Course" : "e.g. Senior Frontend Developer"}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.title}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="company">
              {formData.type === "course" ? "Provider/Instructor" : "Company Name"}
            </Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => handleChange("company", e.target.value)}
              placeholder={formData.type === "course" ? "e.g. Coursera, Udemy, etc." : "Company name"}
            />
          </div>

          <div>
            <Label htmlFor="url">URL (if available)</Label>
            <Input
              id="url"
              type="url"
              value={formData.url}
              onChange={(e) => handleChange("url", e.target.value)}
              placeholder="https://example.com/job-listing"
            />
          </div>

          <div>
            <Label htmlFor="reason">Reason for reporting *</Label>
            <Select 
              value={formData.reason} 
              onValueChange={(value) => handleChange("reason", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {REPORT_REASONS.map((reason) => (
                  <SelectItem key={reason} value={reason.toLowerCase()}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.reason && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.reason}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description">
              Please provide details about your concern *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={4}
              placeholder="Please describe the issue in detail..."
              className="min-h-[120px]"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.description}
              </p>
            )}
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={reportMutation.isPending}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 px-6"
              disabled={reportMutation.isPending}
            >
              {reportMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Report"
              )}
            </Button>
          </div>
        </form>
          <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
