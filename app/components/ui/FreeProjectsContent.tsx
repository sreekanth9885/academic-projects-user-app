'use client';

import { useState, useEffect } from 'react';
import { Download, Star, Eye, Calendar, TrendingUp, FileText, Code } from 'lucide-react';

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

export default function FreeProjectsContent() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const freeProjects = projects.filter(p => parseFloat(p.price) === 0);
  
  const filteredProjects = filter === 'all' 
    ? freeProjects 
    : freeProjects.filter(project => 
        project.category.toLowerCase().includes(filter.toLowerCase())
      );

  const getUniqueCategories = () => {
    const allCategories = freeProjects.flatMap(p => 
      p.category.split(', ').map(cat => cat.trim())
    );
    return Array.from(new Set(allCategories));
  };

  const handleDownload = (project: Project) => {
    // alert(`Downloading free project: ${project.title}`);
    // Here you would implement the actual download logic
    window.open(`https://academicprojects.org/api/uploads/${project.code_files}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading free projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Projects</h2>
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Free Projects</h1>
              <p className="text-gray-600">
                Download high-quality academic projects for free. No payment required.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="inline-flex items-center bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-full">
                <Download className="w-5 h-5 mr-2" />
                <span className="font-semibold">{freeProjects.length} Free Projects</span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-8">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                filter === 'all' 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              All Free Projects
            </button>
            
            {getUniqueCategories().slice(0, 4).map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                  filter === category 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
            
            {getUniqueCategories().length > 4 && (
              <span className="text-gray-500 text-sm flex items-center">
                +{getUniqueCategories().length - 4} more categories
              </span>
            )}
          </div>
        </div>

        {/* Projects Grid */}
        {freeProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🎁</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No free projects available</h3>
            <p className="text-gray-500">Check back soon for free academic projects!</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No projects found for "{filter}"</h3>
            <button 
              onClick={() => setFilter('all')}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              View all free projects
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold px-4 py-2 text-center">
                  <Star className="w-4 h-4 inline mr-2" />
                  100% FREE
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-wrap gap-2">
                      {project.category.split(', ').slice(0, 2).map((cat, index) => (
                        <span key={index} className="bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
                          {cat.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-1">{project.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2 h-12">{project.description}</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      Added: {formatDate(project.created_at)}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm">
                      {project.documentation && (
                        <div className="flex items-center text-blue-600">
                          <FileText className="w-4 h-4 mr-1" />
                          <span>PDF Documentation</span>
                        </div>
                      )}
                      {project.code_files && (
                        <div className="flex items-center text-green-600">
                          <Code className="w-4 h-4 mr-1" />
                          <span>Source Code Included</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDownload(project)}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Now (Free)
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        {freeProjects.length > 0 && (
          <div className="mt-16 p-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Free Projects Statistics</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl text-center shadow-lg">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {freeProjects.length}
                </div>
                <div className="text-gray-700 font-semibold">Total Free Projects</div>
              </div>
              <div className="bg-white p-6 rounded-xl text-center shadow-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {getUniqueCategories().length}
                </div>
                <div className="text-gray-700 font-semibold">Categories Available</div>
              </div>
              <div className="bg-white p-6 rounded-xl text-center shadow-lg">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {freeProjects.filter(p => p.documentation).length}
                </div>
                <div className="text-gray-700 font-semibold">With Documentation</div>
              </div>
              <div className="bg-white p-6 rounded-xl text-center shadow-lg">
                <TrendingUp className="w-12 h-12 text-orange-500 mx-auto mb-3" />
                <div className="text-gray-700 font-semibold">Updated Regularly</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}