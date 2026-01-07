import axios from 'axios';
import { OrderRequest, Project } from './types';

const API_BASE_URL ='https://academicprojects.org/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const projectService = {
  async getAllProjects(): Promise<Project[]> {
    try {
      const response = await api.get('/projects.php');
      console.log('Fetched projects:', response);
      return response.data.data.map((project: any) => this.transformProject(project));
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  },

  async getProjectById(id: number): Promise<Project | null> {
    try {
      const response = await api.get(`/projects.php?id=${id}`);
      return this.transformProject(response.data);
    } catch (error) {
      console.error('Error fetching project:', error);
      return null;
    }
  },

  async createOrder(orderData: OrderRequest): Promise<any> {
    try {
      const response = await api.post('/create-order.php', orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  async verifyPayment(paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }): Promise<boolean> {
    try {
      const response = await api.post('/verify-payment.php', paymentData);
      return response.data.success;
    } catch (error) {
      console.error('Error verifying payment:', error);
      return false;
    }
  },

  // Transform database project to frontend format
  transformProject(dbProject: any): Project {
    // Extract technologies from description or use default
    const technologies = this.extractTechnologies(dbProject.description) || 
                        ['PHP', 'MySQL', 'JavaScript', 'HTML/CSS'];
    
    // Extract tags from category
    const tags = dbProject.category ? [dbProject.category] : ['Academic'];
    
    // Generate a thumbnail based on category
    const thumbnail = this.getThumbnailByCategory(dbProject.category);
    
    return {
      id: dbProject.id,
      title: dbProject.title || 'Untitled Project',
      description: dbProject.description || 'No description available',
      price: parseFloat(dbProject.price) || 0,
      category: dbProject.category || 'Uncategorized',
      created_at: dbProject.created_at || new Date().toISOString(),
      documentation: dbProject.documentation || '',
      code_files: dbProject.code_files || '',
      // Add defaults for missing fields
      discounted_price: parseFloat(dbProject.discounted_price) || undefined,
      tags: tags,
      technologies: technologies,
      thumbnail: thumbnail,
      images: [thumbnail], // Use thumbnail as main image
      features: [
        'Complete Source Code',
        'Database Design',
        'Documentation',
        'Ready to Run'
      ],
      difficulty: this.getDifficultyByPrice(parseFloat(dbProject.price) || 0),
      delivery_time: 1, // Instant download
      rating: 4.5, // Default rating
      reviews_count: Math.floor(Math.random() * 50), // Random for demo
      downloads: Math.floor(Math.random() * 100), // Random for demo
      includes: {
        source_code: !!dbProject.code_files,
        documentation: !!dbProject.documentation,
        video_tutorial: false,
        deployment: false
      },
      author: 'Academic Project',
      university: 'University Project',
      year: new Date().getFullYear()
    };
  },

  extractTechnologies(description: string): string[] {
    if (!description) return [];
    
    const techKeywords = [
      'PHP', 'MySQL', 'JavaScript', 'HTML', 'CSS', 'Python', 'Java', 'C++',
      'React', 'Node.js', 'Angular', 'Vue', 'Laravel', 'Django', 'Flask',
      'Bootstrap', 'jQuery', 'AJAX', 'JSON', 'API', 'REST', 'MongoDB',
      'SQL', 'NoSQL', 'Git', 'Docker'
    ];
    
    return techKeywords.filter(tech => 
      description.toUpperCase().includes(tech.toUpperCase())
    ).slice(0, 5); // Limit to 5 technologies
  },

  getThumbnailByCategory(category: string): string {
    const categoryImages: Record<string, string> = {
      'Web Development': '/api/placeholder/400/300/4F46E5/FFFFFF?text=Web+Dev',
      'Mobile App': '/api/placeholder/400/300/10B981/FFFFFF?text=Mobile+App',
      'AI/ML': '/api/placeholder/400/300/F59E0B/FFFFFF?text=AI+ML',
      'Database': '/api/placeholder/400/300/8B5CF6/FFFFFF?text=Database',
      'Networking': '/api/placeholder/400/300/EF4444/FFFFFF?text=Networking',
      'Security': '/api/placeholder/400/300/EC4899/FFFFFF?text=Security'
    };
    
    return categoryImages[category] || '/api/placeholder/400/300/3B82F6/FFFFFF?text=Project';
  },

  getDifficultyByPrice(price: number): 'beginner' | 'intermediate' | 'advanced' {
    if (price < 1000) return 'beginner';
    if (price < 3000) return 'intermediate';
    return 'advanced';
  }
};