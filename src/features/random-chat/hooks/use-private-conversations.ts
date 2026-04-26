"use client";

import { useCallback, useEffect, useState } from "react";
import { privateService } from "../services/private-service";
import { supabase } from "@/lib/supabase";
import { PrivateConversation } from "../types";

export function usePrivateConversations(guestId: string) {
  const [conversations, setConversations] = useState<PrivateConversation[]>([]);
  const [loading, setLoading] = useState(true);

  const loadConversations = useCallback(async (isInitial = false) => {
    if (!guestId) return;
    if (!isInitial) setLoading(true);
    const data = await privateService.getConversations(guestId);
    setConversations(data);
    setLoading(false);
  }, [guestId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadConversations(true);

    if (!guestId) return;

    // Subscribe to all private messages involving this guest
    // Using a unique channel name to avoid conflicts if the hook is used in multiple components
    const channel = supabase
      .channel(`conv-list-${guestId}-${Math.random().toString(36).slice(2, 7)}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "private_messages",
          filter: `receiver_id=eq.${guestId}`,
        },
        () => {
          loadConversations();
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
        () => {
          loadConversations();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "private_messages",
        },
        () => {
          loadConversations();
        } // Refresh on read status update
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [guestId, loadConversations]);

  const totalUnreadCount = conversations.reduce((acc, conv) => acc + (conv.unreadCount || 0), 0);

  return {
    conversations,
    loading,
    totalUnreadCount,
    refresh: loadConversations,
  };
}
