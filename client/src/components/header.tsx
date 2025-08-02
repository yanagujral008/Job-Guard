import { Link, useLocation } from "wouter";
import { Bell, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Jobs" },
    { path: "/courses", label: "Courses" },
    { path: "/companies", label: "Companies" },
    { path: "/reports", label: "Reports" },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold text-primary">JobGuard</span>
            </Link>
            
            <nav className="hidden md:flex space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`transition-colors pb-4 ${
                    location === item.path
                      ? "text-primary font-medium border-b-2 border-primary"
                      : "text-gray-600 hover:text-primary"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">JD</span>
              </div>
              <span className="hidden md:block text-sm font-medium">John Doe</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
