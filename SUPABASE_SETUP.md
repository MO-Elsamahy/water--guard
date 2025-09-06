# إعداد Supabase لمشروع Water Guard

## 🚀 الخطوات المطلوبة:

### 1. إنشاء الجداول في Supabase

1. **اذهب إلى لوحة تحكم Supabase**: https://supabase.com/dashboard
2. **اختر مشروعك**: `water-guard`
3. **اذهب إلى SQL Editor** (من الشريط الجانبي)
4. **انسخ والصق المحتوى الكامل** من ملف `supabase-schema.sql`
5. **اضغط "Run"** لتنفيذ الأوامر

### 2. تفعيل Row Level Security

الـ RLS مفعل تلقائياً في الـ schema، لكن تأكد من:

1. **اذهب إلى Authentication > Policies**
2. **تأكد من وجود السياسات (Policies)** لكل جدول
3. **إذا لم تظهر، قم بتنفيذ الـ SQL مرة أخرى**

### 3. إعداد Storage Buckets

1. **اذهب إلى Storage**
2. **تأكد من وجود هذه الـ Buckets**:
   - `avatars` (public)
   - `reports` (public)  
   - `news` (public)
   - `licenses` (private)

3. **إذا لم تكن موجودة، أنشئها يدوياً**:
   - اضغط "New bucket"
   - أدخل الاسم
   - اختر Public أو Private حسب الجدول أعلاه

### 4. إعداد Authentication

1. **اذهب إلى Authentication > Settings**
2. **تأكد من تفعيل**:
   - ✅ Enable email confirmations
   - ✅ Enable secure email change
   - ✅ Enable phone confirmations (اختياري)

### 5. إضافة بيانات تجريبية (اختياري)

قم بتنفيذ هذا الـ SQL لإضافة بيانات تجريبية:

```sql
-- إضافة مستخدم إداري تجريبي
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  role,
  aud
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'admin@waterguard.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"display_name": "مدير النظام", "role": "admin"}',
  'authenticated',
  'authenticated'
);
```

### 6. اختبار الاتصال

1. **شغل السيرفر**: `npm run dev`
2. **اذهب إلى صفحة التسجيل**
3. **سجل حساب جديد**
4. **تأكد من إنشاء المستخدم في قاعدة البيانات**

## 🔧 استكشاف الأخطاء:

### خطأ في الاتصال:
- تأكد من صحة الـ environment variables في `.env.local`
- تأكد من أن المشروع active في Supabase

### خطأ في RLS:
- تأكد من تنفيذ جميع الـ policies في الـ schema
- تحقق من أن المستخدم له الصلاحيات المناسبة

### خطأ في Storage:
- تأكد من إنشاء الـ buckets المطلوبة
- تحقق من الـ storage policies

## 📊 مراقبة الأداء:

1. **اذهب إلى Logs** لمراقبة الاستعلامات
2. **استخدم Database > Performance** لمراقبة الأداء
3. **راجع API > Logs** لمراقبة طلبات الـ API

## 🎯 الخطوات التالية:

بعد إعداد قاعدة البيانات، يمكنك:

1. ✅ اختبار تسجيل المستخدمين
2. ✅ اختبار رفع الصور
3. ✅ اختبار إنشاء التقارير
4. ✅ اختبار دليل السباكين
5. ✅ اختبار لوحة تحكم الإدارة

---

**ملاحظة**: إذا واجهت أي مشاكل، راجع الـ logs في Supabase Dashboard أو اتصل بالدعم التقني.
