"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import { supabaseAuth, type UserProfile } from '@/lib/supabase-auth';

interface AuthContextType {
  currentUser: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<UserProfile>;
  register: (email: string, password: string, displayName: string, phoneNumber: string) => Promise<UserProfile>;
  registerPlumber: (
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
  ) => Promise<UserProfile>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Pick<UserProfile, 'displayName' | 'phoneNumber' | 'profileImageUrl'>>) => Promise<UserProfile>;
  uploadProfileImage: (file: File) => Promise<string>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // جلب المستخدم الحالي عند تحميل الصفحة
    const initializeAuth = async () => {
      try {
        const user = await supabaseAuth.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error('خطأ في تهيئة المصادقة:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // الاستماع لتغييرات حالة المصادقة
    const { data: { subscription } } = supabaseAuth.onAuthStateChange((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<UserProfile> => {
    try {
      const user = await supabaseAuth.signIn(email, password);
      setCurrentUser(user);
      return user;
    } catch (error) {
      console.error('خطأ في تسجيل الدخول:', error);
      throw error;
    }
  };

  const register = async (
    email: string,
    password: string,
    displayName: string,
    phoneNumber: string
  ): Promise<UserProfile> => {
    try {
      const user = await supabaseAuth.registerUser(email, password, displayName, phoneNumber);
      setCurrentUser(user);
      return user;
    } catch (error) {
      console.error('خطأ في تسجيل المستخدم:', error);
      throw error;
    }
  };

  const registerPlumber = async (
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
  ): Promise<UserProfile> => {
    try {
      const user = await supabaseAuth.registerPlumber(
        email,
        password,
        displayName,
        phoneNumber,
        experience,
        specialties,
        workingAreas,
        licenseNumber,
        description,
        hourlyRate
      );
      setCurrentUser(user);
      return user;
    } catch (error) {
      console.error('خطأ في تسجيل السباك:', error);
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await supabaseAuth.signOut();
      setCurrentUser(null);
    } catch (error) {
      console.error('خطأ في تسجيل الخروج:', error);
      throw error;
    }
  };

  const updateProfile = async (
    updates: Partial<Pick<UserProfile, 'displayName' | 'phoneNumber' | 'profileImageUrl'>>
  ): Promise<UserProfile> => {
    try {
      const updatedUser = await supabaseAuth.updateProfile(updates);
      setCurrentUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('خطأ في تحديث الملف الشخصي:', error);
      throw error;
    }
  };

  const uploadProfileImage = async (file: File): Promise<string> => {
    try {
      const imageUrl = await supabaseAuth.uploadProfileImage(file);
      
      // تحديث الملف الشخصي بالصورة الجديدة
      if (currentUser) {
        const updatedUser = await updateProfile({ profileImageUrl: imageUrl });
        setCurrentUser(updatedUser);
      }
      
      return imageUrl;
    } catch (error) {
      console.error('خطأ في رفع صورة الملف الشخصي:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      await supabaseAuth.resetPassword(email);
    } catch (error) {
      console.error('خطأ في إعادة تعيين كلمة المرور:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    loading,
    signIn,
    register,
    registerPlumber,
    signOut,
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

export function useSupabaseAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
}

// Alias للتوافق مع الكود الموجود
export const useAuth = useSupabaseAuth;
