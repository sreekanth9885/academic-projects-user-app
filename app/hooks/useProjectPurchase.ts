'use client';

import { useState } from 'react';
import { loadRazorpayScript } from '@/app/lib/utils';
import { API_BASE_URL, CustomerInfo, Project } from '@/app/lib/types';

export function useProjectPurchase() {
  const [paymentStatus, setPaymentStatus] =
    useState<'pending' | 'success' | 'failed'>('pending');

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: ''
  });

  const [showCustomerForm, setShowCustomerForm] = useState(false);

  const validateCustomerInfo = (info: CustomerInfo): boolean => {
    if (!info.name.trim()) {
      alert('Please enter your name');
      return false;
    }
    if (!info.email.trim()) {
      alert('Please enter your email');
      return false;
    }
    if (!info.phone.trim()) {
      alert('Please enter your phone number');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(info.email)) {
      alert('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const downloadFiles = (project: Project) => {
    if (project.documentation) {
      const docUrl = `${API_BASE_URL}/uploads/${project.documentation}`;
      const link = document.createElement('a');
      link.href = docUrl;
      link.download = `${project.title}_documentation.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    if (project.code_files) {
      const codeUrl = `${API_BASE_URL}/uploads/${project.code_files}`;
      const link = document.createElement('a');
      link.href = codeUrl;
      link.download = `${project.title}_source_code.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePurchase = async (project: Project) => {
    // FREE PROJECT FLOW
    if (project.price === 0) {
      if (!validateCustomerInfo(customerInfo)) return;
      setPaymentStatus('success');
      downloadFiles(project);
      return;
    }

    // SHOW CUSTOMER FORM
    if (!showCustomerForm) {
      setShowCustomerForm(true);
      return;
    }

    if (!validateCustomerInfo(customerInfo)) return;

    try {
      setPaymentStatus('pending');

      const orderRes = await fetch(`${API_BASE_URL}/create-order.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: project.id,
          project_title: project.title,
          amount: project.price,
          ...customerInfo
        })
      });

      const orderData = await orderRes.json();
      if (!orderData.success) throw new Error(orderData.error);

      if (!window.Razorpay) {
        const loaded = await loadRazorpayScript();
        if (!loaded) throw new Error('Razorpay SDK failed');
      }

      const rzp = new window.Razorpay({
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Academic Projects',
        description: project.title,
        order_id: orderData.order_id,
        handler: async (response: any) => {
          const verifyRes = await fetch(`${API_BASE_URL}/verify-payment.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...response,
              ...customerInfo
            })
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            setPaymentStatus('success');
            downloadFiles(project);
          } else {
            setPaymentStatus('failed');
            alert('Payment verification failed');
          }
        },
        prefill: customerInfo,
        theme: { color: '#667eea' }
      });

      rzp.open();
    } catch (err) {
      console.error(err);
      setPaymentStatus('failed');
      alert('Payment failed');
    }
  };

  return {
    paymentStatus,
    customerInfo,
    showCustomerForm,
    setCustomerInfo,
    setShowCustomerForm,
    setPaymentStatus,
    handlePurchase
  };
}
