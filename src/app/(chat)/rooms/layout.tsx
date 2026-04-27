import { Metadata } from "next";

export const metadata: Metadata = {
  title: "غرف الدردشة العربية — شات جماعي | Random Chat",
  description:
    "اختر غرفة دردشة عربية وانضم للمحادثة الجماعية الآن. غرف لجميع الدول العربية: مصر، السعودية، المغرب، الجزائر، وأكثر. بدون تسجيل.",
  keywords: [
    "غرف دردشة",
    "شات جماعي",
    "شات عربي",
    "دردشة عربية",
    "غرف شات",
    "شات السعودية",
    "شات مصر",
    "شات المغرب",
    "دردشة بدون تسجيل",
  ],
  openGraph: {
    title: "غرف الدردشة العربية | Random Chat",
    description: "انضم لغرف الدردشة العربية الجماعية. تحدث مع أشخاص من بلدك بأمان وخصوصية تامة.",
    url: "https://chat-random-pro.vercel.app/rooms",
    images: [{ url: "/og-image.png", width: 1024, height: 1024 }],
  },
};

export default function RoomsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
