'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, GraduationCap, Code, Rocket, Database, Star, Award, Zap, Download, Eye, Calendar, X, FileText, Tag, Globe, User, Clock } from 'lucide-react';
import Razorpay from 'razorpay';
declare global {
  interface Window {
    Razorpay: any;
  }
}
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

interface HeaderProps {
  currentView: 'home' | 'projects' | 'categories' | 'freeprojects';
  setCurrentView: (view: 'home' | 'projects' | 'categories' | 'freeprojects') => void;
}

export default function HomeContent({ currentView, setCurrentView }: HeaderProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending');
const [downloadData, setDownloadData] = useState<{
  download_link?: string;
  payment_id?: string;
  order_id?: string;
} | null>(null);
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

  const categories = [
    { name: 'Web Development', count: 45, color: 'bg-blue-500' },
    { name: 'Python', count: 28, color: 'bg-green-500' },
    { name: 'JavaScript', count: 32, color: 'bg-purple-500' },
    { name: 'TypeScript', count: 19, color: 'bg-red-500' },
    { name: 'React', count: 25, color: 'bg-yellow-500' },
    { name: 'PHP', count: 18, color: 'bg-pink-500' },
  ];

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
    return `Rs.${priceNum}/-`;
  };

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
    setIsDetailsModalOpen(true);
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

  const handlePurchase = async (project: Project) => {
  if (parseFloat(project.price) === 0) {
    // Handle free download
    setPaymentStatus('success');
    setDownloadData({
      download_link: `https://academicprojects.org/download.php?project_id=${project.id}&type=free`,
      payment_id: `FREE_${Date.now()}`,
      order_id: `FREE_ORDER_${Date.now()}`
    });
    alert(`Downloading free project: ${project.title}`);
  } else {
    try {
      setPaymentStatus('pending');
      
      // Step 1: Create order on your backend
      const orderResponse = await fetch('https://academicprojects.org/api/create-order.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_id: project.id,
          project_title: project.title,
          amount: parseFloat(project.price),
          name: 'Customer Name',
          email: 'customer@email.com'
        })
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      // Step 2: Load Razorpay script dynamically
      const loadRazorpayScript = () => {
        return new Promise((resolve) => {
          if (window.Razorpay) {
            resolve(true);
            return;
          }
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      };

      if (!window.Razorpay) {
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          throw new Error('Failed to load Razorpay SDK');
        }
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Step 3: Open Razorpay checkout
      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Academic Projects',
        description: `Purchase: ${project.title}`,
        image: '/logo.png',
        order_id: orderData.order_id,
        handler: async function (response: any) {
          try {
            // Step 4: Verify payment on your backend
            const verifyResponse = await fetch('https://academicprojects.org/api/verify-payment.php', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              // Payment successful - update state
              setPaymentStatus('success');
              setDownloadData({
                download_link: verifyData.download_link,
                payment_id: response.razorpay_payment_id,
                order_id: response.razorpay_order_id
              });
              
              // Don't close modal - let user see download button
              alert('Payment successful! You can now download the project from the modal.');
            } else {
              setPaymentStatus('failed');
              alert('Payment verification failed: ' + verifyData.error);
            }
          } catch (error) {
            setPaymentStatus('failed');
            console.error('Verification error:', error);
            alert('Error verifying payment. Please contact support.');
          }
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@email.com',
          contact: '9999999999'
        },
        notes: {
          project_id: project.id,
          project_title: project.title
        },
        theme: {
          color: '#667eea'
        },
        modal: {
          ondismiss: function() {
            console.log('Payment modal closed');
            setPaymentStatus('pending');
          }
        }
      };

      if (typeof window.Razorpay === 'function') {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        throw new Error('Razorpay SDK not loaded properly');
      }

    } catch (error) {
      setPaymentStatus('failed');
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    }
  }
};

// Add a function to handle download
const handleDownload = () => {
  if (downloadData?.download_link) {
    // Open download in new tab
    window.open(downloadData.download_link, '_blank');
    
    // You can also trigger a direct download
    // const link = document.createElement('a');
    // link.href = downloadData.download_link;
    // link.download = selectedProject?.title || 'project';
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
    
    // Optional: Log download or show confirmation
    console.log(`Downloading project with Payment ID: ${downloadData.payment_id}`);
  }
};

// Add a function to reset payment state when modal closes
const handleCloseModal = () => {
  setIsDetailsModalOpen(false);
  setPaymentStatus('pending');
  setDownloadData(null);
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
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Academic Projects
              <span className="block text-3xl md:text-5xl font-light mt-2">For Students & Developers</span>
            </h1>
            <p className="text-xl mb-10 opacity-90">
              Complete, ready-to-run projects with source code, documentation, and database
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleBrowseProjects}
                className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Browse Projects
              </button>
              <button 
                onClick={handleViewFreeProjects}
                className="bg-transparent border-2 border-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300"
              >
                View Free Projects
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Projects */}
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
                    <span className={`text-lg font-bold ${
                      parseFloat(project.price) === 0 ? 'text-green-600' : 'text-gray-900'
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
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      {project.documentation && (
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          <span>Documentation</span>
                        </div>
                      )}
                      {project.code_files && (
                        <div className="flex items-center">
                          <Download className="w-4 h-4 mr-1" />
                          <span>Source Code</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <button 
                    onClick={() => handleViewDetails(project)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Categories */}
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
                  onClick={handleCategoryClick}
                  className="text-blue-600 font-semibold hover:text-blue-700"
                >
                  View Projects →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">{projects.length}</div>
              <div className="opacity-90">Total Projects</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">
                {projects.filter(p => parseFloat(p.price) === 0).length}
              </div>
              <div className="opacity-90">Free Projects</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">
                {Array.from(new Set(projects.flatMap(p => p.category.split(', ')))).length}
              </div>
              <div className="opacity-90">Categories</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="opacity-90">Support Available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose Academic Projects?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="font-bold text-xl mb-3">Ready to Run</h3>
              <p className="text-gray-600">Complete, working projects with database setup</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <GraduationCap className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="font-bold text-xl mb-3">Academic Focus</h3>
              <p className="text-gray-600">Perfect for students and final year projects</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="font-bold text-xl mb-3">Instant Access</h3>
              <p className="text-gray-600">Download immediately after purchase</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-br from-orange-100 to-red-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="font-bold text-xl mb-3">Free Updates</h3>
              <p className="text-gray-600">Get bug fixes and improvements for free</p>
            </div>
          </div>
        </div>
      </div>

      {/* Project Details Modal */}
      {/* Project Details Modal */}
{isDetailsModalOpen && selectedProject && (
  <>
    {/* Background overlay */}
    <div 
      className="fixed inset-0 bg-black/30 bg-opacity-100 z-[9999]"
      onClick={() => setIsDetailsModalOpen(false)}
    ></div>
    
    {/* Modal content */}
    <div className="fixed inset-0 flex items-center justify-center p-4 z-[10000]">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              Project Details
            </h3>
          </div>
          <button
            onClick={() => setIsDetailsModalOpen(false)}
            className="text-gray-400 hover:text-gray-500 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="p-6">
            <div className="space-y-6">
              {/* Project header */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedProject.title}</h2>
                  <div className={`text-xl font-bold px-4 py-2 rounded-lg ${
                    parseFloat(selectedProject.price) === 0 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {getPriceDisplay(selectedProject.price)}
                  </div>
                </div>
                
                <p className="text-gray-600 text-lg">{selectedProject.description}</p>
              </div>

              {/* Project details grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left column */}
                <div className="space-y-6">
                  {/* Categories */}
                  <div>
                    <h4 className="flex items-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      <Tag className="w-4 h-4 mr-2" />
                      Categories
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.category.split(', ').map((cat, index) => (
                        <span 
                          key={index} 
                          className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium border border-blue-100"
                        >
                          {cat.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Project info */}
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-5 h-5 mr-3 text-gray-400" />
                      <div>
                        <div className="font-medium">Date Added</div>
                        <div className="text-sm">{formatDate(selectedProject.created_at)}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-5 h-5 mr-3 text-gray-400" />
                      <div>
                        <div className="font-medium">Availability</div>
                        <div className="text-sm">Instant Download</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right column */}
                <div className="space-y-6">
                  {/* Included files */}
                  <div>
                    <h4 className="flex items-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      <Download className="w-4 h-4 mr-2" />
                      Included Files
                    </h4>
                    <div className="space-y-3">
                      {selectedProject.documentation && (
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center">
                            <FileText className="w-5 h-5 mr-3 text-blue-500" />
                            <div>
                              <div className="font-medium">Documentation</div>
                              <div className="text-sm text-gray-500">PDF file with complete guide</div>
                            </div>
                          </div>
                          <span className="text-sm text-green-600 font-medium">Included</span>
                        </div>
                      )}
                      
                      {selectedProject.code_files && (
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center">
                            <Code className="w-5 h-5 mr-3 text-green-500" />
                            <div>
                              <div className="font-medium">Source Code</div>
                              <div className="text-sm text-gray-500">Complete project source files</div>
                            </div>
                          </div>
                          <span className="text-sm text-green-600 font-medium">Included</span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center">
                          <Database className="w-5 h-5 mr-3 text-purple-500" />
                          <div>
                            <div className="font-medium">Database</div>
                            <div className="text-sm text-gray-500">SQL files with sample data</div>
                          </div>
                        </div>
                        <span className="text-sm text-green-600 font-medium">Included</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div>
                <h4 className="flex items-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  <Award className="w-4 h-4 mr-2" />
                  Project Features
                </h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Complete source code with comments
                  </div>
                  <div className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Step-by-step installation guide
                  </div>
                  <div className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Database schema and sample data
                  </div>
                  <div className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Responsive design (where applicable)
                  </div>
                  <div className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Admin panel access
                  </div>
                  <div className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Free technical support
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => handlePurchase(selectedProject)}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${
                parseFloat(selectedProject.price) === 0
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
              }`}
            >
              {paymentStatus==='success' ? (
                <div className="flex items-center justify-center">
                  <Download className="w-5 h-5 mr-2" />
                  Download Now (Free)
                </div>
              ) : (
                `Purchase Now - ${getPriceDisplay(selectedProject.price)}`
              )}
            </button>
            <button
              onClick={() => setIsDetailsModalOpen(false)}
              className="flex-1 py-3 rounded-xl font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
)}
    </div>
  );
}