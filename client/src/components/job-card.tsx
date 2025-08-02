import { useState } from "react";
import { Star, Clock, GraduationCap, Code, Bookmark, ExternalLink, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { JobWithCompany } from "@shared/schema";
import ReportModal from "./report-modal";

interface JobCardProps {
  job: JobWithCompany;
  isSaved?: boolean;
  userId?: string;
}

const trustIndicators = {
  verified: { label: "✅ Verified", className: "trust-indicator-verified" },
  suspicious: { label: "⚠️ Suspicious", className: "trust-indicator-suspicious" },
  pending: { label: "Pending Review", className: "trust-indicator-pending" },
  fake: { label: "❌ Fake", className: "trust-indicator-fake" },
};

const jobTypeLabels = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  remote: "Remote",
  internship: "Internship",
  hybrid: "Hybrid",
  "on-site": "On-site",
};

export default function JobCard({ job, isSaved = false, userId = "user1" }: JobCardProps) {
  const [showReportModal, setShowReportModal] = useState(false);
  const [isJobSaved, setIsJobSaved] = useState(isSaved);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const saveJobMutation = useMutation({
    mutationFn: async () => {
      if (isJobSaved) {
        return apiRequest("DELETE", "/api/saved-jobs", { userId, jobId: job.id });
      } else {
        return apiRequest("POST", "/api/saved-jobs", { userId, jobId: job.id });
      }
    },
    onSuccess: () => {
      setIsJobSaved(!isJobSaved);
      toast({
        title: isJobSaved ? "Job unsaved" : "Job saved",
        description: isJobSaved ? "Job removed from saved list" : "Job added to saved list",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/saved-jobs"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update saved job",
        variant: "destructive",
      });
    },
  });

  const trustIndicator = trustIndicators[job.status as keyof typeof trustIndicators] || trustIndicators.pending;
  const jobTypeLabel = jobTypeLabels[job.jobType as keyof typeof jobTypeLabels] || job.jobType;
  
  const getJobTypeColor = (type: string) => {
    switch (type) {
      case "remote": return "bg-blue-100 text-blue-800";
      case "hybrid": return "bg-purple-100 text-purple-800";
      case "on-site": return "bg-indigo-100 text-indigo-800";
      case "internship": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatPostedDate = (date: Date | null) => {
    if (!date) return "Unknown date";
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - new Date(date).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  return (
    <>
      <Card className={`hover:shadow-md transition-shadow ${job.status === "suspicious" ? "border-amber-200" : ""}`}>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-start space-x-4 flex-1">
              {/* Company logo */}
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <i className={`${job.company.logo} text-xl`} style={{ color: job.company.logo?.includes('google') ? '#4285f4' : job.company.logo?.includes('microsoft') ? '#0078d4' : '#666' }}></i>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2 flex-wrap">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{job.title}</h3>
                  <Badge className={trustIndicator.className}>
                    {trustIndicator.label}
                  </Badge>
                  <Badge className={getJobTypeColor(job.jobType)}>
                    {jobTypeLabel}
                  </Badge>
                </div>
                
                <div className="flex items-center text-sm text-gray-600 space-x-4 mb-2 flex-wrap">
                  <span>{job.company.name}</span>
                  <span>{job.location}</span>
                  <span>{formatPostedDate(job.postedAt)}</span>
                </div>
                
                <p className="text-gray-700 text-sm leading-relaxed line-clamp-2 mb-3">
                  {job.description}
                </p>

                {job.status === "suspicious" && (
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-3">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="text-amber-500 flex-shrink-0 mt-0.5" size={16} />
                      <div>
                        <p className="text-sm text-amber-800 font-medium">Potential Red Flags Detected</p>
                        <ul className="text-xs text-amber-700 mt-1 space-y-1">
                          <li>• Unusually high salary for experience level</li>
                          <li>• Requests immediate contact outside platform</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-semibold text-gray-900">{job.salary}</span>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      {job.company.rating && (
                        <>
                          <Star className="text-yellow-400 fill-current" size={16} />
                          <span>{job.company.rating}</span>
                          <span>•</span>
                        </>
                      )}
                      <span>Trust Score: </span>
                      <span className={`font-medium ${
                        (job.company.trustScore || 0) >= 90 ? "text-green-600" :
                        (job.company.trustScore || 0) >= 70 ? "text-amber-600" : "text-red-600"
                      }`}>
                        {job.company.trustScore || 0}%
                      </span>
                      {(job.reportCount || 0) > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-red-600">{job.reportCount || 0} reports</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
              {job.status === "suspicious" ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowReportModal(true)}
                  className="text-amber-700 border-amber-300 hover:bg-amber-50"
                >
                  Report Job
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => saveJobMutation.mutate()}
                  disabled={saveJobMutation.isPending}
                  className={isJobSaved ? "text-red-500" : "text-gray-400 hover:text-gray-600"}
                >
                  <Bookmark className={isJobSaved ? "fill-current" : ""} size={20} />
                </Button>
              )}
              
              <Button
                disabled={job.status === "suspicious"}
                className={job.status === "suspicious" ? "bg-gray-300 text-gray-600 cursor-not-allowed" : ""}
              >
                {job.status === "suspicious" ? "View Details" : "Apply Now"}
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-gray-600 pt-4 border-t border-gray-100 flex-wrap">
            {job.skills && job.skills.length > 0 && (
              <span className="flex items-center">
                <Code className="mr-1" size={14} />
                {job.skills.join(", ")}
              </span>
            )}
            <span className="flex items-center">
              <Clock className="mr-1" size={14} />
              {jobTypeLabel}
            </span>
            <span className="flex items-center">
              <GraduationCap className="mr-1" size={14} />
              {job.experienceLevel.charAt(0).toUpperCase() + job.experienceLevel.slice(1)} level
            </span>
            {job.externalUrl && (
              <a
                href={job.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-primary hover:underline"
              >
                <ExternalLink className="mr-1" size={14} />
                View Original
              </a>
            )}
          </div>
        </CardContent>
      </Card>

      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        jobId={job.id}
        jobTitle={job.title}
        companyName={job.company.name}
        userId={userId}
      />
    </>
  );
}
