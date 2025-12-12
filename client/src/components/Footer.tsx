import React from 'react';
import { Link } from 'wouter';
import { Briefcase, Building2, FileText, User, Mail, Twitter, Linkedin, Github } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white pt-16 pb-8 border-t border-gray-800">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">JobGuard</span>
            </div>
            <p className="text-gray-400">Connecting talent with opportunity. Find your dream job or your next great hire.</p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors" aria-label="GitHub">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* For Job Seekers */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4 flex items-center">
              <User className="h-4 w-4 mr-2 text-blue-400" />
              Job Seekers
            </h3>
            <ul className="space-y-3">
              <li><Link href="/jobs" className="text-gray-400 hover:text-white transition-colors flex items-center">
                <span className="w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                Browse Jobs
              </Link></li>
              <li><Link href="/resume-builder" className="text-gray-400 hover:text-white transition-colors flex items-center">
                <span className="w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                Resume Builder
              </Link></li>
              <li><Link href="/job-alerts" className="text-gray-400 hover:text-white transition-colors flex items-center">
                <span className="w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                Job Alerts
              </Link></li>
              <li><Link href="/career-advice" className="text-gray-400 hover:text-white transition-colors flex items-center">
                <span className="w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                Career Advice
              </Link></li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4 flex items-center">
              <Building2 className="h-4 w-4 mr-2 text-purple-400" />
              Employers
            </h3>
            <ul className="space-y-3">
              <li><Link href="/post-job" className="text-gray-400 hover:text-white transition-colors flex items-center">
                <span className="w-1 h-1 bg-purple-400 rounded-full mr-2"></span>
                Post a Job
              </Link></li>
              <li><Link href="/pricing" className="text-gray-400 hover:text-white transition-colors flex items-center">
                <span className="w-1 h-1 bg-purple-400 rounded-full mr-2"></span>
                Pricing Plans
              </Link></li>
              <li><Link href="/recruitment-solutions" className="text-gray-400 hover:text-white transition-colors flex items-center">
                <span className="w-1 h-1 bg-purple-400 rounded-full mr-2"></span>
                Recruitment Solutions
              </Link></li>
              <li><Link href="/employer-dashboard" className="text-gray-400 hover:text-white transition-colors flex items-center">
                <span className="w-1 h-1 bg-purple-400 rounded-full mr-2"></span>
                Employer Dashboard
              </Link></li>
            </ul>
          </div>

          {/* Resources & Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4 flex items-center">
              <FileText className="h-4 w-4 mr-2 text-green-400" />
              Resources
            </h3>
            <ul className="space-y-3">
              <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors flex items-center">
                <span className="w-1 h-1 bg-green-400 rounded-full mr-2"></span>
                Career Blog
              </Link></li>
              <li><Link href="/resume-tips" className="text-gray-400 hover:text-white transition-colors flex items-center">
                <span className="w-1 h-1 bg-green-400 rounded-full mr-2"></span>
                Resume Tips
              </Link></li>
              <li><Link href="/interview-tips" className="text-gray-400 hover:text-white transition-colors flex items-center">
                <span className="w-1 h-1 bg-green-400 rounded-full mr-2"></span>
                Interview Tips
              </Link></li>
              <li><Link href="/help-center" className="text-gray-400 hover:text-white transition-colors flex items-center">
                <span className="w-1 h-1 bg-green-400 rounded-full mr-2"></span>
                Help Center
              </Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} JobGuard. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</Link>
            <span className="text-gray-600">•</span>
            <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</Link>
            <span className="text-gray-600">•</span>
            <Link href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</Link>
            <span className="text-gray-600">•</span>
            <Link href="/sitemap" className="text-gray-400 hover:text-white text-sm transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
