import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Trophy, Medal, Info, TrendingUp, TrendingDown, Users, Star } from "lucide-react";
import { Link } from "wouter";

type RightSidebarProps = {
  savedJobs: any[];
  onRemoveJob?: (job: any) => void;
};

export default function RightSidebar({ savedJobs, onRemoveJob }: RightSidebarProps) {
  const { data: courses = [] } = useQuery<any[]>({ queryKey: ["/api/courses"] });
  const { data: topReporters = [] } = useQuery<any[]>({ queryKey: ["/api/top-reporters"] });
  const { data: stats } = useQuery<any>({ queryKey: ["/api/stats"] });

  return (
    <aside className="space-y-6">
      {/* Saved Jobs */}
      <div className="space-y-3">
        {savedJobs.length > 0 ? (
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar pr-2 -mr-2">
            {savedJobs.map((job: any) => (
            <div key={job.id || job.title} className="group relative">
              <a
                href={job.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 bg-[#1F2833] hover:bg-[#243447] border border-[#2E3A47] group-hover:border-[#00AEEF]"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-[#0B0C10] rounded-lg border border-[#2E3A47] flex items-center justify-center overflow-hidden p-1.5">
                  <img
                    src={job.company_logo || "/default-company.png"}
                    alt={job.company_name}
                    className="w-full h-full object-contain"
                    onError={(e) =>
                      ((e.target as HTMLImageElement).src = "/default-company.png")
                    }
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{job.title}</p>
                  <p className="text-xs text-[#C5C6C7] truncate">{job.company_name}</p>
                  {job.salary && (
                    <div className="mt-1">
                      <span className="text-xs px-2 py-0.5 bg-[#00AEEF]/10 text-[#00AEEF] rounded-full">
                        {job.salary}
                      </span>
                    </div>
                  )}
                </div>
                <svg 
                  className="w-4 h-4 text-[#2E3A47] group-hover:text-[#00AEEF] transition-colors" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (onRemoveJob) {
                    onRemoveJob(job);
                  }
                }}
                className="absolute -right-2 -top-2 p-1 bg-[#1F2833] rounded-full border border-[#2E3A47] hover:bg-red-500/20 hover:border-red-500/50 transition-colors"
                title="Remove job"
              >
                <svg className="w-3.5 h-3.5 text-[#C5C6C7] hover:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-6 rounded-lg bg-[#1F2833] border border-dashed border-[#2E3A47] hover:border-[#00AEEF]/50 transition-colors">
            <svg 
              className="w-10 h-10 mx-auto text-[#00AEEF] mb-3" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <h3 className="text-white font-medium mb-1">No saved jobs yet</h3>
            <p className="text-sm text-[#C5C6C7] mb-4">Save jobs to view them here</p>
            <Link href="/jobs">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-[#007BFF] hover:bg-[#0056D2] text-white border-[#007BFF] hover:border-[#0056D2] transition-colors"
              >
                Browse Jobs
              </Button>
            </Link>
          </div>
        )}
        {savedJobs.length > 3 && (
          <div className="pt-2 border-t border-[#2E3A47]">
            <Link href="/savedjobs" className="block">
              <Button 
                variant="outline" 
                className="w-full text-[#00AEEF] border-[#2E3A47] hover:bg-[#00AEEF]/10 hover:border-[#00AEEF]/50 transition-colors text-sm h-9"
              >
                View All Saved Jobs ({savedJobs.length})
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Recommended Courses */}
      <Card className="bg-[#0B0C10] border border-[#2E3A47] rounded-xl shadow-sm">
        <CardHeader className="pb-3 border-b border-[#2E3A47]">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00AEEF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
              Recommended Courses
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-0">
          {courses?.slice(0, 2).map((course: any) => (
            <a
              key={course.id}
              href={course.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="p-3 hover:bg-[#1F2833] rounded-lg transition-colors border-b border-[#2E3A47] last:border-0">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      course.category === "web-dev"
                        ? "bg-gradient-to-br from-blue-500 to-purple-600"
                        : "bg-gradient-to-br from-green-500 to-blue-600"
                    }`}
                  >
                    <i className={`${course.thumbnail} text-white text-xl`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-white group-hover:text-[#00AEEF] transition-colors">
                      {course.title}
                    </h4>
                    <p className="text-xs text-[#C5C6C7] mt-1 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge 
                        className={`${
                          course.isFree 
                            ? 'bg-[#00AEEF]/10 text-[#00AEEF] hover:bg-[#00AEEF]/20' 
                            : 'bg-[#007BFF]/10 text-[#007BFF] hover:bg-[#007BFF]/20'
                        }`}
                      >
                        {course.isFree ? "Free" : `$${course.price}`}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-[#C5C6C7]">{course.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          ))}

          <Link href="/courses" className="block p-3 pt-2">
            <Button 
              variant="default" 
              size="sm" 
              className="w-full bg-[#007BFF] hover:bg-[#0056D2] text-white border-[#007BFF] hover:border-[#0056D2] transition-colors"
            >
              Browse All Courses
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Top Reporter Leaderboard */}
      <Card className="bg-[#0B0C10] border border-[#2E3A47] rounded-xl shadow-sm">
        <CardHeader className="pb-3 border-b border-[#2E3A47]">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00AEEF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Top Reporter Leaderboard
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 p-0">
          {topReporters?.slice(0, 3).map((reporter: any, index: number) => (
            <div
              key={reporter.id || reporter.name}
              className="flex items-center justify-between p-3 hover:bg-[#1F2833] transition-colors border-b border-[#2E3A47] last:border-0 group"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index === 0 
                    ? 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-white' 
                    : index === 1 
                      ? 'bg-gradient-to-br from-gray-400 to-gray-500 text-white'
                      : 'bg-gradient-to-br from-amber-700 to-amber-800 text-white'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <p className="text-sm font-medium text-white group-hover:text-[#00AEEF] transition-colors">
                    {reporter.name}
                  </p>
                  <p className="text-xs text-[#C5C6C7]">
                    {reporter.reports} {reporter.reports === 1 ? 'report' : 'reports'}
                  </p>
                </div>
              </div>
              <Badge 
                className={`${
                  reporter.role === 'Admin' 
                    ? 'bg-[#00AEEF]/10 text-[#00AEEF] hover:bg-[#00AEEF]/20' 
                    : 'bg-[#2E3A47] text-[#C5C6C7] hover:bg-[#3B82F6]/10 hover:text-[#3B82F6]'
                }`}
              >
                {reporter.role || 'Reporter'}
              </Badge>
            </div>
          ))}
          <div className="p-3">
            <div className="p-3 bg-[#1F2833] rounded-lg text-xs text-[#C5C6C7] flex gap-2 border border-[#2E3A47]">
              <Info className="w-4 h-4 flex-shrink-0 text-[#00AEEF]" />
              <span>
                Help keep our platform safe by reporting suspicious jobs. Top reporters get special recognition!
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Stats */}
      {stats && (
        <Card className="rounded-xl shadow-sm">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-lg font-semibold">This Week's Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                label: "Jobs Verified",
                change: "+12% from last week",
                value: stats.weeklyStats.jobsVerified,
                color: "green",
                icon: <TrendingUp className="text-green-600" size={20} />,
              },
              {
                label: "Fake Jobs Detected",
                change: "-8% from last week",
                value: stats.weeklyStats.fakeJobsDetected,
                color: "red",
                icon: <TrendingDown className="text-red-600" size={20} />,
              },
              {
                label: "New Companies",
                change: "+23% from last week",
                value: stats.weeklyStats.newCompanies,
                color: "blue",
                icon: <Users className="text-blue-600" size={20} />,
              },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 bg-${item.color}-100 rounded-lg flex items-center justify-center`}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.change}</p>
                  </div>
                </div>
                <span className={`text-lg font-bold text-${item.color}-600`}>{item.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </aside>
  );
}
