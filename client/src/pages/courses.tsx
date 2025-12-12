import { useState, useEffect, useRef } from "react";
import Header from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Clock, User, BookOpen, ArrowRight } from "lucide-react";

// 3D Card Component
const CourseCard = ({ course }: { course: any }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    
    // Glow effect
    const glowX = (x / rect.width) * 100;
    const glowY = (y / rect.height) * 100;
    cardRef.current.style.setProperty('--glow-x', `${glowX}%`);
    cardRef.current.style.setProperty('--glow-y', `${glowY}%`);
  };
  
  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
      cardRef.current.style.setProperty('--glow-opacity', '0');
    }
  };
  
  const handleMouseEnter = () => {
    if (cardRef.current) {
      cardRef.current.style.setProperty('--glow-opacity', '0.3');
    }
  };

  return (
    <div 
      ref={cardRef}
      className="relative group h-full transition-transform duration-500 ease-out will-change-transform"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        '--glow-opacity': '0',
        '--glow-x': '50%',
        '--glow-y': '50%',
      } as React.CSSProperties}
    >
      {/* Glow effect */}
      <div 
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at var(--glow-x) var(--glow-y), rgba(0, 174, 239, 0.2), transparent 50%)',
          opacity: 'var(--glow-opacity)',
          zIndex: 0,
        }}
      />
      
      <Card className="h-full bg-[#1F2833] border-[#2E3A47] hover:border-[#00AEEF]/50 transition-all overflow-hidden group-hover:shadow-[0_0_30px_rgba(0,174,239,0.3)] relative z-10">
        <div className="relative overflow-hidden">
          <div className="h-48 overflow-hidden">
            <img 
              src={course.image} 
              alt={course.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210203171024/CS.png';
              }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <Button 
              size="sm" 
              className="bg-[#00AEEF] hover:bg-[#0095D6] text-white transform -translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-1"
              onClick={() => window.open(course.url, '_blank')}
            >
              View Course
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        <CardContent className="p-6 relative z-10 bg-[#1F2833] flex flex-col h-[calc(100%-12rem)]">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-white line-clamp-2 group-hover:text-[#00AEEF] transition-colors mb-2">
              {course.title}
            </h3>

            <p className="text-[#C5C6C7] text-sm line-clamp-3">
              {course.description}
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-[#2E3A47]">
            <div className="flex justify-between items-center">
              <Badge 
                variant="secondary"
                className="bg-green-500/20 text-green-400 hover:bg-green-500/30 group-hover:scale-105 transition-transform"
              >
                Free
              </Badge>
              <a 
                href={course.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-[#00AEEF] hover:underline flex items-center"
              >
                Learn more <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </a>
            </div>
          </div>
        </CardContent>
        
        {/* Shine effect on hover */}
        <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
          <div className="absolute -inset-full top-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shine transition-opacity duration-300"></div>
        </div>
      </Card>
    </div>
  );
};

export default function Courses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState<string>("");
  const [search, setSearch] = useState("");
  const [priceFilter, setPriceFilter] = useState<string>("");

  useEffect(() => {
    fetch("/gfg_courses.json")
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load courses:", err);
        setIsLoading(false);
      });
  }, []);

  const filteredCourses = courses.filter((course) => {
    // Search filter - check title and description
    const searchLower = search.toLowerCase();
    const matchesSearch = search === "" ||
      course.title.toLowerCase().includes(searchLower) ||
      (course.description && course.description.toLowerCase().includes(searchLower));

    // Since all courses in gfg_courses.json appear to be free, we'll handle the price filter accordingly
    const matchesPrice = 
      !priceFilter || 
      priceFilter === "all" || 
      priceFilter === "free"; // Only show free courses or all courses

    // Category filter - since we don't have categories in the data, we'll show all if no category is selected
    const matchesCategory = !category || category === "" || category === "all";
    
    return matchesSearch && matchesPrice && matchesCategory;
  });

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "web-dev", label: "Web Development" },
    { value: "data-science", label: "Data Science" },
    { value: "cybersecurity", label: "Cybersecurity" },
    { value: "mobile-dev", label: "Mobile Development" },
    { value: "design", label: "UI/UX Design" },
  ];

  return (
    <div className="min-h-screen bg-[#0B0C10]">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Courses & Training</h1>
          <p className="text-[#C5C6C7]">
            Level up your skills with our curated collection of courses and bootcamps
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Input
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="md:w-80 bg-[#1F2833] border-[#2E3A47] text-white placeholder-[#5D6B7E] focus:border-[#00AEEF] focus:ring-1 focus:ring-[#00AEEF]/50"
          />

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="md:w-48 bg-[#1F2833] border-[#2E3A47] text-white hover:border-[#00AEEF]/50 focus:ring-1 focus:ring-[#00AEEF]/50">
              <SelectValue placeholder="All Categories" className="text-left" />
            </SelectTrigger>
            <SelectContent className="bg-[#1F2833] border-[#2E3A47] text-white">
              {categories.map((cat) => (
                <SelectItem 
                  key={cat.value} 
                  value={cat.value}
                  className="hover:bg-[#00AEEF]/10 focus:bg-[#00AEEF]/20"
                >
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={priceFilter} onValueChange={setPriceFilter}>
            <SelectTrigger className="md:w-32 bg-[#1F2833] border-[#2E3A47] text-white hover:border-[#00AEEF]/50 focus:ring-1 focus:ring-[#00AEEF]/50">
              <SelectValue placeholder="Price" className="text-left" />
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
              <div key={i} className="relative h-full">
                <Card className="h-full bg-[#1F2833] border-[#2E3A47] overflow-hidden">
                  <Skeleton className="h-48 w-full rounded-t-lg bg-[#2E3A47]" />
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-2 bg-[#2E3A47]" />
                    <Skeleton className="h-4 w-full mb-4 bg-[#2E3A47]" />
                    <div className="flex justify-between">
                      <Skeleton className="h-6 w-16 bg-[#2E3A47]" />
                      <Skeleton className="h-6 w-12 bg-[#2E3A47]" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-2">
            {filteredCourses.map((course: any) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}

        {filteredCourses.length === 0 && !isLoading && (
          <Card>
            <CardContent className="p-12 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">No courses found matching your criteria.</p>
              <p className="text-sm text-gray-400 mt-2">
                Try adjusting your search or filters.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
