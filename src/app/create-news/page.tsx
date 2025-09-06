"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContextV2";
import { newsService } from "@/lib/supabase-services-v2";
import { NewsIcon, ImageIcon, TagIcon, CategoryIcon } from "@/components/icons/ProfessionalIcons";
import { useRouter } from "next/navigation";

export default function CreateNewsPage() {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    tags: ''
  });

  const categories = [
    { value: 'general', label: 'عام' },
    { value: 'water_issues', label: 'مشاكل المياه' },
    { value: 'maintenance', label: 'صيانة' },
    { value: 'announcements', label: 'إعلانات' },
    { value: 'community', label: 'مجتمعي' },
    { value: 'emergency', label: 'طوارئ' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setMessage('يرجى تسجيل الدخول أولاً');
      return;
    }

    // التحقق من صحة البيانات
    if (!formData.title.trim() || !formData.content.trim()) {
      setMessage('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // تحويل التاغز إلى مصفوفة
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      // إنشاء الخبر
      const newsId = await newsService.createNews(user.id, {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        tags: tagsArray
      });

      if (newsId) {
        // رفع الصور إذا وجدت
        if (images.length > 0) {
          await newsService.uploadNewsImages(images, newsId);
        }

        setMessage('تم إرسال الخبر بنجاح! سيتم مراجعته من قبل الإدارة قبل النشر.');
        
        // إعادة تعيين النموذج
        setFormData({
          title: '',
          content: '',
          category: 'general',
          tags: ''
        });
        setImages([]);

        // التوجه إلى صفحة الأخبار بعد 3 ثواني
        setTimeout(() => {
          router.push('/news');
        }, 3000);
      } else {
        setMessage('حدث خطأ في إرسال الخبر. يرجى المحاولة مرة أخرى.');
      }
    } catch (error) {
      console.error('خطأ في إنشاء الخبر:', error);
      setMessage('حدث خطأ في إرسال الخبر. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      if (fileArray.length > 5) {
        setMessage('يمكنك رفع 5 صور كحد أقصى');
        return;
      }
      
      // التحقق من نوع الملفات
      const invalidFiles = fileArray.filter(file => !file.type.startsWith('image/'));
      if (invalidFiles.length > 0) {
        setMessage('يرجى اختيار ملفات صور صالحة فقط');
        return;
      }

      // التحقق من حجم الملفات
      const oversizedFiles = fileArray.filter(file => file.size > 5 * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        setMessage('حجم كل صورة يجب أن يكون أقل من 5 ميجابايت');
        return;
      }

      setImages(fileArray);
      setMessage(null);
    }
  };

  // التحقق من صلاحيات المستخدم
  if (!user) {
    return (
      <main className="min-h-screen gradient-bg">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="heading-1 mb-4">تسجيل الدخول مطلوب</h1>
            <p className="text-secondary mb-8">يجب تسجيل الدخول لإنشاء خبر جديد</p>
            <button
              onClick={() => router.push('/login')}
              className="btn btn-primary"
            >
              تسجيل الدخول
            </button>
          </div>
        </div>
      </main>
    );
  }

  // التحقق من أن المستخدم ليس سباك (السباكون لا يمكنهم إنشاء أخبار)
  if (userProfile && userProfile.role === 'plumber') {
    return (
      <main className="min-h-screen gradient-bg">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="heading-1 mb-4">غير مصرح</h1>
            <p className="text-secondary mb-8">السباكون لا يمكنهم إنشاء أخبار. يمكنك تصفح الأخبار الموجودة.</p>
            <button
              onClick={() => router.push('/news')}
              className="btn btn-primary"
            >
              تصفح الأخبار
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen gradient-bg">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <div className="flex items-center justify-center mb-6">
            <NewsIcon size={48} className="ml-4" />
            <h1 className="heading-1 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              إنشاء خبر جديد
            </h1>
          </div>
          <p className="text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
            شارك الأخبار والمعلومات المهمة مع مجتمع المحلة الكبرى
          </p>
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              <span className="font-semibold">ملاحظة:</span> سيتم مراجعة الخبر من قبل الإدارة قبل نشره على الموقع
            </p>
          </div>
        </div>

        {/* نموذج إنشاء الخبر */}
        <div className="card animate-slideIn">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* عنوان الخبر */}
            <div>
              <label className="label flex items-center">
                <NewsIcon size={18} className="ml-2" />
                <span>عنوان الخبر *</span>
              </label>
              <input
                type="text"
                className="input"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
                placeholder="مثال: تحسينات جديدة في شبكة المياه بالمحلة الكبرى"
              />
            </div>

            {/* فئة الخبر */}
            <div>
              <label className="label flex items-center">
                <CategoryIcon size={18} className="ml-2" />
                <span>فئة الخبر *</span>
              </label>
              <select
                className="input"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                required
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* محتوى الخبر */}
            <div>
              <label className="label flex items-center">
                <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                <span>محتوى الخبر *</span>
              </label>
              <textarea
                className="input min-h-[200px] resize-y"
                rows={8}
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                required
                placeholder="اكتب تفاصيل الخبر بشكل واضح ومفصل..."
              />
            </div>

            {/* الكلمات المفتاحية */}
            <div>
              <label className="label flex items-center">
                <TagIcon size={18} className="ml-2" />
                <span>الكلمات المفتاحية (اختياري)</span>
              </label>
              <input
                type="text"
                className="input"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                placeholder="مثال: مياه، صيانة، المحلة (افصل بينها بفاصلة)"
              />
              <p className="text-sm text-secondary mt-1">
                استخدم الفاصلة (،) للفصل بين الكلمات المفتاحية
              </p>
            </div>

            {/* رفع الصور */}
            <div>
              <label className="label flex items-center">
                <ImageIcon size={18} className="ml-2" />
                <span>صور الخبر (اختياري - حتى 5 صور)</span>
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="input pt-3 pb-3"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <ImageIcon size={20} />
                </div>
              </div>
              {images.length > 0 && (
                <div className="mt-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                  <div className="flex items-center">
                    <ImageIcon size={20} className="text-green-600 ml-2" />
                    <span className="text-sm text-green-800 dark:text-green-200 font-medium">
                      تم اختيار {images.length} {images.length === 1 ? 'صورة' : 'صور'}
                    </span>
                  </div>
                  <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
                    {images.map((file, index) => (
                      <div key={index} className="text-xs text-green-700 dark:text-green-300 truncate">
                        {file.name}
                      </div>
                    ))}
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

            {/* أزرار العمل */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={loading}
                className={`btn btn-primary flex-1 ${
                  loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
                } transition-all duration-300`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent ml-2"></div>
                    جاري الإرسال...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <NewsIcon size={20} className="ml-2" />
                    إرسال للمراجعة
                  </div>
                )}
              </button>

              <button
                type="button"
                onClick={() => router.push('/news')}
                className="btn btn-secondary flex-1"
                disabled={loading}
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>

        {/* معلومات إضافية */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="card text-center">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="heading-3 text-blue-600 dark:text-blue-400 mb-2">مراجعة سريعة</h3>
            <p className="text-secondary text-sm">نراجع جميع الأخبار خلال 24 ساعة</p>
          </div>

          <div className="card text-center">
            <div className="bg-gradient-to-br from-green-500 to-green-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="heading-3 text-green-600 dark:text-green-400 mb-2">محتوى موثوق</h3>
            <p className="text-secondary text-sm">نتأكد من صحة ومصداقية جميع الأخبار</p>
          </div>
        </div>
      </div>
    </main>
  );
}
