"use client";
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from "react-leaflet";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useState } from "react";
import { Report } from "@/lib/types";
import L from "leaflet";

// إصلاح أيقونات Leaflet الافتراضية
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

type Props = {
  center: [number, number];
  zoom: number;
  style?: CSSProperties;
  position: [number, number] | null;
  onPick: (lat: number, lng: number) => void;
  approvedReports?: Report[];
};

type LeafletClickEvent = { latlng: { lat: number; lng: number } };

function LocationPicker({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e: LeafletClickEvent) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// حدود المحلة الكبرى الحقيقية - محدثة للدقة العالية
const mahallaBounds: [[number, number], [number, number]] = [
  [30.9300, 31.1300], // جنوب غرب
  [31.0200, 31.2000]  // شمال شرق
];

function isInsideBounds(lat: number, lng: number): boolean {
  const [[south, west], [north, east]] = mahallaBounds;
  return lat >= south && lat <= north && lng >= west && lng <= east;
}

// أيقونات مخصصة للتقارير
const createReportIcon = (priority: string) => {
  const colors = {
    low: '#10B981',      // أخضر
    medium: '#F59E0B',   // أصفر
    high: '#EF4444',     // أحمر
    urgent: '#DC2626'    // أحمر داكن
  };
  
  return L.divIcon({
    className: 'custom-report-marker',
    html: `<div style="
      background-color: ${colors[priority as keyof typeof colors] || colors.medium};
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 12px;
      font-weight: bold;
    ">!</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

// أيقونة للموقع المحدد الجديد
const newLocationIcon = L.divIcon({
  className: 'custom-new-location-marker',
  html: `<div style="
    background-color: #3B82F6;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 16px;
    font-weight: bold;
  ">📍</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

export default function FixedMapClient({ center, zoom, style, position, onPick, approvedReports = [] }: Props) {
  const [map, setMap] = useState<L.Map | null>(null);
  
  const handlePick = useCallback((lat: number, lng: number) => {
    if (!isInsideBounds(lat, lng)) {
      alert(`النقطة المحددة خارج حدود مدينة المحلة الكبرى

الإحداثيات المحددة: ${lat.toFixed(6)}, ${lng.toFixed(6)}

حدود المحلة الكبرى الصحيحة:
• خط العرض: من 30.9300 إلى 31.0200
• خط الطول: من 31.1300 إلى 31.2000

💡 نصائح لتحديد موقع دقيق:
• استخدم زر "تحديد موقعي" للانتقال لموقعك الحالي
• تأكد من تفعيل GPS في جهازك
• جرب التكبير أكثر لرؤية التفاصيل بوضوح
• ابحث عن معالم مميزة في منطقتك`);
      return;
    }
    onPick(lat, lng);
  }, [onPick]);

  const getPriorityText = (priority: string) => {
    const priorities = {
      low: 'منخفضة',
      medium: 'متوسطة',
      high: 'عالية',
      urgent: 'عاجلة'
    };
    return priorities[priority as keyof typeof priorities] || 'متوسطة';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // تحديد الموقع الحالي
  const locateUser = useCallback(() => {
    if (!navigator.geolocation) {
      alert("المتصفح لا يدعم تحديد الموقع");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        
        if (map) {
          map.setView([lat, lng], 16);
        }
        
        if (isInsideBounds(lat, lng)) {
          handlePick(lat, lng);
        } else {
          alert(`موقعك الحالي خارج حدود المحلة الكبرى
          
الإحداثيات: ${lat.toFixed(6)}, ${lng.toFixed(6)}

يمكنك تحديد موقع آخر داخل المدينة بالنقر على الخريطة.`);
        }
      },
      (error) => {
        console.error("خطأ في تحديد الموقع:", error);
        alert("تعذر تحديد موقعك. تأكد من تفعيل خدمات الموقع في المتصفح.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  }, [map, handlePick]);

  // إعداد الخريطة عند التحميل
  useEffect(() => {
    if (map) {
      // تحديث حجم الخريطة بعد التحميل
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }
  }, [map]);

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%", zIndex: 1 }}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        touchZoom={true}
        boxZoom={true}
        keyboard={true}
        dragging={true}
        zoomControl={true}
        attributionControl={true}
        ref={setMap}
      >
        {/* طبقة الخريطة الأساسية */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={19}
          tileSize={256}
          zoomOffset={0}
        />

        <LocationPicker onPick={handlePick} />
        
        {/* عرض التقارير المعتمدة */}
        {approvedReports.map((report) => (
          <Marker
            key={report.id}
            position={[report.location.lat, report.location.lng]}
            icon={createReportIcon(report.priority)}
          >
            <Popup maxWidth={300} className="custom-popup">
              <div className="min-w-64 max-w-sm" dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>
                <h3 className="font-bold text-lg mb-2 text-blue-800">{report.title}</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>الوصف:</strong> {report.description}</p>
                  <p><strong>الأولوية:</strong> 
                    <span className={`inline-block px-2 py-1 rounded text-xs mr-2 ${
                      report.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                      report.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                      report.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {getPriorityText(report.priority)}
                    </span>
                  </p>
                  <p><strong>المبلغ:</strong> {report.reporterName}</p>
                  <p><strong>الهاتف:</strong> 
                    <a href={`tel:${report.reporterPhone}`} className="text-blue-600 mr-1">
                      {report.reporterPhone}
                    </a>
                  </p>
                  <p><strong>تاريخ البلاغ:</strong> {formatDate(report.createdAt)}</p>
                  {report.images && report.images.length > 0 && (
                    <div>
                      <p><strong>الصور:</strong></p>
                      <div className="flex gap-2 mt-1">
                        {report.images.slice(0, 2).map((img, idx) => (
                          <img 
                            key={idx}
                            src={img} 
                            alt={`صورة ${idx + 1}`}
                            className="w-16 h-16 object-cover rounded cursor-pointer"
                            onClick={() => window.open(img, '_blank')}
                          />
                        ))}
                        {report.images.length > 2 && (
                          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs">
                            +{report.images.length - 2}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* الموقع المحدد الجديد */}
        {position && (
          <Marker
            position={position}
            icon={newLocationIcon}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target;
                const newPos = marker.getLatLng();
                handlePick(newPos.lat, newPos.lng);
              },
            }}
          >
            <Popup>
              <div className="text-center" dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>
                <p className="font-semibold text-blue-800">الموقع المحدد</p>
                <p className="text-sm text-gray-600">يمكنك سحب العلامة لتغيير الموقع</p>
                <p className="text-xs text-gray-500 mt-1">
                  {position[0].toFixed(6)}, {position[1].toFixed(6)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
      
      {/* أزرار التحكم */}
      <div style={{ position: "absolute", top: "12px", right: "12px", zIndex: 1000 }}>
        <button
          type="button"
          onClick={locateUser}
          className="bg-blue-600 text-white rounded-lg px-3 py-2 shadow-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          style={{ fontFamily: 'Cairo, sans-serif' }}
        >
          📍 تحديد موقعي
        </button>
      </div>
    </div>
  );
}
