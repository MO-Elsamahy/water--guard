"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContextV2";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoginIcon, EmailIcon } from "@/components/icons/ProfessionalIcons";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signIn(email, password);
      router.push('/');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "حدث خطأ غير متوقع";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card animate-slideIn">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <LoginIcon size={32} className="text-white" />
            </div>
            <h1 className="heading-2 text-blue-600 dark:text-blue-400">تسجيل الدخول</h1>
            <p className="text-secondary">مرحباً بك في Water Guard</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            {/* البريد الإلكتروني */}
            <div>
              <label className="label flex items-center">
                <EmailIcon size={18} className="ml-2" />
                <span>البريد الإلكتروني</span>
              </label>
              <input
                dir="ltr"
                type="email"
                className="input"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* كلمة المرور */}
            <div>
              <label className="label flex items-center">
                <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>كلمة المرور</span>
              </label>
              <input
                dir="ltr"
                type="password"
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="text-left mt-2">
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  نسيت كلمة المرور؟
                </Link>
              </div>
            </div>

            {/* رسالة الخطأ */}
            {error && (
              <div className="alert alert-error animate-fadeIn">
                <div className="flex items-center">
                  <svg className="w-5 h-5 ml-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* زر تسجيل الدخول */}
            <button
              type="submit"
              disabled={loading}
              className={`btn btn-primary w-full text-lg py-4 font-bold ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-2xl'
              } transition-all duration-300 flex items-center justify-center space-x-3 space-x-reverse`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>جاري الدخول...</span>
                </>
              ) : (
                <>
                  <LoginIcon size={20} />
                  <span>تسجيل الدخول</span>
                </>
              )}
            </button>

            {/* روابط إضافية */}
            <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-secondary">
                ليس لديك حساب؟{" "}
                <Link 
                  href="/signup" 
                  className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  إنشاء حساب جديد
                </Link>
              </p>
              <p className="text-secondary mt-2">
                أو{" "}
                <Link 
                  href="/plumber-signup" 
                  className="text-green-600 dark:text-green-400 hover:underline font-semibold"
                >
                  تسجيل كسباك محترف
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* دخول سريع للتجربة */}
        <div className="mt-6 card">
          <h3 className="text-center text-sm font-semibold text-secondary mb-3">دخول سريع للتجربة</h3>
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => {
                setEmail("user@example.com");
                setPassword("123456");
              }}
              className="btn btn-secondary text-sm py-2"
            >
              حساب تجريبي - مستخدم عادي
            </button>
            <button
              onClick={() => {
                setEmail("plumber@example.com");
                setPassword("123456");
              }}
              className="btn btn-secondary text-sm py-2"
            >
              حساب تجريبي - سباك
            </button>
          </div>
          <p className="text-xs text-muted text-center mt-2">
            * هذه حسابات تجريبية للاختبار فقط
          </p>
        </div>
      </div>
    </main>
  );
}
