"use client";

import { usePrivateConversations } from "../hooks/use-private-conversations";
import { ChevronRight, MessageSquare, User } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

interface PrivateConversationsScreenProps {
  guestId: string;
  onSelectConversation: (peerId: string) => void;
  onBack: () => void;
}

export function PrivateConversationsScreen({
  guestId,
  onSelectConversation,
  onBack,
}: PrivateConversationsScreenProps) {
  const { conversations, loading } = usePrivateConversations(guestId);

  return (
    <div className="flex h-full w-full flex-col bg-background relative overflow-hidden screen-enter">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={onBack}
            aria-label="الرجوع"
            className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <h2 className="text-lg font-black text-foreground">الرسائل الخاصة</h2>
        </div>
      </header>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 pb-24">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 opacity-50">
            <MessageSquare className="w-16 h-16 mb-4 text-muted-foreground" />
            <p className="text-lg font-bold text-foreground">لا توجد رسائل بعد</p>
            <p className="text-sm text-muted-foreground">ابدأ محادثة خاصة مع أي مستخدم في الغرف</p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto flex flex-col gap-3">
            {conversations.map((conv) => (
              <button
                key={conv.peerId}
                onClick={() => onSelectConversation(conv.peerId)}
                className="group relative flex items-center gap-4 p-4 rounded-3xl bg-card border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all text-start shadow-sm"
              >
                {/* Avatar with Badge */}
                <div className="relative">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl
                    ${conv.peer?.gender === 'male' ? 'bg-blue-500/10 text-blue-500' : 'bg-pink-500/10 text-pink-500'}
                  `}>
                    {conv.peer?.name.charAt(0) || <User size={24} />}
                  </div>
                  {conv.unreadCount > 0 && (
                    <div className="absolute -top-2 -right-2 bg-destructive text-white text-[10px] font-black h-6 w-6 rounded-full flex items-center justify-center shadow-lg animate-bounce border-2 border-card">
                      {conv.unreadCount}
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="font-black text-foreground group-hover:text-primary transition-colors">
                      {conv.peer?.name || "مستخدم مجهول"}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                      {new Date(conv.lastMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1 font-medium">
                    {conv.lastMessage.sender_id === guestId ? "أنت: " : ""}
                    {conv.lastMessage.body}
                  </p>
                </div>

                <ChevronRight className="w-5 h-5 text-muted-foreground/30 group-hover:text-primary/50 transition-colors" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
