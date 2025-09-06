export default function Footer() {
  return (
    <footer className="mt-12 border-t bg-white/70 dark:bg-black/20">
      <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-slate-600 flex flex-col md:flex-row items-center justify-between gap-3">
        <div>© {new Date().getFullYear()} Water Guard - المحلة الكبرى</div>
        <div className="flex gap-4">
          <a href="/news">الأخبار</a>
          <a href="/plumbers">السباكين</a>
          <a href="/(map)/reports">البلاغات</a>
        </div>
      </div>
    </footer>
  );
}


