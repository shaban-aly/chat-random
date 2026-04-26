import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: {
    default: "Random Chat | شات عشوائي عام",
    template: "%s | Random Chat",
  },
  description:
    "شات عشوائي عام وبسيط يوصلك بمستخدم متاح للتحدث نصيا في الوقت الحقيقي.",
  keywords: [
    "شات عشوائي",
    "دردشة عشوائية",
    "random chat",
    "anonymous chat",
    "realtime chat",
  ],
  openGraph: {
    title: "Random Chat | شات عشوائي عام",
    description: "ابدأ محادثة نصية عشوائية مع مستخدم متاح مباشرة وبدون تسجيل.",
    locale: "ar_EG",
    siteName: "Random Chat",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${plusJakartaSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider defaultTheme="system">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
