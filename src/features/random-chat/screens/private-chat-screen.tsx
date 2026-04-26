"use client";

import { useRef, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { Profile, PrivateMessage } from "../types";
import { MessageInput } from "../components/message-input";
import { ThemeToggle } from "@/components/theme-toggle";
import { AudioPlayer } from "../components/audio-player";

interface PrivateChatScreenProps {
  guestId: string;
  peer: Profile;
  messages: PrivateMessage[];
  messageText: string;
  onMessageChange: (text: string) => void;
  onSendMessage: (e: React.FormEvent<HTMLFormElement>) => void;
  onSendAudio?: (blob: Blob) => void;
  onClose: () => void;
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
}: PrivateChatScreenProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const renderMessageContent = (msg: PrivateMessage) => {
    if (msg.message_type === "audio" && msg.media_url) {
      return <AudioPlayer src={msg.media_url} />;
    }
    return msg.body;
  };

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
        <div>
          <h2 className="text-base font-black text-foreground">{peer.name}</h2>
          <p className="text-xs text-muted-foreground">
            {peer.age} سنة • {peer.gender === "male" ? "ذكر" : "أنثى"} • خاص
          </p>
        </div>
      </header>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 sm:p-6 pb-20 flex flex-col gap-4"
      >
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50 mt-20">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-3xl mb-4
              ${peer.gender === "male" ? "bg-blue-500/10 text-blue-500" : "bg-pink-500/10 text-pink-500"}
            `}>
              {peer.name.charAt(0)}
            </div>
            <p className="text-lg font-bold text-foreground">{peer.name}</p>
            <p className="text-sm text-muted-foreground mt-1">ابدأ محادثة خاصة الآن</p>
          </div>
        )}

        {messages.map((msg) => {
          const isMine = msg.sender_id === guestId;
          return (
            <div key={msg.id} className={`flex w-full ${isMine ? "justify-end" : "justify-start"}`}>
              <div
                className={`group relative max-w-[85%] px-5 py-3 text-sm leading-relaxed sm:max-w-[70%] sm:text-base shadow-sm
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
      />
    </div>
  );
}
