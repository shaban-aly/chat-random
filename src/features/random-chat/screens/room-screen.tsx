"use client";

import { useState, useRef, useEffect } from "react";
import { Users, ChevronRight, AlertCircle } from "lucide-react";
import { Profile, RoomMessage } from "../types";
import { MessageInput } from "../components/message-input";
import { ThemeToggle } from "@/components/theme-toggle";
import { AudioPlayer } from "../components/audio-player";

interface RoomScreenProps {
  roomId: string;
  roomName: string;
  guestId: string;
  messages: RoomMessage[];
  onlineUsers: Profile[];
  messageText: string;
  notice: string;
  onMessageChange: (text: string) => void;
  onSendMessage: (e: React.FormEvent<HTMLFormElement>) => void;
  onSendAudio?: (blob: Blob) => void;
  onLeaveRoom: () => void;
  onPrivateChat: (peer: Profile) => void;
  profile?: Profile | null;
}

export function RoomScreen({
  roomName,
  guestId,
  messages,
  onlineUsers,
  messageText,
  notice,
  onMessageChange,
  onSendMessage,
  onSendAudio,
  onLeaveRoom,
  onPrivateChat,
  profile,
}: RoomScreenProps) {
  const [isUsersOpen, setIsUsersOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const renderMessageContent = (msg: RoomMessage) => {
    if (msg.message_type === "audio" && msg.media_url) {
      return <AudioPlayer src={msg.media_url} />;
    }
    
    const content = msg.body;
    const parts = content.split(/(@[^\s@]+)/g);
    return parts.map((part, i) => {
      if (part.startsWith("@")) {
        return (
          <span key={i} className="font-bold text-primary dark:text-primary-foreground underline decoration-primary/30 underline-offset-2">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  // ... (auto-scroll useEffect)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages.length]);

  return (
    <div className="flex h-full w-full flex-col bg-background relative overflow-hidden screen-enter">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={onLeaveRoom}
            aria-label="مغادرة الغرفة"
            className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <div>
            <h2 className="text-lg font-black text-foreground">{roomName}</h2>
            <p className="text-xs font-bold text-muted-foreground">
              {onlineUsers.length} متصل الآن
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsUsersOpen(true)}
          aria-label="عرض المتواجدين"
          className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary hover:bg-primary/20 transition-colors"
        >
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline">المتواجدون</span>
        </button>
      </header>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 sm:p-4 pb-20 flex flex-col gap-3"
      >
        {notice && (
          <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-bold text-muted-foreground shadow-sm">
            <AlertCircle className="h-4 w-4 text-primary" />
            <span>{notice}</span>
          </div>
        )}

        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
            <Users className="w-16 h-16 mb-4 text-muted-foreground" />
            <p className="text-lg font-bold text-foreground">لا توجد رسائل بعد</p>
            <p className="text-sm text-muted-foreground">كن أول من يرحب بالجميع!</p>
          </div>
        )}

        {messages.map((msg) => {
          // Detect system messages via prefix
          if (msg.body.startsWith("$$SYSTEM$$")) {
            const systemText = msg.body.replace("$$SYSTEM$$", "");
            return (
              <div key={msg.id} className="flex flex-col items-center justify-center my-2 animate-in fade-in duration-700">
                <div className="bg-muted/50 border border-border/50 rounded-2xl px-6 py-2 max-w-[90%] text-center shadow-xs">
                  <p className="text-[11px] sm:text-xs font-bold text-foreground">
                    {systemText}
                  </p>
                </div>
              </div>
            );
          }

          const isMine = msg.sender_id === guestId;
          const profile = msg.profiles;
          
          return (
            <div key={msg.id} className={`flex flex-col w-full ${isMine ? "items-end" : "items-start"}`}>
              {!isMine && profile && (
                <span className="text-xs font-bold text-muted-foreground mb-1 ml-2 mr-2">
                  {profile.name}
                </span>
              )}
              <div
                className={`group relative max-w-[90%] px-3.5 py-2 text-xs leading-relaxed sm:max-w-[80%] sm:text-sm shadow-xs
                  ${isMine ? "bubble-mine" : "bubble-theirs"}
                `}
              >
                <div className="whitespace-pre-wrap wrap-break-word">{renderMessageContent(msg)}</div>
                <div
                  className={`mt-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest opacity-60 ${
                    isMine ? "justify-end text-white" : "justify-start text-muted-foreground"
                  }`}
                  suppressHydrationWarning
                >
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <MessageInput
        messageText={messageText}
        onMessageChange={onMessageChange}
        onSendMessage={onSendMessage}
        onSendAudio={onSendAudio}
        onlineUsers={onlineUsers}
      />

      {/* Users Drawer Overlay */}
      {isUsersOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsUsersOpen(false)}
        />
      )}

      {/* Users Drawer */}
      <div 
        className={`fixed top-0 bottom-0 right-0 z-50 w-80 bg-card shadow-2xl transition-transform duration-300 ease-in-out border-l border-border ${
          isUsersOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-black text-foreground flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            المتواجدون الآن ({onlineUsers.length})
          </h3>
          <button 
            onClick={() => setIsUsersOpen(false)}
            aria-label="إغلاق القائمة"
            className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
          >
            ✕
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto h-full pb-20">
          {onlineUsers.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm mt-10">لا يوجد متصلين غيرك</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {onlineUsers.map(user => (
                <li key={user.guest_id}>
                  <button
                    onClick={() => {
                      if (user.guest_id !== guestId) {
                        onPrivateChat(user);
                        setIsUsersOpen(false);
                      }
                    }}
                    disabled={user.guest_id === guestId}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-border/50 bg-background hover:border-primary/30 hover:bg-primary/5 transition-all disabled:opacity-70 disabled:pointer-events-none text-right"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                        ${user.gender === 'male' ? 'bg-blue-500/10 text-blue-500' : 'bg-pink-500/10 text-pink-500'}
                      `}>
                        {user.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-foreground">
                          {user.name}
                          {user.guest_id === guestId && <span className="text-xs text-muted-foreground font-normal mx-2">(أنت)</span>}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {user.age} سنة • {user.gender === 'male' ? 'ذكر' : 'أنثى'}
                        </span>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
