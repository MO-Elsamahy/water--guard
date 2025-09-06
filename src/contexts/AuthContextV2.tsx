"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { userService, type User, type UserProfile } from '@/lib/supabase-services-v2';
import type { AuthUser } from '@supabase/supabase-js';

interface AuthContextType {
  user: AuthUser | null;
  userProfile: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string, phoneNumber?: string, role?: 'user' | 'plumber') => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<boolean>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  uploadProfileImage: (file: File) => Promise<string | null>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // جلب المستخدم الحالي
    const initializeAuth = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (authUser) {
          setUser(authUser);
          await loadUserProfiles(authUser.id);
        }
      } catch (error) {
        console.error('خطأ في تهيئة المصادقة:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // الاستماع لتغييرات حالة المصادقة
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          await loadUserProfiles(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setUserProfile(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfiles = async (userId: string) => {
    try {
      const profileData = await userService.getUserProfile(userId);
      if (profileData) {
        setUserProfile(profileData.user);
        setProfile(profileData.profile);
      }
    } catch (error) {
      console.error('خطأ في تحميل ملف المستخدم:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        setUser(data.user);
        await loadUserProfiles(data.user.id);
      }
    } catch (error: any) {
      console.error('خطأ في تسجيل الدخول:', error);
      throw new Error(getAuthErrorMessage(error.message));
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    displayName: string, 
    phoneNumber?: string,
    role: 'user' | 'plumber' = 'user'
  ) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
            phone_number: phoneNumber,
            role: role
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        setUser(data.user);
        // الانتظار قليلاً للسماح للـ trigger بإنشاء الملف الشخصي
        setTimeout(async () => {
          await loadUserProfiles(data.user!.id);
        }, 1000);
      }
    } catch (error: any) {
      console.error('خطأ في التسجيل:', error);
      throw new Error(getAuthErrorMessage(error.message));
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setUserProfile(null);
      setProfile(null);
    } catch (error: any) {
      console.error('خطأ في تسجيل الخروج:', error);
      throw new Error('حدث خطأ في تسجيل الخروج');
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    if (!user) return false;
    
    const success = await userService.updateUserProfile(user.id, updates);
    if (success) {
      await loadUserProfiles(user.id);
    }
    return success;
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return false;
    
    const success = await userService.updateProfile(user.id, updates);
    if (success) {
      await loadUserProfiles(user.id);
    }
    return success;
  };

  const uploadProfileImage = async (file: File) => {
    if (!user) return null;
    
    const imageUrl = await userService.uploadProfileImage(user.id, file);
    if (imageUrl) {
      await loadUserProfiles(user.id);
    }
    return imageUrl;
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    } catch (error: any) {
      console.error('خطأ في إعادة تعيين كلمة المرور:', error);
      throw new Error('حدث خطأ في إرسال رابط إعادة تعيين كلمة المرور');
    }
  };

  const value: AuthContextType = {
    user,
    userProfile,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateUserProfile,
    updateProfile,
    uploadProfileImage,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// وظيفة لتحويل رسائل خطأ Firebase إلى العربية
function getAuthErrorMessage(error: string): string {
  const errorMessages: { [key: string]: string } = {
    'auth/user-not-found': 'البريد الإلكتروني غير مسجل',
    'auth/wrong-password': 'كلمة المرور غير صحيحة',
    'auth/email-already-in-use': 'البريد الإلكتروني مستخدم بالفعل',
    'auth/weak-password': 'كلمة المرور ضعيفة جداً',
    'auth/invalid-email': 'البريد الإلكتروني غير صحيح',
    'auth/too-many-requests': 'تم تجاوز عدد المحاولات المسموح، يرجى المحاولة لاحقاً',
    'auth/network-request-failed': 'خطأ في الاتصال بالإنترنت',
    'auth/invalid-credential': 'بيانات الدخول غير صحيحة',
    'Invalid login credentials': 'بيانات الدخول غير صحيحة',
    'Email not confirmed': 'يرجى تأكيد البريد الإلكتروني أولاً',
    'Invalid email or password': 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
  };

  // البحث عن رسالة الخطأ في القاموس
  for (const [key, value] of Object.entries(errorMessages)) {
    if (error.includes(key)) {
      return value;
    }
  }

  // إذا لم نجد رسالة مطابقة، نعيد رسالة عامة
  return 'حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى';
}
