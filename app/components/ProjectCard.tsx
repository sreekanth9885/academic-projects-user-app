'use client';

import { Star, Download, Clock, Tag, ShoppingCart, Zap, FileText, Code } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import { Project } from '../lib/types';

interface ProjectCardProps {
  project: Project;
  onPurchase: (project: Project) => void;
}

export default function ProjectCard({ project, onPurchase }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const discountPercentage = project.discounted_price 
    ? Math.round(((project.price - project.discounted_price) / project.price) * 100)
    : 0;

  const hasDocumentation = !!project.documentation;
  const hasCodeFiles = !!project.code_files;

  return (
    <div 
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
            {discountPercentage}% OFF
          </span>
        </div>
      )}

      {/* File Type Badges */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        {hasDocumentation && (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md flex items-center gap-1">
            <FileText size={10} />
            Docs
          </span>
        )}
        {hasCodeFiles && (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md flex items-center gap-1">
            <Code size={10} />
            Code
          </span>
        )}
      </div>

      {/* Difficulty Badge */}
      <div className="absolute top-12 right-4 z-10">
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
          project.difficulty === 'beginner' 
            ? 'bg-green-100 text-green-800'
            : project.difficulty === 'intermediate'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}>
          { 'Intermediate'}
        </span>
      </div>

      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <div className={`transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}>
          {/* Use placeholder if no thumbnail */}
          <div 
            className="w-full h-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
            }}
          >
            <div className="text-white text-center p-4">
              <div className="text-4xl mb-2">📚</div>
              <h3 className="text-xl font-bold">{project.category}</h3>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
        
        {/* Quick View Overlay */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <button 
            onClick={() => onPurchase(project)}
            className="bg-white/90 backdrop-blur-sm text-gray-900 px-6 py-3 rounded-full font-semibold flex items-center gap-2 hover:bg-white transition-colors"
          >
            <Zap size={18} />
            Buy Now
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Category */}
        <div className="flex items-center gap-2 mb-3">
          <Tag size={14} className="text-gray-400" />
          <span className="text-sm text-gray-500 font-medium">{project.category}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
          {project.description.length > 150 
            ? `${project.description.substring(0, 150)}...` 
            : project.description}
        </p>

        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.slice(0, 3).map((tech:any, index:any) => (
              <span 
                key={index}
                className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-md font-medium"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {/* Rating */}
            <div className="flex items-center gap-1">
              <Star size={16} className="fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-gray-900">{project.rating?.toFixed(1) || '4.5'}</span>
              <span className="text-gray-400 text-sm">({project.reviews_count || 0})</span>
            </div>

            {/* Downloads */}
            <div className="flex items-center gap-1">
              <Download size={16} className="text-gray-400" />
              <span className="text-gray-600 text-sm">{project.downloads || 0}</span>
            </div>

            {/* Delivery Time */}
            <div className="flex items-center gap-1">
              <Clock size={16} className="text-gray-400" />
              <span className="text-gray-600 text-sm">Instant</span>
            </div>
          </div>
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-baseline gap-2">
            {project.discounted_price ? (
              <>
                <span className="text-2xl font-bold text-gray-900">
                  ₹{project.discounted_price}
                </span>
                <span className="text-lg text-gray-400 line-through">
                  ₹{project.price}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-gray-900">
                ₹{project.price}
              </span>
            )}
          </div>

          <button
            onClick={() => onPurchase(project)}
            className="px-6 py-2.5 bg-primary-600 text-black rounded-lg font-semibold hover:bg-primary-700 active:scale-95 transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <ShoppingCart size={18} />
            {project.price === 0 ? 'Download Free' : 'Purchase'}
          </button>
        </div>
      </div>
    </div>
  );
}