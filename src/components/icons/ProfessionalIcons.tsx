import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// أيقونة قطرة الماء ثلاثية الأبعاد
export const WaterDropIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <defs>
      <linearGradient id="waterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="50%" stopColor="#1D4ED8" />
        <stop offset="100%" stopColor="#1E40AF" />
      </linearGradient>
      <filter id="waterShadow">
        <feDropShadow dx="2" dy="2" stdDeviation="2" floodOpacity="0.3"/>
      </filter>
    </defs>
    <path
      d="M12 2C12 2 6 8 6 14C6 17.31 8.69 20 12 20S18 17.31 18 14C18 8 12 2 12 2Z"
      fill="url(#waterGradient)"
      filter="url(#waterShadow)"
    />
    <ellipse cx="10" cy="12" rx="2" ry="3" fill="rgba(255,255,255,0.3)" />
  </svg>
);

// أيقونة الخريطة ثلاثية الأبعاد
export const MapIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <defs>
      <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
      <filter id="mapShadow">
        <feDropShadow dx="1" dy="2" stdDeviation="1" floodOpacity="0.4"/>
      </filter>
    </defs>
    <path
      d="M9 2L15 6L21 4V18L15 20L9 16L3 18V4L9 2Z"
      fill="url(#mapGradient)"
      filter="url(#mapShadow)"
    />
    <path d="M9 2V16M15 6V20" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
    <circle cx="12" cy="10" r="2" fill="#EF4444" />
    <circle cx="12" cy="10" r="1" fill="#FFFFFF" />
  </svg>
);

// أيقونة السباك المحترف
export const PlumberIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <defs>
      <linearGradient id="plumberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <filter id="plumberShadow">
        <feDropShadow dx="1" dy="2" stdDeviation="1" floodOpacity="0.4"/>
      </filter>
    </defs>
    <circle cx="12" cy="8" r="3" fill="url(#plumberGradient)" filter="url(#plumberShadow)" />
    <path
      d="M12 14C8 14 5 16 5 18V20H19V18C19 16 16 14 12 14Z"
      fill="url(#plumberGradient)"
      filter="url(#plumberShadow)"
    />
    <rect x="14" y="16" width="6" height="2" rx="1" fill="#6B7280" transform="rotate(45 17 17)" />
    <rect x="15" y="15" width="4" height="1" rx="0.5" fill="#9CA3AF" transform="rotate(45 17 15.5)" />
  </svg>
);

// أيقونة الأخبار الاحترافية
export const NewsIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <defs>
      <linearGradient id="newsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#7C3AED" />
      </linearGradient>
      <filter id="newsShadow">
        <feDropShadow dx="1" dy="2" stdDeviation="1" floodOpacity="0.4"/>
      </filter>
    </defs>
    <rect x="4" y="4" width="16" height="16" rx="2" fill="url(#newsGradient)" filter="url(#newsShadow)" />
    <rect x="6" y="6" width="8" height="2" rx="1" fill="rgba(255,255,255,0.9)" />
    <rect x="6" y="9" width="12" height="1" rx="0.5" fill="rgba(255,255,255,0.7)" />
    <rect x="6" y="11" width="12" height="1" rx="0.5" fill="rgba(255,255,255,0.7)" />
    <rect x="6" y="13" width="8" height="1" rx="0.5" fill="rgba(255,255,255,0.7)" />
    <rect x="15" y="9" width="3" height="6" rx="1" fill="rgba(255,255,255,0.5)" />
  </svg>
);

// أيقونة الإحصائيات
export const StatsIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <defs>
      <linearGradient id="statsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06B6D4" />
        <stop offset="100%" stopColor="#0891B2" />
      </linearGradient>
      <filter id="statsShadow">
        <feDropShadow dx="1" dy="2" stdDeviation="1" floodOpacity="0.4"/>
      </filter>
    </defs>
    <rect x="4" y="16" width="3" height="4" rx="1" fill="url(#statsGradient)" filter="url(#statsShadow)" />
    <rect x="8.5" y="12" width="3" height="8" rx="1" fill="url(#statsGradient)" filter="url(#statsShadow)" />
    <rect x="13" y="8" width="3" height="12" rx="1" fill="url(#statsGradient)" filter="url(#statsShadow)" />
    <rect x="17.5" y="4" width="3" height="16" rx="1" fill="url(#statsGradient)" filter="url(#statsShadow)" />
    <circle cx="5.5" cy="14" r="1" fill="rgba(255,255,255,0.8)" />
    <circle cx="10" cy="10" r="1" fill="rgba(255,255,255,0.8)" />
    <circle cx="14.5" cy="6" r="1" fill="rgba(255,255,255,0.8)" />
    <circle cx="19" cy="2" r="1" fill="rgba(255,255,255,0.8)" />
  </svg>
);

// أيقونة التقارير
export const ReportIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <defs>
      <linearGradient id="reportGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#EF4444" />
        <stop offset="100%" stopColor="#DC2626" />
      </linearGradient>
      <filter id="reportShadow">
        <feDropShadow dx="1" dy="2" stdDeviation="1" floodOpacity="0.4"/>
      </filter>
    </defs>
    <rect x="5" y="3" width="14" height="18" rx="2" fill="url(#reportGradient)" filter="url(#reportShadow)" />
    <rect x="7" y="6" width="10" height="2" rx="1" fill="rgba(255,255,255,0.9)" />
    <rect x="7" y="9" width="8" height="1" rx="0.5" fill="rgba(255,255,255,0.7)" />
    <rect x="7" y="11" width="6" height="1" rx="0.5" fill="rgba(255,255,255,0.7)" />
    <circle cx="12" cy="16" r="3" fill="rgba(255,255,255,0.2)" />
    <path d="M12 14V18M10 16H14" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// أيقونة الهاتف
export const PhoneIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <defs>
      <linearGradient id="phoneGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    <path
      d="M22 16.92V19.92C22 20.52 21.52 21 20.92 21C10.93 21 3 13.07 3 3.08C3 2.48 3.48 2 4.08 2H7.08C7.68 2 8.16 2.48 8.16 3.08C8.16 4.08 8.35 5.04 8.7 5.94C8.89 6.4 8.76 6.94 8.4 7.3L6.9 8.8C8.07 11.62 10.38 13.93 13.2 15.1L14.7 13.6C15.06 13.24 15.6 13.11 16.06 13.3C16.96 13.65 17.92 13.84 18.92 13.84C19.52 13.84 20 14.32 20 14.92V16.92H22Z"
      fill="url(#phoneGradient)"
    />
  </svg>
);

// أيقونة الإيميل
export const EmailIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <defs>
      <linearGradient id="emailGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#1D4ED8" />
      </linearGradient>
    </defs>
    <rect x="2" y="6" width="20" height="12" rx="2" fill="url(#emailGradient)" />
    <path d="M2 8L12 14L22 8" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// أيقونة المستخدم
export const UserIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <defs>
      <linearGradient id="userGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#7C3AED" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="8" r="4" fill="url(#userGradient)" />
    <path d="M12 14C8 14 5 16.5 5 19.5V20H19V19.5C19 16.5 16 14 12 14Z" fill="url(#userGradient)" />
  </svg>
);

// أيقونة الأولوية
export const PriorityIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <defs>
      <linearGradient id="priorityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>
    <path
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
      fill="url(#priorityGradient)"
    />
    <circle cx="12" cy="10" r="2" fill="rgba(255,255,255,0.8)" />
  </svg>
);

// أيقونة الكاميرا
export const CameraIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <defs>
      <linearGradient id="cameraGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366F1" />
        <stop offset="100%" stopColor="#4F46E5" />
      </linearGradient>
    </defs>
    <rect x="2" y="8" width="20" height="12" rx="3" fill="url(#cameraGradient)" />
    <rect x="6" y="4" width="12" height="4" rx="2" fill="url(#cameraGradient)" />
    <circle cx="12" cy="14" r="4" fill="rgba(255,255,255,0.2)" />
    <circle cx="12" cy="14" r="2" fill="rgba(255,255,255,0.8)" />
    <circle cx="18" cy="10" r="1" fill="rgba(255,255,255,0.6)" />
  </svg>
);

// أيقونة الإعدادات
export const SettingsIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <defs>
      <linearGradient id="settingsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6B7280" />
        <stop offset="100%" stopColor="#4B5563" />
      </linearGradient>
    </defs>
    <path
      d="M12 8C10.34 8 9 9.34 9 11C9 12.66 10.34 14 12 14C13.66 14 15 12.66 15 11C15 9.34 13.66 8 12 8ZM12 16C9.79 16 8 14.21 8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16ZM19.14 12.94C19.18 12.64 19.2 12.33 19.2 12C19.2 11.68 19.18 11.36 19.14 11.06L21.16 9.48C21.34 9.34 21.39 9.07 21.28 8.87L19.36 5.55C19.24 5.33 18.99 5.26 18.77 5.33L16.38 6.29C15.88 5.91 15.35 5.59 14.76 5.35L14.4 2.81C14.36 2.57 14.16 2.4 13.92 2.4H10.08C9.84 2.4 9.64 2.57 9.6 2.81L9.24 5.35C8.65 5.59 8.12 5.92 7.62 6.29L5.23 5.33C5.01 5.26 4.76 5.33 4.64 5.55L2.72 8.87C2.61 9.07 2.66 9.34 2.84 9.48L4.86 11.06C4.82 11.36 4.8 11.69 4.8 12C4.8 12.31 4.82 12.64 4.86 12.94L2.84 14.52C2.66 14.66 2.61 14.93 2.72 15.13L4.64 18.45C4.76 18.67 5.01 18.74 5.23 18.67L7.62 17.71C8.12 18.08 8.65 18.41 9.24 18.65L9.6 21.19C9.64 21.43 9.84 21.6 10.08 21.6H13.92C14.16 21.6 14.36 21.43 14.4 21.19L14.76 18.65C15.35 18.41 15.88 18.09 16.38 17.71L18.77 18.67C18.99 18.74 19.24 18.67 19.36 18.45L21.28 15.13C21.39 14.93 21.34 14.66 21.16 14.52L19.14 12.94Z"
      fill="url(#settingsGradient)"
    />
  </svg>
);

// أيقونة الهوم
export const HomeIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <defs>
      <linearGradient id="homeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    <path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z" fill="url(#homeGradient)" />
    <rect x="11" y="16" width="2" height="4" fill="rgba(255,255,255,0.3)" />
    <rect x="9" y="7" width="2" height="2" fill="rgba(255,255,255,0.3)" />
    <rect x="13" y="7" width="2" height="2" fill="rgba(255,255,255,0.3)" />
  </svg>
);

// أيقونة تسجيل الدخول
export const LoginIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <defs>
      <linearGradient id="loginGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#1D4ED8" />
      </linearGradient>
    </defs>
    <path d="M11 7L9.6 8.4L12.2 11H2V13H12.2L9.6 15.6L11 17L16 12L11 7Z" fill="url(#loginGradient)" />
    <path d="M20 19H12V21H20C21.1 21 22 20.1 22 19V5C22 3.9 21.1 3 20 3H12V5H20V19Z" fill="url(#loginGradient)" />
  </svg>
);

// أيقونة الشمس (Light Mode)
export const SunIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <defs>
      <linearGradient id="sunGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FCD34D" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="5" fill="url(#sunGradient)" />
    <path d="M12 2V4M12 20V22M22 12H20M4 12H2M19.07 4.93L17.66 6.34M6.34 17.66L4.93 19.07M19.07 19.07L17.66 17.66M6.34 6.34L4.93 4.93" stroke="url(#sunGradient)" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="12" r="2" fill="rgba(255,255,255,0.6)" />
  </svg>
);

// أيقونة القمر (Dark Mode)
export const MoonIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <defs>
      <linearGradient id="moonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366F1" />
        <stop offset="100%" stopColor="#4F46E5" />
      </linearGradient>
    </defs>
    <path d="M21 12.79A9 9 0 1111.21 3A7 7 0 0021 12.79Z" fill="url(#moonGradient)" />
    <circle cx="15" cy="8" r="1" fill="rgba(255,255,255,0.4)" />
    <circle cx="17" cy="12" r="0.5" fill="rgba(255,255,255,0.3)" />
    <circle cx="14" cy="14" r="0.5" fill="rgba(255,255,255,0.3)" />
  </svg>
);

// أيقونة الفئة
export const CategoryIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <defs>
      <linearGradient id="categoryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#7C3AED" />
      </linearGradient>
      <filter id="categoryShadow">
        <feDropShadow dx="1" dy="2" stdDeviation="1" floodOpacity="0.3"/>
      </filter>
    </defs>
    <rect x="3" y="3" width="7" height="7" rx="2" fill="url(#categoryGradient)" filter="url(#categoryShadow)" />
    <rect x="14" y="3" width="7" height="7" rx="2" fill="url(#categoryGradient)" filter="url(#categoryShadow)" />
    <rect x="3" y="14" width="7" height="7" rx="2" fill="url(#categoryGradient)" filter="url(#categoryShadow)" />
    <rect x="14" y="14" width="7" height="7" rx="2" fill="url(#categoryGradient)" filter="url(#categoryShadow)" />
  </svg>
);

// أيقونة التاغ
export const TagIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <defs>
      <linearGradient id="tagGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <filter id="tagShadow">
        <feDropShadow dx="1" dy="2" stdDeviation="1" floodOpacity="0.3"/>
      </filter>
    </defs>
    <path
      d="M2 7.5V12.5C2 13.6 2.9 14.5 4 14.5H5.41L10.91 20C11.3 20.39 11.93 20.39 12.32 20L20 12.32C20.39 11.93 20.39 11.3 20 10.91L13.09 4H4C2.9 4 2 4.9 2 6V7.5ZM6.5 9C7.33 9 8 8.33 8 7.5S7.33 6 6.5 6S5 6.67 5 7.5S5.67 9 6.5 9Z"
      fill="url(#tagGradient)"
      filter="url(#tagShadow)"
    />
  </svg>
);

// أيقونة الصورة
export const ImageIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <defs>
      <linearGradient id="imageGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06B6D4" />
        <stop offset="100%" stopColor="#0891B2" />
      </linearGradient>
      <filter id="imageShadow">
        <feDropShadow dx="1" dy="2" stdDeviation="1" floodOpacity="0.3"/>
      </filter>
    </defs>
    <rect x="3" y="3" width="18" height="18" rx="2" fill="url(#imageGradient)" filter="url(#imageShadow)" />
    <circle cx="8.5" cy="8.5" r="1.5" fill="rgba(255,255,255,0.8)" />
    <path d="M21 15L16 10L11 15H21Z" fill="rgba(255,255,255,0.6)" />
    <path d="M14 21L9 16L3 21H14Z" fill="rgba(255,255,255,0.4)" />
  </svg>
);

// أيقونة الموقع
export const LocationIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <defs>
      <linearGradient id="locationGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#EF4444" />
        <stop offset="100%" stopColor="#DC2626" />
      </linearGradient>
      <filter id="locationShadow">
        <feDropShadow dx="1" dy="2" stdDeviation="1" floodOpacity="0.3"/>
      </filter>
    </defs>
    <path
      d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9S10.62 6.5 12 6.5S14.5 7.62 14.5 9S13.38 11.5 12 11.5Z"
      fill="url(#locationGradient)"
      filter="url(#locationShadow)"
    />
    <circle cx="12" cy="9" r="1.5" fill="rgba(255,255,255,0.8)" />
  </svg>
);

// أيقونة الموقع الإلكتروني
export const WebsiteIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <defs>
      <linearGradient id="websiteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#1D4ED8" />
      </linearGradient>
      <filter id="websiteShadow">
        <feDropShadow dx="1" dy="2" stdDeviation="1" floodOpacity="0.3"/>
      </filter>
    </defs>
    <circle cx="12" cy="12" r="10" fill="url(#websiteGradient)" filter="url(#websiteShadow)" />
    <path d="M2 12H22M12 2A15.3 15.3 0 0 1 4 12A15.3 15.3 0 0 1 12 22A15.3 15.3 0 0 1 20 12A15.3 15.3 0 0 1 12 2Z" stroke="rgba(255,255,255,0.6)" strokeWidth="1" fill="none" />
    <path d="M12 2V22" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
  </svg>
);

