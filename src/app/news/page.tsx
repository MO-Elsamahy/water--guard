"use client";
import { useState, useEffect } from "react";
import { newsService, reportService, type NewsWithUser, type ReportWithUser } from "@/lib/supabase-services-v2";
import { NewsIcon, ReportIcon, MapIcon } from "@/components/icons/ProfessionalIcons";

type FeedItem = (NewsWithUser | ReportWithUser) & {
  type: 'news' | 'report';
};

const categoryOptions = [
  "جميع الفئات",
  "أخبار عامة",
  "تحديثات النظام",
  "إعلانات",
  "صيانة",
  "طوارئ"
];

export default function NewsPage() {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("جميع الفئات");
  const [selectedType, setSelectedType] = useState("all");

  useEffect(() => {
    loadFeedItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [feedItems, searchTerm, selectedCategory, selectedType]);

  const loadFeedItems = async () => {
    try {
      setLoading(true);
      const [news, reports] = await Promise.all([
        newsService.getPublishedNews(),
        reportService.getApprovedReports()
      ]);

      const newsItems: FeedItem[] = news.map(item => ({ ...item, type: 'news' as const }));
      const reportItems: FeedItem[] = reports.map(item => ({ ...item, type: 'report' as const }));

      const allItems = [...newsItems, ...reportItems].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setFeedItems(allItems);
    } catch (error) {
      console.error("خطأ في تحميل العناصر:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = feedItems;

    // البحث
    if (searchTerm) {
      filtered = filtered.filter(item => {
        if (item.type === 'news') {
          const newsItem = item as NewsWithUser & { type: 'news' };
          return newsItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 newsItem.content.toLowerCase().includes(searchTerm.toLowerCase());
        } else {
          const reportItem = item as ReportWithUser & { type: 'report' };
          return reportItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 reportItem.description.toLowerCase().includes(searchTerm.toLowerCase());
        }
      });
    }

    // تصفية بالفئة
    if (selectedCategory !== "جميع الفئات") {
      filtered = filtered.filter(item => {
        if (item.type === 'news') {
          const newsItem = item as NewsWithUser & { type: 'news' };
          return newsItem.category === selectedCategory;
        }
        return false;
      });
    }

    // تصفية بالنوع
    if (selectedType !== "all") {
      filtered = filtered.filter(item => item.type === selectedType);
    }

    setFilteredItems(filtered);
  };

  const formatDate = (date: string | Date) => {
    return new Intl.DateTimeFormat('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400';
      case 'high': return 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400';
      case 'low': return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400';
      default: return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'عاجل';
      case 'high': return 'عالي';
      case 'medium': return 'متوسط';
      case 'low': return 'منخفض';
      default: return 'عادي';
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-secondary font-medium">جاري تحميل الأخبار والتحديثات...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen gradient-bg">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <div className="flex items-center justify-center mb-6">
            <NewsIcon size={48} className="ml-4" />
            <h1 className="heading-1 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              الأخبار والتحديثات
            </h1>
          </div>
          <p className="text-secondary text-lg max-w-2xl mx-auto">
            تابع آخر الأخبار والتحديثات حول مشاكل المياه في المحلة الكبرى
          </p>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card text-center">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
              <NewsIcon size={24} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {feedItems.filter(item => item.type === 'news').length}
            </h3>
            <p className="text-secondary text-sm">خبر منشور</p>
          </div>
          <div className="card text-center">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
              <ReportIcon size={24} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {feedItems.filter(item => item.type === 'report').length}
            </h3>
            <p className="text-secondary text-sm">بلاغ معتمد</p>
          </div>
          <div className="card text-center">
            <div className="bg-gradient-to-br from-green-500 to-green-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">24/7</h3>
            <p className="text-secondary text-sm">تحديث مستمر</p>
          </div>
        </div>

        {/* فلاتر البحث */}
        <div className="card mb-8 animate-slideIn">
          <h3 className="heading-3 mb-6 text-center">البحث والتصفية</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* البحث */}
            <div>
              <label className="label">البحث</label>
              <input
                type="text"
                className="input"
                placeholder="ابحث في الأخبار والبلاغات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* الفئة */}
            <div>
              <label htmlFor="category-select" className="label">الفئة</label>
              <select
                id="category-select"
                title="اختر الفئة"
                className="input"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categoryOptions.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* النوع */}
            <div>
              <label htmlFor="type-select" className="label">النوع</label>
              <select
                id="type-select"
                title="اختر النوع"
                className="input"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="all">جميع الأنواع</option>
                <option value="news">الأخبار فقط</option>
                <option value="report">البلاغات فقط</option>
              </select>
            </div>
          </div>
        </div>

        {/* نتائج البحث */}
        <div className="mb-6">
          <p className="text-secondary">
            عرض {filteredItems.length} من {feedItems.length} عنصر
          </p>
        </div>

        {/* قائمة العناصر */}
        <div className="space-y-6">
          {filteredItems.map((item, index) => (
            <div key={`${item.type}-${item.id || index}`} className="card hover:shadow-2xl transition-all duration-300 animate-slideIn" data-delay={index}>
              <div className="flex items-start space-x-4 space-x-reverse">
                {/* أيقونة النوع */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                  item.type === 'news' 
                    ? 'bg-gradient-to-br from-purple-500 to-purple-600' 
                    : 'bg-gradient-to-br from-blue-500 to-blue-600'
                }`}>
                  {item.type === 'news' ? (
                    <NewsIcon size={24} className="text-white" />
                  ) : (
                    <ReportIcon size={24} className="text-white" />
                  )}
                </div>

                {/* المحتوى */}
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="heading-3 mb-1">
                        {item.type === 'news' 
                          ? (item as NewsWithUser).title 
                          : (item as ReportWithUser).title
                        }
                      </h3>
                      <div className="flex items-center space-x-4 space-x-reverse text-sm text-secondary">
                        <span>{formatDate(item.created_at)}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          item.type === 'news' 
                            ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400'
                            : 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400'
                        }`}>
                          {item.type === 'news' ? 'خبر' : 'بلاغ'}
                        </span>
                        {item.type === 'news' && (item as NewsWithUser).category && (
                          <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
                            {(item as NewsWithUser).category}
                          </span>
                        )}
                        {item.type === 'report' && (item as ReportWithUser).priority && (
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor((item as ReportWithUser).priority)}`}>
                            {getPriorityText((item as ReportWithUser).priority)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* المحتوى */}
                  <div className="mb-4">
                    <p className="text-secondary leading-relaxed">
                      {item.type === 'news' 
                        ? (item as NewsWithUser).content.substring(0, 200) + (((item as NewsWithUser).content.length > 200) ? '...' : '')
                        : (item as ReportWithUser).description.substring(0, 200) + (((item as ReportWithUser).description.length > 200) ? '...' : '')
                      }
                    </p>
                  </div>

                  {/* معلومات إضافية للبلاغات */}
                  {item.type === 'report' && (
                    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center space-x-4 space-x-reverse text-sm">
                        <div className="flex items-center">
                          <MapIcon size={16} className="ml-1" />
                          <span>{(item as ReportWithUser).location_address || 'المحلة الكبرى'}</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                          <span>{(item as ReportWithUser).reporter_name}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* الصور */}
                  {((item.type === 'news' && (item as NewsWithUser).images?.length) || 
                    (item.type === 'report' && (item as ReportWithUser).images?.length)) && (
                    <div className="mb-4">
                      <div className="flex gap-2 overflow-x-auto">
                        {(item.type === 'news' 
                          ? (item as NewsWithUser).images 
                          : (item as ReportWithUser).images
                        )?.slice(0, 3).map((image: string, imgIndex: number) => (
                          <img
                            key={imgIndex}
                            src={image}
                            alt={`صورة ${imgIndex + 1}`}
                            className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => window.open(image, '_blank')}
                          />
                        ))}
                        {((item.type === 'news' && (item as NewsWithUser).images?.length! > 3) ||
                          (item.type === 'report' && (item as ReportWithUser).images?.length! > 3)) && (
                          <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-xs text-secondary">
                            +{((item.type === 'news' ? (item as NewsWithUser).images?.length : (item as ReportWithUser).images?.length) || 0) - 3} صور
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* أزرار الإجراءات */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
                        عرض التفاصيل
                      </button>
                      {item.type === 'report' && (
                        <button className="text-green-600 dark:text-green-400 hover:underline text-sm font-medium">
                          عرض على الخريطة
                        </button>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <button 
                        title="مشاركة"
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                        </svg>
                      </button>
                      <button 
                        title="إعجاب"
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* رسالة عدم وجود نتائج */}
        {filteredItems.length === 0 && (
          <div className="card text-center py-12">
            <NewsIcon size={64} className="mx-auto mb-4 opacity-50" />
            <h3 className="heading-3 mb-2">لا توجد نتائج</h3>
            <p className="text-secondary mb-4">
              لم نجد أخبار أو بلاغات تطابق معايير البحث الخاصة بك
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("جميع الفئات");
                setSelectedType("all");
              }}
              className="btn btn-primary"
            >
              إعادة تعيين الفلاتر
            </button>
          </div>
        )}

        {/* زر تحديث */}
        <div className="text-center mt-8">
          <button
            onClick={loadFeedItems}
            className="btn btn-secondary flex items-center space-x-2 space-x-reverse mx-auto"
            disabled={loading}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            <span>تحديث</span>
          </button>
        </div>
      </div>
    </main>
  );
}