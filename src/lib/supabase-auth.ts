import { supabase } from './supabase';
import type { User, AuthError } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  role: 'user' | 'plumber' | 'admin';
  isActive: boolean;
  profileImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlumberProfile {
  id: string;
  experience: number;
  specialties: string[];
  workingAreas: string[];
  isAvailable: boolean;
  isApproved: boolean;
  rating: number;
  completedJobs: number;
  licenseNumber?: string;
  licenseImageUrl?: string;
  description?: string;
  hourlyRate?: number;
}

export class SupabaseAuthService {
  // تسجيل مستخدم جديد
  async registerUser(
    email: string,
    password: string,
    displayName: string,
    phoneNumber: string
  ): Promise<UserProfile> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
            phone_number: phoneNumber,
            role: 'user'
          }
        }
      });

      if (error) throw error;
      if (!data.user) throw new Error('فشل في إنشاء المستخدم');

      // جلب بيانات المستخدم من قاعدة البيانات
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) throw profileError;

      return {
        id: userProfile.id,
        email: userProfile.email,
        displayName: userProfile.display_name,
        phoneNumber: userProfile.phone_number,
        role: userProfile.role,
        isActive: userProfile.is_active,
        profileImageUrl: userProfile.profile_image_url,
        createdAt: userProfile.created_at,
        updatedAt: userProfile.updated_at
      };
    } catch (error: any) {
      console.error('خطأ في تسجيل المستخدم:', error);
      
      // معالجة أخطاء Supabase
      if (error.message?.includes('already registered')) {
        throw new Error('هذا البريد الإلكتروني مسجل بالفعل. يرجى استخدام بريد آخر أو تسجيل الدخول.');
      }
      if (error.message?.includes('Password should be at least')) {
        throw new Error('كلمة المرور يجب أن تكون 6 أحرف على الأقل.');
      }
      if (error.message?.includes('Invalid email')) {
        throw new Error('البريد الإلكتروني غير صحيح. يرجى التحقق من صيغة البريد.');
      }
      if (error.message?.includes('signup is disabled')) {
        throw new Error('تسجيل المستخدمين غير مفعل حالياً.');
      }
      
      throw new Error(error.message || 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.');
    }
  }

  // تسجيل سباك جديد
  async registerPlumber(
    email: string,
    password: string,
    displayName: string,
    phoneNumber: string,
    experience: number,
    specialties: string[],
    workingAreas: string[],
    licenseNumber?: string,
    description?: string,
    hourlyRate?: number
  ): Promise<UserProfile> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
            phone_number: phoneNumber,
            role: 'plumber',
            experience,
            specialties,
            working_areas: workingAreas,
            license_number: licenseNumber,
            description,
            hourly_rate: hourlyRate
          }
        }
      });

      if (error) throw error;
      if (!data.user) throw new Error('فشل في إنشاء حساب السباك');

      // جلب بيانات المستخدم من قاعدة البيانات
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) throw profileError;

      return {
        id: userProfile.id,
        email: userProfile.email,
        displayName: userProfile.display_name,
        phoneNumber: userProfile.phone_number,
        role: userProfile.role,
        isActive: userProfile.is_active,
        profileImageUrl: userProfile.profile_image_url,
        createdAt: userProfile.created_at,
        updatedAt: userProfile.updated_at
      };
    } catch (error: any) {
      console.error('خطأ في تسجيل السباك:', error);
      
      // نفس معالجة الأخطاء كما في registerUser
      if (error.message?.includes('already registered')) {
        throw new Error('هذا البريد الإلكتروني مسجل بالفعل. يرجى استخدام بريد آخر أو تسجيل الدخول.');
      }
      if (error.message?.includes('Password should be at least')) {
        throw new Error('كلمة المرور يجب أن تكون 6 أحرف على الأقل.');
      }
      if (error.message?.includes('Invalid email')) {
        throw new Error('البريد الإلكتروني غير صحيح. يرجى التحقق من صيغة البريد.');
      }
      
      throw new Error(error.message || 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.');
    }
  }

  // تسجيل الدخول
  async signIn(email: string, password: string): Promise<UserProfile> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      if (!data.user) throw new Error('فشل في تسجيل الدخول');

      // جلب بيانات المستخدم من قاعدة البيانات
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) throw profileError;

      return {
        id: userProfile.id,
        email: userProfile.email,
        displayName: userProfile.display_name,
        phoneNumber: userProfile.phone_number,
        role: userProfile.role,
        isActive: userProfile.is_active,
        profileImageUrl: userProfile.profile_image_url,
        createdAt: userProfile.created_at,
        updatedAt: userProfile.updated_at
      };
    } catch (error: any) {
      console.error('خطأ في تسجيل الدخول:', error);
      
      if (error.message?.includes('Invalid login credentials')) {
        throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
      }
      if (error.message?.includes('Email not confirmed')) {
        throw new Error('يرجى تأكيد بريدك الإلكتروني أولاً.');
      }
      if (error.message?.includes('Too many requests')) {
        throw new Error('محاولات دخول كثيرة. يرجى المحاولة لاحقاً.');
      }
      
      throw new Error(error.message || 'حدث خطأ في تسجيل الدخول. يرجى المحاولة مرة أخرى.');
    }
  }

  // تسجيل الخروج
  async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      console.error('خطأ في تسجيل الخروج:', error);
      throw new Error('حدث خطأ في تسجيل الخروج.');
    }
  }

  // الحصول على المستخدم الحالي
  async getCurrentUser(): Promise<UserProfile | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) throw error;
      if (!user) return null;

      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      return {
        id: userProfile.id,
        email: userProfile.email,
        displayName: userProfile.display_name,
        phoneNumber: userProfile.phone_number,
        role: userProfile.role,
        isActive: userProfile.is_active,
        profileImageUrl: userProfile.profile_image_url,
        createdAt: userProfile.created_at,
        updatedAt: userProfile.updated_at
      };
    } catch (error) {
      console.error('خطأ في جلب المستخدم الحالي:', error);
      return null;
    }
  }

  // تحديث الملف الشخصي
  async updateProfile(
    updates: Partial<Pick<UserProfile, 'displayName' | 'phoneNumber' | 'profileImageUrl'>>
  ): Promise<UserProfile> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('المستخدم غير مسجل الدخول');

      const { data, error } = await supabase
        .from('users')
        .update({
          display_name: updates.displayName,
          phone_number: updates.phoneNumber,
          profile_image_url: updates.profileImageUrl
        })
        .eq('id', user.id)
        .select('*')
        .single();

      if (error) throw error;

      return {
        id: data.id,
        email: data.email,
        displayName: data.display_name,
        phoneNumber: data.phone_number,
        role: data.role,
        isActive: data.is_active,
        profileImageUrl: data.profile_image_url,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error: any) {
      console.error('خطأ في تحديث الملف الشخصي:', error);
      throw new Error('حدث خطأ في تحديث الملف الشخصي.');
    }
  }

  // رفع صورة الملف الشخصي
  async uploadProfileImage(file: File): Promise<string> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('المستخدم غير مسجل الدخول');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error: any) {
      console.error('خطأ في رفع صورة الملف الشخصي:', error);
      throw new Error('حدث خطأ في رفع الصورة.');
    }
  }

  // الاستماع لتغييرات المصادقة
  onAuthStateChange(callback: (user: UserProfile | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const userProfile = await this.getCurrentUser();
        callback(userProfile);
      } else {
        callback(null);
      }
    });
  }

  // إعادة تعيين كلمة المرور
  async resetPassword(email: string): Promise<void> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error('خطأ في إعادة تعيين كلمة المرور:', error);
      throw new Error('حدث خطأ في إرسال رابط إعادة التعيين.');
    }
  }
}

// إنشاء instance واحد للاستخدام
export const supabaseAuth = new SupabaseAuthService();
