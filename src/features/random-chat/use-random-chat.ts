"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { ChatStatus } from "./types";
import { useChatMatchmaking } from "./hooks/use-chat-matchmaking";
import { useChatMessages } from "./hooks/use-chat-messages";
import { useChatSession } from "./hooks/use-chat-session";
import { chatService } from "./services/chat-service";

const guestStorageKey = "random-chat-guest-id";

const makeGuestId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export function useRandomChat() {
  const [guestId, setGuestId] = useState("");
  const [status, setStatus] = useState<ChatStatus>("idle");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  const {
    messages,
    messageText,
    setMessageText,
    sendMessage,
    sendAudioMessage,
    loadMessages,
    setMessages,
    isGuestTyping,
    sendTyping,
  } = useChatMessages(guestId, conversationId, status, setNotice);

  const { startSearch, cancelSearch } = useChatMatchmaking(
    guestId,
    setStatus,
    setConversationId,
    setNotice,
    loadMessages,
  );

  const { endChat } = useChatSession(
    conversationId,
    setStatus,
    setNotice,
    setMessages,
  );

  const statusLabel = useMemo(() => {
    if (status === "searching") return "جاري البحث عن شخص متاح";
    if (status === "chatting") return "متصل الآن";
    if (status === "ended") return "انتهت المحادثة";
    return "جاهز للبدء";
  }, [status]);

  useEffect(() => {
    const storedGuestId = localStorage.getItem(guestStorageKey);
    const nextGuestId = storedGuestId || makeGuestId();
    localStorage.setItem(guestStorageKey, nextGuestId);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGuestId(nextGuestId);

    // On reload, check if there's an active conversation for this guest
    const checkActiveConversation = async (id: string) => {
      const data = await chatService.findActiveConversation(id);

      if (data && data.id) {
        setConversationId(data.id);
        setStatus("chatting");
      }
    };

    checkActiveConversation(nextGuestId);
  }, [setConversationId, setStatus]);

  const handleSendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(messageText);
    sendTyping(false);
  };

  const handleMessageChange = (text: string) => {
    setMessageText(text);
    sendTyping(text.length > 0);
  };

  return {
    cancelSearch,
    endChat,
    guestId,
    messageText,
    messages,
    notice,
    sendMessage: handleSendMessage,
    sendAudioMessage,
    setMessageText: handleMessageChange,
    startChat: startSearch,
    status,
    statusLabel,
    isGuestTyping,
    setStatus,
  };
}
