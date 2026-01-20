'use client';

import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import HeroSection from './HeroSection';
import ProjectCard from './ProjectCard';
import CategoriesSection from './CategoriesSection';
import StatsSection from './StatsSection';
import BenefitsSection from './BenefitsSection';
import ProjectModal from './ProjectModal';
import { API_BASE_URL, HeaderProps, Project } from '@/app/lib/types';
import { useProjectPurchase } from '@/app/hooks/useProjectPurchase';

const HomeContent: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const {
  paymentStatus,
  customerInfo,
  showCustomerForm,
  paymentMessage,
  setCustomerInfo,
  setShowCustomerForm,
  setPaymentStatus,
  handlePurchase
} = useProjectPurchase();
  useEffect(() => {
    fetchProjects();
  }, []);
  useEffect(() => {
  if (paymentStatus === 'success') {
    const timer = setTimeout(() => {
      setIsDetailsModalOpen(false);
      setPaymentStatus('pending');
      setCustomerInfo({ name: '', email: '', phone: '' });
      setShowCustomerForm(false);
    }, 3000); // allow download to start

    return () => clearTimeout(timer);
  }
}, [paymentStatus]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/projects.php`);
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

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
    setIsDetailsModalOpen(true);
    setPaymentStatus('pending');
    setShowCustomerForm(false);
    setCustomerInfo({ name: '', email: '', phone: '' });
  };

  const handleBrowseProjects = () => {
    setCurrentView('projects');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewFreeProjects = () => {
    setCurrentView('freeprojects');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryClick = () => {
    setCurrentView('categories');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleCloseModal = () => {
    setIsDetailsModalOpen(false);
    setPaymentStatus('pending');
    setCustomerInfo({ name: '', email: '', phone: '' });
    setShowCustomerForm(false);
  };

  const handleBackToProject = () => {
    setShowCustomerForm(false);
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
      <HeroSection 
        onBrowseProjects={handleBrowseProjects}
        onViewFreeProjects={handleViewFreeProjects}
      />

      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Latest Projects</h2>
            <p className="text-gray-600 mt-2">Recently added academic projects</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>Updated daily</span>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No projects available</h3>
            <p className="text-gray-500">Check back soon for new academic projects!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.slice(0, 6).map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onViewDetails={handleViewDetails} 
              />
            ))}
          </div>
        )}
      </div>

      <CategoriesSection onCategoryClick={handleCategoryClick} />
      <StatsSection projects={projects} />
      <BenefitsSection />

      <ProjectModal
        selectedProject={selectedProject}
        isOpen={isDetailsModalOpen}
        paymentStatus={paymentStatus}
        customerInfo={customerInfo}
        showCustomerForm={showCustomerForm}
        onClose={handleCloseModal}
        onPurchase={handlePurchase}
        onBackToProject={handleBackToProject}
        onCustomerInfoChange={setCustomerInfo}
        onShowCustomerForm={setShowCustomerForm}
        paymentMessage={paymentMessage}
      />
    </div>
  );
};

export default HomeContent;