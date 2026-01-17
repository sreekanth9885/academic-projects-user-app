// app/components/HomeContent/ProjectCard.tsx
import React from 'react';
import { Eye, Download, Calendar } from 'lucide-react';
import { formatDate, getPriceDisplay } from '../../../lib/utils';
import { Project } from '@/app/lib/types';

interface ProjectCardProps {
  project: Project;
  onViewDetails: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onViewDetails }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-wrap gap-2">
            {project.category.split(', ').slice(0, 2).map((cat, index) => (
              <span key={index} className="bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
                {cat.trim()}
              </span>
            ))}
            {project.category.split(', ').length > 2 && (
              <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
                +{project.category.split(', ').length - 2} more
              </span>
            )}
          </div>
          <span className={`text-lg font-bold ${
            project.price === 0 ? 'text-green-600' : 'text-gray-900'
          }`}>
            {getPriceDisplay(project.price)}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{project.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2 h-12">{project.description}</p>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Added: {formatDate(project.created_at)}
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-blue-600">
            {project.documentation && (
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                <span>Documentation</span>
              </div>
            )}
            {project.code_files && (
              <div className="flex items-center text-green-600">
                <Download className="w-4 h-4 mr-1" />
                <span>Source Code</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <button 
          onClick={() => onViewDetails(project)}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 cursor-pointer"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;