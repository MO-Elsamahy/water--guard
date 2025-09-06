# دليل النشر - Water Guard 🚀

هذا الدليل يوضح كيفية نشر موقع Water Guard على منصات مختلفة.

## 📋 المتطلبات الأساسية

- Node.js 18 أو أحدث
- حساب Firebase مع مشروع جديد
- Git
- حساب على منصة الاستضافة المختارة

## 🔥 إعداد Firebase

### 1. إنشاء مشروع Firebase
```bash
# تثبيت Firebase CLI
npm install -g firebase-tools

# تسجيل الدخول
firebase login

# تهيئة المشروع
firebase init
```

### 2. إعداد Firestore
```javascript
// في Firebase Console
// 1. اذهب إلى Firestore Database
// 2. إنشاء قاعدة بيانات
// 3. ابدأ في وضع الاختبار
// 4. اختر المنطقة الأقرب (europe-west1)
```

### 3. إعداد Authentication
```javascript
// في Firebase Console
// 1. اذهب إلى Authentication
// 2. فعل Email/Password
// 3. إضافة نطاقات مصرح بها
```

### 4. إعداد Storage
```javascript
// في Firebase Console  
// 1. اذهب إلى Storage
// 2. ابدأ الخدمة
// 3. اختر المنطقة نفسها
```

### 5. قواعد الأمان

#### Firestore Rules
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && 
                  get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Reports collection
    match /reports/{reportId} {
      allow read: if resource.data.status == 'approved';
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Plumbers collection
    match /plumbers/{plumberId} {
      allow read: if resource.data.isApproved == true;
      allow create: if request.auth != null && request.auth.uid == plumberId;
      allow update: if request.auth != null && 
                     (request.auth.uid == plumberId || 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // News collection
    match /news/{newsId} {
      allow read: if resource.data.isPublished == true;
      allow create, update, delete: if request.auth != null && 
                                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Admins collection
    match /admins/{adminId} {
      allow read, write: if request.auth != null && 
                          get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

#### Storage Rules
```javascript
// storage.rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // صور التقارير
    match /reports/{reportId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // صور الأخبار
    match /news/{newsId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
                    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // صور الملفات الشخصية
    match /profiles/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 6. إنشاء مستخدم إدارة أولي
```javascript
// في Firebase Console > Authentication
// 1. أضف مستخدم جديد يدوياً
// 2. في Firestore، أنشئ مستند في مجموعة 'admins':
{
  uid: "admin_user_uid",
  email: "admin@waterguard.com", 
  username: "admin",
  role: "super_admin",
  permissions: ["all"],
  createdAt: new Date(),
  lastLogin: new Date()
}

// وأنشئ مستند مقابل في مجموعة 'users':
{
  uid: "admin_user_uid",
  email: "admin@waterguard.com",
  displayName: "مدير النظام",
  role: "admin",
  phoneNumber: "+201234567890",
  createdAt: new Date()
}
```

## 🌐 النشر على Vercel

### 1. إعداد الحساب
```bash
# تثبيت Vercel CLI
npm install -g vercel

# تسجيل الدخول
vercel login
```

### 2. إعداد متغيرات البيئة
```bash
# في Vercel Dashboard
# Project Settings > Environment Variables
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 3. النشر
```bash
# من مجلد المشروع
vercel

# أو للنشر التلقائي من Git
vercel --prod
```

### 4. إعداد النطاق المخصص
```bash
# في Vercel Dashboard
# Project Settings > Domains
# أضف نطاقك المخصص
```

## 🚀 النشر على Netlify

### 1. إعداد الحساب
- سجل حساب على Netlify.com
- اربط حساب GitHub/GitLab

### 2. إعداد البناء
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. متغيرات البيئة
```bash
# في Netlify Dashboard
# Site Settings > Environment Variables
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## 🐳 النشر باستخدام Docker

### 1. إنشاء Dockerfile
```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### 2. إنشاء docker-compose.yml
```yaml
# docker-compose.yml
version: '3.8'

services:
  water-guard:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_FIREBASE_API_KEY=${NEXT_PUBLIC_FIREBASE_API_KEY}
      - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}
      - NEXT_PUBLIC_FIREBASE_PROJECT_ID=${NEXT_PUBLIC_FIREBASE_PROJECT_ID}
      - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}
      - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}
      - NEXT_PUBLIC_FIREBASE_APP_ID=${NEXT_PUBLIC_FIREBASE_APP_ID}
      - NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=${NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}
    restart: unless-stopped
```

### 3. تشغيل Docker
```bash
# بناء وتشغيل الحاوية
docker-compose up -d

# عرض السجلات
docker-compose logs -f

# إيقاف الخدمة
docker-compose down
```

## 🔧 إعداد CI/CD

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build application
      run: npm run build
      env:
        NEXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
        NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: ${{ secrets.FIREBASE_STORAGE_BUCKET }}
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.FIREBASE_MESSAGING_SENDER_ID }}
        NEXT_PUBLIC_FIREBASE_APP_ID: ${{ secrets.FIREBASE_APP_ID }}
        NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: ${{ secrets.FIREBASE_MEASUREMENT_ID }}
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
        vercel-args: '--prod'
```

## 🔍 مراقبة الأداء

### 1. Firebase Performance
```javascript
// في firebase.ts
import { getPerformance } from "firebase/performance";

if (typeof window !== "undefined") {
  const perf = getPerformance(app);
}
```

### 2. Google Analytics
```javascript
// في firebase.ts
import { getAnalytics } from "firebase/analytics";

if (typeof window !== "undefined") {
  const analytics = getAnalytics(app);
}
```

### 3. Error Monitoring
```bash
# تثبيت Sentry
npm install @sentry/nextjs

# إعداد Sentry
npx @sentry/wizard -i nextjs
```

## 🛡️ الأمان في الإنتاج

### 1. متغيرات البيئة
- لا تضع أبداً مفاتيح API في الكود
- استخدم متغيرات البيئة دائماً
- راجع قواعد Firebase بانتظام

### 2. HTTPS
- تأكد من استخدام HTTPS
- فعل HSTS headers
- استخدم شهادات SSL صالحة

### 3. Content Security Policy
```javascript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' *.googleapis.com *.firebase.com; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src fonts.gstatic.com; img-src 'self' data: *.openstreetmap.org *.firebasestorage.app;"
          }
        ]
      }
    ]
  }
}
```

## 📊 النسخ الاحتياطي

### 1. نسخ احتياطي لـ Firestore
```bash
# تصدير البيانات
gcloud firestore export gs://your-bucket/backup-folder

# استيراد البيانات
gcloud firestore import gs://your-bucket/backup-folder
```

### 2. نسخ احتياطي للكود
```bash
# Git backup
git remote add backup https://github.com/username/water-guard-backup.git
git push backup main
```

## 🔄 التحديثات

### 1. تحديث التبعيات
```bash
# فحص التحديثات
npm outdated

# تحديث التبعيات
npm update

# تحديث Next.js
npm install next@latest
```

### 2. تحديث Firebase
```bash
# تحديث Firebase SDK
npm install firebase@latest

# تحديث قواعد الأمان
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

## 📞 الدعم

في حالة مواجهة مشاكل في النشر:

1. تحقق من سجلات الأخطاء
2. راجع متغيرات البيئة
3. تأكد من إعدادات Firebase
4. اتصل بفريق الدعم

---

**نصائح مهمة:**
- اختبر دائماً في بيئة التطوير قبل النشر
- احتفظ بنسخ احتياطية منتظمة
- راقب الأداء والأخطاء
- حدث التبعيات بانتظام

🚀 **نشر ناجح لـ Water Guard!**
