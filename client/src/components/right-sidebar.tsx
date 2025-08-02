import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Star, Trophy, Medal, Info, TrendingUp, TrendingDown, Users } from "lucide-react";
import { Link } from "wouter";

export default function RightSidebar() {
  const { data: savedJobs = [] } = useQuery({
    queryKey: ["/api/saved-jobs"],
    queryFn: () => fetch("/api/saved-jobs?userId=user1").then(res => res.json()),
  }) as { data: any[] };

  const { data: courses = [] } = useQuery({
    queryKey: ["/api/courses"],
  }) as { data: any[] };

  const { data: topReporters = [] } = useQuery({
    queryKey: ["/api/top-reporters"],
  }) as { data: any[] };

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  }) as { data: any };

  const getCompanyIcon = (name: string) => {
    if (name.toLowerCase().includes('apple')) return 'fab fa-apple';
    if (name.toLowerCase().includes('spotify')) return 'fab fa-spotify';
    if (name.toLowerCase().includes('google')) return 'fab fa-google';
    if (name.toLowerCase().includes('microsoft')) return 'fab fa-microsoft';
    return 'fas fa-building';
  };

  const getCompanyColor = (name: string) => {
    if (name.toLowerCase().includes('apple')) return 'text-blue-600';
    if (name.toLowerCase().includes('spotify')) return 'text-green-600';
    if (name.toLowerCase().includes('google')) return 'text-blue-500';
    if (name.toLowerCase().includes('microsoft')) return 'text-blue-600';
    return 'text-gray-600';
  };

  return (
    <aside className="space-y-6">
      {/* Saved Jobs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Saved Jobs</CardTitle>
            <span className="text-sm text-gray-500">
              {savedJobs?.length || 0}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {savedJobs?.slice(0, 2).map((job: any) => (
            <div
              key={job.id}
              className="flex items-center space-x-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <div className={`w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center`}>
                <i className={`${getCompanyIcon(job.company.name)} ${getCompanyColor(job.company.name)}`}></i>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{job.title}</p>
                <p className="text-xs text-gray-500">{job.company.name}</p>
              </div>
            </div>
          )) || (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">No saved jobs yet</p>
            </div>
          )}
          
          <Link href="/saved-jobs">
            <Button variant="ghost" className="w-full text-sm text-primary font-medium">
              View All Saved Jobs
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recommended Courses */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Courses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {courses?.slice(0, 2).map((course: any) => (
            <div key={course.id} className="border border-gray-100 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className={`w-16 h-12 rounded-lg flex items-center justify-center ${
                  course.category === 'web-dev' 
                    ? 'bg-gradient-to-br from-blue-400 to-purple-500' 
                    : 'bg-gradient-to-br from-green-400 to-blue-500'
                }`}>
                  <i className={`${course.thumbnail} text-white`}></i>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm">{course.title}</h4>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">{course.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <Badge variant={course.isFree ? "secondary" : "default"}>
                      {course.isFree ? "Free" : `$${course.price}`}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-500">{course.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <Link href="/courses">
            <Button variant="ghost" className="w-full text-sm text-primary font-medium">
              Browse All Courses
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Top Reporter Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>Top Reporter Leaderboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {topReporters?.slice(0, 3).map((reporter: any, index: number) => (
            <div key={reporter.userId} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index === 0 ? 'bg-yellow-100' : index === 1 ? 'bg-gray-100' : 'bg-orange-100'
                }`}>
                  <span className={`text-sm font-bold ${
                    index === 0 ? 'text-yellow-600' : index === 1 ? 'text-gray-600' : 'text-orange-600'
                  }`}>
                    {index + 1}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium">{reporter.username}</p>
                  <p className="text-xs text-gray-500">{reporter.reportCount} reports verified</p>
                </div>
              </div>
              {index === 0 ? (
                <Trophy className="text-yellow-500" size={16} />
              ) : (
                <Medal className={index === 1 ? "text-gray-400" : "text-orange-400"} size={16} />
              )}
            </div>
          ))}
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800 flex items-start space-x-1">
              <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span>Help keep our platform safe by reporting suspicious jobs. Top reporters get special recognition!</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Stats */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>This Week's Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-green-600" size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium">Jobs Verified</p>
                  <p className="text-xs text-gray-500">+12% from last week</p>
                </div>
              </div>
              <span className="text-lg font-bold text-green-600">
                {stats.weeklyStats.jobsVerified}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <TrendingDown className="text-red-600" size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium">Fake Jobs Detected</p>
                  <p className="text-xs text-gray-500">-8% from last week</p>
                </div>
              </div>
              <span className="text-lg font-bold text-red-600">
                {stats.weeklyStats.fakeJobsDetected}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="text-blue-600" size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium">New Companies</p>
                  <p className="text-xs text-gray-500">+23% from last week</p>
                </div>
              </div>
              <span className="text-lg font-bold text-blue-600">
                {stats.weeklyStats.newCompanies}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </aside>
  );
}
