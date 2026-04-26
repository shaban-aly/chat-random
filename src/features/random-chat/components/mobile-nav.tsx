"use client";

import { MessageCircle, Globe, Mail, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { usePrivateConversations } from "../hooks/use-private-conversations";
import { useRandomChat } from "../use-random-chat";
import { ProfileModal } from "./profile-modal";

export function MobileNav() {
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const isRandom = pathname === "/";
  const isRooms = pathname.startsWith("/rooms");
  const isMessages = pathname.startsWith("/messages");

  const { guestId } = useRandomChat();
  const { totalUnreadCount } = usePrivateConversations(guestId);

  return (
    <>
      <div className="mobile-nav-container lg:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pt-2 pb-[calc(env(safe-area-inset-bottom,0)+0.5rem)]">
        <div className="mx-auto flex max-w-sm items-center justify-around rounded-2xl bg-card/80 backdrop-blur-xl p-1.5 shadow-xl border border-border/50">
          
          <Link 
            href="/"
            className={`flex flex-1 flex-col items-center justify-center gap-1 rounded-xl py-2 px-1 transition-colors
              ${isRandom ? "text-primary" : "text-muted-foreground hover:text-foreground"}
            `}
          >
            <div className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors
              ${isRandom ? "bg-primary/10" : ""}
            `}>
              <MessageCircle size={15} className={isRandom ? "fill-primary/20" : ""} />
            </div>
            <span className="text-[10px] font-bold">عشوائي</span>
          </Link>

          <Link 
            href="/rooms"
            className={`flex flex-1 flex-col items-center justify-center gap-1 rounded-xl py-2 px-1 transition-colors
              ${isRooms ? "text-primary" : "text-muted-foreground hover:text-foreground"}
            `}
          >
            <div className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors
              ${isRooms ? "bg-primary/10" : ""}
            `}>
              <Globe size={15} className={isRooms ? "fill-primary/20" : ""} />
            </div>
            <span className="text-[10px] font-bold">الغرف</span>
          </Link>

          <Link 
            href="/messages"
            className={`flex flex-1 flex-col items-center justify-center gap-1 rounded-xl py-2 px-1 transition-colors relative
              ${isMessages ? "text-primary" : "text-muted-foreground hover:text-foreground"}
            `}
          >
            <div className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors
              ${isMessages ? "bg-primary/10" : ""}
            `}>
              <Mail size={15} className={isMessages ? "fill-primary/20" : ""} />
            </div>
            <span className="text-[10px] font-bold">الرسائل</span>
            {totalUnreadCount > 0 && (
              <span className="absolute top-1 right-1/2 translate-x-4 bg-destructive text-white text-[8px] h-4 w-4 rounded-full flex items-center justify-center border border-card font-black">
                {totalUnreadCount}
              </span>
            )}
          </Link>

          <button 
            onClick={() => setIsProfileOpen(true)}
            className={`flex flex-1 flex-col items-center justify-center gap-1 rounded-xl py-2 px-1 transition-colors text-muted-foreground hover:text-foreground`}
          >
            <div className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors`}>
              <User size={15} />
            </div>
            <span className="text-[10px] font-bold">أنا</span>
          </button>

        </div>
      </div>

      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        guestId={guestId}
      />
    </>
  );
}
