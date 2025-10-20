

export enum AlertLevel {
  Critical = 'Critical',
  Warning = 'Warning',
  Safe = 'Safe',
  Info = 'Info',
}

export enum UserRole {
  Admin = 'Admin',
  Volunteer = 'Volunteer',
  Citizen = 'Citizen',
}

export enum PostCategory {
  Tide = 'Tide',
  Debris = 'Debris',
  Sighting = 'Sighting',
  Official = 'Official',
  Hazard = 'Hazard',
}

export interface Location {
  lat: number;
  lng: number;
  name: string;
  district: string;
  state: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  location: string;
  dateJoined: string;
  posts: number;
}

export interface Post {
  id: string;
  author: string;
  authorId: string;
  alertLevel: AlertLevel;
  category: PostCategory;
  imageUrl: string;
  description: string;
  location: Location;
  timestamp: string;
  likes: number;
  comments: number;
  isVerified?: boolean;
}

export interface RecentActivity {
  id: string;
  description: string;
  timestamp: string;
}

export interface SafeShelter {
  id: string;
  name: string;
  location: Location;
  capacity: number;
  contact: string;
  operator: string;
}

export interface MedicalCamp {
  id: string;
  name: string;
  location: Location;
  services: string[];
  contact: string;
  timing: string;
}

export enum RiskLevel {
    High = 'High',
    Medium = 'Medium',
    Low = 'Low'
}

export interface RiskArea {
  id: string;
  name: string;
  location: Location;
  riskLevel: RiskLevel;
  description: string;
}