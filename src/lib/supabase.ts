import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase Environment Variables:');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl);
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'SET' : 'NOT SET');
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database types
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          display_name: string;
          phone_number: string | null;
          role: 'user' | 'plumber' | 'admin';
          is_active: boolean;
          profile_image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name: string;
          phone_number?: string | null;
          role?: 'user' | 'plumber' | 'admin';
          is_active?: boolean;
          profile_image_url?: string | null;
        };
        Update: {
          display_name?: string;
          phone_number?: string | null;
          profile_image_url?: string | null;
          is_active?: boolean;
        };
      };
      plumbers: {
        Row: {
          id: string;
          experience: number;
          specialties: string[];
          working_areas: string[];
          is_available: boolean;
          is_approved: boolean;
          rating: number;
          completed_jobs: number;
          license_number: string | null;
          license_image_url: string | null;
          description: string | null;
          hourly_rate: number | null;
          approved_at: string | null;
          approved_by: string | null;
        };
        Insert: {
          id: string;
          experience: number;
          specialties: string[];
          working_areas: string[];
          license_number?: string | null;
          description?: string | null;
          hourly_rate?: number | null;
        };
        Update: {
          experience?: number;
          specialties?: string[];
          working_areas?: string[];
          is_available?: boolean;
          license_number?: string | null;
          description?: string | null;
          hourly_rate?: number | null;
        };
      };
      reports: {
        Row: {
          id: string;
          title: string;
          description: string;
          reporter_id: string;
          reporter_name: string;
          reporter_phone: string;
          location_lat: number | null;
          location_lng: number | null;
          location_address: string | null;
          area: string | null;
          priority: 'low' | 'medium' | 'high' | 'urgent';
          status: 'pending' | 'approved' | 'rejected' | 'resolved';
          images: string[];
          is_approved: boolean;
          approved_at: string | null;
          approved_by: string | null;
          rejection_reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          description: string;
          reporter_id: string;
          reporter_name: string;
          reporter_phone: string;
          location_lat?: number | null;
          location_lng?: number | null;
          location_address?: string | null;
          area?: string | null;
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          images?: string[];
        };
        Update: {
          title?: string;
          description?: string;
          location_lat?: number | null;
          location_lng?: number | null;
          location_address?: string | null;
          area?: string | null;
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          images?: string[];
        };
      };
      news: {
        Row: {
          id: string;
          title: string;
          content: string;
          category: string;
          author_id: string;
          author_name: string;
          images: string[];
          is_published: boolean;
          published_at: string | null;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          content: string;
          category: string;
          author_id: string;
          author_name: string;
          images?: string[];
          tags?: string[];
        };
        Update: {
          title?: string;
          content?: string;
          category?: string;
          images?: string[];
          is_published?: boolean;
          tags?: string[];
        };
      };
    };
  };
};

// Helper functions
export const uploadFile = async (
  bucket: string,
  path: string,
  file: File
): Promise<string | null> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    return null;
  }
};

export const deleteFile = async (
  bucket: string,
  path: string
): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

// Real-time subscriptions helper
export const subscribeToTable = (
  table: keyof Database['public']['Tables'],
  callback: (payload: any) => void,
  filter?: string
) => {
  const subscription = supabase
    .channel(`public:${table}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: table,
        filter: filter
      },
      callback
    )
    .subscribe();

  return subscription;
};
