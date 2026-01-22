'use client';

import { useEffect, useMemo, useState } from 'react';
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
  const [paymentMessage, setPaymentMessage] = useState<string>('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpExpiresAt, setOtpExpiresAt] = useState<string | null>(null);
  const [otpRemainingSeconds, setOtpRemainingSeconds] = useState<number>(0);
  const [otpExpired, setOtpExpired] = useState(false);

  const validateCustomerInfo = (info: CustomerInfo): boolean => {
    if (!info.name.trim()) {
      setPaymentMessage('Please enter your name');
      return false;
    }
    if (!info.email.trim()) {
      setPaymentMessage('Please enter your email');
      return false;
    }
    if (!info.phone.trim()) {
      setPaymentMessage('Please enter your phone number');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(info.email)) {
      setPaymentMessage('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handlePurchase = async (project: Project) => {
    // Clear any previous messages
    setPaymentMessage('');
    
    // FREE PROJECT FLOW
    if (project.price === 0) {
      if (!validateCustomerInfo(customerInfo)) return;
      
      setPaymentStatus('pending');
      setPaymentMessage('Processing your free project...');
      
      try {
        // Call create-order.php which handles free projects and sends email
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
        
        if (orderData.success) {
          setPaymentStatus('success');
          
          // Set success message
          if (orderData.download_page) {
            setPaymentMessage('Free project registered successfully! Check your email for download link.');
          } else if (orderData.email_sent) {
            setPaymentMessage('Free project registered successfully! Check your email for download instructions.');
          } else {
            setPaymentMessage('Free project registered successfully! Please check your email.');
          }
        } else {
          setPaymentStatus('failed');
          setPaymentMessage(orderData.error || 'Failed to process free project');
        }
      } catch (err: any) {
        console.error(err);
        setPaymentStatus('failed');
        setPaymentMessage('Failed to download project. Please contact support.');
      }
      return;
    }

    // SHOW CUSTOMER FORM FOR PAID PROJECTS
    if (!showCustomerForm) {
      setShowCustomerForm(true);
      return;
    }

    if (!validateCustomerInfo(customerInfo)) return;

    try {
      setPaymentStatus('pending');
      setPaymentMessage('Creating payment order...');

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
      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      if (!window.Razorpay) {
        const loaded = await loadRazorpayScript();
        if (!loaded) throw new Error('Razorpay SDK failed');
      }

      setPaymentMessage('Opening payment gateway...');

      const rzp = new window.Razorpay({
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Academic Projects',
        description: project.title,
        order_id: orderData.order_id,
        handler: async (response: any) => {
          try {
            setPaymentMessage('Verifying payment...');
            
            const verifyRes = await fetch(`${API_BASE_URL}/verify-payment.php`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...response,
                ...customerInfo,
                project_id: project.id
              })
            });

            const verifyData = await verifyRes.json();
            
            if (verifyData.success) {
              setPaymentStatus('success');
              
              // Set success message based on email status
              if (verifyData.email_sent) {
                setPaymentMessage('Payment successful! Project files have been sent to your email.');
              } else {
                setPaymentMessage('Payment successful! You will receive an email with download link shortly.');
                
                // Auto-open download page if available and email failed
                // if (verifyData.download_page && !verifyData.email_sent) {
                //   setTimeout(() => {
                //     window.open(verifyData.download_page, '_blank');
                //   }, 1500);
                // }
              }
            } else {
              setPaymentStatus('failed');
              setPaymentMessage(`Payment verification failed: ${verifyData.error || 'Please contact support'}`);
            }
          } catch (verifyErr: any) {
            console.error('Verification error:', verifyErr);
            setPaymentStatus('failed');
            setPaymentMessage('Payment verification failed. Please contact support.');
          }
        },
        modal: {
          ondismiss: () => {
            if (paymentStatus === 'pending') {
              setPaymentStatus('pending');
              setPaymentMessage('');
            }
          }
        },
        prefill: customerInfo,
        theme: { color: '#667eea' },
        image: 'https://academicprojects.org/api/gcap.jpg'
      });

      rzp.open();
      
      // Handle payment modal close
      rzp.on('payment.failed', function(response: any) {
        console.error('Payment failed:', response.error);
        setPaymentStatus('failed');
        setPaymentMessage(`Payment failed: ${response.error.description || 'Please try again'}`);
      });
      
    } catch (err: any) {
      console.error('Purchase error:', err);
      setPaymentStatus('failed');
      setPaymentMessage(`Payment failed: ${err.message || 'Please try again'}`);
    }
  };
  useEffect(() => {
  if (!otpSent || otpVerified || otpRemainingSeconds <= 0) return;

  const timer = setInterval(() => {
    setOtpRemainingSeconds((prev) => {
      if (prev <= 1) {
        clearInterval(timer);
        setOtpExpired(true);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(timer);
}, [otpSent, otpRemainingSeconds]);

  // Clear payment message after 5 seconds on success/failure
  useState(() => {
    if (paymentStatus === 'success' || paymentStatus === 'failed') {
      const timer = setTimeout(() => {
        setPaymentMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  });
  const sendOtp = async (email: string) => {
    console.log('Sending OTP to:', email);

    if (!email || !email.includes('@')) {
      setPaymentMessage('Please enter a valid email address');
      return;
    }

    try {
      setSendingOtp(true);
      setOtpSent(false);
      setOtpVerified(false);
      setOtp(''); // ✅ clear OTP input
      setOtpExpired(false);
      setOtpRemainingSeconds(0);
      const res = await fetch(`${API_BASE_URL}/send-otp.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      let data: any = null;
      try {
        data = await res.json();
        const expires = new Date(data.expires_at).getTime();
        const serverNow = new Date(data.server_time).getTime();
        const remaining = Math.max(
      0,
      Math.floor((expires - serverNow) / 1000)
    );
    setOtpExpiresAt(data.expires_at);
    setOtpRemainingSeconds(remaining);
    setOtpSent(true);
        console.log('Send OTP response data:', data);
      } catch {
        throw new Error('Server error while sending OTP');
      }

      if (!res.ok || data.status !== 'success') {
        throw new Error(data.message || 'Failed to send OTP');
      }

      setOtpSent(true);
      setOtpVerified(false);
      setOtpExpired(false);
      setPaymentMessage('OTP sent to your email');
    } catch (err) {
      console.error('Send OTP error:', err);
      setPaymentMessage(
        err instanceof Error ? err.message : 'Failed to send OTP'
      );
    } finally {
      setSendingOtp(false);
    }
  };


  const verifyOtp=async(email:string)=>{
    if(!otp) throw new Error('OTP is required for verification');
    try{
      setVerifyingOtp(true);
      const res=await fetch(`${API_BASE_URL}/verify-otp.php`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({email,otp})
      });
      const data=await res.json();
      if (data.status !== 'success') {
  throw new Error(data.message || 'OTP verification failed');
}

      setOtpVerified(true);
      setPaymentMessage('OTP verified successfully');
    }catch(err){
      console.error('Verify OTP error:',err);
      setPaymentMessage('Failed to verify OTP. Please try again.');
    }finally{
      setVerifyingOtp(false);
    }
  }
  const canProceedtoPurchase = useMemo(() => {
  return (
    customerInfo.name.trim() !== '' &&
    customerInfo.email.trim() !== '' &&
    customerInfo.phone.trim() !== '' &&
    otpVerified
  );
}, [customerInfo, otpVerified]);

  const resetOtp=()=>{
    setOtp('');
    setOtpSent(false);
    setOtpVerified(false);
    setOtpExpired(false);
    setOtpExpiresAt(null);
    setOtpRemainingSeconds(0);
  }
  return {
    paymentStatus,
    customerInfo,
    showCustomerForm,
    paymentMessage,
    otp,
    otpSent,
    sendingOtp,
    verifyingOtp,
    otpVerified,
    otpExpiresAt,
    otpRemainingSeconds,
    otpExpired,
    setCustomerInfo,
    setShowCustomerForm,
    setPaymentStatus,
    setPaymentMessage,
    handlePurchase,
    setOtp,
    sendOtp,
    verifyOtp,
    resetOtp,
    canProceedtoPurchase
  };
}