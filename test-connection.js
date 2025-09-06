const { createClient } = require('@supabase/supabase-js');

// قراءة متغيرات البيئة
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔗 اختبار الاتصال بـ Supabase...');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'غير موجود');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ متغيرات البيئة مفقودة');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    // اختبار الاتصال الأساسي
    console.log('⏳ اختبار الاتصال الأساسي...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('❌ خطأ في المصادقة:', authError.message);
    } else {
      console.log('✅ الاتصال بالمصادقة يعمل');
    }
    
    // اختبار جدول المستخدمين
    console.log('⏳ اختبار جدول المستخدمين...');
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('count(*)')
      .limit(1);
    
    if (usersError) {
      console.error('❌ خطأ في جدول المستخدمين:', usersError.message);
    } else {
      console.log('✅ جدول المستخدمين يعمل');
    }
    
    // اختبار جدول البلاغات
    console.log('⏳ اختبار جدول البلاغات...');
    const { data: reportsData, error: reportsError } = await supabase
      .from('reports')
      .select('count(*)')
      .limit(1);
    
    if (reportsError) {
      console.error('❌ خطأ في جدول البلاغات:', reportsError.message);
      console.error('التفاصيل:', reportsError);
    } else {
      console.log('✅ جدول البلاغات يعمل');
    }
    
    // اختبار معلومات الجداول
    console.log('⏳ اختبار معلومات الجداول...');
    const { data: tablesData, error: tablesError } = await supabase
      .from('information_schema.columns')
      .select('table_name, column_name')
      .eq('table_name', 'reports')
      .eq('table_schema', 'public');
    
    if (tablesError) {
      console.error('❌ خطأ في معلومات الجداول:', tablesError.message);
    } else {
      console.log('📋 أعمدة جدول البلاغات:', tablesData.map(col => col.column_name));
    }
    
  } catch (error) {
    console.error('❌ خطأ عام:', error);
  }
}

testConnection();
