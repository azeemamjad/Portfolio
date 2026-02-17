export interface Portfolio {
  id: number;
  username: string;
  name?: string;
  tagline: string;
  profile_image: string | null;
  theme_color: string;
  about?: About;
  skills: Skill[];
  projects: Project[];
  services: Service[];
  testimonials: Testimonial[];
  achievements: Achievement[];
  hobbies: Hobby[];
  created_at: string;
  updated_at: string;
}

export interface About {
  bio: string;
  background: string;
  career_path: string;
  values: string;
  location: string;
  email: string;
  phone: string;
  linkedin_url: string;
  github_url: string;
  twitter_url: string;
  website_url: string;
  resume_file: string | null;
}

export interface Skill {
  name: string;
  category: 'programming' | 'framework' | 'database' | 'tool' | 'soft' | 'other';
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  proficiency_percentage: number;
  icon: string;
  order: number;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  detailed_description: string;
  image: string | null;
  thumbnail: string | null;
  technologies: string;
  technologies_list: string[];
  live_url: string;
  github_url: string;
  demo_url: string;
  outcome: string;
  is_featured: boolean;
  order: number;
  start_date: string | null;
  end_date: string | null;
  case_study?: CaseStudy;
  testimonials: Testimonial[];
  created_at: string;
  updated_at: string;
}

export interface CaseStudy {
  challenge: string;
  solution: string;
  process: string;
  results: string;
  lessons_learned: string;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  price_range: string;
  order: number;
}

export interface Testimonial {
  id: number;
  client_name: string;
  client_role: string;
  client_company: string;
  client_image: string | null;
  content: string;
  rating: number;
  project_title?: string;
  is_featured: boolean;
  order: number;
  date: string | null;
}

export interface Achievement {
  id: number;
  title: string;
  type: 'award' | 'certification' | 'recognition' | 'publication' | 'other';
  issuer: string;
  description: string;
  image: string | null;
  credential_url: string;
  date_received: string;
  expiry_date: string | null;
  order: number;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string | null;
  tags: string;
  tags_list: string[];
  status: 'draft' | 'published';
  is_featured: boolean;
  views: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Resource {
  id: number;
  title: string;
  description: string;
  file: string;
  thumbnail: string | null;
  file_type: string;
  file_size: string;
  downloads: number;
  created_at: string;
}

export interface Hobby {
  title: string;
  description: string;
  icon: string;
  order: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface NewsletterFormData {
  email: string;
  name?: string;
}

export interface CompanyProfile {
  id: number;
  name: string;
  tagline: string;
  description: string;
  logo: string | null;
  website: string;
  email: string;
  phone: string;
  address: string;
  services: string;
  services_list: string[];
  linkedin_url: string;
  github_url: string;
  twitter_url: string;
  meta_title: string;
  meta_description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FeaturedDeveloper {
  id: number;
  portfolio: Portfolio;
  display_order: number;
  is_active: boolean;
  featured_since: string;
  updated_at: string;
}
