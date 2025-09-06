"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContextV2";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserIcon, EmailIcon, PhoneIcon } from "@/components/icons/ProfessionalIcons";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { signUp } = useAuth();
  const router = useRouter();

  const validateForm = () => {
    if (password !== confirmPassword) {
      setError("كلمات المرور غير متطابقة");
      return false;
    }
    if (password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("يرجى إدخال بريد إلكتروني صحيح");
      return false;
    }
    if (!/^01[0-9]{9}$/.test(phoneNumber)) {
      setError("يرجى إدخال رقم هاتف مصري صحيح (01xxxxxxxxx)");
      return false;
    }
    return true;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      await signUp(email, password, fullName, phoneNumber, 'user');
      setSuccess("تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني لتأكيد الحساب.");
      setTimeout(() => {
        router.push('/');
      }, 3000);
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
              <UserIcon size={32} className="text-white" />
            </div>
            <h1 className="heading-2 text-blue-600 dark:text-blue-400">إنشاء حساب جديد</h1>
            <p className="text-secondary">انضم إلى مجتمع Water Guard</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            {/* الاسم الكامل */}
            <div>
              <label className="label flex items-center">
                <UserIcon size={18} className="ml-2" />
                <span>الاسم الكامل *</span>
              </label>
              <input
                type="text"
                className="input"
                placeholder="الاسم كما في الهوية"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                minLength={2}
              />
            </div>

            {/* البريد الإلكتروني */}
            <div>
              <label className="label flex items-center">
                <EmailIcon size={18} className="ml-2" />
                <span>البريد الإلكتروني *</span>
              </label>
              <input
                type="email"
                className="input"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                dir="ltr"
              />
            </div>

            {/* رقم الهاتف */}
            <div>
              <label className="label flex items-center">
                <PhoneIcon size={18} className="ml-2" />
                <span>رقم الهاتف *</span>
              </label>
              <input
                type="tel"
                className="input"
                placeholder="01012345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                dir="ltr"
                pattern="01[0-9]{9}"
              />
              <p className="text-xs text-secondary mt-1">
                يجب أن يبدأ برقم 01 ويتكون من 11 رقم
              </p>
            </div>

            {/* كلمة المرور */}
            <div>
              <label className="label flex items-center">
                <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>كلمة المرور *</span>
              </label>
              <input
                type="password"
                className="input"
                placeholder="كلمة مرور قوية"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <p className="text-xs text-secondary mt-1">
                يجب أن تكون 6 أحرف على الأقل
              </p>
            </div>

            {/* تأكيد كلمة المرور */}
            <div>
              <label className="label flex items-center">
                <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>تأكيد كلمة المرور *</span>
              </label>
              <input
                type="password"
                className="input"
                placeholder="أعد كتابة كلمة المرور"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {/* رسائل الخطأ والنجاح */}
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

            {success && (
              <div className="alert alert-success animate-fadeIn">
                <div className="flex items-center">
                  <svg className="w-5 h-5 ml-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{success}</span>
                </div>
              </div>
            )}

            {/* زر التسجيل */}
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
                  <span>جاري إنشاء الحساب...</span>
                </>
              ) : (
                <>
                  <UserIcon size={20} />
                  <span>إنشاء حساب</span>
                </>
              )}
            </button>

            {/* رابط تسجيل الدخول */}
            <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-secondary">
                لديك حساب بالفعل؟{" "}
                <Link 
                  href="/login" 
                  className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  سجل الدخول
                </Link>
              </p>
              <p className="text-secondary mt-2">
                أو{" "}
                <Link 
                  href="/plumber-signup" 
                  className="text-green-600 dark:text-green-400 hover:underline font-semibold"
                >
                  سجل كسباك محترف
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* معلومات إضافية */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted">
            بإنشاء حساب، أنت توافق على{" "}
            <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
              شروط الاستخدام
            </Link>
            {" "}و{" "}
            <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
              سياسة الخصوصية
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}