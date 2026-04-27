"use client";

import { useEffect, useRef, ReactNode } from "react";
import { UnifiedMessage } from "../types";
import { MessageBubble } from "./message-bubble";
import { Info, Lock } from "lucide-react";

interface MessageListProps {
  messages: UnifiedMessage[];
  guestId: string;
  notice?: string;
  isGuestTyping?: boolean;
  roomTypingUsers?: Record<string, string>;
  emptyState?: ReactNode;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export function MessageList({ messages, guestId, notice, isGuestTyping, roomTypingUsers = {}, emptyState, onLoadMore, hasMore }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages.length, isGuestTyping, roomTypingUsers]);

  return (
    <div
      className="flex flex-1 min-h-0 flex-col gap-4 overflow-y-auto p-4 sm:p-6 pb-20"
      ref={scrollRef}
    >
      {notice && (
        <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-[10px] font-bold text-muted-foreground shadow-sm">
          <Info size={14} className="text-primary" />
          <span>{notice}</span>
        </div>
      )}

      {hasMore && onLoadMore && messages.length >= 50 && (
        <button
          onClick={onLoadMore}
          className="mx-auto text-xs font-black text-primary/60 hover:text-primary transition-colors py-2 px-4 rounded-full border border-primary/10 hover:bg-primary/5 mb-4"
        >
          تحميل المزيد من الرسائل القديمة
        </button>
      )}

      {messages.length === 0 && (
        emptyState || (
          <div className="flex flex-1 flex-col items-center justify-center text-center p-8 mt-10">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/5 text-primary">
              <Lock className="h-10 w-10 text-primary/30" />
            </div>
            <h3 className="text-xl font-black text-foreground">
              المحادثة مشفرة وآمنة
            </h3>
            <p className="mt-2 text-sm font-medium text-muted-foreground max-w-[280px]">
              أهلاً بك! ابدأ الحديث الآن بكل خصوصية.
            </p>
          </div>
        )
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
          <div className="group relative max-w-[90%] px-3.5 py-3 text-xs leading-relaxed sm:max-w-[75%] sm:text-sm shadow-sm bubble-theirs">
            <div className="flex items-center gap-1.5 h-6">
              <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }}></div>
              <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }}></div>
              <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }}></div>
            </div>
          </div>
        </div>
      )}

      {Object.entries(roomTypingUsers)
        .filter(([id]) => id !== guestId)
        .map(([id, name]) => (
          <div key={id} className="flex w-full justify-start">
            <div className="group relative max-w-[90%] px-3.5 py-3 text-xs leading-relaxed sm:max-w-[75%] sm:text-sm shadow-sm bubble-theirs">
              <span className="block text-[10px] font-black text-primary mb-1">{name}</span>
              <div className="flex items-center gap-1.5 h-6">
                <div className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
