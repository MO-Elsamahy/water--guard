// أنواع البيانات المختلفة للتطبيق

export type UserRole = 'user' | 'plumber' | 'admin';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  phoneNumber: string;
  createdAt: Date;
  isApproved?: boolean; // للسباكين
  profileImage?: string;
}

export interface Plumber extends User {
  role: 'plumber';
  experience: number; // بالسنوات
  specialties: string[]; // التخصصات
  workingAreas: string[]; // مناطق العمل
  certifications?: string[]; // الشهادات
  rating: number; // التقييم
  completedJobs: number; // عدد الأعمال المكتملة
  isAvailable: boolean; // متاح للعمل
  location: {
    lat: number;
    lng: number;
  };
}

export interface Report {
  id: string;
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  images: string[]; // روابط الصور
  reporterName: string;
  reporterPhone: string;
  reporterEmail?: string;
  status: 'pending' | 'approved' | 'rejected' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: Date;
  approvedAt?: Date;
  resolvedAt?: Date;
  adminNotes?: string;
  assignedPlumber?: string; // معرف السباك المكلف
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  summary: string;
  images: string[];
  author: string;
  publishedAt: Date;
  isPublished: boolean;
  category: 'news' | 'maintenance' | 'emergency' | 'announcement';
  tags: string[];
}

export interface AdminUser {
  uid: string;
  username: string;
  email: string;
  role: 'admin' | 'super_admin';
  permissions: string[];
  lastLogin: Date;
  createdAt: Date;
}
