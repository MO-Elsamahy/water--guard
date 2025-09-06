import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import Navbar from "@/app/components/Navbar";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Footer from "@/app/components/Footer";
import { AuthProvider } from "@/contexts/AuthContextV2";
import AuthGuard from "@/components/AuthGuard";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Water Guard",
  description: "منصة Water Guard لإدارة البلاغات ودليل السباكين",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin="" />
      </head>
      <body className={`${cairo.variable} font-cairo antialiased transition-theme`}>
        <AuthProvider>
          <ThemeProvider>
            <AuthGuard>
              <Navbar />
              {children}
              <Footer />
            </AuthGuard>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
