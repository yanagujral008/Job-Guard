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
  FileText
} from "lucide-react";

export default function Reports() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [reasonFilter, setReasonFilter] = useState<string>("");

  const { data: reports = [], isLoading: reportsLoading } = useQuery({
    queryKey: ["/api/job-reports"],
  }) as { data: any[], isLoading: boolean };

  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ["/api/jobs"],
  }) as { data: any[], isLoading: boolean };

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  }) as { data: any };

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
        return <Badge variant="secondary">Under Review</Badge>;
      case "verified":
        return <Badge className="bg-red-100 text-red-800">Confirmed Fake</Badge>;
      case "dismissed":
        return <Badge className="bg-green-100 text-green-800">Dismissed</Badge>;
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
      case "suspicious": return "border-amber-200 bg-amber-50";
      case "fake": return "border-red-200 bg-red-50";
      default: return "";
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Fake Job Reports & Detection</h1>
          <p className="text-gray-600">
            Community-driven fake job detection and reporting system
          </p>
        </div>

        {/* Alert Banner */}
        <Alert className="mb-6 border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-800">
            <strong>Stay Safe:</strong> Always verify job postings independently. Never pay for job applications or provide sensitive personal information upfront.
          </AlertDescription>
        </Alert>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="text-red-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fake Jobs Detected</p>
                    <p className="text-2xl font-bold text-red-600">{stats.fakeJobsDetected}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Reports</p>
                    <p className="text-2xl font-bold text-blue-600">{reports.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Shield className="text-green-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Platform Safety</p>
                    <p className="text-2xl font-bold text-green-600">{stats.successRate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingDown className="text-purple-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">This Week</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.weeklyStats.fakeJobsDetected}</p>
                    <p className="text-xs text-gray-500">-8% from last week</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="reports" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="reports">Community Reports</TabsTrigger>
            <TabsTrigger value="wall-of-shame">Wall of Shame</TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <Input
                    placeholder="Search reports by job title or company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="md:w-80"
                  />
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="md:w-48">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Under Review</SelectItem>
                      <SelectItem value="verified">Confirmed Fake</SelectItem>
                      <SelectItem value="dismissed">Dismissed</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={reasonFilter} onValueChange={setReasonFilter}>
                    <SelectTrigger className="md:w-60">
                      <SelectValue placeholder="All Reasons" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Reasons</SelectItem>
                      {reportReasons.map((reason) => (
                        <SelectItem key={reason} value={reason}>
                          {reason}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Reports List */}
            {reportsLoading || jobsLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Card key={i}>
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
            ) : filteredReports.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No reports found matching your criteria.</p>
                  <p className="text-sm text-gray-400 mt-2">Try adjusting your search or filters.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredReports.map((reportedJob: any) => (
                  <Card key={reportedJob.report.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Building className="text-gray-600" size={20} />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2 flex-wrap">
                              <h3 className="text-lg font-semibold text-gray-900">{reportedJob.title}</h3>
                              {getJobStatusBadge(reportedJob.status)}
                              {getStatusBadge(reportedJob.report.status)}
                            </div>
                            
                            <div className="flex items-center text-sm text-gray-600 space-x-4 mb-2 flex-wrap">
                              <span className="flex items-center">
                                <Building className="w-4 h-4 mr-1" />
                                {reportedJob.company?.name || "Unknown Company"}
                              </span>
                              <span className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {reportedJob.location}
                              </span>
                              <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                Reported {formatDate(reportedJob.report.reportedAt)}
                              </span>
                            </div>
                            
                            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-3">
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
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                {reportedJob.salary && (
                                  <span className="text-lg font-semibold text-gray-900 flex items-center">
                                    <DollarSign className="w-4 h-4 mr-1" />
                                    {reportedJob.salary}
                                  </span>
                                )}
                                <span className="text-sm text-gray-600">
                                  Report #{reportedJob.reportCount || 1}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="wall-of-shame" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <span>Wall of Shame - Confirmed Fake Jobs</span>
                </CardTitle>
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
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h4 className="font-medium text-gray-900">{job.title}</h4>
                                  {getJobStatusBadge(job.status)}
                                </div>
                                
                                <div className="flex items-center text-sm text-gray-600 space-x-4 mb-2">
                                  <span>{company?.name || "Unknown Company"}</span>
                                  <span>{job.location}</span>
                                  <span className="text-red-600">{job.reportCount} reports</span>
                                </div>
                                
                                <p className="text-sm text-gray-700 line-clamp-2">
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
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How to Report Suspicious Jobs</CardTitle>
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
      </div>
    </div>
  );
}
