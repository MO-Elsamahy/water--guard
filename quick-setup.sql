-- ==============================================
-- Quick Setup for Water Guard Database
-- إعداد سريع لقاعدة البيانات
-- ==============================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clean slate approach - drop everything and recreate
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO anon;
GRANT ALL ON SCHEMA public TO authenticated;

-- ==============================================
-- Create Tables
-- ==============================================

-- Users table (linked to auth.users)
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- User profiles table (for additional user data)
CREATE TABLE public.user_profiles (
  id UUID REFERENCES public.users(id) ON DELETE CASCADE PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'plumber', 'admin')),
  permissions TEXT[] DEFAULT '{}',
  preferences JSONB DEFAULT '{}',
  last_active TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Reports table
CREATE TABLE public.reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  reporter_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
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
  author_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
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
  id UUID REFERENCES public.users(id) ON DELETE CASCADE PRIMARY KEY,
  experience INTEGER NOT NULL DEFAULT 0,
  specialties TEXT[] DEFAULT '{}' NOT NULL,
  working_areas TEXT[] DEFAULT '{}' NOT NULL,
  is_available BOOLEAN DEFAULT true,
  is_approved BOOLEAN DEFAULT false,
  rating DECIMAL(3,2) DEFAULT 0.00,
  completed_jobs INTEGER DEFAULT 0,
  license_number TEXT,
  description TEXT,
  hourly_rate DECIMAL(10,2),
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Admin users table
CREATE TABLE public.admin_users (
  id UUID REFERENCES public.users(id) ON DELETE CASCADE PRIMARY KEY,
  admin_level TEXT NOT NULL DEFAULT 'admin' CHECK (admin_level IN ('admin', 'super_admin')),
  permissions TEXT[] DEFAULT '{}',
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================
-- Create Indexes
-- ==============================================

CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_reports_status ON public.reports(status);
CREATE INDEX idx_reports_approved ON public.reports(is_approved);
CREATE INDEX idx_reports_reporter ON public.reports(reporter_id);
CREATE INDEX idx_news_status ON public.news(status);
CREATE INDEX idx_news_published ON public.news(is_published);
CREATE INDEX idx_plumbers_approved ON public.plumbers(is_approved);

-- ==============================================
-- Create Functions
-- ==============================================

-- Function to update updated_at timestamp
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
  
  -- If plumber, insert into plumbers table
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'user') = 'plumber' THEN
    INSERT INTO public.plumbers (id, experience, specialties, working_areas)
    VALUES (NEW.id, 0, '{}', '{}');
  END IF;
  
  -- If admin, insert into admin_users table
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'user') = 'admin' THEN
    INSERT INTO public.admin_users (id, admin_level)
    VALUES (NEW.id, 'admin');
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- ==============================================
-- Create Triggers
-- ==============================================

CREATE TRIGGER set_timestamp_users BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER set_timestamp_user_profiles BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER set_timestamp_reports BEFORE UPDATE ON public.reports FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER set_timestamp_news BEFORE UPDATE ON public.news FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER set_timestamp_plumbers BEFORE UPDATE ON public.plumbers FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER set_timestamp_admin_users BEFORE UPDATE ON public.admin_users FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER handle_new_user_trigger AFTER INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==============================================
-- Enable RLS and Create Policies
-- ==============================================

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plumbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can manage their own profile" ON public.user_profiles FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can create reports" ON public.reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Users can view their own reports" ON public.reports FOR SELECT USING (auth.uid() = reporter_id);
CREATE POLICY "Everyone can view approved reports" ON public.reports FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can create news" ON public.news FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can view their own news" ON public.news FOR SELECT USING (auth.uid() = author_id);
CREATE POLICY "Everyone can view published news" ON public.news FOR SELECT USING (is_published = true);

CREATE POLICY "Plumbers can view their own data" ON public.plumbers FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can view approved plumbers" ON public.plumbers FOR SELECT USING (is_approved = true);

CREATE POLICY "Admins can view their own data" ON public.admin_users FOR SELECT USING (auth.uid() = id);

-- ==============================================
-- Grant Permissions
-- ==============================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- ==============================================
-- Create Storage Buckets
-- ==============================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('avatars', 'avatars', true, 5242880, '{"image/jpeg", "image/png", "image/webp"}'),
  ('reports', 'reports', true, 10485760, '{"image/jpeg", "image/png", "image/webp"}'),
  ('news', 'news', true, 10485760, '{"image/jpeg", "image/png", "image/webp"}')
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public read access" ON storage.objects FOR SELECT USING (bucket_id IN ('avatars', 'reports', 'news'));
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ==============================================
-- Test the setup
-- ==============================================

SELECT 'Database setup completed successfully!' as status;

-- Show created tables
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
