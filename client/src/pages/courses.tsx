import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Clock, User, BookOpen } from "lucide-react";

export default function Courses() {
  const [category, setCategory] = useState<string>("");
  const [search, setSearch] = useState("");
  const [priceFilter, setPriceFilter] = useState<string>("");

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["/api/courses", category],
  }) as { data: any[], isLoading: boolean };

  const filteredCourses = courses.filter((course: any) => {
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) ||
                         course.description.toLowerCase().includes(search.toLowerCase());
    const matchesPrice = !priceFilter || priceFilter === "all" ||
                        (priceFilter === "free" && course.isFree) ||
                        (priceFilter === "paid" && !course.isFree);
    return matchesSearch && matchesPrice;
  });

  const categories = [
    { value: "", label: "All Categories" },
    { value: "web-dev", label: "Web Development" },
    { value: "data-science", label: "Data Science" },
    { value: "cybersecurity", label: "Cybersecurity" },
    { value: "mobile-dev", label: "Mobile Development" },
    { value: "design", label: "UI/UX Design" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Courses & Training</h1>
          <p className="text-gray-600">
            Level up your skills with our curated collection of courses and bootcamps
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Input
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="md:w-80"
          />
          
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="md:w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={priceFilter} onValueChange={setPriceFilter}>
            <SelectTrigger className="md:w-32">
              <SelectValue placeholder="Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Course Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <Skeleton className="h-48 w-full rounded-t-lg" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-12" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course: any) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                <div className={`h-48 flex items-center justify-center ${
                  course.category === 'web-dev' 
                    ? 'bg-gradient-to-br from-blue-400 to-purple-500' 
                    : 'bg-gradient-to-br from-green-400 to-blue-500'
                }`}>
                  <i className={`${course.thumbnail} text-white text-4xl`}></i>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                      {course.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    {course.instructor && (
                      <span className="flex items-center">
                        <User size={14} className="mr-1" />
                        {course.instructor}
                      </span>
                    )}
                    {course.duration && (
                      <span className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        {course.duration}
                      </span>
                    )}
                  </div>

                  {course.tags && course.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {course.tags.slice(0, 3).map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant={course.isFree ? "secondary" : "default"}>
                        {course.isFree ? "Free" : `$${course.price}`}
                      </Badge>
                      {course.rating && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{course.rating}</span>
                        </div>
                      )}
                    </div>
                    
                    <Button size="sm">
                      {course.isFree ? "Enroll Free" : "View Course"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredCourses.length === 0 && !isLoading && (
          <Card>
            <CardContent className="p-12 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">No courses found matching your criteria.</p>
              <p className="text-sm text-gray-400 mt-2">Try adjusting your search or filters.</p>
            </CardContent>
          </Card>
        )}

        {/* Featured Partners */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Partner Bootcamps</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Scaler Academy", description: "Comprehensive software engineering program", logo: "fas fa-code" },
              { name: "Masai School", description: "Full-stack development bootcamp", logo: "fas fa-laptop-code" },
              { name: "Coding Ninjas", description: "Programming and data structures", logo: "fas fa-terminal" },
            ].map((partner) => (
              <Card key={partner.name} className="text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className={`${partner.logo} text-primary text-2xl`}></i>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{partner.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{partner.description}</p>
                  <Button variant="outline" size="sm">Learn More</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
