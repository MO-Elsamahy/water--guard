"use client";
import { useEffect, useState } from "react";
import { plumberService, type PlumberProfile } from "@/lib/supabase-services-v2";

export default function PlumbersPage() {
  const [plumbers, setPlumbers] = useState<PlumberProfile[]>([]);
  const [filteredPlumbers, setFilteredPlumbers] = useState<PlumberProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

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

  useEffect(() => {
    loadPlumbers();
  }, []);

  useEffect(() => {
    filterPlumbers();
  }, [plumbers, searchText, selectedArea, selectedSpecialty, showAvailableOnly]);

  const loadPlumbers = async () => {
    try {
      setLoading(true);
      const data = await plumberService.getApprovedPlumbers();
      setPlumbers(data);
    } catch (error) {
      console.error('خطأ في تحميل السباكين:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPlumbers = () => {
    let filtered = plumbers;

    // تصفية بالنص
    if (searchText) {
      filtered = filtered.filter(p =>
        p.user?.display_name.toLowerCase().includes(searchText.toLowerCase()) ||
        p.specialties.some(s => s.toLowerCase().includes(searchText.toLowerCase())) ||
        p.working_areas.some(a => a.toLowerCase().includes(searchText.toLowerCase()))
      );
    }

    // تصفية بالمنطقة
    if (selectedArea) {
      filtered = filtered.filter(p => p.working_areas.includes(selectedArea));
    }

    // تصفية بالتخصص
    if (selectedSpecialty) {
      filtered = filtered.filter(p => p.specialties.includes(selectedSpecialty));
    }

    // تصفية بالمتاحين فقط
    if (showAvailableOnly) {
      filtered = filtered.filter(p => p.is_available);
    }

    setFilteredPlumbers(filtered);
  };

  const getRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <span key={i} className="text-yellow-400">★</span>
        ))}
        {hasHalfStar && <span className="text-yellow-400">☆</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={i} className="text-gray-300">★</span>
        ))}
        <span className="text-sm text-gray-600 mr-1">({rating})</span>
      </div>
    );
  };

  if (loading) {
    return (
      <main className="p-4">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2">جاري تحميل السباكين...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">دليل السباكين المعتمدين</h1>
          <p className="text-gray-600">اعثر على أفضل السباكين في مدينة المحلة الكبرى</p>
        </div>

        {/* فلاتر البحث */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">البحث</label>
              <input
                type="text"
                placeholder="ابحث بالاسم أو التخصص"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            
                         <div>
               <label htmlFor="area-select" className="block text-sm font-medium mb-2">المنطقة</label>
               <select
                 id="area-select"
                 title="اختر المنطقة"
                 className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                 value={selectedArea}
                 onChange={(e) => setSelectedArea(e.target.value)}
               >
                 <option value="">جميع المناطق</option>
                 {areaOptions.map(area => (
                   <option key={area} value={area}>{area}</option>
                 ))}
               </select>
             </div>

             <div>
               <label htmlFor="specialty-select" className="block text-sm font-medium mb-2">التخصص</label>
               <select
                 id="specialty-select"
                 title="اختر التخصص"
                 className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                 value={selectedSpecialty}
                 onChange={(e) => setSelectedSpecialty(e.target.value)}
               >
                 <option value="">جميع التخصصات</option>
                 {specialtyOptions.map(specialty => (
                   <option key={specialty} value={specialty}>{specialty}</option>
                 ))}
               </select>
             </div>

            <div className="flex items-center">
              <label className="flex items-center space-x-2 space-x-reverse">
                <input
                  type="checkbox"
                  checked={showAvailableOnly}
                  onChange={(e) => setShowAvailableOnly(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">المتاحون فقط</span>
              </label>
            </div>
          </div>
        </div>

        {/* عرض النتائج */}
        <div className="mb-4">
          <p className="text-gray-600">
            {filteredPlumbers.length} سباك من أصل {plumbers.length}
          </p>
        </div>

        {/* قائمة السباكين */}
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
           {filteredPlumbers.map((plumber) => (
             <div key={plumber.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
               {plumber.user?.profile_image_url && (
                 <img 
                   src={plumber.user.profile_image_url} 
                   alt={plumber.user.display_name}
                   className="w-full h-48 object-cover"
                 />
               )}
               
               <div className="p-4">
                 <div className="flex justify-between items-start mb-2">
                   <h3 className="text-xl font-semibold">{plumber.user?.display_name}</h3>
                   <span className={`px-2 py-1 rounded-full text-xs ${
                     plumber.is_available 
                       ? 'bg-green-100 text-green-800' 
                       : 'bg-red-100 text-red-800'
                   }`}>
                     {plumber.is_available ? 'متاح' : 'غير متاح'}
                   </span>
                 </div>

                 <div className="mb-2">
                   {getRatingStars(plumber.rating)}
                   <span className="text-sm text-gray-600">({plumber.completed_jobs} عمل مكتمل)</span>
                 </div>

                <p className="text-gray-600 text-sm mb-2">
                  خبرة: {plumber.experience} سنة
                </p>

                <div className="mb-3">
                  <p className="text-sm font-medium mb-1">التخصصات:</p>
                  <div className="flex flex-wrap gap-1">
                    {plumber.specialties.slice(0, 3).map((specialty, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {specialty}
                      </span>
                    ))}
                    {plumber.specialties.length > 3 && (
                      <span className="text-xs text-gray-500">+{plumber.specialties.length - 3}</span>
                    )}
                  </div>
                </div>

                                 <div className="mb-4">
                   <p className="text-sm font-medium mb-1">مناطق العمل:</p>
                   <p className="text-sm text-gray-600">
                     {plumber.working_areas.slice(0, 2).join(', ')}
                     {plumber.working_areas.length > 2 && '...'}
                   </p>
                 </div>

                 <div className="flex gap-2">
                   <a 
                     href={`tel:${plumber.user?.phone_number}`}
                     className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors"
                   >
                     اتصال
                   </a>
                   <a 
                     href={`https://wa.me/${plumber.user?.phone_number?.replace(/\D/g, '')}`}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="flex-1 bg-green-600 text-white text-center py-2 rounded-lg hover:bg-green-700 transition-colors"
                   >
                     واتساب
                   </a>
                 </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPlumbers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد نتائج</h3>
            <p className="text-gray-500">جرب تغيير معايير البحث</p>
          </div>
        )}
      </div>
    </main>
  );
}


