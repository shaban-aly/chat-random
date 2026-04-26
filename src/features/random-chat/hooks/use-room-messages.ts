import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { RoomMessage } from "../types";
import { roomService } from "../services/room-service";
import { mediaService } from "../services/media-service";

export function useRoomMessages(roomId: string | null, guestId: string) {
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [messageText, setMessageText] = useState("");
  const [notice, setNotice] = useState("");

  const loadMessages = useCallback(async (id: string) => {
    const data = await roomService.getMessages(id);
    setMessages(data);
  }, []);

  const sendMessage = useCallback(
    async (text: string, type: "text" | "system" = "text") => {
      const body = text.trim();
      if (!body || !roomId) return;

      if (type === "text") setMessageText("");

      try {
        await roomService.sendMessage(roomId, guestId, body, type);
      } catch {
        if (type === "text") setMessageText(body);
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

  useEffect(() => {
    if (!roomId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMessages([]);
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
      .subscribe();

    return () => {
      supabase.removeChannel(messageChannel);
    };
  }, [roomId, loadMessages]);

  return {
    messages,
    messageText,
    setMessageText,
    sendMessage,
    sendAudioMessage,
    notice,
    setNotice,
  };
}
