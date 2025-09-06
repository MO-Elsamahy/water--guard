"use client";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContextV2";
import { useTheme } from "@/contexts/ThemeContext";
import { useState } from "react";
import { 
  HomeIcon, 
  ReportIcon, 
  PlumberIcon, 
  NewsIcon, 
  SunIcon, 
  MoonIcon,
  LoginIcon,
  UserIcon,
  SettingsIcon,
  MapIcon
} from "@/components/icons/ProfessionalIcons";
import Logo from "@/components/Logo";

export default function Navbar() {
  const { user, userProfile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsMenuOpen(false);
    } catch (error) {
      console.error("خطأ في تسجيل الخروج:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* الشعار */}
          <div className="flex-shrink-0">
            <Logo size="medium" showText={true} />
          </div>

          {/* روابط التنقل - الشاشات الكبيرة */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-6 space-x-reverse">
              <Link href="/" className="navbar-link flex items-center space-x-2 space-x-reverse">
                <HomeIcon size={20} />
                <span>الرئيسية</span>
              </Link>
              <Link href="/reports" className="navbar-link flex items-center space-x-2 space-x-reverse">
                <ReportIcon size={20} />
                <span>إبلاغ عن مشكلة</span>
              </Link>
              <Link href="/reports-map" className="navbar-link flex items-center space-x-2 space-x-reverse">
                <MapIcon size={20} />
                <span>خريطة البلاغات</span>
              </Link>
              <Link href="/plumbers" className="navbar-link flex items-center space-x-2 space-x-reverse">
                <PlumberIcon size={20} />
                <span>دليل السباكين</span>
              </Link>
              <Link href="/news" className="navbar-link flex items-center space-x-2 space-x-reverse">
                <NewsIcon size={20} />
                <span>الأخبار</span>
              </Link>
              {user && userProfile && userProfile.role !== 'plumber' && (
                <Link href="/create-news" className="navbar-link flex items-center space-x-2 space-x-reverse">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  <span>إنشاء خبر</span>
                </Link>
              )}
              {user && userProfile && userProfile.role === 'admin' && (
                <Link href="/admin/dashboard" className="navbar-link flex items-center space-x-2 space-x-reverse">
                  <SettingsIcon size={20} />
                  <span>لوحة التحكم</span>
                </Link>
              )}
            </div>
          </div>

          {/* أزرار التحكم */}
          <div className="hidden md:flex items-center space-x-4 space-x-reverse">
            {/* زر تغيير الثيم */}
            <button
              onClick={toggleTheme}
              className="btn btn-secondary p-3 rounded-full hover:scale-110 transition-transform duration-200"
              title={theme === 'dark' ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي'}
            >
              {theme === 'dark' ? <SunIcon size={20} /> : <MoonIcon size={20} />}
            </button>

            {user && userProfile ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-3 space-x-reverse text-primary hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                    {(userProfile.display_name || user.email || 'U')[0].toUpperCase()}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {userProfile.display_name || 'المستخدم'}
                    </p>
                    <p className="text-xs text-secondary">
                      {user.email?.split('@')[0]}
                    </p>
                  </div>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {isMenuOpen && (
                  <div className="absolute left-0 mt-2 w-64 glass-effect rounded-2xl shadow-2xl border overflow-hidden z-50 animate-fadeIn">
                    <div className="py-2">
                      <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                            {(userProfile?.display_name || user?.email || 'U')[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-primary">مرحباً</p>
                            <p className="text-sm text-secondary font-medium truncate">
                              {userProfile?.display_name || user?.email}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Link
                        href="/profile"
                        className="flex items-center space-x-3 space-x-reverse px-4 py-3 text-sm text-primary hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <UserIcon size={18} className="group-hover:scale-110 transition-transform" />
                        <span>الملف الشخصي</span>
                      </Link>
                      {userProfile.role !== 'plumber' && (
                        <Link
                          href="/create-news"
                          className="flex items-center space-x-3 space-x-reverse px-4 py-3 text-sm text-primary hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                          </svg>
                          <span>إنشاء خبر</span>
                        </Link>
                      )}
                      {userProfile.role === 'admin' && (
                        <Link
                          href="/admin/dashboard"
                          className="flex items-center space-x-3 space-x-reverse px-4 py-3 text-sm text-primary hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <SettingsIcon size={18} className="group-hover:scale-110 transition-transform" />
                          <span>لوحة التحكم</span>
                        </Link>
                      )}
                      <Link
                        href="/settings"
                        className="flex items-center space-x-3 space-x-reverse px-4 py-3 text-sm text-primary hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <SettingsIcon size={18} className="group-hover:scale-110 transition-transform" />
                        <span>الإعدادات</span>
                      </Link>
                      <hr className="my-2 border-gray-200 dark:border-gray-700" />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center space-x-3 space-x-reverse w-full text-right px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
                      >
                        <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                        </svg>
                        <span>تسجيل الخروج</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3 space-x-reverse">
                <Link href="/login" className="btn btn-secondary flex items-center space-x-2 space-x-reverse">
                  <LoginIcon size={18} />
                  <span>تسجيل الدخول</span>
                </Link>
                <Link href="/signup" className="btn btn-primary flex items-center space-x-2 space-x-reverse">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                  </svg>
                  <span>إنشاء حساب</span>
                </Link>
              </div>
            )}
          </div>

          {/* زر القائمة للهواتف */}
          <div className="md:hidden flex items-center space-x-2 space-x-reverse">
            <button
              onClick={toggleTheme}
              className="btn btn-secondary p-2 rounded-full"
              title={theme === 'dark' ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي'}
            >
              {theme === 'dark' ? <SunIcon size={18} /> : <MoonIcon size={18} />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="btn btn-secondary p-2"
              title="فتح القائمة"
              aria-label="فتح القائمة"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* القائمة المنسدلة للهواتف */}
        {isMenuOpen && (
          <div className="md:hidden animate-slideIn">
            <div className="px-2 pt-2 pb-3 space-y-1 glass-effect rounded-2xl mt-2 shadow-xl">
              <Link
                href="/"
                className="navbar-link flex items-center space-x-3 space-x-reverse"
                onClick={() => setIsMenuOpen(false)}
              >
                <HomeIcon size={20} />
                <span>الرئيسية</span>
              </Link>
              <Link
                href="/reports"
                className="navbar-link flex items-center space-x-3 space-x-reverse"
                onClick={() => setIsMenuOpen(false)}
              >
                <ReportIcon size={20} />
                <span>إبلاغ عن مشكلة</span>
              </Link>
              <Link
                href="/reports-map"
                className="navbar-link flex items-center space-x-3 space-x-reverse"
                onClick={() => setIsMenuOpen(false)}
              >
                <MapIcon size={20} />
                <span>خريطة البلاغات</span>
              </Link>
              <Link
                href="/plumbers"
                className="navbar-link flex items-center space-x-3 space-x-reverse"
                onClick={() => setIsMenuOpen(false)}
              >
                <PlumberIcon size={20} />
                <span>دليل السباكين</span>
              </Link>
              <Link
                href="/news"
                className="navbar-link flex items-center space-x-3 space-x-reverse"
                onClick={() => setIsMenuOpen(false)}
              >
                <NewsIcon size={20} />
                <span>الأخبار</span>
              </Link>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                {user && userProfile ? (
                  <div>
                    <div className="px-3 py-2 text-sm font-medium text-primary flex items-center space-x-3 space-x-reverse">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        {(userProfile.display_name || user.email || 'U')[0].toUpperCase()}
                      </div>
                      <span>{userProfile.display_name || user.email}</span>
                    </div>
                    <Link
                      href="/profile"
                      className="navbar-link flex items-center space-x-3 space-x-reverse"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <UserIcon size={18} />
                      <span>الملف الشخصي</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-3 space-x-reverse w-full text-right px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                      </svg>
                      <span>تسجيل الخروج</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/login"
                      className="btn btn-secondary w-full flex items-center justify-center space-x-2 space-x-reverse"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LoginIcon size={18} />
                      <span>تسجيل الدخول</span>
                    </Link>
                    <Link
                      href="/signup"
                      className="btn btn-primary w-full flex items-center justify-center space-x-2 space-x-reverse"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                      </svg>
                      <span>إنشاء حساب</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}