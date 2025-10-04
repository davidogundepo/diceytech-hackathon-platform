import { Timestamp } from 'firebase/firestore';

export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'user' | 'admin';
  profileCompleteness: number;
  bio?: string;
  location?: string;
  phone?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  skills: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Project {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  difficulty?: string;
  imageUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
  techStack: string[];
  skills: string[];
  collaborators: string[];
  challenges?: string;
  learnings?: string;
  futureImprovements?: string;
  status?: string;
  views: number;
  likes: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Hackathon {
  id: string;
  organizerId: string;
  title: string;
  description: string;
  category: string;
  difficulty?: string;
  startDate: Timestamp;
  endDate: Timestamp;
  prize?: string;
  imageUrl?: string;
  location?: string;
  maxParticipants?: number;
  participantCount: number;
  tags: string[];
  requirements?: string[];
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Application {
  id: string;
  userId: string;
  hackathonId?: string;
  jobId?: string;
  type: 'hackathon' | 'job';
  status: 'pending' | 'under_review' | 'accepted' | 'rejected';
  applicationData: Record<string, any>;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'hackathon' | 'application' | 'achievement' | 'project' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  category: string;
  relatedId?: string;
  createdAt: Timestamp;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirements: Record<string, any>;
  createdAt: Timestamp;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  earnedAt: Timestamp;
  progress: number;
}
