import { useCallback, useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { PrivateMessage, Profile } from "../types";
import { privateService } from "../services/private-service";
import { profileService } from "../services/profile-service";
import { mediaService } from "../services/media-service";

export function usePrivateMessages(guestId: string, peerId: string | null) {
  const [messages, setMessages] = useState<PrivateMessage[]>([]);
  const [messageText, setMessageText] = useState("");
  const [peerProfile, setPeerProfile] = useState<Profile | null>(null);
  const prevMessagesLength = useRef(0);

  // Play sound when receiving a new message from the other person
  useEffect(() => {
    if (messages.length > prevMessagesLength.current && prevMessagesLength.current > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.sender_id === peerId) {
        try {
          const audio = new Audio("/sounds/notification.mp3");
          audio.play().catch(() => {});
        } catch { /* ignore */ }
      }
    }
    prevMessagesLength.current = messages.length;
  }, [messages, peerId]);

  // Fetch peer profile
  useEffect(() => {
    if (!peerId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPeerProfile(null);
      return;
    }

    const fetchPeer = async () => {
      const data = await profileService.getProfile(peerId);
      if (data) setPeerProfile(data);
    };

    fetchPeer();
  }, [peerId]);

  const loadMessages = useCallback(async (peer: string) => {
    const data = await privateService.getMessages(guestId, peer);
    setMessages(data);
    await privateService.markMessagesAsRead(peer, guestId);
  }, [guestId]);

  const sendMessage = useCallback(
    async (text: string) => {
      const body = text.trim();
      if (!body || !peerId) return;

      setMessageText("");

      try {
        await privateService.sendMessage(guestId, peerId, body);
      } catch {
        setMessageText(body);
      }
    },
    [guestId, peerId]
  );

  const sendAudioMessage = useCallback(
    async (blob: Blob) => {
      if (!peerId) return;
      try {
        const url = await mediaService.uploadAudio(blob, `private_${guestId}_${peerId}`);
        if (url) {
          await privateService.sendMessage(guestId, peerId, "رسالة صوتية", "audio", url);
        }
      } catch {
        console.error("Failed to send private audio message");
      }
    },
    [guestId, peerId]
  );

  useEffect(() => {
    if (!peerId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMessages([]);
      return;
    }

    loadMessages(peerId);

    const channelId = `private_messages:${Math.min(guestId.localeCompare(peerId), 0) ? guestId : peerId}_${Math.max(guestId.localeCompare(peerId), 0) ? guestId : peerId}`;
    
    // We listen to all private messages for this user to be safe, then filter locally
    const messageChannel = supabase
      .channel(channelId)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "private_messages",
          filter: `receiver_id=eq.${guestId}`,
        },
        async (payload) => {
          const newMsg = payload.new as PrivateMessage;
          if (newMsg.sender_id === peerId) {
            setMessages((current) => {
              if (current.some((m) => m.id === newMsg.id)) return current;
              return [...current, newMsg];
            });
            await privateService.markMessagesAsRead(peerId, guestId);
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "private_messages",
          filter: `sender_id=eq.${guestId}`,
        },
        (payload) => {
          const newMsg = payload.new as PrivateMessage;
          if (newMsg.receiver_id === peerId) {
            setMessages((current) => {
              if (current.some((m) => m.id === newMsg.id)) return current;
              return [...current, newMsg];
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messageChannel);
    };
  }, [guestId, peerId, loadMessages]);

  return {
    messages,
    messageText,
    setMessageText,
    sendMessage,
    sendAudioMessage,
    peerProfile,
  };
}
