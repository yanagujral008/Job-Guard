import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [, setLocation] = useLocation();

  // Get redirect URL from query params
  const getRedirectUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('redirect') || '/';
  };

  // Auto redirect if user already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLocation(getRedirectUrl());
      }
    });
    return () => unsubscribe();
  }, [setLocation]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLocation(getRedirectUrl()); // redirect to intended page or home after successful login
    } catch (err: any) {
      setError(err.message);
    }
  };

  // 3D card effect state
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    setRotate({
      x: (y - centerY) / 20,
      y: (centerX - x) / 20
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8">
        <div className="w-full max-w-6xl">
          <div 
            className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
              transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
              boxShadow: isHovered 
                ? '0 25px 50px -12px rgba(99, 102, 241, 0.3), 0 0 30px rgba(99, 102, 241, 0.2)'
                : '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease-out'
            }}
          >
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-600/20 rounded-full filter blur-3xl"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600/20 rounded-full filter blur-3xl"></div>
            </div>
            
            <div className="flex flex-col md:flex-row">
              {/* Welcome Section */}
              <div className="relative z-10 p-8 md:p-12 md:w-1/2 text-white border-r border-white/10">
                <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300">
                  Welcome to JobGuard
                </h1>
                <div className="space-y-4">
                  <p className="text-lg leading-relaxed text-gray-200">
                    JobGuard is your trusted platform to discover the best job opportunities,
                    explore courses, and connect with top companies all in one place.
                  </p>
                  <p className="text-gray-300">
                    Our mission is to empower your career growth by making job searching
                    simple, fast, and effective.
                  </p>
                  <div className="p-4 bg-white/5 rounded-lg border-l-4 border-indigo-400">
                    <p className="text-indigo-200 font-medium">
                      Join thousands of users who have found their dream jobs through JobGuard.
                    </p>
                  </div>
                </div>
              </div>

              {/* Login Form */}
              <div className="relative z-10 p-8 md:p-12 md:w-1/2">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 mb-2">
                    Welcome Back
                  </h2>
                  <p className="text-gray-400">Please sign in to continue</p>
                </div>

                {error && <p className="text-red-300 text-center mb-4">{error}</p>}

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg opacity-0 group-hover:opacity-100 blur transition duration-200"></div>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-3 text-indigo-300" />
                      <input
                        type="email"
                        placeholder="Email"
                        className="pl-10 pr-4 py-3 rounded-lg bg-gray-800/80 border border-gray-700 text-white placeholder-gray-400 focus:outline-none w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="relative group mt-6">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg opacity-0 group-hover:opacity-100 blur transition duration-200"></div>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-3 text-indigo-300" />
                      <input
                        type="password"
                        placeholder="Password"
                        className="pl-10 pr-4 py-3 rounded-lg bg-gray-800/80 border border-gray-700 text-white placeholder-gray-400 focus:outline-none w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="relative group mt-8">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg opacity-75 group-hover:opacity-100 blur transition duration-200"></div>
                    <button
                      type="submit"
                      className="relative w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg text-white font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all duration-200 transform group-hover:scale-[1.02]"
                    >
                      <span className="relative z-10 flex items-center justify-center">
                        <span className="mr-2">🚀</span> Login to Your Account
                      </span>
                    </button>
                  </div>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-gray-400">
                    Don't have an account?{" "}
                    <a 
                      href="/signup" 
                      className="text-indigo-300 font-medium hover:text-white transition-colors duration-200 hover:underline hover:underline-offset-4 hover:decoration-indigo-400"
                    >
                      Create an account
                    </a>
                  </p>
                  <div className="mt-4 flex items-center justify-center space-x-4">
                    <span className="h-px flex-1 bg-gray-700"></span>
                    <span className="text-sm text-gray-500">or continue with</span>
                    <span className="h-px flex-1 bg-gray-700"></span>
                  </div>
                  <div className="mt-4 flex justify-center space-x-4">
                    <button type="button" className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 text-gray-300 hover:text-white transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0022 12.06C22 6.53 17.5 2.04 12 2.04Z" />
                      </svg>
                    </button>
                    <button type="button" className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 text-gray-300 hover:text-white transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z" />
                      </svg>
                    </button>
                    <button type="button" className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 text-gray-300 hover:text-white transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22.46 6.42c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.37-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26,4 16,4c-2.35,0-4.27,1.92-4.27,4.29,0,.34.04.67.11.98C8.28,9.09 5.11,7.38 3,4.79c-.37.63-.58,1.37-.58,2.15,0,1.49.75,2.81,1.91,3.56-.71,0-1.37-.2-1.95-.5v.03c0,2.08,1.48,3.82,3.44,4.21a4.22,4.22,0,0,1-1.93.07,4.28,4.28,0,0,0,4,2.98,8.521,8.521,0,0,1-5.33,1.84c-.34,0-.68-.02-1.02-.06C3.44,20.29 5.7,21 8.12,21 16,21 20.33,14.46 20.33,8.79c0-.19,0-.37-.01-.56.84-.6,1.56-1.36,2.14-2.23z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
