const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// قراءة متغيرات البيئة
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ متغيرات البيئة مفقودة:');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅' : '❌');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  try {
    console.log('🚀 بدء إعداد قاعدة البيانات...');
    
    // قراءة ملف SQL
    const schemaPath = path.join(__dirname, 'supabase-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📄 تم قراءة ملف SQL بنجاح');
    
    // تقسيم الـ SQL إلى أجزاء منفصلة
    const sqlStatements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📊 عدد الأوامر: ${sqlStatements.length}`);
    
    // تنفيذ كل أمر على حدة
    for (let i = 0; i < sqlStatements.length; i++) {
      const statement = sqlStatements[i];
      if (statement.trim()) {
        try {
          console.log(`⏳ تنفيذ الأمر ${i + 1}/${sqlStatements.length}...`);
          const { error } = await supabase.rpc('exec_sql', { sql_query: statement });
          
          if (error) {
            console.warn(`⚠️  تحذير في الأمر ${i + 1}: ${error.message}`);
          }
        } catch (err) {
          console.warn(`⚠️  خطأ في الأمر ${i + 1}: ${err.message}`);
        }
      }
    }
    
    console.log('✅ تم إعداد قاعدة البيانات بنجاح!');
    
    // اختبار الجداول
    console.log('🧪 اختبار الجداول...');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['users', 'plumbers', 'reports', 'news', 'user_profiles', 'admin_users']);
    
    if (tablesError) {
      console.error('❌ خطأ في اختبار الجداول:', tablesError);
    } else {
      console.log('📋 الجداول الموجودة:', tables.map(t => t.table_name));
    }
    
  } catch (error) {
    console.error('❌ خطأ في إعداد قاعدة البيانات:', error);
    process.exit(1);
  }
}

setupDatabase();
