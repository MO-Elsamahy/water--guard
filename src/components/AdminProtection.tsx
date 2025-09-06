"use client";
import { useAuth } from "@/contexts/AuthContextV2";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AdminProtectionProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function AdminProtection({ children, fallback }: AdminProtectionProps) {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !userProfile || userProfile.role !== 'admin')) {
      router.push('/');
    }
  }, [user, userProfile, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-secondary font-medium">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    );
  }

  if (!user || !userProfile || userProfile.role !== 'admin') {
    return (
      fallback || (
        <div className="min-h-screen gradient-bg flex items-center justify-center">
          <div className="text-center">
            <div className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 max-w-md mx-auto">
              <svg className="w-16 h-16 text-red-600 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <h1 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-2">
                غير مصرح بالوصول
              </h1>
              <p className="text-red-700 dark:text-red-300 mb-6">
                هذه الصفحة مخصصة للمدراء فقط
              </p>
              <button
                onClick={() => router.push('/')}
                className="btn btn-secondary"
              >
                العودة للصفحة الرئيسية
              </button>
            </div>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}
