export interface Project {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  created_at: string;
  documentation: string; // File path
  code_files: string; // File path
  // Optional fields we can calculate or add defaults for
  discounted_price?: number;
  tags?: string[];
  technologies?: string[];
  thumbnail?: string;
  images?: string[];
  features?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  delivery_time?: number;
  rating?: number;
  reviews_count?: number;
  downloads?: number;
  includes?: {
    source_code: boolean;
    documentation: boolean;
    video_tutorial: boolean;
    deployment: boolean;
  };
  author?: string;
  university?: string;
  year?: number;
}

export interface OrderRequest {
  project_id: number;
  amount: number;
  currency: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
}

export interface RazorpayResponse {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  notes: string[];
  created_at: number;
}