import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import FilterSidebar from "@/components/filter-sidebar";
import RightSidebar from "@/components/right-sidebar";
import JobCard from "@/components/job-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { List, Grid3x3, AlertTriangle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "wouter";

export default function Home() {
  const [filters, setFilters] = useState<any>({});
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const isMobile = useIsMobile();

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["/api/jobs", filters],
    queryFn: () => {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            params.append(key, value.join(','));
          } else {
            params.append(key, String(value));
          }
        }
      });
      
      return fetch(`/api/jobs?${params.toString()}`).then(res => res.json());
    },
  });

  const { data: savedJobs = [] } = useQuery({
    queryKey: ["/api/saved-jobs"],
    queryFn: () => fetch("/api/saved-jobs?userId=user1").then(res => res.json()),
  });

  const savedJobIds = new Set(savedJobs.map((job: any) => job.id));

  const sortedJobs = [...jobs].sort((a, b) => {
    switch (sortBy) {
      case "salary":
        return b.company.trustScore - a.company.trustScore;
      case "trust":
        return b.company.trustScore - a.company.trustScore;
      case "recent":
      default:
        return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
    }
  });

  const suspiciousJobsCount = jobs.filter((job: any) => job.status === "suspicious").length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Sidebar - Hidden on mobile */}
          {!isMobile && (
            <div className="lg:w-80">
              <FilterSidebar onFiltersChange={setFilters} />
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1 space-y-6">
            {/* Search Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Job Search Results</h1>
                <p className="text-gray-600 mt-1">
                  Found {jobs.length.toLocaleString()} jobs matching your criteria
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="salary">Highest Salary</SelectItem>
                    <SelectItem value="trust">Trust Score</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex rounded-md border border-gray-300">
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-r-none"
                  >
                    <List size={16} />
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-l-none"
                  >
                    <Grid3x3 size={16} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Fake Job Alert */}
            {suspiciousJobsCount > 0 && (
              <Alert className="border-amber-200 bg-amber-50">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <AlertDescription className="text-amber-800">
                  We've detected {suspiciousJobsCount} suspicious job posting{suspiciousJobsCount !== 1 ? 's' : ''} in your results.{' '}
                  <Link href="/reports" className="underline font-medium">
                    View details
                  </Link>
                </AlertDescription>
              </Alert>
            )}

            {/* Job Listings */}
            {isLoading ? (
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
            ) : jobs.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-gray-500">No jobs found matching your criteria.</p>
                  <p className="text-sm text-gray-400 mt-2">Try adjusting your filters or search terms.</p>
                </CardContent>
              </Card>
            ) : (
              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"}>
                {sortedJobs.map((job: any) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isSaved={savedJobIds.has(job.id)}
                    userId="user1"
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {jobs.length > 0 && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to{' '}
                  <span className="font-medium">{Math.min(10, jobs.length)}</span> of{' '}
                  <span className="font-medium">{jobs.length}</span> results
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button size="sm">1</Button>
                  <Button variant="outline" size="sm">2</Button>
                  <Button variant="outline" size="sm">3</Button>
                  <span className="px-3 py-2 text-gray-500">...</span>
                  <Button variant="outline" size="sm">45</Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </div>
            )}
          </main>

          {/* Right Sidebar - Hidden on mobile */}
          {!isMobile && (
            <div className="lg:w-80">
              <RightSidebar />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
          <div className="grid grid-cols-5 gap-1">
            <Link href="/" className="flex flex-col items-center justify-center py-2 text-primary">
              <i className="fas fa-search text-lg"></i>
              <span className="text-xs mt-1">Jobs</span>
            </Link>
            <Link href="/courses" className="flex flex-col items-center justify-center py-2 text-gray-600">
              <i className="fas fa-graduation-cap text-lg"></i>
              <span className="text-xs mt-1">Courses</span>
            </Link>
            <Link href="/companies" className="flex flex-col items-center justify-center py-2 text-gray-600">
              <i className="fas fa-building text-lg"></i>
              <span className="text-xs mt-1">Companies</span>
            </Link>
            <Link href="/reports" className="flex flex-col items-center justify-center py-2 text-gray-600">
              <i className="fas fa-exclamation-triangle text-lg"></i>
              <span className="text-xs mt-1">Reports</span>
            </Link>
            <button className="flex flex-col items-center justify-center py-2 text-gray-600">
              <i className="fas fa-user text-lg"></i>
              <span className="text-xs mt-1">Profile</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
