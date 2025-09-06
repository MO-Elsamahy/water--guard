-- ==============================================
-- Water Guard - Complete Database Schema
-- إعداد قاعدة بيانات كاملة لتطبيق Water Guard
-- ==============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================
-- مسح قاعدة البيانات القديمة (إن وجدت)
-- ==============================================

-- Disable RLS temporarily for cleanup
ALTER TABLE IF EXISTS public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.plumbers DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.reports DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.news DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.admin_users DISABLE ROW LEVEL SECURITY;

-- Drop existing triggers first (they depend on functions)
DROP TRIGGER IF EXISTS set_timestamp_users ON public.users;
DROP TRIGGER IF EXISTS set_timestamp_plumbers ON public.plumbers;
DROP TRIGGER IF EXISTS set_timestamp_reports ON public.reports;
DROP TRIGGER IF EXISTS set_timestamp_news ON public.news;
DROP TRIGGER IF EXISTS set_timestamp_user_profiles ON public.user_profiles;
DROP TRIGGER IF EXISTS set_timestamp_admin_users ON public.admin_users;
DROP TRIGGER IF EXISTS handle_new_user_trigger ON auth.users;

-- Drop triggers with different possible names (from previous versions)
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
DROP TRIGGER IF EXISTS update_plumbers_updated_at ON public.plumbers;
DROP TRIGGER IF EXISTS update_reports_updated_at ON public.reports;
DROP TRIGGER IF EXISTS update_news_updated_at ON public.news;
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
DROP TRIGGER IF EXISTS update_admin_users_updated_at ON public.admin_users;

-- Now drop existing functions (after triggers are removed)
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;

DROP POLICY IF EXISTS "Plumbers can view their own data" ON public.plumbers;
DROP POLICY IF EXISTS "Plumbers can update their own data" ON public.plumbers;
DROP POLICY IF EXISTS "Users can view approved plumbers" ON public.plumbers;
DROP POLICY IF EXISTS "Admins can manage all plumbers" ON public.plumbers;

DROP POLICY IF EXISTS "Users can create reports" ON public.reports;
DROP POLICY IF EXISTS "Users can view their own reports" ON public.reports;
DROP POLICY IF EXISTS "Everyone can view approved reports" ON public.reports;
DROP POLICY IF EXISTS "Admins can manage all reports" ON public.reports;

DROP POLICY IF EXISTS "Users can create news" ON public.news;
DROP POLICY IF EXISTS "Users can view their own news" ON public.news;
DROP POLICY IF EXISTS "Everyone can view published news" ON public.news;
DROP POLICY IF EXISTS "Admins can manage all news" ON public.news;

DROP POLICY IF EXISTS "Users can manage their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;

DROP POLICY IF EXISTS "Only super admins can manage admin users" ON public.admin_users;

-- Drop storage policies
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Report images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload report images" ON storage.objects;
DROP POLICY IF EXISTS "News images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload news images" ON storage.objects;

-- Drop storage buckets
DELETE FROM storage.buckets WHERE id IN ('avatars', 'reports', 'news', 'licenses');

-- Drop indexes
DROP INDEX IF EXISTS idx_users_role;
DROP INDEX IF EXISTS idx_users_email;
DROP INDEX IF EXISTS idx_users_active;
DROP INDEX IF EXISTS idx_plumbers_approved;
DROP INDEX IF EXISTS idx_plumbers_available;
DROP INDEX IF EXISTS idx_plumbers_rating;
DROP INDEX IF EXISTS idx_reports_status;
DROP INDEX IF EXISTS idx_reports_approved;
DROP INDEX IF EXISTS idx_reports_priority;
DROP INDEX IF EXISTS idx_reports_location;
DROP INDEX IF EXISTS idx_reports_reporter;
DROP INDEX IF EXISTS idx_news_status;
DROP INDEX IF EXISTS idx_news_published;
DROP INDEX IF EXISTS idx_news_category;
DROP INDEX IF EXISTS idx_news_author;
DROP INDEX IF EXISTS idx_user_profiles_role;
DROP INDEX IF EXISTS idx_admin_users_level;

-- Drop all policies first to avoid dependency issues
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Drop all policies on our tables
    FOR r IN (SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname = 'public' AND tablename IN ('users', 'plumbers', 'reports', 'news', 'user_profiles', 'admin_users'))
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON ' || r.schemaname || '.' || r.tablename;
    END LOOP;
END $$;

-- Drop tables in correct order (considering foreign keys)
DROP TABLE IF EXISTS public.admin_users CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;
DROP TABLE IF EXISTS public.news CASCADE;
DROP TABLE IF EXISTS public.reports CASCADE;
DROP TABLE IF EXISTS public.plumbers CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- ==============================================
-- إنشاء الجداول الجديدة
-- ==============================================

-- Users table (main user accounts linked to auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
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
  email_verified BOOLEAN DEFAULT false,
  phone_verified BOOLEAN DEFAULT false,
  last_login TIMESTAMP WITH TIME ZONE,
  login_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Plumbers table (extends users for plumber-specific data)
CREATE TABLE public.plumbers (
  id UUID REFERENCES public.users(id) ON DELETE CASCADE PRIMARY KEY,
  experience INTEGER NOT NULL DEFAULT 0,
  specialties TEXT[] DEFAULT '{}' NOT NULL,
  working_areas TEXT[] DEFAULT '{}' NOT NULL,
  is_available BOOLEAN DEFAULT true,
  is_approved BOOLEAN DEFAULT false,
  rating DECIMAL(3,2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
  completed_jobs INTEGER DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  license_number TEXT,
  license_image_url TEXT,
  description TEXT,
  hourly_rate DECIMAL(10,2) CHECK (hourly_rate >= 0),
  emergency_service BOOLEAN DEFAULT false,
  years_experience INTEGER DEFAULT 0,
  certifications TEXT[] DEFAULT '{}',
  work_hours JSONB DEFAULT '{"start": "08:00", "end": "18:00", "days": ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]}',
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES public.users(id),
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Reports table (problem reports from users)
CREATE TABLE public.reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  reporter_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  reporter_name TEXT NOT NULL,
  reporter_phone TEXT NOT NULL,
  reporter_email TEXT,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  location_address TEXT,
  area TEXT,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'resolved', 'in_progress')),
  category TEXT DEFAULT 'water_problem' CHECK (category IN ('water_problem', 'sewage', 'leak', 'pressure', 'quality', 'other')),
  images TEXT[] DEFAULT '{}',
  is_approved BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT false,
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES public.users(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES public.users(id),
  assigned_plumber_id UUID REFERENCES public.plumbers(id),
  estimated_cost DECIMAL(10,2),
  actual_cost DECIMAL(10,2),
  work_started_at TIMESTAMP WITH TIME ZONE,
  work_completed_at TIMESTAMP WITH TIME ZONE,
  customer_rating INTEGER CHECK (customer_rating >= 1 AND customer_rating <= 5),
  customer_feedback TEXT,
  rejection_reason TEXT,
  admin_notes TEXT,
  urgency_level INTEGER DEFAULT 1 CHECK (urgency_level >= 1 AND urgency_level <= 5),
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- News table (for user-generated news that need admin approval)
CREATE TABLE public.news (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  category TEXT NOT NULL DEFAULT 'news' CHECK (category IN ('news', 'announcement', 'maintenance', 'emergency', 'update', 'event')),
  author_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  author_name TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  featured_image TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'draft')),
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES public.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  tags TEXT[] DEFAULT '{}',
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  reading_time INTEGER DEFAULT 0, -- in minutes
  language TEXT DEFAULT 'ar',
  seo_title TEXT,
  seo_description TEXT,
  slug TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- User profiles table (extended user information and preferences)
CREATE TABLE public.user_profiles (
  id UUID REFERENCES public.users(id) ON DELETE CASCADE PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'plumber', 'admin')),
  permissions TEXT[] DEFAULT '{}',
  preferences JSONB DEFAULT '{"theme": "light", "language": "ar", "notifications": {"email": true, "push": true, "sms": false}}',
  notification_settings JSONB DEFAULT '{"reports": true, "news": true, "plumber_updates": true, "system": true}',
  privacy_settings JSONB DEFAULT '{"profile_visible": true, "contact_visible": true, "location_visible": false}',
  subscription_type TEXT DEFAULT 'free' CHECK (subscription_type IN ('free', 'premium', 'business')),
  subscription_expires_at TIMESTAMP WITH TIME ZONE,
  api_key TEXT UNIQUE,
  api_requests_count INTEGER DEFAULT 0,
  api_requests_limit INTEGER DEFAULT 1000,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  total_reports INTEGER DEFAULT 0,
  total_news INTEGER DEFAULT 0,
  reputation_score INTEGER DEFAULT 0,
  badges TEXT[] DEFAULT '{}',
  achievements JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Admin users table (for admin-specific data and permissions)
CREATE TABLE public.admin_users (
  id UUID REFERENCES public.users(id) ON DELETE CASCADE PRIMARY KEY,
  admin_level TEXT NOT NULL DEFAULT 'admin' CHECK (admin_level IN ('admin', 'super_admin', 'moderator')),
  permissions TEXT[] DEFAULT '{"manage_users", "manage_reports", "manage_news", "manage_plumbers"}',
  department TEXT DEFAULT 'general',
  can_approve_reports BOOLEAN DEFAULT true,
  can_approve_news BOOLEAN DEFAULT true,
  can_approve_plumbers BOOLEAN DEFAULT true,
  can_manage_users BOOLEAN DEFAULT false,
  can_access_analytics BOOLEAN DEFAULT true,
  can_export_data BOOLEAN DEFAULT false,
  max_actions_per_day INTEGER DEFAULT 100,
  actions_today INTEGER DEFAULT 0,
  last_action_date DATE DEFAULT CURRENT_DATE,
  created_by UUID REFERENCES public.users(id),
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================
-- إنشاء الفهارس (Indexes) لتحسين الأداء
-- ==============================================

-- Users table indexes
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_active ON public.users(is_active);
CREATE INDEX idx_users_created_at ON public.users(created_at);

-- Plumbers table indexes
CREATE INDEX idx_plumbers_approved ON public.plumbers(is_approved);
CREATE INDEX idx_plumbers_available ON public.plumbers(is_available);
CREATE INDEX idx_plumbers_rating ON public.plumbers(rating DESC);
CREATE INDEX idx_plumbers_working_areas ON public.plumbers USING GIN(working_areas);
CREATE INDEX idx_plumbers_specialties ON public.plumbers USING GIN(specialties);

-- Reports table indexes
CREATE INDEX idx_reports_status ON public.reports(status);
CREATE INDEX idx_reports_approved ON public.reports(is_approved);
CREATE INDEX idx_reports_priority ON public.reports(priority);
CREATE INDEX idx_reports_location ON public.reports(location_lat, location_lng);
CREATE INDEX idx_reports_reporter ON public.reports(reporter_id);
CREATE INDEX idx_reports_created_at ON public.reports(created_at DESC);
CREATE INDEX idx_reports_category ON public.reports(category);
CREATE INDEX idx_reports_assigned_plumber ON public.reports(assigned_plumber_id);

-- News table indexes
CREATE INDEX idx_news_status ON public.news(status);
CREATE INDEX idx_news_published ON public.news(is_published);
CREATE INDEX idx_news_category ON public.news(category);
CREATE INDEX idx_news_author ON public.news(author_id);
CREATE INDEX idx_news_created_at ON public.news(created_at DESC);
CREATE INDEX idx_news_published_at ON public.news(published_at DESC);
CREATE INDEX idx_news_tags ON public.news USING GIN(tags);

-- User profiles table indexes
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_user_profiles_last_active ON public.user_profiles(last_active);
CREATE INDEX idx_user_profiles_subscription ON public.user_profiles(subscription_type);

-- Admin users table indexes
CREATE INDEX idx_admin_users_level ON public.admin_users(admin_level);
CREATE INDEX idx_admin_users_active ON public.admin_users(is_active);

-- ==============================================
-- إنشاء الدوال المساعدة (Helper Functions)
-- ==============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into users table
  INSERT INTO public.users (id, email, display_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  
  -- Insert into user_profiles table
  INSERT INTO public.user_profiles (id, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  
  -- If user is a plumber, insert into plumbers table
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'user') = 'plumber' THEN
    INSERT INTO public.plumbers (id, experience, specialties, working_areas)
    VALUES (
      NEW.id,
      COALESCE((NEW.raw_user_meta_data->>'experience')::integer, 0),
      COALESCE(
        ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data->'specialties')),
        '{}'
      ),
      COALESCE(
        ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data->'working_areas')),
        '{}'
      )
    );
  END IF;
  
  -- If user is an admin, insert into admin_users table
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'user') = 'admin' THEN
    INSERT INTO public.admin_users (id, admin_level)
    VALUES (NEW.id, 'admin');
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Function to generate API key
CREATE OR REPLACE FUNCTION public.generate_api_key()
RETURNS TEXT AS $$
BEGIN
  RETURN 'wg_' || encode(gen_random_bytes(32), 'hex');
END;
$$ language 'plpgsql';

-- ==============================================
-- إنشاء المشغلات (Triggers)
-- ==============================================

-- Triggers for updated_at timestamps
CREATE TRIGGER set_timestamp_users BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER set_timestamp_plumbers BEFORE UPDATE ON public.plumbers FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER set_timestamp_reports BEFORE UPDATE ON public.reports FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER set_timestamp_news BEFORE UPDATE ON public.news FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER set_timestamp_user_profiles BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER set_timestamp_admin_users BEFORE UPDATE ON public.admin_users FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Trigger for handling new user registration
CREATE TRIGGER handle_new_user_trigger AFTER INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==============================================
-- إعداد Row Level Security (RLS)
-- ==============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plumbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all users" ON public.users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for plumbers table
CREATE POLICY "Plumbers can view their own data" ON public.plumbers
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Plumbers can update their own data" ON public.plumbers
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view approved plumbers" ON public.plumbers
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Admins can manage all plumbers" ON public.plumbers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for reports table
CREATE POLICY "Users can create reports" ON public.reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view their own reports" ON public.reports
  FOR SELECT USING (auth.uid() = reporter_id);

CREATE POLICY "Everyone can view approved reports" ON public.reports
  FOR SELECT USING (is_approved = true AND status = 'approved');

CREATE POLICY "Admins can manage all reports" ON public.reports
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Plumbers can view assigned reports" ON public.reports
  FOR SELECT USING (
    assigned_plumber_id = auth.uid() OR
    (is_approved = true AND status IN ('approved', 'in_progress'))
  );

-- RLS Policies for news table
CREATE POLICY "Users can create news" ON public.news
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can view their own news" ON public.news
  FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY "Everyone can view published news" ON public.news
  FOR SELECT USING (is_published = true AND status = 'approved');

CREATE POLICY "Admins can manage all news" ON public.news
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for user_profiles table
CREATE POLICY "Users can manage their own profile" ON public.user_profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid() AND up.role = 'admin'
    )
  );

-- RLS Policies for admin_users table
CREATE POLICY "Only super admins can manage admin users" ON public.admin_users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE id = auth.uid() AND admin_level = 'super_admin'
    )
  );

CREATE POLICY "Admins can view their own admin data" ON public.admin_users
  FOR SELECT USING (auth.uid() = id);

-- ==============================================
-- إنشاء Storage Buckets والسياسات
-- ==============================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('avatars', 'avatars', true, 5242880, '{"image/jpeg", "image/png", "image/webp", "image/gif"}'),
  ('reports', 'reports', true, 10485760, '{"image/jpeg", "image/png", "image/webp", "image/gif"}'),
  ('news', 'news', true, 10485760, '{"image/jpeg", "image/png", "image/webp", "image/gif"}'),
  ('licenses', 'licenses', false, 5242880, '{"image/jpeg", "image/png", "image/pdf"}')
ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own avatar" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for reports
CREATE POLICY "Report images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'reports');

CREATE POLICY "Users can upload report images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'reports' AND auth.role() = 'authenticated');

-- Storage policies for news
CREATE POLICY "News images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'news');

CREATE POLICY "Users can upload news images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'news' AND auth.role() = 'authenticated');

-- Storage policies for licenses (private)
CREATE POLICY "Only plumbers can access their licenses" ON storage.objects
  FOR ALL USING (
    bucket_id = 'licenses' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- ==============================================
-- إدراج بيانات تجريبية (Optional)
-- ==============================================

-- Insert sample admin user (will be created when first admin signs up)
-- The trigger will handle the insertion automatically

-- ==============================================
-- منح الصلاحيات اللازمة
-- ==============================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Grant storage permissions
GRANT ALL ON storage.objects TO anon, authenticated;
GRANT ALL ON storage.buckets TO anon, authenticated;

-- ==============================================
-- النهاية - Database Schema Complete
-- ==============================================

-- Verify tables were created successfully
SELECT 
  schemaname,
  tablename,
  tableowner,
  tablespace
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;