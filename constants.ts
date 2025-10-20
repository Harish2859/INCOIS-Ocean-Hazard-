

import { User, Post, RecentActivity, AlertLevel, UserRole, SafeShelter, MedicalCamp, RiskArea, RiskLevel, PostCategory } from './types';

export const mockUsers: User[] = [
  { id: 'usr_001', name: 'Admin Priya', email: 'priya.s@incois.gov.in', role: UserRole.Admin, avatar: 'https://picsum.photos/id/1027/100/100', location: 'Hyderabad', dateJoined: '2022-01-15', posts: 12 },
  { id: 'usr_002', name: 'Rajesh Kumar', email: 'rajesh.k@email.com', role: UserRole.Volunteer, avatar: 'https://picsum.photos/id/1005/100/100', location: 'Chennai', dateJoined: '2023-03-22', posts: 34 },
  { id: 'usr_003', name: 'Anjali Sharma', email: 'anjali.s@email.com', role: UserRole.Citizen, avatar: 'https://picsum.photos/id/1011/100/100', location: 'Mumbai', dateJoined: '2023-05-10', posts: 5 },
  { id: 'usr_004', name: 'Vikram Singh', email: 'vikram.s@email.com', role: UserRole.Volunteer, avatar: 'https://picsum.photos/id/1012/100/100', location: 'Goa', dateJoined: '2023-06-01', posts: 21 },
  { id: 'usr_005', name: 'Sunita Devi', email: 'sunita.d@email.com', role: UserRole.Citizen, avatar: 'https://picsum.photos/id/1025/100/100', location: 'Kochi', dateJoined: '2023-07-19', posts: 8 },
  { id: 'usr_006', name: 'Amit Patel', email: 'amit.p@email.com', role: UserRole.Citizen, avatar: 'https://picsum.photos/id/1040/100/100', location: 'Visakhapatnam', dateJoined: '2023-08-02', posts: 2 },
];

export const mockPosts: Post[] = [
  { id: 'post_01', author: 'Rajesh Kumar', authorId: 'usr_002', alertLevel: AlertLevel.Critical, category: PostCategory.Tide, imageUrl: 'https://picsum.photos/seed/coast1/400/300', description: 'High tide warning, water levels rising rapidly at Marina Beach.', location: { lat: 13.05, lng: 80.28, name: 'Marina Beach, Chennai', district: 'Chennai', state: 'Tamil Nadu' }, timestamp: '2024-07-28T10:30:00Z', likes: 152, comments: 45, isVerified: false },
  { id: 'post_02', author: 'Anjali Sharma', authorId: 'usr_003', alertLevel: AlertLevel.Warning, category: PostCategory.Debris, imageUrl: 'https://picsum.photos/seed/coast2/400/300', description: 'Unusual debris washed ashore near Juhu Beach.', location: { lat: 19.08, lng: 72.82, name: 'Juhu Beach, Mumbai', district: 'Mumbai', state: 'Maharashtra' }, timestamp: '2024-07-28T09:15:00Z', likes: 89, comments: 21, isVerified: false },
  { id: 'post_03', author: 'Vikram Singh', authorId: 'usr_004', alertLevel: AlertLevel.Safe, category: PostCategory.Sighting, imageUrl: 'https://picsum.photos/seed/coast3/400/300', description: 'Clear skies and calm seas at Baga Beach today. Perfect for visitors.', location: { lat: 15.55, lng: 73.75, name: 'Baga Beach, Goa', district: 'North Goa', state: 'Goa' }, timestamp: '2024-07-28T08:00:00Z', likes: 230, comments: 15, isVerified: false },
  { id: 'post_04', author: 'Admin Priya', authorId: 'usr_001', alertLevel: AlertLevel.Info, category: PostCategory.Official, imageUrl: 'https://picsum.photos/seed/coast4/400/300', description: 'Official Tsunami drill scheduled for tomorrow at 11:00 AM. This is not a real alert.', location: { lat: 17.68, lng: 83.21, name: 'RK Beach, Visakhapatnam', district: 'Visakhapatnam', state: 'Andhra Pradesh' }, timestamp: '2024-07-27T18:00:00Z', likes: 500, comments: 80, isVerified: true },
  { id: 'post_05', author: 'Sunita Devi', authorId: 'usr_005', alertLevel: AlertLevel.Warning, category: PostCategory.Hazard, imageUrl: 'https://picsum.photos/seed/coast5/400/300', description: 'Spotted a large fishing net abandoned, could be a hazard to marine life.', location: { lat: 9.96, lng: 76.24, name: 'Fort Kochi', district: 'Ernakulam', state: 'Kerala' }, timestamp: '2024-07-28T11:05:00Z', likes: 45, comments: 12, isVerified: false },
  { id: 'post_06', author: 'Rajesh Kumar', authorId: 'usr_002', alertLevel: AlertLevel.Info, category: PostCategory.Sighting, imageUrl: 'https://picsum.photos/seed/coast6/400/300', description: 'Turtle nesting site spotted. Please be cautious.', location: { lat: 13.06, lng: 80.285, name: 'Besant Nagar Beach, Chennai', district: 'Chennai', state: 'Tamil Nadu' }, timestamp: '2024-07-28T12:00:00Z', likes: 110, comments: 18, isVerified: false },
  { id: 'post_07', author: 'Vikram Singh', authorId: 'usr_004', alertLevel: AlertLevel.Warning, category: PostCategory.Hazard, imageUrl: 'https://picsum.photos/seed/coast7/400/300', description: 'Strong currents reported at Calangute Beach.', location: { lat: 15.54, lng: 73.76, name: 'Calangute Beach, Goa', district: 'North Goa', state: 'Goa' }, timestamp: '2024-07-28T12:30:00Z', likes: 65, comments: 9, isVerified: false },
];

export const mockRecentActivities: RecentActivity[] = [
    { id: 'act_01', description: 'User Rajesh Kumar created a new CRITICAL post.', timestamp: '5 minutes ago' },
    { id: 'act_02', description: 'Admin Priya sent a broadcast alert to the Chennai region.', timestamp: '15 minutes ago' },
    { id: 'act_03', description: 'User Anjali Sharma\'s post is trending in Mumbai.', timestamp: '1 hour ago' },
    { id: 'act_04', description: 'New user Vikram Singh has been promoted to Volunteer.', timestamp: '3 hours ago' },
    { id: 'act_05', description: 'System maintenance scheduled for 2:00 AM tonight.', timestamp: '5 hours ago' },
];

export const mockSafeShelters: SafeShelter[] = [
  { id: 'shl_01', name: 'St. Mary\'s School Shelter', location: { lat: 13.08, lng: 80.27, name: 'St. Mary\'s School', district: 'Chennai', state: 'Tamil Nadu' }, capacity: 500, contact: '987-654-3210', operator: 'District Administration' },
  { id: 'shl_02', name: 'Community Hall, Juhu', location: { lat: 19.10, lng: 72.83, name: 'Juhu Community Hall', district: 'Mumbai', state: 'Maharashtra' }, capacity: 300, contact: '987-654-3211', operator: 'Mumbai Municipality' },
  { id: 'shl_03', name: 'Government College, Panaji', location: { lat: 15.49, lng: 73.82, name: 'Govt. College Panaji', district: 'North Goa', state: 'Goa' }, capacity: 750, contact: '987-654-3212', operator: 'Goa State Disaster Mgmt' },
];

export const mockMedicalCamps: MedicalCamp[] = [
  { id: 'med_01', name: 'Marina Beach First Aid', location: { lat: 13.045, lng: 80.282, name: 'Marina Beach Aid Post', district: 'Chennai', state: 'Tamil Nadu' }, services: ['First Aid', 'Hydration'], contact: '999-888-7770', timing: '9 AM - 6 PM' },
  { id: 'med_02', name: 'RK Beach Mobile Clinic', location: { lat: 17.70, lng: 83.22, name: 'RK Beach Clinic', district: 'Visakhapatnam', state: 'Andhra Pradesh' }, services: ['General Checkup', 'Emergency Care'], contact: '999-888-7771', timing: '24/7' },
];

export const mockRiskAreas: RiskArea[] = [
  { id: 'rsk_01', name: 'High Current Zone', location: { lat: 15.56, lng: 73.74, name: 'Baga High Current Zone', district: 'North Goa', state: 'Goa' }, riskLevel: RiskLevel.High, description: 'Rip currents frequently reported in this area. Swimming is not advised.' },
  { id: 'rsk_02', name: 'Submerged Rocks', location: { lat: 9.98, lng: 76.23, name: 'Kochi Rocks', district: 'Ernakulam', state: 'Kerala' }, riskLevel: RiskLevel.Medium, description: 'Be cautious of underwater rocks, especially during high tide.' },
  { id: 'rsk_03', name: 'Polluted Water Outlet', location: { lat: 19.05, lng: 72.81, name: 'Mahim Creek Outlet', district: 'Mumbai', state: 'Maharashtra' }, riskLevel: RiskLevel.Low, description: 'Industrial water outlet. Avoid direct contact with water in this vicinity.' },
];

export const indianStates: { [key: string]: { bounds: [[number, number], [number, number]] } } = {
    'All India': { bounds: [[6.7, 68.1], [35.5, 97.4]] },
    'Andhra Pradesh': { bounds: [[12.6, 76.7], [19.1, 84.8]] },
    'Goa': { bounds: [[14.9, 73.6], [15.7, 74.3]] },
    'Kerala': { bounds: [[8.2, 74.8], [12.8, 77.4]] },
    'Maharashtra': { bounds: [[15.6, 72.6], [22.0, 80.9]] },
    'Tamil Nadu': { bounds: [[8.0, 76.0], [13.6, 80.4]] },
};