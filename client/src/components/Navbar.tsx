import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Briefcase, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Navbar() {
  const [location, navigate] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/5 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 group-hover:from-blue-400 group-hover:to-purple-500 transition-all duration-300">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                JobGuard
              </span>
              <span className="text-xs text-gray-400 -mt-1 hidden sm:block">Find Your Dream Job</span>
            </div>
          </Link>
          
          {/* Navigation Links */}
          {location !== '/' && (
            <div className="flex-1 flex justify-center space-x-4">
              <Button 
                variant="ghost"
                className="text-white hover:bg-white/10"
                onClick={() => window.location.href = '/'}
              >
                Home
              </Button>
              <Button 
                variant="ghost"
                className="text-white hover:bg-white/10"
                onClick={() => window.location.href = '/home'}
              >
                Jobs
              </Button>
            </div>
          )}
          
          <div className="flex items-center space-x-3">
            {location !== '/' && (
              <div className="hidden md:flex space-x-1">
                <Button 
                  variant="ghost"
                  className="text-white hover:bg-white/10"
                  onClick={() => navigate('/home')}
                >
                  Home
                </Button>
                <Button 
                  variant="ghost"
                  className="text-white hover:bg-white/10"
                  onClick={() => navigate('/home')}
                >
                  Jobs
                </Button>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-0 h-auto rounded-full hover:bg-white/10">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-9 w-9">
                          {user?.photoURL ? (
                            <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />
                          ) : (
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                              {user?.displayName 
                                ? user.displayName.charAt(0).toUpperCase() 
                                : user?.email 
                                  ? user.email.charAt(0).toUpperCase() 
                                  : 'U'}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <ChevronDown className="h-4 w-4 text-white" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-gray-900 border-gray-700 text-white" align="end">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.displayName || 'User'}</p>
                        <p className="text-xs leading-none text-gray-400">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem 
                      className="cursor-pointer text-red-400 hover:bg-red-900/30 focus:bg-red-900/30"
                      onClick={async () => {
                        try {
                          await logout();
                          navigate('/');
                        } catch (error) {
                          console.error('Failed to log out:', error);
                        }
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost"
                    className="text-white hover:bg-white/10"
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </Button>
                  <Button 
                    variant="outline"
                    className="bg-transparent border-white/20 text-white hover:bg-white/10"
                    onClick={() => navigate('/signup')}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
              
              <Button 
                className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
                onClick={() => navigate('/home')}
              >
                Start Your Journey
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
