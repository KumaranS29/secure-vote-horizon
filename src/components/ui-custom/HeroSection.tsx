
import React from 'react';
import HeroBackground from './hero/HeroBackground';
import HeroContent from './hero/HeroContent';
import ElectionCard from './hero/ElectionCard';

const HeroSection: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white to-blue-50 pt-16 pb-24">
      <HeroBackground />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <HeroContent />
          
          {/* Hero Image */}
          <ElectionCard />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
