"use client";

import { FormEvent, useEffect, useState } from "react";
import { UnifiedMessage } from "../types";
import { ChatHeader } from "../components/chat-header";
import { MessageList } from "../components/message-list";
import { MessageInput } from "../components/message-input";
import { ReportModal } from "../components/report-modal";

interface ChatScreenProps {
  guestId: string;
  messages: UnifiedMessage[];
  messageText: string;
  notice: string;
  onMessageChange: (text: string) => void;
  onSendMessage: (e: FormEvent<HTMLFormElement>) => void;
  onSendAudio?: (blob: Blob) => void;
  onEndChat: () => void;
  isGuestTyping?: boolean;
  peerId?: string; // We need peerId to report them
}

export function ChatScreen({
  guestId,
  messages,
  messageText,
  notice,
  isGuestTyping = false,
  onMessageChange,
  onSendMessage,
  onSendAudio,
  onEndChat,
  peerId,
}: ChatScreenProps) {
  const [isReportOpen, setIsReportOpen] = useState(false);

  useEffect(() => {
    document.body.classList.add("hide-mobile-nav");
    return () => document.body.classList.remove("hide-mobile-nav");
  }, []);

  return (
    <div className="flex h-full flex-col bg-background overflow-hidden relative screen-enter">
      <ChatHeader 
        statusLabel="متصل الآن" 
        onEndChat={onEndChat} 
        onReport={peerId ? () => setIsReportOpen(true) : undefined}
      />
      
      <MessageList 
        messages={messages} 
        guestId={guestId} 
        notice={notice} 
        isGuestTyping={isGuestTyping}
      />
      
      <MessageInput 
        messageText={messageText}
        onMessageChange={onMessageChange}
        onSendMessage={onSendMessage}
        onSendAudio={onSendAudio}
      />

      {peerId && (
        <ReportModal
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          reporterId={guestId}
          reportedId={peerId}
          reportedName="شخص مجهول"
          onBlock={onEndChat} // End chat immediately if blocked
        />
      )}
    </div>
  );
}
