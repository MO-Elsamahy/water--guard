# 🚀 دليل البدء السريع - Water Guard

## ⚡ تشغيل المشروع في 5 دقائق

### 1. استنساخ المشروع
```bash
git clone [repository-url]
cd water-guard
```

### 2. تثبيت التبعيات
```bash
npm install
```

### 3. إعداد Firebase
أنشئ ملف `.env.local` في مجلد المشروع:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC45Bhi5mE1M-ICrAHkmEeg9lueo17aL5M
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=water-guard-be91f.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=water-guard-be91f
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=water-guard-be91f.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=157271432014
NEXT_PUBLIC_FIREBASE_APP_ID=1:157271432014:web:f37b6feb5366b62be49c1f
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-G2E7MDWGRC

```

> ✅ **الخرائط مجانية**: المشروع يستخدم OpenStreetMap مع React Leaflet - لا حاجة لمفاتيح API إضافية!

### 4. تشغيل المشروع
```bash
npm run dev
```

### 5. فتح المتصفح
```
http://localhost:3000
```

## 🎯 الوصول السريع للصفحات

| الصفحة | الرابط | الوصف |
|--------|--------|-------|
| الرئيسية | `/` | الصفحة الرئيسية |
| الأخبار | `/news` | آخر الأخبار والتحديثات |
| السباكين | `/plumbers` | دليل السباكين المعتمدين |
| إبلاغ عن مشكلة | `/reports` | خريطة الإبلاغ التفاعلية |
| تسجيل الدخول | `/login` | تسجيل دخول المستخدمين |
| إنشاء حساب | `/signup` | تسجيل مستخدم جديد |
| تسجيل سباك | `/plumber-signup` | تسجيل سباك جديد |
| دخول الإدارة | `/admin/login` | تسجيل دخول الإدارة |
| لوحة التحكم | `/admin/dashboard` | لوحة تحكم الإدارة |

## 👤 حسابات اختبار

### مستخدم عادي
- **البريد**: user@test.com
- **كلمة المرور**: password123

### سباك
- **البريد**: plumber@test.com
- **كلمة المرور**: password123

### إدارة
- **اسم المستخدم**: admin
- **كلمة المرور**: admin123

## 🛠️ أوامر مفيدة

```bash
# تشغيل وضع التطوير
npm run dev

# بناء المشروع للإنتاج
npm run build

# تشغيل النسخة المبنية
npm start

# فحص الأخطاء
npm run lint

# إصلاح الأخطاء تلقائياً
npm run lint:fix

# فحص أنواع TypeScript
npm run type-check
```

## 📱 اختبار الميزات

### إبلاغ عن مشكلة
1. اذهب إلى `/reports`
2. انقر على الخريطة لتحديد الموقع
3. املأ نموذج البلاغ
4. أرسل البلاغ

### تصفح السباكين
1. اذهب إلى `/plumbers`
2. استخدم فلاتر البحث
3. اتصل بالسباك أو راسله على واتساب

### إدارة النظام
1. اذهب إلى `/admin/login`
2. سجل الدخول كإدارة
3. راجع البلاغات والسباكين
4. أنشئ أخباراً جديدة

## 🔧 حل المشاكل الشائعة

### خطأ Firebase
```bash
# تأكد من صحة متغيرات البيئة
cat .env.local

# أعد تشغيل الخادم
npm run dev
```

### خطأ في الخريطة
```bash
# تأكد من تحميل CSS الخاص بـ Leaflet
# في layout.tsx يجب أن يكون هناك:
# <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
```

### مشاكل الشبكة
```bash
# امسح cache npm
npm cache clean --force

# أعد تثبيت التبعيات
rm -rf node_modules package-lock.json
npm install
```

## 📊 البيانات التجريبية

### إضافة بيانات تجريبية
```javascript
// في Firebase Console > Firestore
// أضف المجموعات والمستندات التالية:

// مجموعة 'news'
{
  title: "افتتاح مشروع Water Guard",
  content: "تم إطلاق منصة Water Guard لخدمة أهالي المحلة الكبرى...",
  summary: "إطلاق رسمي للمنصة",
  category: "announcement",
  isPublished: true,
  publishedAt: new Date(),
  author: "فريق Water Guard",
  images: [],
  tags: ["إطلاق", "أخبار"]
}

// مجموعة 'plumbers'
{
  displayName: "أحمد محمد",
  email: "plumber@test.com",
  phoneNumber: "01012345678",
  role: "plumber",
  experience: 5,
  specialties: ["إصلاح الأنابيب", "تركيب السخانات"],
  workingAreas: ["المحلة الكبرى - وسط المدينة"],
  isApproved: true,
  isAvailable: true,
  rating: 4.5,
  completedJobs: 25,
  location: { lat: 30.9754, lng: 31.2656 },
  createdAt: new Date()
}
```

## 🎨 تخصيص التصميم

### تغيير الألوان
```css
/* في globals.css */
:root {
  --primary-color: #2563EB;  /* الأزرق الأساسي */
  --secondary-color: #059669; /* الأخضر */
  --danger-color: #DC2626;    /* الأحمر */
  --warning-color: #D97706;   /* الأصفر */
}
```

### إضافة خط جديد
```typescript
// في layout.tsx
import { Cairo, Amiri } from "next/font/google";

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  weight: ["400", "700"],
});
```

## 🔐 إعداد الأمان

### قواعد Firestore الأساسية
```javascript
// في Firebase Console > Firestore > Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // السماح للجميع بقراءة الأخبار المنشورة
    match /news/{newsId} {
      allow read: if resource.data.isPublished == true;
    }
    
    // السماح للجميع بقراءة السباكين المعتمدين
    match /plumbers/{plumberId} {
      allow read: if resource.data.isApproved == true;
    }
    
    // السماح للجميع بقراءة التقارير المعتمدة
    match /reports/{reportId} {
      allow read: if resource.data.status == 'approved';
      allow create: if request.auth != null;
    }
  }
}
```

## 📞 الحصول على المساعدة

- **الوثائق الكاملة**: راجع `README.md`
- **دليل النشر**: راجع `DEPLOYMENT.md`
- **المشاكل التقنية**: أنشئ issue في GitHub
- **الدعم**: تواصل مع فريق التطوير

---

**🎉 مبروك! موقع Water Guard جاهز للاستخدام**

استمتع بتجربة المنصة واستكشاف جميع الميزات المتاحة.
