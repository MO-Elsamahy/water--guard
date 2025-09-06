/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'cairo': ['Cairo', 'sans-serif'],
      },
      colors: {
        // ألوان Water Guard المستوحاة من اللوجو
        primary: {
          50: '#f0f9ff',   // أزرق فاتح جداً
          100: '#e0f2fe',  // أزرق فاتح
          200: '#bae6fd',  // أزرق فاتح متوسط
          300: '#7dd3fc',  // أزرق سماوي
          400: '#38bdf8',  // أزرق متوسط
          500: '#0ea5e9',  // أزرق أساسي (لون المياه)
          600: '#0284c7',  // أزرق داكن
          700: '#0369a1',  // أزرق داكن جداً
          800: '#075985',  // أزرق عميق
          900: '#0c4a6e',  // أزرق عميق جداً
        },
        // ألوان السماء والمياه
        water: {
          50: '#ecfeff',
          100: '#cffafe', 
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',  // سماوي مشرق
          500: '#06b6d4',  // تركوازي
          600: '#0891b2',  // أزرق مائي
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        // ألوان الطبيعة (للسباكين والبيئة)
        nature: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',  // أخضر طبيعي
          500: '#22c55e',  // أخضر متوسط
          600: '#16a34a',  // أخضر داكن
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // ألوان التحذير (للتقارير الهامة)
        alert: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',  // أحمر تحذيري
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // ألوان الذهبي (للتقييمات والإنجازات)
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',  // ذهبي مشرق
          500: '#f59e0b',  // ذهبي أساسي
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        }
      },
      // تدرجات مخصصة
      backgroundImage: {
        'water-gradient': 'linear-gradient(135deg, #0ea5e9 0%, #22d3ee 50%, #06b6d4 100%)',
        'sky-gradient': 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 50%, #38bdf8 100%)',
        'nature-gradient': 'linear-gradient(135deg, #16a34a 0%, #22c55e 50%, #4ade80 100%)',
        'sunset-gradient': 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #fcd34d 100%)',
      },
      // ظلال مخصصة
      boxShadow: {
        'water': '0 4px 14px 0 rgba(14, 165, 233, 0.15)',
        'water-lg': '0 10px 25px -3px rgba(14, 165, 233, 0.2)',
        'nature': '0 4px 14px 0 rgba(34, 197, 94, 0.15)',
        'nature-lg': '0 10px 25px -3px rgba(34, 197, 94, 0.2)',
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'soft-dark': '0 2px 15px -3px rgba(0, 0, 0, 0.3), 0 10px 20px -2px rgba(0, 0, 0, 0.2)',
      },
      // انتقالات وحركات
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-soft': 'bounceSoft 2s infinite',
        'water-flow': 'waterFlow 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        waterFlow: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)' },
          '50%': { transform: 'scale(1.05) rotate(1deg)' },
        },
      },
    },
  },
  plugins: [],
}