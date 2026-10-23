export type Accent = 'cream' | 'purple' | 'pink' | 'teal' | 'cyan' | 'orange' | 'blue' | 'green' | 'red';

export type SocialPlatform =
  | 'dribbble' | 'behance' | 'linkedin' | 'x' | 'instagram' | 'github' | 'figma' | 'medium' | 'website';

export interface Social { id: string; platform: SocialPlatform; url: string; }
export interface Stat { id: string; label: string; value: number; suffix: string; }

export interface Profile {
  name: string;
  role: string;
  heroWords: string[];
  tagline: string;
  bio: string;
  location: string;
  email: string;
  phone: string;
  avatar: string;
  resumeUrl: string;
  available: boolean;
  socials: Social[];
  stats: Stat[];
}

export interface Metric { label: string; value: string; }

export interface Project {
  id: string;
  slug: string;
  title: string;
  client: string;
  year: string;
  category: string;
  tags: string[];
  cover: string;
  summary: string;
  role: string;
  duration: string;
  tools: string[];
  overview: string;
  challenge: string;
  solution: string;
  results: string;
  metrics: Metric[];
  gallery: string[];
  liveUrl: string;
  color: string;
  featured: boolean;
  published: boolean;
}

export interface Service { id: string; icon: string; title: string; description: string; }
export interface Skill { id: string; name: string; level: number; }
export interface Experience { id: string; role: string; company: string; period: string; description: string; }
export interface ProcessStep { id: string; title: string; description: string; deliverables: string[]; }
export interface Testimonial { id: string; name: string; role: string; quote: string; avatar: string; }

export interface Message {
  id: string; name: string; email: string; subject: string; body: string; date: string; read: boolean;
}

export interface Settings {
  accent: Accent;
  /** True once the owner picks an accent in the admin panel. */
  accentChosen?: boolean;
  passcode: string;
  showPreloader: boolean;
  customCursor: boolean;
  siteTitle: string;
  formEndpoint: string;
}

export interface Content {
  profile: Profile;
  projects: Project[];
  services: Service[];
  skills: Skill[];
  tools: string[];
  experience: Experience[];
  process: ProcessStep[];
  testimonials: Testimonial[];
  messages: Message[];
  settings: Settings;
}
