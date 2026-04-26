import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Profile } from "../types";

export function useRoomPresence(roomId: string | null, profile: Profile | null) {
  const [onlineUsers, setOnlineUsers] = useState<Profile[]>([]);

  useEffect(() => {
    if (!roomId || !profile) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOnlineUsers([]);
      return;
    }

    const channel = supabase.channel(`room:${roomId}`, {
      config: {
        presence: {
          key: profile.guest_id,
        },
      },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const users: Profile[] = [];
        
        for (const id in state) {
          // Presence state can have multiple presences for the same key if the user has multiple tabs open
          // We take the first one
          if (state[id] && state[id].length > 0) {
            users.push(state[id][0] as unknown as Profile);
          }
        }
        
        setOnlineUsers(users);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track(profile);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, profile]);

  return { onlineUsers };
}
