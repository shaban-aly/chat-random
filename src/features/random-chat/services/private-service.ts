import { supabase } from "@/lib/supabase";
import { PrivateMessage, PrivateConversation, Profile } from "../types";

export const privateService = {
  async getMessages(guestId: string, peerId: string, limit: number = 50): Promise<PrivateMessage[]> {
    const { data, error } = await supabase
      .from("private_messages")
      .select("*")
      .or(`and(sender_id.eq.${guestId},receiver_id.eq.${peerId}),and(sender_id.eq.${peerId},receiver_id.eq.${guestId})`)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error loading private messages:", error);
      return [];
    }

    return (data || []).reverse() as PrivateMessage[];
  },

  async sendMessage(senderId: string, receiverId: string, body: string, messageType: "text" | "audio" = "text", mediaUrl?: string) {
    const { error } = await supabase.from("private_messages").insert({
      sender_id: senderId,
      receiver_id: receiverId,
      body,
      message_type: messageType,
      media_url: mediaUrl,
      is_read: false,
    });

    if (error) {
      console.error("Error sending private message:", error);
      throw error;
    }
  },

  async getConversations(guestId: string): Promise<PrivateConversation[]> {
    // This is a complex query to get unique peers and unread counts
    // For simplicity, we'll fetch messages where the user is either sender or receiver
    const { data, error } = await supabase
      .from("private_messages")
      .select("*, profiles!private_messages_sender_id_fkey(*)")
      .or(`sender_id.eq.${guestId},receiver_id.eq.${guestId}`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching conversations:", error);
      return [];
    }

    const conversationsMap = new Map<string, PrivateConversation>();

    data.forEach((msg) => {
      const peerId = msg.sender_id === guestId ? msg.receiver_id : msg.sender_id;
      if (!conversationsMap.has(peerId)) {
        conversationsMap.set(peerId, {
          peerId,
          lastMessage: msg as PrivateMessage,
          unreadCount: 0,
        });
      }

      if (msg.receiver_id === guestId && !msg.is_read) {
        const conv = conversationsMap.get(peerId);
        if (conv) conv.unreadCount++;
      }
    });

    // We also need profiles for the peers
    const peerIds = Array.from(conversationsMap.keys());
    const { data: profiles, error: pError } = await supabase
      .from("profiles")
      .select("*")
      .in("guest_id", peerIds);

    if (!pError && profiles) {
      profiles.forEach(p => {
        const conv = conversationsMap.get(p.guest_id);
        if (conv) {
          conv.peer = p as Profile;
        }
      });
    }

    return Array.from(conversationsMap.values());
  },

  async markMessagesAsRead(peerId: string, guestId: string) {
    const { error } = await supabase
      .from("private_messages")
      .update({ is_read: true })
      .eq("sender_id", peerId)
      .eq("receiver_id", guestId)
      .eq("is_read", false);

    if (error) {
      console.error("Error marking messages as read:", error);
    }
  },
};
