import { useCallback, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { ChatStatus, Message } from "../types";
import { chatService } from "../services/chat-service";

export function useChatSession(
  conversationId: string | null,
  setStatus: (status: ChatStatus) => void,
  setNotice: (notice: string) => void,
  setMessages: (messages: Message[]) => void
) {
  const endChat = useCallback(async () => {
    if (!conversationId) return;

    try {
      // Delete the conversation via service
      await chatService.deleteConversation(conversationId);
      
      setMessages([]);
      setStatus("ended");
      setNotice("انتهت المحادثة واختفت الرسائل.");
    } catch {
      // Handle error if needed
    }
  }, [conversationId, setMessages, setStatus, setNotice]);

  useEffect(() => {
    if (!conversationId) return;

    const conversationChannel = supabase
      .channel(`conversation:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "DELETE", // Listen for DELETE event
          schema: "public",
          table: "conversations",
          filter: `id=eq.${conversationId}`,
        },
        () => {
          // If the record is deleted, it means the other user ended the chat
          setStatus("ended");
          setMessages([]);
          setNotice("انتهت المحادثة واختفت الرسائل.");
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(conversationChannel);
    };
  }, [conversationId, setMessages, setStatus, setNotice]);

  return {
    endChat,
  };
}
