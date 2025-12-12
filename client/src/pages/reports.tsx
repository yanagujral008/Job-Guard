import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth-context";
import ReportJobForm from "@/components/report-job-form";
import { 
  AlertTriangle, 
  Shield, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Calendar,
  Building,
  MapPin,
  DollarSign,
  User,
  FileText,
  Plus
} from "lucide-react";

export default function Reports() {
  // State hooks
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [reasonFilter, setReasonFilter] = useState<string>("");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  
  // Auth hook
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  
  // Data fetching hooks - must be called unconditionally
  const { data: reports = [], isLoading: reportsLoading } = useQuery({
    queryKey: ["/api/job-reports"],
    enabled: !authLoading, // Only fetch if auth is loaded
  }) as { data: any[], isLoading: boolean };

  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ["/api/jobs"],
    enabled: !authLoading, // Only fetch if auth is loaded
  }) as { data: any[], isLoading: boolean };

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
    enabled: !authLoading, // Only fetch if auth is loaded
  }) as { data: any };
  
  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0B0C10] text-white">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  // Get reported jobs with details
  const reportedJobs = reports.map((report: any) => {
    const job = jobs.find((j: any) => j.id === report.jobId);
    return job ? { ...job, report } : null;
  }).filter(Boolean);

  // Filter reported jobs
  const filteredReports = reportedJobs.filter((reportedJob: any) => {
    const matchesSearch = !searchTerm || 
      reportedJob.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reportedJob.company?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || statusFilter === "all" || reportedJob.report.status === statusFilter;
    const matchesReason = !reasonFilter || reasonFilter === "all" || reportedJob.report.reason === reasonFilter;
    
    return matchesSearch && matchesStatus && matchesReason;
  });

  // Get suspicious and fake jobs
  const suspiciousJobs = jobs.filter((job: any) => job.status === "suspicious" || job.status === "fake");
  
  // Report reasons for filtering
  const reportReasons = [
    "Suspected fake company",
    "Requests payment or personal info", 
    "Unrealistic salary/benefits",
    "Poor communication/grammar",
    "Requests immediate contact outside platform",
    "Other"
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Under Review</Badge>;
      case "verified":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Confirmed Fake</Badge>;
      case "dismissed":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Dismissed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getJobStatusColor = (status: string) => {
    switch (status) {
      case "suspicious": return "border-amber-500/30 bg-amber-500/10";
      case "fake": return "border-red-500/30 bg-red-500/10";
      default: return "border-[#2E3A47] bg-[#1F2833]";
    }
  };

  const getJobStatusBadge = (status: string) => {
    switch (status) {
      case "suspicious": return <Badge className="bg-amber-100 text-amber-800">⚠️ Suspicious</Badge>;
      case "fake": return <Badge className="bg-red-100 text-red-800">❌ Confirmed Fake</Badge>;
      default: return <Badge variant="secondary">Under Review</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0C10]">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Job Reports</h1>
            <p className="mt-2 text-sm text-[#C5C6C7]">Review and manage reported job listings</p>
          </div>
          <Button 
            className="bg-[#00AEEF] hover:bg-[#0095D6] text-white"
            onClick={() => {
              console.log('Button clicked, isAuthenticated:', isAuthenticated, 'User:', user);
              if (isAuthenticated) {
                setIsReportModalOpen(true);
              } else {
                window.location.href = '/login?redirect=/reports';
              }
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            {isAuthenticated ? 'Report a Job/Course' : 'Sign in to Report'}
          </Button>
        </div>

        {/* Alert Banner */}
        <Alert className="mb-6 border-amber-500/30 bg-amber-500/10">
          <AlertTriangle className="h-4 w-4 text-amber-400" />
          <AlertDescription className="text-amber-200">
            <strong>Stay Safe:</strong> Always verify job postings independently. Never pay for job applications or provide sensitive personal information upfront.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="reports" className="space-y-6">
          <TabsList className="bg-[#1F2833] border border-[#2E3A47] p-1">
            <TabsTrigger 
              value="reports"
              className="data-[state=active]:bg-[#00AEEF] data-[state=active]:text-white data-[state=inactive]:text-[#C5C6C7]"
            >
              Reported Jobs
            </TabsTrigger>
            <TabsTrigger 
              value="suspicious"
              className="data-[state=active]:bg-[#00AEEF] data-[state=active]:text-white data-[state=inactive]:text-[#C5C6C7]"
            >
              Suspicious Jobs
            </TabsTrigger>
            <TabsTrigger 
              value="stats"
              className="data-[state=active]:bg-[#00AEEF] data-[state=active]:text-white data-[state=inactive]:text-[#C5C6C7]"
            >
              Statistics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="space-y-6">
            <Card className="bg-[#1F2833] border-[#2E3A47]">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <CardTitle className="text-lg text-white">Reported Job Listings</CardTitle>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Input
                      placeholder="Search reports..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="md:w-64 bg-[#0B0C10] border-[#2E3A47] text-white placeholder-[#5D6B7E] focus:border-[#00AEEF] focus:ring-1 focus:ring-[#00AEEF]/50"
                    />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full md:w-40 bg-[#0B0C10] border-[#2E3A47] text-white hover:border-[#00AEEF]/50 focus:ring-1 focus:ring-[#00AEEF]/50">
                        <SelectValue placeholder="Status" className="text-left" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1F2833] border-[#2E3A47] text-white">
                        <SelectItem value="all" className="hover:bg-[#00AEEF]/10 focus:bg-[#00AEEF]/20">All Statuses</SelectItem>
                        <SelectItem value="pending" className="hover:bg-[#00AEEF]/10 focus:bg-[#00AEEF]/20">Under Review</SelectItem>
                        <SelectItem value="verified" className="hover:bg-[#00AEEF]/10 focus:bg-[#00AEEF]/20">Confirmed Fake</SelectItem>
                        <SelectItem value="dismissed" className="hover:bg-[#00AEEF]/10 focus:bg-[#00AEEF]/20">Dismissed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={reasonFilter} onValueChange={setReasonFilter}>
                      <SelectTrigger className="w-full md:w-64 bg-[#0B0C10] border-[#2E3A47] text-white hover:border-[#00AEEF]/50 focus:ring-1 focus:ring-[#00AEEF]/50">
                        <SelectValue placeholder="Report Reason" className="text-left" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1F2833] border-[#2E3A47] text-white">
                        <SelectItem value="all" className="hover:bg-[#00AEEF]/10 focus:bg-[#00AEEF]/20">All Reasons</SelectItem>
                        {reportReasons.map((reason) => (
                          <SelectItem 
                            key={reason} 
                            value={reason}
                            className="hover:bg-[#00AEEF]/10 focus:bg-[#00AEEF]/20"
                          >
                            {reason}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>

              {/* Reports List */}
              {reportsLoading || jobsLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Card key={i} className="bg-[#1F2833] border-[#2E3A47]">
                      <CardContent className="p-6">
                        <div className="flex space-x-4">
                          <Skeleton className="w-12 h-12 rounded-lg" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-6 w-1/3" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-16 w-full" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredReports.length === 0 ? (
                    <div className="text-center p-12">
                      <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p>No reported jobs found.</p>
                    </div>
                  ) : (
                    filteredReports.map((reportedJob: any) => (
                      <Card key={reportedJob.report.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex items-start space-x-4 flex-1">
                              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Building className="h-6 w-6 text-gray-400" />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">{reportedJob.title}</h3>
                                <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                                  <p>{reportedJob.company?.name || 'No company'}</p>
                                  {reportedJob.location && (
                                    <span className="flex items-center">
                                      <MapPin className="w-4 h-4 mr-1" />
                                      {reportedJob.location}
                                    </span>
                                  )}
                                  <span className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    Reported {formatDate(reportedJob.report.reportedAt)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" className="border-[#2E3A47] text-[#C5C6C7] hover:bg-[#00AEEF]/10 hover:border-[#00AEEF]/50 hover:text-white">
                              <Eye className="h-4 w-4 mr-2" /> View
                            </Button>
                          </div>
                          
                          <div className="mt-4 space-y-2">
                            <div className="bg-red-50 border border-red-200 rounded-md p-3">
                              <div className="flex items-start space-x-2">
                                <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
                                <div>
                                  <p className="text-sm text-red-800 font-medium">
                                    Report Reason: {reportedJob.report.reason}
                                  </p>
                                  {reportedJob.report.description && (
                                    <p className="text-sm text-red-700 mt-1">
                                      {reportedJob.report.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center text-sm text-gray-600 space-x-4">
                              <p className="flex items-center">
                                <DollarSign className="w-4 h-4 mr-1 text-gray-400" />
                                {reportedJob.salary || 'Not specified'}
                              </p>
                              <p className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                                {reportedJob.location || 'Remote'}
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="mt-4 border-[#2E3A47] text-[#C5C6C7] hover:bg-[#00AEEF]/10 hover:border-[#00AEEF]/50 hover:text-white">
                            <Eye className="h-4 w-4 mr-2" /> View Details
                          </Button>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="suspicious" className="space-y-6">
            <Card className="bg-[#1F2833] border-[#2E3A47]">
              <CardHeader>
                <CardTitle className="text-lg text-white">Wall of Shame - Confirmed Fake Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  These job postings have been confirmed as fake by our community and moderation team. 
                  Stay vigilant and report suspicious activities.
                </p>

                {suspiciousJobs.length === 0 ? (
                  <div className="text-center py-8">
                    <Shield className="mx-auto h-12 w-12 text-green-400 mb-4" />
                    <p className="text-gray-500">Great news! No confirmed fake jobs at the moment.</p>
                    <p className="text-sm text-gray-400 mt-2">Our community is doing an excellent job keeping the platform safe.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {suspiciousJobs.map((job: any) => {
                      const company = jobs.find((j: any) => j.companyId === job.companyId)?.company;
                      
                      return (
                        <Card key={job.id} className={`${getJobStatusColor(job.status)}`}>
                          <div className="mt-4 pt-4 border-t border-[#2E3A47]">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-x-2">
                                  <span className="text-sm font-medium text-[#C5C6C7]">Reported:</span>
                                  <span className="text-sm text-[#8F9BB3]">{formatDate(reportedJob.report.date)}</span>
                                </div>
                                <div className="flex flex-wrap items-center gap-x-2">
                                  <span className="text-sm font-medium text-[#C5C6C7]">Reason:</span>
                                  <span className="text-sm text-[#8F9BB3]">{reportedJob.report.reason}</span>
                                </div>
                                <div className="flex flex-wrap items-center gap-x-2">
                                  <span className="text-sm font-medium text-[#C5C6C7]">Status:</span>
                                  {getStatusBadge(reportedJob.report.status)}
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="w-full sm:w-auto border-[#2E3A47] text-[#C5C6C7] hover:bg-[#2E3A47] hover:text-white"
                                >
                                  Dismiss
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm" 
                                  className="w-full sm:w-auto bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30 hover:text-white"
                                >
                                  Confirm
                                </Button>
                              </div>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h4 className="font-medium text-white">{job.title}</h4>
                                  {getJobStatusBadge(job.status)}
                                </div>
                                
                                <div className="flex items-center text-sm text-[#C5C6C7] space-x-4 mb-2">
                                  <span>{company?.name || "Unknown Company"}</span>
                                  <span>{job.location}</span>
                                  <span className="text-red-600">{job.reportCount} reports</span>
                                </div>
                                
                                <p className="text-sm text-[#8F9BB3] line-clamp-2">
                                  {job.description}
                                </p>
                              </div>
                              
                              <div className="ml-4">
                                <Badge variant="outline" className="text-red-600 border-red-300">
                                  Avoid
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Reporting Guidelines */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 border-2 border-blue-200 dark:border-blue-700/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-blue-800 dark:text-blue-200 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6" />
              How to Report Suspicious Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Red Flags to Watch For:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Requests for upfront payment or fees</li>
                  <li>• Poor grammar and spelling errors</li>
                  <li>• Unrealistic salary offers</li>
                  <li>• Immediate hiring without proper interview</li>
                  <li>• Requests for sensitive personal information</li>
                  <li>• Communication only through instant messaging</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">How to Report:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Click "Report Job" on suspicious listings</li>
                  <li>• Provide detailed reasoning</li>
                  <li>• Upload evidence if available</li>
                  <li>• Our team reviews within 24-48 hours</li>
                  <li>• Community voting helps verify reports</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      
      {/* Report Job Modal */}
      <ReportJobForm
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        userId={user?.id || ''}
      />
    </div>
  );
}
