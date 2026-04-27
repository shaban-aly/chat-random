import { supabase } from "@/lib/supabase";
import { RoomMessage } from "../types";

export const roomService = {
  async getMessages(roomId: string, limit: number = 50, offset: number = 0): Promise<RoomMessage[]> {
    const { data, error } = await supabase
      .from("room_messages")
      .select(`
        *,
        profiles:sender_id (*)
      `)
      .eq("room_id", roomId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Error loading room messages:", error);
      return [];
    }

    // Keep it descending for pagination logic in UI or reverse if needed
    return (data || []) as RoomMessage[];
  },

  async sendMessage(roomId: string, senderId: string, body: string, messageType: "text" | "audio" = "text", mediaUrl?: string) {
    const { error } = await supabase.from("room_messages").insert({
      room_id: roomId,
      sender_id: senderId,
      body,
      message_type: messageType,
      media_url: mediaUrl,
    });

    if (error) {
      console.error("Error sending room message:", error);
      throw error;
    }
  },
};
