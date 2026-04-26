"use client";

import { useState } from "react";
import { useRandomChat } from "@/features/random-chat/use-random-chat";
import { PrivateConversationsScreen } from "@/features/random-chat/screens/private-conversations-screen";
import { PrivateChatScreen } from "@/features/random-chat/screens/private-chat-screen";
import { usePrivateMessages } from "@/features/random-chat/hooks/use-private-messages";
import { useRouter } from "next/navigation";

export default function MessagesPage() {
  const chat = useRandomChat();
  const router = useRouter();
  const [selectedPeerId, setSelectedPeerId] = useState<string | null>(null);

  const privateChat = usePrivateMessages(chat.guestId, selectedPeerId);

  if (selectedPeerId) {
    if (!privateChat.peerProfile) {
      return (
        <div className="flex flex-1 items-center justify-center h-full bg-background">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    return (
      <PrivateChatScreen
        guestId={chat.guestId}
        peer={privateChat.peerProfile}
        messages={privateChat.messages}
        messageText={privateChat.messageText}
        onMessageChange={privateChat.setMessageText}
        onSendMessage={(e) => {
          e.preventDefault();
          privateChat.sendMessage(privateChat.messageText);
        }}
        onSendAudio={privateChat.sendAudioMessage}
        onClose={() => setSelectedPeerId(null)}
      />
    );
  }

  return (
    <PrivateConversationsScreen
      guestId={chat.guestId}
      onSelectConversation={(id) => setSelectedPeerId(id)}
      onBack={() => router.push("/")}
    />
  );
}
