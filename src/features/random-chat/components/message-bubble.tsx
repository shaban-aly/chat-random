"use client";

import { AudioPlayer } from "./audio-player";
import { UnifiedMessage } from "../types";

interface MessageBubbleProps {
  message: UnifiedMessage;
  isMine: boolean;
}

export function MessageBubble({ message, isMine }: MessageBubbleProps) {
  // Check for system message
  if (message.body.startsWith("$$SYSTEM$$")) {
    const systemText = message.body.replace("$$SYSTEM$$", "");
    return (
      <div className="flex flex-col items-center justify-center my-2 animate-in fade-in duration-700 w-full">
        <div className="bg-muted/50 border border-border/50 rounded-2xl px-6 py-2 max-w-[90%] text-center shadow-sm">
          <p className="text-[11px] sm:text-xs font-bold text-foreground">
            {systemText}
          </p>
        </div>
      </div>
    );
  }
  const renderContent = (content: string) => {
    if (message.message_type === "audio" && message.media_url) {
      return (
        <div className="flex items-center gap-2 py-0.5">
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

  // Type guard for profile (for room messages)
  const profile = 'profiles' in message ? message.profiles : undefined;

  return (
    <div className={`flex w-full ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`group relative max-w-[90%] px-3.5 py-2 text-xs leading-relaxed sm:max-w-[75%] sm:text-sm shadow-sm transition-transform hover:scale-[1.01]
          ${isMine ? "bubble-mine" : "bubble-theirs"}
        `}
      >
        {!isMine && profile && (
          <div className="mb-0.5 flex items-center gap-1.5">
            <span
              className={`text-[10px] sm:text-xs font-black uppercase tracking-wider
                ${profile.gender === "male" ? "text-blue-500" : "text-pink-500"}
              `}
            >
              {profile.name}
            </span>
            <span className="text-[9px] font-bold text-muted-foreground opacity-50">
              {profile.age}
            </span>
          </div>
        )}
        <div className="whitespace-pre-wrap wrap-break-word">{renderContent(message.body)}</div>
        <div
          className={`mt-1 flex items-center gap-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest opacity-60 ${
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
