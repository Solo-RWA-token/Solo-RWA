import { Vehicle } from './constants';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'client' | 'admin';
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  assetId: string;
  assetName: string;
  assetImage: string;
  price: number;
  status: 'processing' | 'confirmed' | 'delivered';
  createdAt: string;
  items?: Vehicle[];
  milestones?: ProductionMilestone[];
}

export interface ProductionMilestone {
  id: string;
  stage: string;
  tranchePercent: number;
  verification: 'pending' | 'verified';
  evidence?: string;
}
