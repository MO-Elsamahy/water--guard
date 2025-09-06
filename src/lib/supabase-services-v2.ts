import { supabase, uploadFile } from './supabase';

// أنواع البيانات الأساسية
export interface User {
  id: string;
  email: string;
  display_name: string;
  phone_number?: string;
  role: 'user' | 'plumber' | 'admin';
  is_active: boolean;
  profile_image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  bio?: string;
  location?: string;
  website?: string;
  social_links?: Record<string, any>;
  preferences?: Record<string, any>;
  notification_settings?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface PlumberProfile {
  id: string;
  experience: number;
  specialties: string[];
  working_areas: string[];
  is_available: boolean;
  is_approved: boolean;
  rating: number;
  completed_jobs: number;
  license_number?: string;
  license_image_url?: string;
  description?: string;
  hourly_rate?: number;
  approved_at?: string;
  approved_by?: string;
  user?: User;
  profile?: UserProfile;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  reporter_id: string;
  reporter_name: string;
  reporter_phone: string;
  location_lat?: number;
  location_lng?: number;
  location_address?: string;
  area?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'approved' | 'rejected' | 'resolved';
  images?: string[];
  is_approved: boolean;
  approved_at?: string;
  approved_by?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface ReportWithUser extends Report {
  user?: User;
}

export interface News {
  id: string;
  title: string;
  content: string;
  category: string;
  author_id: string;
  author_name: string;
  images?: string[];
  status: 'pending' | 'approved' | 'rejected';
  is_published: boolean;
  published_at?: string;
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface NewsWithUser extends News {
  user?: User;
}

// خدمة المستخدمين
export class UserService {
  // جلب ملف المستخدم الشخصي
  async getUserProfile(userId: string): Promise<{ user: User; profile: UserProfile } | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          profile:user_profiles(*)
        `)
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data ? { user: data, profile: data.profile } : null;
    } catch (error) {
      console.error('خطأ في جلب ملف المستخدم:', error);
      return null;
    }
  }

  // تحديث ملف المستخدم
  async updateUserProfile(userId: string, updates: Partial<User>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('خطأ في تحديث ملف المستخدم:', error);
      return false;
    }
  }

  // تحديث الملف الشخصي الإضافي
  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({ id: userId, ...updates })
        .eq('id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('خطأ في تحديث الملف الشخصي:', error);
      return false;
    }
  }

  // رفع صورة الملف الشخصي
  async uploadProfileImage(userId: string, file: File): Promise<string | null> {
    try {
      const fileName = `${userId}/avatar.${file.name.split('.').pop()}`;
      const imageUrl = await uploadFile('avatars', fileName, file);
      
      // تحديث رابط الصورة في قاعدة البيانات
      if (imageUrl) {
        await this.updateUserProfile(userId, { profile_image_url: imageUrl });
      }
      
      return imageUrl;
    } catch (error) {
      console.error('خطأ في رفع صورة الملف الشخصي:', error);
      return null;
    }
  }
}

// خدمة الأخبار المحدثة
export class NewsService {
  // جلب الأخبار المنشورة
  async getPublishedNews(): Promise<NewsWithUser[]> {
    try {
      const { data, error } = await supabase
        .from('news')
        .select(`
          *,
          user:users(*)
        `)
        .eq('is_published', true)
        .eq('status', 'approved')
        .order('published_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('خطأ في جلب الأخبار:', error);
      return [];
    }
  }

  // إنشاء خبر جديد (للمستخدمين العاديين)
  async createNews(userId: string, newsData: {
    title: string;
    content: string;
    category?: string;
    tags?: string[];
  }): Promise<string | null> {
    try {
      // جلب بيانات المستخدم
      const { data: userData } = await supabase
        .from('users')
        .select('display_name')
        .eq('id', userId)
        .single();

      const { data, error } = await supabase
        .from('news')
        .insert({
          ...newsData,
          author_id: userId,
          author_name: userData?.display_name || 'مستخدم',
          category: newsData.category || 'general',
          status: 'pending', // يحتاج موافقة من الإدارة
          is_published: false
        })
        .select('id')
        .single();

      if (error) throw error;
      return data?.id || null;
    } catch (error) {
      console.error('خطأ في إنشاء الخبر:', error);
      return null;
    }
  }

  // جلب أخبار المستخدم
  async getUserNews(userId: string): Promise<NewsWithUser[]> {
    try {
      const { data, error } = await supabase
        .from('news')
        .select(`
          *,
          user:users(*)
        `)
        .eq('author_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('خطأ في جلب أخبار المستخدم:', error);
      return [];
    }
  }

  // جلب الأخبار المعلقة (للإدارة)
  async getPendingNews(): Promise<NewsWithUser[]> {
    try {
      const { data, error } = await supabase
        .from('news')
        .select(`
          *,
          user:users(*)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('خطأ في جلب الأخبار المعلقة:', error);
      return [];
    }
  }

  // موافقة على خبر (للإدارة)
  async approveNews(newsId: string, adminId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('news')
        .update({
          status: 'approved',
          is_published: true,
          approved_by: adminId,
          approved_at: new Date().toISOString(),
          published_at: new Date().toISOString()
        })
        .eq('id', newsId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('خطأ في الموافقة على الخبر:', error);
      return false;
    }
  }

  // رفض خبر (للإدارة)
  async rejectNews(newsId: string, adminId: string, reason: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('news')
        .update({
          status: 'rejected',
          approved_by: adminId,
          approved_at: new Date().toISOString(),
          rejection_reason: reason
        })
        .eq('id', newsId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('خطأ في رفض الخبر:', error);
      return false;
    }
  }

  // رفع صور للخبر
  async uploadNewsImages(files: File[], newsId: string): Promise<string[]> {
    try {
      const imageUrls: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = `${newsId}/image-${i + 1}.${file.name.split('.').pop()}`;
        const imageUrl = await uploadFile('news', fileName, file);
        if (imageUrl) {
          imageUrls.push(imageUrl);
        }
      }

      // تحديث الخبر بروابط الصور
      const { error } = await supabase
        .from('news')
        .update({ images: imageUrls })
        .eq('id', newsId);

      if (error) throw error;
      return imageUrls;
    } catch (error) {
      console.error('خطأ في رفع صور الخبر:', error);
      return [];
    }
  }
}

// خدمة السباكين المحدثة
export class PlumberService {
  // جلب جميع السباكين المعتمدين مع ملفاتهم الشخصية
  async getApprovedPlumbers(): Promise<PlumberProfile[]> {
    try {
      const { data, error } = await supabase
        .from('plumbers')
        .select(`
          *,
          user:users(*),
          profile:user_profiles(*)
        `)
        .eq('is_approved', true)
        .order('rating', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('خطأ في جلب السباكين المعتمدين:', error);
      return [];
    }
  }

  // جلب ملف سباك محدد
  async getPlumberProfile(plumberId: string): Promise<PlumberProfile | null> {
    try {
      const { data, error } = await supabase
        .from('plumbers')
        .select(`
          *,
          user:users(*),
          profile:user_profiles(*)
        `)
        .eq('id', plumberId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('خطأ في جلب ملف السباك:', error);
      return null;
    }
  }

  // جلب السباكين المعلقين (للإدارة)
  async getPendingPlumbers(): Promise<PlumberProfile[]> {
    try {
      const { data, error } = await supabase
        .from('plumbers')
        .select(`
          *,
          user:users(*),
          profile:user_profiles(*)
        `)
        .eq('is_approved', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('خطأ في جلب السباكين المعلقين:', error);
      return [];
    }
  }

  // الموافقة على سباك (للإدارة)
  async approvePlumber(plumberId: string, adminId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('plumbers')
        .update({
          is_approved: true,
          approved_by: adminId,
          approved_at: new Date().toISOString()
        })
        .eq('id', plumberId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('خطأ في الموافقة على السباك:', error);
      return false;
    }
  }
}

// خدمة التقارير المحدثة
export class ReportService {
  // جلب التقارير المعتمدة
  async getApprovedReports(): Promise<ReportWithUser[]> {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select(`
          id,
          title,
          description,
          reporter_id,
          reporter_name,
          reporter_phone,
          location_lat,
          location_lng,
          location_address,
          area,
          priority,
          status,
          images,
          is_approved,
          approved_at,
          approved_by,
          rejection_reason,
          created_at,
          updated_at,
          user:users(
            id,
            email,
            display_name,
            phone_number,
            profile_image_url
          )
        `)
        .eq('is_approved', true)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('خطأ في جلب التقارير المعتمدة:', error);
      return [];
    }
  }

  // إنشاء تقرير جديد
  async createReport(userId: string, reportData: {
    title: string;
    description: string;
    reporter_name: string;
    reporter_phone: string;
    location?: { lat: number; lng: number; address?: string };
    area?: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
  }): Promise<string | null> {
    try {
      console.log('محاولة إنشاء تقرير جديد...', { userId, reportData });
      
      const insertData = {
        ...reportData,
        reporter_id: userId,
        location_lat: reportData.location?.lat || null,
        location_lng: reportData.location?.lng || null,
        location_address: reportData.location?.address || null,
        priority: reportData.priority || 'medium',
        status: 'pending' as const,
        is_approved: false,
        images: [] as string[]
      };
      
      console.log('البيانات المرسلة إلى قاعدة البيانات:', insertData);
      
      const { data, error } = await supabase
        .from('reports')
        .insert(insertData)
        .select('id')
        .single();

      if (error) throw error;
      return data?.id || null;
    } catch (error: any) {
      console.error('خطأ في إنشاء التقرير:', error);
      console.error('تفاصيل الخطأ:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error; // إعادة إلقاء الخطأ ليتم التعامل معه في المكون
    }
  }

  // رفع صور للتقرير
  async uploadReportImages(files: File[], reportId: string): Promise<string[]> {
    try {
      const imageUrls: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = `${reportId}/image-${i + 1}.${file.name.split('.').pop()}`;
        const imageUrl = await uploadFile('reports', fileName, file);
        if (imageUrl) {
          imageUrls.push(imageUrl);
        }
      }

      // تحديث التقرير بروابط الصور
      const { error } = await supabase
        .from('reports')
        .update({ images: imageUrls })
        .eq('id', reportId);

      if (error) throw error;
      return imageUrls;
    } catch (error) {
      console.error('خطأ في رفع صور التقرير:', error);
      return [];
    }
  }

  // جلب التقارير المعلقة (للإدارة)
  async getPendingReports(): Promise<ReportWithUser[]> {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select(`
          *,
          user:users(*)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('خطأ في جلب التقارير المعلقة:', error);
      return [];
    }
  }

  // الموافقة على تقرير (للإدارة)
  async approveReport(reportId: string, adminId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('reports')
        .update({
          status: 'approved',
          is_approved: true,
          approved_by: adminId,
          approved_at: new Date().toISOString()
        })
        .eq('id', reportId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('خطأ في الموافقة على التقرير:', error);
      return false;
    }
  }
}

// تصدير instances الخدمات
export const userService = new UserService();
export const newsService = new NewsService();
export const plumberService = new PlumberService();
export const reportService = new ReportService();

// تصدير الخدمات القديمة للتوافق مع النسخة السابقة
export const supabaseNewsService = newsService;
export const supabasePlumberService = plumberService;
export const supabaseReportsService = reportService;
