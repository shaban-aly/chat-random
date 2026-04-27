"use client";

import { useEffect, useState } from "react";
import { useRandomChat } from "@/features/random-chat/use-random-chat";
import { HomeScreen } from "@/features/random-chat/screens/home-screen";
import { SearchingScreen } from "@/features/random-chat/screens/searching-screen";
import { ChatScreen } from "@/features/random-chat/screens/chat-screen";
import { PrivateConversationsScreen } from "@/features/random-chat/screens/private-conversations-screen";
import { PrivateChatScreen } from "@/features/random-chat/screens/private-chat-screen";
import { usePrivateMessages } from "@/features/random-chat/hooks/use-private-messages";

export default function RandomChatPage() {
  const chat = useRandomChat();
  const [selectedPeerId, setSelectedPeerId] = useState<string | null>(null);
  const [searchCount, setSearchCount] = useState(0);

  const privateChat = usePrivateMessages(chat.guestId, selectedPeerId);

  useEffect(() => {
    if (chat.status === "searching") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSearchCount((c) => c + 1);
    }
  }, [chat.status]);

  const screen = {
    idle: (
      <HomeScreen 
        onStart={chat.startChat} 
        guestId={chat.guestId} 
        onOpenConversations={() => chat.setStatus("conversations")}
      />
    ),
    ended: (
      <HomeScreen 
        onStart={chat.startChat} 
        guestId={chat.guestId} 
        isEnded 
        onOpenConversations={() => chat.setStatus("conversations")}
      />
    ),
    searching: <SearchingScreen onCancel={chat.cancelSearch} searchCount={searchCount} />,
    chatting: (
      <ChatScreen
        guestId={chat.guestId}
        messages={chat.messages}
        messageText={chat.messageText}
        notice={chat.notice}
        isGuestTyping={chat.isGuestTyping}
        onMessageChange={chat.setMessageText}
        onSendMessage={chat.sendMessage}
        onSendAudio={chat.sendAudioMessage}
        onEndChat={chat.endChat}
        peerId={chat.peerId || undefined}
      />
    ),
    conversations: selectedPeerId ? (
      !privateChat.peerProfile ? (
        <div className="flex flex-1 items-center justify-center h-full bg-background">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
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
    )) : (
      <PrivateConversationsScreen
        guestId={chat.guestId}
        onSelectConversation={(id) => setSelectedPeerId(id)}
        onBack={() => chat.setStatus("idle")}
      />
    ),
  }[chat.status];

  return screen;
}
