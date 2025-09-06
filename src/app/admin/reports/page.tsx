"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContextV2";
import { reportService, type ReportWithUser } from "@/lib/supabase-services-v2";
import AdminProtection from "@/components/AdminProtection";
import Link from "next/link";
import Image from "next/image";
import { ReportIcon, UserIcon, LocationIcon, PriorityIcon } from "@/components/icons/ProfessionalIcons";

export default function AdminReportsPage() {
  const { user: authUser } = useAuth();
  const [pendingReports, setPendingReports] = useState<ReportWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    loadPendingReports();
  }, []);

  const loadPendingReports = async () => {
    try {
      setLoading(true);
      const reports = await reportService.getPendingReports();
      setPendingReports(reports);
    } catch (error) {
      console.error('خطأ في تحميل التقارير المعلقة:', error);
      setMessage('حدث خطأ في تحميل التقارير');
    } finally {
      setLoading(false);
    }
  };

  const approveReport = async (reportId: string) => {
    if (!authUser) return;
    
    try {
      setActionLoading(reportId);
      const success = await reportService.approveReport(reportId, authUser.id);
      
      if (success) {
        setMessage('تم الموافقة على التقرير ونشره بنجاح!');
        await loadPendingReports(); // إعادة تحميل القائمة
      } else {
        setMessage('حدث خطأ في الموافقة على التقرير');
      }
    } catch (error) {
      console.error('خطأ في الموافقة على التقرير:', error);
      setMessage('حدث خطأ في الموافقة على التقرير');
    } finally {
      setActionLoading(null);
    }
  };

  const rejectReport = async (reportId: string, reason: string) => {
    if (!authUser) return;
    
    try {
      setActionLoading(reportId);
      // يمكن إضافة دالة rejectReport في الخدمة لاحقاً
      // const success = await reportService.rejectReport(reportId, authUser.id, reason);
      setMessage('ميزة رفض التقارير ستكون متاحة قريباً');
    } catch (error) {
      console.error('خطأ في رفض التقرير:', error);
      setMessage('حدث خطأ في رفض التقرير');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = (reportId: string) => {
    const reason = prompt('يرجى إدخال سبب الرفض:');
    if (reason && reason.trim()) {
      rejectReport(reportId, reason.trim());
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'عاجلة';
      case 'high': return 'عالية';
      case 'medium': return 'متوسطة';
      case 'low': return 'منخفضة';
      default: return 'متوسطة';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return '🔴';
      case 'high': return '🟠';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '🟡';
    }
  };

  return (
    <AdminProtection>
      <main className="min-h-screen gradient-bg">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center mb-4">
                <ReportIcon size={48} className="ml-4" />
                <h1 className="heading-1 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  إدارة التقارير
                </h1>
              </div>
              <p className="text-secondary text-lg">
                مراجعة والموافقة على تقارير المشاكل المرسلة من المواطنين
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
                {pendingReports.length}
              </h3>
              <p className="text-secondary">تقارير في الانتظار</p>
            </div>
            <div className="card text-center">
              <button
                onClick={loadPendingReports}
                className="btn btn-secondary w-full"
                disabled={loading}
              >
                {loading ? 'جاري التحديث...' : 'تحديث القائمة'}
              </button>
            </div>
            <div className="card text-center">
              <Link href="/reports" className="btn btn-primary w-full">
                عرض الخريطة
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
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-600 border-t-transparent mb-4"></div>
                <p className="text-secondary font-medium">جاري تحميل التقارير...</p>
              </div>
            </div>
          ) : pendingReports.length === 0 ? (
            /* Empty State */
            <div className="text-center py-12">
              <ReportIcon size={64} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-secondary mb-2">لا توجد تقارير معلقة</h3>
              <p className="text-secondary">جميع التقارير تمت مراجعتها</p>
            </div>
          ) : (
            /* Reports List */
            <div className="space-y-6">
              {pendingReports.map((report, index) => (
                <div key={report.id} className="card animate-slideIn" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="heading-3 text-primary mb-2">{report.title}</h3>
                          <div className="flex items-center space-x-4 space-x-reverse text-sm text-secondary mb-4">
                            <div className="flex items-center">
                              <UserIcon size={16} className="ml-1" />
                              <span>{report.reporter_name}</span>
                            </div>
                            <div className="flex items-center">
                              <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                              </svg>
                              <span dir="ltr">{report.reporter_phone}</span>
                            </div>
                            <div className="flex items-center">
                              <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                              <span>{formatDate(report.created_at)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <span className={`inline-block text-xs px-2 py-1 rounded-full ${getPriorityColor(report.priority)}`}>
                            {getPriorityIcon(report.priority)} {getPriorityText(report.priority)}
                          </span>
                          <span className="inline-block bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 text-xs px-2 py-1 rounded-full">
                            في الانتظار
                          </span>
                        </div>
                      </div>

                      <div className="prose prose-sm max-w-none mb-4">
                        <p className="text-secondary leading-relaxed">
                          {report.description}
                        </p>
                      </div>

                      {/* Location */}
                      {(report.location_lat && report.location_lng) && (
                        <div className="flex items-center space-x-2 space-x-reverse text-sm text-secondary mb-4">
                          <LocationIcon size={16} />
                          <span>الإحداثيات: {report.location_lat}, {report.location_lng}</span>
                          {report.location_address && (
                            <span className="text-gray-400">•</span>
                          )}
                          {report.location_address && (
                            <span>{report.location_address}</span>
                          )}
                        </div>
                      )}

                      {report.area && (
                        <div className="flex items-center space-x-2 space-x-reverse text-sm text-secondary mb-4">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          <span>المنطقة: {report.area}</span>
                        </div>
                      )}

                      {/* Images */}
                      {report.images && report.images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                          {report.images.map((imageUrl, imageIndex) => (
                            <div key={imageIndex} className="relative aspect-video rounded-lg overflow-hidden">
                              <Image
                                src={imageUrl}
                                alt={`صورة التقرير ${imageIndex + 1}`}
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
                        onClick={() => approveReport(report.id)}
                        disabled={actionLoading === report.id}
                        className="btn btn-primary flex-1 lg:flex-none"
                      >
                        {actionLoading === report.id ? (
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
                        onClick={() => handleReject(report.id)}
                        disabled={actionLoading === report.id}
                        className="btn btn-secondary text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex-1 lg:flex-none"
                      >
                        <div className="flex items-center justify-center">
                          <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          رفض
                        </div>
                      </button>

                      {/* عرض على الخريطة */}
                      {(report.location_lat && report.location_lng) && (
                        <a
                          href={`https://www.google.com/maps?q=${report.location_lat},${report.location_lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-secondary flex-1 lg:flex-none text-center"
                        >
                          <div className="flex items-center justify-center">
                            <LocationIcon size={16} className="ml-2" />
                            عرض على الخريطة
                          </div>
                        </a>
                      )}

                      <div className="text-xs text-secondary p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p><strong>المبلغ:</strong> {report.reporter_name}</p>
                        <p><strong>الهاتف:</strong> {report.reporter_phone}</p>
                        <p><strong>تاريخ الإرسال:</strong> {formatDate(report.created_at)}</p>
                        <p><strong>الأولوية:</strong> {getPriorityText(report.priority)}</p>
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
