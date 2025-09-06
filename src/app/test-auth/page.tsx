"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TestAuthPage() {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("123456");
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setResult("اختبار الاتصال مع Supabase...\n");
    
    try {
      // اختبار الاتصال الأساسي
      const { data: session } = await supabase.auth.getSession();
      setResult(prev => prev + `✅ الاتصال مع Supabase يعمل\n`);
      setResult(prev => prev + `المستخدم الحالي: ${session.session?.user?.email || 'لا يوجد'}\n\n`);
      
      // اختبار متغيرات البيئة
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      setResult(prev => prev + `متغيرات البيئة:\n`);
      setResult(prev => prev + `SUPABASE_URL: ${supabaseUrl ? '✅ موجود' : '❌ مفقود'}\n`);
      setResult(prev => prev + `SUPABASE_KEY: ${supabaseKey ? '✅ موجود' : '❌ مفقود'}\n\n`);
      
    } catch (error: any) {
      setResult(prev => prev + `❌ خطأ في الاتصال: ${error.message}\n`);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    setResult("اختبار تسجيل الدخول...\n");
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setResult(prev => prev + `❌ فشل تسجيل الدخول: ${error.message}\n`);
        setResult(prev => prev + `الكود: ${error.status}\n`);
        setResult(prev => prev + `هذا صحيح! يجب أن يفشل تسجيل الدخول مع بيانات خاطئة\n`);
      } else {
        setResult(prev => prev + `✅ تم تسجيل الدخول بنجاح\n`);
        setResult(prev => prev + `المستخدم: ${data.user?.email}\n`);
        setResult(prev => prev + `المعرف: ${data.user?.id}\n`);
      }
    } catch (error: any) {
      setResult(prev => prev + `❌ خطأ: ${error.message}\n`);
    } finally {
      setLoading(false);
    }
  };

  const testSignup = async () => {
    setLoading(true);
    setResult("اختبار إنشاء حساب جديد...\n");
    
    const testEmail = `test${Date.now()}@example.com`;
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: "123456789",
        options: {
          data: {
            display_name: 'مستخدم تجريبي',
            role: 'user'
          }
        }
      });

      if (error) {
        setResult(prev => prev + `❌ فشل إنشاء الحساب: ${error.message}\n`);
      } else {
        setResult(prev => prev + `✅ تم إنشاء الحساب بنجاح\n`);
        setResult(prev => prev + `البريد: ${testEmail}\n`);
        setResult(prev => prev + `المعرف: ${data.user?.id}\n`);
        setResult(prev => prev + `تأكيد البريد مطلوب: ${!data.user?.email_confirmed_at}\n`);
      }
    } catch (error: any) {
      setResult(prev => prev + `❌ خطأ: ${error.message}\n`);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setResult(prev => prev + `❌ خطأ في تسجيل الخروج: ${error.message}\n`);
      } else {
        setResult(prev => prev + `✅ تم تسجيل الخروج بنجاح\n`);
      }
    } catch (error: any) {
      setResult(prev => prev + `❌ خطأ: ${error.message}\n`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen gradient-bg p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="card">
          <h1 className="heading-1 text-primary mb-6">اختبار نظام المصادقة</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="heading-2 mb-4">اختبار الاتصال</h2>
              <button
                onClick={testConnection}
                disabled={loading}
                className="btn btn-primary w-full mb-4"
              >
                {loading ? 'جاري الاختبار...' : 'اختبار الاتصال'}
              </button>
            </div>
            
            <div>
              <h2 className="heading-2 mb-4">اختبار تسجيل الدخول</h2>
              <div className="space-y-3 mb-4">
                <input
                  type="email"
                  placeholder="البريد الإلكتروني"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input w-full"
                />
                <input
                  type="password"
                  placeholder="كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input w-full"
                />
                <button
                  onClick={testLogin}
                  disabled={loading}
                  className="btn btn-secondary w-full"
                >
                  {loading ? 'جاري الاختبار...' : 'اختبار تسجيل الدخول'}
                </button>
              </div>
            </div>
          </div>

          <div className="flex space-x-4 space-x-reverse mb-6">
            <button
              onClick={testSignup}
              disabled={loading}
              className="btn btn-accent"
            >
              {loading ? 'جاري الاختبار...' : 'اختبار إنشاء حساب'}
            </button>
            
            <button
              onClick={logout}
              disabled={loading}
              className="btn btn-secondary"
            >
              {loading ? 'جاري الخروج...' : 'تسجيل الخروج'}
            </button>
          </div>

          {result && (
            <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <h2 className="heading-3 mb-2">نتائج الاختبار:</h2>
              <pre className="text-sm whitespace-pre-wrap font-mono">{result}</pre>
            </div>
          )}

          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <h3 className="heading-3 mb-2 text-yellow-800 dark:text-yellow-200">ملاحظة مهمة:</h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              إذا كان تسجيل الدخول يعمل مع أي بيانات، فهذا يعني أن:
            </p>
            <ul className="text-sm text-yellow-700 dark:text-yellow-300 list-disc list-inside mt-2 space-y-1">
              <li>متغيرات البيئة غير صحيحة</li>
              <li>الاتصال مع Supabase لا يعمل</li>
              <li>هناك مشكلة في إعدادات المشروع</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
