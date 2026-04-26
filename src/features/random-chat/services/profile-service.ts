import { supabase } from "@/lib/supabase";
import { Profile } from "../types";

export const profileService = {
  async getProfile(guestId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("guest_id", guestId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
    return data as Profile;
  },

  async upsertProfile(profile: Profile): Promise<Profile | null> {
    const { data, error } = await supabase
      .from("profiles")
      .upsert(profile, { onConflict: "guest_id" })
      .select()
      .single();

    if (error) {
      console.error("Error upserting profile:", error);
      return null;
    }
    return data as Profile;
  },
};
