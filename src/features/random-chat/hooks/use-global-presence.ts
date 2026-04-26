"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type RoomCounts = Record<string, number>;

export function useGlobalPresence(guestId: string) {
  const [roomCounts, setRoomCounts] = useState<RoomCounts>({});

  useEffect(() => {
    if (!guestId) return;

    // A global channel where every active user tracks themselves
    // with their current roomId
    const channel = supabase.channel("global-presence");

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const counts: RoomCounts = {};

        for (const id in state) {
          const presences = state[id];
          if (presences && presences.length > 0) {
            const { roomId } = presences[0] as { roomId?: string };
            if (roomId) {
              counts[roomId] = (counts[roomId] || 0) + 1;
            }
          }
        }
        setRoomCounts(counts);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [guestId]);

  return { roomCounts };
}
