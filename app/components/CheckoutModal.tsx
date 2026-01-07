'use client';

import { X, CreditCard, Shield, Download, FileText, Video, Code } from 'lucide-react';
import { useState } from 'react';
import Script from 'next/script';
import { Project } from '../lib/types';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface CheckoutModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (paymentId: string, project: Project) => void;
}

export default function CheckoutModal({ project, isOpen, onClose, onSuccess }: CheckoutModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);

  if (!project || !isOpen) return null;

  const amount = project.discounted_price || project.price;
  const amountInPaise = amount * 100;

  const handlePurchase = async () => {
    // If project is free, skip payment
    if (amount === 0) {
      handleFreeDownload();
      return;
    }

    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      // Create order via your PHP API
      const response = await fetch('/api/create-order.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_id: project.id,
          amount: amountInPaise,
          currency: 'INR',
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
        }),
      });

      const order = await response.json();

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Academic Projects Marketplace",
        description: `Purchase: ${project.title}`,
        order_id: order.id,
        handler: async function (response: any) {
          // Verify payment
          const verifyResponse = await fetch('/api/verify-payment.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verification = await verifyResponse.json();

          if (verification.success) {
            onSuccess(response.razorpay_payment_id, project);
            onClose();
            // Show download links immediately
            showDownloadLinks(project);
          } else {
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          project_id: project.id.toString(),
          project_title: project.title,
        },
        theme: {
          color: '#3b82f6',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFreeDownload = () => {
    onSuccess('free-download', project);
    onClose();
    showDownloadLinks(project);
  };

  const showDownloadLinks = (project: Project) => {
    const downloadWindow = window.open('', '_blank');
    if (downloadWindow) {
      downloadWindow.document.write(`
        <html>
          <head>
            <title>Download ${project.title}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; text-align: center; }
              .container { max-width: 600px; margin: 0 auto; }
              .btn { 
                display: inline-block; 
                padding: 12px 24px; 
                margin: 10px; 
                background: #3b82f6; 
                color: white; 
                text-decoration: none; 
                border-radius: 8px; 
                font-weight: bold;
              }
              .btn:hover { background: #2563eb; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Download ${project.title}</h1>
              <p>Thank you for your purchase! Here are your download links:</p>
              
              ${project.code_files ? `
                <div style="margin: 20px 0;">
                  <a href="${project.code_files}" class="btn" download>
                    <Code size={20} /> Download Source Code
                  </a>
                </div>
              ` : ''}
              
              ${project.documentation ? `
                <div style="margin: 20px 0;">
                  <a href="${project.documentation}" class="btn" download>
                    <FileText size={20} /> Download Documentation
                  </a>
                </div>
              ` : ''}
              
              <p style="margin-top: 30px; color: #666;">
                If download doesn't start automatically, right-click the links and select "Save link as..."
              </p>
            </div>
          </body>
        </html>
      `);
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {amount === 0 ? 'Download Project' : 'Complete Your Purchase'}
                </h2>
                <p className="text-gray-600 mt-1">
                  {amount === 0 ? 'Get instant access to' : 'Purchase and download'} {project.title}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left Column - Project Details */}
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">What You'll Get</h3>
                    <ul className="space-y-3">
                      {project.code_files && (
                        <li className="flex items-center gap-3">
                          <Code className="text-green-600" size={20} />
                          <span>Complete Source Code Files</span>
                        </li>
                      )}
                      {project.documentation && (
                        <li className="flex items-center gap-3">
                          <FileText className="blue-600" size={20} />
                          <span>Project Documentation (PDF/DOC)</span>
                        </li>
                      )}
                      <li className="flex items-center gap-3">
                        <Download className="text-purple-600" size={20} />
                        <span>Instant Download After Purchase</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Shield className="text-green-600" size={20} />
                        <span>Lifetime Access & Updates</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-5">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-600">Project Price</span>
                      <span className="text-2xl font-bold text-gray-900">
                        {amount === 0 ? 'FREE' : `₹${amount}`}
                      </span>
                    </div>
                    {project.discounted_price && (
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>Original Price</span>
                        <span className="line-through">₹{project.price}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column - Checkout Form */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {amount === 0 ? 'Download Information' : 'Billing Information'}
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    {amount > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                          placeholder="Enter your phone number"
                          required
                        />
                      </div>
                    )}

                    {/* Security Assurance */}
                    {amount > 0 && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
                        <div className="flex items-start gap-3">
                          <Shield className="text-green-600 mt-0.5" size={20} />
                          <div>
                            <p className="font-medium text-green-800">Secure Payment</p>
                            <p className="text-sm text-green-700 mt-1">
                              Your payment is secured with 256-bit SSL encryption. We never store your card details.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                {amount > 0 && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <CreditCard size={20} />
                    <span className="text-sm">100% Secure Payment</span>
                  </div>
                )}
                
                <div className="flex gap-4">
                  <button
                    onClick={onClose}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePurchase}
                    disabled={loading}
                    className="px-8 py-3 bg-primary-600 text-black rounded-lg 
                    font-semibold hover:bg-primary-700 disabled:opacity-50 
                    disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : amount === 0 ? (
                      <>
                        Download Free
                        <Download size={20} />
                      </>
                    ) : (
                      <>
                        Pay ₹{amount}
                        <CreditCard size={20} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}