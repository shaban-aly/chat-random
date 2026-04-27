import { Metadata } from "next";
import { ALL_ROOMS } from "@/features/random-chat/constants";

interface Props {
  params: Promise<{ roomId: string }>;
}

export async function generateStaticParams() {
  return ALL_ROOMS.map((room) => ({ roomId: room.id }));
}

const ROOM_DESCRIPTIONS: Record<string, string> = {
  global: "الغرفة العالمية للدردشة مع أشخاص من جميع أنحاء العالم. دردشة جماعية مفتوحة بدون تسجيل.",
  morocco: "شات المغرب — دردشة مع مغاربة من جميع المدن. تحدث بالدارجة أو العربية الفصحى.",
  algeria: "شات الجزائر — دردشة مع جزائريين. انضم لغرفة الدردشة الجزائرية الآن.",
  tunisia: "شات تونس — دردشة مع تونسيين. تحدث مع الشباب التونسي بحرية وأمان.",
  libya: "شات ليبيا — دردشة مع ليبيين. انضم لمجتمع الدردشة الليبي الآن.",
  saudi: "شات السعودية — دردشة مع سعوديين وخليجيين. غرفة للتعارف والنقاش.",
  uae: "شات الإمارات — دردشة مع إماراتيين ومقيمين في دبي وأبوظبي.",
  kuwait: "شات الكويت — دردشة مع كويتيين. انضم لغرفة الدردشة الكويتية الحية.",
  qatar: "شات قطر — دردشة مع قطريين ومقيمين في قطر بشكل آمن.",
  oman: "شات عُمان — دردشة مع عُمانيين. غرفة حية للدردشة العُمانية الآن.",
  egypt: "شات مصر — دردشة مع مصريين من القاهرة والإسكندرية وجميع المحافظات.",
  iraq: "شات العراق — دردشة مع عراقيين من بغداد والبصرة وجميع المحافظات.",
  syria: "شات سوريا — دردشة مع سوريين. تواصل مع الشباب السوري الآن.",
  jordan: "شات الأردن — دردشة مع أردنيين. انضم لغرفة الدردشة الأردنية الحية.",
  lebanon: "شات لبنان — دردشة مع لبنانيين. تحدث مع الشباب اللبناني بحرية.",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { roomId } = await params;
  const room = ALL_ROOMS.find((r) => r.id === roomId);
  
  if (!room) {
    return { title: "غرفة دردشة | Random Chat" };
  }

  const description = ROOM_DESCRIPTIONS[roomId] ?? `${room.name} — دردشة جماعية آمنة بدون تسجيل. انضم الآن وتحدث مع الأشخاص المتصلين.`;
  const title = `${room.name} ${room.flag} — شات مباشر | Random Chat`;

  return {
    title,
    description,
    keywords: [
      room.name,
      `شات ${room.name.replace("شات ", "")}`,
      `دردشة ${room.name.replace("شات ", "")}`,
      "شات عشوائي",
      "دردشة بدون تسجيل",
      "شات جماعي",
    ],
    openGraph: {
      title,
      description,
      url: `https://chat-random-pro.vercel.app/rooms/${roomId}`,
      images: [{ url: "/og-image.png", width: 1024, height: 1024 }],
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default function RoomLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
