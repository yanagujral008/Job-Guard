import React from 'react';

interface LaptopMockupProps {
  className?: string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
}

const LaptopMockup: React.FC<LaptopMockupProps> = ({ 
  className = '',
  imageUrl,
  title = 'Your Career Dashboard',
  subtitle = 'Track your job applications, interviews, and offers all in one place'
}) => {
  return (
    <div className={`relative w-full max-w-4xl mx-auto ${className}`}>
      {/* Laptop Screen */}
      <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[16px] rounded-t-xl h-[200px] md:h-[300px] lg:h-[400px] w-full">
        {/* Screen Content */}
        <div className="relative h-full w-full overflow-hidden rounded">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${imageUrl})`,
              filter: 'brightness(0.7)'
            }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/30 flex flex-col justify-end p-8 text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">{title}</h2>
              <p className="text-lg md:text-xl text-gray-200">{subtitle}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Laptop Base */}
      <div className="relative mx-auto bg-gray-800 dark:bg-gray-800 rounded-b-xl rounded-t-sm h-[20px] w-[70%] md:w-[80%] lg:w-[90%]">
        <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 rounded-b-xl w-32 h-4 bg-gray-700"></div>
      </div>
    </div>
  );
};

export default LaptopMockup;
