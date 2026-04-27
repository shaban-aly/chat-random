import { useCallback, useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";
import { RoomMessage } from "../types";
import { roomService } from "../services/room-service";
import { mediaService } from "../services/media-service";

export function useRoomMessages(roomId: string | null, guestId: string) {
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [messageText, setMessageText] = useState("");
  const [notice, setNotice] = useState("");
  const [typingUsers, setTypingUsers] = useState<Record<string, string>>({}); // { guestId: name }
  const [hasMore, setHasMore] = useState(true);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const loadMessages = useCallback(async (id: string, offset = 0) => {
    const data = await roomService.getMessages(id, 50, offset);
    
    // Sort ascending for UI (oldest to newest)
    const sorted = [...data].reverse();

    if (offset === 0) {
      setMessages(sorted);
    } else {
      setMessages((prev) => [...sorted, ...prev]);
    }

    if (data.length < 50) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!roomId || !hasMore) return;
    await loadMessages(roomId, messages.length);
  }, [roomId, hasMore, messages.length, loadMessages]);

  const sendMessage = useCallback(
    async (text: string) => {
      const body = text.trim();
      if (!body || !roomId) return;

      setMessageText("");

      try {
        await roomService.sendMessage(roomId, guestId, body);
      } catch {
        setMessageText(body);
        setNotice("لم يتم إرسال الرسالة. حاول مرة أخرى.");
      }
    },
    [roomId, guestId]
  );

  const sendAudioMessage = useCallback(
    async (blob: Blob) => {
      if (!roomId) return;
      try {
        const url = await mediaService.uploadAudio(blob, `room_${roomId}`);
        if (url) {
          await roomService.sendMessage(roomId, guestId, "رسالة صوتية", "audio", url);
        }
      } catch {
        setNotice("فشل إرسال الرسالة الصوتية.");
      }
    },
    [roomId, guestId]
  );

  const sendTyping = useCallback(
    (isTyping: boolean, name?: string) => {
      if (channelRef.current && roomId && name) {
        channelRef.current.send({
          type: "broadcast",
          event: "typing",
          payload: { guestId, name, isTyping },
        });
      }
    },
    [roomId, guestId]
  );

  useEffect(() => {
    if (!roomId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMessages([]);
      setHasMore(true);
      return;
    }

    loadMessages(roomId);

    const messageChannel = supabase
      .channel(`room_messages:${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "room_messages",
          filter: `room_id=eq.${roomId}`,
        },
        async (payload) => {
          // Fetch the profile for the new message
          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("guest_id", payload.new.sender_id)
            .single();

          const nextMessage = { ...payload.new, profiles: profileData } as RoomMessage;

          setMessages((current) => {
            if (current.some((m) => m.id === nextMessage.id)) return current;
            return [...current, nextMessage];
          });
        }
      )
      .on("broadcast", { event: "typing" }, ({ payload }) => {
        setTypingUsers((current) => {
          const next = { ...current };
          if (payload.isTyping) {
            next[payload.guestId] = payload.name;
          } else {
            delete next[payload.guestId];
          }
          return next;
        });
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          channelRef.current = messageChannel;
        }
      });

    return () => {
      supabase.removeChannel(messageChannel);
    };
  }, [roomId, loadMessages]);

  return {
    messages,
    messageText,
    setMessageText,
    sendMessage,
    sendTyping,
    sendAudioMessage,
    notice,
    setNotice,
    typingUsers,
    loadMore,
    hasMore,
  };
}
