'use client';

import ProjectCard from './ProjectCard';
import { useState, useEffect } from 'react';
import { Loader2, Filter } from 'lucide-react';
import { Project } from '../lib/types';
import { projectService } from '../lib/api';

interface ProjectGridProps {
  onPurchase: (project: Project) => void;
}

export default function ProjectGrid({ onPurchase }: ProjectGridProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, searchTerm, selectedCategory, selectedDifficulty]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getAllProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = [...projects];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
        // project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(project => project.difficulty === selectedDifficulty);
    }

    setFilteredProjects(filtered);
  };

  const categories = ['all', ...new Set(projects.map(p => p.category))];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
        <p className="text-gray-600">Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          RSS Academic <span className="text-primary-600">Projects</span> Marketplace
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover ready-to-use academic projects with complete documentation and source code
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search projects, technologies, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
              />
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>

          <div className="flex gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none bg-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none bg-white"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>
                  {difficulty === 'all' ? 'All Levels' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-gray-600">
          Showing <span className="font-bold text-gray-900">{filteredProjects.length}</span> of {projects.length} projects
        </p>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No projects found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onPurchase={onPurchase}
            />
          ))}
        </div>
      )}
    </div>
  );
}