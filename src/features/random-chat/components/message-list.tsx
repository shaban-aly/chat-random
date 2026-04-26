"use client";

import { useEffect, useRef } from "react";
import { Message } from "../types";
import { MessageBubble } from "./message-bubble";
import { Info, Lock } from "lucide-react";

interface MessageListProps {
  messages: Message[];
  guestId: string;
  notice?: string;
  isGuestTyping?: boolean;
}

export function MessageList({ messages, guestId, notice, isGuestTyping }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages.length, isGuestTyping]);

  return (
    <div
      className="flex flex-1 min-h-0 flex-col gap-8 overflow-y-auto p-4 sm:p-10"
      ref={scrollRef}
    >
      {notice && (
        <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-[10px] font-bold text-muted-foreground shadow-sm">
          <Info size={14} className="text-primary" />
          <span>{notice}</span>
        </div>
      )}

      {messages.length === 0 && (
        <div className="flex flex-1 flex-col items-center justify-center text-center p-8">
          <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-primary/5 text-primary">
            <Lock className="h-12 w-12 text-primary/30" />
          </div>
          <h3 className="text-xl font-black text-foreground">
            المحادثة مشفرة وآمنة
          </h3>
          <p className="mt-2 text-sm font-medium text-muted-foreground max-w-[280px]">
            أهلاً بك! ابدأ الحديث الآن بكل خصوصية.
          </p>
        </div>
      )}

      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          isMine={message.sender_id === guestId}
        />
      ))}

      {isGuestTyping && (
        <div className="flex w-full justify-start">
          <div className="group relative max-w-[85%] px-5 py-4 text-sm leading-relaxed sm:max-w-[70%] sm:text-base shadow-sm bubble-theirs">
            <div className="flex items-center gap-1.5 h-6">
              <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }}></div>
              <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }}></div>
              <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
