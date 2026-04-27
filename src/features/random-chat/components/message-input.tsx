"use client";

import { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VoiceRecorder } from "./voice-recorder";
import { EmojiPicker } from "./emoji-picker";
import { Profile } from "../types";
import { Send } from "lucide-react";

interface MessageInputProps {
  messageText: string;
  onMessageChange: (text: string) => void;
  onSendMessage: (e: FormEvent<HTMLFormElement>) => void;
  onSendAudio?: (blob: Blob) => void;
  onlineUsers?: Profile[];
  disabled?: boolean;
}

export function MessageInput({
  messageText,
  onMessageChange,
  onSendMessage,
  onSendAudio,
  onlineUsers = [],
  disabled = false,
}: MessageInputProps) {
  const lastAtPos = messageText.lastIndexOf("@");
  const showMentions = lastAtPos !== -1 && (lastAtPos === messageText.length - 1 || !/\s/.test(messageText.slice(lastAtPos, lastAtPos + 2).charAt(1)));
  const mentionQuery = showMentions ? messageText.slice(lastAtPos + 1).split(/\s/)[0].toLowerCase() : "";
  const filteredUsers = onlineUsers.filter(u => u.name.toLowerCase().includes(mentionQuery)).slice(0, 5);

  const insertMention = (name: string) => {
    const before = messageText.slice(0, lastAtPos);
    onMessageChange(before + "@" + name + " ");
  };

  return (
    <div className="shrink-0 bg-background p-4 sm:p-8 pb-[calc(env(safe-area-inset-bottom,0)+2rem)] sm:pb-[calc(env(safe-area-inset-bottom,0)+1.8rem)]">
      {showMentions && filteredUsers.length > 0 && (
        <div className="mx-auto max-w-4xl mb-2 flex flex-wrap gap-2 animate-in slide-in-from-bottom-2">
          {filteredUsers.map(user => (
            <button
              key={user.guest_id}
              onClick={() => insertMention(user.name)}
              aria-label={`إشارة إلى ${user.name}`}
              className="px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-full text-xs font-bold border border-primary/20 transition-colors"
            >
              @{user.name}
            </button>
          ))}
        </div>
      )}
      <form
        className="mx-auto flex max-w-4xl items-center gap-2 sm:gap-4"
        onSubmit={onSendMessage}
      >
        {onSendAudio && (
          <VoiceRecorder onSend={onSendAudio} />
        )}
        <div className="relative flex-1 group">
          <Input
            aria-label="نص الرسالة"
            className="h-14 rounded-2xl border-border bg-card px-6 pl-14 text-sm shadow-sm transition-all focus-visible:ring-primary/20 focus-visible:border-primary sm:h-16 sm:text-base text-foreground placeholder:text-muted-foreground/50"
            disabled={disabled}
            maxLength={1000}
            onChange={(event) => onMessageChange(event.target.value)}
            placeholder="اكتب رسالتك هنا..."
            value={messageText}
          />
          <div className="absolute left-1.5 top-1.5 flex gap-1 sm:left-2 sm:top-1.5">
            <EmojiPicker onSelect={(emoji) => onMessageChange(messageText + emoji)} />
            <Button
              className="h-11 w-11 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all sm:h-13 sm:w-13"
              disabled={disabled || !messageText.trim()}
              type="submit"
              size="icon"
            >
              <Send size={18} className="sm:size-5" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
