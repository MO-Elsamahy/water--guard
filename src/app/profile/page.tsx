"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContextV2";
import { userService, type User, type UserProfile } from "@/lib/supabase-services-v2";
import { UserIcon, PhoneIcon, EmailIcon, LocationIcon, WebsiteIcon } from "@/components/icons/ProfessionalIcons";
import Image from "next/image";

export default function ProfilePage() {
  const { user: authUser, userProfile: currentUserProfile, profile: currentProfile } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);

  const [formData, setFormData] = useState({
    display_name: '',
    phone_number: '',
    bio: '',
    location: '',
    website: ''
  });

  useEffect(() => {
    if (authUser) {
      loadProfile();
    }
  }, [authUser]);

  const loadProfile = async () => {
    if (!authUser) return;
    
    try {
      setLoading(true);
      const profileData = await userService.getUserProfile(authUser.id);
      
      if (profileData) {
        setUser(profileData.user);
        setProfile(profileData.profile);
        setFormData({
          display_name: profileData.user.display_name || '',
          phone_number: profileData.user.phone_number || '',
          bio: profileData.profile?.bio || '',
          location: profileData.profile?.location || '',
          website: profileData.profile?.website || ''
        });
      }
    } catch (error) {
      console.error('خطأ في تحميل الملف الشخصي:', error);
      setMessage('حدث خطأ في تحميل الملف الشخصي');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser) return;

    setSaving(true);
    setMessage(null);

    try {
      // تحديث بيانات المستخدم الأساسية
      const userUpdated = await userService.updateUserProfile(authUser.id, {
        display_name: formData.display_name,
        phone_number: formData.phone_number
      });

      // تحديث الملف الشخصي الإضافي
      const profileUpdated = await userService.updateProfile(authUser.id, {
        bio: formData.bio,
        location: formData.location,
        website: formData.website
      });

      if (userUpdated && profileUpdated) {
        setMessage('تم حفظ التغييرات بنجاح!');
        await loadProfile(); // إعادة تحميل البيانات
      } else {
        setMessage('حدث خطأ في حفظ التغييرات');
      }
    } catch (error) {
      console.error('خطأ في حفظ الملف الشخصي:', error);
      setMessage('حدث خطأ في حفظ التغييرات');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !authUser) return;

    const file = e.target.files[0];
    
    // التحقق من نوع الملف
    if (!file.type.startsWith('image/')) {
      setMessage('يرجى اختيار ملف صورة صالح');
      return;
    }

    // التحقق من حجم الملف (أقل من 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
      return;
    }

    setImageUploading(true);
    setMessage(null);

    try {
      const imageUrl = await userService.uploadProfileImage(authUser.id, file);
      if (imageUrl) {
        setMessage('تم رفع الصورة بنجاح!');
        await loadProfile(); // إعادة تحميل البيانات
      } else {
        setMessage('حدث خطأ في رفع الصورة');
      }
    } catch (error) {
      console.error('خطأ في رفع الصورة:', error);
      setMessage('حدث خطأ في رفع الصورة');
    } finally {
      setImageUploading(false);
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'user': return 'مستخدم';
      case 'plumber': return 'سباك';
      case 'admin': return 'مدير';
      default: return 'مستخدم';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'user': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'plumber': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'admin': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen gradient-bg">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
              <p className="text-secondary font-medium">جاري تحميل الملف الشخصي...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!authUser || !user) {
    return (
      <main className="min-h-screen gradient-bg">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-secondary">يرجى تسجيل الدخول لعرض الملف الشخصي</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen gradient-bg">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <div className="flex items-center justify-center mb-6">
            <UserIcon size={48} className="ml-4" />
            <h1 className="heading-1 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              الملف الشخصي
            </h1>
          </div>
          <p className="text-secondary text-lg">إدارة بياناتك الشخصية وإعداداتك</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* بطاقة الملف الشخصي */}
          <div className="lg:col-span-1">
            <div className="card text-center animate-slideIn">
              <div className="mb-6">
                <div className="relative inline-block">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                    {user.profile_image_url ? (
                      <Image
                        src={user.profile_image_url}
                        alt="صورة الملف الشخصي"
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <UserIcon size={64} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  {/* زر تحديث الصورة */}
                  <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer transition-colors duration-200">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={imageUploading}
                    />
                    {imageUploading ? (
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    ) : (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                    )}
                  </label>
                </div>

                <h2 className="heading-2 mb-2">{user.display_name}</h2>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(user.role)}`}>
                  {getRoleText(user.role)}
                </span>
                
                {user.phone_number && (
                  <div className="flex items-center justify-center mt-4 text-secondary">
                    <PhoneIcon size={16} className="ml-2" />
                    <span dir="ltr">{user.phone_number}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-center mt-2 text-secondary">
                  <EmailIcon size={16} className="ml-2" />
                  <span dir="ltr">{user.email}</span>
                </div>
              </div>

              {profile?.bio && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <p className="text-secondary text-sm">{profile.bio}</p>
                </div>
              )}

              <div className="mt-4 space-y-2">
                {profile?.location && (
                  <div className="flex items-center justify-center text-secondary text-sm">
                    <LocationIcon size={14} className="ml-2" />
                    <span>{profile.location}</span>
                  </div>
                )}
                
                {profile?.website && (
                  <div className="flex items-center justify-center text-secondary text-sm">
                    <WebsiteIcon size={14} className="ml-2" />
                    <a 
                      href={profile.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      {profile.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* نموذج تحديث البيانات */}
          <div className="lg:col-span-2">
            <div className="card animate-slideIn" style={{animationDelay: '0.2s'}}>
              <h3 className="heading-3 mb-6">تحديث البيانات الشخصية</h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* الاسم */}
                <div>
                  <label className="label">
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={formData.display_name}
                    onChange={(e) => setFormData({...formData, display_name: e.target.value})}
                    required
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>

                {/* رقم الهاتف */}
                <div>
                  <label className="label">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    dir="ltr"
                    className="input"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                    placeholder="01012345678"
                  />
                </div>

                {/* النبذة التعريفية */}
                <div>
                  <label className="label">
                    نبذة تعريفية
                  </label>
                  <textarea
                    className="input min-h-[100px] resize-y"
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    placeholder="اكتب نبذة مختصرة عن نفسك..."
                  />
                </div>

                {/* الموقع */}
                <div>
                  <label className="label">
                    الموقع
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="مثال: المحلة الكبرى، الغربية"
                  />
                </div>

                {/* الموقع الإلكتروني */}
                <div>
                  <label className="label">
                    الموقع الإلكتروني
                  </label>
                  <input
                    type="url"
                    dir="ltr"
                    className="input"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                    placeholder="https://example.com"
                  />
                </div>

                {/* رسالة النتيجة */}
                {message && (
                  <div className={`alert ${
                    message.includes('بنجاح') ? 'alert-success' : 'alert-error'
                  } animate-fadeIn`}>
                    <div className="flex items-center">
                      <span className="text-xl ml-3">
                        {message.includes('بنجاح') ? '✅' : '❌'}
                      </span>
                      <span>{message}</span>
                    </div>
                  </div>
                )}

                {/* زر الحفظ */}
                <button
                  type="submit"
                  disabled={saving}
                  className={`btn btn-primary w-full ${
                    saving ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
                  } transition-all duration-300`}
                >
                  {saving ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent ml-2"></div>
                      جاري الحفظ...
                    </div>
                  ) : (
                    'حفظ التغييرات'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
