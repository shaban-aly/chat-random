"use client";

import { MessageCircle, Search, ShieldCheck, Mail, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePrivateConversations } from "../hooks/use-private-conversations";
import { useRandomChat } from "../use-random-chat";
import { profileService } from "../services/profile-service";

interface AppSidebarProps {
  className?: string;
}

export function AppSidebar({ className = "" }: AppSidebarProps) {
  const pathname = usePathname();
  
  const isRandom = pathname === "/";
  const isRooms = pathname.startsWith("/rooms");
  const isMessages = pathname.startsWith("/messages");

  const { guestId } = useRandomChat();
  const { totalUnreadCount } = usePrivateConversations(guestId);

  const handleLogout = async () => {
    if (!guestId) return;
    if (confirm("هل أنت متأكد من حذف حسابك؟ سيتم مسح كافة الرسائل والمحادثات.")) {
      try {
        await profileService.deleteProfile(guestId);
      } catch (err) {
        console.error("Logout DB error:", err);
      }
      localStorage.removeItem("random-chat-guest-id");
      localStorage.removeItem("random-chat-profile");
      window.location.replace("/");
    }
  };

  return (
    <aside className={`flex-col border-e border-border w-[400px] shrink-0 bg-card ${className}`}>
      {/* Brand Header */}
      <div className="flex items-center gap-4 p-8 lg:p-10 pb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20 text-white">
          <MessageCircle
            size={26}
            fill="currentColor"
            className="fill-white/20"
          />
        </div>
        <div className="flex flex-col text-start">
          <span className="text-2xl font-black tracking-tight leading-none text-foreground">
            RandomChat
          </span>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1">
            Serene Connect
          </span>
        </div>
      </div>

      <nav className="flex-1 px-8 lg:px-10 py-6 space-y-2">
        <Link 
          href="/"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors
            ${isRandom ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}
          `}
        >
          <MessageCircle size={20} />
          <span>الشات العشوائي</span>
        </Link>
        
        <Link 
          href="/rooms"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors
            ${isRooms ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}
          `}
        >
          <Search size={20} />
          <span>غرف الدردشة</span>
        </Link>

        <Link 
          href="/messages"
          className={`flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-colors
            ${isMessages ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}
          `}
        >
          <div className="flex items-center gap-3">
            <Mail size={20} />
            <span>الرسائل الخاصة</span>
          </div>
          {totalUnreadCount > 0 && (
            <span className="bg-destructive text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[1.2rem] text-center">
              {totalUnreadCount}
            </span>
          )}
        </Link>
      </nav>

      <div className="p-8 lg:p-10 border-t border-border/50 space-y-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-destructive hover:text-destructive/80 transition-colors font-bold w-full"
        >
          <LogOut size={20} />
          <span>حذف الحساب وخروج</span>
        </button>
        <div className="flex items-center gap-3 text-muted-foreground text-sm font-medium">
          <ShieldCheck size={20} className="text-emerald-500" />
          <span>اتصال مشفر وآمن</span>
        </div>
      </div>
    </aside>
  );
}
