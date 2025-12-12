import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";

interface FilterSidebarProps {
  onFiltersChange?: (filters: any) => void;
}

export default function FilterSidebar({
  onFiltersChange,
}: FilterSidebarProps) {
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

  const toggleArrayValue = (
    stateSetter: React.Dispatch<React.SetStateAction<string[]>>,
    value: string,
    checked: boolean
  ) => {
    stateSetter((prev) =>
      checked ? [...prev, value] : prev.filter((v) => v !== value)
    );
  };

  const applyFilters = () => {
    const filters = {
      search: search || undefined,
      location: location || undefined,
      salary: salary || undefined,
      jobType: jobTypes.length > 0 ? jobTypes : undefined,
      experienceLevel: experienceLevels.length > 0 ? experienceLevels : undefined,
      companySize: companySizes.length > 0 ? companySizes : undefined,
      trustScoreMin: trustFilters.includes("verified") ? 90 : undefined,
      status: trustFilters.includes("hideSuspicious")
        ? ["verified", "pending"]
        : undefined,
    };
    onFiltersChange?.(filters);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <Card className="bg-[#0B0C10] border border-[#00AEEF]/30 shadow-lg shadow-[#00AEEF]/10">
        <CardHeader className="pb-3 border-b border-[#2E3A47]">
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00AEEF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            Search Jobs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div className="space-y-2">
            <Label htmlFor="search" className="text-[#C5C6C7] text-sm font-medium">
              Keywords
            </Label>
            <div className="relative">
              <Input
                id="search"
                placeholder="Job title, company, or keywords"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-[#1F2833] border-[#2E3A47] text-white placeholder-[#5D6B7E] focus:border-[#00AEEF] focus:ring-1 focus:ring-[#00AEEF]/50"
              />
              <svg 
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5D6B7E]" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location" className="text-[#C5C6C7] text-sm font-medium">
                Location
              </Label>
              <div className="relative">
                <Input
                  id="location"
                  placeholder="City, state, or remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-[#1F2833] border-[#2E3A47] text-white placeholder-[#5D6B7E] focus:border-[#00AEEF] focus:ring-1 focus:ring-[#00AEEF]/50"
                />
                <svg 
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5D6B7E]" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary" className="text-[#C5C6C7] text-sm font-medium">
                Salary Range
              </Label>
              <Select onValueChange={setSalary} value={salary}>
                <SelectTrigger className="bg-[#1F2833] border-[#2E3A47] text-white hover:border-[#00AEEF]/50 focus:ring-1 focus:ring-[#00AEEF]/50">
                  <SelectValue placeholder="Any" className="text-left" />
                </SelectTrigger>
                <SelectContent className="bg-[#1F2833] border-[#2E3A47] text-white">
                  <SelectItem value="50000" className="hover:bg-[#00AEEF]/10 focus:bg-[#00AEEF]/20">$50,000+</SelectItem>
                  <SelectItem value="75000" className="hover:bg-[#00AEEF]/10 focus:bg-[#00AEEF]/20">$75,000+</SelectItem>
                  <SelectItem value="100000" className="hover:bg-[#00AEEF]/10 focus:bg-[#00AEEF]/20">$100,000+</SelectItem>
                  <SelectItem value="125000" className="hover:bg-[#00AEEF]/10 focus:bg-[#00AEEF]/20">$125,000+</SelectItem>
                  <SelectItem value="150000" className="hover:bg-[#00AEEF]/10 focus:bg-[#00AEEF]/20">$150,000+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Type Filter */}
      <Card className="bg-[#0B0C10] border border-[#00AEEF]/30 shadow-lg shadow-[#00AEEF]/10">
        <CardHeader className="pb-3 border-b border-[#2E3A47]">
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Job Type
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 p-6">
          {[
            { value: "full-time", label: "Full-time" },
            { value: "part-time", label: "Part-time" },
            { value: "contract", label: "Contract" },
            { value: "internship", label: "Internship" },
            { value: "temporary", label: "Temporary" },
          ].map((item) => (
            <div key={item.value} className="flex items-center space-x-3 group">
              <Checkbox
                id={`job-type-${item.value}`}
                checked={jobTypes.includes(item.value)}
                onCheckedChange={(checked) =>
                  toggleArrayValue(setJobTypes, item.value, checked as boolean)
                }
                className="h-5 w-5 rounded border-[#2E3A47] bg-[#1F2833] data-[state=checked]:bg-[#00AEEF] data-[state=checked]:border-[#00AEEF] group-hover:border-[#00AEEF]/50 transition-colors"
              />
              <Label
                htmlFor={`job-type-${item.value}`}
                className="text-sm font-normal text-[#C5C6C7] cursor-pointer group-hover:text-white transition-colors"
              >
                {item.label}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Experience Level Filter */}
      <Card className="bg-[#0B0C10] border border-[#00AEEF]/30 shadow-lg shadow-[#00AEEF]/10">
        <CardHeader className="pb-3 border-b border-[#2E3A47]">
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            Experience Level
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 p-6">
          {[
            { value: "entry", label: "Entry Level" },
            { value: "mid", label: "Mid Level" },
            { value: "senior", label: "Senior" },
            { value: "executive", label: "Executive" },
          ].map((item) => (
            <div key={item.value} className="flex items-center space-x-3 group">
              <Checkbox
                id={`exp-${item.value}`}
                checked={experienceLevels.includes(item.value)}
                onCheckedChange={(checked) =>
                  toggleArrayValue(setExperienceLevels, item.value, checked as boolean)
                }
                className="h-5 w-5 rounded border-[#2E3A47] bg-[#1F2833] data-[state=checked]:bg-[#00AEEF] data-[state=checked]:border-[#00AEEF] group-hover:border-[#00AEEF]/50 transition-colors"
              />
              <Label
                htmlFor={`exp-${item.value}`}
                className="text-sm font-normal text-[#C5C6C7] cursor-pointer group-hover:text-white transition-colors"
              >
                {item.label}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Trust & Safety Filter */}
      <Card className="bg-[#0B0C10] border border-[#00AEEF]/30 shadow-lg shadow-[#00AEEF]/10">
        <CardHeader className="pb-3 border-b border-[#2E3A47]">
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Trust & Safety
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-6">
          <div className="flex items-center space-x-3 group">
            <Checkbox
              id="verified-only"
              checked={trustFilters.includes('verified')}
              onCheckedChange={(checked) =>
                toggleArrayValue(setTrustFilters, 'verified', checked as boolean)
              }
              className="h-5 w-5 rounded border-[#2E3A47] bg-[#1F2833] data-[state=checked]:bg-[#00AEEF] data-[state=checked]:border-[#00AEEF] group-hover:border-[#00AEEF]/50 transition-colors"
            />
            <Label
              htmlFor="verified-only"
              className="text-sm font-normal text-[#C5C6C7] cursor-pointer group-hover:text-white transition-colors"
            >
              Verified Companies Only
            </Label>
          </div>
          <div className="flex items-center space-x-3 group">
            <Checkbox
              id="hide-suspicious"
              checked={trustFilters.includes('hideSuspicious')}
              onCheckedChange={(checked) =>
                toggleArrayValue(setTrustFilters, 'hideSuspicious', checked as boolean)
              }
              className="h-5 w-5 rounded border-[#2E3A47] bg-[#1F2833] data-[state=checked]:bg-[#00AEEF] data-[state=checked]:border-[#00AEEF] group-hover:border-[#00AEEF]/50 transition-colors"
            />
            <Label
              htmlFor="hide-suspicious"
              className="text-sm font-normal text-[#C5C6C7] cursor-pointer group-hover:text-white transition-colors"
            >
              Hide Suspicious Listings
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Apply Filters Button */}
      <Button 
        onClick={applyFilters}
        className="w-full bg-[#00AEEF] hover:bg-[#0095D6] text-white font-medium py-2 px-4 rounded-md transition-colors"
      >
        Apply Filters
      </Button>

      {/* Stats */}
      {stats && (
        <Card className="bg-blue-900/80 border-2 border-white/20 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-white">
              Platform Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-blue-200">Total Jobs</span>
                <span className="font-medium text-white">
                  {stats.totalJobs?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200">Companies</span>
                <span className="font-medium text-white">
                  {stats.companies?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200">New This Week</span>
                <span className="font-medium text-white">
                  {stats.newThisWeek?.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
