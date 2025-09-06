"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContextV2";
import { newsService, reportService, plumberService } from "@/lib/supabase-services-v2";
import AdminProtection from "@/components/AdminProtection";
import Link from "next/link";
import { 
  NewsIcon, 
  ReportIcon, 
  PlumberIcon, 
  UserIcon,
  SettingsIcon 
} from "@/components/icons/ProfessionalIcons";

interface DashboardStats {
  pendingNews: number;
  pendingReports: number;
  pendingPlumbers: number;
  totalUsers: number;
}

export default function AdminDashboard() {
  const { userProfile } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    pendingNews: 0,
    pendingReports: 0,
    pendingPlumbers: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      
      // جلب الإحصائيات (يمكن تحسينها لاحقاً بـ API واحد)
      const [pendingNews, pendingReports, pendingPlumbers] = await Promise.all([
        newsService.getPendingNews(),
        reportService.getPendingReports(),
        plumberService.getPendingPlumbers()
      ]);

      setStats({
        pendingNews: pendingNews.length,
        pendingReports: pendingReports.length,
        pendingPlumbers: pendingPlumbers.length,
        totalUsers: 0 // يمكن إضافة API لجلب عدد المستخدمين
      });
    } catch (error) {
      console.error('خطأ في تحميل إحصائيات لوحة التحكم:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminProtection>
      <main className="min-h-screen gradient-bg">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12 animate-fadeIn">
            <div className="flex items-center justify-center mb-6">
              <SettingsIcon size={48} className="ml-4" />
              <h1 className="heading-1 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                لوحة التحكم الإدارية
              </h1>
            </div>
            <p className="text-secondary text-lg max-w-2xl mx-auto">
              مرحباً {userProfile?.display_name}، مراجعة وإدارة محتوى الموقع
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="card text-center group hover:scale-105 transition-transform duration-300">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <NewsIcon size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {loading ? '...' : stats.pendingNews}
              </h3>
              <p className="text-secondary font-medium">أخبار معلقة</p>
              {stats.pendingNews > 0 && (
                <div className="mt-2">
                  <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                    يحتاج مراجعة
                  </span>
                </div>
              )}
            </div>

            <div className="card text-center group hover:scale-105 transition-transform duration-300">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <ReportIcon size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                {loading ? '...' : stats.pendingReports}
              </h3>
              <p className="text-secondary font-medium">تقارير معلقة</p>
              {stats.pendingReports > 0 && (
                <div className="mt-2">
                  <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                    يحتاج مراجعة
                  </span>
                </div>
              )}
            </div>

            <div className="card text-center group hover:scale-105 transition-transform duration-300">
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <PlumberIcon size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                {loading ? '...' : stats.pendingPlumbers}
              </h3>
              <p className="text-secondary font-medium">سباكين معلقين</p>
              {stats.pendingPlumbers > 0 && (
                <div className="mt-2">
                  <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                    يحتاج مراجعة
                  </span>
                </div>
              )}
            </div>

            <div className="card text-center group hover:scale-105 transition-transform duration-300">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <UserIcon size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {loading ? '...' : stats.totalUsers}
              </h3>
              <p className="text-secondary font-medium">إجمالي المستخدمين</p>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* إدارة الأخبار */}
            <Link href="/admin/news" className="group">
              <div className="card hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-12 h-12 rounded-xl flex items-center justify-center">
                    <NewsIcon size={24} className="text-white" />
                  </div>
                  <div className="mr-4">
                    <h3 className="heading-3 text-blue-600 dark:text-blue-400">إدارة الأخبار</h3>
                    <p className="text-secondary text-sm">مراجعة الأخبار المعلقة</p>
                  </div>
                </div>
                <p className="text-secondary mb-4">
                  مراجعة وإدارة الأخبار المرسلة من المستخدمين، الموافقة أو الرفض مع إمكانية التعديل
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {stats.pendingNews} في الانتظار
                  </span>
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* إدارة التقارير */}
            <Link href="/admin/reports" className="group">
              <div className="card hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-br from-orange-500 to-red-600 w-12 h-12 rounded-xl flex items-center justify-center">
                    <ReportIcon size={24} className="text-white" />
                  </div>
                  <div className="mr-4">
                    <h3 className="heading-3 text-orange-600 dark:text-orange-400">إدارة التقارير</h3>
                    <p className="text-secondary text-sm">مراجعة تقارير المشاكل</p>
                  </div>
                </div>
                <p className="text-secondary mb-4">
                  مراجعة تقارير المشاكل المرسلة من المواطنين، تأكيد صحتها والموافقة على نشرها
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                    {stats.pendingReports} في الانتظار
                  </span>
                  <svg className="w-5 h-5 text-orange-600 dark:text-orange-400 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* إدارة السباكين */}
            <Link href="/admin/plumbers" className="group">
              <div className="card hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 w-12 h-12 rounded-xl flex items-center justify-center">
                    <PlumberIcon size={24} className="text-white" />
                  </div>
                  <div className="mr-4">
                    <h3 className="heading-3 text-green-600 dark:text-green-400">إدارة السباكين</h3>
                    <p className="text-secondary text-sm">مراجعة طلبات الانضمام</p>
                  </div>
                </div>
                <p className="text-secondary mb-4">
                  مراجعة طلبات انضمام السباكين الجدد، التحقق من المؤهلات والموافقة على العضوية
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    {stats.pendingPlumbers} في الانتظار
                  </span>
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="mt-12 card">
            <h3 className="heading-3 mb-6 flex items-center">
              <svg className="w-6 h-6 ml-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              إجراءات سريعة
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/create-news" className="btn btn-secondary text-center">
                <NewsIcon size={20} className="inline ml-2" />
                إنشاء خبر جديد
              </Link>
              <button 
                onClick={loadDashboardStats}
                className="btn btn-secondary"
                disabled={loading}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent inline ml-2"></div>
                ) : (
                  <svg className="w-5 h-5 inline ml-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                )}
                تحديث الإحصائيات
              </button>
              <Link href="/plumbers" className="btn btn-secondary text-center">
                <PlumberIcon size={20} className="inline ml-2" />
                دليل السباكين
              </Link>
              <Link href="/news" className="btn btn-secondary text-center">
                <NewsIcon size={20} className="inline ml-2" />
                عرض الأخبار
              </Link>
            </div>
          </div>
        </div>
      </main>
    </AdminProtection>
  );
}