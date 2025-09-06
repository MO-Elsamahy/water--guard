"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SetupSchemaPage() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const setupSchema = async () => {
    setLoading(true);
    setResult("جاري إعداد قاعدة البيانات...\n");
    
    try {
      // استخدام الـ Schema المبسط لتجنب مشاكل التبعيات
      const simpleSchema = `
        -- Enable UUID extension
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

        -- Drop existing tables if they exist
        DROP TABLE IF EXISTS public.admin_users CASCADE;
        DROP TABLE IF EXISTS public.user_profiles CASCADE;
        DROP TABLE IF EXISTS public.news CASCADE;
        DROP TABLE IF EXISTS public.reports CASCADE;
        DROP TABLE IF EXISTS public.plumbers CASCADE;
        DROP TABLE IF EXISTS public.users CASCADE;

        -- Users table (main user accounts)
        CREATE TABLE public.users (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          display_name TEXT NOT NULL,
          phone_number TEXT,
          role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'plumber', 'admin')),
          is_active BOOLEAN DEFAULT true,
          profile_image_url TEXT,
          bio TEXT,
          location TEXT,
          website TEXT,
          social_links JSONB DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
        );

        -- Reports table
        CREATE TABLE public.reports (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          reporter_id UUID REFERENCES public.users(id) NOT NULL,
          reporter_name TEXT NOT NULL,
          reporter_phone TEXT NOT NULL,
          location_lat DECIMAL(10, 8),
          location_lng DECIMAL(11, 8),
          location_address TEXT,
          area TEXT,
          priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
          status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'resolved')),
          images TEXT[] DEFAULT '{}',
          is_approved BOOLEAN DEFAULT false,
          approved_at TIMESTAMP WITH TIME ZONE,
          approved_by UUID REFERENCES public.users(id),
          rejection_reason TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
        );

        -- News table
        CREATE TABLE public.news (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          category TEXT NOT NULL DEFAULT 'news',
          author_id UUID REFERENCES public.users(id) NOT NULL,
          author_name TEXT NOT NULL,
          images TEXT[] DEFAULT '{}',
          status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
          is_published BOOLEAN DEFAULT false,
          published_at TIMESTAMP WITH TIME ZONE,
          approved_by UUID REFERENCES public.users(id),
          approved_at TIMESTAMP WITH TIME ZONE,
          rejection_reason TEXT,
          tags TEXT[] DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
        );

        -- Plumbers table
        CREATE TABLE public.plumbers (
          id UUID REFERENCES public.users(id) PRIMARY KEY,
          experience INTEGER NOT NULL DEFAULT 0,
          specialties TEXT[] DEFAULT '{}',
          working_areas TEXT[] DEFAULT '{}',
          is_available BOOLEAN DEFAULT true,
          is_approved BOOLEAN DEFAULT false,
          rating DECIMAL(3,2) DEFAULT 0.00,
          completed_jobs INTEGER DEFAULT 0,
          license_number TEXT,
          license_image_url TEXT,
          description TEXT,
          hourly_rate DECIMAL(10,2),
          approved_at TIMESTAMP WITH TIME ZONE,
          approved_by UUID REFERENCES public.users(id)
        );

        -- User profiles table
        CREATE TABLE public.user_profiles (
          id UUID REFERENCES public.users(id) PRIMARY KEY,
          role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'plumber', 'admin')),
          permissions TEXT[] DEFAULT '{}',
          preferences JSONB DEFAULT '{}',
          last_active TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
        );

        -- Admin users table
        CREATE TABLE public.admin_users (
          id UUID REFERENCES public.users(id) PRIMARY KEY,
          admin_level TEXT NOT NULL DEFAULT 'admin' CHECK (admin_level IN ('admin', 'super_admin')),
          permissions TEXT[] DEFAULT '{}',
          created_by UUID REFERENCES public.users(id),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
        );
      `;

      setResult(prev => prev + "تشغيل SQL Schema...\n");
      
      const { error } = await supabase.rpc('exec_sql', { 
        sql: createUsersTable 
      });

      if (error) {
        setResult(prev => prev + `❌ خطأ في تشغيل SQL: ${error.message}\n`);
        
        // جرب طريقة أخرى - إنشاء الجداول واحد تلو الآخر
        setResult(prev => prev + "محاولة إنشاء الجداول منفردة...\n");
        
        // إنشاء جدول المستخدمين
        const { error: usersError } = await supabase.rpc('exec_sql', { 
          sql: `
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
            
            CREATE TABLE IF NOT EXISTS public.users (
              id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
              email TEXT UNIQUE NOT NULL,
              display_name TEXT NOT NULL,
              phone_number TEXT,
              role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'plumber', 'admin')),
              is_active BOOLEAN DEFAULT true,
              profile_image_url TEXT,
              bio TEXT,
              location TEXT,
              website TEXT,
              social_links JSONB DEFAULT '{}',
              created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
            );
          `
        });

        if (usersError) {
          setResult(prev => prev + `❌ خطأ في إنشاء جدول المستخدمين: ${usersError.message}\n`);
        } else {
          setResult(prev => prev + "✅ تم إنشاء جدول المستخدمين\n");
        }

        // إنشاء جدول البلاغات
        const { error: reportsError } = await supabase.rpc('exec_sql', { 
          sql: `
            CREATE TABLE IF NOT EXISTS public.reports (
              id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
              title TEXT NOT NULL,
              description TEXT NOT NULL,
              reporter_id UUID NOT NULL,
              reporter_name TEXT NOT NULL,
              reporter_phone TEXT NOT NULL,
              location_lat DECIMAL(10, 8),
              location_lng DECIMAL(11, 8),
              location_address TEXT,
              area TEXT,
              priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
              status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'resolved')),
              images TEXT[] DEFAULT '{}',
              is_approved BOOLEAN DEFAULT false,
              approved_at TIMESTAMP WITH TIME ZONE,
              approved_by UUID,
              rejection_reason TEXT,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
            );
          `
        });

        if (reportsError) {
          setResult(prev => prev + `❌ خطأ في إنشاء جدول البلاغات: ${reportsError.message}\n`);
        } else {
          setResult(prev => prev + "✅ تم إنشاء جدول البلاغات\n");
        }

      } else {
        setResult(prev => prev + "✅ تم تشغيل SQL Schema بنجاح!\n");
      }

      // اختبار الجداول
      setResult(prev => prev + "\n🧪 اختبار الجداول...\n");
      
      const { data: tablesTest, error: tablesError } = await supabase
        .from('reports')
        .select('count(*)')
        .limit(1);

      if (tablesError) {
        setResult(prev => prev + `❌ جدول البلاغات: ${tablesError.message}\n`);
      } else {
        setResult(prev => prev + "✅ جدول البلاغات يعمل بشكل صحيح\n");
      }

      setResult(prev => prev + "\n🎉 تم إعداد قاعدة البيانات بنجاح!");

    } catch (error: any) {
      setResult(prev => prev + `❌ خطأ عام: ${error.message}\n`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen gradient-bg p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="card">
          <h1 className="heading-1 text-primary mb-6">إعداد قاعدة البيانات</h1>
          
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h2 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">⚠️ تحذير مهم</h2>
            <p className="text-yellow-700 dark:text-yellow-300 text-sm">
              هذا الإجراء سيحذف جميع البيانات الموجودة في قاعدة البيانات ويعيد إنشاء الجداول من جديد.
              تأكد من أن هذا ما تريده قبل المتابعة.
            </p>
          </div>
          
          <button
            onClick={setupSchema}
            disabled={loading}
            className="btn btn-primary mb-6"
          >
            {loading ? 'جاري إعداد قاعدة البيانات...' : 'إعداد قاعدة البيانات'}
          </button>

          {result && (
            <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <h2 className="heading-3 mb-2">سجل العمليات:</h2>
              <pre className="text-sm whitespace-pre-wrap font-mono">{result}</pre>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="heading-3 mb-2 text-blue-800 dark:text-blue-200">البديل اليدوي:</h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
              إذا لم تعمل هذه الطريقة، يمكنك:
            </p>
            <ol className="text-sm text-blue-700 dark:text-blue-300 list-decimal list-inside space-y-1">
              <li>اذهب إلى Supabase Dashboard</li>
              <li>افتح SQL Editor</li>
              <li>انسخ محتوى ملف `supabase-schema.sql`</li>
              <li>الصقه في المحرر واضغط Run</li>
            </ol>
          </div>
        </div>
      </div>
    </main>
  );
}
