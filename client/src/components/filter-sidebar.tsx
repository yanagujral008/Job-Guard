import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";

interface FilterSidebarProps {
  onFiltersChange: (filters: any) => void;
}

export default function FilterSidebar({ onFiltersChange }: FilterSidebarProps) {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [jobTypes, setJobTypes] = useState<string[]>([]);
  const [experienceLevels, setExperienceLevels] = useState<string[]>([]);
  const [companySizes, setCompanySizes] = useState<string[]>([]);
  const [trustFilters, setTrustFilters] = useState<string[]>([]);

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  }) as { data: any };

  const handleJobTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setJobTypes([...jobTypes, type]);
    } else {
      setJobTypes(jobTypes.filter(t => t !== type));
    }
  };

  const handleExperienceChange = (level: string, checked: boolean) => {
    if (checked) {
      setExperienceLevels([...experienceLevels, level]);
    } else {
      setExperienceLevels(experienceLevels.filter(l => l !== level));
    }
  };

  const handleCompanySizeChange = (size: string, checked: boolean) => {
    if (checked) {
      setCompanySizes([...companySizes, size]);
    } else {
      setCompanySizes(companySizes.filter(s => s !== size));
    }
  };

  const handleTrustFilterChange = (filter: string, checked: boolean) => {
    if (checked) {
      setTrustFilters([...trustFilters, filter]);
    } else {
      setTrustFilters(trustFilters.filter(f => f !== filter));
    }
  };

  const applyFilters = () => {
    const filters = {
      search: search || undefined,
      location: location || undefined,
      jobType: jobTypes.length > 0 ? jobTypes : undefined,
      experienceLevel: experienceLevels.length > 0 ? experienceLevels : undefined,
      companySize: companySizes.length > 0 ? companySizes : undefined,
      trustScoreMin: trustFilters.includes("verified") ? 90 : undefined,
      status: trustFilters.includes("hideSuspicious") ? ["verified", "pending"] : undefined,
    };
    onFiltersChange(filters);
  };

  return (
    <aside className="space-y-6">
      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Jobs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="search">Job Title / Keywords</Label>
            <Input
              id="search"
              placeholder="e.g., Frontend Developer"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="e.g., San Francisco, Remote"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          
          <div>
            <Label>Salary Range</Label>
            <Select value={salary} onValueChange={setSalary}>
              <SelectTrigger>
                <SelectValue placeholder="Any Salary" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Salary</SelectItem>
                <SelectItem value="30k-50k">$30k - $50k</SelectItem>
                <SelectItem value="50k-80k">$50k - $80k</SelectItem>
                <SelectItem value="80k-120k">$80k - $120k</SelectItem>
                <SelectItem value="120k+">$120k+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Job Type */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Job Type</h4>
            <div className="space-y-2">
              {[
                { value: "full-time", label: "Full-time", count: 1234 },
                { value: "part-time", label: "Part-time", count: 456 },
                { value: "remote", label: "Remote", count: 789 },
                { value: "internship", label: "Internship", count: 234 },
              ].map((type) => (
                <div key={type.value} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={type.value}
                      checked={jobTypes.includes(type.value)}
                      onCheckedChange={(checked) => handleJobTypeChange(type.value, !!checked)}
                    />
                    <Label htmlFor={type.value} className="text-sm">{type.label}</Label>
                  </div>
                  <span className="text-xs text-gray-500">{type.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Experience Level */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Experience Level</h4>
            <div className="space-y-2">
              {[
                { value: "entry", label: "Entry Level" },
                { value: "mid", label: "Mid Level" },
                { value: "senior", label: "Senior Level" },
              ].map((level) => (
                <div key={level.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={level.value}
                    checked={experienceLevels.includes(level.value)}
                    onCheckedChange={(checked) => handleExperienceChange(level.value, !!checked)}
                  />
                  <Label htmlFor={level.value} className="text-sm">{level.label}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Company Size */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Company Size</h4>
            <div className="space-y-2">
              {[
                { value: "startup", label: "Startup (1-50)" },
                { value: "medium", label: "Medium (51-500)" },
                { value: "large", label: "Large (500+)" },
              ].map((size) => (
                <div key={size.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={size.value}
                    checked={companySizes.includes(size.value)}
                    onCheckedChange={(checked) => handleCompanySizeChange(size.value, !!checked)}
                  />
                  <Label htmlFor={size.value} className="text-sm">{size.label}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Score Filter */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Trust Score</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="verified"
                  checked={trustFilters.includes("verified")}
                  onCheckedChange={(checked) => handleTrustFilterChange("verified", !!checked)}
                />
                <Label htmlFor="verified" className="text-sm">✅ Verified Only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hideSuspicious"
                  checked={trustFilters.includes("hideSuspicious")}
                  onCheckedChange={(checked) => handleTrustFilterChange("hideSuspicious", !!checked)}
                />
                <Label htmlFor="hideSuspicious" className="text-sm">⚠️ Hide Suspicious</Label>
              </div>
            </div>
          </div>

          <Button onClick={applyFilters} className="w-full">
            Apply Filters
          </Button>
        </CardContent>
      </Card>

      {/* Platform Stats */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>Platform Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Jobs</span>
              <span className="font-semibold">{stats.totalJobs.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Verified Companies</span>
              <span className="font-semibold text-green-600">{stats.verifiedCompanies}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Fake Jobs Detected</span>
              <span className="font-semibold text-red-600">{stats.fakeJobsDetected}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Success Rate</span>
              <span className="font-semibold text-green-600">{stats.successRate}%</span>
            </div>
          </CardContent>
        </Card>
      )}
    </aside>
  );
}
