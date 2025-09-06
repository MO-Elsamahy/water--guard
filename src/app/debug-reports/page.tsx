"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContextV2";

export default function DebugReportsPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const testConnection = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .limit(1);
      
      setResult({
        success: true,
        data,
        error,
        message: 'اتصال قاعدة البيانات يعمل بشكل صحيح'
      });
    } catch (err: any) {
      setResult({
        success: false,
        error: err,
        message: 'فشل الاتصال بقاعدة البيانات'
      });
    } finally {
      setLoading(false);
    }
  };

  const testInsert = async () => {
    if (!user) {
      setResult({ success: false, message: 'يجب تسجيل الدخول أولاً' });
      return;
    }

    setLoading(true);
    try {
      const testData = {
        title: 'تقرير تجريبي',
        description: 'هذا تقرير تجريبي لاختبار قاعدة البيانات',
        reporter_id: user.id,
        reporter_name: 'مستخدم تجريبي',
        reporter_phone: '01234567890',
        location_lat: 30.9700,
        location_lng: 31.1667,
        location_address: 'المحلة الكبرى - موقع تجريبي',
        priority: 'medium' as const,
        status: 'pending' as const,
        is_approved: false,
        images: [] as string[]
      };

      const { data, error } = await supabase
        .from('reports')
        .insert(testData)
        .select('*')
        .single();
      
      setResult({
        success: true,
        data,
        error,
        message: 'تم إنشاء التقرير التجريبي بنجاح'
      });
    } catch (err: any) {
      setResult({
        success: false,
        error: err,
        message: 'فشل في إنشاء التقرير التجريبي'
      });
    } finally {
      setLoading(false);
    }
  };

  const checkSchema = async () => {
    setLoading(true);
    try {
      // محاولة جلب معلومات الجدول
      const { data: tableInfo, error: schemaError } = await supabase
        .rpc('get_table_info', { table_name: 'reports' })
        .single();

      if (schemaError) {
        // إذا فشلت الدالة، نجرب طريقة أخرى
        const { data, error } = await supabase
          .from('information_schema.columns')
          .select('*')
          .eq('table_name', 'reports');
        
        setResult({
          success: !error,
          data,
          error,
          message: error ? 'فشل في جلب معلومات الجدول' : 'معلومات أعمدة الجدول'
        });
      } else {
        setResult({
          success: true,
          data: tableInfo,
          message: 'معلومات الجدول'
        });
      }
    } catch (err: any) {
      setResult({
        success: false,
        error: err,
        message: 'فشل في فحص بنية الجدول'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen gradient-bg p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="card">
          <h1 className="heading-1 text-primary mb-6">تشخيص مشاكل البلاغات</h1>
          
          <div className="space-y-4 mb-6">
            <button
              onClick={testConnection}
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'جاري الاختبار...' : 'اختبار الاتصال بقاعدة البيانات'}
            </button>
            
            <button
              onClick={checkSchema}
              disabled={loading}
              className="btn btn-secondary"
            >
              {loading ? 'جاري الفحص...' : 'فحص بنية جدول reports'}
            </button>
            
            <button
              onClick={testInsert}
              disabled={loading || !user}
              className="btn btn-accent"
            >
              {loading ? 'جاري الاختبار...' : 'اختبار إدراج تقرير تجريبي'}
            </button>
          </div>

          {user ? (
            <div className="mb-4 p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <p className="text-green-800 dark:text-green-200">
                مسجل دخول كـ: {user.email} (ID: {user.id})
              </p>
            </div>
          ) : (
            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <p className="text-red-800 dark:text-red-200">
                غير مسجل دخول - يجب تسجيل الدخول لاختبار إدراج البيانات
              </p>
            </div>
          )}

          {result && (
            <div className="mt-6">
              <h2 className="heading-2 mb-4">نتائج الاختبار:</h2>
              <div className={`p-4 rounded-lg ${result.success ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
                <p className={`font-semibold mb-2 ${result.success ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                  {result.message}
                </p>
                
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">التفاصيل الكاملة:</h3>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-xs overflow-auto max-h-96">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
