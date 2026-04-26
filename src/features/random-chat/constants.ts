export interface Room {
  id: string;
  name: string;
  flag: string;
}

export interface Category {
  title: string;
  rooms: Room[];
}

export const ROOM_CATEGORIES: Category[] = [
  {
    title: "الغرفة العامة",
    rooms: [
      { id: "global", name: "الغرفة العالمية", flag: "🌍" },
    ],
  },
  {
    title: "المغرب العربي",
    rooms: [
      { id: "morocco", name: "شات المغرب", flag: "🇲🇦" },
      { id: "algeria", name: "شات الجزائر", flag: "🇩🇿" },
      { id: "tunisia", name: "شات تونس", flag: "🇹🇳" },
      { id: "libya", name: "شات ليبيا", flag: "🇱🇾" },
    ],
  },
  {
    title: "شات الخليج",
    rooms: [
      { id: "saudi", name: "شات السعودية", flag: "🇸🇦" },
      { id: "uae", name: "شات الإمارات", flag: "🇦🇪" },
      { id: "kuwait", name: "شات الكويت", flag: "🇰🇼" },
      { id: "qatar", name: "شات قطر", flag: "🇶🇦" },
      { id: "oman", name: "شات عُمان", flag: "🇴🇲" },
    ],
  },
  {
    title: "الشرق الأوسط",
    rooms: [
      { id: "egypt", name: "شات مصر", flag: "🇪🇬" },
      { id: "iraq", name: "شات العراق", flag: "🇮🇶" },
      { id: "syria", name: "شات سوريا", flag: "🇸🇾" },
      { id: "jordan", name: "شات الأردن", flag: "🇯🇴" },
      { id: "lebanon", name: "شات لبنان", flag: "🇱🇧" },
    ],
  },
];

export const ALL_ROOMS = ROOM_CATEGORIES.flatMap(c => c.rooms);
