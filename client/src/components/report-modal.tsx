import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CloudUpload } from "lucide-react";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle: string;
  companyName: string;
  userId: string;
}

const reportReasons = [
  "Suspected fake company",
  "Requests payment or personal info",
  "Unrealistic salary/benefits",
  "Poor communication/grammar",
  "Requests immediate contact outside platform",
  "Other",
];

export default function ReportModal({
  isOpen,
  onClose,
  jobId,
  jobTitle,
  companyName,
  userId,
}: ReportModalProps) {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const reportMutation = useMutation({
    mutationFn: async (data: { jobId: string; reporterId: string; reason: string; description?: string }) => {
      return apiRequest("POST", "/api/job-reports", data);
    },
    onSuccess: () => {
      toast({
        title: "Report submitted",
        description: "Thank you for helping keep our platform safe. We'll review your report.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      onClose();
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setReason("");
    setDescription("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason) {
      toast({
        title: "Error",
        description: "Please select a reason for reporting.",
        variant: "destructive",
      });
      return;
    }

    reportMutation.mutate({
      jobId,
      reporterId: userId,
      reason,
      description: description || undefined,
    });
  };

  const handleClose = () => {
    if (!reportMutation.isPending) {
      onClose();
      resetForm();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Report Suspicious Job</DialogTitle>
        </DialogHeader>
        
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-900">{jobTitle}</p>
          <p className="text-sm text-gray-600">{companyName}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="reason">Reason for reporting</Label>
            <Select value={reason} onValueChange={setReason} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {reportReasons.map((reasonOption) => (
                  <SelectItem key={reasonOption} value={reasonOption}>
                    {reasonOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="description">Additional details (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Provide any additional information that might help us investigate..."
            />
          </div>
          
          <div>
            <Label>Evidence (optional)</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <CloudUpload className="mx-auto text-gray-400 mb-2" size={24} />
              <p className="text-sm text-gray-600">Upload screenshots or documents</p>
              <Button type="button" variant="ghost" className="mt-2 text-primary text-sm font-medium">
                Choose Files
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleClose}
              disabled={reportMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-red-600 hover:bg-red-700"
              disabled={reportMutation.isPending}
            >
              {reportMutation.isPending ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
