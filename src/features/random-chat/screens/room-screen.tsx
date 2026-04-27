"use client";

import { useState } from "react";
import { Users, ChevronRight, ShieldAlert, Copy, Check } from "lucide-react";
import { RoomMessage, Profile } from "../types";
import { MessageInput } from "../components/message-input";
import { MessageList } from "../components/message-list";
import { ThemeToggle } from "@/components/theme-toggle";
import { ReportModal } from "../components/report-modal";

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
  typingUsers?: Record<string, string>;
  onLoadMore?: () => void;
  hasMore?: boolean;
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
  typingUsers = {},
  onLoadMore,
  hasMore = false,
}: RoomScreenProps) {
  const [isUsersOpen, setIsUsersOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<Profile | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

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
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            aria-label="نسخ رابط الغرفة"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-primary transition-colors"
          >
            {isCopied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setIsUsersOpen(true)}
            aria-label="عرض المتواجدين"
            className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary hover:bg-primary/20 transition-colors"
          >
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">المتواجدون</span>
          </button>
        </div>
      </header>

      <MessageList
        messages={messages}
        guestId={guestId}
        notice={notice}
        roomTypingUsers={typingUsers}
        onLoadMore={onLoadMore}
        hasMore={hasMore}
        emptyState={
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50 mt-10">
            <Users className="w-16 h-16 mb-4 text-muted-foreground" />
            <p className="text-lg font-bold text-foreground">لا توجد رسائل بعد</p>
            <p className="text-sm text-muted-foreground">كن أول من يرحب بالجميع!</p>
          </div>
        }
      />

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
                  <div className="w-full flex items-center justify-between p-3 rounded-xl border border-border/50 bg-background text-right">
                    <button
                      onClick={() => {
                        if (user.guest_id !== guestId) {
                          onPrivateChat(user);
                          setIsUsersOpen(false);
                        }
                      }}
                      disabled={user.guest_id === guestId}
                      className="flex items-center gap-3 flex-1 disabled:opacity-70 disabled:pointer-events-none"
                    >
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
                    </button>
                    {user.guest_id !== guestId && (
                      <button
                        onClick={() => setReportTarget(user)}
                        className="p-2 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                        title="إبلاغ"
                      >
                        <ShieldAlert size={15} />
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {reportTarget && (
        <ReportModal
          isOpen={!!reportTarget}
          onClose={() => setReportTarget(null)}
          reporterId={guestId}
          reportedId={reportTarget.guest_id}
          reportedName={reportTarget.name}
        />
      )}
    </div>
  );
}
