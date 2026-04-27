import { supabase } from "@/lib/supabase";
import { Message } from "../types";

export const chatService = {
  async findActiveConversation(guestId: string) {
    const { data, error } = await supabase
      .from("conversations")
      .select("id")
      .eq("status", "active")
      .or(`guest_a.eq.${guestId},guest_b.eq.${guestId}`)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error finding active conversation:", error);
      return null;
    }
    return data;
  },

  async getConversationDetails(conversationId: string) {
    const { data, error } = await supabase
      .from("conversations")
      .select("guest_a, guest_b")
      .eq("id", conversationId)
      .maybeSingle();
      
    if (error) {
      console.error("Error getting conversation details:", error);
      return null;
    }
    return data;
  },

  async loadMessages(conversationId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error loading messages:", error);
      return [];
    }
    return data as Message[];
  },

  async sendMessage(conversationId: string, senderId: string, body: string, messageType: "text" | "audio" = "text", mediaUrl?: string) {
    const { error } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: senderId,
      body,
      message_type: messageType,
      media_url: mediaUrl,
    });

    if (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },

  async endConversation(conversationId: string) {
    const { error } = await supabase
      .from("conversations")
      .update({ status: "ended" })
      .eq("id", conversationId);

    if (error) {
      console.error("Error ending conversation:", error);
      throw error;
    }
  },

  async findWaitingQueue(guestId: string) {
    const { data, error } = await supabase
      .from("waiting_queue")
      .select("guest_id")
      .neq("guest_id", guestId)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error finding waiting queue:", error);
      return null;
    }
    return data;
  },

  async addToWaitingQueue(guestId: string) {
    const { error } = await supabase.from("waiting_queue").insert({ guest_id: guestId });
    if (error) {
      console.error("Error adding to waiting queue:", error);
      throw error;
    }
  },

  async removeFromWaitingQueue(guestId: string) {
    const { error } = await supabase.from("waiting_queue").delete().eq("guest_id", guestId);
    if (error) {
      console.error("Error removing from waiting queue:", error);
      throw error;
    }
  },

  async startRandomChat(guestId: string) {
    const { data, error } = await supabase.rpc("start_random_chat", {
      p_guest_id: guestId,
    });
    if (error) throw error;
    return data?.[0];
  },

  async updateQueueStatus(guestId: string, status: "waiting" | "matched" | "cancelled") {
    const { error } = await supabase
      .from("random_queue")
      .update({ status })
      .eq("guest_id", guestId)
      .eq("status", "waiting");
    if (error) throw error;
  },

  async deleteConversation(conversationId: string) {
    const { error } = await supabase
      .from("conversations")
      .delete()
      .eq("id", conversationId);
    if (error) throw error;
  },

  async getOnlineCount() {
    // Count people in queue + small random number for realism
    const { count, error } = await supabase
      .from("random_queue")
      .select("*", { count: "exact", head: true })
      .eq("status", "waiting");

    if (error) return 0;
    
    // Base count + some active conversations (approximate)
    // We'll multiply by a factor or add a base number to represent total app activity
    const estimatedTotal = (count || 0) * 3 + 42; 
    return estimatedTotal;
  },
};
