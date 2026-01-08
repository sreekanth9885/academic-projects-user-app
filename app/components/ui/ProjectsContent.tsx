'use client';

import { useState, useEffect } from 'react';
import { Download, Eye, Calendar, Tag, DollarSign } from 'lucide-react';

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

export default function ProjectsContent() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const getPriceDisplay = (price: string) => {
    const priceNum = parseFloat(price);
    if (priceNum === 0) return 'FREE';
    return `$${priceNum.toFixed(2)}`;
  };

  const handleDownload = (project: Project) => {
    if (parseFloat(project.price) === 0) {
      alert(`Downloading free project: ${project.title}`);
      // Here you would implement the actual download logic
    } else {
      alert(`Purchasing project: ${project.title} for $${project.price}`);
      // Here you would implement the purchase logic
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading projects...</p>
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">All Projects</h1>
          <p className="text-gray-600 text-lg">
            Browse through our collection of complete academic projects with source code and documentation.
            <span className="block text-sm text-gray-500 mt-2">
              Showing {projects.length} projects
            </span>
          </p>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No projects available</h3>
            <p className="text-gray-500">Check back soon for new academic projects!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100">
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
                    <div className={`text-lg font-bold px-3 py-1 rounded-lg ${
                      parseFloat(project.price) === 0 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {getPriceDisplay(project.price)}
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
                  
                  <button
                    onClick={() => handleDownload(project)}
                    className={`w-full py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 ${
                      parseFloat(project.price) === 0
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    }`}
                  >
                    {parseFloat(project.price) === 0 ? 'Download Free' : 'Purchase Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Section */}
        {projects.length > 0 && (
          <div className="mt-16 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Projects Statistics</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl text-center shadow-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {projects.length}
                </div>
                <div className="text-gray-700 font-semibold">Total Projects</div>
              </div>
              <div className="bg-white p-6 rounded-xl text-center shadow-lg">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {projects.filter(p => parseFloat(p.price) === 0).length}
                </div>
                <div className="text-gray-700 font-semibold">Free Projects</div>
              </div>
              <div className="bg-white p-6 rounded-xl text-center shadow-lg">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  ${projects.reduce((sum, p) => sum + parseFloat(p.price), 0).toFixed(2)}
                </div>
                <div className="text-gray-700 font-semibold">Total Value</div>
              </div>
              <div className="bg-white p-6 rounded-xl text-center shadow-lg">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {Array.from(new Set(projects.flatMap(p => p.category.split(', ')))).length}
                </div>
                <div className="text-gray-700 font-semibold">Unique Categories</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}