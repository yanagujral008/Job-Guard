import { useLocation } from 'wouter';
import { Briefcase, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Suspense, lazy } from 'react';
import LaptopMockup from '@/components/LaptopMockup';
import Navbar from '@/components/Navbar';
import FeatureCards from '@/components/FeatureCards';
import Footer from '@/components/Footer';
import AnimatedHeading from '@/components/AnimatedHeading';
import './landing.css';

// Dynamically import ThreeDBackground with React.lazy
const ThreeDBackground = lazy(() => import('../components/ThreeDBackground'));

const LandingPage = () => {
  const [_, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">
      {/* 3D Background with Suspense */}
      <Suspense fallback={null}>
        <ThreeDBackground />
      </Suspense>
      
      {/* Content Wrapper */}
      <div className="relative z-10">
        {/* Navigation */}
        <Navbar />
        
        {/* Add padding to account for fixed navbar */}
        <div className="pt-24">
        {/* Hero Section */}
        <div className="container mx-auto px-6 py-16 md:py-24">
          <AnimatedHeading />
          
          <motion.div 
            className="mt-16 max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <LaptopMockup 
              imageUrl="/images/career-dashboard.png"
              title="Job Search Dashboard"
              subtitle="Find and apply to jobs that match your skills and preferences"
            />
          </motion.div>
        </div>

        {/* Feature Cards Section */}
        <div className="bg-gray-900 py-16">
          <FeatureCards />
        </div>

        {/* Testimonials/Stats Section */}
        <div className="py-16 bg-black">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="text-center p-8 bg-gray-900 rounded-xl">
                <div className="text-4xl font-bold text-blue-400 mb-2">10,000+</div>
                <p className="text-gray-300">Active Job Listings</p>
              </div>
              <div className="text-center p-8 bg-gray-900 rounded-xl">
                <div className="text-4xl font-bold text-green-400 mb-2">5,000+</div>
                <p className="text-gray-300">Companies Hiring</p>
              </div>
              <div className="text-center p-8 bg-gray-900 rounded-xl">
                <div className="text-4xl font-bold text-purple-400 mb-2">1M+</div>
                <p className="text-gray-300">Monthly Job Seekers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
