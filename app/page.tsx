'use client';

import { useState } from 'react';
import { ShoppingBag, GraduationCap, Code, Rocket, Database } from 'lucide-react';
import { Project } from './lib/types';
import ProjectGrid from './components/ProjectGrid';
import CheckoutModal from './components/CheckoutModal';

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handlePurchase = (project: Project) => {
    setSelectedProject(project);
    setIsCheckoutOpen(true);
  };

  const handlePaymentSuccess = (paymentId: string, project: Project) => {
    console.log('Purchase successful:', { paymentId, project });
    // You can track downloads, send emails, etc.
    
    // Show success notification
    if (paymentId === 'free-download') {
      alert(`Free download started for: ${project.title}`);
    } else {
      alert(`Payment successful! Downloading ${project.title}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      {/* <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Academic Projects Marketplace
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Ready-to-use academic projects with complete source code and documentation
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
              <Database className="inline mr-2" size={20} />
              <span>40+ Projects Available</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
              <Code className="inline mr-2" size={20} />
              <span>Complete Source Code</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
              <GraduationCap className="inline mr-2" size={20} />
              <span>Academic Ready</span>
            </div>
          </div>
        </div>
      </div> */}
      
      <ProjectGrid onPurchase={handlePurchase} />
      
      {/* Features Section */}
      <div className="bg-gray-900 text-white py-16 mt-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Projects?</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="font-bold text-xl mb-2">Ready to Run</h3>
              <p className="text-gray-400">Complete, working projects with database</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="font-bold text-xl mb-2">Academic Focus</h3>
              <p className="text-gray-400">Perfect for students and final year projects</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="font-bold text-xl mb-2">Instant Access</h3>
              <p className="text-gray-400">Download immediately after purchase</p>
            </div>
            
            <div className="text-center">
              <div className="bg-red-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="font-bold text-xl mb-2">Free Updates</h3>
              <p className="text-gray-400">Get bug fixes and improvements</p>
            </div>
          </div>
        </div>
      </div>

      <CheckoutModal
        project={selectedProject}
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}