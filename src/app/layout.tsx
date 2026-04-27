import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://chat-random-pro.vercel.app"),
  referrer: "no-referrer-when-downgrade",
  verification: {
    google: "FMr8sUXgVcowY_lb9BZb50geQ-OKRsxc8E2NRpjwl_w",
  },
  title: {
    default: "Random Chat | شات عشوائي عربي وغرف دردشة خاصة",
    template: "%s | Random Chat",
  },
  description:
    "أفضل شات عشوائي عربي وغرف دردشة خاصة. تواصل مع الغرباء بخصوصية تامة، دردشة نصية وصوتية بدون تسجيل. تواصل آمن وسريع مع مستخدمين من جميع أنحاء العالم.",
  keywords: [
    "شات عشوائي",
    "دردشة عشوائية",
    "شات بدون تسجيل",
    "دردشة صوتية",
    "شات غرف",
    "دردشة خاصة",
    "شات جوال",
    "random chat",
    "anonymous chat",
    "free private chat",
    "talk to strangers",
  ],
  openGraph: {
    title: "Random Chat | شات عشوائي وغرف دردشة",
    description: "دردشة عشوائية آمنة وخاصة بدون تسجيل. تواصل الآن مع مستخدمين جدد.",
    url: "https://chat-random-pro.vercel.app",
    siteName: "Random Chat Pro",
    images: [
      {
        url: "/og-image.png",
        width: 1024,
        height: 1024,
        alt: "Random Chat Logo",
      },
    ],
    locale: "ar_EG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Random Chat | شات عشوائي عربي",
    description: "تواصل مع الغرباء بخصوصية تامة، دردشة نصية وصوتية بدون تسجيل.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
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
import { AdUnit } from "@/components/ad-unit";
import { Onboarding } from "@/features/random-chat/components/onboarding";
import Script from "next/script";

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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var storageKey = "random-chat-theme";
                  var savedTheme = localStorage.getItem(storageKey);
                  var theme = savedTheme || "system";
                  var root = document.documentElement;
                  
                  if (theme === "system") {
                    var systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
                    root.classList.add(systemTheme);
                  } else {
                    root.classList.add(theme);
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6366f1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider defaultTheme="system">
          <Onboarding />
          {children}
          {/* Global Ad Unit (Code 1) */}
          <div className="fixed bottom-0 pointer-events-none opacity-0 w-0 h-0 overflow-hidden">
            <AdUnit src="//untimely-hello.com/b/X.VIssdlGHlh0IYTWicW/Ve/mF9VuIZ/U/l/kvPIT_Y/5UOFTAEf4ZNHjbkNtsN/jJkt5CM/T/gd3oM/wG" />
          </div>
        </ThemeProvider>
        <Script
          id="sw-register"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
