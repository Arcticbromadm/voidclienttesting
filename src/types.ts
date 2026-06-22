export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  badge?: string;
  details?: string[];
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  duration: string;
  isPopular?: boolean;
  isLifetime?: boolean;
  tagline?: string;
  features: string[];
}

export interface ScriptItem {
  name: string;
  game: string;
  description: string;
  code: string;
  author: string;
  stars: number;
}
