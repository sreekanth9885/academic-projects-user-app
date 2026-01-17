// app/components/HomeContent/utils.ts

import { Project } from "@/app/lib/types";

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

export const getPriceDisplay = (price: number): string => {
  console.log('getPriceDisplay called with price:', price);
  const priceNum = price;
  if (priceNum === 0) return 'FREE';
  return `₹${priceNum.toFixed(0)}`;
};

export const validateCustomerInfo = (customerInfo: { name: string; email: string; phone: string }): boolean => {
  if (!customerInfo.name.trim()) {
    alert('Please enter your name');
    return false;
  }
  if (!customerInfo.email.trim()) {
    alert('Please enter your email');
    return false;
  }
  if (!customerInfo.phone.trim()) {
    alert('Please enter your phone number');
    return false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(customerInfo.email)) {
    alert('Please enter a valid email address');
    return false;
  }
  
  return true;
};

export const downloadFile = (url: string, filename: string): void => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const handleDownloadFiles = (selectedProject: Project | null): void => {
  if (!selectedProject) return;
  
  console.log('Downloading files for project:', selectedProject);
  
  // Try to download documentation
  if (selectedProject.documentation) {
    const docUrl = `https://academicprojects.org/api/uploads/${selectedProject.documentation}`;
    const docName = `${selectedProject.title.replace(/\s+/g, '_')}_documentation.pdf`;
    
    console.log('Attempting to download documentation from:', docUrl);
    
    const link1 = document.createElement('a');
    link1.href = docUrl;
    link1.download = docName;
    document.body.appendChild(link1);
    link1.click();
    document.body.removeChild(link1);
    
    setTimeout(() => {
      window.open(docUrl, '_blank');
    }, 100);
  }
  
  // Try to download source code
  if (selectedProject.code_files) {
    const codeUrl = `https://academicprojects.org/api/uploads/${selectedProject.code_files}`;
    const codeName = `${selectedProject.title.replace(/\s+/g, '_')}_source_code.zip`;
    
    console.log('Attempting to download source code from:', codeUrl);
    
    setTimeout(() => {
      const link2 = document.createElement('a');
      link2.href = codeUrl;
      link2.download = codeName;
      document.body.appendChild(link2);
      link2.click();
      document.body.removeChild(link2);
      
      setTimeout(() => {
        window.open(codeUrl, '_blank');
      }, 100);
    }, 300);
  }
};

export const loadRazorpayScript = (): Promise<boolean> => {
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

export const categories = [
  { name: 'Web Development', count: 45, color: 'bg-blue-500' },
  { name: 'Python', count: 28, color: 'bg-green-500' },
  { name: 'JavaScript', count: 32, color: 'bg-purple-500' },
  { name: 'TypeScript', count: 19, color: 'bg-red-500' },
  { name: 'React', count: 25, color: 'bg-yellow-500' },
  { name: 'PHP', count: 18, color: 'bg-pink-500' },
];