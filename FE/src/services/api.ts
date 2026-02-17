import axios from 'axios';
import type { Portfolio, BlogPost, Project, ContactFormData, NewsletterFormData, CompanyProfile, FeaturedDeveloper } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const portfolioAPI = {
  // Get portfolio by username
  getPortfolio: async (username: string): Promise<Portfolio> => {
    const response = await api.get(`/api/portfolios/${username}/`);
    return response.data;
  },

  // Get projects for a portfolio
  getProjects: async (username: string): Promise<Project[]> => {
    const response = await api.get(`/api/${username}/projects/`);
    return response.data;
  },

  // Get single project
  getProject: async (username: string, projectId: number): Promise<Project> => {
    const response = await api.get(`/api/${username}/projects/${projectId}/`);
    return response.data;
  },

  // Get featured projects
  getFeaturedProjects: async (username: string): Promise<Project[]> => {
    const response = await api.get(`/api/${username}/projects/featured/`);
    return response.data;
  },

  // Get blog posts
  getBlogPosts: async (username: string, page = 1): Promise<{ results: BlogPost[]; count: number }> => {
    const response = await api.get(`/api/${username}/blog/`, { params: { page } });
    return response.data;
  },

  // Get single blog post
  getBlogPost: async (username: string, postId: number): Promise<BlogPost> => {
    const response = await api.get(`/api/${username}/blog/${postId}/`);
    return response.data;
  },

  // Get featured blog posts
  getFeaturedBlogPosts: async (username: string): Promise<BlogPost[]> => {
    const response = await api.get(`/api/${username}/blog/featured/`);
    return response.data;
  },

  // Subscribe to newsletter
  subscribeNewsletter: async (username: string, data: NewsletterFormData): Promise<{ message: string }> => {
    const response = await api.post(`/api/${username}/newsletter/subscribe/`, data);
    return response.data;
  },

  // Send contact message
  sendContactMessage: async (username: string, data: ContactFormData): Promise<{ message: string }> => {
    const response = await api.post(`/api/${username}/contact/`, data);
    return response.data;
  },
};

export const companyAPI = {
  // Get company profile
  getCompanyProfile: async (): Promise<CompanyProfile> => {
    const response = await api.get('/api/company/profile/');
    return response.data;
  },

  // Get featured developers
  getFeaturedDevelopers: async (): Promise<FeaturedDeveloper[]> => {
    const response = await api.get('/api/company/featured-developers/');
    // Handle paginated response
    return response.data.results || response.data;
  },

  // Get best developers (limited to top 12)
  getBestDevelopers: async (): Promise<FeaturedDeveloper[]> => {
    const response = await api.get('/api/company/featured-developers/best/');
    return response.data;
  },
};

export default api;
