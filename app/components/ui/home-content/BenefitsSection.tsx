// app/components/HomeContent/BenefitsSection.tsx
import React from 'react';
import { Zap, GraduationCap, ShoppingBag, Award } from 'lucide-react';

const BenefitsSection: React.FC = () => {
  return (
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
  );
};

export default BenefitsSection;