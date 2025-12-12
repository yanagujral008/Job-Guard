import React, { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Bookmark, MapPin, Briefcase, Clock, ArrowRight } from "lucide-react";

interface JobCardProps {
  job: {
    id?: string;
    company_name: string;
    company_logo?: string;
    title: string;
    location?: string;
    tags?: string[];
    url: string;
    experienceLevel?: string;
  };
  isSaved: boolean;
  onSaveToggle: () => void;
}

// Helper function to get initials from company name
const getInitials = (name: string) => {
  if (!name) return '??';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Map company names to local image paths
const getLocalLogoPath = (companyName: string): string | null => {
  if (!companyName) return null;
  
  // Normalize company name for filename
  const normalized = companyName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
    
  // Check if we have a local image for this company
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp'];
  for (const ext of imageExtensions) {
    const imagePath = `/images/company-logos/${normalized}${ext}`;
    // This is a simplified check - in a real app, you'd want to verify the file exists
    return imagePath;
  }
  
  return null;
};

// Custom hook for image loading with fallbacks
const useImageWithFallback = (src: string | undefined, companyName: string) => {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const localImagePath = companyName ? getLocalLogoPath(companyName) : null;

  useEffect(() => {
    if (!src) {
      // Try to use local image if no source provided
      if (localImagePath) {
        setImgSrc(localImagePath);
        setError(false);
      } else {
        setError(true);
      }
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    const controller = new AbortController();
    const signal = controller.signal;

    const loadImage = async () => {
      try {
        // Try direct load first
        const img = new Image();
        
        // Create a promise to handle image loading
        const loadPromise = new Promise((resolve, reject) => {
          img.onload = () => resolve(true);
          img.onerror = () => reject(new Error('Image failed to load'));
          img.src = src;
        });

        // Set a timeout for the image load
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Image load timeout')), 3000)
        );

        // Race the load against the timeout
        await Promise.race([loadPromise, timeoutPromise]);
        
        if (isMounted) {
          setImgSrc(src);
          setError(false);
        }
      } catch (err) {
        if (isMounted) {
          // If direct load fails, try with a proxy
          try {
            const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(src)}&w=100&h=100&fit=cover`;
            const img = new Image();
            
            img.onload = () => {
              if (isMounted) {
                setImgSrc(proxyUrl);
                setError(false);
              }
            };
            
            img.onerror = () => {
              if (isMounted) setError(true);
            };
            
            img.src = proxyUrl;
            return;
          } catch (proxyErr) {
            if (isMounted) setError(true);
          }
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadImage();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [src]);

  // Return the appropriate source or fallback
  if (isLoading) return { src: null, isLoading: true, error: false };
  if (error || !imgSrc) {
    // First try local image
    if (localImagePath) {
      return { src: localImagePath, isLoading: false, error: false };
    }
    
    // Then try to get a fallback from a placeholder service
    try {
      const initials = getInitials(companyName);
      const placeholderUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=3B82F6&color=fff&size=128`;
      return { src: placeholderUrl, isLoading: false, error: true };
    } catch (e) {
      // If all else fails, return null
      return { src: null, isLoading: false, error: true };
    }
  }
  
  return { src: imgSrc, isLoading: false, error: false };
};

const JobCard: React.FC<JobCardProps> = ({ job, isSaved, onSaveToggle }) => {
  const { src: logoUrl, isLoading } = useImageWithFallback(job.company_logo, job.company_name);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 30;
    const rotateY = (centerX - x) / 30;
    
    cardRef.current.style.setProperty('--rotate-x', `${rotateX}deg`);
    cardRef.current.style.setProperty('--rotate-y', `${rotateY}deg`);
    
    // Glow effect
    const glowX = (x / rect.width) * 100;
    const glowY = (y / rect.height) * 100;
    cardRef.current.style.setProperty('--glow-x', `${glowX}%`);
    cardRef.current.style.setProperty('--glow-y', `${glowY}%`);
  };
  
  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.setProperty('--rotate-x', '0deg');
      cardRef.current.style.setProperty('--rotate-y', '0deg');
      cardRef.current.style.setProperty('--glow-opacity', '0');
      setIsHovered(false);
    }
  };
  
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (cardRef.current) {
      cardRef.current.style.setProperty('--glow-opacity', '0.2');
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
        '--rotate-x': '0deg',
        '--rotate-y': '0deg',
      } as React.CSSProperties}
    >
      {/* Glow effect */}
      <div 
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle at var(--glow-x) var(--glow-y), rgba(59, 130, 246, 0.3), transparent 50%)',
          opacity: 'var(--glow-opacity)',
        }}
      />
      
      <Card 
        className="w-full h-full bg-gradient-to-br from-[#0F172A] to-[#1E293B] border border-[#334155] relative z-10 overflow-hidden transition-all duration-300"
        style={{
          transform: 'perspective(1000px) rotateX(var(--rotate-x)) rotateY(var(--rotate-y))',
          boxShadow: isHovered 
            ? '0 25px 50px -12px rgba(59, 130, 246, 0.3), 0 0 30px rgba(59, 130, 246, 0.2)'
            : '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease-out'
        }}
      >
        <CardHeader className="flex flex-row items-start gap-4 relative z-10">
          <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl overflow-hidden shadow-lg group-hover:shadow-blue-500/20 transition-all duration-300 transform group-hover:scale-110">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-700 animate-pulse" />
            ) : logoUrl ? (
              <img
                src={logoUrl}
                alt={`${job.company_name} logo`}
                className="w-full h-full object-contain p-2 bg-white group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  const initials = getInitials(job.company_name);
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=3B82F6&color=fff&size=128`;
                  target.className = 'w-full h-full object-cover';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform duration-300">
                {getInitials(job.company_name)}
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <CardTitle className="text-[#E2E8F0] group-hover:text-blue-400 transition-colors duration-300 truncate">
                {job.title}
              </CardTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSaveToggle();
                }}
              >
                <Bookmark 
                  className={`h-4 w-4 transition-all duration-300 ${isSaved ? 'fill-yellow-400 text-yellow-400' : ''}`}
                />
              </Button>
            </div>
            
            <p className="text-sm font-medium text-blue-300 mt-1 flex items-center">
              <Briefcase className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
              <span className="truncate">{job.company_name}</span>
            </p>
            
            {job.location && (
              <p className="text-xs text-gray-300 mt-1 flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                <span className="truncate">{job.location}</span>
              </p>
            )}
            
            {job.experienceLevel && (
              <div className="mt-2">
                <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-300 border-blue-400/20 hover:bg-blue-500/20">
                  {job.experienceLevel}
                </Badge>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0 pb-6 px-6 space-y-4 text-[#E2E8F0] relative z-10">
          {job.tags && job.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 -mt-2 mb-3">
              {job.tags.slice(0, 4).map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs bg-[#1E293B] text-[#E2E8F0]/80 border-[#334155] hover:bg-[#334155] hover:scale-105 transition-all duration-200 group/tag"
                >
                  <span className="group-hover/tag:text-blue-300 transition-colors">{tag}</span>
                </Badge>
              ))}
            </div>
          )}
          
          <div className="flex justify-between items-center mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="group/button bg-transparent border-blue-500/40 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/60 hover:text-blue-300 transition-all duration-300 flex items-center gap-2 overflow-hidden relative"
              onClick={(e) => {
                e.preventDefault();
                window.open(job.url, '_blank', 'noopener,noreferrer');
              }}
            >
              <span className="relative z-10 flex items-center">
                View Job
                <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover/button:translate-x-1 transition-transform duration-300" />
              </span>
              <span className="absolute inset-0 w-0 bg-gradient-to-r from-blue-500/10 to-transparent group-hover/button:w-full transition-all duration-500 -skew-x-12" />
            </Button>
            
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400 flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1 text-blue-400" />
                Just now
              </span>
            </div>
          </div>
          
          {/* Shine effect on hover */}
          <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
            <div className="absolute -inset-full top-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shine transition-opacity duration-300" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobCard;
