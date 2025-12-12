import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import FilterSidebar from "@/components/filter-sidebar";
import RightSidebar from "@/components/right-sidebar";
import { Button } from "@/components/ui/button";
import JobCard from "@/components/job-card";
import ThreeBackground from "@/components/ThreeBackground";

interface Job {
  id: string;
  title: string;
  company_name: string;
  company_logo: string;
  url: string;
  location?: string;
  salary?: string;
  job_type?: string;
  experience_level?: string;
  company_size?: string;
  trust_score?: number;
  status?: string;
  [key: string]: any;
}

interface Filters {
  search?: string;
  location?: string;
  salary?: string;
  jobType?: string[];
  experienceLevel?: string[];
  companySize?: string[];
  trustScoreMin?: number;
  status?: string[];
}

export default function Home() {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [filters, setFilters] = useState<Filters>({});

  const { data: jobs = [], isLoading } = useQuery<Job[]>({
    queryKey: ["jobs"],
    queryFn: async () => {
      const res = await fetch("/remoteok_jobs.json");
      return res.json();
    },
  });

  const getJobId = (job: any) => {
    return (
      job.id ||
      `${job.title || job.Title || ""}-${job.company_name || job.Company || ""}`
        .replace(/\s+/g, "-")
        .toLowerCase()
    );
  };

  const normalizeJob = (job: any): Job => ({
    id: getJobId(job),
    title: job.title || job.Title || job.position || "Untitled",
    company_name: job.company_name || job.Company || job.company || "Unknown",
    company_logo: job.company_logo || job.logo || "",
    url: job.company_url || job.url || job.apply_url || "#",
    location: job.location || job.Location || "",
    salary: job.salary || job.Salary || "",
    job_type: job.job_type || job.Job_Type || job.type || "",
    experience_level: job.experience_level || job.Experience_Level || "",
    company_size: job.company_size || job.Company_Size || "",
    trust_score: job.trust_score || 0,
    status: job.status || "pending",
    ...job,
  });

  // Apply filters to jobs
  const filteredJobs = jobs.filter((job: Job) => {
    const normalizedJob = normalizeJob(job);
    
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        normalizedJob.title.toLowerCase().includes(searchLower) ||
        normalizedJob.company_name.toLowerCase().includes(searchLower) ||
        (normalizedJob.description && normalizedJob.description.toLowerCase().includes(searchLower));
      
      if (!matchesSearch) return false;
    }

    // Location filter
    if (filters.location && normalizedJob.location) {
      const locationLower = filters.location.toLowerCase();
      if (!normalizedJob.location.toLowerCase().includes(locationLower)) {
        return false;
      }
    }

    // Job type filter
    if (filters.jobType && filters.jobType.length > 0 && normalizedJob.job_type) {
      if (!filters.jobType.includes(normalizedJob.job_type)) {
        return false;
      }
    }

    // Experience level filter
    if (filters.experienceLevel && filters.experienceLevel.length > 0 && normalizedJob.experience_level) {
      const jobExperienceLevel = normalizedJob.experience_level?.toLowerCase() || '';
      if (!filters.experienceLevel.some(level => 
        jobExperienceLevel.includes(level.toLowerCase())
      )) {
        return false;
      }
    }

    // Company size filter
    if (filters.companySize && filters.companySize.length > 0 && normalizedJob.company_size) {
      if (!filters.companySize.includes(normalizedJob.company_size)) {
        return false;
      }
    }

    // Trust score filter
    if (filters.trustScoreMin && normalizedJob.trust_score) {
      if (normalizedJob.trust_score < filters.trustScoreMin) {
        return false;
      }
    }

    // Status filter
    if (filters.status && normalizedJob.status) {
      if (!filters.status.includes(normalizedJob.status)) {
        return false;
      }
    }

    return true;
  });

  const toggleSaveJob = (job: any) => {
    const jobId = getJobId(job);
    setSavedJobs((prev) => {
      const exists = prev.some((saved) => getJobId(saved) === jobId);
      if (exists) {
        return prev.filter((saved) => getJobId(saved) !== jobId);
      }
      return [...prev, normalizeJob(job)];
    });
  };

  return (
    <div className="min-h-screen relative bg-black">
      <ThreeBackground />
      <div className="relative z-10 bg-black text-white">
        <Header />
        <div className="grid grid-cols-12 gap-6 px-6 py-6 max-w-7xl mx-auto bg-black">
          {/* Left Sidebar */}
          <aside className="col-span-3 bg-gradient-to-b from-[#0F172A] to-[#1E293B] shadow-lg rounded-xl overflow-hidden border border-[#334155] sticky top-20 h-[calc(100vh-6rem)] flex flex-col">
            <div className="p-6 border-b border-[#334155]">
              <h2 className="text-lg font-semibold text-white mb-2">
                Filters
              </h2>
              {Object.keys(filters).length > 0 && (
                <button 
                  onClick={() => setFilters({})}
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="p-6 pt-4">
                <FilterSidebar onFiltersChange={(newFilters) => setFilters(newFilters)} />
              </div>
            </div>
          </aside>

          {/* Job Listings */}
          <main className="col-span-6 space-y-6">
            {isLoading ? (
              <div className="flex flex-col space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-28 bg-[#1E293B] rounded-lg animate-pulse border border-[#334155]"
                  />
                ))}
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[#E2E8F0] text-lg font-medium mb-4">No jobs found matching your filters.</p>
                <Button 
                  variant="outline" 
                  className="text-[#00AEEF] border-[#00AEEF] hover:bg-[#00AEEF]/10"
                  onClick={() => setFilters({})}
                >
                  Clear all filters
                </Button>
              </div>
            ) : (
              filteredJobs.map((job: Job, index: number) => {
                const normalizedJob = normalizeJob(job);
                return (
                  <div key={getJobId(normalizedJob)}>
                    <div 
                      className="transform transition hover:scale-[1.02] hover:shadow-xl rounded-lg border border-transparent hover:border-[#3B82F6]/30"
                      style={{ animation: `fadeInUp 0.3s ease forwards`, animationDelay: `${index * 80}ms` }}
                    >
                      <JobCard
                        job={normalizedJob}
                        isSaved={savedJobs.some(
                          (saved) => getJobId(saved) === getJobId(normalizedJob)
                        )}
                        onSaveToggle={() => toggleSaveJob(normalizedJob)}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </main>

          {/* Right Sidebar */}
          <aside className="col-span-3 sticky top-20 h-fit space-y-6">
            <div className="bg-[#0B0C10] shadow-lg rounded-xl p-6 border border-[#2E3A47]">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#2E3A47]">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00AEEF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                  </svg>
                  Saved Jobs
                </h2>
                <span className="text-sm font-medium bg-[#1F2833] text-[#C5C6C7] px-2.5 py-0.5 rounded-full border border-[#2E3A47]">
                  {savedJobs.length}
                </span>
              </div>
              <RightSidebar 
                savedJobs={savedJobs} 
                onRemoveJob={(job) => {
                  setSavedJobs(prev => 
                    prev.filter(savedJob => getJobId(savedJob) !== getJobId(job))
                  );
                }}
              />
            </div>
          </aside>
        </div>

        {/* Keyframe animations */}
        <style>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      </div>
    </div>
  );
}
