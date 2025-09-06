"use client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { ReportWithUser } from "@/lib/supabase-services-v2";
import L from "leaflet";

// إصلاح أيقونات Leaflet الافتراضية
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// إنشاء أيقونات مخصصة حسب الأولوية
const createCustomIcon = (priority: string) => {
  let color = '#3B82F6'; // default blue
  
  switch (priority) {
    case 'urgent':
      color = '#EF4444'; // red
      break;
    case 'high':
      color = '#F97316'; // orange
      break;
    case 'medium':
      color = '#EAB308'; // yellow
      break;
    case 'low':
      color = '#22C55E'; // green
      break;
  }

  const svgIcon = `
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="2" dy="2" stdDeviation="2" flood-opacity="0.3"/>
        </filter>
      </defs>
      <path d="M12.5 0C5.6 0 0 5.6 0 12.5C0 19.4 12.5 41 12.5 41S25 19.4 25 12.5C25 5.6 19.4 0 12.5 0Z" 
            fill="${color}" filter="url(#shadow)"/>
      <circle cx="12.5" cy="12.5" r="4" fill="white"/>
      <circle cx="12.5" cy="12.5" r="2" fill="${color}"/>
    </svg>
  `;

  return new L.DivIcon({
    html: svgIcon,
    className: 'custom-marker',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
};

type Props = {
  center: [number, number];
  zoom: number;
  style?: CSSProperties;
  reports: ReportWithUser[];
  onReportSelect: (report: ReportWithUser) => void;
};

// كومبوننت للتحكم في الخريطة
function MapController({ reports, onReportSelect }: { reports: ReportWithUser[]; onReportSelect: (report: ReportWithUser) => void }) {
  const map = useMap();

  useEffect(() => {
    if (reports.length > 0) {
      // إنشاء مجموعة من النقاط لتحديد حدود الخريطة
      const validReports = reports.filter(report => 
        report.location_lat && report.location_lng
      );

      if (validReports.length > 0) {
        const bounds = L.latLngBounds(
          validReports.map(report => [report.location_lat!, report.location_lng!])
        );
        
        // تحديد عرض الخريطة لتشمل جميع النقاط مع هامش
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  }, [map, reports]);

  return null;
}

export default function ReportsMapClient({ center, zoom, style, reports, onReportSelect }: Props) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // محاكاة تحميل الخريطة
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'عاجل جداً';
      case 'high': return 'عالي';
      case 'medium': return 'متوسط';
      case 'low': return 'منخفض';
      default: return priority;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div 
        style={style || { height: '100%', width: '100%' }} 
        className="flex items-center justify-center bg-gray-100 dark:bg-gray-800"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-secondary">جاري تحميل الخريطة...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={style || { height: '100%', width: '100%' }} className="relative">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="dark:hue-rotate-180 dark:invert dark:brightness-95 dark:contrast-90"
        />
        
        <MapController reports={reports} onReportSelect={onReportSelect} />
        
        {reports
          .filter(report => report.location_lat && report.location_lng)
          .map((report) => (
            <Marker
              key={report.id}
              position={[report.location_lat!, report.location_lng!]}
              icon={createCustomIcon(report.priority)}
              eventHandlers={{
                click: () => onReportSelect(report)
              }}
            >
              <Popup>
                <div className="text-right max-w-xs">
                  <h3 className="font-bold text-gray-800 mb-2">{report.title}</h3>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        report.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                        report.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        report.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {getPriorityText(report.priority)}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 line-clamp-2">
                      {report.description.length > 100 
                        ? `${report.description.substring(0, 100)}...` 
                        : report.description
                      }
                    </p>
                    
                    <div className="text-gray-500 text-xs">
                      <p>المبلغ: {report.reporter_name}</p>
                      <p>التاريخ: {formatDate(report.created_at)}</p>
                    </div>
                    
                    {report.location_address && (
                      <p className="text-gray-500 text-xs">
                        📍 {report.location_address}
                      </p>
                    )}
                  </div>
                  
                  <div className="mt-3 pt-2 border-t border-gray-200">
                    <button
                      onClick={() => onReportSelect(report)}
                      className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                    >
                      عرض التفاصيل ←
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
      
      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 z-[1000]">
        <h4 className="font-semibold text-gray-800 dark:text-white mb-2 text-sm">مفتاح الخريطة</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-gray-600 dark:text-gray-300">عاجل جداً</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
            <span className="text-gray-600 dark:text-gray-300">عالي</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-gray-600 dark:text-gray-300">متوسط</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-gray-600 dark:text-gray-300">منخفض</span>
          </div>
        </div>
      </div>
    </div>
  );
}
