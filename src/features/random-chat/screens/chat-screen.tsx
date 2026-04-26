"use client";

import { FormEvent } from "react";
import { Message } from "../types";
import { ChatHeader } from "../components/chat-header";
import { MessageList } from "../components/message-list";
import { MessageInput } from "../components/message-input";

interface ChatScreenProps {
  guestId: string;
  messages: Message[];
  messageText: string;
  notice: string;
  onMessageChange: (text: string) => void;
  onSendMessage: (e: FormEvent<HTMLFormElement>) => void;
  onSendAudio?: (blob: Blob) => void;
  onEndChat: () => void;
  isGuestTyping?: boolean;
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
}: ChatScreenProps) {
  return (
    <div className="flex h-full flex-col bg-background overflow-hidden relative screen-enter">
      <ChatHeader statusLabel="متصل الآن" onEndChat={onEndChat} />
      
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
    </div>
  );
}
