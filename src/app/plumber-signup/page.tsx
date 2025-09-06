"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PlumberSignupPage() {
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
    phoneNumber: "",
    experience: 0,
    specialties: [] as string[],
    workingAreas: [] as string[],
    certifications: [] as string[],
    isAvailable: true,
    location: { lat: 30.9706, lng: 31.1669 } // المحلة الكبرى - الإحداثيات الصحيحة
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { registerPlumber } = useAuth();
  const router = useRouter();

  const specialtyOptions = [
    "إصلاح الأنابيب",
    "تركيب السخانات",
    "إصلاح الحنفيات",
    "تسليك المجاري",
    "تركيب المواسير",
    "إصلاح خزانات المياه",
    "تركيب المضخات",
    "صيانة الحمامات",
    "إصلاح التسريبات",
    "تركيب الفلاتر"
  ];

  const areaOptions = [
    "حي أول المحلة - المنشية القديمة",
    "حي أول المحلة - أبو شاهين", 
    "حي أول المحلة - سوق اللبن",
    "حي أول المحلة - منطقة 6 أكتوبر",
    "حي أول المحلة - منشية السلام",
    "حي أول المحلة - منطقة الجمهورية",
    "حي أول المحلة - أبو راضي",
    "حي أول المحلة - محب وشكري القوتلي",
    "حي ثاني المحلة - السبع بنات",
    "حي ثاني المحلة - منشية الزهراء",
    "حي ثاني المحلة - منشية البكري",
    "حي ثاني المحلة - المستعمرة",
    "حي ثاني المحلة - الرجبى",
    "حي ثاني المحلة - المنشية الجديدة",
    "حي ثاني المحلة - صندفا",
    "حي ثاني المحلة - الوراقة",
    "المنطقة الصناعية",
    "منشية مبارك",
    "منشية النصر",
    "منشية السادات",
    "الدلتا",
    "محلة البرج",
    "أبو دراع",
    "السكة الوسطى"
  ];

  const handleSpecialtyChange = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const handleAreaChange = (area: string) => {
    setFormData(prev => ({
      ...prev,
      workingAreas: prev.workingAreas.includes(area)
        ? prev.workingAreas.filter(a => a !== area)
        : [...prev.workingAreas, area]
    }));
  };

  const handleCertificationAdd = (certification: string) => {
    if (certification.trim() && !formData.certifications.includes(certification.trim())) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, certification.trim()]
      }));
    }
  };

  const removeCertification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (formData.specialties.length === 0) {
        throw new Error("يرجى اختيار تخصص واحد على الأقل");
      }
      
      if (formData.workingAreas.length === 0) {
        throw new Error("يرجى اختيار منطقة عمل واحدة على الأقل");
      }

      await registerPlumber(
        formData.email,
        formData.password,
        formData.displayName,
        formData.phoneNumber,
        formData.experience,
        formData.specialties,
        formData.workingAreas
      );
      
      // رفع الصورة الشخصية إذا تم اختيارها
      if (profileImage) {
        // سيتم رفع الصورة بعد إنشاء الحساب
      }
      
      alert("تم تسجيل طلبك بنجاح! سيتم مراجعة طلبك من قبل الإدارة وستصلك رسالة تأكيد عبر البريد الإلكتروني.");
      router.push('/login');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "حدث خطأ";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">تسجيل سباك</h1>
          <p className="text-gray-600 mb-6 text-center">
            املأ البيانات المطلوبة وسيتم مراجعة طلبك من قبل الإدارة
          </p>

          <form onSubmit={onSubmit} className="space-y-6">
            {/* البيانات الأساسية */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4">البيانات الأساسية</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="display-name" className="block mb-2 font-medium">الاسم الكامل *</label>
                  <input
                    id="display-name"
                    type="text"
                    title="أدخل اسمك الكامل"
                    placeholder="الاسم كما في الهوية"
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.displayName}
                    onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone-number" className="block mb-2 font-medium">رقم الهاتف *</label>
                  <input
                    id="phone-number"
                    type="tel"
                    dir="ltr"
                    title="أدخل رقم الهاتف المصري"
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="01012345678"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block mb-2 font-medium">البريد الإلكتروني *</label>
                  <input
                    id="email"
                    type="email"
                    dir="ltr"
                    title="أدخل البريد الإلكتروني"
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block mb-2 font-medium">كلمة المرور *</label>
                  <input
                    id="password"
                    type="password"
                    dir="ltr"
                    title="أدخل كلمة مرور قوية"
                    placeholder="••••••••"
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                </div>
              </div>
            </div>

            {/* الخبرة والتخصصات */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4">الخبرة والتخصصات</h2>
              <div className="mb-4">
                <label htmlFor="experience" className="block mb-2 font-medium">سنوات الخبرة *</label>
                <select
                  id="experience"
                  title="اختر سنوات خبرتك"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: parseInt(e.target.value)})}
                  required
                >
                  <option value={0}>اختر سنوات الخبرة</option>
                  <option value={1}>سنة واحدة</option>
                  <option value={2}>سنتان</option>
                  <option value={3}>3 سنوات</option>
                  <option value={4}>4 سنوات</option>
                  <option value={5}>5 سنوات</option>
                  <option value={10}>10 سنوات أو أكثر</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-medium">التخصصات * (اختر واحد أو أكثر)</label>
                <div className="grid md:grid-cols-2 gap-2">
                  {specialtyOptions.map(specialty => (
                    <label key={specialty} className="flex items-center space-x-2 space-x-reverse">
                      <input
                        type="checkbox"
                        checked={formData.specialties.includes(specialty)}
                        onChange={() => handleSpecialtyChange(specialty)}
                        className="rounded"
                      />
                      <span>{specialty}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* مناطق العمل */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4">مناطق العمل</h2>
              <div className="grid md:grid-cols-2 gap-2">
                {areaOptions.map(area => (
                  <label key={area} className="flex items-center space-x-2 space-x-reverse">
                    <input
                      type="checkbox"
                      checked={formData.workingAreas.includes(area)}
                      onChange={() => handleAreaChange(area)}
                      className="rounded"
                    />
                    <span>{area}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* الشهادات */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4">الشهادات (اختياري)</h2>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="أضف شهادة"
                  className="flex-1 border rounded-lg px-3 py-2"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleCertificationAdd(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    handleCertificationAdd(input.value);
                    input.value = '';
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  إضافة
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.certifications.map((cert, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {cert}
                    <button
                      type="button"
                      onClick={() => removeCertification(index)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* الصورة الشخصية */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4">الصورة الشخصية (اختياري)</h2>
              <label htmlFor="profile-image" className="block mb-2 font-medium">اختر صورة شخصية</label>
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                title="اختر صورة شخصية"
                placeholder="لا يوجد ملف محدد"
                onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white rounded-lg py-3 font-semibold disabled:opacity-50 hover:bg-blue-700"
              >
                {loading ? "جاري التسجيل..." : "تسجيل طلب"}
              </button>
              <Link 
                href="/login"
                className="flex-1 bg-gray-500 text-white rounded-lg py-3 font-semibold text-center hover:bg-gray-600"
              >
                لديك حساب؟ تسجيل الدخول
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}