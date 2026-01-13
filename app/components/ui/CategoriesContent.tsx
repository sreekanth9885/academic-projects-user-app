'use client';

import { useState, useEffect } from 'react';
import { Code, Smartphone, Monitor, Cpu, Database, Wifi, Shield, Globe,  FileCode } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  price: string;
  category: string;
  created_at: string;
  documentation: string | null;
  code_files: string | null;
}

const getCategoryIcon = (category: string) => {
  const cat = category.toLowerCase();
  // if (cat.includes('python')) return <Python className="w-8 h-8" />;
  if (cat.includes('web') || cat.includes('html') || cat.includes('css')) return <Globe className="w-8 h-8" />;
  if (cat.includes('mobile') || cat.includes('android') || cat.includes('ios')) return <Smartphone className="w-8 h-8" />;
  if (cat.includes('react') || cat.includes('javascript') || cat.includes('typescript')) return <FileCode className="w-8 h-8" />;
  if (cat.includes('database') || cat.includes('sql')) return <Database className="w-8 h-8" />;
  if (cat.includes('ai') || cat.includes('machine') || cat.includes('learning')) return <Cpu className="w-8 h-8" />;
  return <Code className="w-8 h-8" />;
};

const getCategoryColor = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('python')) return 'bg-green-500';
  if (cat.includes('web') || cat.includes('html') || cat.includes('css')) return 'bg-blue-500';
  if (cat.includes('react') || cat.includes('javascript') || cat.includes('typescript')) return 'bg-yellow-500';
  if (cat.includes('mobile')) return 'bg-purple-500';
  if (cat.includes('database')) return 'bg-pink-500';
  if (cat.includes('ai') || cat.includes('machine')) return 'bg-red-500';
  return 'bg-gray-500';
};

export default function CategoriesContent() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://academicprojects.org/api/projects.php');
      const data = await response.json();
      
      if (data.status === 'success') {
        setProjects(data.data);
      } else {
        setError('Failed to fetch projects');
      }
    } catch (err) {
      setError('Error fetching projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Extract unique categories from projects
  const getUniqueCategories = () => {
    const allCategories = projects.flatMap(project => 
      project.category.split(', ').map(cat => cat.trim())
    );
    
    const categoryCounts: Record<string, number> = {};
    allCategories.forEach(cat => {
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });
    
    return Object.entries(categoryCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  };

  const getCategoryProjects = (category: string) => {
    return projects.filter(project => 
      project.category.split(', ').some(cat => cat.trim() === category)
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Categories</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchProjects}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const categories = getUniqueCategories();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Browse Categories</h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Explore projects by category. Each category contains complete projects with source code, documentation, and database.
          </p>
          <div className="mt-4 text-sm text-gray-500">
            {categories.length} categories • {projects.length} projects
          </div>
        </div>

        {/* Categories Grid */}
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📂</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No categories available</h3>
            <p className="text-gray-500">Projects will be categorized soon!</p>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => {
                const categoryProjects = getCategoryProjects(category.name);
                const freeCount = categoryProjects.filter(p => parseFloat(p.price) === 0).length;
                
                return (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 cursor-pointer ${
                      selectedCategory === category.name 
                        ? 'border-blue-500 ring-2 ring-blue-100' 
                        : 'border-gray-100 hover:border-blue-200'
                    } text-left`}
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`${getCategoryColor(category.name)} w-12 h-12 rounded-lg flex items-center justify-center text-white`}>
                        {getCategoryIcon(category.name)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{category.name}</h3>
                        <span className="text-sm text-gray-500">{category.count} projects</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total: {categoryProjects.length}</span>
                        {freeCount > 0 && (
                          <span className="text-green-600 font-semibold">{freeCount} free</span>
                        )}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full cur"
                          style={{ width: `${Math.min(100, (category.count / projects.length) * 300)}%` }}
                        ></div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Category Details */}
            {selectedCategory && (
              <div className="mt-12 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100 animate-slideDown">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className={`${getCategoryColor(selectedCategory)} w-12 h-12 rounded-lg flex items-center justify-center text-white`}>
                      {getCategoryIcon(selectedCategory)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedCategory} Projects</h2>
                      <p className="text-gray-600">
                        {getCategoryProjects(selectedCategory).length} projects available
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedCategory(null)}
                    className="text-gray-500 hover:text-gray-700 p-2 hover:bg-white rounded-lg transition-colors"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="mb-6">
                  <p className="text-gray-700">
                    Browse through {getCategoryProjects(selectedCategory).length} projects in the {selectedCategory} category. 
                    Each project includes complete source code, documentation, database files, and installation guide.
                  </p>
                </div>
                
                {getCategoryProjects(selectedCategory).length > 0 && (
                  <div className="mb-6 grid md:grid-cols-2 gap-4">
                    {getCategoryProjects(selectedCategory).slice(0, 2).map(project => (
                      <div key={project.id} className="bg-white p-4 rounded-lg border border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-1">{project.title}</h4>
                        <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
                        <div className="flex justify-between items-center mt-3">
                          <span className={`text-sm font-semibold ${
                            parseFloat(project.price) === 0 ? 'text-green-600' : 'text-blue-600'
                          }`}>
                            {parseFloat(project.price) === 0 ? 'FREE' : `$${project.price}`}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(project.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex space-x-4">
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 cursor-pointer">
                    View All {selectedCategory} Projects
                  </button>
                  <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold border border-blue-200 hover:bg-blue-50 transition-all duration-300 cursor-pointer">
                    Download Sample
                  </button>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="mt-16 p-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Categories Overview</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl text-center shadow-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {categories.length}
                  </div>
                  <div className="text-gray-700 font-semibold">Total Categories</div>
                </div>
                <div className="bg-white p-6 rounded-xl text-center shadow-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {projects.filter(p => parseFloat(p.price) === 0).length}
                  </div>
                  <div className="text-gray-700 font-semibold">Free Projects</div>
                </div>
                <div className="bg-white p-6 rounded-xl text-center shadow-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {categories.reduce((max, cat) => Math.max(max, cat.count), 0)}
                  </div>
                  <div className="text-gray-700 font-semibold">Most Popular Category</div>
                </div>
                <div className="bg-white p-6 rounded-xl text-center shadow-lg">
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    {Math.round(projects.length / categories.length)}
                  </div>
                  <div className="text-gray-700 font-semibold">Avg Projects per Category</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}