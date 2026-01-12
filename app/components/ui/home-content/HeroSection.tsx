// app/components/HomeContent/HeroSection.tsx
import React from 'react';

interface HeroSectionProps {
  onBrowseProjects: () => void;
  onViewFreeProjects: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onBrowseProjects, onViewFreeProjects }) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Academic Projects
            <span className="block text-3xl md:text-5xl font-light mt-2">For Students & Developers</span>
          </h1>
          <p className="text-xl mb-10 opacity-90">
            Complete, ready-to-run projects with source code, documentation, and database
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={onBrowseProjects}
              className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Browse Projects
            </button>
            <button 
              onClick={onViewFreeProjects}
              className="bg-transparent border-2 border-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300"
            >
              View Free Projects
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;