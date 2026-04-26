"use client";

import { Users, Globe2, MapPin } from "lucide-react";
import { ROOM_CATEGORIES } from "../constants";

interface RoomsDirectoryScreenProps {
  onSelectRoom: (roomId: string, roomName: string) => void;
}

export function RoomsDirectoryScreen({ onSelectRoom }: RoomsDirectoryScreenProps) {
  return (
    <div className="flex-1 flex flex-col bg-muted/30">
      {/* Header */}
      <div className="p-6 pb-2">
        <h1 className="text-2xl font-black text-foreground mb-1">غرف الدردشة</h1>
        <p className="text-muted-foreground text-sm font-medium">اختر غرفة وانضم للمحادثة الجماعية</p>
      </div>

      {/* Directory Grid */}
      <div className="flex-1 overflow-auto p-4 lg:p-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {ROOM_CATEGORIES.map((category, idx) => (
            <div key={category.title} className="space-y-3">
              <div className="flex items-center gap-2 px-2 text-primary">
                {idx === 0 ? <Globe2 className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                <h2 className="font-black tracking-tight">{category.title}</h2>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                {category.rooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => onSelectRoom(room.id, room.name)}
                    className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all group text-start shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{room.flag}</span>
                      <span className="font-bold text-foreground group-hover:text-primary transition-colors">{room.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground bg-muted px-2 py-1 rounded-lg">
                      <Users size={12} />
                      <span>نشط</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
