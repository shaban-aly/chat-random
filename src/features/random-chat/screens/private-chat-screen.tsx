"use client";

import { useState } from "react";
import { ChevronRight, ShieldAlert } from "lucide-react";
import { Profile, PrivateMessage } from "../types";
import { MessageInput } from "../components/message-input";
import { MessageList } from "../components/message-list";
import { ThemeToggle } from "@/components/theme-toggle";
import { ReportModal } from "../components/report-modal";

interface PrivateChatScreenProps {
  guestId: string;
  peer: Profile;
  messages: PrivateMessage[];
  messageText: string;
  onMessageChange: (text: string) => void;
  onSendMessage: (e: React.FormEvent<HTMLFormElement>) => void;
  onSendAudio?: (blob: Blob) => void;
  onClose: () => void;
  isPeerTyping?: boolean;
}

export function PrivateChatScreen({
  guestId,
  peer,
  messages,
  messageText,
  onMessageChange,
  onSendMessage,
  onSendAudio,
  onClose,
  isPeerTyping = false,
}: PrivateChatScreenProps) {
  const [isReportOpen, setIsReportOpen] = useState(false);

  return (
    <div className="flex h-full w-full flex-col bg-background relative overflow-hidden screen-enter">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-md z-10">
        <ThemeToggle />
        <button
          onClick={onClose}
          aria-label="الرجوع للقائمة"
          className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
        <div 
          aria-label={`صورة ${peer.name}`}
          role="img"
          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0
          ${peer.gender === "male" ? "bg-blue-500/10 text-blue-500" : "bg-pink-500/10 text-pink-500"}
        `}>
          {peer.name.charAt(0)}
        </div>
        <div className="flex-1">
          <h2 className="text-base font-black text-foreground">{peer.name}</h2>
          <p className="text-xs text-muted-foreground">
            {peer.age} سنة • {peer.gender === "male" ? "ذكر" : "أنثى"} • خاص
          </p>
        </div>

        {/* Report button */}
        <button
          onClick={() => setIsReportOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          title="إبلاغ عن المستخدم"
        >
          <ShieldAlert size={18} />
        </button>
      </header>

      {/* Messages */}
      <MessageList
        messages={messages}
        guestId={guestId}
        isGuestTyping={isPeerTyping}
        emptyState={
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50 mt-20">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-3xl mb-4
              ${peer.gender === "male" ? "bg-blue-500/10 text-blue-500" : "bg-pink-500/10 text-pink-500"}
            `}>
              {peer.name.charAt(0)}
            </div>
            <p className="text-lg font-bold text-foreground">{peer.name}</p>
            <p className="text-sm text-muted-foreground mt-1">ابدأ محادثة خاصة الآن</p>
          </div>
        }
      />

      <MessageInput
        messageText={messageText}
        onMessageChange={onMessageChange}
        onSendMessage={onSendMessage}
        onSendAudio={onSendAudio}
      />

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        reporterId={guestId}
        reportedId={peer.guest_id}
        reportedName={peer.name}
      />
    </div>
  );
}
