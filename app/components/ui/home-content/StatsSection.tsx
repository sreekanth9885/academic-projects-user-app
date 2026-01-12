// app/components/HomeContent/StatsSection.tsx
import { Project } from '@/app/lib/types';
import React from 'react';

interface StatsSectionProps {
  projects: Project[];
}

const StatsSection: React.FC<StatsSectionProps> = ({ projects }) => {
  const totalProjects = projects.length;
  const freeProjects = projects.filter(p => p.price === 0).length;
  const totalCategories = Array.from(new Set(projects.flatMap(p => p.category.split(', ')))).length;

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold mb-2">{totalProjects}</div>
            <div className="opacity-90">Total Projects</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">{freeProjects}</div>
            <div className="opacity-90">Free Projects</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">{totalCategories}</div>
            <div className="opacity-90">Categories</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">24/7</div>
            <div className="opacity-90">Support Available</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;