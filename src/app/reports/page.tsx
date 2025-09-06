"use client";
import dynamic from "next/dynamic";
const FixedMapClient = dynamic(() => import("./FixedMapClient"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full glass-effect rounded-2xl">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
        <p className="text-secondary font-medium">جاري تحميل الخريطة...</p>
        <p className="text-muted text-sm mt-2">يرجى الانتظار قليلاً</p>
      </div>
    </div>
  )
});
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContextV2";
import { reportService, type ReportWithUser } from "@/lib/supabase-services-v2";
import Link from "next/link";
import { 
  MapIcon, 
  ReportIcon, 
  UserIcon, 
  PhoneIcon, 
  EmailIcon, 
  PriorityIcon, 
  CameraIcon 
} from "@/components/icons/ProfessionalIcons";
import "./map-styles.css";

export default function ReportsPage() {
  const { user: authUser } = useAuth();
  
  // تسجيل حالة المستخدم للتشخيص
  console.log('حالة المستخدم في صفحة البلاغات:', {
    authUser,
    isLoggedIn: !!authUser,
    userId: authUser?.id,
    userEmail: authUser?.email
  });
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    reporterName: "",
    reporterPhone: "",
    reporterEmail: "",
    priority: "medium" as "low" | "medium" | "high" | "urgent"
  });
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [approvedReports, setApprovedReports] = useState<ReportWithUser[]>([]);

  // إحداثيات المحلة الكبرى الصحيحة
  const mahallaCenter = { lat: 30.9706, lng: 31.1669, zoom: 13 };

  useEffect(() => {
    loadApprovedReports();
  }, []);

  const loadApprovedReports = async () => {
    try {
      const reports = await reportService.getApprovedReports();
      setApprovedReports(reports);
    } catch (error) {
      console.error('خطأ في تحميل التقارير:', error);
    }
  };

  const submitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // التحقق من تسجيل الدخول
    if (!authUser) {
      setMessage("يجب تسجيل الدخول أولاً لإرسال البلاغ.");
      return;
    }

    if (!position) {
      setMessage("يرجى تحديد موقع المشكلة على الخريطة");
      return;
    }

    // التحقق من البيانات المطلوبة
    if (!formData.title.trim()) {
      setMessage("يرجى إدخال عنوان المشكلة");
      return;
    }

    if (!formData.description.trim()) {
      setMessage("يرجى إدخال وصف المشكلة");
      return;
    }

    if (!formData.reporterName.trim()) {
      setMessage("يرجى إدخال اسم المبلغ");
      return;
    }

    if (!formData.reporterPhone.trim()) {
      setMessage("يرجى إدخال رقم الهاتف");
      return;
    }

    setLoading(true);
    setMessage(null);

    console.log('بدء إرسال البلاغ...', {
      userId: authUser.id,
      userEmail: authUser.email,
      formData,
      position
    });

    try {
      // إنشاء التقرير أولاً
      const reportData = {
        title: formData.title,
        description: formData.description,
        reporter_name: formData.reporterName,
        reporter_phone: formData.reporterPhone,
        priority: formData.priority,
        location: {
          lat: position[0],
          lng: position[1],
          address: `المحلة الكبرى - ${position[0].toFixed(4)}, ${position[1].toFixed(4)}`
        }
      };

      console.log('إرسال البيانات إلى قاعدة البيانات...', reportData);
      const reportId = await reportService.createReport(authUser.id, reportData);
      console.log('تم إنشاء التقرير بمعرف:', reportId);

      if (!reportId) {
        throw new Error('فشل في إنشاء التقرير');
      }

      // رفع الصور إذا وجدت
      if (images.length > 0) {
        await reportService.uploadReportImages(images, reportId);
      }

      setMessage("تم إرسال البلاغ بنجاح! سيتم مراجعته من قبل الإدارة قبل النشر.");

      // إعادة تعيين النموذج
      setFormData({
        title: "",
        description: "",
        reporterName: "",
        reporterPhone: "",
        reporterEmail: "",
        priority: "medium"
      });
      setImages([]);
      setPosition(null);

    } catch (error: any) {
      console.error('خطأ في إرسال التقرير:', error);
      
      // معالجة أخطاء مختلفة
      let errorMessage = "حدث خطأ في إرسال التقرير. يرجى المحاولة مرة أخرى.";
      
      if (error && typeof error === 'object') {
        // التعامل مع أخطاء Supabase
        if (error.message) {
          const message = error.message.toLowerCase();
          if (message.includes('يجب تسجيل الدخول') || message.includes('unauthorized')) {
            errorMessage = "يجب تسجيل الدخول أولاً لإرسال البلاغ.";
          } else if (message.includes('فشل في إنشاء التقرير') || message.includes('insert')) {
            errorMessage = "فشل في حفظ البلاغ. تحقق من اتصال الإنترنت.";
          } else if (message.includes('network') || message.includes('fetch') || message.includes('connection')) {
            errorMessage = "مشكلة في الاتصال. تحقق من اتصال الإنترنت.";
          } else if (message.includes('validation') || message.includes('required') || message.includes('constraint')) {
            errorMessage = "بيانات غير صحيحة. تحقق من ملء جميع الحقول المطلوبة.";
          } else if (message.includes('permission') || message.includes('denied')) {
            errorMessage = "ليس لديك صلاحية لتنفيذ هذا الإجراء.";
          } else {
            errorMessage = `خطأ: ${error.message}`;
          }
        } else if (error.code) {
          errorMessage = `خطأ في قاعدة البيانات (${error.code}). يرجى المحاولة مرة أخرى.`;
        }
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      if (fileArray.length > 5) {
        alert("يمكنك رفع 5 صور كحد أقصى");
        return;
      }
      setImages(fileArray);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'from-red-500 to-red-600';
      case 'high': return 'from-orange-500 to-orange-600';
      case 'medium': return 'from-yellow-500 to-yellow-600';
      case 'low': return 'from-green-500 to-green-600';
      default: return 'from-blue-500 to-blue-600';
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

  // عرض رسالة تسجيل الدخول إذا لم يكن المستخدم مسجل دخول
  if (!authUser) {
    return (
      <main className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="card text-center max-w-md">
          <div className="bg-gradient-to-br from-red-500 to-red-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <ReportIcon size={32} className="text-white" />
          </div>
          <h2 className="heading-2 text-primary mb-4">تسجيل الدخول مطلوب</h2>
          <p className="text-secondary mb-6">يجب تسجيل الدخول أولاً لتتمكن من إرسال البلاغات</p>
          <div className="space-y-3">
            <Link href="/login" className="btn btn-primary w-full">
              تسجيل الدخول
            </Link>
            <Link href="/signup" className="btn btn-secondary w-full">
              إنشاء حساب جديد
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen gradient-bg">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fadeIn">
          <div className="flex items-center justify-center mb-6">
            <ReportIcon size={48} className="ml-4" />
            <h1 className="heading-1 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              إبلاغ عن مشكلة
            </h1>
          </div>
          <p className="text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
            حدد موقع المشكلة بدقة على خريطة المحلة الكبرى وأرسل تقريراً مفصلاً لفريق الإدارة
          </p>
          <div className="flex items-center justify-center mt-6 space-x-6 space-x-reverse">
            <div className="flex items-center text-sm text-secondary">
              <span className="w-3 h-3 bg-green-500 rounded-full ml-2"></span>
              سهل الاستخدام
            </div>
            <div className="flex items-center text-sm text-secondary">
              <span className="w-3 h-3 bg-blue-500 rounded-full ml-2"></span>
              دقة عالية
            </div>
            <div className="flex items-center text-sm text-secondary">
              <span className="w-3 h-3 bg-purple-500 rounded-full ml-2"></span>
              مراجعة سريعة
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* الخريطة */}
          <div className="card animate-slideIn">
            <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="heading-3 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent flex items-center">
                <MapIcon size={28} className="ml-3" />
                <span>خريطة المحلة الكبرى التفاعلية</span>
              </h2>
              <p className="text-secondary mt-2">انقر على الخريطة لتحديد موقع المشكلة بدقة</p>
              <div className="flex items-center mt-3 space-x-4 space-x-reverse text-sm">
                <div className="flex items-center text-secondary">
                  <span className="w-2 h-2 bg-blue-500 rounded-full ml-1"></span>
                  موقع جديد
                </div>
                <div className="flex items-center text-secondary">
                  <span className="w-2 h-2 bg-red-500 rounded-full ml-1"></span>
                  تقارير موجودة
                </div>
              </div>
            </div>
            <div style={{ height: '500px' }} className="rounded-2xl overflow-hidden shadow-inner">
              <FixedMapClient
                center={[mahallaCenter.lat, mahallaCenter.lng]}
                zoom={mahallaCenter.zoom}
                style={{ height: '100%', width: '100%' }}
                position={position}
                onPick={(lat, lng) => setPosition([lat, lng])}
                approvedReports={approvedReports.map(report => ({
                  id: report.id,
                  title: report.title,
                  description: report.description,
                  location: {
                    lat: report.location_lat || 0,
                    lng: report.location_lng || 0,
                    address: report.location_address || ''
                  },
                  images: report.images || [],
                  reporterName: report.reporter_name,
                  reporterPhone: report.reporter_phone,
                  reporterEmail: '', // لا يوجد في البنية الجديدة
                  status: report.status,
                  priority: report.priority,
                  createdAt: new Date(report.created_at),
                  approvedAt: report.approved_at ? new Date(report.approved_at) : undefined,
                  resolvedAt: undefined, // لا يوجد في البنية الجديدة
                  adminNotes: report.rejection_reason,
                  assignedPlumber: undefined // لا يوجد في البنية الجديدة
                }))}
              />
            </div>
            {position && (
              <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800 rounded-xl">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-green-600 ml-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-green-800 dark:text-green-200 font-semibold">تم تحديد الموقع بنجاح!</p>
                    <p className="text-green-700 dark:text-green-300 text-sm">
                      الإحداثيات: {position[0].toFixed(6)}, {position[1].toFixed(6)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* نموذج التقرير */}
          <div className="card animate-slideIn" style={{animationDelay: '0.2s'}}>
            <div className="mb-6">
              <h2 className="heading-2 flex items-center">
                <ReportIcon size={28} className="ml-3" />
                <span>تفاصيل البلاغ</span>
              </h2>
              <p className="text-secondary">املأ البيانات التالية لإرسال بلاغك</p>
            </div>

            <form onSubmit={submitReport} className="space-y-6">
              {/* عنوان المشكلة */}
              <div>
                <label className="label flex items-center">
                  <ReportIcon size={18} className="ml-2" />
                  <span>عنوان المشكلة *</span>
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  placeholder="مثال: تسرب مياه في الشارع الرئيسي"
                />
              </div>

              {/* وصف المشكلة */}
              <div>
                <label className="label flex items-center">
                  <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                  <span>وصف المشكلة *</span>
                </label>
                <textarea
                  className="input min-h-[120px] resize-y"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  placeholder="اكتب وصفاً مفصلاً للمشكلة، متى بدأت، وما هي الأضرار المترتبة عليها..."
                />
              </div>

              {/* بيانات المبلغ */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label flex items-center">
                    <UserIcon size={18} className="ml-2" />
                    <span>الاسم الكامل *</span>
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={formData.reporterName}
                    onChange={(e) => setFormData({...formData, reporterName: e.target.value})}
                    required
                    placeholder="الاسم كما في الهوية"
                  />
                </div>

                <div>
                  <label className="label flex items-center">
                    <PhoneIcon size={18} className="ml-2" />
                    <span>رقم الهاتف *</span>
                  </label>
                  <input
                    type="tel"
                    dir="ltr"
                    className="input"
                    value={formData.reporterPhone}
                    onChange={(e) => setFormData({...formData, reporterPhone: e.target.value})}
                    required
                    placeholder="01012345678"
                  />
                </div>
              </div>

              {/* البريد الإلكتروني */}
              <div>
                <label className="label flex items-center">
                  <EmailIcon size={18} className="ml-2" />
                  <span>البريد الإلكتروني (اختياري)</span>
                </label>
                <input
                  type="email"
                  dir="ltr"
                  className="input"
                  value={formData.reporterEmail}
                  onChange={(e) => setFormData({...formData, reporterEmail: e.target.value})}
                  placeholder="example@email.com"
                />
              </div>

              {/* أولوية المشكلة */}
              <div>
                <label className="label flex items-center">
                  <PriorityIcon size={18} className="ml-2" />
                  <span>أولوية المشكلة *</span>
                </label>
                <select
                  className="input"
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value as "low" | "medium" | "high" | "urgent"})}
                  aria-label="أولوية المشكلة"
                >
                  <option value="low">🟢 منخفضة - مشكلة بسيطة</option>
                  <option value="medium">🟡 متوسطة - تحتاج انتباه</option>
                  <option value="high">🟠 عالية - مشكلة مهمة</option>
                  <option value="urgent">🔴 عاجلة - تحتاج تدخل فوري</option>
                </select>
                <div className="mt-2 flex items-center">
                  <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${getPriorityColor(formData.priority)} ml-2`}></div>
                  <span className="text-sm text-secondary">الأولوية المحددة: {getPriorityIcon(formData.priority)} {getPriorityText(formData.priority)}</span>
                </div>
              </div>

              {/* رفع الصور */}
              <div>
                <label className="label flex items-center">
                  <CameraIcon size={18} className="ml-2" />
                  <span>صور المشكلة (اختياري - حتى 5 صور)</span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="input pt-3 pb-3"
                    aria-label="رفع صور المشكلة"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <CameraIcon size={20} />
                  </div>
                </div>
                {images.length > 0 && (
                  <div className="mt-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                    <div className="flex items-center">
                      <CameraIcon size={20} className="text-blue-600 ml-2" />
                      <span className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                        تم اختيار {images.length} {images.length === 1 ? 'صورة' : 'صور'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* رسالة النتيجة */}
              {message && (
                <div className={`alert ${
                  message.includes('بنجاح') ? 'alert-success' : 'alert-error'
                } animate-fadeIn`}>
                  <div className="flex items-center">
                    <span className="text-xl ml-3">
                      {message.includes('بنجاح') ? '✅' : '❌'}
                    </span>
                    <span>{message}</span>
                  </div>
                </div>
              )}

              {/* زر الإرسال */}
              <button
                type="submit"
                disabled={!position || loading}
                className={`btn btn-primary w-full text-lg py-4 font-bold ${
                  loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-2xl'
                } transition-all duration-300 flex items-center justify-center space-x-3 space-x-reverse`}
              >
                <span>
                  {loading ? (
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <ReportIcon size={20} />
                  )}
                </span>
                <span>{loading ? "جاري الإرسال..." : "إرسال البلاغ"}</span>
              </button>

              {/* تنبيه عدم تحديد الموقع */}
              {!position && (
                <div className="alert alert-warning animate-fadeIn">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 ml-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>يرجى تحديد موقع المشكلة على الخريطة أولاً</span>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* معلومات إضافية */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="card text-center group">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="heading-3 text-blue-600 dark:text-blue-400 mb-2">سرعة في الاستجابة</h3>
            <p className="text-secondary text-sm">نراجع جميع البلاغات خلال 24 ساعة</p>
          </div>
          <div className="card text-center group">
            <div className="bg-gradient-to-br from-green-500 to-green-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="heading-3 text-green-600 dark:text-green-400 mb-2">حماية البيانات</h3>
            <p className="text-secondary text-sm">بياناتك محمية ولن تُستخدم إلا للضرورة</p>
          </div>
          <div className="card text-center group">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
              </svg>
            </div>
            <h3 className="heading-3 text-purple-600 dark:text-purple-400 mb-2">متابعة مستمرة</h3>
            <p className="text-secondary text-sm">ستحصل على تحديثات حول حالة بلاغك</p>
          </div>
        </div>
      </div>
    </main>
  );
}