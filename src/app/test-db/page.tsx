"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TestDbPage() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setResult("جاري اختبار الاتصال...");
    
    try {
      // اختبار الاتصال الأساسي
      const { data, error } = await supabase
        .from('reports')
        .select('count(*)')
        .limit(1);
      
      if (error) {
        setResult(`خطأ في الاتصال: ${error.message}\nالكود: ${error.code}\nالتفاصيل: ${error.details}`);
      } else {
        setResult(`✅ الاتصال يعمل بشكل صحيح!\nالبيانات: ${JSON.stringify(data)}`);
      }
    } catch (err: any) {
      setResult(`❌ خطأ في الاتصال: ${err.message || err.toString()}`);
    } finally {
      setLoading(false);
    }
  };

  const testInsert = async () => {
    setLoading(true);
    setResult("جاري اختبار إدراج البيانات...");
    
    try {
      const testData = {
        title: 'تقرير تجريبي',
        description: 'هذا تقرير تجريبي لاختبار قاعدة البيانات',
        reporter_id: '123e4567-e89b-12d3-a456-426614174000', // UUID وهمي
        reporter_name: 'مستخدم تجريبي',
        reporter_phone: '01234567890',
        priority: 'medium',
        status: 'pending',
        is_approved: false
      };

      const { data, error } = await supabase
        .from('reports')
        .insert(testData)
        .select('*')
        .single();
      
      if (error) {
        setResult(`❌ خطأ في الإدراج: ${error.message}\nالكود: ${error.code}\nالتفاصيل: ${error.details || 'لا توجد تفاصيل'}`);
      } else {
        setResult(`✅ تم إدراج البيانات بنجاح!\nالمعرف: ${data.id}\nالبيانات: ${JSON.stringify(data, null, 2)}`);
      }
    } catch (err: any) {
      setResult(`❌ خطأ في الإدراج: ${err.message || err.toString()}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen gradient-bg p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="card">
          <h1 className="heading-1 text-primary mb-6">اختبار قاعدة البيانات</h1>
          
          <div className="space-x-4 space-x-reverse mb-6">
            <button
              onClick={testConnection}
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'جاري الاختبار...' : 'اختبار الاتصال'}
            </button>
            
            <button
              onClick={testInsert}
              disabled={loading}
              className="btn btn-secondary"
            >
              {loading ? 'جاري الاختبار...' : 'اختبار الإدراج'}
            </button>
          </div>

          {result && (
            <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <h2 className="heading-3 mb-2">النتيجة:</h2>
              <pre className="text-sm whitespace-pre-wrap">{result}</pre>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="heading-3 mb-2 text-blue-800 dark:text-blue-200">معلومات البيئة:</h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ محدد' : '❌ غير محدد'}
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Supabase Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ محدد' : '❌ غير محدد'}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
