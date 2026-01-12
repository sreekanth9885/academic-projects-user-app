// app/components/HomeContent/types.ts
export interface Project {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  created_at: string;
  documentation: string | null;
  code_files: string | null;
}

export interface HeaderProps {
  currentView: 'home' | 'projects' | 'categories' | 'freeprojects';
  setCurrentView: (view: 'home' | 'projects' | 'categories' | 'freeprojects') => void;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

export interface PaymentState {
  status: 'pending' | 'success' | 'failed';
  data: {
    download_link?: string;
    payment_id?: string;
    order_id?: string;
  } | null;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}
export const API_BASE_URL = 'https://academicprojects.org/api';