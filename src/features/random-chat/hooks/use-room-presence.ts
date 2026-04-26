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

    const channel = supabase.channel(`room:${roomId}`);
    const globalChannel = supabase.channel("global-presence");

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const users: Profile[] = [];
        
        for (const id in state) {
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

    globalChannel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await globalChannel.track({ ...profile, roomId });
      }
    });

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(globalChannel);
    };
  }, [roomId, profile]);

  return { onlineUsers };
}
