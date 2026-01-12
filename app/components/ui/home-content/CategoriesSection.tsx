// app/components/HomeContent/CategoriesSection.tsx
import React from 'react';
import { Code } from 'lucide-react';
import { categories } from '../../../lib/utils';

interface CategoriesSectionProps {
  onCategoryClick: () => void;
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({ onCategoryClick }) => {
  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Browse by Category</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore projects in your area of interest. From Python to React, we have it all.
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className={`${category.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Code className="w-6 h-6 text-white" />
                </div>
                <span className="text-gray-500 text-sm">{category.count} projects</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
              <p className="text-gray-600 mb-4">
                Complete projects with source code, documentation, and database files.
              </p>
              <button 
                onClick={onCategoryClick}
                className="text-blue-600 font-semibold hover:text-blue-700"
              >
                View Projects →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesSection;