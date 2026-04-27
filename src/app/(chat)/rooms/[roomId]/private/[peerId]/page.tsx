"use client";

import { useRandomChat } from "@/features/random-chat/use-random-chat";
import { useRooms } from "@/features/random-chat/hooks/use-rooms";
import { PrivateChatScreen } from "@/features/random-chat/screens/private-chat-screen";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Profile } from "@/features/random-chat/types";

export default function RoomPrivateChatPage() {
  const params = useParams();
  const peerId = params?.peerId as string;
  const { guestId } = useRandomChat();
  const rooms = useRooms(guestId);
  const [fetchedPeer, setFetchedPeer] = useState<Profile | null>(null);

  useEffect(() => {
    if (!rooms.selectedPeer && peerId) {
      const fetchPeer = async () => {
        const { data } = await supabase.from("profiles").select("*").eq("guest_id", peerId).single();
        if (data) setFetchedPeer(data);
      };
      fetchPeer();
    }
  }, [rooms.selectedPeer, peerId]);

  const activePeer = rooms.selectedPeer || fetchedPeer;

  if (activePeer) {
    return (
      <PrivateChatScreen
        guestId={guestId}
        peer={activePeer}
        messages={rooms.privateMessages}
        messageText={rooms.privateMessageText}
        onMessageChange={rooms.setPrivateMessageText}
        onSendMessage={rooms.handleSendPrivateMessage}
        onSendAudio={rooms.sendPrivateAudio}
        onClose={rooms.closePrivateChat}
        isPeerTyping={rooms.isPrivateTyping}
      />
    );
  }

  return (
    <div className="flex h-full items-center justify-center">
      <div className="animate-pulse text-muted-foreground font-bold">جاري تحميل المحادثة الخاصة...</div>
    </div>
  );
}
