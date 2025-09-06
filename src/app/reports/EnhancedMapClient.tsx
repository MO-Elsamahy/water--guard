"use client";
import { MapContainer, TileLayer, Marker, useMapEvents, Popup, LayersControl, Circle } from "react-leaflet";
import type { CSSProperties, ComponentType } from "react";
import { useCallback, useEffect, useState } from "react";
import { Report } from "@/lib/types";
import L from "leaflet";

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
  [30.9300, 31.1300], // جنوب غرب - حدود موسعة للتأكد من التغطية الكاملة
  [31.0200, 31.2000]  // شمال شرق - تغطي جميع أحياء المدينة
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
    animation: pulse 2s infinite;
  ">📍</div>
  <style>
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
  </style>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

export default function EnhancedMapClient({ center, zoom, style, position, onPick, approvedReports = [] }: Props) {
  const AnyMap = MapContainer as unknown as ComponentType<Record<string, unknown>>;
  const AnyMarker = Marker as unknown as ComponentType<Record<string, unknown>>;
  const AnyTile = TileLayer as unknown as ComponentType<Record<string, unknown>>;
  const AnyPopup = Popup as unknown as ComponentType<Record<string, unknown>>;
  const AnyLayersControl = LayersControl as unknown as ComponentType<Record<string, unknown>>;
  const AnyBaseLayer = LayersControl.BaseLayer as unknown as ComponentType<Record<string, unknown>>;
  const AnyCircle = Circle as unknown as ComponentType<Record<string, unknown>>;

  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  
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
        setUserLocation([lat, lng]);
        
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
  }, [handlePick]);

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <AnyMap 
        center={center as unknown} 
        zoom={zoom as unknown} 
        style={style as unknown}
        maxBounds={mahallaBounds as unknown}
        maxBoundsViscosity={0.8}
        zoomControl={true}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        touchZoom={true}
        boxZoom={true}
        keyboard={true}
      >
        <AnyLayersControl position="topright">
          {/* طبقات الخرائط المختلفة - مجانية */}
          <AnyBaseLayer checked name="الخريطة الأساسية">
            <AnyTile 
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              maxZoom={19}
            />
          </AnyBaseLayer>
          
          <AnyBaseLayer name="خريطة مفصلة">
            <AnyTile 
              url="https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap France'
              maxZoom={20}
            />
          </AnyBaseLayer>
          
          <AnyBaseLayer name="خريطة الطرق">
            <AnyTile 
              url="https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap Deutschland'
              maxZoom={18}
            />
          </AnyBaseLayer>
        </AnyLayersControl>

        <LocationPicker onPick={handlePick} />
        
        {/* عرض التقارير المعتمدة */}
        {approvedReports.map((report) => (
          <AnyMarker
            key={report.id}
            position={[report.location.lat, report.location.lng] as unknown}
            icon={createReportIcon(report.priority) as unknown}
          >
            <AnyPopup>
              <div className="min-w-64 max-w-sm" dir="rtl">
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
            </AnyPopup>
          </AnyMarker>
        ))}
        
        {/* الموقع المحدد الجديد */}
        {position && (
          <AnyMarker
            position={position as unknown}
            icon={newLocationIcon as unknown}
            draggable={true as unknown}
            eventHandlers={{
              dragend: (e: { target?: { getLatLng?: () => { lat: number; lng: number } } }) => {
                const m = e?.target?.getLatLng?.();
                if (!m) return;
                handlePick(m.lat, m.lng);
              },
            } as unknown}
          >
            <AnyPopup>
              <div className="text-center" dir="rtl">
                <p className="font-semibold text-blue-800">الموقع المحدد</p>
                <p className="text-sm text-gray-600">يمكنك سحب العلامة لتغيير الموقع</p>
                <p className="text-xs text-gray-500 mt-1">
                  {position[0].toFixed(6)}, {position[1].toFixed(6)}
                </p>
              </div>
            </AnyPopup>
          </AnyMarker>
        )}

        {/* دائرة حول موقع المستخدم إذا كان متاحاً */}
        {userLocation && (
          <AnyCircle
            center={userLocation as unknown}
            radius={100}
            pathOptions={{ 
              color: '#3B82F6', 
              fillColor: '#3B82F6', 
              fillOpacity: 0.1 
            } as unknown}
          />
        )}
      </AnyMap>
      
      {/* أزرار التحكم */}
      <div style={{ position: "absolute", top: "12px", right: "12px", zIndex: 1000 }}>
        <button
          type="button"
          onClick={locateUser}
          className="bg-blue-600 text-white rounded-lg px-3 py-2 shadow-lg hover:bg-blue-700 transition-colors mb-2 block text-sm"
        >
          📍 تحديد موقعي
        </button>
      </div>
    </div>
  );
}
