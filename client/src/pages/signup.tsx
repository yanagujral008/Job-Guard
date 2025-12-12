import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { FaEnvelope, FaLock, FaUser, FaBuilding } from "react-icons/fa";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState("");
  const [, setLocation] = useLocation();
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setLocation("/");
    } catch (err: any) {
      setError(err.message);
    }
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
                  Join JobGuard Today
                </h1>
                <div className="space-y-4">
                  <p className="text-lg leading-relaxed text-gray-200">
                    Create your JobGuard account to unlock access to thousands of job opportunities,
                    career resources, and professional networks.
                  </p>
                  <p className="text-gray-300">
                    Our platform is designed to help you find the perfect job match and advance your career.
                  </p>
                  <div className="p-4 bg-white/5 rounded-lg border-l-4 border-indigo-400">
                    <p className="text-indigo-200 font-medium">
                      Join our community of professionals and take the next step in your career journey.
                    </p>
                  </div>
                </div>
              </div>

              {/* Signup Form */}
              <div className="relative z-10 p-8 md:p-12 md:w-1/2">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 mb-2">
                    Create Account
                  </h2>
                  <p className="text-gray-400">Start your journey with us</p>
                </div>

                {error && <p className="text-red-300 text-center mb-4">{error}</p>}

                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg opacity-0 group-hover:opacity-100 blur transition duration-200"></div>
                    <div className="relative">
                      <FaUser className="absolute left-3 top-3 text-indigo-300" />
                      <input
                        type="text"
                        placeholder="Full Name"
                        className="pl-10 pr-4 py-3 rounded-lg bg-gray-800/80 border border-gray-700 text-white placeholder-gray-400 focus:outline-none w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

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

                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg opacity-0 group-hover:opacity-100 blur transition duration-200"></div>
                    <div className="relative">
                      <FaBuilding className="absolute left-3 top-3 text-indigo-300" />
                      <input
                        type="text"
                        placeholder="Company (Optional)"
                        className="pl-10 pr-4 py-3 rounded-lg bg-gray-800/80 border border-gray-700 text-white placeholder-gray-400 focus:outline-none w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="relative group">
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

                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg opacity-0 group-hover:opacity-100 blur transition duration-200"></div>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-3 text-indigo-300" />
                      <input
                        type="password"
                        placeholder="Confirm Password"
                        className="pl-10 pr-4 py-3 rounded-lg bg-gray-800/80 border border-gray-700 text-white placeholder-gray-400 focus:outline-none w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                        <span className="mr-2">🚀</span> Create Account
                      </span>
                    </button>
                  </div>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-gray-400">
                    Already have an account?{" "}
                    <a 
                      href="/login" 
                      className="text-indigo-300 font-medium hover:text-white transition-colors duration-200 hover:underline hover:underline-offset-4 hover:decoration-indigo-400"
                    >
                      Sign In
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
