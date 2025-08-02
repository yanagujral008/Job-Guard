import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Users, MapPin, ExternalLink, Shield, AlertTriangle } from "lucide-react";

export default function Companies() {
  const { data: companies = [], isLoading } = useQuery({
    queryKey: ["/api/companies"],
  }) as { data: any[], isLoading: boolean };

  const getTrustBadge = (trustScore: number) => {
    if (trustScore >= 90) return { label: "Highly Trusted", className: "bg-green-100 text-green-800" };
    if (trustScore >= 70) return { label: "Trusted", className: "bg-blue-100 text-blue-800" };
    if (trustScore >= 50) return { label: "Moderate", className: "bg-yellow-100 text-yellow-800" };
    return { label: "Low Trust", className: "bg-red-100 text-red-800" };
  };

  const getSizeLabel = (size: string) => {
    switch (size) {
      case "startup": return "1-50 employees";
      case "medium": return "51-500 employees";
      case "large": return "500+ employees";
      default: return "Unknown size";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Directory</h1>
          <p className="text-gray-600">
            Explore companies, check their trust scores, and see verified job postings
          </p>
        </div>

        {/* Trust Score Legend */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Trust Score Guide</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">90-100%: Highly Trusted</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm">70-89%: Trusted</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">50-69%: Moderate</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm">Below 50%: Low Trust</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Skeleton className="w-16 h-16 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company: any) => {
              const trustBadge = getTrustBadge(company.trustScore);
              
              return (
                <Card key={company.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i className={`${company.logo} text-2xl`} 
                           style={{ 
                             color: company.logo?.includes('google') ? '#4285f4' : 
                                   company.logo?.includes('microsoft') ? '#0078d4' : '#666' 
                           }}>
                        </i>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-lg text-gray-900 truncate">
                            {company.name}
                          </h3>
                          {company.trustScore >= 90 && (
                            <Shield className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                        
                        <Badge className={trustBadge.className}>
                          {trustBadge.label} ({company.trustScore}%)
                        </Badge>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {company.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        {getSizeLabel(company.size)}
                      </div>
                      
                      {company.rating && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Star className="w-4 h-4 mr-2 text-yellow-400 fill-current" />
                          {company.rating} rating
                        </div>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-600">
                          {company.verifiedJobs}
                        </div>
                        <div className="text-xs text-gray-600">Verified Jobs</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-red-600">
                          {company.reportedJobs}
                        </div>
                        <div className="text-xs text-gray-600">Reports</div>
                      </div>
                    </div>

                    {/* Warning for low trust score */}
                    {company.trustScore < 70 && (
                      <div className="flex items-center space-x-2 mb-4 p-2 bg-amber-50 border border-amber-200 rounded">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span className="text-xs text-amber-800">
                          {company.reportedJobs > 5 ? "Multiple reports filed" : "Exercise caution"}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <Button variant="outline" size="sm">
                        View Jobs
                      </Button>
                      
                      {company.website && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={company.website} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {companies.length === 0 && !isLoading && (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">No companies found.</p>
            </CardContent>
          </Card>
        )}

        {/* Trust Score Distribution */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Platform Trust Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {companies.filter((c: any) => c.trustScore >= 90).length}
                </div>
                <div className="text-sm text-gray-600">Highly Trusted</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {companies.filter((c: any) => c.trustScore >= 70 && c.trustScore < 90).length}
                </div>
                <div className="text-sm text-gray-600">Trusted</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">
                  {companies.filter((c: any) => c.trustScore >= 50 && c.trustScore < 70).length}
                </div>
                <div className="text-sm text-gray-600">Moderate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">
                  {companies.filter((c: any) => c.trustScore < 50).length}
                </div>
                <div className="text-sm text-gray-600">Low Trust</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
