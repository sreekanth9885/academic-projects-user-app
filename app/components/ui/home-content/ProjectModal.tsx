// app/components/HomeContent/ProjectModal.tsx
import React, { useState } from 'react';
import { 
  FileText, Tag, Calendar, Clock, Download, Code, Database, Award, 
  X, User, Mail, Phone, CheckCircle, XCircle, AlertCircle, Mail as MailIcon
} from 'lucide-react';
import { formatDate, getPriceDisplay, validateCustomerInfo } from '../../../lib/utils';
import { CustomerInfo, Project } from '@/app/lib/types';

interface ProjectModalProps {
  selectedProject: Project | null;
  isOpen: boolean;
  paymentStatus: 'pending' | 'success' | 'failed';
  customerInfo: CustomerInfo;
  showCustomerForm: boolean;
  onClose: () => void;
  onPurchase: (project: Project) => Promise<void>;
  onBackToProject: () => void;
  onCustomerInfoChange: (info: CustomerInfo) => void;
  onShowCustomerForm: (show: boolean) => void;
  paymentMessage?: string; // Add this prop
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  selectedProject,
  isOpen,
  paymentStatus,
  customerInfo,
  showCustomerForm,
  onClose,
  onPurchase,
  onBackToProject,
  onCustomerInfoChange,
  onShowCustomerForm,
  paymentMessage, // Add this prop
}) => {
  const [localCustomerInfo, setLocalCustomerInfo] = useState<CustomerInfo>(customerInfo);

  if (!isOpen || !selectedProject) return null;

  const handleCustomerInfoChange = (field: keyof CustomerInfo, value: string) => {
    const updated = { ...localCustomerInfo, [field]: value };
    setLocalCustomerInfo(updated);
    onCustomerInfoChange(updated);
  };

  const handlePurchaseClick = () => {
    if (selectedProject.price === 0) {
      if (!validateCustomerInfo(localCustomerInfo)) return;
      onPurchase(selectedProject);
    } else {
      if (!showCustomerForm) {
        onShowCustomerForm(true);
      } else {
        if (!validateCustomerInfo(localCustomerInfo)) return;
        onPurchase(selectedProject);
      }
    }
  };

  const renderContent = () => {
    if (paymentStatus === 'success') {
      return (
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Success!</h3>
          
          {/* Payment/Email Status Messages */}
          {paymentMessage ? (
            <div className="mb-6">
              <p className="text-gray-600">{paymentMessage}</p>
              {paymentMessage.includes('email') && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-center text-blue-700">
                    <MailIcon className="w-5 h-5 mr-2" />
                    <span className="font-medium">Check your inbox and spam folder</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-600 mb-6">
              Your files are being processed. You will receive an email with download instructions shortly.
            </p>
          )}
          
          <div className="animate-pulse">
            <div className="flex items-center justify-center space-x-2">
              <Download className="w-5 h-5 text-blue-600" />
              <span className="text-blue-600 font-medium">Processing your request...</span>
            </div>
          </div>
        </div>
      );
    }

    if (paymentStatus === 'failed') {
      return (
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h3>
          
          {/* Payment Error Message */}
          {paymentMessage ? (
            <p className="text-gray-600 mb-6">{paymentMessage}</p>
          ) : (
            <p className="text-gray-600 mb-6">
              There was an issue processing your payment. Please try again or contact support.
            </p>
          )}
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => onPurchase(selectedProject)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
            >
              Try Again
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      );
    }

    if (showCustomerForm) {
      return (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-4">Enter Your Contact Details</h4>
            <p className="text-gray-600 mb-6">We need your information to process the order and send download links.</p>
          </div>

          {/* Show any pending messages during payment */}
          {paymentStatus === 'pending' && paymentMessage && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center text-blue-700">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span className="font-medium">{paymentMessage}</span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Full Name *
                </div>
              </label>
              <input
                type="text"
                value={localCustomerInfo.name}
                onChange={(e) => handleCustomerInfoChange('name', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Address *
                </div>
              </label>
              <input
                type="email"
                value={localCustomerInfo.email}
                onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email address"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  Phone Number *
                </div>
              </label>
              <input
                type="tel"
                value={localCustomerInfo.phone}
                onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your phone number"
                required
              />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Show payment pending message if any */}
        {paymentStatus === 'pending' && paymentMessage && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center text-blue-700">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span className="font-medium">{paymentMessage}</span>
            </div>
          </div>
        )}

        <div>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{selectedProject.title}</h2>
            <div className={`text-xl font-bold px-4 py-2 rounded-lg ${
              selectedProject.price === 0 
                ? 'bg-green-100 text-green-700' 
                : 'bg-blue-100 text-blue-700'
            }`}>
              {getPriceDisplay(selectedProject.price)}
            </div>
          </div>
          
          <p className="text-gray-600 text-lg">{selectedProject.description}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
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

          <div className="space-y-6">
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

        <div>
          <h4 className="flex items-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            <Award className="w-4 h-4 mr-2" />
            Project Features
          </h4>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              'Complete source code with comments',
              'Step-by-step installation guide',
              'Database schema and sample data',
              'Responsive design (where applicable)',
              'Admin panel access',
              'Free technical support'
            ].map((feature, index) => (
              <div key={index} className="flex items-center text-gray-700">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderFooter = () => {
    if (paymentStatus === 'pending') {
      if (showCustomerForm) {
        return (
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onBackToProject}
              className="flex-1 py-3 rounded-xl font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300 cursor-pointer"
            >
              Back to Project
            </button>
            <button
              onClick={handlePurchaseClick}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 cursor-pointer ${
                selectedProject.price === 0
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
              }`}
            >
              {selectedProject.price === 0 ? (
                <div className="flex items-center justify-center">
                  <Download className="w-5 h-5 mr-2" />
                  Download Now (Free)
                </div>
              ) : (
                'Proceed to Payment'
              )}
            </button>
          </div>
        );
      }

      return (
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handlePurchaseClick}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 cursor-pointer ${
              selectedProject.price === 0
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
            }`}
          >
            {selectedProject.price === 0 ? (
              <div className="flex items-center justify-center">
                <Download className="w-5 h-5 mr-2" />
                Download Now (Free)
              </div>
            ) : (
              `Purchase Now - ${getPriceDisplay(selectedProject.price)}`
            )}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300 cursor-pointer"
          >
            Close
          </button>
        </div>
      );
    }

    if (paymentStatus === 'success') {
      return (
        <div className="text-center">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
          >
            Close
          </button>
        </div>
      );
    }

    if (paymentStatus === 'failed') {
      return (
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => onPurchase(selectedProject)}
            className="flex-1 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transition-all duration-300"
          >
            Try Again
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300"
          >
            Close
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/30 bg-opacity-100 z-[9999]"
        onClick={onClose}
      ></div>
      
      <div className="fixed inset-0 flex items-center justify-center p-4 z-[10000]">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {showCustomerForm ? 'Enter Your Details' : 'Project Details'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[calc(90vh-180px)]">
            <div className="p-6">
              {renderContent()}
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            {renderFooter()}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectModal;