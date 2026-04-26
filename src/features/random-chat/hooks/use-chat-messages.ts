import { useCallback, useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { ChatStatus, Message } from "../types";
import { chatService } from "../services/chat-service";
import { mediaService } from "../services/media-service";

export function useChatMessages(
  guestId: string,
  conversationId: string | null,
  status: ChatStatus,
  setNotice: (notice: string) => void
) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [isGuestTyping, setIsGuestTyping] = useState(false);
  const prevMessagesLength = useRef(0);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Play sound when receiving a new message from the other person
  useEffect(() => {
    if (messages.length > prevMessagesLength.current && prevMessagesLength.current > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.sender_id !== guestId) {
        try {
          const audio = new Audio("/sounds/notification.mp3");
          audio.play().catch(() => {
            // Ignore errors (like browser autoplay policy blocking)
          });
        } catch {
          // Ignore audio creation errors
        }
      }
    }
    prevMessagesLength.current = messages.length;
  }, [messages, guestId]);

  const loadMessages = useCallback(async (id: string) => {
    const data = await chatService.loadMessages(id);
    setMessages(data);
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const body = text.trim();
      if (!body || !conversationId || status !== "chatting") return;

      setMessageText("");

      try {
        await chatService.sendMessage(conversationId, guestId, body);
      } catch {
        setMessageText(body);
        setNotice("لم يتم إرسال الرسالة. حاول مرة أخرى.");
      }
    },
    [conversationId, guestId, status, setNotice]
  );

  const sendAudioMessage = useCallback(
    async (blob: Blob) => {
      if (!conversationId || status !== "chatting") return;
      try {
        const url = await mediaService.uploadAudio(blob, `chat_${conversationId}`);
        if (url) {
          await chatService.sendMessage(conversationId, guestId, "رسالة صوتية", "audio", url);
        }
      } catch {
        setNotice("فشل إرسال الرسالة الصوتية.");
      }
    },
    [conversationId, guestId, status, setNotice]
  );

  useEffect(() => {
    if (!conversationId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMessages([]);
      return;
    }

    loadMessages(conversationId);

    const messageChannel = supabase
      .channel(`messages:${conversationId}`)
      .on("broadcast", { event: "typing" }, (payload) => {
        if (payload.payload.sender_id !== guestId) {
          setIsGuestTyping(payload.payload.is_typing);
          // Auto-clear typing status after 3 seconds of no updates
          if (payload.payload.is_typing) {
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
              setIsGuestTyping(false);
            }, 3000);
          }
        }
      })
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((current) => {
            const nextMessage = payload.new as Message;
            if (current.some((m) => m.id === nextMessage.id)) return current;
            return [...current, nextMessage];
          });
          // Clear typing indicator when a message is received from the guest
          if (payload.new.sender_id !== guestId) {
            setIsGuestTyping(false);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          }
        },
      )
      .subscribe();

    channelRef.current = messageChannel;

    return () => {
      supabase.removeChannel(messageChannel);
      channelRef.current = null;
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [conversationId, loadMessages, guestId]);

  const sendTyping = useCallback(async (isTyping: boolean) => {
    if (channelRef.current) {
      await channelRef.current.send({
        type: "broadcast",
        event: "typing",
        payload: { sender_id: guestId, is_typing: isTyping },
      });
    }
  }, [guestId]);

  return {
    messages,
    messageText,
    setMessageText,
    sendMessage,
    sendAudioMessage,
    loadMessages,
    setMessages,
    isGuestTyping,
    sendTyping,
  };
}
