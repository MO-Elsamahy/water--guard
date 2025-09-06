import Link from "next/link";
import { 
  MapIcon, 
  PlumberIcon, 
  NewsIcon, 
  StatsIcon,
  ReportIcon,
  LoginIcon
} from "@/components/icons/ProfessionalIcons";
import Logo from "@/components/Logo";

export default function Home() {
  return (
    <main className="min-h-screen gradient-bg">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="animate-fadeIn">
            <div className="flex items-center justify-center mb-6">
              <Logo size="large" showText={false} className="w-20 h-20 mr-6" />
              <div>
                <h1 className="text-5xl md:text-6xl font-bold drop-shadow-lg bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                  Water Guard
                </h1>
                <p className="text-blue-100 text-lg font-medium -mt-2">حماية المياه</p>
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl mb-4 font-semibold">
              المحلة الكبرى
            </h2>
            <p className="text-xl mb-6 max-w-3xl mx-auto leading-relaxed opacity-95">
              منصة شاملة لإدارة مشاكل المياه في مدينة المحلة الكبرى. أبلغ عن المشاكل بدقة على الخريطة، واعثر على أفضل السباكين المعتمدين، وتابع آخر الأخبار والتحديثات.
            </p>
            
            {/* تحذير تسجيل الدخول */}
            <div className="mb-8 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 max-w-2xl mx-auto">
              <div className="flex items-center justify-center mb-2">
                <LoginIcon size={20} className="text-white ml-2" />
                <h3 className="text-lg font-semibold text-white">تسجيل الدخول مطلوب</h3>
              </div>
              <p className="text-blue-100 text-sm">
                للوصول إلى جميع ميزات الموقع، يجب تسجيل الدخول أولاً
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <Link href="/reports" className="btn btn-primary text-lg px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 shadow-xl flex items-center space-x-3 space-x-reverse">
                <ReportIcon size={24} />
                <span>أبلغ عن مشكلة</span>
              </Link>
              <Link href="/plumbers" className="btn text-lg px-8 py-4 bg-white/20 text-white border-2 border-white hover:bg-white hover:text-blue-600 backdrop-blur-sm flex items-center space-x-3 space-x-reverse">
                <PlumberIcon size={24} />
                <span>تصفح السباكين</span>
              </Link>
            </div>
            
            {/* روابط المطورين */}
            <div className="mt-6 text-center space-x-4 space-x-reverse">
              <Link href="/setup-database" className="text-white/80 hover:text-white underline text-sm">
                إعداد قاعدة البيانات
              </Link>
              <span className="text-white/60">•</span>
              <Link href="/debug-auth" className="text-white/80 hover:text-white underline text-sm">
                تشخيص المصادقة
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* إحصائيات سريعة */}
      <section className="py-16 bg-secondary relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="card text-center hover:shadow-2xl animate-slideIn group">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <StatsIcon size={32} className="text-white" />
              </div>
              <h3 className="heading-3 text-blue-600 dark:text-blue-400">0</h3>
              <p className="text-secondary">تقرير معتمد</p>
            </div>
            <div className="card text-center hover:shadow-2xl animate-slideIn group" style={{animationDelay: '0.1s'}}>
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <PlumberIcon size={32} className="text-white" />
              </div>
              <h3 className="heading-3 text-green-600 dark:text-green-400">0</h3>
              <p className="text-secondary">سباك معتمد</p>
            </div>
            <div className="card text-center hover:shadow-2xl animate-slideIn group" style={{animationDelay: '0.2s'}}>
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg width="32" height="32" viewBox="0 0 24 24" className="text-white">
                  <defs>
                    <linearGradient id="checkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="100%" stopColor="#F3F4F6" />
                    </linearGradient>
                  </defs>
                  <path d="M9 12L11 14L15 10M21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12Z" stroke="url(#checkGradient)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="heading-3 text-yellow-600 dark:text-yellow-400">0</h3>
              <p className="text-secondary">مشكلة تم حلها</p>
            </div>
            <div className="card text-center hover:shadow-2xl animate-slideIn group" style={{animationDelay: '0.3s'}}>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <NewsIcon size={32} className="text-white" />
              </div>
              <h3 className="heading-3 text-purple-600 dark:text-purple-400">0</h3>
              <p className="text-secondary">خبر منشور</p>
            </div>
          </div>
        </div>
      </section>

      {/* لماذا Water Guard؟ */}
      <section className="py-20 bg-primary relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="heading-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              لماذا Water Guard؟
            </h2>
            <p className="text-secondary text-lg max-w-2xl mx-auto">
              حل شامل ومتطور لإدارة مشاكل المياه في المحلة الكبرى بأحدث التقنيات
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* الميزة الأولى */}
            <div className="card text-center group">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                <MapIcon size={40} className="text-white" />
              </div>
              <h3 className="heading-3 text-blue-600 dark:text-blue-400 mb-4">
                بلاغات دقيقة على الخريطة
              </h3>
              <p className="text-secondary leading-relaxed">
                حدد موقع المشكلة بدقة على خريطة المحلة الكبرى. أضف وصفاً تفصيلياً وصوراً، وسيقوم فريق الإدارة بمراجعة البلاغ قبل نشره للجمهور.
              </p>
            </div>

            {/* الميزة الثانية */}
            <div className="card text-center group">
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                <PlumberIcon size={40} className="text-white" />
              </div>
              <h3 className="heading-3 text-green-600 dark:text-green-400 mb-4">
                دليل السباكين المعتمد
              </h3>
              <p className="text-secondary leading-relaxed">
                ابحث عن أفضل السباكين في منطقتك حسب المنطقة والخبرة والتخصص. جميع السباكين معتمدون من الإدارة مع تقييمات حقيقية من العملاء.
              </p>
            </div>

            {/* الميزة الثالثة */}
            <div className="card text-center group">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                <svg width="40" height="40" viewBox="0 0 24 24" className="text-white">
                  <defs>
                    <linearGradient id="deviceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="100%" stopColor="#F3F4F6" />
                    </linearGradient>
                  </defs>
                  <rect x="4" y="2" width="16" height="20" rx="2" ry="2" fill="none" stroke="url(#deviceGradient)" strokeWidth="2" />
                  <line x1="12" y1="18" x2="12.01" y2="18" stroke="url(#deviceGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="6" y="6" width="12" height="8" fill="rgba(255,255,255,0.3)" rx="1" />
                </svg>
              </div>
              <h3 className="heading-3 text-purple-600 dark:text-purple-400 mb-4">
                تجربة مستخدم متميزة
              </h3>
              <p className="text-secondary leading-relaxed">
                تصميم عصري وسهل الاستخدام، متوافق مع جميع الأجهزة. وضع ليلي ونهاري، واجهة عربية كاملة مع دعم للاتجاه من اليمين لليسار.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* آخر الأخبار */}
      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="heading-2 flex items-center space-x-3 space-x-reverse">
              <NewsIcon size={32} />
              <span>آخر الأخبار</span>
            </h2>
            <Link href="/news" className="btn btn-primary flex items-center space-x-2 space-x-reverse">
              <NewsIcon size={20} />
              <span>عرض جميع الأخبار</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* خبر وهمي 1 */}
            <div className="card group">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 h-48 rounded-2xl mb-6 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <NewsIcon size={64} className="text-white" />
              </div>
              <h3 className="heading-3 mb-3 text-blue-600 dark:text-blue-400">مرحباً بكم في Water Guard</h3>
              <p className="text-secondary text-sm mb-4 leading-relaxed">
                إطلاق منصة Water Guard الجديدة لإدارة مشاكل المياه في المحلة الكبرى بأحدث التقنيات...
              </p>
              <div className="text-xs text-muted flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full ml-2"></span>
                منذ دقائق
              </div>
            </div>

            {/* خبر وهمي 2 */}
            <div className="card group">
              <div className="bg-gradient-to-br from-green-500 to-green-600 h-48 rounded-2xl mb-6 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <PlumberIcon size={64} className="text-white" />
              </div>
              <h3 className="heading-3 mb-3 text-green-600 dark:text-green-400">دليل السباكين المعتمدين</h3>
              <p className="text-secondary text-sm mb-4 leading-relaxed">
                تم إضافة قاعدة بيانات شاملة للسباكين المعتمدين في جميع أنحاء المحلة الكبرى...
              </p>
              <div className="text-xs text-muted flex items-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full ml-2"></span>
                منذ ساعة
              </div>
            </div>

            {/* خبر وهمي 3 */}
            <div className="card group">
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 h-48 rounded-2xl mb-6 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <MapIcon size={64} className="text-white" />
              </div>
              <h3 className="heading-3 mb-3 text-yellow-600 dark:text-yellow-400">خريطة تفاعلية للمدينة</h3>
              <p className="text-secondary text-sm mb-4 leading-relaxed">
                خريطة تفاعلية عالية الدقة لمدينة المحلة الكبرى مع إمكانية تحديد المواقع بدقة...
              </p>
              <div className="text-xs text-muted flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full ml-2"></span>
                منذ يومين
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* الوصول السريع */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="heading-2 text-primary mb-4">الوصول السريع</h2>
            <p className="text-secondary text-lg">ابدأ في استخدام الخدمات فوراً</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/reports" className="card group hover:shadow-2xl transition-all duration-300 text-center">
              <div className="bg-gradient-to-br from-red-500 to-red-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <ReportIcon size={32} className="text-white" />
              </div>
              <h3 className="heading-3 text-red-600 dark:text-red-400 mb-2">إبلاغ عن مشكلة</h3>
              <p className="text-secondary">أبلغ عن مشاكل المياه في منطقتك</p>
            </Link>

            <Link href="/reports-map" className="card group hover:shadow-2xl transition-all duration-300 text-center">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <MapIcon size={32} className="text-white" />
              </div>
              <h3 className="heading-3 text-blue-600 dark:text-blue-400 mb-2">خريطة البلاغات</h3>
              <p className="text-secondary">اعرض جميع البلاغات على الخريطة</p>
            </Link>

            <Link href="/plumbers" className="card group hover:shadow-2xl transition-all duration-300 text-center">
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <PlumberIcon size={32} className="text-white" />
              </div>
              <h3 className="heading-3 text-green-600 dark:text-green-400 mb-2">دليل السباكين</h3>
              <p className="text-secondary">ابحث عن سباك معتمد في منطقتك</p>
            </Link>
          </div>
        </div>
      </section>

      {/* دعوة للعمل */}
      <section className="py-20 hero-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 drop-shadow-lg flex items-center justify-center space-x-4 space-x-reverse">
            <Logo size="medium" showText={false} className="animate-bounce-soft" />
            <span>ابدأ الآن مع Water Guard</span>
          </h2>
          <p className="text-xl mb-8 opacity-95 leading-relaxed">
            انضم إلى مجتمع المحلة الكبرى وساعد في حل مشاكل المياه في مدينتك
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/signup" className="btn text-lg px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 shadow-xl flex items-center space-x-3 space-x-reverse">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
              <span>إنشاء حساب مجاني</span>
            </Link>
            <Link href="/plumber-signup" className="btn text-lg px-8 py-4 bg-white/20 text-white border-2 border-white hover:bg-white hover:text-blue-600 backdrop-blur-sm flex items-center space-x-3 space-x-reverse">
              <PlumberIcon size={20} />
              <span>تسجيل كسباك</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}