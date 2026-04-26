import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://chat-random-pro.vercel.app"),
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
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider defaultTheme="system">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
