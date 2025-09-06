"use client";
import { useState, useEffect } from "react";
import { reportService, type ReportWithUser } from "@/lib/supabase-services-v2";
import { mahallaCenter } from "@/lib/config";
import ReportsMapClient from "./ReportsMapClient";
import { MapIcon, ReportIcon, LocationIcon } from "@/components/icons/ProfessionalIcons";

export default function ReportsMapPage() {
  const [reports, setReports] = useState<ReportWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<ReportWithUser | null>(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const approvedReports = await reportService.getApprovedReports();
      setReports(approvedReports);
    } catch (error) {
      console.error('خطأ في تحميل البلاغات:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'high': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'عاجل جداً';
      case 'high': return 'عالي';
      case 'medium': return 'متوسط';
      case 'low': return 'منخفض';
      default: return priority;
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen gradient-bg p-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-secondary">جاري تحميل البلاغات...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen gradient-bg">
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg mr-4">
              <MapIcon size={24} className="text-white" />
            </div>
            <div>
              <h1 className="heading-1 text-primary">خريطة البلاغات</h1>
              <p className="text-secondary">عرض جميع البلاغات المعتمدة على الخريطة</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="card text-center">
              <div className="text-2xl font-bold text-primary">{reports.length}</div>
              <div className="text-secondary text-sm">إجمالي البلاغات</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-red-600">{reports.filter(r => r.priority === 'urgent').length}</div>
              <div className="text-secondary text-sm">عاجل جداً</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-orange-600">{reports.filter(r => r.priority === 'high').length}</div>
              <div className="text-secondary text-sm">عالي</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-yellow-600">{reports.filter(r => r.priority === 'medium').length}</div>
              <div className="text-secondary text-sm">متوسط</div>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="card p-0 overflow-hidden" style={{ height: '600px' }}>
              <ReportsMapClient
                center={[mahallaCenter.lat, mahallaCenter.lng]}
                zoom={mahallaCenter.zoom}
                reports={reports}
                onReportSelect={setSelectedReport}
              />
            </div>
          </div>

          {/* Report Details Sidebar */}
          <div className="lg:col-span-1">
            <div className="card h-fit max-h-[600px] overflow-y-auto">
              {selectedReport ? (
                <div>
                  <div className="flex items-center mb-4">
                    <ReportIcon size={24} className="text-primary mr-2" />
                    <h3 className="heading-3 text-primary">تفاصيل البلاغ</h3>
                  </div>

                  <div className="space-y-4">
                    {/* Title */}
                    <div>
                      <h4 className="font-semibold text-primary mb-1">{selectedReport.title}</h4>
                    </div>

                    {/* Priority */}
                    <div>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedReport.priority)}`}>
                        {getPriorityText(selectedReport.priority)}
                      </span>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="label">الوصف:</label>
                      <p className="text-secondary bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                        {selectedReport.description}
                      </p>
                    </div>

                    {/* Location */}
                    <div>
                      <label className="label flex items-center">
                        <LocationIcon size={16} className="mr-1" />
                        الموقع:
                      </label>
                      <p className="text-secondary text-sm">
                        {selectedReport.location_address || `${selectedReport.location_lat?.toFixed(4)}, ${selectedReport.location_lng?.toFixed(4)}`}
                      </p>
                    </div>

                    {/* Reporter Info */}
                    <div>
                      <label className="label">المبلغ:</label>
                      <p className="text-secondary">{selectedReport.reporter_name}</p>
                      <p className="text-secondary text-sm">{selectedReport.reporter_phone}</p>
                    </div>

                    {/* Date */}
                    <div>
                      <label className="label">تاريخ البلاغ:</label>
                      <p className="text-secondary text-sm">
                        {new Date(selectedReport.created_at).toLocaleDateString('ar-EG', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>

                    {/* Images */}
                    {selectedReport.images && selectedReport.images.length > 0 && (
                      <div>
                        <label className="label">الصور:</label>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedReport.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`صورة البلاغ ${index + 1}`}
                              className="w-full h-20 object-cover rounded-lg"
                              loading="lazy"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapIcon size={48} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-secondary">اختر بلاغاً من الخريطة لعرض التفاصيل</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 card">
          <h3 className="heading-3 text-primary mb-3">كيفية الاستخدام:</h3>
          <ul className="space-y-2 text-secondary">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
              انقر على أي علامة في الخريطة لعرض تفاصيل البلاغ
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
              الألوان تمثل أولوية البلاغ (أحمر = عاجل، برتقالي = عالي، أصفر = متوسط، أخضر = منخفض)
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
              يمكنك التكبير والتصغير للتنقل في الخريطة
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
