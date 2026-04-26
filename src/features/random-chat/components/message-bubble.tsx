"use client";

import { AudioPlayer } from "./audio-player";
import { Message } from "../types";

interface MessageBubbleProps {
  message: Message;
  isMine: boolean;
}

export function MessageBubble({ message, isMine }: MessageBubbleProps) {
  const renderContent = (content: string) => {
    if (message.message_type === "audio" && message.media_url) {
      return (
        <div className="flex items-center gap-2 py-1">
          <AudioPlayer src={message.media_url} />
        </div>
      );
    }

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

  return (
    <div className={`flex w-full ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`group relative max-w-[85%] px-5 py-4 text-sm leading-relaxed sm:max-w-[70%] sm:text-base shadow-sm transition-transform hover:scale-[1.01]
          ${isMine ? "bubble-mine" : "bubble-theirs"}
        `}
      >
        <div className="whitespace-pre-wrap wrap-break-word">{renderContent(message.body)}</div>
        <div
          className={`mt-2 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest opacity-60 ${
            isMine ? "justify-end text-white" : "justify-start text-muted-foreground"
          }`}
          suppressHydrationWarning
        >
          {new Date(message.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}
