import { Link, useLocation } from "wouter";
import { Bell, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

export default function Header() {
  const [location, setLocation] = useLocation();
  const [user] = useAuthState(auth);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/home", label: "Jobs" },
    { path: "/courses", label: "Courses" },
    { path: "/companies", label: "Companies" },
    { path: "/reports", label: "Reports" },
  ];

  const handleLogout = async () => {
    await signOut(auth);
    setLocation("/login");
  };

  return (
    <header className="bg-black shadow-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-[#3B82F6] rounded-lg flex items-center justify-center">
                <Shield className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold text-white">JobGuard</span>
            </Link>

            <nav className="hidden md:flex space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`transition-colors pb-4 ${
                    location === item.path
                      ? "text-white font-medium border-b-2 border-[#3B82F6]"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            

            <div className="flex items-center space-x-3">
              {user ? (
                <>
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-300 truncate max-w-[120px]">
                    {user.email?.split("@")[0]}
                  </span>

                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-700"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="default" size="sm" className="bg-[#3B82F6] hover:bg-[#2563EB] text-white">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button variant="default" size="sm" className="bg-[#3B82F6] hover:bg-[#2563EB] text-white">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
