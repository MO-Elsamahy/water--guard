"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContextV2";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LoginIcon, UserIcon } from "@/components/icons/ProfessionalIcons";

interface AuthGuardProps {
  children: React.ReactNode;
}

// الصفحات المسموح بها بدون تسجيل دخول - فقط الصفحة الرئيسية وصفحات التسجيل
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/plumber-signup',
  '/setup-database',
  '/debug-auth'
];

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      console.log('AuthGuard - checking auth:', { user, loading, pathname });
      
      // انتظار تحميل حالة المصادقة
      if (loading) {
        console.log('AuthGuard - still loading...');
        return;
      }

      // التحقق من أن الصفحة الحالية مسموحة بدون تسجيل دخول
      const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
      console.log('AuthGuard - isPublicRoute:', isPublicRoute, 'for path:', pathname);
      
      if (!user && !isPublicRoute) {
        console.log('AuthGuard - redirecting to login, no user and private route');
        // المستخدم غير مسجل دخول ويحاول الوصول لصفحة محمية
        router.replace('/login');
        return;
      }

      console.log('AuthGuard - auth check complete');
      setAuthChecked(true);
      setIsChecking(false);
    };

    checkAuth();
  }, [user, loading, pathname, router]);

  // عرض شاشة تحميل أثناء التحقق من المصادقة
  if (loading || isChecking) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-secondary font-medium">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // إذا كان المستخدم غير مسجل دخول ويحاول الوصول لصفحة محمية
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  if (!user && !isPublicRoute && authChecked) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="card text-center max-w-md">
          <div className="bg-gradient-to-br from-red-500 to-red-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <LoginIcon size={32} className="text-white" />
          </div>
          <h2 className="heading-2 text-primary mb-4">تسجيل الدخول مطلوب</h2>
          <p className="text-secondary mb-6">
            يجب تسجيل الدخول للوصول إلى هذه الصفحة
          </p>
          <div className="space-y-3">
            <Link href="/login" className="btn btn-primary w-full">
              تسجيل الدخول
            </Link>
            <Link href="/signup" className="btn btn-secondary w-full">
              إنشاء حساب جديد
            </Link>
            <Link href="/" className="btn btn-ghost w-full">
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // عرض المحتوى إذا كان المستخدم مسجل دخول أو في صفحة عامة
  return <>{children}</>;
}
