"use client";
import { useAuth } from "@/contexts/AuthContextV2";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

export default function DebugAuth() {
  const { user, userProfile, profile, loading } = useAuth();
  const [testResult, setTestResult] = useState("");

  const testSupabaseConnection = async () => {
    try {
      const { data, error } = await supabase.from('users').select('count').limit(1);
      if (error) {
        setTestResult(`❌ خطأ في الاتصال: ${error.message}`);
      } else {
        setTestResult("✅ الاتصال بـ Supabase يعمل بنجاح");
      }
    } catch (err) {
      setTestResult(`❌ خطأ: ${err}`);
    }
  };

  const testAuth = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setTestResult(`المستخدم الحالي: ${authUser ? authUser.email : 'غير مسجل دخول'}`);
    } catch (err) {
      setTestResult(`❌ خطأ في المصادقة: ${err}`);
    }
  };

  return (
    <div className="min-h-screen gradient-bg p-8">
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <h1 className="heading-1 text-center mb-8">تشخيص نظام المصادقة</h1>
          
          <div className="space-y-6">
            {/* معلومات AuthContext */}
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-2">حالة AuthContext:</h3>
              <div className="space-y-1 text-sm">
                <p><strong>Loading:</strong> {loading ? 'true' : 'false'}</p>
                <p><strong>User:</strong> {user ? user.email : 'null'}</p>
                <p><strong>User Profile:</strong> {userProfile ? userProfile.display_name : 'null'}</p>
                <p><strong>Profile Role:</strong> {profile ? profile.role : 'null'}</p>
              </div>
            </div>

            {/* أزرار الاختبار */}
            <div className="flex gap-4">
              <button onClick={testSupabaseConnection} className="btn btn-secondary">
                اختبار اتصال Supabase
              </button>
              <button onClick={testAuth} className="btn btn-primary">
                اختبار المصادقة
              </button>
            </div>

            {/* نتيجة الاختبار */}
            {testResult && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p>{testResult}</p>
              </div>
            )}

            {/* معلومات تفصيلية */}
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-2">تفاصيل المستخدم:</h3>
              <pre className="text-xs overflow-auto">
                {JSON.stringify({ 
                  user: user ? {
                    id: user.id,
                    email: user.email,
                    created_at: user.created_at
                  } : null,
                  userProfile,
                  profile 
                }, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
