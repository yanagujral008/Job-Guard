import React, { useRef, useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { motion, useAnimation, useInView } from 'framer-motion';

interface FeatureCardProps {
  title: string;
  description: string;
  link: string;
  linkText: string;
  icon: React.ReactNode;
  className?: string;
  iconBg: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  link,
  linkText,
  icon,
  className = '',
  iconBg
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();
  const isInView = useInView(cardRef, { once: true, amount: 0.3 });

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    cardRef.current.style.setProperty('--rotate-x', `${rotateX}deg`);
    cardRef.current.style.setProperty('--rotate-y', `${rotateY}deg`);
    
    // Glow effect position
    const glowX = (x / rect.width) * 100;
    const glowY = (y / rect.height) * 100;
    cardRef.current.style.setProperty('--glow-x', `${glowX}%`);
    cardRef.current.style.setProperty('--glow-y', `${glowY}%`);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (cardRef.current) {
      cardRef.current.style.setProperty('--glow-opacity', '0.4');
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (cardRef.current) {
      cardRef.current.style.setProperty('--rotate-x', '0deg');
      cardRef.current.style.setProperty('--rotate-y', '0deg');
      cardRef.current.style.setProperty('--glow-opacity', '0');
    }
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.2,
        duration: 0.8,
        ease: [0.2, 0.6, 0.2, 1],
      },
    }),
    hover: {
      y: -10,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  };

  const iconVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.1,
      rotate: [0, -5, 5, -5, 0],
      transition: { 
        duration: 1,
        ease: 'easeInOut',
        times: [0, 0.2, 0.5, 0.8, 1],
        repeat: Infinity,
        repeatType: 'loop' as const,
      } 
    },
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative p-[2px] rounded-2xl bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-transparent group-hover:from-blue-500/50 group-hover:to-purple-500/50 transition-all duration-500 overflow-hidden ${className}`}
      style={{
        '--rotate-x': '0deg',
        '--rotate-y': '0deg',
        '--glow-x': '50%',
        '--glow-y': '50%',
        '--glow-opacity': '0',
        transform: 'perspective(1000px) rotateX(var(--rotate-x)) rotateY(var(--rotate-y))',
        boxShadow: '0 10px 30px -15px rgba(99, 102, 241, 0.3)',
      } as React.CSSProperties}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      variants={cardVariants}
      initial="hidden"
      animate={controls}
      whileHover="hover"
      custom={parseInt(className.match(/delay-\d+/)?.[0]?.replace('delay-', '') || '0')}
    >
      {/* Animated border gradient */}
      <div className="absolute inset-0 rounded-2xl p-[1px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-transparent group-hover:opacity-100 opacity-0 transition-opacity duration-500 rounded-2xl" />
      </div>
      
      {/* Glow effect */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
        style={{
          background: `radial-gradient(
            600px circle at var(--glow-x) var(--glow-y), 
            rgba(99, 102, 241, var(--glow-opacity)), 
            transparent 40%
          )`,
          zIndex: 0,
        }}
      />
      
      {/* Card content */}
      <div className="relative h-full bg-gray-900/90 backdrop-blur-sm rounded-[calc(1rem-2px)] p-8 z-10">
        <div className="relative z-10 h-full flex flex-col">
          <motion.div 
            className={`w-16 h-16 ${iconBg} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300`}
            variants={iconVariants}
            initial="initial"
            whileHover="hover"
          >
            <div className="text-white text-2xl">
              {icon}
            </div>
          </motion.div>
          
          <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300">
            {title}
          </h3>
          
          <p className="text-gray-300 mb-6 group-hover:text-gray-200 transition-colors duration-300">
            {description}
          </p>
          
          <Button 
            variant="link" 
            className="px-0 text-blue-400 hover:text-blue-300 font-medium flex items-center gap-2 group-hover:gap-3 transition-all duration-300 relative overflow-hidden"
            onClick={() => window.location.href = link}
          >
            <span className="relative">
              {linkText}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
            </span>
            <ArrowRight className="w-4 h-4 transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110" />
          </Button>
        </div>
      </div>
      
      {/* Subtle floating particles */}
      {[1, 2, 3].map((i) => (
        <div 
          key={i}
          className="absolute rounded-full bg-white/5 group-hover:bg-white/10 transition-all duration-700 z-0"
          style={{
            width: `${Math.random() * 8 + 4}px`,
            height: `${Math.random() * 8 + 4}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `float ${Math.random() * 10 + 10}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`,
            opacity: 0.7,
          }}
        />
      ))}
    </motion.div>
  );
};

const FeatureCards: React.FC = () => {
  const features = [
    {
      title: "Find Your Dream Job",
      description: "Discover thousands of job listings tailored to your skills and preferences.",
      link: "/home",
      linkText: "Browse Jobs",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      iconBg: 'bg-blue-500'
    },
    {
      title: "Enhance Your Skills",
      description: "Access our curated courses to upskill and stay ahead in your career.",
      link: "/courses",
      linkText: "Explore Courses",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
      ),
      iconBg: 'bg-green-500'
    },
    {
      title: "Company Insights",
      description: "Get detailed insights and reviews about potential employers.",
      link: "/companies",
      linkText: "View Companies",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      ),
      iconBg: 'bg-purple-500'
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Your Career Journey Starts Here</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover opportunities, enhance your skills, and connect with top employers
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              {...feature}
              className={`delay-${index} ${index === 1 ? 'md:transform md:scale-105' : ''}`}
            />
          ))}
        </div>
        
        <style jsx global>{`
          @keyframes float {
            0%, 100% {
              transform: translateY(0) translateX(0) rotate(0deg);
            }
            25% {
              transform: translateY(-20px) translateX(10px) rotate(5deg);
            }
            50% {
              transform: translateY(-40px) translateX(-10px) rotate(-5deg);
            }
            75% {
              transform: translateY(-20px) translateX(5px) rotate(3deg);
            }
          }
        `}</style>
      </div>
    </section>
  );
};

export default FeatureCards;
