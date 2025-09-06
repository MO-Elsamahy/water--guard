"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SetupDatabase() {
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const setupDatabase = async () => {
    setIsLoading(true);
    setStatus("جاري إعداد قاعدة البيانات...");

    try {
      // SQL script للإعداد السريع
      const setupSQL = `
-- تنظيف قاعدة البيانات
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS news CASCADE;
DROP TABLE IF EXISTS plumbers CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

-- إنشاء الجداول
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  phone_number TEXT,
  profile_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'plumber', 'admin')),
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE plumbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  business_name TEXT,
  experience_years INTEGER,
  specializations TEXT[],
  service_areas TEXT[],
  hourly_rate DECIMAL(10,2),
  availability_hours TEXT,
  website_url TEXT,
  is_approved BOOLEAN DEFAULT false,
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  reporter_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reporter_name TEXT NOT NULL,
  reporter_phone TEXT NOT NULL,
  location_lat DECIMAL(10, 8) NOT NULL,
  location_lng DECIMAL(11, 8) NOT NULL,
  location_address TEXT NOT NULL,
  area TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'rejected')),
  images TEXT[],
  is_approved BOOLEAN DEFAULT false,
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES users(id),
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  tags TEXT[],
  image_url TEXT,
  is_approved BOOLEAN DEFAULT false,
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES users(id),
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  permissions TEXT[] DEFAULT ARRAY['manage_reports', 'manage_news', 'manage_plumbers', 'manage_users'],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء الفهارس
CREATE INDEX idx_reports_location ON reports(location_lat, location_lng);
CREATE INDEX idx_reports_area ON reports(area);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_approved ON reports(is_approved);
CREATE INDEX idx_news_approved ON news(is_approved);
CREATE INDEX idx_plumbers_approved ON plumbers(is_approved);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);

-- تفعيل RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE plumbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- سياسات RLS
CREATE POLICY "Users can view all profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Anyone can view user profiles" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Anyone can view approved plumbers" ON plumbers FOR SELECT USING (is_approved = true);
CREATE POLICY "Plumbers can update own profile" ON plumbers FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Anyone can view approved reports" ON reports FOR SELECT USING (is_approved = true);
CREATE POLICY "Authenticated users can create reports" ON reports FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own reports" ON reports FOR UPDATE USING (auth.uid()::text = reporter_id::text);

CREATE POLICY "Anyone can view approved news" ON news FOR SELECT USING (is_approved = true);
CREATE POLICY "Authenticated users can create news" ON news FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own news" ON news FOR UPDATE USING (auth.uid()::text = author_id::text);

CREATE POLICY "Only admins can view admin_users" ON admin_users FOR SELECT USING (
  EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
);

-- الدوال والمحفزات
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_plumbers_updated_at BEFORE UPDATE ON plumbers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- دالة إنشاء المستخدم الجديد
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  
  INSERT INTO user_profiles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- إنشاء مستخدم إداري تجريبي
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
VALUES (
  gen_random_uuid(),
  'admin@waterguard.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"display_name": "Admin User"}'::jsonb
) ON CONFLICT (email) DO NOTHING;
`;

      // تنفيذ كل استعلام منفصل
      const statements = setupSQL.split(';').filter(stmt => stmt.trim());
      let successCount = 0;
      let errorCount = 0;
      
      for (const statement of statements) {
        if (statement.trim()) {
          try {
            const { error } = await supabase.rpc('query', { 
              query_text: statement.trim() + ';' 
            });
            if (error) {
              console.error('Error executing statement:', statement, error);
              errorCount++;
            } else {
              successCount++;
            }
          } catch (err) {
            console.error('Exception executing statement:', statement, err);
            errorCount++;
          }
        }
      }
      
      if (errorCount === 0) {
        setStatus(`✅ تم إعداد قاعدة البيانات بنجاح! (${successCount} استعلام)`);
      } else {
        setStatus(`⚠️ تم الإعداد مع بعض الأخطاء: ${successCount} نجح، ${errorCount} فشل`);
      }
    } catch (error) {
      console.error('Setup error:', error);
      setStatus(`❌ خطأ في الإعداد: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async () => {
    setIsLoading(true);
    setStatus("جاري اختبار الاتصال...");

    try {
      const { data, error } = await supabase.from('users').select('count').limit(1);
      if (error) throw error;
      setStatus("✅ الاتصال بقاعدة البيانات يعمل بنجاح!");
    } catch (error) {
      setStatus(`❌ فشل الاتصال: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg p-8">
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <h1 className="heading-1 text-center mb-8">إعداد قاعدة البيانات</h1>
          
          <div className="space-y-6">
            <div className="text-center">
              <button
                onClick={testConnection}
                disabled={isLoading}
                className="btn btn-secondary mr-4"
              >
                {isLoading ? "جاري الاختبار..." : "اختبار الاتصال"}
              </button>
              
              <button
                onClick={setupDatabase}
                disabled={isLoading}
                className="btn btn-primary"
              >
                {isLoading ? "جاري الإعداد..." : "إعداد قاعدة البيانات"}
              </button>
            </div>
            
            {status && (
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <p className="text-center font-medium">{status}</p>
              </div>
            )}
            
            <div className="text-sm text-secondary space-y-2">
              <h3 className="font-semibold">ملاحظات:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>هذا سيقوم بإعادة إنشاء جميع الجداول</li>
                <li>سيتم حذف جميع البيانات الموجودة</li>
                <li>سيتم إنشاء مستخدم إداري: admin@waterguard.com / admin123</li>
                <li>بعد الإعداد، يمكنك تسجيل الدخول والبدء في استخدام الموقع</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
