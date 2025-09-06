"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContextV2";
import { newsService, type NewsWithUser } from "@/lib/supabase-services-v2";
import AdminProtection from "@/components/AdminProtection";
import Link from "next/link";
import Image from "next/image";
import { NewsIcon, UserIcon, CategoryIcon } from "@/components/icons/ProfessionalIcons";

export default function AdminNewsPage() {
  const { user: authUser } = useAuth();
  const [pendingNews, setPendingNews] = useState<NewsWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    loadPendingNews();
  }, []);

  const loadPendingNews = async () => {
    try {
      setLoading(true);
      const news = await newsService.getPendingNews();
      setPendingNews(news);
    } catch (error) {
      console.error('خطأ في تحميل الأخبار المعلقة:', error);
      setMessage('حدث خطأ في تحميل الأخبار');
    } finally {
      setLoading(false);
    }
  };

  const approveNews = async (newsId: string) => {
    if (!authUser) return;
    
    try {
      setActionLoading(newsId);
      const success = await newsService.approveNews(newsId, authUser.id);
      
      if (success) {
        setMessage('تم الموافقة على الخبر ونشره بنجاح!');
        await loadPendingNews(); // إعادة تحميل القائمة
      } else {
        setMessage('حدث خطأ في الموافقة على الخبر');
      }
    } catch (error) {
      console.error('خطأ في الموافقة على الخبر:', error);
      setMessage('حدث خطأ في الموافقة على الخبر');
    } finally {
      setActionLoading(null);
    }
  };

  const rejectNews = async (newsId: string, reason: string) => {
    if (!authUser) return;
    
    try {
      setActionLoading(newsId);
      const success = await newsService.rejectNews(newsId, authUser.id, reason);
      
      if (success) {
        setMessage('تم رفض الخبر بنجاح');
        await loadPendingNews(); // إعادة تحميل القائمة
      } else {
        setMessage('حدث خطأ في رفض الخبر');
      }
    } catch (error) {
      console.error('خطأ في رفض الخبر:', error);
      setMessage('حدث خطأ في رفض الخبر');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = (newsId: string) => {
    const reason = prompt('يرجى إدخال سبب الرفض:');
    if (reason && reason.trim()) {
      rejectNews(newsId, reason.trim());
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryName = (category: string) => {
    const categories: { [key: string]: string } = {
      'general': 'عام',
      'water_issues': 'مشاكل المياه',
      'maintenance': 'صيانة',
      'announcements': 'إعلانات',
      'community': 'مجتمعي',
      'emergency': 'طوارئ'
    };
    return categories[category] || category;
  };

  return (
    <AdminProtection>
      <main className="min-h-screen gradient-bg">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center mb-4">
                <NewsIcon size={48} className="ml-4" />
                <h1 className="heading-1 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  إدارة الأخبار
                </h1>
              </div>
              <p className="text-secondary text-lg">
                مراجعة والموافقة على الأخبار المرسلة من المستخدمين
              </p>
            </div>
            <Link href="/admin/dashboard" className="btn btn-secondary">
              العودة للوحة التحكم
            </Link>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="card text-center">
              <h3 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                {pendingNews.length}
              </h3>
              <p className="text-secondary">أخبار في الانتظار</p>
            </div>
            <div className="card text-center">
              <button
                onClick={loadPendingNews}
                className="btn btn-secondary w-full"
                disabled={loading}
              >
                {loading ? 'جاري التحديث...' : 'تحديث القائمة'}
              </button>
            </div>
            <div className="card text-center">
              <Link href="/create-news" className="btn btn-primary w-full">
                إنشاء خبر جديد
              </Link>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className={`alert ${message.includes('بنجاح') ? 'alert-success' : 'alert-error'} mb-8 animate-fadeIn`}>
              <div className="flex items-center">
                <span className="text-xl ml-3">
                  {message.includes('بنجاح') ? '✅' : '❌'}
                </span>
                <span>{message}</span>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
                <p className="text-secondary font-medium">جاري تحميل الأخبار...</p>
              </div>
            </div>
          ) : pendingNews.length === 0 ? (
            /* Empty State */
            <div className="text-center py-12">
              <NewsIcon size={64} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-secondary mb-2">لا توجد أخبار معلقة</h3>
              <p className="text-secondary">جميع الأخبار تمت مراجعتها</p>
            </div>
          ) : (
            /* News List */
            <div className="space-y-6">
              {pendingNews.map((news, index) => (
                <div key={news.id} className="card animate-slideIn" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="heading-3 text-primary mb-2">{news.title}</h3>
                          <div className="flex items-center space-x-4 space-x-reverse text-sm text-secondary mb-4">
                            <div className="flex items-center">
                              <UserIcon size={16} className="ml-1" />
                              <span>{news.author_name}</span>
                            </div>
                            <div className="flex items-center">
                              <CategoryIcon size={16} className="ml-1" />
                              <span>{getCategoryName(news.category)}</span>
                            </div>
                            <div className="flex items-center">
                              <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                              <span>{formatDate(news.created_at)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <span className="inline-block bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 text-xs px-2 py-1 rounded-full">
                            في الانتظار
                          </span>
                        </div>
                      </div>

                      <div className="prose prose-sm max-w-none mb-4">
                        <p className="text-secondary leading-relaxed">
                          {news.content.length > 300 
                            ? `${news.content.substring(0, 300)}...` 
                            : news.content
                          }
                        </p>
                      </div>

                      {/* Tags */}
                      {news.tags && news.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {news.tags.map((tag, tagIndex) => (
                            <span key={tagIndex} className="inline-block bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Images */}
                      {news.images && news.images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                          {news.images.map((imageUrl, imageIndex) => (
                            <div key={imageIndex} className="relative aspect-video rounded-lg overflow-hidden">
                              <Image
                                src={imageUrl}
                                alt={`صورة ${imageIndex + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="lg:w-64 flex lg:flex-col gap-3">
                      <button
                        onClick={() => approveNews(news.id)}
                        disabled={actionLoading === news.id}
                        className="btn btn-primary flex-1 lg:flex-none"
                      >
                        {actionLoading === news.id ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent ml-2"></div>
                            جاري الموافقة...
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            موافقة ونشر
                          </div>
                        )}
                      </button>

                      <button
                        onClick={() => handleReject(news.id)}
                        disabled={actionLoading === news.id}
                        className="btn btn-secondary text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex-1 lg:flex-none"
                      >
                        <div className="flex items-center justify-center">
                          <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          رفض
                        </div>
                      </button>

                      <div className="text-xs text-secondary p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p><strong>المؤلف:</strong> {news.user?.display_name}</p>
                        <p><strong>البريد:</strong> {news.user?.email}</p>
                        <p><strong>تاريخ الإرسال:</strong> {formatDate(news.created_at)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </AdminProtection>
  );
}
